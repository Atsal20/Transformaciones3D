// src/components/TransformPanel.tsx

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Transform as TransformIcon,
  ZoomOutMap as ScaleIcon,
  Rotate90DegreesCcw as RotateIcon,
  DeleteOutline as ClearIcon,
} from '@mui/icons-material';
import { TransformationType, RotationAxis, TransformationParams } from '../types/geometry';

interface TransformPanelProps {
  onApplyTransformation: (params: TransformationParams) => void;
  onResetTransformations: () => void;
  transformationsCount: number;
  enableAnimation: boolean;
  onToggleAnimation: (enabled: boolean) => void;
}

export const TransformPanel = ({
  onApplyTransformation,
  onResetTransformations,
  transformationsCount,
  enableAnimation,
  onToggleAnimation,
}: TransformPanelProps) => {
  const [transformType, setTransformType] = useState<TransformationType>(TransformationType.TRANSLATION);
  const [tx, setTx] = useState<string>('0');
  const [ty, setTy] = useState<string>('0');
  const [tz, setTz] = useState<string>('0');
  const [angle, setAngle] = useState<string>('45');
  const [rotationAxis, setRotationAxis] = useState<RotationAxis>(RotationAxis.Z);

  const handleTransformTypeChange = (_: React.MouseEvent<HTMLElement>, newType: TransformationType | null) => {
    if (newType !== null) {
      setTransformType(newType);
    }
  };

  const handleAxisChange = (_: React.MouseEvent<HTMLElement>, newAxis: RotationAxis | null) => {
    if (newAxis !== null) {
      setRotationAxis(newAxis);
    }
  };

  const handleApply = () => {
    const params: TransformationParams = {
      type: transformType,
      values: {
        x: parseFloat(tx) || 0,
        y: parseFloat(ty) || 0,
        z: parseFloat(tz) || 0,
      },
    };

    if (transformType === TransformationType.ROTATION) {
      params.axis = rotationAxis;
      params.angle = parseFloat(angle) || 0;
    }

    onApplyTransformation(params);
  };

  const getTransformLabel = () => {
    switch (transformType) {
      case TransformationType.TRANSLATION:
        return 'Traslación';
      case TransformationType.SCALING:
        return 'Escalamiento';
      case TransformationType.ROTATION:
        return 'Rotación';
      default:
        return 'Transformación';
    }
  };

  const getTransformDescription = () => {
    switch (transformType) {
      case TransformationType.TRANSLATION:
        return 'Desplaza la figura en el espacio 3D';
      case TransformationType.SCALING:
        return 'Modifica el tamaño de la figura en cada eje';
      case TransformationType.ROTATION:
        return 'Rota la figura alrededor de un eje';
      default:
        return '';
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            3. Aplicar Transformaciones
          </Typography>
          {transformationsCount > 0 && (
            <Chip
              label={`${transformationsCount} transformación${transformationsCount > 1 ? 'es' : ''}`}
              color="primary"
              size="small"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getTransformDescription()}
        </Typography>

        {/* Control de animación */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={enableAnimation}
                onChange={(e) => onToggleAnimation(e.target.checked)}
                color="secondary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="bold">
                   Animación de Transformaciones
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {enableAnimation 
                    ? 'Las transformaciones se animarán suavemente' 
                    : 'Las transformaciones se aplicarán instantáneamente'}
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Selector de tipo de transformación */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tipo de Transformación
          </Typography>
          <ToggleButtonGroup
            value={transformType}
            exclusive
            onChange={handleTransformTypeChange}
            fullWidth
            color="primary"
          >
            <ToggleButton value={TransformationType.TRANSLATION}>
              <TransformIcon sx={{ mr: 1 }} />
              Traslación
            </ToggleButton>
            <ToggleButton value={TransformationType.SCALING}>
              <ScaleIcon sx={{ mr: 1 }} />
              Escalamiento
            </ToggleButton>
            <ToggleButton value={TransformationType.ROTATION}>
              <RotateIcon sx={{ mr: 1 }} />
              Rotación
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Parámetros según el tipo de transformación */}
        {transformType === TransformationType.ROTATION ? (
          <>
            {/* Selector de eje */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Eje de Rotación
              </Typography>
              <ToggleButtonGroup
                value={rotationAxis}
                exclusive
                onChange={handleAxisChange}
                fullWidth
                color="secondary"
              >
                <ToggleButton value={RotationAxis.X}>Eje X</ToggleButton>
                <ToggleButton value={RotationAxis.Y}>Eje Y</ToggleButton>
                <ToggleButton value={RotationAxis.Z}>Eje Z</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Ángulo */}
            <TextField
              fullWidth
              label="Ángulo (grados)"
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              helperText="Ángulo de rotación en grados (positivo = sentido antihorario)"
              sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Rotación sobre eje {rotationAxis.toUpperCase()}:</strong>
              <br />
              {rotationAxis === RotationAxis.X && 'Rota en el plano YZ'}
              {rotationAxis === RotationAxis.Y && 'Rota en el plano XZ'}
              {rotationAxis === RotationAxis.Z && 'Rota en el plano XY'}
            </Alert>
          </>
        ) : (
          <>
            {/* Valores X, Y, Z */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={transformType === TransformationType.TRANSLATION ? 'tx' : 'sx'}
                type="number"
                value={tx}
                onChange={(e) => setTx(e.target.value)}
                helperText={transformType === TransformationType.TRANSLATION ? 'Desplaz. X' : 'Escala X'}
                inputProps={{ step: '0.1' }}
              />
              <TextField
                fullWidth
                label={transformType === TransformationType.TRANSLATION ? 'ty' : 'sy'}
                type="number"
                value={ty}
                onChange={(e) => setTy(e.target.value)}
                helperText={transformType === TransformationType.TRANSLATION ? 'Desplaz. Y' : 'Escala Y'}
                inputProps={{ step: '0.1' }}
              />
              <TextField
                fullWidth
                label={transformType === TransformationType.TRANSLATION ? 'tz' : 'sz'}
                type="number"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                helperText={transformType === TransformationType.TRANSLATION ? 'Desplaz. Z' : 'Escala Z'}
                inputProps={{ step: '0.1' }}
              />
            </Box>

            {transformType === TransformationType.SCALING && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Valores menores a 1 reducen el tamaño, mayores a 1 lo aumentan. Valores negativos
                crean reflexiones.
              </Alert>
            )}
          </>
        )}

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            startIcon={<TransformIcon />}
          >
            Aplicar {getTransformLabel()}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onResetTransformations}
            startIcon={<ClearIcon />}
            disabled={transformationsCount === 0}
          >
            Resetear
          </Button>
        </Box>

        {transformationsCount > 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Se han aplicado {transformationsCount} transformación{transformationsCount > 1 ? 'es' : ''}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TransformPanel;