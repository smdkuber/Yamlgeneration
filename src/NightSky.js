import React, { useEffect, useState } from 'react';
import './NightSky.css'; // Ensure to link the CSS file

const NightSky = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starArray = [];
    const totalStars = 200; // Number of stars

    for (let i = 0; i < totalStars; i++) {
      const x = Math.random() * 100; // Random X position (percentage)
      const y = Math.random() * 100; // Random Y position (percentage)
      const size = 1 + Math.random() * 3; // Random size between 1px and 4px
      const animationDelay = Math.random() * 2; // Random animation delay (seconds)
      const animationDuration = 1 + Math.random() * 3; // Random animation duration (seconds)

      starArray.push({
        id: i,
        x,
        y,
        size,
        animationDelay,
        animationDuration,
      });
    }

    setStars(starArray);
  }, []);

  return (
    <div className="night-sky">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default NightSky;
