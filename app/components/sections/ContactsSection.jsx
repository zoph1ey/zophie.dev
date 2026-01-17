'use client';

export default function ContactsSection({ isMobile }) {
  return (
    <div
      style={{
        fontFamily: '"Pixelify Sans", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '25px' : '50px',
      }}
    >
      <p
        style={{
          fontSize: isMobile ? '28px' : '40px',
          fontWeight: 600,
          color: '#000',
          textShadow: '2px 2px 0px rgb(255, 255, 255), -1px -1px 0px rgba(255, 255, 255, 0.8)',
          margin: 0,
        }}
      >
        Let's Connect
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '20px' : '50px',
          fontSize: isMobile ? '18px' : '30px',
        }}
      >
        <a
          href="https://www.linkedin.com/in/nurfarahanarosli/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#000',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span>LinkedIn</span>
        </a>
        <a
          href="mailto:hello.nurfarahana@gmail.com"
          style={{
            color: '#000',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span>hello.nurfarahana@gmail.com</span>
        </a>
        <a
          href="/Nurfarahana_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#000',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span>Resume</span>
        </a>
      </div>
    </div>
  );
}
