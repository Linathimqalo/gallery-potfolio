# Atlas Obsidian Duo

Build a dual-edition single-page portfolio for Linathi Mqalo, a Cloud Security Engineer based in Johannesburg.



This is NOT a standard portfolio. It has TWO complete design editions covering the same content, and the visitor can switch between them at any time without losing their scroll position.



## Stack

- Vite + React + TypeScript + Tailwind CSS

- Framer Motion for animations

- Google Fonts for typography



## Architecture

- All content lives in a single file: src/content/content.ts. Never duplicate content across editions.

- Two edition components: src/editions/atlas/AtlasApp.tsx and src/editions/obsidian/ObsidianApp.tsx

- Shared code: src/shared/useEdition.ts, src/shared/EditionSwitch.tsx, src/shared/SectionAnchor.tsx

- App.tsx chooses which edition to render based on URL param → localStorage → default (atlas)



## The Edition System

Two editions of the same portfolio:

- ATLAS — "The Editorial Edition" — light default, printed journal aesthetic, Fraunces serif headlines, cream background, burgundy accent, hairline rules, no fractals, no glass, typographic motion only.

- OBSIDIAN — "The Spatial Edition" — dark default, fractal substrate behind frosted glass panels, aurora gradient accent, spatial parallax, living background, serif nameplate.



Rules:

- Content is IDENTICAL across editions. Same words, same sections, same order, same anchor IDs.

- Only the visual layer changes: color, type pairing, surfaces, motion, nav style, layout rhythm.

- Switching editions is a 600ms cross-fade in place. Scroll position MUST be preserved.

- Edition choice persists in localStorage under key "linathi:edition"

- URL param ?edition=atlas or ?edition=obsidian overrides everything and skips any chooser

- No conditional content rendering — both editions read the same content shapes



## Entry Experience

On first visit with no edition stored and no URL param:

- Desktop: full-viewport split screen. Left half renders Atlas live (light, cream, still). Right half renders Obsidian live (dark, fractal drifting). Thin 1px hairline divider. Hovering a side intensifies it subtly. Clicking commits.

- Mobile: a centered chooser with two editorial cards, one per edition, each with a small static preview.

- Bottom center in mono: "CHOOSE YOUR EDITION — YOU CAN SWITCH AT ANY TIME"

- After 6 seconds with no interaction, auto-select Atlas with a soft fade-in and show mono note: "AUTO-SELECTED ATLAS — SWITCH ANY TIME"

- Returning visitors (edition in localStorage) skip the chooser entirely



## Shared Color Tokens (CSS variables)



Atlas (light, default):

--bg: #F5F2ED

--surface: #FFFFFF

--hairline: #E5E0D8

--text: #1A1A1A

--text-muted: #52525B

--text-dim: #8A8A8F

--accent: #8B0D1A



Atlas (dark):

--bg: #0E0E10

--surface: #17171A

--hairline: #26262B

--text: #F4F1EA

--text-muted: #9A9A9F

--text-dim: #6B6B70

--accent: #C41E3A



Obsidian (dark, default):

--bg: #080B14

--surface: rgba(255,255,255,0.035)

--surface-border: rgba(255,255,255,0.07)

--text: #E8ECF4

--text-muted: #A8B2C4

--text-dim: #6B7688

--accent-from: #7DD3FC

--accent-to: #A78BFA



Obsidian (light):

--bg: #FAFAF8

--surface: rgba(255,255,255,0.72)

--surface-border: rgba(15,23,42,0.06)

--text: #0F172A

--text-muted: #475569

--text-dim: #94A3B8

--accent-from: #0EA5E9

--accent-to: #8B5CF6



Accent usage rule (both editions, both modes): accent is used ONLY on primary CTAs, hover borders, "Featured" badges, and the active nav dot. Never on body text. Never as a section background.



## Typography



Atlas:

- Display & headings: Fraunces (variable, opsz 144, weight 400, tracking -0.03em)

- Body: Inter, 17px / 1.75 line-height, max-width 62ch

- Labels / nav / meta / tags: JetBrains Mono, 11-12px, uppercase, letter-spacing 0.14em



Obsidian:

- Display & headings: Instrument Serif

- Body: Inter, 16px / 1.7 line-height, max-width 62ch

- Labels / nav / meta / tech tags: JetBrains Mono, 11-12px, uppercase, letter-spacing 0.12em



Load all from Google Fonts.



## Accessibility

- prefers-reduced-motion: disable fractal loop, parallax, and custom cursor. Reveals become instant fades.

- All text contrast >= 4.5:1 in both editions, both modes.

- Visible focus rings in accent color at 2px.

- Semantic heading order.



## Do NOT build the editions yet

Just set up the architecture, tokens, fonts, and the useEdition hook. Then wait for the next instruction.



Confirm when the foundation is ready.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://atlas-obsidian-duo.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/210a5e70-a6d4-4a61-af6e-b2c44424665f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
