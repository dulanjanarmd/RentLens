import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import api from '@/lib/api'

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    imageUrl: ''
  })
  const [actionLoading, setActionLoading] = useState(false)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const data = await api.getBlogs()
      setBlogs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        author: blog.author,
        imageUrl: blog.imageUrl || ''
      })
    } else {
      setEditingBlog(null)
      setFormData({ title: '', content: '', excerpt: '', author: '', imageUrl: '' })
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await api.deleteBlog(id)
      fetchBlogs()
    } catch (err) {
      alert('Failed to delete blog.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      if (editingBlog) {
        await api.updateBlog(editingBlog.id, formData)
      } else {
        await api.createBlog(formData)
      }
      setShowModal(false)
      fetchBlogs()
    } catch (err) {
      alert('Failed to save blog post.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Blog Posts</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{blog.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{blog.author}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(blog)} className="text-blue-500 hover:text-blue-600 p-2">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-600 p-2 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-foreground">
                {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title *</label>
                  <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Author *</label>
                  <input required className="input-field" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Image URL</label>
                <input className="input-field" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Excerpt (Short Summary)</label>
                <textarea rows="2" className="input-field resize-none" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content *</label>
                <textarea required rows="10" className="input-field" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={actionLoading} className="btn-primary min-w-[120px]">
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
