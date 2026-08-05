import { useState, useEffect } from 'react'
import { getProperties, deleteProperty } from '@/lib/api'
import { Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    try {
      setIsLoading(true)
      const data = await getProperties()
      setProperties(data)
    } catch (err) {
      console.error('Failed to load properties', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }
    
    try {
      await deleteProperty(id)
      setProperties(properties.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete property.')
    }
  }

  if (isLoading) return <div>Loading properties...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Properties Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landlord</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={p.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.title}</div>
                      <div className="text-sm text-gray-500">ID: {p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  LKR {p.price?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.landlord}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/property/${p.id}`} target="_blank" className="text-primary hover:text-primary/80 mr-4 inline-flex items-center">
                    <ExternalLink className="w-4 h-4 mr-1" /> View
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No properties found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
