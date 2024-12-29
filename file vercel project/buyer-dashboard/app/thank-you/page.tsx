import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="mb-8">Your order has been received and is being processed.</p>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  )
}

