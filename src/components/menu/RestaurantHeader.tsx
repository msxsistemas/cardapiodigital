import { Search, ChefHat, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/whatsapp';
import type { Restaurant } from '../../types';

interface Props {
  restaurant: Restaurant;
  onSearchClick: () => void;
}

export function RestaurantHeader({ restaurant, onSearchClick }: Props) {
  return (
    <div>
      {/* ── Banner ── */}
      <div
        className="relative h-40 w-full overflow-hidden"
        style={{ backgroundColor: restaurant.primaryColor }}
      >
        {restaurant.bannerImage ? (
          <img
            src={restaurant.bannerImage}
            alt="banner"
            className="w-full h-full object-cover"
          />
        ) : restaurant.logo ? (
          /* Se não tem banner mas tem logo, usa logo como fundo desfocado */
          <img
            src={restaurant.logo}
            alt="banner"
            className="w-full h-full object-cover scale-110 blur-sm opacity-60"
          />
        ) : null}

        {/* Botão de busca */}
        <button
          onClick={onSearchClick}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <Search size={16} className="text-gray-700" />
        </button>
      </div>

      {/* ── Card de informações (sobrepõe o banner) ── */}
      <div className="relative -mt-5 mx-3 z-10">
        {/* Logo centralizada, sobrepondo o banner */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <div
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: restaurant.logo ? 'transparent' : restaurant.primaryColor }}
          >
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ChefHat size={30} className="text-white" />
            )}
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 pt-12 pb-4 px-4">
          {/* Nome + dot + seta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-extrabold text-gray-900 text-[16px] leading-tight truncate">
                {restaurant.name}
              </h1>
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  restaurant.isOpen ? 'bg-green-500' : 'bg-red-400'
                }`}
              />
            </div>
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
          </div>

          {/* Delivery */}
          <p className="text-gray-500 text-[13px] mt-0.5">Delivery</p>

          {/* Linha de detalhes */}
          <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-2 flex-wrap">
            <span>Padrão</span>
            <span className="text-gray-300 mx-0.5">·</span>
            <span>30-45 min</span>
            {restaurant.deliveryFee > 0 && (
              <>
                <span className="text-gray-300 mx-0.5">·</span>
                <span>Entrega {formatCurrency(restaurant.deliveryFee, restaurant.currency)}</span>
              </>
            )}
            {restaurant.minOrder > 0 && (
              <>
                <span className="text-gray-300 mx-0.5">·</span>
                <span>Mín. {formatCurrency(restaurant.minOrder, restaurant.currency)}</span>
              </>
            )}
          </div>

          {/* Status aberto/fechado */}
          <p
            className="text-[12px] font-semibold mt-1.5"
            style={{ color: restaurant.isOpen ? '#16a34a' : '#dc2626' }}
          >
            {restaurant.isOpen
              ? `Aberta${restaurant.openingHours ? `, fecha às ${extractClosingHour(restaurant.openingHours)}` : ''}`
              : 'Fechada no momento'}
          </p>
        </div>
      </div>

      {/* Espaço após o card */}
      <div className="h-3" />
    </div>
  );
}

/** Extrai o horário de fechamento do campo de texto */
function extractClosingHour(openingHours: string): string {
  // Tenta pegar algo como "22h", "23:00", "22:00"
  const match = openingHours.match(/(\d{1,2}[h:]\d{0,2})\s*$/);
  if (match) return match[1];
  // Se tiver "|" separa o primeiro segmento
  const first = openingHours.split('|')[0].trim();
  const last = first.split('-').pop()?.trim() || openingHours;
  return last;
}
