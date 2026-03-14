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
  ArrowDownToLine,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Trash2,
} from "lucide-react"
import type { Receipt, Warehouse } from "@/lib/types"
import { updateReceiptStatus } from "@/lib/actions"

interface ReceiptsClientProps {
  initialReceipts: Receipt[]
  warehouses: Warehouse[]
}

export function ReceiptsClient({ initialReceipts, warehouses }: ReceiptsClientProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.reference.toLowerCase().includes(search.toLowerCase()) ||
      r.from_source.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getWarehouseName = (id: string | number) => {
    return warehouses.find((w) => w.id.toString() === id.toString())?.name || id
  }

  const handleStatusChange = async (id: string, newStatus: "Draft" | "Ready" | "Done") => {
    try {
      const updated = await updateReceiptStatus(id, newStatus)
      setReceipts(receipts.map((r) => (r.id.toString() === id ? updated : r)))
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const statusCounts = {
    Draft: receipts.filter((r) => r.status === "Draft").length,
    Ready: receipts.filter((r) => r.status === "Ready").length,
    Done: receipts.filter((r) => r.status === "Done").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming inventory receipts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/receipts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Receipt
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All ({receipts.length})
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
                placeholder="Search receipts..."
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
                    Warehouse
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
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
                {filteredReceipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ArrowDownToLine className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {receipt.reference}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{receipt.from_source}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {getWarehouseName(receipt.warehouse_id)}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(receipt.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          receipt.status === "Done"
                            ? "bg-primary/10 text-primary"
                            : receipt.status === "Ready"
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {receipt.status}
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
                          {receipt.status !== "Done" && (
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() =>
                                handleStatusChange(
                                  receipt.id.toString(),
                                  receipt.status === "Draft" ? "Ready" : "Done"
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                              {receipt.status === "Draft" ? "Mark Ready" : "Mark Done"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredReceipts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No receipts found
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
