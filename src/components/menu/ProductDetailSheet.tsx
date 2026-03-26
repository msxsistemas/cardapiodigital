import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/whatsapp';
import type { Product, Restaurant } from '../../types';

interface Props {
  product: Product | null;
  restaurant: Restaurant;
  isOpen: boolean;
  cartQuantity: number;
  onAdd: (product: Product, qty: number, notes: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function ProductDetailSheet({
  product, restaurant, isOpen, cartQuantity, onAdd, onUpdateQty, onClose, disabled
}: Props) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !product) return null;

  function handleAdd() {
    if (!product) return;
    if (cartQuantity > 0) {
      onUpdateQty(product.id, qty);
    } else {
      onAdd(product, qty, notes);
    }
    onClose();
  }

  const total = product.price * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">

        {/* Imagem */}
        {product.image ? (
          <div className="relative h-56 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X size={17} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <div
            className="relative h-36 flex-shrink-0 flex items-center justify-center text-7xl"
            style={{ backgroundColor: `${restaurant.primaryColor}15` }}
          >
            🍽️
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X size={17} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Handle bar */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full" />

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {product.featured && (
            <span
              className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"
              style={{ backgroundColor: '#fff3e0', color: '#e65100' }}
            >
              O mais pedido
            </span>
          )}
          <h2 className="text-[20px] font-extrabold text-gray-900 leading-tight">{product.name}</h2>
          {product.description && (
            <p className="text-gray-500 text-[13px] mt-2 leading-relaxed">{product.description}</p>
          )}
          <p className="text-[22px] font-extrabold mt-3" style={{ color: restaurant.primaryColor }}>
            {formatCurrency(product.price, restaurant.currency)}
          </p>

          {/* Observações */}
          <div className="mt-5">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-2">
              Alguma observação?
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              disabled={disabled}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[13px] bg-gray-50 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none disabled:opacity-50"
              placeholder="Ex: sem cebola, bem passado..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 pt-3 border-t border-gray-100 flex items-center gap-3">
          {/* Quantidade */}
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-2 py-2">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-[16px] font-extrabold text-gray-900 w-7 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              disabled={disabled}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors disabled:opacity-40"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Botão de adicionar */}
          <button
            onClick={handleAdd}
            disabled={disabled}
            className="flex-1 py-3.5 rounded-2xl font-bold text-white text-[14px] shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: disabled ? '#9ca3af' : restaurant.primaryColor }}
          >
            {disabled
              ? 'Restaurante fechado'
              : cartQuantity > 0
                ? `Atualizar · ${formatCurrency(total, restaurant.currency)}`
                : `Adicionar · ${formatCurrency(total, restaurant.currency)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
