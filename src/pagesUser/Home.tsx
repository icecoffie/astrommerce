import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { savePerformance, getPerformances } from "../firebaseService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faHeadset, faUsers } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RAW_API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API = /\/api$/.test(RAW_API) ? RAW_API : `${RAW_API}/api`;

const CAMPAIGNS_URL = `${API}/campaigns`;
const CAMPAIGN_DETAIL_URL = (id: number) => `${API}/campaigns/${id}`;
const LEADERBOARD_URL = `${API}/leaderboard`;
const CONTENTS_URL = (id: number) => `${API}/challenges/${id}/contents`;

type Challenge = {
  id: number;
  campaign_id: number;
  name: string;
  type: string;
  start_at?: string;
  end_at?: string;
  base_points?: number;
  status: string;
};

type Campaign = {
  id: number;
  name: string;
  description?: string;
  status: string;
  image_url?: string;
  banner_url?: string;
  challenges?: Challenge[];
};

type CampaignDetail = Campaign & {
  challenges: Challenge[];
};

type LeaderItem = {
  user_id: number;
  full_name: string;
  points: number;
};

type ContentItem = {
  id: number;
  user_name: string;
  link: string;
};

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loadingContents, setLoadingContents] = useState(false);

  const [campaignDetailOpen, setCampaignDetailOpen] = useState(false);
  const [selectedCampaignDetail, setSelectedCampaignDetail] =
    useState<CampaignDetail | null>(null);
  const [loadingCampaignDetail, setLoadingCampaignDetail] = useState(false);

  const navigate = useNavigate();

 // BE sederhana buat nyatet dan mantau kinerja anggota
useEffect(() => {
  const runTest = async () => {
    try {
      // Ambil data user dari localStorage (diset waktu login)
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?.id) {
        console.warn("⚠️ Belum ada user login, skip simpan kinerja");
        return;
      }

      // Ambil challenge aktif (contoh: pakai campaign pertama aja)
      const active = campaigns.find((c) => c.status === "active");
      const firstChallenge = active?.challenges?.[0];

      if (!firstChallenge) {
        console.warn("⚠️ Tidak ada challenge aktif untuk dicatat");
        return;
      }

      // 1. Simpan data nyata
      await savePerformance({
        userId: user.id, // dari localStorage
        challengeId: firstChallenge.id,
        points: firstChallenge.base_points ?? 0,
      });

      // 2. Ambil semua data
      const list = await getPerformances();
      console.log("🧊 Catatan dari Firestore:", list);
    } catch (err) {
      console.error("Gagal mencatat kinerja:", err);
    }
  };

  runTest();
}, [campaigns]); // <- jalan lagi kalau campaigns sudah di-load

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const c = await axios.get<Campaign[] | { data?: Campaign[] }>(
          CAMPAIGNS_URL,
          { headers: { Accept: "application/json" } }
        );
        const cList = Array.isArray(c.data)
          ? c.data
          : (c.data as any)?.data ?? [];
        setCampaigns(cList);

        const lb = await axios.get<{ data?: LeaderItem[] } | LeaderItem[]>(
          LEADERBOARD_URL,
          { headers: { Accept: "application/json" } }
        );
        const rows = Array.isArray(lb.data)
          ? lb.data
          : (lb.data as any)?.data ?? [];
        setLeaders(rows.slice(0, 5));
      } catch (e) {
        console.error("Home fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const activeCampaigns = useMemo(
    () => (campaigns ?? []).filter((c) => c.status === "active").slice(0, 6),
    [campaigns]
  );

  const fetchContents = async (challengeId: number) => {
    try {
      setLoadingContents(true);
      const res = await axios.get<ContentItem[] | { data?: ContentItem[] }>(
        CONTENTS_URL(challengeId),
        { headers: { Accept: "application/json" } }
      );
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.data ?? [];
      setContents(list);
    } catch (err) {
      console.error("Gagal ambil konten:", err);
      setContents([]);
    } finally {
      setLoadingContents(false);
    }
  };

  const openCampaignDetail = async (id: number) => {
    try {
      setLoadingCampaignDetail(true);
      setCampaignDetailOpen(true);
      const res = await axios.get<CampaignDetail>(CAMPAIGN_DETAIL_URL(id), {
        headers: { Accept: "application/json" },
      });
      setSelectedCampaignDetail(res.data);
    } catch (e) {
      console.error("Gagal ambil detail campaign:", e);
      setSelectedCampaignDetail(null);
    } finally {
      setLoadingCampaignDetail(false);
    }
  };

  const closeCampaignDetail = () => {
    setCampaignDetailOpen(false);
    setSelectedCampaignDetail(null);
  };

  const goJoin = async (ch: Challenge) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth/signin", {
      state: { redirect: `/challenge/${ch.id}/submit` },
    });
    return;
  }

  // Catat ke Firebase
  const ok = await savePerformance({
    userId: "1601", // Ganti dengan user ID sebenarnya
    challengeId: ch.id,
    points: ch.base_points ?? 0,
  });

  if (ok) {
    alert("✅ Berhasil tercatat di sistem!");
  } else {
    alert("❌ Gagal mencatat progress.");
  }

  setCampaignDetailOpen(false);
  navigate(`/challenge/${ch.id}/submit`);
};

  return (
    <div className="overflow-hidden bg-white">
      <Header />

      {/* HERO */}
      <section
        className="mt-16 pb-35 text-white relative"
        style={{ background: "linear-gradient(to right, #B91C1C, #000000)" }}
      >
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* LEFT */}
          <div className="relative">
            <motion.h4
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl lg:text-5xl font-bold leading-tight text-white relative z-10 font-racing"
            >
              HPZ Crew — <br /> Komunitas Motor & Event Otomotif Indonesia
            </motion.h4>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-6 text-red-200 text-lg max-w-md relative z-10"
            >
              Bergabunglah dengan HPZ Crew, komunitas motor resmi High
              Performance Zone bersama HPZ TDR. Ikuti challenge seru, kumpulkan
              poin, dan tunjukkan karya di event otomotif Indonesia. Semua
              progresmu tercatat otomatis!
            </motion.p>

            {/* Highlight curve */}
            <svg
              viewBox="0 0 400 60"
              className="absolute -bottom-16 left-0 w-70 h-12 text-white"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 40 C 100 10, 200 70, 295 20"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-4 relative z-10"
            >
              <Link
                to="/campaigns"
                className="rounded-lg bg-white text-red px-6 py-3 font-semibold shadow hover:bg-red hover:text-white font-racing"
              >
                Lihat Challenge
              </Link>
              <Link
                to="/leaderboard"
                className="rounded-lg border border-white text-white px-6 py-3 font-semibold hover:bg-white/30 font-racing"
              >
                Leaderboard
              </Link>
            </motion.div>
          </div>

          {/* CENTER IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center overflow-hidden rounded-2xl w-full max-w-3xl mx-auto"
          >
            <img
              src="/public/red.png"
              alt="Ilustrasi Komunitas"
              className="w-full h-auto object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-xl font-bold text-white font-racing">Tim Ahli</h3>
              <p className="text-red-200 text-sm">
                Selalu siap mendukung komunitas.
              </p>
              <div className="flex mt-4 -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur shadow border border-white/20">
              <h3 className="text-lg font-bold text-white font-racing">Cara Main (Singkat)</h3>
              <ol className="mt-4 space-y-2 text-sm list-decimal list-inside text-red-200 marker:text-white">
                <li>Registrasi akun & login.</li>
                <li>Pilih challenge aktif & upload konten.</li>
                <li>Tunggu approval → dapat poin dasar.</li>
                <li>Kumpulkan poin, naik leaderboard, tukar rewards.</li>
              </ol>
              <button
                onClick={() => navigate("/campaigns")}
                className="mt-6 w-full backdrop-blur hover:bg-red rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 font-racing"
              >
                Mulai Ikut Challenge
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-racing">Lebih dari 5k Member</h3>
              <p className="text-red-200 text-sm">
                Bergabunglah dan rasakan keseruan bareng komunitas.
              </p>
            </div>
          </motion.div>
        </div>
      </section>



      {/* LEADERBOARD / ANALYTICS */}
            <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-10">
      <section className="py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center font-racing">
            Leaderboard Crews
          </h2>
          {leaders.length === 0 ? (
            <p className="text-center text-slate-600">
              Belum ada data leaderboard.
            </p>
          ) : (
            <div className="rounded-xl bg-white p-8 shadow">
              <h3 className="font-semibold mb-6 text-lg text-center">
                Leaderboard (Top 5)
              </h3>
              <div className="h-[500px]">
                <Bar
                  data={{
                    labels: leaders.map((l) => l.full_name),
                    datasets: [
                      {
                        label: "Poin",
                        data: leaders.map((l) => l.points),
                        backgroundColor: (ctx: any) => {
                          const chart = ctx.chart;
                          const { ctx: canvas } = chart;
                          const gradient = canvas.createLinearGradient(0, 0, 600, 0);
                          gradient.addColorStop(0, "#B91C1C"); // merah
                          gradient.addColorStop(1, "#000000"); // hitam
                          return gradient;
                        },
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    animations: {
                      x: {
                        duration: 1200,       // durasi animasi
                        easing: "easeOutQuart",
                        from: 0,              // mulai dari 0
                      },
                    },
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: { color: "#374151" },
                        grid: { color: "#E5E7EB" },
                      },
                      y: {
                        ticks: { color: "#374151" },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )} 
        </div>
      </section>
      </motion.div>


            {/* WHY JOIN US */}
         <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-10">    
      <section className="py-40 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* IMAGE */}
          <div>
            <img
              src="public/komunitas.png"
              alt="Komunitas"
              className="rounded-xl h-[650px] object-cover scale-110"
            />
          </div>

          {/* COPYWRITING */}
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 font-racing">
              Ride With Pride – Join The Crew
            </h2>
            <p className="text-slate-600 mb-8 text-xl">
              Bergabunglah dengan <b>HPZ Crew</b> untuk jadi bagian dari komunitas motor
              paling solid di Indonesia. Dapatkan pengalaman seru di event otomotif, 
              ikuti challenge, kumpulkan poin, dan tunjukkan kebanggaanmu sebagai rider sejati.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-5">
                <FontAwesomeIcon icon={faRocket} className="text-red-700 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-xl font-racing">Challenge Seru</h3>
                  <p className="text-slate-600 text-xl">
                    Ikuti tantangan mingguan & bulanan yang relevan dengan dunia motor.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-5">
                <FontAwesomeIcon icon={faHeadset} className="text-red-700 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-xl font-racing">Event Eksklusif</h3>
                  <p className="text-slate-600 text-xl">
                    Akses langsung ke event otomotif resmi bersama HPZ TDR & Tes ride motor terbaru.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-5">
                <FontAwesomeIcon icon={faUsers} className="text-red-700 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-xl font-racing">Komunitas Solid</h3>
                  <p className="text-slate-600 text-xl">
                    Bertemu ribuan member lain, berbagi inspirasi, dan perbanyak relasi.
                  </p>
                </div>
              </li>
            </ul>

            {/* CTA JOIN */}
            <div className="mt-10 flex justify-center">
              <Link
                to="/auth/signup"
                className="rounded-lg bg-black/60 text-white px-8 py-3 font-semibold shadow hover:bg-red font-racing"
              >
                Daftar Sekarang
              </Link>
            </div>

          </div>
        </div>
      </section>
      </motion.div>


      {/* MODAL for Challenge Content */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h3 className="text-xl font-bold text-red-700 mb-4">{selectedChallenge.name}</h3>
            <p className="text-sm text-slate-600 mb-4">Konten terbaru dari peserta:</p>
            {loadingContents ? (
              <p className="text-center text-slate-500">Mengambil konten...</p>
            ) : contents.length === 0 ? (
              <p className="text-center text-slate-500">Belum ada konten yang diupload.</p>
            ) : (
              <ul className="space-y-3">
                {contents.map((c) => (
                  <li key={c.id} className="p-3 border rounded">
                    <span className="font-semibold">{c.user_name}</span> —{" "}
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline font-racing">
                      Lihat Konten
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSelectedChallenge(null)}
              className="mt-6 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-10"> 
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 text-center relative">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 font-racing">Bagaimana Cara Kerjanya</h2>
          <p className="text-slate-600 mb-16 text-xl max-w-2xl mx-auto">
            Alur sederhana untuk ikut challenge dan berkembang bersama HPZ Crew.
            </p>
            <br />
            <br />
            <br />
          {/* SVG Garis Zig-Zag */}
          <svg
            viewBox="0 0 1200 400"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[400px] pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 50 300 
           C 200 100, 400 500, 600 200 
           C 800 -50, 1000 400, 1150 150"
              stroke="#B91C1C"
              strokeWidth="3"
              fill="transparent"
            />
          </svg>

          {/* Steps */}
          <div className="relative flex justify-between items-center z-10">
            {[
              { icon: "👤", title: "Buat Akun", desc: "Registrasi mudah & cepat." },
              { icon: "✍️", title: "Ikuti Challenge", desc: "Ikut challenge mingguan & bulanan." },
              { icon: "📊", title: "Lihat Perkembangan", desc: "Pantau poin & progresmu." },
              { icon: "🚀", title: "Bagikan Hasil", desc: "Naik leaderboard & dapatkan rewards." },
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center w-1/4 ${i % 2 === 0 ? "translate-y-10" : "-translate-y-10"
                  }`} // biar zig-zag
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white border-4 border-red-700 flex items-center justify-center text-red-700 text-2xl shadow">
                  <span role="img" aria-label={step.title}>{step.icon}</span>
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </motion.div>


      {/* CAMPAIGN BERJALAN */}
      <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-10"> 
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 font-racing">Campaign Berjalan</h2>
          <p className="text-slate-600 mb-10">Lihat campaign aktif dan jumlah challenge di dalamnya.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading && activeCampaigns.length === 0 && (
              <>
                <div className="h-44 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-44 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-44 rounded-xl bg-slate-100 animate-pulse" />
              </>
            )}
            {!loading && activeCampaigns.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-slate-600">
                Belum ada campaign aktif untuk saat ini.
              </div>
            )}
            {activeCampaigns.map((c) => (
              <div key={c.id} className="rounded-xl border bg-white p-0 shadow hover:shadow-md transition overflow-hidden">
                {/* FOTO/BANNER (kalau ada) */}
                {(c.image_url || c.banner_url) ? (
                  <img
                    src={c.image_url || c.banner_url}
                    alt={c.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-gradient-to-r from-red-700 to-black" />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-slate-900">{c.name}</h3>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">Aktif</span>
                  </div>
                  {c.description && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{c.description}</p>
                  )}
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-slate-700">Challenge: <b>{c.challenges?.length ?? 0}</b></span>
                    <button
                      onClick={() => openCampaignDetail(c.id)}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Lihat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </motion.div>

      {/* MODAL: CAMPAIGN DETAIL (challenge list + reward + foto) */}
      {campaignDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            {/* Header + banner */}
            <div className="relative">
              {selectedCampaignDetail?.image_url || selectedCampaignDetail?.banner_url ? (
                <img
                  src={selectedCampaignDetail?.image_url || selectedCampaignDetail?.banner_url}
                  alt={selectedCampaignDetail?.name || 'Campaign'}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 w-full bg-gradient-to-r from-red-700 to-black" />
              )}
              <button
                onClick={closeCampaignDetail}
                className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow hover:bg-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedCampaignDetail?.name || 'Campaign'}
              </h3>
              {selectedCampaignDetail?.description && (
                <p className="mt-1 text-sm text-slate-600">{selectedCampaignDetail.description}</p>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-800">Daftar Challenge</h4>

                {loadingCampaignDetail ? (
                  <div className="mt-3 text-sm text-slate-500">Memuat detail…</div>
                ) : (selectedCampaignDetail?.challenges?.length ?? 0) === 0 ? (
                  <div className="mt-3 text-sm text-slate-500">Belum ada challenge.</div>
                ) : (
                  <ul className="mt-3 space-y-3">
  {selectedCampaignDetail!.challenges.map((ch) => (
    <li key={ch.id} className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">{ch.name}</div>
          <div className="mt-1 text-xs text-slate-600">
            {ch.start_at ? new Date(ch.start_at).toLocaleDateString("id-ID") : "-"} —{" "}
            {ch.end_at ? new Date(ch.end_at).toLocaleDateString("id-ID") : "-"}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Tipe: <b>{ch.type}</b>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Reward: {ch.base_points ?? 0} pts
          </span>

          {/* CTA JOIN */}
         <button
            onClick={() => goJoin(ch)}
            disabled={ch.status !== "active"}
            className="rounded-md bg-red px-3 py-1.5 text-xs font-semibold text-red hover:bg-red disabled:opacity-50"
            title={ch.status !== "active" ? "Challenge belum aktif" : "Ikut Challenge ini"}
          >
                    Ikut Challenge
                    </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

                )}
              </div>

              <button
                onClick={closeCampaignDetail}
                className="mt-5 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
