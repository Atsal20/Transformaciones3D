// src/utils/figures.ts

import { Figure, FigureType, Vector3D } from '../types/geometry';

/**
 * Genera un cubo centrado en el origen con tamaño específico
 */
export const createCube = (size: number = 2): Figure => {
  const half = size / 2;

  const vertices: Vector3D[] = [
    { x: -half, y: -half, z: -half }, // 0
    { x: half, y: -half, z: -half },  // 1
    { x: half, y: half, z: -half },   // 2
    { x: -half, y: half, z: -half },  // 3
    { x: -half, y: -half, z: half },  // 4
    { x: half, y: -half, z: half },   // 5
    { x: half, y: half, z: half },    // 6
    { x: -half, y: half, z: half },   // 7
  ];

  const edges: [number, number][] = [
    // Base inferior
    [0, 1], [1, 2], [2, 3], [3, 0],
    // Base superior
    [4, 5], [5, 6], [6, 7], [7, 4],
    // Conexiones verticales
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  const faces: number[][] = [
    [0, 1, 2, 3], // Cara frontal (z negativo)
    [4, 5, 6, 7], // Cara trasera (z positivo)
    [0, 1, 5, 4], // Cara inferior (y negativo)
    [2, 3, 7, 6], // Cara superior (y positivo)
    [0, 3, 7, 4], // Cara izquierda (x negativo)
    [1, 2, 6, 5], // Cara derecha (x positivo)
  ];

  return {
    type: FigureType.CUBE,
    vertices,
    edges,
    faces,
  };
};

/**
 * Genera una pirámide triangular (tetraedro) correctamente centrada
 */
export const createTriangularPyramid = (baseSize: number = 2, height: number = 2): Figure => {
  const half = baseSize / 2;

  // Altura del centro del triángulo equilátero desde un vértice
  const triangleHeight = (Math.sqrt(3) / 2) * baseSize;
  // Radio del círculo inscrito (distancia del centro a los vértices)
  const radius = triangleHeight / 1.5;

  const vertices: Vector3D[] = [
    // Base triangular (en el plano y = 0) - Triángulo equilátero centrado en el origen
    { x: 0, y: 0, z: radius },                    // 0: vértice frontal
    { x: -half, y: 0, z: -radius / 2 },           // 1: vértice izquierdo trasero
    { x: half, y: 0, z: -radius / 2 },            // 2: vértice derecho trasero
    // Vértice superior de la pirámide (centrado sobre la base)
    { x: 0, y: height, z: 0 },                    // 3: ápice (centrado en X y Z)
  ];

  const edges: [number, number][] = [
    // Base triangular
    [0, 1], [1, 2], [2, 0],
    // Aristas hacia el ápice
    [0, 3], [1, 3], [2, 3],
  ];

  const faces: number[][] = [
    [0, 1, 2],    // Base
    [0, 1, 3],    // Cara lateral 1
    [1, 2, 3],    // Cara lateral 2
    [2, 0, 3],    // Cara lateral 3
  ];

  return {
    type: FigureType.TRIANGULAR_PYRAMID,
    vertices,
    edges,
    faces,
  };
};

/**
 * Genera una pirámide de base cuadrada
 */
export const createSquarePyramid = (baseSize: number = 2, height: number = 2): Figure => {
  const half = baseSize / 2;

  const vertices: Vector3D[] = [
    // Base cuadrada (en el plano y = 0)
    { x: -half, y: 0, z: -half }, // 0
    { x: half, y: 0, z: -half },  // 1
    { x: half, y: 0, z: half },   // 2
    { x: -half, y: 0, z: half },  // 3
    // Vértice superior de la pirámide
    { x: 0, y: height, z: 0 },    // 4: ápice
  ];

  const edges: [number, number][] = [
    // Base cuadrada
    [0, 1], [1, 2], [2, 3], [3, 0],
    // Aristas hacia el ápice
    [0, 4], [1, 4], [2, 4], [3, 4],
  ];

  const faces: number[][] = [
    [0, 1, 2, 3], // Base
    [0, 1, 4],    // Cara lateral 1
    [1, 2, 4],    // Cara lateral 2
    [2, 3, 4],    // Cara lateral 3
    [3, 0, 4],    // Cara lateral 4
  ];

  return {
    type: FigureType.SQUARE_PYRAMID,
    vertices,
    edges,
    faces,
  };
};

/**
 * Genera un romboedro (rombo en 3D) - 6 vértices
 * Un romboedro tiene forma de diamante con 6 vértices:
 * - 1 vértice superior
 * - 4 vértices en el plano medio formando un rombo
 * - 1 vértice inferior
 */
export const createRhombus = (size: number = 2): Figure => {
  const half = size / 2;
  const width = size * 0.7; // Ancho del rombo en el medio

  const vertices: Vector3D[] = [
    { x: 0, y: half, z: 0 },              // 0: vértice superior
    { x: -width/2, y: 0, z: 0 },          // 1: vértice medio izquierdo
    { x: 0, y: 0, z: width/2 },           // 2: vértice medio frontal
    { x: width/2, y: 0, z: 0 },           // 3: vértice medio derecho
    { x: 0, y: 0, z: -width/2 },          // 4: vértice medio trasero
    { x: 0, y: -half, z: 0 },             // 5: vértice inferior
  ];

  const edges: [number, number][] = [
    // Aristas desde el vértice superior a los vértices medios
    [0, 1], [0, 2], [0, 3], [0, 4],
    // Aristas del rombo medio
    [1, 2], [2, 3], [3, 4], [4, 1],
    // Aristas desde los vértices medios al vértice inferior
    [1, 5], [2, 5], [3, 5], [4, 5],
  ];

  const faces: number[][] = [
    // Caras superiores (4 triángulos)
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 1],
    // Caras inferiores (4 triángulos)
    [5, 2, 1],
    [5, 3, 2],
    [5, 4, 3],
    [5, 1, 4],
  ];

  return {
    type: FigureType.RHOMBUS,
    vertices,
    edges,
    faces,
  };
};

/**
 * Factory function para crear cualquier figura
 */
export const createFigure = (
  type: FigureType,
  size: number = 2,
  height?: number
): Figure => {
  switch (type) {
    case FigureType.CUBE:
      return createCube(size);
    case FigureType.TRIANGULAR_PYRAMID:
      return createTriangularPyramid(size, height || size);
    case FigureType.SQUARE_PYRAMID:
      return createSquarePyramid(size, height || size);
    case FigureType.RHOMBUS:
      return createRhombus(size);
    default:
      return createCube(size);
  }
};

/**
 * Obtiene el nombre en español de una figura
 */
export const getFigureName = (type: FigureType): string => {
  const names: Record<FigureType, string> = {
    [FigureType.CUBE]: 'Cubo',
    [FigureType.TRIANGULAR_PYRAMID]: 'Pirámide Base Triangular',
    [FigureType.SQUARE_PYRAMID]: 'Pirámide Base Cuadrangular',
    [FigureType.RHOMBUS]: 'Rombo',
  };
  return names[type];
};