import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductModal from '../../components/admin/ProductModal';
import { useStore } from '../../hooks/useStore';
import { formatCurrency } from '../../utils/whatsapp';
import type { Product } from '../../types';

export default function AdminProducts() {
  const { data, addProduct, updateProduct, deleteProduct } = useStore();
  const { products, categories, restaurant } = data;

  const [modal, setModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || p.categoryId === filterCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => a.order - b.order);

  function getCategoryName(id: string) {
    const cat = categories.find(c => c.id === id);
    return cat ? `${cat.icon} ${cat.name}` : '—';
  }

  function handleSave(data: Omit<Product, 'id'>) {
    if (modal.product) {
      updateProduct(modal.product.id, data);
    } else {
      addProduct({ ...data, order: products.length });
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    setConfirmDelete(null);
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-500 text-sm">{products.length} produto(s) cadastrado(s)</p>
          </div>
          <button
            onClick={() => setModal({ open: true, product: null })}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            Novo Produto
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag />
              <p className="mt-2 text-sm">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Produto</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium hidden md:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Preço</th>
                    <th className="text-center px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Status</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 text-lg">🍽️</div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800 flex items-center gap-1">
                              {product.name}
                              {product.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                            </p>
                            <p className="text-gray-400 text-xs line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{getCategoryName(product.categoryId)}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(product.price, restaurant.currency)}</td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <button
                          onClick={() => updateProduct(product.id, { available: !product.available })}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {product.available ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                          {product.available ? 'Disponível' : 'Indisponível'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal({ open: true, product })}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal.open && (
        <ProductModal
          product={modal.product}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Excluir produto?</h3>
            <p className="text-gray-500 text-sm mb-5">Esta ação não pode ser desfeita.</p>
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

function ShoppingBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
