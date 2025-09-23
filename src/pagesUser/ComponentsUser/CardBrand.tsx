import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface Brand {
  name: string;
  image: string;
}

const CardBrand: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get<{ data: any[] }>(
          `${VITE_API_URL}/public/viewSuppliers`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );

        const suppliers = Array.isArray(res.data.data) ? res.data.data : [];

        const base = VITE_STORAGE_URL.replace(/\/+$/, '');

        const formattedBrands = suppliers.map((brand) => ({
          name: brand.supplier_name,
          image: brand.image_path
            ? `${base}/${String(brand.image_path).replace(/^\/+/, '')}`
            : 'https://via.placeholder.com/40',
        }));

        setBrands(formattedBrands);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal memuat data merek!',
        });
      }
    };

    fetchBrands();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap gap-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="relative h-[120px] w-[120px] bg-white shadow-md rounded-sm flex justify-center items-center"
          >
            <div className="flex flex-col items-center justify-center gap-3 p-2">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm text-gray-700 font-semibold text-center">
                {brand.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardBrand;
