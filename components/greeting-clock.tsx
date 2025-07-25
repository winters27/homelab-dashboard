"use client"

import { useState, useEffect } from "react"

export function GreetingClock() {
  const [time, setTime] = useState(new Date())
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = time.getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [time])

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">{greeting}</h1>
      <p className="mt-3 text-lg text-gray-300 sm:mt-4">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  )
}
