import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Warehouse,
  TrendingUp,
  Plus,
  Database,
  AlertCircle,
} from "lucide-react"
import { checkDatabaseConnection, getDashboardStats, getRecentMoves, getProducts, getReceipts, getDeliveries } from "@/lib/actions"

function DatabaseSetupPage({ error }: { error?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-lg w-full bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Database className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-foreground">Database Not Connected</CardTitle>
          <CardDescription className="text-base">
            CoreInventory requires a PostgreSQL database to function.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                Add your PostgreSQL connection string as an environment variable:
                <code className="block mt-2 p-2 bg-secondary rounded text-xs text-foreground font-mono">
                  DATABASE_URL=postgresql://user:password@host:5432/database
                </code>
              </li>
              <li>
                Run the schema SQL file to create the required tables:
                <code className="block mt-2 p-2 bg-secondary rounded text-xs text-foreground font-mono">
                  psql $DATABASE_URL -f scripts/schema.sql
                </code>
              </li>
              <li>Refresh this page after setting up the database.</li>
            </ol>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Check the <code className="text-primary">scripts/schema.sql</code> file for the required database schema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function DashboardPage() {
  const dbStatus = await checkDatabaseConnection()
  
  if (!dbStatus.configured || !dbStatus.connected) {
    return <DatabaseSetupPage error={dbStatus.error} />
  }

  const [stats, recentMoves, products, receipts, deliveries] = await Promise.all([
    getDashboardStats(),
    getRecentMoves(5),
    getProducts(),
    getReceipts(),
    getDeliveries(),
  ])

  const totalStock = products.reduce((sum, p) => sum + Number(p.on_hand), 0)
  const pendingReceipts = receipts.filter((r) => r.status !== "Done").length
  const pendingDeliveries = deliveries.filter((d) => d.status !== "Done").length

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Active SKUs in inventory",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Total Stock",
      value: totalStock.toLocaleString(),
      description: "Units across all products",
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      title: "Inventory Value",
      value: `$${stats.inventoryValue.toLocaleString()}`,
      description: "Total cost value",
      icon: Warehouse,
      color: "text-chart-3",
    },
    {
      title: "Active Moves",
      value: pendingReceipts + pendingDeliveries,
      description: `${pendingReceipts} receipts, ${pendingDeliveries} deliveries`,
      icon: History,
      color: "text-chart-4",
    },
  ]

  const productMap = new Map(products.map((p) => [p.id.toString(), p.name]))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your warehouse operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowDownToLine className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">Receipts</CardTitle>
                <CardDescription>Incoming inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending receipts</span>
              <span className="font-medium text-foreground">{pendingReceipts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total receipts</span>
              <span className="font-medium text-foreground">{receipts.length}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="flex-1">
                <Link href="/dashboard/receipts/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Receipt
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/receipts">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <ArrowUpFromLine className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">Deliveries</CardTitle>
                <CardDescription>Outgoing inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending deliveries</span>
              <span className="font-medium text-foreground">{pendingDeliveries}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total deliveries</span>
              <span className="font-medium text-foreground">{deliveries.length}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="flex-1 bg-chart-2 hover:bg-chart-2/90 text-foreground">
                <Link href="/dashboard/delivery/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Delivery
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/delivery">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Recent Move History</CardTitle>
          <CardDescription>Latest inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMoves.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No recent movements</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Reference
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      From
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      To
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentMoves.map((move) => (
                    <tr key={move.id} className="border-b border-border/50">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {move.reference}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {productMap.get(move.product_id?.toString()) || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{move.from_location}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{move.to_location}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{move.quantity}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            move.status === "Done"
                              ? "bg-primary/10 text-primary"
                              : "bg-chart-3/10 text-chart-3"
                          }`}
                        >
                          {move.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border">
            <Button asChild variant="ghost" className="w-full">
              <Link href="/dashboard/history">View All Move History</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
