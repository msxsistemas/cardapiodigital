import { useState } from 'react';
import { Minus, Plus, Trash2, MessageCircle, ChevronLeft, Bike, Store } from 'lucide-react';
import { buildWhatsAppMessage, openWhatsApp, formatCurrency } from '../../utils/whatsapp';
import type { CartItem, Restaurant } from '../../types';

interface Props {
  items: CartItem[];
  restaurant: Restaurant;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  total: number;
}

export default function Cart({ items, restaurant, onUpdateQuantity, onRemove, onClear, onClose, total }: Props) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const deliveryFee = orderType === 'delivery' ? restaurant.deliveryFee : 0;
  const finalTotal = total + deliveryFee;
  const belowMin = total < restaurant.minOrder && restaurant.minOrder > 0;

  function handleSendOrder() {
    if (!customerName.trim()) return;
    const message = buildWhatsAppMessage(items, restaurant, customerName, customerNotes, orderType);
    openWhatsApp(restaurant.whatsapp, message);
    onClear();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f5] flex flex-col pb-0">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <button
          onClick={step === 'checkout' ? () => setStep('cart') : onClose}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 text-base">
            {step === 'cart' ? 'Carrinho' : 'Finalizar pedido'}
          </h1>
          <p className="text-xs text-gray-400">
            {step === 'cart'
              ? `${items.length} item${items.length !== 1 ? 's' : ''} · ${restaurant.name}`
              : restaurant.name}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty cart */
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-20">
          <div className="text-5xl">🛒</div>
          <p className="text-gray-600 font-semibold">Seu carrinho está vazio</p>
          <p className="text-gray-400 text-sm">Adicione itens do cardápio</p>
          <button
            onClick={onClose}
            className="mt-3 px-6 py-2.5 rounded-full font-semibold text-white text-sm"
            style={{ backgroundColor: restaurant.primaryColor }}
          >
            Ver cardápio
          </button>
        </div>
      ) : step === 'cart' ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {/* Items */}
            <div className="bg-white mt-2 divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 px-4 py-4">
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-snug">{item.product.name}</p>
                    {item.notes && (
                      <p className="text-gray-400 text-xs italic mt-0.5">"{item.notes}"</p>
                    )}
                    <p className="font-bold text-sm mt-1" style={{ color: restaurant.primaryColor }}>
                      {formatCurrency(item.product.price * item.quantity, restaurant.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-1 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: restaurant.primaryColor }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white mt-2 px-4 py-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Resumo do pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">{formatCurrency(total, restaurant.currency)}</span>
                </div>
                {restaurant.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxa de entrega</span>
                    <span className="font-medium text-gray-700">{formatCurrency(restaurant.deliveryFee, restaurant.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-4 py-4 space-y-3">
            {belowMin && (
              <div className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-100">
                Pedido mínimo: <strong>{formatCurrency(restaurant.minOrder, restaurant.currency)}</strong>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-xl" style={{ color: restaurant.primaryColor }}>
                {formatCurrency(total + restaurant.deliveryFee, restaurant.currency)}
              </span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              disabled={belowMin}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {/* Tipo */}
            <div className="bg-white mt-2 px-4 py-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Como deseja receber?</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['delivery', 'pickup'] as const).map(type => {
                  const active = orderType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all"
                      style={active
                        ? { borderColor: restaurant.primaryColor, backgroundColor: `${restaurant.primaryColor}10` }
                        : { borderColor: '#e5e7eb', backgroundColor: '#fff' }
                      }
                    >
                      {type === 'delivery'
                        ? <Bike size={22} style={{ color: active ? restaurant.primaryColor : '#9ca3af' }} />
                        : <Store size={22} style={{ color: active ? restaurant.primaryColor : '#9ca3af' }} />
                      }
                      <span className="text-sm font-semibold" style={{ color: active ? restaurant.primaryColor : '#6b7280' }}>
                        {type === 'delivery' ? 'Entrega' : 'Retirada'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resumo final */}
            <div className="bg-white mt-2 px-4 py-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Resumo</h3>
              <div className="space-y-1.5">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm text-gray-500">
                    <span className="flex-1 truncate mr-2">{item.quantity}× {item.product.name}</span>
                    <span className="font-medium text-gray-700 flex-shrink-0">
                      {formatCurrency(item.product.price * item.quantity, restaurant.currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total, restaurant.currency)}</span>
                </div>
                {orderType === 'delivery' && restaurant.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Entrega</span>
                    <span>{formatCurrency(restaurant.deliveryFee, restaurant.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-base pt-1">
                  <span className="text-gray-900">Total</span>
                  <span style={{ color: restaurant.primaryColor }}>{formatCurrency(finalTotal, restaurant.currency)}</span>
                </div>
              </div>
            </div>

            {/* Dados */}
            <div className="bg-white mt-2 px-4 py-4 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Seus dados</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Seu nome *
                </label>
                <input
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Observações
                </label>
                <textarea
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                  placeholder="Endereço, troco, informações extras..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <button
              onClick={handleSendOrder}
              disabled={!customerName.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-sm shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#25d366' }}
            >
              <MessageCircle size={19} />
              Enviar pedido pelo WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
}
