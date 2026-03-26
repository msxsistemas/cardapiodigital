import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock } from 'lucide-react';
import { loadData } from '../../utils/storage';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = loadData();
    if (password === data.restaurant.adminPassword) {
      sessionStorage.setItem('admin_auth', '1');
      navigate('/admin');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
            <ChefHat size={32} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Entre com sua senha para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Digite sua senha"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Senha padrão: <code className="bg-gray-100 px-1 rounded">admin123</code>
        </p>
      </div>
    </div>
  );
}
