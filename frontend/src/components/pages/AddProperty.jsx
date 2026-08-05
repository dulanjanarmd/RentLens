import { useState } from 'react'
import { Camera, FileUp, Building, MapPin, DollarSign, User, Phone, CheckCircle2, X } from 'lucide-react'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return position ? <Marker position={position} icon={markerIcon} /> : null
}

export default function AddProperty() {
  const onNavigate = useAppNavigation()
  const [formData, setFormData] = useState({
    title: '', area: '', price: '', bedrooms: '', bathrooms: '', squareFeet: '', distance: '', facilities: '',
    landlord: '', phone: '', description: '',
    propertyType: 'Apartment', furnished: false, availableFrom: '',
    latitude: 6.9271, longitude: 79.8612
  })
  
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let uploadedUrls = []
      
      // Upload all files
      if (files.length > 0) {
        for (const file of files) {
          const uploadData = new FormData()
          uploadData.append('file', file)
          
          const uploadRes = await fetch('http://localhost:8080/api/files/upload', {
            method: 'POST',
            body: uploadData
          })
          if (!uploadRes.ok) throw new Error('Failed to upload a file')
          
          const uploadResult = await uploadRes.json()
          uploadedUrls.push(uploadResult.fileUrl)
        }
      }

      // Map payload
      const propertyPayload = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()) : [],
        imageUrl: uploadedUrls.length > 0 ? uploadedUrls[0] : '',
        galleryUrls: uploadedUrls.length > 1 ? uploadedUrls.slice(1) : []
      }

      const propRes = await fetch('http://localhost:8080/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyPayload)
      })

      if (!propRes.ok) throw new Error('Failed to create property')

      setSuccess(true)
      setTimeout(() => onNavigate('home'), 2000)

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
      <div className="max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">List a New Property</h1>
            <p className="text-muted-foreground mt-1">Fill out the details below to publish your rental listing</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-2">
            <X className="w-5 h-5" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Basic Info */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground border-l-4 border-primary pl-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Property Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Modern Apartment in Malabe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="input-field">
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Room">Room</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Rent per Month (LKR) *
                </label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" placeholder="e.g. 45000" min="1000" />
              </div>
            </div>
          </section>

          {/* Section 2: Location Map */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground border-l-4 border-primary pl-3">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Area / City *
                </label>
                <input required type="text" name="area" value={formData.area} onChange={handleChange} className="input-field" placeholder="e.g. Malabe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Distance to nearest Hub/Uni (km)</label>
                <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} className="input-field" placeholder="e.g. 2.5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Click on the map to pin the exact location of the property:</p>
            <div className="h-64 bg-muted rounded-lg overflow-hidden border border-border z-0">
              <MapContainer center={[6.9271, 79.8612]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker 
                  position={[formData.latitude, formData.longitude]} 
                  setPosition={(pos) => setFormData(prev => ({...prev, latitude: pos[0], longitude: pos[1]}))} 
                />
              </MapContainer>
            </div>
          </section>

          {/* Section 3: Details */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground border-l-4 border-primary pl-3">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bedrooms *</label>
                <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="input-field" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bathrooms *</label>
                <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="input-field" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Square Feet</label>
                <input type="number" name="squareFeet" value={formData.squareFeet} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Available From</label>
                <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex items-center mt-6">
                <input type="checkbox" id="furnished" name="furnished" checked={formData.furnished} onChange={handleChange} className="w-5 h-5 text-primary rounded border-border focus:ring-primary" />
                <label htmlFor="furnished" className="ml-2 text-sm font-medium text-foreground">Fully Furnished</label>
              </div>
              <div className="col-span-1 md:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">Facilities (comma separated)</label>
                <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="input-field" placeholder="e.g. WiFi, Parking, AC, Pool" />
              </div>
              <div className="col-span-1 md:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[120px]" placeholder="Describe the property's best features..."></textarea>
              </div>
            </div>
          </section>

          {/* Section 4: Contact Info */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground border-l-4 border-primary pl-3">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </section>

          {/* Section 5: Media & Virtual Tour */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground border-l-4 border-primary pl-3">Virtual Tour & Photos</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload multiple photos. The first photo will be your main cover image. Additional photos will create a beautiful gallery for users to explore.</p>
            
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors bg-secondary/5">
              <input type="file" id="fileUpload" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
              <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="font-medium text-foreground">Click to upload photos</span>
                <span className="text-sm text-muted-foreground mt-1">Select multiple files (JPEG, PNG)</span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((f, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-video">
                    <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeFile(idx)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-medium">Cover</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-border sticky bottom-0 bg-card py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 px-4 -mx-4">
            <button type="button" onClick={() => onNavigate('home')} className="btn-secondary px-8">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? 'Uploading & Listing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
