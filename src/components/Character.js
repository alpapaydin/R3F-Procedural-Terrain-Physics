// src/components/Character.js
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { checkTerrainCollision } from '../utils/terrainCollision';

const CHARACTER_SPEED = 0.5;
const CHARACTER_RADIUS = 1;
const CHARACTER_HEIGHT = 2;
const MOUSE_SENSITIVITY = 0.002;
const MAX_POLAR_ANGLE = Math.PI * 0.4;
const JUMP_FORCE = 0.15;
const GRAVITY = -0.01;

const Character = () => {
    const mesh = useRef();
    const { camera, gl } = useThree();
    const keys = useKeyboard();
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [velocity, setVelocity] = useState(new THREE.Vector3());
    const [isJumping, setIsJumping] = useState(false);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);
        const handleMouseMove = (event) => {
            if (isMouseDown) {
                setRotation(prev => {
                    const newX = prev.x - event.movementY * MOUSE_SENSITIVITY;
                    const newY = prev.y - event.movementX * MOUSE_SENSITIVITY;
                    const clampedX = Math.max(-MAX_POLAR_ANGLE, Math.min(MAX_POLAR_ANGLE, newX));
                    return { x: clampedX, y: newY };
                });
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gl, isMouseDown]);

    useFrame(() => {
        if (!mesh.current) return;

        const moveDistance = CHARACTER_SPEED;
        const direction = new THREE.Vector3();

        const forward = new THREE.Vector3(-Math.sin(rotation.y), 0, -Math.cos(rotation.y));
        const right = new THREE.Vector3(Math.cos(rotation.y), 0, -Math.sin(rotation.y));

        if (keys.w) direction.add(forward);
        if (keys.s) direction.sub(forward);
        if (keys.a) direction.sub(right);
        if (keys.d) direction.add(right);

        direction.normalize().multiplyScalar(moveDistance);
        
        // Apply gravity and handle jumping
        let newVelocity = velocity.clone();
        newVelocity.y += GRAVITY;

        if (keys.space && !isJumping) {
            newVelocity.y = JUMP_FORCE;
            setIsJumping(true);
        }

        // Calculate new position
        const newPosition = mesh.current.position.clone().add(direction).add(newVelocity);
        
        // Check for collision and adjust position
        const { position: adjustedPosition, velocity: adjustedVelocity, isOnGround } = checkTerrainCollision(newPosition, CHARACTER_RADIUS, CHARACTER_HEIGHT, newVelocity);
        
        // Update mesh position and velocity
        mesh.current.position.copy(adjustedPosition);
        setVelocity(adjustedVelocity);

        // Update jumping state
        if (isOnGround) {
            setIsJumping(false);
        }

        // Update camera position
        const cameraOffset = new THREE.Vector3(0, 5, 10);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);
        camera.position.copy(adjustedPosition).add(cameraOffset);

        // Create a look-at point in front of the character
        const lookAtPoint = new THREE.Vector3();
        lookAtPoint.copy(adjustedPosition);
        lookAtPoint.y += Math.sin(rotation.x) * 10;
        lookAtPoint.add(forward.multiplyScalar(Math.cos(rotation.x) * 10));

        camera.lookAt(lookAtPoint);
        camera.up.set(0, 1, 0);
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[CHARACTER_RADIUS, 32, 32]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

export default Character;