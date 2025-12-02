#!/usr/bin/env node
/**
 * Extract ALL URLs from Strapi - Complete List
 * 
 * This script uses the direct Strapi getter functions to extract all possible URLs
 * from every content type, bypassing API permission issues.
 */

import {
  // Tennis Holidays
  getTennisHolidays,
  // Tennis Clinics  
  getTennisClinics,
  // Junior Camps
  getJuniorTennisCamps,
  // School Tours
  getSchoolTennisTours,
  // Ski Holidays
  getSkiHolidays,
  // Padel Holidays
  getPadelTennisHolidays,
  // Pickleball Holidays
  getPickleballHolidays,
  // Play & Watch
  getPlayAndWatchHolidays,
  // Tennis Academies
  getTennisAcademies,
  // Forms
  getForms,
  // Pre-orders
  getPreOrders,
  // Group Organisers
  getGroupOrganisers,
  // FAQs
  getFAQCategories,
  // Blog
  getAllBlogPosts,
} from '../src/utils/strapi.js';

async function extractAllURLs() {
  console.log('🔍 Extracting ALL URLs from Strapi...\n');
  
  const allURLs = {
    'tennis-holiday': [],
    'tennis-clinic': [],
    'junior-tennis-camp': [],
    'school-tennis-tour': [],
    'ski-holiday': [],
    'padel-tennis-holiday': [],
    'pickleball-holiday': [],
    'play-and-watch': [],
    'tennis-academy': [],
    'form': [],
    'pre-order': [],
    'group-organiser': [],
    'faq': [],
    'blog': []
  };

  try {
    // Tennis Holidays
    console.log('📍 Fetching Tennis Holidays...');
    const tennisHolidays = await getTennisHolidays(1, 200);
    allURLs['tennis-holiday'] = tennisHolidays.map(h => `/tennis-holiday/${h.slug}`);
    console.log(`   ✅ Found ${allURLs['tennis-holiday'].length} tennis holidays`);

    // Tennis Clinics
    console.log('📍 Fetching Tennis Clinics...');
    const tennisClinics = await getTennisClinics(1, 200);
    allURLs['tennis-clinic'] = tennisClinics.map(c => `/tennis-clinic/${c.slug}`);
    console.log(`   ✅ Found ${allURLs['tennis-clinic'].length} tennis clinics`);

    // Junior Tennis Camps
    console.log('📍 Fetching Junior Tennis Camps...');
    const juniorCamps = await getJuniorTennisCamps(1, 200);
    allURLs['junior-tennis-camp'] = juniorCamps.map(c => `/junior-tennis-camp/${c.slug}`);
    console.log(`   ✅ Found ${allURLs['junior-tennis-camp'].length} junior camps`);

    // School Tennis Tours
    console.log('📍 Fetching School Tennis Tours...');
    const schoolTours = await getSchoolTennisTours(1, 200);
    allURLs['school-tennis-tour'] = schoolTours.map(t => `/school-tennis-tour/${t.slug}`);
    console.log(`   ✅ Found ${allURLs['school-tennis-tour'].length} school tours`);

    // Ski Holidays
    console.log('📍 Fetching Ski Holidays...');
    const skiHolidays = await getSkiHolidays(1, 200);
    allURLs['ski-holiday'] = skiHolidays.map(s => `/ski-holiday/${s.slug}`);
    console.log(`   ✅ Found ${allURLs['ski-holiday'].length} ski holidays`);

    // Padel Tennis Holidays
    console.log('📍 Fetching Padel Tennis Holidays...');
    const padelHolidays = await getPadelTennisHolidays(1, 200);
    allURLs['padel-tennis-holiday'] = padelHolidays.map(p => `/padel-holiday/${p.slug}`);
    console.log(`   ✅ Found ${allURLs['padel-tennis-holiday'].length} padel holidays`);

    // Pickleball Holidays
    console.log('📍 Fetching Pickleball Holidays...');
    const pickleballHolidays = await getPickleballHolidays(1, 200);
    allURLs['pickleball-holiday'] = pickleballHolidays.map(p => `/pickleball-holiday/${p.slug}`);
    console.log(`   ✅ Found ${allURLs['pickleball-holiday'].length} pickleball holidays`);

    // Play & Watch
    console.log('📍 Fetching Play & Watch...');
    const playWatch = await getPlayAndWatchHolidays(1, 200);
    allURLs['play-and-watch'] = playWatch.map(p => `/play-and-watch/${p.slug}`);
    console.log(`   ✅ Found ${allURLs['play-and-watch'].length} play & watch events`);

    // Tennis Academies
    console.log('📍 Fetching Tennis Academies...');
    const academies = await getTennisAcademies(1, 200);
    allURLs['tennis-academy'] = academies.map(a => `/tennis-academy/${a.slug}`);
    console.log(`   ✅ Found ${allURLs['tennis-academy'].length} tennis academies`);

    // Forms
    console.log('📍 Fetching Forms...');
    const forms = await getForms(1, 200);
    allURLs['form'] = forms.map(f => `/forms/${f.slug}`);
    console.log(`   ✅ Found ${allURLs['form'].length} forms`);

    // Pre-orders
    console.log('📍 Fetching Pre-orders...');
    const preOrders = await getPreOrders(1, 200);
    allURLs['pre-order'] = preOrders.map(p => `/pre-orders/${p.slug}`);
    console.log(`   ✅ Found ${allURLs['pre-order'].length} pre-orders`);

    // Group Organisers
    console.log('📍 Fetching Group Organisers...');
    const groupOrganisers = await getGroupOrganisers(1, 200);
    allURLs['group-organiser'] = groupOrganisers.map(g => `/group-organiser/${g.slug}`);
    console.log(`   ✅ Found ${allURLs['group-organiser'].length} group organisers`);

    // FAQs
    console.log('📍 Fetching FAQ Categories...');
    const faqs = await getFAQCategories();
    allURLs['faq'] = faqs.map(f => `/faqs/${f.slug}`);
    console.log(`   ✅ Found ${allURLs['faq'].length} FAQ categories`);

    // Blog Posts
    console.log('📍 Fetching Blog Posts...');
    const blogPosts = await getAllBlogPosts();
    allURLs['blog'] = blogPosts.map(b => `/blog/${b.categorySlug}/${b.slug}`);
    console.log(`   ✅ Found ${allURLs['blog'].length} blog posts`);

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }

  // Calculate total
  const totalURLs = Object.values(allURLs).reduce((sum, urls) => sum + urls.length, 0);

  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE URL EXTRACTION SUMMARY');
  console.log('='.repeat(80));
  
  // Display all URLs organized by type
  Object.keys(allURLs).forEach(type => {
    const urls = allURLs[type];
    if (urls.length > 0) {
      console.log(`\n📁 ${type.toUpperCase()} (${urls.length} URLs)`);
      console.log('-'.repeat(80));
      urls.sort().forEach(url => console.log(url));
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`✅ TOTAL URLs: ${totalURLs}`);
  console.log('='.repeat(80));

  // Also create a combined flat list
  const flatList = Object.values(allURLs).flat().sort();
  
  console.log('\n💾 Saving to files...');
  
  // We can't use fs in this script directly, so output instructions
  console.log(`
To save these URLs to files, run:

  node scripts/extract-all-urls.js > all-strapi-urls.txt
  
  Or for JSON format, use the --json flag (if implemented)
  `);
}

extractAllURLs().catch(console.error);

