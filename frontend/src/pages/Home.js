// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
import React from 'react';
import EventList from '../components/EventList';

// const Home = () => {
//   const [events, setEvents] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
//         if (response.data.success) {
//           setEvents(response.data.events);
//         } else {
//           setError('Failed to load events.');
//         }
//       } catch (error) {
//         console.error(error);
//         setError('An error occurred while fetching events.');
//       }
//     };

//     fetchEvents();
//   }, []);

//   const generateSlug = (title) => {
//     return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
//   }

//   return (
//     <div>
//       <h1>All Events</h1>
//       {error && <p>{error}</p>}
//       <ul>
//         {events.map((event) => (
//           <li key={event._id}>
//             <Link to={`/events/${event._id}/${generateSlug(event.title)}`}>
//               <h2>{event.title}</h2>
//             </Link>
//             <p>{event.description}</p>
//             <p>{event.location}</p>
//             <p>{new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</p>
//             <img src={event.image} alt={event.title} />
//             <p>Attendees: {event.attendeesCount}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

const Home = () => {
  return (
    <main className='discover_container'>
      <EventList />
    </main>
  );
};

export default Home
