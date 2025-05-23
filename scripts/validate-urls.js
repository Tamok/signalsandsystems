#!/usr/bin/env node

console.log('Validation script for Astro Content Collections navigation');
console.log('Checking URL formats...');

// Import node filesystem
const fs = require('fs');
const path = require('path');

// Directories to check
const dirsToCheck = [
  'src/pages/devlog',
  'src/pages/series',
  'src/pages',
  'src/layouts',
  'src/components'
];

// Patterns to look for
const patterns = {
  correctArticleLink: /href={\`\/${.*?\.slug}\`}/g,
  incorrectArticleLink: /href={(?!`\/)(.*?\.slug)}/g, // Link that uses article.slug without / prefix
};

const results = {
  files: 0,
  correct: 0,
  potentialIssues: []
};

// Check each directory
dirsToCheck.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(fullPath)) {
    return;
  }
  
  const files = fs.readdirSync(fullPath);
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    
    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }
    
    // Only check .astro files
    if (!filePath.endsWith('.astro')) {
      return;
    }
    
    results.files++;
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for correct pattern
    const correctMatches = content.match(patterns.correctArticleLink) || [];
    results.correct += correctMatches.length;
    
    // Check for potential issues
    const incorrectMatches = content.match(patterns.incorrectArticleLink) || [];
    
    if (incorrectMatches.length > 0) {
      results.potentialIssues.push({
        file: filePath.replace(process.cwd(), ''),
        matches: incorrectMatches
      });
    }
  });
});

console.log('\nChecked Navigation Results:');
console.log(`- Files checked: ${results.files}`);
console.log(`- Correct article links: ${results.correct}`);
console.log(`- Files with potential issues: ${results.potentialIssues.length}`);

if (results.potentialIssues.length > 0) {
  console.log('\nPotential issues found:');
  results.potentialIssues.forEach(issue => {
    console.log(`\nFile: ${issue.file}`);
    console.log(`Matches: ${issue.matches.join(', ')}`);
  });
} else {
  console.log('\nNo issues found! All article links appear to be correctly formatted.');
}

console.log('\nRemember to manually verify navigation by running your site.');
