# Motorik-web-app

App
│
├── AuthProvider (Context)
│   ├── Estado Global de Autenticación
│   ├── Funciones: login, logout, refreshUserData
│
├── Routes
│   ├── UserProfileLayout
│   │   ├── MainNavbar
│   │   ├── ProfileHeader
│   │   └── Outlet (UserProfile, UserGarage)
│   │       ├── UserProfile
│   │       │   ├── useUserProfile (Hook)
│   │       │   └── useUserEvents (Hook)
│   │       └── UserGarage (GarageTab)
│   │           ├── useUserProfile (Hook)
│   │           └── useUserVehicles (Hook)
│   ├── Signin
│   └── Otras Rutas
│
├── Components
│   ├── MainNavbar
│   ├── ProfileHeader
│   ├── UserProfile
│   ├── UserGarage (GarageTab)
│   ├── AddVehicleModal
│   └── Otros Componentes
│
└── Hooks
    ├── useUserProfile
    ├── useUserEvents
    ├── useUserVehicles
    └── Otros Hooks Personalizados
