globalThis.process ??= {}; globalThis.process.env ??= {};
import { d } from './marked.esm_BXPw9py-.mjs';

/**
 * Parse markdown to HTML
 * @param {string} markdown - Raw markdown text
 * @returns {string} HTML string
 */
function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  // Configure marked options
  d.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    headerIds: false, // Don't add IDs to headers
    mangle: false // Don't escape email addresses
  });
  
  return d.parse(markdown);
}

export { parseMarkdown as p };
