import React from 'react';

const EventItem = ({ event }) => {
  const dataFields = event.attributes ? event.attributes : event;
  const title = dataFields.title || "უტიტულო ღონისძიება";
  const description = dataFields.description;
  const rawDate = dataFields.eventDate || dataFields.date || dataFields.publishedAt || event.publishedAt;

  const formatGeorgianDate = (dateString) => {
    if (!dateString) return { day: '??', month: '—' };
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const monthsGeo = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
      return { day, month: monthsGeo[monthIndex] || '—' };
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '??', month: '—' };
    const day = date.getDate();
    const monthsGeo = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
    return { day, month: monthsGeo[date.getMonth()] };
  };

  const { day, month } = formatGeorgianDate(rawDate);

  let imgUrlPath = null;
  if (dataFields.image) {
    const imgData = dataFields.image.data || dataFields.image;
    if (Array.isArray(imgData) && imgData.length > 0) {
      imgUrlPath = (imgData[0].attributes || imgData[0])?.url;
    } else if (imgData) {
      imgUrlPath = (imgData.attributes || imgData)?.url;
    }
  }
  const imageUrl = imgUrlPath ? `http://localhost:1337${imgUrlPath}` : null;

  const renderDescription = (descData) => {
    if (!descData) return '';
    if (typeof descData === 'string') return descData;
    if (Array.isArray(descData)) {
      return descData.map(b => b.children ? b.children.map(c => c.text || '').join('') : '').join('\n');
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