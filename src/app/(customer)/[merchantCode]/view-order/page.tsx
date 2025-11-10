'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/common/Header';
import { formatCurrency } from '@/lib/utils/format';

/**
 * GENFITY - Cart Review Page
 * /[merchantCode]/view-order
 * 
 * Flow: Menu Browse → Cart Review → Payment → Order Summary
 * 
 * Features:
 * - View cart items with details
 * - Add order notes (catatan pemesanan)
 * - Edit quantity or remove items
 * - "Lanjut Bayar" button → /[merchantCode]/payment
 */
export default function ViewOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const merchantCode = params.merchantCode as string;
  const mode = searchParams.get('mode') || 'takeaway';

  const { cart, removeItem, updateItem, getTotal, getItemCount, initializeCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');

  // Initialize cart
  useEffect(() => {
    if (!cart || cart.merchantCode !== merchantCode || cart.mode !== mode) {
      initializeCart(merchantCode, mode as 'dinein' | 'takeaway');
    }
    setIsLoading(false);
  }, [cart, merchantCode, mode, initializeCart]);

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem(cartItemId, { quantity: newQuantity });
  };

  const handleRemoveItem = (cartItemId: string) => {
    if (confirm('Hapus item dari pesanan?')) {
      removeItem(cartItemId);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    // Save order notes to localStorage for payment page
    if (orderNotes.trim()) {
      localStorage.setItem(`order_notes_${merchantCode}_${mode}`, orderNotes.trim());
    }

    router.push(`/${merchantCode}/payment?mode=${mode}`);
  };

  const handleAddMore = () => {
    router.push(`/${merchantCode}/order?mode=${mode}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const itemCount = getItemCount();
  const total = getTotal();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header
        title="Keranjang"
        showBack
        onBack={() => router.back()}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Mode Information */}
        <div className="p-4 bg-secondary border-b border-neutral-200">
          <div className="mb-3">
            <p className="text-xs font-semibold text-tertiary mb-1">Tipe Pemesanan</p>
            <p className="text-sm font-semibold text-primary-dark">
              {mode === 'dinein' ? 'Makan di Tempat' : 'Ambil Sendiri'}
            </p>
          </div>
          
          {cart?.tableNumber && mode === 'dinein' && (
            <>
              <div className="h-px bg-neutral-200 my-3" />
              <div>
                <p className="text-xs font-semibold text-tertiary mb-1">Nomor Meja</p>
                <p className="text-sm font-semibold text-primary-dark">
                  Meja #{cart.tableNumber}
                </p>
              </div>
            </>
          )}

          <div className="h-px bg-neutral-200 my-3" />
          <div>
            <p className="text-xs font-semibold text-tertiary mb-1">Diambil</p>
            <p className="text-sm font-semibold text-primary-dark">Sekarang</p>
          </div>
        </div>

      {/* Cart Items List */}
      <main className="px-4 pb-4">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-[#1A1A1A]">
            Item ({cart.items.length})
          </h2>
        </div>

        <div className="space-y-3">
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="border border-[#E0E0E0] rounded-lg p-3 bg-white"
            >
              {/* Item Header */}
              <div className="flex gap-3 mb-3">
                {/* Image - 70x70px */}
                <div className="flex-shrink-0 w-[70px] h-[70px] bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-3xl">
                  🍜
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name - 14px/600 */}
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {item.menuName}
                  </h3>

                  {/* Base Price - 12px/400 */}
                  <p className="text-xs text-[#666666] mb-1">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>

                  {/* Addons - 12px/400 */}
                  {item.addons.length > 0 && (
                    <div className="space-y-0.5 mb-2">
                      {item.addons.map((addon, addonIndex) => (
                        <p key={addonIndex} className="text-xs text-[#999999]">
                          + {addon.name} ({formatCurrency(addon.price)})
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Notes - 12px/400 */}
                  {item.notes && (
                    <div className="mt-2 p-2 bg-[#F9F9F9] rounded border border-[#E0E0E0]">
                      <p className="text-xs text-[#666666]">
                        📝 {item.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="flex-shrink-0 self-start w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                  aria-label="Hapus item"
                >
                  🗑️
                </button>
              </div>

              {/* Item Footer: Price + Quantity Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E0E0E0]">
                {/* Subtotal - 16px/700 */}
                <span className="text-base font-bold text-[#FF6B35]">
                  {formatCurrency(item.subtotal)}
                </span>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  {/* Minus Button - 32x32px */}
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full border-2 border-[#E0E0E0] flex items-center justify-center text-lg text-[#1A1A1A] hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                  >
                    −
                  </button>

                  {/* Quantity Display - 14px/700 */}
                  <span className="text-sm font-bold text-[#1A1A1A] w-8 text-center">
                    {item.quantity}
                  </span>

                  {/* Plus Button - 32x32px */}
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    className="w-8 h-8 rounded-full border-2 border-[#FF6B35] bg-[#FF6B35] flex items-center justify-center text-lg text-white hover:bg-[#E55A2B] hover:border-[#E55A2B] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-6 p-4 bg-[#F9F9F9] rounded-lg border border-[#E0E0E0]">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">
            Ringkasan Pembayaran
          </h3>

          <div className="space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-[#666666]">
              <span>Subtotal ({cart.items.length} item)</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#E0E0E0] flex justify-between items-center">
              <span className="text-base font-bold text-[#1A1A1A]">Total</span>
              <span className="text-xl font-bold text-[#FF6B35]">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Button - 48px + padding */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-3 z-[90]">
        <Link
          href={`/${merchantCode}/payment?mode=${mode}`}
          className="w-full h-12 bg-[#FF6B35] text-white text-base font-semibold rounded-lg flex items-center justify-between px-5 hover:bg-[#E55A2B] transition-all active:scale-[0.98]"
        >
          <span>Lanjut Bayar</span>
          <span>{formatCurrency(total)}</span>
        </Link>
      </div>
    </div>
  );
}
