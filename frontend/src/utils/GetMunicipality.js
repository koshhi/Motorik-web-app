// utils/getMunicipality.js
export const getMunicipality = (addressComponents) => {
  const componentTypes = [
    'locality',
    'administrative_area_level_2',
    'postal_town',
    'sublocality',
    'sublocality_level_1',
    'sublocality_level_2',
    'administrative_area_level_1', // Fallback
  ];

  for (const type of componentTypes) {
    const component = addressComponents.find((comp) => comp.types.includes(type));
    if (component) {
      return component.long_name;
    }
  }
  return 'Unknown';
};
