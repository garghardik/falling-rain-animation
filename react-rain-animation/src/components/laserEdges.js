import React, { useEffect, useState } from 'react';
import './laserEdges.css';

const LaserEdges = () => {
  const [colors, setColors] = useState({
    top: '',
    bottom: '',
    left: '',
    right: ''
  });

  const neonColors = ['#ff004c', '#00fff7', '#00ff00', '#ffcc00', '#00aaff', '#ff00ff'];

  const getRandomGradient = () => {
    const c1 = neonColors[Math.floor(Math.random() * neonColors.length)];
    const c2 = neonColors[Math.floor(Math.random() * neonColors.length)];
    return `linear-gradient(to right, ${c1}, ${c2})`;
  };

  useEffect(() => {
    const updateColors = () => {
      setColors({
        top: getRandomGradient(),
        bottom: getRandomGradient(),
        left: getRandomGradient(),
        right: getRandomGradient()
      });
    };

    updateColors();
    const interval = setInterval(updateColors, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="laser-edge top" style={{ background: colors.top }} />
      <div className="laser-edge bottom" style={{ background: colors.bottom }} />
      <div className="laser-edge left" style={{ background: colors.left }} />
      <div className="laser-edge right" style={{ background: colors.right }} />
    </>
  );
};

export default LaserEdges;
