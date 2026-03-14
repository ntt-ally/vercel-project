import { getMoveHistory, getProducts } from "@/lib/actions"
import { HistoryClient } from "./history-client"

export default async function MoveHistoryPage() {
  const [moveHistory, products] = await Promise.all([
    getMoveHistory(),
    getProducts(),
  ])
  
  return <HistoryClient initialHistory={moveHistory} products={products} />
}
