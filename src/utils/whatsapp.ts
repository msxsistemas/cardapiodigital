import type { CartItem, Restaurant } from '../types';

export function formatCurrency(value: number, currency = 'R$'): string {
  return `${currency} ${value.toFixed(2).replace('.', ',')}`;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  restaurant: Restaurant,
  customerName: string,
  customerNotes: string,
  orderType: 'delivery' | 'pickup'
): string {
  const lines: string[] = [];

  lines.push(`🍽️ *Novo Pedido - ${restaurant.name}*`);
  lines.push('');
  lines.push(`👤 *Cliente:* ${customerName}`);
  lines.push(`📦 *Tipo:* ${orderType === 'delivery' ? 'Entrega' : 'Retirada'}`);
  lines.push('');
  lines.push('*📋 Itens do Pedido:*');

  let subtotal = 0;

  items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    lines.push(`• ${item.quantity}x *${item.product.name}* — ${formatCurrency(itemTotal, restaurant.currency)}`);
    if (item.notes) {
      lines.push(`  _Obs: ${item.notes}_`);
    }
  });

  lines.push('');

  const deliveryFee = orderType === 'delivery' ? restaurant.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  lines.push(`💰 *Subtotal:* ${formatCurrency(subtotal, restaurant.currency)}`);
  if (orderType === 'delivery' && restaurant.deliveryFee > 0) {
    lines.push(`🛵 *Taxa de entrega:* ${formatCurrency(restaurant.deliveryFee, restaurant.currency)}`);
  }
  lines.push(`✅ *Total:* ${formatCurrency(total, restaurant.currency)}`);

  if (customerNotes) {
    lines.push('');
    lines.push(`📝 *Observações:* ${customerNotes}`);
  }

  lines.push('');
  lines.push('_Pedido enviado pelo cardápio digital_ 📱');

  return lines.join('\n');
}

export function openWhatsApp(phone: string, message: string): void {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${cleaned}?text=${encoded}`, '_blank');
}
