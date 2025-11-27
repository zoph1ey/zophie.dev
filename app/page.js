'use client'
import DitheredBackground from './components/DitheredBackground'
import AquariumBorder from './components/AquariumBorder'
import TreasureChest from './components/TreasureChest'

export default function Home() {  

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      {/* Dithered Background */}
      <DitheredBackground />
      
      {/* Treasure Chest Navigation */}
      <TreasureChest />
      
      {/* Aquarium Borders */}
      <AquariumBorder />
    </div>
  )
}