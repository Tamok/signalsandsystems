const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🚀 Article Citation Validator Started');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to check if URL is accessible
function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const timeout = 5000; // 5 second timeout
    
    const req = protocol.request(url, { method: 'HEAD', timeout, followAllRedirects: false }, (res) => {
      // Only count 200 as accessible, not 301/302/other redirects
      const isAccessible = res.statusCode === 200;
      resolve({
        url,
        accessible: isAccessible,
        status: res.statusCode,
        redirected: res.statusCode >= 300 && res.statusCode < 400,
        location: res.headers.location || null
      });
    });
    
    req.on('error', () => {
      resolve({
        url,
        accessible: false,
        status: 'ERROR',
        error: 'Network error or timeout'
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        accessible: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

// Extract all CitedText components from file content
function extractCitations(content, filePath) {
  const citations = [];
  const citedTextRegex = /<CitedText[^>]*>(.*?)<\/CitedText>/gs;
  
  let match;
  let lineNumber = 1;
  let position = 0;
  
  while ((match = citedTextRegex.exec(content)) !== null) {
    // Calculate line number
    const beforeMatch = content.substring(position, match.index);
    lineNumber += (beforeMatch.match(/\n/g) || []).length;
    position = match.index;
    
    const fullMatch = match[0];
    const citationText = match[1];
    
    // Extract attributes
    const attrs = {};
    const attrRegex = /(\w+)=["']([^"']*?)["']/g;
    let attrMatch;
    
    while ((attrMatch = attrRegex.exec(fullMatch)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    
    citations.push({
      line: lineNumber,
      text: citationText.replace(/\*\*/g, '').trim(),
      citationNumber: attrs.citationNumber || 'N/A',
      url: attrs.url || null,
      title: attrs.title || 'N/A',
      author: attrs.author || 'N/A',
      source: attrs.source || 'N/A',
      year: attrs.year || 'N/A',
      type: attrs.type || 'N/A',
      fullMatch: fullMatch
    });
  }
  
  return citations;
}

// Main validation function
async function validateArticle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ File not found: ${filePath}${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.cyan}🔍 Validating article: ${path.basename(filePath)}${colors.reset}\n`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const citations = extractCitations(content, filePath);
  
  if (citations.length === 0) {
    console.log(`${colors.yellow}⚠️  No CitedText components found in this file${colors.reset}`);
    return;
  }
  
  console.log(`${colors.blue}📊 Found ${citations.length} citations${colors.reset}\n`);
  
  // Separate citations with and without URLs
  const withUrls = citations.filter(c => c.url);
  const withoutUrls = citations.filter(c => !c.url);
  
  console.log(`${colors.green}✅ Citations with URLs: ${withUrls.length}${colors.reset}`);
  console.log(`${colors.red}❌ Citations without URLs: ${withoutUrls.length}${colors.reset}\n`);
  
  // Show citations without URLs (potential fakes)
  if (withoutUrls.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 CITATIONS WITHOUT URLs (Likely Fake):${colors.reset}`);
    console.log('='.repeat(50));
    withoutUrls.forEach(citation => {
      console.log(`${colors.yellow}📍 Line ${citation.line} [${citation.citationNumber}]${colors.reset}`);
      console.log(`   Title: ${citation.title}`);
      console.log(`   Author: ${citation.author}`);
      console.log(`   Source: ${citation.source}`);
      console.log(`   Text: ${citation.text}`);
      console.log();
    });
  }
  
  let accessibleCount = 0;
  let brokenCount = 0;
  
  // Validate URLs
  if (withUrls.length > 0) {
    console.log(`${colors.blue}${colors.bright}🌐 VALIDATING URLs:${colors.reset}`);
    console.log('='.repeat(50));
    
    const urlChecks = await Promise.all(
      withUrls.map(citation => checkUrl(citation.url))
    );
    
    withUrls.forEach((citation, index) => {
      const urlResult = urlChecks[index];
      
      if (urlResult.accessible) {
        accessibleCount++;
        console.log(`${colors.green}✅ [${citation.citationNumber}] ${urlResult.status} - ${citation.title || 'N/A'}${colors.reset}`);
        console.log(`   ${colors.cyan}${urlResult.url}${colors.reset}`);
      } else {
        brokenCount++;
        console.log(`${colors.red}❌ [${citation.citationNumber}] ${urlResult.status} - ${citation.title || 'N/A'}${colors.reset}`);
        console.log(`   ${colors.red}${urlResult.url}${colors.reset}`);
        if (urlResult.error) {
          console.log(`   ${colors.yellow}Error: ${urlResult.error}${colors.reset}`);
        }
      }
      console.log();
    });
    
    // Summary
    console.log('='.repeat(50));
    console.log(`${colors.bright}📈 URL VALIDATION SUMMARY:${colors.reset}`);
    console.log(`${colors.green}✅ Accessible URLs: ${accessibleCount}${colors.reset}`);
    console.log(`${colors.red}❌ Broken URLs: ${brokenCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  URLs without validation: ${withoutUrls.length}${colors.reset}`);
    
    if (brokenCount > 0) {
      console.log(`\n${colors.yellow}💡 Consider updating broken URLs with working alternatives${colors.reset}`);
    }
  }
  
  // Overall assessment
  console.log(`\n${colors.bright}🎯 OVERALL ASSESSMENT:${colors.reset}`);
  const totalIssues = withoutUrls.length + brokenCount;
  
  if (totalIssues === 0) {
    console.log(`${colors.green}🎉 All citations are properly sourced and accessible!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${totalIssues} citation(s) need attention${colors.reset}`);
    if (withoutUrls.length > 0) {
      console.log(`   - ${withoutUrls.length} citation(s) missing URLs`);
    }
    if (brokenCount > 0) {
      console.log(`   - ${brokenCount} citation(s) with broken URLs`);
    }
  }
  
  // Health score
  const totalCitations = citations.length;
  const healthyCitations = totalCitations - totalIssues;
  const healthScore = Math.round((healthyCitations / totalCitations) * 100);
  
  console.log(`\n${colors.bright}📊 Citation Health Score: ${healthScore}%${colors.reset}`);
  
  if (healthScore >= 90) {
    console.log(`${colors.green}🌟 Excellent! Citations are well-sourced.${colors.reset}`);
  } else if (healthScore >= 70) {
    console.log(`${colors.yellow}⚠️  Good, but some citations need attention.${colors.reset}`);
  } else {
    console.log(`${colors.red}🚨 Poor citation health. Many citations need updating.${colors.reset}`);
  }
  
  console.log('\n' + '='.repeat(50));
}

// CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log(`${colors.cyan}Usage: node validate-article.cjs <path-to-article.mdx>${colors.reset}`);
    console.log(`${colors.yellow}Example: node validate-article.cjs src/content/geo/1-what-is-geo-and-why-higher-ed-needs-it-now.mdx${colors.reset}`);
    process.exit(1);
  }
  
  validateArticle(filePath).catch(console.error);
}

module.exports = { validateArticle, extractCitations, checkUrl };
