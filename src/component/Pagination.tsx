// Pagination.tsx
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center mt-4 py-4 w-full px-2 md:px-4 gap-3 md:gap-0">
      {/* Previous */}
      <div className="w-full md:w-1/3">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-full md:w-auto px-3 py-2 bg-white shadow-md text-black font-lato text-sm md:text-[15px] rounded-md flex justify-center md:justify-start items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>
      </div>

      {/* Page Numbers */}
      <div className="w-full md:w-1/3 flex justify-center overflow-x-auto">
        <nav className="inline-flex items-center space-x-1">
          {generatePageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-2 py-1 md:px-3 md:py-2 shadow-md rounded-md text-sm ${
                num === currentPage
                  ? 'bg-surfCrest text-secondaryBrand font-bold'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {num}
            </button>
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 py-1 text-gray-400">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-2 py-1 md:px-3 md:py-2 shadow-md rounded-md text-sm ${
                  currentPage === totalPages
                    ? 'bg-surfCrest text-secondaryBrand font-bold'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Next */}
      <div className="w-full md:w-1/3 flex justify-end">
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-full md:w-auto px-3 py-2 bg-white shadow-md text-black font-lato text-sm md:text-[15px] rounded-md flex justify-center md:justify-end items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
