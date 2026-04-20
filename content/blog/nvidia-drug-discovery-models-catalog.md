---
title: "NVIDIA AI Enterprise for Life Sciences: 14 Drug Discovery Models, Mapped"
description: "Filter NVIDIA AI Enterprise's model catalog to Life Sciences and 14 models appear — spanning genomics, structure prediction, binder design, molecule generation, and docking. Here's where each one sits in the drug discovery pipeline, and what's conspicuously still missing."
date: "2026-04-20"
author: "Sheldon Barnes"
category: "ai-drug-discovery"
tags: ["nvidia", "nvidia-ai-enterprise", "bionemo", "nvidia-nim", "ai", "artificial-intelligence", "generative-ai", "foundation-models", "enterprise-ai", "pharma", "pharma-ai", "life-sciences", "biotech", "drug-discovery", "ai-drug-discovery", "openfold3", "alphafold", "alphafold2", "boltz-2", "esm2", "evo-2", "rfdiffusion", "proteinmpnn", "molmim", "genmol", "diffdock", "protein-folding", "protein-structure-prediction", "structural-biology", "molecular-generation", "molecular-docking", "protein-binder-design", "the-platform-inversion"]
hero: "/ackee-logo.jpeg"
heroAlt: "Ackee mark — the brand for Sheldon Barnes' AI-first scientific tooling"
published: true
---

Filter **NVIDIA AI Enterprise's** model catalog to *Life Sciences* and **14 models** appear — spanning inputs, structure prediction, binder design, molecule generation, and docking. Alongside them sits at least one reference **blueprint** that stitches the pieces together into a working workflow.

That's not a grab bag. It's a map.

Read it carefully and the shape of NVIDIA's bet becomes obvious: the future of drug discovery isn't any single model winning — it's **composability across stages**, delivered as accelerated NIM microservices you can assemble into pipelines without owning the infrastructure that used to gatekeep this work. Most of these are deployed as NIMs; several of the biology-native ones (OpenFold, ESM2, MolMIM, GenMol) trace back to NVIDIA's **BioNeMo** framework, the biology-specific subset of the broader AI Enterprise platform.

Here's where each model sits.

## Inputs and foundations

These three don't produce drug candidates. They produce the *representations* that everything downstream needs.

- **ESM2-650M (Meta)** — generates protein embeddings from amino acid sequences; the universal substrate most protein models consume as input.
- **Evo-2-40B (Arc Institute)** — a biological foundation model that reasons over long genomic sequences while staying sensitive to single-nucleotide changes. Useful wherever the question is "what does this piece of DNA actually do?"
- **msa-search (ColabFold)** — generates multiple sequence alignments from a query sequence against a protein database, feeding the alignment inputs that structure-prediction models need to be accurate.

## Sequence to structure

This is the most crowded cluster — five models for the same fundamental problem, each with a different trade-off.

- **AlphaFold2 (DeepMind)** — the original sequence-to-structure model that changed the field; predicts a single protein's 3D fold from its amino acid sequence.
- **AlphaFold2-Multimer (DeepMind)** — AlphaFold2 extended to protein complexes where multiple chains interact.
- **OpenFold2 (OpenFold)** — open-source AlphaFold2 re-implementation with the same core approach: sequence plus MSA plus templates yields a 3D structure.
- **[OpenFold3](/blog/openfold3-nvidia-ai-enterprise-molecule-viewer) (OpenFold)** — third-generation biomolecular foundation model that predicts **molecular complexes** in a single pass: proteins, DNA, RNA, and ligands together. This is the one I used to build my voice-guided molecule viewer; it's the closest thing available today to a general "biology geometry" model.
- **Boltz-2 (MIT)** — predicts complex structures with a different architectural approach; useful as a second opinion when you want to cross-check a fold.

## Binder design

Once you have a structure, the next question is *"what binds it?"* — and the catalog answers it with two complementary models and a reference pipeline that stitches them together.

- **RFDiffusion (Institute for Protein Design)** — a generative model of protein *backbones* for binder design. Conceptually: "draw me a shape that will fit against this target."
- **ProteinMPNN (Institute for Protein Design)** — given a backbone, predict the *amino acid sequence* that will fold into it. Backbone first, sequence second.
- **Protein Binder Design Blueprint (NVIDIA)** — a reference pipeline combining generative AI with NIM microservices to design binders end-to-end. This is the shape of what NVIDIA wants every capability in the catalog to become: not a model, but a *workflow*.

## Small-molecule generation

Binders are proteins. Historically, drugs are small molecules. Two different architectural bets on generating them.

- **MolMIM (NVIDIA)** — performs *controlled* molecular generation, finding molecules with the property profile you specify.
- **GenMol (NVIDIA)** — fragment-based molecular generation by discrete diffusion. A different architectural approach to the same problem space.

## Docking

You have a candidate molecule. You have a target protein. Does it actually bind?

- **DiffDock (MIT)** — predicts the 3D interaction between a small molecule and a protein target. This is the step before in-silico screening becomes meaningful.

## What's conspicuously missing

The catalog is strong where *geometry and generation* dominate. It is much weaker where *prediction of downstream properties* dominates.

- **ADMET and toxicity.** No first-class model for absorption, distribution, metabolism, excretion, or toxicity prediction. This is where molecular candidates die in real pipelines, and the catalog is silent.
- **Molecular dynamics.** Structure is static; function is dynamic. Models that simulate how a structure *moves* over nanoseconds to microseconds aren't here.
- **Clinical-phase models.** Patient-response prediction, pharmacokinetic modeling, trial-enrichment — none of these are in the catalog. Drug *discovery* upstream of the clinic is being eaten by AI; drug *development* inside the clinic, largely, is not yet.

That last gap is the single most valuable frontier in drug discovery, and it's conspicuous by its absence. Whoever builds the equivalent of OpenFold3 for *clinical response* will own a market bigger than the structure-prediction one.

## The point isn't the catalog — it's the composition

Fourteen models is impressive. The reference blueprint is more impressive. Because the real bet isn't that any single model wins — it's that **drug discovery becomes a pipeline of API calls**, each one an accelerated NIM microservice, each one composable with the others, each one abstracted away from the infrastructure that used to be the gatekeeper.

That's the platform bet.

And that's why I built a [voice-guided molecule viewer](/tools/ai-voice-guided-molecule-viewer) on top of OpenFold3 — not because the prediction is magic, but because the prediction is now *callable*. Once something is callable, it can be made accessible. A medical student can now hear a narrated walkthrough of a protein-DNA complex that was a peer-reviewed paper a decade ago.

That's the [Scientific Visual OS](/blog/scientific-visual-os-nvidia-renders-drug-discovery) taking shape, one model at a time.
