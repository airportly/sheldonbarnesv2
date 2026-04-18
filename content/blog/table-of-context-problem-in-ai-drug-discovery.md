---
title: "The Table of Context Problem in AI Drug Discovery"
description: "AI drug discovery isn't waiting on better models — it's waiting on biology to catch up. The 'table of context' for a single molecule, and what it means for timelines."
date: "2026-04-18"
author: "Sheldon Barnes"
category: "ai-drug-discovery"
tags: ["ai-drug-discovery", "alphafold", "dark-proteome", "pharma", "longitudinal-data", "the-platform-inversion"]
hero: "/blog/table-of-context-drug-discovery.png"
heroAlt: "Diagram showing the layers of context required for a single drug molecule — molecular structure, protein binding, ADME profile, toxicity, signaling pathways, patient population variance, dark proteome, and unknown unknowns — with a context complexity meter at 92%"
published: true
---

Finding a new habitable planet is one of the hardest problems in science. You are not just looking for a rock at the right distance from a star. You need the right atmosphere, magnetic field, water cycle, geological activity, and probably conditions we have not even thought to measure yet. The search space is enormous, and our instruments are still catching up to the question.

AI drug discovery has the same structure. And I think that comparison matters for how we set expectations.

I have been thinking about something I am calling the **table of context**. When you use AI to build a web application, you feed it context: the design system, the API schema, and the end user profile. That table is bounded. You can fill it. And when you do, the AI performs.

Now think about a single drug molecule.

The table of context for that molecule includes its 3D conformation, the target protein it needs to bind, every off-target pathway it might accidentally touch, how the liver metabolizes it, how the kidneys clear it, whether it crosses the blood-brain barrier, and how it behaves differently across patients with varying genetics and comorbidities. That is only the *known* context. A significant portion of the human proteome remains uncharacterized — proteins that exist, that we know exist, but whose function we have not yet described. No amount of GPU compute closes that gap. The biology simply has not been studied yet.

## AlphaFold solved one layer, not the table

AlphaFold was a genuine breakthrough. Protein folding was a hard problem, and it got solved. But folding is one layer of the table of context. Getting the molecule to the right location and at the right concentration, without triggering unintended effects elsewhere, involves dozens of additional layers that interact in ways that are still not fully mapped.

We are not waiting on the models. We are waiting for science to catch up to the question.

## A realistic timeline

Five to ten years for meaningful breakthroughs feels right to me, and conservative. This is not pessimism. It is respect for the size of the search space.

## Where the winners will invest

The companies that will win here are the ones investing now in building the table of context, not just deploying AI on top of incomplete data:

- **Longitudinal patient datasets** — the same patients, tracked across decades, across treatments
- **Mechanistic biology** — understanding *why* a pathway behaves the way it does, not just that it does
- **Pathway mapping** — filling in the dark corners of the proteome

That is the foundation. The AI is only as good as the context it has to work with.

## We are early in the expedition

The tools are real. The momentum is real. But this is still the discovery phase of a very long journey.
