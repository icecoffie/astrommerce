import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
return (
    <footer className="bg-[#0578FF] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div>
                    <h1 className="text-2xl font-bold">Jalan.<span className="text-black">in</span></h1>
                </div>
                <div>      
                    <h2 className="text-lg font-semibold">Planning your next trip?</h2>
                    <p className="text-sm mb-4">
                        Subscribe to our newsletter, get the latest travel trends & deals!
                    </p>
                </div>
                <div className="flex items-center border-b border-white/40 pb-1">
                    <input
                    type="email"
                    placeholder="Enter Email ID"
                    className="bg-transparent flex-1 outline-none placeholder:text-white/70 text-white"
                    />
                    <button className="ml-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 4.6a1 1 0 001.02 0L20 8m-9 4v9"
                        />
                    </svg>
                    </button>
                </div>
            </div>

        {/* Bottom links */}
        <div className="flex justify-between mt-10 border-t border-white/20 pt-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <a href="#">About us</a>
                <a href="#">Mobile</a>
                <a href="#">Privacy</a>
                <a href="#">Terms of use</a>
                <a href="#">Career</a>
                <a href="#">Customer Service</a>
            </div>
            <div className="flex md:justify-end space-x-4">
                <a href="#" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Twitter">
                    <Twitter className="w-5 h-5" />
                </a>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
