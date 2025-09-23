    import { Link,useParams } from "react-router-dom";

    const Keranjang = () => {
    const { id } = useParams();
    const orders = [
        { id: "#96459761", status: "IN PROGRESS", date: "Dec 30, 2019 07:52", total: "$80 (5 Products)" },
        { id: "#71667167", status: "COMPLETED", date: "Dec 7, 2019 23:26", total: "$70 (4 Products)" },
        { id: "#95214362", status: "CANCELED", date: "Dec 7, 2019 23:26", total: "$2,300 (2 Products)" },
        { id: "#71667167", status: "COMPLETED", date: "Feb 2, 2019 19:28", total: "$250 (1 Products)" },
        { id: "#51746385", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$360 (2 Products)" },
        { id: "#51746385", status: "CANCELED", date: "Dec 4, 2019 21:42", total: "$220 (7 Products)" },
        { id: "#673971743", status: "COMPLETED", date: "Feb 2, 2019 19:28", total: "$80 (1 Products)" },
        { id: "#673971743", status: "COMPLETED", date: "Mar 20, 2019 23:14", total: "$160 (1 Products)" },
        { id: "#673971743", status: "COMPLETED", date: "Dec 4, 2019 21:42", total: "$1,500 (3 Products)" },
        { id: "#673971743", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$1,200 (19 Products)" },
        { id: "#673971743", status: "CANCELED", date: "Dec 30, 2019 05:18", total: "$1,500 (1 Products)" },
        { id: "#673971743", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$80 (1 Products)" },
    ];


    return (
        <div className="bg-[#ffff] font-inter px-10 py-6">

        <div className="flex items-start gap-6">
            <main className="flex-1">
            <div className="bg-white rounded-lg border p-6">
                <h2 className="font-semibold text-sm mb-4">PESANAN SAYA</h2>

                <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                    <tr>
                    <th className="px-6 py-3">ID PESANAN</th>
                    <th className="px-6 py-3">STATUS</th>
                    <th className="px-6 py-3">TANGGAL</th>
                    <th className="px-6 py-3">TOTAL</th>
                    <th className="px-6 py-3">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium">{order.id}</td>
                        <td className="px-6 py-3 font-semibold">
                        <span
                            className={`${order.status === "IN PROGRESS"
                                ? "text-blue-600"
                                : order.status === "COMPLETED"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                        >
                            {order.status}
                        </span>
                        </td>

                        <td className="px-6 py-3">{order.date}</td>
                        <td className="px-6 py-3">{order.total}</td>
                        <td className="px-6 py-3">
                        <Link to={`/PesananSaya/${order.id.replace("#", "")}`}>Tampilkan Rincian →</Link>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-center py-4 gap-2">
                <button className="w-8 h-8 rounded-full border text-blue-600 hover:bg-blue-50">←</button>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                    key={num}
                    className={`w-8 h-8 rounded-full border ${num === 1 ? "bg-blue-600 text-white" : "text-gray-600"
                        }`}
                    >
                    {String(num).padStart(2, "0")}
                    </button>
                ))}
                <button className="w-8 h-8 rounded-full border text-blue-600 hover:bg-blue-50">→</button>
                </div>
            </div>
            </main>
        </div>
        </div>
    );
    };

    export default Keranjang;
