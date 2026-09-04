"use client";
import { useScrollStore, usePortalStore } from "@stores";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { isMobile } from "react-device-detect";

const IMAGES = [
  { src: '/images/carousel/1.jpeg' },
  { src: '/images/carousel/2.jpeg' },
  { src: '/images/carousel/3.jpeg' },
  { src: '/images/carousel/4.jpeg' },
  { src: '/images/carousel/5.jpeg' },
  { src: '/images/carousel/6.jpeg' },
  { src: '/images/carousel/7.jpeg' },
  { src: '/images/carousel/8.jpeg' },
  { src: '/images/carousel/9.jpeg' },
];

const ImageFooter = () => {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const activePortalId = usePortalStore((state) => state.activePortalId);

  // Start revealing when the Skills section is almost 70% faded out and moving up
  const REVEAL = 0.975;
  const fadeIn  = Math.max(0, Math.min(1, (scrollProgress - REVEAL) / 0.025));
  const opacity = fadeIn;
  const translateY = (1 - fadeIn) * 200;

  if (activePortalId || opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, bottom: 0, left: 0, right: 0,
        ...(!isMobile && {
          inset: '1rem',
          width: 'calc(100% - 2rem)',
          height: 'calc(100% - 2rem)',
        }),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <ImageStreamHero
        images={IMAGES}
        className="w-full h-full pointer-events-none relative"
      >
        <div className="absolute inset-0 pointer-events-none z-10">
          <LetsWorkTogether />
        </div>
      </ImageStreamHero>
    </div>
  );
};

export default ImageFooter;
