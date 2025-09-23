import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL as string;
const VITE_STORAGE_URL = (import.meta.env.VITE_STORAGE_URL || '') as string;

interface ApiProduct {
  id: number;
  product_name: string;
  price: number;
  sale_price?: number;
  product_image?: string;
  total_stock?: number;
  category_info?: { category_name?: string | null };
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  categoryName?: string | null;
}

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type SortKey = 'product_name' | 'created_at';
type PriceSort = 'price_asc' | 'price_desc';

type Props = {
  categoryName?: string | null;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortPrice?: 'price_asc' | 'price_desc';
  categoryId?: number;
  sort?: SortKey;
  perPage?: 10 | 15 | 20;
  page?: number;
  onPriceBounds?: (bounds: { min: number; max: number } | null) => void;
  onPageChange?: (page: number) => void;
};

const CardProduct: React.FC<Props> = ({
  search = '',
  sort = 'product_name',
  sortPrice = null,
  categoryName = null,
  minPrice,
  maxPrice,
  perPage = 10,
  page,
  onPageChange,
  categoryId,
  onPriceBounds,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const base = useMemo(() => VITE_STORAGE_URL.replace(/\/+$/, ''), []);
  const controlled = typeof page === 'number';
  const effectivePage = controlled ? page! : currentPage;

  // debounce search
  const searchRef = useRef<number | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    if (searchRef.current) window.clearTimeout(searchRef.current);
    searchRef.current = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => {
      if (searchRef.current) window.clearTimeout(searchRef.current);
    };
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErr(null);

      const params = new URLSearchParams();
      if (!categoryId && categoryName) params.set('category', categoryName);
      if (typeof minPrice === 'number') params.set('min_price', String(minPrice));
      if (typeof maxPrice === 'number') params.set('max_price', String(maxPrice));
      if (sortPrice) params.set('sort', sortPrice);
      // ... page/per_page/search kalau perlu
      const baseUrl = typeof categoryId === 'number'
        ? `${VITE_API_URL}/public/products/${categoryId}`
        : `${VITE_API_URL}/public/products`;

      const url = `${baseUrl}?${params.toString()}`;

      const res = await axios.get<PaginatedResponse<ApiProduct>>(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const formatted: Product[] = res.data.data.map((p) => ({
        id: p.id,
        name: p.product_name,
        price: p.sale_price ?? p.price,
        originalPrice: p.sale_price ? p.price : undefined,
        image: p.product_image
          ? `${base}/${String(p.product_image).replace(/^\/+/, '')}`
          : 'https://via.placeholder.com/600x400?text=No+Image',
        rating: 4,
        reviewCount: 0,
        stock: p.total_stock ?? 0,
        categoryName: p.category_info?.category_name ?? null,
      }));

      setProducts(formatted);
      const nums = formatted
        .map(p => Number(p.price))
        .filter(n => Number.isFinite(n));
      if (nums.length) {
        onPriceBounds?.({ min: Math.min(...nums), max: Math.max(...nums) });
      } else {
        onPriceBounds?.(null);
      }
      const prices = formatted
        .map(p => p.price)
        .filter(n => typeof n === 'number' && !Number.isNaN(n));

      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        onPriceBounds?.({ min, max });
      } else {
        onPriceBounds?.(null);
      }

      setLastPage(res.data.last_page || 1);
      if (!controlled) setCurrentPage(res.data.current_page || 1);
    } catch (e: any) {onPriceBounds?.(null);
      setErr(e?.message ?? 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!controlled) setCurrentPage(1);
  }, [debouncedSearch, sort, sortPrice, categoryName, categoryId, minPrice, maxPrice, perPage, controlled]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sort, sortPrice, minPrice, maxPrice, perPage, effectivePage, categoryName, categoryId]);


  // (opsional) fallback filter client-side kalau masih mau pertahankan
  const visibleProducts = useMemo(() => {
    // Server sudah filter kalau categoryId ada → jangan filter lagi di FE
    if (typeof categoryId === 'number') return products;
    if (!categoryName || categoryName === 'Semua') return products;
    return products.filter(
      (p) => (p.categoryName || '').trim() === categoryName.trim(),
    );
  }, [products, categoryId, categoryName]);


  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const handlePageChange = (p: number) => {
    if (controlled) onPageChange?.(p);
    else setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-screen-xl px-3 sm:px-4">
      {loading && <div className="mb-3 text-sm text-gray-500">Bentar…</div>}
      {err && <div className="mb-3 text-sm text-red-600">Error: {err}</div>}

      {/* Grid produk: center di desktop */}
      <div className="mx-auto max-w-6xl">
        <div
          className="
            grid grid-cols-2 gap-2
            sm:gap-3
            md:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]
          "
        >
          {visibleProducts.map((product) => {
            const hasDisc =
              typeof product.originalPrice === 'number' &&
              product.originalPrice > product.price;
            const discPct = hasDisc
              ? Math.round(
                ((product.originalPrice! - product.price) / product.originalPrice!) * 100,
              )
              : 0;

            return (
              <div
                key={product.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-2 sm:p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Badge */}
                <div className="absolute left-2 top-2 flex gap-1 text-[10px] font-semibold sm:left-3 sm:top-3 sm:text-[11px]">
                  <span className="rounded-full bg-[#053F8C] px-2 py-0.5 sm:px-2.5 sm:py-1 text-white shadow">
                    NEW
                  </span>
                  {hasDisc && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 sm:px-2.5 sm:py-1 text-white shadow">
                      -{discPct}%
                    </span>
                  )}
                </div>

                {/* Gambar */}
                <Link to={`/details/${product.id}`} className="block">
                  <div className="relative mb-2 overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105
                                 aspect-square sm:aspect-[4/3] lg:aspect-[3/2]"
                    />
                  </div>
                </Link>

                {/* Nama */}
                <h3 className="mb-1 text-xs sm:text-sm md:text-base font-semibold line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="mt-0.5 text-[11px] sm:text-xs md:text-sm text-yellow-400">
                  {'★'.repeat(product.rating || 0)}
                  {'☆'.repeat(5 - (product.rating || 0))}
                </div>

                {/* Harga */}
                <div className="mt-1 flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-[#053F8C]">
                    {formatPrice(product.price)}
                  </span>
                  {hasDisc && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                </div>

                {/* Tombol */}
                <div className="mt-2 sm:mt-3">
                  <Link to={`/details/${product.id}`}>
                    <button
                      className="w-full rounded-lg px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base font-semibold text-[#0B2A55]"
                      style={{ backgroundColor: '#F8BE28' }}
                    >
                      Beli
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => effectivePage > 1 && handlePageChange(effectivePage - 1)}
            disabled={effectivePage <= 1}
            className="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Halaman {effectivePage} / {lastPage}
          </span>
          <button
            onClick={() =>
              effectivePage < lastPage && handlePageChange(effectivePage + 1)
            }
            disabled={effectivePage >= lastPage}
            className="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* CTA mobile */}
      <div className="md:hidden" data-aos="fade-up">
        <Link
          to="/kategori"
          className="mt-6 inline-block rounded-lg border border-[#053F8C] px-6 py-3 font-medium text-[#053F8C] transition-colors hover:bg-[#053F8C] hover:text-white"
        >
          Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
};

export default CardProduct;
