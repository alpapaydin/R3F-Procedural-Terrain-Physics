// src/utils/terrainCollision.js
import * as THREE from 'three';
import { getBiomeHeight } from './biomes';
import { HEIGHT_SCALE, TERRAIN_SIZE, SEGMENTS } from './constants';

const MAX_CLIMB_ANGLE = Math.PI / 3; // 60 degrees, adjust as needed
const STEP_HEIGHT = 0.5; // Maximum height the character can step up, adjust as needed
const GRAVITY = -19.8; // Gravity acceleration (m/s^2)

export const getTerrainHeight = (x, z) => {
  const normalizedX = (x + TERRAIN_SIZE / 2) / (TERRAIN_SIZE / SEGMENTS) / 10;
  const normalizedZ = (z + TERRAIN_SIZE / 2) / (TERRAIN_SIZE / SEGMENTS) / 10;
  return getBiomeHeight(normalizedX, normalizedZ) * HEIGHT_SCALE;
};

export const checkTerrainCollision = (oldPosition, newPosition, radius, height, velocity, deltaTime) => {
  const direction = new THREE.Vector3().subVectors(newPosition, oldPosition).normalize();
  const distance = oldPosition.distanceTo(newPosition);
  
  let finalPosition = oldPosition.clone();
  let finalVelocity = velocity.clone();
  let isOnGround = false;
  let slopeAngle = 0;

  // Apply gravity
  finalVelocity.y += GRAVITY * deltaTime;

  // Perform multiple small steps to prevent tunneling
  const steps = Math.ceil(distance / (radius / 2));
  for (let i = 1; i <= steps; i++) {
    const stepDistance = (i / steps) * distance;
    const stepPosition = oldPosition.clone().add(direction.clone().multiplyScalar(stepDistance));
    
    // Check ground height at current position
    const groundHeight = getTerrainHeight(stepPosition.x, stepPosition.z);
    
    // Calculate slope
    const slope = new THREE.Vector3(
      getTerrainHeight(stepPosition.x + 0.1, stepPosition.z) - getTerrainHeight(stepPosition.x - 0.1, stepPosition.z),
      0.2,
      getTerrainHeight(stepPosition.x, stepPosition.z + 0.1) - getTerrainHeight(stepPosition.x, stepPosition.z - 0.1)
    ).normalize();
    
    slopeAngle = Math.acos(slope.dot(new THREE.Vector3(0, 1, 0)));
    
    // Check if we're on the ground or can step up
    if (stepPosition.y <= groundHeight + STEP_HEIGHT) {
      if (slopeAngle <= MAX_CLIMB_ANGLE) {
        stepPosition.y = groundHeight + STEP_HEIGHT;
        isOnGround = true;
        finalVelocity.y = 0; // Stop vertical movement when on ground
      } else {
        // Too steep to climb, stop horizontal movement
        finalPosition.copy(finalPosition);
        finalVelocity.setX(0).setZ(0);
        break;
      }
    } else if (stepPosition.y > groundHeight + height) {
      // We're above the ground, keep falling
      isOnGround = false;
    }
    
    finalPosition.copy(stepPosition);
  }

  return { position: finalPosition, velocity: finalVelocity, isOnGround, slopeAngle };
};