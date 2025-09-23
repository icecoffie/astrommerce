import React, { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../ComponentsUser/Sidebar';
import Breadcrumb from '../../ComponentsUser/Breadcrumb';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

const DashboardUser = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const path = location.pathname;
    const items = [{ name: 'Beranda', to: '/pesanan' }];
    if (path.includes('PesananSaya')) {
      items.push({ name: 'Pesanan Saya', to: '/pesanan/PesananSaya' });
    } else if (path.includes('Pengaturan')) {
      items.push({ name: 'Pengaturan', to: '/pesanan/Pengaturan' });
    } else if (path.includes('KartuAlamat')) {
      items.push({ name: 'Kartu & Alamat', to: '/pesanan/KartuAlamat' });
    }
    return items;
  }, [location.pathname]);

  const title = breadcrumbItems[breadcrumbItems.length - 1]?.name || 'Dashboard';

  return (
    <div className="text-gray-800 min-h-screen mx-5 overflow-x-hidden">
      <div className="hidden md:block">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Topbar Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="h-14 flex items-center gap-3 px-4">
          <button
            aria-label="Buka menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 border border-slate-200"
          >
            <HiOutlineMenu className="h-5 w-5 text-slate-700" />
          </button>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
        </div>
      </div>

      {/* Drawer Sidebar (mobile only) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* panel */}
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-800">Menu</span>
              <button
                aria-label="Tutup menu"
                className="rounded-md p-2 border border-slate-200"
                onClick={() => setSidebarOpen(false)}
              >
                <HiX className="h-5 w-5 text-slate-700" />
              </button>
            </div>
            <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      <div className="flex gap-6 pt-16 md:pt-0">
        <div className="hidden md:block mt-4">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Konten utama */}
        <main className="bg-white rounded-md shadow-md flex-1 p-6 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardUser;
