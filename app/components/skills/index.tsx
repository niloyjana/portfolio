'use client';
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
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const activePortalId = usePortalStore((state) => state.activePortalId);

  // Skills slide up from the bottom naturally, resting below the Experience boxes
  const REVEAL = 0.84;
  const EXIT   = 0.93;
  const slideIn = Math.max(0, Math.min(1, (scrollProgress - REVEAL) / 0.06));
  const fadeOut = Math.max(0, Math.min(1, (scrollProgress - EXIT)   / 0.03));
  
  // No fade-in, just completely opaque until the final fade-out
  const opacity = 1 - fadeOut;
  // Slides up from 800px below, then slides up an additional 600px when exiting
  const translateY = (1 - slideIn) * 800 - fadeOut * 600;

  if (activePortalId || (slideIn === 0 && opacity === 1) || opacity <= 0.01) return null;

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
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: '100%',
          maxWidth: '780px',
          textAlign: 'center',
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
            marginBottom: '1.5rem',
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
