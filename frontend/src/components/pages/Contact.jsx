import React, { useState } from 'react'
import { Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function Contact() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      await api.createInquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'NEW'
      })
      setStatus('success')
      setFormData({ ...formData, subject: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Failed to send message.')
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, feedback, or need help with a listing? Our team is here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Email Us</h3>
                <p className="text-muted-foreground text-sm">support@rentlens.lk</p>
              </div>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Call Us</h3>
                <p className="text-muted-foreground text-sm">+94 11 234 5678</p>
              </div>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Visit Us</h3>
                <p className="text-muted-foreground text-sm">123 Tech Avenue, Colombo 03, Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-8">Send a Message</h2>
              
              {status === 'success' ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Message Sent!</h3>
                  <p className="text-emerald-600 dark:text-emerald-400">Thanks for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-medium text-primary hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field" 
                      placeholder="How can we help you?" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none" 
                      placeholder="Your message here..." 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full btn-primary py-4 flex justify-center items-center gap-2 text-lg disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
