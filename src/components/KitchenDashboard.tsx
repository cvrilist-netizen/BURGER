import React, { useState, useEffect, useRef } from 'react';
import {
  ChefHat,
  Bell,
  Volume2,
  VolumeX,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  Truck,
  Store,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  LogIn
} from 'lucide-react';
import { Order, OrderStatus, RestaurantSettings } from '../types';
import { subscribeToOrders, updateOrderStatus } from '../services/orderService';
import { formatPrice, formatTime, formatDateTime } from '../utils/formatters';
import { soundManager } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface KitchenDashboardProps {
  settings: RestaurantSettings;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ settings }) => {
  const { user, isCook, isAdmin, login } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('active'); // active = pending, accepted, preparing, ready
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const prevPendingCount = useRef<number>(0);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    // Only subscribe to live orders
    const unsubscribe = subscribeToOrders(
      (updatedOrders) => {
        // Detect new pending orders to trigger chime
        const currentPending = updatedOrders.filter(o => o.status === 'pending').length;
        if (currentPending > prevPendingCount.current && prevPendingCount.current >= 0) {
          soundManager.playNewOrderAlert();
        }
        prevPendingCount.current = currentPending;

        setOrders(updatedOrders);
        setLoading(false);
      },
      (error) => {
        console.error('Kitchen orders subscription error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, nextStatus);
      soundManager.playSuccessTone();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Buyurtma holatini yangilashda xatolik yuz berdi. Ruxsatlarni tekshiring.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return ['pending', 'accepted', 'preparing', 'ready'].includes(order.status);
    }
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Calculate live counts
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const acceptedCount = orders.filter(o => o.status === 'accepted').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Access Notice */}
      {!isCook && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>Diqqat:</strong> Oshpaz panelida buyurtma holatini o‘zgartirish uchun oshpaz yoki admin hisobi bilan kiring ({user?.email || 'Mehmon'}).
            </span>
          </div>
          {!user ? (
            <button
              onClick={login}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google orqali kirish</span>
            </button>
          ) : (
            <span className="text-neutral-400">
              Admin sizga "cook" rolini berishi kerak.
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Oshxona / Oshpaz Paneli</h1>
              <span className="flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                Jonli efir
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Kelib tushgan buyurtmalarni real vaqtda boshqaring va pishirish bosqichlarini yangilang.
            </p>
          </div>
        </div>

        {/* Sound toggle & quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              soundManager.enableAudio();
              setSoundEnabled(!soundEnabled);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              soundEnabled
                ? 'bg-neutral-800 border-neutral-700 text-amber-400'
                : 'bg-neutral-950 border-neutral-800 text-neutral-500'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Ovozli signal: Yoqilgan</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-500" />
                <span>Ovozli signal: O‘chirilgan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'active'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Faol buyurtmalar ({pendingCount + acceptedCount + preparingCount + readyCount})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1 ${
                statusFilter === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <span>Yangi ({pendingCount})</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'accepted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Qabul qilingan ({acceptedCount})
            </button>

            <button
              onClick={() => setStatusFilter('preparing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'preparing'
                  ? 'bg-orange-600 text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Tayyorlanmoqda ({preparingCount})
            </button>

            <button
              onClick={() => setStatusFilter('ready')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'ready'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Tayyor ({readyCount})
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'completed'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Yakunlangan ({completedCount})
            </button>

            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === 'cancelled'
                  ? 'bg-red-900/60 text-red-300 border border-red-700'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Bekor qilingan ({cancelledCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Raqam, ism yoki telefon..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="p-16 text-center bg-neutral-900/50 rounded-3xl border border-neutral-800">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-300 font-medium">
            Firestore bazasidan buyurtmalar yuklanmoqda...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-16 text-center bg-neutral-900/40 rounded-3xl border border-neutral-800 max-w-lg mx-auto">
          <ChefHat className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Hech qanday buyurtma mavjud emas</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Ushbu bo‘limda hozircha buyurtmalar yo‘q. Yangi buyurtma tushishi bilan bu yerda real vaqtda paydo bo‘ladi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-neutral-900 border rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                  order.status === 'pending'
                    ? 'border-red-500/60 ring-2 ring-red-500/20 bg-neutral-900/95'
                    : order.status === 'ready'
                    ? 'border-emerald-500/40'
                    : 'border-neutral-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          order.deliveryType === 'delivery'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {order.deliveryType === 'delivery' ? 'Yetkazib berish' : 'Olib ketish'}
                      </span>
                    </div>

                    <span className="text-xs text-neutral-400 flex items-center font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                      {formatTime(order.createdAt)}
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="py-3 border-b border-neutral-800/80 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Mijoz:</span>
                      <span className="text-white font-bold">{order.customerName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Telefon:</span>
                      <a
                        href={`tel:${order.customerPhone.replace(/\s+/g, '')}`}
                        className="text-amber-400 font-mono font-bold hover:underline flex items-center"
                      >
                        <Phone className="w-3 h-3 mr-1 text-emerald-400" />
                        {order.customerPhone}
                      </a>
                    </div>

                    {order.deliveryAddress && (
                      <div className="pt-1 flex items-start space-x-1 text-neutral-300">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-[11px] font-medium">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    )}

                    {order.notes && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] flex items-start space-x-1.5 mt-2">
                        <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                          <strong>Izoh:</strong> {order.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Items List (Highlight for cook) */}
                  <div className="py-3 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
                      Taomlar ({order.itemsCount} dona):
                    </span>

                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-950/70 border border-neutral-850 rounded-xl p-2.5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-xs shrink-0">
                              {item.quantity}
                            </span>
                            <span className="font-bold text-white text-sm">{item.name}</span>
                          </div>

                          {item.itemNotes && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-amber-300 rounded font-medium max-w-[120px] truncate">
                              {item.itemNotes}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer & Status Progression Buttons */}
                <div className="pt-3 border-t border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400">Jami summa:</span>
                    <span className="text-amber-400 text-base font-black">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>

                  {/* Status Change Buttons */}
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>✓ Qabul qilish</span>
                        </button>
                        <button
                          disabled={isUpdating}
                          onClick={() => {
                            if (confirm('Buyurtmani bekor qilishga ishonchingiz komilmi?')) {
                              handleStatusChange(order.id, 'cancelled');
                            }
                          }}
                          className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-red-900/60 text-red-400 font-bold text-xs transition-colors"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                      >
                        <ChefHat className="w-4 h-4 mr-1" />
                        <span>Tayyorlashga kirishish</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1 shadow-lg shadow-emerald-600/20"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>Taom tayyor! (Kuryerga / Mijozga berish)</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>✓ Yakunlandi (Topshirildi)</span>
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="py-1 text-center text-xs text-neutral-500 font-semibold">
                        Buyurtma muvaffaqiyatli topshirilgan
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="py-1 text-center text-xs text-red-500 font-semibold">
                        Buyurtma bekor qilingan
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
