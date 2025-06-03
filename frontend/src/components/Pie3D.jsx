import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useThree } from '@react-three/fiber';
import { Float, Html, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ExtrudeGeometry } from 'three';

extend({ ExtrudeGeometry });

const Pie3D = ({ data }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window size on resize
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive camera settings
  const isMobile = windowSize.width <= 768;
  const isTablet = windowSize.width > 768 && windowSize.width <= 1024;

  // Camera position and FOV adapted to screen size
  const cameraPosition = isMobile
    ? [0, 4, 8]
    : isTablet
    ? [0, 4, 10]
    : [0, 5, 12];

  const cameraFov = isMobile ? 60 : isTablet ? 50 : 45;

  const total = data.reduce((acc, item) => acc + item.y, 0);
  const radius = 3;
  const height = 1.5;
  const bevelSize = 0.1;
  const bevelThickness = 0.1;
  const innerRadius = 0.1;

  let cumulativeAngle = 0;
  const slices = data.map((item, index) => {
    const sliceAngle = (item.y / total) * Math.PI * 2;
    const slice = {
      startAngle: cumulativeAngle,
      sliceAngle,
      value: item.y,
      name: item.name || `Item ${index + 1}`,
      index
    };
    cumulativeAngle += sliceAngle;
    return slice;
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        height: isMobile ? '320px' : '480px',
        margin: '0 auto'
      }}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 15, 10]} intensity={1} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Pie Chart */}
      <group position={[0, height / 2, 0]} rotation={[-Math.PI / 10, 0, 0]}>
        {slices.map(({ startAngle, sliceAngle, value, name, index }) => {
          const hue = (index * 360) / data.length;
          const color = new THREE.Color(`hsl(${hue}, 80%, 60%)`);
          const midAngle = startAngle + sliceAngle / 2;

          const shape = new THREE.Shape();
          shape.moveTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
          shape.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
          shape.absarc(0, 0, radius, startAngle, startAngle + sliceAngle, false);
          shape.lineTo(innerRadius * Math.cos(startAngle + sliceAngle), innerRadius * Math.sin(startAngle + sliceAngle));
          shape.absarc(0, 0, innerRadius, startAngle + sliceAngle, startAngle, true);

          const extrudeSettings = {
            depth: height,
            bevelEnabled: true,
            bevelSize,
            bevelThickness,
            bevelSegments: 6,
            steps: 1,
            curveSegments: 32
          };

          const labelX = Math.cos(midAngle) * (radius * 1.5);
          const labelZ = Math.sin(midAngle) * (radius * 1.5);
          const labelY = height + 0.5;

          return (
            <Float
              key={index}
              speed={1.5}
              rotationIntensity={0.3}
              floatIntensity={0.3}
              floatingRange={[0, 0.1]}
            >
              <group>
                <mesh castShadow receiveShadow>
                  <extrudeGeometry args={[shape, extrudeSettings]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.6}
                    emissive={color.clone().multiplyScalar(0.2)}
                    emissiveIntensity={0.2}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.95}
                  />
                </mesh>

                <Html
                  position={[labelX, labelY, labelZ]}
                  center
                  distanceFactor={8}
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 8px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {name}: {value}
                </Html>

                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([
                        Math.cos(midAngle) * radius * 1.1,
                        height,
                        Math.sin(midAngle) * radius * 1.1,
                        labelX,
                        labelY - 0.3,
                        labelZ
                      ])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#ffffff" linewidth={1} />
                </line>
              </group>
            </Float>
          );
        })}
      </group>

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#333"
          roughness={0.5}
          metalness={0.3}
          envMapIntensity={0.2}
        />
      </mesh>

      {/* Controls & Environment */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={1}
      />
      <Environment preset="studio" />
    </div>
  );
};

export default Pie3D;
