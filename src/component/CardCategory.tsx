import { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface CardCategoryProps {
  onCategorySelect: (selected: string) => void;
}

const CardCategory: React.FC<CardCategoryProps> = ({ onCategorySelect }) => {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    type ApiSupplier = {
      supplier_name: string;
      image_path: string | null;
    };

    type Paginated<T> = { data: T[] };

    const fetchCategories = async () => {
      try {
        const res = await axios.get<Paginated<ApiSupplier> | ApiSupplier[]>(
          `${VITE_API_URL}/viewSuppliers`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
        );

        // Handle paginated atau array langsung
        const suppliers: ApiSupplier[] = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        const base = VITE_STORAGE_URL.replace(/\/+$/, '');

        const formatted = suppliers.map((s) => ({
          name: s.supplier_name,
          image: s.image_path
            ? `${base}/${String(s.image_path).replace(/^\/+/, '')}`
            : 'https://via.placeholder.com/40',
        }));

        setCategories(formatted);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal memuat data produk atau supplier!',
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 4 : 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const currentItems = categories.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={prevPage}
          disabled={page === 0}
          className="bg-white shadow-md rounded-full px-3 py-3 disabled:opacity-40"
        >
          <FaChevronLeft className="text-secondaryBrand" />
        </button>

        <div className="grid grid-cols-4 gap-5 w-full">
          {currentItems.map((category, index) => (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              className="flex items-center gap-3 rounded-lg p-3 shadow-md bg-white text-black cursor-pointer hover:bg-gray-100"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-14 h-14 object-contain rounded-sm shadow-md"
              />
              <div className="font-semibold text-[14px]">{category.name}</div>
            </div>
          ))}
        </div>

        <button
          onClick={nextPage}
          disabled={page >= totalPages - 1}
          className="bg-white shadow-md rounded-full px-3 py-3 disabled:opacity-40"
        >
          <FaChevronRight className="text-secondaryBrand" />
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full">
          {currentItems.map((category, index) => (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              className="flex items-center gap-3 rounded-lg p-3 shadow-md bg-white text-black cursor-pointer hover:bg-gray-100"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-14 h-14 object-contain rounded-sm shadow-md"
              />
              <div className="font-semibold text-[14px]">{category.name}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="bg-white shadow-md rounded-full px-3 py-3 disabled:opacity-40"
          >
            <FaChevronLeft className="text-secondaryBrand" />
          </button>
          <button
            onClick={nextPage}
            disabled={page >= totalPages - 1}
            className="bg-white shadow-md rounded-full px-3 py-3 disabled:opacity-40"
          >
            <FaChevronRight className="text-secondaryBrand" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCategory;
