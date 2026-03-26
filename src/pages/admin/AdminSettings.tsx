import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../hooks/useStore';
import type { Restaurant } from '../../types';

export default function AdminSettings() {
  const { data, updateRestaurant } = useStore();
  const [form, setForm] = useState<Restaurant>({ ...data.restaurant });
  const [saved, setSaved] = useState(false);

  function set(key: keyof Restaurant, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateRestaurant(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 text-sm">Personalize seu cardápio digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identidade */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b pb-2">Identidade do Restaurante</h2>

            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                value={form.logo}
                onChange={v => set('logo', v)}
                label="Logo (avatar circular)"
              />
              <ImageUpload
                value={form.bannerImage || ''}
                onChange={v => set('bannerImage', v)}
                label="Imagem do banner (topo)"
              />
            </div>
            <p className="text-xs text-gray-400">
              A <strong>logo</strong> aparece como avatar no cardápio. O <strong>banner</strong> é a imagem de fundo do topo (opcional — se não tiver, usa a cor principal).
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do restaurante *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / slogan</label>
              <input
                value={form.description}
                onChange={e => set('description', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Comida deliciosa para você!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                value={form.address}
                onChange={e => set('address', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Rua Exemplo, 123 - Bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de funcionamento</label>
              <input
                value={form.openingHours}
                onChange={e => set('openingHours', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Seg-Sex 11h-22h | Sáb-Dom 11h-23h"
              />
            </div>
          </section>

          {/* Contato e Pedidos */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b pb-2">Contato e Pedidos</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (com DDD e código do país)</label>
              <input
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="5511999999999"
              />
              <p className="text-xs text-gray-400 mt-1">Ex: 5511999999999 (55 = Brasil, 11 = DDD, 9 dígitos)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de entrega (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.deliveryFee}
                  onChange={e => set('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pedido mínimo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minOrder}
                  onChange={e => set('minOrder', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </section>

          {/* Cores */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b pb-2">Cores do Cardápio</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor principal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={e => set('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border"
                  />
                  <input
                    value={form.primaryColor}
                    onChange={e => set('primaryColor', e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor de destaque</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={e => set('accentColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border"
                  />
                  <input
                    value={form.accentColor}
                    onChange={e => set('accentColor', e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg p-3 text-sm text-white font-medium text-center" style={{ backgroundColor: form.primaryColor }}>
              Preview da cor principal
            </div>
          </section>

          {/* Segurança */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b pb-2">Segurança</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha do painel admin</label>
              <input
                type="password"
                value={form.adminPassword}
                onChange={e => set('adminPassword', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Mínimo 6 caracteres"
                minLength={4}
              />
              <p className="text-xs text-gray-400 mt-1">Senha atual permanece se deixar em branco o campo não será alterado.</p>
            </div>
          </section>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {saved ? <><Check size={18} /> Salvo!</> : <><Save size={18} /> Salvar Configurações</>}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
