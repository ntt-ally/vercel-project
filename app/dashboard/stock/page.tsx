import { getProducts } from "@/lib/actions"
import { StockClient } from "./stock-client"

export default async function StockPage() {
  const products = await getProducts()
  
  return <StockClient initialProducts={products} />
}
