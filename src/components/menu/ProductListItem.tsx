import { formatCurrency } from '../../utils/whatsapp';
import type { Product, Restaurant } from '../../types';

interface Props {
  product: Product;
  restaurant: Restaurant;
  cartQuantity: number;
  onProductClick: (product: Product) => void;
}

export function ProductListItem({ product, restaurant, cartQuantity, onProductClick }: Props) {
  return (
    <button
      className="w-full text-left flex items-center gap-4 px-4 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
      onClick={() => onProductClick(product)}
      disabled={!product.available}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        {product.featured && (
          <span
            className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-1"
            style={{ backgroundColor: '#fff3e0', color: '#e65100' }}
          >
            O mais pedido
          </span>
        )}
        <p className={`font-bold text-[14px] leading-snug ${!product.available ? 'text-gray-400' : 'text-gray-900'}`}>
          {product.name}
        </p>
        {product.description && (
          <p className="text-gray-500 text-[12px] mt-0.5 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <p className={`font-bold text-[14px] ${!product.available ? 'text-gray-400' : 'text-gray-900'}`}>
            {formatCurrency(product.price, restaurant.currency)}
          </p>
          {!product.available && (
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Indisponível
            </span>
          )}
          {cartQuantity > 0 && product.available && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              {cartQuantity} no pedido
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${!product.available ? 'grayscale opacity-60' : ''}`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${restaurant.primaryColor}10` }}
          >
            🍽️
          </div>
        )}
      </div>
    </button>
  );
}
