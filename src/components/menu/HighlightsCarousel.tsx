import { formatCurrency } from '../../utils/whatsapp';
import type { Product, Restaurant } from '../../types';

interface Props {
  products: Product[];
  restaurant: Restaurant;
  onProductClick: (product: Product) => void;
}

export function HighlightsCarousel({ products, restaurant, onProductClick }: Props) {
  const highlights = products.filter(p => p.featured && p.available);
  if (highlights.length === 0) return null;

  return (
    <div className="bg-white pt-5 pb-4 mb-2">
      <h2 className="px-4 text-[16px] font-extrabold text-gray-900 mb-3">
        Mais pedidos
        <span className="text-gray-400 font-semibold text-[14px] ml-1.5">({highlights.length})</span>
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {highlights.map(product => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex-shrink-0 w-32 text-left group"
          >
            <div className="w-32 h-24 rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${restaurant.primaryColor}15` }}
                >
                  🍽️
                </div>
              )}
              <div
                className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                #{highlights.indexOf(product) + 1}
              </div>
            </div>
            <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: restaurant.primaryColor }}>
              {formatCurrency(product.price, restaurant.currency)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
