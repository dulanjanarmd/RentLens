import React, { createContext, useState, useCallback, useEffect } from 'react'
import { loginUser, registerUser, deleteAccount } from '@/lib/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rentlens_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    const storedFavorites = localStorage.getItem('rentlens_favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const userData = await loginUser({ email, password })
      setUser(userData)
      localStorage.setItem('rentlens_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data || err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email, password, name) => {
    setIsLoading(true)
    try {
      const userData = await registerUser({ email, password, name })
      setUser(userData)
      localStorage.setItem('rentlens_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data || err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setFavorites([])
    localStorage.removeItem('rentlens_user')
    localStorage.removeItem('rentlens_favorites')
  }, [])

  const removeAccount = useCallback(async () => {
    if (!user) return
    try {
      await deleteAccount(user.id)
      logout()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data || err.message }
    }
  }, [user, logout])

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) => {
      const updated = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
      localStorage.setItem('rentlens_favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback((propertyId) => {
    return favorites.includes(propertyId)
  }, [favorites])

  const value = {
    user,
    favorites,
    isLoading,
    login,
    signup,
    logout,
    removeAccount,
    toggleFavorite,
    isFavorite,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
