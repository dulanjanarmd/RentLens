import React, { useState, useEffect } from 'react'
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useParams } from 'react-router-dom'

export default function BlogPostView() {
  const onNavigate = useAppNavigation()
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Invalid blog ID')
      setLoading(false)
      return
    }

    const fetchBlog = async () => {
      try {
        const data = await api.getBlog(id)
        setBlog(data)
      } catch (err) {
        console.error(err)
        setError('Blog post not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h2 className="text-2xl font-bold text-foreground">{error || 'Post not found'}</h2>
        <button onClick={() => onNavigate('blog')} className="btn-secondary">Back to Blog</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => onNavigate('blog')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
            <span className="flex items-center gap-2"><User className="w-5 h-5"/> {blog.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5"/> {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {blog.imageUrl && (
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-muted mb-12 shadow-md">
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold">
          {/* Simple new-line to paragraph formatting since it's just raw text */}
          {blog.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6">{paragraph}</p>
          ))}
        </div>

      </div>
    </div>
  )
}
