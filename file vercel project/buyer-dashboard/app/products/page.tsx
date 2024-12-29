"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock product data
const products = [
  { id: 1, name: "Product 1", description: "Description for Product 1", price: 19.99, image: "/placeholder.svg" },
  { id: 2, name: "Product 2", description: "Description for Product 2", price: 29.99, image: "/placeholder.svg" },
  { id: 3, name: "Product 3", description: "Description for Product 3", price: 39.99, image: "/placeholder.svg" },
  // Add more products as needed
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <Input
        type="search"
        placeholder="Search products..."
        className="mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <p>{product.description}</p>
                <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

