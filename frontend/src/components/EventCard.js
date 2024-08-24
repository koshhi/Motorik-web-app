import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
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
              <p>{event.monthDate}</p>
            </div>
            <div className="event_card-date--day">
              <p>{event.dayDate}</p>
            </div>
          </div>
        </div>
        <p>{event.shortLocation}</p>
        <p>{event.longDate}</p>
        <p>{event.attendeesCount} asistentes</p>
      </div>
    </Link>
  );
};

export default EventCard;
