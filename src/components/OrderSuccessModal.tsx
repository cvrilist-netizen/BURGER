import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ArrowRight, Clock, PhoneCall } from 'lucide-react';
import { Order, RestaurantSettings } from '../types';
import { formatPrice } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  settings: RestaurantSettings;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onTrackOrder
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30 mb-5">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Buyurtmangiz qabul qilindi!
        </span>

        <h2 className="text-2xl font-black text-white mt-3">
          Rahmat, {order.customerName}!
        </h2>

        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
          Sizning buyurtmangiz oshxona paneliga yuborildi. Oshpaz tez orada uni tayyorlashga kirishadi.
        </p>

        {/* Order Number Box */}
        <div className="my-5 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">
              Buyurtma raqamingiz
            </span>
            <span className="text-xl font-black text-amber-400 tracking-wide font-mono">
              {order.orderNumber}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Nusxa olindi</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Nusxa olish</span>
              </>
            )}
          </button>
        </div>

        {/* Details snippet */}
        <div className="space-y-1.5 text-xs text-neutral-400 mb-6 text-left bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
          <div className="flex justify-between">
            <span>Olish usuli:</span>
            <span className="text-white font-medium">
              {order.deliveryType === 'delivery' ? 'Yetkazib berish' : 'Olib ketish'}
            </span>
          </div>
          {order.deliveryAddress && (
            <div className="flex justify-between">
              <span>Manzil:</span>
              <span className="text-white font-medium truncate max-w-[200px]">
                {order.deliveryAddress}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Jami summa:</span>
            <span className="text-amber-400 font-bold">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            <Clock className="w-4 h-4" />
            <span>Buyurtmani real vaqtda kuzatish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restoranga qo‘ng‘iroq</span>
            </a>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors"
            >
              Menyuga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
