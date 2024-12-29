"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"

// Sample products
const allProducts = [
  { id: 1, name: "Sand 1", price: 10, category: "sand", description: "Fine quality sand for various uses" },
  { id: 2, name: "Sand 2", price: 15, category: "sand", description: "Coarse sand ideal for construction" },
  { id: 3, name: "Grit 1", price: 20, category: "grit", description: "Fine grit for smooth finishes" },
  { id: 4, name: "Grit 2", price: 25, category: "grit", description: "Coarse grit for heavy-duty applications" },
]

export default function ProductsPage({ params }: { params: { category: string } }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { addToCart } = useCart()

  const products = params.category === "all" 
    ? allProducts 
    : allProducts.filter(product => product.category === params.category)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.category} Products</h1>
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
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <img src="/placeholder.svg" alt={product.name} className="w-full h-48 object-cover mb-4" />
                <p>{product.description}</p>
                <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => addToCart(product)} className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

