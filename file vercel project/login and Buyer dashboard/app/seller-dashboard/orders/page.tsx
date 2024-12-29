import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SellerOrders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search orders..." />
        <Button variant="secondary">Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">#1234</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>2023-06-01</TableCell>
            <TableCell><Badge>Shipped</Badge></TableCell>
            <TableCell>$99.99</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">View</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">#1235</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>2023-06-02</TableCell>
            <TableCell><Badge variant="outline">Processing</Badge></TableCell>
            <TableCell>$149.99</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">View</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

