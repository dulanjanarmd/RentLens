import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Minimize, Maximize } from 'lucide-react'

export default function PropertyGallery({ propertyId, propertyTitle, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const images = [
    `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1565182999555-efedd8e8f5be?w=1200&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1562159278-8f55a30e5ce2?w=1200&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop`,
  ]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center ${
        isFullscreen ? 'fullscreen' : ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        {isFullscreen ? (
          <Minimize className="w-6 h-6 text-white" />
        ) : (
          <Maximize className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Main Image Container */}
      <div className="relative w-full max-w-4xl h-full md:h-auto flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`${propertyTitle} - Image ${currentIndex + 1}`}
          className="w-full h-full md:h-auto md:max-h-96 object-cover rounded-lg"
        />

        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto pb-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-primary scale-110' : 'border-white/30'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
