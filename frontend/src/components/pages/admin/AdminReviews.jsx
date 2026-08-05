import { useState, useEffect } from 'react'
import { getAllReviews, deleteReview, getProperty } from '@/lib/api'
import { Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      setIsLoading(true)
      const data = await getAllReviews()
      
      // Optionally fetch property details for each review, but to keep it simple, 
      // we'll just show the Property ID since we might not have all property titles in a single call.
      setReviews(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (err) {
      console.error('Failed to load reviews', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }
    
    try {
      await deleteReview(id)
      setReviews(reviews.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete review.')
    }
  }

  if (isLoading) return <div>Loading reviews...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reviews Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/property/${r.propertyId}`} target="_blank" className="text-primary hover:underline flex items-center">
                    Prop #{r.propertyId} <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {r.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {r.rating} / 5
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.comment}>
                  {r.comment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
