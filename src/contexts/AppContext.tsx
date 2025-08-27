import React, { createContext, useContext, useState, useCallback } from 'react';
import { MenuItem, Order, OrderItem } from '../types';

interface AppContextType {
  menuItems: MenuItem[];
  orders: Order[];
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItem: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (userId: string, userName: string, userEmail: string, notes?: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status'], estimatedReady?: Date) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (itemId: string) => void;
  sendNotification: (email: string, subject: string, message: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock data - In real app, this would be from a backend
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Grilled Chicken Sandwich',
      description: 'Tender grilled chicken breast with fresh lettuce, tomatoes, and mayo on toasted bread',
      price: 12.99,
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'lunch',
      available: true,
      preparationTime: 15,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce, parmesan cheese, croutons with classic Caesar dressing',
      price: 9.99,
      image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'lunch',
      available: true,
      preparationTime: 10,
    },
    {
      id: '3',
      name: 'Fresh Coffee',
      description: 'Freshly brewed premium coffee blend',
      price: 3.99,
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'beverages',
      available: true,
      preparationTime: 5,
    },
    {
      id: '4',
      name: 'Pancakes',
      description: 'Fluffy pancakes served with butter and maple syrup',
      price: 8.99,
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'breakfast',
      available: true,
      preparationTime: 12,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = useCallback((item: MenuItem, quantity: number, specialInstructions?: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.menuItemId === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity, specialInstructions }
            : cartItem
        );
      }
      return [...prev, { menuItemId: item.id, menuItem: item, quantity, specialInstructions }];
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== menuItemId));
  }, []);

  const updateCartItem = useCallback((menuItemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const placeOrder = useCallback(async (userId: string, userName: string, userEmail: string, notes?: string): Promise<string> => {
    if (cart.length === 0) throw new Error('Cart is empty');
    
    const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const maxPreparationTime = Math.max(...cart.map(item => item.menuItem.preparationTime));
    const estimatedReady = new Date();
    estimatedReady.setMinutes(estimatedReady.getMinutes() + maxPreparationTime);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      items: [...cart],
      status: 'pending',
      total,
      orderTime: new Date(),
      estimatedReady,
      notes,
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Send confirmation email
    await sendNotification(
      userEmail,
      'Order Confirmation',
      `Your order #${newOrder.id} has been placed successfully. Estimated ready time: ${estimatedReady.toLocaleTimeString()}`
    );
    
    return newOrder.id;
  }, [cart, clearCart]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], estimatedReady?: Date) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status, ...(estimatedReady && { estimatedReady }) };
          
          // Send notification email for status updates
          if (status === 'ready') {
            sendNotification(
              order.userEmail,
              'Order Ready for Pickup',
              `Your order #${orderId} is ready for pickup at the cafeteria!`
            );
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  }, []);

  const updateMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => prev.map(menuItem => menuItem.id === item.id ? item : menuItem));
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems(prev => [...prev, newItem]);
  }, []);

  const deleteMenuItem = useCallback((itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const sendNotification = useCallback(async (email: string, subject: string, message: string) => {
    // Simulate email sending - In real app, this would call a backend API
    console.log(`Email sent to ${email}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }, []);

  const value: AppContextType = {
    menuItems,
    orders,
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    placeOrder,
    updateOrderStatus,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    sendNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};