import { useState } from 'react'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

import { useAppNavigation } from '@/hooks/useAppNavigation';

export default function Login() {
  const onNavigate = useAppNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    const res = await login(email, password)
    if (res.success) {
      onNavigate('home')
    } else {
      setError(res.error || 'Failed to login')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/30 z-10" />
        <img 
          src="/hero-bg.png" 
          alt="Luxury modern apartment" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-end p-12 w-full text-white bg-gradient-to-t from-slate-950/90 to-transparent">
          <div className="mb-8 max-w-md">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Welcome to RentLens</h2>
            <p className="text-lg text-slate-200 drop-shadow-md">
              Bringing transparency, data, and trust to the Sri Lankan rental market. Find your perfect home with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 pt-32 pb-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-3">
              Sign in to your RentLens account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-primary font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
