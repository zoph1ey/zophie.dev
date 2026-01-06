'use client'
import { useState } from 'react'
import DitheredBackground from './components/DitheredBackground'
import AquariumBorder from './components/AquariumBorder'
import TreasureChest from './components/TreasureChest'
import SectionContent from './components/SectionContent'

export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // 'about', 'projects', 'contacts', or null
  const [selectedTreasure, setSelectedTreasure] = useState(null); // Track which treasure was clicked
  const [isReturning, setIsReturning] = useState(false); // Track if we're returning to home

  const handleSectionChange = (sectionId) => {
    // Turn off toggle if it's on before sliding to treasure page
    if (isOn) {
      setIsOn(false);
    }
    setActiveSection(sectionId);
    setSelectedTreasure(sectionId);
    setIsReturning(false);
  };

  const handleCloseSection = () => {
    setIsReturning(true);
    setActiveSection(null);
    setSelectedTreasure(null);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      {/* Dithered Background with pixel art fish */}
      <DitheredBackground isOn={isOn} activeSection={activeSection} isReturning={isReturning} onReturnComplete={() => setIsReturning(false)} />

      {/* Section Content - slides in from right */}
      {activeSection && (
        <SectionContent section={activeSection} onClose={handleCloseSection} />
      )}

      {/* Treasure Chest Navigation */}
      <TreasureChest onSectionChange={handleSectionChange} selectedTreasure={selectedTreasure} onBack={handleCloseSection} />

      {/* Aquarium Borders - pass the state */}
      <AquariumBorder isOn={isOn} setIsOn={setIsOn} disabled={selectedTreasure !== null} />
    </div>
  )
}