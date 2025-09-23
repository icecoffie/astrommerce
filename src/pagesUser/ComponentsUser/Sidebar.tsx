import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiShoppingBagOpenBold } from 'react-icons/pi';
import { CgLogOut } from 'react-icons/cg';
import { MdOutlineDashboard } from 'react-icons/md';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/signin');
  };

  return (
  <aside
    ref={sidebar}
    className={`h-screen w-[250px] bg-white border-r border-gray-200 shadow-md flex flex-col transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:static fixed z-50`}
  >
    {/* Header */}
    <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
      <span className="font-bold text-black-800 text-base">Menu</span>
    </div>

    {/* Menu */}
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/pesanan"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primaryBrand text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primaryBrand'
              }`
            }
          >
            <MdOutlineDashboard className="text-lg" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/PesananSaya"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primaryBrand text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primaryBrand'
              }`
            }
          >
            <PiShoppingBagOpenBold className="text-lg" />
            <span>Pesanan Saya</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

};

export default Sidebar;
