import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SellerInvoices() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Button>Create Invoice</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search invoices..." />
        <Button variant="secondary">Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">#INV-001</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>2023-06-01</TableCell>
            <TableCell>$99.99</TableCell>
            <TableCell><Badge variant="success">Paid</Badge></TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">View</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">#INV-002</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>2023-06-02</TableCell>
            <TableCell>$149.99</TableCell>
            <TableCell><Badge variant="warning">Pending</Badge></TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">View</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

