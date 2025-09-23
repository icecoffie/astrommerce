    import { useLocation } from "react-router-dom";
    import { useEffect } from "react";

    const KwitansiCash = () => {
    const { state } = useLocation();
    const { pelanggan, pesanan } = state || {};

    useEffect(() => {
        window.print();
    }, []);

    if (!pelanggan || !Array.isArray(pesanan) || pesanan.length === 0) {
        return <div className="p-6">Data tidak lengkap</div>;
    }

    const getTotal = () => {
        return pesanan.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    };

    // Format tanggal ke format Indonesia (contoh: 1 Juni 2025)
    const getTanggalPembayaran = () => {
        const date = new Date();
        return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        });
    };

    return (
        <div className="p-10 m-5 font-sans text-black text-sm leading-relaxed print:p-0 print:m-0">
        <h1 className="text-2xl text-primaryBrand font-bold mb-5">Kwitansi Pembayaran Tunai</h1>
        <div className="mb-6 space-y-1">
            <div className="flex">
            <span className="w-48 font-semibold">Nama Pelanggan</span>
            <span>: {pelanggan.nama}</span>
            </div>
            <div className="flex">
            <span className="w-48 font-semibold">No. Kwitansi</span>
            <span>: {pelanggan.noKwitansi}</span>
            </div>
            <div className="flex">
            <span className="w-48 font-semibold">Metode Pembayaran</span>
            <span>: {pelanggan.metode}</span>
            </div>
            <div className="flex">
            <span className="w-48 font-semibold">Tanggal Pembayaran</span>
            <span>: {getTanggalPembayaran()}</span>
            </div>
        </div>

        <table className="border border-gray500 w-full text-sm text-left">
            <thead className="border-b border-gray500 bg-gray500 text-xs text-black">
            <tr className="text-center">
                <th className="py-2 px-3">Nama Produk</th>
                <th className="py-2 px-3">Harga Satuan</th>
                <th className="py-2 px-3">Jumlah</th>
                <th className="py-2 px-3">Subtotal</th>
            </tr>
            </thead>
            <tbody>
            {pesanan.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray500 text-center">
                <td className="py-2 px-3">{item.name}</td>
                <td className="py-2 px-3">Rp {item.price.toLocaleString("id-ID")}</td>
                <td className="py-2 px-3">{item.quantity}</td>
                <td className="py-2 px-3">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="flex justify-end my-6 mx-13">
            <p className="text-sm font-semibold px-2">
            Total Pembayaran : Rp {getTotal().toLocaleString("id-ID")}
            </p>
        </div>
        </div>
    );
    };

    export default KwitansiCash;
