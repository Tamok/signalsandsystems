// No top-level import for shiki

// Cache the highlighter instance
let highlighterInstance: any = null;

// Initialize the shiki highlighter with common themes and languages
export async function initializeHighlighter() {
  if (!highlighterInstance) {
    const shiki = await import('shiki');
    highlighterInstance = await shiki.createHighlighter({
      themes: ['github-light', 'github-dark'],      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'html',
        'css',
        'json',
        'markdown',
        'astro',
        'bash',
        'yaml',
        'python',
        'xml',
      ],
    });
  }
  return highlighterInstance;
}

/**
 * Highlight code with shiki
 * 
 * @param code - The code to highlight
 * @param lang - The language of the code
 * @param theme - The theme to use for highlighting (default: 'github-light')
 * @returns HTML string with highlighted code
 */
export async function highlightCode(code: string, lang: string, theme: string = 'github-light') {
  const highlighter = await initializeHighlighter();
  if (!highlighter) throw new Error('Shiki highlighter not initialized');
  try {
    return highlighter.codeToHtml(code, { lang, theme });
  } catch (error) {
    console.error(`Error highlighting code: ${error}`);
    // Fallback to plaintext if language is not supported
    return highlighter.codeToHtml(code, { lang: 'plaintext', theme });
  }
}

/**
 * Add copy button to code blocks
 * 
 * @param html - The HTML containing code blocks
 * @returns HTML with copy buttons added to code blocks
 */
export function addCopyButtons(html: string): string {
  // Replace each pre tag with a div containing the pre and a copy button
  return html.replace(
    /<pre(.*?)>([\s\S]*?)<\/pre>/g,
    (match: string, attrs: string, content: string) => {
      return `
        <div class="code-block-wrapper relative group">
          <button class="copy-button absolute top-2 right-2 bg-white dark:bg-gray-800 rounded p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Copy code">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
          <pre${attrs}>${content}</pre>
        </div>
      `;
    }
  );
}
