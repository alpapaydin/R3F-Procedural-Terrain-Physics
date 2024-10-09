// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Terrain from './components/Terrain';
import Lights from './components/Lights';
import Character from './components/Character'

const App = () => {
    return (
        <Canvas style={{ height: '100vh' }} camera={{ position: [0, 50, 150], fov: 75 }}>
            <Lights />
            <Terrain />
            <OrbitControls />
            <Character />
        </Canvas>
    );
};

export default App;
