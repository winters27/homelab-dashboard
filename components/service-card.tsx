"use client"

import type React from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceStatus } from "@/hooks/use-service-status"
import { Star, Pencil, Trash2 } from "lucide-react"

type IconName = keyof typeof LucideIcons

export interface Service {
  title: string
  url: string
  icon: IconName
  category: string
}

const IconComponentMap = LucideIcons as { [key in IconName]: React.ElementType }

const statusClasses = {
  loading: "bg-gray-400 animate-pulse",
  online: "bg-green-500",
  offline: "bg-red-700",
}

export function ServiceCard({
  service,
  status = { status: "loading", latency: null },
  isFavorite,
  onToggleFavorite,
  isEditMode,
  onEdit,
  onDelete,
}: {
  service: Service
  status?: ServiceStatus
  isFavorite?: boolean
  onToggleFavorite?: (title: string) => void
  isEditMode?: boolean
  onEdit?: (service: Service) => void
  onDelete?: (title: string) => void
}) {
  const { title, url, icon } = service
  const Icon = IconComponentMap[icon] || LucideIcons.Server

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(title)
  }

  return (
    <a
      href={isEditMode ? undefined : url}
      target={isEditMode ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={cn(
        "group relative flex w-44 aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl p-4 text-center",
        "transition-all duration-300 ease-in-out",
        isEditMode ? "cursor-default" : "hover:scale-105",
        // Dark mode styles for "liquid glass"
        "dark:border dark:border-white/10 dark:bg-black/20 dark:text-white dark:backdrop-blur-sm",
        "dark:hover:bg-black/30 dark:hover:border-white/20",
        // Light mode styles
        "border bg-gray-50/50 text-gray-800 backdrop-blur-sm",
        "hover:bg-gray-50/70 hover:border-gray-200",
      )}
    >
      {isEditMode ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-2xl bg-black/60">
          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-all",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "fill-transparent",
              )}
            />
          </button>
          <button
            onClick={() => onEdit?.(service)}
            className="p-2 rounded-full bg-blue-500/80 text-white hover:bg-blue-500"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete?.(title)}
            className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            {status.status === "online" && status.latency !== null && (
              <span className="text-xs text-gray-400 dark:text-gray-400">{status.latency}ms</span>
            )}
            <div
              className={cn(
                "h-3 w-3 rounded-full border-2",
                statusClasses[status.status],
                "dark:border-gray-800 border-gray-100",
              )}
              title={`Status: ${status.status.charAt(0).toUpperCase() + status.status.slice(1)}`}
            />
          </div>
        </>
      )}

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        <Icon className="h-8 w-8 text-gray-600 transition-colors duration-300 dark:text-gray-200 dark:group-hover:text-white" />
        <span className="text-sm font-medium tracking-tight text-gray-700 transition-colors duration-300 dark:text-gray-200 dark:group-hover:text-white">
          {title}
        </span>
      </div>
    </a>
  )
}
