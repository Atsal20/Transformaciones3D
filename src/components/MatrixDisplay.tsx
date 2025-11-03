// src/components/MatrixDisplay.tsx

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Matrix4x4, TransformationParams, TransformationType, RotationAxis } from '../types/geometry';
import {
  createTranslationMatrix,
  createScalingMatrix,
  createRotationMatrix,
  combineTransformations,
  createIdentityMatrix,
} from '../utils/matrices';

interface MatrixDisplayProps {
  transformations: TransformationParams[];
}

export const MatrixDisplay = ({ transformations }: MatrixDisplayProps) => {
  const [expanded, setExpanded] = useState(true);
  const [showIndividual, setShowIndividual] = useState(false);

  // Obtener la matriz combinada
  const getCombinedMatrix = (): Matrix4x4 => {
    if (transformations.length === 0) return createIdentityMatrix();

    const matrices = transformations.map((t) => {
      switch (t.type) {
        case TransformationType.TRANSLATION:
          return createTranslationMatrix(t.values.x, t.values.y, t.values.z);
        case TransformationType.SCALING:
          return createScalingMatrix(t.values.x, t.values.y, t.values.z);
        case TransformationType.ROTATION:
          return createRotationMatrix(t.axis || RotationAxis.Z, t.angle || 0);
        default:
          return createIdentityMatrix();
      }
    });

    return combineTransformations(matrices);
  };

  // Obtener matriz individual
  const getIndividualMatrix = (t: TransformationParams): Matrix4x4 => {
    switch (t.type) {
      case TransformationType.TRANSLATION:
        return createTranslationMatrix(t.values.x, t.values.y, t.values.z);
      case TransformationType.SCALING:
        return createScalingMatrix(t.values.x, t.values.y, t.values.z);
      case TransformationType.ROTATION:
        return createRotationMatrix(t.axis || RotationAxis.Z, t.angle || 0);
      default:
        return createIdentityMatrix();
    }
  };

  // Formatear número para mostrar
  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.0001) return '0';
    if (Math.abs(num - Math.round(num)) < 0.0001) return Math.round(num).toString();
    return num.toFixed(3);
  };

  // Copiar matriz al portapapeles
  const copyToClipboard = (matrix: Matrix4x4) => {
    const text = matrix.map(row => 
      `[${row.map(val => formatNumber(val)).join(', ')}]`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  // Renderizar matriz con estilo
  const renderMatrix = (matrix: Matrix4x4, label: string, color: string = 'primary') => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" color={color}>
          {label}
        </Typography>
        <Tooltip title="Copiar matriz">
          <IconButton size="small" onClick={() => copyToClipboard(matrix)}>
            <CopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#f5f5f5' }}>
        <Table size="small" sx={{ 
          '& .MuiTableCell-root': { 
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          } 
        }}>
          <TableBody>
            {matrix.map((row, i) => (
              <TableRow key={i}>
                {i === 0 && (
                  <TableCell 
                    rowSpan={4} 
                    sx={{ 
                      border: 'none !important', 
                      fontSize: '3rem',
                      color: '#ccc',
                      width: '20px',
                      padding: '0 !important'
                    }}
                  >
                    [
                  </TableCell>
                )}
                {row.map((cell, j) => (
                  <TableCell 
                    key={j}
                    sx={{ 
                      bgcolor: cell !== 0 && cell !== 1 ? '#e3f2fd' : 'inherit',
                      fontWeight: cell !== 0 && cell !== 1 ? 'bold' : 'normal',
                      color: cell !== 0 && cell !== 1 ? '#1976d2' : 'inherit'
                    }}
                  >
                    {formatNumber(cell)}
                  </TableCell>
                ))}
                {i === 0 && (
                  <TableCell 
                    rowSpan={4} 
                    sx={{ 
                      border: 'none !important', 
                      fontSize: '3rem',
                      color: '#ccc',
                      width: '20px',
                      padding: '0 !important'
                    }}
                  >
                    ]
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Obtener nombre de transformación
  const getTransformationName = (t: TransformationParams, index: number): string => {
    switch (t.type) {
      case TransformationType.TRANSLATION:
        return `T${index + 1}(${formatNumber(t.values.x)}, ${formatNumber(t.values.y)}, ${formatNumber(t.values.z)})`;
      case TransformationType.SCALING:
        return `S${index + 1}(${formatNumber(t.values.x)}, ${formatNumber(t.values.y)}, ${formatNumber(t.values.z)})`;
      case TransformationType.ROTATION:
        return `R${index + 1}${t.axis}(${formatNumber(t.angle || 0)}°)`;
      default:
        return `T${index + 1}`;
    }
  };

  const combinedMatrix = getCombinedMatrix();

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="primary">
              📊 Matrices de Transformación
            </Typography>
            <Chip 
              label={transformations.length === 0 ? 'Identidad' : `${transformations.length} transformación${transformations.length > 1 ? 'es' : ''}`}
              size="small"
              color={transformations.length === 0 ? 'default' : 'primary'}
            />
          </Box>
          <Box>
            {transformations.length > 0 && (
              <Tooltip title={showIndividual ? "Ocultar matrices individuales" : "Mostrar matrices individuales"}>
                <IconButton size="small" onClick={() => setShowIndividual(!showIndividual)}>
                  {showIndividual ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            )}
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
        </Box>

        <Collapse in={expanded}>
          {transformations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              <Typography variant="body2">
                No hay transformaciones aplicadas.
              </Typography>
              <Typography variant="caption">
                La matriz actual es la matriz identidad (I₄)
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Matriz resultante de la composición de {transformations.length} transformación{transformations.length > 1 ? 'es' : ''}
              </Typography>

              {/* Fórmula de composición */}
              {transformations.length > 1 && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    M = {transformations.map((t, i) => getTransformationName(t, i)).join(' × ')}
                  </Typography>
                </Box>
              )}

              {/* Matriz combinada */}
              {renderMatrix(combinedMatrix, 'Matriz Combinada (M)', 'primary')}

              {/* Matrices individuales */}
              <Collapse in={showIndividual}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom color="secondary">
                  Matrices Individuales:
                </Typography>
                {transformations.map((t, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {renderMatrix(
                      getIndividualMatrix(t),
                      getTransformationName(t, index),
                      'secondary'
                    )}
                  </Box>
                ))}
              </Collapse>

              {/* Información adicional */}
              <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="caption" color="primary">
                  💡 <strong>Nota:</strong> Las matrices se multiplican de derecha a izquierda.
                  La primera transformación aplicada aparece a la derecha en la fórmula.
                </Typography>
              </Box>
            </>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default MatrixDisplay;
