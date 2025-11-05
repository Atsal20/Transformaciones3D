// src/components/CoordinateInput.tsx

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as ApplyIcon,
  Refresh as ResetIcon,
} from '@mui/icons-material';
import { Vector3D, FigureType } from '../types/geometry';

interface CoordinateInputProps {
  figureType: FigureType;
  onCoordinatesSubmit: (vertices: Vector3D[]) => void;
  suggestedVertexCount: number;
}

export const CoordinateInput = ({
  figureType,
  onCoordinatesSubmit,
  suggestedVertexCount,
}: CoordinateInputProps) => {
  const [vertices, setVertices] = useState<Vector3D[]>([
    { x: 0, y: 0, z: 0 },
  ]);
  const [error, setError] = useState<string>('');

  const getFigureName = () => {
    const names: Record<FigureType, string> = {
      cube: 'Cubo',
      triangular_pyramid: 'Pirámide Triangular',
      square_pyramid: 'Pirámide Cuadrangular',
      rhombus: 'Rombo',
    };
    return names[figureType];
  };

  const getVertexRequirement = () => {
    const requirements: Record<FigureType, string> = {
      cube: '8 vértices (esquinas del cubo)',
      triangular_pyramid: '4 vértices (3 base + 1 ápice)',
      square_pyramid: '5 vértices (4 base + 1 ápice)',
      rhombus: '6 vértices (1 superior + 4 medio + 1 inferior)',
    };
    return requirements[figureType];
  };

  const handleVertexChange = (index: number, axis: 'x' | 'y' | 'z', value: string) => {
    const newVertices = [...vertices];
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      newVertices[index] = {
        ...newVertices[index],
        [axis]: numValue,
      };
      setVertices(newVertices);
      setError('');
    }
  };

  const addVertex = () => {
    if (vertices.length < 20) {
      setVertices([...vertices, { x: 0, y: 0, z: 0 }]);
    }
  };

  const removeVertex = (index: number) => {
    if (vertices.length > 1) {
      const newVertices = vertices.filter((_, i) => i !== index);
      setVertices(newVertices);
    }
  };

  const handleSubmit = () => {
    if (vertices.length < suggestedVertexCount) {
      setError(`Se requieren al menos ${suggestedVertexCount} vértices para ${getFigureName()}`);
      return;
    }

    // Validar que no haya valores NaN o undefined
    const isValid = vertices.every(
      (v) => !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z)
    );

    if (!isValid) {
      setError('Todos los campos deben tener valores numéricos válidos');
      return;
    }

    setError('');
    onCoordinatesSubmit(vertices);
  };

  const loadDefaultCoordinates = () => {
    const defaults: Record<FigureType, Vector3D[]> = {
      cube: [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 },
      ],
      triangular_pyramid: [
        { x: 0, y: 0, z: 1 },
        { x: -1, y: 0, z: -0.5 },
        { x: 1, y: 0, z: -0.5 },
        { x: 0, y: 2, z: 0 },
      ],
      square_pyramid: [
        { x: -1, y: 0, z: -1 },
        { x: 1, y: 0, z: -1 },
        { x: 1, y: 0, z: 1 },
        { x: -1, y: 0, z: 1 },
        { x: 0, y: 2, z: 0 },
      ],
      rhombus: [
        { x: 0, y: 1, z: 0 },
        { x: -1, y: 0, z: 0.25 },
        { x: 0, y: -1, z: 0 },
        { x: 1, y: 0, z: 0.25 },
        { x: 0, y: 1, z: 2 },
        { x: 0, y: -1, z: 2 },
      ],
    };

    setVertices(defaults[figureType]);
    setError('');
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            2. Ingresar Coordenadas
          </Typography>
          <Chip
            label={`${vertices.length}/${suggestedVertexCount} vértices`}
            color={vertices.length >= suggestedVertexCount ? 'success' : 'warning'}
            size="small"
          />
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{getFigureName()}</strong>: {getVertexRequirement()}
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={loadDefaultCoordinates}
            startIcon={<ResetIcon />}
            fullWidth
          >
            Cargar Coordenadas por Defecto
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2 }}>
          {vertices.map((vertex, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                border: '1px solid #ddd',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  Vértice {index + 1}
                </Typography>
                {vertices.length > 1 && (
                  <Tooltip title="Eliminar vértice">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeVertex(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    label="X"
                    type="number"
                    size="small"
                    fullWidth
                    value={vertex.x}
                    onChange={(e) => handleVertexChange(index, 'x', e.target.value)}
                    inputProps={{ step: '0.1' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Y"
                    type="number"
                    size="small"
                    fullWidth
                    value={vertex.y}
                    onChange={(e) => handleVertexChange(index, 'y', e.target.value)}
                    inputProps={{ step: '0.1' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Z"
                    type="number"
                    size="small"
                    fullWidth
                    value={vertex.z}
                    onChange={(e) => handleVertexChange(index, 'z', e.target.value)}
                    inputProps={{ step: '0.1' }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>

        {vertices.length < 20 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addVertex}
            fullWidth
            sx={{ mb: 2 }}
          >
            Agregar Vértice
          </Button>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          startIcon={<ApplyIcon />}
          disabled={vertices.length < suggestedVertexCount}
        >
          Aplicar Coordenadas y Dibujar
        </Button>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="caption" color="primary">
             <strong>Tip:</strong> Puedes agregar más vértices de los sugeridos, 
            pero se recomienda usar el número indicado para la figura seleccionada.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoordinateInput;