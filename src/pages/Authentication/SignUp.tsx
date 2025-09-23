// SignUp.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL as string;
const RAJAONGKIR_URL = "https://www.emsifa.com/api-wilayah-indonesia";

interface Province { id: string; name: string; }
interface City { id: string; name: string; }
interface District { id: string; name: string; }

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone_number, setPhone] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // load provinsi
  useEffect(() => {
    axios.get(`${RAJAONGKIR_URL}/api/provinces.json`).then((res) => {
      setProvinces(res.data);
    });
  }, []);

  // load kota by provinsi
  useEffect(() => {
    if (!province) return;
    axios.get(`${RAJAONGKIR_URL}/api/regencies/${province}.json`).then((res) => {
      setCities(res.data);
      setCity("");
      setDistrict("");
      setPostalCode("");
    });
  }, [province]);

  // load kecamatan by kota
  useEffect(() => {
    if (!city) return;
    axios.get(`${RAJAONGKIR_URL}/api/districts/${city}.json`).then((res) => {
      setDistricts(res.data);
      setDistrict("");
      setPostalCode("");
    });
  }, [city]);

  // auto kode pos
  useEffect(() => {
    if (!district) return;
    axios.get(`${RAJAONGKIR_URL}/api/villages/${district}.json`).then((res) => {
      const kode = res.data?.[0]?.postal_code ?? "";
      setPostalCode(kode);
    });
  }, [district]);

  // password check
  const [pwdOk, setPwdOk] = useState(true);
  const [pwdHint, setPwdHint] = useState("");

  useEffect(() => {
    if (!password && !confirmPassword) {
      setPwdOk(true); setPwdHint(""); return;
    }
    if (password && password.length < 6) {
      setPwdOk(false); setPwdHint("Minimal 6 karakter."); return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setPwdOk(false); setPwdHint("Password tidak cocok."); return;
    }
    setPwdOk(true); setPwdHint("");
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops", text: "Password tidak cocok" });
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${VITE_API_URL}/register`, {
        full_name: fullName,
        email,
        password,
        province,
        city,
        address: district,
        postal_code: postalCode,
        phone_number,
      });
      Swal.fire({
        icon: "success",
        title: "Registrasi berhasil",
        text: "Akun kamu sedang menunggu aktivasi admin",
      });
      navigate("/auth/signin");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Daftar gagal",
        text: err?.response?.data?.message ?? "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Background image */}
      <div className="hidden lg:block">
        <img
          src="/public/hola.png"
          alt="HPZ Motorsport"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form section */}
      <div className="flex items-center justify-center bg-black px-6 py-12 sm:px-10">
        <div className="w-full max-w-md bg-black p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-extrabold text-white text-center mb-2 uppercase">
            Buat Akun
          </h2>
          <p className="mb-6 text-center text-white text-sm">
            Daftar untuk bergabung dengan{" "}
            <span className="text-red">HPZ Crew</span> dan dapatkan hadiah menariknya!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Full width fields */}
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            <input
              type="tel"
              placeholder="No. Telepon"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />

            {/* Grid: Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full rounded-md border px-3 py-2.5 pr-9 bg-transparent text-white outline-none ${
                    pwdOk
                      ? "border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="Ulangi Sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full rounded-md border px-3 py-2.5 pr-9 bg-transparent text-white outline-none ${
                    pwdOk
                      ? "border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {pwdHint && (
              <p className="text-xs font-semibold text-red-500">{pwdHint}</p>
            )}

            {/* Grid: Provinsi, Kota, Kecamatan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none"
                required
              >
                <option value="">Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none"
                required
                disabled={!province}
              >
                <option value="">Kota</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none"
                required
                disabled={!city}
              >
                <option value="">Kecamatan</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Kode Pos */}
            <input
              type="text"
              placeholder="Kode Pos"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent text-white px-3 py-2.5 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !pwdOk}
              className="w-full rounded-md bg-red hover:bg-white/20 text-white py-3 font-semibold shadow-md active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-white">
            Sudah punya akun?{" "}
            <Link to="/auth/signin" className="font-semibold text-red hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
