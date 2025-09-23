    import { Link, useNavigate } from 'react-router-dom';
    import React from 'react';
    import CardUmroh from './CardUmroh';

    type FasilitasType = {
    id: number;
    icon: string;
    title: string;
    description: string;
    };
    type BenefitType = {
    id: number;
    icon: string;
    description: string;
    };

    // Data dummy benefit
    const benefits: BenefitType[] = [
    {
        id: 1,
        icon: './images/umroh/Flight.svg',
        description: 'Terbang Jakarta - Jeddah PP',
    },
    {
        id: 2,
        icon: './images/umroh/Hostel.svg',
        description: 'Hotel Bintang 5 Dekat Masjidil Haram',
    },
    {
        id: 3,
        icon: './images/umroh/Visas.svg',
        description: 'Visa Umroh',
    },
    ];

    // Data fasilitas dalam array
    const fasilitasList: FasilitasType[] = [
    {
        id: 1,
        icon: './images/umroh/keamanan.svg',
        title: 'Keamanan',
        description: 'Kita siap sedia untuk memberikan keamanan selama 24 jam',
    },
    {
        id: 2,
        icon: './images/umroh/konseling.svg',
        title: 'Konseling',
        description:
        'Memberikan konseling untuk membimbing jemaah melaksanakan ibadah umrah',
    },
    {
        id: 3,
        icon: './images/umroh/kendaraan.svg',
        title: 'Kendaraan',
        description:
        'Menyediakan Bus atau Mini Bus untuk para jemaah pada saat di Saudi',
    },
    {
        id: 4,
        icon: './images/umroh/kesehatan.svg',
        title: 'Kesehatan',
        description: 'Layanan kesehatan gratis untuk para jemaah dan siap 24 Jam',
    },
    {
        id: 5,
        icon: './images/umroh/hotel.svg',
        title: 'Penginapan',
        description:
        'Penginapan Hotel bintang 5 untuk semua kostumer dan dekat dengan masjid',
    },
    {
        id: 6,
        icon: './images/umroh/makanan.svg',
        title: 'Makanan',
        description:
        'Sudah termasuk makan dan minum pada saat berangkat maupun sampai tujuan',
    },
    {
        id: 7,
        icon: './images/umroh/member.svg',
        title: 'Member',
        description:
        'Mempunyai kartu member Embun Travel untuk menikmati penawaran menarik',
    },
    {
        id: 8,
        icon: './images/umroh/vaksin.svg',
        title: 'Vaksin',
        description:
        'Vaksin Miningitis gratis untuk para jemaah agar sistem imun tetap kuat.',
    },
    ];

    const LandingPageUmroh: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#ffff] min-h-screen">
        <nav className="flex flex-row max-w-6xl mx-auto justify-between items-center pb-12 px-5">
        </nav>

        {/* */}
        <section
            id="beranda"
            className="hero max-w-6xl mx-auto py-5 px-5 lg:mt-auto"
        >
            {' '}
            {/* Tambahkan id="beranda" di sini */}
            <div className="flex md:flex-row gap-y-10 flex-col items-center justify-between">
            <div className="flex flex-col gap-y-10 md:basis-2/4 lg:basis-3/6">
                <div className="small-badge w-fit px-2 flex flex-row rounded-full bg-white items-center">
                <p className="text-base font-semibold text-indigo-950">
                    No.1 in Indonesia
                </p>
                </div>

                <div className="flex gap-y-2 flex-col">
                <h1 className="text-indigo-950 font-['className_Display'] text-4xl lg:text-[64px] leading-none">
                    Buat Perjalanan Umroh mu Aman dan Nyaman bersama Embun Travel
                </h1>
                <p className="text-base leading-loose text-grey-500">
                    Mitra terpercaya dalam memfasilitasi perjalanan Ibadah ke kota
                    suci <br /> Mekkah dan Madinah.
                </p>
                </div>

                <div className="flex gap-y-10 items-center">
                <a
                    href="#paket-umroh" // Mengarahkan ke bagian paket umroh
                    className="w-full lg:w-fit text-center bg-[#F5BE2F] text-white py-4 px-10 rounded-xl font-semibold hover:bg-white hover:text-[#F5BE2F] hover:border hover:border-[#F5BE2F] transition duration-300"
                >
                    Cek Jadwal
                </a>
                </div>
            </div>

            <div className="flex flex-row items-center">
                <img
                src="./images/umroh/hero-1.png"
                alt="ilustration-header"
                className="h-[550px]"
                />
            </div>
            </div>
        </section>
        {/* */}

        {/* */}
        <section id="tentang-kami" className="aboutus w-full bg-[#E6F6FF]">
            <div className="max-w-6xl mx-auto py-12 px-5 bg-[#E6F6FF] min-h-screen">
            <div className="flex md:flex-row gap-y-10 flex-col items-center justify-between">
                <div className="flex flex-row items-center flex-1">
                <img
                    src="./images/umroh/hero-2.png"
                    alt="ilustration-header w-full"
                />
                </div>
                <div className="flex flex-col flex-1 gap-y-10">
                <div className="flex gap-y-2 flex-col">
                    <h1 className="text-indigo-950 font-['className_Display'] text-4xl lg:text-[70px] leading-none">
                    Agen Travel Umroh Terpercaya <br />
                    </h1>
                    <p className="text-base leading-loose text-grey-500">
                    Kami siap mendampingi perjalanan ibadah Anda ke Tanah Suci
                    dengan layanan yang profesional, amanah, dan nyaman. Siap
                    ibadah, siap hidup berkah.
                    </p>
                </div>
                <div className="flex flex-col gap-y-3">
                    {benefits.map((benefit) => (
                    <div
                        key={benefit.id}
                        className="card-benefits flex flex-row rounded-2xl bg-white p-5 items-center gap-x-3"
                    >
                        <img src={benefit.icon} alt={`icon-${benefit.id}`} />
                        <div className="flex flex-col">
                        <p className="text-base leading-loose text-grey-500">
                            {benefit.description}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="flex flex-row gap-x-5 gap-y-10 items-center">
                    <a
                    href="#paket-umroh" // Mengarahkan ke bagian paket umroh
                    className="w-full lg:w-fit text-center bg-[#F5BE2F] text-white py-4 px-10 rounded-xl font-semibold hover:bg-white hover:text-[#F5BE2F] hover:border hover:border-[#F5BE2F] transition duration-300"
                    >
                    Cek Jadwal
                    </a>
                    <a
                    href="#"
                    className="w-full lg:w-fit text-center border-2 border-indigo-950 text-indigo-950 py-4 px-10 rounded-xl font-semibold hover:bg-indigo-950 hover:text-white transition duration-300"
                    >
                    Pelajari Lebih Lanjut
                    </a>
                </div>
                </div>
            </div>
            </div>
        </section>
        {/* */}

        {/*Card Umroh  */}
        <section id="paket-umroh" className="showcases mx-auto py-12 px-5 ">
            <div className="flex flex-col gap-y-7">
            <div className="flex gap-y-2 flex-col text-center">
                <h1 className="text-indigo-950 font-['Class_Display'] text-5xl">
                Paket Umroh Terbaik
                </h1>
                <p className="text-base leading-loose text-grey-500">
                Pilih paket umroh yang kamu inginkan dan nikmati <br /> kenyamanan
                dan keamanan perjalanan bersama kami!
                </p>
            </div>
            <div className="flex flex-row flex-wrap gap-5 justify-center">
                <CardUmroh />
            </div>
            </div>
        </section>
        {/*Card Umroh */}

        {/* <-- Service -->       */}
        <section id="fasilitas" className="services w-full bg-[#E6F6FF]">
            <div className="max-w-6xl mx-auto py-12 px-5">
            <div className="flex gap-y-2 flex-col text-center">
                <h1 className="text-indigo-950 font-['Class_Display'] text-5xl">
                Fasilitas Yang Kami Tawarkan
                </h1>
                <p className="text-base leading-loose text-grey-500">
                Fasilitas yang sudah termasuk bila membeli paket umroh di Embun
                Travel!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fasilitasList.map((item) => (
                    <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4"
                    >
                    <img src={item.icon} className="w-10 h-10" alt={item.title} />
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-800">
                        {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>

        {/* */}
        <section id="galeri" className="showcases max-w-6xl mx-auto py-12 px-5 ">
            <div className="flex gap-y-2 flex-col text-center">
            <h1 className="text-indigo-950 font-['Class_Display'] text-5xl">
                Galeri Embun Travel
            </h1>
            <p className="text-base leading-loose text-grey-500">
                Pilih paket umroh yang kamu inginkan dan nikmati <br /> kenyamanan
                dan keamanan perjalanan bersama kami!
            </p>
            </div>
            <div className="mt-10 grid grid-cols-3 grid-rows-2 gap-4">
            <div className="row-span-2 col-span-1">
                <img
                src="./images/umroh/Gallery1.jpg"
                alt="img1"
                className="w-full h-full object-cover rounded-xl"
                />
            </div>

            <div>
                <img
                src="./images/umroh/Gallery2.jpg"
                alt="img2"
                className="w-full h-full object-cover rounded-xl"
                />
            </div>
            <div>
                <img
                src="./images/umroh/Gallery2.jpg"
                alt="img3"
                className="w-full h-full object-cover rounded-xl"
                />
            </div>
            <div>
                <img
                src="./images/umroh/Gallery2.jpg"
                alt="img2"
                className="w-full h-full object-cover rounded-xl"
                />
            </div>
            <div>
                <img
                src="./images/umroh/Gallery2.jpg"
                alt="img3"
                className="w-full h-full object-cover rounded-xl"
                />
            </div>
            </div>
        </section>

        {/* */}
        <section
            id="footer"
            className="footer absolute w-full -mt-[230px] bg-[#1163BD] -z-10"
        >
            <div className="grid grid-cols-4 md:grid-cols-5 max-w-6xl mx-auto py-10 pt-[330px] gap-x-10">
            <div className="company col-span-1 md:col-span-2 flex flex-col gap-y-7">
                <img
                src="./images/umroh/logo-umrah.png"
                alt="logo-company"
                className="w-[64px] bg-white rounded-xl p-1"
                />
                <p className="text-base text-white leading-loose">
                Agent Travel Pertama di Indonesia dengan <br />
                pelayanan terbaik untuk para jemaah
                <br /> yang ingin ibadah umrah sambil healing
                </p>
            </div>
            <div className="sitemap-products flex flex-col gap-y-7">
                <h3 className="text-white font-bold text-xl">Embun Umroh</h3>
                <ul className="flex flex-col gap-y-3">
                <li>
                    <a href="#tentang-kami" className="text-base text-white">
                    Tentang Kami
                    </a>
                </li>
                <li>
                    <a href="#fasilitas" className="text-base text-white">
                    Fasilitas
                    </a>
                </li>
                <li>
                    <a href="#galeri" className="text-base text-white">
                    Galeri
                    </a>
                </li>
                </ul>
            </div>
            <div className="sitemap-resource flex flex-col gap-y-7">
                <h3 className="text-white font-bold text-xl">Paket Umrah</h3>
                <ul className="flex flex-col gap-y-3">
                <li>
                    <a href="#paket-umroh" className="text-base text-white">
                    Umroh Basic
                    </a>
                </li>
                <li>
                    <a href="#paket-umroh" className="text-base text-white">
                    Umroh Silver
                    </a>
                </li>
                <li>
                    <a href="#paket-umroh" className="text-base text-white">
                    Umroh Gold
                    </a>
                </li>
                </ul>
            </div>
            <div className="sitemap-company flex flex-col gap-y-7">
                <h3 className="text-white font-bold text-xl">Kantor Kami</h3>
                <ul className="flex flex-col gap-y-3">
                <li>
                    <a href="#" className="text-base text-white">
                    Indonesia
                    </a>
                </li>
                <li>
                    <a href="#" className="text-base text-white">
                    Kontak Kami
                    </a>
                </li>
                <li>
                    <a href="#" className="text-base text-white">
                    Email Kami
                    </a>
                </li>
                </ul>
            </div>
            </div>
            <div className="max-w-6xl mx-auto text-center py-10 ">
            <p className="text base text-white">
                All Rights Reserved • Copyright Weserve by Embun Umroh 2025 in
                Pamulang
            </p>
            </div>
        </section>
        {/* */}
        </div>
    );
    };

    export default LandingPageUmroh;
