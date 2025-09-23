import { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb.tsx';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { HiOutlineEye } from 'react-icons/hi';
import Pagination from './Pagination.tsx';
import * as XLSX from 'xlsx';
import SearchBar from './SearchBar.tsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productType, setProductType] = useState<'produk' | 'umroh'>('produk');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const token = localStorage.getItem('token');

  type ApiProduct = {
    id: number;
    product_name: string;
    price: number;
    margin: number | null;
    sale_price: number | null;
    product_image: string | null;
    supplier_id: number | null;
    total_stock?: number;
    supplier_info?: { supplier_name: string | null } | null;
  };

  type ApiSupplier = {
    id: number;
    supplier_name: string;
    image_path?: string | null;
  };

  type MaybePaginated<T> = { data: T[] } | T[];

  const fetchProducts = async (type: 'produk' | 'umroh' = 'produk') => {
    const url = `${VITE_API_URL}/products`;

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // request paralel biar lebih cepat
      const [productsRes, suppliersRes] = await Promise.all([
        axios.get<MaybePaginated<ApiProduct>>(url, { headers }),
        axios.get<MaybePaginated<ApiSupplier>>(
          `${VITE_API_URL}/viewSuppliers`,
          { headers },
        ),
      ]);

      // normalize pagination
      const products: ApiProduct[] = Array.isArray(productsRes.data)
        ? productsRes.data
        : (productsRes.data?.data ?? []);

      const suppliers: ApiSupplier[] = Array.isArray(suppliersRes.data)
        ? suppliersRes.data
        : (suppliersRes.data?.data ?? []);

      // map supplier_id -> supplier_name
      const supplierMap = new Map<number, string>();
      for (const s of suppliers) supplierMap.set(s.id, s.supplier_name);

      // bersihin base URL biar gak double slash
      const base = VITE_STORAGE_URL.replace(/\/+$/, '');

      const formattedProducts = products.map((p) => ({
        id: p.id,
        name: p.product_name,
        merek:
          p.supplier_info?.supplier_name ??
          (p.supplier_id != null
            ? supplierMap.get(p.supplier_id)
            : undefined) ??
          'Tidak Diketahui',
        originPrice: p.price,
        margin: p.margin,
        salePrice: p.sale_price ?? p.price, // fallback kalau sale_price null
        stock: p.total_stock ?? 0,
        image: p.product_image
          ? `${base}/${String(p.product_image).replace(/^\/+/, '')}`
          : 'https://via.placeholder.com/40',
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      setProductType(type);
      setSelectedCategory(null);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat data produk atau supplier!',
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

  useEffect(() => {
    fetchProducts('produk');
  }, []);

  // Filter produk berdasarkan pencarian
  useEffect(() => {
    let filtered = products;

    // Filter berdasarkan kategori jika dipilih
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.merek === selectedCategory,
      );
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.merek.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory]);

  const handleShowDetail = (id: number) => {
    // Navigasi ke halaman detail produk
    window.location.href = `/supplier/ProductDetail/${id}`;
  };

  const handleDeleteClick = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin?',
      text: 'Data ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        cancelButton:
          'bg-error text-white px-4 py-2 rounded hover:bg-warning ml-2',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${VITE_API_URL}/products/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Produk berhasil dihapus.',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchProducts(productType);
      } catch (error) {
        console.error('❌ Failed to delete product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus produk. Silakan coba lagi.',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton:
              'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
          },
          buttonsStyling: false,
        });
      }
    }
  };

  const handleExportExcel = () => {
    const formatRupiah = (value: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      })
        .format(value)
        .replace(/\s+/g, '');

    const exportData = filteredProducts.map((product, index) => ({
      No: index + 1,
      Nama: product.name,
      Merek: product.merek,
      Stok: product.stock,
      'Harga Modal': formatRupiah(product.originPrice),
      Margin: (product.margin ?? 0) + '%',
      'Harga Jual': formatRupiah(product.salePrice),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produk');
  };

  // edit produk
  // update field umum
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditingProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // update field variant
  const handleVariantChange = (index: number, field: string, value: any) => {
    setEditingProduct((prev: any) => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleSave = async () => {
    const price = parseFloat(editingProduct.price);
    const margin = parseFloat(editingProduct.margin);
    const sale_price = Math.round(price * (1 + margin / 100));

    const payload = {
      ...editingProduct,
      sale_price, // tambahkan eksplisit
    };

    try {
      await axios.put(
        `${VITE_API_URL}/product/${editingProduct.id}/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Produk berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchProducts(productType); // refresh tabel
    } catch (err) {
      console.error('❌ Gagal update:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Update produk gagal, coba lagi.',
      });
    }
  };
  const fetchProductDetail = async (productId: number) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await axios.get(`${VITE_API_URL}/product/${productId}/edit`, {
        headers,
      });

      // backend biasanya kasih {status:true, data:{...}}
      const productData = res.data.data;

      // mapping sesuai form
      setEditingProduct({
        id: productData.id,
        product_name: productData.product_name,
        product_description: productData.product_description,
        price: productData.price,
        margin: productData.margin,
        sale_price: productData.sale_price,
        total_stock:
          productData.stocks?.reduce(
            (sum: number, s: any) => sum + s.quantity,
            0,
          ) ?? 0,
        category_id: productData.category_id,
        supplier_id: productData.supplier_id,
        product_image: productData.product_image,
        variants:
          productData.stocks?.map((s: any) => ({
            id: s.variant.id,
            variant_name: s.variant.variant_name,
            additional_price: s.variant.additional_price,
            quantity: s.quantity,
            variant_image: s.variant.variant_image,
          })) ?? [],
      });

      setShowModal(true);
    } catch (error) {
      console.error('❌ Error fetching product detail:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Tidak bisa mengambil detail produk.',
      });
    }
  };

  return (
    <>
      <Breadcrumb pageName="Produk List" />
      <div className="w-full max-w-full mt-8 rounded-sm bg-white shadow-default">
        <div className="flex justify-between items-center space-x-4 p-4">
          {/* Filter Button Produk / Umroh */}
          <div className="flex gap-3 mb-4 p-4">
            <button
              onClick={() => fetchProducts('produk')}
              className={`px-4 py-2 rounded shadow-md ${
                productType === 'produk'
                  ? ' text-white bg-primaryBrand'
                  : 'bg-white text-black'
              }`}
            >
              Produk
            </button>
            <button
              onClick={() => fetchProducts('umroh')}
              className={`px-4 py-2 rounded shadow-md ${
                productType === 'umroh'
                  ? ' text-white bg-primaryBrand'
                  : 'bg-white text-black'
              }`}
            >
              Umroh
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4 p-4">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-primaryBrand hover:bg-primaryBrandSecond text-white rounded hover:bg-green-700 transition"
            >
              Unduh Excel
            </button>
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>

        <div className="overflow-x-auto p-4 mt-2 rounded-md">
          <table className="w-full table-auto">
            <thead className="bg-stroke">
              <tr className="text-left text-[15px] font-lato text-secondaryBrand">
                <th className="py-2 px-4">No.</th>
                <th className="py-2 px-4">Nama Produk</th>
                <th className="py-2 px-4">Supplier</th>
                <th className="py-2 px-4 text-center">Stok</th>
                <th className="py-2 px-4">Harga Asli</th>
                <th className="py-2 px-4 text-center">Margin</th>
                <th className="py-2 px-4">Harga Jual</th>
                <th className="py-2 px-4">Proses</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    {searchTerm || selectedCategory
                      ? 'Tidak ada produk yang sesuai dengan filter'
                      : 'Tidak ada data produk.'}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-colorborder text-black text-[15px] font-lato"
                  >
                    <td className="py-2 px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4 flex gap-2 items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded"
                      />
                      {product.name}
                    </td>
                    <td className="py-2 px-4">{product.merek}</td>
                    <td className="py-2 px-4 text-center">{product.stock}</td>
                    <td className="py-2 px-4">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })
                        .format(product.originPrice)
                        .replace(/\s+/g, '')}
                    </td>
                    <td className="py-2 px-4 text-center">{product.margin}%</td>
                    <td className="py-2 px-4">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })
                        .format(product.salePrice)
                        .replace(/\s+/g, '')}
                    </td>
                    <td className="py-3 px-4 flex gap-3 text-black text-lg">
                      <button
                        title="Lihat Detail"
                        onClick={() => handleShowDetail(product.id)}
                      >
                        <HiOutlineEye className="hover:text-green-600 transition-colors duration-200" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => fetchProductDetail(product.id)}
                      >
                        <FaEdit className="hover:text-blue-600 transition-colors duration-200" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        title="Delete"
                      >
                        <MdDeleteOutline className="hover:text-red-600 transition-colors duration-200" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {showModal && editingProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="relative top-11 bg-white dark:bg-boxdark p-6 my-10 rounded-lg shadow-lg w-[90%] max-w-md max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
              <form className="space-y-6 max-w-xl overflow-auto">
                {/* Nama & Deskripsi */}
                <div>
                  <label className="block text-lg">Nama Produk</label>
                  <input
                    type="text"
                    name="product_name"
                    value={editingProduct.product_name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full dark:bg-boxdark"
                  />

                  <label className="block text-lg">Deskripsi</label>
                  <textarea
                    name="product_description"
                    value={editingProduct.product_description || ''}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full dark:bg-boxdark"
                  />
                </div>

                {/* Harga */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Harga Modal</label>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label>Margin (%)</label>
                    <input
                      type="number"
                      name="margin"
                      value={editingProduct.margin}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label>Harga Jual</label>
                    <input
                      type="number"
                      name="sale_price"
                      value={
                        editingProduct.price * (1 + editingProduct.margin / 100)
                      }
                      onChange={handleChange}
                      readOnly
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label>Stok Total</label>
                    <input
                      type="number"
                      name="stock"
                      value={editingProduct.total_stock}
                      onChange={handleChange}
                      readOnly
                      className="border rounded p-2 w-full"
                    />
                  </div>
                </div>

                {/* Variants */}
                <div>
                  <h3 className="font-semibold">Variants</h3>
                  {(editingProduct.variants || []).map(
                    (variant: any, index: number) => (
                      <div key={index} className="border p-3 rounded mb-2">
                        <label>Nama Variant</label>
                        <input
                          type="text"
                          value={variant.variant_name}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              'variant_name',
                              e.target.value,
                            )
                          }
                          className="border rounded p-2 w-full mb-2"
                        />

                        <label>Harga Tambahan</label>
                        <input
                          type="number"
                          value={variant.additional_price}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              'additional_price',
                              Number(e.target.value),
                            )
                          }
                          className="border rounded p-2 w-full mb-2"
                        />

                        <label>Stok</label>
                        <input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              'quantity',
                              Number(e.target.value),
                            )
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Tombol */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-primaryBrand text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
