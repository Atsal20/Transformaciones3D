# Transformaciones 3D - Proyecto de Graficación por Computadora

Aplicación web interactiva para visualizar y aplicar transformaciones geométricas en figuras 3D.

## 🚀 Stack Tecnológico

- **React 18** con TypeScript
- **Vite** - rolldown-vite
- **Material-UI (MUI)** - Componentes UI
- **Three.js** - Renderizado 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Utilidades para R3F

## 📋 Características

### Figuras 3D Disponibles
1. **Cubo** - Hexaedro regular
2. **Pirámide Base Triangular** - Tetraedro
3. **Pirámide Base Cuadrangular** - Pirámide cuadrada
4. **Rombo** - Romboedro

### Transformaciones Implementadas

#### 1. Traslación
- Desplazamiento en ejes X, Y, Z
- Matriz de transformación homogénea 4x4
- Fórmulas: `x' = x + tx`, `y' = y + ty`, `z' = z + tz`

#### 2. Escalamiento
- Modificación de tamaño en cada eje
- Escalamiento multiplicativo
- Fórmulas: `x' = x * sx`, `y' = y * sy`, `z' = z * sz`

#### 3. Rotación
- Rotación sobre ejes X, Y, Z
- Ángulos en grados
- Matrices de rotación:
  - **Eje X**: Rota en plano YZ
  - **Eje Y**: Rota en plano XZ
  - **Eje Z**: Rota en plano XY


## 📦 Estructura del Proyecto

```
transformaciones-3d/
├── src/
│   ├── components/
│   │   ├── Scene3D.tsx          # Canvas 3D y renderizado
│   │   ├── FigureSelector.tsx   # Selector de figuras
│   │   ├── CoordinateInput.tsx  # Input de coordenadas
│   │   └── TransformPanel.tsx   # Panel de transformaciones
│   ├── types/
│   │   └── geometry.ts          # Tipos TypeScript
│   ├── utils/
│   │   ├── matrices.ts          # Operaciones matriciales
│   │   └── figures.ts           # Generadores de figuras
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🎮 Uso

1. **Seleccionar Figura**: Elige entre cubo, pirámide triangular, pirámide cuadrangular o rombo
2. **Ingresar Coordenadas**: Define las coordenadas de los vértices principales
3. **Visualizar**: La figura se renderiza en el canvas 3D
4. **Aplicar Transformaciones**:
   - **Traslación**: Ingresa valores tx, ty, tz
   - **Escalamiento**: Ingresa factores sx, sy, sz
   - **Rotación**: Selecciona eje (X/Y/Z) e ingresa ángulo en grados

## 📐 Fundamentos Matemáticos

### Coordenadas Homogéneas
Representación de puntos 3D en espacio 4D: `(x, y, z, 1)`

### Matrices de Transformación

**Traslación:**
```
[1  0  0  tx]
[0  1  0  ty]
[0  0  1  tz]
[0  0  0  1 ]
```

**Escalamiento:**
```
[sx 0  0  0]
[0  sy 0  0]
[0  0  sz 0]
[0  0  0  1]
```

**Rotación Z:**
```
[cos θ  -sin θ  0  0]
[sin θ   cos θ  0  0]
[0       0      1  0]
[0       0      0  1]
```

**Rotación X:**
```
[1  0       0      0]
[0  cos θ  -sin θ  0]
[0  sin θ   cos θ  0]
[0  0       0      1]
```

**Rotación Y:**
```
[cos θ   0  sin θ  0]
[0       1  0      0]
[-sin θ  0  cos θ  0]
[0       0  0      1]
```

### Transformaciones Compuestas
Las transformaciones múltiples se aplican mediante multiplicación de matrices (premultiplicación).

## 🎨 Características de la Interfaz

- **Canvas 3D Interactivo**: Control orbital con mouse
- **Panel de Control**: Formularios con validación
- **Visualización en Tiempo Real**: Actualización instantánea
- **Ejes de Referencia**: Grid y ejes X, Y, Z coloreados
- **Material UI**: Diseño moderno y responsivo


## 🚀 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Preview de build de producción
npm run lint     # Ejecutar linter
```

## 🎓 Conceptos Implementados

- Transformaciones geométricas 2D y 3D
- Coordenadas homogéneas
- Matrices de transformación
- Composición de transformaciones
- Rotaciones sobre ejes arbitrarios
- Reflexiones y simetría
- Renderizado 3D en tiempo real

## 👨‍💻 Desarrollo

El proyecto implementa los conceptos teóricos de graficación por computadora basados en el documento "transformaciones-3d" de M. en I. Liliana Hernández Cervantes.

## 📄 Licencia

Proyecto educativo - Graficación por Computadora

---

## Desarrollado por:
Garces Perez Alan Jesus
Navarro Melo Cristian Eduardo

