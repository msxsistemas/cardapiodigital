import { useState, useCallback } from 'react';
import type { CartItem, Product } from '../types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1, notes = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.notes === notes);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.notes === notes
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, notes, selectedOptions: {} }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev =>
      quantity <= 0
        ? prev.filter(i => i.product.id !== productId)
        : prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, updateQuantity, removeItem, clearCart, total, count };
}
