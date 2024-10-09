// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Terrain from './components/Terrain';
import Lights from './components/Lights';
import Character from './components/Character'

const App = () => {
    return (
        <Canvas style={{ height: '100vh' }}>
            <Lights />
            <Terrain />
            <Character />
        </Canvas>
    );
};

export default App;