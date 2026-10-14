/*
=====================================================
CAPACIDADES DEL DISPOSITIVO

Decide si se cargan panoramas de 8K o 4K y videos
de 1080p o 720p.
=====================================================
*/

const FULL_PANORAMA_SIZE = 8192;

let maxTextureSize;
let lowQualityPanoramas;

function getMaxTextureSize() {

    if (maxTextureSize !== undefined) return maxTextureSize;

    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

        maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;

        gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
        maxTextureSize = 0;
    }

    return maxTextureSize;
}

const matches = (query) => window.matchMedia(query).matches;

export function prefersLowQualityPanoramas() {

    if (lowQualityPanoramas !== undefined) return lowQualityPanoramas;

    lowQualityPanoramas =
        getMaxTextureSize() < FULL_PANORAMA_SIZE ||
        matches("(pointer: coarse)") ||
        (navigator.deviceMemory ?? 8) <= 4;

    return lowQualityPanoramas;
}

export function prefersMobileVideo() {
    return (
        matches("(max-width: 900px)") ||
        navigator.connection?.saveData === true
    );
}
