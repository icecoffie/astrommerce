import React, { useState } from 'react';
import StatCard from '../../component/StatCard.tsx';
import StatCardTwo from '../../component/StatCardTwo.tsx';
import TransactionTable from '../../component/TransactionTable.tsx';
import TopProducts from '../../component/TopProducts.tsx';
import { CgSortAz } from 'react-icons/cg';
import { FaCircle } from 'react-icons/fa';

const ECommerce = () => {
  const [BestProduct] = useState([
    {
      id: 1,
      name: '#Apple iPhone 13',
      totalOrder: '104',
      status: 'Stok ada',
      price: '999.00',
      image: 'https://i.pravatar.cc/40',
    },
    {
      id: 2,
      name: '#Apple iPhone 13',
      totalOrder: '104',
      status: 'Stok ada',
      price: '999.00',
      image: 'https://i.pravatar.cc/40',
    },
    {
      id: 3,
      name: '#Apple iPhone 13',
      totalOrder: '104',
      status: 'Stok ada',
      price: '999.00',
      image: 'https://i.pravatar.cc/40',
    },
    {
      id: 4,
      name: '#Apple iPhone 13',
      totalOrder: '104',
      status: 'Stok habis',
      price: '999.00',
      image: 'https://i.pravatar.cc/40',
    },
    {
      id: 5,
      name: '#Apple iPhone 13',
      totalOrder: '104',
      status: 'Stok habis',
      price: '999.00',
      image: 'https://i.pravatar.cc/40',
    },
  ]);
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard
          title="Total Penjualan"
          value="$350K"
          subtitle="Penjualan"
          percentage="10.4%"
          isUp={true}
          previous="($235)"
        />
        <StatCard
          title="Total Pesanan"
          value="10.7K"
          subtitle="Pesanan"
          percentage="14.4%"
          isUp={true}
          previous="(7.6k)"
        />
        <StatCardTwo />
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <TransactionTable />
        </div>
        <TopProducts />
      </div>
      <div className="mt-3 bg-white dark:bg-boxdark shadow-md ">
        <div className="p-4 items-center justify-center">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[18px] font-semibold text-secondaryBrand  dark:text-gray">
              Produk Terlaris
            </h2>
            <button className="bg-primaryBrand hover:bg-primaryBrandSecond text-white px-3 py-1 flex items-center gap-2 text-sm rounded">
              Filter <CgSortAz size={20} />
            </button>
          </div>
          <div className="overflow-x-auto pb-4 dark:bg-boxdark">
            <table className="w-full table-auto shadow-sm">
              <thead className="bg-stroke dark:bg-secondaryBrand">
                <tr className="text-left text-[15px] font-lato text-secondaryBrand dark:text-gray">
                  <th className="py-2 px-4">NO</th>
                  <th className="py-2 px-4">PRODUK</th>
                  <th className="py-2 px-4">TOTAL PESANAN</th>
                  <th className="py-2 px-4">STATUS</th>
                  <th className="py-2 px-4">HARGA</th>
                </tr>
              </thead>
              <tbody>
                {BestProduct.map((data, index) => (
                  <tr
                    key={index}
                    className="mt-2 text-left bg-white  dark:bg-boxdark  items-center justify-center"
                  >
                    <td className="py-3 px-4 text-[15px] font-lato text-black dark:text-gray ">
                      {data.id}
                    </td>
                    <td className="py-3 px-4 text-[15px] flex gap-2 items-center font-lato text-black dark:text-gray ">
                      <img
                        src={data.image}
                        alt={data.name}
                        className="w-10 h-10 rounded"
                      />
                      {data.name}
                    </td>
                    <td className="py-3 px-4 text-[15px] font-lato text-black dark:text-gray">
                      {data.totalOrder}
                    </td>
                    <td className="py-3 px-4 text-[15px] font-lato text-black dark:text-gray">
                      <div className="flex items-center gap-2">
                        <FaCircle
                          className={`text-[6px] ${
                            data.status === 'Stok ada'
                              ? 'text-success'
                              : 'text-error'
                          }`}
                        />
                        <span>{data.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[15px] font-lato text-black dark:text-gray">
                      Rp. {data.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-5 mr-2">
              <button className="mt-3 border border-primaryBrand dark:border-gray dark:text-gray dark:hover:bg-primaryBrand text-primaryBrand text-sm rounded-full px-4 py-1 hover:bg-primaryBrand hover:text-white transition">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ECommerce;
