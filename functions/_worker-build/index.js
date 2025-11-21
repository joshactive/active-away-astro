globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_wwqwhNil.mjs';
import { manifest } from './manifest_CaT6RRZP.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about-us.astro.mjs');
const _page3 = () => import('./pages/active-away-travel-guides.astro.mjs');
const _page4 = () => import('./pages/airport-transfers.astro.mjs');
const _page5 = () => import('./pages/api/get-clinics.json.astro.mjs');
const _page6 = () => import('./pages/api/get-resorts.json.astro.mjs');
const _page7 = () => import('./pages/api/get-venues.json.astro.mjs');
const _page8 = () => import('./pages/api/google-reviews.json.astro.mjs');
const _page9 = () => import('./pages/api/newsletter-signup.json.astro.mjs');
const _page10 = () => import('./pages/api/submit-form.json.astro.mjs');
const _page11 = () => import('./pages/api/submit-pre-order.json.astro.mjs');
const _page12 = () => import('./pages/api/update-instagram-token.json.astro.mjs');
const _page13 = () => import('./pages/api/upload-file.json.astro.mjs');
const _page14 = () => import('./pages/booking-process.astro.mjs');
const _page15 = () => import('./pages/booking-terms-conditions.astro.mjs');
const _page16 = () => import('./pages/dragons-den.astro.mjs');
const _page17 = () => import('./pages/events.astro.mjs');
const _page18 = () => import('./pages/faqs/_slug_.astro.mjs');
const _page19 = () => import('./pages/faqs.astro.mjs');
const _page20 = () => import('./pages/flights.astro.mjs');
const _page21 = () => import('./pages/forms/_slug_.astro.mjs');
const _page22 = () => import('./pages/forms.astro.mjs');
const _page23 = () => import('./pages/group-organiser/_slug_.astro.mjs');
const _page24 = () => import('./pages/group-organiser.astro.mjs');
const _page25 = () => import('./pages/jamie-murray-tennis-programme.astro.mjs');
const _page26 = () => import('./pages/join-the-team.astro.mjs');
const _page27 = () => import('./pages/junior-tennis-camp/_slug_.astro.mjs');
const _page28 = () => import('./pages/junior-tennis-camp.astro.mjs');
const _page29 = () => import('./pages/padel-holiday/_slug_.astro.mjs');
const _page30 = () => import('./pages/padel-tennis-holiday/_slug_.astro.mjs');
const _page31 = () => import('./pages/padel-tennis-holiday.astro.mjs');
const _page32 = () => import('./pages/pickleball-holiday/_slug_.astro.mjs');
const _page33 = () => import('./pages/pickleball-holiday.astro.mjs');
const _page34 = () => import('./pages/play-and-watch/_slug_.astro.mjs');
const _page35 = () => import('./pages/play-and-watch.astro.mjs');
const _page36 = () => import('./pages/pre-orders/_slug_.astro.mjs');
const _page37 = () => import('./pages/pre-orders.astro.mjs');
const _page38 = () => import('./pages/school-tennis-tour/_slug_.astro.mjs');
const _page39 = () => import('./pages/school-tennis-tour.astro.mjs');
const _page40 = () => import('./pages/self-rating-guide.astro.mjs');
const _page41 = () => import('./pages/ski-holiday/_slug_.astro.mjs');
const _page42 = () => import('./pages/ski-holiday.astro.mjs');
const _page43 = () => import('./pages/tennis-academy/_slug_.astro.mjs');
const _page44 = () => import('./pages/tennis-academy.astro.mjs');
const _page45 = () => import('./pages/tennis-clinic/_slug_.astro.mjs');
const _page46 = () => import('./pages/tennis-clinic.astro.mjs');
const _page47 = () => import('./pages/tennis-holiday/_slug_.astro.mjs');
const _page48 = () => import('./pages/tennis-holiday.astro.mjs');
const _page49 = () => import('./pages/travel-guides.astro.mjs');
const _page50 = () => import('./pages/venues.astro.mjs');
const _page51 = () => import('./pages/videos.astro.mjs');
const _page52 = () => import('./pages/welcomepacks.astro.mjs');
const _page53 = () => import('./pages/whatsapp-groups.astro.mjs');
const _page54 = () => import('./pages/_slug_.astro.mjs');
const _page55 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about-us.astro", _page2],
    ["src/pages/active-away-travel-guides.astro", _page3],
    ["src/pages/airport-transfers.astro", _page4],
    ["src/pages/api/get-clinics.json.ts", _page5],
    ["src/pages/api/get-resorts.json.ts", _page6],
    ["src/pages/api/get-venues.json.ts", _page7],
    ["src/pages/api/google-reviews.json.ts", _page8],
    ["src/pages/api/newsletter-signup.json.ts", _page9],
    ["src/pages/api/submit-form.json.ts", _page10],
    ["src/pages/api/submit-pre-order.json.ts", _page11],
    ["src/pages/api/update-instagram-token.json.ts", _page12],
    ["src/pages/api/upload-file.json.js", _page13],
    ["src/pages/booking-process.astro", _page14],
    ["src/pages/booking-terms-conditions.astro", _page15],
    ["src/pages/dragons-den.astro", _page16],
    ["src/pages/events.astro", _page17],
    ["src/pages/faqs/[slug].astro", _page18],
    ["src/pages/faqs/index.astro", _page19],
    ["src/pages/flights.astro", _page20],
    ["src/pages/forms/[slug].astro", _page21],
    ["src/pages/forms.astro", _page22],
    ["src/pages/group-organiser/[slug].astro", _page23],
    ["src/pages/group-organiser/index.astro", _page24],
    ["src/pages/jamie-murray-tennis-programme.astro", _page25],
    ["src/pages/join-the-team.astro", _page26],
    ["src/pages/junior-tennis-camp/[slug].astro", _page27],
    ["src/pages/junior-tennis-camp/index.astro", _page28],
    ["src/pages/padel-holiday/[slug].astro", _page29],
    ["src/pages/padel-tennis-holiday/[slug].astro", _page30],
    ["src/pages/padel-tennis-holiday/index.astro", _page31],
    ["src/pages/pickleball-holiday/[slug].astro", _page32],
    ["src/pages/pickleball-holiday/index.astro", _page33],
    ["src/pages/play-and-watch/[slug].astro", _page34],
    ["src/pages/play-and-watch/index.astro", _page35],
    ["src/pages/pre-orders/[slug].astro", _page36],
    ["src/pages/pre-orders.astro", _page37],
    ["src/pages/school-tennis-tour/[slug].astro", _page38],
    ["src/pages/school-tennis-tour/index.astro", _page39],
    ["src/pages/self-rating-guide.astro", _page40],
    ["src/pages/ski-holiday/[slug].astro", _page41],
    ["src/pages/ski-holiday/index.astro", _page42],
    ["src/pages/tennis-academy/[slug].astro", _page43],
    ["src/pages/tennis-academy/index.astro", _page44],
    ["src/pages/tennis-clinic/[slug].astro", _page45],
    ["src/pages/tennis-clinic/index.astro", _page46],
    ["src/pages/tennis-holiday/[slug].astro", _page47],
    ["src/pages/tennis-holiday/index.astro", _page48],
    ["src/pages/travel-guides.astro", _page49],
    ["src/pages/venues.astro", _page50],
    ["src/pages/videos.astro", _page51],
    ["src/pages/welcomepacks.astro", _page52],
    ["src/pages/whatsapp-groups.astro", _page53],
    ["src/pages/[slug].astro", _page54],
    ["src/pages/index.astro", _page55]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
