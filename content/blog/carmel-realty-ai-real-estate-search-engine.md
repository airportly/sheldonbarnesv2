---
title: "Search the Way You'd Describe a Home: Carmel Realty's AI Search Engine"
description: "I built an AI-powered natural-language search bar for real estate. Describe the home you're picturing, in plain English, and matching listings across Hamilton County come back in seconds. No more endless scrolling for the perfect kitchen. No dropdowns. Just sentences."
date: "2026-04-27"
author: "Sheldon Barnes"
category: "industry-analysis"
tags: ["real-estate", "proptech", "carmel-realty", "carmel-indiana", "hamilton-county", "indianapolis", "mls", "ai-search", "semantic-search", "natural-language-search", "claude", "anthropic", "ai", "ai-products", "llm", "nlp", "multi-modal-ai", "image-recognition", "computer-vision", "product-launch", "ai-first", "the-platform-inversion"]
hero: "/carmel-realty-million-dollar-listing.png"
heroAlt: "Carmel Realty AI search results page showing a grid of million-dollar-plus listings in Carmel. The user's query 'Show me million-dollar homes in Carmel' was parsed into the exact filters that returned address, price, and photo for each match."
heroVideo: "/carmel-realty-ai-real-estate-search-engine.mov"
published: true
---

I just launched something I've wanted for a long time. An **AI-powered natural-language search bar** for real estate that makes finding your next home feel less like database work and more like talking to someone who actually listens.

Not `minPrice=600000, maxPrice=900000, beds≥4`. Not a maze of dropdowns. Just type what you actually want.

> "Updated kitchen with a chef's island, in Carmel, under $1M."

That sentence becomes a real-time search across every active listing in Hamilton County. Below the search box you'll see what the AI heard, so you can adjust the request the way you'd adjust a Google query.

It's live now at [mycarmelrealty.com](https://www.mycarmelrealty.com).

## How home search should actually work

Buying a home isn't shopping for a refrigerator. It's emotional. You're trying to picture your morning coffee on the back porch. The kids in the backyard. The in-laws around the dining table at Thanksgiving. The Saturday afternoons in the man cave with the right buddies and the right TV setup.

The MLS portals we've all used for two decades treat all of that like a database query. They make you click checkboxes for "modern" or "traditional" as if you can describe the vibe of a house in fifteen preset categories. You can't.

Home search should feel like describing the place you want, and getting back the homes that match.

No more endless searching for the perfect kitchen.
No more guessing whether the man cave is actually right.
No more scrolling through 200 listings hoping the next page has the backyard your dog deserves.

This is the experience I've wanted to build for years. It's finally here.

## Five ways to ask

Right under the search bar there are five **mode chips** that bias your query. Pick the one that matches what you're looking for, then describe what you want, in plain English.

> **Every example below is a live link.** Click any of them to run that exact query on [mycarmelrealty.com](https://www.mycarmelrealty.com) right now. Results come from current MLS data, so what you see is whatever is actually on the market this minute.

### 🏠 Homes, the everyday listing search

- [4 bedroom in Carmel under $900k with primary on main](https://www.mycarmelrealty.com/search?nlq=4+bedroom+in+Carmel+under+%24900k+with+primary+on+main&mode=homes)
- [Lakefront home with a dock](https://www.mycarmelrealty.com/search?nlq=Lakefront+home+with+a+dock&mode=homes)
- [Modern farmhouse on a wooded lot](https://www.mycarmelrealty.com/search?nlq=Modern+farmhouse+on+a+wooded+lot&mode=homes)
- [Walkout basement with a finished bar](https://www.mycarmelrealty.com/search?nlq=Walkout+basement+with+a+finished+bar&mode=homes)
- [Primary suite with a spa-style bath](https://www.mycarmelrealty.com/search?nlq=Primary+suite+with+a+spa-style+bath&mode=homes)

### 📸 Photos, see kitchens not addresses

This is the part I'm proudest of.

Toggle the **Photos** chip, and instead of a list of homes you get a wall of actual kitchens, primary baths, pools. Each photo comes from a different listing. Click any photo to jump straight to that home. The cards even auto-rotate through every matching photo *within the same listing*, so you see three angles of one kitchen without clicking in.

![Carmel Realty AI search in Photos mode. The query 'Modern kitchens with islands' returns a horizontal wall of kitchen photos from different listings, each card auto-rotating through additional kitchen angles within the same home, with AI feature concepts shown above the results.](/carmel-realty-modern-kitchens.png)

- [Modern kitchens with big islands](https://www.mycarmelrealty.com/search?nlq=Modern+kitchens+with+big+islands&mode=photos)
- [Backyard pools with covered patios](https://www.mycarmelrealty.com/search?nlq=Backyard+pools+with+covered+patios&mode=photos)
- [Spa-style primary baths](https://www.mycarmelrealty.com/search?nlq=Spa-style+primary+baths&mode=photos)
- [Finished basements with bars](https://www.mycarmelrealty.com/search?nlq=Finished+basements+with+bars&mode=photos)
- [Walk-in pantries](https://www.mycarmelrealty.com/search?nlq=Walk-in+pantries&mode=photos)
- [Outdoor fireplaces and fire pits](https://www.mycarmelrealty.com/search?nlq=Outdoor+fireplaces+and+fire+pits&mode=photos)

### 🆕 Just listed, only homes that hit the market this week

- [Just listed in Westfield](https://www.mycarmelrealty.com/search?nlq=Just+listed+in+Westfield&mode=recent)
- [Just listed in Fishers under $700K](https://www.mycarmelrealty.com/search?nlq=Just+listed+in+Fishers+under+%24700K&mode=recent)
- [Just listed in Carmel above $1M](https://www.mycarmelrealty.com/search?nlq=Just+listed+in+Carmel+above+%241M&mode=recent)

### 💸 Price drops, sellers who reduced this week

- [Price drops in Fishers under $700k](https://www.mycarmelrealty.com/search?nlq=Price+drops+in+Fishers+under+%24700k&mode=reduced)
- [Price drops in Carmel](https://www.mycarmelrealty.com/search?nlq=Price+drops+in+Carmel&mode=reduced)

### 🏗️ New construction, only brand-new builds

- [New construction in Carmel under $800K](https://www.mycarmelrealty.com/search?nlq=New+construction+in+Carmel+under+%24800K&mode=newcon)
- [New construction with 3+ car garage in Westfield](https://www.mycarmelrealty.com/search?nlq=New+construction+with+3%2B+car+garage+in+Westfield&mode=newcon)

## How it works, in plain English

Every active listing in our markets gets read by an AI model that pulls out everything a human looks for. The vibe of the home. The standout features in each room. Who'd love living there. What makes it different.

Every photo in every listing gets the same treatment. The model identifies what's in the photo (kitchen, primary bath, backyard, pool, finished basement) and writes a short description of what's special about that specific shot.

When you type a query, the system reads what you said the same way it reads the listings, and ranks every home in the market by how well it matches what you actually described.

It's the difference between a database that filters, and an assistant that listens.

## The Carmel difference

I started this rollout in Carmel. Every active listing in **46032, 46033, 46074, 46077, 46280, and 46290** has full, deep AI coverage on every photo.

[Hamilton County](https://www.mycarmelrealty.com/hamilton-county)'s other markets, **[Westfield](https://www.mycarmelrealty.com/westfield), [Fishers](https://www.mycarmelrealty.com/fishers), [Noblesville](https://www.mycarmelrealty.com/noblesville), and [Zionsville](https://www.mycarmelrealty.com/zionsville)**, are filling in fast and will be at full coverage shortly.

## Why I built it this way

The old MLS portal is a relic. Endless dropdowns. Numeric ranges. Architectural style as a checkbox list of fifteen options where "transitional" and "modern farmhouse" don't even appear. No way to describe the man cave you've been picturing for two years. No way to find that one specific kitchen you saved on Pinterest and can't get out of your head.

That's not a search experience. It's a form.

The model I built doesn't replace the MLS data. It sits on top of it. The address, school district, square footage, lot size, beds, baths, year built, all still there, all still indexed, all still filterable. What I added is **the layer humans actually shop in**. The visible features. The design vibe. The *"feels like."* The layer that used to require an agent walking you through twenty open tabs.

Now you type the sentence, and the agent's spreadsheet runs in the background.

## Try it

If you've been frustrated with cookie-cutter MLS portals, type a sentence into the new search and see what comes back.

It's at the top of [**mycarmelrealty.com**](https://www.mycarmelrealty.com).

And tell me what doesn't work yet. I'm tuning it constantly. Every query that doesn't return what you expected is a tuning input I want to see.
