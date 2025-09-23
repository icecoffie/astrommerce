import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

type OrderDetail = {
  product: { product_name: string; product_image?: string };
  unit_price: string | number;
  quantity: number;
};

type OrderCash = {
  order_id: string;
  payment_method: string;
  nama_depan?: string;
  nama_belakang?: string;
  details: OrderDetail[];
};

const DetailCash = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const [order, setOrder] = useState<OrderCash | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/orders/by-order-id/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Gagal mengambil data order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order_id, token]);

  const formatRupiah = (angka: number | string) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(angka));

  const handlePrint = () => {
    if (!order) return;
    const detail = order.details[0];
    const data = {
      pelanggan: {
        nama: `${order.nama_depan ?? ''} ${order.nama_belakang ?? ''}`.trim() || 'Pelanggan',
        noKwitansi: order.order_id,
        metode: order.payment_method,
      },
      pesanan: [
        {
          name: detail.product.product_name,
          price: detail.unit_price,
          quantity: detail.quantity,
        },
      ],
    };
    navigate('/kwitansiCash', { state: data });
  };

  if (loading) return <div className="p-4">Memuat data...</div>;
  if (!order || !order.details || !order.details[0]?.product) {
    return <div className="p-4 text-red-500">Pesanan tidak ditemukan</div>;
  }

  const detail = order.details[0];
  const product = detail.product;
  const subtotal = Number(detail.unit_price) * detail.quantity;

  return (
    <>
      <Header />
      <div className="min-h-max bg-white font-inter px-4 sm:px-8 py-4">
        <div className="flex items-start gap-6">
          <main className="flex-1 w-full">
            {/* Back button */}
            <div className="mb-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-primaryBrand hover:text-white hover:border-primaryBrand transition"
              >
                <FaArrowLeft className="text-[14px]" />
                <span>Kembali</span>
              </button>
            </div>


            <h1 className="text-[18px] sm:text-[16px] font-semibold mt-4 mb-3">
              Detail Pesanan Tunai
            </h1>

            {/* ===== Mobile Card (md:hidden) ===== */}
            <section className="md:hidden">
              <div className="rounded-2xl border border-gray-200 shadow-sm p-4">
                {/* Order header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">ID Pesanan</p>
                    <p className="text-sm font-semibold text-[#141718]">#{order.order_id}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs border border-black/5 bg-slate-50 text-slate-700 capitalize">
                    {order.payment_method}
                  </span>
                </div>

                {/* Product row */}
                <div className="mt-3 flex items-start gap-3">
                  <img
                    src={`${VITE_STORAGE_URL}/${product.product_image}`}
                    alt={product.product_name}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#141718] line-clamp-2">
                      {product.product_name}
                    </p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-[13px]">
                      <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                        <p className="text-slate-500">Harga</p>
                        <p className="font-semibold">{formatRupiah(detail.unit_price)}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                        <p className="text-slate-500">Jumlah</p>
                        <p className="font-semibold">{detail.quantity}</p>
                      </div>
                      <div className="col-span-2 rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-500">Subtotal</p>
                          <p className="font-semibold">{formatRupiah(subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 text-sm bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded-md"
                  >
                    Cetak Kwitansi
                  </button>
                </div>
              </div>
            </section>

            {/* ===== Desktop Table (hidden on mobile) ===== */}
            <section className="hidden md:block">
              <div className="bg-white p-4">
                <div className="border border-gray rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#EFF2F4] text-[#505050] text-xs font-semibold">
                      <tr className="grid grid-cols-4 md:grid-cols-6 px-6 py-2 items-center">
                        <th className="px-6 py-3 font-medium col-span-2 text-left">PRODUK</th>
                        <th className="px-6 py-3 font-medium text-left">HARGA</th>
                        <th className="px-6 py-3 font-medium text-left">JUMLAH</th>
                        <th className="px-6 py-3 font-medium text-left col-span-2">SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="grid grid-cols-4 md:grid-cols-6 hover:bg-gray-50 items-center">
                        <td className="flex items-center gap-4 px-6 py-4 col-span-2">
                          <img
                            src={`${VITE_STORAGE_URL}/${product.product_image}`}
                            alt={product.product_name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <span className="font-medium text-sm">{product.product_name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">{formatRupiah(detail.unit_price)}</td>
                        <td className="px-6 py-4 text-sm">{detail.quantity}</td>
                        <td className="px-5 py-4 text-sm font-semibold col-span-2">
                          {formatRupiah(subtotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="justify-end items-end flex mt-3 p-4">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 text-sm bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded-md"
                  >
                    Cetak Kwitansi
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default DetailCash;
