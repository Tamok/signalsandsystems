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
      globalTooltip.innerHTML = tooltipContent;
      globalTooltip.style.display = 'block';
      globalTooltip.style.position = 'fixed';
      globalTooltip.style.zIndex = 9999;
      globalTooltip.style.background = 'rgba(30,30,30,0.97)';
      globalTooltip.style.color = '#fff';
      globalTooltip.style.padding = '0.5em 1em';
      globalTooltip.style.borderRadius = '6px';
      globalTooltip.style.fontSize = '0.95em';
      globalTooltip.style.pointerEvents = 'none';
      globalTooltip.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
      globalTooltip.style.maxWidth = '320px';
      globalTooltip.style.whiteSpace = 'pre-line';
      function moveTooltip(e) {
        const margin = 16;
        let x = e.clientX + margin;
        let y = e.clientY + margin;
        const tooltipRect = globalTooltip.getBoundingClientRect();
        if (x + tooltipRect.width > window.innerWidth) {
          x = e.clientX - tooltipRect.width - margin;
        }
        if (y + tooltipRect.height > window.innerHeight) {
          y = e.clientY - tooltipRect.height - margin;
        }
        globalTooltip.style.left = x + 'px';
        globalTooltip.style.top = y + 'px';
      }
      moveTooltip({ clientX: element.getBoundingClientRect().left, clientY: element.getBoundingClientRect().bottom });
      element.addEventListener('mousemove', moveTooltip);
      element._moveTooltip = moveTooltip;
    });
    element.addEventListener('mouseleave', function () {
      let globalTooltip = document.getElementById('global-citation-tooltip');
      if (globalTooltip) {
        globalTooltip.style.display = 'none';
      }
      if (element._moveTooltip) {
        element.removeEventListener('mousemove', element._moveTooltip);
        delete element._moveTooltip;
      }
    });
    if (url) {
      element.addEventListener('click', function (e) {
        window.open(url, '_blank', 'noopener');
      });
      element.style.cursor = 'pointer';
    }
  });
}

export default attachCitationListeners;

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', attachCitationListeners);
}
