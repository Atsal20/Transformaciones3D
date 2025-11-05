// src/components/VertexComparison.tsx

import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingFlat as ArrowIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Vector3D } from '../types/geometry';

interface VertexComparisonProps {
  originalVertices: Vector3D[];
  transformedVertices: Vector3D[];
}

export const VertexComparison = ({
  originalVertices,
  transformedVertices,
}: VertexComparisonProps) => {
  const [expanded, setExpanded] = useState(true);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.0001) return '0.000';
    return num.toFixed(3);
  };

  const hasChanged = (original: Vector3D, transformed: Vector3D): boolean => {
    return (
      Math.abs(original.x - transformed.x) > 0.0001 ||
      Math.abs(original.y - transformed.y) > 0.0001 ||
      Math.abs(original.z - transformed.z) > 0.0001
    );
  };

  const calculateDifference = (original: number, transformed: number): string => {
    const diff = transformed - original;
    if (Math.abs(diff) < 0.0001) return '0.000';
    return (diff > 0 ? '+' : '') + diff.toFixed(3);
  };

  const getChangeColor = (original: number, transformed: number): string => {
    const diff = Math.abs(transformed - original);
    if (diff < 0.0001) return 'inherit';
    return '#2196f3'; // Azul para cambios
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="primary">
               Comparación de Vértices
            </Typography>
            <Chip
              label={`${originalVertices.length} vértices`}
              size="small"
              color="primary"
            />
          </Box>
          <Tooltip title={expanded ? "Contraer" : "Expandir"}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={expanded}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comparación de coordenadas originales vs transformadas
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Vértice
                  </TableCell>
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', borderRight: '2px solid #ddd' }}>
                    Coordenadas Originales
                  </TableCell>
                  <TableCell align="center" sx={{ width: '40px' }}></TableCell>
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', borderLeft: '2px solid #ddd' }}>
                    Coordenadas Transformadas
                  </TableCell>
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', bgcolor: '#e3f2fd' }}>
                    Diferencia
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">X</TableCell>
                  <TableCell align="center">Y</TableCell>
                  <TableCell align="center" sx={{ borderRight: '2px solid #ddd' }}>Z</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center" sx={{ borderLeft: '2px solid #ddd' }}>X</TableCell>
                  <TableCell align="center">Y</TableCell>
                  <TableCell align="center">Z</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#e3f2fd' }}>ΔX</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#e3f2fd' }}>ΔY</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#e3f2fd' }}>ΔZ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {originalVertices.map((original, index) => {
                  const transformed = transformedVertices[index] || { x: 0, y: 0, z: 0 };
                  const changed = hasChanged(original, transformed);

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                        bgcolor: changed ? '#fff3e0' : 'inherit',
                      }}
                    >
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        V{index + 1}
                      </TableCell>

                      {/* Coordenadas originales */}
                      <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                        {formatNumber(original.x)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                        {formatNumber(original.y)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', borderRight: '2px solid #ddd' }}>
                        {formatNumber(original.z)}
                      </TableCell>

                      {/* Flecha */}
                      <TableCell align="center">
                        <ArrowIcon fontSize="small" color={changed ? 'primary' : 'disabled'} />
                      </TableCell>

                      {/* Coordenadas transformadas */}
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          borderLeft: '2px solid #ddd',
                          color: getChangeColor(original.x, transformed.x),
                          fontWeight: changed ? 'bold' : 'normal',
                        }}
                      >
                        {formatNumber(transformed.x)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          color: getChangeColor(original.y, transformed.y),
                          fontWeight: changed ? 'bold' : 'normal',
                        }}
                      >
                        {formatNumber(transformed.y)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          color: getChangeColor(original.z, transformed.z),
                          fontWeight: changed ? 'bold' : 'normal',
                        }}
                      >
                        {formatNumber(transformed.z)}
                      </TableCell>

                      {/* Diferencias */}
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.85rem',
                        }}
                      >
                        {calculateDifference(original.x, transformed.x)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.85rem',
                        }}
                      >
                        {calculateDifference(original.y, transformed.y)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.85rem',
                        }}
                      >
                        {calculateDifference(original.z, transformed.z)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="caption" color="warning.dark">
               <strong>Leyenda:</strong> Los vértices con fondo naranja claro han cambiado. 
              La columna "Diferencia" (Δ) muestra el cambio en cada eje.
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default VertexComparison;