import { FC } from "react";
import { CheckCircle } from "lucide-react";

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
        nama: "Chae Soobin",
        umur: 21,
        gender: "Female",
        kewarganegaraan: "Indonesia",
    },
];
const TicketConfirmation: FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <CheckCircle className="w-16 h-16 text-success mb-4" />

        {/* Success Message */}
        <h1 className="text-xl font-semibold text-success">
            Congratulations! You have successfully booked tickets
        </h1>
        <p className="text-gray-500 text-sm mb-6">
            please carry SMS / Email sent to your contact details, along with a relevant ID proof while travelling
        </p>

        {/* Ticket Details Card */}
        <div>
            {trainData.map((item, index) => (
                <div
                key={index}
                className="py-3 px-5 rounded-lg w-full bg-[#0578FF] bg-opacity-10 shadow-md"
                >
                    <div className="space-y-4">
                    <div className=" flex justify-between">
                        <h5 className="text-[14px]">PNR No : 1234567890</h5>
                        <h5 className="text-[14px]">Transaction ID : 351511859256378</h5>
                    </div>

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
                        <div className="flex justify-between items-start text-black-2">
                                <h3>E-Tickets will be sent to : </h3>
                                <h5 className="font-semibold text-[13px]">John Woodspear@gmail.com</h5>
                        </div>
                        <div>
                            <h3 className="text-black-2">Traveller Detail</h3>
                            <div className="flex flex-col">
                                    {people.map((person, index) => (
                                    <div
                                        key={index}
                                        className="py-3 bg-gray-50"
                                    >
                                        <p className="font-medium text-black">{person.nama}</p>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-black">Age : {person.umur}</p>
                                                <p className="text-black">Gender {person.gender}</p>
                                            </div>
                                            <div>
                                                <p className="text-black font-semibold text-[13px]">Booking Status : Confirmed (CNF)</p>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))} 
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-xs text-gray-500 flex gap-4">
            <a href="#">Cancellation Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Travel Insurance</a>
        </div>
        </div>
    );
};

export default TicketConfirmation;
