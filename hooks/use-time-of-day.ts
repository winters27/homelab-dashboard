"use client"

import { useState, useEffect } from "react"

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("night")

  useEffect(() => {
    const getHour = () => new Date().getHours()
    const hour = getHour()

    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning")
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay("afternoon")
    } else if (hour >= 18 && hour < 21) {
      setTimeOfDay("evening")
    } else {
      setTimeOfDay("night")
    }
  }, [])

  return timeOfDay
}
