# Paris-Brest Navarrete

One-page de la pastelería Paris-Brest (Boulevard Navarrete #512, Hermosillo, Son.).

**En vivo:** https://yoshio28.github.io/Paris-Brest/

- `src/` sitio estático (HTML/CSS/JS sin dependencias).
- `src/assets/video/` video del hero (render 3D procedural, loop de 10 s, 1080p) + poster.
- `docs/refero-styles.md` sistema visual; `docs/menu.md` carta oficial.
- Deploy automático a GitHub Pages con `.github/workflows/deploy.yml`.

Servir en local:

```bash
python3 -m http.server -d src 8080
```
