import { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import { api } from "../../api";

type Row = {
  id: number;
  name?: string;
  full_name?: string;
  points: number;
};

const PAGE_SIZE = 10;

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // fetch leaderboard (ambil semua lalu top 100)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<any>("/leaderboard");
        let data: Row[] = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (Array.isArray(res.data?.data)) data = res.data.data;

        // normalisasi & sort desc by points, ambil top 100
        const normalized = (data || [])
          .map((r) => ({
            id: Number(r.id),
            name: r.name ?? r.full_name ?? `User #${r.id}`,
            full_name: r.full_name ?? r.name,
            points: Number(r.points || 0),
          }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 100);

        setRows(normalized);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const podium = rows.slice(0, 3);
  const startRank = (page - 1) * PAGE_SIZE + 1;

  const next = () => setPage((p) => Math.min(totalPages, p + 1));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
            <p className="text-sm text-slate-600">100 peringkat teratas komunitas HPZ Crew.</p>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="space-y-4">
              <div className="h-40 rounded-2xl bg-white/60 animate-pulse ring-1 ring-black/5" />
              <div className="h-80 rounded-2xl bg-white/60 animate-pulse ring-1 ring-black/5" />
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              Belum ada data poin yang ditampilkan.
            </div>
          )}

          {!loading && rows.length > 0 && (
            <>
              {/* Podium Top 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {podium.map((p, i) => {
                  const rank = i + 1;
                  const tone =
                    rank === 1
                      ? "from-yellow-400 to-amber-500"
                      : rank === 2
                      ? "from-slate-300 to-slate-400"
                      : "from-amber-200 to-amber-300";

                  return (
                    <div
                      key={p.id}
                      className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 relative overflow-hidden"
                    >
                      <div
                        className={`absolute inset-x-0 -top-16 h-40 bg-gradient-to-b ${tone} opacity-20 blur-2xl`}
                      />
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0B2E6F] to-[#123E8F] text-white font-bold">
                          {rank}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-slate-900">
                            {p.full_name || p.name}
                          </p>
                          <p className="text-xs text-slate-500">Poin</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-lg font-bold text-[#0B2E6F]">{p.points}</p>
                          {rank === 1 && (
                            <span className="text-[10px] rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-700">
                              🏆 Juara
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabel Ranking */}
              <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3">
                  <h2 className="text-sm font-semibold text-slate-800">Peringkat</h2>
                  <p className="text-xs text-slate-500">
                    Menampilkan {startRank}–{Math.min(startRank + PAGE_SIZE - 1, rows.length)} dari {rows.length}
                  </p>
                </div>

                {/* Mobile Cards */}
                <div className="p-3 space-y-3 sm:hidden">
                  {pageRows.map((r, idx) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
                          {startRank + idx}
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-slate-900">
                            {r.full_name || r.name}
                          </p>
                          <p className="text-xs text-slate-500">User #{r.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#0B2E6F]">{r.points}</p>
                        <p className="text-[11px] text-slate-500">poin</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-slate-600">
                        {["#", "Pengguna", "Poin"].map((h) => (
                          <th key={h} className="bg-slate-50 px-4 py-3 text-left">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((r, idx) => (
                        <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {startRank + idx}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {r.full_name || r.name}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-black/5">
                              {r.points} pts
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 sm:px-6 py-3">
                  <button
                    onClick={prev}
                    disabled={page === 1}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    ← Sebelumnya
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      const active = n === page;
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`h-8 w-8 rounded-md text-sm ${
                            active
                              ? "bg-[#0B2E6F] text-white"
                              : "border text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={next}
                    disabled={page === totalPages}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
