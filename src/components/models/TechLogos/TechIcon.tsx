import { useEffect } from "react";
import { useGLTF, Environment, Float, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

type TechModel = {
  name: string;
  modelPath: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
};

interface TechIconProps {
  model: TechModel;
}

const TechIcon = ({ model }: TechIconProps) => {
  const { scene } = useGLTF(model.modelPath);

  useEffect(() => {
    if (model.name === "Interactive Developer") {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ color: "white" });
        }
      });
    }
  }, [model.name, scene]);

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
