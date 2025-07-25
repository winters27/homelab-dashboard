"use client"

import { useState, useEffect } from "react"

export type StatusValue = "loading" | "online" | "offline"

export interface ServiceStatus {
  status: StatusValue
  latency: number | null
}

async function checkServiceStatus(url: string): Promise<ServiceStatus> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)
  const startTime = performance.now()

  try {
    // Try a HEAD request first for speed
    await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      mode: "no-cors",
    })
    const endTime = performance.now()
    clearTimeout(timeoutId)
    return { status: "online", latency: Math.round(endTime - startTime) }
  } catch (e) {
    try {
      // Fallback to GET request if HEAD fails
      await fetch(url, {
        method: "GET",
        signal: controller.signal,
        mode: "no-cors",
      })
      const endTime = performance.now()
      clearTimeout(timeoutId)
      return { status: "online", latency: Math.round(endTime - startTime) }
    } catch (error) {
      clearTimeout(timeoutId)
      return { status: "offline", latency: null }
    }
  }
}

export function useServiceStatuses(services: { title: string; url: string }[]) {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>({})

  useEffect(() => {
    if (!services || services.length === 0) {
      return
    }

    const runChecks = () => {
      console.log(`[${new Date().toLocaleTimeString()}] Checking service statuses...`)
      services.forEach((service) => {
        checkServiceStatus(service.url).then((status) => {
          setStatuses((prevStatuses) => {
            // Only update if status or latency has changed
            if (
              !prevStatuses[service.title] ||
              prevStatuses[service.title].status !== status.status ||
              prevStatuses[service.title].latency !== status.latency
            ) {
              return { ...prevStatuses, [service.title]: status }
            }
            return prevStatuses
          })
        })
      })
    }

    // Set initial statuses to loading
    const initialStatuses: Record<string, ServiceStatus> = {}
    services.forEach((service) => {
      initialStatuses[service.title] = { status: "loading", latency: null }
    })
    setStatuses(initialStatuses)

    runChecks()
    const intervalId = setInterval(runChecks, 30000)
    return () => clearInterval(intervalId)
  }, [services])

  return statuses
}
