import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-white relative overflow-hidden">

      {/* Background gradient racing */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0d0d0d] to-[#B91C1C]" />

      {/* Racing stripes lurus animasi merah + putih */}
            <style>
              {`
                @keyframes moveDown {
                  0% { transform: translateY(-100%); }
                  100% { transform: translateY(100%); }
                }
              `}
            </style>
            <div className="absolute inset-y-0 right-0 w-[200px] overflow-hidden pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full"
                  style={{
                    right: `${20 + i * 40}px`,
                    width: "4px",
                    background:
                      i % 2 === 0
                        ? "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))"
                        : "linear-gradient(to bottom, rgba(185,28,28,0.9), rgba(185,28,28,0))",
                    boxShadow:
                      i % 2 === 0
                        ? "0 0 20px rgba(255,255,255,0.6)"
                        : "0 0 20px rgba(185,28,28,0.8)",
                    animation: "moveDown 5s linear infinite",
                    animationDelay: `${i * 1.5}s`,
                  }}
                />
              ))}
            </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo-hpz.png" alt="HPZ Logo" className="h-10" />
            <span className="text-xl font-bold tracking-wide">
              HPZ <span className="text-red-500">Crew</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-white/80 max-w-xs">
            High Performance Zone 
            <br/>
            Komunitas dan tantangan untuk kamu yang haus
            akan kecepatan & prestasi.
          </p>
          <address className="not-italic mt-4 text-sm text-white/70 leading-relaxed">
            PT. Terra International <br />
            High Performance Zone <br />
            © 2025 All rights reserved.
          </address>
        </div>

        {/* Col 2: Navigasi */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Navigasi</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-red-400 transition">Tentang Kami</a></li>
            <li><a href="/campaigns" className="hover:text-red-400 transition">Challenge</a></li>
            <li><a href="/leaderboard" className="hover:text-red-400 transition">Leaderboard</a></li>
            <li><a href="/rewards" className="hover:text-red-400 transition">Rewards</a></li>
          </ul>
        </div>

        {/* Col 3: Kontak + Sosmed */}
<div>
  <h4 className="font-semibold text-lg mb-4">Kontak</h4>
  <p className="text-sm text-white/70 mb-4">
    Ada pertanyaan? Hubungi tim HPZ langsung.
  </p>

  {/* Socials */}
  <div className="mt-5 flex gap-3 flex-wrap">
    {/* YouTube */}
    <a
      href="https://www.youtube.com/hpztv"
      aria-label="YouTube"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.8-1.5-.8-1.9-.9C17.6 2.7 12 2.7 12 2.7h-.1s-5.6 0-8.8.3c-.4 0-1.2.1-1.9.9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.7.8 1.7.8 2.1.9 1.5.1 6.9.3 6.9.3s5.6 0 8.8-.3c.4 0 1.2-.1 1.9-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.7 14.3V7.7l6.1 3.3-6.1 3.3z"/>
      </svg>
    </a>

    {/* Facebook */}
    <a
      href="https://www.facebook.com/hpztv"
      aria-label="Facebook"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.44h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85h2.74l-.44 2.92h-2.3V22c4.78-.75 8.43-4.92 8.43-9.94z"/>
      </svg>
    </a>

    {/* Instagram */}
    <a
      href="https://www.instagram.com/hpz.tv"
      aria-label="Instagram"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1112 18.5 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zM18 6.4a1.1 1.1 0 11-1.1-1.1A1.1 1.1 0 0118 6.4z"/>
      </svg>
    </a>

    {/* TikTok */}
    <a
      href="https://www.tiktok.com/@hpztv"
      aria-label="TikTok"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12.75 2h3.5c.1 1.2.5 2.4 1.1 3.4.7 1.1 1.7 2 2.9 2.5v3.6c-1.3-.1-2.5-.4-3.6-1v6.7c0 2-1 3.8-2.7 4.8-1.8 1-4 1-5.7 0-1.7-.9-2.8-2.7-2.8-4.7 0-2.8 2.2-5 5-5 .5 0 1 .1 1.5.3v3.6c-.4-.1-.8-.2-1.2-.1-.9.1-1.7.8-1.9 1.7-.3 1.2.4 2.4 1.6 2.7 1.3.4 2.5-.4 2.9-1.7.1-.3.1-.7.1-1.1V2z"/>
      </svg>
    </a>

    {/* WhatsApp */}
    <a
      href="https://wa.me/6281234567890"
      aria-label="WhatsApp"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition"
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor">
        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.82.74 5.55 2.15 7.95L.5 31.5l7.82-2.07A15.4 15.4 0 0016 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5zm0 28c-2.4 0-4.75-.62-6.8-1.79l-.48-.28-4.64 1.23 1.24-4.52-.3-.47A12.93 12.93 0 013 16c0-7.18 5.82-13 13-13s13 5.82 13 13-5.82 12.5-13 12.5zm7.2-9.27c-.4-.2-2.37-1.17-2.74-1.3-.37-.13-.64-.2-.91.2s-1.05 1.3-1.29 1.57c-.24.27-.48.3-.88.1s-1.7-.63-3.25-2.02c-1.2-1.07-2.01-2.39-2.24-2.79-.24-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.23.27-.4.4-.67.13-.27.07-.5-.03-.7-.1-.2-.91-2.19-1.25-3-.33-.8-.67-.7-.91-.71-.23-.01-.5-.01-.77-.01s-.7.1-1.07.5c-.37.4-1.4 1.37-1.4 3.34 0 1.96 1.43 3.86 1.63 4.13.2.27 2.82 4.32 6.84 6.05.96.42 1.7.67 2.28.86.96.31 1.84.27 2.53.16.77-.11 2.37-.97 2.7-1.91.33-.94.33-1.75.23-1.91-.1-.16-.37-.27-.77-.47z"/>
      </svg>
    </a>
  </div>
</div>
</div>

      {/* Double racing stripes bottom */}
      <div className="absolute bottom-0 left-0 w-full h-2 overflow-hidden">
        <div className="w-[200%] h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[move_4s_linear_infinite]" />
        <div className="w-[200%] h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[move_6s_linear_infinite]" />
      </div>
      <style>
        {`
          @keyframes move {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-white/60">
          PT. Terra International © 2025 High Performance Zone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
