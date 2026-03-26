import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/whatsapp';
import type { Product, Restaurant } from '../../types';

interface Props {
  product: Product;
  restaurant: Restaurant;
  cartQuantity: number;
  onAdd: (product: Product, qty: number, notes: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onClose: () => void;
}

export default function ProductBottomSheet({ product, restaurant, cartQuantity, onAdd, onUpdateQty, onClose }: Props) {
  const [qty, setQty] = useState(cartQuantity > 0 ? cartQuantity : 1);
  const [notes, setNotes] = useState('');

  function handleAdd() {
    if (cartQuantity > 0) {
      onUpdateQty(product.id, qty);
    } else {
      onAdd(product, qty, notes);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Imagem */}
        {product.image ? (
          <div className="relative h-52 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <div
            className="relative h-36 flex-shrink-0 flex items-center justify-center text-6xl"
            style={{ backgroundColor: `${restaurant.primaryColor}15` }}
          >
            🍽️
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          {product.description && (
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{product.description}</p>
          )}
          <p className="text-2xl font-extrabold mt-3" style={{ color: restaurant.primaryColor }}>
            {formatCurrency(product.price * qty, restaurant.currency)}
          </p>

          {/* Observações */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Alguma observação?
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-gray-300 resize-none"
              placeholder="Ex: sem cebola, bem passado..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-4">
          {/* Qty */}
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-1.5">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-base font-bold text-gray-800 w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm shadow-md transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: restaurant.primaryColor }}
          >
            {cartQuantity > 0 ? 'Atualizar pedido' : 'Adicionar'} · {formatCurrency(product.price * qty, restaurant.currency)}
          </button>
        </div>
      </div>
    </div>
  );
}
