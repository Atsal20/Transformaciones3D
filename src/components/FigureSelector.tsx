// src/components/FigureSelector.tsx

import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { FigureType } from '../types/geometry';
import { getFigureName } from '../utils/figures';

interface FigureSelectorProps {
  selectedFigure: FigureType | null;
  onFigureChange: (figure: FigureType) => void;
}

export const FigureSelector = ({ selectedFigure, onFigureChange }: FigureSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onFigureChange(event.target.value as FigureType);
  };

  const figures = [
    { value: FigureType.CUBE, label: getFigureName(FigureType.CUBE), icon: '🧊' },
    { value: FigureType.TRIANGULAR_PYRAMID, label: getFigureName(FigureType.TRIANGULAR_PYRAMID), icon: '🔺' },
    { value: FigureType.SQUARE_PYRAMID, label: getFigureName(FigureType.SQUARE_PYRAMID), icon: '🔼' },
    { value: FigureType.RHOMBUS, label: getFigureName(FigureType.RHOMBUS), icon: '💎' },
  ];

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          1. Seleccionar Figura
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Elige la figura geométrica 3D que deseas visualizar
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="figure-select-label">Figura 3D</InputLabel>
          <Select
            labelId="figure-select-label"
            id="figure-select"
            value={selectedFigure || ''}
            label="Figura 3D"
            onChange={handleChange}
          >
            {figures.map((figure) => (
              <MenuItem key={figure.value} value={figure.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.5rem' }}>{figure.icon}</span>
                  <span>{figure.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedFigure && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'primary.light',
              borderRadius: 1,
              color: 'white',
            }}
          >
            <Typography variant="body2">
              <strong>Figura seleccionada:</strong> {getFigureName(selectedFigure)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FigureSelector;