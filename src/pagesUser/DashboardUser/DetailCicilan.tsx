import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../Header';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface Product {
  product_image: string;
  product_name: string;
}

interface OrderDetailItem {
  product: Product;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface CreditItem {
  id: number;
  installment_number: number;
  amount: number;
  due_date: string;
  paid_at: string | null;
  proof_file: string | null;
  status: string;
}

interface OrderData {
  order_id: string;
  nama_depan: string;
  nama_belakang: string;
  downpayment: number;
  remaining_payment: number;
  details: OrderDetailItem[];
  credit: CreditItem[];
}

const generateCicilanRataRibu = (total: number, bulan: number) => {
  const perCicil = Math.floor(total / bulan / 1000) * 1000 + 1000;
  return Array.from({ length: bulan }, (_, i) => ({
    ke: i + 1,
    amount: perCicil,
  }));
};

const DetailCicilan = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/orders/by-order-id/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderData(res.data);
      } catch (err) {
        console.error('Gagal fetch data order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (order_id) fetchOrder();
  }, [order_id, token]);

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);

  const getStatusClass = (status: string) => {
    const base = 'inline-flex items-center justify-center rounded-full px-3 h-8 text-xs font-semibold';
    switch (status) {
      case 'Lunas':
        return `${base} bg-green text-success`;
      case 'Belum Di Bayar':
        return `${base} bg-[#FEE1E1] text-error`;
      case 'Menunggu Verifikasi':
        return `${base} bg-[#78350f] text-[#fde68a]`;
      case 'Telat Bayar':
        return `${base} bg-[#9a3412] text-[#fdba74]`;
      default:
        return `${base} bg-[#374151] text-[#d1d5db]`;
    }
  };

  const handleCetak = (item: { ke: number; status: string; tagihan: string; paid_at: string }) => {
    if (!orderData) return;
    const pelanggan = {
      nama: `${orderData.nama_depan} ${orderData.nama_belakang ?? ''}`.trim(),
      metode: 'Cicilan',
      noKwitansi: `KW-${orderData.order_id}`,
    };
    const produk = orderData.details[0]?.product?.product_name || '-';

    navigate('/kwitansiCredit', {
      state: {
        pelanggan,
        pesanan: { id: orderData.order_id, produk },
        cicilan: [
          {
            ke: item.ke,
            periode: '2 bulan',
            tanggal: new Date(item.paid_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            status: item.status,
            tagihan: parseInt(item.tagihan.replace(/\D/g, '')),
          },
        ],
      },
    });
  };

  const handleUpload = async (file: File, id: number) => {
    const formData = new FormData();
    formData.append('proof_file', file);
    try {
      await axios.post(`${VITE_API_URL}/credit/upload-proof/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Bukti pembayaran berhasil diupload.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
      window.location.reload();
    } catch (error) {
      console.error('Upload gagal :', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal mengupload bukti pembayaran.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
    }
  };

  if (loading || !orderData) {
    return (
      <>
        <Header />
        <div className="p-8">Memuat data pesanan...</div>
      </>
    );
  }

  const tenor = orderData.credit.length;
  const rataCicilan = generateCicilanRataRibu(orderData.remaining_payment, tenor);

  const cicilanList = orderData.credit.map((item, index) => {
    const today = new Date();
    const dueDate = new Date(item.due_date + 'T00:00:00');
    const isPaid = item.paid_at !== null;
    const isUploaded = item.proof_file !== null;

    let status = 'Belum Di Bayar';
    if (isPaid) status = 'Lunas';
    else if (today > dueDate) status = 'Telat Bayar';

    return {
      id: item.id,
      ke: item.installment_number,
      tagihan: formatRupiah(rataCicilan[index].amount),
      tempo: dueDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      status,
      isUploaded,
      paid_at: item.paid_at,
      rawAmount: rataCicilan[index].amount,
    };
  });

  const orderDetail = orderData.details[0];
  const product = orderDetail.product;

  const subtotal = orderDetail.subtotal;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white font-inter px-4 sm:px-8 py-4">
        <main className="max-w-7xl mx-auto">
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

          <h1 className="text-[18px] sm:text-[16px] font-semibold mt-2 mb-3">Pembayaran Cicilan</h1>

          {/* ===== MOBILE: Ringkasan Pesanan (Card) ===== */}
          <section className="md:hidden space-y-4">
            <div className="rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">ID Pesanan</p>
                  <p className="text-sm font-semibold text-[#141718]">#{orderData.order_id}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs border border-black/5 bg-slate-50 text-slate-700">
                  Cicilan
                </span>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <img
                  src={`${VITE_STORAGE_URL}/${product.product_image}`}
                  alt={product.product_name}
                  className="h-16 w-16 rounded-lg object-cover border"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#141718] line-clamp-2">{product.product_name}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">Harga</p>
                      <p className="font-semibold">{formatRupiah(orderDetail.unit_price)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">DP</p>
                      <p className="font-semibold">{formatRupiah(orderData.downpayment)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">Jumlah</p>
                      <p className="font-semibold">{orderDetail.quantity}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">Subtotal</p>
                      <p className="font-semibold">{formatRupiah(subtotal)}</p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500">Total Cicilan</p>
                        <p className="font-semibold">{formatRupiah(orderData.remaining_payment)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Cicilan (Cards) */}
            <div className="space-y-3">
              {cicilanList.map((item) => (
                <div key={item.ke} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">Cicilan ke-{item.ke}</p>
                      <p className="text-[12px] text-slate-600 mt-0.5">Jatuh tempo: {item.tempo}</p>
                    </div>
                    <span className={getStatusClass(item.status)}>{item.status}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">Tagihan</p>
                      <p className="font-semibold">{item.tagihan}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 border border-black/5">
                      <p className="text-slate-500">Tgl Bayar</p>
                      <p className="font-semibold">
                        {item.paid_at
                          ? new Date(item.paid_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {item.status !== 'Lunas' && !item.isUploaded ? (
                      <label
                        htmlFor={`upload-${item.ke}`}
                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Upload Bukti
                        <input
                          id={`upload-${item.ke}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file, item.id);
                          }}
                        />
                      </label>
                    ) : (
                      <span className="text-[12px] text-slate-600">Bukti sudah diupload</span>
                    )}

                    <button
                      disabled={item.status !== 'Lunas'}
                      onClick={
                        item.status === 'Lunas'
                          ? () =>
                              handleCetak({
                                ke: item.ke,
                                status: item.status,
                                tagihan: item.tagihan,
                                paid_at: item.paid_at!,
                              })
                          : undefined
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium text-white ${
                        item.status === 'Lunas'
                          ? 'bg-primaryBrand hover:bg-primaryBrandSecond'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Cetak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== DESKTOP: Ringkasan + Tabel Cicilan ===== */}
          <section className="hidden md:block">
            <div className="bg-white p-4">
              <div className="border border-gray rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#EFF2F4] text-[#505050] text-xs font-semibold">
                    <tr className="grid grid-cols-7 px-3 py-2">
                      <th className="px-3 py-3 font-medium text-left col-span-2">PRODUK</th>
                      <th className="px-3 py-3 font-medium text-left">HARGA</th>
                      <th className="px-3 py-3 font-medium text-left">DP</th>
                      <th className="px-3 py-3 font-medium text-left">JUMLAH</th>
                      <th className="px-3 py-3 font-medium text-left">SUBTOTAL</th>
                      <th className="px-3 py-3 font-medium text-left">TOTAL CICILAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="grid grid-cols-7 hover:bg-gray-50 items-center">
                      <td className="flex items-center gap-4 px-3 py-4 col-span-2">
                        <img
                          src={`${VITE_STORAGE_URL}/${product.product_image}`}
                          alt={product.product_name}
                          className="w-16 h-16 object-contain rounded border"
                        />
                        <span className="font-medium text-sm">{product.product_name}</span>
                      </td>
                      <td className="px-3 py-4 text-sm">{formatRupiah(orderDetail.unit_price)}</td>
                      <td className="px-3 py-4 text-sm">{formatRupiah(orderData.downpayment)}</td>
                      <td className="px-3 py-4 text-sm">{orderDetail.quantity}</td>
                      <td className="px-3 py-4 text-sm font-semibold">{formatRupiah(subtotal)}</td>
                      <td className="px-3 py-4 text-sm font-semibold">{formatRupiah(orderData.remaining_payment)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-sm font-semibold mb-4">PESANAN SAYA</h2>
                <table className="w-full text-sm text-left">
                  <thead className="text-[#8B96A5] bg-[#EFF2F4] text-xs">
                    <tr>
                      <th className="px-4 py-2">CICILAN KE-</th>
                      <th className="px-4 py-2">TAGIHAN</th>
                      <th className="px-4 py-2">JATUH TEMPO</th>
                      <th className="px-4 py-2">TANGGAL BAYAR</th>
                      <th className="px-4 py-2">BUKTI</th>
                      <th className="px-4 py-2">STATUS</th>
                      <th className="px-4 py-2">KWITANSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cicilanList.map((item) => (
                      <tr key={item.ke} className="border-b border-gray">
                        <td className="px-4 py-3">{item.ke}</td>
                        <td className="px-4 py-3 text-[#053F8C] font-semibold">{formatRupiah(item.rawAmount)}</td>
                        <td className="px-4 py-3">{item.tempo}</td>
                        <td className="px-4 py-3">
                          {item.paid_at
                            ? new Date(item.paid_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })
                            : <span className="text-gray-400 italic">Belum Bayar</span>}
                        </td>
                        <td className="px-4 py-3">
                          {item.status !== 'Lunas' && !item.isUploaded ? (
                            <label
                              htmlFor={`upload-${item.ke}`}
                              className="bg-[#EFF2F4] text-[#505050] text-xs px-3 py-1 rounded hover:bg-[#e0e3e5] cursor-pointer"
                            >
                              Upload
                              <input
                                id={`upload-${item.ke}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpload(file, item.id);
                                }}
                              />
                            </label>
                          ) : (
                            <span className="text-gray-400 text-xs">Sudah Upload</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={getStatusClass(item.status)}>{item.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={
                              item.status === 'Lunas'
                                ? () =>
                                    handleCetak({
                                      ke: item.ke,
                                      status: item.status,
                                      tagihan: item.tagihan,
                                      paid_at: item.paid_at!,
                                    })
                                : undefined
                            }
                            disabled={item.status !== 'Lunas'}
                            className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                              item.status === 'Lunas'
                                ? 'bg-primaryBrand hover:bg-primaryBrandSecond cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            Cetak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default DetailCicilan;
