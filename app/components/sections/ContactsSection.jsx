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
          <svg
            width={isMobile ? 22 : 28}
            height={isMobile ? 22 : 28}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
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
          <svg
            width={isMobile ? 22 : 28}
            height={isMobile ? 22 : 28}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
          </svg>
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
          <svg
            width={isMobile ? 22 : 28}
            height={isMobile ? 22 : 28}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2z"/>
          </svg>
          <span>Resume</span>
        </a>
      </div>
    </div>
  );
}
