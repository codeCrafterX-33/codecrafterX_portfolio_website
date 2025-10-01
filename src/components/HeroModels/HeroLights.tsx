import { useRef } from "react";
import * as THREE from "three";

const HeroLights = () => {
  const light = useRef<THREE.SpotLight>(null);
  return (
    <>
      <spotLight
        ref={light}
        position={[-1, 3, 2]}
        intensity={100}
        angle={0.15}
        penumbra={0.2}
        color="white"
      />
      <spotLight
        ref={light}
        position={[4, 5, 4]}
        intensity={40}
        angle={0.3}
        penumbra={0.5}
        color="#4cc9f0"
      />
      <primitive
        object={new THREE.RectAreaLight("#A259FF", 10, 10, 1)}
        position={[1, 3, 4]}
        intensity={15}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]}
      />

      <pointLight position={[0, 1, 0]} intensity={10} color="#7209b7" />

      <pointLight position={[1, 2, -2]} intensity={10} color="#7209b7" /> 
    </> 
  );
};

export default HeroLights;
