import { getReceipts, getWarehouses } from "@/lib/actions"
import { ReceiptsClient } from "./receipts-client"

export default async function ReceiptsPage() {
  const [receipts, warehouses] = await Promise.all([
    getReceipts(),
    getWarehouses(),
  ])
  
  return <ReceiptsClient initialReceipts={receipts} warehouses={warehouses} />
}
