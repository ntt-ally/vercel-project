import { LightbulbIcon as LucideProps, User, ShoppingCart, Menu } from 'lucide-react'

export type Icon = React.FC<LucideProps>

export const Icons = {
  user: User,
  cart: ShoppingCart,
  logo: Menu,
  // Add more icons as needed
}

