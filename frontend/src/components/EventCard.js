import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  const getDay = (date) => {
    return new Date(date).getDate();
  }

  const getMonthAbbr = (date) => {
    return new Date(date).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  return (
    <Link to={`/events/${event._id}/${generateSlug(event.title)}`} className="event_card">
      <div className='event_card-image-container'>
        <div className='event_card-chip'>
          <p>{event.eventType}</p>
        </div>
        <img src={event.image} alt={event.title} className='event_card-image' />
      </div>
      <div className='eventCard-infoBlock'>
        <div className='eventCard-mainInfo'>
          <h3>{event.title}</h3>
          <div className="event_card-date">
            <div className="event_card-date--month">
              <p>{getMonthAbbr(event.startDate)}</p>
            </div>
            <div className="event_card-date--day">
              <p>{getDay(event.startDate)}</p>
            </div>
          </div>
        </div>
        <p>{event.location}</p>
        <p>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
        <p>{event.attendeesCount} asistentes</p>
      </div>
    </Link>
  );
};

export default EventCard;
