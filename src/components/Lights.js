// src/components/Lights.js
import React from 'react';

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[50, 50, 50]} intensity={1.5} />
        </>
    );
};

export default Lights;
