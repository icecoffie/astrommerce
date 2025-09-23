import { Link } from 'react-router-dom';
const Header: React.FC = () => {
    return(
        <>
            <nav className="sticky top-0 bg-white shadow-sm ">
                <div className=" flex justify-between items-center px-20 py-5">
                    <a href="" className="text-[#0578FF] font-semibold text-[20px]">Lab<span className="text-black">Shar'e</span></a>
                    <div className=' flex justify-center items-center gap-7'>
                        <Link to="/" className='text-black  hover:text-blue-700 text-sm'>My Booking</Link>
                        <Link to="/" className=' text-[#0578FF] hover:text-blue-800 text-sm'>Login / Sign in</Link>
                    </div>
                </div>

            </nav>
        </>
    )
}

export default Header;