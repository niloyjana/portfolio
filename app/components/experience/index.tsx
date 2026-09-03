import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from 'three';
import GridTile from "./GridTile";
import Projects from "./projects";
import Work from "./work";

const Experience = () => {
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const isActive = usePortalStore((state) => !!state.activePortalId);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.45 : 0.55,
    color: 'white',
  };

  useFrame((sate, delta) => {
    const d = data.range(0.75, 0.09);  // letter-drop animation
    const e = data.range(0.75, 0.06);  // letter opacity
    // Start bringing the boxes up when the text cascade is almost finished
    const tiles = data.range(0.76, 0.06);  // tiles appear smoothly: 0.76-0.82
    
    // Start sliding boxes up at 0.84 so they clear the way for Skills
    const exit  = data.range(0.84, 0.09);  // tiles exit: 0.84-0.93

    if (groupRef.current) {
      if (!isActive) {
        if (tiles > 0 && exit < 1) {
          // Slide gently up from -4 into view (-1), then glide WAY up to exit (up 8 units)
          groupRef.current.position.y = -4 + (tiles * 3) + (exit * 8); 
          groupRef.current.visible = true;
          
          // Fade in (tiles) and fade out (exit) materials
          groupRef.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const material = (child as THREE.Mesh).material;
              if (material) {
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const isHoverBox = (material as any).color?.getHexString() === 'ffffff' && (material as any).depthWrite === false;
                const baseOpacity = child.userData.baseOpacity !== undefined ? child.userData.baseOpacity : (isHoverBox ? 0.05 : 1);
                (material as any).transparent = true;
                (material as any).opacity = baseOpacity * tiles * (1 - exit);
              }
            }
          });
        } else {
          groupRef.current.position.y = -30;
          groupRef.current.visible = false;
        }
      } else {
        // IMPORTANT: If active (clicked into a project), force Y to exactly -1
        // This ensures the camera animation flies into the portal perfectly!
        groupRef.current.position.y = -1;
      }
    }

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const y =  Math.max(Math.min((1 - d) * (10 - i), 10), 0.5) + (exit * 8);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = e * (1 - exit);
      });
    }
  });

  const getTitle = () => {
    const title = 'experience'.toUpperCase();
    return title.split('').map((char, i) => {
      const diff = isMobile ? 0.35 : 0.9;
      return (
        <Text key={i} {...fontProps} position={[i * diff, 2, 1]}>{char}</Text>
      );
    });
  };

  return (
    <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0 ,-Math.PI / 2]}>
      {/* <mesh receiveShadow position={[-5, 0, 0.1]}>
        <planeGeometry args={[10, 5, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh> */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={[isMobile ? -1.575 : -4.05, 2, -2]}>
          {getTitle()}
        </group>

        <group position={[0, -1, 0]} ref={groupRef}>
          <GridTile title='WORK AND EDUCATION'
            id="work"
            color='#b9c6d6'
            textAlign='left'
            position={new THREE.Vector3(isMobile ? -1 : -2, 0, isMobile ? 0.4 : 0)}>
            <Work/>
          </GridTile>
          <GridTile title='SIDE PROJECTS'
            id="projects"
            color='#bdd1e3'
            textAlign='right'
            position={new THREE.Vector3(isMobile ? 1 : 2, 0, 0)}>
            <Projects/>
          </GridTile>
        </group>
      </group>
    </group>
  );
};

export default Experience;