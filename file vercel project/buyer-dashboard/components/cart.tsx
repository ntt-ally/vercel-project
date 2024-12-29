"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Cart() {
  const { cartItems, removeFromCart, getCartTotal, getCartTotalWithTax } = useCart()

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 overflow-auto mb-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-muted-foreground">Your cart is empty</p>
        ) : (
          <ul className="divide-y">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t pt-2 space-y-2 sticky bottom-0 bg-background">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>GST (18%):</span>
          <span>${(getCartTotal() * 0.18).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span>Total (incl. taxes):</span>
          <span>${getCartTotalWithTax().toFixed(2)}</span>
        </div>
        <Button asChild className="w-full mt-2">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  )
}

