"use server"

import pool, { isDatabaseConfigured } from "./db"
import type { Product, Warehouse, Location, Receipt, Delivery, MoveHistory, User } from "./types"
import { revalidatePath } from "next/cache"

// Helper to check database connection
function checkDb() {
  if (!pool) {
    throw new Error("DATABASE_NOT_CONFIGURED")
  }
  return pool
}

// Export function to check if database is ready
export async function checkDatabaseConnection(): Promise<{ configured: boolean; connected: boolean; error?: string }> {
  if (!isDatabaseConfigured) {
    return { configured: false, connected: false, error: "DATABASE_URL environment variable is not set" }
  }
  
  try {
    const db = checkDb()
    await db.query("SELECT 1")
    return { configured: true, connected: true }
  } catch (error) {
    return { 
      configured: true, 
      connected: false, 
      error: error instanceof Error ? error.message : "Unknown database connection error" 
    }
  }
}

// ============ PRODUCTS ============
export async function getProducts(): Promise<Product[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM products ORDER BY name")
  return result.rows
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const db = checkDb()
  const result = await db.query(
    "INSERT INTO products (name, per_unit_cost, on_hand, free_to_use) VALUES ($1, $2, $3, $4) RETURNING *",
    [data.name, data.per_unit_cost, data.on_hand, data.free_to_use]
  )
  revalidatePath("/dashboard/stock")
  return result.rows[0]
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const db = checkDb()
  const fields = Object.keys(data).filter(k => k !== "id")
  const values = fields.map(k => data[k as keyof Product])
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ")
  
  const result = await db.query(
    `UPDATE products SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  )
  revalidatePath("/dashboard/stock")
  return result.rows[0]
}

export async function deleteProduct(id: string): Promise<void> {
  const db = checkDb()
  await db.query("DELETE FROM products WHERE id = $1", [id])
  revalidatePath("/dashboard/stock")
}

// ============ WAREHOUSES ============
export async function getWarehouses(): Promise<Warehouse[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM warehouses ORDER BY name")
  return result.rows
}

export async function createWarehouse(data: Omit<Warehouse, "id">): Promise<Warehouse> {
  const db = checkDb()
  const result = await db.query(
    "INSERT INTO warehouses (name, short_code, address) VALUES ($1, $2, $3) RETURNING *",
    [data.name, data.short_code, data.address]
  )
  revalidatePath("/dashboard/warehouses")
  return result.rows[0]
}

export async function deleteWarehouse(id: string): Promise<void> {
  const db = checkDb()
  await db.query("DELETE FROM warehouses WHERE id = $1", [id])
  revalidatePath("/dashboard/warehouses")
}

// ============ LOCATIONS ============
export async function getLocations(): Promise<Location[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM locations ORDER BY name")
  return result.rows
}

export async function createLocation(data: Omit<Location, "id">): Promise<Location> {
  const db = checkDb()
  const result = await db.query(
    "INSERT INTO locations (name, short_code, warehouse_id) VALUES ($1, $2, $3) RETURNING *",
    [data.name, data.short_code, data.warehouse_id]
  )
  revalidatePath("/dashboard/warehouses")
  return result.rows[0]
}

export async function deleteLocation(id: string): Promise<void> {
  const db = checkDb()
  await db.query("DELETE FROM locations WHERE id = $1", [id])
  revalidatePath("/dashboard/warehouses")
}

// ============ RECEIPTS ============
export async function getReceipts(): Promise<Receipt[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM receipts ORDER BY date DESC")
  return result.rows
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM receipts WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function createReceipt(data: Omit<Receipt, "id">, products: { product_id: string; quantity: number }[]): Promise<Receipt> {
  const db = checkDb()
  const client = await db.connect()
  try {
    await client.query("BEGIN")
    
    const receiptResult = await client.query(
      "INSERT INTO receipts (reference, from_source, warehouse_id, date, status, responsible_person) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [data.reference, data.from_source, data.warehouse_id, data.date, data.status, data.responsible_person]
    )
    const receipt = receiptResult.rows[0]
    
    for (const product of products) {
      await client.query(
        "INSERT INTO receipt_products (receipt_id, product_id, quantity) VALUES ($1, $2, $3)",
        [receipt.id, product.product_id, product.quantity]
      )
    }
    
    // Create move history entry
    for (const product of products) {
      await client.query(
        "INSERT INTO move_history (reference, from_location, to_location, product_id, quantity, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [data.reference, data.from_source, data.warehouse_id, product.product_id, product.quantity, "Pending", data.date]
      )
    }
    
    await client.query("COMMIT")
    revalidatePath("/dashboard/receipts")
    revalidatePath("/dashboard/history")
    return receipt
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}

export async function updateReceiptStatus(id: string, status: "Draft" | "Ready" | "Done"): Promise<Receipt> {
  const db = checkDb()
  const result = await db.query(
    "UPDATE receipts SET status = $2 WHERE id = $1 RETURNING *",
    [id, status]
  )
  
  if (status === "Done") {
    // Update product quantities and move history
    const productsResult = await db.query(
      "SELECT * FROM receipt_products WHERE receipt_id = $1",
      [id]
    )
    
    for (const rp of productsResult.rows) {
      await db.query(
        "UPDATE products SET on_hand = on_hand + $2, free_to_use = free_to_use + $2 WHERE id = $1",
        [rp.product_id, rp.quantity]
      )
    }
    
    await db.query(
      "UPDATE move_history SET status = 'Done' WHERE reference = (SELECT reference FROM receipts WHERE id = $1)",
      [id]
    )
  }
  
  revalidatePath("/dashboard/receipts")
  revalidatePath("/dashboard/stock")
  revalidatePath("/dashboard/history")
  return result.rows[0]
}

export async function getReceiptProducts(receiptId: string): Promise<{ product_id: string; quantity: number }[]> {
  const db = checkDb()
  const result = await db.query("SELECT product_id, quantity FROM receipt_products WHERE receipt_id = $1", [receiptId])
  return result.rows
}

// ============ DELIVERIES ============
export async function getDeliveries(): Promise<Delivery[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM deliveries ORDER BY scheduled_date DESC")
  return result.rows
}

export async function getDeliveryById(id: string): Promise<Delivery | null> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM deliveries WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function createDelivery(data: Omit<Delivery, "id">, products: { product_id: string; quantity: number }[]): Promise<Delivery> {
  const db = checkDb()
  const client = await db.connect()
  try {
    await client.query("BEGIN")
    
    const deliveryResult = await client.query(
      "INSERT INTO deliveries (reference, warehouse_id, contact, scheduled_date, status, responsible_person) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [data.reference, data.warehouse_id, data.contact, data.scheduled_date, data.status, data.responsible_person]
    )
    const delivery = deliveryResult.rows[0]
    
    for (const product of products) {
      await client.query(
        "INSERT INTO delivery_products (delivery_id, product_id, quantity) VALUES ($1, $2, $3)",
        [delivery.id, product.product_id, product.quantity]
      )
    }
    
    // Create move history entry
    for (const product of products) {
      await client.query(
        "INSERT INTO move_history (reference, from_location, to_location, product_id, quantity, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [data.reference, data.warehouse_id, data.contact, product.product_id, product.quantity, "Pending", data.scheduled_date]
      )
    }
    
    await client.query("COMMIT")
    revalidatePath("/dashboard/delivery")
    revalidatePath("/dashboard/history")
    return delivery
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}

export async function updateDeliveryStatus(id: string, status: "Draft" | "Ready" | "Done"): Promise<Delivery> {
  const db = checkDb()
  const result = await db.query(
    "UPDATE deliveries SET status = $2 WHERE id = $1 RETURNING *",
    [id, status]
  )
  
  if (status === "Done") {
    // Update product quantities and move history
    const productsResult = await db.query(
      "SELECT * FROM delivery_products WHERE delivery_id = $1",
      [id]
    )
    
    for (const dp of productsResult.rows) {
      await db.query(
        "UPDATE products SET on_hand = on_hand - $2, free_to_use = free_to_use - $2 WHERE id = $1",
        [dp.product_id, dp.quantity]
      )
    }
    
    await db.query(
      "UPDATE move_history SET status = 'Done' WHERE reference = (SELECT reference FROM deliveries WHERE id = $1)",
      [id]
    )
  }
  
  revalidatePath("/dashboard/delivery")
  revalidatePath("/dashboard/stock")
  revalidatePath("/dashboard/history")
  return result.rows[0]
}

export async function getDeliveryProducts(deliveryId: string): Promise<{ product_id: string; quantity: number }[]> {
  const db = checkDb()
  const result = await db.query("SELECT product_id, quantity FROM delivery_products WHERE delivery_id = $1", [deliveryId])
  return result.rows
}

// ============ MOVE HISTORY ============
export async function getMoveHistory(): Promise<MoveHistory[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM move_history ORDER BY date DESC")
  return result.rows
}

// ============ AUTH ============
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows[0] || null
}

export async function createUser(email: string, name: string, passwordHash: string): Promise<User> {
  const db = checkDb()
  const result = await db.query(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [email, name, passwordHash]
  )
  return result.rows[0]
}

// ============ DASHBOARD STATS ============
export async function getDashboardStats() {
  const db = checkDb()
  const productsResult = await db.query("SELECT COUNT(*) as count, COALESCE(SUM(on_hand * per_unit_cost), 0) as value FROM products")
  const receiptsResult = await db.query("SELECT COUNT(*) as count FROM receipts WHERE status != 'Done'")
  const deliveriesResult = await db.query("SELECT COUNT(*) as count FROM deliveries WHERE status != 'Done'")
  const warehousesResult = await db.query("SELECT COUNT(*) as count FROM warehouses")
  
  return {
    totalProducts: parseInt(productsResult.rows[0].count),
    inventoryValue: parseFloat(productsResult.rows[0].value) || 0,
    pendingReceipts: parseInt(receiptsResult.rows[0].count),
    pendingDeliveries: parseInt(deliveriesResult.rows[0].count),
    totalWarehouses: parseInt(warehousesResult.rows[0].count),
  }
}

export async function getRecentMoves(limit: number = 5): Promise<MoveHistory[]> {
  const db = checkDb()
  const result = await db.query("SELECT * FROM move_history ORDER BY date DESC LIMIT $1", [limit])
  return result.rows
}
