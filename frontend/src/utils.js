// utils.js
export const getEmptyStateIcon = (eventType) => {
  switch (eventType) {
    case 'Quedada':
      return '/icons/quedada.svg'
    case 'Competición':
      return '/icons/competicion.svg'
    case 'Carrera':
      return '/icons/carrera.svg'
    case 'Aventura':
      return '/icons/aventura.svg'
    case 'Viaje':
      return '/icons/viaje.svg'
    case 'Concentración':
      return '/icons/concentracion.svg'
    case 'Curso':
      return '/icons/curso.svg'
    case 'Rodada':
      return '/icons/rodada.svg'
    case 'Exhibición':
      return '/icons/exhibicion.svg'
    default:
      return '/icons/quedada.svg'
  }
}