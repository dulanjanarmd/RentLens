/**
 * RentLens API Client
 * Central Axios wrapper for all backend calls (http://localhost:8080/api).
 *
 * Usage:
 *   import api from '@/lib/api'
 *   const properties = await api.getProperties({ area: 'Malabe', maxPrice: 50000 })
 */

import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptors ──────────────────────────────────────────────────────────────

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Network error'
    console.error('[RentLens API]', message)
    return Promise.reject(new Error(message))
  }
)

// ── Properties ────────────────────────────────────────────────────────────────

/**
 * @param {Object} filters - { area, minPrice, maxPrice, bedrooms, minRating }
 * @returns {Promise<PropertyDTO[]>}
 */
export const getProperties = (filters = {}) => {
  const params = {}
  if (filters.area)      params.area      = filters.area
  if (filters.minPrice)  params.minPrice  = filters.minPrice
  if (filters.maxPrice)  params.maxPrice  = filters.maxPrice
  if (filters.bedrooms)  params.bedrooms  = filters.bedrooms
  if (filters.minRating) params.minRating = filters.minRating
  return client.get('/properties', { params })
}

/**
 * @param {number} id
 * @returns {Promise<PropertyDTO>}
 */
export const getProperty = (id) => client.get(`/properties/${id}`)

/**
 * @param {number} budget - max rent in LKR
 * @returns {Promise<PropertyDTO[]>} ranked by RVS
 */
export const getRecommendations = (budget) =>
  client.get('/properties/recommend', { params: { budget } })

/**
 * @param {number[]} ids - property IDs to compare
 * @returns {Promise<PropertyDTO[]>}
 */
export const compareProperties = (ids) =>
  client.get('/properties/compare', { params: { ids: ids.join(',') } })

/**
 * @param {PropertyDTO} data
 * @returns {Promise<PropertyDTO>}
 */
export const createProperty = (data) => client.post('/properties', data)

/**
 * @param {number} id
 * @param {PropertyDTO} data
 * @returns {Promise<PropertyDTO>}
 */
export const updateProperty = (id, data) => client.put(`/properties/${id}`, data)

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteProperty = (id) => client.delete(`/properties/${id}`)

// ── Reviews ───────────────────────────────────────────────────────────────────

/**
 * @param {number} propertyId
 * @returns {Promise<ReviewDTO[]>}
 */
export const getReviews = (propertyId) =>
  client.get(`/reviews/property/${propertyId}`)

/**
 * @param {ReviewDTO} data - { propertyId, author, rating, comment, complaintTags[] }
 * @returns {Promise<ReviewDTO>}
 */
export const createReview = (data) => client.post('/reviews', data)

// ── Analytics ─────────────────────────────────────────────────────────────────

/**
 * @returns {Promise<MarketDashboard>} - { areaStats, complaintPatterns, rvsBuckets }
 */
export const getMarketDashboard = () => client.get('/analytics/market')

// ── Default export ────────────────────────────────────────────────────────────

const api = {
  getProperties,
  getProperty,
  getRecommendations,
  compareProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviews,
  createReview,
  getMarketDashboard,
}

export default api
