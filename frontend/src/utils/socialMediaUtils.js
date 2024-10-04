// Función para determinar la plataforma en base a la URL
export const getPlatform = (url) => {
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('youtube.com')) return 'YouTube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X';
  return 'Link';
};

// Función para obtener el ícono en base a la plataforma
export const getIcon = (platform) => {
  switch (platform) {
    case 'Instagram':
      return '/icons/instagram.svg';
    case 'Facebook':
      return '/icons/facebook.svg';
    case 'TikTok':
      return '/icons/tiktok.svg';
    case 'YouTube':
      return '/icons/youtube.svg';
    case 'X':
      return '/icons/x.svg';
    default:
      return '/icons/link.svg';
  }
};