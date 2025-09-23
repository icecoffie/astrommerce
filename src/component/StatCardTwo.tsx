import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';

type StatCardProps = {
  title?: string;
  subtitle?: string;
  pendingLabel?: string;
  pendingValue?: string;
  pendingDesc?: string;
  canceledLabel?: string;
  canceledValue?: string;
  canceledPercentage?: string;
  isUp?: boolean;
};

const StatCardTwo = ({
  title = 'Total Pengguna',
  subtitle = '7 Hari Terakhir',
  pendingLabel = 'Tertunda',
  pendingValue = '509',
  pendingDesc = 'user 204',
  canceledLabel = 'Batal',
  canceledValue = '94',
  canceledPercentage = '14.4%',
  isUp = false,
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-5 w-full">
      {/* Header */}
      <div className="items-start mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[18px] font-semibold font-lato text-black dark:text-white leading-none">
            {title}
          </h4>
          <FiMoreVertical className="text-gray-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-between text-sm">
        {/* Pending */}
        <div>
          <p className="text-black dark:text-gray font-semibold">
            {pendingLabel}
          </p>
          <p className="font-semibold text-xl text-secondaryBrand dark:text-gray">
            {pendingValue}{' '}
            <span className="text-presentase font-normal text-sm">
              {pendingDesc}
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="h-full w-px bg-gray-200 mx-4" />

        {/* Canceled */}
        <div>
          <p className="text-black dark:text-gray font-semibold">
            {canceledLabel}
          </p>
          <div className="flex">
            <p className="text-xl text-error font-semibold"> {canceledValue}</p>
            <p
              className={`text-sm flex items-center ${
                isUp ? 'text-secondaryBrand' : 'text-error'
              }`}
            >
              {isUp ? (
                <FaArrowUp className="ml-1 mr-1" />
              ) : (
                <FaArrowDown className="ml-1 mr-1" />
              )}
              {canceledPercentage}
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button className="mt-4 border dark:border-gray dark:text-gray dark:hover:bg-primaryBrand border-primaryBrand text-primaryBrand text-sm rounded-full px-4 py-1 hover:bg-primaryBrand hover:text-white transition">
          Details
        </button>
      </div>
    </div>
  );
};

export default StatCardTwo;
