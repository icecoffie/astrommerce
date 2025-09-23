import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const formatRupiah = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
    : 'Rp0';

type MidtransResult = {
  order_id?: string;
  transaction_time?: string;
  gross_amount?: string | number;
  payment_type?: string;
  transaction_status?: string; // pending, settlement, capture, deny, expire, cancel
  fraud_status?: string;       // accept / challenge
  va_numbers?: Array<{ bank: string; va_number: string }>;
  bank?: string;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  store?: string;
};

type Summary = {
  orderCode?: string;
  date?: string;
  total?: number;
  paymentMethod?: string;
  from?: string;
  midtransResult?: MidtransResult;
} | null;

function prettyPaymentLabel(r?: MidtransResult, fallback?: string) {
  const t = (r?.payment_type || '').toLowerCase();
  if (t === 'gopay') return 'GoPay';
  if (t === 'shopeepay') return 'ShopeePay';
  if (t === 'qris') return 'QRIS';
  if (t === 'credit_card') return 'Kartu Kredit/Debit';
  if (t === 'echannel') return 'Mandiri Bill Payment';
  if (t === 'cstore') return r?.store ? `Convenience Store (${r.store})` : 'Convenience Store';
  if (t === 'bank_transfer') {
    const bank = r?.va_numbers?.[0]?.bank || r?.bank || (r?.permata_va_number ? 'permata' : undefined);
    return bank ? `Bank Transfer (${bank.toUpperCase()})` : 'Bank Transfer';
  }
  return (fallback || 'MIDTRANS').toUpperCase();
}

// Map status Midtrans -> UI
function mapStatus(r?: MidtransResult) {
  const s = (r?.transaction_status || '').toLowerCase();
  const fraud = (r?.fraud_status || '').toLowerCase();

  // success
  if (s === 'settlement' || s === 'capture') {
    return { code: 'success', label: fraud === 'challenge' ? 'Berhasil (Menunggu Review Bank)' : 'Berhasil' };
  }
  // waiting
  if (s === 'pending') {
    return { code: 'pending', label: 'Menunggu Pembayaran' };
  }
  // failed/expired/cancel
  if (s === 'deny' || s === 'expire' || s === 'cancel' || s === 'failure') {
    return { code: 'failed', label: s === 'expire' ? 'Kedaluwarsa' : 'Gagal' };
  }
  // fallback jika kita buat order “cash” lalu admin yang validasi manual
  return { code: 'pending', label: 'Menunggu Validasi Admin' };
}

const Complete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initial: Summary = useMemo(() => {
    const fromState = (location.state as Summary) || null;
    if (fromState) {
      sessionStorage.setItem('completeSummary', JSON.stringify(fromState));
      return fromState;
    }
    const cached = sessionStorage.getItem('completeSummary');
    return cached ? (JSON.parse(cached) as Summary) : null;
  }, [location.state]);

  const derived = useMemo(() => {
    const r = initial?.midtransResult;

    const orderCode =
      initial?.orderCode ||
      r?.order_id ||
      '-';

    const date =
      initial?.date ||
      (r?.transaction_time ? new Date(r.transaction_time).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

    const total =
      typeof initial?.total === 'number'
        ? initial.total!
        : r?.gross_amount
          ? Number(r.gross_amount)
          : 0;

    const paymentLabel = prettyPaymentLabel(r, initial?.paymentMethod);
    const status = mapStatus(r);

    return { orderCode, date, total, paymentLabel, status, from: initial?.from };
  }, [initial]);

  useEffect(() => {
    Swal.fire({
      title: 'Transaksi Diterima',
      text: 'Detail pesanan di bawah ini.',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    });
  }, []);

  // warna/status badge
  const badgeStyle =
    derived.status.code === 'success'
      ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
      : derived.status.code === 'failed'
        ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
        : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';

  // panel info di atas: kalau pending → jelasin “menunggu validasi admin”
  const note =
    derived.status.code === 'pending'
      ? 'Pembayaran kamu sudah kami terima di sistem dan saat ini masih menunggu validasi oleh Admin. Kamu akan mendapat notifikasi setelah status berubah menjadi “Paid”.'
      : derived.status.code === 'success'
        ? 'Pembayaran terkonfirmasi. Terima kasih sudah berbelanja!'
        : 'Transaksi tidak berhasil. Silakan lakukan ulang atau pilih metode pembayaran lain.';

  // Tema warna & teks per status
  const theme = {
    success: {
      wrap: 'bg-emerald-50 ring-emerald-200',
      dot: 'bg-emerald-500',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Pembayaran Berhasil',
      subtitle: derived.status.label,
      note: 'Pembayaran terkonfirmasi. Terima kasih sudah berbelanja!',
    },
    pending: {
      wrap: 'bg-meta-6 ring-yellow-200',
      dot: 'bg-meta-6 ',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
      title: 'Menunggu Validasi Admin',
      subtitle: 'Pembayaran sedang diverifikasi',
      note:
        'Pembayaran sudah tercatat dan saat ini menunggu validasi oleh Admin. Kamu akan mendapat notifikasi ketika status berubah menjadi “Paid”.',
    },
    failed: {
      wrap: 'bg-red-50 ring-red-200',
      dot: 'bg-red-500',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
      title: 'Transaksi Tidak Berhasil',
      subtitle: derived.status.label,
      note: 'Transaksi gagal/berakhir. Silakan coba lagi atau gunakan metode pembayaran lain.',
    },
  } as const;

  const t = theme[derived.status.code as keyof typeof theme] ?? theme.pending;


  return (
    <div className="min-h-screen font-sans text-black-2 mt-15">
      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-8">
        <h1 className="text-center text-3xl font-bold mb-4">Complete!</h1>
        <div className="flex justify-between border-b pb-6 text-center text-xs font-medium">
          {['Shopping cart', 'Checkout details', 'Order complete'].map((label, idx) => (
            <div key={idx} className="flex-1 relative">
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${idx < 2 ? 'bg-[#38CB89]' : 'bg-primaryBrand'} text-white`}>
                {idx < 2 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>3</span>
                )}
              </div>
              <p className={`${idx === 2 ? 'text-black font-semibold' : 'text-[#38CB89] font-medium'}`}>{label}</p>
              {idx === 2 && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4/5 bg-black rounded-sm" />}
            </div>
          ))}
        </div>
      </div>

      {/* Status banner (versi clean) */}
      <div className="max-w-xl mx-auto mt-8 px-4">
        <div className={`rounded-2xl p-5 ring-1 ${t.wrap}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.dot} text-white`}>
              {t.icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold text-black">{t.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full ring-1 ring-black/10 bg-white/70 text-black/70">
                  {t.subtitle}
                </span>
              </div>
              <p className="text-sm mt-2 text-black/70 leading-relaxed">{t.note}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Card ringkasan */}
      <section className="max-w-xl mx-auto p-6 mt-6 text-center bg-white shadow-md rounded-xl ring-1 ring-black/5">
        <h2 className="text-2xl font-semibold mb-2">Terimakasih!</h2>
        <p className="text-sm text-gray-500 mb-6">Pesanan Anda telah diterima</p>

        <div className="text-sm space-y-4 text-left">
          <div className="flex justify-between">
            <span className="text-gray-500">Kode Pesanan</span>
            <span className="font-semibold">{derived.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className="font-semibold">{derived.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold">{formatRupiah(derived.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Metode Pembayaran</span>
            <span className="font-semibold">{derived.paymentLabel}</span>
          </div>
        </div>

        {/* Next steps saat pending */}
        {derived.status.code === 'pending' && (
          <div className="mt-6 text-left text-xs text-black/70 bg-black/5 rounded-lg p-4">
            <p className="font-semibold mb-2">Apa selanjutnya?</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Admin akan memverifikasi pembayaran kamu sesegera mungkin.</li>
              <li>Kamu bisa cek status pesanan di halaman “Orders”.</li>
              <li>Kalau butuh cepat, kirim bukti transfer ke CS agar diprioritaskan.</li>
            </ul>
          </div>
        )}

        <button
          onClick={() => navigate(derived.from === 'umroh' ? '/UmrohLandingPage' : '/')}
          className="mt-8 w-full bg-primaryBrand hover:bg-primaryBrandSecond text-white text-sm py-2.5 rounded"
        >
          Kembali Ke Beranda
        </button>
      </section>
    </div>
  );
};

export default Complete;
