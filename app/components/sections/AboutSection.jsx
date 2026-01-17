'use client';

export default function AboutSection({ isMobile }) {
  return (
    <p
      style={{
        fontFamily: '"Pixelify Sans", sans-serif',
        fontSize: isMobile ? '16px' : '20px',
        fontWeight: 400,
        color: '#000',
        lineHeight: 1.6,
      }}
    >
      <span style={{ display: 'block', marginBottom: '12px' }}>Hi, I’m Nurfarahana ! Most people call me Zophie too.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>Final year Computer Science student at Taylor's University, specializing in AI and Data Science.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>I have a soft spot for Machine Learning and well-designed interfaces.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>When I'm not on my computer, I’m probably playing the omnichord.</span>
      <span style={{ display: 'block' }}>Open to internships in AI, ML, or Software Development.</span>
    </p>
  );
}
