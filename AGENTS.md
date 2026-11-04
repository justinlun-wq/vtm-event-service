# VTM Event Service — Agent Instructions

Read README.md and skills/edit-event-page/SKILL.md. This is a portable static website; Python and Node use built-in modules only. No credentials are needed.

## Accepted direction

- B is primary at dist/index.html and dist/b-event-journey.html. Retain A, B, C and comparison pages.
- B hero has real service-related photographs behind readable overlay text. Mouse hover, keyboard focus and touch/click select the same photo, copy and journey. Respect reduced motion.
- Use **Team Building**, never Team Spirit. Copy uses concise written Hong Kong Traditional Chinese with spaces around English and numbers.
- Keep white cards, neutral page backgrounds and inner theme accents; do not restore full-width theme-color bands.
- Keep illustrated timed steps, takeaway tickets and scoped galleries. 30 people, 2.5 hours and 90 m² are planning examples, not verified client outcomes.
- Preserve the 19 approved references, including Safety Forum 2024 and GCSFE 2023: 15 albums / 49 photos and four document-only records. Do not invent photos or claim clients bought the proposed programs.
- Keep Sino Inno Lab under Team Building, newest-first albums, the landscape June school cover, bounded portrait frames and professional CTAs.

## Source map

| Source | Responsibility |
| --- | --- |
| build.py | Program names, shared page shell, asset composition, output mapping |
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

./setup.sh checks prerequisites and runs the same sequence. qa/ is ignored generated test output. Open dist/index.html, or use python3 -m http.server 8000 --directory dist. After visual changes check 390px, 768px and desktop widths, hero readability, all three selections, keyboard focus and a portrait photo dialog. Report any browser checks that could not be performed.

## Boundaries

- Never add API keys, tokens, cookies, .env values, personal machine paths, internal provenance or private customer records.
- This copy excludes original Site identity and deployment credentials. Keep deployment independent.
- Do not deploy VTM WordPress, update the existing private preview, change access or enable automatic publishing without explicit owner authorization.
- Do not invent photo permissions or delivered work. Public source availability does not relicense photographs or branding.
- Keep assets bundled; do not add tracking or remote scripts for routine edits.
- Add Chinese comments for nontrivial behavior. Return a full modified ZIP or reviewable branch with regenerated dist, validation results and limitations.
