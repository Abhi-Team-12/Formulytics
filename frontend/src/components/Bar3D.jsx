import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const Bar3D = ({ data }) => {
  const groupRef = useRef();
  const maxValue = Math.max(...data.map(item => item.y));
  
  // Responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust scaleFactor and camera based on width
  const scaleFactor = windowWidth < 640
    ? 3 / maxValue   // Mobile: smaller scale to fit
    : windowWidth < 1024
    ? 4 / maxValue   // Tablet
    : 5 / maxValue;  // Desktop

  // Camera position & FOV
  const cameraPosition = windowWidth < 640
    ? [0, 2, 8]       // Mobile: closer & lower
    : windowWidth < 1024
    ? [0, 2.5, 9]     // Tablet
    : [0, 3, 10];     // Desktop

  const cameraFov = windowWidth < 640
    ? 60
    : windowWidth < 1024
    ? 55
    : 50;

  // Label distance factor for scaling labels
  const labelDistanceFactor = windowWidth < 640
    ? 6
    : windowWidth < 1024
    ? 8
    : 10;

  // Bar spacing (reduce on smaller screens)
  const barSpacing = windowWidth < 640
    ? 1
    : windowWidth < 1024
    ? 1.1
    : 1.2;

  // Rotate the chart slowly for better visibility
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
      <OrbitControls enableZoom={true} enablePan={true} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <Environment preset="city" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" roughness={0.8} metalness={0.2} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]}>
        {data.map((item, index) => {
          const height = item.y * scaleFactor;
          const width = 0.8;
          const depth = item.z * scaleFactor || 0.8;
          const x = (index - data.length / 2) * barSpacing;
          const color = new THREE.Color(`hsl(${(index * 360) / data.length}, 80%, 60%)`);

          return (
            <Float 
              key={index} 
              speed={2} 
              rotationIntensity={0.5} 
              floatIntensity={0.5}
            >
              <group>
                <mesh 
                  position={[x, height / 2, 0]} 
                  castShadow 
                  receiveShadow
                >
                  <boxGeometry args={[width, height, depth]} />
                  <meshPhysicalMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.7}
                    clearcoat={0.5}
                    clearcoatRoughness={0.1}
                    transmission={0.1}
                  />
                </mesh>
                
                <mesh position={[x, 0, 0]}>
                  <boxGeometry args={[width * 1.1, 0.1, depth * 1.1]} />
                  <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
                </mesh>

                <Html
                  position={[x, height + 0.5, 0]}
                  center
                  distanceFactor={labelDistanceFactor}
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: windowWidth < 640 ? '12px' : '14px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    minWidth: '40px'
                  }}
                >
                  <div>{item.y.toFixed(1)}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>{item.label || ''}</div>
                </Html>
              </group>
            </Float>
          );
        })}
      </group>

      <group>
        <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2, 0xff0000, 0.2, 0.1]} />
        <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2, 0x00ff00, 0.2, 0.1]} />
        <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2, 0x0000ff, 0.2, 0.1]} />
      </group>
    </>
  );
};

export default Bar3D;
