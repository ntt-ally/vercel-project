import { getDeliveries, getWarehouses } from "@/lib/actions"
import { DeliveryClient } from "./delivery-client"

export default async function DeliveryPage() {
  const [deliveries, warehouses] = await Promise.all([
    getDeliveries(),
    getWarehouses(),
  ])
  
  return <DeliveryClient initialDeliveries={deliveries} warehouses={warehouses} />
}
