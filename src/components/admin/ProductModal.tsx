import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import type { Product, Category } from '../../types';

interface Props {
  product?: Product | null;
  categories: Category[];
  onSave: (data: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const empty: Omit<Product, 'id'> = {
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  available: true,
  featured: false,
  order: 0,
};

export default function ProductModal({ product, categories, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(empty);

  useEffect(() => {
    if (product) {
      const { id: _, ...rest } = product;
      setForm(rest);
    } else {
      setForm({ ...empty, categoryId: categories[0]?.id || '' });
    }
  }, [product, categories]);

  function set(key: keyof typeof form, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <ImageUpload value={form.image} onChange={v => set('image', v)} label="Foto do produto" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              value={form.categoryId}
              onChange={e => set('categoryId', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Selecionar categoria</option>
              {categories.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do produto *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ex: Frango Grelhado"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              placeholder="Descreva os ingredientes e detalhes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => set('price', parseFloat(e.target.value) || 0)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={e => set('available', e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium">Disponível</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium">Destaque</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Save size={16} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
