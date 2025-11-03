// src/types/geometry.ts

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type Matrix4x4 = number[][];

export enum FigureType {
  CUBE = 'cube',
  TRIANGULAR_PYRAMID = 'triangular_pyramid',
  SQUARE_PYRAMID = 'square_pyramid',
  RHOMBUS = 'rhombus',
}

export enum TransformationType {
  TRANSLATION = 'translation',
  SCALING = 'scaling',
  ROTATION = 'rotation',
}

export enum RotationAxis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}

export interface TransformationParams {
  type: TransformationType;
  values: Vector3D;
  axis?: RotationAxis;
  angle?: number;
}

export interface Figure {
  type: FigureType;
  vertices: Vector3D[];
  edges: [number, number][];
  faces: number[][];
}

export interface AppState {
  currentFigure: FigureType | null;
  baseVertices: Vector3D[];
  transformedVertices: Vector3D[];
  transformations: TransformationParams[];
  showGrid: boolean;
  showAxes: boolean;
}