import { useState } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/whatsapp';
import type { Product, Restaurant } from '../../types';

interface Props {
  product: Product;
  restaurant: Restaurant;
  cartQuantity: number;
  onAdd: (product: Product, qty: number, notes: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  highlighted?: boolean;
}

export default function ProductCard({ product, restaurant, cartQuantity, onAdd, onUpdateQty, highlighted }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');

  if (!product.available) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden flex gap-0 opacity-50 shadow-sm">
        <div className="flex-1 p-4">
          <p className="font-semibold text-gray-600 text-sm">{product.name}</p>
          {product.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
          )}
          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
            Indisponível
          </span>
        </div>
        {product.image && (
          <div className="w-24 h-24 flex-shrink-0 self-center mr-3">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl grayscale" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
        highlighted ? 'ring-2' : ''
      }`}
      style={highlighted ? { boxShadow: `0 0 0 2px ${restaurant.primaryColor}40` } : {}}
    >
      <button className="w-full text-left" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-stretch gap-0">
          {/* Left: info */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
              {highlighted && product.featured && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: `${restaurant.primaryColor}15`, color: restaurant.primaryColor }}
                >
                  <Star size={10} className="fill-current" />
                  Destaque
                </span>
              )}
              <p className="font-bold text-gray-900 text-sm leading-snug">{product.name}</p>
              {product.description && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="font-extrabold text-base" style={{ color: restaurant.primaryColor }}>
                {formatCurrency(product.price, restaurant.currency)}
              </span>

              {/* Controls or Add button */}
              {cartQuantity > 0 ? (
                <div
                  className="flex items-center gap-2 rounded-xl px-1 py-0.5"
                  style={{ backgroundColor: `${restaurant.primaryColor}12` }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => onUpdateQty(product.id, cartQuantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: restaurant.primaryColor }}
                  >
                    <Minus size={13} />
                  </button>
                  <span
                    className="text-sm font-bold w-5 text-center"
                    style={{ color: restaurant.primaryColor }}
                  >
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(product.id, cartQuantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: restaurant.primaryColor }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); onAdd(product, 1, ''); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm transition-all hover:brightness-110 active:scale-90"
                  style={{ backgroundColor: restaurant.primaryColor }}
                >
                  <Plus size={17} />
                </button>
              )}
            </div>
          </div>

          {/* Right: image */}
          {product.image ? (
            <div className="w-28 flex-shrink-0 self-stretch relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ minHeight: 100 }}
              />
              {product.featured && !highlighted && (
                <div className="absolute top-2 left-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400 drop-shadow" />
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-28 flex-shrink-0 self-stretch flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${restaurant.primaryColor}10, ${restaurant.primaryColor}05)` }}
            >
              🍽️
            </div>
          )}
        </div>
      </button>

      {/* Obs expandable */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-0 border-t"
          style={{ borderColor: `${restaurant.primaryColor}20` }}
          onClick={e => e.stopPropagation()}
        >
          <div className="pt-3">
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && cartQuantity === 0) {
                  onAdd(product, 1, notes);
                  setNotes('');
                  setExpanded(false);
                }
              }}
              placeholder="Alguma observação? Ex: sem cebola..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-gray-50 placeholder:text-gray-300"
            />
            {notes && cartQuantity === 0 && (
              <button
                onClick={() => { onAdd(product, 1, notes); setNotes(''); setExpanded(false); }}
                className="mt-2 w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                Adicionar com obs.
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
