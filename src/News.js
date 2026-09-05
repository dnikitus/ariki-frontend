import React, { useState, useEffect } from 'react';
import EventItem from './EventItem';
import { API_URL } from './config';
import './index.css';

const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/events?populate=*&sort=eventDate:asc`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setEvents(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">იტვირთება...</div>;

  return (
    <div className="news-page-container">
      <h2 className="news-page-header">სიახლეები და ღონისძიებები</h2>
      <div className="news-events-grid">
        {events.map((event) => (
          <EventItem
            key={event.id}
            title={event.title}
            description={event.description}
            cover={event.cover}
            eventDate={event.eventDate}
          />
        ))}
      </div>
    </div>
  );
};

export default News;