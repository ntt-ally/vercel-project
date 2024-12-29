"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the specific order from an API
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      const orders: Order[] = JSON.parse(storedOrders)
      const foundOrder = orders.find(o => o.id === id)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [id])

  if (!order) {
    return <div className="container mx-auto py-8">Order not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        <div className="grid gap-4 mb-6">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 text-right">
          <p className="text-xl font-semibold">Total: ${order.total.toFixed(2)}</p>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

