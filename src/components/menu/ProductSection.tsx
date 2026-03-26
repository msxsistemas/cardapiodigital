import { ProductListItem } from './ProductListItem';
import type { Product, Category, Restaurant } from '../../types';

interface Props {
  products: Product[];
  categories: Category[];
  restaurant: Restaurant;
  cartItems: { productId: string; quantity: number }[];
  onProductClick: (product: Product) => void;
}

export function ProductSection({ products, categories, restaurant, cartItems, onProductClick }: Props) {
  return (
    <div>
      {categories.map(cat => {
        const catProducts = products
          .filter(p => p.categoryId === cat.id)
          .sort((a, b) => a.order - b.order);
        if (catProducts.length === 0) return null;

        return (
          <div key={cat.id} id={`category-${cat.id}`} className="bg-white mb-2">
            {/* Header da seção */}
            <div className="px-4 pt-5 pb-2">
              <h2 className="text-[16px] font-extrabold text-gray-900">
                {cat.name}
                <span className="text-gray-400 font-semibold text-[14px] ml-1.5">
                  ({catProducts.length})
                </span>
              </h2>
              {cat.description && (
                <p className="text-[12px] text-gray-400 mt-0.5">{cat.description}</p>
              )}
            </div>

            {/* Produtos */}
            {catProducts.map((product, idx) => (
              <div key={product.id}>
                <ProductListItem
                  product={product}
                  restaurant={restaurant}
                  cartQuantity={cartItems.find(i => i.productId === product.id)?.quantity || 0}
                  onProductClick={onProductClick}
                />
                {idx < catProducts.length - 1 && (
                  <div className="mx-4 border-b border-gray-100" />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
