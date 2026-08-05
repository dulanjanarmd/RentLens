import { useState, useEffect } from 'react'
import { getAllInquiries, deleteInquiry } from '@/lib/api'
import { Trash2, ExternalLink, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInquiries()
  }, [])

  async function loadInquiries() {
    try {
      setIsLoading(true)
      const data = await getAllInquiries()
      setInquiries(data)
    } catch (err) {
      console.error('Failed to load inquiries', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return
    }
    
    try {
      await deleteInquiry(id)
      setInquiries(inquiries.filter(i => i.id !== id))
    } catch (err) {
      alert('Failed to delete inquiry.')
    }
  }

  if (isLoading) return <div>Loading inquiries...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inquiries Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((i) => (
              <tr key={i.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(i.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/property/${i.propertyId}`} target="_blank" className="text-primary hover:underline flex items-center">
                    {i.propertyTitle || `Prop #${i.propertyId}`} <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{i.senderName}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {i.senderEmail}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs" title={i.message}>
                  <div className="line-clamp-2">
                    {i.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`mailto:${i.senderEmail}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center mr-4">
                    Reply
                  </a>
                  <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
