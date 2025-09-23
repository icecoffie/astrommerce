import { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb.tsx';
import Pagination from '../component/Pagination.tsx';
import SearchBar from '../component/SearchBar.tsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

type Campaign = {
  id: number;
  name: string;
  description?: string | null;
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null;   // YYYY-MM-DD
  status: 'draft' | 'active' | 'closed' | string;
  challenges_count?: number;   // kalau backend pakai withCount
  challenges?: any[];          // fallback
};

const STATUSES = ['draft', 'active', 'closed'] as const;

export default function CampaignList() {
  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  // list + ui states
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Campaign[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Campaign['status']>('all');

  // pagination (client side)
  const [page, setPage] = useState(1);
  const perPage = 10;

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'draft',
  });

  // ====== Fetch ======
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      // <- ubah tipe respons jadi union agar aman untuk paginated
      const res = await axios.get<Campaign[] | { data?: Campaign[] }>(
        `${VITE_API_URL}/campaigns`,
        { headers }
      );

      // ✅ NORMALISASI: ambil array dari res.data atau res.data.data
      const raw = res.data as any;
      const arr: Campaign[] = Array.isArray(raw) ? raw : (raw?.data ?? []);

      // Normalisasi challenges_count
      const list = arr.map((c) => ({
        ...c,
        challenges_count:
          typeof c.challenges_count === 'number'
            ? c.challenges_count
            : Array.isArray(c.challenges)
              ? c.challenges.length
              : 0,
      }));

      setRows(list);
    } catch (e: any) {
      console.error('Fetch campaigns error', e);
      Swal.fire('Gagal', 'Tidak dapat memuat campaign', 'error');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  return rows.filter((r) => {
    const name = (r.name || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const matchQ = !q || name.includes(q) || desc.includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQ && matchStatus;
  });
}, [rows, query, statusFilter]);


  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page],
  );

  useEffect(() => {
    setPage(1); // reset page saat filter berubah
  }, [query, statusFilter]);

  // ====== Modal helpers ======
  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'draft',
    });
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (row: Campaign) => {
    setEditingId(row.id);
    setForm({
      name: row.name || '',
      description: row.description || '',
      start_date: (row.start_date || '').slice(0, 10),
      end_date: (row.end_date || '').slice(0, 10),
      status: (row.status as any) || 'draft',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => resetForm(), 200);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ====== CRUD Calls ======
  const createCampaign = async () => {
    try {
      await axios.post(
        `${VITE_API_URL}/campaigns`,
        {
          name: form.name,
          description: form.description || null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          status: form.status || 'draft',
        },
        { headers },
      );
      Swal.fire('Berhasil', 'Campaign berhasil dibuat', 'success');
      closeModal();
      fetchCampaigns();
    } catch (e: any) {
      console.error('Create error', e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Gagal membuat campaign';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const updateCampaign = async () => {
    if (!editingId) return;
    try {
      await axios.put(
        `${VITE_API_URL}/campaigns/${editingId}`,
        {
          name: form.name,
          description: form.description || null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          status: form.status || 'draft',
        },
        { headers },
      );
      Swal.fire('Berhasil', 'Campaign berhasil diperbarui', 'success');
      closeModal();
      fetchCampaigns();
    } catch (e: any) {
      console.error('Update error', e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Gagal memperbarui campaign';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const deleteCampaign = async (id: number) => {
    const ok = await Swal.fire({
      icon: 'warning',
      title: 'Hapus campaign?',
      text: 'Tindakan ini tidak dapat dibatalkan.',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    });
    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${VITE_API_URL}/campaigns/${id}`, { headers });
      Swal.fire('Berhasil', 'Campaign dihapus', 'success');
      fetchCampaigns();
    } catch (e: any) {
      console.error('Delete error', e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Gagal menghapus campaign';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const updateStatus = async (id: number, status: Campaign['status']) => {
    try {
      await axios.patch(
        `${VITE_API_URL}/campaigns/${id}/status`,
        { status },
        { headers },
      );
      fetchCampaigns();
    } catch (e) {
      Swal.fire('Gagal', 'Tidak dapat mengubah status', 'error');
    }
  };

  // ====== UI ======
  return (
    <>
      <Breadcrumb pageName="Campaign" />

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar
            onSearch={(q) => setQuery(q)}
            placeholder="Cari campaign…"
          />
          <button
            onClick={openCreate}
            className="rounded-md bg-primaryBrand px-4 py-2 text-sm font-semibold text-white hover:bg-primaryBrandSecond"
          >
            + Campaign
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full table-auto">
          <thead className="bg-stroke">
            <tr className="text-left text-[15px] text-secondaryBrand">
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Periode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">#Challenge</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  Memuat…
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  Tidak ada campaign.
                </td>
              </tr>
            ) : (
              paginated.map((c, i) => (
                <tr key={c.id} className="border-b">
                  <td className="px-4 py-3">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    {c.description && (
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {c.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {(c.start_date && new Date(c.start_date).toLocaleDateString('id-ID')) || '-'}{' '}
                      —{' '}
                      {(c.end_date && new Date(c.end_date).toLocaleDateString('id-ID')) || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{c.challenges_count ?? c.challenges?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCampaign(c.id)}
                        className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-5 py-3">
              <div className="text-sm font-semibold text-slate-800">
                {editingId ? 'Edit Campaign' : 'Buat Campaign'}
              </div>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div>
                <label className="text-xs text-slate-500">Nama</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primaryBrand"
                  placeholder="Nama campaign"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primaryBrand"
                  rows={3}
                  placeholder="Tentang campaign"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500">Mulai</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={onChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primaryBrand"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Selesai</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={onChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primaryBrand"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primaryBrand"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
              <button
                onClick={closeModal}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={editingId ? updateCampaign : createCampaign}
                className="rounded-md bg-primaryBrand px-4 py-2 text-sm font-semibold text-white hover:bg-primaryBrandSecond"
              >
                {editingId ? 'Simpan Perubahan' : 'Buat Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
