import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL as string;
const VITE_STORAGE_URL = (import.meta.env.VITE_STORAGE_URL || '') as string;

type StockItem = {
  id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
};

type Variant = {
  id: number;
  variant_name: string;
  additional_price: number;
};

type ProductDetail = {
  id: number;
  product_name: string;
  product_description?: string;
  sale_price: string | number;
  product_image?: string | null;
  total_stock: number;
  stocks?: StockItem[];
};

const Details: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantStock, setVariantStock] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // branding color
  const brandYellow = '#F8BE28';
  const brandYellowHover = '#E0A91F';
  const brandNavy = '#053F8C';

  const storageBase = useMemo(() => VITE_STORAGE_URL.replace(/\/+$/, ''), []);
  const productImg = useMemo(() => {
    if (!product?.product_image) {
      return 'https://via.placeholder.com/1200x800?text=No+Image';
    }
    return `${storageBase}/${String(product.product_image).replace(/^\/+/, '')}`;
  }, [product, storageBase]);

  const basePrice = Number(product?.sale_price ?? 0);
  const variantPrice = Number(selectedVariant?.additional_price ?? 0);
  const finalPrice = basePrice + variantPrice;
  const subtotal = qty * finalPrice;

  // Fetch product detail
  const fetchProduct = async () => {
    try {
      const res = await axios.get<ProductDetail>(`${VITE_API_URL}/products/details/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setProduct(res.data);

      // kalau gak ada varian sama sekali, pakai total_stock
      if (!res.data.stocks || res.data.stocks.length === 0) {
        setVariantStock(res.data.total_stock || 0);
      }
    } catch (err) {
      console.error('❌ Error fetching product data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product variants
  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/products/${id}/variants`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = res?.data?.data?.variant ?? [];
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching variants:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchVariants();
  }, [id]);

  useEffect(() => {
    AOS.init({ once: true });
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap';
    document.head.appendChild(linkEl);
    document.body.style.fontFamily = "'Lato', sans-serif";
    return () => {
      document.head.removeChild(linkEl);
    };
  }, []);

  // stok by variant id
  const getStockByVariantId = (variantId: number): number => {
    if (!product?.stocks) return 0;
    const row = product.stocks.find((s) => s.variant_id === variantId);
    return row ? Number(row.quantity) : 0;
  };

  // update stok saat varian ganti
  useEffect(() => {
    if (!product) return;
    if (selectedVariant) {
      const s = getStockByVariantId(selectedVariant.id);
      setVariantStock(s);
      setQty(s > 0 ? 1 : 0);
    } else {
      // tidak ada varian => gunakan total stock produk
      if (!variants.length) {
        setVariantStock(product.total_stock || 0);
        setQty((q) => (product.total_stock > 0 ? Math.max(1, q) : 0));
      }
    }
  }, [selectedVariant, product, variants.length]);

  const inc = () => {
    const max = selectedVariant ? getStockByVariantId(selectedVariant.id) : (product?.total_stock || 0);
    setQty((q) => (q < max ? q + 1 : q));
  };

  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const generateRandom12DigitCode = () => {
    const min = 1;
    const max = 999999999999;
    const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(rnd).padStart(12, '0');
  };

  const handleCheckout = () => {
    if (variants.length > 0 && !selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu');
      return;
    }
    if (variantStock <= 0) {
      alert('Stok habis untuk pilihan ini');
      return;
    }
    navigate('/checkout', {
      state: {
        from: 'product',
        productId: product?.id,
        variantId: selectedVariant?.id ?? null,
        name: product?.product_name,
        qty,
        price: finalPrice,
        subtotal,
        image: product?.product_image,
        orderCode: 'ORDP-' + generateRandom12DigitCode(),
        variant: selectedVariant,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent border-[#053F8C]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">Produk tidak ditemukan</h2>
        <Link to="/" className="rounded-lg bg-[#053F8C] px-4 py-2 text-white hover:bg-[#042E66]">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="font-['Lato']">
      {/* Breadcrumb */}
      <section className="bg-gray-100 py-4" data-aos="fade-down" data-aos-delay="100">
        <div className="container mx-auto px-4">
          <nav>
            <ol className="flex list-none p-0 text-sm">
              <li className="flex items-center">
                <Link to="/" className="text-gray-600 transition-colors duration-300 hover:text-[#053F8C]">
                  Home
                </Link>
                <span className="mx-2 text-gray-500">/</span>
              </li>
              <li className="flex items-center font-medium text-[#053F8C]">Product Details</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div
              className="w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-50 shadow-md"
              data-aos="zoom-in"
            >
              <img
                src={productImg}
                alt={product.product_name}
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10" data-aos="fade-up">
        <div className="container mx-auto flex flex-col px-4 lg:flex-row lg:gap-6">
          {/* Left */}
          <div className="mb-8 w-full lg:mb-0 lg:w-2/3">
            <h1 className="mb-2 text-xl sm:text-2xl lg:text-3xl font-bold text-[#141718]">
              {product.product_name}
            </h1>
            <p
              className="mb-4 text-lg sm:text-xl lg:text-2xl font-extrabold"
              style={{ color: brandNavy }}
            >
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(finalPrice)}
            </p>

            <div className="mt-4">
              <h4 className="mb-2 text-base sm:text-lg font-semibold text-[#053F8C]">
                Deskripsi Produk
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify break-words">
                {product.product_description || 'Tidak ada deskripsi.'}
              </p>
            </div>

          </div>

          {/* Right (Sticky Card) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-20 rounded-2xl bg-white p-6 shadow-md">
              {/* Varian */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-bold text-gray-700">Varian Produk</label>
                {variants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {variants.map((v) => {
                      const s = getStockByVariantId(v.id);
                      const selected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          disabled={s === 0}
                          onClick={() => {
                            if (s > 0) {
                              setSelectedVariant(v);
                              setVariantStock(s);
                              setQty(1);
                            }
                          }}
                          className={`flex h-12 w-full items-center justify-center rounded-lg border px-3 text-sm transition ${selected
                            ? 'border-[#053F8C] bg-[#EAF2FF] font-bold text-[#053F8C]'
                            : 'border-gray-300 hover:border-[#053F8C]'
                            } ${s === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                          title={s === 0 ? 'Stok habis' : undefined}
                        >
                          <span className="truncate">
                            {v.variant_name}
                            {v.additional_price ? ` (+${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v.additional_price)})` : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">Tidak ada varian tersedia</p>
                )}
              </div>

              {/* Qty + Stock */}
              <div className="my-4 flex items-center justify-between">
                <div className="flex h-10 w-32 items-center justify-center rounded-lg border-2">
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-[#042e66] font-bold text-white"
                    onClick={dec}
                  >
                    –
                  </button>
                  <input
                    type="text"
                    value={qty}
                    readOnly
                    className="w-12 text-center text-base font-medium outline-none"
                  />
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-[#042e66] font-bold text-white"
                    onClick={inc}
                  >
                    +
                  </button>
                </div>

                <div className="ml-4 flex min-w-[90px] flex-col text-right">
                  <span className="text-xs text-gray-500">Stok tersedia</span>
                  <span className="text-lg font-bold text-[#042e66]">
                    {variants.length ? variantStock : product.total_stock}
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Sub total</span>
                <span className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(subtotal)}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckout}
                disabled={(variants.length > 0 && !selectedVariant) || (variants.length ? variantStock <= 0 : product.total_stock <= 0)}
                className="w-full rounded-lg px-4 py-2.5 font-semibold text-[#0B2A55] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: brandYellow,
                  boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 2px 6px rgba(248,190,40,0.35)',
                }}
                onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = brandYellowHover))}
                onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = brandYellow))}
                title={variants.length > 0 && !selectedVariant ? 'Pilih varian terlebih dahulu' : undefined}
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Details;
