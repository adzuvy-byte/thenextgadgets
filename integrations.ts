/**
 * INTEGRATIONS: set once, never touch again.
 * ---------------------------------------------------------------
 * Every third-party ID and site-wide meta tag lives in this one file.
 * Leave a value as '' to switch that integration off.

 * This file lives in the project root.
 * After editing: run `npm run build` and redeploy.
 */
export const integrations = {
  // Google Analytics 4. Measurement ID looks like 'G-XXXXXXXXXX'
  googleAnalyticsId: 'G-TV06V2HGTZ',

  // Google AdSense. Publisher ID looks like 'ca-pub-1234567890123456'
  adsenseClient: 'ca-pub-6487215585365864',
  // Ad unit slot IDs (numbers from AdSense > Ads > By ad unit). Empty = that slot is hidden.
  adSlots: {
    intro: '', // after the first paragraph of an article
    end: '', // after the article body
    sidebar: '', // article sidebar
  },

  // Site verification (paste only the code, not the whole tag)
  verification: {
    google: '', // Google Search Console, content of google-site-verification
    bing: '', // Bing Webmaster Tools, content of msvalidate.01
    pinterest: '', // content of p:domain_verify
    yandex: '',
    facebookDomain: '', // content of facebook-domain-verification
  },

  // Optional tags
  microsoftClarityId: '', // Microsoft Clarity project ID
  facebookPixelId: '',
  amazonAssociatesTag: 'thenextgadgets-21', // reference only; the live tag is in content/site.json

  // Extra <meta name="..." content="..."> tags added to every page
  extraMeta: [
    // {name: 'twitter:site', content: '@thenextgadgets'},
    // {name: 'fb:app_id', content: '123456789'},
  ] as {name: string; content: string}[],

  // Social profiles (used for the Organization schema and footer if you wire them)
  social: {
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    pinterest: '',
  },
}

export type Integrations = typeof integrations
