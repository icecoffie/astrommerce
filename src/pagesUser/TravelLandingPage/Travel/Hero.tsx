
const Hero: React.FC = () => {
    return (
        <section className="bg-white">
            <div className="mx-auto grid md:grid-cols-2 items-center min-h-screen ">
                {/* Left Side */}
                <div className="space-y-6 px-10 ">
                    <span className="bg-[#0578FF] text-white px-4 py-2  rounded-full text-sm font-medium">
                        Jalan.<span className="text-black">in</span> Disini!
                    </span>
                    <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight text-black-2">
                        Buat Perjalanan mu <br/> Jadi Lebih Nyaman
                    </h1>
                    <p className="text-black-2 text-lg">
                        Sekarang kamu bisa booking Mini Bus untuk acara apapun! bisa pilih lokasi penjemputan dan juga bisa datang langsung ke kantor
                    </p>

                    {/* Form */}
                    <div className="justify-items-center">      
                        <div className="space-y-4 py-4 px-10 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="NDLS , New Delhi Railway Station"
                                    className="border-b border-b-gray-400 text-gray-600 px-4 py-3 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="e.g. Lokasi tujuan"
                                    className="border-b border-b-gray-400 text-gray-600 px-4 py-3 focus:outline-none  "
                                />
                            </div>
                            <input
                            type="date"
                            className="w-1/2 border-b border-b-gray-400 text-gray-600 px-4 py-3 focus:outline-none  "
                            />
                            <button  className="w-full bg-[#0578FF] text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
                            Search for trains
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block h-full">
                    <img
                        src="/hero.png"
                        alt="Hiace"
                        className="w-full h-screen object-cover"
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;
