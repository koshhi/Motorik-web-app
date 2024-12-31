Inscripción de Eventos con Vehículos
Descripción General
Este proyecto es una aplicación web diseñada para la gestión de eventos que requieren la inscripción de vehículos. Permite a los usuarios visualizar eventos, seleccionar entradas, gestionar sus vehículos y completar el proceso de inscripción de manera fluida y eficiente. La aplicación está construida utilizando React para el front-end y Express.js para el back-end, con una base de datos MongoDB para el almacenamiento de datos.

Tecnologías Utilizadas
Front-End:

React: Librería JavaScript para construir interfaces de usuario.
Styled-Components: Biblioteca para estilos en React.
React Router: Para la navegación entre rutas.
React Context: Para la gestión del estado global.
React Toastify: Para notificaciones y mensajes al usuario.
Back-End:

Express.js: Framework web para Node.js.
MongoDB & Mongoose: Base de datos NoSQL y ODM para modelar datos.
Cloudinary: Servicio para la gestión y almacenamiento de imágenes.
Multer: Middleware para manejar la subida de archivos.
dotenv: Para la gestión de variables de entorno.
React Toastify: Para notificaciones y mensajes al usuario.
Estructura del Proyecto
css
Copiar código
├── client
│   ├── src
│   │   ├── components
│   │   │   ├── Modal
│   │   │   ├── Navbar
│   │   │   ├── Forms
│   │   │   └── ...
│   │   ├── context
│   │   │   ├── AuthContext.js
│   │   │   ├── EventContext.js
│   │   │   └── VehicleContext.js
│   │   ├── hooks
│   │   │   ├── useEvent.js
│   │   │   ├── useEnroll.js
│   │   │   └── ...
│   │   ├── api
│   │   │   └── axiosClient.js
│   │   ├── App.js
│   │   └── ...
├── server
│   ├── controllers
│   │   ├── events.js
│   │   └── vehicle.js
│   ├── models
│   │   ├── Event.js
│   │   ├── Vehicle.js
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── middleware
│   │   └── auth.js
│   ├── routes
│   │   ├── events.js
│   │   └── vehicles.js
│   ├── services
│   │   └── emailService.js
│   ├── utils
│   │   └── validators.js
│   └── ...
├── README.md
└── ...
Flujo de Inscripción
El flujo de inscripción está diseñado para ofrecer una experiencia de usuario intuitiva, permitiendo la inscripción en eventos que requieren la selección o adición de un vehículo. A continuación, se detalla cada paso del flujo, desde la interacción del usuario en el front-end hasta el procesamiento en el back-end.

1. Visualización del Evento
Componente Involucrado: EventDetail.js

Descripción:

Muestra los detalles de un evento específico, incluyendo título, descripción, tipo de evento, ubicación, entradas disponibles, etc.
Gestiona el estado de inscripción del usuario y controla la apertura de modales relacionados con la inscripción.
Puntos Clave:

Estados:
isEnrolled: Indica si el usuario ya está inscrito en el evento.
selectedTicketId: ID del ticket seleccionado por el usuario.
showTicketModal, showEnrollWithVehicleModal, showConfirmationModal: Controlan la visibilidad de los modales.
Hooks Utilizados:
useParams: Obtiene el ID del evento desde la URL.
useAuth: Accede a la información del usuario autenticado.
useEvent: Obtiene y gestiona los detalles del evento.
useEnroll: Hook personalizado para manejar la lógica de inscripción.
2. Inicio del Proceso de Inscripción
Acción del Usuario:

El usuario hace clic en el botón de inscripción en la página de detalles del evento.
Manejo en EventDetail.js:

javascript
Copiar código
const handleEnroll = () => {
  if (!user) {
    toast.error('Debes iniciar sesión para inscribirte.');
    return;
  }

  const tickets = event.tickets;

  // Si hay un único ticket gratuito sin aprobación => inscripción directa
  if (tickets.length === 1 && tickets[0].type === 'free' && !tickets[0].approvalRequired) {
    const singleTicket = tickets[0];

    if (event.needsVehicle) {
      // Abrir el modal de inscripción con vehículos
      setShowEnrollWithVehicleModal(true);
    } else {
      // No necesita vehículo
      enroll(null, singleTicket._id);
    }

  } else {
    // Caso donde hay más de un ticket, o ticket pago/aprobación:
    setShowTicketModal(true);
  }
};
Lógica:
Usuario Autenticado:
Si el usuario no está autenticado, se muestra un error indicando que debe iniciar sesión.
Tipo de Ticket:
Un Solo Ticket Gratuito sin Aprobación:
Con Vehículo:
Abre el modal EnrollWithVehicleModal para gestionar la inscripción con vehículo.
Sin Vehículo:
Llama a la función enroll directamente para inscribirse.
Múltiples Tickets o Tickets Pagados/Aprobación:
Abre el modal TicketModal para que el usuario seleccione el tipo de entrada.
3. Selección de Entrada
Componente Involucrado: TicketModal.js

Descripción:

Muestra una lista de entradas disponibles para el evento.
Permite al usuario seleccionar una entrada y proceder con la inscripción.
Interacción:

Selección de Ticket:
El usuario selecciona una entrada específica.
handleTicketSelect(ticketId) actualiza el estado selectedTicketId.
Continuar:
Al hacer clic en "Continuar", se ejecuta la función onContinue que:
Cierra el modal de tickets.
Verifica si el Evento Requiere Vehículo:
Sí: Abre EnrollWithVehicleModal.
No: Llama a enroll directamente con el selectedTicketId.
Código Relevante:

javascript
Copiar código
<Button
  onClick={onContinue}
  disabled={!selectedTicketId}
  size="medium"
  style={{ justifyContent: "center" }}
>
  Continuar
</Button>
4. Inscripción con Vehículo (si es necesario)
Componente Involucrado: EnrollWithVehicleModal.js

Descripción:

Gestiona el flujo de inscripción cuando el evento requiere un vehículo.
Comprende varios pasos representados por diferentes sub-modales:
InfoModal: Informa al usuario que se requiere un vehículo.
SelectVehicleModal: Permite al usuario seleccionar un vehículo existente.
AddVehicleModal: Permite al usuario añadir un nuevo vehículo si no tiene uno existente.
ConfirmSelectedVehicleModal: Confirma la selección del vehículo.
Interacción:

Paso 1: InfoModal
Informa al usuario sobre la necesidad de un vehículo.
Acción: Al hacer clic en "Continuar", avanza al siguiente paso.
Paso 2: SelectVehicleModal
Muestra vehículos existentes del usuario.
Acciones:
Seleccionar Vehículo: Selecciona un vehículo y avanza al siguiente paso.
Añadir Vehículo: Abre el paso de añadir vehículo.
Paso 3: AddVehicleModal
Permite al usuario añadir un nuevo vehículo.
Acción: Al guardar el vehículo, lo añade a la lista y avanza al siguiente paso.
Paso 4: ConfirmSelectedVehicleModal
Muestra los detalles del vehículo seleccionado.
Acciones:
Confirmar: Llama a la función handleEnrollmentComplete con el vehículo seleccionado.
Elegir Otro Vehículo: Regresa al paso de selección de vehículo.
Código Relevante:

javascript
Copiar código
{isOpen && step === 1 && (
  <InfoModal
    title="Inscripción con Vehículo"
    description="Este evento requiere que inscribas un vehículo. Puedes seleccionar uno existente o añadir uno nuevo."
    onContinue={handleNext}
    onClose={onClose}
  />
)}

{isOpen && step === 2 && (
  <SelectVehicleModal
    isOpen={isOpen}
    onClose={onClose}
    vehicles={vehicles}
    selectedVehicle={selectedVehicle}
    onSelectVehicle={handleVehicleSelect}
    onAddVehicle={() => setStep(3)}
  />
)}

{isOpen && step === 3 && (
  <AddVehicleModal
    isOpen={isOpen}
    onClose={() => setStep(2)}
    onVehicleSaved={handleAddVehicle}
  />
)}

{isOpen && step === 4 && selectedVehicle && (
  <ConfirmSelectedVehicleModal
    isOpen={isOpen}
    onClose={onClose}
    vehicle={selectedVehicle}
    onContinue={handleConfirm}
    onChooseAnother={() => setStep(2)}
  />
)}
5. Confirmación de Inscripción
Componente Involucrado: ConfirmationModal.js

Descripción:

Muestra un resumen de la inscripción realizada.
Informa al usuario sobre el estado de su inscripción (pendiente de confirmación o confirmada).
Muestra un contador del tiempo restante para el inicio del evento.
Opcionalmente, muestra detalles del vehículo seleccionado.
Ofrece opciones para compartir el evento o ver detalles de la inscripción.
Interacción:

Compartir Evento:
Copia el enlace del evento al portapapeles y muestra un mensaje de éxito.
Ver mi Inscripción:
Navega a una página de detalles de inscripción específica para el evento.
Código Relevante:

javascript
Copiar código
<Button
  onClick={() => {
    navigator.clipboard.writeText(eventLink);
    toast.success('URL copiada al portapapeles.');
  }}
  size="medium"
  style={{ justifyContent: "center", width: "100%" }}
>
  Compartir evento
</Button>
<Button
  $variant="outline"
  size="medium"
  style={{ justifyContent: "center", width: "100%" }}
  onClick={() => {
    navigate(`/events/${eventId}/enrollment-details`);
    onClose(); // Opcional: cerrar el modal
  }}
>
  Ver mi inscripción
</Button>
6. Hook Personalizado para Inscripción
Archivo: useEnroll.js

Descripción:

Maneja la lógica de inscripción, incluyendo la interacción con la API y la gestión de estados de carga y error.
Funcionamiento:

Función enroll(vehicleId, ticketId):
Realiza una solicitud POST a /api/events/enroll/:eventId con los IDs de vehículo y ticket.
Gestiona estados de carga y errores.
En caso de éxito, ejecuta el callback onSuccess proporcionado, pasando el evento actualizado.
Muestra mensajes de éxito o error usando react-toastify.
Código Relevante:

javascript
Copiar código
const enroll = async (vehicleId, ticketId) => {
  setLoadingEnroll(true);
  setErrorEnroll(null);

  try {
    const response = await axiosClient.post(`/api/events/enroll/${eventId}`, {
      vehicleId,
      ticketId,
    });

    console.log('Respuesta de inscripción:', response.data);

    if (response.data.success) {
      toast.success(response.data.message || 'Inscripción exitosa.');
      if (onSuccess) {
        onSuccess(response.data.event);
      }
    } else {
      setErrorEnroll(response.data.message || 'No se pudo inscribir al evento.');
      toast.error(response.data.message || 'No se pudo inscribir al evento.');
    }
  } catch (error) {
    console.error('Error al inscribirse en el evento:', error);
    setErrorEnroll('Error al inscribirse en el evento.');
    toast.error('Error al inscribirse en el evento.');
  } finally {
    setLoadingEnroll(false);
  }
};
7. Contextos Utilizados
1. AuthContext.js
Descripción:
Gestiona la autenticación del usuario, incluyendo el inicio y cierre de sesión.
Proporciona información del usuario autenticado (user) y funciones para gestionar la sesión (login, logout).
2. EventContext.js
Descripción:
Mantiene el estado de los detalles del evento actual.
Permite actualizar el estado del evento desde diferentes componentes.
3. VehicleContext.js
Descripción:
Gestiona los vehículos del usuario.
Proporciona funciones para obtener, añadir, actualizar y eliminar vehículos.
Mantiene el estado de carga (loading) y la lista de vehículos (vehicles).
8. Controladores del Back-End
1. vehicle.js
Rutas Principales:

GET /api/vehicles/brands
Retorna una lista de marcas de vehículos desde un archivo JSON.
GET /api/vehicles/models?brand=Marca
Retorna modelos de vehículos basados en la marca proporcionada.
POST /api/vehicles
Crea un nuevo vehículo, subiendo la imagen a Cloudinary.
PUT /api/vehicles/:id
Actualiza un vehículo existente.
GET /api/vehicles/user/:userId
Obtiene todos los vehículos de un usuario específico.
GET /api/vehicles/:id
Obtiene un vehículo por su ID.
DELETE /api/vehicles/:id
Elimina un vehículo por su ID.
Puntos Clave:

Autenticación:
Todas las rutas excepto las de obtener marcas y modelos requieren autenticación (auth middleware).
Subida de Imágenes:
Utiliza multer para manejar la subida de archivos.
Utiliza cloudinary para almacenar imágenes.
2. events.js
Rutas Principales:

GET /api/events/my-events
Obtiene eventos futuros organizados y a los que asiste el usuario.
GET /api/events/:userId/events
Obtiene eventos organizados y asistidos por un usuario específico.
POST /api/events/:eventId/attendees/:attendeeId/approve
Aprueba la inscripción de un asistente.
POST /api/events/:eventId/attendees/:attendeeId/reject
Rechaza la inscripción de un asistente.
POST /api/events/:eventId/attendees/cancel
Permite al usuario cancelar su inscripción en un evento.
POST /api/events/enroll/:id
Inscribe al usuario en un evento específico.
GET /api/events/:id/enrollment
Obtiene los detalles de inscripción del usuario en un evento.
POST /api/events/:id/publish
Publica un evento.
DELETE /api/events/:id
Elimina un evento.
PUT /api/events/:id
Actualiza un evento existente.
GET /api/events
Obtiene todos los eventos con filtros y ordenados por proximidad de fecha.
GET /api/events/:id
Obtiene un evento por su ID.
POST /api/events
Crea un nuevo evento.
Puntos Clave:

Autenticación:
Rutas que modifican datos requieren autenticación (auth middleware).
Inscripción en Eventos:
La ruta POST /api/events/enroll/:id maneja la lógica de inscripción, incluyendo validaciones y transacciones.
Subida de Imágenes:
Utiliza multer y cloudinary para manejar imágenes de eventos.
9. Flujo Completo de Inscripción
A continuación, se detalla cómo interactúan los diferentes componentes y el back-end durante el proceso de inscripción:

Usuario Visualiza el Evento:

Accede a /events/:id.
EventDetail.js obtiene y muestra los detalles del evento.
Usuario Inicia la Inscripción:

Hace clic en el botón de inscripción.
handleEnroll determina si se necesita seleccionar una entrada o inscribirse directamente.
Si se requiere seleccionar una entrada, se abre TicketModal.js.
Si se requiere un vehículo, se abre EnrollWithVehicleModal.js.
Selección de Entrada (si aplica):

En TicketModal.js, el usuario selecciona una entrada.
Al confirmar, si el evento requiere vehículo, se abre EnrollWithVehicleModal.js.
Inscripción con Vehículo:

Paso 1: InfoModal
Informa al usuario sobre la necesidad de un vehículo.
Paso 2: SelectVehicleModal
Muestra vehículos existentes del usuario.
Permite seleccionar uno o añadir un nuevo vehículo.
Paso 3: AddVehicleModal
Permite añadir un nuevo vehículo si el usuario no tiene uno adecuado.
AddVehicleForm.js gestiona el formulario de creación/edición.
Paso 4: ConfirmSelectedVehicleModal
Confirma la selección del vehículo.
Al confirmar, se llama a handleEnrollmentComplete.
Procesamiento de la Inscripción:

handleEnrollmentComplete(vehicle) en EventDetail.js:
Verifica la selección de ticket y vehículo.
Llama a enroll(vehicleId, ticketId) del hook useEnroll.js.
useEnroll.js realiza la solicitud POST a /api/events/enroll/:eventId.
Back-End (events.js):
Valida los datos de inscripción.
Verifica la disponibilidad del ticket y la pertenencia del vehículo.
Inscribe al usuario en el evento y actualiza los asientos disponibles.
Envía un correo de confirmación.
Responde con los detalles actualizados del evento.
Actualización del Estado en el Front-End:

onSuccess(updatedEvent) en useEnroll.js:
Actualiza el estado del evento en EventDetail.js.
Determina el estado de inscripción (attending o confirmation pending).
Muestra ConfirmationModal.js con los detalles relevantes.
Confirmación al Usuario:

ConfirmationModal.js muestra el estado de inscripción, detalles del vehículo (si aplica), y opciones para compartir el evento o ver detalles de la inscripción.
10. Consideraciones Adicionales y Mejores Prácticas
Gestión de Errores:

Manejar adecuadamente todos los posibles errores tanto en el front-end como en el back-end.
Utilizar mensajes claros para guiar al usuario en caso de fallos.
Validaciones:

Realizar validaciones tanto en el front-end (para una mejor experiencia de usuario) como en el back-end (para seguridad y consistencia de datos).
Optimización de Estados:

Mantener una gestión eficiente de los estados para evitar inconsistencias, especialmente en flujos complejos como la inscripción con vehículo.
Feedback al Usuario:

Proporcionar feedback claro durante todo el proceso, incluyendo estados de carga, éxito y error.
Modularidad de Componentes:

Mantener los componentes modales y formularios lo más reutilizables y separados posible para facilitar el mantenimiento y la escalabilidad.
Seguridad:

Asegurar que todas las rutas protegidas en el back-end estén debidamente autenticadas y autorizadas.
Validar y sanitizar todos los datos recibidos en el servidor para prevenir ataques como la inyección de código.
Performance:

Optimizar las consultas a la base de datos y minimizar las llamadas redundantes para mejorar el rendimiento de la aplicación.
Instalación y Ejecución
Requisitos Previos
Node.js y npm instalados.
MongoDB en funcionamiento.
Cuenta en Cloudinary para la gestión de imágenes.
Configuración del Front-End
Clonar el Repositorio:

bash
Copiar código
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio/client
Instalar Dependencias:

bash
Copiar código
npm install
Configurar Variables de Entorno:

Crea un archivo .env en el directorio client y añade las variables necesarias, por ejemplo:

env
Copiar código
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLIENT_URL=http://localhost:3000
Iniciar la Aplicación:

bash
Copiar código
npm start
Configuración del Back-End
Navegar al Directorio del Servidor:

bash
Copiar código
cd ../server
Instalar Dependencias:

bash
Copiar código
npm install
Configurar Variables de Entorno:

Crea un archivo .env en el directorio server y añade las variables necesarias, por ejemplo:

env
Copiar código
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
Iniciar el Servidor:

bash
Copiar código
npm start
Conclusión
El flujo de inscripción en este proyecto está diseñado para ser intuitivo y robusto, manejando diferentes escenarios según las necesidades del evento y las entradas disponibles. A través de una combinación de componentes modales, hooks personalizados y contextos, se logra una experiencia de usuario fluida y coherente.

Pasos Clave del Flujo:

Visualización del Evento: Presenta al usuario toda la información relevante del evento.
Inicio de Inscripción: Determina el tipo de inscripción necesaria según los tickets y requisitos del evento.
Selección de Entrada: Permite al usuario elegir la entrada adecuada.
Inscripción con Vehículo: Si es necesario, gestiona la selección o adición de un vehículo.
Procesamiento y Confirmación: Maneja la inscripción en el back-end y actualiza el estado en el front-end, proporcionando confirmación al usuario.
Asegúrate de probar exhaustivamente cada parte del flujo para garantizar que todas las interacciones funcionen como se espera y que los estados se gestionen correctamente. Mantén una comunicación clara con el usuario en cada paso para ofrecer una experiencia de inscripción sin inconvenientes.

Si tienes alguna duda específica sobre alguna parte del código o necesitas optimizar algún aspecto en particular, no dudes en consultar la documentación interna o contactar al equipo de desarrollo.