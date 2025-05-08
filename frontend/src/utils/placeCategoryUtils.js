export function getPlaceTypeInfo(primaryType, types) {
  const typeMapping = {
    'restaurant': { label: 'restaurants', glyph: '🍴' },
    'meal_takeaway': { label: 'food_truck', glyph: '🚚' },
    'store': { label: 'store', glyph: '🛒' },
  };

  const normalize = (type) => type.toLowerCase().replace(/_/g, '');

  if (primaryType) {
    const norm = normalize(primaryType);
    for (const key in typeMapping) {
      if (norm.includes(key)) return typeMapping[key];
    }
  }

  if (types?.length) {
    for (const type of types) {
      const norm = normalize(type);
      for (const key in typeMapping) {
        if (norm.includes(key)) return typeMapping[key];
      }
    }
  }

  return { label: 'other', glyph: '📍' };
}


export function getCategoryStyle(label) {
  switch (label.toLowerCase()) {
    case 'restaurants':
      return {

        background: "#E53935",   // Friendly, food-app red
        borderColor: "#C62828",
      };
    case 'store':
      return {
        background: "#FDD835",   // Bright but not aggressive
borderColor: "#F9A825",
      };
    case 'food_truck':
      return {
        background: "#F57C00",  // Rich orange – bolder than yellow, great for visibility
        borderColor: "#E65100",
      };
    default:
      return {
        background: "#9E9E9E",  // Soft neutral gray
        borderColor: "#616161",
      };
  }
}