# TheNextGadgets

A static Next.js site. Every article is a Markdown file; every Amazon product is one entry in a single JSON file. No database.

```
content/
  posts/<slug>.md     one file per article (the file name is the URL: /<slug>/)
  pages/<slug>.md     About, Privacy, Contact ... (same format, no type needed)
  products.json       ALL Amazon products and affiliate links, entered once
  categories.json     topics and article types (flat, no nesting)
  authors.json        bylines
  site.json           site name, Amazon domain, affiliate tag, disclosure text
app/ components/ lib/ the site code
public/_redirects     old WordPress URLs that redirect
```

## A post

```
---
title: Best Dishwashers in India
slug: 10-best-dishwashers-in-india
type: best            # best | review | comparison | fixit | guide | news | blog
category: home-kitchen
categories: [best, home-kitchen]
author: editorial-team
date: 2025-01-26
updated: 2025-01-26   # shown as "Last reviewed"
excerpt: One or two sentences for cards and the top of the page.
description: SEO description (optional).
faq:                  # optional
  - q: Question?
    a: Short answer.
verdict:              # optional, for reviews
  product: product-id
  rating: 4.5
  summary: Who it suits.
---

Normal Markdown here: ## headings, lists, **bold**, [links](https://...), tables.

```best
items:
  - product: voltas-beko-14-place-setting-dishwasher
    badge: Best overall
    rating: 4.6
    verdict: Why it earned this spot.
    pros: [Quiet, 8 programs]
    cons: [Pricey]
    skipIf: you cook very little
```

```product
product: bosch-13-place-settings-dishwasher
```
```

Products are looked up by `id` in `content/products.json`:

```
{ "id": "bosch-13", "name": "Bosch 13 Place Settings", "url": "https://amzn.to/..." }
```
Use `url` for an affiliate link you paste as it is, or `asin` (the code after /dp/) to have the link built from the tag in `site.json`.

## Run and deploy

```
npm install
npm run dev          # http://localhost:3000
npm run build        # writes the finished site to ./out
```

Deploy to Cloudflare: connect the folder's Git repo in Cloudflare (Workers & Pages > Create > Import a repository). Build command `npm run build`, deploy command `npx wrangler deploy`. Add `NEXT_PUBLIC_SITE_URL` (and AdSense ids, if used) as variables. Every push publishes.

## Product images (optional)
Put image files in `public/products/` and add `"image": "/products/<file>.jpg"` (and optionally `"imageAlt"`) to the product in `content/products.json`. Products with an image show it in Best-of cards and product boxes; products without one keep the text-only layout. Use your own photos or press-kit images with permission, not copies of Amazon's images.
