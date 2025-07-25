"use client"

import { useState, useEffect, useMemo } from "react"
import * as LucideIcons from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronsUpDown, Server } from 'lucide-react'

type IconName = keyof typeof LucideIcons

interface IconPickerProps {
  value: IconName
  onChange: (value: IconName) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [iconList, setIconList] = useState<IconName[]>([])

  useEffect(() => {
    fetch("/lucide-icons.json")
      .then((res) => res.json())
      .then((data) => setIconList(data))
      .catch((err) => console.error("Failed to load icons", err))
  }, [])

  const filteredIcons = useMemo(() => {
    if (!search) return iconList
    return iconList.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
  }, [search, iconList])

  const SelectedIcon = LucideIcons[value] || Server

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between bg-transparent"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            {value}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2">
          <Input placeholder="Search icons..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>
        <ScrollArea className="h-72">
          <div className="grid grid-cols-5 gap-1 p-2">
            {filteredIcons.map((name) => {
              const Icon = LucideIcons[name]
              if (!Icon) return null
              return (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChange(name)
                    setIsOpen(false)
                  }}
                  className="h-10 w-10"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
