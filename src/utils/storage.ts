import type { StoreData, Restaurant, Category, Product } from '../types';

const STORAGE_KEY = 'cardapio_data';

const defaultRestaurant: Restaurant = {
  name: 'Meu Restaurante',
  description: 'Comida deliciosa para você!',
  logo: '',
  bannerImage: '',
  whatsapp: '5511999999999',
  primaryColor: '#e63946',
  accentColor: '#f4a261',
  adminPassword: 'admin123',
  address: 'Rua Exemplo, 123 - Centro',
  openingHours: 'Seg-Sex 11h-22h | Sáb-Dom 11h-23h',
  isOpen: true,
  deliveryFee: 5.0,
  minOrder: 20.0,
  currency: 'R$',
};

const defaultCategories: Category[] = [
  { id: 'cat1', name: 'Entradas', description: '', icon: '🥗', order: 0, active: true },
  { id: 'cat2', name: 'Pratos Principais', description: '', icon: '🍽️', order: 1, active: true },
  { id: 'cat3', name: 'Bebidas', description: '', icon: '🥤', order: 2, active: true },
  { id: 'cat4', name: 'Sobremesas', description: '', icon: '🍰', order: 3, active: true },
];

const defaultProducts: Product[] = [
  {
    id: 'p1', categoryId: 'cat1', name: 'Salada Caesar', description: 'Alface americana, croutons, parmesão e molho caesar especial.',
    price: 22.90, image: '', available: true, featured: false, order: 0,
  },
  {
    id: 'p2', categoryId: 'cat2', name: 'Filé Grelhado', description: 'Filé mignon grelhado ao ponto com acompanhamentos da casa.',
    price: 49.90, image: '', available: true, featured: true, order: 0,
  },
  {
    id: 'p3', categoryId: 'cat2', name: 'Frango ao Molho', description: 'Peito de frango grelhado com molho de ervas e arroz branco.',
    price: 39.90, image: '', available: true, featured: false, order: 1,
  },
  {
    id: 'p4', categoryId: 'cat3', name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná ou Sprite 350ml.',
    price: 6.00, image: '', available: true, featured: false, order: 0,
  },
  {
    id: 'p5', categoryId: 'cat3', name: 'Suco Natural', description: 'Laranja, limão ou maracujá 500ml.',
    price: 9.90, image: '', available: true, featured: false, order: 1,
  },
  {
    id: 'p6', categoryId: 'cat4', name: 'Pudim de Leite', description: 'Pudim caseiro com calda de caramelo.',
    price: 12.90, image: '', available: true, featured: true, order: 0,
  },
];

export function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreData;
      return {
        restaurant: { ...defaultRestaurant, ...parsed.restaurant },
        categories: parsed.categories || defaultCategories,
        products: parsed.products || defaultProducts,
      };
    }
  } catch {}
  return { restaurant: defaultRestaurant, categories: defaultCategories, products: defaultProducts };
}

export function saveData(data: StoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
