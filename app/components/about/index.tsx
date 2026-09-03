import { Text, Image, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

const About = () => {
  const titleRef = useRef<THREE.Group>(null);
  const paragraphRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const imageGroupRef = useRef<THREE.Group>(null);
  const data = useScroll();

  const REVEAL_START = 0.65;
  const REVEAL_DUR = 0.03;   // 0.65 → 0.68
  const EXIT_START = 0.71;
  const EXIT_DUR = 0.05;   // 0.71 → 0.76

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 0.4,
    color: "white",
  };

  const paragraphProps = {
    font: "./Vercetti-Regular.woff",
    fontSize: isMobile ? 0.14 : 0.19,
    color: "#e2e8f0",
    maxWidth: isMobile ? 2.6 : 7.8,
    lineHeight: 1.5,
    anchorX: (isMobile ? "center" : "left") as const,
    anchorY: "top" as const,
    textAlign: (isMobile ? "center" : "left") as const,
  };

  const paragraphs = [
    "I'm Niloy Jana, an AI/ML & Full Stack Engineer and Computer Science undergrad at St. Thomas College of Engineering and Technology, Kolkata (Batch 2027).",
    "I work across the full stack — from designing multi-agent LLM systems and RAG pipelines to shipping the APIs, dashboards, and interfaces that put them in front of users. My focus sits at the intersection of applied AI and production engineering: agentic architectures, retrieval-augmented generation, computer vision, and the FastAPI/React backbone that holds it all together.",
    "At KreupAI Technologies, I worked on AISA, orchestrating a 25-agent LLM system for enterprise QA and finance automation, engineering a fault-tolerant LLM gateway with 99.2% uptime, and building RAG pipelines with pgvector for semantic search. Beyond internships, I've built ARIA (a privacy-first, multi-agent financial advisor with local and cloud inference), Opsira (a CNN-based eye disease screening system with Explainable AI), and worked on several other projects — while also competing at the national level, ranking Top 8 of 1,400+ teams at the IIT Delhi Eightfold AI Hackathon."
  ];

  useFrame((state, delta) => {
    const scrollIn = data.range(REVEAL_START, REVEAL_DUR);
    const scrollOut = data.range(EXIT_START, EXIT_DUR);
    const combined = scrollIn * (1 - scrollOut);
    const animFactor = 1 - scrollIn + scrollOut;

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const y = Math.max(Math.min(animFactor * (10 - i), 10), 0.35);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = combined;
      });
    }

    if (paragraphRef.current) {
      paragraphRef.current.children.forEach((text, i) => {
        const yOffset = i === 0 ? 0 : i === 1 ? (isMobile ? -1.0 : -1.4) : (isMobile ? -3.0 : -3.4);
        const yAnim = (scrollOut - (1 - scrollIn)) * (5 - i);
        text.position.y = THREE.MathUtils.damp(text.position.y, yOffset + yAnim, 7, delta);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = combined;
      });
    }
    if (imageGroupRef.current) {
      const yOffset = isMobile ? -4.8 : -0.39; // Adjusted to be below the text block
      const xOffset = isMobile ? 0 : 5.1; // Centered on mobile
      const yAnim = (scrollOut - (1 - scrollIn)) * 3;

      const targetY = yOffset + yAnim;
      imageGroupRef.current.position.y = THREE.MathUtils.damp(imageGroupRef.current.position.y, targetY, 7, delta);
      imageGroupRef.current.position.x = xOffset;

      imageGroupRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          ((child as THREE.Mesh).material as any).opacity = combined;
        }
      });
    }
  });

  const getTitle = () => {
    const title = "ABOUT ME";
    return title.split("").map((char, i) => {
      const diff = isMobile ? 0.3 : 0.8;
      return (
        <Text key={i} {...fontProps} position={[i * diff, 10, 1]} fillOpacity={0}>
          {char}
        </Text>
      );
    });
  };

  return (
    <group position={[0, -41.5, 4.5]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={[isMobile ? -1.05 : -4.6, 1.75, -2]}>
          {getTitle()}
        </group>

        <group ref={paragraphRef} position={[isMobile ? 0 : -6.2, 1.5, -2]}>
          <Text position={[0, 0, 0]} {...paragraphProps}>{paragraphs[0]}</Text>
          <Text position={[0, isMobile ? -0.95 : -1.4, 0]} {...paragraphProps}>{paragraphs[1]}</Text>
          <Text position={[0, isMobile ? -2.8 : -3.4, 0]} {...paragraphProps}>{paragraphs[2]}</Text>
        </group>

        <group ref={imageGroupRef} position={[0, 0, -2]}>
          <Image url="/me.jpeg" scale={isMobile ? 2.5 : 6.82} transparent toneMapped={false} />
        </group>
      </group>
    </group>
  );
};

export default About;
