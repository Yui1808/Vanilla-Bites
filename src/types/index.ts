export type Role = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_STAFF' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED';

export type PaymentMethod = 'COD' | 'RAZORPAY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  restaurantId?: string | null;
}

export interface CustomizationSelection {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number; // in paise
}

export interface CartItem {
  id: string; // unique item cart key (composite of menuItemId + selections)
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  image: string;
  price: number; // base price in paise
  quantity: number;
  isVeg: boolean;
  customizations: CustomizationSelection[];
  specialInstructions?: string;
  itemTotal: number; // calculated (price + customization additions) * quantity in paise
}

export interface CartRestaurantInfo {
  id: string;
  name: string;
  slug: string;
  deliveryFee: number;
  minOrder: number;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number; // calculated in paise
}

