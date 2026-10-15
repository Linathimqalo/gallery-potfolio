# Gallery Glow Palette

Import this GitHub repository https://github.com/Linathimqalo/gallery-threshold-rooms.git and set up the app from its existing code and design.

Enhance the gallery shell so that when a user hovers a room, the
ENTIRE shell transforms into that room's colour palette. The shell
is the corridor; the rooms are the lit spaces. Hovering a room
bathes the corridor in its light.
Do not change the four rooms themselves. Do not change their
existing colour systems, typography, or content. Only change the
shell behaviour.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE SHELL — WHAT IT IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The shell is everything that is NOT a room:
- The page background (behind everything)
- The masthead (top of page): "LINATHI MQALO", "FOUR PORTFOLIOS
  · ONE STORY", "Pick the room that speaks to you.", the hint line
- The footer: "© 2026 · LINATHI MQALO", "FOUR ROOMS · ONE VOICE",
  "SET IN FOUR VOICES"
- The hairlines that separate rooms and sections
- The small ambient space around the rooms
All of these elements respond to hover state.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOVER STATES — PER ROOM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When the user hovers any room, transition the shell to that room's
palette over 500ms ease-in-out. Every shell element transitions
together. Nothing snaps.
DEFAULT (no room hovered):
--shell-bg: #0E0E10
--shell-text: #F4F1EA
--shell-meta: #6B6B70
--shell-hairline: rgba(255,255,255,0.08)
--shell-accent: none
ATLAS hovered:
--shell-bg: #0A0A0A
--shell-text: #F5F2ED
--shell-meta: #8A8A8F
--shell-hairline: rgba(245,242,237,0.10)
--shell-accent: #8B0D1A
Atmosphere: apply a subtle paper-grain SVG overlay across the shell
at 4% opacity. It fades in on hover.
OBSIDIAN hovered:
--shell-bg: #0A1220
--shell-text: #F4F1EA
--shell-meta: #7A8CA6
--shell-hairline: rgba(122,140,166,0.15)
--shell-accent: #A38560
Atmosphere: a soft radial gradient emanates from the Obsidian room
toward the shell, using #112A46 at 30% → transparent. Fades in on
hover over 600ms.
SUBSTRATE hovered:
--shell-bg: #0A1514
--shell-text: #E6F0F5
--shell-meta: #8FA8B8
--shell-hairline: rgba(143,168,184,0.15)
--shell-accent: #D29F22
Atmosphere: a warm amber glow at the bottom edge of the shell,
fading upward. Fades in on hover over 600ms.
THE ARCHIVE hovered:
--shell-bg: #100A0C
--shell-text: #F4F1EA
--shell-meta: #8A8A8F
--shell-hairline: rgba(244,241,234,0.08)
--shell-accent: #8B0D1A
Atmosphere: a subtle deep-teal glow at the edges of the shell,
barely visible, giving the burgundy a cold counterpoint. Fades in
over 600ms.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE TRANSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Duration: 500ms for background and text colours
- Duration: 600ms for atmospheric overlays (paper grain, glows)
- Easing: cubic-bezier(0.4, 0, 0.2, 1) — calm, not bouncy
- All shell elements transition on the same timeline. Nothing
  transitions before or after the others.
- When moving between rooms (e.g., from Atlas to Obsidian), the
  shell transitions directly from one palette to the other, not
  through the default.
- When the user's pointer leaves all rooms (moves to the masthead,
  footer, or outside), the shell transitions back to DEFAULT over
  600ms.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE ROOMS THEMSELVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The rooms do NOT change on hover. Their backgrounds, typography,
and content stay exactly as they are. The hover only:
- Expands the hovered room from 25% → 32% (existing behaviour)
- Reveals "ENTER →" (existing behaviour)
- Intensifies its internal atmosphere (existing behaviour)
The shell change is the new layer on top of the existing hover.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use CSS custom properties (--shell-bg, --shell-text, etc.) on
  the root element. Update the variables on hover rather than
  applying transitions to every element individually.
- All elements read from the variables. One transition rule on
  the root handles the whole shell.
- The atmospheric overlays (paper grain, glows) are separate
  absolutely-positioned divs with their own opacity transitions.
- Prefers-reduced-motion: disable the shell colour transition.
  Shell jumps instantly to the hovered palette, or stays default.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hover does not exist on mobile. Instead:
- When a room enters the viewport during vertical scroll, the
  shell adopts that room's palette, transitioning over 600ms.
- When the user scrolls past, the shell returns to default (or
  transitions to the next room's palette).
- This uses IntersectionObserver with a threshold of 0.5.
- Reduced on old devices: if performance is poor, disable on
  mobile entirely and keep the shell at default.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT NOT TO CHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- The four room designs (colours, typography, content)
- The masthead text and layout
- The footer text
- The four-room layout (25% columns desktop, stacked mobile)
- The existing hover behaviours (expand, ENTER → reveal)
- The preview frames
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Desktop (1440x900):
- Moving the pointer from room to room changes the entire shell
  palette smoothly. No snapping, no stutter.
- The transition feels calm and deliberate, like lighting changing.
- Text and hairlines remain legible against every shell palette.
- Moving off all rooms returns the shell to the default dark.
Mobile (375x812):
- As each room scrolls into view, the shell adopts its palette.
- The transition is smooth.
- If performance is poor, the effect is disabled and the shell
  stays neutral.



## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
