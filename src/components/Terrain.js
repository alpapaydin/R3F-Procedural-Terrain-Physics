// src/components/Terrain.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getBiomeHeight } from '../utils/biomes'; // Import biome height function
import { SEGMENTS, TERRAIN_SIZE, TERRAIN_COLOR, HEIGHT_SCALE } from '../utils/constants';


const Terrain = () => {
    const geometryRef = useRef();

    useEffect(() => {
        const size = TERRAIN_SIZE;
        const segments = SEGMENTS;
        const vertices = [];

        for (let x = 0; x <= segments; x++) {
            for (let z = 0; z <= segments; z++) {
                const height = getBiomeHeight(x / 10, z / 10);
                vertices.push(
                    x * (size / segments) - size / 2,
                    height * HEIGHT_SCALE,
                    z * (size / segments) - size / 2
                );
            }
        }

        geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometryRef.current.computeVertexNormals();
    }, []); // Dependency array should be empty

    return (
        <mesh>
            <planeGeometry ref={geometryRef} args={[100, 100, 100, 100]} />
            <meshStandardMaterial color={TERRAIN_COLOR} wireframe />
        </mesh>
    );
};

export default Terrain;
