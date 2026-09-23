import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles, MeshDistortMaterial, Trail, Instance, Instances, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// A dynamic robotic "eye" or "core" that tracks the mouse
const RoboticCore = () => {
  const coreRef = useRef();
  const innerRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse tracking
    const targetX = (mouse.x * viewport.width) / 4;
    const targetY = (mouse.y * viewport.height) / 4;
    
    if (coreRef.current) {
      // Lerp rotation towards mouse
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, (mouse.x * Math.PI) / 4, 0.05);
      coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, -(mouse.y * Math.PI) / 4, 0.05);
      
      // Add subtle floating
      coreRef.current.position.y = Math.sin(time) * 0.2;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = time * 0.5;
      innerRef.current.rotation.x = time * 0.3;
    }

    if (ringRef1.current && ringRef2.current) {
      ringRef1.current.rotation.z = time * 0.2;
      ringRef2.current.rotation.x = time * -0.2;
      ringRef2.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={coreRef} position={[2, 0, -2]}>
      {/* Outer Robotic Rings */}
      <mesh ref={ringRef1} scale={2}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#FFD600" metalness={0.8} roughness={0.2} emissive="#FFD600" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh ref={ringRef2} scale={1.8}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial color="#0A84FF" metalness={1} roughness={0} emissive="#0A84FF" emissiveIntensity={0.5} />
      </mesh>

      {/* Pulsing Quantum Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <MeshDistortMaterial 
          color="#050505" 
          distort={0.3} 
          speed={3} 
          roughness={0.1}
          metalness={0.9}
          emissive="#00C7B5"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>

      {/* Central Solid Eye */}
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color="#050505"
          metalness={1}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Glowing Pupil */}
      <Sphere args={[0.2, 16, 16]} position={[0, 0, 0.75]}>
        <meshBasicMaterial color="#FFD600" />
      </Sphere>
    </group>
  );
};

// Abstract Data Nodes floating in space
const DataNodes = () => {
  const group = useRef();
  
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15 - 5
        ],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#0A84FF' : '#00C7B5'
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={node.position} scale={node.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color={node.color} 
              wireframe={Math.random() > 0.5}
              emissive={node.color}
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Connection Lines representing neural pathways
const ConnectionLines = () => {
  return (
    <Trail width={0.5} color={'#FFD600'} length={4} attenuation={(t) => t * t}>
      <Float speed={2} rotationIntensity={1} floatIntensity={5}>
        <mesh position={[-4, 2, -3]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#FFD600" />
        </mesh>
      </Float>
    </Trail>
  );
};

export default function Scene() {
  return (
    <>
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1} color="#0A84FF" />
      <Sparkles count={300} scale={15} size={3} speed={0.5} opacity={0.5} color="#00C7B5" />
      
      <RoboticCore />
      <DataNodes />
      <ConnectionLines />
      
      <fog attach="fog" args={['#020205', 5, 25]} />
    </>
  );
}
