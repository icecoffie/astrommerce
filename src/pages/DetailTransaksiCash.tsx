import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

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

interface OrderData {
  order_id: string;
  nama_depan: string;
  nama_belakang: string;
  total_price: number;
  payment_status: 'Belum Dibayar' | 'Menunggu Verifikasi' | 'Lunas';
  details: OrderDetailItem[];
  paid_at: string | null;
}

const DetailTransaksiCash = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

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
        setOrderData(res.data);
      } catch (err) {
        console.error('Gagal fetch data order:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat memuat detail transaksi.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
          },
          buttonsStyling: false,
        });
      }
    };

    if (order_id) fetchOrder();
  }, [order_id]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Lunas':
        return 'text-[#00B517] font-semibold';
      case 'Menunggu Verifikasi':
        return 'text-[#FF9017] font-semibold';
      case 'Belum Dibayar':
        return 'text-[#FA3434] font-semibold';
      default:
        return 'text-gray-500';
    }
  };

  const handleVerifyCashPayment = async (orderId: string) => {
    Swal.fire({
      title: 'Konfirmasi Pembayaran Tunai?',
      text: 'Anda akan mengkonfirmasi pembayaran tunai untuk pesanan ini.',
      icon: 'question',
      showCancelButton: false, // **** PERUBAHAN UTAMA: HILANGKAN TOMBOL BATAL ****
      confirmButtonText: 'Ya, Konfirmasi!',
      customClass: {
        actions: 'flex justify-center w-full px-4', // Tetap untuk rata tengah
        confirmButton: 'bg-primaryBrand text-white px-6 py-2 rounded hover:bg-primaryBrandSecond', // px-6 untuk proporsi yang lebih baik
      },
      buttonsStyling: false,
      width: 'auto',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(
            `${VITE_API_URL}/orders/verify-cash-payment/${orderId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setOrderData((prev) =>
            prev
              ? {
                  ...prev,
                  payment_status: 'Lunas',
                  paid_at: new Date().toISOString(),
                }
              : null,
          );

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Status pembayaran tunai berhasil diverifikasi.',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
            },
            buttonsStyling: false,
          });
        } catch (err) {
          console.error('Gagal verifikasi pembayaran tunai:', err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat memverifikasi pembayaran tunai.',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
            },
            buttonsStyling: false,
          });
        }
      }
    });
  };

  const handleCetakKwitansiCash = () => {
    if (!orderData || orderData.payment_status !== 'Lunas' || !orderData.paid_at) return;

    const pelanggan = {
      nama: `${orderData.nama_depan} ${orderData.nama_belakang}`,
      metode: 'Cash',
      noKwitansi: `KW-${orderData.order_id}`,
    };

    const produk = orderData.details[0]?.product?.product_name || '-';

    navigate('/kwitansiCash', {
      state: {
        pelanggan,
        pesanan: {
          id: orderData.order_id,
          produk,
          total: orderData.total_price,
          tanggal_bayar: new Date(orderData.paid_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        },
      },
    });
  };

  if (!orderData) return <div className="p-8">Memuat data pesanan...</div>;

  const orderDetail = orderData.details[0];
  const product = orderDetail.product;

  return (
    <div className="min-h-screen bg-white font-inter px-5 py-3">
      <div className="flex items-start gap-6">
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
          <h1 className="text-[16px] font-semibold mb-4">Pembayaran Tunai</h1>

          <div className="bg-white p-4">
            <div className="border border-gray rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#EFF2F4] text-[#505050] text-xs font-semibold">
                  <tr className="grid grid-cols-6 px-3 py-2">
                    <th className="px-3 py-3 text-left col-span-2">PRODUK</th>
                    <th className="px-3 py-3 text-left">HARGA</th>
                    <th className="px-3 py-3 text-left">JUMLAH</th>
                    <th className="px-3 py-3 text-left">SUBTOTAL</th>
                    <th className="px-3 py-3 text-left col-span-2">TOTAL PEMBAYARAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="grid grid-cols-6 hover:bg-gray-50 items-center">
                    <td className="flex items-center gap-4 px-3 py-4 col-span-2">
                      <img
                        src={`${VITE_STORAGE_URL}/${product.product_image}`}
                        alt="product"
                        className="w-16 h-16 object-contain rounded border"
                      />
                      <span className="font-medium text-sm">
                        {product.product_name}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {formatRupiah(orderDetail.unit_price)}
                    </td>
                    <td className="px-3 py-4">{orderDetail.quantity}</td>
                    <td className="px-3 py-4 font-semibold">
                      {formatRupiah(orderDetail.subtotal)}
                    </td>
                    <td className="px-3 py-4 font-semibold col-span-2">
                      {formatRupiah(orderData.total_price)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <h2 className="text-sm font-semibold mb-4">STATUS PEMBAYARAN</h2>
              <table className="w-full text-sm text-left">
                <thead className="text-[#8B96A5] bg-[#EFF2F4] text-xs">
                  <tr>
                    <th className="px-4 py-2">STATUS</th>
                    <th className="px-4 py-2">TANGGAL BAYAR</th>
                    <th className="px-4 py-2">AKSI</th>
                    <th className="px-4 py-2">KWITANSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray">
                    <td className={`px-4 py-3 ${getStatusClass(orderData.payment_status)}`}>
                      {orderData.payment_status}
                    </td>
                    <td className="px-4 py-3">
                      {orderData.paid_at ? new Date(orderData.paid_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {orderData.payment_status !== 'Lunas' ? (
                        <button
                          onClick={() => handleVerifyCashPayment(orderData.order_id)}
                          className="bg-primaryBrand hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-success text-white text-xs font-semibold px-3 py-1 rounded cursor-not-allowed"
                        >
                          Terverifikasi
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={handleCetakKwitansiCash}
                        disabled={orderData.payment_status !== 'Lunas'}
                        className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                          orderData.payment_status === 'Lunas'
                            ? 'bg-primaryBrand hover:bg-primaryBrandSecond cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Cetak
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailTransaksiCash;
