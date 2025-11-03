// src/components/AnimatedFigure.tsx

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3D } from '../types/geometry';

interface AnimatedFigureProps {
  vertices: Vector3D[];
  targetVertices: Vector3D[];
  edges: [number, number][];
  faces: number[][];
  isAnimating: boolean;
  animationDuration?: number;
  onAnimationComplete?: () => void;
  figureKey?: string; // Para forzar reinicio al cambiar figura
}

export const AnimatedFigure = ({
  vertices,
  targetVertices,
  edges,
  faces,
  isAnimating,
  animationDuration = 1.5,
  onAnimationComplete,
  figureKey,
}: AnimatedFigureProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesGroupRef = useRef<THREE.Group>(null);
  const verticesGroupRef = useRef<THREE.Group>(null);
  
  const animationProgress = useRef(0);
  const startVertices = useRef<Vector3D[]>(vertices);
  const [currentVertices, setCurrentVertices] = useState<Vector3D[]>(vertices);
  const currentVerticesRef = useRef<Vector3D[]>(vertices);
  const previousFigureKey = useRef<string | undefined>(figureKey);

  // Reiniciar completamente cuando cambia la figura
  useEffect(() => {
    if (figureKey !== previousFigureKey.current) {
      // Nueva figura detectada - reiniciar todo
      animationProgress.current = 0;
      startVertices.current = targetVertices;
      setCurrentVertices(targetVertices);
      previousFigureKey.current = figureKey;
    }
  }, [figureKey, targetVertices]);

  // Iniciar animación cuando cambian los vértices objetivo
  useEffect(() => {
    currentVerticesRef.current = currentVertices;
  }, [currentVertices]);

  useEffect(() => {
    if (isAnimating && figureKey === previousFigureKey.current) {
      animationProgress.current = 0;
      startVertices.current = [...currentVerticesRef.current];
    }
  }, [isAnimating, figureKey]);

  // Función de interpolación suave (easing)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Animar la transformación frame por frame
  useFrame((_, delta) => {
    if (isAnimating && animationProgress.current < 1) {
      animationProgress.current += delta / animationDuration;
      
      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        setCurrentVertices(targetVertices);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      } else {
        // Interpolación entre vértices iniciales y finales
        const t = easeInOutCubic(animationProgress.current);
        const newVertices = startVertices.current.map((start, i) => {
          const target = targetVertices[i];
          return {
            x: start.x + (target.x - start.x) * t,
            y: start.y + (target.y - start.y) * t,
            z: start.z + (target.z - start.z) * t,
          };
        });
        setCurrentVertices(newVertices);
      }
    }
  });

  // Crear geometría inicial
  const createGeometry = useCallback(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    currentVertices.forEach((v) => {
      positions.push(v.x, v.y, v.z);
    });

    faces.forEach((face) => {
      if (face.length === 3) {
        indices.push(face[0], face[1], face[2]);
      } else if (face.length === 4) {
        indices.push(face[0], face[1], face[2]);
        indices.push(face[0], face[2], face[3]);
      }
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, [currentVertices, faces]);

  // Actualizar geometría cuando cambian los vértices
  useEffect(() => {
    if (meshRef.current && currentVertices.length > 0) {
      // Recrear geometría completamente si cambió el número de vértices
      const currentPositionCount = meshRef.current.geometry.attributes.position?.count || 0;
      
      if (currentPositionCount !== currentVertices.length) {
        // Número de vértices cambió - recrear geometría
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = createGeometry();
      } else {
        // Mismo número de vértices - solo actualizar posiciones
        const positions = new Float32Array(currentVertices.length * 3);
        currentVertices.forEach((v, i) => {
          positions[i * 3] = v.x;
          positions[i * 3 + 1] = v.y;
          positions[i * 3 + 2] = v.z;
        });
        
        meshRef.current.geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();
      }
    }
  }, [currentVertices, createGeometry]);

  return (
    <group>
      {/* Caras sólidas */}
      <mesh ref={meshRef} geometry={createGeometry()}>
        <meshStandardMaterial
          color={isAnimating ? "#FF6B6B" : "#4FC3F7"}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aristas */}
      <group ref={edgesGroupRef}>
        {edges.map((edge, index) => {
          if (edge[0] >= currentVertices.length || edge[1] >= currentVertices.length) {
            return null; // Skip invalid edges
          }
          const start = currentVertices[edge[0]];
          const end = currentVertices[edge[1]];
          const points: [number, number, number][] = [
            [start.x, start.y, start.z],
            [end.x, end.y, end.z],
          ];

          return (
            <Line
              key={index}
              points={points}
              color={isAnimating ? '#C92A2A' : '#1976D2'}
              lineWidth={2}
            />
          );
        })}
      </group>

      {/* Vértices */}
      <group ref={verticesGroupRef}>
        {currentVertices.map((vertex, index) => (
          <mesh key={index} position={[vertex.x, vertex.y, vertex.z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color={isAnimating ? "#F03E3E" : "#D32F2F"}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default AnimatedFigure;