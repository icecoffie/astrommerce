import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../component/Breadcrumb';
import Pagination from '../component/Pagination.tsx';
import SearchBar from '../component/SearchBar.tsx';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface Transaction {
  order_id: string;
  nama_pemesan: string;
  tanggal_berangkat: string;
  total_harga: number;
  status: string;
  created_at: string;
  payment_method: string;
}

const TransaksiUmroh = () => {
  const [filter, setFilter] = useState('Semua');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/order-umroh`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTransactions(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data transaksi:', error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: 'Terjadi kesalahan saat mengambil data transaksi',
        });
      }
    };

    fetchTransactions();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatTanggal = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

const filteredTransactions = transactions.filter((transaction) => {
  // Filter berdasarkan status
  if (filter !== 'Semua') {
    if (filter === 'Selesai' && transaction.status !== 'paid') return false;
    if (filter === 'Tertunda' && transaction.status !== 'booked') return false;
    if (filter === 'Batal' && !['canceled', 'failed'].includes(transaction.status)) return false;
  }
  
  // Filter berdasarkan pencarian
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.order_id.toLowerCase().includes(searchLower) ||
      transaction.nama_pemesan.toLowerCase().includes(searchLower) ||
      transaction.tanggal_berangkat.toLowerCase().includes(searchLower)
    );
  }
  
  return true;
});

  // Sort by created_at descending
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get current transactions for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const exportData = sortedTransactions.map((transaction, index) => ({
      No: index + 1,
      "ID Pesanan": transaction.order_id,
      "Nama Pemesan": transaction.nama_pemesan,
      "Tanggal Keberangkatan": formatTanggal(transaction.tanggal_berangkat),
      "Total Harga": transaction.total_harga,
      "Metode Pembayaran": transaction.payment_method || '-',
      "Status": transaction.status === 'paid' 
        ? 'Lunas' 
        : transaction.status === 'booked' 
        ? 'Booking' 
        : transaction.status,
      "Tanggal Transaksi": formatTanggal(transaction.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    worksheet['!cols'] = [
      { wch: 5 },    // No
      { wch: 15 },    // ID Pesanan
      { wch: 25 },    // Nama Pemesan
      { wch: 20 },    // Tanggal Keberangkatan
      { wch: 15 },    // Total Harga
      { wch: 20 },    // Metode Pembayaran
      { wch: 15 },    // Status
      { wch: 20 }     // Tanggal Transaksi
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi Umroh');
    XLSX.writeFile(workbook, 'transaksi_umroh.xlsx');
  };

  return (
    <>
      <Breadcrumb pageName="Transaksi Umroh" />

      <div className="w-full rounded-sm shadow-md bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 space-y-4 md:space-y-0 md:space-x-4 p-4">
          <div className="bg-[#EAF4FB] dark:bg-secondaryBrand rounded-[15px] flex p-1 w-full md:w-auto">
            {['Semua', 'Selesai', 'Tertunda', 'Batal'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setFilter(item);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  filter === item
                    ? 'bg-white text-black shadow-sm'
                    : 'text-subtleText'
                }`}
              >
                {item === 'Semua' ? 'All Order' : item}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <SearchBar onSearch={handleSearch} />
            <button 
              onClick={exportToExcel}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4 mt-2 rounded-md">
          {loading ? (
            <div className="text-center py-4">
              <p>Memuat data transaksi...</p>
            </div>
          ) : sortedTransactions.length === 0 ? (
            <div className="text-center py-4">
              <p>Tidak ada data transaksi yang ditemukan</p>
            </div>
          ) : (
            <>
              <table className="w-full table-auto">
                <thead className="bg-stroke dark:bg-secondaryBrand">
                  <tr className="text-left text-[15px] font-lato text-secondaryBrand dark:text-white">
                    <th className="py-2 px-4">Id Pelanggan</th>
                    <th className="py-2 px-4">Nama</th>
                    <th className="py-2 px-4">Tanggal</th>
                    <th className="py-2 px-4">Total</th>
                    <th className="py-2 px-4">Metode</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Proses</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((data, index) => (
                    <tr
                      key={index}
                      className="border-b border-colorborder text-[15px] font-lato text-left bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-4">{data.order_id}</td>
                      <td className="py-3 px-4">{data.nama_pemesan}</td>
                      <td className="py-3 px-4">{formatTanggal(data.tanggal_berangkat)}</td>
                      <td className="py-3 px-4">
                        {formatRupiah(Number(data.total_harga))}
                      </td>
                      <td className="py-3 px-4">{data.payment_method ?? '-'}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-[6px] h-[6px] rounded-full ${
                              data.status === 'paid'
                                ? 'bg-success'
                                : data.status === 'booked'
                                ? 'bg-pending'
                                : 'bg-error'
                            }`}
                          />
                          {data.status === 'paid'
                            ? 'Lunas'
                            : data.status === 'booked'
                            ? 'Booking'
                            : data.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/TransaksiUmroh/${data.order_id}/DetailTransaksiUmroh`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TransaksiUmroh;