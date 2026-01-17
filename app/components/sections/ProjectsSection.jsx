'use client';

const projects = [
  {
    title: 'nomnomnow',
    description: 'A food picker web app with AI recommendations to help solve the eternal question: "What should I eat?"',
    url: 'https://nomnomnow-one.vercel.app/',
    image: '/nomnomnow.png',
  },
];

export default function ProjectsSection({ isMobile }) {
  return (
    <div
      style={{
        fontFamily: '"Pixelify Sans", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        width: '100%',
      }}
    >
      {/* GitHub Link */}
      <a
        href="https://github.com/zoph1ey"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 500,
          color: '#000',
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <svg
          width={isMobile ? 24 : 28}
          height={isMobile ? 24 : 28}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        github.com/zoph1ey
      </a>
      {projects.map((project) => (
        <a
          key={project.title}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? '15px' : '30px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '8px',
            border: '3px solid #000',
            textDecoration: 'none',
            color: '#000',
            transition: 'transform 0.2s, box-shadow 0.2s',
            maxWidth: '700px',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '6px 6px 0px #000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Project Screenshot */}
          <div
            style={{
              width: isMobile ? '100%' : '250px',
              height: isMobile ? '150px' : '140px',
              borderRadius: '4px',
              border: '2px solid #000',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#f0f0f0',
            }}
          >
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Project Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? '22px' : '26px',
                fontWeight: 600,
                margin: 0,
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 400,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {project.description}
            </p>
            <span
              style={{
                fontSize: '14px',
                color: '#2563eb',
                fontWeight: 500,
              }}
            >
              Visit Site →
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
