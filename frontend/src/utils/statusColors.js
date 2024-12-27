// src/utils/statusColors.js

import { theme } from "../theme";

export const statusColors = {
  'attending': theme.fill.successMain, // Color para asistentes confirmados
  'confirmation pending': theme.fill.warningMain, // Color para pendientes de confirmación
  'not attending': theme.fill.errorMain, // Color para no asistentes
};


//Mapeo del color de cada estado a su variante de tag
export const statusTagVariants = {
  'attending': 'success',
  'confirmation pending': 'warning',
  'not attending': 'danger',
};
