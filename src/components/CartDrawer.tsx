import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Phone,
  User,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DeliveryType, PaymentMethod, RestaurantSettings, Order } from '../types';
import { formatPrice } from '../utils/formatters';
import { createOrder } from '../services/orderService';
import { soundManager } from '../utils/audio';

interface CartDrawerProps {
  settings: RestaurantSettings;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings, onOrderCreated }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen
  } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<'review' | 'checkout'>('review');
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const deliveryFee = deliveryType === 'delivery' ? settings.deliveryFee : 0;
  const totalPrice = cartSubtotal + deliveryFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setCustomerPhone(val);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setErrorMessage(null);
    setStep('checkout');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('Iltimos, ismingizni kiriting.');
      return;
    }

    if (customerPhone.trim().length < 13) {
      setErrorMessage('Iltimos, to‘g‘ri telefon raqamingizni kiriting (+998 90 123 45 67).');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Yetkazib berish uchun manzilingizni to‘liq kiriting.');
      return;
    }

    if (deliveryType === 'delivery' && cartSubtotal < settings.minOrderAmount) {
      setErrorMessage(
        `Yetkazib berish uchun minimal buyurtma summasi: ${formatPrice(settings.minOrderAmount)}.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const createdOrder = await createOrder({
        customerName,
        customerPhone,
        deliveryType,
        deliveryAddress,
        notes,
        paymentMethod,
        items,
        customerId: user?.uid
      });

      // Sound & celebration
      soundManager.playSuccessTone();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      setIsCartOpen(false);
      setStep('review');
      onOrderCreated(createdOrder);
    } catch (err: unknown) {
      console.error('Order creation error:', err);
      const msg = err instanceof Error ? err.message : 'Buyurtma yaratishda xatolik yuz berdi.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-lg bg-neutral-900 border-l border-neutral-800 h-full flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Savatchangiz</h2>
              <p className="text-xs text-neutral-400">
                {cartCount > 0 ? `${cartCount} ta mahsulot tanlangan` : 'Savatchangiz bo‘sh'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-500 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white">Savatchangiz bo‘sh</h3>
            <p className="text-xs text-neutral-400 max-w-xs mt-1.5 leading-relaxed">
              CHORSU BURGER menyusidan mazali taomlar, qarsildoq tovuq va ichimliklarni tanlang!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/20"
            >
              Menyuga qaytish
            </button>
          </div>
        ) : step === 'review' ? (
          /* Step 1: Review Items */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
              <span className="text-xs font-semibold text-neutral-400">Tanlangan taomlar</span>
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Tozalash
              </button>
            </div>

            <div className="space-y-3">
              {items.map(({ product, quantity, itemNotes }) => {
                const itemTotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex gap-3 items-center"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-neutral-900 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-amber-400">
                          {formatPrice(itemTotal)}
                        </span>

                        <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Checkout Form */
          <form
            onSubmit={handleSubmitOrder}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center"
              >
                ← Taomlar ro‘yxatiga qaytish
              </button>
              <span className="text-xs text-neutral-400 font-medium">Buyurtma ma‘lumotlari</span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Delivery type radio selection */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">
                Olish usuli:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-neutral-800 border-amber-500 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Store className={`w-5 h-5 ${deliveryType === 'pickup' ? 'text-amber-400' : ''}`} />
                  <div>
                    <div className="text-xs font-bold">Olib ketish</div>
                    <div className="text-[10px] text-neutral-400">Chorsu bozori (Tekin)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-neutral-800 border-amber-500 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${deliveryType === 'delivery' ? 'text-amber-400' : ''}`} />
                  <div>
                    <div className="text-xs font-bold">Yetkazib berish</div>
                    <div className="text-[10px] text-neutral-400">
                      +{formatPrice(settings.deliveryFee)}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Ismingiz *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masalan: Sardor"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Telefon raqamingiz *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Delivery Address (required if delivery) */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                  Yetkazib berish manzili *
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Namangan sh., Kosonsoy ko‘chasi 15-uy, mo‘ljal: Korzinka yonida..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Special Instructions / Notes */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                Buyurtmaga izoh (ixtiyoriy)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sous alohida solinsin, qalampiri kamroq bo‘lsin..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">
                To‘lov turi:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-neutral-800 border-amber-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Naqd pul</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-neutral-800 border-amber-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold">Karta (Click / Payme)</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer & Submit Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Mahsulotlar summasi:</span>
                <span className="font-medium text-white">{formatPrice(cartSubtotal)}</span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="flex justify-between text-neutral-400">
                  <span>Yetkazib berish xizmati:</span>
                  <span className="font-medium text-white">{formatPrice(deliveryFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-800 text-white">
                <span>Jami to‘lov:</span>
                <span className="text-amber-400 text-base font-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {step === 'review' ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-red-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
              >
                <span>Buyurtmani rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-xl flex items-center justify-center space-x-2 transition-all ${
                  isSubmitting
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 shadow-red-600/30 active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <span>Buyurtma yuborilmoqda...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Buyurtmani tasdiqlash ({formatPrice(totalPrice)})</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
