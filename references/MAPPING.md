# Reference assessment and adaptation map

The original three prompt documents are preserved separately without changing their bodies. Prompt 3 is byte-identical to the pinned release's `docs/RECREATE.md`. Source release: `v1.0.0`, commit `5779ec0762559b84bd5da3b6ffccf76e747f7587`.

| Reference | Preserved implementation | Adopted for Carnage X-Ray | Deliberate adaptation |
|---|---|---|---|
| VEYRA | Complete pinned repository in `veyra-interactive-car/`, original license, media, CSS and hover state machine | Original vehicle, image-relative hotspots, selection feedback, reversible navigation, independent appearance variants | Near-black surrounding workspace; original blue media unmodified. Educational content uses a separately labeled schematic rather than claiming concept cutaways are validated internals. More components, 6 modes, category applicability and reading panel replace the original four-point design study. |
| NOVA_AI | Separate React reproduction in `nova-ai/` | Editorial cinematic hierarchy, transparent UI, once-only reveals, purposeful scroll progression | Carnage does not use abstract AI video or the portrait. Its primary content is automotive. No forced 80vh spacer in the learning app. Reference retains its spacer, fonts, asset URLs and copy. |
| Amber capabilities | Standalone HTML/CSS/JS section in `amber-capabilities/` | Amber headline, quiet glass, three wireframe technical illustrations, once-only entrance, stacked mobile panels | Infrastructure copy becomes engineering/network/security pathways. No supplied wireframe image files exist; locally authored SVG diagrams are clearly documented alternatives, not identical original images. |

## Conflicts and limits

- The VEYRA concept is electric, not an ICE engineering model. Carnage initially explores a representative **connected electric vehicle**. Category filters reveal conventional, electrified and ADAS topics in a conceptual map; they never claim the pictured car physically changes type.
- VEYRA prohibits a multi-page design study, while Carnage requires an educational multi-page product. The unchanged original remains separate; Carnage is explicitly an adaptation.
- VEYRA media provenance includes AI-created concept images. They are the supplied original assets, not unrelated replacements. They are never used to establish precise physical placement.
- No 3D model or validated CAD exists in the VEYRA release. Following the user's request for real pointer-driven 3D separation, the product also uses the separately attributed Car Concept GLB by Eric Chadwick / DGG (CC BY 4.0), obtained from Khronos glTF Sample Assets. This is a visibly separate design study, not the same vehicle as the original media. Its actual modeled exterior parts rotate and separate; no missing battery/ECU geometry is fabricated. The default is now 3D, with the original study and functional system map available separately.
- No original NOVA localhost source, screenshot, or source code was provided. Its prompt can be implemented, but pixel identity to an inaccessible localhost page cannot be verified.
- NOVA media has no explicit redistribution license supplied. Reference uses the exact remote URLs; those assets are excluded from Carnage. No portrait or abstract video is copied into the product.
- Amber's exact image assets are unspecified. Wireframe SVG alternatives require no paid assets and are original project illustrations. Exact icon-image matching is blocked by missing originals.

## Source and asset methodology

General engineering comes from US DOE AFDC and public manufacturer technical explanations. Cybersecurity statements link to NHTSA, OWASP, ISO's public abstract, primary research and protocol-owner documentation. ISO's full paid standard is not bundled or claimed as read. Guidance is distinguished from documented research and implementation-dependent defenses. Access dates and claim scopes are in `src/data/sources.ts`.
