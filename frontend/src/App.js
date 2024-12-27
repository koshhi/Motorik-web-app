import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import Signin from './pages/Signin';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent'
import MyEvents from './pages/MyEvents/MyEvents';
import UserProfile from './pages/UserProfile/UserProfile';
import UserGarage from './pages/UserProfile/UserGarage';
import UserProfileLayout from './layouts/UserProfileLayout';
import MyEventsLayout from './layouts/MyEventsLayout';
import MyEventsSettings from './pages/MyEvents/MyEventsSettings';
import MyEventsAttendees from './pages/MyEvents/MyEventsAttendees';
import LoginWithToken from './components/LoginWithToken';
import CompleteProfile from './pages/CompleteProfile';
import EnrollmentDetails from './pages/EnrollmentDetails';
import EventManagement from './layouts/EventManagement';
import ManageEvent from './components/EventManagement/ManageEvent';
import ManageEventAttendees from './components/EventManagement/ManageEventAttendees';
import ManageEventRegistration from './components/EventManagement/ManageEventRegistration';
import EditEvent from './components/EditEvent';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  return (

    <Router>
      <AuthProvider>
        <VehicleProvider>
          <GoogleMapsLoader>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events/:id/:slug" element={<EventDetail />} />
              <Route path="/events/:id/enrollment-details" element={<EnrollmentDetails />} />
              <Route path="/events/manage/:id" element={<EventManagement />}>
                <Route index element={<ManageEvent />} />
                <Route path="attendees" element={<ManageEventAttendees />} />
                <Route path="registration" element={<ManageEventRegistration />} />
                {/* <Route path="participants" element={<Participants />} />
            <Route path="communications" element={<Communications />} /> */}
              </Route>
              <Route path="/events/manage/:id/edit" element={<EditEvent />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/my-events" element={<MyEventsLayout />}>
                <Route index element={<MyEvents />} />
                <Route path="people" element={<MyEventsAttendees />} />
                <Route path="settings" element={<MyEventsSettings />} />
              </Route>
              <Route path="/user/:userId" element={<UserProfileLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="garage" element={<UserGarage />} />
              </Route>
              <Route path="/signin" element={<Signin />} />
              {/* <Route path="/enter-password" element={<EnterPassword />} /> */}
              <Route path="/email-verification" element={<VerifyEmail />} />
              <Route path="/login-with-token" element={<LoginWithToken />} />  {/* Ruta para la verificación del email */}
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/user/:userId/edit-profile" element={<CompleteProfile />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </GoogleMapsLoader>
        </VehicleProvider>
      </AuthProvider>
    </Router>

  );
}

export default App;
