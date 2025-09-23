
import { ChevronLeft, ChevronRight, Settings2} from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const tour = [
    {
        img : "/beach.jpg",
        title: 'Planning your holidays',
    },
    {
        img : "/bali.jpg",
        title: 'Train tourism packages',
    }
]
type TrainClass = {
    code: string;
    status: string;
    availability: string;
    fare: string | null;
    color: string;
};

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
    classes: TrainClass[];
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
        classes: [
            {
                code: "3A",
                status: "Tatkal",
                availability: "AVL - 046",
                fare: "₹1000",
                color: "bg-[#d1fae5] hover:bg-[#a7f3d0] border-[#10b981] text-[#047857]",
            },
            {
                code: "2A",
                status: "Tatkal",
                availability: "AVL - 008",
                fare: "₹2000",
                color: "bg-[#fef9c3] hover:bg-[#fef08a] border-[#eab308] text-[#a16207]",
            },
            {
                code: "1A",
                status: "Tatkal",
                availability: "WL - 36",
                fare: "₹3200",
                color:  "bg-[#fee2e2] hover:bg-[#fecaca] border-[#ef4444] text-[#b91c1c]",
            },
        ],
    },
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
        classes: [
            {
                code: "3A",
                status: "Tatkal",
                availability: "AVL - 046",
                fare: "₹1000",
                color: "bg-[#d1fae5] hover:bg-[#a7f3d0] border-[#10b981] text-[#047857]",
            },
            {
                code: "2A",
                status: "Tatkal",
                availability: "AVL - 008",
                fare: "₹2000",
                color: "bg-[#fef9c3] hover:bg-[#fef08a] border-[#eab308] text-[#a16207]",
            },
            {
                code: "1A",
                status: "Tatkal",
                availability: "WL - 36",
                fare: "₹3200",
                color:  "bg-[#fee2e2] hover:bg-[#fecaca] border-[#ef4444] text-[#b91c1c]",
            },
        ],
    },
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
        classes: [
            {
                code: "3A",
                status: "Tatkal",
                availability: "AVL - 046",
                fare: "₹1000",
                color: "bg-[#d1fae5] hover:bg-[#a7f3d0] border-[#10b981] text-[#047857]",
            },
            {
                code: "2A",
                status: "Tatkal",
                availability: "AVL - 008",
                fare: "₹2000",
                color: "bg-[#fef9c3] hover:bg-[#fef08a] border-[#eab308] text-[#a16207]",
            },
            {
                code: "1A",
                status: "Tatkal",
                availability: "WL - 36",
                fare: "₹3200",
                color:  "bg-[#fee2e2] hover:bg-[#fecaca] border-[#ef4444] text-[#b91c1c]",
            },
        ],
    },
];



const TrainsList: React.FC = () => {
    const today = new Date();
    
    const [startDate, setStartDate] = useState (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay());
        return d;
    });

    const [selectedDate, setSelectedDate] = useState<Date>(today);
        const getWeekDates = () => {
            const week: Date[] = [];
            for (let i = 0; i < 9; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            week.push(d);
            }
            return week;
        };

        const prevWeek = () => {
            const newStart = new Date(startDate);
            newStart.setDate(startDate.getDate() - 7);
            setStartDate(newStart);
        };

        const nextWeek = () => {
            const newStart = new Date(startDate);
            newStart.setDate(startDate.getDate() + 7);
            setStartDate(newStart);
        };
    return (
        <>
            <section className="bg-[#F5F5F5] w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 py-10 px-20 items-start">   
                <div className="space-y-5 mr-5">
                    <h1 className="text-2xl text-[#0578FF] font-semibold">Your Search Results</h1>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="NDLS , New Delhi Railway Station"
                                className="border-b border-b-gray500 bg-[#F5F5F5]  text-gray-600 px-4 py-3 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="e.g. Lokasi tujuan"
                                className="border-b border-b-gray500 bg-[#F5F5F5]  text-gray-600 px-4 py-3 focus:outline-none  "
                            />
                        </div>
                        <button className="w-full bg-[#0578FF] text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
                            Search for trains
                        </button>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={prevWeek}
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                        >
                            <ChevronLeft className="w-7 h-7 text-[#0578FF]" />
                        </button>

                        <div className="flex space-x-2">
                            {getWeekDates().map((date) => {
                            const dayName = daysOfWeek[date.getDay()];
                            const dayNum = date.getDate();
                            const isSelected = date.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                key={date.toDateString()}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center px-3 py-2 rounded-lg shadow-sm text-sm font-medium transition
                                    ${
                                    isSelected
                                        ? "bg-[#0578FF] text-white"
                                        : "bg-white text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                <span>{dayName}</span>
                                <span>{dayNum}</span>
                                </button>
                            );
                            })}
                        </div>

                        <button
                            onClick={nextWeek}
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                        >
                            <ChevronRight className="w-7 h-7 text-[#0578FF]" />
                        </button>
                    </div>
                    {tour.map((service, index) => (
                        <div
                        key={index}
                        className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer 
                            ${index === 0 ? "sm:col-span-2" : ""}`}
                        >
                        <img
                            src={service.img}
                            alt={service.title}
                            className={`w-full ${index === 0 ? "h-40" : "h-40"} object-cover group-hover:scale-105 transition duration-300 relative z-0`}
                        />
                        <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/60 transition duration-300 flex flex-col justify-center p-4">
                            <h3 className="text-white text-lg font-semibold flex items-center gap-2">{service.title}  <ChevronRight className="w-5 h-5 items-center"/></h3>
                        </div>
                        </div>
                    ))}
                    <p className="text-black text-justify text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et olore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et olore magna aliqua</p>
                </div>

                <div className="space-y-5 ">
                    <div className="flex justify-between items-center border-b border-gray-400 py-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl text-black font-medium">Available Trains</h1>
                            <p className="text-gray-500 text-[10px]">5 Trains available</p>
                        </div>
                        <Settings2 className="text-[#0578FF] h-7 w-7" />
                    </div>
                    <div className="space-y-3 flex flex-col gap-3 max-h-[1080px] overflow-y-auto pr-2">
                    {trainData.map((item, index) => (
                        <div
                        key={index}
                        className="py-3 px-5 rounded-lg w-full bg-white shadow-md"
                        >
                            <div className="space-y-4">
                                {/* Nama kereta */}
                                <h2 className="text-[15px] font-medium text-black">
                                {item.trainNumber} – {item.trainName}
                                </h2>

                                {/* Runs on + link */}
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-800">Runs on</p>
                                        <div className="border rounded-lg py-1 px-3 border-[#0578FF] text-black">
                                        {item.runsOn}
                                        </div>
                                    </div>
                                    <Link
                                        to="/booking"
                                        className="text-[15px] text-[#0578FF] hover:text-blue-900"
                                    >
                                        View train time table
                                    </Link>
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
                                <div className="flex gap-3">
                                    {item.classes.map((cls, idx) => (
                                    <div
                                    key={idx}
                                    className={`flex items-center border rounded-lg p-3 ${cls.color}`}
                                    >
                                        <div className="flex justify-between gap-5 items-center"> 
                                            <div className="text-left">
                                                <h5 className="font-bold text-base">{cls.code}</h5>
                                                <p className="text-base">{cls.status}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[12px]">{cls.availability}</p>
                                                {cls.fare && <p className="font-medium text-base">{cls.fare}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default TrainsList;