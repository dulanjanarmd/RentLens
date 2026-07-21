import { Star, MapPin, DollarSign, Home, BedDouble, Waves, CheckCircle, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function PropertyCard({ property, onClick }) {
  const { toggleFavorite, isFavorite } = useAuth()
  const favorite = isFavorite(property.id)
  const getRVSColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="card-hover bg-card rounded-lg overflow-hidden border border-border">
      {/* Image */}
      <div className="relative overflow-hidden bg-muted h-48 cursor-pointer" onClick={onClick}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {property.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(property.id)
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all"
        >
          <Heart
            className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
        {/* RVS Badge */}
        <div className={`absolute top-3 left-3 ${getRVSColor(property.rentValueScore)} rounded-lg px-3 py-1 font-bold text-sm`}>
          RVS: {property.rentValueScore}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 cursor-pointer" onClick={onClick}>
        {/* Title and Area */}
        <div>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {property.area}
          </div>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-primary">
          LKR {property.price.toLocaleString()}
          <span className="text-sm text-muted-foreground font-normal"> /month</span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-foreground">
            <BedDouble className="w-4 h-4 text-muted-foreground" />
            {property.bedrooms} BR
          </div>
          <div className="flex items-center gap-1 text-foreground">
            <Waves className="w-4 h-4 text-muted-foreground" />
            {property.bathrooms} BA
          </div>
          <div className="flex items-center gap-1 text-foreground">
            <Home className="w-4 h-4 text-muted-foreground" />
            {property.squareFeet} sqft
          </div>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1">
          {property.facilities.slice(0, 2).map((facility) => (
            <span
              key={facility}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
            >
              {facility}
            </span>
          ))}
          {property.facilities.length > 2 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              +{property.facilities.length - 2} more
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{property.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({property.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Complaint Warning */}
        {property.complaintCount > 0 && (
          <div className="text-xs bg-orange-50 border border-orange-200 text-orange-800 px-2 py-1 rounded">
            ⚠️ {property.complaintCount} complaints reported
          </div>
        )}
      </div>
    </div>
  )
}
