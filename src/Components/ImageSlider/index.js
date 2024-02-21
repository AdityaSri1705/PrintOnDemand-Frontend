import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function Slideshow({ slider }) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  const handleSlideBtn = (btn_link) => {
    if (btn_link !== "") {
      navigate(btn_link);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === slider.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slider.length]);

  const handleDotClick = (idx) => {
    setIndex(idx);
  };

  return (
    <div className="slideshow">
      <div className="slideshowSlider">
        {slider.map((el, idx) => (
          <div
            className={`slide${index === idx ? " active" : ""}`}
            key={idx}
            style={{
              opacity: index === idx ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            <img style={{ width: "100%", height: "100%" }} src={el.image} alt='SliderImg' />
            {el.btn_text && (
              <div className="slidebtn" onClick={() => handleSlideBtn(el.btn_link)}>
                <p>{el.btn_text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="slideshowDots">
        {slider.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => handleDotClick(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;