// Pesanan.tsx
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Header from '../Header';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface OrderDetail {
  id: number;
  product: { product_name: string; product_image?: string };
  unit_price: string;
  quantity: number;
  subtotal: string;
  image_url?: string;
}

interface Order {
  id: number;
  order_id: string;
  customer_id: string;
  product_id: number;
  payment_method: string;
  quantity: number;
  total_price: string;
  down_payment: 'completed' | 'pending' | 'canceled' | string;
  tenor: string;
  payment_status: string;
  status: string;
  created_at: string;
  details: OrderDetail[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = (status || '').toLowerCase();
  const map: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    paid: { bg: 'bg-meta-3', text: 'text-meta-4', label: 'Selesai', dot: 'bg-emerald-500' },
    pending: { bg: 'bg-meta-6', text: 'text-meta-4', label: 'Pending', dot: 'bg-yellow-500' },
    unpaid: { bg: 'bg-meta-6', text: 'text-meta-4', label: 'Pending', dot: 'bg-yellow-500' },
    failed: { bg: 'bg-rose-500/20', text: 'text-rose-700', label: 'Gagal', dot: 'bg-rose-500' },
    expired: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Kedaluwarsa', dot: 'bg-slate-400' },
  };
  const sty = map[s] ?? { bg: 'bg-slate-100', text: 'text-slate-600', label: status || '-', dot: 'bg-slate-400' };

  return (
    <span className={`relative inline-flex h-7 items-center justify-center rounded-full px-5 text-xs font-medium leading-none ${sty.bg} ${sty.text} border border-black/5`}>
      <span className={`absolute left-2 h-2 w-2 rounded-full ${sty.dot}`} />
      {sty.label}
    </span>
  );
};

const Pesanan = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // search query
  const [q, setQ] = useState('');
  const { pathname } = useLocation();
  const isActive = (to: string) => pathname === to;

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = useMemo(() => localStorage.getItem('token'), []);

  type MaybePaginated<T> = T[] | { data: T[] };
  const normalize = <T,>(resData: MaybePaginated<T>): T[] =>
    Array.isArray(resData) ? resData : resData?.data ?? [];

  useEffect(() => {
    setLoading(true);
    axios
      .get<MaybePaginated<Order>>(`${VITE_API_URL}/orders?per_page=${itemsPerPage}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then((res) => setOrders(normalize(res.data)))
      .catch((err) => console.error('Gagal mengambil data pesanan:', err))
      .finally(() => setLoading(false));
  }, [token]);

  // filter by product name (ANY detail contains query)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((o) =>
      (o.details || []).some((d) => (d.product?.product_name || '').toLowerCase().includes(query)),
    );
  }, [orders, q]);

  // reset ke page 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageSlice = (arr: Order[]) =>
    arr.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentData = pageSlice(filtered);

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

 const StickyTools = (
  <div className="sticky top-[64px] z-30 bg-white border-b border-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="shrink-0 text-slate-500">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari transaksi / nama produk"
              className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
      <nav className="mt-3 flex gap-2 md:hidden">
        <Link
          to="/pesanan"
          className={`px-4 py-2 rounded-full text-sm border transition ${
            isActive('/pesanan')
              ? 'bg-[#0B2E6F] text-white border-[#0B2E6F]'
              : 'text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/PesananSaya"
          className={`px-4 py-2 rounded-full text-sm border transition ${
            isActive('/PesananSaya')
              ? 'bg-[#0B2E6F] text-white border-[#0B2E6F]'
              : 'text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pesanan Saya
        </Link>
      </nav>
    </div>
  </div>
);



  if (loading) return (<><Header />{StickyTools}<div className="p-6">Memuat data...</div></>);
  if (orders.length === 0) return (<><Header />{StickyTools}<div className="p-6 text-red-600">❌ Tidak ada pesanan ditemukan</div></>);

  return (
    <>
      <Header />
      {StickyTools}

      <div className="font-lato px-4 py-4">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-[#141718]">Pesanan Saya</h1>
          <p className="text-gray-600 text-sm">Lihat dan kelola semua riwayat pesanan kamu dengan mudah.</p>
        </div>

        {/* ===== Mobile: List Cards ===== */}
        <div className="space-y-3 md:hidden">
          {currentData.map((order) => {
            const d0 = order.details?.[0];
            const img = d0?.product?.product_image
              ? `${VITE_STORAGE_URL}/${d0.product.product_image}`
              : d0?.image_url;
            const names = order.details?.map((d) => d.product.product_name).join(', ') || '-';
            const total = order.details.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

            const isPaid = order.payment_status === 'paid';
            const isCreditApproved =
              order.payment_method === 'credit' &&
              (order.status === 'approved' || (order as any)?.credit_verification?.status === 'approved');

            const actionHref =
              order.payment_method === 'cash'
                ? `/PesananSaya/${order.order_id}/detailCash`
                : `/PesananSaya/${order.order_id}/detailCredit`;

            return (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="text-[12px] text-slate-500 leading-5 break-all">#{order.order_id}</div>
                  <StatusBadge status={order.payment_status} />
                </div>

                <div className="mt-2 flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    {img ? (
                      <img src={img} alt={d0?.product?.product_name || 'Produk'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-slate-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-slate-900 line-clamp-2">{names}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[12px] text-slate-600">
                      <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                      <span className="text-slate-400">•</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] text-slate-600 leading-none">Total Harga:</p>
                    <p className="text-[15px] font-semibold text-slate-900 mt-1">
                      {formatRupiah(total || Number(order.total_price) || 0)}
                    </p>
                  </div>

                  {(isPaid || isCreditApproved) ? (
                    <Link
                      to={actionHref}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow hover:bg-blue-700 transition whitespace-nowrap"
                    >
                      {order.payment_method === 'cash' ? 'Rincian' : 'Rincian Cicilan →'}
                    </Link>
                  ) : (
                    <span className="text-[12px] text-slate-600">Sedang diproses…</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Desktop: Table ===== */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden mt-2">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[#053F8C] uppercase tracking-wide">Daftar Pesanan</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-sm text-left text-gray-700">
              <thead className="bg-[#053F8C]/10 text-[#053F8C] text-xs font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 align-middle">ID PESANAN</th>
                  <th className="px-4 py-3 align-middle">PRODUK</th>
                  <th className="px-4 py-3 align-middle">TANGGAL</th>
                  <th className="px-4 py-3 align-middle">HARGA</th>
                  <th className="px-4 py-3 align-middle">JUMLAH</th>
                  <th className="px-4 py-3 align-middle">SUBTOTAL</th>
                  <th className="px-4 py-3 align-middle">PEMBAYARAN</th>
                  <th className="px-4 py-3 align-middle text-center w-[140px]">STATUS</th>
                  <th className="px-4 py-3 align-middle text-center w-[160px]">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((order) => {
                  const harga = Number(order.details?.[0]?.unit_price || 0);
                  const jumlah = order.details?.map(d => d.quantity).join(', ') || '-';
                  const subtotal = order.details.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

                  const isPaid = order.payment_status === 'paid';
                  const isCreditApproved =
                    order.payment_method === 'credit' &&
                    (order.status === 'approved' || (order as any)?.credit_verification?.status === 'approved');

                  const actionHref =
                    order.payment_method === 'cash'
                      ? `/PesananSaya/${order.order_id}/detailCash`
                      : `/PesananSaya/${order.order_id}/detailCredit`;

                  return (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 align-middle font-semibold text-[#141718]">{order.order_id}</td>
                      <td className="px-4 py-4 align-middle text-gray-700">
                        {order.details?.map(d => d.product.product_name).join(', ') || '-'}
                      </td>
                      <td className="px-4 py-4 align-middle text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-4 align-middle font-medium text-[#053F8C]">
                        {formatRupiah(harga)}
                      </td>
                      <td className="px-4 py-4 align-middle">{jumlah}</td>
                      <td className="px-4 py-4 align-middle font-semibold">{formatRupiah(subtotal)}</td>
                      <td className="px-4 py-4 align-middle capitalize whitespace-nowrap">{order.payment_method}</td>
                      <td className="px-4 py-4 align-middle text-center w-[140px]">
                        <div className="flex justify-center"><StatusBadge status={order.payment_status} /></div>
                      </td>
                      <td className="px-4 py-4 align-middle text-center w-[160px]">
                        {(isPaid || isCreditApproved) ? (
                          <Link
                            to={actionHref}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow hover:bg-blue-700 transition whitespace-nowrap"
                          >
                            {order.payment_method === 'cash' ? 'Rincian' : 'Rincian Cicilan →'}
                          </Link>
                        ) : (
                          <p>Sedang di Proses</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination (desktop) */}
          <div className="flex justify-center items-center gap-2 py-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border text-primaryBrand hover:bg-primaryBrand hover:text-white disabled:opacity-40 flex justify-center items-center transition"
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`w-8 h-8 rounded-full text-sm transition ${
                    currentPage === page ? 'bg-primaryBrand text-white shadow' : 'border text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {String(page).padStart(2, '0')}
                </button>
              );
            })}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full border text-primaryBrand hover:bg-primaryBrand hover:text-white disabled:opacity-40 flex justify-center items-center transition"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Pagination (mobile) */}
        <div className="md:hidden flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-3 rounded-full border text-primaryBrand hover:bg-primaryBrand hover:text-white disabled:opacity-40 transition"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-slate-600">
            Hal {currentPage}/{totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-3 rounded-full border text-primaryBrand hover:bg-primaryBrand hover:text-white disabled:opacity-40 transition"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </>
  );
};

export default Pesanan;
