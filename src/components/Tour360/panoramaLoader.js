import * as THREE from "three";

/*
=====================================================
CARGA DE PANORAMAS

- Descarga con progreso (fetch + stream).
- Guarda los últimos archivos descargados (JPG comprimido,
  ~1-2 MB cada uno) para que volver a una habitación o
  entrar a una vecina precargada sea instantáneo.
- La textura en GPU se crea sólo para el panorama visible;
  Viewer360 libera la anterior con dispose().
=====================================================
*/

const MAX_CACHED_FILES = 8;

const blobCache = new Map();

function remember(url, promise) {

    blobCache.delete(url);
    blobCache.set(url, promise);

    while (blobCache.size > MAX_CACHED_FILES) {
        blobCache.delete(blobCache.keys().next().value);
    }

    // Si falla, se olvida para poder reintentar.
    promise.catch(() => blobCache.delete(url));

    return promise;
}

async function download(url, { onProgress, priority = "high" } = {}) {

    const response = await fetch(url, { priority });

    if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar ${url}`);
    }

    const total = Number(response.headers.get("content-length")) || 0;

    if (!response.body || !total || !onProgress) {
        return response.blob();
    }

    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        onProgress(Math.min(loaded / total, 1));
    }

    return new Blob(chunks, { type: response.headers.get("content-type") ?? "image/jpeg" });
}

function getBlob(url, options) {

    const cached = blobCache.get(url);

    if (cached) {
        options?.onProgress?.(1);
        return remember(url, cached);
    }

    return remember(url, download(url, options));
}

export async function loadPanoramaTexture(url, onProgress) {

    const blob = await getBlob(url, { onProgress });
    const objectUrl = URL.createObjectURL(blob);

    try {
        const texture = await new THREE.TextureLoader().loadAsync(objectUrl);

        texture.colorSpace = THREE.SRGBColorSpace;

        // A esta resolución los mipmaps no aportan nitidez
        // y ocupan un 33 % más de memoria de GPU.
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        return texture;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

// Descarga en segundo plano, de a uno, sin competir con el panorama visible.
let prefetchQueue = Promise.resolve();

export function prefetchPanoramas(urls) {

    urls.forEach((url) => {
        prefetchQueue = prefetchQueue
            .then(() => blobCache.has(url) || getBlob(url, { priority: "low" }))
            .catch(() => {});
    });
}
