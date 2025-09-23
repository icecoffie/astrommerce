import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Cards {
  id: number;
  type: string;
  bg: string;
  balance: string;
  number: string;
  name: string;
  logo: string | null;
}

const Alamat: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const cards: Cards[] = [
    {
      id: 1,
      type: "VISA",
      bg: "bg-primary",
      balance: "$95,400.00 USD",
      number: "**** **** **** 3814",
      name: "Kala Samudera",
      logo: null,
    },
    {
      id: 2,
      type: "Mastercard",
      bg: "bg-success",
      balance: "$87,583.00 USD",
      number: "**** **** **** 1761",
      name: "Kala Samudera",
      logo:
        "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="font-inter px-10 py-6">
      <div className="flex items-start gap-6">
        <main className="flex-1">
          {/* Pilihan Pembayaran */}
          <section className="mt-10 border border-gray-200 shadow-sm p-5 bg-white rounded-md">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
              <h2 className="text-base font-semibold">PILIHAN PEMBAYARAN</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Tambah Kartu →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 py-2 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative ${card.bg} text-white rounded-xl p-5 min-h-[180px] max-w-[380px] flex flex-col justify-between`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tombol Dropdown */}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === card.id ? null : card.id)
                      }
                      className="text-white text-xl font-bold"
                    >
                      ⋮
                    </button>
                    {activeDropdown === card.id && (
                      <div className="absolute right-0 mt-2 bg-white text-sm text-subtleText shadow-md rounded w-32 z-10">
                        <div className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                          Ubah Kartu
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                          Hapus Kartu
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Konten Kartu */}
                  <div>
                    <div className="text-xl font-bold mb-1">{card.balance}</div>
                    <p className="text-xs mb-1">CARD NUMBER</p>
                    <p className="text-base tracking-widest mb-3">{card.number}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    {card.logo ? (
                      <img src={card.logo} alt={card.type} className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{card.type}</span>
                    )}
                    <span>{card.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alamat */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="bg-white rounded-md shadow-md p-6 border border-gray-200">
              <h3 className="text-md font-semibold text-presentase mb-2">Billing Address</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-800">Kala Samudera</p>
                <p className="text-sm text-gray-600">
                  Kota Baru, Bekasi Barat, Kota Bekasi, Jawa Barat, Indonesia
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> Kalasamudera@gmail.com
                </p>
                <p className="text-sm">
                  <span className="font-semibold">No HP:</span> +1-202-555-0118
                </p>

                <button className="text-primaryBrand text-[11px] font-semibold border border-primaryBrand rounded px-3 py-1 hover:bg-primaryBrandSecond hover:text-white transition">
                  EDIT ALAMAT
                </button>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-md shadow-md p-6 border border-gray-200">
              <h3 className="text-md font-semibold text-presentase mb-2">Shipping Address</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-800">Kala Samudera</p>
                <p className="text-sm text-gray-600">
                  Kota Baru, Bekasi Barat, Kota Bekasi, Jawa Barat, Indonesia
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> Kalasamudera@gmail.com
                </p>
                <p className="text-sm">
                  <span className="font-semibold">No HP:</span> +1-202-555-0118
                </p>
                <button className="text-primaryBrand text-[11px] font-semibold border border-primaryBrand rounded px-3 py-1 hover:bg-primaryBrandSecond hover:text-white transition">
                  EDIT ALAMAT
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Alamat;
