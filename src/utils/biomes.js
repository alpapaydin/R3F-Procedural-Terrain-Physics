// src/utils/biomes.js
import { createNoise2D } from 'simplex-noise';
import { BIOME_NOISE_SCALE, TERRAIN_SEED } from './constants'; // Import biome noise scale
import alea from 'alea';
const alea_seed = new alea(TERRAIN_SEED);
const noise = createNoise2D(alea_seed); // Seed for variation

// Smoothstep function for smoother transitions
const smoothstep = (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

// Function to get height based on biome
export const getBiomeHeight = (x, z) => {
    const biomeNoise = noise(x * BIOME_NOISE_SCALE, z * BIOME_NOISE_SCALE);
    let height = 0;

    // Biome selection based on biomeNoise
    if (biomeNoise < -0.3) {
        height = getHillHeight(x, z);
    } else if (biomeNoise < 0.1) {
        height = getValleyHeight(x, z);
    } else {
        height = getPlateauHeight(x, z);
    }

    // Apply a smoothing function to the height
    return smoothstep(-1, 1, height);
};

const getHillHeight = (x, z) => {
    let height = 0;
    let amplitude = 3; // Decrease amplitude for smoother hills
    let frequency = 1.5; // Increase frequency for more detail

    for (let i = 0; i < 3; i++) {
        height += noise(x * frequency, z * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 1.5; // Increase frequency more gradually
    }

    return height;
};

const getValleyHeight = (x, z) => {
    let height = 0;
    let amplitude = 4; // Adjust amplitude for smoother valleys
    let frequency = 0.5; // Decrease frequency

    for (let i = 0; i < 3; i++) {
        height += noise(x * frequency, z * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 2; // Gradually increase frequency
    }

    return height;
};

const getPlateauHeight = (x, z) => {
    let height = 0;
    let amplitude = 2; // Adjust amplitude
    let frequency = 0.25; // Decrease frequency

    for (let i = 0; i < 3; i++) {
        height += noise(x * frequency, z * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 1.5; // Increase frequency gradually
    }

    return height;
};
