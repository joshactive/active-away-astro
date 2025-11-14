import { marked } from 'marked';

/**
 * Parse markdown to HTML
 * @param {string} markdown - Raw markdown text
 * @returns {string} HTML string
 */
export function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  // Configure marked options
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    headerIds: false, // Don't add IDs to headers
    mangle: false // Don't escape email addresses
  });
  
  return marked.parse(markdown);
}

