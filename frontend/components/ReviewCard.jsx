import { Star } from 'lucide-react'
import { complaintTags } from '@/lib/mockData'

export default function ReviewCard({ review }) {
  return (
    <div className="border-b border-border pb-4 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-foreground">{review.author}</h4>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground mb-3">{review.text}</p>
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => {
            const tagData = complaintTags.find((t) => t.value === tag)
            return (
              <span key={tag} className={`text-xs px-2 py-1 rounded-full font-medium ${tagData?.color}`}>
                {tagData?.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
