import React from 'react';
import { API_URL } from './config';
import './index.css';

const renderSafeText = (data) => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'number') return String(data);

  if (Array.isArray(data)) {
    return data
      .map((block) => {
        if (typeof block === 'string') return block;
        if (block?.children && Array.isArray(block.children)) {
          return block.children.map((child) => child.text || '').join('');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (typeof data === 'object' && data.text) return data.text;
  return String(data);
};

const EventItem = ({ title, description, cover, image, eventDate }) => {
  const safeTitle = renderSafeText(title);
  const safeDescription = renderSafeText(description);

  const mediaList = image || cover;
  let imgUrlPath = '';
  if (mediaList && Array.isArray(mediaList) && mediaList.length > 0) {
    imgUrlPath = mediaList[0].url || '';
  }

  const imageUrl = imgUrlPath
    ? imgUrlPath.startsWith('http')
      ? imgUrlPath
      : `${API_URL}${imgUrlPath}`
    : null;

  let day = '';
  let month = '';

  if (eventDate) {
    const rawDate = String(eventDate).trim();
    const parts = rawDate.split(' ');
    if (parts.length >= 2) {
      day = parts[0];
      month = parts.slice(1).join(' ');
    } else {
      day = rawDate;
    }
  }

  return (
    <div className="ariki-timeline-item">
      {/* Date Badge Column */}
      <div className="ariki-timeline-date-wrapper">
        <div className="ariki-timeline-day-box">
          <span className="ariki-badge-day">{day}</span>
        </div>
        {month && <span className="ariki-badge-month">{month}</span>}
      </div>

      {/* Content Column */}
      <div className="ariki-event-content">
        <h3 className="ariki-event-title">{safeTitle}</h3>

        {imageUrl && (
          <div className="ariki-event-image-frame">
            <img src={imageUrl} alt={safeTitle} className="ariki-event-img" />
          </div>
        )}

        <p className="ariki-event-text">{safeDescription}</p>
      </div>
    </div>
  );
};

export default EventItem;