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
      <span style={{ display: 'block', marginBottom: '12px' }}>Hi, I'm Nurfarahana !</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>Final year Computer Science student at Taylor's University, specializing in AI and Data Science.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>I'm drawn to Machine Learning, Neural Networks, and UI/UX.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>I like building things that are both intelligent and well-designed.</span>
      <span style={{ display: 'block', marginBottom: '12px' }}>Outside of tech, I play piano, violin, and omnichord. I also enjoy theatre, video games, and anything creative.</span>
      <span style={{ display: 'block' }}>Currently open to opportunities in AI, ML, Data Science, or Frontend Development.</span>
    </p>
  );
}
