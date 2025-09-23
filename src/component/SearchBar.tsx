import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Pencarian...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); 
  };

  return (
    <div className="flex items-center w-[300px] bg-white border border-gray500 rounded-xl px-4 py-2 shadow-sm">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm text-gray500 placeholder:text-gray-400"
      />
      <FiSearch className="text-gray-500 ml-2" size={18} />
    </div>
  );
};

export default SearchBar;
