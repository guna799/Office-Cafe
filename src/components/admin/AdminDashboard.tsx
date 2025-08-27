import React, { useState } from 'react';
import { BarChart3, Users, ShoppingBag, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { orders, menuItems } = useApp();

  // Calculate statistics
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.orderTime);
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const todayRevenue = todayOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  );

  const readyOrders = orders.filter(order => order.status === 'ready');

  const getStatusCount = (status: Order['status']) => {
    return orders.filter(order => order.status === status).length;
  };

  const stats = [
    {
      title: 'Today\'s Orders',
      value: todayOrders.length.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Orders',
      value: activeOrders.length.toString(),
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Ready for Pickup',
      value: readyOrders.length.toString(),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Today\'s Revenue',
      value: `$${todayRevenue.toFixed(2)}`,
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your cafeteria operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
          <div className="space-y-3">
            {[
              { status: 'pending', label: 'Pending', color: 'bg-yellow-200' },
              { status: 'confirmed', label: 'Confirmed', color: 'bg-blue-200' },
              { status: 'preparing', label: 'Preparing', color: 'bg-orange-200' },
              { status: 'ready', label: 'Ready', color: 'bg-green-200' },
              { status: 'completed', label: 'Completed', color: 'bg-gray-200' },
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {getStatusCount(status as Order['status'])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                    <p className="text-xs text-gray-600">{order.userName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Menu Items Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['breakfast', 'lunch', 'dinner', 'snacks', 'beverages'].map(category => {
            const count = menuItems.filter(item => item.category === category).length;
            const available = menuItems.filter(item => item.category === category && item.available).length;
            
            return (
              <div key={category} className="text-center">
                <h4 className="text-sm font-medium text-gray-700 capitalize">{category}</h4>
                <p className="text-2xl font-bold text-gray-900">{available}/{count}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};