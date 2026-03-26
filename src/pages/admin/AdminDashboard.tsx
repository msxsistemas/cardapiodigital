import { ShoppingBag, Tag, ToggleLeft, ToggleRight, Star, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useStore } from '../../hooks/useStore';
import { formatCurrency } from '../../utils/whatsapp';

export default function AdminDashboard() {
  const { data, updateRestaurant } = useStore();
  const { restaurant, categories, products } = data;

  const activeProducts = products.filter(p => p.available);
  const featuredProducts = products.filter(p => p.featured);
  const activeCategories = categories.filter(c => c.active);

  function toggleOpen() {
    updateRestaurant({ ...restaurant, isOpen: !restaurant.isOpen });
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Visão geral do seu cardápio</p>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
            <ExternalLink size={16} />
            Ver cardápio
          </a>
        </div>

        {/* Status do restaurante */}
        <div className={`rounded-xl p-5 flex items-center justify-between ${restaurant.isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div>
            <p className="font-semibold text-gray-800">{restaurant.name}</p>
            <p className={`text-sm font-medium ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
              {restaurant.isOpen ? '🟢 Aberto para pedidos' : '🔴 Fechado no momento'}
            </p>
          </div>
          <button
            onClick={toggleOpen}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              restaurant.isOpen ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {restaurant.isOpen ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
            {restaurant.isOpen ? 'Fechar' : 'Abrir'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<ShoppingBag size={20} className="text-blue-500" />} label="Total de Produtos" value={products.length} bg="bg-blue-50" />
          <StatCard icon={<ToggleRight size={20} className="text-green-500" />} label="Disponíveis" value={activeProducts.length} bg="bg-green-50" />
          <StatCard icon={<Tag size={20} className="text-purple-500" />} label="Categorias" value={activeCategories.length} bg="bg-purple-50" />
          <StatCard icon={<Star size={20} className="text-yellow-500" />} label="Em Destaque" value={featuredProducts.length} bg="bg-yellow-50" />
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Produtos em destaque */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              Produtos em Destaque
            </h2>
            {featuredProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum produto em destaque.</p>
            ) : (
              <div className="space-y-2">
                {featuredProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{p.name}</span>
                    <span className="font-medium text-green-600">{formatCurrency(p.price, restaurant.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-purple-500" />
              Categorias Ativas
            </h2>
            {activeCategories.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhuma categoria ativa.</p>
            ) : (
              <div className="space-y-2">
                {activeCategories.map(c => {
                  const count = products.filter(p => p.categoryId === c.id).length;
                  return (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{c.icon} {c.name}</span>
                      <span className="text-gray-500">{count} produto(s)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info restaurante */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Informações do Restaurante</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div><span className="font-medium">WhatsApp:</span> {restaurant.whatsapp}</div>
            <div><span className="font-medium">Entrega:</span> {formatCurrency(restaurant.deliveryFee, restaurant.currency)}</div>
            <div><span className="font-medium">Pedido mínimo:</span> {formatCurrency(restaurant.minOrder, restaurant.currency)}</div>
            <div><span className="font-medium">Horário:</span> {restaurant.openingHours}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
