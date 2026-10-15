## Portfolio architecture
- Keep portfolio content in the browser-safe src/data/portfolio.ts module; presentation reads it without fetching or changing source wording.
- Keep the single scrolling portfolio at / and use section anchors for local navigation; the standalone Gallery link leads to selected work.
- Isolate canvas animation and reveal observers in dedicated components with browser operations inside effects and cleanup, so SSR stays safe.
- Keep the background shader, noise-driven ambient particles, and scroll-driven ambience separate from content; pause canvases on hidden tabs and respect live reduced-motion changes to protect performance and accessibility.
- Define all visual roles in src/styles.css and load external fonts through root head links, so Tailwind compilation remains filesystem-only.
