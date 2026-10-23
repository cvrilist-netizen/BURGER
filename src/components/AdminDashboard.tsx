import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Database,
  Store,
  DollarSign,
  TrendingUp,
  Users,
  Settings as SettingsIcon,
  Check,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  LogIn,
  AlertCircle,
  Clock,
  MapPin,
  PhoneCall,
  Search
} from 'lucide-react';
import { Product, ProductCategory, RestaurantSettings, Order, UserAppRole } from '../types';
import { CATEGORIES } from '../data/initialMenu';
import {
  saveProduct,
  updateProductField,
  removeProduct,
  seedProductsToFirestore
} from '../services/productService';
import { updateRestaurantSettings } from '../services/settingsService';
import { assignUserRole } from '../services/authService';
import { formatPrice } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  products: Product[];
  settings: RestaurantSettings;
  orders: Order[];
  onRefreshSettings: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  settings,
  orders,
  onRefreshSettings
}) => {
  const { user, isAdmin, login } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'settings' | 'roles' | 'stats'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState<string | null>(null);

  // Edit / Add Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<RestaurantSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Role Assignment Form
  const [roleUserId, setRoleUserId] = useState('');
  const [roleEmail, setRoleEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserAppRole>('cook');
  const [roleSavedMsg, setRoleSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Statistics
  const totalRevenue = orders
    .filter(o => o.status === 'completed' || o.status === 'ready')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;
  const activeOrdersCount = orders.filter(o => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)).length;
  const avgTicket = orders.length > 0 ? Math.round(totalRevenue / (completedOrdersCount || 1)) : 0;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSeedDatabase = async () => {
    if (!confirm('Haqiqiy boshlang‘ich 38 ta mahsulotni Cloud Firestore bazasiga yuklamoqchimisiz?')) {
      return;
    }
    try {
      setIsSeeding(true);
      const count = await seedProductsToFirestore();
      setSeedSuccessMsg(`${count} ta mahsulot muvaffaqiyatli Firestore bazasiga kiritildi!`);
      setTimeout(() => setSeedSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Seeding error:', err);
      alert('Baza to‘ldirishda xatolik yuz berdi. Iltimos Firebase ruxsatlarini tekshiring.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      await updateProductField(product.id, { available: !product.available });
    } catch (err) {
      console.error('Availability toggle error:', err);
      alert('O‘zgartirishda xatolik yuz berdi.');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      category: 'burger',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: '',
      available: true,
      sortOrder: products.length + 1,
      isPriceConfirmed: true,
      badge: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await saveProduct(editingProduct);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Mahsulotni saqlashda xatolik yuz berdi.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Haqiqatan ham "${name}" mahsulotini o‘chirmoqchimisiz?`)) return;
    try {
      await removeProduct(id);
    } catch (err) {
      console.error('Delete error:', err);
      alert('O‘chirishda xatolik yuz berdi.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRestaurantSettings(settingsForm);
      onRefreshSettings();
      setSettingsSavedMsg(true);
      setTimeout(() => setSettingsSavedMsg(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert('Sozlamalarni saqlashda xatolik yuz berdi.');
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleEmail.trim() && !roleUserId.trim()) {
      alert('Iltimos foydalanuvchi ID yoki emailini kiriting.');
      return;
    }
    const targetId = roleUserId.trim() || `user_${Date.now()}`;
    try {
      await assignUserRole(targetId, roleEmail.trim(), selectedRole);
      setRoleSavedMsg(`"${roleEmail || targetId}" ga "${selectedRole}" roli berildi!`);
      setRoleUserId('');
      setRoleEmail('');
      setTimeout(() => setRoleSavedMsg(null), 4000);
    } catch (err) {
      console.error('Assign role error:', err);
      alert('Rol berishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Warning if not admin */}
      {!isAdmin && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-red-300">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            <span>
              <strong>Admin ruxsati:</strong> Ushbu sahifadagi ma’lumotlarni o‘zgartirish uchun admin akkaunti bilan kirish kerak. Joriy foydalanuvchi: {user?.email || 'Mehmon'}.
            </span>
          </div>
          {!user && (
            <button
              onClick={login}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google orqali kirish</span>
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">CHORSU BURGER — Admin Paneli</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Menyu narxlari, sotuv mavjudligi, restoran sozlamalari va oshpaz rollarini boshqaring.
            </p>
          </div>
        </div>

        {/* Database Quick Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 font-bold text-xs shadow-md transition-all active:scale-95"
            title="38 ta rasmiy fast-food mahsulotini Firestore bazasiga 1 bosish bilan to'ldirish"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{isSeeding ? 'Yuklanmoqda...' : 'Menyuni Firestore’ga yuklash (Seed)'}</span>
          </button>
        </div>
      </div>

      {seedSuccessMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{seedSuccessMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Umumiy tushum</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {formatPrice(totalRevenue)}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Jami buyurtmalar</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {orders.length} ta
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Faol buyurtmalar</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-400">
            {activeOrdersCount} ta
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Menyudagi mahsulotlar</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {products.length} xil
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'products'
              ? 'bg-neutral-800 text-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          🍔 Mahsulotlar ({products.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'settings'
              ? 'bg-neutral-800 text-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          ⚙️ Restoran sozlamalari
        </button>

        <button
          onClick={() => setActiveAdminTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'roles'
              ? 'bg-neutral-800 text-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          👥 Rollar (Oshpaz / Admin)
        </button>

        <button
          onClick={() => setActiveAdminTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'stats'
              ? 'bg-neutral-800 text-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          📊 Buyurtmalar hisoboti
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mahsulot nomi yoki tarkibi..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Barcha kategoriyalar</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi mahsulot</span>
              </button>
            </div>
          </div>

          {/* Table / Cards */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Rasm & Nomi</th>
                    <th className="py-3 px-4">Kategoriya</th>
                    <th className="py-3 px-4">Narxi (UZS)</th>
                    <th className="py-3 px-4">Mavjudlik</th>
                    <th className="py-3 px-4">Holat / Badge</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-850/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-neutral-950 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{product.name}</div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {product.isPriceConfirmed ? (
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {formatPrice(product.price)}
                          </span>
                        ) : (
                          <span className="text-red-400 italic font-semibold">
                            Belgilanmagan (0 so‘m)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailable(product)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-colors ${
                            product.available
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {product.available ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Sotuvda bor</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Sotuvda yo‘q</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        {product.badge ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-600/30 text-red-300 border border-red-500/40 text-[10px] font-bold">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/60 text-red-400 transition-colors"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings Form */}
      {activeAdminTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl space-y-5 shadow-xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white">Restoran umumiy ma‘lumotlari</h3>
              <p className="text-xs text-neutral-400">
                Barcha o‘zgarishlar Firestore orqali real vaqtda mijozlar sahifasida aks etadi.
              </p>
            </div>
            {settingsSavedMsg && (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <Check className="w-4 h-4 mr-1" /> Saqlandi!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Restoran nomi
              </label>
              <input
                type="text"
                required
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Shior (Slogan)
              </label>
              <input
                type="text"
                required
                value={settingsForm.slogan}
                onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Telefon raqam
              </label>
              <input
                type="text"
                required
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Ish vaqti
              </label>
              <input
                type="text"
                required
                value={settingsForm.workingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Manzil
              </label>
              <input
                type="text"
                required
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Yetkazib berish narxi (UZS)
              </label>
              <input
                type="number"
                required
                value={settingsForm.deliveryFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Minimal buyurtma summasi (UZS)
              </label>
              <input
                type="number"
                required
                value={settingsForm.minOrderAmount}
                onChange={(e) => setSettingsForm({ ...settingsForm, minOrderAmount: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Xarita havolasi (Google Maps)
              </label>
              <input
                type="url"
                value={settingsForm.mapUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-red-600/20 active:scale-95 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Sozlamalarni saqlash</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Staff & Role Management */}
      {activeAdminTab === 'roles' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl space-y-5 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">Xodimlar rollarini boshqarish</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Oshpaz ("cook") yoki yangi Admin ("admin") tayinlang.
            </p>
          </div>

          {roleSavedMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{roleSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleAssignRole} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Xodimning Google Emaili
              </label>
              <input
                type="email"
                required
                value={roleEmail}
                onChange={(e) => setRoleEmail(e.target.value)}
                placeholder="masalan: oshpaz@gmail.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Foydalanuvchi UID (Ixtiyoriy)
              </label>
              <input
                type="text"
                value={roleUserId}
                onChange={(e) => setRoleUserId(e.target.value)}
                placeholder="Firebase Auth UID"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Belgilanadigan rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserAppRole)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="cook">Oshpaz (cook) — faqat oshxona paneli</option>
                <option value="admin">Admin (admin) — to‘liq boshqaruv</option>
                <option value="customer">Mijoz (customer) — standart huquq</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-md"
            >
              Rolni biriktirish
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Orders History & Breakdown */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Buyurtmalar tarixi</h3>
            <span className="text-xs text-neutral-400">Jami: {orders.length} ta buyurtma</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Raqam</th>
                    <th className="py-3 px-4">Mijoz</th>
                    <th className="py-3 px-4">Turi</th>
                    <th className="py-3 px-4">Mahsulotlar</th>
                    <th className="py-3 px-4">Summa</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-850/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        <div>{o.customerName}</div>
                        <div className="text-[10px] text-neutral-400">{o.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-neutral-800 text-neutral-300">
                          {o.deliveryType === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {formatPrice(o.totalPrice)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct.id.startsWith('prod_') && products.some(p => p.id === editingProduct.id)
                  ? 'Mahsulotni tahrirlash'
                  : 'Yangi mahsulot qo‘shish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Masalan: Double Chizburger"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Narxi (so‘m) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Rasm havolasi (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Tavsif (Tarkibi)
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Yumshoq non, mol go‘shti, pishloq..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Badge (Masalan: Xit, Yangi)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sortOrder}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.available}
                    onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Sotuvda mavjud (Available)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPriceConfirmed}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPriceConfirmed: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Narx tasdiqlangan</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
