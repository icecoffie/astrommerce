import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FiUsers, FiTag } from 'react-icons/fi';
import { IoCardOutline } from 'react-icons/io5';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FiBox } from 'react-icons/fi';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" onClick={() => setSidebarOpen(false)}>
          <img
            src="/images/logo-dark.svg"
            alt="Logo"
            className="cursor-pointer h-10"
          />
        </NavLink>


        <NavLink to="/Dashboard"></NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-subleText">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Category --> */}
              <li>
                <NavLink
                  to="/admin/CustomerDetails"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText 
                  hover:text-white duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('CustomerDetails') &&
                    'text-white bg-primaryBrand dark:bg-meta-4'
                    }`}
                >
                  <FiUsers className="text-lg" />
                  Detail Pengguna
                </NavLink>
              </li>
              {/* <!-- Menu Item Category --> */}

              {/* <!-- Menu Item customer details--> */}
              <li>
                <NavLink
                  to="/admin/Categories"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText 
      hover:text-white duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname === '/admin/Categories' &&
                    'text-white bg-primaryBrand dark:bg-meta-4'
                    }`}
                >
                  <FiTag className="text-lg" />
                  Produk List
                </NavLink>
              </li>
              {/* <!-- Menu Item OrderManagement --> */}
              <li>
                <NavLink
                  to="/admin/OrderManagement"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText hover:text-white
                    duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('OrderManagement') &&
                    'bg-primaryBrand text-white dark:bg-meta-4'
                    }`}
                >
                  <MdOutlineShoppingCart className="text-lg" />
                  Manajemen Pesanan
                </NavLink>
              </li>
              {/* <!-- Menu Item OrderManagement --> */}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-subleText">
              TRANSAKSI
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Transaksi --> */}
              <li>
                <NavLink
                  to="/admin/Transaction"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText 
                  hover:text-white duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('Transaction') &&
                    'bg-primaryBrand text-white  dark:bg-meta-4'
                    }`}
                >
                  <IoCardOutline className=" text-lg" />
                  Transaksi Cicilan
                </NavLink>
                <NavLink
                  to="/admin/TransaksiUmroh"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText 
                  hover:text-white duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('TransaksiUmroh') &&
                    'bg-primaryBrand text-white  dark:bg-meta-4'
                    }`}
                >
                  <IoCardOutline className=" text-lg" />
                  Transaksi Umroh
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/ApplyCredit"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-subleText hover:text-white
                   duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('ApplyCredit') &&
                    'bg-primaryBrand text-white dark:bg-meta-4'
                    }`}
                >
                  <IoCardOutline className="text-lg" />
                  Permohonan Cicilan
                </NavLink>
              </li>
              {/* <!-- Menu Item Transaksi --> */}
            </ul>
          </div>
          {/* <!-- Others Group --> */}
          <div>
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-subleText">
                PRODUCT
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Stock Product --> */}
                <li>
                  <NavLink
                    to="/admin/Campaign"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
        font-medium text-subleText hover:text-white
        duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('Stock') &&
                      'bg-primaryBrand text-white dark:bg-meta-4'
                      }`}
                  >
                    <FiBox className="text-lg" />
                    Campaign
                  </NavLink>
                </li>

                {/* <!-- Add Product --> */}
                <li>
                  <NavLink
                    to="/admin/AddProduct"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
        font-medium text-subleText hover:text-white
        duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('AddProduct') &&
                      'bg-primaryBrand text-white dark:bg-meta-4'
                      }`}
                  >
                    <IoIosAddCircleOutline className="text-lg" />
                    Tambah Produk
                  </NavLink>
                </li>
                {/* <!-- Add Variant --> */}
                <li>
                  <NavLink
                    to="/admin/AddVariant"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
        font-medium text-subleText hover:text-white
        duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname.includes('AddVariant') &&
                      'bg-primaryBrand text-white dark:bg-meta-4'
                      }`}
                  >
                    <IoIosAddCircleOutline className="text-lg" />
                    Tambah Varian Produk
                  </NavLink>
                </li>

                {/* <!-- Add Category --> */}
                <li>
                  <NavLink
                    to="/admin/AddCategories"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
      font-medium text-subleText hover:text-white
      duration-300 ease-in-out hover:bg-primaryBrand dark:hover:bg-meta-4 ${pathname === '/admin/AddCategories' &&
                      'bg-primaryBrand text-white dark:bg-meta-4'
                      }`}
                  >
                    <IoIosAddCircleOutline className="text-lg" />
                    Tambah Category
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
