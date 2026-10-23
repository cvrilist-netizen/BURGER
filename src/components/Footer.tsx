import React from 'react';
import { Flame, PhoneCall, MapPin, Clock, Heart, ShieldCheck } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface FooterProps {
  settings: RestaurantSettings;
  onOpenKitchen: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenKitchen, onOpenAdmin }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/20">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-white tracking-tight">
                  CHORSU <span className="text-amber-400">BURGER</span>
                </div>
                <div className="text-[11px] text-neutral-400">{settings.slogan}</div>
              </div>
            </div>

            <p className="text-neutral-400 leading-relaxed max-w-md text-xs">
              Namanganning eng sevimli fast-food maskani. Haqiqiy toza mol go‘shtidan tayyorlangan 
              shirali burgerlar, tandir go‘shtli lavashlar, qarsildoq KFC tovuqlari va muzdek kokteyllar.
            </p>

            <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halol va gigiyenik standartlarga mos</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Aloqa & Manzil</h4>
            <div className="space-y-2.5">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center text-amber-400 font-bold hover:text-amber-300 transition-colors"
              >
                <PhoneCall className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </a>

              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-neutral-300 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 mr-2 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </a>

              <div className="flex items-center text-neutral-400">
                <Clock className="w-4 h-4 mr-2 text-amber-400 shrink-0" />
                <span>Ish vaqti: {settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Staff Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Xizmatlar</h4>
            <div className="flex flex-col space-y-2">
              <button
                onClick={onOpenKitchen}
                className="text-left hover:text-amber-400 transition-colors"
              >
                🍳 Oshpaz / Oshxona ekrani
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left hover:text-amber-400 transition-colors"
              >
                🛡️ Administrator boshqaruvi
              </button>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                📍 Xaritada ko‘rish (Google Maps)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} CHORSU BURGER. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center space-x-1">
            <span>Namangan shahri Chorsu bozori uchun maxsus tayyorlandi</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
