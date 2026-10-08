---
title: "Who Follows Whom: An Influence Map of the Bond Circuit Split"
description: "An interactive network of all 21 opinions in the INA 235(b) bond split, showing which circuits adopt, answer, or echo each other, the shared phrases that travel between them, and the Supreme Court cases both sides lean on."
date: "2026-10-08"
author: "Sheldon Barnes"
category: "law-and-policy"
tags: ["immigration", "supreme-court", "circuit-split", "citation-network", "bond-hearings", "legal-visualization", "law-school"]
hero: "/images/bond-split/influence-social.png"
heroAlt: "A ring of 21 circuit opinions connected by green and red arcs showing which courts adopt or reject each other on the immigration bond question"
socialImage: "/images/bond-split/influence-social.png"
skipHero: true
published: true
---

My [circuit map](/blog/immigration-bond-circuit-split-map-and-data) shows where each court landed, and my [statute map](/blog/statute-map-immigration-bond-split) shows how each court read the words. This last piece shows something the first two cannot: how the opinions talk to each other. Which courts adopt another circuit's reasoning, which answer it, which quietly borrow its phrasing, and which lean on the same Supreme Court cases.

A circuit split is usually described as a scoreboard, nine to two. But the opinions are not independent votes. They are a conversation that ran from February to September, each court reading the ones before it, joining some and rejecting others. That conversation is the thing this map draws.

## How to read it

Twenty-one opinions sit on the ring, eleven majorities, nine dissents, and Judge Cabranes's concurrence, placed in the order they were decided. Blue is a bond reading, orange is a mandatory-detention reading, and a hollow node is a dissent or concurrence. The three buttons switch what the links mean.

**Citations** draws who cited whom. A green arc means the citing opinion adopts or agrees with the one it points to, red means it rejects it, and a dashed gray line means it distinguishes or just discusses it. Tap any node to open it and read every relationship in the court's own words, with a pin cite. Bigger nodes are the ones other courts follow most.

**Shared language** lights up the opinions that use the same distinctive phrase. Each phrase is marked as coined in this litigation or borrowed from an earlier source, so you can tell an original turn of phrase that spread from a stock quotation everyone reached for.

**Shared authority** lights up the opinions that lean on the same Supreme Court case, colored by which side they cite it for.

{{influence-map}}

## What the map shows

Of the 94 citations between these opinions, 55 adopt or agree, 20 reject, and 19 are neutral. The shape that produces is lopsided on purpose.

**The bond side built a consensus; the government side did not.** The nine bond-side majorities cite each other again and again with joinder language, "we join the Second and Eleventh Circuits," "we agree," "we adopt." By the time the Third and Fourth Circuits wrote in late summer, they were stitching together seven prior opinions. The two government majorities, the Fifth and Eighth, sit off to one side. The Eighth leans almost entirely on the Fifth, and after that the government reading stops spreading. Later courts cite the Fifth and Eighth constantly, but mostly to answer them, which is why so many of the arcs pointing at those two nodes are red.

**The dissents formed their own network.** This is why the map tracks opinions rather than whole courts. Judge Murphy's dissent in the Sixth Circuit leans on Judge Lagoa's dissent in the Eleventh. Judge Bea's dissent in the Ninth adopts Judge Murphy's. Judge Dunlap's dissent in the First expressly adopts Lagoa, Murphy, and Sykes. The judges who would hold for mandatory detention were quietly building a bench of their own, citing each other's separate writings the way the majorities cited each other's holdings.

**Some phrases traveled.** The "elephants in mouseholes" line, borrowed from the Supreme Court's Whitman decision, shows up in nine of the twenty-one opinions, used by the bond side as a weapon and thrown back by the Fifth Circuit, which insisted its reading "is no mousehole." The warning that the government's view would mean the largest mass detention in the nation's history, coined in this litigation, spread to eight opinions. The college-applicant analogy, first pressed by the Fifth Circuit, was picked up and then rejected by four later courts.

**Both sides fought over the same precedents.** Jennings v. Rodriguez appears in nineteen of the twenty-one opinions, cited by both sides for opposite conclusions. Nielsen v. Preap and Zadvydas v. Davis are close behind. Loper Bright shows up in eight opinions and is claimed by no one, cited by everyone only as the neutral standard for reading a statute.

## My take

The scoreboard says nine to two, and that makes the question look nearly settled. The influence map complicates that. Almost all of the reasoning on the winning side flows from one early decision, the Second Circuit's, and almost all of the losing side flows from another, the Fifth. Strip away the opinions that simply adopt one of those two, and the split is closer to a disagreement between two thoughtful courts that the rest lined up behind. That is worth remembering when the government argues, as it surely will, that nine circuits cannot all be wrong. Nine circuits can be nine readings of the same two or three opinions.

It also tells me where an amicus brief is useful and where it is not. The textual arguments have been made and remade twenty-one times, and the map shows them converging. What has not been tested anywhere in this conversation is the empirical premise underneath the government's reading, the idea that bond availability drew people across the border. That is the gap the [data](/blog/immigration-bond-circuit-split-map-and-data) speaks to, and it is where I plan to aim.

## Method and sources

The nodes are the twenty-one opinions. An edge is drawn when one opinion cites another of these cases, and I classified each as adopts, agrees, distinguishes, rejects, or discusses after reading the passage in context. Every quotation is copied verbatim from the court's slip opinion and carries a pin cite checked against the Westlaw version. The shared-language and shared-authority layers come from the same reading, counting a phrase or a precedent only where it genuinely recurs, not where it merely tracks the statutory text.

The classifications are my own judgment, and the close calls, a citation that both leans on a case and criticizes it, could reasonably be labeled either way; those are marked as mixed. The network detection was built from the opinions themselves and then verified by hand, the same process behind the other two maps. If you think I have a link miscast, [tell me](/contact) and I will look again.
