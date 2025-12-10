#!/usr/bin/env node
/**
 * List URLs for a specific content type from Strapi
 * 
 * Quick script to get all URLs for a specific content type.
 * Perfect for checking slugs before updates.
 * 
 * Usage:
 *   node scripts/list-urls-by-type.js tennis-holiday
 *   node scripts/list-urls-by-type.js tennis-clinic
 *   node scripts/list-urls-by-type.js --all
 */

import { getSitemapEntries } from '../src/utils/sitemap.js';

const contentType = process.argv[2];

if (!contentType || contentType === '--help') {
  console.log(`
📋 List URLs by Content Type

Usage:
  node scripts/list-urls-by-type.js <content-type>

Available content types:
  - tennis-holiday
  - tennis-clinic
  - junior-tennis-camp
  - school-tennis-tour
  - ski-holiday
  - padel-tennis-holiday
  - pickleball-holiday
  - play-watch
  - tennis-academy
  - form
  - faq-category
  - pre-order
  - group-organiser
  - blog
  - pages

Examples:
  node scripts/list-urls-by-type.js tennis-holiday
  node scripts/list-urls-by-type.js tennis-clinic
  node scripts/list-urls-by-type.js --all
  `);
  process.exit(0);
}

async function listURLs() {
  try {
    console.log(`🔍 Fetching URLs for: ${contentType}\n`);
    
    const group = contentType === '--all' ? null : contentType;
    const entries = await getSitemapEntries(group);

    if (entries.length === 0) {
      console.log('⚠️  No URLs found for this content type');
      return;
    }

    console.log(`Found ${entries.length} URLs:\n`);
    console.log('='.repeat(80));
    
    // Sort and display
    entries
      .map(e => e.loc)
      .sort()
      .forEach(url => console.log(url));
    
    console.log('='.repeat(80));
    console.log(`\n✅ Total: ${entries.length} URLs`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listURLs();








