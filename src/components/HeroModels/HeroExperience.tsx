import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
// @ts-ignore
import { Room } from "./Room";
import HeroLights from "./HeroLights";
const HeroExperience = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} id="hero-experience">
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <HeroLights />

      <Sparkles count={100} scale={10} size={2} speed={0.3} />

      <group
        scale={isMobile ? 0.7 : 1}
        position={[0, -4.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <Room />
      </group>
    </Canvas>
  );
};

export default HeroExperience;
