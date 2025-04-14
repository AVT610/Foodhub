import React, { useState } from 'react';
import { Search, ShoppingBag, Clock, Star, ChevronDown, MapPin, Heart, X, Plus, Minus } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{id: number; name: string; price: number; quantity: number}[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const restaurants = [
    {
      id: 1,
      name: "Urban Kitchen",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070",
      rating: 4.8,
      deliveryTime: "20-30",
      minOrder: 15,
      cuisine: "American",
      featured: true,
      category: "Burgers",
      menu: [
        { id: 101, name: "Classic Burger", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=2070" },
        { id: 102, name: "Chicken Wings", price: 10.99, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=2070" },
      ]
    },
    {
      id: 2,
      name: "Sushi Master",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=2070",
      rating: 4.9,
      deliveryTime: "25-35",
      minOrder: 20,
      cuisine: "Japanese",
      featured: true,
      category: "Sushi",
      menu: [
        { id: 201, name: "California Roll", price: 14.99, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=2070" },
        { id: 202, name: "Salmon Nigiri", price: 16.99, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&q=80&w=2070" },
      ]
    },
    {
      id: 3,
      name: "Pizza Paradise",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2070",
      rating: 4.7,
      deliveryTime: "15-25",
      minOrder: 12,
      cuisine: "Italian",
      featured: true,
      category: "Pizza",
      menu: [
        { id: 301, name: "Margherita Pizza", price: 15.99, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=2070" },
        { id: 302, name: "Pepperoni Pizza", price: 17.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=2070" },
      ]
    }
  ];

  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Sushi", icon: "🍱" },
    { name: "Burgers", icon: "🍔" },
    { name: "Salads", icon: "🥗" },
    { name: "Desserts", icon: "🍰" },
    { name: "Drinks", icon: "🥤" }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (itemId: number, name: string, price: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: itemId, name, price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setCart([]);
      setCartOpen(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">FoodHub</span>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for restaurants or dishes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <MapPin className="h-5 w-5 mr-1" />
                <span>Location</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <button 
                className="relative px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                    <button
                      className="ml-3 h-7 w-7 text-gray-400 hover:text-gray-500"
                      onClick={() => setCartOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {orderConfirmed && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                      Order confirmed! Thank you for your purchase. 🎉
                    </div>
                  )}

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <p className="text-gray-500">Your cart is empty</p>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                          {cart.map((item) => (
                            <li key={item.id} className="py-6 flex">
                              <div className="flex-1 flex flex-col">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center mt-2">
                                  <button
                                    className="p-1 text-gray-400 hover:text-gray-500"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-2 text-gray-600">{item.quantity}</span>
                                  <button
                                    className="p-1 text-gray-400 hover:text-gray-500"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="ml-4 text-red-500 hover:text-red-600"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {cart.length > 0 && !orderConfirmed && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${cartTotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-orange-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-orange-600"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Delicious Food Delivered To Your Door</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Order from the best local restaurants with easy, on-demand delivery.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45.7C120 41.3 240 32.7 360 29.2C480 25.7 600 27.3 720 35.8C840 44.3 960 59.7 1080 64.2C1200 68.7 1320 62.3 1380 59.2L1440 56V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                selectedCategory === category.name ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory ? `${selectedCategory} Restaurants` : 'Featured Restaurants'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div>
                    <span>Min. order ${restaurant.minOrder}</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4 mt-4">
                  <h4 className="font-semibold text-gray-900">Popular Items</h4>
                  {restaurant.menu.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item.id, item.name, item.price)}
                        className="px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Email: support@foodhub.com</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Phone: (555) 123-4567</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2025 FoodHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;