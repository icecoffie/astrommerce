import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import Swal from 'sweetalert2';
import { loadSnap } from '../lib/loadSnap';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const formatRupiah = (number: number) => {
  const num = number;
  if (isNaN(num)) {
    return '';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const Checkout = () => {
  const [namaDepan, setNamaDepan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [autoFilled, setAutoFilled] = useState(false);
  const [downpayment, setDownpayment] = useState(0);
  const [tenor, setTenor] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [minDP, setMinDP] = useState(0);
  const [creditForm, setCreditForm] = useState({
    full_name: '',
    id_number: '',
    birth_date: '',
    address: '',
    phone_number: '',
  });

  const [uploadedDocs, setUploadedDocs] = useState<{
    [key: string]: File | null;
  }>({
    ktp_file_path: null,
    slip_gaji_file_path: null,
    kk_file_path: null,
    additional_document: null,
  });

  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  const {
    productId,
    variantId,
    name,
    qty,
    price,
    image,
    from,
    participants = [],
    orderIdFromBE,
  } = location.state || {};

  const jakartaDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
  });
  const orderDate = new Date(jakartaDate).toISOString().slice(0, 10);
  const totalHarga = qty * price;

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const customerId = user?.customer_id;

  useEffect(() => {
    if (user && !autoFilled && from !== 'umroh') {
      const { name, phone, email } = user;
      const { namaDepan } = splitFullName(name);
      setNamaDepan(namaDepan);
      setTelepon(phone);
      setEmail(email);
      setAutoFilled(true);
      setMinDP(totalHarga * 0.15);
    }

    if (!autoFilled && from === 'umroh') {
      if (participants && participants.length > 0) {
        const { fullName, whatsapp, email } = participants[0];
        const { namaDepan } = splitFullName(fullName);
        setNamaDepan(namaDepan);
        setTelepon(whatsapp);
        setEmail(email);
        setAutoFilled(true);
      }
    }
  }, [from, autoFilled, location.state]);

  useEffect(() => {
    if (!creditForm.full_name) {
      setCreditForm((prev) => ({
        ...prev,
        full_name: namaDepan,
        phone_number: telepon,
      }));
    }
  }, [namaDepan, telepon]);

  function splitFullName(fullName: string): { namaDepan: string; namaBelakang: string } {
    const words = fullName.trim().split(' ');
    if (words.length === 1) {
      return { namaDepan: words[0], namaBelakang: '' };
    }
    return {
      namaDepan: words.slice(0, -1).join(' '),
      namaBelakang: words[words.length - 1],
    };
  }


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0] || null;
    setUploadedDocs((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const saveCompleteSummary = (data: {
    orderCode: string;
    date: string;
    total: number;
    paymentMethod: string;
    from?: string;
    productId?: any;
    variantId?: any;
    midtransResult?: any;
  }) => {
    sessionStorage.setItem('completeSummary', JSON.stringify(data));
  };


  const handlePlaceOrder = async () => {
    const endpoint =
      from === 'umroh'
        ? `${VITE_API_URL}/order-umroh`
        : `${VITE_API_URL}/transaction/checkout/${productId}/${variantId}`;

    if (!namaDepan || !telepon || !email) {
      await Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap!',
        text: 'Mohon lengkapi semua field sebelum melanjutkan.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
      return;
    }

    if (paymentMethod === 'credit') {
      const requiredFiles = ['ktp_file_path', 'slip_gaji_file_path', 'kk_file_path'];
      const missingFile = requiredFiles.some((key) => !uploadedDocs[key]);
      if (missingFile) {
        await Swal.fire({
          icon: 'warning',
          title: 'Form Kredit Belum Lengkap!',
          text: 'Silakan unggah semua dokumen wajib (KTP, Slip Gaji, KK).',
        });
        return;
      }
    }
    const { namaDepan: firstName, namaBelakang: lastName } = splitFullName(
      (user?.name as string) || namaDepan
    );
    const isUmroh = from === 'umroh';

    const orderData = isUmroh
      ? {
        customer_id: customerId,
        order_id: orderIdFromBE,
        nama_pemesan: `${firstName}${lastName ? ' ' + lastName : ''}`,
        no_hp: telepon,
        email: email,
        tanggal_berangkat: orderDate,
        payment_method: paymentMethod,
        kota_asal: 'Jakarta',
        tipe_kamar: 'quad',
        pax: qty,
        total_harga: totalHarga,
        peserta: participants.map((peserta: any) => ({
          nama_lengkap: peserta.fullName,
          no_hp: peserta.whatsapp,
          email: peserta.email,
          catatan: '-',
        })),
      }
      : {
        customer_id: customerId,
        product_id: Number(productId),
        order_id: orderIdFromBE,
        nama_depan: firstName,
        nama_belakang: lastName, 
        telepon: telepon,
        email: email,
        order_date: orderDate,
        payment_method: paymentMethod,
        downpayment: downpayment,
        total_price: totalHarga,
        tenor: tenor,
        quantity: qty,
        price: Number(price),
        subtotal: totalHarga,
        updated_by: 'admin',
        payment_status: 'paid',
      };


    try {
      const res = await axios.post(endpoint, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newOrderId = res.data?.order?.order_id || orderIdFromBE;
      if (paymentMethod === 'credit') {
        try {
          const formData = new FormData();
          formData.append('order_id', newOrderId);
          formData.append('customer_id', customerId);

          Object.entries(creditForm).forEach(([key, value]) => {
            formData.append(key, value);
          });
          Object.entries(uploadedDocs).forEach(([key, file]) => {
            if (file) formData.append(key, file);
          });

          await axios.post(`${VITE_API_URL}/credit-verification`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          await Swal.fire({
            icon: 'success',
            title: 'Checkout Berhasil!',
            text: 'Pengajuan cicilan terkirim.',
          });
          const summary = {
            productId,
            variantId,
            from,
            orderCode: newOrderId,
            date: orderDate,
            total: totalHarga,
            paymentMethod,
          };
          saveCompleteSummary(summary);
          navigate('/complete', { state: summary });

          return;
        } catch (err) {
          try {
            await axios.delete(`${VITE_API_URL}/orders/delete/${newOrderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch { }
          await Swal.fire('Error', 'Upload dokumen gagal, pesanan dibatalkan!', 'error');
          return;
        }
      }
      if (paymentMethod === 'cash') {
        const items = [
          {
            id: String(productId ?? 'SKU'),
            price: Number(price),
            quantity: Number(qty),
            name: String(name ?? 'Produk'),
          },
        ];

        const tokenRes = await axios.post(
          `${VITE_API_URL}/midtrans/token`,
          {
            order_id: newOrderId,
            gross_amount: totalHarga,
            customer: { first_name: namaDepan, email, phone: telepon },
            items,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const snapToken = tokenRes.data.snap_token;
        const clientKey = tokenRes.data.client_key;

        const preSummary = {
          productId,
          variantId,
          from,
          orderCode: newOrderId,
          date: orderDate,
          total: totalHarga,
          paymentMethod, 
        };
        sessionStorage.setItem('completeSummary', JSON.stringify(preSummary));
        await loadSnap(clientKey);

        window.snap?.pay(snapToken, {
          onSuccess: async (result: any) => {
            await Swal.fire({ icon: 'success', title: 'Pembayaran Berhasil!' });
            const summarySuccess = { ...preSummary, midtransResult: result };
            sessionStorage.setItem('completeSummary', JSON.stringify(summarySuccess));
            navigate('/complete', { state: summarySuccess });
          },
          onPending: async (result: any) => {
            await Swal.fire({
              icon: 'info',
              title: 'Menunggu Pembayaran',
              text: 'Silakan selesaikan pembayaran sesuai instruksi.',
            });
            const summaryPending = { ...preSummary, midtransResult: result };
            sessionStorage.setItem('completeSummary', JSON.stringify(summaryPending));
            navigate('/complete', { state: summaryPending });
          },
          onError: async () => {
            await Swal.fire('Error', 'Pembayaran gagal.', 'error');
          },
          onClose: async () => {
            await Swal.fire('Dibatalkan', 'Popup pembayaran ditutup.', 'info');
          },
        });

        return; 
      }


      // === fallback 
      await Swal.fire({
        icon: 'success',
        title: 'Checkout Berhasil!',
        text: 'Pesanan Anda telah berhasil diproses.',
      });
      const summaryFinal = {
        productId,
        variantId,
        from,
        orderCode: newOrderId,
        date: orderDate,
        total: totalHarga,
        paymentMethod,
      };
      saveCompleteSummary(summaryFinal);
      navigate('/complete', { state: summaryFinal });

    } catch (err: any) {
      await Swal.fire('Error', 'Checkout gagal!', 'error');
    }
  };


  const handleDPChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const numericValue = Number(raw);
    setDownpayment(numericValue);
  };

  const [docUploaded, setDocUploaded] = useState(false);

  const handleSaveDocs = async () => {
    setDocUploaded(true);
    setShowModal(false);

    Swal.fire({
      icon: 'success',
      title: 'Berkas tersimpan!',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <>
      <div className="min-h-screen font-sans text-black-2 my-15">
        <main className="max-w-7xl mx-auto px-4 md:px-12">
          <h1 className="text-center text-3xl font-bold mt-6 mb-4">
            Pembayaran
          </h1>

          <div className="flex justify-between pb-6 text-center text-xs font-medium">
            {['Checkout details', 'Order complete'].map((label, idx) => (
              <div key={idx} className="flex-1 relative py-2">
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center
                    ${idx === 0 ? 'bg-[#38CB89]' : ''}
                    ${idx === 1 ? 'bg-primaryBrand' : ''}
                    ${idx === 2 ? 'bg-gray' : ''}`}
                >
                  {idx === 0 ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-white">{idx + 1}</span>
                  )}
                </div>
                <p
                  className={`${idx === 0
                    ? 'text-[#38CB89] font-medium'
                    : idx === 1
                      ? 'text-black font-semibold'
                      : 'text-gray-400 font-medium'
                    }`}
                >
                  {label}
                </p>
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-sm
                    ${idx === 0 ? 'bg-[#38CB89]' : ''}
                    ${idx === 1 ? 'bg-black' : ''}`}
                ></div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-sm font-semibold mb-2">Informasi Kontak</h2>
                <input
                  type="text"
                  value={namaDepan}
                  onChange={(e) => setNamaDepan(e.target.value)}
                  placeholder="Nama Depan"
                  className="w-full border p-2 rounded mb-3"
                />
                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                />
                <input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold mb-2">
                  Metode Pembayaran
                </h2>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="Pembayaran"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-sm">Cicilan</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="Pembayaran"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-sm">Tunai</span>
                  </label>
                </div>
              </div>
              {paymentMethod === 'credit' && (
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Uang Muka
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(downpayment)}
                      onChange={handleDPChange}
                      className="w-full border p-2 rounded border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      * Minimal DP: {formatRupiah(0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tenor
                    </label>
                    <select
                      value={tenor}
                      onChange={(e) => setTenor(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    >
                      {[3, 6, 9, 12, 15, 18, 21, 24].map((val) => (
                        <option key={val} value={val}>
                          {val} Bulan
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ⬇️ Tambahkan Form Kredit */}
                  <div className="space-y-6 border-t pt-6 mt-6">
                    <h3 className="text-md font-bold">
                      Form Pengajuan Cicilan
                    </h3>

                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={creditForm.full_name}
                      onChange={(e) =>
                        setCreditForm({
                          ...creditForm,
                          full_name: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Nomor KTP"
                      value={creditForm.id_number}
                      onChange={(e) =>
                        setCreditForm({
                          ...creditForm,
                          id_number: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="date"
                      placeholder="Tanggal Lahir"
                      value={creditForm.birth_date}
                      onChange={(e) =>
                        setCreditForm({
                          ...creditForm,
                          birth_date: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Alamat"
                      value={creditForm.address}
                      onChange={(e) =>
                        setCreditForm({
                          ...creditForm,
                          address: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="tel"
                      placeholder="Nomor HP"
                      value={creditForm.phone_number}
                      onChange={(e) =>
                        setCreditForm({
                          ...creditForm,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    {/* Upload Dokumen */}
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-6 py-2 flex items-center gap-2 bg-primaryBrand hover:bg-primaryBrandSecond text-white shadow-md rounded-[10px] hover:bg-blue-50 transition"
                    >
                      <GoPlusCircle /> Upload Berkas
                    </button>
                  </div>

                  {from === 'umroh' && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-6 py-2 flex items-center gap-2 bg-primaryBrand hover:bg-primaryBrandSecond text-white shadow-md rounded-[10px] hover:bg-blue-50 transition"
                    >
                      <GoPlusCircle /> Upload Berkas Umroh
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="border h-[300px] rounded-lg p-6 text-sm space-y-4">
              <h3 className="font-semibold text-base">Detail Pesanan</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={`${VITE_STORAGE_URL}/${image}`}
                      className="w-16 h-12 rounded object-cover"
                      alt={name}
                    />
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-gray-500">Jumlah : {qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      Rp{totalHarga.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t">
                <span>Pengiriman</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Subtotal</span>
                <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full py-2.5 rounded text-sm text-white bg-primaryBrand hover:bg-primaryBrandSecond"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </main>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-center">
                Upload Dokumen Pengajuan Cicilan
              </h2>

              {[
                ['ktp_file_path', 'Foto KTP'],
                ['slip_gaji_file_path', 'Slip Gaji'],
                ['kk_file_path', 'Foto KK'],
                ['additional_document', 'Dokumen Tambahan (Opsional)'],
              ].map(([key, label]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <input
                    name={key}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      setUploadedDocs({
                        ...uploadedDocs,
                        [key]: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveDocs}
                  className="px-4 py-2 rounded bg-primaryBrand text-white hover:bg-primaryBrandSecond"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Upload untuk Umroh */}
      {showModal && from === 'umroh' && (
        <div className="fixed top-14 inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-center">
              Upload Berkas Peserta
            </h2>

            {[
              ['ktp_file_path', 'Foto KTP'],
              ['slip_gaji_file_path', 'Slip Gaji'],
              ['kk_file_path', 'Foto KK'],
              ['additional_document', 'Dokumen Tambahan (Opsional)'],
            ].map(([key, label]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleImageUpload(e, key)}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-primaryBrand text-white hover:bg-primaryBrandSecond"
              >
                Tutup
              </button>
              <button
                className="px-4 py-2 rounded bg-primaryBrand text-white hover:bg-primaryBrandSecond"
                onClick={() => {
                  setShowModal(false);
                  Swal.fire({
                    icon: 'success',
                    title: 'Berkas Tersimpan!',
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }}
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

export default Checkout;
