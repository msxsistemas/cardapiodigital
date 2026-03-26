import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Category } from '../../types';

interface Props {
  category?: Category | null;
  onSave: (data: Omit<Category, 'id'>) => void;
  onClose: () => void;
}

const EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🥗', '🍽️', '🥤', '🍰', '🍟', '🥩', '🍗', '🌯', '🍜', '🍱', '☕', '🧃', '🍺', '🍦', '🥪', '🥘', '🫕', '🍲'];

const empty: Omit<Category, 'id'> = {
  name: '',
  description: '',
  icon: '🍽️',
  order: 0,
  active: true,
};

export default function CategoryModal({ category, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Category, 'id'>>(empty);

  useEffect(() => {
    if (category) {
      const { id: _, ...rest } = category;
      setForm(rest);
    } else {
      setForm(empty);
    }
  }, [category]);

  function set(key: keyof typeof form, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg">{category ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => set('icon', emoji)}
                  className={`text-2xl p-1.5 rounded-lg transition-colors ${form.icon === emoji ? 'bg-orange-100 ring-2 ring-orange-400' : 'hover:bg-gray-100'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da categoria *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ex: Pratos Principais"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
            <input
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Breve descrição..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => set('active', e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm font-medium">Categoria ativa</span>
          </label>

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
