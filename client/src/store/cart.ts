import { create } from 'zustand'
import type { Product } from '@/lib/products'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { items: [...state.items, { product, quantity: 1 }] }
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((item) => item.product.id !== productId)
        : state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
    })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: () => 0,
}))
