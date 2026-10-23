import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  AlertCircle,
  Truck,
  Store,
  PhoneCall,
  MapPin,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Order, RestaurantSettings } from '../types';
import { findOrderByNumber, subscribeToOrder } from '../services/orderService';
import { formatPrice, formatDateTime } from '../utils/formatters';

interface OrderTrackerProps {
  initialOrderId?: string | null;
  settings: RestaurantSettings;
  onGoToMenu: () => void;
}

const STEPS = [
  {
    key: 'pending',
    title: 'Buyurtma yuborildi',
    desc: 'Oshxona tasdiqlashini kutmoqda',
    icon: Clock
  },
  {
    key: 'accepted',
    title: 'Buyurtma qabul qilindi',
    desc: 'Oshpaz navbatga qo‘ydi',
    icon: CheckCircle2
  },
  {
    key: 'preparing',
    title: 'Oshpaz tayyorlamoqda',
    desc: 'Taomlar olovda pishirilmoqda',
    icon: ChefHat
  },
  {
    key: 'ready',
    title: 'Buyurtma tayyor',
    desc: 'Olib ketishga yoki kuryerga tayyor',
    icon: PackageCheck
  },
  {
    key: 'completed',
    title: 'Yetkazildi / Yakunlandi',
    desc: 'Yoqimli ishtaha tilaymiz!',
    icon: CheckCircle2
  }
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  initialOrderId,
  settings,
  onGoToMenu
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If initialOrderId passed, auto load
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  // Set up real-time listener if order is loaded
  useEffect(() => {
    if (!currentOrder?.id) return;

    const unsubscribe = subscribeToOrder(
      currentOrder.id,
      (updated) => {
        if (updated) {
          setCurrentOrder(updated);
        }
      },
      (err) => {
        console.warn('Real-time order tracking error:', err);
      }
    );

    return () => unsubscribe();
  }, [currentOrder?.id]);

  const handleSearch = async (queryTerm: string) => {
    const term = queryTerm.trim();
    if (!term) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      setSearched(true);

      const order = await findOrderByNumber(term);
      if (order) {
        setCurrentOrder(order);
      } else {
        setCurrentOrder(null);
        setErrorMsg('Bunday raqamli buyurtma topilmadi. Raqamni tekshirib qayta kiriting (masalan: CB-1234).');
      }
    } catch {
      setErrorMsg('Qidirishda xatolik yuz berdi. Iltimos qaytadan urining.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const isCancelled = currentOrder?.status === 'cancelled';
  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-vaqt tracking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Buyurtmani kuzatish</h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Buyurtma raqamingizni (masalan: <strong className="text-amber-400">CB-4892</strong>) kiriting va uning tayyorlanish jarayonini jonli kuzatib boring.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchInput);
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buyurtma raqami: CB-1234"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchInput.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <span>Qidirish</span>
          )}
        </button>
      </form>

      {/* Error message */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center space-x-2.5 max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display */}
      {currentOrder && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Top Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-400">Buyurtma:</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {currentOrder.orderNumber}
                </span>
              </div>
              <span className="text-xs text-neutral-500 mt-0.5 block">
                Yaratilgan vaqti: {formatDateTime(currentOrder.createdAt)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border ${
                  isCancelled
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : currentOrder.status === 'ready'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                    : currentOrder.status === 'completed'
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span className="capitalize">
                  {isCancelled
                    ? 'Bekor qilingan'
                    : currentOrder.status === 'pending'
                    ? 'Oshxona tasdiqlamoqda'
                    : currentOrder.status === 'accepted'
                    ? 'Qabul qilindi'
                    : currentOrder.status === 'preparing'
                    ? 'Tayyorlanmoqda'
                    : currentOrder.status === 'ready'
                    ? 'Tayyor bo‘ldi!'
                    : 'Yetkazildi'}
                </span>
              </span>
            </div>
          </div>

          {/* Stepper Timeline (if not cancelled) */}
          {!isCancelled ? (
            <div className="space-y-4 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Tayyorlanish bosqichlari
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-neutral-800" />

                <div className="space-y-6 relative">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const isPending = idx > currentStepIdx;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-start space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all z-10 ${
                            isCurrent
                              ? 'bg-amber-500 border-amber-400 text-neutral-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30'
                              : isDone
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="pt-1">
                          <h4
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-400'
                                : isDone
                                ? 'text-white'
                                : 'text-neutral-500'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-1">
              <h4 className="text-sm font-bold text-red-400">Buyurtma bekor qilingan</h4>
              <p className="text-xs text-neutral-400">
                Savollaringiz bo‘lsa, to‘g‘ridan-to‘g‘ri restoran bilan bog‘laning.
              </p>
            </div>
          )}

          {/* Order Details Accordion / Summary */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Buyurtma tarkibi
            </h3>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-850">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-neutral-800 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                      {item.quantity}x
                    </span>
                    <span className="text-white font-medium">{item.name}</span>
                    {item.itemNotes && (
                      <span className="text-[10px] text-neutral-400 italic">({item.itemNotes})</span>
                    )}
                  </div>
                  <span className="text-neutral-300 font-mono font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-3 mt-3 flex justify-between text-xs text-neutral-400">
                <span>Olish usuli:</span>
                <span className="text-white font-medium flex items-center">
                  {currentOrder.deliveryType === 'delivery' ? (
                    <>
                      <Truck className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      Yetkazib berish ({formatPrice(currentOrder.deliveryFee)})
                    </>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Olib ketish (Chorsu bozori)
                    </>
                  )}
                </span>
              </div>

              {currentOrder.deliveryAddress && (
                <div className="pt-2 flex justify-between text-xs text-neutral-400">
                  <span>Manzil:</span>
                  <span className="text-white font-medium text-right max-w-xs truncate">
                    {currentOrder.deliveryAddress}
                  </span>
                </div>
              )}

              <div className="pt-3 mt-3 flex justify-between text-sm font-bold text-white">
                <span>Jami summa:</span>
                <span className="text-amber-400 text-base font-black">
                  {formatPrice(currentOrder.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Help & Call */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold flex items-center space-x-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Restoranga qo‘ng‘iroq: {settings.phone}</span>
            </a>

            <button
              onClick={onGoToMenu}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              Yana buyurtma berish
            </button>
          </div>
        </div>
      )}

      {/* If not searched yet */}
      {!currentOrder && !loading && !errorMsg && (
        <div className="text-center py-12 px-4 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Buyurtma topilmadi</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Yuqoridagi maydonga chekingizdagi buyurtma raqamini yozing.
          </p>
        </div>
      )}
    </div>
  );
};
