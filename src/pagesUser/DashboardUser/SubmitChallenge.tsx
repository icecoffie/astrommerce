import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../Header";

const API = (import.meta.env.VITE_API_URL as string).replace(/\/$/, "");

type Challenge = {
  id: number;
  campaign_id: number;
  name: string;
  description?: string;
  type: "weekly" | "monthly" | "one_off" | string;
  start_at: string;
  end_at: string;
  base_points: number;
  status: "active" | "draft" | "closed" | string;
};

type Campaign = {
  id: number;
  name: string;
  challenges?: Challenge[];
};

export default function SubmitChallenge() {
  const { id } = useParams(); // challenge id
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  // form state
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "other" | "">("");
  const [contentUrl, setContentUrl] = useState("");
  const [caption, setCaption] = useState("");

  // fetch challenge dari /campaigns lalu flatten
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get<Campaign[]>(`${API}/campaigns`, {
          headers: { Accept: "application/json" },
        });
        const all: Challenge[] = (res.data || []).flatMap((c) => c.challenges ?? []);
        const found = all.find((x) => String(x.id) === String(id));
        setChallenge(found || null);
      } catch (e) {
        console.error(e);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const periode = useMemo(() => {
    if (!challenge) return "-";
    const s = new Date(challenge.start_at).toLocaleDateString("id-ID");
    const e = new Date(challenge.end_at).toLocaleDateString("id-ID");
    return `${s} — ${e}`;
  }, [challenge]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    if (!platform) {
      Swal.fire({ icon: "error", title: "Platform wajib dipilih" });
      return;
    }
    if (!contentUrl || !/^https?:\/\//i.test(contentUrl)) {
      Swal.fire({ icon: "error", title: "URL konten tidak valid" });
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/challenges/${challenge.id}/submissions`,
        {
          platform,
          content_url: contentUrl,
          caption: caption || undefined,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil submit!",
        text: "Konten kamu menunggu review admin.",
        timer: 1600,
        showConfirmButton: false,
      });
      navigate("/profil");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Gagal submit.";
      Swal.fire({ icon: "error", title: "Oops", text: msg });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
          {/* breadcrumb */}
          <div className="mb-4 text-sm text-slate-600">
            <Link to="/dashboard" className="text-[#0B2E6F] hover:underline">Dashboard</Link>
            <span className="mx-2">/</span>
            <span>Submit Challenge</span>
          </div>

          {/* Card: info challenge */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="border-b border-slate-100 px-4 sm:px-6 py-3">
              <h1 className="text-base font-semibold text-slate-900">Submit Challenge</h1>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
              ) : !challenge ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Challenge tidak ditemukan atau sudah tidak aktif.
                </div>
              ) : (
                <>
                  {/* header info */}
                  <div className="mb-4 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">Challenge</p>
                        <p className="text-lg font-semibold text-slate-900">{challenge.name}</p>
                      </div>
                      <span className="text-xs rounded-full bg-slate-50 px-3 py-1 border border-black/5">
                        {challenge.type}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-3">
                      <div>
                        <span className="text-slate-500">Periode:</span> {periode}
                      </div>
                      <div>
                        <span className="text-slate-500">Poin dasar:</span> {challenge.base_points}
                      </div>
                      <div>
                        <span className="text-slate-500">Status:</span>{" "}
                        <span className={challenge.status === "active" ? "text-emerald-600" : "text-slate-600"}>
                          {challenge.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* form */}
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Platform <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#0B2E6F] focus:ring-2 focus:ring-[#0B2E6F]/20"
                        required
                      >
                        <option value="" disabled>Pilih platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        URL Konten <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/reel/..."
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#0B2E6F] focus:ring-2 focus:ring-[#0B2E6F]/20"
                        required
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Pastikan post bersifat publik. Sertakan hashtag resmi jika diminta.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Caption (opsional)
                      </label>
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#0B2E6F] focus:ring-2 focus:ring-[#0B2E6F]/20"
                        placeholder="Tulis deskripsi singkat karya kamu…"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="rounded-lg bg-[#0B2E6F] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#0A275E]"
                      >
                        Kirim Submission
                      </button>
                      <Link
                        to="/dashboard"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Batal
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
