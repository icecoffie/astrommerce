import { useState, useEffect } from "react";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const token = localStorage.getItem("token");

  // ✅ Fetch data kategori
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/showCategory`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Tambah kategori
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.post(
        `${VITE_API_URL}/addCategories`,
        { category_name: categoryName },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      setMessage({ text: "Kategori berhasil ditambahkan ✅", type: "success" });
      setCategoryName("");
      fetchCategories(); // Refresh daftar
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal menambahkan kategori ❌";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hapus kategori
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      await axios.delete(`${VITE_API_URL}/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setMessage({ text: "Kategori berhasil dihapus 🗑️", type: "success" });
      fetchCategories(); // Refresh
    } catch (error) {
      setMessage({ text: "Gagal menghapus kategori ❌", type: "error" });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 pt-20 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Tambah Kategori Produk
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primaryBrand"
              placeholder="Masukkan nama kategori"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primaryBrand hover:bg-primaryBrandSecond text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Index: Daftar Kategori */}
      <div className="w-full max-w-lg mt-10 bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Kategori</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada kategori.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((cat: any) => (
              <li key={cat.id} className="py-3 flex items-center justify-between">
                <span>{cat.category_name}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
