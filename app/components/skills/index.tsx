import { Html, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { usePortalStore } from "@stores";

const SKILL_CATEGORIES = [
  {
    label: 'AI / ML',
    items: ['LangChain', 'LangGraph', 'RAG Pipelines', 'Multi-Agent Systems', 'Computer Vision', 'Generative AI', 'Transformers (BERT, LLMs)', 'Deep Learning'],
  },
  {
    label: 'Languages',
    items: ['Python', 'Java', 'JavaScript'],
  },
  {
    label: 'Frameworks',
    items: ['FastAPI', 'Flask', 'React', 'Node.js', 'TensorFlow / Keras', 'PyTorch', 'Scikit-learn'],
  },
  {
    label: 'Tools & Cloud',
    items: ['Git', 'GitHub', 'Docker', 'AWS', 'MySQL', 'PostgreSQL', 'SQLite'],
  },
];

const Skills = () => {
  const data = useScroll();
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (activePortalId || !data) {
      if (containerRef.current) containerRef.current.style.display = 'none';
      return;
    }

    const scrollProgress = data.offset;
    const REVEAL = 0.84;
    const EXIT   = 0.93;
    const slideIn = Math.max(0, Math.min(1, (scrollProgress - REVEAL) / 0.06));
    const fadeOut = Math.max(0, Math.min(1, (scrollProgress - EXIT)   / 0.03));
    
    const opacity = 1 - fadeOut;
    const translateY = (1 - slideIn) * 800 - fadeOut * 600;
    
    const isVisible = !((slideIn === 0 && opacity === 1) || opacity <= 0.01);

    if (containerRef.current) {
      if (!isVisible) {
        containerRef.current.style.display = 'none';
      } else {
        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = opacity.toString();
        containerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
        containerRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      }
    }
  });

  return (
    <Html fullscreen zIndexRange={[10, 0]}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1.5rem',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={containerRef}
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '780px',
            textAlign: 'center',
            willChange: 'transform, opacity',
          }}
        >
          {/* Section heading — matches "ABOUT ME" / "EXPERIENCE" visual weight */}
          <h2
            style={{
              color: 'white',
              fontFamily: '"Soria", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '0.25em',
              marginBottom: '3.5rem',
              textTransform: 'uppercase',
            }}
          >
            SKILLS
          </h2>

          {/* Skills grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1.5rem 1rem',
              width: '100%',
            }}
          >
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  {cat.label}
                </p>
                {cat.items.map((skill) => (
                  <p
                    key={skill}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)',
                      lineHeight: 1.8,
                      fontWeight: 300,
                      letterSpacing: '0.04em',
                      margin: 0,
                    }}
                  >
                    {skill}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Skills;
