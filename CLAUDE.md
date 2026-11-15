# Paris-Brest — sitio one-page

- Estándar visual: `docs/refero-styles.md` (galería de luz suave, centrado, pills 980px, sin sombras). Consúltalo antes de cualquier cambio de UI.
- Adaptación a repostería: el azul de acción se sustituye por caramelo (`--color-caramel`), único color cromático de CTA. Tokens en `src/css/tokens.css`; no introducir colores fuera de ahí.
- Carta y precios: fuente única `docs/menu.md`. Nunca inventar precios, premios, historia ni reseñas.
- Sitio estático en `src/` (sin build). Deploy: `.github/workflows/deploy.yml` → GitHub Pages.
- Parallax solo con `transform` (`src/js/parallax.js`, atributo `data-parallax`), respetando `prefers-reduced-motion`.
