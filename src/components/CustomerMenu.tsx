import React, { useState, useMemo } from 'react';
import {
  Flame,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  PhoneCall,
  MapPin,
  Clock,
  Search,
  AlertCircle
} from 'lucide-react';
import { Product, ProductCategory, RestaurantSettings } from '../types';
import { CATEGORIES } from '../data/initialMenu';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface CustomerMenuProps {
  products: Product[];
  settings: RestaurantSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
  onTrackOrderClick: () => void;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  products,
  settings,
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onTrackOrderClick
}) => {
  const { addToCart, items: cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    if (!product.available || !product.isPriceConfirmed) return;
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);

    // Trigger visual feedback
    setAddedAnimation(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Featured / popular products
  const popularProducts = useMemo(() => {
    return products.filter(p => p.badge === 'Xit' || p.badge === 'Ommabop').slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80"
          alt="Chorsu Burger Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />

        <div className="relative z-20 px-6 sm:px-12 py-12 sm:py-16 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Namanganning mashhur fast-foodi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            O‘zgacha ta’m — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400">
              har bir luqmada!
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
            Chorsu dehqon bozori ichidagi eng shirali burgerlar, qarsildoq KFC tovuqlari, 
            tandir go‘shtli lavashlar va tetiklantiruvchi ichimliklar. Issiq va tez yetkazib beramiz!
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('menu-items');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-red-600/30 active:scale-95 transition-all flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Menyuni ko‘rish</span>
            </button>

            <button
              onClick={onTrackOrderClick}
              className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Buyurtmani kuzatish</span>
            </button>

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-5 py-3.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-amber-400 font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{settings.phone}</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center text-neutral-300">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500 shrink-0" />
              {settings.address}
            </span>
            <span className="flex items-center text-neutral-300">
              <Clock className="w-4 h-4 mr-1.5 text-amber-400 shrink-0" />
              Har kuni: {settings.workingHours}
            </span>
          </div>
        </div>
      </section>

      {/* Popular Items Showcase (if no search active) */}
      {!searchQuery && selectedCategory === 'all' && popularProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Eng ommabop taomlar</h2>
            </div>
            <span className="text-xs text-neutral-400 font-medium">Mijozlarimiz tanlovi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularProducts.map(product => {
              const qty = quantities[product.id] || 1;
              const isAdded = addedAnimation[product.id];
              return (
                <div
                  key={product.id}
                  className="group relative bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3.5 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-neutral-950">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-red-600/90 text-white text-[11px] font-bold tracking-wider shadow">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-medium">Narxi:</span>
                      <span className="text-base font-black text-amber-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.available || !product.isPriceConfirmed}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-500 text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Qo‘shildi</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Qo‘shish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Filter Bar */}
      <section id="menu-items" className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Chorsu Burger Menyusi</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Jami {filteredProducts.length} xil saralangan mahsulot
            </p>
          </div>

          {/* Quick Search on mobile if not in header */}
          <div className="lg:hidden w-full sm:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulot qidirish..."
                className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            Barchasi ({products.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/20'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-950/40 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Hech narsa topilmadi</h3>
            <p className="text-xs text-neutral-400 mt-1">
              "{searchQuery}" so‘rovi bo‘yicha menyudan mahsulot topilmadi. Qidiruv so‘zini o‘zgartirib ko‘ring.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const qty = quantities[product.id] || 1;
              const isAdded = addedAnimation[product.id];
              const isInCart = cartItems.some(i => i.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className={`group relative bg-neutral-900 border rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
                    product.available && product.isPriceConfirmed
                      ? 'border-neutral-800 hover:border-neutral-700'
                      : 'border-neutral-800/60 opacity-80'
                  }`}
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 mb-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider shadow">
                            {product.badge}
                          </span>
                        )}
                        {!product.available && (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-900/90 text-neutral-400 border border-neutral-700 text-[10px] font-bold">
                            Tugagan
                          </span>
                        )}
                        {!product.isPriceConfirmed && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 text-[10px] font-bold">
                            Tez kunda
                          </span>
                        )}
                      </div>

                      {/* In-cart indicator badge */}
                      {isInCart && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-lg">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">
                          Narxi
                        </span>
                        {product.isPriceConfirmed ? (
                          <span className="text-base font-black text-amber-400">
                            {formatPrice(product.price)}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-neutral-400 italic">
                            Narxi tasdiqlanmoqda
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls (if available) */}
                      {product.available && product.isPriceConfirmed && (
                        <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.available || !product.isPriceConfirmed}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                        !product.available || !product.isPriceConfirmed
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-md shadow-red-600/20 active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Savatchaga qo‘shildi!</span>
                        </>
                      ) : !product.available ? (
                        <span>Vaqtincha sotuvda yo‘q</span>
                      ) : !product.isPriceConfirmed ? (
                        <span>Admin narx belgilashini kuting</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Savatchaga qo‘shish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
