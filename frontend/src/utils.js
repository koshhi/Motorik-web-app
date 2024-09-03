// utils.js
export const getEventTypeIcon = (eventType) => {
  switch (eventType) {
    case 'Meetup':
      return '/icons/quedada.svg'
    case 'Competition':
      return '/icons/competicion.svg'
    case 'Race':
      return '/icons/carrera.svg'
    case 'Adventure':
      return '/icons/aventura.svg'
    case 'Trip':
      return '/icons/viaje.svg'
    case 'Gathering':
      return '/icons/concentracion.svg'
    case 'Course':
      return '/icons/curso.svg'
    case 'Ride':
      return '/icons/rodada.svg'
    case 'Exhibition':
      return '/icons/exhibicion.svg'
    default:
      return '/icons/quedada.svg'
  }
}

export const getEventTypeSvgIcon = (eventType, color = "#989898") => {
  switch (eventType) {
    case 'Race':
      return (
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M21.4307 3.34202L20.491 3L20.149 3.93969L16.9402 12.7558L16.4997 13.966L16.0593 12.7558L12.8505 3.93969L12.5085 3L11.5688 3.34202L2.01801 6.81821L0.497559 7.37161L1.6725 8.48406L5.11784 11.7461L4.57538 16.4596L4.39039 18.0671L5.91084 17.5137L14.5219 14.3795L15.4356 16.8898L11.3671 28.0679L13.2465 28.7519L16.4997 19.8136L19.753 28.7519L21.6324 28.0679L17.5639 16.8898L18.4776 14.3795L27.0886 17.5137L28.6091 18.0671L28.4241 16.4596L27.8816 11.7461L31.327 8.48406L32.5019 7.37161L30.9815 6.81821L21.4307 3.34202ZM26.2522 15.0809L19.1616 12.5001L21.6864 5.56343L28.777 8.14419L26.1435 10.6376L25.7804 10.9814L25.8376 11.4781L26.2522 15.0809ZM6.74726 15.0809L13.8379 12.5001L11.3131 5.56343L4.22251 8.14419L6.85598 10.6376L7.21905 10.9814L7.16189 11.4781L6.74726 15.0809Z"
            fill={color} />
        </svg>
      );
    case 'Competition':
      return (
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 30H24.5" stroke={color} strokeWidth="2" />
          <path d="M8.5 2H24.5V12C24.5 16.4183 20.9183 20 16.5 20V20C12.0817 20 8.5 16.4183 8.5 12V2Z" stroke={color} strokeWidth="2" />
          <path d="M8.5 6H2.5V8C2.5 11.3137 5.18629 14 8.5 14V14" stroke={color} strokeWidth="2" />
          <path d="M24.5 6H30.5V8C30.5 11.3137 27.8137 14 24.5 14V14" stroke={color} strokeWidth="2" />
          <path d="M16.5 20V26M16.5 26H11.5M16.5 26H21.5" stroke={color} strokeWidth="2" />
        </svg>
      );

    case 'Adventure':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 27V8L12 5L20 8L28 5V24L20 27L12 24L4 27Z" stroke={color} strokeWidth="2" />
          <path d="M18 19L21 16M21 16L24 13M21 16L18 13M21 16L24 19" stroke={color} strokeWidth="2" />
          <path d="M11 15H9V17H11V15Z" fill={color} />
          <path d="M16 15H14V17H16V15Z" fill={color} />
        </svg>
      );
    case 'Gathering':
      return (
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.1569 16.657L16.5 22.3139L10.8431 16.657C9.7243 15.5381 8.96239 14.1127 8.65371 12.5608C8.34504 11.0089 8.50347 9.40038 9.10898 7.93856C9.71448 6.47674 10.7399 5.22731 12.0555 4.34825C13.371 3.46919 14.9178 3 16.5 3C18.0822 3 19.629 3.46919 20.9445 4.34825C22.2601 5.22731 23.2855 6.47674 23.891 7.93856C24.4965 9.40038 24.655 11.0089 24.3463 12.5608C24.0376 14.1127 23.2757 15.5381 22.1569 16.657ZM16.5 12.7778C16.9715 12.7778 17.4237 12.5905 17.7571 12.2571C18.0905 11.9237 18.2778 11.4715 18.2778 11C18.2778 10.5285 18.0905 10.0763 17.7571 9.74293C17.4237 9.40953 16.9715 9.22222 16.5 9.22222C16.0285 9.22222 15.5763 9.40953 15.2429 9.74293C14.9095 10.0763 14.7222 10.5285 14.7222 11C14.7222 11.4715 14.9095 11.9237 15.2429 12.2571C15.5763 12.5905 16.0285 12.7778 16.5 12.7778Z" stroke={color} strokeWidth="2" />
          <path d="M10.5 22H7.5L4.5 28H28.5L25.5 22H22.5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'Course':
      return (
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5 18H8.5L4.5 28H28.5L24.5 18H21.5" stroke={color} strokeWidth="2" />
          <path d="M11.4032 23.468C10.564 22.6744 10.6288 21.4204 10.8793 20.2929L14.5 4C14.5 4 15.3954 3 16.5 3C17.6046 3 18.5 4 18.5 4L22.1207 20.2929C22.3712 21.4204 22.436 22.6744 21.5968 23.468C20.7925 24.2285 19.2892 25 16.5 25C13.7108 25 12.2075 24.2285 11.4032 23.468Z" stroke="#989898" strokeWidth="2" />
          <path d="M12 16.375C12 16.375 12.375 18.625 16.5 18.625C20.625 18.625 21 16.375 21 16.375" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.25 9.6875C13.25 9.6875 13.5208 11.3125 16.5 11.3125C19.4792 11.3125 19.75 9.6875 19.75 9.6875" stroke={color} strokeWidth="1.85714" />
        </svg>
      );
    case 'Exhibition':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 30H29" stroke={color} strokeWidth="2" />
          <path d="M4 26H28" stroke={color} strokeWidth="2" />
          <circle cx="9.5" cy="18.5" r="3.5" stroke={color} strokeWidth="2" />
          <circle cx="22.5" cy="18.5" r="3.5" stroke={color} strokeWidth="2" />
          <path d="M15 5H18L19.2 8M22 15L20 10M20 10H17.75M20 10L19.6 9M6 12H9M9 12H12.5L15.5 10H17.75M9 12V15M17.75 10L16 16L12.5 17.5M19.6 9H22V8H19.2M19.6 9L19.2 8" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'Meetup':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="23" width="6" height="6" rx="3" stroke={color} strokeWidth="2" />
          <rect x="23" y="3" width="6" height="6" rx="3" stroke={color} strokeWidth="2" />
          <path d="M8.5 26H25C27.7614 26 30 23.7614 30 21V21C30 18.2386 27.7614 16 25 16H7C4.23858 16 2 13.7614 2 11V11C2 8.23858 4.23858 6 7 6H18.5" stroke={color} strokeWidth="2" />
          <path d="M15 10L19 6L15 2" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'Ride':
      return (
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 10.0625C9.69883 7.57126 12.9159 6 16.5 6C23.1274 6 28.5 11.3726 28.5 18C28.5 24.6274 23.1274 30 16.5 30C12.9159 30 9.69883 28.4287 7.5 25.9375" stroke={color} strokeWidth="1.85714" />
          <path d="M7.5 10.0625C9.69883 7.57126 12.9159 6 16.5 6C23.1274 6 28.5 11.3726 28.5 18C28.5 24.6274 23.1274 30 16.5 30C12.9159 30 9.69883 28.4287 7.5 25.9375" stroke={color} strokeWidth="1.85714" />
          <path d="M16.5 23.0001V26.0001C20.9183 26.0001 24.5 22.4183 24.5 18.0001C24.5 15.0389 22.8912 12.4536 20.5 11.0703L17.6545 16" stroke={color} strokeWidth="1.85714" />
          <path d="M16.5 6V2M16.5 2H12.5M16.5 2H20.5" stroke={color} strokeWidth="2" />
          <circle cx="16.5001" cy="18.0001" r="2" transform="rotate(30 16.5001 18.0001)" stroke={color} strokeWidth="1.85714" />
          <path d="M1.5 18H8.5" stroke={color} strokeWidth="2" />
          <path d="M4.5 14H9.5" stroke={color} strokeWidth="2" />
          <path d="M4.5 22H9.5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'Trip':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14.5" cy="27.5" r="3.5" stroke={color} strokeWidth="2" />
          <circle cx="27.5" cy="27.5" r="3.5" stroke={color} strokeWidth="2" />
          <path d="M20 14H23L24.2 17M27 24L25 19M25 19H22.75M25 19L24.6 18M11 21H14M14 21H17.5L20.5 19H22.75M14 21V24M22.75 19L21 25L17.5 26.5M24.6 18H27V17H24.2M24.6 18L24.2 17" stroke={color} strokeWidth="2" />
          <path d="M6 5H3V27H8M20 5H23V11M18 5H15M15 5V3.75C15 2.7835 14.2165 2 13.25 2C12.2835 2 11.5 2.7835 11.5 3.75V5M15 5H11.5M11.5 5H8" stroke={color} strokeWidth="2" />
          <path d="M7 23V19C7 17.3431 8.34315 16 10 16H13C14.6569 16 16 14.6569 16 13V13C16 11.3431 14.6569 10 13 10H11" stroke={color} strokeWidth="2" />
          <circle cx="9.5" cy="10" r="1.5" stroke={color} strokeWidth="2" />
        </svg>
      );
    // Repite para las otras categorías
    default:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="23" width="6" height="6" rx="3" stroke={color} strokeWidth="2" />
          <rect x="23" y="3" width="6" height="6" rx="3" stroke={color} strokeWidth="2" />
          <path d="M8.5 26H25C27.7614 26 30 23.7614 30 21V21C30 18.2386 27.7614 16 25 16H7C4.23858 16 2 13.7614 2 11V11C2 8.23858 4.23858 6 7 6H18.5" stroke={color} strokeWidth="2" />
          <path d="M15 10L19 6L15 2" stroke={color} strokeWidth="2" />
        </svg>
      );
  }
}