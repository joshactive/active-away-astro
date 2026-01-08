#!/usr/bin/env node
/**
 * Extract All URLs from Strapi
 * 
 * This script fetches all URLs from Strapi and outputs them organized by content type.
 * Useful for validation, SEO audits, and URL management.
 * 
 * Usage:
 *   node scripts/extract-strapi-urls.js
 *   node scripts/extract-strapi-urls.js --format=json
 *   node scripts/extract-strapi-urls.js --group=tennis-holiday
 */

import { getAllSitemapEntries, getSitemapEntries, getSitemapGroups } from '../src/utils/sitemap.js';

const args = process.argv.slice(2);
const formatArg = args.find(arg => arg.startsWith('--format='));
const groupArg = args.find(arg => arg.startsWith('--group='));

const format = formatArg ? formatArg.split('=')[1] : 'text';
const group = groupArg ? groupArg.split('=')[1] : null;

async function extractURLs() {
  console.log('🔍 Extracting URLs from Strapi...\n');

  try {
    // Fetch entries
    const entries = group 
      ? await getSitemapEntries(group)
      : await getAllSitemapEntries();

    if (entries.length === 0) {
      console.log('⚠️  No URLs found');
      return;
    }

    // Group by URL prefix/category
    const grouped = {};
    
    entries.forEach(entry => {
      const url = entry.loc;
      
      // Determine category from URL
      let category = 'root';
      
      if (url === '/') {
        category = 'root';
      } else if (url.startsWith('/blog/')) {
        category = 'blog';
      } else if (url.startsWith('/tennis-holiday/')) {
        category = 'tennis-holiday';
      } else if (url.startsWith('/tennis-clinic/')) {
        category = 'tennis-clinic';
      } else if (url.startsWith('/junior-tennis-camp/')) {
        category = 'junior-tennis-camp';
      } else if (url.startsWith('/school-tennis-tour/')) {
        category = 'school-tennis-tour';
      } else if (url.startsWith('/ski-holiday/')) {
        category = 'ski-holiday';
      } else if (url.startsWith('/padel-holiday/') || url.startsWith('/padel-tennis-holiday/')) {
        category = 'padel-holiday';
      } else if (url.startsWith('/pickleball-holiday/')) {
        category = 'pickleball-holiday';
      } else if (url.startsWith('/play-and-watch/')) {
        category = 'play-and-watch';
      } else if (url.startsWith('/tennis-academy/')) {
        category = 'tennis-academy';
      } else if (url.startsWith('/forms/')) {
        category = 'forms';
      } else if (url.startsWith('/faqs/')) {
        category = 'faqs';
      } else if (url.startsWith('/pre-orders/')) {
        category = 'pre-orders';
      } else if (url.startsWith('/group-organiser/')) {
        category = 'group-organiser';
      } else {
        category = 'other-pages';
      }
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      grouped[category].push(url);
    });

    // Sort URLs within each category
    Object.keys(grouped).forEach(key => {
      grouped[key].sort();
    });

    // Output results
    if (format === 'json') {
      // JSON format
      console.log(JSON.stringify(grouped, null, 2));
    } else if (format === 'list') {
      // Simple list (one URL per line)
      entries
        .map(e => e.loc)
        .sort()
        .forEach(url => console.log(url));
    } else {
      // Default: Organized text format
      const sortedCategories = Object.keys(grouped).sort();
      
      console.log('📊 URLS BY CATEGORY\n');
      console.log('='.repeat(80));
      
      sortedCategories.forEach(category => {
        const urls = grouped[category];
        console.log(`\n📁 ${category.toUpperCase()} (${urls.length} URLs)`);
        console.log('-'.repeat(80));
        urls.forEach(url => console.log(`  ${url}`));
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`\n✅ Total URLs: ${entries.length}`);
      console.log(`📂 Categories: ${sortedCategories.length}`);
    }

    // Summary
    if (format !== 'json' && format !== 'list') {
      console.log('\n💡 TIP: Use different formats:');
      console.log('   --format=json     Output as JSON');
      console.log('   --format=list     Simple list (one URL per line)');
      console.log('   --format=text     Organized by category (default)');
      console.log('\n💡 Filter by group:');
      const groups = getSitemapGroups();
      console.log(`   Available groups: ${groups.join(', ')}`);
      console.log('   Example: --group=tennis-holiday');
    }

  } catch (error) {
    console.error('❌ Error extracting URLs:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the extraction
extractURLs();


















