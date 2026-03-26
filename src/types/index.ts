export interface Restaurant {
  name: string;
  description: string;
  logo: string;
  bannerImage: string;
  whatsapp: string;
  primaryColor: string;
  accentColor: string;
  adminPassword: string;
  address: string;
  openingHours: string;
  isOpen: boolean;
  deliveryFee: number;
  minOrder: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  order: number;
  options?: ProductOption[];
}

export interface ProductOption {
  id: string;
  name: string;
  choices: OptionChoice[];
  required: boolean;
  multiple: boolean;
}

export interface OptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
  selectedOptions: Record<string, string[]>;
}

export interface StoreData {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
}
