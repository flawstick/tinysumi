"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, useSphere, usePlane } from "@react-three/cannon";
import { PerspectiveCamera, Text, Stars } from "@react-three/drei";
import * as THREE from "three";

// Explosion effect when objects are hit
function Explosion({ position, onComplete }) {
  const [particles, setParticles] = useState([]);
  const group = useRef();

  useEffect(() => {
    // Create explosion particles
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        position: [0, 0, 0],
        velocity: [
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
        ],
        size: Math.random() * 0.5 + 0.2,
        color: i % 2 === 0 ? "#ff69b4" : "#ff9ff3",
      });
    }
    setParticles(newParticles);

    // Remove explosion after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  useFrame(() => {
    if (group.current) {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          position: [
            particle.position[0] + particle.velocity[0] * 0.01,
            particle.position[1] + particle.velocity[1] * 0.01,
            particle.position[2] + particle.velocity[2] * 0.01,
          ],
        })),
      );
    }
  });

  return (
    <group ref={group} position={position}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Pink ball that player throws
function Ball({ position, velocity }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.5],
    velocity,
    linearDamping: 0.1,
    collisionResponse: true,
    userData: { type: "ball" },
  }));

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#ff69b4"
        roughness={0.2}
        metalness={0.3}
        emissive="#ff69b4"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Black cube target with movement
function BlackCube({ position, onHit, id }) {
  const [ref] = useBox(() => ({
    mass: 0, // Zero mass makes it static
    position,
    args: [1, 1, 1],
    type: "Static", // Make it static
    userData: { type: "cube", id },
    onCollide: (e) => {
      if (e.body.userData && e.body.userData.type === "ball") {
        onHit(id, position);
      }
    },
  }));

  // Create a unique movement pattern for this cube
  const movementSpeed = useRef(Math.random() * 0.01 + 0.005);
  const movementRange = useRef(Math.random() * 1 + 0.5);
  const startPosition = useRef([...position]);
  const time = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    // Rotate in place
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.005;

    // Move slightly left and right
    time.current += movementSpeed.current;
    ref.current.position.x =
      startPosition.current[0] + Math.sin(time.current) * movementRange.current;
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="black" roughness={0.7} />
    </mesh>
  );
}

// Blue star target with movement
function BlueStar({ position, onHit, id }) {
  const [ref] = useBox(() => ({
    mass: 0, // Zero mass makes it static
    position,
    args: [1.2, 1.2, 0.2],
    type: "Static", // Make it static
    userData: { type: "star", id },
    onCollide: (e) => {
      if (e.body.userData && e.body.userData.type === "ball") {
        onHit(id, position);
      }
    },
  }));

  // Create a unique movement pattern for this star
  const movementSpeed = useRef(Math.random() * 0.01 + 0.005);
  const movementRange = useRef(Math.random() * 1 + 0.5);
  const startPosition = useRef([...position]);
  const time = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    // Rotate in place
    ref.current.rotation.z += 0.01;

    // Move slightly left and right
    time.current += movementSpeed.current;
    ref.current.position.x =
      startPosition.current[0] + Math.sin(time.current) * movementRange.current;
  });

  // Create a star shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.6;
    const innerRadius = 0.3;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    shape.closePath();
    return shape;
  }, []);

  return (
    <mesh ref={ref} castShadow>
      <extrudeGeometry
        args={[
          starShape,
          {
            depth: 0.2,
            bevelEnabled: false,
          },
        ]}
      />
      <meshStandardMaterial
        color="#4169e1"
        roughness={0.3}
        metalness={0.7}
        emissive="#4169e1"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Floor plane - invisible but catches balls that miss
function Floor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -20, 0],
  }));

  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111" transparent opacity={0} />
    </mesh>
  );
}

// Score display at the top of the screen
function ScoreDisplay({ score }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 3.5, -5]} scale={[6, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0, 3.5, -4.9]}
        color="#ff69b4"
        fontSize={0.5}
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {`SCORE: ${score}`}
      </Text>
    </group>
  );
}

// Main game component
function Game() {
  const { camera, mouse, viewport, size } = useThree();
  const [balls, setBalls] = useState([]);
  const [targets, setTargets] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setScore] = useState(0);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const isMobile = useRef(false);

  // Check if device is mobile
  useEffect(() => {
    isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  // Generate initial targets - fewer objects
  useEffect(() => {
    const newTargets = [];

    // Create just 6 targets total (3 of each type)

    // Create black cubes
    for (let i = 0; i < 3; i++) {
      const xPos = (i - 1) * 3; // Spread them out horizontally
      const zPos = -15; // All at same depth
      const yPos = Math.random() * 2 + 1; // Random height

      newTargets.push({
        id: `cube-${i}`,
        type: "cube",
        position: [xPos, yPos, zPos],
      });
    }

    // Create blue stars
    for (let i = 0; i < 3; i++) {
      const xPos = (i - 1) * 3 + 1.5; // Offset from cubes
      const zPos = -17; // Slightly further back
      const yPos = Math.random() * 2 + 1; // Random height

      newTargets.push({
        id: `star-${i}`,
        type: "star",
        position: [xPos, yPos, zPos],
      });
    }

    setTargets(newTargets);
  }, []);

  // Handle target hit
  const handleHit = (id, position) => {
    // Check if target exists (to prevent double hits)
    if (!targets.find((target) => target.id === id)) return;

    // Add explosion
    setExplosions((prev) => [
      ...prev,
      { id: `explosion-${Date.now()}`, position: position },
    ]);

    // Remove target
    setTargets((prev) => prev.filter((target) => target.id !== id));

    // Update score
    setScore((prev) => prev + 100);

    // Add new target after a delay
    setTimeout(() => {
      // Determine type based on original ID
      const type = id.includes("cube") ? "cube" : "star";

      // Create position for new target
      const xPos = (Math.random() - 0.5) * 8; // Random x position
      const yPos = Math.random() * 2 + 1; // Random height
      const zPos = -15 - Math.random() * 3; // Random depth around -15

      setTargets((prev) => [
        ...prev,
        {
          id: `${type}-new-${Date.now()}`,
          type: type,
          position: [xPos, yPos, zPos],
        },
      ]);
    }, 1000);
  };

  // Handle explosion completion
  const handleExplosionComplete = (id) => {
    setExplosions((prev) => prev.filter((explosion) => explosion.id !== id));
  };

  // Handle touch/click to throw ball
  const handleClick = (e) => {
    // Get normalized coordinates (-1 to 1)
    let x, y;

    if (e.touches) {
      // Touch event
      const touch = e.touches[0];
      x = (touch.clientX / size.width) * 2 - 1;
      y = -(touch.clientY / size.height) * 2 + 1;
      setTouchPosition({ x, y });
    } else {
      // Mouse event
      x = mouse.x;
      y = mouse.y;
    }

    // Calculate throw direction - make it go straight with just slight aiming
    // Reduce the x and y influence for straighter shots
    const direction = new THREE.Vector3(x * 0.5, y * 0.5, -1).normalize();

    // Add new ball with higher velocity
    setBalls((prev) => [
      ...prev,
      {
        id: `ball-${Date.now()}`,
        position: [0, 0, 5], // Fixed position in front of camera
        velocity: [direction.x * 40, direction.y * 40, direction.z * 40], // Higher speed for straighter shots
      },
    ]);

    // Remove old balls to prevent too many physics objects
    if (balls.length > 10) {
      setBalls((prev) => prev.slice(Math.max(prev.length - 10, 0)));
    }
  };

  // Set up touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setTouchPosition({ x, y });
      }
    };

    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* Fixed camera position */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff69b4" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#9c27b0" />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Score display at top of screen */}
      <ScoreDisplay score={score} />

      <Physics gravity={[0, -1, 0]}>
        <Floor />

        {/* Render balls */}
        {balls.map((ball) => (
          <Ball
            key={ball.id}
            position={ball.position}
            velocity={ball.velocity}
          />
        ))}

        {/* Render targets */}
        {targets.map((target) =>
          target.type === "cube" ? (
            <BlackCube
              key={target.id}
              id={target.id}
              position={target.position}
              onHit={handleHit}
            />
          ) : (
            <BlueStar
              key={target.id}
              id={target.id}
              position={target.position}
              onHit={handleHit}
            />
          ),
        )}
      </Physics>

      {/* Render explosions */}
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          position={explosion.position}
          onComplete={() => handleExplosionComplete(explosion.id)}
        />
      ))}

      {/* Aiming reticle for mobile */}
      {isMobile.current && (
        <mesh
          position={[touchPosition.x * 0.5, touchPosition.y * 0.5, -5]}
          scale={0.2}
        >
          <ringGeometry args={[0.8, 1, 16]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Invisible plane to capture clicks/touches */}
      <mesh
        position={[0, 0, 0]}
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function PinkGame() {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <color attach="background" args={["#4a0072"]} /> {/* Purple background */}
      <fog attach="fog" args={["#4a0072", 10, 50]} />
      <Game />
    </Canvas>
  );
}
