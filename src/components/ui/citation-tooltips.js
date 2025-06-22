// citation-tooltips.js
// This script attaches tooltips and click handlers to .cited-text elements for citations.

const DEBUG = import.meta.env && import.meta.env.DEV;
if (DEBUG) console.log('[CITATION TOOLTIP] Script loaded');

function attachCitationListeners() {
  const citedElements = document.querySelectorAll('.cited-text');
  if (DEBUG) console.log(`[CITATION TOOLTIP] Attaching listeners to ${citedElements.length} .cited-text elements`);
  citedElements.forEach(element => {
    if (element._citationTooltipListenersAttached) return;
    element._citationTooltipListenersAttached = true;
    const citationNumber = element.getAttribute('data-citation-number');
    const source = element.getAttribute('data-source');
    const url = element.getAttribute('data-url');
    const author = element.getAttribute('data-author');
    const year = element.getAttribute('data-year');
    const title = element.getAttribute('data-title');
    const publication = element.getAttribute('data-publication');
    let tooltipLines = [];
    if (citationNumber) tooltipLines.push(`Citation [${citationNumber}]`);
    if (author && year) tooltipLines.push(`${author} (${year})`);
    else if (author) tooltipLines.push(`${author}`);
    else if (year) tooltipLines.push(`(${year})`);
    if (title) tooltipLines.push(`<em>${title}</em>`);
    if (publication) tooltipLines.push(publication);
    else if (source && source !== author) tooltipLines.push(source);
    if (url) {
      tooltipLines.push('');
      tooltipLines.push('🔗 Click to view source');
    }
    const tooltipContent = tooltipLines.join('\n');
    let hoverTimeout;
    let hideTimeout;
    element.addEventListener('mouseenter', function () {
      if (DEBUG) console.log(`[CITATION TOOLTIP] mouseenter on citation #${citationNumber}`);
      let globalTooltip = document.getElementById('global-citation-tooltip');
      if (!globalTooltip) {
        globalTooltip = document.createElement('div');
        globalTooltip.id = 'global-citation-tooltip';
        document.body.appendChild(globalTooltip);
      }
      clearTimeout(hoverTimeout);
      clearTimeout(hideTimeout);
      hoverTimeout = setTimeout(function () {
        globalTooltip.innerHTML = tooltipContent.replace(/\n/g, '<br>');
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 80;
        let left = rect.left + rect.width / 2;
        const rightEdge = left + tooltipWidth / 2;
        const leftEdge = left - tooltipWidth / 2;
        if (rightEdge > window.innerWidth - 20) {
          left = window.innerWidth - tooltipWidth / 2 - 20;
        } else if (leftEdge < 20) {
          left = tooltipWidth / 2 + 20;
        }
        let top = rect.top - 10;
        if (top - tooltipHeight < 20) {
          top = rect.bottom + 10;
          globalTooltip.style.transform = 'translateX(-50%) scale(1)';
        } else {
          globalTooltip.style.transform = 'translateX(-50%) translateY(-100%) scale(1)';
        }
        globalTooltip.style.position = 'fixed';
        globalTooltip.style.left = left + 'px';
        globalTooltip.style.top = top + 'px';
        globalTooltip.classList.add('visible');
      }, 200);
    });
    element.addEventListener('mouseleave', function () {
      if (DEBUG) console.log(`[CITATION TOOLTIP] mouseleave on citation #${citationNumber}`);
      let globalTooltip = document.getElementById('global-citation-tooltip');
      clearTimeout(hoverTimeout);
      hideTimeout = setTimeout(function () {
        if (globalTooltip) globalTooltip.classList.remove('visible');
      }, 100);
    });
    if (url) {
      element.classList.add('clickable');
      element.addEventListener('click', function (e) {
        if (DEBUG) console.log(`[CITATION TOOLTIP] click on citation #${citationNumber} (url: ${url})`);
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  });
}

function observeCitations() {
  attachCitationListeners();
  const observer = new MutationObserver((mutations) => {
    let found = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
        found = true;
        break;
      }
    }
    if (found) {
      attachCitationListeners();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export default function runCitationTooltips() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeCitations);
  } else {
    observeCitations();
  }
}
