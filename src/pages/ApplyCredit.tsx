import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../component/Breadcrumb';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Pagination from '../component/Pagination';
import * as XLSX from 'xlsx';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface Transaction {
  order_id: string;
  full_name: string;
  created_at: string;
  total_price: string;
  status: string;
  order: {
    total_price: string;
  };
  id_number?: string;
  birth_date?: string;
  address?: string;
  ktp_file_path?: string;
  slip_gaji_file_path?: string;
  kk_file_path?: string;
  additional_document_path?: string;
}

const ApplyCredit = () => {
  const [filter, setFilter] = useState('Semua');
  const [applyCredit, setApplyCredit] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplyCredit = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/credit-verifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setApplyCredit(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data transaksi:', error);
        setLoading(false);
      }
    };

    fetchApplyCredit();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleOpenModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const reverseStatusMap: Record<string, string> = {
    Diterima: 'approved',
    Ditolak: 'rejected',
    Pending: 'pending',
  };

  const statusLabel = (s: string) => {
    if (!s) return 'Pending';
    const val = s.toLowerCase();
    if (val === 'approved') return 'Diterima';
    if (val === 'rejected') return 'Ditolak';
    return 'Pending';
  };

  const filteredTransactionCustomer = applyCredit
    .filter((transaksi) => {
      if (filter === 'Semua') return true;
      const mappedFilter = reverseStatusMap[filter] || filter.toLowerCase();
      return transaksi.status.toLowerCase() === mappedFilter;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  const totalPages = Math.ceil(filteredTransactionCustomer.length / itemsPerPage);
  const paginatedTransaction = filteredTransactionCustomer.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const updateCreditStatus = async (
    orderId: string,
    status: 'approved' | 'rejected',
  ) => {
    try {
      await axios.put(
        `${VITE_API_URL}/credit-verification/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // ✅ Refresh halaman setelah berhasil
      window.location.reload();
    } catch (error) {
      console.error('Gagal update status kredit:', error);
      throw error;
    }
  };




  const formatTanggal = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getFirstTwoWords = (fullName: string) => {
    return fullName.split(' ').slice(0, 2).join(' ');
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    // Format data untuk Excel
    const exportData = filteredTransactionCustomer.map((entry, index) => ({
      No: index + 1,
      "ID Pesanan": entry.order_id,
      "Nama": getFirstTwoWords(entry.full_name),
      "Tanggal": formatTanggal(entry.created_at),
      "Total Harga": Number(entry.order.total_price),
      "Status": entry.status === 'approved'
        ? 'Diterima'
        : entry.status === 'rejected'
          ? 'Ditolak'
          : 'Pending'
    }));

    // Buat worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Atur lebar kolom
    worksheet['!cols'] = [
      { wch: 5 },    // No
      { wch: 15 },    // ID Pesanan
      { wch: 20 },   // Nama
      { wch: 12 },    // Tanggal
      { wch: 15 },    // Total Harga
      { wch: 10 }     // Status
    ];

    // Buat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permohonan Cicilan');

    // Simpan file
    XLSX.writeFile(workbook, 'permohonan_cicilan.xlsx');
  };

  return (
    <>
      <Breadcrumb pageName="Permohonan Cicilan" />

      <div className="w-full rounded-sm shadow-md bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mt-2 space-x-4 p-4">
          <div className="bg-[#EAF4FB] dark:bg-secondaryBrand rounded-[15px] flex p-1">
            {['Semua', 'Diterima', 'Ditolak', 'Pending'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === item
                  ? 'bg-white text-black shadow-sm'
                  : 'text-subtleText'
                  }`}
              >
                {item === 'Semua' ? 'Semua' : item}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {/* <SearchBar/> */}
            <button
              onClick={exportToExcel}
              className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-success-dark flex items-center gap-1"
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
            <p className="text-center py-4">Memuat data transaksi...</p>
          ) : (
            <table className="w-full table-auto">
              <thead className="bg-stroke dark:bg-secondaryBrand">
                <tr className="text-left text-[15px] font-lato text-secondaryBrand dark:text-white">
                  <th className="py-2 px-4">Id Pesanan</th>
                  <th className="py-2 px-4">Nama</th>
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Berkas</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4 w-[160px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransaction.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-colorborder text-[15px] font-lato text-left bg-white dark:bg-boxdark"
                  >
                    <td className="py-3 px-4">{data.order_id}</td>
                    <td className="py-3 px-4">
                      {getFirstTwoWords(data.full_name)}
                    </td>
                    <td className="py-3 px-4">
                      {formatTanggal(data.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      {formatRupiah(Number(data.order.total_price))}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenModal(data.order_id)}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondaryBrand"
                      >
                        Lihat
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-[6px] h-[6px] rounded-full ${data.status === 'approved'
                            ? 'bg-success'
                            : data.status === 'rejected'
                              ? 'bg-error'
                              : 'bg-pending'
                            }`}
                        />
                        {statusLabel(data.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 gap-2 flex justify-center">
                      {data.status === 'approved' || data.status === 'rejected' ? (
                        editingId === data.order_id ? (
                          <>
                            <button
                              onClick={async () => {
                                await updateCreditStatus(data.order_id, 'approved');
                              }}
                              className="bg-success hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                            >
                              Terima
                            </button>

                            <button
                              onClick={async () => {
                                await updateCreditStatus(data.order_id, 'rejected');
                              }}
                              className="bg-danger hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                            >
                              Tolak
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              if (window.confirm("Apakah Anda yakin ingin mengedit status pesanan ini?")) {
                                setEditingId(data.order_id);
                              }
                            }}
                            className="bg-warning hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                        )
                      ) : (
                        <>
                          <button
                            onClick={async () => {
                              await updateCreditStatus(data.order_id, 'approved');
                            }}
                            className="bg-success hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                          >
                            Terima
                          </button>

                          <button
                            onClick={async () => {
                              await updateCreditStatus(data.order_id, 'rejected');
                            }}
                            className="bg-danger hover:bg-primaryBrandSecond text-white text-xs font-semibold px-3 py-1 rounded"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>

              <h2 className="text-lg font-bold mb-4">
                Detail Berkas{' '}
                <span className="text-warning text-sm">
                  (*klik berkas untuk lihat penuh)
                </span>
              </h2>
              <p className="mb-4">
                Menampilkan berkas untuk Order ID:
                <br />
                <strong>{selectedOrderId}</strong>
              </p>

              {selectedOrderId &&
                (() => {
                  const selectedData = applyCredit.find(
                    (item) => item.order_id === selectedOrderId,
                  );
                  return (
                    selectedData && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {[
                          {
                            label: 'Nama',
                            path: selectedData.full_name,
                          },
                          {
                            label: 'NIK',
                            path: selectedData.id_number,
                          },
                          {
                            label: 'Tanggal Lahir',
                            path: selectedData.birth_date,
                          },
                          {
                            label: 'Alamat',
                            path: selectedData.address,
                          },
                          {
                            label: 'KTP',
                            path: selectedData.ktp_file_path,
                          },
                          {
                            label: 'Slip Gaji',
                            path: selectedData.slip_gaji_file_path,
                          },
                          {
                            label: 'KK',
                            path: selectedData.kk_file_path,
                          },
                          {
                            label: 'Dokumen Tambahan',
                            path: selectedData.additional_document_path,
                          },
                        ].map(({ label, path }, idx) => {
                          if (!path) return null;

                          const fileUrl = `${VITE_STORAGE_URL}/${path}`;
                          const isFile = path?.startsWith('verifications/') || false;
                          const isPDF = path?.toLowerCase().endsWith('.pdf') || false;

                          return (
                            <div key={idx}>
                              <p className="font-semibold">{label}:</p>

                              {isFile ? (
                                <div
                                  onClick={() => window.open(fileUrl, '_blank')}
                                >
                                  <div className="mt-2">
                                    {isPDF ? (
                                      <iframe
                                        src={fileUrl}
                                        title={label}
                                        className="w-full h-64 border rounded pointer-events-none"
                                      />
                                    ) : (
                                      <img
                                        src={fileUrl}
                                        alt={label}
                                        className="w-full max-h-48 object-contain border rounded"
                                        onError={(e) => {
                                          (
                                            e.target as HTMLImageElement
                                          ).style.display = 'none';
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-700 text-sm">{path}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  );
                })()}

              <div className="mt-6 text-right">
                <button
                  onClick={handleCloseModal}
                  className="bg-slate-500 hover:bg-slate-700 text-white px-4 py-2 rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplyCredit;