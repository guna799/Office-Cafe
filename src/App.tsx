import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { OTPVerification } from './components/auth/OTPVerification';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrderManagement } from './components/admin/OrderManagement';
import { MenuManagement } from './components/admin/MenuManagement';
import { MenuBrowser } from './components/employee/MenuBrowser';
import { Cart } from './components/employee/Cart';
import { OrderHistory } from './components/employee/OrderHistory';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState(
    user?.role === 'admin' ? 'dashboard' : 'browse'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    if (user?.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'orders':
          return <OrderManagement />;
        case 'menu':
          return <MenuManagement />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentView) {
        case 'browse':
          return <MenuBrowser />;
        case 'cart':
          return <Cart />;
        case 'orders':
          return <OrderHistory />;
        default:
          return <MenuBrowser />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Office Cafeteria
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AuthApp: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
  const [otpEmail, setOtpEmail] = useState('');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <AppProvider>
        <AuthenticatedApp />
      </AppProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {authMode === 'login' && (
            <LoginForm onToggleMode={() => setAuthMode('register')} />
          )}
          {authMode === 'register' && (
            <RegisterForm 
              onToggleMode={() => setAuthMode('login')}
              onOTPRequired={(email) => {
                setOtpEmail(email);
                setAuthMode('otp');
              }}
            />
          )}
          {authMode === 'otp' && (
            <OTPVerification 
              email={otpEmail}
              onBack={() => setAuthMode('register')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
}

export default App;