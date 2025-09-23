import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PersonFormData {
  fullName: string;
  whatsapp: string;
  email: string;
  notes?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetails: {
    productName: string;
    selectedDate: string;
    selectedRoomType: string;
    jumlahPesanan: number;
    pricePerPax: number;
    promoDiscount: number;
    bookingFee: number;
    totalHargaFinal: number;
  };
  whatsappNumber: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  packageDetails,
  whatsappNumber,
}) => {
  const [participantsData, setParticipantsData] = useState<PersonFormData[]>([]);
  const [formErrors, setFormErrors] = useState<Record<number, Record<string, string>>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setParticipantsData(
        Array.from({ length: packageDetails.jumlahPesanan }, () => ({
          fullName: '',
          whatsapp: '',
          email: '',
          notes: '',
        }))
      );
      setFormErrors({});
      setShowSuccessPopup(false);
      document.body.style.overflow = 'hidden';
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSuccessPopup) {
          setShowSuccessPopup(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'unset';
      }
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, showSuccessPopup]);

  if (!isOpen) return null;

  const handleParticipantChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParticipantsData((prev) => {
      const newParticipantsData = [...prev];
      newParticipantsData[index] = { ...newParticipantsData[index], [name]: value };
      return newParticipantsData;
    });
  };

  const validateForm = () => {
    const allErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    participantsData.forEach((person, index) => {
      const personErrors: Record<string, string> = {};
      if (!person.fullName.trim()) personErrors.fullName = 'Nama Lengkap wajib diisi.';
      if (!person.whatsapp.trim()) {
        personErrors.whatsapp = 'Nomor HP wajib diisi.';
      } else if (!/^\d{8,15}$/.test(person.whatsapp.trim())) {
        personErrors.whatsapp = 'Format Nomor HP tidak valid (hanya angka, 8-15 digit).';
      }
      if (!person.email.trim()) {
        personErrors.email = 'Email wajib diisi.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email.trim())) {
        personErrors.email = 'Format Email tidak valid.';
      }
      if (Object.keys(personErrors).length > 0) {
        allErrors[index] = personErrors;
        isValid = false;
      }
    });
    setFormErrors(allErrors);
    return isValid;
  };

  const generateRandom12DigitCode = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

  const navigate = useNavigate();

  const handleCheckout = () => {
  navigate('/checkout', {
    state: {
      from: 'umroh',
      id: null,
      name: packageDetails.productName,
      qty: packageDetails.jumlahPesanan,
      price: packageDetails.pricePerPax,
      subtotal: packageDetails.jumlahPesanan * packageDetails.pricePerPax,
      image: '', 
      orderCode: 'ORDU-' + generateRandom12DigitCode(),
      packageDetails,
      participants: participantsData,
    },
  });
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const {
      productName,
      selectedDate,
      selectedRoomType,
      jumlahPesanan,
      pricePerPax,
      promoDiscount,
      totalHargaFinal,
      bookingFee,
    } = packageDetails;

    const currentSubtotalPaket = jumlahPesanan * pricePerPax;
    const currentTotalAfterPromo = Math.max(0, currentSubtotalPaket - promoDiscount);

    const formattedPricePerPax = pricePerPax.toLocaleString('id-ID');
    const formattedSubtotal = currentSubtotalPaket.toLocaleString('id-ID');
    const formattedPromo = promoDiscount.toLocaleString('id-ID');
    const formattedTotalAfterPromo = currentTotalAfterPromo.toLocaleString('id-ID');
    const formattedBookingFee = bookingFee.toLocaleString('id-ID');
    const formattedFinalPayment = totalHargaFinal.toLocaleString('id-ID');

    let participantsMessage = '';
    participantsData.forEach((person, index) => {
      participantsMessage += `\n*Peserta ke-${index + 1}:*\n`;
      participantsMessage += `  Nama: ${person.fullName}\n`;
      participantsMessage += `  WhatsApp: ${person.whatsapp}\n`;
      participantsMessage += `  Email: ${person.email}\n`;
      if (person.notes) participantsMessage += `  Catatan: ${person.notes}\n`;
    });

    const whatsappMessage = encodeURIComponent(
      'Assalamualaikum, saya ingin melakukan pemesanan paket Umroh berikut:\n\n' +
        '*--- Detail Pemesanan ---*\n' +
        `Nama Paket: ${productName}\n` +
        `Tanggal Keberangkatan: ${selectedDate}\n` +
        `Tipe Kamar: ${selectedRoomType}\n` +
        `Jumlah Peserta: ${jumlahPesanan} pax\n\n` +
        '*--- Rincian Biaya ---*\n' +
        `Harga Paket (${jumlahPesanan} pax @Rp${formattedPricePerPax}): Rp${formattedSubtotal}\n` +
        `Total Promo: -Rp${formattedPromo}\n` +
        `*Total Harga (setelah promo): Rp${formattedTotalAfterPromo}*\n` +
        `Biaya Booking: Rp${formattedBookingFee}\n` +
        `*Total Pembayaran Final: Rp${formattedFinalPayment}*\n\n` +
        '*--- Data Peserta ---*\n' +
        participantsMessage +
        '\n\n' +
        'Mohon segera diproses untuk pemesanan ini. Terima kasih.'
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    setShowSuccessPopup(true);
    setTimeout(() => {
    handleCheckout();
}, 2000);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-['Lato']">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
          aria-label="Tutup"
        >
          &times;
        </button>

        {/* Header Modal */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold text-[#141718] mb-1">Isi Detail Pemesanan</h2>
          <p className="text-gray-600 text-xs">
            Detail kontak ini akan digunakan untuk konsultasi persiapan dan penyelesaian pembayaran untuk paket umrah yang dipilih. (*) Wajib diisi.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Ringkasan Detail Paket */}
          <div className="order-last lg:order-first bg-gray-50 p-5 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold text-[#141718] mb-3">Ringkasan Paket</h3>
            <div className="flex items-center text-gray-700 mb-1 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 100 7.292 4 4 0 000-7.292zM11 15h2v6h-2z" /></svg>
                <span>{packageDetails.jumlahPesanan} pax | Jakarta</span>
            </div>
            <div className="flex items-center text-gray-700 mb-1 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{packageDetails.selectedDate} | 8 hari, 9 malam</span>
            </div>
            <div className="flex items-center text-gray-700 mb-4 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-4v-2h4v2zM5 20h4v-2H5v2zM12 14v-2h2v2h-2zM7 14h2v-2H7v2zM17 10h-4V8h4v2zM7 10h2V8H7v2zM12 6V4h2v2h-2zM7 6h2V4H7v2z" /></svg>
                <span>{packageDetails.selectedRoomType} | {packageDetails.jumlahPesanan} Orang, 1 Kamar</span> {/* PERBAIKAN DI SINI */}
            </div>

            {/* Detail Harga di dalam modal */}
            <h3 className="text-base font-bold text-[#141718] mt-6 mb-3 border-t pt-3">Detail Harga</h3>
            <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-700">Rp{packageDetails.pricePerPax.toLocaleString('id-ID')} x {packageDetails.jumlahPesanan} pax</span>
                <span className="font-semibold">Rp{(packageDetails.pricePerPax * packageDetails.jumlahPesanan).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2 border-gray-200 mb-2 text-sm">
                <span className="text-red-500">Total Promo</span>
                <span className="font-bold text-red-500">-Rp{packageDetails.promoDiscount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-[#141718] mb-1">
                <span>Total Harga</span>
                <span>Rp{(packageDetails.pricePerPax * packageDetails.jumlahPesanan - packageDetails.promoDiscount).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-[#053F8C] mb-4">
                <span>Booking Fee</span>
                <span>Rp{packageDetails.bookingFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-extrabold text-[#141718] mb-4">
                <span>Total Pembayaran Akhir</span>
                <span>Rp{packageDetails.totalHargaFinal.toLocaleString('id-ID')}</span>
            </div>

            {/* Bagian Perjalanan, Tidak Termasuk Paket, Ketentuan Refund */}
            <div className="mt-6 border-t pt-3">
                <h4 className="text-base font-bold text-[#141718] mb-2">Perjalanan</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm">
                    <li>Hotel Madinah ⭐3</li>
                    <li>Transit</li>
                    <li>Hotel Makkah ⭐4</li>
                </ul>
            </div>
            <div className="mt-4">
                <h4 className="text-base font-bold text-[#141718] mb-2">Tidak Termasuk Paket</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm">
                    <li>Pengeluaran Pribadi</li>
                    <li>Biaya Kelebihan Bagasi (Overbagasi)</li>
                    <li>Pembuatan Paspor</li>
                    <li>Vaksin Meningitis</li>
                </ul>
            </div>
             <div className="mt-4">
                <h4 className="text-base font-bold text-[#141718] mb-2">Ketentuan Refund</h4>
                <p className="text-gray-700 text-sm">Silakan lihat <a href="#" className="text-[#053F8C] hover:underline">Syarat dan Ketentuan</a> kami untuk detail lengkap ketentuan refund.</p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="order-first lg:order-last">
            <form onSubmit={handleSubmit}>
                {/* Loop untuk setiap peserta */}
                {participantsData.map((person, index) => (
                    <div key={index} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                        {packageDetails.jumlahPesanan > 1 && (
                            <h3 className="text-lg font-bold text-[#141718] mb-3">Data Peserta ke-{index + 1}</h3>
                        )}
                        <div className="mb-3">
                            <label htmlFor={`fullName-${index}`} className="block text-gray-700 text-sm font-semibold mb-1">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id={`fullName-${index}`}
                                name="fullName"
                                value={person.fullName}
                                onChange={(e) => handleParticipantChange(index, e)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#053F8C] ${
                                  formErrors[index]?.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Masukkan nama lengkap sesuai KTP/Paspor"
                            />
                            {formErrors[index]?.fullName && <p className="text-red-500 text-xs mt-1">{formErrors[index].fullName}</p>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={`whatsapp-${index}`} className="block text-gray-700 text-sm font-semibold mb-1">
                                Nomor HP <span className="text-red-500">*</span>
                            </label>
                           <input
  type="tel"
  id={`whatsapp-${index}`}
  name="whatsapp"
  value={person.whatsapp}
  onChange={(e) => handleParticipantChange(index, e)}
  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#053F8C] ${
    formErrors[index]?.whatsapp ? 'border-red-500' : 'border-gray-300'
  }`}
  placeholder="Contoh: 081234567890"
/>

                            {formErrors[index]?.whatsapp && <p className="text-red-500 text-xs mt-1">{formErrors[index].whatsapp}</p>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={`email-${index}`} className="block text-gray-700 text-sm font-semibold mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id={`email-${index}`}
                                name="email"
                                value={person.email}
                                onChange={(e) => handleParticipantChange(index, e)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#053F8C] ${
                                  formErrors[index]?.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: nama@email.com"
                            />
                            {formErrors[index]?.email && <p className="text-red-500 text-xs mt-1">{formErrors[index].email}</p>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={`notes-${index}`} className="block text-gray-700 text-sm font-semibold mb-1">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                id={`notes-${index}`}
                                name="notes"
                                value={person.notes}
                                onChange={(e) => handleParticipantChange(index, e)}
                                rows={2}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#053F8C]"
                                placeholder="Tulis catatan jika ada..."
                            ></textarea>
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <button
                type="submit"
                className="bg-[#053F8C] text-white px-5 py-2.5 w-full rounded-lg font-semibold text-base hover:bg-[#042e66] transition shadow-md flex items-center justify-center gap-2 mt-6"
                >
                Lanjut Bayar Booking Fee
                </button>
            </form>
          </div>
        </div>
      </div>

      {/* Pop-up Berhasil */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-green-600 mb-4">Pemesanan Berhasil!</h3>
            <p className="text-gray-700 mb-6 text-sm">
              Detail pemesanan Anda telah berhasil dikirimkan. Tim kami akan segera menghubungi Anda melalui WhatsApp untuk proses selanjutnya.
            </p>
            <button
              onClick={closeSuccessPopup}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition text-base"
            >
              Oke, Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;