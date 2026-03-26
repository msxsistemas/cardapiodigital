import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Tag, Settings, LogOut,
  Menu, X, ExternalLink, ChefHat
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/produtos', icon: ShoppingBag, label: 'Produtos' },
  { to: '/admin/categorias', icon: Tag, label: 'Categorias' },
  { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ChefHat size={24} className="text-orange-400" />
            <div>
              <p className="font-bold text-sm">Painel Admin</p>
              <p className="text-gray-400 text-xs">Cardápio Digital</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  active ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 text-sm transition-colors"
          >
            <ExternalLink size={18} />
            Ver Cardápio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-900 hover:text-red-200 text-sm transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat size={24} className="text-orange-400" />
                <p className="font-bold text-sm">Painel Admin</p>
              </div>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => {
                const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      active ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-900 text-sm">
                <LogOut size={18} />Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b px-4 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <ChefHat size={20} className="text-orange-500" />
          <span className="font-semibold text-sm">Painel Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
