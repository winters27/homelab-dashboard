"use client"

// A small change to trigger a new deployment
import { useState, useEffect, useMemo } from "react"
import { ServiceCard, type Service } from "@/components/service-card"
import { GreetingClock } from "@/components/greeting-clock"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Search, Star, PlusCircle, Download, AlertTriangle } from "lucide-react"
import { useServiceStatuses } from "@/hooks/use-service-status"
import { useFavorites } from "@/hooks/use-favorites"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EditServiceDialog } from "@/components/edit-service-dialog"
import { Button } from "@/components/ui/button"
import { useTimeOfDay, type TimeOfDay } from "@/hooks/use-time-of-day"
import { cn } from "@/lib/utils"

const SERVICES_KEY = "homelab-dashboard-services"

const bloomClasses: Record<TimeOfDay, string> = {
  morning: "bg-bloom-morning",
  afternoon: "bg-bloom-afternoon",
  evening: "bg-bloom-evening",
  night: "bg-bloom-night",
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)

  const timeOfDay = useTimeOfDay()
  const statuses = useServiceStatuses(services)
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    const loadServices = () => {
      try {
        const storedServices = localStorage.getItem(SERVICES_KEY)
        if (storedServices) {
          const parsed = JSON.parse(storedServices)
          if (Array.isArray(parsed)) {
            setServices(parsed)
            return
          }
        }
      } catch (error) {
        console.error("Failed to load services from localStorage, fetching default.", error)
      }

      fetch("/services.json")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setServices(data)
            localStorage.setItem(SERVICES_KEY, JSON.stringify(data))
          }
        })
        .catch((err) => console.error("Failed to fetch services.json", err))
    }

    loadServices()
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services))
    }
  }, [services, isMounted])

  const handleSaveService = (serviceData: Service) => {
    setServices((prev) => {
      const existing = prev.find((s) => s.title === serviceToEdit?.title)
      if (existing) {
        return prev.map((s) => (s.title === existing.title ? { ...s, ...serviceData } : s))
      } else {
        return [...prev, serviceData]
      }
    })
    setServiceToEdit(null)
  }

  const handleEdit = (service: Service) => {
    setServiceToEdit(service)
    setDialogOpen(true)
  }

  const handleDelete = (title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setServices((prev) => prev.filter((s) => s.title !== title))
    }
  }

  const handleAddNew = () => {
    setServiceToEdit(null)
    setDialogOpen(true)
  }

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(services, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "services.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const favoriteServices = useMemo(() => {
    return services
      .filter((service) => favorites.includes(service.title))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [services, favorites])

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        !favorites.includes(service.title) &&
        (service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))),
    )
  }, [services, searchTerm, favorites])

  const groupedServices = useMemo(() => {
    return filteredServices.reduce(
      (acc, service) => {
        const category = service.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(service)
        return acc
      },
      {} as Record<string, Service[]>,
    )
  }, [filteredServices])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <EditServiceDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveService}
        serviceToEdit={serviceToEdit}
      />
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
        <div className={cn("absolute inset-0 z-10 transition-opacity duration-1000", bloomClasses[timeOfDay])} />

        <main className="relative z-20 flex flex-col items-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-7xl">
            <header className="relative flex flex-col items-center justify-center py-8 md:py-12">
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Switch id="edit-mode" checked={isEditMode} onCheckedChange={setIsEditMode} />
                <Label htmlFor="edit-mode" className="text-white">
                  Edit Mode
                </Label>
              </div>
              <div className="absolute top-4 right-4">
                <ThemeToggle />
              </div>
              <GreetingClock />
              <div className="mt-8 w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 z-10" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="w-full rounded-full border border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-300 backdrop-blur-sm focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </header>

            {isEditMode && (
              <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-yellow-500/50 bg-yellow-500/10 p-4">
                <div className="flex items-center gap-2 text-yellow-300">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-semibold">You are in Edit Mode</p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Service
                  </Button>
                  <Button onClick={handleDownloadJson}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Config
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-10">
              {favoriteServices.length > 0 && (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
                    <Star className="h-6 w-6 text-gray-300" />
                    Favorites
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {favoriteServices.map((service) => (
                      <ServiceCard
                        key={service.title}
                        service={service}
                        status={statuses[service.title]}
                        isFavorite={favorites.includes(service.title)}
                        onToggleFavorite={toggleFavorite}
                        isEditMode={isEditMode}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              )}

              {Object.entries(groupedServices).map(([category, services]) => (
                <section key={category}>
                  <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">{category}</h2>
                  <div className="flex flex-wrap gap-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.title}
                        service={service}
                        status={statuses[service.title]}
                        isFavorite={favorites.includes(service.title)}
                        onToggleFavorite={toggleFavorite}
                        isEditMode={isEditMode}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
