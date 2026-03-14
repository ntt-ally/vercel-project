import { getWarehouses, getLocations } from "@/lib/actions"
import { WarehousesClient } from "./warehouses-client"

export default async function WarehousesPage() {
  const [warehouses, locations] = await Promise.all([
    getWarehouses(),
    getLocations(),
  ])
  
  return <WarehousesClient initialWarehouses={warehouses} initialLocations={locations} />
}
