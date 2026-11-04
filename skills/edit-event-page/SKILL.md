---
name: edit-event-page
description: Modify and verify the portable VTM event service website.
---

# Edit the event page

Input: an authorized visitor-copy, layout, interaction or approved asset change.
Output: updated source and regenerated dist pages, with verification results.

1. Read AGENTS.md; find the relevant source from its file map.
2. Implement only the requested change; retain B primary, Team Building terminology, accessible service switching and approved references.
3. Run from the repository root:

```sh
python3 build.py
node verify.cjs
python3 verify_html.py
```

4. Open dist/index.html. Check phone/desktop layouts, mouse hover, keyboard, touch/click, reference dialogs and enquiry links. State if visual QA is unavailable.
5. Return a complete modified ZIP or reviewable branch, including source and dist.

Never include secrets, internal source records or personal paths. Do not change sharing or deploy the live website/private preview without explicit owner authorization. Preserve photo ownership, factual event identities and distinctions between planning examples and delivered work.
