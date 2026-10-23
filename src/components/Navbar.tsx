import React, { useState } from 'react';
import {
  ShoppingBag,
  Flame,
  PhoneCall,
  MapPin,
  Clock,
  ChefHat,
  ShieldAlert,
  LogIn,
  LogOut,
  User as UserIcon,
  Search,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { RestaurantSettings } from '../types';

interface NavbarProps {
  activeTab: 'menu' | 'track' | 'kitchen' | 'admin';
  setActiveTab: (tab: 'menu' | 'track' | 'kitchen' | 'admin') => void;
  settings: RestaurantSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  searchQuery,
  setSearchQuery
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, role, login, logout, isAdmin, isCook } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {settings.workingHours}
            </span>
            <a
              href={settings.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
              <span>{settings.address}</span>
            </a>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>{settings.phone}</span>
            </a>

            {user ? (
              <div className="flex items-center space-x-2 pl-3 border-l border-neutral-700">
                <span className="hidden md:inline text-neutral-400 truncate max-w-[140px]">
                  {user.displayName || user.email}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
                  {role}
                </span>
                <button
                  onClick={logout}
                  title="Chiqish"
                  className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center text-neutral-300 hover:text-white transition-colors pl-2"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span className="text-[11px] font-medium">Kirish</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            {/* Brand Logo */}
            <button
              onClick={() => {
                setActiveTab('menu');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black tracking-tight text-white">CHORSU</span>
                  <span className="text-xl font-black tracking-tight text-amber-400">BURGER</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium tracking-wide">
                  {settings.slogan}
                </p>
              </div>
            </button>

            {/* Search Input for Menu (Desktop) */}
            {activeTab === 'menu' && (
              <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Burger, lavash, KFC, kokteyl qidirish..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                Menyu
              </button>

              <button
                onClick={() => setActiveTab('track')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'track'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                Kuzatish
              </button>

              <button
                onClick={() => setActiveTab('kitchen')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'kitchen'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <ChefHat className="w-4 h-4 text-orange-400" />
                <span>Oshxona</span>
                {isCook && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Admin</span>
                {isAdmin && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                )}
              </button>
            </nav>

            {/* Cart Trigger Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/25 active:scale-95 transition-all"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-neutral-950 text-amber-400 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-500 animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm">Savatcha</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-2">
            {/* Search Input for Mobile */}
            {activeTab === 'menu' && (
              <div className="relative w-full mb-3">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Burger, lavash, KFC qidirish..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <button
              onClick={() => {
                setActiveTab('menu');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                activeTab === 'menu' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-300'
              }`}
            >
              🍔 Barcha Menyu
            </button>

            <button
              onClick={() => {
                setActiveTab('track');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                activeTab === 'track' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-300'
              }`}
            >
              📍 Buyurtmani kuzatish
            </button>

            <button
              onClick={() => {
                setActiveTab('kitchen');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-between ${
                activeTab === 'kitchen' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-300'
              }`}
            >
              <span className="flex items-center">
                <ChefHat className="w-4 h-4 mr-2 text-orange-400" />
                Oshpaz / Oshxona paneli
              </span>
              {isCook && <span className="text-xs text-emerald-400 font-bold">Ruxsat bor</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-between ${
                activeTab === 'admin' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-300'
              }`}
            >
              <span className="flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />
                Admin boshqaruvi
              </span>
              {isAdmin && <span className="text-xs text-amber-400 font-bold">Admin</span>}
            </button>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="text-xs text-amber-400 font-bold flex items-center"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-1" />
                {settings.phone}
              </a>
              {!user ? (
                <button
                  onClick={login}
                  className="text-xs text-neutral-300 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  Google orqali kirish
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Chiqish ({role})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              activeTab === 'menu' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Flame className="w-5 h-5 mb-0.5" />
            <span>Menyu</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              activeTab === 'track' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span>Kuzatish</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center py-1 px-2 text-[10px] font-bold text-amber-400 -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/40 border-2 border-neutral-950">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-neutral-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="mt-1">Savatcha</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              activeTab === 'kitchen' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <ChefHat className="w-5 h-5 mb-0.5" />
            <span>Oshxona</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              activeTab === 'admin' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <ShieldAlert className="w-5 h-5 mb-0.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </>
  );
};
