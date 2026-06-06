import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from 'three';

const About = () => {
  const titleRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const isActive = usePortalStore((state) => !!state.activePortalId);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 0.4,
    color: 'white',
  };

  const aboutText = `I'm an AI/ML Engineer and Creative Developer based in India. Currently pursuing my B.Tech in Computer Science and Engineering at St. Thomas' College of Engineering and Technology.

I specialize in building intelligent machine learning systems, deep learning models for computer vision, conversational business intelligence applications, and interactive 3D web experiences.

Passionate about bridging the gap between state-of-the-art AI research and production-grade, immersive user experiences.`;

  useFrame((state, delta) => {
    const reveal = data.range(0.4, 0.1);
    const scrollout = data.range(0.55, 0.1);

    const opacity = reveal - scrollout;

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const targetY = (1 - reveal) * (10 - i) + 2 - 10 * scrollout;
        text.position.y = THREE.MathUtils.damp(text.position.y, targetY, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = opacity;
      });
    }

    if (bodyRef.current) {
      const targetY = -0.5 - 10 * scrollout;
      bodyRef.current.position.y = THREE.MathUtils.damp(bodyRef.current.position.y, targetY, 7, delta);
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      bodyRef.current.children.forEach((child) => {
        if ((child as any).fillOpacity !== undefined) {
          (child as any).fillOpacity = opacity;
        }
      });
    }
  });

  const getTitle = () => {
    const title = 'about me'.toUpperCase();
    return title.split('').map((char, i) => {
      const diff = isMobile ? 0.4 : 0.8;
      return (
        <Text key={i} {...fontProps} position={[i * diff, 2, 1]}>{char}</Text>
      );
    });
  };

  return (
    <group position={[0, -50, 12]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={[isMobile ? -1.4 : -2.8, 2, -2]}>
          {getTitle()}
        </group>

        <group ref={bodyRef} position={[0, -0.5, 0]}>
          <Text
            font="./Vercetti-Regular.woff"
            fontSize={isMobile ? 0.15 : 0.20}
            color="white"
            maxWidth={isMobile ? 3.2 : 6.5}
            lineHeight={1.5}
            textAlign="center"
            anchorX="center"
            anchorY="top"
          >
            {aboutText}
          </Text>
        </group>
      </group>
    </group>
  );
};

export default About;
