// src/utils/terrain.js
import { createNoise3D } from 'simplex-noise';

const CHUNK_SIZE = 32;
const noise3D = createNoise3D();

export function getVoxel(x, y, z) {
    const noise = noise3D(x / 50, y / 50, z / 50);
    const isGround = y < 5 + noise * 5;
    const isCavern = noise < -0.2 && y < 15;
    return isGround && !isCavern ? 1 : 0;
}

export function generateChunkMesh(chunkX, chunkY, chunkZ) {
    const positions = [];
    const normals = [];
    const indices = [];
    const uvs = [];

    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            for (let z = 0; z < CHUNK_SIZE; z++) {
                const voxel = getVoxel(
                    x + chunkX * CHUNK_SIZE,
                    y + chunkY * CHUNK_SIZE,
                    z + chunkZ * CHUNK_SIZE
                );
                if (voxel) {
                    const uvRow = Math.floor(voxel / 16);
                    const uvCol = voxel % 16;
                    addVoxelGeometry(x, y, z, positions, normals, indices, uvs, uvRow, uvCol);
                }
            }
        }
    }

    return { positions, normals, indices, uvs };
}

function addVoxelGeometry(x, y, z, positions, normals, indices, uvs, uvRow, uvCol) {
    const startIndex = positions.length / 3;
    const uvSize = 1 / 16;

    // Define the positions, normals, and UVs for each face
    const faceData = [
        // left
        { pos: [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], norm: [-1, 0, 0] },
        // right
        { pos: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0], norm: [1, 0, 0] },
        // bottom
        { pos: [1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], norm: [0, -1, 0] },
        // top
        { pos: [0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1], norm: [0, 1, 0] },
        // back
        { pos: [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], norm: [0, 0, -1] },
        // front
        { pos: [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1], norm: [0, 0, 1] },
    ];

    for (const { pos, norm } of faceData) {
        positions.push(...pos.map((v, i) => v + [x, y, z][i % 3]));
        normals.push(...Array(4).fill(norm).flat());
        uvs.push(
            uvCol * uvSize, uvRow * uvSize,
            (uvCol + 1) * uvSize, uvRow * uvSize,
            uvCol * uvSize, (uvRow + 1) * uvSize,
            (uvCol + 1) * uvSize, (uvRow + 1) * uvSize
        );
    }

    // Add indices for each face (2 triangles per face)
    for (let i = 0; i < 6; i++) {
        const indexOffset = startIndex + i * 4;
        indices.push(
            indexOffset, indexOffset + 1, indexOffset + 2,
            indexOffset + 2, indexOffset + 1, indexOffset + 3
        );
    }
}