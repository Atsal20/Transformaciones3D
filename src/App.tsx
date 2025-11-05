// src/App.tsx

import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Scene3D } from './components/Scene3D';
import { FigureSelector } from './components/FigureSelector';
import { CoordinateInput } from './components/CoordinateInput';
import { TransformPanel } from './components/TransformPanel';
import { MatrixDisplay } from './components/MatrixDisplay';
import { VertexComparison } from './components/VertexComparison';
import { FigureType, TransformationParams, Vector3D } from './types/geometry';
import { createFigure } from './utils/figures';
import {
  createTranslationMatrix,
  createScalingMatrix,
  createRotationMatrix,
  applyMatrixToVertices,
  combineTransformations,
  Matrix4x4,
  createIdentityMatrix,
} from './utils/matrices';
import { TransformationType } from './types/geometry';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [selectedFigure, setSelectedFigure] = useState<FigureType | null>(null);
  const [userDefinedVertices, setUserDefinedVertices] = useState<Vector3D[]>([]);
  const [baseVertices, setBaseVertices] = useState<Vector3D[]>([]);
  const [transformedVertices, setTransformedVertices] = useState<Vector3D[]>([]);
  const [targetVertices, setTargetVertices] = useState<Vector3D[]>([]);
  const [edges, setEdges] = useState<[number, number][]>([]);
  const [faces, setFaces] = useState<number[][]>([]);
  const [transformationMatrices, setTransformationMatrices] = useState<Matrix4x4[]>([]);
  const [transformations, setTransformations] = useState<TransformationParams[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [figureDrawn, setFigureDrawn] = useState(false);

  const getSuggestedVertexCount = (figureType: FigureType): number => {
    const counts: Record<FigureType, number> = {
      [FigureType.CUBE]: 8,
      [FigureType.TRIANGULAR_PYRAMID]: 4,
      [FigureType.SQUARE_PYRAMID]: 5,
      [FigureType.RHOMBUS]: 6,
    };
    return counts[figureType];
  };

  const handleFigureChange = (figureType: FigureType) => {
    setSelectedFigure(figureType);
    setFigureDrawn(false);
    setUserDefinedVertices([]);
    setBaseVertices([]);
    setTransformedVertices([]);
    setTargetVertices([]);
    setTransformationMatrices([]);
    setTransformations([]);
    setIsAnimating(false);
  };

  const handleCoordinatesSubmit = (vertices: Vector3D[]) => {
    // Guardar vértices definidos por el usuario
    setUserDefinedVertices(vertices);
    
    // Usar los vértices del usuario para crear la figura
    const figure = createFigure(selectedFigure!, 2);
    
    // Reemplazar vértices de la figura con los del usuario
    const customFigure = {
      ...figure,
      vertices: vertices,
    };
    
    setBaseVertices(vertices);
    setTransformedVertices(vertices);
    setTargetVertices(vertices);
    setEdges(customFigure.edges);
    setFaces(customFigure.faces);
    setTransformationMatrices([]);
    setTransformations([]);
    setIsAnimating(false);
    setFigureDrawn(true);
  };

  const handleApplyTransformation = (params: TransformationParams) => {
    let matrix: Matrix4x4;

    switch (params.type) {
      case TransformationType.TRANSLATION:
        matrix = createTranslationMatrix(params.values.x, params.values.y, params.values.z);
        break;
      case TransformationType.SCALING:
        matrix = createScalingMatrix(params.values.x, params.values.y, params.values.z);
        break;
      case TransformationType.ROTATION:
        if (params.axis && params.angle !== undefined) {
          matrix = createRotationMatrix(params.axis, params.angle);
        } else {
          matrix = createIdentityMatrix();
        }
        break;
      default:
        matrix = createIdentityMatrix();
    }

    // Agregar la nueva matriz y transformación a las listas
    const newMatrices = [...transformationMatrices, matrix];
    const newTransformations = [...transformations, params];
    setTransformationMatrices(newMatrices);
    setTransformations(newTransformations);

    // Combinar todas las transformaciones
    const combinedMatrix = combineTransformations(newMatrices);

    // Aplicar la transformación combinada a los vértices base
    const newVertices = applyMatrixToVertices(combinedMatrix, baseVertices);
    
    if (enableAnimation) {
      setTargetVertices(newVertices);
      setIsAnimating(true);
    } else {
      setTransformedVertices(newVertices);
      setTargetVertices(newVertices);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setTransformedVertices(targetVertices);
  };

  const handleResetTransformations = () => {
    setTransformationMatrices([]);
    setTransformations([]);
    if (enableAnimation) {
      setTargetVertices(baseVertices);
      setIsAnimating(true);
    } else {
      setTransformedVertices(baseVertices);
      setTargetVertices(baseVertices);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Transformaciones 3D - Graficación por Computadora
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Panel izquierdo - Controles */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Selector de figura */}
                <FigureSelector
                  selectedFigure={selectedFigure}
                  onFigureChange={handleFigureChange}
                />

                {/* Input de coordenadas */}
                {selectedFigure && !figureDrawn && (
                  <CoordinateInput
                    figureType={selectedFigure}
                    onCoordinatesSubmit={handleCoordinatesSubmit}
                    suggestedVertexCount={getSuggestedVertexCount(selectedFigure)}
                  />
                )}

                {/* Información */}
                {selectedFigure && figureDrawn && (
                  <Paper elevation={3} sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                    <Typography variant="h6" gutterBottom>
                       Figura Dibujada
                    </Typography>
                    <Typography variant="body2">
                      La figura se muestra en el canvas 3D. Usa el mouse para:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                      <li> Click izquierdo + arrastrar: Rotar</li>
                      <li> Rueda del mouse: Zoom</li>
                      <li> Click derecho + arrastrar: Mover</li>
                    </Box>
                  </Paper>
                )}

                {/* Panel de transformaciones */}
                {selectedFigure && figureDrawn && (
                  <TransformPanel
                    onApplyTransformation={handleApplyTransformation}
                    onResetTransformations={handleResetTransformations}
                    transformationsCount={transformationMatrices.length}
                    enableAnimation={enableAnimation}
                    onToggleAnimation={setEnableAnimation}
                  />
                )}

                {/* Panel de matrices */}
                {selectedFigure && figureDrawn && (
                  <MatrixDisplay transformations={transformations} />
                )}

                {/* Comparación de vértices */}
                {selectedFigure && figureDrawn && transformations.length > 0 && (
                  <VertexComparison
                    originalVertices={userDefinedVertices}
                    transformedVertices={transformedVertices}
                  />
                )}
              </Box>
            </Grid>

            {/* Panel derecho - Visualización 3D */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    Canvas 3D - Visualización
                  </Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showGrid}
                          onChange={(e) => setShowGrid(e.target.checked)}
                        />
                      }
                      label="Grid"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showAxes}
                          onChange={(e) => setShowAxes(e.target.checked)}
                        />
                      }
                      label="Ejes"
                    />
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {selectedFigure && figureDrawn ? (
                  <Scene3D
                    vertices={transformedVertices}
                    targetVertices={targetVertices}
                    edges={edges}
                    faces={faces}
                    showGrid={showGrid}
                    showAxes={showAxes}
                    isAnimating={isAnimating}
                    onAnimationComplete={handleAnimationComplete}
                    figureKey={selectedFigure}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#e3f2fd',
                      borderRadius: 2,
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {selectedFigure 
                        ? ' Ingresa las coordenadas de los vértices' 
                        : ' Selecciona una figura para comenzar'}
                    </Typography>
                    {selectedFigure && (
                      <Typography variant="body2" color="text.secondary">
                        Completa el formulario de coordenadas y haz click en "Aplicar"
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Información de vértices */}
                {selectedFigure && transformedVertices.length > 0 && (
                  <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Información de la Figura
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Vértices: <strong>{transformedVertices.length}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Aristas: <strong>{edges.length}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Caras: <strong>{faces.length}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center', pb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Proyecto de Graficación por Computadora | Transformaciones Geométricas 3D
            </Typography>
            <Typography variant="caption" color="text.secondary">
              React + TypeScript + Three.js + Material-UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;