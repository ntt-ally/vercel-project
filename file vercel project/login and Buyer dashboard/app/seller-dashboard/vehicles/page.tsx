import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SellerVehicles() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <Button>Add Vehicle</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search vehicles..." />
        <Button variant="secondary">Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>License Plate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">V001</TableCell>
            <TableCell>Truck</TableCell>
            <TableCell>ABC123</TableCell>
            <TableCell><Badge variant="success">In Service</Badge></TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost" className="text-red-500">Delete</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">V002</TableCell>
            <TableCell>Van</TableCell>
            <TableCell>XYZ789</TableCell>
            <TableCell><Badge variant="warning">Maintenance</Badge></TableCell>
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

