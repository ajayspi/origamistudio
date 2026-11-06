# Origami Types Package

## Overview
Defines core TypeScript domain types, schemas, and interfaces for the OrigamiStudio computational origami engine, kit representations, cultural collections, and application viewing modes.

## Interface
- `DifficultyLevel` [origami.ts:DifficultyLevel]: Six-tier difficulty classification union (`'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Intermediate-Advanced' | 'Advanced' | 'Master'`).
- `CulturalCollectionId` [origami.ts:CulturalCollectionId]: Identifier union for cultural collection categories (`'indian' | 'japanese' | 'chinese' | 'american' | 'lotus' | 'butterfly' | 'geometric' | 'nativity' | 'holiday' | 'custom'`).
- `ViewMode` [origami.ts:ViewMode]: Top-level application routing union (`'hub' | 'pavilions' | 'studio' | 'image-to-origami' | 'print-guide' | 'kit-builder'`).
- `OrigamiStep` [origami.ts:OrigamiStep]: Step definition interface specifying sequence number, title, folding instructions, tip, warning, fold type, duration, and landmark points.
- `PaperSpec` [origami.ts:PaperSpec]: Physical paper attributes including size, color description, front/back hex colors, grammage (GSM), texture, and sheet count.
- `OrigamiKit` [origami.ts:OrigamiKit]: Full kit model containing identifiers, metadata, paper requirements, folding principles, goal description, and step instructions array.
- `CulturalCollection` [origami.ts:CulturalCollection]: Cultural pavilion metadata specifying titles, summaries, included pieces, color palettes, and difficulty levels.

## Invariants
- `DifficultyLevel` must resolve to one of the 6 defined literal difficulty tiers [origami.ts:DifficultyLevel].
- `ViewMode` values must correspond to registered view handlers in the top-level application router [origami.ts:ViewMode].
- Every `OrigamiKit` must include at least one step in its `steps` array [origami.ts:OrigamiKit].

## Side Effects
- None: Pure TypeScript type declarations with zero runtime execution or state mutations.

## Verification
- Run: `pnpm build`
