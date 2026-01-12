globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_DGNyvb9N.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DFPiOYnu.mjs';
import { $ as $$PageHeroTailwind, a as $$BreadcrumbsTailwind } from '../chunks/BreadcrumbsTailwind_DRUEr9kD.mjs';
/* empty css                                                  */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$LibertyLykiaBookings = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Liberty Lykia Bookings | Active Away";
  const pageDescription = "Use this page to make a booking for tennis courts, tennis lessons, padel courts, racket rental and more at Liberty Lykia Tennis Academy by Active Away.";
  const metaImage = "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/347a58af-ebc7-433a-a4f2-6063d9a2d800/public";
  const metaImageAlt = "Liberty Lykia Tennis Courts";
  const metaImageWidth = 1920;
  const metaImageHeight = 1080;
  const canonicalURL = "https://activeaway.com/liberty-lykia-bookings";
  const keywords = "Liberty Lykia, tennis holiday, Turkey tennis, active away booking";
  const heroData = {
    pageHero: {
      heading: "Liberty Lykia Bookings",
      // Using the generic tennis court background from ProductHeroTailwind
      backgroundImage: {
        url: "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/347a58af-ebc7-433a-a4f2-6063d9a2d800/public",
        alt: "Liberty Lykia Bookings"
      },
      showBreadcrumbs: true
    }
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Liberty Lykia Bookings" }
  ];
  return renderTemplate(_a || (_a = __template(["", ` <!-- Planyo Scripts --> <script>
  /* change the following values to match your settings */
  var planyo_site_id='70114'; /* ID of your planyo site */
  var planyo_default_mode='resource_list'; /* one of: 'resource_list' (displays list of resources with photos, descriptions etc.), 'search' (displays the search box), 'empty' (will not display anything by default but will require you to either pass the resource ID as parameter in the URL (resource_id) or add an external search box or calendar preview), 'upcoming_availability' (displays a quick list of all upcoming availability) */
  var extra_search_fields=''; /* comma-separated extra fields in the search box, e.g. 'Number of persons'. You first need to define them in settings/custom resource properties */
  var sort_fields=''; /* comma-separated sort fields for the search box -- a single field will hide the sort dropdown box */
  var planyo_resource_ordering='name'; /* optional sort criterium for resource list */
  var planyo_include_js_library=true; /* set this to true if jQuery (required) should be included by this plugin, or false if your website already includes jQuery */
  var planyo_attribs=''; /* optionally you can insert the attribute string here */
  var planyo_resource_id=''; /* optional: ID of the resource being reserved */
  var planyo_language='EN'; /* you can optionally change the language here, e.g. 'FR' or 'ES' or pass the languge in the 'lang' parameter. 'AUTO' means the language is detected automatically */
  var ulap_script="jsonp"; /* leave this as "jsonp" for a plain-javascript implementation --OR-- if using a php/asp.net/java implementation, one of the ULAP scripts: "ulap.php", "ulap.aspx", "ulap.jsp", in such case you must download the advanced integration Planyo files from http://www.planyo.com/Plugins/PlanyoFiles/planyo-files.zip */
  var planyo_use_https=true;
  var planyo_files_location='https://www.planyo.com/Plugins/PlanyoFiles'; /* relative or absolute directory where the planyo files are kept (leave unchanged for plain-javascript implementation, otherwise e.g. '/planyo-files' when using the ULAP scripts) */
  var empty_mode=false; /* should be always set to false */
<\/script> <script>
  function get_param (name) {
    name = name.replace(/[\\[]/,"\\\\\\[").replace(/[\\]]/,"\\\\\\]");
    var regexS = "[\\\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp (regexS);
    var results = regex.exec (window.location.href);
    if (results == null) return null;
    else return results[1];
  }
  
  if (get_param('mode')) {
    planyo_embed_mode = get_param('mode');
  }
  
  function get_full_planyo_file_path(name) {
    if(planyo_files_location.length==0||planyo_files_location.lastIndexOf('/')==planyo_files_location.length-1)
      return planyo_files_location+name; 
    else 
      return planyo_files_location+'/'+name;
  }
<\/script> <link rel="stylesheet" href="https://www.planyo.com/schemes/?calendar=70114&detect_mobile=auto&sel=scheme_css" type="text/css"> <script type="text/javascript" src="https://www.planyo.com/Plugins/PlanyoFiles/jquery-3.6.4.min.js"><\/script> <script src="https://www.planyo.com/Plugins/PlanyoFiles/booking-utils.js" type="text/javascript"><\/script> `], ["", ` <!-- Planyo Scripts --> <script>
  /* change the following values to match your settings */
  var planyo_site_id='70114'; /* ID of your planyo site */
  var planyo_default_mode='resource_list'; /* one of: 'resource_list' (displays list of resources with photos, descriptions etc.), 'search' (displays the search box), 'empty' (will not display anything by default but will require you to either pass the resource ID as parameter in the URL (resource_id) or add an external search box or calendar preview), 'upcoming_availability' (displays a quick list of all upcoming availability) */
  var extra_search_fields=''; /* comma-separated extra fields in the search box, e.g. 'Number of persons'. You first need to define them in settings/custom resource properties */
  var sort_fields=''; /* comma-separated sort fields for the search box -- a single field will hide the sort dropdown box */
  var planyo_resource_ordering='name'; /* optional sort criterium for resource list */
  var planyo_include_js_library=true; /* set this to true if jQuery (required) should be included by this plugin, or false if your website already includes jQuery */
  var planyo_attribs=''; /* optionally you can insert the attribute string here */
  var planyo_resource_id=''; /* optional: ID of the resource being reserved */
  var planyo_language='EN'; /* you can optionally change the language here, e.g. 'FR' or 'ES' or pass the languge in the 'lang' parameter. 'AUTO' means the language is detected automatically */
  var ulap_script="jsonp"; /* leave this as "jsonp" for a plain-javascript implementation --OR-- if using a php/asp.net/java implementation, one of the ULAP scripts: "ulap.php", "ulap.aspx", "ulap.jsp", in such case you must download the advanced integration Planyo files from http://www.planyo.com/Plugins/PlanyoFiles/planyo-files.zip */
  var planyo_use_https=true;
  var planyo_files_location='https://www.planyo.com/Plugins/PlanyoFiles'; /* relative or absolute directory where the planyo files are kept (leave unchanged for plain-javascript implementation, otherwise e.g. '/planyo-files' when using the ULAP scripts) */
  var empty_mode=false; /* should be always set to false */
<\/script> <script>
  function get_param (name) {
    name = name.replace(/[\\\\[]/,"\\\\\\\\\\\\[").replace(/[\\\\]]/,"\\\\\\\\\\\\]");
    var regexS = "[\\\\\\\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp (regexS);
    var results = regex.exec (window.location.href);
    if (results == null) return null;
    else return results[1];
  }
  
  if (get_param('mode')) {
    planyo_embed_mode = get_param('mode');
  }
  
  function get_full_planyo_file_path(name) {
    if(planyo_files_location.length==0||planyo_files_location.lastIndexOf('/')==planyo_files_location.length-1)
      return planyo_files_location+name; 
    else 
      return planyo_files_location+'/'+name;
  }
<\/script> <link rel="stylesheet" href="https://www.planyo.com/schemes/?calendar=70114&detect_mobile=auto&sel=scheme_css" type="text/css"> <script type="text/javascript" src="https://www.planyo.com/Plugins/PlanyoFiles/jquery-3.6.4.min.js"><\/script> <script src="https://www.planyo.com/Plugins/PlanyoFiles/booking-utils.js" type="text/javascript"><\/script> `])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "metaImage": metaImage, "metaImageAlt": metaImageAlt, "metaImageWidth": metaImageWidth, "metaImageHeight": metaImageHeight, "canonicalURL": canonicalURL, "keywords": keywords, "data-astro-cid-v52vwlbc": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="custom-hero-height" data-astro-cid-v52vwlbc> ${renderComponent($$result2, "PageHeroTailwind", $$PageHeroTailwind, { "pageData": heroData, "breadcrumbs": breadcrumbs, "data-astro-cid-v52vwlbc": true })} </div>  ${renderComponent($$result2, "BreadcrumbsTailwind", $$BreadcrumbsTailwind, { "breadcrumbs": breadcrumbs, "data-astro-cid-v52vwlbc": true })}  <div class="w-full bg-white py-8 sm:py-12" data-astro-cid-v52vwlbc> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-v52vwlbc> <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6" data-astro-cid-v52vwlbc> <!-- Main Page Button (Default View) --> <a href="/tennis-academy/liberty-lykia-tennis-academy/" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#0D1C4E] hover:bg-[#0D1C4E]/90 text-white px-8 py-4 rounded-full font-inter font-semibold text-base transition-all duration-300 hover:-translate-y-0.5" data-astro-cid-v52vwlbc>
Main Page
</a> <!-- View by Calendar Button --> <a href="/liberty-lykia-bookings/liberty-lykia-court-bookings/" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gold hover:bg-gold-700 text-white px-8 py-4 rounded-full font-inter font-semibold text-base transition-all duration-300 hover:-translate-y-0.5" data-astro-cid-v52vwlbc>
View by Calendar
</a> </div> </div> </div>  <div class="w-full bg-white pb-12 sm:pb-16 lg:pb-24" data-astro-cid-v52vwlbc> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-v52vwlbc> <!-- Planyo Container --> <div id="planyo_content" class="planyo" data-astro-cid-v52vwlbc> <div class="flex justify-center py-12" data-astro-cid-v52vwlbc> <img src="https://www.planyo.com/images/hourglass.gif" align="middle" alt="Loading..." data-astro-cid-v52vwlbc> </div> </div> <noscript> <a href="https://www.planyo.com/about-calendar.php?calendar=70114" data-astro-cid-v52vwlbc>Make a reservation</a><br data-astro-cid-v52vwlbc><br data-astro-cid-v52vwlbc> <a href="https://www.planyo.com/" data-astro-cid-v52vwlbc>Reservation system powered by Planyo</a> </noscript> </div> </div> ` }));
}, "/Users/joshuathompson/active-away-astro/src/pages/liberty-lykia-bookings.astro", void 0);

const $$file = "/Users/joshuathompson/active-away-astro/src/pages/liberty-lykia-bookings.astro";
const $$url = "/liberty-lykia-bookings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$LibertyLykiaBookings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
