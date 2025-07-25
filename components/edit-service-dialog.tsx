"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Service } from "./service-card"
import { IconPicker } from "./icon-picker"
import type * as LucideIcons from "lucide-react"

type IconName = keyof typeof LucideIcons

interface EditServiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (service: Service) => void
  serviceToEdit?: Service | null
}

export function EditServiceDialog({ isOpen, onClose, onSave, serviceToEdit }: EditServiceDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [icon, setIcon] = useState<IconName>("Server")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (serviceToEdit) {
      setTitle(serviceToEdit.title)
      setUrl(serviceToEdit.url)
      setIcon(serviceToEdit.icon)
      setCategory(serviceToEdit.category)
    } else {
      setTitle("")
      setUrl("")
      setIcon("Server")
      setCategory("")
    }
  }, [serviceToEdit, isOpen])

  const handleSave = () => {
    if (!title || !url || !icon || !category) {
      alert("Please fill out all fields.")
      return
    }
    onSave({ title, url, icon, category })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{serviceToEdit ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {serviceToEdit ? "Update the details for your service." : "Add a new service to your dashboard."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <div className="col-span-3">
              <IconPicker value={icon} onChange={setIcon} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
