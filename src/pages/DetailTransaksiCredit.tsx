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

interface CreditItem {
  installment_number: number;
  id: number;
  order_id: number;
  amount: number;
  due_date: string;
  paid_at: string | null;
  proof_file: string | null;
  status: string;
}

interface OrderData {
  downpayment: number;
  order_id: string;
  nama_depan: string;
  nama_belakang: string;
  remaining_payment: number;
  details: OrderDetailItem[];
  credit: CreditItem[];
}

const DetailTransaksiCredit = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showProof, setShowProof] = useState<{
    visible: boolean;
    fileUrl: string | null;
  }>({ visible: false, fileUrl: null });

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
      }
    };

    if (order_id) fetchOrder();
  }, [order_id]);

  const generateCicilanRataRibu = (total: number, bulan: number) => {
    const perCicil = Math.floor(total / bulan / 1000) * 1000 + 1000;
    return Array.from({ length: bulan }, (_, i) => ({
      ke: i + 1,
      amount: perCicil,
    }));
  };

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
      case 'Telat Bayar':
        return 'text-[#FF9017] font-semibold';
      case 'Belum Di Bayar':
        return 'text-[#FA3434] font-semibold';
      case 'Menunggu Verifikasi':
        return 'text-[#053F8C] font-semibold';
      default:
        return 'text-gray-500';
    }
  };

  const handleCetak = (item: {
    ke: number;
    tempo: string;
    status: string;
    tagihan: string;
    paid_at: string;
  }) => {
    if (!orderData) return;

    const pelanggan = {
      nama: `${orderData.nama_depan} ${orderData.nama_belakang}`,
      metode: 'Cicilan',
      noKwitansi: `KW-${orderData.order_id}`,
    };

    const produk = orderData.details[0]?.product?.product_name || '-';

    navigate('/kwitansiCredit', {
      state: {
        pelanggan,
        pesanan: {
          id: orderData.order_id,
          produk,
        },
        cicilan: [
          {
            ke: item.ke,
            periode: '2 bulan',
            tanggal: item.paid_at,
            status: item.status,
            tagihan: parseInt(item.tagihan.replace(/\D/g, '')),
          },
        ],
      },
    });
  };

  const updateCreditStatus = async (
    order_id: number,
    installmentNumber: number,
  ) => {
    try {
      await axios.post(
        `${VITE_API_URL}/credit/pay/${order_id}/${installmentNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update UI lokal
      setOrderData((prev) =>
        prev
          ? {
              ...prev,
              credit: prev.credit.map((c) =>
                c.installment_number === installmentNumber
                  ? {
                      ...c,
                      paid_at: new Date().toISOString(),
                      status: 'Lunas', // ini yang membuat <td> status jadi "Lunas"
                    }
                  : c,
              ),
            }
          : null,
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Status cicilan ke-${installmentNumber} berhasil diverifikasi`,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton:
            'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
    } catch (err) {
      console.error('Gagal verifikasi cicilan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat verifikasi cicilan.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton:
            'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
    }
  };

  if (!orderData) return <div className="p-8">Memuat data pesanan...</div>;
  const tenor = orderData.credit.length;
  const rataCicilan = generateCicilanRataRibu(
    orderData.remaining_payment,
    tenor,
  );

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
          <h1 className="text-[16px] font-semibold mb-4">Pembayaran Cicilan</h1>

          <div className="bg-white p-4">
            <div className="border border-gray rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#EFF2F4] text-[#505050] text-xs font-semibold">
                  <tr className="grid grid-cols-7 px-3 py-2">
                    <th className="px-3 py-3 text-left col-span-2">PRODUK</th>
                    <th className="px-3 py-3 text-left">HARGA</th>
                    <th className="px-3 py-3 text-left">DP</th>
                    <th className="px-3 py-3 text-left">JUMLAH</th>
                    <th className="px-3 py-3 text-left">SUBTOTAL</th>
                    <th className="px-3 py-3 text-left">TOTAL CICILAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="grid grid-cols-7 hover:bg-gray-50 items-center">
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
                    <td className="px-3 py-4">
                      {formatRupiah(orderData.downpayment)}
                    </td>
                    <td className="px-3 py-4">{orderDetail.quantity}</td>
                    <td className="px-3 py-4 font-semibold">
                      {formatRupiah(orderDetail.subtotal)}
                    </td>
                    <td className="px-3 py-4 font-semibold">
                      {formatRupiah(orderData.remaining_payment)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mt-6">
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
                    <th className="px-4 py-2">AKSI</th>
                    <th className="px-4 py-2">KWITANSI</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.credit.map((item, index) => {
                    const dueDate = new Date(item.due_date + 'T00:00:00');
                    const cicilanAmount = rataCicilan[index].amount;

                    return (
                      <tr key={item.id} className="border-b border-gray">
                        <td className="px-4 py-3">{item.installment_number}</td>
                        <td className="px-4 py-3 text-[#053F8C] font-semibold">
                          {formatRupiah(cicilanAmount)}
                        </td>
                        <td className="px-4 py-3">
                          {dueDate.toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          {item.paid_at
                            ? new Date(item.paid_at).toLocaleDateString(
                                'id-ID',
                                {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                },
                              )
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {item.proof_file ? (
                            <button
                              onClick={() =>
                                setShowProof({
                                  visible: true,
                                  fileUrl: `${VITE_STORAGE_URL}/${item.proof_file}`,
                                })
                              }
                              className="text-primaryBrand text-md font-semibold underline"
                            >
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className="text-error text-xs font-semibold">
                              Belum Upload
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 ${getStatusClass(item.status)}`}
                        >
                          {item.status ||
                            (item.paid_at ? 'Lunas' : 'Belum Di Bayar')}
                        </td>
                        <td className="px-4 py-3">
                          {item.paid_at === null ? (
                            <button
                              onClick={() =>
                                updateCreditStatus(
                                  item.order_id,
                                  item.installment_number,
                                )
                              }
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
                            onClick={
                              item.paid_at !== null
                                ? () =>
                                    handleCetak({
                                      ke: item.installment_number,
                                      status: item.status,
                                      tagihan: formatRupiah(cicilanAmount),
                                      tempo: dueDate.toLocaleDateString(
                                        'id-ID',
                                        {
                                          day: '2-digit',
                                          month: 'long',
                                          year: 'numeric',
                                        },
                                      ),
                                      paid_at: item.paid_at ?? '', // 🟢 Tambahkan paid_at
                                    })
                                : undefined
                            }
                            disabled={item.paid_at === null}
                            className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                              item.paid_at !== null
                                ? 'bg-primaryBrand hover:bg-primaryBrandSecond cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            Cetak
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {showProof.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowProof({ visible: false, fileUrl: null })}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            {showProof.fileUrl?.endsWith('.pdf') ? (
              <iframe
                src={showProof.fileUrl}
                className="w-full h-[500px]"
                title="Bukti Pembayaran"
              />
            ) : (
              <img
                src={showProof.fileUrl!}
                alt="Bukti Pembayaran"
                className="w-full h-auto rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailTransaksiCredit;
