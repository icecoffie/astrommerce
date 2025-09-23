import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AddVariant: React.FC = () => {
  const [products, setProducts] = useState<{ id: number; product_name: string }[]>([]);
  const [productId, setProductId] = useState('');
  const [variantName, setVariantName] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [variant_stock, setVariantStock] = useState('');
  const [variantImage, setVariantImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setProducts(data.map((p: any) => ({ id: p.id, product_name: p.product_name })));
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal memuat data produk',
          icon: 'error',
        });
      }
    };

    fetchProducts();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "Ukuran file terlalu besar",
          text: "Maksimal ukuran foto varian adalah 2MB",
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond",
          },
          buttonsStyling: false,
        });
        e.target.value = "";
        return;
      }

      setVariantImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleAddVariant = async () => {
    if (!productId || !variantName || !additionalPrice || !variant_stock) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field',
        icon: 'warning',
      });
      return;
    }

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('variant_name', variantName);
    formData.append('additional_price', additionalPrice);
    formData.append('variant_stock', variant_stock);
    if (variantImage) {
      formData.append('variant_image', variantImage);
    }

    try {
      await axios.post(`${VITE_API_URL}/products/add-variant/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Varian berhasil ditambahkan',
        icon: 'success',
      });

      setVariantName('');
      setAdditionalPrice('');
      setVariantStock('');
      setProductId('');
      setVariantImage(null);
      setPreview(null);
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan varian', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Tambah Varian Produk
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Upload Gambar */}
        <div className="bg-white border border-gray-300 rounded-lg shadow p-6 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-500 mb-2 text-center">
            Foto Varian
          </label>

          {!preview ? (
            <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-primaryBrand transition">
              <span className="text-gray-400">Klik untuk unggah</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="w-full flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain rounded-lg shadow mb-3"
              />
              <button
                type="button"
                onClick={() => {
                  setVariantImage(null);
                  setPreview(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md 
           text-gray-700 hover:bg-gray-100 transition"
              >
                Ganti Foto
              </button>
            </div>
          )}

          {/* Keterangan ukuran maksimal */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Maksimal ukuran foto: 2MB
          </p>
        </div>
        {/* Form Varian */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Pilih Produk</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primaryBrand focus:border-primaryBrand"
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nama Varian</label>
            <input
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Contoh: Warna, Ukuran, RAM"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primaryBrand focus:border-primaryBrand"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Harga Tambahan</label>
              <input
                type="number"
                value={additionalPrice}
                onChange={(e) => setAdditionalPrice(e.target.value)}
                placeholder="50000"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primaryBrand focus:border-primaryBrand"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Stok Varian</label>
              <input
                type="number"
                value={variant_stock}
                onChange={(e) => setVariantStock(e.target.value)}
                placeholder="100"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primaryBrand focus:border-primaryBrand"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddVariant}
              className="px-8 py-3 bg-primaryBrand hover:bg-primaryBrandSecond text-white font-semibold rounded-lg shadow-md transition"
            >
              Tambah Varian
            </button>
          </div>

        </div>
      </div>
    </div>

  );
};

export default AddVariant;
