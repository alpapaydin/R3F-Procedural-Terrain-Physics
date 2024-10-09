// src/shaders/CustomShader.js
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Vertex Shader code as a plain string
const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader code as a plain string
const fragmentShader = `
  uniform float time;
  varying vec3 vPosition;
  void main() {
    gl_FragColor = vec4(abs(sin(vPosition.x + time)), abs(sin(vPosition.y + time)), abs(sin(vPosition.z + time)), 1.0);
  }
`;

// Create the shader material using the plain string shaders
const CustomShaderMaterial = shaderMaterial(
  { time: 0 },  // Uniforms
  vertexShader,
  fragmentShader
);

// Extend the material so it can be used as a JSX component
extend({ CustomShaderMaterial });

export { CustomShaderMaterial };
