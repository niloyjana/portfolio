'use client';
import { useRef, useEffect } from "react";
import { useScrollStore, usePortalStore } from "@stores";

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
  const scrollEl = useScrollStore((state) => state.scrollEl);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollEl || !containerRef.current) return;

    let ticking = false;

    const updatePosition = () => {
      if (!containerRef.current) return;

      if (usePortalStore.getState().activePortalId) {
        containerRef.current.style.display = 'none';
        ticking = false;
        return;
      }

      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const scrollProgress = maxScroll > 0 ? scrollEl.scrollTop / maxScroll : 0;

      const REVEAL = 0.86;
      const EXIT   = 0.95;
      const slideIn = Math.max(0, Math.min(1, (scrollProgress - REVEAL) / 0.08));
      const fadeOut = Math.max(0, Math.min(1, (scrollProgress - EXIT)   / 0.04));
      
      const vh = window.innerHeight;
      const opacity = 1 - fadeOut;
      const translateY = (1 - slideIn) * vh - fadeOut * (vh * 0.5);
      
      const isVisible = !((slideIn === 0 && opacity === 1) || opacity <= 0.01);

      if (!isVisible) {
        containerRef.current.style.display = 'none';
      } else {
        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = opacity.toString();
        containerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
        // Intentionally leaving pointerEvents as 'none' inherited from parent
        // to prevent blocking touch scroll on mobile.
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    // Run once to set initial state
    updatePosition();

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollEl]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '0 1.5rem',
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
  );
};

export default Skills;
