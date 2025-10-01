import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import * as THREE from "three";
import { useRef } from "react";

const ContactLights = () => {
  const light = useRef<THREE.SpotLight>(null);
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        ref={light}
        position={[-2, 4, 3]}
        intensity={80}
        angle={0.2}
        penumbra={0.3}
        color="white"
      />
      <spotLight
        position={[3, 6, 2]}
        intensity={50}
        angle={0.25}
        penumbra={0.4}
        color="#4cc9f0"
      />
      <pointLight position={[0, 2, 0]} intensity={15} color="#7209b7" />
      <pointLight position={[2, 3, -1]} intensity={12} color="#f72585" />
    </>
  );
};

const ComputerModel = () => {
  // Create a simple computer-like mesh for now
  // This will be replaced with the actual GLB model later
  return (
    <group>
      {/* Monitor */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0, 0.5]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.8, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Desk */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
};

const ContactExperience = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <OrbitControls
          enablePan={false}
          enableZoom={!isTablet}
          maxDistance={12}
          minDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />

        <ContactLights />
        <Environment preset="city" />

        <group
          scale={isMobile ? 0.6 : isTablet ? 0.8 : 1}
          position={[0, -1, 0]}
          rotation={[0, -Math.PI / 8, 0]}
        >
          <ComputerModel />
        </group>
      </Canvas>
    </div>
  );
};

export default ContactExperience;
