---
title: "Ackee.ai is an AI Search Platform for Real Estate"
description: "Announcing Ackee.ai, an AI-powered search platform for real estate built to replace the form-shaped portals (Zillow, Redfin, Homes.com, Realtor.com). Buyers describe the home they actually want in plain English; the platform reads every listing and every photo the way a thoughtful agent would. Live in the MIBOR service area today, expanding to additional listing boards next."
date: "2026-04-29"
author: "Sheldon Barnes"
category: "industry-analysis"
tags: ["ackee", "ackee-ai", "real-estate", "proptech", "ai-platform", "ai-search", "semantic-search", "natural-language-search", "zillow", "redfin", "homes-com", "realtor-com", "mibor", "mls", "listing-boards", "indianapolis", "claude", "anthropic", "computer-vision", "image-recognition", "multi-modal-ai", "ai-products", "product-launch", "ai-first", "the-platform-inversion"]
hero: "/ackee-logo-new.png"
heroAlt: "The Ackee.ai logo: a house outline with a chat bubble inside it, signaling a conversational AI search experience for real estate."
published: true
---

Today I'm announcing [Ackee.ai](https://www.ackee.ai), an AI search platform for real estate. It is built to compete head-on with Zillow, Redfin, Homes.com, and Realtor.com, and to replace the form-shaped portal experience all four of them ship.

[Ackee.ai](https://www.ackee.ai) reads every active listing in a market the way a thoughtful agent would, and lets buyers describe the home they actually want in plain English. No dropdowns. No price sliders. No fifteen-option architectural-style checkbox that doesn't include "modern farmhouse." You type what you want, the platform ranks every active home in the market against it, and the right listings come back.

The platform is live now at [ackee.ai](https://www.ackee.ai), with full coverage across the **MIBOR** (Metropolitan Indianapolis Board of Realtors) service area. Additional listing boards are next.

## What Ackee.ai is

[Ackee.ai](https://www.ackee.ai) is a platform, not a portal. It is the search and intelligence layer that sits on top of the local listing board's MLS feed and the buyer-facing site. Three capabilities make it work, and all three were missing from real estate search until now.

**Natural-language parsing.** A language model converts a buyer's sentence into structured filters covering everything portals already do (price, beds, baths, school district, lot size, HOA), plus the subjective layer they have always punted on (chef's kitchen, walkout basement, primary on main, finished bar, modern farmhouse, the man cave you've been picturing for two years). Buyers stop translating their preferences into checkboxes. They just describe.

> **Every prompt below is a live link.** Click any of them to run that exact search on [Ackee.ai](https://www.ackee.ai) right now, against current MLS listings.

- [5-bedroom Carmel home under $1.5M with a finished basement and primary on main](https://www.ackee.ai/?nlq=5-bedroom%20Carmel%20home%20under%20%241.5M%20with%20a%20finished%20basement%20and%20primary%20on%20main)
- [Modern kitchens with islands](https://www.ackee.ai/?nlq=Modern%20kitchens%20with%20islands)
- [Open houses this weekend in Hamilton County](https://www.ackee.ai/?nlq=Open%20houses%20this%20weekend%20in%20Hamilton%20County)
- [Walkout basement, low-maintenance HOA, under $700k](https://www.ackee.ai/?nlq=Walkout%20basement%2C%20low-maintenance%20HOA%2C%20under%20%24700k)

**Photo intelligence.** Every photo in every active listing is read by a vision model, tagged with what room or feature it is, and described for what makes that specific shot distinctive. When a buyer searches "modern kitchens with stainless appliances and a big island," [Ackee.ai](https://www.ackee.ai) can return a wall of actual kitchens from across the market, not a list of addresses to click through one at a time.

**Conversational refinement.** Search is rarely one-shot. A buyer starts with "primary on main under $900K" and, looking at what came back, realizes they actually want a wooded lot. So they say that. The thread persists, can be pivoted or restarted, and the buyer can come back to it later.

That is the platform. It is listing-board-agnostic by design. Plug in an MLS feed, run the listing and photo pipeline, and the same experience that's running on MIBOR today runs anywhere.

## Going after Zillow, Redfin, Homes.com, and Realtor.com

[Ackee.ai](https://www.ackee.ai) is a direct competitor to the four portals that have defined home search for the last fifteen years. They are all running variations of the same product. Same dropdowns. Same numeric ranges. Same handful of architectural-style checkboxes. The differences between them are cosmetic: a different color palette, a different valuation widget, a different ad layout, a different agent-referral business model. Underneath, the search experience is identical.

Buyers don't love any of them. They use them because there has been no alternative. [Ackee.ai](https://www.ackee.ai) is the alternative.

Where the incumbents return rows that match a form, [Ackee.ai](https://www.ackee.ai) returns homes that match a sentence. Where they organize photos in a carousel that buyers have to manually click through, [Ackee.ai](https://www.ackee.ai) reads every photo and lets buyers search the photos themselves. Where they treat "modern farmhouse with a chef's kitchen and a walkout basement" as three checkboxes the database doesn't have, [Ackee.ai](https://www.ackee.ai) treats it as the actual query. Same MLS data underneath. Different primitive on top. The primitive is what wins.

## Why a platform, not a feature

For fifteen years the home-search interface has been a form. The form was a translation layer: buyers translated the home they could already picture into the closest categorical boxes the database accepted, the database returned rows, and the actual search (scrolling photos, asking *do I love this kitchen, could my kids grow up here*) started after.

The portal didn't search. It filtered. The buyer searched.

[Ackee.ai](https://www.ackee.ai) is built on a simple bet: the right primitive for real estate search is a sentence, not a form. Every other industry got there years ago. Real estate has been late because the data was ugly and the photos were noisy. Modern multimodal models change both of those constraints. Once a vision model can read a kitchen as well as a person can, photo-driven search stops being an enrichment project and starts being the product.

That is why this needed to be a platform. The same engine that reads MIBOR listings today reads NTREIS listings in North Texas, MRED listings in Chicago, MetroList in Sacramento, or BrightMLS across the Mid-Atlantic the moment we plug them in. The vocabulary is local. The architecture is not.

## Where it runs today

[Ackee.ai](https://www.ackee.ai) is live across the MIBOR service area, the largest listing board in Indiana, covering Indianapolis and the surrounding metro. Every active MIBOR listing has been read by the platform, and every photo has been read by the vision model. Buyers can run a sentence-level search across the full market right now.

## Where it's going next

[Ackee.ai](https://www.ackee.ai) is built to expand across listing boards. The roadmap is more MLSs, more metros, more buyer-facing surfaces running on the platform. Each new listing board is a data integration, not a product rebuild. The hard parts (the listing comprehension, the photo intelligence, the natural-language parsing, the ranking, the conversational layer) are built once and run everywhere.

If you operate a listing board, run a brokerage, or lead a search startup that wants to stop shipping the same form-shaped portal everyone else ships, the platform is built to host you. Reach out at [Ackee.ai](https://www.ackee.ai).

## The stack, briefly

Claude (Anthropic) for natural-language parsing and Claude vision for per-photo understanding. Postgres for the catalog. Next.js on Vercel for the front end. The same MLS data feed Zillow, Redfin, and Realtor pull from, refreshed throughout the day. Listings and photos get re-read as they change so the index stays current.

None of that matters to a buyer. What matters is that the layer humans actually shop in, the visible features, the design vibe, the *"feels like,"* is finally indexed and finally searchable. The boring filters still work underneath, and the rich layer above them is what the platform adds.

## Try a sentence

Type what you actually want into the search bar at [Ackee.ai](https://www.ackee.ai). Then refine. Pivot. Tell it what you actually want. That is the search experience real estate should have had a decade ago.

For platform inquiries, listing-board partnerships, or new market launches, the home base is [Ackee.ai](https://www.ackee.ai).

Real estate search has been a form for fifteen years, defended by four large portals shipping the same product in different colors. It does not have to stay that way. [Ackee.ai](https://www.ackee.ai) is the platform that changes the primitive, MIBOR is the first listing board, and the rest are next.
