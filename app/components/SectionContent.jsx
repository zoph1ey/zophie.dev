'use client';

export default function SectionContent({ section, onClose }) {
  const content = {
    about: {
      title: 'About Me',
      body: 'This is the About Me section. Add your information here!'
    },
    projects: {
      title: 'Projects',
      body: 'This is the Projects section. Showcase your work here!'
    },
    contacts: {
      title: 'Contacts',
      body: 'This is the Contacts section. Add your contact information here!'
    }
  };

  const current = content[section];
  if (!current) return null;

  return (
    <div className="section-content">
      <div className="section-inner">
        <button
          onClick={onClose}
          className="close-button"
        >
          ✕ Close
        </button>
        <h1 className="section-title">{current.title}</h1>
        <p className="section-body">{current.body}</p>
      </div>
    </div>
  );
}
