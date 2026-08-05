import React, { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((email, password) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: Math.random(),
        email,
        name: email.split('@')[0],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date(),
      })
      setIsLoading(false)
    }, 800)
  }, [])

  const signup = useCallback((email, password, name) => {
    setIsLoading(true)
    setTimeout(() => {
      setUser({
        id: Math.random(),
        email,
        name,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date(),
      })
      setIsLoading(false)
    }, 800)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setFavorites([])
  }, [])

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    )
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
    toggleFavorite,
    isFavorite,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
