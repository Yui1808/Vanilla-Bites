'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartRestaurantInfo, AppliedCoupon } from '@/types';

interface CartContextType {
  items: CartItem[];
  restaurant: CartRestaurantInfo | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (
    item: Omit<CartItem, 'id' | 'itemTotal'>,
    restaurant: CartRestaurantInfo
  ) => { conflict: boolean; conflictRestaurant?: CartRestaurantInfo; pendingItem?: Omit<CartItem, 'id' | 'itemTotal'> };
  resolveConflict: (replace: boolean) => void;
  pendingConflict: {
    restaurant: CartRestaurantInfo;
    item: Omit<CartItem, 'id' | 'itemTotal'>;
  } | null;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number; // in paise
  deliveryFee: number; // in paise
  tax: number; // in paise (5% GST)
  discount: number; // in paise
  total: number; // in paise
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vanilla_bites_cart_v1';
const RESTAURANT_STORAGE_KEY = 'vanilla_bites_cart_restaurant_v1';
const COUPON_STORAGE_KEY = 'vanilla_bites_cart_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurant, setRestaurant] = useState<CartRestaurantInfo | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingConflict, setPendingConflict] = useState<{
    restaurant: CartRestaurantInfo;
    item: Omit<CartItem, 'id' | 'itemTotal'>;
  } | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(CART_STORAGE_KEY);
      const savedRest = localStorage.getItem(RESTAURANT_STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedRest) setRestaurant(JSON.parse(savedRest));
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch {
      // Local storage not available or invalid
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (restaurant) {
        localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(restaurant));
      } else {
        localStorage.removeItem(RESTAURANT_STORAGE_KEY);
      }
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Local storage error
    }
  }, [items, restaurant, appliedCoupon]);

  // Generate unique item key based on id and customization selections
  const generateCartItemId = (
    menuItemId: string,
    customizations: CartItem['customizations']
  ) => {
    const custKey = [...customizations]
      .sort((a, b) => a.optionId.localeCompare(b.optionId))
      .map((c) => c.optionId)
      .join('-');
    return `${menuItemId}_${custKey || 'base'}`;
  };

  const calculateItemTotal = (
    basePrice: number,
    customizations: CartItem['customizations'],
    quantity: number
  ) => {
    const addOns = customizations.reduce((sum, c) => sum + c.price, 0);
    return (basePrice + addOns) * quantity;
  };

  const addItem = (
    rawItem: Omit<CartItem, 'id' | 'itemTotal'>,
    newRestaurant: CartRestaurantInfo
  ) => {
    // If cart already has items from another restaurant, show conflict
    if (restaurant && restaurant.id !== newRestaurant.id && items.length > 0) {
      setPendingConflict({ restaurant: newRestaurant, item: rawItem });
      return {
        conflict: true,
        conflictRestaurant: restaurant,
        pendingItem: rawItem,
      };
    }

    // Set restaurant
    if (!restaurant || items.length === 0) {
      setRestaurant(newRestaurant);
    }

    const uniqueId = generateCartItemId(rawItem.menuItemId, rawItem.customizations);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === uniqueId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + rawItem.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          itemTotal: calculateItemTotal(existing.price, existing.customizations, newQty),
        };
        return updated;
      } else {
        const itemTotal = calculateItemTotal(
          rawItem.price,
          rawItem.customizations,
          rawItem.quantity
        );
        return [...prev, { ...rawItem, id: uniqueId, itemTotal }];
      }
    });

    setIsOpen(true);
    return { conflict: false };
  };

  const resolveConflict = (replace: boolean) => {
    if (!pendingConflict) return;
    if (replace) {
      // Clear current cart and add new item
      const { restaurant: newRest, item } = pendingConflict;
      const uniqueId = generateCartItemId(item.menuItemId, item.customizations);
      const itemTotal = calculateItemTotal(item.price, item.customizations, item.quantity);
      setRestaurant(newRest);
      setItems([{ ...item, id: uniqueId, itemTotal }]);
      setAppliedCoupon(null);
      setPendingConflict(null);
      setIsOpen(true);
    } else {
      // Discard pending item
      setPendingConflict(null);
    }
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== itemId);
      if (filtered.length === 0) {
        setRestaurant(null);
        setAppliedCoupon(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === itemId);
      if (index === -1) return prev;
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        const filtered = prev.filter((i) => i.id !== itemId);
        if (filtered.length === 0) {
          setRestaurant(null);
          setAppliedCoupon(null);
        }
        return filtered;
      }
      const updated = [...prev];
      updated[index] = {
        ...item,
        quantity: newQty,
        itemTotal: calculateItemTotal(item.price, item.customizations, newQty),
      };
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setAppliedCoupon(null);
    setPendingConflict(null);
  };

  // Price calculations in paise (integers)
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = restaurant && items.length > 0 ? restaurant.deliveryFee : 0;
  // 5% standard GST on restaurant food
  const tax = Math.round(subtotal * 0.05);

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
    // Cannot discount more than subtotal
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code.' };
    
    // Check coupons via API or predefined
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}&restaurantId=${restaurant?.id || ''}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        return { success: false, message: data.message || 'Invalid or expired coupon.' };
      }
      setAppliedCoupon({
        id: data.coupon.id,
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        discountAmount: data.discountAmount,
      });
      return { success: true, message: `Coupon ${data.coupon.code} applied successfully!` };
    } catch {
      // Fallback for offline or demo coupon validation
      if (cleanCode === 'VANILLA20') {
        const discountVal = Math.round((subtotal * 20) / 100);
        setAppliedCoupon({
          id: 'demo-vanilla20',
          code: 'VANILLA20',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          discountAmount: discountVal,
        });
        return { success: true, message: '20% discount applied!' };
      } else if (cleanCode === 'FEAST100') {
        setAppliedCoupon({
          id: 'demo-feast100',
          code: 'FEAST100',
          discountType: 'FIXED',
          discountValue: 10000, // ₹100
          discountAmount: 10000,
        });
        return { success: true, message: '₹100 discount applied!' };
      }
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        isOpen,
        setIsOpen,
        addItem,
        resolveConflict,
        pendingConflict,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

