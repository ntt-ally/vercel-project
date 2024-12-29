"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-700/20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome to BuyerHub</h1>
        <p className="text-xl mb-8 text-muted-foreground">Your one-stop shop for all your needs</p>
        <Button asChild size="lg" className="font-semibold">
          <Link href="/products/all">Start Shopping</Link>
        </Button>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </main>
  )
}

