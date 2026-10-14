# Mystral Showroom

Showroom interactivo del proyecto residencial Mystral: videos del proyecto, recorridos 360°, niveles disponibles, brochure y mapa de proyectos.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # compilación de producción en dist/
npm run lint
```

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/data/scenes.js` | Escenas del showroom: tipo, video o imagen, ruta en la URL y a dónde vuelve "VOLVER" |
| `src/data/tours.js` | Recorridos 360: habitaciones, orden del menú y flechas (hotspots) |
| `src/data/levels.js` | Zonas clicables de niveles sobre la fachada trasera |
| `src/data/projects.js` | Proyectos del mapa |
| `src/lib/` | Navegación con historial (`useSceneRouter`), calidad según dispositivo y rutas de archivos |
| `src/components/` | Componentes de la interfaz |

Cada escena tiene su propia URL (`/#/tipo-a/cocina`), así que el botón "atrás" del navegador funciona y los enlaces se pueden compartir.

## Agregar contenido

**Panorama 360:** exportarlo en JPG equirectangular 2:1 y guardar dos versiones con el mismo nombre (sin espacios ni tildes):

- `src/assets/panoramas/<recorrido>/<nombre>.jpg`: 8192×4096, calidad ~80 (1-3 MB)
- `src/assets/panoramas/<recorrido>/<nombre>.mobile.jpg`: 4096×2048 (celulares y tablets)

Después se agrega la habitación en `src/data/tours.js`.

**Video:** H.264 (no HEVC/H.265, que Chrome en Windows y Firefox no reproducen), sin audio, con `faststart`:

- `src/assets/videos/<nombre>.mp4`: 1080p
- `src/assets/videos/<nombre>.mobile.mp4`: 720p
- `src/assets/videos/<nombre>.poster.jpg`: primer fotograma

Ejemplo con ffmpeg:

```bash
ffmpeg -i original.mp4 -an -vf "scale=1920:-2,format=yuv420p" -c:v libx264 -preset slow -crf 23 -movflags +faststart nombre.mp4
ffmpeg -i original.mp4 -an -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -preset slow -crf 26 -movflags +faststart nombre.mobile.mp4
ffmpeg -i original.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 4 nombre.poster.jpg
```
