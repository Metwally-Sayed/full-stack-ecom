import { create } from 'zustand';
import type { CartItem } from '@/types/cart';
import type { Product } from '@/types/product';

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find((i) => i.product.id === product.id);
    if (existing) {
      set((s) => ({
        items: s.items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      }));
    } else {
      set((s) => ({ items: [...s.items, { product, quantity: 1 }] }));
    }
  },

  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),

  increaseQuantity: (productId) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),

  decreaseQuantity: (productId) => {
    const item = get().items.find((i) => i.product.id === productId);
    if (!item) return;
    if (item.quantity <= 1) {
      set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) }));
    } else {
      set((s) => ({
        items: s.items.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      }));
    }
  },

  setQuantity: (productId, quantity) => {
    if (quantity < 1) {
      set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) }));
    } else {
      set((s) => ({
        items: s.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i,
        ),
      }));
    }
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
