// src/components/Character.js
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

const CHARACTER_SPEED = 0.5;
const CHARACTER_RADIUS = 1;
const MOUSE_SENSITIVITY = 0.002;
const MAX_POLAR_ANGLE = Math.PI * 0.4; // Maximum look down/up angle

const Character = () => {
    const mesh = useRef();
    const { camera, gl } = useThree();
    const keys = useKeyboard();
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(true);
        const handleMouseMove = (event) => {
            if (isMouseDown) {
                setRotation(prev => {
                    const newX = prev.x - event.movementY * MOUSE_SENSITIVITY;
                    const newY = prev.y - event.movementX * MOUSE_SENSITIVITY;
                    
                    // Clamp the vertical rotation (pitch)
                    const clampedX = Math.max(-MAX_POLAR_ANGLE, Math.min(MAX_POLAR_ANGLE, newX));
                    
                    return {
                        x: clampedX,
                        y: newY
                    };
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

        // Calculate forward and right vectors
        const forward = new THREE.Vector3(
            -Math.sin(rotation.y),
            0,
            -Math.cos(rotation.y)
        );
        const right = new THREE.Vector3(
            Math.cos(rotation.y),
            0,
            -Math.sin(rotation.y)
        );

        // Move character
        if (keys.w) direction.add(forward);
        if (keys.s) direction.sub(forward);
        if (keys.a) direction.sub(right);
        if (keys.d) direction.add(right);

        direction.normalize().multiplyScalar(moveDistance);
        mesh.current.position.add(direction);

        // Update camera position
        const cameraOffset = new THREE.Vector3(0, 5, 10);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);
        camera.position.copy(mesh.current.position).add(cameraOffset);

        // Create a look-at point in front of the character
        const lookAtPoint = new THREE.Vector3();
        lookAtPoint.copy(mesh.current.position);
        lookAtPoint.y += Math.sin(rotation.x) * 10; // Adjust vertical look based on pitch
        lookAtPoint.add(forward.multiplyScalar(Math.cos(rotation.x) * 10));

        // Make the camera look at this point
        camera.lookAt(lookAtPoint);

        // Ensure the camera's up vector is always (0, 1, 0) to prevent roll
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