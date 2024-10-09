// src/utils/terrainCollision.js
import * as THREE from 'three';
import { getBiomeHeight } from './biomes';
import { HEIGHT_SCALE, TERRAIN_SIZE, SEGMENTS } from './constants';

export const getTerrainHeight = (x, z) => {
  const normalizedX = (x + TERRAIN_SIZE / 2) / (TERRAIN_SIZE / SEGMENTS) / 10;
  const normalizedZ = (z + TERRAIN_SIZE / 2) / (TERRAIN_SIZE / SEGMENTS) / 10;
  return getBiomeHeight(normalizedX, normalizedZ) * HEIGHT_SCALE;
};

export const checkTerrainCollision = (position, radius, height, velocity) => {
  const raycaster = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);

  const checkPoints = [
    new THREE.Vector3(position.x, position.y + height, position.z),
    new THREE.Vector3(position.x + radius, position.y + height, position.z),
    new THREE.Vector3(position.x - radius, position.y + height, position.z),
    new THREE.Vector3(position.x, position.y + height, position.z + radius),
    new THREE.Vector3(position.x, position.y + height, position.z - radius),
  ];

  let maxTerrainHeight = -Infinity;

  checkPoints.forEach(point => {
    raycaster.set(point, down);
    const terrainY = getTerrainHeight(point.x, point.z);
    maxTerrainHeight = Math.max(maxTerrainHeight, terrainY);
  });

  const newPosition = position.clone();
  let newVelocity = velocity.clone();

  const isOnGround = newPosition.y <= maxTerrainHeight + 0.01; // Small threshold for numerical stability

  if (isOnGround) {
    newPosition.y = maxTerrainHeight;
    newVelocity.y = Math.max(0, newVelocity.y); // Allow upward velocity (for jumping) but clamp downward velocity
  }

  return { position: newPosition, velocity: newVelocity, isOnGround };
};