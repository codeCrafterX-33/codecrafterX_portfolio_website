import React, { useEffect } from "react";
import { useGLTF, Environment, Float, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface TechIconProps {
  model: any;
}

const TechIcon = ({ model }: TechIconProps) => {
  const gltf = useGLTF(model.modelPath);
  const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;

  useEffect(() => {
    if (model.name === "Interactive Developer") {
      scene.traverse((child: any) => {
        if (child.isMesh && child.name == "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ color: "white" });
        }
      });
    }
  }, [scene]);

  return (
    <Canvas>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Environment preset="city" />

      <OrbitControls enableZoom={false} enablePan={false} />

      <Float speed={5.5} rotationIntensity={0.5} floatIntensity={0.9}>
        <group scale={model.scale} rotation={model.rotation}>
          <primitive object={scene} />
        </group>
      </Float>
    </Canvas>
  );
};

export default TechIcon;
