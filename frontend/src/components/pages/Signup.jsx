import { useState } from 'react'
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppNavigation } from '@/hooks/useAppNavigation'

export default function Signup() {
  const onNavigate = useAppNavigation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const { signup, isLoading } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required'
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const res = await signup(formData.email, formData.password, formData.name)
    if (res.success) {
      onNavigate('home')
    } else {
      setApiError(res.error || 'Failed to create account')
    }
  }

  const passwordStrength = formData.password.length > 0 ? Math.min(100, formData.password.length * 15) : 0

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
            <h2 className="text-4xl font-bold mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Join the Future</h2>
            <p className="text-lg text-slate-200 drop-shadow-md">
              Create an account and start discovering the most exclusive rentals in Sri Lanka today.
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
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create Account</h1>
            <p className="text-muted-foreground mt-3">
              Join RentLens and find your perfect home
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
                {apiError}
              </div>
            )}
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Fair' : 'Strong'} password
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
