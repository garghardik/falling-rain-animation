import React, { useState, useEffect, useRef } from 'react';

const RainGrid = () => {
  const [gridWidth, setGridWidth] = useState(20);
  const [gridHeight, setGridHeight] = useState(15);
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [raindrops, setRaindrops] = useState([]);
  const [currentWaveColor, setCurrentWaveColor] = useState(0);
  const intervalRef = useRef(null);
  const waveTimerRef = useRef(0);

  // Rain colors - blues, teals, and some variation
  const rainColors = [
    "#FACC15",
    "#EAB308",
    "#F472B6",
    "#EC4899",
    "#3B82F6",
    "#2563EB",
    "#EF4444",
    "#DC2626",
  ];

  // Generate random raindrop with trail using current wave color
  const createRaindrop = (waveColor) => {
    const trailLength = Math.floor(Math.random() * 4) + 2; // Trail of 2-5 drops
    const x = Math.floor(Math.random() * gridWidth);
    const speed = Math.random() * 1 + 0.5; // Speed between 0.5-1.5
    
    return {
      id: Math.random(),
      x: x,
      y: -trailLength,
      color: rainColors[waveColor],
      speed: speed,
      trailLength: trailLength,
      opacity: Math.random() * 0.3 + 0.7,
      waveId: waveColor,
    };
  };

  // Update raindrops positions and manage color waves
  const updateRaindrops = () => {
    waveTimerRef.current += animationSpeed;

    const waveChangeInterval = 1500;
    let newWaveColor = currentWaveColor;
    
    if (waveTimerRef.current >= waveChangeInterval) {
      newWaveColor = (currentWaveColor + 1) % rainColors.length;
      setCurrentWaveColor(newWaveColor);
      waveTimerRef.current = 0;
    }

    setRaindrops(prevDrops => {
      let newDrops = prevDrops
        .map(drop => ({
          ...drop,
          y: drop.y + drop.speed,
        }))
        .filter(drop => drop.y - drop.trailLength < gridHeight);

      // Intensity based on wave progression (0.1 to 1.0)
      const waveProgressRatio = waveTimerRef.current / waveChangeInterval;
      const waveIntensity = Math.max(0.1, 1 - waveProgressRatio);
      const dropsToAdd = Math.floor(gridWidth * 0.15 * waveIntensity);

      // Use the updated wave color for new raindrops
      for (let i = 0; i < dropsToAdd && Math.random() < 0.6; i++) {
        newDrops.push(createRaindrop(newWaveColor));
      }

      return newDrops;
    });
  };

  // Start/stop animation
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(updateRaindrops, animationSpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animationSpeed, gridWidth, gridHeight, currentWaveColor]); // Added currentWaveColor to dependencies

  // Reset raindrops when grid size changes
  useEffect(() => {
    setRaindrops([]);
    setCurrentWaveColor(0);
    waveTimerRef.current = 0; // Reset wave timer
  }, [gridWidth, gridHeight]);

  // Create grid with raindrops and trails
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        // Check if any raindrop trail covers this position
        const raindrop = raindrops.find(drop => {
          const dropX = Math.floor(drop.x);
          const dropY = Math.floor(drop.y);
          
          // Check if this grid position is part of the raindrop's trail
          return dropX === col && 
                 row >= dropY - drop.trailLength + 1 && 
                 row <= dropY && 
                 dropY >= 0;
        });
        
        let backgroundColor = 'transparent';
        let opacity = 1;
        let boxShadow = 'none';
        
        if (raindrop) {
          const dropY = Math.floor(raindrop.y);
          const distanceFromHead = dropY - row;
          
          // Create fading effect along the trail
          const trailOpacity = raindrop.opacity * (1 - (distanceFromHead / raindrop.trailLength));
          
          backgroundColor = raindrop.color;
          opacity = Math.max(trailOpacity, 0.1);
          boxShadow = `0 0 ${6 + distanceFromHead * 2}px ${raindrop.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        }
        
        grid.push(
          <div
            key={`${row}-${col}`}
            style={{
              width: '24px',
              height: '24px',
              border: '1px solid #374151',
              backgroundColor,
              opacity,
              boxShadow,
              transition: 'all 0.1s ease',
            }}
          />
        );
      }
    }
    
    return grid;
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#111827',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const maxWidthStyle = {
    maxWidth: '1024px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const controlsStyle = {
    backgroundColor: '#374151',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  };

  const controlsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  };

  const labelStyle = {
    display: 'block',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const sliderStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#4B5563',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
  };

  const gridContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
    gap: '1px',
    backgroundColor: 'black',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #4B5563',
  };

  const statsStyle = {
    marginTop: '24px',
    textAlign: 'center',
    color: '#9CA3AF',
  };

  const colorIndicatorStyle = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginLeft: '8px',
    verticalAlign: 'middle',
    backgroundColor: rainColors[currentWaveColor],
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>
        <h1 style={titleStyle}>
          Falling Rain Animation
        </h1>
        
        {/* Controls */}
        <div style={controlsStyle}>
          <div style={controlsGridStyle}>
            <div>
              <label style={labelStyle}>
                Grid Width: {gridWidth}
              </label>
              <input
                type="range"
                min="10"
                max="30"
                value={gridWidth}
                onChange={(e) => setGridWidth(parseInt(e.target.value))}
                style={sliderStyle}
              />
            </div>
            
            <div>
              <label style={labelStyle}>
                Grid Height: {gridHeight}
              </label>
              <input
                type="range"
                min="10"
                max="25"
                value={gridHeight}
                onChange={(e) => setGridHeight(parseInt(e.target.value))}
                style={sliderStyle}
              />
            </div>
            
            <div>
              <label style={labelStyle}>
                Speed: {600 - animationSpeed}ms
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                style={sliderStyle}
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={gridContainerStyle}>
          <div style={gridStyle}>
            {renderGrid()}
          </div>
        </div>

        {/* Stats */}
        <div style={statsStyle}>
          <p>Active Raindrops: {raindrops.length}</p>
          <p>Grid Size: {gridWidth} × {gridHeight}</p>
          <p>Current Wave Color: 
            <span style={colorIndicatorStyle}></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RainGrid;