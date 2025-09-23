import React, { useState, useEffect } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Breadcrumb from '../component/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../component/Pagination';
import { MdDelete } from 'react-icons/md';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const formatRupiah = (number: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

interface Order {
  id: number;
  order_id: string;
  product: string;
  image: string;
  date: string;
  price: number;
  payment: string;
  status: string;
  customer_id: string;
  nama_depan: string;
  order_date: string;
  total_price: string;
  payment_method: string;
  payment_status: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [namaDepan, setNamaDepan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [produk, setProduk] = useState('');
  const [payment, setPayment] = useState('');
  const [tenor, setTenor] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [updatedBy, setUpdatedBy] = useState(1);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [minDP, setMinDP] = useState(0);
  const [downpayment, setDownpayment] = useState(0);
  const [cicilanPerBulan, setCicilanPerBulan] = useState(0);
  const [dpError, setDpError] = useState(false);
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [metodeFilter, setMetodeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // s
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  // Pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (payment === 'credit') {
      const calculatedMinDP = totalPrice * 0.3;
      setMinDP(calculatedMinDP);
      setDpError(downpayment < calculatedMinDP);

      if (tenor > 0) {
        const remaining = totalPrice - downpayment;
        const monthly = remaining / tenor;
        setCicilanPerBulan(monthly);
      } else {
        setCicilanPerBulan(0);
      }
    } else {
      setMinDP(0);
      setDpError(false);
      setCicilanPerBulan(0);
      setDownpayment(0);
    }
  }, [payment, totalPrice, tenor, downpayment]);

  const [productOptions, setProductOptions] = useState<any[]>([]);

  type MaybePaginated<T> = T[] | { data: T[] };

  function normalizeArray<T>(resData: MaybePaginated<T>): T[] {
    return Array.isArray(resData) ? resData : (resData?.data ?? []);
  }

  const fetchOrders = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await axios.get<MaybePaginated<any>>(
        `${VITE_API_URL}/orders?per_page=20`,
        { headers },
      );

      const base = VITE_STORAGE_URL.replace(/\/+$/, '');
      const orders = normalizeArray(res.data);

      const ordersData = orders.map((order: any) => {
        const firstDetail = Array.isArray(order.details)
          ? order.details[0]
          : undefined;
        const product = firstDetail?.product;
        const productName = product?.product_name ?? 'Produk Tidak Diketahui';

        const rawImg = product?.product_image ?? null;
        const productImage = rawImg
          ? `${base}/${String(rawImg).replace(/^\/+/, '')}`
          : 'https://via.placeholder.com/40';

        // amanin tanggal & angka
        const dateStr = order.order_date ?? '';
        const priceNum = Number(order.total_price) || 0;
        const price = Number.isFinite(priceNum) ? priceNum : 0;

        return {
          id: order.id,
          order_id: order.order_id,
          product: productName,
          image: productImage,
          date: dateStr,
          price: priceNum,
          payment: order.payment_status ?? 'unpaid',
          payment_method: order.payment_method ?? '-',
          status: order.status ?? 'Tunda',
        };
      });

      setOrders(ordersData);
    } catch (error) {
      console.error('❌ Gagal mengambil data orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat data orders!',
        timer: 2000,
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

  const fetchProducts = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await axios.get<MaybePaginated<any>>(
        `${VITE_API_URL}/products?per_page=100&sort=product_name`,
        { headers },
      );

      const base = VITE_STORAGE_URL.replace(/\/+$/, '');
      const products = normalizeArray(res.data);

      const productOptions = products.map((p: any) => ({
        id: p.id,
        name: p.product_name,
        sale_price: Number(p.sale_price ?? 0),
        image: p.product_image
          ? `${base}/${String(p.product_image).replace(/^\/+/, '')}`
          : 'https://via.placeholder.com/40',
      }));

      setProductOptions(productOptions);
    } catch (error) {
      console.error('Gagal fetch produk:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    setTotalPrice(price * quantity);
  }, [price, quantity]);

  const handleSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const isCash = payment === 'cash';
      const dp = isCash ? 0 : price * 0.3;

      const payload = {
        order_id: `ORD-${Date.now()}`,
        order_date: today,
        downpayment: dp,
        total_price: price * quantity,
        updated_by: String(updatedBy),
        tenor: isCash ? 0 : tenor,
        product_id: Number(produk),
        quantity: quantity,
        price: price,
        payment_method: payment,
        payment_status: isCash ? 'paid' : 'unpaid',
        nama_depan: namaDepan,
        telepon: telepon,
        email: email,
      };

      if (!payment || !produk || !namaDepan || !alamat) {
        Swal.fire({
          icon: 'warning',
          title: 'Lengkapi Form',
          text: 'Semua field wajib diisi sebelum menyimpan.',
        });
        return;
      }

      await axios.post(
        `${VITE_API_URL}/transaction/checkout/${produk}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pemesanan berhasil ditambahkan',
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset
      setShowModal(false);
      setNamaDepan('');
      setAlamat('');
      setProduk('');
      setPayment('');
      setTenor(0);
      setPrice(0);
      setQuantity(1);

      fetchOrders(); // Refresh order list
    } catch (error) {
      console.error('❌ Gagal tambah pemesanan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan pemesanan.',
        timer: 500,
        showConfirmButton: false,
      });
    }
  };

  const location = useLocation();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  function splitFullName(fullName: string): { namaDepan: string } {
    const words = fullName.trim().split(' ');
    if (words.length <= 3) {
      return { namaDepan: fullName };
    } else {
      return {
        namaDepan: words.slice(0, -1).join(' '),
      };
    }
  }

  const navigate = useNavigate();

  const handlePrint = (order: any) => {
    axios
      .get(`${VITE_API_URL}/orders/by-order-id/${order.order_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const o = res.data;
        const detail = o.details?.[0];
        if (!detail) {
          Swal.fire('Error', 'Detail order tidak tersedia', 'error');
          return;
        }
        const data = {
          pelanggan: {
            nama: o.nama_depan,
            noKwitansi: o.order_id,
            metode: o.payment_method,
          },
          pesanan: [
            {
              name: detail.product.product_name,
              price: Number(detail.unit_price),
              quantity: detail.quantity,
            },
          ],
        };
        navigate('/kwitansiCash', { state: data });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Gagal mengambil data order', 'error');
      });
  };

  const statusMap: { [key: string]: string } = {
    Semua: 'Semua',
    Lunas: 'paid',
    'Belum Dibayar': 'unpaid',
  };

  const filteredOrders = orders.filter((order) => {
    const tanggalMatch = !tanggalFilter || order.date.startsWith(tanggalFilter);
    const metodeMatch = !metodeFilter || order.payment_method === metodeFilter;
    const statusMatch = !statusFilter || order.payment === statusFilter;

    return tanggalMatch && metodeMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handleExportExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      'Id Pemesanan': order.order_id,
      Produk: order.product,
      Tanggal: order.date,
      Metode: order.payment_method === 'cash' ? 'Tunai' : 'Kredit',
      Status: order.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas',
      Harga: formatRupiah(order.price),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders.xlsx');
  };

  const handleValidate = async (id: string) => {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/validatePayments/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pembayaran Berhasil Divalidasi!',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memvalidasi pembayaran.',
      });
    }
  };

  const handleDelete = async (orderId: string) => {
    Swal.fire({
      title: 'Yakin hapus?',
      text: 'Data varian ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'mx-2 bg-danger text-white px-4 py-2 rounded hover:bg-red-600',
        cancelButton:
          'mx-2 bg-graydark text-white px-4 py-2 rounded hover:bg-gray-300',
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${VITE_API_URL}/orders/delete/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire('Terhapus!', 'Transaksi berhasil dihapus.', 'success');
        } catch (err) {
          console.error('Gagal hapus varian:', err);
          Swal.fire('Error', 'Gagal menghapus varian.', 'error');
        }
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName="Manajemen Pemesanan" />

      <div className="flex justify-end font-lato py-3 gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 flex items-center gap-2 text-blue-600 hover:bg-primaryBrand hover:text-white text-secondaryBrand shadow-md bg-white rounded-[10px] hover:bg-blue-50 transition"
        >
          <GoPlusCircle /> Tambah Pemesanan
        </button>
      </div>

      <div className="w-full mt-3">
        {/* Card Filter */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Filter Pencarian
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tanggal Pemesanan
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#053F8C] focus:border-transparent"
                value={tanggalFilter}
                onChange={(e) => setTanggalFilter(e.target.value)}
              />
            </div>

            {/* Metode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Metode Pembayaran
              </label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#053F8C] focus:border-transparent"
                value={metodeFilter}
                onChange={(e) => setMetodeFilter(e.target.value)}
              >
                <option value="">Semua Metode</option>
                <option value="cash">Tunai</option>
                <option value="credit">Cicilan</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status Pembayaran
              </label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#053F8C] focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="paid">Lunas</option>
                <option value="unpaid">Belum Lunas</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => {
                setTanggalFilter('');
                setMetodeFilter('');
                setStatusFilter('');
              }}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center rounded-xl bg-[#053F8C] px-4 py-2 text-sm text-white hover:bg-[#042e66]"
            >
              Unduh Excel
            </button>
          </div>
        </div>

        {/* Mobile list view */}
        <div className="md:hidden px-4 space-y-3 mt-3">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="border rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={order.image}
                  alt={order.product}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{order.product}</div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.payment === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.payment === 'paid' ? 'Lunas' : 'Belum'}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-blue-700 font-bold">
                  {formatRupiah(order.price)}
                </div>
                <div className="flex items-center gap-2">
                  {order.payment === 'paid' ? (
                    <button
                      onClick={() => handlePrint(order)}
                      className="px-3 py-1 text-xs bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded"
                    >
                      Cetak
                    </button>
                  ) : order.payment_method === 'credit' ? (
                    <span className="text-xs text-gray-500 italic">
                      Validasi otomatis
                    </span>
                  ) : (
                    <button
                      onClick={() => handleValidate(order.order_id)}
                      className="px-3 py-1 text-xs bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded"
                    >
                      Validasi
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order.order_id)}
                    className="text-gray-600"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table (desktop) */}
        <div className="overflow-x-auto p-4 mt-3 rounded-md hidden md:block">
          <table className="w-full table-auto">
            <thead className="bg-stroke dark:bg-secondaryBrand">
              <tr className="text-left text-[15px] font-lato text-secondaryBrand dark:text-white">
                <th className="py-2 px-4">No</th>
                <th className="py-2 px-4">Id Pesanan</th>
                <th className="py-2 px-4">Produk</th>
                <th className="py-2 px-4">Tanggal</th>
                <th className="py-2 px-4">Harga</th>
                <th className="py-2 px-4">Metode</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 text-center">Kwitansi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr
                  key={order.order_id}
                  className="border-b border-colorborder text-black text-[15px] font-lato"
                >
                  <td className="py-2 px-4">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-2 px-4">{order.order_id}</td>
                  <td className="py-3 px-4 flex gap-2 items-center">
                    <img
                      src={order.image}
                      alt={order.product}
                      className="w-10 h-10 rounded"
                    />
                    {order.product}
                  </td>
                  <td className="py-2 px-4">{order.date}</td>
                  <td className="py-2 px-4">{formatRupiah(order.price)}</td>
                  <td className="py-2 px-4">
                    {order.payment_method === 'cash'
                      ? 'Tunai'
                      : order.payment_method === 'credit'
                        ? 'Cicilan'
                        : order.payment_method}
                  </td>
                  <td className="py-2 px-4">
                    <span className="font-medium flex items-center gap-2">
                      <span
                        className={`w-[6px] h-[6px] rounded-full ${
                          order.payment === 'paid' ? 'bg-success' : 'bg-error'
                        }`}
                      ></span>
                      {order.payment === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="justify-end items-center flex">
                      {order.payment === 'paid' ? (
                        <button
                          onClick={() => handlePrint(order)}
                          className="p-2 text-sm bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded-md"
                        >
                          Cetak
                        </button>
                      ) : order.payment_method === 'credit' ? (
                        <span className="p-2 text-xs text-gray-600 italic">
                          Validasi <br />
                          otomatis
                        </span>
                      ) : (
                        <button
                          title="Validasi"
                          className="p-2 text-sm bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded-md"
                          onClick={() => handleValidate(order.order_id)}
                        >
                          Validasi
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order.order_id)}
                        className="ml-2 flex justify-end"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal Tambah Pemesanan */}
      {showModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Pemesanan</h2>
            <input
              type="text"
              placeholder="Cari Nama Pelanggan"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Nama"
              value={namaDepan}
              onChange={(e) => setNamaDepan(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Telepon"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <select
              value={produk}
              onChange={(e) => {
                const selectedId = e.target.value;
                setProduk(selectedId);

                const selectedProduct = productOptions.find(
                  (p) => String(p.id) === selectedId,
                );
                if (selectedProduct) {
                  setPrice(Number(selectedProduct.sale_price));
                }
              }}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">-- Pilih Produk --</option>
              {productOptions.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            {price > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Product
                </label>
                <input
                  type="text"
                  value={formatRupiah(price)}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed text-gray-700"
                />
              </div>
            )}

            {price > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Total Harga
                </label>
                <input
                  type="text"
                  value={formatRupiah(totalPrice)}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed text-gray-700"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm w-28">Jumlah Produk</span>
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-blue-300"
              >
                −
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
              >
                +
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="radio"
                name="Pembayaran"
                value="cash"
                onChange={(e) => setPayment(e.target.value)}
              />
              <span className="text-sm">Tunai</span>
              <br />
            </div>

            <span className="text-sm text-danger font-bold">
              *untuk pembayaran cicilan, hanya pembeli yang bisa mengajukan!!!
            </span>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-primaryBrand text-white hover:bg-primaryBrandSecond"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primaryBrand text-white hover:bg-primaryBrandSecond"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagement;
