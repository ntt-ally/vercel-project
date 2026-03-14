"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Package } from "lucide-react"
import type { Product } from "@/lib/types"
import { createProduct } from "@/lib/actions"

interface StockClientProps {
  initialProducts: Product[]
}

export function StockClient({ initialProducts }: StockClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    per_unit_cost: 0,
    on_hand: 0,
    free_to_use: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    if (filterBy === "all") return matchesSearch
    if (filterBy === "low") return matchesSearch && product.on_hand < 100
    if (filterBy === "high") return matchesSearch && product.on_hand >= 100
    return matchesSearch
  })

  const handleAddProduct = async () => {
    if (!newProduct.name) return
    setIsSubmitting(true)
    try {
      const created = await createProduct(newProduct)
      setProducts([...products, created])
      setNewProduct({ name: "", per_unit_cost: 0, on_hand: 0, free_to_use: 0 })
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Per Unit Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={newProduct.per_unit_cost}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      per_unit_cost: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-input border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="onHand">On Hand</Label>
                  <Input
                    id="onHand"
                    type="number"
                    value={newProduct.on_hand}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        on_hand: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeToUse">Free to Use</Label>
                  <Input
                    id="freeToUse"
                    type="number"
                    value={newProduct.free_to_use}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        free_to_use: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddProduct}
                className="w-full bg-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Product Inventory
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64 bg-input border-border"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-40 bg-input border-border">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="high">High Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="text-foreground">Product</TableHead>
                  <TableHead className="text-foreground text-right">
                    Per Unit Cost
                  </TableHead>
                  <TableHead className="text-foreground text-right">
                    On Hand
                  </TableHead>
                  <TableHead className="text-foreground text-right">
                    Free to Use
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-border hover:bg-secondary/30"
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(product.per_unit_cost).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            product.on_hand < 100
                              ? "text-destructive"
                              : "text-foreground"
                          }
                        >
                          {product.on_hand}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {product.free_to_use}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
