"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

type CartItem = Product & {
  quantity: number
}

type DeliveryLocation = {
  id: number
  address: string
  city: string
  postalCode: string
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartTotalWithTax: () => number
  deliveryLocations: DeliveryLocation[]
  addDeliveryLocation: (location: Omit<DeliveryLocation, 'id'>) => void
  removeDeliveryLocation: (id: number) => void
  selectedDeliveryLocation: DeliveryLocation | null
  setSelectedDeliveryLocation: (location: DeliveryLocation | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([])
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<DeliveryLocation | null>(null)

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }

    const storedLocations = localStorage.getItem('deliveryLocations')
    if (storedLocations) {
      setDeliveryLocations(JSON.parse(storedLocations))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('deliveryLocations', JSON.stringify(deliveryLocations))
  }, [deliveryLocations])

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartTotalWithTax = () => {
    const subtotal = getCartTotal()
    const gst = subtotal * 0.18 // 18% GST
    const deliveryCharge = selectedDeliveryLocation ? 50 : 0 // Example delivery charge
    return subtotal + gst + deliveryCharge
  }

  const addDeliveryLocation = (location: Omit<DeliveryLocation, 'id'>) => {
    const newLocation = { ...location, id: Date.now() }
    setDeliveryLocations(prevLocations => [...prevLocations, newLocation])
  }

  const removeDeliveryLocation = (id: number) => {
    setDeliveryLocations(prevLocations => prevLocations.filter(location => location.id !== id))
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartTotalWithTax,
        deliveryLocations,
        addDeliveryLocation,
        removeDeliveryLocation,
        selectedDeliveryLocation,
        setSelectedDeliveryLocation,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

