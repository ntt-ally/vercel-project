"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowUpFromLine,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
} from "lucide-react"
import type { Delivery, Warehouse } from "@/lib/types"
import { updateDeliveryStatus } from "@/lib/actions"

interface DeliveryClientProps {
  initialDeliveries: Delivery[]
  warehouses: Warehouse[]
}

export function DeliveryClient({ initialDeliveries, warehouses }: DeliveryClientProps) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      d.contact.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || d.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getWarehouseName = (id: string | number) => {
    return warehouses.find((w) => w.id.toString() === id.toString())?.name || id
  }

  const handleStatusChange = async (id: string, newStatus: "Draft" | "Ready" | "Done") => {
    try {
      const updated = await updateDeliveryStatus(id, newStatus)
      setDeliveries(deliveries.map((d) => (d.id.toString() === id ? updated : d)))
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const statusCounts = {
    Draft: deliveries.filter((d) => d.status === "Draft").length,
    Ready: deliveries.filter((d) => d.status === "Ready").length,
    Done: deliveries.filter((d) => d.status === "Done").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
          <p className="text-muted-foreground mt-1">
            Manage outgoing inventory deliveries
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/delivery/new">
            <Plus className="h-4 w-4 mr-2" />
            New Delivery
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All ({deliveries.length})
        </Button>
        <Button
          variant={statusFilter === "Draft" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Draft")}
        >
          Draft ({statusCounts.Draft})
        </Button>
        <Button
          variant={statusFilter === "Ready" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Ready")}
        >
          Ready ({statusCounts.Ready})
        </Button>
        <Button
          variant={statusFilter === "Done" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Done")}
        >
          Done ({statusCounts.Done})
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Warehouse
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Scheduled Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-chart-2/10 flex items-center justify-center">
                          <ArrowUpFromLine className="h-4 w-4 text-chart-2" />
                        </div>
                        <span className="font-medium text-foreground">
                          {delivery.reference}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {getWarehouseName(delivery.warehouse_id)}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {delivery.contact}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(delivery.scheduled_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          delivery.status === "Done"
                            ? "bg-primary/10 text-primary"
                            : delivery.status === "Ready"
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {delivery.status !== "Done" && (
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() =>
                                handleStatusChange(
                                  delivery.id.toString(),
                                  delivery.status === "Draft" ? "Ready" : "Done"
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                              {delivery.status === "Draft" ? "Mark Ready" : "Mark Done"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredDeliveries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No deliveries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
