import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginPrice, setProductOriginPrice] = useState('');
  const [productMargin, setProductMargin] = useState('');
  const [variant_name, setVariantName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  // --- Rupiah Formatting Logic ---
  const formatRupiah = (number: string) => {
    const num = parseFloat(number);
    if (isNaN(num)) {
      return '';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatPersen = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return `${num.toLocaleString('id-ID')}%`;
  };
  // --- End Rupiah Formatting Logic ---

  // --- handleImageUpload ---
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // > 2MB
        Swal.fire({
          icon: "warning",
          title: "Ukuran file terlalu besar",
          text: "Maksimal ukuran foto produk adalah 2MB",
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
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('product_name', productName);
    formData.append('product_description', productDescription);
    formData.append('price', productOriginPrice);
    formData.append('margin', productMargin);
    formData.append('sale_price', productPrice);
    formData.append('variant_name', variant_name);
    formData.append('stock_quantity', stockQuantity);
    formData.append('supplier_id', supplierId);
    formData.append('category_id', categoryId);
    formData.append('updated_by', 'admin');
    if (image) {
      formData.append('product_image', image);
    }

    try {
      const response = await axios.post(
        `${VITE_API_URL}/addproducts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('✅ Product saved:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk berhasil disimpan!',
        timer: 2000,
        showConfirmButton: false,
      });

      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductOriginPrice('');
      setProductMargin('');
      setStockQuantity('');
      setSupplierId('');
      setCategoryId('');
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      console.error(
        '❌ Error saving product:',
        error.response?.data || error.message,
      );

      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan produk. Silakan coba lagi.',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton:
            'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });
    }
  };

  const [suppliers, setSuppliers] = useState<any[]>([]);

  const asArray = (payload: any, keys: string[] = ['data', 'suppliers', 'categories', 'items', 'rows']) => {
    if (Array.isArray(payload)) return payload;
    for (const k of keys) {
      if (Array.isArray(payload?.[k])) return payload[k];
    }
    return [];
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/viewSuppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        responseType: 'json',
      });

      let payload: any = res.data;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch { /* biarkan tetap string */ }
      }

      const list = asArray(payload, ['data', 'suppliers']);
      if (!list.length && !Array.isArray(payload)) {
        console.warn('Unexpected supplier payload shape:', payload);
      }

      const formatted = list.map((supplier: any) => ({
        id: supplier.id ?? supplier.supplier_id ?? supplier.uuid,
        name: supplier.supplier_name ?? supplier.name ?? 'Tanpa Nama',
        image: supplier.image_path
          ? `${VITE_STORAGE_URL}/${supplier.image_path}`
          : supplier.image_url ?? supplier.image ?? 'https://via.placeholder.com/40',
      }));

      setSuppliers(formatted);
    } catch (error) {
      console.error('❌ Error fetching supplier data:', error);
    }
  };

  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/viewCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        responseType: 'json',
      });

      let payload: any = res.data;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch { /* ignore */ }
      }

      const list = asArray(payload, ['data', 'categories']);
      if (!list.length && !Array.isArray(payload)) {
        console.warn('Unexpected category payload shape:', payload);
      }

      const formatted = list.map((category: any) => ({
        id: category.id ?? category.category_id ?? category.uuid,
        name: category.category_name ?? category.name ?? 'Tanpa Nama',
        image: category.image_path
          ? `${VITE_STORAGE_URL}/${category.image_path}`
          : category.image_url ?? category.image ?? 'https://via.placeholder.com/40',
      }));

      setCategories(formatted);
    } catch (error) {
      console.error('❌ Error fetching category data:', error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchSuppliers();
  }, []);

  const handleOriginPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setProductOriginPrice(rawValue);
  };

  const handleMarginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setProductMargin(rawValue);
  };

  useEffect(() => {
    const origin = parseFloat(productOriginPrice) || 0;
    const margin = parseFloat(productMargin) || 0;
    setProductPrice((origin + origin * (margin / 100)).toString());
  }, [productOriginPrice, productMargin]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Tambah Produk Baru
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Foto Produk */}
        <div className="bg-white border rounded-lg shadow p-6 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-500 mb-3 text-center">
            Foto Produk
          </label>

          {!preview ? (
            <label className="w-full aspect-square flex flex-col items-center justify-center 
             border-2 border-dashed rounded-lg cursor-pointer 
             hover:border-primaryBrand transition">
              <span className="text-gray-400">Klik untuk unggah</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square border rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md 
           text-gray-700 hover:bg-gray-100 transition"
              >
                Ganti Foto
              </button>
            </div>
          )}

          {/* keterangan ukuran maksimal */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Maksimal ukuran foto: 2MB
          </p>
        </div>


        {/* Form Produk */}
        <div className="lg:col-span-2 space-y-6 bg-white border rounded-lg shadow p-6">
          {/* Nama & Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-500">Nama Produk</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Deskripsi Produk</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          {/* Harga & Margin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Harga Modal</label>
              <input
                type="text"
                value={productOriginPrice === '' ? '' : formatRupiah(productOriginPrice)}
                onChange={handleOriginPriceChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Margin (%)</label>
              <input
                type="text"
                value={productMargin === '' ? '' : formatPersen(productMargin)}
                onChange={handleMarginChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Harga Jual</label>
            <input
              type="text"
              value={productPrice === '' ? '' : formatRupiah(productPrice)}
              className="border border-gray-300 rounded p-2 w-full bg-gray-100"
              readOnly
            />
          </div>

          {/* Varian & Stok */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Default Varian</label>
              <input
                type="text"
                value={variant_name}
                onChange={(e) => setVariantName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Jumlah Stok</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
          </div>

          {/* Kategori & Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Kategori Produk</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Pilih Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primaryBrand text-white font-medium rounded-md hover:bg-primaryBrandSecond"
            >
              Simpan Produk
            </button>
          </div>
        </div>
      </form>
    </div>


  );
};

export default AddProduct;
