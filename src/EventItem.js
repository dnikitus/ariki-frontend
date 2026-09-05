import React from 'react';

const EventItem = ({ event }) => {
  const dataFields = event.attributes ? event.attributes : event;
  const title = dataFields.title || "უტიტულო ღონისძიება";
  const description = dataFields.description;
  const rawDate = dataFields.eventDate || dataFields.date || dataFields.publishedAt || event.publishedAt;

  // Handles ISO date strings, standard JavaScript dates, and plain Georgian text like "9 ნოემბერი"
  const formatGeorgianDate = (dateString) => {
    if (!dateString) return { day: '??', month: '—' };

    // Standard ISO format check (YYYY-MM-DD)
    const isoParts = dateString.split('T')[0].split('-');
    if (isoParts.length === 3 && !isNaN(isoParts[0])) {
      const day = parseInt(isoParts[2], 10);
      const monthIndex = parseInt(isoParts[1], 10) - 1;
      const monthsGeo = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
      return { day, month: monthsGeo[monthIndex] || '—' };
    }

    // Custom Georgian text parsing (e.g., "9 ნოემბერი" or "12 აგვისტო")
    const textParts = dateString.trim().split(' ');
    if (textParts.length >= 2 && !isNaN(parseInt(textParts[0], 10))) {
      const day = parseInt(textParts[0], 10);
      const monthShort = textParts[1].substring(0, 3); // Extracts first 3 letters ("ნოე", "აგვ", etc.)
      return { day, month: monthShort };
    }

    // Standard JavaScript Date object fallback
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate();
      const monthsGeo = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
      return { day, month: monthsGeo[date.getMonth()] };
    }

    return { day: '??', month: '—' };
  };

  const { day, month } = formatGeorgianDate(rawDate);

  // Parse image path correctly
  let imgUrlPath = null;
  if (dataFields.image) {
    const imgData = dataFields.image.data || dataFields.image;
    if (Array.isArray(imgData) && imgData.length > 0) {
      imgUrlPath = (imgData[0].attributes || imgData[0])?.url;
    } else if (imgData) {
      imgUrlPath = (imgData.attributes || imgData)?.url;
    }
  }

  // Determine base API URL dynamically (prevents local host breakage)
  const API_URL = process.env.REACT_APP_API_URL || 'https://ariki-backend.onrender.com';
  
  // If the image URL is already a full Cloudinary or external link, keep it; otherwise prepend API_URL
  const imageUrl = imgUrlPath
    ? imgUrlPath.startsWith('http')
      ? imgUrlPath
      : `${API_URL}${imgUrlPath}`
    : null;

  // Render Strapi 5 Rich Text Block Structure safely
  const renderDescription = (descData) => {
    if (!descData) return '';
    if (typeof descData === 'string') return descData;
    if (Array.isArray(descData)) {
      return descData
        .map((b) => (b.children ? b.children.map((c) => c.text || '').join('') : ''))
        .join('\n');
    }
    return '';
  };

  return (
    <div className="timeline-row">
      <div className="timeline-date-column">
        <div className="timeline-day-box">
          <span className="badge-day">{day}</span>
        </div>
        <span className="badge-month">{month}</span>
      </div>

      <div className="timeline-content-block">
        <h3 className="event-row-title">{title}</h3>

        {imageUrl && (
          <div className="event-image-container">
            <img src={imageUrl} alt={title} className="event-row-image" />
          </div>
        )}

        <p className="event-row-description">{renderDescription(description)}</p>
      </div>
    </div>
  );
};

export default EventItem;