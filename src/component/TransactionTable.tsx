import { FaCircle } from 'react-icons/fa';
import { CgSortAz } from 'react-icons/cg';

type Transaction = {
  id: number;
  customerId: string;
  date: string;
  status: 'Terbayar' | 'Belum Terbayar';
  amount: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    customerId: '#6545',
    date: '01 Oct | 11:29 am',
    status: 'Terbayar',
    amount: '64',
  },
  {
    id: 2,
    customerId: '#5412',
    date: '01 Oct | 11:29 am',
    status: 'Belum Terbayar',
    amount: '557',
  },
  {
    id: 3,
    customerId: '#6622',
    date: '01 Oct | 11:29 am',
    status: 'Terbayar',
    amount: '156',
  },
  {
    id: 4,
    customerId: '#6462',
    date: '01 Oct | 11:29 am',
    status: 'Terbayar',
    amount: '264',
  },
  {
    id: 5,
    customerId: '#6462',
    date: '01 Oct | 11:29 am',
    status: 'Terbayar',
    amount: '265',
  },
];

const TransactionTable = () => {
  return (
    <div className="bg-white  dark:bg-boxdark  px-5 py-7 rounded-xl shadow-sm w-full font-lato">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[18px] font-semibold text-secondaryBrand dark:text-gray">
          Transaksi
        </h2>
        <button className="bg-primaryBrand hover:bg-primaryBrandSecond text-white px-3 py-1 flex items-center gap-2 text-sm rounded">
          Filter <CgSortAz size={20} />
        </button>
      </div>

      {/* Scrollable wrapper untuk layar kecil */}
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm table-auto text-left">
          <thead className="text-textfont dark:text-gray font-lato">
            <tr className="border-b border-colorborder">
              <th className="py-2">No.</th>
              <th>Id Pelanggan</th>
              <th>Tanggal Pesanan</th>
              <th>Status</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr
                key={t.id}
                className="border-colorborder text-black dark:text-gray text-[13px] font-lato"
              >
                <td className="py-2">{index + 1}.</td>
                <td>{t.customerId}</td>
                <td>{t.date}</td>
                <td className="flex items-center gap-2 py-2">
                  <FaCircle
                    className={`text-[6px] ${
                      t.status === 'Terbayar' ? 'text-success' : 'text-error'
                    }`}
                  />
                  <span>{t.status}</span>
                </td>
                <td>Rp. {t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-5">
        <button className="mt-3 border border-primaryBrand dark:border-gray dark:text-gray dark:hover:bg-primaryBrand text-primaryBrand text-sm rounded-full px-4 py-1 hover:bg-primaryBrand hover:text-white transition">
          Details
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
