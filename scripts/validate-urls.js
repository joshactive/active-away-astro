#!/usr/bin/env node
/**
 * Validate URLs from Strapi
 * 
 * This script fetches URLs from Strapi and validates them by making HTTP requests.
 * Useful for finding broken links and 404 errors.
 * 
 * Usage:
 *   node scripts/validate-urls.js tennis-holiday
 *   node scripts/validate-urls.js --all
 *   node scripts/validate-urls.js tennis-holiday --base-url=https://yoursite.com
 */

import { getSitemapEntries } from '../src/utils/sitemap.js';

const args = process.argv.slice(2);
const contentType = args.find(arg => !arg.startsWith('--'));
const baseUrlArg = args.find(arg => arg.startsWith('--base-url='));

const baseUrl = baseUrlArg 
  ? baseUrlArg.split('=')[1] 
  : 'http://localhost:4321';

if (!contentType || contentType === '--help') {
  console.log(`
🔍 Validate URLs from Strapi

Usage:
  node scripts/validate-urls.js <content-type> [--base-url=URL]

Arguments:
  content-type    The Strapi content type to validate (or --all for all URLs)
  --base-url      Base URL to test against (default: http://localhost:4321)

Examples:
  node scripts/validate-urls.js tennis-holiday
  node scripts/validate-urls.js tennis-clinic
  node scripts/validate-urls.js --all
  node scripts/validate-urls.js tennis-holiday --base-url=https://activeaway.com

Available content types:
  tennis-holiday, tennis-clinic, junior-tennis-camp, school-tennis-tour,
  ski-holiday, padel-tennis-holiday, pickleball-holiday, play-watch,
  tennis-academy, blog, pages
  `);
  process.exit(0);
}

async function validateURL(url, fullUrl) {
  try {
    const response = await fetch(fullUrl);
    return {
      url,
      fullUrl,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      url,
      fullUrl,
      status: 0,
      ok: false,
      statusText: error.message,
      error: true
    };
  }
}

async function validateURLs() {
  console.log(`🔍 Validating URLs from Strapi...`);
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log(`📁 Content Type: ${contentType}\n`);

  try {
    // Fetch entries
    const group = contentType === '--all' ? null : contentType;
    const entries = await getSitemapEntries(group);

    if (entries.length === 0) {
      console.log('⚠️  No URLs found');
      return;
    }

    const urls = entries.map(e => e.loc).sort();
    console.log(`Found ${urls.length} URLs to validate\n`);

    // Validate each URL
    const results = [];
    const errors = [];
    const successes = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const fullUrl = `${baseUrl}${url}`;
      
      process.stdout.write(`[${i + 1}/${urls.length}] Checking ${url}... `);
      
      const result = await validateURL(url, fullUrl);
      results.push(result);
      
      if (result.ok) {
        console.log(`✅ ${result.status}`);
        successes.push(result);
      } else {
        console.log(`❌ ${result.status} ${result.statusText}`);
        errors.push(result);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successful: ${successes.length}`);
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`📝 Total: ${results.length}`);

    if (errors.length > 0) {
      console.log('\n❌ FAILED URLs:\n');
      errors.forEach(err => {
        console.log(`  ${err.status} - ${err.url}`);
      });
    }

    console.log('\n' + '='.repeat(80));

    // Exit with error code if there are failures
    if (errors.length > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

validateURLs();


