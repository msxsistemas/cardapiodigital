import type { Product, Restaurant } from '../../types';
import { formatCurrency } from '../../utils/whatsapp';

interface Props {
  product: Product;
  restaurant: Restaurant;
  cartQuantity: number;
  onClick: () => void;
}

export default function ProductRow({ product, restaurant, cartQuantity, onClick }: Props) {
  return (
    <button
      className="w-full text-left flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
      onClick={onClick}
      disabled={!product.available}
    >
      {/* Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-0.5">
          {product.featured && (
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#fff0e6', color: '#e85d04' }}
            >
              O mais pedido
            </span>
          )}
        </div>
        <p className={`font-bold text-[15px] leading-snug ${!product.available ? 'text-gray-400' : 'text-gray-900'}`}>
          {product.name}
        </p>
        {product.description && (
          <p className="text-gray-500 text-[13px] mt-0.5 leading-snug line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <p className={`font-bold text-[15px] ${!product.available ? 'text-gray-400' : 'text-gray-900'}`}>
            {formatCurrency(product.price, restaurant.currency)}
          </p>
          {!product.available && (
            <span className="text-xs text-gray-400">Indisponível</span>
          )}
          {cartQuantity > 0 && product.available && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
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
            className={`w-full h-full object-cover ${!product.available ? 'grayscale opacity-50' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100">
            🍽️
          </div>
        )}
      </div>
    </button>
  );
}
