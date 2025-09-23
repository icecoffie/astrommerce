import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const STORAGE_BASE = (import.meta.env.VITE_STORAGE_URL || "https://api.isc-webdev.my.id/storage").replace(/\/$/, "");

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const withAsset = (path?: string) => {
  if (!path) return "/images/no-image.png";
  if (/^https?:\/\//i.test(path)) return path;
  return `${STORAGE_BASE}/${String(path).replace(/^\/+/, "")}`;
};

const formatCurrency = (n: any) =>
  (Number(n) || 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

type Product = {
  id: number;
  product_name: string;
  product_image?: string;
  sale_price?: number | string;
  price?: number | string;
  category_info?: { category_name?: string };
  supplier_info?: { supplier_name?: string };
};

const SearchResult: React.FC = () => {
  const q = useQuery();
  const keyword = q.get("keyword") || "";
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // coba 'keyword' dulu, fallback ke 'q'
        const urlKeyword = `${API_BASE}/public/products?keyword=${encodeURIComponent(keyword)}`;
        const urlQ = `${API_BASE}/public/products?q=${encodeURIComponent(keyword)}`;

        const res = await fetch(urlKeyword, { headers: { Accept: "application/json" } })
          .catch(() => fetch(urlQ, { headers: { Accept: "application/json" } }));
        const json = await res?.json();

        // robust ambil data
        let data: Product[] = [];
        if (Array.isArray(json)) data = json;
        else if (Array.isArray(json?.data)) data = json.data;
        else if (Array.isArray(json?.items)) data = json.items;
        else if (Array.isArray(json?.products)) data = json.products;
        else if (Array.isArray(json?.data?.data)) data = json.data.data;

        // Filter FE jika BE belum filter
        if (keyword && data.length > 0) {
          const kw = keyword.toLowerCase();
          data = data.filter(
            (p) =>
              String(p.product_name || "").toLowerCase().includes(kw) ||
              String(p.supplier_info?.supplier_name || "").toLowerCase().includes(kw) ||
              String(p.category_info?.category_name || "").toLowerCase().includes(kw),
          );
        }

        // Lengkapi URL gambar
        data = data.map((p) => ({ ...p, product_image: withAsset(p.product_image) }));

        setItems(data);
      } catch (e) {
        console.error("fetch search error:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div className="mx-auto max-w-screen-xl px-3 sm:px-4 pt-28 pb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Hasil Pencarian: “{keyword}”
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border p-2 sm:p-3">
              <div className="mb-2 h-36 sm:h-40 lg:h-48 w-full rounded-lg bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-600">Tidak ada produk ditemukan.</p>
      ) : (
        <div
          className="
            grid grid-cols-2 gap-2
            sm:gap-4
            md:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]
          "
        >
          {items.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-2 sm:p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Gambar */}
              <Link to={`/details/${p.id}`} className="block">
                <div className="relative mb-2 overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={p.product_image || "/images/no-image.png"}
                    alt={p.product_name}
                    loading="lazy"
                    className="w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105
                               aspect-square sm:aspect-[4/3] lg:aspect-[3/2]"
                  />
                </div>
              </Link>

              {/* Nama */}
              <h3 className="mb-1 text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
                {p.product_name}
              </h3>

              {/* Meta */}
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mb-1.5">
                {p.category_info?.category_name}
                {p.category_info?.category_name && p.supplier_info?.supplier_name ? " • " : ""}
                {p.supplier_info?.supplier_name}
              </p>

              {/* Harga */}
              <div className="mt-1 mb-2">
                {p.sale_price && (
                  <div className="text-sm sm:text-base md:text-lg font-bold text-[#053F8C]">
                    {formatCurrency(p.sale_price)}
                  </div>
                )}
                {p.price && (
                  <div className="text-xs sm:text-sm text-gray-400 line-through">
                    {formatCurrency(p.price)}
                  </div>
                )}
              </div>

              {/* Tombol */}
              <Link
                to={`/details/${p.id}`}
                className="block w-full rounded-lg border px-2 py-1.5 text-center text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base hover:bg-[#053F8C] hover:text-white transition"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
