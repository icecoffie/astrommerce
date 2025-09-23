import { FaRegPlusSquare } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type TrainStation = {
    date: string;
    time: string;
    stationCode: string;
    stationName: string;
};

type TrainData = {
    trainNumber: string;
    trainName: string;
    runsOn: string;
    from: TrainStation;
    to: TrainStation;
    duration: string;
}

const trainData: TrainData[] = [
    {
        trainNumber: "12430",
        trainName: "Ndls Lko Ac Sf",
        runsOn: "Everyday",
        from: {
            date: "Nov 16",
            time: "11:25 pm",
            stationCode: "NDLS",
            stationName: "New Delhi",
        },
        to: {
            date: "Nov 17",
            time: "7:25 am",
            stationCode: "LKO",
            stationName: "Lucknow",
        },
        duration: "8 hours",
    },
];
const charges = [
    { label: "Base Ticket Fare", value: "₹1000.00" },
    { label: "Total Travellers", value: "3" },
    { label: "CGST & SGST", value: "₹500.00" },
];

const totalCharge = "₹3500.00";

const Booking: React.FC = () => {
    return(
        <>
            <section className="bg-white w-full py-10 px-20 items-start space-y-4">   
                <h1 className="text-2xl font-semibold text-[#0578FF] ">Review your booking</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ">
                    <div className="space-y-4">
                        <div className="border space-y-3 border-gray500 rounded-lg py-10 px-5">
                            <div className=" flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-black-2 font-semibold">Traveller Details</h2>
                                    <span className="text-[10px]">As per IRCTC Guidelines, you can book up to 4 travellers at once</span>
                                </div>
                                <FaRegPlusSquare className="w-5 h-5 text-[#0578FF] "/>
                            </div>
                            <div className="bg-[#a1cbfc] rounded-lg py-2 px-3 my-5 flex justify-between items-center">
                                <h5 className="font-medium text-base text-black-2 ">1. John Woodspear</h5>
                                <div className="flex">
                                    <button
                                            className="p-2 bg-blue-500 hover:bg-blue-600 text-primaryBrand rounded-lg flex items-center"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="p-2 bg-red-500 hover:bg-red-600 text-error rounded-lg flex items-center"
                                        >
                                            <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className=" space-y-5">
                                <h5>Traveller Details</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nama"
                                        className="border-b border-b-gray500   text-gray-600 px-4 py-3 focus:outline-none"
                                    />
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Umur"
                                            className="border-b border-b-gray500 text-gray-600 px-4 py-3 focus:outline-none  "
                                        />
                                        <select
                                            className="border-b border-b-gray500 text-gray-600 px-4 py-3 focus:outline-none w-full"
                                            >
                                            <option value="">Jenis Kelamin</option>
                                            <option value="male">Perempuan</option>
                                            <option value="female">Laki-Laki</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-nowrap gap-3">
                                    <input
                                        type="text"
                                        placeholder="Kewarganegaraan"
                                        className="w-full border-b border-b-gray500   text-gray-600 px-4 py-3 focus:outline-none  "
                                    />
                                    <button className=" bg-[#0578FF] text-white font-medium py-1 px-5 rounded-lg hover:bg-blue-700 transition">
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border space-y-3 border-gray500 rounded-lg py-10 px-5">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-black-2 font-semibold">IRCTC Login</h2>
                                    <span className="text-[10px]">Password is required later to complete booking</span>
                                </div>
                                <div className="flex flex-nowrap gap-3">
                                    <input
                                        type="text"
                                        placeholder="Masukkan ID Pengguna IRCTC"
                                        className="w-full border-b border-b-gray500   text-gray-600 px-4 py-3 focus:outline-none  "
                                    />
                                    <button className=" bg-[#0578FF] text-white font-medium px-5 rounded-lg hover:bg-blue-700 transition">
                                        Verifikasi
                                    </button>
                                </div>
                                <div className="flex flex-nowrap gap-4 text-[#0578FF] px-4">
                                    <Link to="/" className="text-[14px]">Buat id IRCTC</Link>
                                    <Link to="/" className="text-[14px]">Lupa id pengguna?</Link>
                                </div>
                        </div>
                        <div className="border space-y-3 border-gray500 rounded-lg py-10 px-5">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-black-2 font-semibold">Contact Details</h2>
                                    <span className="text-[10px]">Your ticket info will be sent here</span>
                                </div>
                                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Mobile Number"
                                        className="w-full border-b border-b-gray500   text-gray-600 px-4 py-3 focus:outline-none  "
                                    />
                                    <input
                                        type="text"
                                        placeholder="Email ID"
                                        className="w-full border-b border-b-gray500   text-gray-600 px-4 py-3 focus:outline-none  "
                                    />
                                </div>
                        </div>
                    </div>
                    <div className="space-y-3 flex flex-col gap-3">
                        {trainData.map((item, index) => (
                        <div
                        key={index}
                        className="py-3 px-5 rounded-lg w-full bg-[#0578FF] bg-opacity-10 shadow-md"
                        >
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-black-2">Boarding Details</h3>

                                {/* Runs on + link */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[15px] font-medium text-black">
                                    {item.trainNumber} – {item.trainName}
                                    </h2>
                                    <span
                                        className="text-[15px] text-[#0578FF] font-semibold hover:text-blue-900"
                                    >
                                        Class 2A & Tatkal Quota
                                    </span>
                                </div>

                                {/* Info keberangkatan */}
                                <div className="flex justify-between items-center">
                                    <div className="text-left text-black text-[14px]">
                                        <p>{item.from.date}</p>
                                        <p className="font-semibold">{item.from.time}</p>
                                        <p>
                                        {item.from.stationCode}, {item.from.stationName}
                                        </p>
                                    </div>
                                    {/* Garis  */}
                                    <div className="relative flex items-center justify-center my-6">
                                        <div className="w-[240px] h-[1px] bg-gray500"></div>
                                        <span className="absolute bottom-0 px-2 text-sm text-black">
                                            {item.duration}
                                        </span>
                                        <div className="absolute left-0 w-2 h-2 bg-gray500 rounded-full -translate-y-1/12"></div>
                                        <div className="absolute right-0 w-2 h-2 bg-gray500 rounded-full -translate-y-1/12"></div>
                                    </div>

                                    {/* Info tujuan */}
                                    <div className="text-right text-black text-[14px]">
                                        <p>{item.to.date}</p>
                                        <p className="font-semibold">{item.to.time}</p>
                                        <p>
                                            {item.to.stationCode}, {item.to.stationName}
                                        </p>
                                    </div>
                                </div>
                                    <button className="border border-[#0578FF] py-2 px-3 rounded-lg text-[#0578FF] hover:border-[#0263d1] hover:text-[#0263d1]">Change Boarding Station</button>
                            </div>
                        </div>
                        ))}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray500 w-full mx-auto">
                            <h2 className="text-xl font-bold text-black-2 mb-6">
                                Bill details
                            </h2>
                            <div className="space-y-4 text-base">
                                {charges.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <p className="text-gray-500">{item.label}</p>
                                    <p className="font-semibold text-gray-700">{item.value}</p>
                                </div>
                                ))}
                            </div>

                            <hr className="my-6 border-dashed border-gray-300" />

                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-black-2">Total Charge</h3>
                                <p className="text-lg font-bold text-black-2">{totalCharge}</p>
                            </div>
                        </div>
                        <Link
                            to='/travelPayment'
                            className="text-center bg-[#0578FF] text-white font-medium px-5 py-3 rounded-lg hover:bg-blue-700 transition">
                            Booking Sekarang
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Booking;