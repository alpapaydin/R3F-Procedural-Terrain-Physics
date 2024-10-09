// src/components/VoxelWorld.js
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { generateChunkMesh } from '../utils/terrain';

const CHUNK_SIZE = 32;
const RENDER_DISTANCE = 2;

const VoxelWorld = () => {
    const texture = useLoader(TextureLoader, '/textures/blocks.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const chunks = useMemo(() => {
        const chunks = [];
        for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
                    const { positions, normals, indices, uvs } = generateChunkMesh(x, y, z);
                    chunks.push({ x, y, z, positions, normals, indices, uvs });
                }
            }
        }
        return chunks;
    }, []);

    return (
        <group>
            {chunks.map(({ x, y, z, positions, normals, indices, uvs }) => (
                <mesh key={`${x},${y},${z}`} position={[x * CHUNK_SIZE, y * CHUNK_SIZE, z * CHUNK_SIZE]}>
                    <bufferGeometry>
                        <bufferAttribute
                            attachObject={['attributes', 'position']}
                            array={new Float32Array(positions)}
                            itemSize={3}
                            count={positions.length / 3}
                        />
                        <bufferAttribute
                            attachObject={['attributes', 'normal']}
                            array={new Float32Array(normals)}
                            itemSize={3}
                            count={normals.length / 3}
                        />
                        <bufferAttribute
                            attachObject={['attributes', 'uv']}
                            array={new Float32Array(uvs)}
                            itemSize={2}
                            count={uvs.length / 2}
                        />
                        <bufferAttribute
                            attach="index"
                            array={new Uint16Array(indices)}
                            itemSize={1}
                        />
                    </bufferGeometry>
                    <meshStandardMaterial map={texture} />
                </mesh>
            ))}
        </group>
    );
};

export default VoxelWorld;