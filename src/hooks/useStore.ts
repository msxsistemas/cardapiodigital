import { useState, useCallback } from 'react';
import { loadData, saveData, generateId } from '../utils/storage';
import type { StoreData, Restaurant, Category, Product } from '../types';

export function useStore() {
  const [data, setData] = useState<StoreData>(() => loadData());

  const update = useCallback((newData: StoreData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // Restaurant
  const updateRestaurant = useCallback((restaurant: Restaurant) => {
    update({ ...data, restaurant });
  }, [data, update]);

  // Categories
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCat: Category = { ...category, id: generateId() };
    update({ ...data, categories: [...data.categories, newCat] });
  }, [data, update]);

  const updateCategory = useCallback((id: string, changes: Partial<Category>) => {
    update({
      ...data,
      categories: data.categories.map(c => c.id === id ? { ...c, ...changes } : c),
    });
  }, [data, update]);

  const deleteCategory = useCallback((id: string) => {
    update({
      ...data,
      categories: data.categories.filter(c => c.id !== id),
      products: data.products.filter(p => p.categoryId !== id),
    });
  }, [data, update]);

  const reorderCategories = useCallback((categories: Category[]) => {
    update({ ...data, categories });
  }, [data, update]);

  // Products
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProd: Product = { ...product, id: generateId() };
    update({ ...data, products: [...data.products, newProd] });
  }, [data, update]);

  const updateProduct = useCallback((id: string, changes: Partial<Product>) => {
    update({
      ...data,
      products: data.products.map(p => p.id === id ? { ...p, ...changes } : p),
    });
  }, [data, update]);

  const deleteProduct = useCallback((id: string) => {
    update({ ...data, products: data.products.filter(p => p.id !== id) });
  }, [data, update]);

  return {
    data,
    updateRestaurant,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
