// src/utils/matrices.ts

import { Matrix4x4, Vector3D, RotationAxis } from '../types/geometry';

export type { Matrix4x4 };

/**
 * Crea una matriz identidad 4x4
 */
export const createIdentityMatrix = (): Matrix4x4 => {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de traslación 3D
 * T(tx, ty, tz)
 */
export const createTranslationMatrix = (tx: number, ty: number, tz: number): Matrix4x4 => {
  return [
    [1, 0, 0, tx],
    [0, 1, 0, ty],
    [0, 0, 1, tz],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de escalamiento 3D
 * S(sx, sy, sz)
 */
export const createScalingMatrix = (sx: number, sy: number, sz: number): Matrix4x4 => {
  return [
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de rotación sobre el eje Z
 * Rz(θ)
 */
export const createRotationZMatrix = (angleInDegrees: number): Matrix4x4 => {
  const rad = (angleInDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de rotación sobre el eje X
 * Rx(θ)
 */
export const createRotationXMatrix = (angleInDegrees: number): Matrix4x4 => {
  const rad = (angleInDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de rotación sobre el eje Y
 * Ry(θ)
 */
export const createRotationYMatrix = (angleInDegrees: number): Matrix4x4 => {
  const rad = (angleInDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
};

/**
 * Crea una matriz de rotación según el eje especificado
 */
export const createRotationMatrix = (axis: RotationAxis, angleInDegrees: number): Matrix4x4 => {
  switch (axis) {
    case RotationAxis.X:
      return createRotationXMatrix(angleInDegrees);
    case RotationAxis.Y:
      return createRotationYMatrix(angleInDegrees);
    case RotationAxis.Z:
      return createRotationZMatrix(angleInDegrees);
    default:
      return createIdentityMatrix();
  }
};

/**
 * Multiplica dos matrices 4x4
 * Resultado = A * B
 */
export const multiplyMatrices = (a: Matrix4x4, b: Matrix4x4): Matrix4x4 => {
  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
};

/**
 * Aplica una matriz de transformación a un vector 3D
 * Convierte el vector a coordenadas homogéneas (x, y, z, 1)
 */
export const applyMatrixToVector = (matrix: Matrix4x4, vector: Vector3D): Vector3D => {
  const homogeneous = [vector.x, vector.y, vector.z, 1];
  const result = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i] += matrix[i][j] * homogeneous[j];
    }
  }

  // Dividir por el componente homogéneo (w) si no es 1
  const w = result[3];
  return {
    x: result[0] / w,
    y: result[1] / w,
    z: result[2] / w,
  };
};

/**
 * Aplica una matriz de transformación a un array de vectores
 */
export const applyMatrixToVertices = (matrix: Matrix4x4, vertices: Vector3D[]): Vector3D[] => {
  return vertices.map((vertex) => applyMatrixToVector(matrix, vertex));
};

/**
 * Combina múltiples matrices de transformación
 * El orden es importante: las transformaciones se aplican de derecha a izquierda
 */
export const combineTransformations = (matrices: Matrix4x4[]): Matrix4x4 => {
  if (matrices.length === 0) return createIdentityMatrix();
  if (matrices.length === 1) return matrices[0];

  return matrices.reduce((acc, matrix) => multiplyMatrices(matrix, acc));
};

/**
 * Imprime una matriz 4x4 en formato legible (útil para debugging)
 */
export const printMatrix = (matrix: Matrix4x4, name: string = 'Matrix'): void => {
  console.log(`${name}:`);
  matrix.forEach((row) => {
    console.log(row.map((val) => val.toFixed(4)).join('\t'));
  });
};