import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Email dan password wajib diisi",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${VITE_API_URL}/login`,
        { email, password },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      Swal.fire({
        icon: "success",
        title: "Login berhasil",
        text: `Selamat datang, ${data.user.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profil");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Terjadi kesalahan saat login.";
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: msg,
        timer: 1800,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Background image for desktop */}
      <div className="hidden lg:block">
        <img
          src="/public/hola.png"
          alt="HPZ Motorsport"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form section */}
      <div className="flex items-center justify-center bg-gradient-to-br from-red-900 bg-black to-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-white text-center mb-2 uppercase">
            Welcome Back
          </h2>
          <p className="mb-8 text-center text-white">
            Masuk ke akun <span className="text-red">HPZ Crew</span> Anda
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-6 bg-black p-8 rounded-2xl shadow-lg"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                required
                className="w-full rounded-md border border-gray-700 bg-black/60 text-white px-4 py-3 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  className="w-full rounded-md border border-gray-700 bg-black/60 text-white px-4 py-3 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-red-600 bg-white border-gray-600"
                />{" "}
                Ingat saya
              </label>
              <a href="#" className="text-red hover:underline">
                Lupa password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-red hover:bg-white/20 text-white py-3 font-semibold shadow-md active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-sm text-center text-white">
            Belum punya akun?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-red hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
