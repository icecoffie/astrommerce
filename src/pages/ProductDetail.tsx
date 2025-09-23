import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../component/Breadcrumb';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdDelete } from 'react-icons/md';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;


interface Variant {
  id: number;
  product_id: number;
  variant_name: string;
  additional_price: number;
  variant_image?: string | null;
  created_at: string;
  updated_at: string;
}

interface Stock {
  id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
  variant: Variant;
}

interface ProductDetail {
  id: number;
  product_name: string;
  product_description: string;
  sale_price: string;
  product_image: string;
  total_stock: number;
  stocks: Stock[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const selectedStock =
    product?.stocks?.find((s) => s.variant_id === selectedStockId) ?? null;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await axios.get(
        `${VITE_API_URL}/products/details/${id}`,
        {
          headers,
        },
      );

      console.log('📦 Response detail:', response.data);

      if (response.data) {
        setProduct(response.data);
        if (response.data.stocks && response.data.stocks.length > 0) {
          setSelectedStockId(response.data.stocks[0].variant_id);
        }
      }
    } catch (error: any) {
      console.error('❌ Error fetching product detail:', error);

      let errorMessage = 'Gagal memuat detail produk!';
      if (error.response?.status === 404) {
        errorMessage = 'Produk tidak ditemukan!';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numValue);
  };

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    const base = VITE_STORAGE_URL.replace(/\/+$/, '');
    return `${base}/${imagePath.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBrand"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Produk tidak ditemukan
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-primaryBrand text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Kembali ke Daftar Produk
        </button>
      </div>
    );
  }

  const handleDelete = async (variantId: number) => {
    Swal.fire({
      title: 'Yakin hapus?',
      text: 'Data varian ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'mx-2 bg-danger text-white px-4 py-2 rounded hover:bg-red-600',
        cancelButton: 'mx-2 bg-graydark text-white px-4 py-2 rounded hover:bg-gray-300',
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // NOTE: pastikan endpoint ini memang menerima ID VARIAN.
        // Kalau yang benar ID stok, ganti `variantId` dengan id stok yang sesuai.
        await axios.delete(`${VITE_API_URL}/variants/${variantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire('Terhapus!', 'Varian berhasil dihapus.', 'success');

        // Refresh data produk; fetchProductDetail() sudah meng-set selectedStockId ke varian pertama bila ada
        await fetchProductDetail();
      } catch (err) {
        console.error('Gagal hapus varian:', err);
        Swal.fire('Error', 'Gagal menghapus varian.', 'error');
      }
    });
  };

  return (
    <div className=" min-h-screen">
      <Breadcrumb pageName={`Produk / ${product.product_name}`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Daftar Produk
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 p-4 sm:p-8">
            {/* Gambar Produk */}
            <div className="flex-1">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(product.product_image)}
                  alt={product.product_name}
                  className="w-full aspect-square md:h-96 md:aspect-auto object-cover rounded-lg"
                />
              </div>
            </div>


            {/* Detail Produk */}
            <div className="flex-1 flex flex-col justify-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {product.product_name}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6 max-h-40 md:max-h-60 overflow-y-auto pr-1 text-justify">
                {product.product_description || 'Tidak ada deskripsi'}
              </p>

            </div>
          </div>

          {/* ===== Informasi Produk ===== */}
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <h3 className="text-lg font-semibold text-black-2 mb-4">
              Informasi Produk
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="p-3 bg-white rounded-lg shadow-sm border text-center">
                <p className="text-xs text-graydark">ID Produk</p>
                <p className="font-semibold text-gray-900">#{product.id}</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border text-center">
                <p className="text-xs text-graydark">Total Stok</p>
                <p className="font-semibold text-gray-900">
                  {product.total_stock} unit
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border text-center">
                <p className="text-xs text-gray-500">Harga Jual</p>
                <div className="flex items-center justify-center">
                  <p className="text-base sm:text-xl font-bold text-blue-700 break-words text-center">
                    {formatRupiah(product.sale_price)}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm border text-center">
                <p className="text-xs text-gray-500">Jumlah Varian</p>
                <p className="font-semibold text-gray-900">
                  {product.stocks?.length || 0} varian
                </p>
              </div>
            </div>
          </div>

          {/* ===== Varian Produk ===== */}
          {product.stocks && product.stocks.length > 0 && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                  Pilih Varian
                </h3>
                <div
                  role="radiogroup"
                  aria-label="Pilih Varian"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
                >
                  {product.stocks.map((stock) => {
                    const isSelected = selectedStockId === stock.variant_id;
                    const fallbackImg =
                      stock.variant.variant_image || product.product_image || 'https://via.placeholder.com/112x112?text=No+Image';

                    return (
                      <div
                        key={stock.variant_id}
                        onClick={() => setSelectedStockId(stock.variant_id)}
                        className={`relative cursor-pointer rounded-xl bg-white p-4 transition shadow-sm
        border ${isSelected ? 'ring-2 ring-[#053F8C] border-[#053F8C]' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedStockId(stock.variant_id);
                        }}
                      >
                        {/* Badge terpilih */}
                        {isSelected && (
                          <span className="pointer-events-none absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-[#053F8C] px-2.5 py-1 text-xs font-medium text-white shadow">
                            ✓
                          </span>
                        )}

                        {/* Konten kartu */}
                        <div className="flex items-center gap-3 mb-3 min-h-[56px]">
                          <img
                            src={getImageUrl(fallbackImg)}
                            alt={stock.variant.variant_name}
                            className="w-14 h-14 rounded-lg object-cover border"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-1 truncate font-semibold text-gray-800">
                              {stock.variant.variant_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              +{formatRupiah(stock.variant.additional_price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {formatRupiah(parseFloat(product.sale_price) + stock.variant.additional_price)}
                            </p>
                            <p className="text-xs text-gray-500">Harga Final</p>
                          </div>
                          <p className={`text-sm font-medium ${stock.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.quantity > 0 ? `Stok: ${stock.quantity}` : 'Habis'}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          )}


          {/* ===== Detail Varian Terpilih ===== */}
          {selectedStock && (
            <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6">
              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-black-2 mb-4 text-center">
                  Detail Varian: {selectedStock.variant.variant_name}
                </h4>
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Stok Tersedia</p>
                      <p className="font-medium">{selectedStock.quantity} unit</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Harga Final</p>
                      <p className="font-medium text-green-600">
                        {formatRupiah(
                          parseFloat(product.sale_price) +
                          selectedStock.variant.additional_price
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Di Update Oleh</p>
                      <p className="font-medium">{selectedStock.updated_by}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Tanggal update</p>
                      <p className="font-medium">
                        {new Date(selectedStock.updated_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
