import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb';
import * as XLSX from 'xlsx';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdChecklist, MdDelete } from 'react-icons/md';
import axios from 'axios';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import Pagination from '../component/Pagination';

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

type StatCardProps = {
  title: string;
  value: string | number;
  percentage?: string;
  trend?: 'up' | 'down';
};

function StatCard({ title, value, percentage = '', trend = 'up' }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-xl bg-white p-5 shadow-md dark:border-gray-700 dark:bg-boxdark">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xl font-semibold font-lato text-black dark:text-white leading-none">
          {title}
        </h4>
      </div>
      <div className="flex items-end gap-3">
        <p className="mt-1 text-2xl font-semibold font-lato text-secondaryBrand dark:text-white">
          {value}
        </p>
        {percentage && (
          <span
            className={`flex items-center gap-1 text-md font-lato ${
              trend === 'up' ? 'text-presentase' : 'text-error'
            }`}
          >
            {trend === 'up' ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
            {percentage}
          </span>
        )}
      </div>
    </div>
  );
}

type Challenge = {
  id: number;
  campaign_id: number;
  name: string;
};

type Submission = {
  id: number;
  user: { id: number; name?: string; full_name?: string; email?: string };
  challenge: { id: number; name: string };
  platform: 'instagram' | 'tiktok' | 'other' | string;
  content_url: string;
  caption?: string | null;
  status: 'submitted' | 'approved' | 'rejected' | string;
  approved_at?: string | null;
  created_at: string;
};

type Paginated<T> =
  | { data: T[]; current_page: number; last_page: number; total?: number }
  | { data: { data: T[]; current_page: number; last_page: number; total?: number } }; // jaga2 format laravel berbeda

const CustomerDetails = () => {
  const token = localStorage.getItem('token') || '';

  // dropdown challenge
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | ''>('');

  // submissions
  const [rows, setRows] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // stats
  const [stats, setStats] = useState({ total: 0, submitted: 0, approved: 0 });

  // ============== Fetch challenges (untuk dropdown) ==============
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/campaigns`, {
          headers: { Accept: 'application/json' },
        });
        const list: Challenge[] = (res.data || [])
          .flatMap((c: any) => (c.challenges ?? []))
          .map((ch: any) => ({ id: ch.id, campaign_id: ch.campaign_id, name: ch.name }));

        setChallenges(list);
        if (list[0]) setSelectedChallengeId(list[0].id);
      } catch (e) {
        console.error('Gagal ambil challenges:', e);
      }
    })();
  }, []);

  // ============== Fetch submissions per-challenge ==============
  const fetchSubmissions = async (challengeId: number, page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get<Paginated<Submission>>(
        `${VITE_API_URL}/challenges/${challengeId}/submissions?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        },
      );

      // normalisasi paginate
      let data: Submission[] = [];
      let current = 1;
      let last = 1;

      const payload: any = res.data;
      if (Array.isArray(payload.data)) {
        data = payload.data;
        current = (payload as any).current_page ?? 1;
        last = (payload as any).last_page ?? 1;
      } else if (payload?.data?.data) {
        data = payload.data.data;
        current = payload.data.current_page ?? 1;
        last = payload.data.last_page ?? 1;
      }

      setRows(data);
      setCurrentPage(current);
      setLastPage(last);

      // stats sederhana
      const total = data.length;
      const submitted = data.filter((d) => d.status === 'submitted').length;
      const approved = data.filter((d) => d.status === 'approved').length;
      setStats({ total, submitted, approved });
    } catch (e) {
      console.error('Gagal ambil submissions:', e);
      setRows([]);
      setStats({ total: 0, submitted: 0, approved: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChallengeId) fetchSubmissions(Number(selectedChallengeId), 1);
  }, [selectedChallengeId]);

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') return rows;
    return rows.filter((r) => (r.status || '').toLowerCase() === statusFilter);
  }, [rows, statusFilter]);

  // ============== Actions ==============
  const handleApprove = async (id: number) => {
    try {
      const res = await axios.post(
        `${VITE_API_URL}/submissions/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
      );
      if (res.status === 200) {
        Swal.fire({ icon: 'success', title: 'Approved', text: 'Submission disetujui.', timer: 1500, showConfirmButton: false });
        if (selectedChallengeId) fetchSubmissions(Number(selectedChallengeId), currentPage);
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || 'Gagal approve.';
      Swal.fire({ icon: 'error', title: 'Oops', text: msg });
    }
  };

  // (opsional) hapus baris — jika kamu punya endpoint delete sendiri
  const handleDelete = async (_id: number) => {
    Swal.fire({ icon: 'info', title: 'Belum ada endpoint delete', timer: 1200, showConfirmButton: false });
  };

  // ============== Export Excel ==============
  const handleExportExcel = () => {
    const exportData = filteredRows.map((s) => ({
      ID: s.id,
      User: s.user?.full_name || s.user?.name || `User #${s.user?.id ?? ''}`,
      Email: s.user?.email ?? '-',
      Challenge: s.challenge?.name ?? '-',
      Platform: s.platform,
      URL: s.content_url,
      Caption: s.caption ?? '',
      Status: s.status,
      'Approved At': s.approved_at ?? '',
      'Created At': s.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 28 }, { wch: 28 }, { wch: 28 }, { wch: 12 },
      { wch: 40 }, { wch: 30 }, { wch: 12 }, { wch: 20 }, { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'Submissions.xlsx');
  };

  // ============== Render ==============
  return (
    <>
      <Breadcrumb pageName="Review Submissions" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total (halaman ini)" value={stats.total} />
        <StatCard title="Submitted" value={stats.submitted} trend="up" />
        <StatCard title="Approved" value={stats.approved} trend="up" />
      </div>

      {/* Controls */}
      <div className="my-3 p-2">
        <h1 className="text-md text-black dark:text-white font-semibold">Daftar Karya Pengguna</h1>
        <div className="sticky top-16 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-64"
              >
                {challenges.length === 0 ? (
                  <option value="">Memuat challenge…</option>
                ) : (
                  challenges.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.id} — {ch.name}
                    </option>
                  ))
                )}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-44 sm:ml-2"
              >
                <option value="all">Semua Status</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={handleExportExcel}
              className="bg-primaryBrand hover:bg-primaryBrandSecond text-white px-4 py-2 rounded w-full sm:w-auto"
              disabled={filteredRows.length === 0}
            >
              Unduh Excel
            </button>
          </div>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="py-6 text-center text-sm text-slate-600">Memuat data…</div>
        ) : filteredRows.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-600">Belum ada submission untuk challenge ini.</div>
        ) : (
          <>
            {/* Tabel desktop */}
            <div className="hidden md:block overflow-x-auto py-4">
              <table className="w-full table-auto shadow-sm">
                <thead className="bg-stroke dark:bg-secondaryBrand">
                  <tr className="text-left text-[15px] font-lato text-secondaryBrand dark:text-white">
                    <th className="py-2 px-3">No</th>
                    <th className="py-2 px-4">User</th>
                    <th className="py-2 px-4">Challenge</th>
                    <th className="py-2 px-4">Platform</th>
                    <th className="py-2 px-4">URL</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((s, idx) => (
                    <tr key={s.id} className="border-b border-colorborder text-left bg-white dark:bg-boxdark">
                      <td className="py-3 px-3">{(currentPage - 1) * filteredRows.length + (idx + 1)}</td>
                      <td className="py-3 px-4 text-[15px] font-lato text-black">
                        <div className="font-semibold">
                          {s.user?.full_name || s.user?.name || `User #${s.user?.id ?? ''}`}
                        </div>
                        <div className="text-xs text-slate-500">{s.user?.email || '-'}</div>
                      </td>
                      <td className="py-3 px-4 text-[15px] font-lato text-black">{s.challenge?.name || '-'}</td>
                      <td className="py-3 px-4 text-[15px] font-lato text-black capitalize">{s.platform}</td>
                      <td className="py-3 px-4">
                        <a
                          href={s.content_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0B2E6F] underline break-all"
                        >
                          buka
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            'rounded-full px-3 py-1 text-xs font-medium ' +
                            (s.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : s.status === 'submitted'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700')
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-3 text-lg">
                        {s.status === 'submitted' && (
                          <button title="Approve" onClick={() => handleApprove(s.id)} className="text-emerald-600">
                            <MdChecklist />
                          </button>
                        )}
                        <button title="Hapus (opsi)" onClick={() => handleDelete(s.id)} className="text-rose-600">
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Kartu mobile */}
            <div className="md:hidden space-y-3 py-2">
              {filteredRows.map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800">
                        {s.user?.full_name || s.user?.name || `User #${s.user?.id ?? ''}`}
                      </div>
                      <div className="text-xs text-gray-500">{s.challenge?.name ?? '-'}</div>
                      <div className="mt-2 text-sm">
                        <div className="text-[12px] text-gray-500">Platform</div>
                        <div className="font-medium capitalize">{s.platform}</div>
                        <div className="text-[12px] text-gray-500 mt-2">URL</div>
                        <a href={s.content_url} target="_blank" className="text-[#0B2E6F] underline break-all">
                          buka
                        </a>
                      </div>
                    </div>
                    <span
                      className={
                        'rounded-full px-3 py-1 text-xs font-medium shrink-0 ' +
                        (s.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : s.status === 'submitted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700')
                      }
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    {s.status === 'submitted' && (
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-md bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (pakai komponen kamu) */}
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={(p) => {
                setCurrentPage(p);
                if (selectedChallengeId) fetchSubmissions(Number(selectedChallengeId), p);
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CustomerDetails;
