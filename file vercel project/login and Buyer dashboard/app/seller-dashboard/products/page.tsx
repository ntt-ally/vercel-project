import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SellerProducts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button>Add Product</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search products..." />
        <Button variant="secondary">Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <img src="/placeholder.svg" alt="Product" className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell className="font-medium">Fine Sand</TableCell>
            <TableCell>$19.99</TableCell>
            <TableCell>100</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost" className="text-red-500">Delete</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <img src="/placeholder.svg" alt="Product" className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell className="font-medium">Coarse Grit</TableCell>
            <TableCell>$24.99</TableCell>
            <TableCell>75</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost" className="text-red-500">Delete</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

