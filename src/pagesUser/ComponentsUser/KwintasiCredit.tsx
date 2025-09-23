import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const KwitansiCredit = () => {
  const { state } = useLocation();
  const { pelanggan: customer, cicilan, pesanan: order } = state || {};

  useEffect(() => {
    window.print();
  }, []);

  if (!customer || !order || !Array.isArray(cicilan) || cicilan.length === 0) {
    return <div className="p-6">Data tidak lengkap</div>;
  }

  const getTotal = () => {
    return cicilan.reduce((acc: number, curr: any) => acc + curr.tagihan, 0);
  };

  return (
    <div className="p-10 m-5 font-sans text-black text-sm leading-relaxed print:p-0 print:m-0">
      <h1 className="text-2xl text-primaryBrand font-bold mb-5">
        Kwitansi Pembayaran Cicilan
      </h1>
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-48 font-semibold">Nama Pelanggan</span>
            <span>: {customer.nama}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">No. Kwitansi</span>
            <span>: {customer.noKwitansi}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Metode Pembayaran</span>
            <span>: {customer.metode}</span>
          </div>
        </div>
        <div className="">
          <div className="flex">
            <span className="w-48 font-semibold">Id Pesanan</span>
            <span>: {order.id}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Nama Produk</span>
            <span>: {order.produk}</span>
          </div>
        </div>
      </div>

      <table className="border border-gray500 w-full text-sm text-left">
        <thead className=" border-b border-gray500 text-black-2 bg-gray500 text-xs">
          <tr className="text-center">
            <th className="py-2 px-3">Keterangan</th>
            <th className="py-2 px-3">Periode Cicilan</th>
            <th className="py-2 px-3">Tanggal Pembayaran</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Bayar Tagihan</th>
          </tr>
        </thead>
        <tbody>
          {cicilan.map((item: any, idx: number) => (
            <tr key={idx} className="border-b border-gray500 text-center">
              <td className="py-2 px-3">Cicilan Ke - {item.ke}</td>
              <td className="py-2 px-3">{item.periode}</td>
              <td className="py-2 px-3">{item.tanggal}</td>
              <td className="py-2 px-3">{item.status}</td>
              <td className="py-2 px-3">
                Rp {item.tagihan.toLocaleString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-16 mt-3">
        <p className="mx-12 px-3">
          <strong>Total :</strong> Rp {getTotal().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};

export default KwitansiCredit;
