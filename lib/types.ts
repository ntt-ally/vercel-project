export interface Product {
  id: string
  name: string
  per_unit_cost: number
  on_hand: number
  free_to_use: number
}

export interface Warehouse {
  id: string
  name: string
  short_code: string
  address: string
}

export interface Location {
  id: string
  name: string
  short_code: string
  warehouse_id: string
}

export interface Receipt {
  id: string
  reference: string
  from_source: string
  warehouse_id: string
  date: string
  status: "Draft" | "Ready" | "Done"
  responsible_person: string
}

export interface ReceiptProduct {
  id: string
  receipt_id: string
  product_id: string
  quantity: number
}

export interface Delivery {
  id: string
  reference: string
  warehouse_id: string
  contact: string
  scheduled_date: string
  status: "Draft" | "Ready" | "Done"
  responsible_person: string
}

export interface DeliveryProduct {
  id: string
  delivery_id: string
  product_id: string
  quantity: number
}

export interface MoveHistory {
  id: string
  reference: string
  from_location: string
  to_location: string
  product_id: string
  quantity: number
  status: "Pending" | "Done"
  date: string
}

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
}
