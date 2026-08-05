import React, { useState, useEffect } from 'react'
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAppNavigation } from '@/hooks/useAppNavigation'

export default function BlogList() {
  const onNavigate = useAppNavigation()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs()
        setBlogs(data)
      } catch (err) {
        console.error('Failed to load blogs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">RentLens Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights, tips, and market analysis for the modern Sri Lankan renter and landlord.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <h2 className="text-2xl font-bold text-muted-foreground">No posts published yet.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <div 
                key={blog.id}
                onClick={() => onNavigate(`blog/${blog.id}`)}
                className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  {blog.imageUrl ? (
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4"/> {blog.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
