// src/components/Scene3D.tsx

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Box } from '@mui/material';
import * as THREE from 'three';
import { Vector3D } from '../types/geometry';
import { AnimatedFigure } from './AnimatedFigure';

interface Scene3DProps {
  vertices: Vector3D[];
  targetVertices: Vector3D[];
  edges: [number, number][];
  faces: number[][];
  showGrid?: boolean;
  showAxes?: boolean;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  figureKey?: string; // Para forzar reinicio
}

const AxesHelper = () => {
  const axisLength = 5;
  const arrowSize = 0.3;

  return (
    <group>
      {/* Eje X (Rojo) */}
      <arrowHelper
        args={[
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0xff0000,
          arrowSize,
          arrowSize * 0.5,
        ]}
      />
      {/* Eje Y (Verde) */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x00ff00,
          arrowSize,
          arrowSize * 0.5,
        ]}
      />
      {/* Eje Z (Azul) */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x0000ff,
          arrowSize,
          arrowSize * 0.5,
        ]}
      />
    </group>
  );
};

export const Scene3D = ({
  vertices,
  targetVertices,
  edges,
  faces,
  showGrid = true,
  showAxes = true,
  isAnimating = false,
  onAnimationComplete,
  figureKey,
}: Scene3DProps) => {
  return (
    <Box sx={{ width: '100%', height: '700px', backgroundColor: '#f5f5f5' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #e3f2fd 0%, #ffffff 100%)' }}
      >
        {/* Iluminación */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />

        {/* Controles orbitales */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />

        {/* Grid */}
        {showGrid && (
          <Grid
            args={[10, 10]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#bbdefb"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#64b5f6"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}

        {/* Ejes de coordenadas */}
        {showAxes && <AxesHelper />}

        {/* Figura 3D con animación */}
        {vertices.length > 0 && (
          <AnimatedFigure
            vertices={vertices}
            targetVertices={targetVertices}
            edges={edges}
            faces={faces}
            isAnimating={isAnimating}
            onAnimationComplete={onAnimationComplete}
            figureKey={figureKey}
          />
        )}
      </Canvas>
    </Box>
  );
};

export default Scene3D;