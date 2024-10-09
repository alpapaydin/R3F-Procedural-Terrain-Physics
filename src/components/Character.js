// src/components/Character.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { checkTerrainCollision } from '../utils/terrainCollision';
import { useCameraControls } from './CameraControls';

const CHARACTER_SPEED = 25.5;
const CHARACTER_RADIUS = 1;
const CHARACTER_HEIGHT = 2;
const JUMP_FORCE = 15;

const Character = () => {
    const mesh = useRef();
    const keys = useKeyboard();
    const [velocity, setVelocity] = useState(new THREE.Vector3());
    const [isJumping, setIsJumping] = useState(false);
    const { rotation, updateCamera, isLocked } = useCameraControls();

    useFrame((state, deltaTime) => {
        if (!mesh.current || !isLocked) return;

        const moveDistance = CHARACTER_SPEED * deltaTime;
        const direction = new THREE.Vector3();

        const forward = new THREE.Vector3(-Math.sin(rotation.y), 0, -Math.cos(rotation.y));
        const right = new THREE.Vector3(Math.cos(rotation.y), 0, -Math.sin(rotation.y));

        if (keys.w) direction.add(forward);
        if (keys.s) direction.sub(forward);
        if (keys.a) direction.sub(right);
        if (keys.d) direction.add(right);

        direction.normalize().multiplyScalar(moveDistance);
        
        // Calculate new position
        const oldPosition = mesh.current.position.clone();
        const newPosition = oldPosition.clone().add(direction).add(velocity.clone().multiplyScalar(deltaTime));
        
        // Check for collision and adjust position
        const { position: adjustedPosition, velocity: adjustedVelocity, isOnGround } = checkTerrainCollision(oldPosition, newPosition, CHARACTER_RADIUS, CHARACTER_HEIGHT, velocity, deltaTime);
        
        // Handle jumping
        if (keys.space && isOnGround && !isJumping) {
            adjustedVelocity.y = JUMP_FORCE;
            setIsJumping(true);
        }

        // Update mesh position and velocity
        mesh.current.position.copy(adjustedPosition);
        setVelocity(adjustedVelocity);

        // Update jumping state
        if (isOnGround) {
            setIsJumping(false);
        }

        // Update camera
        updateCamera(adjustedPosition);
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[CHARACTER_RADIUS, 32, 32]} />
            <meshStandardMaterial color="magenta" />
        </mesh>
    );
};

export default Character;