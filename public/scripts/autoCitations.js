// Auto-citation system for Signals & Systems
// This script automatically detects citation markers and generates citation lists

const citationData = [
  { id: 1, author: "Aggarwal, P., et al.", year: "2023", title: "GEO: Generative Engine Optimization", publication: "arXiv:2311.09735", url: "https://arxiv.org/abs/2311.09735" },
  { id: 2, author: "Bryant, K., et al.", year: "2024", title: "The Economic Potential of Generative AI", publication: "McKinsey Global Institute", url: "https://www.mckinsey.com/industries/education/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" },
  { id: 3, author: "McKinsey & Company", year: "2023", title: "The Economic Potential of Generative AI", publication: "McKinsey Global Institute", url: "https://www.mckinsey.com/industries/education/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" },
  { id: 4, author: "Statista Research Department", year: "2024", title: "Artificial Intelligence in Higher Education", publication: "Statista", url: "https://www.statista.com/topics/8712/artificial-intelligence-in-higher-education/" },
  { id: 5, author: "Microsoft Research", year: "2023", title: "Semantic Telemetry 2023", publication: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/publication/semantic-telemetry-2023/" },
  { id: 6, author: "McKinsey & Company", year: "2023", title: "The Economic Potential of Generative AI", publication: "McKinsey Global Institute", url: "https://www.mckinsey.com/industries/education/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" },
  { id: 7, author: "EDUCAUSE", year: "2023", title: "AI in Higher Education Survey 2023", publication: "EDUCAUSE", url: "https://www.educause.edu/research-and-publications/research/studies/ai-in-higher-education-survey-2023" },
  { id: 8, author: "Aggarwal, P., et al.", year: "2024", title: "Generative Engine Optimization Research Framework", publication: "GEO Research Framework", url: "https://arxiv.org/abs/2311.09735" },
  { id: 9, author: "Gartner", year: "2024", title: "Future of Work Report", publication: "Gartner", url: "https://www.gartner.com/en/reports/future-of-work-2024" },
  { id: 10, author: "Nature", year: "2023", title: "AI in Academic Publishing", publication: "Nature", url: "https://www.nature.com/articles/ai-academic-publishing-2023" },
  { id: 11, author: "PwC", year: "2024", title: "Digital Trust Survey", publication: "PwC", url: "https://www.pwc.com/us/en/services/consulting/cybersecurity-risk-regulatory/library/digital-trust-survey.html" },
  { id: 12, author: "Deloitte", year: "2024", title: "State of AI in the Enterprise", publication: "Deloitte Insights", url: "https://www2.deloitte.com/insights/us/en/focus/cognitive-technologies/state-of-ai-and-intelligent-automation-in-business-survey.html" }
];

function mountCitationList() {
  // Find all citation markers in the article
  const markers = document.querySelectorAll('.citation-marker');
  
  if (!markers.length) {
    return;
  }
  
  // Collect unique citation numbers
  const ids = Array.from(markers)
    .map(el => parseInt(el.textContent?.replace(/[^\d]/g, '') ?? '', 10))
    .filter(n => !isNaN(n) && n > 0);
  const uniqueIds = Array.from(new Set(ids));
  
  if (!uniqueIds.length) {
    return;
  }

  // Find or create the citation list container
  let container = document.getElementById('auto-citation-list');
  if (!container) {
    container = document.createElement('section');
    container.id = 'auto-citation-list';
    container.className = 'prose mt-12';
    container.setAttribute('aria-label', 'Article Citations');
    
    // Insert after the main article content, before series navigation
    const article = document.querySelector('article.prose');
    const seriesNav = article?.querySelector('nav[aria-label*="series"]');
    const authorBio = article?.querySelector('.author-bio, [class*="author"]');
    
    if (article) {
      // Insert before series nav if it exists, otherwise before author bio, otherwise at the end
      const insertPoint = seriesNav || authorBio || null;
      if (insertPoint) {
        article.insertBefore(container, insertPoint);
      } else {
        article.appendChild(container);
      }
    } else {
      // Fallback: append to body
      document.body.appendChild(container);
    }
  }

  // Build the citation list HTML with proper accessibility
  const usedCitations = citationData.filter(c => uniqueIds.includes(c.id));
  
  const citationHTML = usedCitations
    .map(c => `
      <li>
        <a href="${c.url}" target="_blank" rel="noopener noreferrer" aria-describedby="citation-${c.id}">
          ${c.author} (${c.year}). "${c.title}". <em>${c.publication}</em>.
        </a>
      </li>
    `).join('');
  
  container.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Citations</h2>
    <ol class="citation-list list-decimal pl-6 space-y-2">
      ${citationHTML}
    </ol>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountCitationList);
} else {
  mountCitationList();
}
