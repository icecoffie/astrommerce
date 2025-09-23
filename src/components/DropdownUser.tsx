import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserOne from '../images/user/user-01.png';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const navigate = useNavigate();

  const [nama, setNama] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const { name, phone, email, address } = user;
        const nameResult = splitFullName(name);
        setNama(nameResult.nama);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  function splitFullName(fullName: string): { nama: string } {
    const words = fullName.trim().split(' ');
    return {
      nama: words.slice(0, 2).join(' '),
    };
  }

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/signin');
  };

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {nama}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <Link
          to="/auth/signin"
          onClick={handleLogout}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#053F8C] hover:text-white transition-colors duration-200"
        >
          Keluar
        </Link>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
