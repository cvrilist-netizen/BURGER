import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CustomerMenu } from './components/CustomerMenu';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTracker } from './components/OrderTracker';
import { KitchenDashboard } from './components/KitchenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Product, RestaurantSettings, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './data/initialMenu';
import { subscribeToProducts } from './services/productService';
import { subscribeToRestaurantSettings, fetchRestaurantSettings } from './services/settingsService';
import { subscribeToOrders } from './services/orderService';

export function MainApp() {
  const [activeTab, setActiveTab] = useState<'menu' | 'track' | 'kitchen' | 'admin'>('menu');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Newly created order for success celebration popup
  const [newlyCreatedOrder, setNewlyCreatedOrder] = useState<Order | null>(null);
  const [selectedOrderIdForTracking, setSelectedOrderIdForTracking] = useState<string | null>(null);

  // Sync hash routing if user opens with #kitchen or #admin or #track
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['menu', 'track', 'kitchen', 'admin'].includes(hash)) {
        setActiveTab(hash as 'menu' | 'track' | 'kitchen' | 'admin');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab: 'menu' | 'track' | 'kitchen' | 'admin') => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubProducts = subscribeToProducts((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        setProducts(loadedProducts);
      }
    });

    const unsubSettings = subscribeToRestaurantSettings((loadedSettings) => {
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    });

    const unsubOrders = subscribeToOrders((loadedOrders) => {
      if (loadedOrders) {
        setOrders(loadedOrders);
      }
    });

    return () => {
      unsubProducts();
      unsubSettings();
      unsubOrders();
    };
  }, []);

  const handleOrderCreated = (order: Order) => {
    setNewlyCreatedOrder(order);
    setSelectedOrderIdForTracking(order.id);
  };

  const handleTrackFromSuccessModal = (orderId: string) => {
    setNewlyCreatedOrder(null);
    setSelectedOrderIdForTracking(orderId);
    handleTabChange('track');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        settings={settings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'menu' && (
          <CustomerMenu
            products={products}
            settings={settings}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenCart={() => {}}
            onTrackOrderClick={() => handleTabChange('track')}
          />
        )}

        {activeTab === 'track' && (
          <OrderTracker
            initialOrderId={selectedOrderIdForTracking}
            settings={settings}
            onGoToMenu={() => handleTabChange('menu')}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenDashboard settings={settings} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            settings={settings}
            orders={orders}
            onRefreshSettings={async () => {
              const fresh = await fetchRestaurantSettings();
              setSettings(fresh);
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        settings={settings}
        onOrderCreated={handleOrderCreated}
      />

      {/* Order Confirmation / Success Modal */}
      <OrderSuccessModal
        order={newlyCreatedOrder}
        settings={settings}
        onClose={() => setNewlyCreatedOrder(null)}
        onTrackOrder={handleTrackFromSuccessModal}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenKitchen={() => handleTabChange('kitchen')}
        onOpenAdmin={() => handleTabChange('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
