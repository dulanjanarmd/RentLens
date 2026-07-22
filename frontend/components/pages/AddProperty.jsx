import { useState } from 'react'
import { Camera, FileUp, Building, MapPin, DollarSign, User, Phone, CheckCircle2 } from 'lucide-react'

export default function AddProperty({ onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    distance: '',
    facilities: '',
    landlord: '',
    phone: '',
    description: ''
  })
  
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let imageUrl = ''
      
      // 1. Upload File
      if (file) {
        const uploadData = new FormData()
        uploadData.append('file', file)
        
        const uploadRes = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          body: uploadData
        })
        
        if (!uploadRes.ok) throw new Error('Failed to upload file')
        
        const uploadResult = await uploadRes.json()
        imageUrl = uploadResult.fileUrl
      }

      // 2. Create Property
      const propertyPayload = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        facilitiesList: formData.facilities.split(',').map(f => f.trim()),
        imageUrl: imageUrl
      }

      const propRes = await fetch('http://localhost:8080/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyPayload)
      })

      if (!propRes.ok) throw new Error('Failed to create property')

      setSuccess(true)
      setTimeout(() => {
        onNavigate('home')
      }, 2000)

    } catch (err) {
      console.error(err)
      setError(err.message || 'An error occurred while creating the property')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl border border-border shadow-lg">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Listed Successfully!</h2>
          <p className="text-muted-foreground">Redirecting you to the home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <Building className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">List a New Property</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Property Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Modern Apartment in Malabe" />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Area *
              </label>
              <input required type="text" name="area" value={formData.area} onChange={handleChange} className="input-field" placeholder="e.g. Malabe" />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Rent per Month (LKR) *
              </label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" placeholder="e.g. 45000" min="1000" />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bedrooms *</label>
              <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="input-field" placeholder="e.g. 2" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bathrooms *</label>
              <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="input-field" placeholder="e.g. 1" min="1" />
            </div>

            {/* SqFt & Distance */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Square Feet</label>
              <input type="number" name="squareFeet" value={formData.squareFeet} onChange={handleChange} className="input-field" placeholder="e.g. 850" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Distance to Hub (km)</label>
              <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} className="input-field" placeholder="e.g. 2.5" />
            </div>

            {/* Landlord Info */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Landlord Name *
              </label>
              <input required type="text" name="landlord" value={formData.landlord} onChange={handleChange} className="input-field" placeholder="e.g. John Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number *
              </label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="e.g. +94 70 123 4567" />
            </div>

            {/* Facilities */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Facilities (comma separated)</label>
              <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="input-field" placeholder="e.g. WiFi, Parking, AC" />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" placeholder="Describe the property..."></textarea>
            </div>

            {/* File Upload */}
            <div className="col-span-1 md:col-span-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
              <input type="file" id="fileUpload" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
              <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                {file ? (
                  <>
                    <FileUp className="w-12 h-12 text-primary mb-4" />
                    <span className="font-medium text-foreground">{file.name}</span>
                    <span className="text-sm text-muted-foreground mt-1">Click to change file</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                    <span className="font-medium text-foreground">Upload Property Photo or Document</span>
                    <span className="text-sm text-muted-foreground mt-1">JPEG, PNG, or PDF up to 10MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <button type="button" onClick={() => onNavigate('home')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[150px]">
              {loading ? 'Submitting...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
