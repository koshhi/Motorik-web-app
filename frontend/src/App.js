import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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



function App() {

  return (

    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/signin" element={<Signin />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/events/:id/:slug" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {/* <Route path="/my-events" element={<MyEvents />} /> */}
          {/* <Route path="/user/:userId/garage" element={<UserGarage />} />
          <Route path="/user/:userId" element={<UserProfile />} /> */}
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

        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;
