// src/components/Header.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faShoppingCart,
  faUserCircle,
  faSearch,
  faSignOutAlt,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";

type Role = "admin" | "member";
type Status = "pending" | "active" | "suspended" | string;

type AppUser = {
  id: number;
  full_name?: string;
  role?: Role;
  status?: Status;
};

type Challenge = { id: number; name: string; type: string };
type Campaign = { id: number; name: string; challenges?: Challenge[] };

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function Header() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDDOpen, setUserDDOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const firstName = useMemo(
    () => (user?.full_name || "User").split(" ")[0],
    [user]
  );

  // load user
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  // preload campaigns
  useEffect(() => {
    axios
      .get<Campaign[]>(`${API_BASE}/campaigns`, {
        headers: { Accept: "application/json" },
      })
      .then((r) => setCampaigns(r.data ?? []))
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/auth/signin", { replace: true });
  };

  const menu = [
    { to: "/", label: "Home" },
    { to: "/campaigns", label: "Challenge" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/rewards", label: "Rewards" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="public/logo-hpz.png" alt="HPZ Logo" className="h-8" />
            </Link>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="flex items-center w-full rounded-full bg-white/10 border border-white/20 px-3 py-1.5 focus-within:ring-2 focus-within:ring-red/30">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-white h-4 w-4"
                />
                <input
                  type="text"
                  placeholder="Cari campaign atau challenge…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-full hover:bg-red-700">
                  Cari
                </button>
              </div>
            </div>

            {/* Right: menu + icons */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                {menu.map((m) => (
                  <Link
                    key={m.to}
                    to={m.to}
                    className="text-white hover:text-red-500 font-medium transition-colors"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>

              {/* Cart */}
              <Link to="/cart">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="h-5 w-5 text-white hover:text-red-500"
                />
              </Link>

             {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDDOpen((v) => !v)}
                    className="flex items-center gap-2 text-white hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                    <span className="hidden sm:inline">Hi, {firstName}</span>
                  </button>

                  {userDDOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-700 bg-[#0f172a]/95 backdrop-blur-md text-white shadow-lg">
                      {user.role === "admin" ? (
                        <Link
                          to="/admin/Dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800"
                          onClick={() => setUserDDOpen(false)}
                        >
                          <FontAwesomeIcon icon={faGaugeHigh} />
                          Admin Panel
                        </Link>
                      ) : (
                        <Link
                          to="/profil"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800"
                          onClick={() => setUserDDOpen(false)}
                        >
                          <FontAwesomeIcon icon={faUserCircle} />
                          Dashboard Saya
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-slate-800"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth/signin"
                  className="flex items-center gap-2 text-white hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                  Login / Register
                </Link>
              )}

              {/* Mobile burger */}
              <button
                className="md:hidden text-white"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <FontAwesomeIcon
                  icon={drawerOpen ? faTimes : faBars}
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur">
          <div className="absolute top-16 left-0 w-full bg-slate-900/95 shadow-lg">
            <div className="flex flex-col space-y-4 p-6">
              {/* Search mobile */}
              <div className="flex items-center w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-slate-300 h-4 w-4"
                />
                <input
                  type="text"
                  placeholder="Cari…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Menu */}
              {menu.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  onClick={() => setDrawerOpen(false)}
                  className="text-white hover:text-red-500 text-lg"
                >
                  {m.label}
                </Link>
              ))}

              <div className="border-t border-slate-700 pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-white font-medium">
                      {user.full_name} ({user.role})
                    </div>
                    {user.role === "admin" ? (
                      <Link
                        to="/admin"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-2 text-white hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faGaugeHigh} />
                        Admin Panel
                      </Link>
                    ) : (
                      <Link
                        to="/profil"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-2 text-white hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faUserCircle} />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 text-white hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth/signin"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-2 text-white hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
