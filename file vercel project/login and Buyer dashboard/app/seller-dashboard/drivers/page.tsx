import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SellerDrivers() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <Button>Add Driver</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search drivers..." />
        <Button variant="secondary">Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <img src="/placeholder.svg" alt="Avatar" className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell className="font-medium">Mike Johnson</TableCell>
            <TableCell>mike@example.com</TableCell>
            <TableCell>555-1234</TableCell>
            <TableCell><Badge variant="success">Active</Badge></TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost" className="text-red-500">Delete</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <img src="/placeholder.svg" alt="Avatar" className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell className="font-medium">Sarah Lee</TableCell>
            <TableCell>sarah@example.com</TableCell>
            <TableCell>555-5678</TableCell>
            <TableCell><Badge variant="warning">On Leave</Badge></TableCell>
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

