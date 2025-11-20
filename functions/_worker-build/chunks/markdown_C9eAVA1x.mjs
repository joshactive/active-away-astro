globalThis.process ??= {}; globalThis.process.env ??= {};
import { k } from './marked.esm_aKArn8bq.mjs';

/**
 * Parse markdown to HTML
 * @param {string} markdown - Raw markdown text
 * @returns {string} HTML string
 */
function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  // Configure marked options
  k.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    headerIds: false, // Don't add IDs to headers
    mangle: false // Don't escape email addresses
  });
  
  return k.parse(markdown);
}

export { parseMarkdown as p };
