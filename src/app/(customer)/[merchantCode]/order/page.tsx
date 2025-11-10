'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import FloatingCartButton from '@/components/cart/FloatingCartButton';
import MenuDetailModal from '@/components/menu/MenuDetailModal';
import { formatCurrency } from '@/lib/utils/format';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

/**
 * GENFITY - Menu Browse Page
 * Main page for browsing menu with categories
 * 
 * Features:
 * - Horizontal category tabs with scroll
 * - Menu grid with images, names, prices
 * - Search bar
 * - FloatingCartButton visible
 * - Click menu item → open MenuDetailModal
 */
export default function MenuBrowsePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const merchantCode = params.merchantCode as string;
  const mode = searchParams.get('mode') || 'takeaway';

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/public/merchants/${merchantCode}/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories([{ id: -1, name: 'Semua' }, ...data.data]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [merchantCode]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
        const response = await fetch(`/api/public/merchants/${merchantCode}/menus${categoryParam}`);
        const data = await response.json();
        
        if (data.success) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [merchantCode, selectedCategory]);

  // Filter by search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.stock > 0) {
      setSelectedMenu(menu);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header
        title={merchantCode.toUpperCase()}
        showBack
        onBack={() => router.back()}
        rightActions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-secondary">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        }
      />

      {/* Search Bar (Slide-in) */}
      {showSearch && (
        <div className="px-4 py-3 bg-white border-b border-neutral-200 animate-slide-down">
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 ring-primary/20"
            autoFocus
          />
        </div>
      )}

      {/* Categories Horizontal Scroll */}
      <div className="sticky top-[56px] z-40 bg-white border-b border-neutral-200">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all
                ${selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary hover:bg-primary-light'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-base font-semibold text-primary-dark mb-2">
              {searchQuery ? 'Menu tidak ditemukan' : 'Belum ada menu'}
            </p>
            <p className="text-sm text-secondary">
              {searchQuery ? 'Coba kata kunci lain' : 'Menu akan ditambahkan segera'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`
                  flex gap-3 p-3 bg-white rounded-lg border border-neutral-200 shadow-card
                  transition-all duration-200
                  ${item.stock > 0 ? 'cursor-pointer hover:shadow-lg active:scale-[0.98]' : 'opacity-60'}
                `}
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-[70px] h-[70px] rounded-lg object-cover bg-secondary"
                    />
                  ) : (
                    <div className="w-[70px] h-[70px] rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-primary-dark line-clamp-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-tertiary mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-base font-bold text-primary mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Add Button */}
                <div className="flex-shrink-0 flex items-center">
                  <button
                    disabled={item.stock === 0}
                    className={`
                      w-[70px] h-9 rounded-lg text-xs font-semibold transition-all
                      ${item.stock > 0
                        ? 'bg-primary text-white hover:bg-primary-hover active:scale-95'
                        : 'bg-neutral-200 text-tertiary cursor-not-allowed'
                      }
                    `}
                  >
                    {item.stock > 0 ? 'Tambah' : 'Habis'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton merchantCode={merchantCode} mode={mode as 'dinein' | 'takeaway'} />

      {/* Menu Detail Modal */}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          merchantCode={merchantCode}
          mode={mode}
          onClose={() => setSelectedMenu(null)}
        />
      )}
    </div>
  );
}
