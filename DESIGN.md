# Carnage X-Ray design contract

An educational vehicle explorer and connected reference library for curious beginners and technical readers. Primary action: select a vehicle system and understand its operation before its security implications.

Adjectives: precise (image-relative anchors, explicit diagrams), cinematic (large original vehicle media), restrained (quiet rules, limited amber), connected (related-topic links), credible (sources and applicability). Essence: **inspect, connect, understand**.

Direction: an automotive technical atlas, with an open studio composition and an amber crosshair as its signature. The exterior introduces the machine; a labeled conceptual system map reveals relationships. The car occupies the largest region. Editorial indexes replace dashboard tiles.

Considered directions: a CAD workstation would imply validated geometry; a cinematic showroom would hide the learning tools; a technical atlas combines authored vehicle imagery with honest schematics and readable knowledge. The supplied references select the latter.

## Tokens

- Display/body: self-hosted Space Grotesk, 400/500/600; mono: self-hosted JetBrains Mono 400. Space Grotesk echoes the primary automotive reference. Reference reproductions retain their specified fonts.
- Type: 16px body, 1.25 modular ratio (12.8, 16, 20, 25, 31.25, 39.06); cinematic headings fluid up to 92px. Long-form line height 1.7, measure 68ch.
- Background: oklch(0.15 0.004 250); surface: oklch(0.19 0.004 250); raised: oklch(0.23 0.005 250).
- Foreground: oklch(0.94 0.005 85); muted: oklch(0.72 0.012 85); border: oklch(0.31 0.005 85).
- Accent: oklch(0.81 0.13 76); accent foreground: oklch(0.17 0.02 76). Success: oklch(0.78 0.10 160); warning uses amber; error: oklch(0.75 0.14 25).
- Spacing: 4px base, 8/12/16/24/32/48/64/96. Radius: 4px, 12px. Defined borders; no elevation shadows.
- Motion: 160ms controls, 260ms mode transitions, 700ms once-only section reveals. Ease-out. Reduced motion disables transforms and scroll-linked changes. No continuous idle renderer.

## Layout and interaction

Persistent compact navigation; responsive menu with focus restoration. Home frames the vehicle as the primary subject. Explorer has a system list, dominant car/map, and a reading panel. On phones these stack with native selects as shortcuts. Every hotspot is a button, at least 44px. Selected state has a number/check, border, and text, not color alone. All hover actions have focus/click equivalents. Search has a real label and explicit empty results. Local bookmarks never imply an account or sync.

Amber capabilities deliberately adopts the supplied amber gradient, restrained glass, and wireframe motifs. These are explicit user requirements overriding generic style prohibitions. Icons are local SVG schematic illustrations, not fabricated automotive internals or substituted raster assets.

## Imagery and accuracy

Original VEYRA media copied byte-for-byte with MIT license. Its blue studio remains blue: no recoloring or counterfeit new vehicle renders. Conceptual overlays are labeled, and no cutaway is used as engineering evidence. Network links are derived from the content graph and identify interface types; they do not assert wiring routes.

## Audit

Pending browser review. Check vehicle dominance, reading measure, responsive overflow, keyboard targets, contrast, motion, meaningful controls, and the distinction between concept media and system relationships.
