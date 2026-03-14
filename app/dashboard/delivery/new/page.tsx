import { getProducts, getWarehouses, getDeliveries } from "@/lib/actions"
import { NewDeliveryClient } from "./new-delivery-client"

export default async function NewDeliveryPage() {
  const [products, warehouses, deliveries] = await Promise.all([
    getProducts(),
    getWarehouses(),
    getDeliveries(),
  ])
  
  return (
    <NewDeliveryClient 
      products={products} 
      warehouses={warehouses} 
      deliveryCount={deliveries.length}
    />
  )
}
