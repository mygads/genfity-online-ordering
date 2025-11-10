'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCart } from '@/lib/utils/localStorage';
import { formatCurrency } from '@/lib/utils/format';
import type { LocalCart } from '@/lib/types/cart';

interface FloatingCartButtonProps {
  merchantCode: string;
  mode?: 'dinein' | 'takeaway';
}

/**
 * GENFITY - Floating Cart Button Component
 * 
 * Fixed bottom-right button showing cart item count and total price.
 * Navigates to cart review page on click. Auto-updates via localStorage events.
 * 
 * @specification FRONTEND_SPECIFICATION.md - FLOATING CART BUTTON
 * 
 * Design specs:
 * - Position: Fixed bottom-right (bottom: 16px, right: 16px)
 * - Size: 110px × 64px
 * - Background: #FF6B35 (bg-primary)
 * - Shadow: 0 4px 12px rgba(255, 107, 53, 0.4) (shadow-floating)
 * - z-index: 50 (below header z-100)
 * - Border-radius: 12px
 * 
 * Content:
 * - Line 1: "[count] Item" (12px, weight 500, rgba(255,255,255,0.8))
 * - Line 2: "Rp[total]" (14px, weight 700, white)
 * 
 * Behavior:
 * - Hide when cart is empty
 * - Pulse animation on item add
 * - Hover: Darken (#E55A2B) + scale(1.05)
 * - Click: Navigate to /:merchantCode/view-order?mode=[mode]
 * 
 * @param {string} merchantCode - Merchant identifier for routing
 * @param {string} mode - Order mode: "dinein" or "takeaway"
 */
export default function FloatingCartButton({ merchantCode, mode }: FloatingCartButtonProps) {
  const router = useRouter();
  const [cart, setCart] = useState<LocalCart | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const currentMode = mode || 'dinein';
      const cartData = getCart(merchantCode, currentMode);
      setCart(cartData);
    };

    loadCart();

    // Listen for storage changes (cart updates)
    const handleStorageChange = () => {
      loadCart();
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom cart update event
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, [merchantCode, mode]);

  // Don't show if cart is empty
  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate total items and price
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => {
    const addOnsTotal = item.addons?.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0) || 0;
    return sum + ((item.price + addOnsTotal) * item.quantity);
  }, 0);

  const handleClick = () => {
    const modeParam = mode || cart.mode || 'dinein';
    router.push(`/${merchantCode}/view-order?mode=${modeParam}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-4 right-4 z-50
        flex flex-col items-center justify-center
        w-[110px] h-16
        bg-primary text-white
        rounded-xl
        shadow-floating
        hover:bg-primary-hover
        hover:scale-105
        active:scale-95
        transition-all duration-200
        ${pulse ? 'animate-pulse' : ''}
      `}
      aria-label={`View cart: ${totalItems} items, total ${formatCurrency(totalPrice)}`}
    >
      {/* Item count - 12px/500/rgba(255,255,255,0.8) */}
      <span className="text-xs font-medium text-white/80">
        {totalItems} Item
      </span>
      
      {/* Total price - 14px/700/white */}
      <span className="text-sm font-bold text-white mt-0.5">
        {formatCurrency(totalPrice)}
      </span>
    </button>
  );
}


