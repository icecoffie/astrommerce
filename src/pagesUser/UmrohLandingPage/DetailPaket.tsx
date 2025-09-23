import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';

type RoomType = 'Quad' | 'Triple' | 'Double'; 


const DetailPaket: React.FC = () => {
  const navigate = useNavigate();
  const BOOKING_FEE = 100000; 
  const PROMO_DISCOUNT = 500000; 
  const WHATSAPP_NUMBER = '+6281234567890';

  const product = {
    product_name: 'Umrah Paket Hemat 9 Hari', 
    product_image: '/images/umroh/umroh.jpeg', 
    description_short:
      'Nikmati perjalanan spiritual ke tanah suci dengan fasilitas lengkap dan harga terjangkau.',
    product_description_long: (
      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
        Paket Umroh Hemat 9 Hari ini dirancang untuk Anda yang mendambakan
        ibadah yang khusyuk dan nyaman dengan budget yang lebih terjangkau.
        Nikmati pengalaman beribadah yang fokus tanpa mengurangi esensi
        perjalanan suci Anda. Kami memastikan setiap detail perjalanan Anda
        tertata rapi, mulai dari keberangkatan hingga kepulangan.
      </p>
    ),
    flight_details: {
      airline: 'Lion Air / Batik Air',
      type: 'Direct Flight (Tanpa Transit)',
      class: 'Economy Class',
      luggage: '2 koper @20kg + tas kabin 7kg',
      image: '/images/icons/plane.png', 
    },
    hotel_details: {
      mekkah: 'Elaf Al Mashaer / Le Meridien (atau setaraf ⭐4)',
      madinah: 'Al-Haram Hotel / Leader Al Muna Kareem (atau setaraf ⭐4)',
      distance: '300m - 500m dari Masjid',
      image: '/images/icons/hotel.png', 
    },
    includes: [
      'Tiket pesawat PP Lion Air / Batik Air (Direct Flight)',
      'Akomodasi Hotel Bintang 4 di Mekkah dan Madinah (jarak 300-500m)',
      'Visa Umroh & Asuransi Perjalanan',
      'Makan 3x sehari menu Indonesia',
      'Transportasi Bus AC selama di Arab Saudi',
      'City Tour/Ziarah di Mekkah, Madinah, dan Jeddah',
      'Air Zamzam 5 Liter (sesuai kebijakan Bandara)',
      'Pembimbing Ibadah (Muthawwif) berpengalaman',
      'Perlengkapan Umroh (koper, tas paspor, kain ihram/mukena, syal, dll.)',
      'Manasik Umroh intensif',
    ],
    excludes: [
      'Pembuatan Paspor',
      'Suntik Meningitis',
      'Pengeluaran pribadi (laundry, telepon, dll.)',
      'Transportasi dari daerah asal ke Bandara Keberangkatan',
      'Dam (denda) jika melanggar larangan ihram',
      'Kelebihan bagasi',
    ],
    terms_conditions: [
      'Harga paket dapat berubah sewaktu-waktu sesuai dengan fluktuasi harga tiket pesawat, kurs mata uang, dan regulasi pemerintah Arab Saudi.',
      'Pendaftaran dianggap sah setelah pembayaran DP sebesar Rp 10.000.000/orang.',
      'Pelunasan biaya paket paling lambat 45 hari sebelum keberangkatan.',
      'Pembatalan dari pihak jamaah akan dikenakan biaya sesuai ketentuan yang berlaku.',
    ],
    important_notes: [
      'Jamaah diwajibkan memiliki paspor yang masih berlaku minimal 6 bulan sebelum tanggal keberangkatan.',
      'Suntik meningitis dan vaksinasi lainnya sesuai anjuran pemerintah wajib dilakukan.',
      'Setiap jamaah wajib mematuhi protokol kesehatan yang berlaku.',
    ],

    available_departures: [
      { id: 'dep1', dateRange: '23-31 Jul 2025', basePrice: 23500000, stock: 15 },
      { id: 'dep2', dateRange: '9-17 Jul 2025', basePrice: 24000000, stock: 10 },
      { id: 'dep3', dateRange: '30 Jul-7 Agt 2025', basePrice: 23800000, stock: 8 },
      { id: 'dep4', dateRange: '16-24 Jul 2025', basePrice: 23700000, stock: 12 },
    ],
    room_type_modifiers: {
        'Quad': 0,       
        'Triple': 250000, 
        'Double': 500000, 
    },
  };

  const [selectedDepartureId, setSelectedDepartureId] = useState(product.available_departures[0].id);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('Quad'); 
  const [jumlahPesanan, setJumlahPesanan] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const currentDeparture = product.available_departures.find(dep => dep.id === selectedDepartureId) || { id: '', dateRange: 'Tanggal tidak dipilih', basePrice: 0, stock: 0 };

  const currentPricePerPax = currentDeparture.basePrice + (product.room_type_modifiers[selectedRoomType] || 0);
  const currentAvailableStock = currentDeparture.stock;

  useEffect(() => {
    AOS.init({ once: true });
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href =
      'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap';
    document.head.appendChild(linkElement);
    document.body.style.fontFamily = "'Lato', sans-serif";
    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  useEffect(() => {
    if (jumlahPesanan > currentAvailableStock) {
      setJumlahPesanan(currentAvailableStock > 0 ? currentAvailableStock : 1);
    }
  }, [selectedDepartureId, currentAvailableStock, jumlahPesanan]);


  const tambahPesanan = () => {
    if (jumlahPesanan < currentAvailableStock) {
      setJumlahPesanan(jumlahPesanan + 1);
    }
  };

  const kurangiPesanan = () => {
    if (jumlahPesanan > 1) {
      setJumlahPesanan(jumlahPesanan - 1);
    }
  };

  const calculateSubtotalPaket = () => {
    return jumlahPesanan * currentPricePerPax;
  };

  const calculateTotalAfterPromo = () => {
    const subtotal = calculateSubtotalPaket();
    return Math.max(0, subtotal - PROMO_DISCOUNT); 
  };

  const calculateFinalPayment = () => {
    return calculateTotalAfterPromo() + BOOKING_FEE;
  };

 const handleOpenBookingModal = () => {
  if (currentAvailableStock === 0) {
    alert('Maaf, kuota untuk tanggal yang dipilih habis. Silakan pilih tanggal lain.');
    return;
  }

  if (jumlahPesanan === 0) {
    alert('Jumlah peserta tidak boleh 0.');
    return;
  }

  setIsModalOpen(true); // ✅ Buka modal, bukan navigate
};
const handleConsultationViaWhatsapp = () => {
  const message = encodeURIComponent(
    `Assalamualaikum, saya ingin berkonsultasi mengenai "${product.product_name}". Mohon bantuannya.`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
};


  return (
    <div className="font-['Lato'] bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-100" data-aos="fade-down">
        <div className="container mx-auto px-4">
          <nav>
            <ol className="flex list-none p-0">
              <li className="flex items-center">
                <Link to="/" className="text-gray-600 hover:text-[#053F8C] text-sm">
                  Home
                </Link>
                <span className="mx-2 text-gray-500 text-sm">/</span>
              </li>
              <li className="flex items-center">
                <Link
                  to="/packages"
                  className="text-gray-600 hover:text-[#053F8C] text-sm"
                >
                  Paket Umroh
                </Link>
                <span className="mx-2 text-gray-500 text-sm">/</span>
              </li>
              <li className="text-[#053F8C] font-medium text-sm">Detail Paket</li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="my-10 container mx-auto px-4">
        {/* Gallery */}
        <section className="mb-8">
          <div className="w-full h-[400px] overflow-hidden rounded-lg shadow-lg" data-aos="zoom-in">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Product Info & Order Section (Two Columns) */}
        <section className="lg:flex lg:gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-extrabold text-[#141718] mb-4" data-aos="fade-right">
              {product.product_name}
            </h1>
            <p className="text-2xl font-bold text-[#053F8C] mb-6" data-aos="fade-right" data-aos-delay="100">
              Rp{currentPricePerPax.toLocaleString('id-ID')} / orang
            </p>

            {/* Deskripsi Paket */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up">
              <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                Deskripsi Paket
              </h2>
              {product.product_description_long}
              <p className="text-gray-600 italic text-sm">
                {product.description_short}
              </p>
            </div>

            {/* Detail Penerbangan & Akomodasi */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="100">
                <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                    Detail Penerbangan & Akomodasi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Penerbangan */}
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                        <img src={product.flight_details.image} alt="Pesawat" className="w-20 h-20 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Penerbangan</h3>
                        <ul className="list-none text-gray-700 text-center text-sm">
                            <li><strong>Maskapai:</strong> {product.flight_details.airline}</li>
                            <li><strong>Tipe:</strong> {product.flight_details.type}</li>
                            <li><strong>Kelas:</strong> {product.flight_details.class}</li>
                            <li><strong>Bagasi:</strong> {product.flight_details.luggage}</li>
                        </ul>
                    </div>
                    {/* Akomodasi */}
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                        <img src={product.hotel_details.image} alt="Hotel" className="w-20 h-20 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Akomodasi Hotel</h3>
                        <ul className="list-none text-gray-700 text-center text-sm">
                            <li><strong>Mekkah:</strong> {product.hotel_details.mekkah}</li>
                            <li><strong>Madinah:</strong> {product.hotel_details.madinah}</li>
                            <li><strong>Jarak:</strong> {product.hotel_details.distance}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Fasilitas Termasuk */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                Fasilitas Termasuk
              </h2>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {product.includes.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fasilitas Tidak Termasuk */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                Fasilitas Tidak Termasuk
              </h2>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {product.excludes.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                Syarat & Ketentuan
              </h2>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {product.terms_conditions.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Penting Diketahui */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-xl font-bold text-[#053F8C] mb-4 border-b pb-2">
                Penting Diketahui
              </h2>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {product.important_notes.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Order Section - Boarding Pass Style */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg sticky top-8 self-start relative overflow-hidden" data-aos="fade-left">
              {/* Top Section - Boarding Info */}
              <div className="bg-[#f7f7f7] py-6 px-6 relative">
                {/* Perforated top-edge */}
                <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
                  <div className="flex justify-between w-full">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-3 bg-white rounded-b-full mx-[0.5px]"></div>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#141718] mb-4 text-center">
                  Rincian Pemesanan
                </h3>

                {/* Paket Name */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-gray-500">PAKET UMRAH</p>
                        <p className="font-semibold text-sm text-[#141718]">{product.product_name}</p>
                    </div>
                </div>

                {/* Pilih Tanggal Keberangkatan */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Tanggal Keberangkatan</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.available_departures.map((departure) => (
                      <button
                        key={departure.id}
                        onClick={() => setSelectedDepartureId(departure.id)}
                        className={`px-2 py-1 rounded-md border text-xs font-medium
                          ${selectedDepartureId === departure.id
                            ? 'bg-[#053F8C] text-white border-[#053F8C]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#053F8C]'
                          }
                          ${departure.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-200' : ''}
                        `}
                        disabled={departure.stock === 0}
                      >
                        {departure.dateRange}
                      </button>
                    ))}
                  </div>
                  {currentAvailableStock === 0 && (
                      <p className="text-red-500 text-xs mt-1">Kuota tanggal ini habis.</p>
                  )}
                </div>

                {/* Pilih Tipe Kamar */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Tipe Kamar</h4>
                  <div className="flex gap-2">
                    {Object.keys(product.room_type_modifiers).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedRoomType(type as RoomType)} // Cast here for type safety
                        className={`px-2 py-1 rounded-md border text-xs font-medium
                          ${selectedRoomType === type
                            ? 'bg-[#053F8C] text-white border-[#053F8C]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#053F8C]'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dotted line separator */}
                <div className="absolute left-0 right-0 h-px border-t border-dashed border-gray-300 my-4">
                  <div className="absolute left-0 -top-2 w-4 h-4 bg-white rounded-full -ml-2"></div>
                  <div className="absolute right-0 -top-2 w-4 h-4 bg-white rounded-full -mr-2"></div>
                </div>
              </div>

              {/* Bottom Section - Price Details & Action */}
              <div className="py-6 px-6">
                {/* Detail Harga & Jumlah */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 text-xs">Harga Paket /pax</span>
                  <span className="font-semibold text-[#141718] text-sm">
                    Rp{currentPricePerPax.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Jumlah pax */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 text-xs">Jumlah pax</span>
                  <div className="flex items-center border rounded-md border-gray-300 h-7 overflow-hidden w-20">
                    <button
                      onClick={kurangiPesanan}
                      className="bg-gray-100 text-gray-700 w-5 h-full font-bold text-sm flex items-center justify-center hover:bg-gray-200"
                      type="button"
                      disabled={jumlahPesanan <= 1}
                    >
                      -
                    </button>
                    <input
                      min={1}
                      max={currentAvailableStock}
                      value={jumlahPesanan}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setJumlahPesanan(1);
                          return;
                        }
                        const num = Math.max(
                          1,
                          Math.min(currentAvailableStock, Number(val)),
                        );
                        if (!isNaN(num)) setJumlahPesanan(num);
                      }}
                      className="w-full text-center outline-none border-0 text-xs font-semibold"
                      type="number"
                      readOnly
                    />
                    <button
                      onClick={tambahPesanan}
                      className="bg-gray-100 text-gray-700 w-5 h-full font-bold text-sm flex items-center justify-center hover:bg-gray-200"
                      type="button"
                      disabled={jumlahPesanan >= currentAvailableStock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Promo */}
                <div className="flex justify-between items-center border-b pb-2 border-gray-200 mb-2">
                  <span className="text-red-500 text-xs">Total Promo</span>
                  <span className="font-bold text-red-500 text-sm">
                    -Rp{PROMO_DISCOUNT.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Total Harga Final (After Promo) */}
                <div className="flex justify-between items-center text-sm font-bold text-[#141718] mb-1">
                  <span>Total Harga</span>
                  <span>Rp{calculateTotalAfterPromo().toLocaleString('id-ID')}</span>
                </div>

                {/* Booking Fee */}
                <div className="flex justify-between items-center text-base font-bold text-[#053F8C] mb-4">
                  <span>Booking Fee</span>
                  <span>Rp{BOOKING_FEE.toLocaleString('id-ID')}</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleOpenBookingModal}
                    className="bg-[#053F8C] text-white px-4 py-2 w-full rounded-md font-semibold text-sm hover:bg-[#042e66] transition shadow-md"
                  >
                    Lanjutkan Pemesanan
                  </button>
                  <button
                    onClick={handleConsultationViaWhatsapp}
                    className="border border-[#053F8C] text-[#053F8C] px-4 py-2 w-full rounded-md font-semibold text-sm hover:bg-[#053F8C] hover:text-white transition shadow-md flex items-center justify-center gap-2"
                  >
                    Konsultasi Paket
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.557-3.844-1.557-5.877C.187 5.56 5.882 0 12.001 0c3.065 0 5.672 1.258 7.697 3.284 2.027 2.026 3.286 4.633 3.286 7.699 0 6.119-5.706 11.815-11.826 11.815-.994 0-1.956-.13-2.868-.364l-6.183 1.687zm6.598-3.807l-.328-.198c-.571-.345-1.155-.678-1.74-.997l-1.181-.304 1.157-4.444s.359-.089.704.286c1.233 1.344 2.113 1.838 3.52 1.838.932 0 1.677-.384 2.35-.747.533-.284.97-.624 1.365-.951.054-.047.094-.094.123-.131.066-.09.116-.17.155-.246.066-.11.109-.208.136-.296.066-.192.083-.346.059-.444-.027-.11-.082-.23-.146-.356-.059-.115-.128-.21-.211-.284-.082-.074-.176-.11-.271-.11-.118 0-.256.037-.41.074-.128.037-.256.059-.395.059-.286 0-.583-.099-.879-.265-1.298-.755-2.078-1.503-2.656-2.222-.577-.719-1.01-1.738-1.01-2.915 0-.486.136-.931.395-1.284.286-.395.69-.589 1.125-.589.444 0 .76.126 1.051.37.17.146.33.323.47.525.146.198.246.395.304.597.06.197.087.359.087.495 0 .15-.027.31-.082.47-.074.24-.179.48-.328.719-.155.24-.345.49-.571.74-.227.246-.49.505-.785.772-.284.278-.583.541-.888.785-.304.24-.624.466-.948.67-.323.208-.657.369-.994.486-.339.116-.68.176-1.026.176-.328 0-.67-.02-.994-.066-.323-.047-.657-.109-.994-.184l-.328-.087z" />
                  </button>
                </div>

                {/* Footer text */}
                <p className="text-gray-500 text-[0.6rem] mt-2 text-center">
                  Garansi booking fee 100% kembali • <a href="#" className="text-[#053F8C] hover:underline">Syarat dan Ketentuan</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packageDetails={{
            productName: product.product_name,
            selectedDate: currentDeparture.dateRange,
            selectedRoomType: selectedRoomType,
            jumlahPesanan: jumlahPesanan,
            pricePerPax: currentPricePerPax,
            promoDiscount: PROMO_DISCOUNT,
            bookingFee: BOOKING_FEE,
            totalHargaFinal: calculateFinalPayment(),
          }}
          whatsappNumber={WHATSAPP_NUMBER}
        />
      )}
    </div>
  );
};

export default DetailPaket;