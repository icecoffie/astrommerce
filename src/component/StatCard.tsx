import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  percentage: string;
  isUp: boolean;
  previous: string;
  extras?: React.ReactNode;
};

const StatCard = ({
  title,
  value,
  subtitle,
  percentage,
  isUp,
  previous,
  extras,
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-5 w-full">
      <div className="items-start">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[18px] font-semibold font-lato text-black dark:text-white leading-none">
              {title}
            </h4>
            <FiMoreVertical className="text-gray-400" />
          </div>
          <div className="flex items-end gap-2 py-2">
            <span className="text-2xl font-bold text-secondaryBrand dark:text-gray">
              {value}
            </span>
            <span className="text-gray-400 text-sm">{subtitle}</span>
            <span
              className={`text-sm font-medium flex items-center ${
                isUp ? 'text-presentase' : 'text-error'
              }`}
            >
              {isUp ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {percentage}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            7 Hari Terakhir {previous}
          </p>
        </div>
      </div>
      {extras && <div className="mt-4">{extras}</div>}
      <div className="flex justify-end">
        <button className="mt-4 border border-primaryBrand dark:border-gray dark:text-gray dark:hover:bg-primaryBrand text-primaryBrand text-sm rounded-full px-4 py-1 hover:bg-primaryBrand hover:text-white transition">
          Details
        </button>
      </div>
    </div>
  );
};
export default StatCard;
