// src/pages/DashboardUser.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import { api } from "../../api";

type AppUser = {
  id: number;
  name?: string;
  full_name?: string;
  email: string;
  status: "pending" | "active" | "suspended" | string;
  address?: string;
  phone_number?: string;
};

type Challenge = {
  id: number;
  campaign_id: number;
  name: string;
  type: "weekly" | "monthly" | "one_off" | string;
  start_at: string;
  end_at: string;
  base_points: number;
  status: "active" | "draft" | "closed" | string;
};

type Campaign = {
  id: number;
  name: string;
  description?: string;
  status: string;
  challenges?: Challenge[];
};

type LeaderRow = { id: number; name?: string; full_name?: string; points: number };

export default function DashboardUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leader, setLeader] = useState<LeaderRow[]>([]);
  const [myPoints, setMyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // load user dari localStorage
  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  // fetch data public + user
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cs, lb] = await Promise.all([
          api.get<Campaign[] | { data?: Campaign[] }>("/campaigns"),
          api.get<LeaderRow[] | { data?: LeaderRow[] }>("/leaderboard"),
        ]);

        // ✅ NORMALIZE ke array
        const campaignList = Array.isArray(cs.data) ? cs.data : (cs.data as any)?.data ?? [];
        const leaderList   = Array.isArray(lb.data) ? lb.data : (lb.data as any)?.data ?? [];

        setCampaigns(campaignList);
        setLeader(leaderList);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  // hitung poin saya (ambil dari leaderboard kalau ada)
  useEffect(() => {
    if (!user || leader.length === 0) return;
    const row = leader.find((r) => r.id === user.id);
    setMyPoints(row?.points ?? 0);
  }, [leader, user]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  (async () => {
    try {
      const res = await api.get<{user: AppUser}>("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (e) {
      // optional: fallback tetap pakai localStorage
      console.warn("Gagal refresh /me", e);
    }
  })();
}, []);

// optional: refresh lagi saat tab fokus (biar status cepat kebaca aktif)
useEffect(() => {
  const onFocus = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get<{user: AppUser}>("/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    }).catch(()=>{});
  };
  window.addEventListener("focus", onFocus);
  return () => window.removeEventListener("focus", onFocus);
}, []);

  const name = useMemo(() => user?.full_name || user?.name || "Pengguna", [user]);

  const activeChallenges = useMemo(() => {
    const all = (Array.isArray(campaigns) ? campaigns : []).reduce<Challenge[]>(
      (acc, c) => acc.concat(c?.challenges ?? []),
      []
    );
    return all.filter((ch) => ch.status === "active");
  }, [campaigns]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="h-32 animate-pulse rounded-2xl bg-white/60 shadow-sm ring-1 ring-black/5" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          {/* Greeting */}
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Halo, {name}</h1>
            <p className="text-sm text-slate-600">Selamat datang di HPZ Crew Dashboard.</p>
          </div>

          {/* Banner pending */}
          {user?.status === "pending" && (
            <div className="mb-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Akun kamu masih <b>pending</b>. Unggah 1 konten challenge dan tunggu validasi admin
              untuk <b>aktivasi akun</b>.
            </div>
          )}

                    {/* CTA bawah tergantung status */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0B2E6F] to-[#123E8F] p-5 text-white shadow-sm">
            {user?.status === "active" ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm opacity-90">Kumpulkan poin dan tukarkan reward.</p>
                  <p className="text-lg font-semibold">Cek hadiah yang tersedia sekarang.</p>
                </div>
                <Link
                  to="/rewards"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B2E6F] shadow hover:bg-slate-50"
                >
                  Lihat Rewards
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm opacity-90">Butuh aktivasi akun?</p>
                  <p className="text-lg font-semibold">Upload 1 konten challenge dan tunggu approve admin.</p>
                </div>
                {activeChallenges[0] && (
                  <Link
                    to={`/challenge/${activeChallenges[0].id}/submit`}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B2E6F] shadow hover:bg-slate-50"
                  >
                    Upload Sekarang
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* At-a-glance cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status Akun</p>
              <p className={`mt-1 text-lg font-semibold ${user?.status === "active" ? "text-emerald-600" : "text-yellow-700"}`}>
                {user?.status ?? "-"}
              </p>
              <p className="mt-2 text-xs text-slate-500">Email: {user?.email}</p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Poin Saya</p>
              <p className="mt-1 text-lg font-semibold text-[#0B2E6F]">{myPoints} pts</p>
              <Link to="/leaderboard" className="mt-2 inline-block text-xs font-medium text-[#0B2E6F] underline">
                Lihat Leaderboard →
              </Link>
            </div>

            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Challenge Aktif</p>
              <p className="mt-1 text-lg font-semibold">{activeChallenges.length}</p>
              <Link to="/campaigns" className="mt-2 inline-block text-xs font-medium text-[#0B2E6F] underline">
                Lihat semua campaign →
              </Link>
            </div>
          </div>

          {/* Challenge aktif list */}
          <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="border-b border-slate-100 px-4 sm:px-6 py-3">
              <h2 className="text-sm font-semibold text-slate-800">Challenge Aktif</h2>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              {activeChallenges.length === 0 ? (
                <p className="text-sm text-slate-600">Belum ada challenge aktif.</p>
              ) : (
                activeChallenges.slice(0, 6).map((ch) => (
                  <div key={ch.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{ch.name}</p>
                      <span className="text-xs text-slate-500">{ch.type}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {new Date(ch.start_at).toLocaleDateString("id-ID")} —{" "}
                      {new Date(ch.end_at).toLocaleDateString("id-ID")}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Poin dasar: <b>{ch.base_points}</b>
                      </span>
                      <Link
                        to={`/challenge/${ch.id}/submit`} // halaman FE upload submission
                        className="rounded-md border border-[#0B2E6F] px-3 py-1 text-xs font-medium text-[#0B2E6F] hover:bg-[#0B2E6F] hover:text-white"
                      >
                        Ikut Challenge
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leaderboard top 5 */}
          <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="border-b border-slate-100 px-4 sm:px-6 py-3">
              <h2 className="text-sm font-semibold text-slate-800">Leaderboard – Top 5</h2>
            </div>
            <div className="p-4 sm:p-6">
              {leader.length === 0 ? (
                <p className="text-sm text-slate-600">Belum ada poin.</p>
              ) : (
                <ol className="space-y-2">
                  {leader.slice(0, 5).map((r, i) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-800">
                          {r.full_name || r.name || `User #${r.id}`}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#0B2E6F]">{r.points} pts</span>
                    </li>
                  ))}
                </ol>
              )}
              <div className="mt-3">
                <Link to="/leaderboard" className="text-xs font-medium text-[#0B2E6F] underline">
                  Lihat semua →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
