"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { LocalCart, LocalCartItem } from "@/lib/types/cart";

/**
 * GENFITY - Cart Context & Provider
 * 
 * Manages shopping cart state with localStorage persistence.
 * Supports multi-merchant carts with different order modes.
 * 
 * @specification FRONTEND_SPECIFICATION.md - Cart Management
 * 
 * localStorage keys:
 * - cart_[merchantCode]_dinein - Dine-in cart
 * - cart_[merchantCode]_takeaway - Takeaway cart
 * - table_number_[merchantCode] - Table number for dine-in
 * 
 * Cart structure:
 * {
 *   merchantCode: string,
 *   mode: "dinein" | "takeaway",
 *   tableNumber?: string,
 *   items: LocalCartItem[]
 * }
 * 
 * Features:
 * - Add/remove/update items
 * - Clear cart
 * - Persist to localStorage
 * - Sync across tabs via storage events
 * - Calculate totals automatically
 */

interface CartContextType {
  cart: LocalCart | null;
  addItem: (item: Omit<LocalCartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateItem: (cartItemId: string, updates: Partial<LocalCartItem>) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: string) => void;
  getItemCount: () => number;
  getTotal: () => number;
  initializeCart: (merchantCode: string, mode: "dinein" | "takeaway") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Custom hook to access cart context
 * @throws {Error} If used outside CartProvider
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Cart Provider Component
 * Wraps app to provide cart state management
 */
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<LocalCart | null>(null);

  /**
   * Get localStorage key for current cart
   */
  const getStorageKey = useCallback((merchantCode: string, mode: "dinein" | "takeaway") => {
    return `cart_${merchantCode}_${mode}`;
  }, []);

  /**
   * Load cart from localStorage
   */
  const loadCart = useCallback((merchantCode: string, mode: "dinein" | "takeaway") => {
    if (typeof window === "undefined") return null;
    
    const key = getStorageKey(merchantCode, mode);
    const stored = localStorage.getItem(key);
    
    if (stored) {
      try {
        return JSON.parse(stored) as LocalCart;
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        return null;
      }
    }
    return null;
  }, [getStorageKey]);

  /**
   * Save cart to localStorage
   */
  const saveCart = useCallback((cartData: LocalCart) => {
    if (typeof window === "undefined") return;
    
    const key = getStorageKey(cartData.merchantCode, cartData.mode);
    localStorage.setItem(key, JSON.stringify(cartData));
    
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartData }));
  }, [getStorageKey]);

  /**
   * Initialize cart for a merchant and mode
   */
  const initializeCart = useCallback((merchantCode: string, mode: "dinein" | "takeaway") => {
    const existingCart = loadCart(merchantCode, mode);
    
    if (existingCart) {
      setCart(existingCart);
    } else {
      const newCart: LocalCart = {
        merchantCode,
        mode,
        items: [],
      };
      setCart(newCart);
      saveCart(newCart);
    }
  }, [loadCart, saveCart]);

  /**
   * Add item to cart
   * If item with same menuId and addons exists, increase quantity
   */
  const addItem = useCallback((item: Omit<LocalCartItem, "cartItemId">) => {
    if (!cart) return;

    setCart((prevCart) => {
      if (!prevCart) return prevCart;

      const newCart = { ...prevCart };
      
      // Check if item with same configuration exists
      const existingItemIndex = newCart.items.findIndex(
        (i) =>
          i.menuId === item.menuId &&
          JSON.stringify(i.addons) === JSON.stringify(item.addons)
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        newCart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item with unique ID
        const cartItemId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newCart.items.push({ ...item, cartItemId });
      }

      saveCart(newCart);
      return newCart;
    });
  }, [cart, saveCart]);

  /**
   * Remove item from cart by cartItemId
   */
  const removeItem = useCallback((cartItemId: string) => {
    if (!cart) return;

    setCart((prevCart) => {
      if (!prevCart) return prevCart;

      const newCart = {
        ...prevCart,
        items: prevCart.items.filter((item) => item.cartItemId !== cartItemId),
      };

      saveCart(newCart);
      return newCart;
    });
  }, [cart, saveCart]);

  /**
   * Update item in cart (quantity, addons, notes)
   */
  const updateItem = useCallback((cartItemId: string, updates: Partial<LocalCartItem>) => {
    if (!cart) return;

    setCart((prevCart) => {
      if (!prevCart) return prevCart;

      const newCart = {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, ...updates }
            : item
        ),
      };

      saveCart(newCart);
      return newCart;
    });
  }, [cart, saveCart]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    if (!cart) return;

    const newCart: LocalCart = {
      ...cart,
      items: [],
    };

    setCart(newCart);
    saveCart(newCart);
  }, [cart, saveCart]);

  /**
   * Set table number for dine-in orders
   */
  const setTableNumber = useCallback((tableNumber: string) => {
    if (!cart || cart.mode !== "dinein") return;

    const newCart = {
      ...cart,
      tableNumber,
    };

    setCart(newCart);
    saveCart(newCart);

    // Also save table number separately for easy access
    localStorage.setItem(`table_number_${cart.merchantCode}`, tableNumber);
  }, [cart, saveCart]);

  /**
   * Get total number of items in cart
   */
  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  /**
   * Get total price of all items in cart
   */
  const getTotal = useCallback(() => {
    if (!cart) return 0;
    
    return cart.items.reduce((sum, item) => {
      const addOnsTotal = item.addons?.reduce(
        (addonSum, addon) => addonSum + addon.price,
        0
      ) || 0;
      return sum + (item.price + addOnsTotal) * item.quantity;
    }, 0);
  }, [cart]);

  /**
   * Listen for storage events (cross-tab sync)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (!cart) return;
      
      const key = getStorageKey(cart.merchantCode, cart.mode);
      
      if (e.key === key && e.newValue) {
        try {
          const updatedCart = JSON.parse(e.newValue) as LocalCart;
          setCart(updatedCart);
        } catch (error) {
          console.error("Failed to parse cart from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [cart, getStorageKey]);

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    setTableNumber,
    getItemCount,
    getTotal,
    initializeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

