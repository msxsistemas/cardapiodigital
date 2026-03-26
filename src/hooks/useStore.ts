import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { StoreData, Restaurant, Category, Product } from '../types';

const defaultRestaurant: Restaurant = {
  name: 'Meu Restaurante',
  description: '',
  logo: '',
  bannerImage: '',
  whatsapp: '',
  primaryColor: '#e63946',
  accentColor: '#f4a261',
  adminPassword: 'admin123',
  address: '',
  openingHours: '',
  isOpen: true,
  deliveryFee: 0,
  minOrder: 0,
  currency: 'R$',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRestaurant(row: any): Restaurant {
  return {
    name: row.name ?? '',
    description: row.description ?? '',
    logo: row.logo ?? '',
    bannerImage: row.banner_image ?? '',
    whatsapp: row.whatsapp ?? '',
    primaryColor: row.primary_color ?? '#e63946',
    accentColor: row.accent_color ?? '#f4a261',
    adminPassword: row.admin_password ?? 'admin123',
    address: row.address ?? '',
    openingHours: row.opening_hours ?? '',
    isOpen: row.is_open ?? true,
    deliveryFee: Number(row.delivery_fee ?? 0),
    minOrder: Number(row.min_order ?? 0),
    currency: row.currency ?? 'R$',
  };
}

function restaurantToDb(r: Restaurant) {
  return {
    name: r.name,
    description: r.description,
    logo: r.logo,
    banner_image: r.bannerImage,
    whatsapp: r.whatsapp,
    primary_color: r.primaryColor,
    accent_color: r.accentColor,
    admin_password: r.adminPassword,
    address: r.address,
    opening_hours: r.openingHours,
    is_open: r.isOpen,
    delivery_fee: r.deliveryFee,
    min_order: r.minOrder,
    currency: r.currency,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name ?? '',
    description: row.description ?? '',
    icon: row.icon ?? '🍽️',
    order: row.order ?? 0,
    active: row.active ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any): Product {
  return {
    id: row.id,
    categoryId: row.category_id ?? '',
    name: row.name ?? '',
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    image: row.image ?? '',
    available: row.available ?? true,
    featured: row.featured ?? false,
    order: row.order ?? 0,
  };
}

export function useStore() {
  const [data, setData] = useState<StoreData>({
    restaurant: defaultRestaurant,
    categories: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [restRes, catRes, prodRes] = await Promise.all([
      supabase.from('restaurant').select('*').single(),
      supabase.from('categories').select('*').order('order'),
      supabase.from('products').select('*').order('order'),
    ]);
    setData({
      restaurant: restRes.data ? mapRestaurant(restRes.data) : defaultRestaurant,
      categories: (catRes.data ?? []).map(mapCategory),
      products: (prodRes.data ?? []).map(mapProduct),
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Restaurant ──
  const updateRestaurant = useCallback(async (restaurant: Restaurant) => {
    setData(prev => ({ ...prev, restaurant }));
    await supabase.from('restaurant').update(restaurantToDb(restaurant)).eq('id', 1);
  }, []);

  // ── Categories ──
  const addCategory = useCallback(async (cat: Omit<Category, 'id'>) => {
    const { data: row } = await supabase
      .from('categories')
      .insert({ name: cat.name, description: cat.description, icon: cat.icon, active: cat.active, order: cat.order })
      .select().single();
    if (row) setData(prev => ({ ...prev, categories: [...prev.categories, mapCategory(row)] }));
  }, []);

  const updateCategory = useCallback(async (id: string, changes: Partial<Category>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db: any = {};
    if (changes.name !== undefined) db.name = changes.name;
    if (changes.description !== undefined) db.description = changes.description;
    if (changes.icon !== undefined) db.icon = changes.icon;
    if (changes.active !== undefined) db.active = changes.active;
    if (changes.order !== undefined) db.order = changes.order;
    setData(prev => ({ ...prev, categories: prev.categories.map(c => c.id === id ? { ...c, ...changes } : c) }));
    await supabase.from('categories').update(db).eq('id', id);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      products: prev.products.filter(p => p.categoryId !== id),
    }));
    await supabase.from('categories').delete().eq('id', id);
  }, []);

  const reorderCategories = useCallback(async (categories: Category[]) => {
    setData(prev => ({ ...prev, categories }));
    await Promise.all(categories.map(c => supabase.from('categories').update({ order: c.order }).eq('id', c.id)));
  }, []);

  // ── Products ──
  const addProduct = useCallback(async (prod: Omit<Product, 'id'>) => {
    const { data: row } = await supabase
      .from('products')
      .insert({
        category_id: prod.categoryId,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        image: prod.image,
        available: prod.available,
        featured: prod.featured,
        order: prod.order,
      })
      .select().single();
    if (row) setData(prev => ({ ...prev, products: [...prev.products, mapProduct(row)] }));
  }, []);

  const updateProduct = useCallback(async (id: string, changes: Partial<Product>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db: any = {};
    if (changes.categoryId !== undefined) db.category_id = changes.categoryId;
    if (changes.name !== undefined) db.name = changes.name;
    if (changes.description !== undefined) db.description = changes.description;
    if (changes.price !== undefined) db.price = changes.price;
    if (changes.image !== undefined) db.image = changes.image;
    if (changes.available !== undefined) db.available = changes.available;
    if (changes.featured !== undefined) db.featured = changes.featured;
    if (changes.order !== undefined) db.order = changes.order;
    setData(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? { ...p, ...changes } : p) }));
    await supabase.from('products').update(db).eq('id', id);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    await supabase.from('products').delete().eq('id', id);
  }, []);

  return {
    data,
    loading,
    refetch: fetchAll,
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
