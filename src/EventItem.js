import React from 'react';
import { API_URL } from './config';
import './index.css';

const EventItem = ({ title, description, cover, eventDate }) => {
  let imgUrlPath = '';
  if (cover && cover.length > 0) {
    imgUrlPath = cover[0].url || '';
  }

  const imageUrl = imgUrlPath
    ? imgUrlPath.startsWith('http')
      ? imgUrlPath
      : `${API_URL}${imgUrlPath}`
    : null;

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="event-item-card">
      <div className="event-item-image-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="event-item-cover" />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
      </div>
      <div className="event-item-content">
        {formattedDate && <span className="event-item-date">{formattedDate}</span>}
        <h3 className="event-item-title">{title}</h3>
        <p className="event-item-description">{description}</p>
      </div>
    </div>
  );
};

export default EventItem;