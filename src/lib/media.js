import { prefersLowQualityPanoramas, prefersMobileVideo } from "./device";

/*
=====================================================
RUTAS DE PANORAMAS Y VIDEOS

Cada panorama existe en dos tamaños:
  nombre.jpg         8192×4096
  nombre.mobile.jpg  4096×2048

Cada video existe en dos tamaños más su portada:
  nombre.mp4         1080p
  nombre.mobile.mp4  720p
  nombre.poster.jpg
=====================================================
*/

const panoramaFiles = import.meta.glob("../assets/panoramas/**/*.jpg", {
    eager: true,
    import: "default",
});

const videoFiles = import.meta.glob("../assets/videos/*.{mp4,jpg}", {
    eager: true,
    import: "default",
});

function find(files, key) {
    const url = files[key];
    if (!url) throw new Error(`Archivo no encontrado: ${key}`);
    return url;
}

export function panoramaUrl(name) {
    const suffix = prefersLowQualityPanoramas() ? ".mobile" : "";
    return find(panoramaFiles, `../assets/panoramas/${name}${suffix}.jpg`);
}

export function videoSources(name) {
    const suffix = prefersMobileVideo() ? ".mobile" : "";
    return {
        src: find(videoFiles, `../assets/videos/${name}${suffix}.mp4`),
        poster: find(videoFiles, `../assets/videos/${name}.poster.jpg`),
    };
}
