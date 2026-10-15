# The Source Work

Build a standalone site called THE ARCHIVE — a documentary-style portfolio
of Linathi Mqalo's technical work. It is the source material behind three
other portfolio interpretations (Atlas, Obsidian, Substrate) — this is
where the actual work lives.

The Archive is NOT an aesthetic piece. It is the honest, technical,
no-frills presentation of the work. Its job is to be readable, navigable,
and shareable. Every case study has its own URL. Every project is
reachable in two clicks. Nothing is hidden.

## Concept

The Archive is a technical reader. It has two modes and three page types:

Two modes:
- LIGHT MODE (default) — warm paper, editorial, documentary. This is for
  reading long case studies comfortably.
- DARK MODE — near-black, precise, technical. This is for browsing the
  project index and skimming.

The mode is not a theme toggle — it's a distinction between "reading" and
"browsing." Case study pages default to light. The projects index defaults
to dark. The user can toggle either way, and the choice persists.

Three page types:
1. INDEX PAGE (/) — the projects grid. Dark mode default.
2. PROJECT PAGE (/projects/[slug]) — one case study, long-form. Light mode
   default.
3. ABOUT PAGE (/about) — brief context for the archive. Light mode default.

## Typography

Load via @import:
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

CSS variables:
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;

Type scale:
- Page titles (index): Fraunces 72px, weight 400, tracking -0.02em
- Case study title: Fraunces 56px, weight 400
- Section headers in case study: Fraunces 32px, weight 500
- Subsection: Inter 20px, weight 600
- Body: Inter 17px / 1.75, max-width 72ch
- Code blocks: JetBrains Mono 14px / 1.6
- Labels, nav, meta: JetBrains Mono 11-12px, uppercase, tracking 0.14em

## Colour System

LIGHT MODE (default for reading):
--bg: #F5F2ED
--surface: #FFFFFF
--hairline: #E5E0D8
--text: #1A1A1A
--text-muted: #52525B
--text-dim: #8A8A8F
--accent: #8B0D1A
--code-bg: #F0EDE6
--code-text: #3B3B3B

DARK MODE (default for browsing):
--bg: #0E0E10
--surface: #17171A
--hairline: #26262B
--text: #F4F1EA
--text-muted: #B8B8BD
--text-dim: #6B6B70
--accent: #C41E3A
--code-bg: #1C1C1F
--code-text: #D8D8D8

The accent is used ONLY on: the active nav item, link underlines, and
section anchors. Never as a fill. Never on backgrounds.

## Layout — Every Page

Fixed top bar, 64px, backdrop-filter blur(12px) at 70% opacity:
- Left: mono "← GALLERY" back link
- Center: mono nav — "INDEX · ABOUT"
- Right: theme toggle (sun/moon glyph, cross-fade)

Footer on every page:
- Full-width hairline, 48px vertical padding
- Mono "ARCHIVE · LINATHI MQALO · MMXXVI"
- Right-aligned mono "SET IN FRAUNCES, INTER & JETBRAINS MONO"

## Page 1 — INDEX (/)

The landing page. A grid of all projects. Dark mode by default.

Header:
- Mono top-left: "[ INDEX ]"
- Large Fraunces title: "The Work"
- Below: one-line Inter description: "Every project, its case study, and the reasoning behind it. Nothing hidden."
- Full-width hairline below

Project grid:
- Each project is a card-like entry, but NOT visually boxed. Just a
  horizontal row with a hairline below.
- Structure per row:
  - Left column (15%): mono category (e.g., "CLOUD ENGINEERING"), then
    mono date/year below
  - Middle column (65%): project title in Fraunces 32px, then a one-line
    Inter description
  - Right column (20%): mono "READ →" with an accent underline
- Rows sorted by date descending (most recent first)
- Hover on a row: the title's underline draws in (accent color, 0.5s)
  and "READ →" brightens
- Clicking anywhere on the row navigates to that project's case study

Featured projects:
- The first 4 projects are tagged "FEATURED" in the left column (mono,
  accent color)
- Non-featured projects still appear in the list below, without the tag

Filter row above the grid (optional, nice-to-have):
- Mono pills: "ALL · CLOUD · SECURITY · NETWORK · RESEARCH"
- Clicking filters the grid. Non-functional pills can be omitted if too
  complex.

## Page 2 — PROJECT CASE STUDY (/projects/[slug])

Long-form reading experience. Light mode by default. This is the most
important page type.

Structure:

**Header zone (top of page):**
- Mono breadcrumb: "INDEX / CLOUD ENGINEERING / AWS STORAGE PLATFORM"
- Large Fraunces title (56px): the project name
- Subtitle below in Inter 22px italic: a one-line summary
- Mono metadata row: date, category, tools — separated by hairline dots
- Tag pills below: mono, low contrast, pill background
- Full-width hairline
- Executive summary: a short paragraph or two in a distinct style —
  slightly larger body text (19px), Fraunces italic for the opening
  phrase, then Inter for the rest

**Body:**
- Content is rendered from a structured content file (see Content Data
  section below)
- Sections render with:
  - Section header: Fraunces 32px, with a small mono anchor number
    (e.g., "01 -")
  - Subsections: Inter 20px, bold
  - Body text: Inter 17px, 72ch max, generous line height
  - Code blocks: JetBrains Mono 14px, code-bg background, 16px padding,
    horizontal scroll, no syntax highlighting required
  - Lists: bulleted with a mono "·"
  - Blockquotes: rendered as a small mono label + Inter italic body
  - Diagrams: when the content includes ASCII-style diagrams (like the
    VPC architecture tree), preserve monospace formatting in a pre block
    with a distinct border

**A "Key Lessons" callout:**
- When the content includes a key lesson, render it in a bordered block
  with a 3px accent left border, no other decoration
- Mono label: "KEY LESSON"
- Body: Inter 17px

**Bottom of page:**
- A "Next Project" link in mono, top-right aligned, to the next case
  study in the list
- A "← Back to Index" link in mono, top-left aligned

**Sticky reading rail (desktop only):**
- On the left edge of the viewport, a thin vertical rail with section
  names in mono, rotated 90° (or not — pick whichever is more legible)
- Active section highlights in accent color
- Clicking scrolls to that section
- Hidden on mobile

## Page 3 — ABOUT (/about)

Brief context for the archive. Light mode default.

Content:
- Mono "[ ABOUT THE ARCHIVE ]"
- Fraunces title: "Why this exists"
- A short paragraph explaining: this archive is the source material. Three
  other portfolios (Atlas, Obsidian, Substrate) are interpretations of
  this same work. This is where the actual projects live.
- Full-width hairline
- A list of the three other portfolios as small rows, each linking to its
  URL, with a mono label explaining each
- Footer

## Content Data

All content lives in a single file: src/content/archive.ts

The file exports:
- profile (name, tagline, short bio)
- projects: array of project objects
- Each project object has:
  - slug (for the URL, e.g., "aws-storage-platform")
  - title
  - category
  - date (ISO string)
  - tools (array of strings)
  - summary (one-line description for the index)
  - executiveSummary (a paragraph or two)
  - sections: array of section objects
  - Each section has:
    - id (for anchor linking)
    - title
    - blocks: array of content blocks
    - Each block is one of:
      - { type: "paragraph", text: string }
      - { type: "heading", text: string }
      - { type: "code", language: string, code: string }
      - { type: "list", items: string[] }
      - { type: "quote", text: string }
      - { type: "diagram", code: string }
      - { type: "callout", label: string, text: string }
      - { type: "image", src: string, alt: string, caption?: string }

I will provide the full content in the next message. For this build, use
placeholder content for THREE projects (AWS Storage Platform, AWS VPC
Network Security, Zeus Malware Analysis) with 2-3 sections each so the
layout is testable. The real content will replace the placeholders.

## Motion

Restraint. Nothing decorative.

- Page load: content fades in over 400ms, no stagger
- Link underlines: background-size 0% → 100%, 200ms ease-out
- Scroll reveals: only on the case study pages. Paragraph blocks fade
  in over 300ms, translate up 6px. Stagger 40ms per block within a
  section. Nothing more.
- prefers-reduced-motion: all animations become instant

## Mobile

- Top bar collapses to: "← GALLERY" left, theme toggle right, and a
  hamburger in the middle that opens a full-screen mono menu with
  "INDEX" and "ABOUT"
- Project index rows become vertical stacks:
  - Mono category + date at top
  - Title in Fraunces 28px
  - One-line description
  - Mono "READ →" at bottom
- Case study page: no sticky rail, no side-by-side layouts, everything
  single-column
- Code blocks scroll horizontally, not wrap
- Font sizes reduced proportionally (titles 40px, body 16px)

## Accessibility

- All contrast ratios ≥ 4.5:1
- Focus rings: 2px accent, visible on all interactive elements
- Semantic HTML: article, section, nav, main
- Code blocks have visible copy affordance (a small mono "COPY" button
  in the corner, optional)
- All links keyboard-reachable
- Theme toggle announces state change

## What to Build First

Ship:
1. Routing for /, /projects/[slug], /about
2. Top bar and footer
3. The index page with 3 placeholder projects
4. The case study page rendering the placeholder sections using all
   block types (paragraph, heading, code, list, quote, diagram, callout)
5. The about page with placeholder text
6. Light/dark mode toggle, working across all pages

Then stop. I will provide the real content and the fourth project in
follow-up messages.

## What NOT to do

- No cards with visible borders or shadows
- No rounded corners beyond 4px
- No gradients except the subtle one on the top bar backdrop
- No icons beyond → and ←
- No emoji
- No stock imagery
- No syntax highlighting libraries — plain code blocks only
- Do not build the other portfolios (Atlas, Obsidian, Substrate)
- Do not build the gallery

Build it as a technical reader. Calm, precise, readable. Nothing hidden.



## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
