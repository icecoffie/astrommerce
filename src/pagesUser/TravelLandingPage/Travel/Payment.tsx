
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const totalCharge = "₹3500.00";
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
type Person = {
    nama: string;
    umur: number;
    gender: "Male" | "Female" | "Other";
    kewarganegaraan: string;
};
type PaymentOption = {
    id: string;
    title: string;
    description: string;
    icon: string; 
};

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
const people: Person[] = [
    {
        nama: "Aisyah Rahmawati",
        umur: 21,
        gender: "Female",
        kewarganegaraan: "Indonesia",
    },
];
const paymentOptions: PaymentOption[] = [
    {
        id: "upi",
        title: "UPI Payment",
        description: "Pay instantly with UPI Apps",
        icon: "💳",
    },
    {
        id: "card",
        title: "Credit / Debit Card",
        description: "Visa, Mastercard, Amex, Rupay and more",
        icon: "💰",
    },
    {
        id: "paylater",
        title: "Paylater",
        description: "LazyPay, Simpl, ZestMoney, ICICI Paylater, HDFC Flexipay and more",
        icon: "🕒",
    },
    {
        id: "netbanking",
        title: "Net Banking",
        description: "We support all major banks",
        icon: "🏦",
    },
    {
        id: "wallets",
        title: "Mobile Wallets",
        description: "Amazonpay, Mobikwik, Payzapp, PayPal",
        icon: "📱",
    },
];
const charges = [
    { label: "Base Ticket Fare", value: "₹1000.00" },
    { label: "Total Travellers", value: "3" },
    { label: "CGST & SGST", value: "₹500.00" },
];

const Payment: React.FC = () => {
    return (
        <>
            <section className="bg-white w-full py-10 px-20 items-start space-y-4">   
                <h1 className="text-2xl font-semibold text-[#0578FF] ">Pay <span className="text-error">{totalCharge}</span> to confirm booking</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    <div className="space-y-3">
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
                                    <div>
                                        <h3 className="text-black-2">Traveller Detail</h3>
                                        <div className="flex flex-col">
                                                {people.map((person, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-around py-3 bg-gray-50"
                                                >
                                                    <p className="font-medium text-black">{person.nama}</p>
                                                    <p className="text-black">{person.umur}</p>
                                                    <p className="text-black">{person.gender}</p>
                                                    <p className="text-black">{person.kewarganegaraan}</p>
                                                </div>
                                                ))}
                                        </div>
                                        <div className="flex justify-between items-start text-black-2 py-5">
                                            <h3>E-Tickets will be sent to : </h3>
                                            <h3 className="font-semibold text-[14px]">John Woodspear@gmail.com</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))} 
                        <div className=" rounded-xl overflow-hidden">
                            <h2 className="text-lg font-semibold px-4 py-3">All Payment Options</h2>
                            <div className="py-5">
                                {paymentOptions.map((option) => (
                                <button
                                    key={option.id}
                                    className="w-full flex items-center justify-between px-4 py-5 border-b border-gray500 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="text-left">
                                        <p className="font-medium">{option.title}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 flex flex-col gap-3">
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
                                to='/Confirm'
                                className="relative mt-10 w-full text-center bg-[#0578FF] text-white font-medium px-5 py-3 rounded-lg hover:bg-blue-700 transition">
                                Pesan Sekarang
                            </Link>
                    </div>
                </div>

            </section>
        </>
    )
}
export default Payment;