<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portfolio architecture
- Keep TanStack Start's index route as the edition composition entry instead of adding App.tsx or another router, because the existing framework owns routing and SSR.
- Store all portfolio copy and section IDs in src/content/content.ts; both edition components accept that same content shape to prevent divergence.
- Keep edition state in a shared provider, reading URL and browser storage only after mount so SSR stays deterministic.
- Keep edition-specific visuals and motion in src/editions and reusable controls in src/shared; both editions render the same shared content through their own visual composition.
- Define palettes, typography, focus and reduced-motion behavior in src/styles.css; data-edition and data-mode select themes without duplicating page content.
- Reserve the first-visit chooser and its timeout for the subsequent visual implementation; the foundation hook exposes chooser eligibility and automatic-selection state without starting an invisible countdown.
- Keep both completed editions available through the shared switch; use native view-transition snapshots for in-place crossfades without duplicate anchor IDs or document-height changes, with an opacity fallback.
- Keep Atlas theme preference separate from edition choice and render light during SSR; native dialog provides the mobile menu's focus trap and Escape handling.
- Keep Obsidian theme preference separate from edition and Atlas theme, with dark SSR defaults; browser-only WebGL and motion effects initialize after mount and clean up on edition changes.
- Use a bounded Mandelbrot fragment shader with theme-token colors, capped resolution and frame rate, static reduced-motion rendering and a non-WebGL fallback to keep the spatial backdrop decorative and accessible.
