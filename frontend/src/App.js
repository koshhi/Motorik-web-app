import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
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


function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
