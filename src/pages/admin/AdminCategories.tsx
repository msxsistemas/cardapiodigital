import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryModal from '../../components/admin/CategoryModal';
import { useStore } from '../../hooks/useStore';
import type { Category } from '../../types';

export default function AdminCategories() {
  const { data, addCategory, updateCategory, deleteCategory, reorderCategories } = useStore();
  const { categories, products } = data;

  const [modal, setModal] = useState<{ open: boolean; category?: Category | null }>({ open: false });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  function handleSave(catData: Omit<Category, 'id'>) {
    if (modal.category) {
      updateCategory(modal.category.id, catData);
    } else {
      addCategory({ ...catData, order: categories.length });
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    deleteCategory(id);
    setConfirmDelete(null);
  }

  function getProductCount(id: string) {
    return products.filter(p => p.categoryId === id).length;
  }

  // Drag & Drop
  function handleDragStart(id: string) { setDragging(id); }
  function handleDragEnd() {
    if (dragging && dragOver && dragging !== dragOver) {
      const list = [...sorted];
      const fromIdx = list.findIndex(c => c.id === dragging);
      const toIdx = list.findIndex(c => c.id === dragOver);
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      reorderCategories(list.map((c, i) => ({ ...c, order: i })));
    }
    setDragging(null);
    setDragOver(null);
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
            <p className="text-gray-500 text-sm">{categories.length} categoria(s) cadastrada(s)</p>
          </div>
          <button
            onClick={() => setModal({ open: true, category: null })}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            Nova Categoria
          </button>
        </div>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          <GripVertical size={16} />
          Arraste para reordenar
        </p>

        <div className="space-y-3">
          {sorted.map(cat => (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleDragStart(cat.id)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(cat.id); }}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all ${
                dragOver === cat.id && dragging !== cat.id ? 'border-orange-400 bg-orange-50' : ''
              } ${dragging === cat.id ? 'opacity-50' : ''}`}
            >
              <GripVertical size={18} className="text-gray-300 flex-shrink-0" />

              <div className="text-3xl flex-shrink-0">{cat.icon}</div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{cat.name}</p>
                {cat.description && <p className="text-gray-500 text-xs truncate">{cat.description}</p>}
                <p className="text-gray-400 text-xs mt-0.5">{getProductCount(cat.id)} produto(s)</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCategory(cat.id, { active: !cat.active })}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    cat.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {cat.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                  <span className="hidden sm:inline">{cat.active ? 'Ativa' : 'Inativa'}</span>
                </button>
                <button
                  onClick={() => setModal({ open: true, category: cat })}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setConfirmDelete(cat.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
              <p className="text-3xl mb-2">📂</p>
              <p className="text-sm">Nenhuma categoria cadastrada.</p>
            </div>
          )}
        </div>
      </div>

      {modal.open && (
        <CategoryModal
          category={modal.category}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Excluir categoria?</h3>
            <p className="text-gray-500 text-sm mb-5">Todos os produtos desta categoria também serão excluídos.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
