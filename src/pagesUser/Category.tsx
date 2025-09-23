import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProductSection from './ComponentsUser/CardProduct';

type Category = { id: number; category_name: string };
type MaybePaginated<T> = T[] | { data: T[] };

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

const Kategori: React.FC = () => {
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // harga + sort
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | null>(null);

  // UI bottom-sheet (mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const normalize = <T,>(d: MaybePaginated<T>): T[] =>
    Array.isArray(d) ? d : (d as any)?.data ?? [];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const url = `${VITE_API_URL}/public/viewCategories`;
        const res = await axios.get<MaybePaginated<Category>>(url);
        const list = normalize(res.data)
          .filter((s) => !!s?.category_name)
          .map((s) => ({ id: s.id, category_name: s.category_name.trim() }));
        if (alive) setCategorys(list);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? 'Gagal memuat data category');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(categorys.map((s) => s.category_name)));
    return ['Semua', ...uniq];
  }, [categorys]);

  // selected category id (buat BE)
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === 'Semua') return null;
    const found = categorys.find((c) => c.category_name === selectedCategory);
    return found ? found.id : null;
  }, [selectedCategory, categorys]);

  // total filter aktif (untuk badge tombol Filter)
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (minPrice !== '' || maxPrice !== '') n++;
    if (sort) n++;
    return n;
  }, [minPrice, maxPrice, sort]);

  // reset filter harga + urutkan
  const resetFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort(null);
  };

  // util class untuk tombol sort
  const sortBtn = (active: boolean) =>
    [
      'h-11 rounded-full border px-4 font-medium transition',
      active
        ? 'bg-[#053F8C] text-white border-[#053F8C]'
        : 'bg-white text-gray-700 border-gray-300 active:scale-[0.99]'
    ].join(' ');

  // util class untuk input harga
  const priceInput =
    'h-11 w-full rounded-xl border border-gray-300 px-3 text-sm placeholder:text-gray-400 focus:border-[#053F8C] focus:outline-none focus:ring-2 focus:ring-[#053F8C]/20';

  return (
    <div className="container mx-auto px-4 pt-20 md:pt-0 my-6 md:my-10 md:flex gap-6">
      {/* ====== MOBILE TOP BAR: Kategori & Filter buttons ====== */}
      <div className="md:hidden mb-4 flex gap-2">
        <button
          onClick={() => setIsCategoryOpen(true)}
          className="h-11 flex-1 rounded-xl border border-gray-300 px-4 font-medium bg-white shadow-sm active:scale-[0.99]"
        >
          {selectedCategory === 'Semua' ? 'Kategori' : selectedCategory}
        </button>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="relative h-11 flex-1 rounded-xl border border-gray-300 px-4 font-medium bg-white shadow-sm active:scale-[0.99]"
        >
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#053F8C] px-1 text-[11px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ====== DESKTOP SIDEBAR KATEGORI ====== */}
      <aside className="hidden md:block w-64 p-4 h-[350px] py-6 shadow-md bg-white rounded-xl sticky top-20">
        <h3 className="font-bold text-primaryBrand mb-1">KATEGORI</h3>
        <hr className="border-b-textfont" />
        {loading ? (
          <div className="text-sm text-gray-500">Memuat...</div>
        ) : err ? (
          <div className="text-sm text-red-600">Error: {err}</div>
        ) : (
          <div className="h-[250px] my-4 overflow-y-auto">
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat}
                  role="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer font-lato py-1 transition-colors duration-200 ${
                    selectedCategory === cat
                      ? 'text-primaryBrand font-bold'
                      : 'text-subtleText hover:text-primaryBrand'
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 w-full p-0 md:p-7">
        {/* Desktop filter bar */}
        <div className="hidden md:flex items-end gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Harga Terendah</label>
            <input
              type="number"
              className={priceInput + ' w-40'}
              placeholder="Rp"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Harga Tertinggi</label>
            <input
              type="number"
              className={priceInput + ' w-40'}
              placeholder="Rp"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="ml-auto flex gap-2">
            <button
              className={sortBtn(sort === 'price_asc')}
              onClick={() => setSort('price_asc')}
              title="Termurah lebih dulu"
            >
              Harga ↓
            </button>
            <button
              className={sortBtn(sort === 'price_desc')}
              onClick={() => setSort('price_desc')}
              title="Termahal lebih dulu"
            >
              Harga ↑
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          {selectedCategory === 'Semua' ? 'Semua Produk' : `Produk: ${selectedCategory}`}
        </h2>

        <ProductSection
          categoryName={selectedCategory === 'Semua' ? null : selectedCategory}
          categoryId={selectedCategoryId ?? undefined}
          minPrice={minPrice === '' ? undefined : Number(minPrice)}
          maxPrice={maxPrice === '' ? undefined : Number(maxPrice)}
          sortPrice={sort ?? undefined}
        />
      </main>

      {/* ====== MOBILE BOTTOM SHEET: KATEGORI ====== */}
      {isCategoryOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={() => setIsCategoryOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[90] rounded-t-2xl bg-white shadow-2xl">
            <div className="mx-auto max-w-xl p-4">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Pilih Kategori</h3>
                <button
                  className="text-sm text-gray-600"
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setIsCategoryOpen(false);
                  }}
                >
                </button>
              </div>
              <div className="max-h-[55vh] overflow-y-auto pr-1">
                <ul className="divide-y">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`flex w-full items-center justify-between py-3 text-left ${
                          selectedCategory === cat ? 'text-primaryBrand font-semibold' : ''
                        }`}
                      >
                        <span>{cat}</span>
                        {selectedCategory === cat && (
                          <span className="ml-3 inline-block rounded-full bg-primaryBrand px-2 py-0.5 text-xs text-white">
                            Dipilih
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 pb-4" />
            </div>
          </div>
        </>
      )}

      {/* ====== MOBILE BOTTOM SHEET: FILTER ====== */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[90] rounded-t-2xl bg-white shadow-2xl">
            <div className="mx-auto max-w-xl p-4">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
              <h3 className="mb-3 text-base font-semibold">Filter</h3>

              {/* Harga */}
              <div className="mb-4">
                <div className="mb-2 font-medium">Harga</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Rp Terendah"
                    className={priceInput}
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(e.target.value ? Number(e.target.value.replace(/\D/g, '')) : '')
                    }
                  />
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Rp Tertinggi"
                    className={priceInput}
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? Number(e.target.value.replace(/\D/g, '')) : '')
                    }
                  />
                </div>
              </div>

              {/* Urutkan */}
              <div className="mb-4">
                <div className="mb-2 font-medium">Urutkan</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={sortBtn(sort === 'price_asc')}
                    onClick={() => setSort('price_asc')}
                  >
                    Harga Terendah
                  </button>
                  <button
                    className={sortBtn(sort === 'price_desc')}
                    onClick={() => setSort('price_desc')}
                  >
                    Harga Tertinggi
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="h-11 rounded-xl border border-gray-300 bg-white px-4 font-medium active:scale-[0.99]"
                  onClick={resetFilter}
                >
                  Reset
                </button>
                <button
                  className="h-11 rounded-xl bg-[#053F8C] px-4 font-semibold text-white active:scale-[0.99]"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Terapkan
                </button>
              </div>

              <div className="mt-3 pb-2" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Kategori;
