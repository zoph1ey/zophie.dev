'use client'
import DitheredBackground from './components/DitheredBackground'
import AquariumBorder from './components/AquariumBorder'

export default function Home() {  

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      {/* Dithered Background */}
      <DitheredBackground />
      
      {/* Aquarium Borders */}
      <AquariumBorder />
      
      {/* Aquarium/Porcelain Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div> 

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Character Navigation */}
        <div className="flex gap-16 items-center">
          {/* Cat Character */}
          <div className="group cursor-pointer transition-all duration-500 hover:translate-x-2">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-300 group-hover:border-blue-500 transition-all">
              <span className="text-5xl">🐱</span>
            </div>
            <p className="text-center mt-3 text-blue-800 font-medium">About Me</p>
          </div>

          {/* Goldfish Character */}
          <div className="group cursor-pointer transition-all duration-500 hover:translate-x-2">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-300 group-hover:border-blue-500 transition-all">
              <span className="text-5xl">🐟</span>
            </div>
            <p className="text-center mt-3 text-blue-800 font-medium">Projects</p>
          </div>

          {/* Contacts */}
          <div className="group cursor-pointer transition-all duration-500 hover:translate-x-2">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-300 group-hover:border-blue-500 transition-all">
              <span className="text-5xl">✉️</span>
            </div>
            <p className="text-center mt-3 text-blue-800 font-medium">Contacts</p>
          </div>
        </div>

        <p className="text-blue-600 mt-12 text-sm italic">
          Click on the characters to explore
        </p>
      </div>
    </div>
  )
}