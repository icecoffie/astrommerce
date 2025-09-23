import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import axios from 'axios';
import { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const activities = [
  {
    icon: '✅',
    desc: 'Your order has been delivered. Thank you for shopping at Clicon!',
    time: '23 Jan, 2021 at 7:32 PM',
  },
  {
    icon: '👤',
    desc: 'Our delivery man (John Wick) has picked-up your order for delivery.',
    time: '23 Jan, 2021 at 2:00 PM',
  },
  {
    icon: '📍',
    desc: 'Your order has reached at last mile hub.',
    time: '22 Jan, 2021 at 8:00 AM',
  },
  {
    icon: '🗺️',
    desc: 'Your order on the way to (last mile) hub.',
    time: '21 Jan, 2021 at 5:32 AM',
  },
  {
    icon: '✔️',
    desc: 'Your order is successfully verified.',
    time: '20 Jan, 2021 at 7:32 PM',
  },
  {
    icon: '📦',
    desc: 'Your order has been confirmed.',
    time: '19 Jan, 2021 at 2:01 PM',
  },
];

// Format ke Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

const IMAGE_BASE_URL = `${VITE_STORAGE_URL}/`;

const DetailsPesanan = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${VITE_API_URL}/orders/by-order-id/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrder(res.data);
      } catch (err) {
        console.error('Gagal mengambil data pesanan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id]);

  if (loading) return <div className="p-10">⏳ Loading...</div>;
  if (!order || !order.details || order.details.length === 0) {
    return <div className="p-10 text-red-600">❌ Pesanan tidak ditemukan</div>;
  }

  const detailProduk = order.details[0];
  const produk = detailProduk.product;
  const totalHarga = parseInt(detailProduk.subtotal);

  const getStepStatus = (status: string | undefined) => {
    switch (status) {
      case 'IN PROGRESS':
        return 2;
      case 'COMPLETED':
        return 4;
      case 'CANCELED':
        return -1;
      default:
        return 0;
    }
  };

  const stepStatus = getStepStatus(order.status);
  const steps =
    order.status === 'CANCELED'
      ? ['Pesanan mu', 'Pesanan dibatalkan']
      : ['Pesanan mu', 'Dipersiapkan', 'Siap Ambil di Toko', 'Diterima'];

  return (
    <div className="min-h-screen font-lato px-10 py-2">
      <div className="flex gap-6">
        <main className="flex-1">
          <div className="flex flex-col items-end">
            <button
              onClick={() => navigate(-1)}
              className="flex justify-center items-center gap-2 mt-6 border border-gray shadow-sm p-2 text-presentase hover:bg-primaryBrandSecond hover:text-white text-sm"
            >
              <FaArrowLeft />
              Kembali ke Daftar Pesanan
            </button>
          </div>
          <h1 className="text-[22px] font-bold mb-6">Order Details</h1>

          <div
            className={`rounded-lg px-6 py-4 mb-6 flex items-center justify-between border ${
              order.status === 'CANCELED'
                ? 'bg-merahmuda border-error'
                : 'bg-orange border-pending'
            }`}
          >
            <div>
              <p className="font-medium text-sm">#{order.order_id}</p>
              <p className="text-xs text-gray-600">
                {detailProduk.quantity} item • Order Placed in{' '}
                {order.order_date}
              </p>
            </div>
            <p
              className={`${
                order.status === 'CANCELED' ? 'text-error' : 'text-presentase'
              } text-lg font-bold`}
            >
              {formatRupiah(totalHarga)}
            </p>
          </div>

          {/* Step Tracker */}
          <div className="mb-10">
            <p className="text-sm text-gray-700 mb-4">
              Order expected arrival{' '}
              <span className="font-semibold">23 Jan, 2021</span>
            </p>
            <div className="flex items-center justify-between relative">
              {steps.map((label, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-5 h-5 rounded-full z-10 ${
                      order.status === 'CANCELED' && index === 1
                        ? 'bg-error'
                        : index <= stepStatus
                        ? 'bg-primaryBrandSecond'
                        : 'bg-gray500'
                    }`}
                  ></div>
                  <p
                    className={`mt-2 text-sm ${
                      order.status === 'CANCELED' && index === 1
                        ? 'text-error font-semibold'
                        : index <= stepStatus
                        ? 'text-primaryBrand font-semibold'
                        : 'text-gray500'
                    }`}
                  >
                    {label}
                  </p>
                </div>
              ))}
              <div
                className={`absolute top-[9px] left-30 right-30 h-[3px] ${
                  order.status === 'CANCELED' ? 'bg-error' : 'bg-presentase'
                }`}
              ></div>
            </div>
          </div>

          {/* Tabel Produk */}
          <div className="bg-white rounded-lg shadow border border-gray p-6 mb-10">
            <h2 className="text-sm font-semibold mb-4">DAFTAR PRODUK</h2>
            <table className="min-w-full text-sm text-left text-body">
              <thead className="bg-gray text-body font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">PRODUK</th>
                  <th className="px-6 py-3 font-medium">HARGA</th>
                  <th className="px-6 py-3 font-medium">JUMLAH</th>
                  <th className="px-6 py-3 font-medium">SUBTOTAL</th>
                  <th className="px-6 py-3 font-medium">DETAIL CICILAN</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray hover:bg-gray-50">
                  <td className="flex items-center gap-4 px-6 py-4">
                    <img
                      src={IMAGE_BASE_URL + produk.product_image}
                      alt={produk.product_name}
                      className="w-16 h-16 object-contain rounded border"
                    />
                    <span className="font-medium text-sm">
                      {produk.product_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatRupiah(parseInt(detailProduk.unit_price))}
                  </td>
                  <td className="px-6 py-4 text-sm">{detailProduk.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {formatRupiah(totalHarga)}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      to={
                        order.payment_method === 'cash'
                          ? `/PesananSaya/${order.order_id}/detailCash`
                          : `/PesananSaya/${order.order_id}/detailCredit`
                      }
                      className="text-presentase hover:underline flex items-center gap-1"
                    >
                      {order.payment_method === 'cash'
                        ? 'Detail Tunai'
                        : 'Detail Cicilan →'}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Aktivitas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray p-6">
            <h2 className="text-sm font-semibold mb-4">Aktivitas Order</h2>
            <ul className="space-y-4">
              {activities.map((act, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="text-2xl">{act.icon}</div>
                  <div>
                    <p className="text-sm text-black-2 mb-1">{act.desc}</p>
                    <p className="text-xs text-body">{act.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Alamat & Notes */}
          <div className="bg-white rounded-lg font-lato border border-gray p-6 mt-4 grid md:grid-cols-3 gap-6">
            <div className="border border-gray shadow-sm p-2">
              <h3 className="text-md text-primaryBrand font-semibold mb-1">
                Data Pengguna
              </h3>
              <div className="pt-2">
                <p className="font-medium text-black-2">
                  {order.nama_depan} {order.nama_belakang}
                </p>
                <p className="text-sm mt-2">
                  <span className="text-black-2">Email : </span> {order.email}
                </p>
                <p className="text-sm">
                  <span className="text-black-2">No HP : </span> {order.telepon}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailsPesanan;
