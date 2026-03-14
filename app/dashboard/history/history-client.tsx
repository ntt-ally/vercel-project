"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, Search, Filter, ArrowRight } from "lucide-react"
import type { MoveHistory, Product } from "@/lib/types"

interface HistoryClientProps {
  initialHistory: MoveHistory[]
  products: Product[]
}

export function HistoryClient({ initialHistory, products }: HistoryClientProps) {
  const [moveHistory] = useState<MoveHistory[]>(initialHistory)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const getProductName = (id: string | number) => {
    return products.find((p) => p.id.toString() === id.toString())?.name || "Unknown"
  }

  const filteredHistory = moveHistory.filter((m) => {
    const matchesSearch =
      m.reference.toLowerCase().includes(search.toLowerCase()) ||
      m.from_location.toLowerCase().includes(search.toLowerCase()) ||
      m.to_location.toLowerCase().includes(search.toLowerCase()) ||
      getProductName(m.product_id).toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || m.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    Pending: moveHistory.filter((m) => m.status === "Pending").length,
    Done: moveHistory.filter((m) => m.status === "Done").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Move History</h1>
        <p className="text-muted-foreground mt-1">
          Track all inventory movements across your warehouses
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Moves</p>
                <p className="text-2xl font-bold text-foreground">{moveHistory.length}</p>
              </div>
              <History className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.Done}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-chart-3">{statusCounts.Pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All ({moveHistory.length})
        </Button>
        <Button
          variant={statusFilter === "Pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Pending")}
        >
          Pending ({statusCounts.Pending})
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
                placeholder="Search moves..."
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
                    From
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    To
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((move) => (
                  <tr
                    key={move.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <History className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {move.reference}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{move.from_location}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        {move.to_location}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {getProductName(move.product_id)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-foreground">
                      {move.quantity.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(move.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          move.status === "Done"
                            ? "bg-primary/10 text-primary"
                            : "bg-chart-3/10 text-chart-3"
                        }`}
                      >
                        {move.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No move history found
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
