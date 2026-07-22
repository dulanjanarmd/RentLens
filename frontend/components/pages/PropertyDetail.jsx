import {
  Star, MapPin, Phone, Home, BedDouble, Waves, Share2, Heart,
  MapPinIcon, Image, Video, Loader2, AlertCircle, CheckCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProperty, getReviews, createReview } from '@/lib/api'
import ReviewCard from '@/components/ReviewCard'
import PropertyGallery from '@/components/PropertyGallery'
import VirtualTour from '@/components/VirtualTour'
import RiskAnalyzer from '@/components/RiskAnalyzer'
import { useAuth } from '@/hooks/useAuth'

const complaintTagLabels = {
  water_issues:          'Water Issues',
  noise:                 'Noise',
  maintenance_delays:    'Maintenance Delays',
  landlord_unresponsive: 'Unresponsive Landlord',
  overcrowding:          'Overcrowding',
  power_issues:          'Power Issues',
}

const tagColors = {
  water_issues:          'bg-blue-100 text-blue-800',
  noise:                 'bg-yellow-100 text-yellow-800',
  maintenance_delays:    'bg-orange-100 text-orange-800',
  landlord_unresponsive: 'bg-red-100 text-red-800',
  overcrowding:          'bg-purple-100 text-purple-800',
  power_issues:          'bg-pink-100 text-pink-800',
}

const RVS_BADGE = {
  green: 'bg-green-100 border-green-200 text-green-700',
  amber: 'bg-amber-100 border-amber-200 text-amber-700',
  red:   'bg-red-100 border-red-200 text-red-700',
}

export default function PropertyDetail({ id, onNavigate }) {
  const [property, setProperty]     = useState(null)
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [showGallery, setShowGallery] = useState(false)
  const [showTour, setShowTour]     = useState(false)

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewAuthor, setReviewAuthor]     = useState('')
  const [reviewRating, setReviewRating]     = useState(5)
  const [reviewComment, setReviewComment]   = useState('')
  const [reviewTags, setReviewTags]         = useState([])
  const [submitting, setSubmitting]         = useState(false)
  const [submitted, setSubmitted]           = useState(false)

  const { toggleFavorite, isFavorite } = useAuth()
  const favorite = isFavorite(parseInt(id))

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getProperty(id),
      getReviews(id),
    ])
      .then(([prop, revs]) => {
        setProperty(prop)
        setReviews(revs)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewAuthor.trim() || !reviewComment.trim()) return
    setSubmitting(true)
    try {
      const newReview = await createReview({
        propertyId: parseInt(id),
        author: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
        complaintTags: reviewTags,
      })
      setReviews([newReview, ...reviews])
      setSubmitted(true)
      setShowReviewForm(false)
      // Refresh property to get updated rating
      getProperty(id).then(setProperty)
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (tag) => {
    setReviewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading property...</span>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error ? 'Connection Error' : 'Property not found'}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <button onClick={() => onNavigate('listings')} className="btn-primary">
            Back to Listings
          </button>
        </div>
      </div>
    )
  }

  const badge = property.badge || 'amber'
  const badgeClass = RVS_BADGE[badge]

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      {showGallery && (
        <PropertyGallery propertyId={id} propertyTitle={property.title} onClose={() => setShowGallery(false)} />
      )}
      {showTour && (
        <VirtualTour propertyTitle={property.title} onClose={() => setShowTour(false)} />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => onNavigate('listings')}
          className="mb-6 text-primary hover:text-primary/80 font-medium"
        >
          ← Back to Listings
        </button>

        {/* Header */}
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

        {/* Main Image */}
        <div className="mb-8 relative">
          <img
            src={property.imageUrl}
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
            {/* Price & Key Info */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-6">
                LKR {property.price?.toLocaleString()}
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
            {property.facilities?.length > 0 && (
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
            )}

            {/* RVS Sub-score Breakdown */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Value Score Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: 'Price Score (35%)',    value: property.priceScore,    color: 'bg-blue-500' },
                  { label: 'Distance Score (25%)', value: property.distanceScore, color: 'bg-green-500' },
                  { label: 'Facility Score (20%)', value: property.facilityScore, color: 'bg-purple-500' },
                  { label: 'Review Score (20%)',   value: property.reviewScore,   color: 'bg-amber-500' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{value?.toFixed(1) ?? '—'}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-700`}
                        style={{ width: `${value ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Analyzer */}
            <RiskAnalyzer property={{ ...property, complaints: [], complaintCount: 0 }} />

            {/* Reviews */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Tenant Reviews ({reviews.length})
                </h2>
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-secondary rounded-lg border border-border space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="input-field"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${
                            star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Complaint Tags (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(complaintTagLabels).map(([value, label]) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => toggleTag(value)}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                            reviewTags.includes(value)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border text-foreground hover:bg-secondary'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {submitted && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Review submitted! The property's rating has been updated.
                </div>
              )}

              <div className="space-y-4">
                {reviews.length > 0
                  ? reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={{
                          ...review,
                          text: review.comment,
                          tags: review.complaintTags || [],
                          date: review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : '',
                        }}
                      />
                    ))
                  : (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                      No reviews yet — be the first to review this property!
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Rental Value Score */}
            <div className={`border p-6 rounded-lg ${badgeClass}`}>
              <p className="text-sm font-medium mb-2">Rental Value Score</p>
              <div className="text-4xl font-bold mb-2">{property.rentValueScore?.toFixed(1)}</div>
              <p className="text-xs">
                {badge === 'green'
                  ? '✅ Excellent value based on price, location, and reviews'
                  : badge === 'amber'
                  ? '⚠️ Average value — compare carefully'
                  : '🔴 Below-average value for this price point'}
              </p>
            </div>

            {/* Rating */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">
                  {property.rating?.toFixed(1) ?? '—'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {property.reviewCount ?? 0} reviews
              </p>
            </div>

            {/* Landlord */}
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Landlord Information</h3>
              <p className="text-sm text-foreground mb-2">{property.landlord}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {property.verified ? '✅ Verified listing' : 'Unverified listing'}
                {property.postedDate && ` — posted ${new Date(property.postedDate).toLocaleDateString()}`}
              </p>
              <a
                href={`tel:${property.phone}`}
                className="w-full btn-primary flex items-center justify-center gap-2 mb-2"
              >
                <Phone className="w-4 h-4" />
                {property.phone}
              </a>
            </div>

            {/* Compare */}
            <button
              onClick={() => onNavigate('comparison')}
              className="w-full btn-secondary justify-center"
            >
              Add to Comparison
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
