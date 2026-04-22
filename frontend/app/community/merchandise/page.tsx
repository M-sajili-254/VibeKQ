'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react';
import { communityService, getImageUrl } from '@/utils/api';

export default function Merchandise() {
  const [merchandise, setMerchandise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const data = await communityService.getMerchandise();
        setMerchandise(data.results || data || []);
      } catch (error) {
        console.error('Error fetching merchandise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchandise();
  }, []);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return merchandise.reduce((total: number, item: any) => {
      const quantity = cart[item.id] || 0;
      return total + (parseFloat(item.price) * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">KQ Merchandise</h1>
              <p className="text-xl">Show your pride with official Kenya Airways gear</p>
            </div>
            {getCartItemCount() > 0 && (
              <div className="bg-white text-red-700 px-6 py-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-semibold">Cart</p>
                    <p className="text-2xl font-bold">{getCartItemCount()} items</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Merchandise Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : merchandise.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Merchandise Available</h2>
              <p className="text-gray-500">Check back soon for new items!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {merchandise.map((item: any) => (
                <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-xl transition group">
                  <div className="relative h-64 bg-gradient-to-br from-red-100 to-red-50 overflow-hidden rounded-t-lg">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image) || ''}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-20 h-20 text-red-300" />
                      </div>
                    )}
                    {item.featured && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-red-700">
                          {item.currency} {parseFloat(item.price).toFixed(2)}
                        </p>
                        {item.stock_quantity > 0 && item.stock_quantity < 10 && (
                          <p className="text-xs text-orange-600">Only {item.stock_quantity} left!</p>
                        )}
                      </div>
                    </div>

                    {item.available ? (
                      cart[item.id] ? (
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold">{cart[item.id]}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total ({getCartItemCount()} items)</p>
              <p className="text-2xl font-bold text-red-700">
                USD {getCartTotal().toFixed(2)}
              </p>
            </div>
            <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
