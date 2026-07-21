import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'

export default function VirtualTour({ propertyTitle, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const rooms = [
    {
      name: 'Living Room',
      description: 'Spacious living area with natural lighting and modern furnishings',
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      duration: 45,
    },
    {
      name: 'Bedroom',
      description: 'Comfortable master bedroom with ensuite bathroom',
      thumbnail: 'https://images.unsplash.com/photo-1565182999555-efedd8e8f5be?w=400&h=300&fit=crop',
      duration: 35,
    },
    {
      name: 'Kitchen',
      description: 'Fully equipped modern kitchen with appliances',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      duration: 50,
    },
    {
      name: 'Bathroom',
      description: 'Modern bathroom with hot water and shower facilities',
      thumbnail: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
      duration: 25,
    },
    {
      name: 'Balcony',
      description: 'Scenic balcony with city views',
      thumbnail: 'https://images.unsplash.com/photo-1529911917265-472419300187?w=400&h=300&fit=crop',
      duration: 30,
    },
  ]

  const currentRoom = rooms[currentRoomIndex]
  const totalDuration = rooms.reduce((sum, room) => sum + room.duration, 0)

  const handleNext = () => {
    setCurrentRoomIndex((prev) => (prev + 1) % rooms.length)
  }

  const handlePrev = () => {
    setCurrentRoomIndex((prev) => (prev - 1 + rooms.length) % rooms.length)
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black/80 to-black flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Tour Container */}
      <div className="w-full max-w-2xl">
        {/* Main Viewer */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-6">
          <img
            src={currentRoom.thumbnail}
            alt={currentRoom.name}
            className="w-full h-96 object-cover"
          />

          {/* Play Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                onClick={() => setIsPlaying(true)}
                className="p-4 bg-primary hover:bg-primary/90 rounded-full transition-colors"
              >
                <Play className="w-8 h-8 text-white fill-white" />
              </button>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="space-y-2">
              {/* Progress Bar */}
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${isPlaying ? 50 : 0}%` }}
                />
              </div>

              {/* Room Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{currentRoom.name}</p>
                  <p className="text-white/70 text-sm">{currentRoom.description}</p>
                </div>
                <p className="text-white/70 text-sm">{currentRoom.duration}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-4 space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Previous room"
            >
              <SkipBack className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Next room"
            >
              <SkipForward className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex-1" />

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Room Selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Room {currentRoomIndex + 1} of {rooms.length}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {rooms.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentRoomIndex(idx)}
                  className={`group relative overflow-hidden rounded-lg transition-all ${
                    idx === currentRoomIndex ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                >
                  <img
                    src={room.thumbnail}
                    alt={room.name}
                    className="w-full h-16 object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <p className="text-white text-xs font-medium text-center px-1">
                      {room.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Total Duration */}
          <div className="text-center text-sm text-muted-foreground">
            Total tour duration: {Math.round(totalDuration / 60)}m {totalDuration % 60}s
          </div>
        </div>
      </div>
    </div>
  )
}
