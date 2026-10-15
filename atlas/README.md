# Atlas Journal Showcase

Build a portfolio called ATLAS for Linathi Mqalo, a Cloud Security Engineer. This is one of three standalone portfolios - it does not need to match or connect to anything else. Build it as a complete, self-contained site.

## Concept

ATLAS is a printed technical journal rendered as a website. Think Monocle, MIT Technology Review, or a Klim Type Foundry specimen page. The portfolio is not a scrolling page — it is a bound volume you read by turning pages.

The two signature mechanics:
1. HORIZONTAL SCROLL on desktop. Each major section is a full-viewport "page." You navigate by scrolling horizontally or clicking page dots at the bottom. On mobile, this collapses to a normal vertical scroll.
2. EDITORIAL TYPOGRAPHY. Fraunces serif for display, Inter for body, JetBrains Mono for labels. Hairline rules, generous whitespace, and precise alignment. Restraint over effects.

If a page is too long for a single viewport, it scrolls vertically inside the horizontal track. Prefer fitting content to a single viewport; allow vertical scroll only when necessary.

## Color System

Light mode (default):
- Background: #F5F2ED (warm cream)
- Surface (used sparingly): #FFFFFF
- Hairlines: #E5E0D8
- Text headings: #1A1A1A
- Text body: #52525B
- Text meta: #8A8A8F
- Accent: #8B0D1A (deep burgundy)

Dark mode:
- Background: #0E0E10 (warm near-black)
- Surface: #17171A
- Hairlines: #26262B
- Text headings: #F4F1EA (warm cream)
- Text body: #B8B8BD
- Text meta: #6B6B70
- Accent: #C41E3A

The accent is used ONLY on: section numbers, link underlines, the "FEATURED" tag, the active nav dot, and the CTA border. Never as a background, never as a fill.

Hairlines are always 1px solid currentColor at 12% opacity in light mode and 18% in dark mode. Never coloured.

## Typography

Import via @import in the global CSS:
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

CSS variables:
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;

Type scale:
- Hero name: Fraunces 96px desktop / 52px mobile, weight 400, tracking -0.03em
- Section titles: Fraunces 64px desktop / 40px mobile, weight 400
- Subsection titles: Fraunces 32px
- Body: Inter 17px / 1.75 line-height, max-width 62ch
- Labels, nav, meta, tags: JetBrains Mono 11-12px, uppercase, letter-spacing 0.14em
- Numerals in stats: Fraunces 96px

## Layout — Desktop

The whole portfolio is a horizontal scroll container.

- scroll-container: width: 600vw, height: 100vh, display: flex, flex-direction: row, overflow-x: auto, scroll-snap-type: x mandatory
- Hide scrollbar (scrollbar-width: none; ::-webkit-scrollbar { display: none })
- Each section is a .page: width: 100vw, height: 100vh, scroll-snap-align: center
- If content overflows a page, the page itself has overflow-y: auto with a thin scrollbar
- Each page's content has padding-top: 96px, padding-bottom: 96px so nothing clips

A subtle page-flip transform is a nice-to-have. If time allows, apply:
- Container: perspective: 2400px
- Each page: transform-origin: left center; rotateY driven by scroll position (0deg when centered, ±25deg when off-center). Linear easing. If this causes bugs, skip it — the horizontal scroll alone is the point.

## Fixed UI Elements (desktop)

Left spine (fixed, left: 32px, vertically centered):
- A 1px vertical hairline, height 60vh, hairline color
- Above the top of the hairline: mono label "ATLAS · VOL. 01" (rotated 90° counter-clockwise, reads bottom to top)
- Below the bottom of the hairline: the page counter in mono, e.g. "01 / 05"

Top right (fixed):
- Mono "← GALLERY" link
- A theme toggle (sun/moon glyph), simple cross-fade

Bottom center (fixed):
- Six small dots, one per section (Cover + 5 sections)
- Active dot: accent colour, 6px diameter
- Inactive dots: text-meta, 4px diameter
- Hovering a dot shows the section name above it in mono
- Clicking smooth-scrolls horizontally to that section

Reading cursor (desktop only):
- An L-shaped bracket of two 12px hairlines, 1px stroke, accent colour at 60% opacity
- Follows the pointer with a 120ms lag
- Corner positioned 8px below-right of the cursor
- Fades out after 2s of no movement, fades in on movement
- Disabled on mobile and with prefers-reduced-motion

## Page Structure

COVER (id="hero")
No section number — it's the cover page.

Asymmetric editorial layout:
- Left 60%: the name "Linathi Mqalo" in Fraunces, 96px, spans two lines
- Right 40%: a vertical stack in mono and Inter:
  - "[ PORTFOLIO · 2026 ]"
  - A full-width hairline below
  - Role line: "Cloud · Infrastructure · Security · Systems" in mono, accent colour
  - Tagline: "Building and securing cloud infrastructure across AWS and Azure." in Inter, text-body
  - Location: "Johannesburg, South Africa" in mono, text-meta

Below, spanning full width:
- A single hairline
- Below it: "100+" and "5+" as Fraunces numerals, evenly spaced across the width
- Below each: mono labels "WEBSITES MANAGED" and "YEARS EXPERIENCE"

PAGE 01 - ABOUT (id="about")
Header:
- Mono "[ 01 - ABOUT ]" in accent colour, top-left
- Title "The Practice" in Fraunces 64px
- Full-width hairline below

Body — two columns:
- Left 40%: four pillars stacked vertically
  - Each: mono label (CLOUD / INFRASTRUCTURE / SYSTEMS / SECURITY) and a two-line Inter description
  - Separated by 32px vertical space
- Right 60%: bio paragraph with a drop cap on the first letter (Fraunces, 5em, floating left). Inter, max-width 62ch.

PAGE 02 - SKILLS (id="skills")
Header:
- Mono "[ 02 - SKILLS ]" in accent colour
- Title "The Index" in Fraunces 64px
- Full-width hairline below

Body — 9 skill groups in a 3-column grid (3 rows x 3 columns):
- Each cell: group name in Fraunces 22px, skills below in mono 11px comma-separated
- Hairlines between rows only (not between cells in the same row)
- Hover on a cell: a 3px accent vertical tick appears on the left edge of the row
- Mobile: 1-column, each group as a row with hairline below

PAGE 03 - EXPERIENCE (id="experience")
Header:
- Mono "[ 03 - EXPERIENCE ]" in accent colour
- Title "The Record" in Fraunces 64px
- Full-width hairline below

Body — each role as a three-column spread:
- Col 1 (20%): year range in mono, right-aligned, aligned to the top of the role title
- Col 2 (30%): role title in Fraunces 24px, then company + location in mono 11px text-meta below
- Col 3 (50%): bullets in Inter, each prefixed with a mono "·"
- Hairline below each role with 40px vertical space between roles

If 5 roles overflow 100vh at 1440x900, tighten: reduce bullets' line-height to 1.55, reduce padding between roles to 32px, reduce role title to 22px.

PAGE 04 - PROJECTS (id="projects")
Header:
- Mono "[ 04 - PROJECTS ]" in accent colour
- Title "Selected Work" in Fraunces 64px
- Full-width hairline below

Body:
- Two FEATURED projects, each a full-width spread:
  - Col 1 (15%): "FEATURED" in mono accent, then category, year, tags (stacked in mono text-meta)
  - Col 2 (65%): project title in Fraunces 56px, then description in Inter
  - Col 3 (20%): "VIEW →" in mono with an accent underline, right-aligned
  - Hairline between featured projects
- Four secondary projects in a 2x2 grid below:
  - Title in Fraunces 22px, description in Inter, tags in mono below
  - Hairline between rows
- Five compact projects in a single horizontal row below, 5 columns:
  - Title in Fraunces 14px, tags below in mono 10px
  - No VIEW link — these are index entries

Hover on any project title: accent underline draws in from left.

PAGE 05 - CONTACT (id="contact")
Header:
- Mono "[ 05 - CONTACT ]" in accent colour
- Title "Colophon" in Fraunces 64px
- Full-width hairline below

Body:
- "Let's build something." in Fraunces 72px
- Below, a 2-column grid of contact items:
  - Left column: mono labels (EMAIL, PHONE, LINKEDIN, GITHUB, LOCATION, RESPONSE TIME)
  - Right column: values in Fraunces 20px. Email is an underlined accent link with hover animation.
- Bottom of page: hairline, then mono line:
  "END · LINATHI MQALO · MMXXVI · SET IN FRAUNCES & INTER"

## Page Counter Numbering

- Cover: "COVER"
- About: "01 / 05"
- Skills: "02 / 05"
- Experience: "03 / 05"
- Projects: "04 / 05"
- Contact: "05 / 05"

## Motion

- Link underlines: background-size 0% → 100%, 200ms ease-out. This is the primary interaction language.
- Section numbers in headers: tick from "00" to their value over 400ms when the section enters the viewport (optional).
- Reading cursor follows pointer with 120ms lag.
- prefers-reduced-motion: disable reading cursor, disable page-flip transform, keep horizontal scroll but remove smooth transitions.

## Layout — Mobile (≤ 768px)

Completely different experience. Do NOT try to make the horizontal track work on mobile.

- Vertical scroll, top-to-bottom
- No horizontal track, no page-flip, no reading cursor
- No scroll-snap
- Site opens at Hero — window.scrollTo(0, 0) on mount
- Left spine becomes a small mono page counter fixed at the top-left of each section
- Nav dots become a small fixed stack at the bottom-right, single column
- All grids become single column:
  - About pillars stack
  - Skills: 1-column, each group as a row with hairline below
  - Experience: vertical stack — year in mono, role title in Fraunces 24px, company + location in mono, bullets in Inter
  - Projects: featured stacked, secondary stacked, compact stacked
  - Contact: labels above values
- Section padding: 64px top/bottom
- Hero name: 52px

## Accessibility

- All contrast ratios ≥ 4.5:1
- Focus rings: 2px accent, visible
- Keyboard: left/right arrows move between pages on desktop; Tab navigates within a page
- Semantic heading order
- Reading cursor is decorative only, aria-hidden

## Content

Use this exact content — do not change the words:

[LINATHI — paste your content.ts data here in a readable structure. Include profile, stats, pillars, skill groups, experience, projects (featured + secondary + compact), and contact.]

## What NOT to do

- No cards. No panels. No glass. No shadows.
- No gradients. No glow. No neon.
- No icons beyond "→" and "←".
- No emoji.
- No rounded corners on anything except avatars (there are none).
- No stock imagery. This is a typographic portfolio.
- No animations beyond what's specified.

## Final note

Build mobile-first. Test both viewports.

The signature of Atlas is restraint. If you're unsure whether to add a visual element, don't. Whitespace, hairlines, and typography carry the whole design. The horizontal page-flip is a bonus — the horizontal scroll and the editorial typography are the point.

Make it feel like a printed journal. Take your time with the typography scale and the hairlines.



## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
