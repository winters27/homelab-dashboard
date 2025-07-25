"use client"

import { useState, useEffect, useCallback } from "react"

const FAVORITES_KEY = "homelab-dashboard-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error)
      setFavorites([])
    }
  }, [])

  const toggleFavorite = useCallback((title: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(title)
        ? prevFavorites.filter((t) => t !== title)
        : [...prevFavorites, title]

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error)
      }

      return newFavorites
    })
  }, [])

  return { favorites, toggleFavorite }
}
