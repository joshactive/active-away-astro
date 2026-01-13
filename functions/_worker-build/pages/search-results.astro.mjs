globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { e as createAstro, f as createComponent, k as renderComponent, n as Fragment, r as renderTemplate, m as maybeRenderHead, l as defineScriptVars } from '../chunks/astro/server_BoSsXtn0.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Diefu_Wk.mjs';
import { $ as $$PageHeroTailwind, a as $$BreadcrumbsTailwind } from '../chunks/BreadcrumbsTailwind_Bj3HUfXN.mjs';
import { aJ as getSearchResultsPage, aK as getSearchResultsPageSEO } from '../chunks/strapi_D13TtKqq.mjs';
/* empty css                                          */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://activeaway.com");
const $$SearchResults = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SearchResults;
  const url = Astro2.url;
  const itemIds = url.searchParams.get("item_ids") || "";
  const startDate = url.searchParams.get("start_date") || "";
  const endDate = url.searchParams.get("end_date") || "";
  const trackingId = url.searchParams.get("tid") || "";
  let pageData = null;
  try {
    pageData = await getSearchResultsPage();
    console.log("\u{1F50D} [search-results] Page data fetched");
  } catch (error) {
    console.error("\u274C [search-results] Error fetching page:", error.message);
  }
  let seoData = null;
  try {
    seoData = await getSearchResultsPageSEO();
    if (seoData) {
      console.log("\u{1F4C4} [search-results] SEO data fetched");
    }
  } catch (error) {
    console.warn("\u26A0\uFE0F  [search-results] Could not fetch SEO data:", error.message);
  }
  let checkfrontStartDate = startDate;
  let checkfrontEndDate = endDate;
  if (!checkfrontStartDate) {
    const today = /* @__PURE__ */ new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    checkfrontStartDate = `${year}${month}${day}`;
  }
  if (!checkfrontEndDate) {
    const today = /* @__PURE__ */ new Date();
    const futureYear = today.getFullYear() + 2;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    checkfrontEndDate = `${futureYear}${month}${day}`;
  }
  const pageTitle = seoData?.metaTitle || pageData?.seo?.metaTitle || "Event Booking - Active Away";
  const pageDescription = seoData?.metaDescription || pageData?.seo?.metaDescription || "Complete your event booking with Active Away";
  const metaImage = seoData?.metaImage || pageData?.seo?.metaImage || null;
  const metaImageAlt = seoData?.metaImageAlt || pageData?.seo?.metaImageAlt || null;
  const metaImageWidth = seoData?.metaImageWidth || null;
  const metaImageHeight = seoData?.metaImageHeight || null;
  const keywords = seoData?.keywords || pageData?.seo?.keywords || null;
  const canonicalURL = seoData?.canonicalURL || pageData?.seo?.canonicalURL || "https://activeaway.com/search-results";
  const hasItems = itemIds !== "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "metaImage": metaImage, "metaImageAlt": metaImageAlt, "metaImageWidth": metaImageWidth, "metaImageHeight": metaImageHeight, "keywords": keywords, "canonicalURL": canonicalURL, "robots": "noindex, nofollow", "data-astro-cid-6ouf65ld": true }, { "default": async ($$result2) => renderTemplate`  ${pageData?.pageHero && renderTemplate`${maybeRenderHead()}<div class="search-results-hero" data-astro-cid-6ouf65ld> ${renderComponent($$result2, "PageHeroTailwind", $$PageHeroTailwind, { "pageData": pageData, "data-astro-cid-6ouf65ld": true })} </div>`} ${pageData?.pageHero?.showBreadcrumbs !== false && renderTemplate`${renderComponent($$result2, "BreadcrumbsTailwind", $$BreadcrumbsTailwind, { "breadcrumbs": [
    { label: "Home", href: "/" },
    { label: "Event Booking" }
  ], "data-astro-cid-6ouf65ld": true })}`} <section class="w-full bg-white py-8 sm:py-12" data-astro-cid-6ouf65ld> <div class="container mx-auto max-w-[1200px] px-2 sm:px-6 lg:px-8" data-astro-cid-6ouf65ld> ${!hasItems ? renderTemplate`<!-- Error State: No Items -->
        <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto" data-astro-cid-6ouf65ld> <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" data-astro-cid-6ouf65ld> <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-6ouf65ld> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-astro-cid-6ouf65ld></path> </svg> </div> <h2 class="text-2xl font-playfair font-semibold text-gray-900 mb-3" data-astro-cid-6ouf65ld>No Event Selected</h2> <p class="text-base font-inter text-gray-700 mb-6" data-astro-cid-6ouf65ld>
Please select an event from our events page to view booking availability.
</p> <a href="/events" class="inline-block bg-[#ad986c] hover:bg-[#8d7a56] text-white font-inter font-semibold px-8 py-3 rounded-full transition-colors duration-300" data-astro-cid-6ouf65ld>
View All Events
</a> </div>` : renderTemplate`<!-- Checkfront Booking Widget -->
        <div class="location-booking" style="text-align: center;" data-astro-cid-6ouf65ld> <!-- Checkfront Widget Container --> <div id="CHECKFRONT_WIDGET_01" style="margin: 0 auto; text-align: center;" data-astro-cid-6ouf65ld> <p id="CHECKFRONT_LOADER" style="background: url('//activeaway.checkfront.co.uk/images/loader.gif') left center no-repeat; padding: 5px 5px 5px 20px;" data-astro-cid-6ouf65ld>
Searching Availability...
</p> </div> <!-- Fallback for users without JavaScript --> <noscript> <div style="text-align: center; padding: 40px; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; margin-top: 20px;" data-astro-cid-6ouf65ld> <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;" data-astro-cid-6ouf65ld>JavaScript Required</h3> <p style="font-size: 16px; margin-bottom: 24px;" data-astro-cid-6ouf65ld>
Please enable JavaScript to use our booking system.
</p> <a href="https://activeaway.checkfront.co.uk/reserve/" style="display: inline-block; background-color: #ad986c; color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;" data-astro-cid-6ouf65ld>
Continue to Secure Booking System &raquo;
</a> </div> </noscript> </div>`} </div> </section> ` })}  ${hasItems && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-6ouf65ld": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="text/javascript" src="https://activeaway.checkfront.co.uk/lib/interface--20.js"><\/script>  <script>(function(){', `
      // Wait for DROPLET to be available
      function initCheckfront() {
        if (typeof DROPLET === 'undefined') {
          setTimeout(initCheckfront, 100);
          return;
        }

        try {
          const widgetConfig = {
            host: 'activeaway.checkfront.co.uk',
            target: 'CHECKFRONT_WIDGET_01',
            provider: 'droplet',
            options: 'hidesearch',
            style: 'color: #222222;'
          };

          // Add item_id if provided
          if (itemIds) {
            widgetConfig.item_id = itemIds;
          }

          // Add date if provided
          if (checkfrontStartDate) {
            widgetConfig.date = checkfrontStartDate;
          }

          // Add end_date if provided
          if (checkfrontEndDate) {
            widgetConfig.end_date = checkfrontEndDate;
          }

          // Add tracking ID if provided
          if (trackingId) {
            widgetConfig.tid = trackingId;
          }

          // Initialize the widget
          new DROPLET.Widget(widgetConfig).render();
          
          console.log('\u2705 Checkfront widget initialized with config:', widgetConfig);
          
          // Fix currency selector alignment after widget loads
          setTimeout(() => {
            const container = document.getElementById('CHECKFRONT_WIDGET_01');
            if (container) {
              // Find and fix currency selector alignment
              const currencySelectors = container.querySelectorAll(
                '.currency-selector, .DROPLET_currency, select[name="currency"], .filter, .toolbar, .DROPLET_filter'
              );
              
              currencySelectors.forEach(element => {
                element.style.maxWidth = '610px';
                element.style.marginLeft = 'auto';
                element.style.marginRight = 'auto';
                element.style.boxSizing = 'border-box';
              });
              
              // Also fix parent containers
              const parentContainers = container.querySelectorAll(
                '.DROPLET_widget, .DROPLET_container'
              );
              
              parentContainers.forEach(element => {
                element.style.maxWidth = '610px';
                element.style.marginLeft = 'auto';
                element.style.marginRight = 'auto';
              });
              
              console.log('\u2705 Currency selector alignment fixed');
            }
          }, 1500);
          
          // Double check after iframe loads
          setTimeout(() => {
            const container = document.getElementById('CHECKFRONT_WIDGET_01');
            if (container) {
              const allDivs = container.querySelectorAll('div');
              allDivs.forEach(div => {
                if (div.style.width && div.style.width !== '100%') {
                  div.style.marginLeft = 'auto';
                  div.style.marginRight = 'auto';
                }
              });
            }
          }, 3000);
        } catch (error) {
          console.error('\u274C Error initializing Checkfront widget:', error);
          
          // Show error message to user
          const loader = document.getElementById('CHECKFRONT_LOADER');
          if (loader) {
            loader.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #dc2626; font-size: 16px; margin-bottom: 16px;">Unable to load booking system. Please try again or contact us for assistance.</p><a href="/contact" style="display: inline-block; background-color: #ad986c; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Contact Us</a></div>';
          }
        }
      }

      // Start initialization when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCheckfront);
      } else {
        initCheckfront();
      }
    })();<\/script> `])), defineScriptVars({ itemIds, checkfrontStartDate, checkfrontEndDate, trackingId })) })}`}`;
}, "/Users/joshuathompson/active-away-astro/src/pages/search-results.astro", void 0);

const $$file = "/Users/joshuathompson/active-away-astro/src/pages/search-results.astro";
const $$url = "/search-results";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SearchResults,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
