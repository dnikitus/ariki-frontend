import React, { useState, useEffect } from 'react';
import EventItem from './EventItem';
import { API_URL } from './config';
import './index.css';

const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_URL}/api/events?populate=*`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.data) {
          setEvents(data.data);
        }
      })
      .catch((err) => console.error('Error loading events:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div className="loading-container">იტვირთება...</div>;

  return (
    <div className="events-page-container">
      <div className="timeline-wrapper">
        {events.map((event) => (
          <EventItem
            key={event.id}
            title={event.title}
            description={event.description}
            image={event.image}
            cover={event.cover}
            eventDate={event.eventDate}
          />
        ))}
      </div>
    </div>
  );
};

export default News;