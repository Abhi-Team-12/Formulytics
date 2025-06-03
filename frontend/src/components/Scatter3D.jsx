import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const Scatter3D = ({ data, showHelpers = false }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine scale cube size based on device
  const isMobile = windowSize.width <= 768;
  const isTablet = windowSize.width > 768 && windowSize.width <= 1024;

  // Smaller cube on mobile for better fit
  const cubeSize = isMobile ? 6 : isTablet ? 8 : 10;
  const halfCube = cubeSize / 2;

  const points = useMemo(() => {
    if (!data || data.length === 0) return [];

    const xValues = data.map(item => item.x);
    const yValues = data.map(item => item.y);
    const zValues = data.map(item => item.z);

    const maxX = Math.max(...xValues) || 1;
    const maxY = Math.max(...yValues) || 1;
    const maxZ = Math.max(...zValues) || 1;

    const scaleX = cubeSize / maxX;
    const scaleY = cubeSize / maxY;
    const scaleZ = cubeSize / maxZ;

    return data.map((item, index) => ({
      key: index,
      position: [
        (item.x * scaleX) - halfCube,
        (item.y * scaleY) - halfCube,
        (item.z * scaleZ) - halfCube,
      ],
      color: item.color || '#0088FE',
      size: item.size || (isMobile ? 0.1 : 0.2), // smaller spheres on mobile
    }));
  }, [data, cubeSize, halfCube, isMobile]);

  return (
    <group>
      {showHelpers && (
        <>
          <axesHelper args={[cubeSize / 2]} />
          <gridHelper args={[cubeSize, cubeSize]} />
        </>
      )}
      {points.map(({ key, position, color, size }) => (
        <mesh key={key} position={position}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color(color)} />
        </mesh>
      ))}
    </group>
  );
};

export default Scatter3D;
