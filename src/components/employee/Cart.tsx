import React, { useState } from 'react';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartItem, clearCart, placeOrder } = useApp();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;

    setIsPlacing(true);
    try {
      await placeOrder(user.id, user.name, user.email, notes);
      setNotes('');
      alert('Order placed successfully!');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500">Add some delicious items from the menu!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Order</h2>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {cart.map(item => (
          <div key={item.menuItemId} className="flex items-center space-x-4">
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
              <p className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)} each</p>
              {item.specialInstructions && (
                <p className="text-xs text-gray-500 italic">Note: {item.specialInstructions}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateCartItem(item.menuItemId, item.quantity - 1)}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateCartItem(item.menuItemId, item.quantity + 1)}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="text-right">
              <p className="font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.menuItemId)}
                className="text-red-500 hover:text-red-600 mt-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Any special requests for your entire order..."
            />
          </div>

          <div className="flex items-center justify-between py-4 border-t">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-orange-500">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            {isPlacing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};