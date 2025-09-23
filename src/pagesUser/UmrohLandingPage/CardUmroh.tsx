import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

// Define Paket type
type Paket = {
  // id: string;
  // type: string;
  // label: string;
  // title: string;
  // price: string;
  // image: string;
  // features: {
  //   flight: string;
  //   hostel: string;
  //   visas: string;
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
};

// Dummy data langsung disini

const CardUmroh: React.FC = () => {
  const [cardpaket, setProducts] = useState<Paket[]>([]);

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${VITE_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const formatted = res.data.map((product: any) => ({
        id: product.id,
        name: product.product_name,
        price: product.sale_price,
        originalPrice: product.original_price,
        image: product.product_image
          ? `${VITE_STORAGE_URL}/${product.product_image}`
          : 'https://via.placeholder.com/300',
        rating: product.rating || 4,
        reviewCount: product.review_count || 0,
      }));
      setProducts(formatted);
    } catch (error) {
      console.error('❌ Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {cardpaket.map((paket) => (
        <div
          key={paket.id}
          className="max-w-xs rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 p-4 relative"
        >
          <img
            src={paket.image}
            alt="Umrah"
            className="rounded-xl w-full h-[180px] object-cover mb-4"
          />

          <div className="flex justify-between items-center">
            {/* <p className="text-sm text-gray-600 mb-1">{paket.type}</p> */}
            {/* <span className="bg-blue-100 text-blue-700 text-sm px-4 py-1 rounded-full font-semibold">
              {paket.label}
            </span> */}
          </div>

          <h3 className="text-lg font-semibold text-gray-800">{paket.name}</h3>
          <p className="text-2xl font-bold text-[#053F8C] mb-3">
            Rp{Number(paket.price).toLocaleString('id-ID')}
            <span className="text-blue-600 font-medium">/ orang</span>
          </p>
          <div className="flex gap-2 mt-4 mb-5">
            <img src="./images/umroh/Flight.svg" alt="icon-flight" />
            <img src="./images/umroh/Hostel.svg" alt="icon-hostel" />
            <img src="./images/umroh/Visas.svg" alt="icon-visas" />
          </div>

          <Link to={`/detailPaket/${paket.id}`}>
            <button className="w-full border border-gray-500 hover:bg-[#F5BE2F] hover:text-white transition rounded-md py-2 text-sm font-medium cursor-pointer">
              Lihat Detail
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CardUmroh;
