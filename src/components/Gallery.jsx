import React, { useState, useEffect } from 'react';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

const Gallery = ({ images = [], width = '100%', height = '400px', radius = '0px', showThumbs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Avança automaticamente a cada 4 segundos e reinicia ao chegar no fim
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) return null;

  return (
    <div style={{ width, margin: '0 auto', position: 'relative' }}>
      <div style={{ height, position: 'relative', overflow: 'hidden', borderRadius: radius }}>
        <img
          src={images[currentIndex]?.src}
          alt="Slide"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <img src={arrowLeft} alt="Anterior" width={40} height={40} />
        </button>

        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <img src={arrowRight} alt="Próximo" width={40} height={40} />
        </button>
      </div>

      {showThumbs && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt="Thumbnail"
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '117px',
                height: '95px',
                objectFit: 'cover',
                borderRadius: radius,
                border: currentIndex === index ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;