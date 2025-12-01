import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
        } else {
          set({
            items: [...items, {
              ...item,
              quantity: 1,
              addedAt: new Date().toISOString()
            }]
          });
        }
        
        return true;
      },

      // Remove item from cart
      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== itemId) });
      },

      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          set({ items: items.filter(item => item.id !== itemId) });
        } else {
          set({
            items: items.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            )
          });
        }
      },

      // Get cart total
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let price = 0;
          if (typeof item.price === 'string') {
            price = parseFloat(item.price.replace(/[^\d.]/g, ''));
          } else if (typeof item.price === 'number') {
            price = item.price;
          }
          return total + (price * item.quantity);
        }, 0);
      },

      // Get cart item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'eventra-cart-storage',
    }
  )
);
