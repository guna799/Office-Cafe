import React from 'react';
import { ChefHat, Home, ShoppingCart, Clock, Settings, Users, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isMenuOpen, 
  onMenuToggle 
}) => {
  const { user, logout } = useAuth();
  const { cart } = useApp();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: Clock },
    { id: 'menu', label: 'Menu', icon: Settings },
  ];

  const employeeMenuItems = [
    { id: 'browse', label: 'Browse Menu', icon: MenuIcon },
    { id: 'cart', label: `Cart ${cart.length > 0 ? `(${cart.length})` : ''}`, icon: ShoppingCart },
    { id: 'orders', label: 'My Orders', icon: Clock },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  const handleLogout = () => {
    logout();
    onMenuToggle();
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cafeteria</h1>
                <p className="text-sm text-gray-600">{user?.role === 'admin' ? 'Admin' : 'Employee'}</p>
              </div>
            </div>
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      onMenuToggle();
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition duration-200 ${
                      currentView === item.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};