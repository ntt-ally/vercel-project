"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Warehouse, Plus, MapPin, Tag, Trash2 } from "lucide-react"
import type { Warehouse as WarehouseType, Location } from "@/lib/types"
import { createWarehouse, createLocation, deleteWarehouse, deleteLocation } from "@/lib/actions"

interface WarehousesClientProps {
  initialWarehouses: WarehouseType[]
  initialLocations: Location[]
}

export function WarehousesClient({ initialWarehouses, initialLocations }: WarehousesClientProps) {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>(initialWarehouses)
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    short_code: "",
    address: "",
  })
  const [newLocation, setNewLocation] = useState({
    name: "",
    short_code: "",
    warehouse_id: "",
  })

  const handleAddWarehouse = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const created = await createWarehouse(newWarehouse)
      setWarehouses([...warehouses, created])
      setNewWarehouse({ name: "", short_code: "", address: "" })
      setWarehouseDialogOpen(false)
    } catch (error) {
      console.error("Failed to create warehouse:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const created = await createLocation(newLocation)
      setLocations([...locations, created])
      setNewLocation({ name: "", short_code: "", warehouse_id: "" })
      setLocationDialogOpen(false)
    } catch (error) {
      console.error("Failed to create location:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteWarehouse = async (id: string) => {
    try {
      await deleteWarehouse(id)
      setWarehouses(warehouses.filter((w) => w.id.toString() !== id))
      setLocations(locations.filter((l) => l.warehouse_id.toString() !== id))
    } catch (error) {
      console.error("Failed to delete warehouse:", error)
    }
  }

  const handleDeleteLocation = async (id: string) => {
    try {
      await deleteLocation(id)
      setLocations(locations.filter((l) => l.id.toString() !== id))
    } catch (error) {
      console.error("Failed to delete location:", error)
    }
  }

  const getWarehouseLocations = (warehouseId: string | number) => {
    return locations.filter((l) => l.warehouse_id.toString() === warehouseId.toString())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your warehouses and storage locations
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Location</DialogTitle>
                <DialogDescription>
                  Add a storage location within a warehouse
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddLocation} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Location Name</FieldLabel>
                    <Input
                      value={newLocation.name}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, name: e.target.value })
                      }
                      placeholder="e.g., Rack A1, Shelf B2"
                      required
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Short Code</FieldLabel>
                    <Input
                      value={newLocation.short_code}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, short_code: e.target.value })
                      }
                      placeholder="e.g., A1, B2"
                      required
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Warehouse</FieldLabel>
                    <select
                      value={newLocation.warehouse_id}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, warehouse_id: e.target.value })
                      }
                      required
                      className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground"
                    >
                      <option value="">Select warehouse</option>
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </FieldGroup>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Location"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Warehouse</DialogTitle>
                <DialogDescription>
                  Create a new warehouse location
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddWarehouse} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Warehouse Name</FieldLabel>
                    <Input
                      value={newWarehouse.name}
                      onChange={(e) =>
                        setNewWarehouse({ ...newWarehouse, name: e.target.value })
                      }
                      placeholder="Enter warehouse name"
                      required
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Short Code</FieldLabel>
                    <Input
                      value={newWarehouse.short_code}
                      onChange={(e) =>
                        setNewWarehouse({ ...newWarehouse, short_code: e.target.value })
                      }
                      placeholder="e.g., MAIN, EAST"
                      required
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input
                      value={newWarehouse.address}
                      onChange={(e) =>
                        setNewWarehouse({ ...newWarehouse, address: e.target.value })
                      }
                      placeholder="Enter full address"
                      required
                      className="bg-secondary border-border"
                    />
                  </Field>
                </FieldGroup>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWarehouseDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Warehouse"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {warehouses.map((warehouse) => {
          const warehouseLocations = getWarehouseLocations(warehouse.id)
          return (
            <Card key={warehouse.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Warehouse className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{warehouse.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {warehouse.short_code}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteWarehouse(warehouse.id.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {warehouse.address}
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Locations ({warehouseLocations.length})
                  </p>
                  {warehouseLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {warehouseLocations.map((location) => (
                        <div
                          key={location.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm"
                        >
                          <span className="text-foreground">{location.name}</span>
                          <span className="text-muted-foreground">({location.short_code})</span>
                          <button
                            onClick={() => handleDeleteLocation(location.id.toString())}
                            className="text-muted-foreground hover:text-destructive ml-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No locations defined</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {warehouses.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No warehouses yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first warehouse to get started
            </p>
            <Button onClick={() => setWarehouseDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
