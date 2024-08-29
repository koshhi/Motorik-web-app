import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile">
      <img src={user.userAvatar || '/default-avatar.png'} alt={`${user.name} ${user.lastName}`} />
      <h1>{`${user.name} ${user.lastName}`}</h1>
      <p>{user.description}</p>
      <h2>Eventos Organizados</h2>
      <ul>
        {user.organizedEvents.map(event => (
          <li key={event._id}>{event.title}</li>
        ))}
      </ul>
      <h2>Vehículos</h2>
      <ul>
        {user.vehicles.map(vehicle => (
          <li key={vehicle._id}>{vehicle.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
