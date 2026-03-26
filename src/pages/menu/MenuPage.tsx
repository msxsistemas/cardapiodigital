import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Home, ClipboardList, ShoppingCart, Clock } from 'lucide-react';
import { RestaurantHeader } from '../../components/menu/RestaurantHeader';
import { CategoryTabs } from '../../components/menu/CategoryTabs';
import { HighlightsCarousel } from '../../components/menu/HighlightsCarousel';
import { ProductSection } from '../../components/menu/ProductSection';
import { ProductListItem } from '../../components/menu/ProductListItem';
import { ProductDetailSheet } from '../../components/menu/ProductDetailSheet';
import Cart from '../../components/menu/Cart';
import { useCart } from '../../hooks/useCart';
import { loadData } from '../../utils/storage';
import type { StoreData, Product } from '../../types';

type NavTab = 'menu' | 'orders' | 'cart';

export default function MenuPage() {
  const [storeData, setStoreData] = useState<StoreData>(() => loadData());
  const { restaurant, categories, products } = storeData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('menu');

  // iFood behavior: category tabs só aparecem depois do header sair da tela
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const restaurantHeaderRef = useRef<HTMLDivElement>(null);
  const isScrollingToCategory = useRef(false);

  const { items, addItem, updateQuantity, removeItem, clearCart, total, count } = useCart();

  // Reload ao voltar do admin
  useEffect(() => {
    const onFocus = () => setStoreData(loadData());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const activeCategories = useMemo(
    () => categories.filter(c => c.active).sort((a, b) => a.order - b.order),
    [categories]
  );

  // Inicializa categoria selecionada
  useEffect(() => {
    if (activeCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(activeCategories[0].id);
    }
  }, [activeCategories, selectedCategory]);

  // Scroll sync — exatamente como no arquivo de referência
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar/esconder category tabs baseado na posição do restaurantHeader
      if (restaurantHeaderRef.current) {
        const headerBottom = restaurantHeaderRef.current.getBoundingClientRect().bottom;
        setShowCategoryTabs(headerBottom < 60);
      }

      // Não sincronizar durante scroll programático
      if (isScrollingToCategory.current) return;

      // Sincronizar categoria ativa com seção visível
      const categoryElements = activeCategories
        .map(cat => ({
          id: cat.id,
          element: document.getElementById(`category-${cat.id}`),
        }))
        .filter(item => item.element);

      if (categoryElements.length === 0) return;

      const offset = 180;
      let currentCategory = categoryElements[0].id;

      for (const { id, element } of categoryElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset) {
            currentCategory = id;
          }
        }
      }

      setSelectedCategory(prev => (prev !== currentCategory ? currentCategory : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategories]);

  // Produtos filtrados pela busca
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  function handleProductClick(product: Product) {
    setSelectedProduct(product);
    setIsProductSheetOpen(true);
  }

  function handleCloseProductSheet() {
    setIsProductSheetOpen(false);
    setSelectedProduct(null);
  }

  // Navegar para categoria com scroll — igual à referência
  function handleSelectCategory(categoryId: string) {
    setSelectedCategory(categoryId);
    isScrollingToCategory.current = true;

    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        isScrollingToCategory.current = false;
      }, 500);
    } else {
      isScrollingToCategory.current = false;
    }
  }

  function handleSearchButtonClick() {
    searchInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cartItemsSimple = items.map(i => ({ productId: i.product.id, quantity: i.quantity }));

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-20">

      {/* ── Banner fechado ── */}
      {!restaurant.isOpen && (
        <div className="bg-red-600 text-white text-center py-2.5 px-4 font-medium sticky top-0 z-50 text-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span>🔒 Restaurante fechado no momento</span>
            {restaurant.openingHours && (
              <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-xs">
                <Clock size={12} />
                {restaurant.openingHours}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Restaurant Header ── */}
      <div ref={restaurantHeaderRef}>
        <RestaurantHeader restaurant={restaurant} onSearchClick={handleSearchButtonClick} />
      </div>

      {/* ── Sticky: busca + category tabs ── */}
      <div className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        {/* Barra de busca — sempre visível */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Buscar em ${restaurant.name}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] placeholder:text-gray-400 focus:outline-none text-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center"
              >
                <X size={11} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs — aparecem com animação ao rolar (iFood style) */}
        <div
          className={`transition-all duration-300 ease-out ${
            showCategoryTabs
              ? 'opacity-100 translate-y-0 max-h-16'
              : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden'
          }`}
        >
          <CategoryTabs
            categories={activeCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            primaryColor={restaurant.primaryColor}
          />
        </div>
      </div>

      {/* ── Conteúdo ── */}
      {searchQuery.trim() ? (
        /* Resultados de busca */
        <div className="bg-white mt-1 pb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[13px] text-gray-500">
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para{' '}
              <strong>"{searchQuery}"</strong>
            </p>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm font-medium">Nenhum produto encontrado</p>
            </div>
          ) : (
            filteredProducts.map((product, idx) => (
              <div key={product.id}>
                <ProductListItem
                  product={product}
                  restaurant={restaurant}
                  cartQuantity={cartItemsSimple.find(i => i.productId === product.id)?.quantity || 0}
                  onProductClick={handleProductClick}
                />
                {idx < filteredProducts.length - 1 && (
                  <div className="mx-4 border-b border-gray-100" />
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Carousel de destaques */}
          <HighlightsCarousel
            products={products}
            restaurant={restaurant}
            onProductClick={handleProductClick}
          />

          {/* Seções por categoria */}
          <ProductSection
            products={products}
            categories={activeCategories}
            restaurant={restaurant}
            cartItems={cartItemsSimple}
            onProductClick={handleProductClick}
          />
        </>
      )}

      {/* ── Barra de navegação inferior ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200">
        <div className="flex">
          <NavItem
            icon={<Home size={22} />}
            label="Início"
            active={activeTab === 'menu'}
            color={restaurant.primaryColor}
            onClick={() => setActiveTab('menu')}
          />
          <NavItem
            icon={<ClipboardList size={22} />}
            label="Pedidos"
            active={activeTab === 'orders'}
            color={restaurant.primaryColor}
            onClick={() => setActiveTab('orders')}
          />
          <NavItem
            icon={
              <div className="relative">
                <ShoppingCart size={22} />
                {count > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: restaurant.primaryColor }}
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
            }
            label="Carrinho"
            active={activeTab === 'cart'}
            color={restaurant.primaryColor}
            onClick={() => setActiveTab('cart')}
          />
        </div>
      </div>

      {/* ── Tela Pedidos vazia ── */}
      {activeTab === 'orders' && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center pb-20">
          <ClipboardList size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-700 font-semibold">Nenhum pedido ainda</p>
          <p className="text-gray-400 text-sm mt-1">Seus pedidos aparecerão aqui</p>
          <button
            onClick={() => setActiveTab('menu')}
            className="mt-6 px-6 py-2.5 rounded-full font-semibold text-white text-sm"
            style={{ backgroundColor: restaurant.primaryColor }}
          >
            Ver cardápio
          </button>
        </div>
      )}

      {/* ── Tela Carrinho ── */}
      {activeTab === 'cart' && (
        <Cart
          items={items}
          restaurant={restaurant}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onClear={clearCart}
          onClose={() => setActiveTab('menu')}
          total={total}
        />
      )}

      {/* ── Bottom Sheet do produto ── */}
      <ProductDetailSheet
        product={selectedProduct}
        restaurant={restaurant}
        isOpen={isProductSheetOpen}
        cartQuantity={selectedProduct ? (items.find(i => i.product.id === selectedProduct.id)?.quantity || 0) : 0}
        onAdd={addItem}
        onUpdateQty={updateQuantity}
        onClose={handleCloseProductSheet}
        disabled={!restaurant.isOpen}
      />
    </div>
  );
}

function NavItem({
  icon, label, active, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors relative"
    >
      <span style={{ color: active ? color : '#9ca3af' }}>{icon}</span>
      <span className="text-[11px] font-semibold" style={{ color: active ? color : '#9ca3af' }}>
        {label}
      </span>
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );
}
