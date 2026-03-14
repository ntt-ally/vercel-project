"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import type { Product, Warehouse } from "@/lib/types"
import { createReceipt } from "@/lib/actions"

interface NewReceiptClientProps {
  products: Product[]
  warehouses: Warehouse[]
  receiptCount: number
}

export function NewReceiptClient({ products, warehouses, receiptCount }: NewReceiptClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    reference: `REC-${String(receiptCount + 1).padStart(3, "0")}`,
    from_source: "",
    warehouse_id: "",
    responsible_person: "",
    date: new Date().toISOString().split("T")[0],
    products: [{ product_id: "", quantity: "" }],
  })

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product_id: "", quantity: "" }],
    })
  }

  const handleRemoveProduct = (index: number) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter((_, i) => i !== index),
      })
    }
  }

  const handleProductChange = (
    index: number,
    field: "product_id" | "quantity",
    value: string
  ) => {
    const updated = [...formData.products]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, products: updated })
  }

  const handleSave = async (status: "Draft" | "Ready") => {
    setIsSubmitting(true)

    try {
      const receiptData = {
        reference: formData.reference,
        from_source: formData.from_source,
        warehouse_id: formData.warehouse_id,
        date: formData.date,
        status,
        responsible_person: formData.responsible_person,
      }

      const productItems = formData.products
        .filter((p) => p.product_id && p.quantity)
        .map((p) => ({
          product_id: p.product_id,
          quantity: parseInt(p.quantity),
        }))

      await createReceipt(receiptData, productItems)
      router.push("/dashboard/receipts")
    } catch (error) {
      console.error("Failed to create receipt:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/receipts">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Receipt</h1>
          <p className="text-muted-foreground mt-1">
            Create a new incoming inventory receipt
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Receipt Details</CardTitle>
              <CardDescription>Basic information about this receipt</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Reference ID</FieldLabel>
                    <Input
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Date</FieldLabel>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>From (Vendor/Source)</FieldLabel>
                  <Input
                    value={formData.from_source}
                    onChange={(e) =>
                      setFormData({ ...formData, from_source: e.target.value })
                    }
                    placeholder="Enter vendor or source name"
                    className="bg-secondary border-border"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Warehouse</FieldLabel>
                    <Select
                      value={formData.warehouse_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, warehouse_id: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Responsible Person</FieldLabel>
                    <Input
                      value={formData.responsible_person}
                      onChange={(e) =>
                        setFormData({ ...formData, responsible_person: e.target.value })
                      }
                      placeholder="Enter name"
                      className="bg-secondary border-border"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Products</CardTitle>
                  <CardDescription>Add products to this receipt</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.products.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <Field className="flex-1">
                      {index === 0 && <FieldLabel>Product</FieldLabel>}
                      <Select
                        value={item.product_id}
                        onValueChange={(value) =>
                          handleProductChange(index, "product_id", value)
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field className="w-32">
                      {index === 0 && <FieldLabel>Quantity</FieldLabel>}
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleProductChange(index, "quantity", e.target.value)
                        }
                        placeholder="0"
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(index)}
                      disabled={formData.products.length === 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Actions</CardTitle>
              <CardDescription>Save or validate this receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => handleSave("Ready")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save & Validate"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSave("Draft")}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/dashboard/receipts">Cancel</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Status Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                  Draft
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 rounded bg-chart-2/10 text-chart-2">
                  Ready
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                  Done
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
