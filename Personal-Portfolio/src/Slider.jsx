import React, { useState, useCallback } from 'react';
import { SLIDE_DATA } from './SlideData';

// Component for an individual slide
const Slide = ({ data, isActive }) => {
  return (
    // The isActive prop controls the CSS class that triggers the transition and rotation
    <div className={`slide ${isActive ? 'active' : ''}`}>
      <div className="image-box">
        <img src={data.image} alt={data.h1} />
      </div>
      <div className="description-box">
        <h1>{data.h1}</h1>
        <h2>{data.h2}</h2>
        <p>{data.p}</p>
      </div>
    </div>
  );
};

// Main Slider Component
const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === SLIDE_DATA.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? SLIDE_DATA.length - 1 : prevIndex - 1
    );
  }, []);
  
  return (
    <div className="slider-container">
      {SLIDE_DATA.map((slide, index) => (
        <Slide 
          key={index}
          data={slide}
          isActive={index === currentIndex}
        />
      ))}

      {/* Navigation Buttons */}
      <button className="prev-button" onClick={handlePrev}>Prev</button>
      <button className="next-button" onClick={handleNext}>Next</button>
    </div>
  );
};

export default Slider;