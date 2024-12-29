"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Mail, MapPin, CreditCard, ShoppingBag, Wallet, Banknote } from 'lucide-react'

type PaymentMethod = 'credit_card' | 'paypal' | 'cash_on_delivery'

export default function CheckoutPage() {
  const { cartItems, getCartTotal, getCartTotalWithTax, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the order to your backend
    const newOrder = {
      id: `ORDER-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Processing",
      total: getCartTotalWithTax(),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod
    }

    // Save the new order to localStorage
    const storedOrders = localStorage.getItem('orders')
    const orders = storedOrders ? JSON.parse(storedOrders) : []
    orders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Clear the cart
    clearCart()

    // Redirect to the thank you page
    router.push('/thank-you')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your items before placing the order</CardDescription>
          </CardHeader>
          <CardContent>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>${(getCartTotal() * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${getCartTotalWithTax().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Payment Information</CardTitle>
            <CardDescription>Enter your details to complete the purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </div>
              {paymentMethod === 'credit_card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        maxLength={3}
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              {paymentMethod === 'paypal' && (
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="paypalEmail"
                      name="paypalEmail"
                      type="email"
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="flex items-center space-x-2">
                  <Banknote className="text-gray-400" size={18} />
                  <span>Pay with cash upon delivery</span>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

