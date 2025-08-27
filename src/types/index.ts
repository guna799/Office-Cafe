export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  employeeId?: string;
  department?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages';
  available: boolean;
  preparationTime: number; // in minutes
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  orderTime: Date;
  estimatedReady?: Date;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}