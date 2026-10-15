## Gallery architecture
- Keep the imported gallery as a standalone chooser at `/`; destination portfolios and missing preview assets must be supplied separately, not invented locally.
- Preserve room palette tokens independently from registered shell color properties so root lighting cannot alter room designs.
- Keep shell lighting in the dedicated shell hook and global stylesheet; root state synchronizes inherited colors and separate opacity overlays without per-element color animations.
- Observe mobile rooms at 50% visibility and keep constrained devices neutral to avoid expensive scroll effects.
- Load original fonts through the root route head and retain native modified-click navigation because the original gallery behavior must remain intact.
