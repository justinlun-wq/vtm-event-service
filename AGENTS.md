# VTM Event Service — Agent Instructions

Read README.md and skills/edit-event-page/SKILL.md. This is a portable static website; Python and Node use built-in modules only. No credentials are needed.

## Accepted direction

- Overall layout follows the supplied colleague Event Case Design v2 PDF/HTML. Keep its navy/white/teal styling, page proportions; size selectors belong inside demo detail pages only (no homepage scale filter); make only the owner-requested local changes. The homepage photo section is an album gallery: exactly one cover per event, with zoom/previous/next restricted to that event’s photos. Keep album filters/search and the full selected collection.

- The main section presents exactly five demo program categories from demos.json/demo_plans.py, not a portfolio list. Each has three explicit illustrative size configurations, floorplans, schedules and equipment/staff examples. Desktop has five category-Icon-thumbnail cards in one row; mobile scrolls the same row horizontally. Each card has a separate real-photo reference link to an actual event Portfolio. Detail pages also include contextual reference photos. All planning figures must be labelled as examples. Legacy true-event details from cases.json remain for shared URLs but are unlisted from the main collection. Retain A, B, C and comparison pages; B remains at dist/b-event-journey.html.
- B hero has real service-related photographs behind readable overlay text. Mouse hover, keyboard focus and touch/click select the same photo, copy and journey. Respect reduced motion.
- Use **Team Building**, never Team Spirit. Copy uses concise written Hong Kong Traditional Chinese with spaces around English and numbers.
- Keep white cards, neutral page backgrounds and inner theme accents; do not restore full-width theme-color bands.
- Keep illustrated timed steps, takeaway tickets and scoped galleries. 30 people, 2.5 hours and 90 m² are planning examples, not verified client outcomes.
- Preserve the 19 approved references, including Safety Forum 2024 and GCSFE 2023: the original 15 albums / 49 photos and four document-only records. Add HAESL as the twentieth reference: six web-optimised photographs, bringing the selection to 16 albums / 55 photos. Do not invent photos or claim clients bought the proposed programs.
- Keep Sino Inno Lab under Team Building, newest-first albums, the landscape June school cover, bounded portrait frames and professional CTAs.

- Use actual dates/participation/content where numeric case measurements are absent. Justin confirmed on 2026-11-23 that the HAESL photos and supplied aviation safety plan belong in one case. Retain the legacy aviation-safety detail and old case-haesl.html redirect for previously shared URLs; do not feature that client case as a demo-program category. Keep planning examples separate.
- HKIC (Sheung Shui), 2026-10-29, uses six owner-authorized web selections. Show HKIC in the real-event Album Gallery only; its old detail remains for shared URLs, and all 22 originals stay in private Library. The five program categories are the owner’s explicitly requested demo collection.
- Case-page enquiry prepares a mailto draft; display that the visitor must confirm/send in their email client.

## Source map

| Source | Responsibility |
| --- | --- |
| build.py | Build entry and original A/B/C shell |
| case_page.py, cases.json | Main shell/gallery and unlisted legacy real-event details |
| demos.json, demo_plans.py, demo-plans.js, demo-plans.css | Five illustrative programs, 15 floorplans, responsive category row and size/detail interactions |
| case-page.css, case-page-overrides.css, case-page.js | Responsive case layout, filters, gallery search, capacity estimator, mailto draft |
| visitor_layouts.py | A/B/C and comparison markup |
| visitor.js | Public copy, activity rendering, hero selection, enquiry logic |
| visitor.css, program-design.css | Responsive hero, journeys, illustrations, takeaway cards |
| references.json | Sanitized public reference payload |
| references.js, references.css | Galleries and modal dialogs |
| timeline-icons.js | Decorative SVG timeline visuals |
| scroll-guide.js, scroll-guide.css | Named A-page reading guide |
| dist/assets/ | Self-contained real photographs and logo |

## Edit and verify

Edit source, then regenerate dist. Never change only generated HTML.

```sh
python3 build.py
node verify.cjs
python3 verify_html.py
```

./setup.sh checks prerequisites and runs the same sequence. qa/ is ignored generated test output. Open dist/index.html, or use python3 -m http.server 8000 --directory dist. After visual changes check 390px, 768px and desktop widths, case/detail navigation, filters/search, capacity presets and invalid inputs, enquiry field preservation and validation, floorplan zoom/focus return, all three original service selections and a portrait photo dialog. Report any browser checks that could not be performed.

## Boundaries

- Never add API keys, tokens, cookies, .env values, personal machine paths, internal provenance or private customer records.
- This copy excludes original Site identity and deployment credentials. Keep deployment independent.
- Do not deploy VTM WordPress, update the existing private preview, change access or enable automatic publishing without explicit owner authorization.
- Do not invent photo permissions or delivered work. Public source availability does not relicense photographs or branding.
- Keep assets bundled; do not add tracking or remote scripts for routine edits.
- Add Chinese comments for nontrivial behavior. Return a full modified ZIP or reviewable branch with regenerated dist, validation results and limitations.

- The five main cards use category Icon thumbnails (floorplans are in details), illustrative area ranges and a distinct real-event reference photo block underneath. Keep planning examples separate from actual Portfolio records. Keep accessible labels and detailed planning explanations.

- The three-goal comparison uses distinct 150-minute planning timelines: XR 20/95/35, Team Building 15/110/25, industry 30/80/40. Photo references show scene evidence only; never present unrelated actual events as proof that a hypothetical program or its numbers were delivered.
