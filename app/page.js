'use client'
import { useState } from 'react'
import DitheredBackground from './components/DitheredBackground'
import AquariumBorder from './components/AquariumBorder'
import TreasureChest from './components/TreasureChest'

export default function Home() {  
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      {/* Dithered Background with pixel art fish */}
      <DitheredBackground isOn={isOn} />

      {/* Treasure Chest Navigation */}
      <TreasureChest />

      {/* Aquarium Borders - pass the state */}
      <AquariumBorder isOn={isOn} setIsOn={setIsOn} />
    </div>
  )
}