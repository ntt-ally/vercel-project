import { getProducts, getWarehouses, getReceipts } from "@/lib/actions"
import { NewReceiptClient } from "./new-receipt-client"

export default async function NewReceiptPage() {
  const [products, warehouses, receipts] = await Promise.all([
    getProducts(),
    getWarehouses(),
    getReceipts(),
  ])
  
  return (
    <NewReceiptClient 
      products={products} 
      warehouses={warehouses} 
      receiptCount={receipts.length}
    />
  )
}
