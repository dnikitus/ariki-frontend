import React, { useEffect, useState } from 'react';
import EventItem from './EventItem';
import './index.css';

const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically use live Vercel env variable or fallback to live Render URL
    const API_URL = process.env.REACT_APP_API_URL || 'https://ariki-backend.onrender.com';

    fetch(`${API_URL}/api/events?populate=*&sort=eventDate:asc`)
      .then((res) => res.json())
      .then((resData) => {
        const finalArray = resData.data || resData;
        if (Array.isArray(finalArray)) {
          setEvents(finalArray);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="events-loading">იტვირთება ღონისძიებები...</div>;
  }

  if (events.length === 0) {
    return <div className="events-loading">ღონისძიებები ვერ მოიძებნა. დაამატეთ ახალი პოსტი Strapi-დან!</div>;
  }

  return (
    <div className="events-page-container">
      <div className="timeline-wrapper">
        {events.map((event, index) => (
          <EventItem key={event.id || index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default News;