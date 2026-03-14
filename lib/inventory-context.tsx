"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
}

interface InventoryContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  return (
    <InventoryContext.Provider value={{ user, setUser }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
