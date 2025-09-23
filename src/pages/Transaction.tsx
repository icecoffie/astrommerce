import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Breadcrumb from '../component/Breadcrumb';
import SearchBar from '../component/SearchBar.tsx';
import Pagination from '../component/Pagination';

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Transaction {
  order_id: string;
  customer_id: string;
  nama_depan: string;
  order_date: string;
  total_price: string;
  payment_status: string;
  nama_belakang?: string;
}

const Transaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        
        const res = await axios.get(`${VITE_API_URL}/order-credits`, {
          headers,
          signal: controller.signal,
        });

        if (!cancelled) {
          const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setTransactions(data);
        }
      } catch (error) {
        if (!cancelled && error.name !== 'CanceledError') {
          console.error('Failed to fetch transactions:', error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [token]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleFilter = () => {
    return transactions.filter((trx) => {
      const orderDate = new Date(trx.order_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;

      if (statusFilter !== 'Semua Status') {
        const statusMap: Record<string, string> = {
          'Lunas': 'paid',
          'Belum Dibayar': 'unpaid',
          'Batal': 'cancelled'
        };
        if (trx.payment_status !== statusMap[statusFilter]) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !trx.customer_id.toLowerCase().includes(query) &&
          !trx.nama_depan.toLowerCase().includes(query) &&
          !(trx.nama_belakang && trx.nama_belakang.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredTransactions = handleFilter();
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransaction = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handleExportExcel = () => {
    const exportData = filteredTransactions.map((trx) => ({
      'ID Order': trx.order_id,
      'ID Pelanggan': trx.customer_id,
      'Nama': `${trx.nama_depan} ${trx.nama_belakang || ''}`.trim(),
      'Tanggal Pemesanan': formatDate(trx.order_date),
      'Total Harga': Number(trx.total_price),
      'Status Pembayaran': 
        trx.payment_status === 'paid' ? 'Lunas' :
        trx.payment_status === 'unpaid' ? 'Belum Dibayar' : 'Batal'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 15 }, // ID Order
      { wch: 15 }, // ID Pelanggan
      { wch: 25 }, // Nama
      { wch: 20 }, // Tanggal
      { wch: 15 }, // Total
      { wch: 15 }  // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi Cicilan');
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    const data = new Blob([excelBuffer], { 
      type: 'application/octet-stream' 
    });
    
    saveAs(data, 'TransaksiCicilan.xlsx');
  };

  return (
    <>
      <Breadcrumb pageName="Transaksi Cicilan" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Daftar Transaksi Cicilan
          </h4>
        </div>

        {/* Filter Section */}
        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark md:px-6 xl:px-7.5">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <SearchBar 
                placeholder="Cari ID/Nama Pelanggan..."
                onSearch={(query) => setSearchQuery(query)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="Semua Status">Semua Status</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Dibayar">Belum Dibayar</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              
              <div className="flex gap-6 items-end">
                <button
                  onClick={() => {
                    setStartDate('2025-08-01');
                    setEndDate('');
                    setStatusFilter('Semua Status');
                    setSearchQuery('');
                  }}
                  className="h-[42px] rounded bg-gray-200 py-2 px-4 font-medium text-black hover:bg-opacity-90 dark:bg-gray-700 dark:text-white"
                >
                  Reset
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-primaryBrand hover:bg-primaryBrandSecond text-white px-4 py-2 rounded"
                >
                  Unduh Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : paginatedTransaction.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-16 w-16 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
                Tidak ada data transaksi yang ditemukan
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr className="text-left">
                    <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white">
                      No
                    </th>
                    <th className="min-w-[120px] py-3 px-4 font-medium text-black dark:text-white">
                      ID Pelanggan
                    </th>
                    <th className="min-w-[150px] py-3 px-4 font-medium text-black dark:text-white">
                      Nama
                    </th>
                    <th className="min-w-[120px] py-3 px-4 font-medium text-black dark:text-white">
                      Tanggal
                    </th>
                    <th className="min-w-[120px] py-3 px-4 font-medium text-black dark:text-white">
                      Total
                    </th>
                    <th className="min-w-[120px] py-3 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="py-3 px-4 font-medium text-black dark:text-white">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransaction.map((data,index) => (
                    <tr 
                      key={data.order_id} 
                      className="border-b border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-2">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-black dark:text-white">
                          {data.customer_id}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-black dark:text-white">
                          {data.nama_depan} {data.nama_belakang || ''}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-black dark:text-white">
                          {formatDate(data.order_date)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-black dark:text-white">
                          {formatRupiah(Number(data.total_price))}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          data.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : data.payment_status === 'unpaid' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {data.payment_status === 'paid' ? 'Lunas' :
                          data.payment_status === 'unpaid' ? 'Belum Dibayar' : 'Batal'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          to={`/admin/Transaction/${data.order_id}/DetailTransaksiCredit`}
                          className="inline-flex items-center justify-center rounded bg-primary py-1 px-3 text-white hover:bg-opacity-90"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default Transaction;