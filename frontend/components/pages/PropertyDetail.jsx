import { Star, MapPin, Phone, DollarSign, Home, BedDouble, Waves, Share2, Heart, MapPinIcon, Image, Video } from 'lucide-react'
import { useState } from 'react'
import { mockProperties, complaintTags } from '@/lib/mockData'
import ReviewCard from '@/components/ReviewCard'
import PropertyGallery from '@/components/PropertyGallery'
import VirtualTour from '@/components/VirtualTour'
import RiskAnalyzer from '@/components/RiskAnalyzer'
import { useAuth } from '@/hooks/useAuth'

export default function PropertyDetail({ id, onNavigate }) {
  const [isSaved, setIsSaved] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const { toggleFavorite, isFavorite } = useAuth()

  const favorite = isFavorite(parseInt(id))

  const property = mockProperties.find((p) => p.id === parseInt(id))

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property not found</h1>
          <button onClick={() => onNavigate('listings')} className="btn-primary">
            Back to Listings
          </button>
        </div>
      </div>
    )
  }

  const getComplaintLabel = (tag) => {
    return complaintTags.find((t) => t.value === tag)?.label || tag
  }

  const reviews = [
    {
      id: 1,
      author: 'Ahmed Hassan',
      rating: 4,
      text: 'Great location and friendly landlord. Had minor water issues but resolved quickly.',
      tags: ['water_issues'],
      date: '2 weeks ago'
    },
    {
      id: 2,
      author: 'Priya Kumari',
      rating: 5,
      text: 'Excellent apartment with all facilities. Highly recommended!',
      tags: [],
      date: '1 month ago'
    },
    {
      id: 3,
      author: 'John Silva',
      rating: 3,
      text: 'Good place but can be noisy during weekends.',
      tags: ['noise'],
      date: '6 weeks ago'
    }
  ]

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      {showGallery && <PropertyGallery propertyId={id} propertyTitle={property.title} onClose={() => setShowGallery(false)} />}
      {showTour && <VirtualTour propertyTitle={property.title} onClose={() => setShowTour(false)} />}
      
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('listings')}
          className="mb-6 text-primary hover:text-primary/80 font-medium"
        >
          ← Back to Listings
        </button>

        {/* Header with Title and Actions */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {property.area}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(parseInt(id))}
              className={`p-3 rounded-lg border transition-colors ${
                favorite
                  ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-800'
                  : 'bg-card border-border text-foreground hover:bg-secondary'
              }`}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className="w-5 h-5" fill={favorite ? 'currentColor' : 'none'} />
            </button>
            <button className="p-3 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image with Gallery/Tour Buttons */}
        <div className="mb-8 relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg border border-border"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setShowGallery(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Image className="w-5 h-5" />
              Gallery
            </button>
            <button
              onClick={() => setShowTour(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Video className="w-5 h-5" />
              Virtual Tour
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price and Key Info */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-6">
                LKR {property.price.toLocaleString()}
                <span className="text-sm text-muted-foreground font-normal"> /month</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold text-foreground">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold text-foreground">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Square Feet</p>
                    <p className="font-semibold text-foreground">{property.squareFeet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold text-foreground">{property.distance} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-3">About This Property</h2>
              <p className="text-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 p-3 bg-secondary rounded-lg text-foreground"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            {/* Complaints & Issues */}
            {property.complaints && property.complaints.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                <h2 className="text-lg font-bold text-orange-900 mb-3">⚠️ Reported Issues</h2>
                <p className="text-sm text-orange-800 mb-3">
                  {property.complaintCount} complaint{property.complaintCount !== 1 ? 's' : ''} reported by tenants
                </p>
                <div className="flex flex-wrap gap-2">
                  {property.complaints.map((complaint) => {
                    const tag = complaintTags.find((t) => t.value === complaint)
                    return (
                      <span
                        key={complaint}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${tag?.color}`}
                      >
                        {getComplaintLabel(complaint)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Risk Analysis */}
            <RiskAnalyzer property={property} />

            {/* Reviews */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Tenant Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Quick Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Rental Value Score */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-2">Rental Value Score</p>
              <div className="text-4xl font-bold text-green-600 mb-2">{property.rentValueScore}</div>
              <p className="text-xs text-green-800">
                Excellent value based on price, location, and reviews
              </p>
            </div>

            {/* Rating */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">{property.rating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {property.reviews} reviews
              </p>
            </div>

            {/* Landlord Contact */}
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Landlord Information</h3>
              <p className="text-sm text-foreground mb-2">{property.landlord}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Posted on {new Date(property.postedDate).toLocaleDateString()}
              </p>
              <button className="w-full btn-primary justify-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                {property.phone}
              </button>
            </div>

            {/* Compare Button */}
            <button
              onClick={() => onNavigate('comparison')}
              className="w-full btn-secondary justify-center"
            >
              Add to Comparison
            </button>

            {/* Report Button */}
            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Report Property
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
