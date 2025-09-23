import { Outlet} from 'react-router-dom';
import Header from './Travel/Header';   
import Footer from './Travel/Footer';  

const layout = () => {
    return (
    <>
    {/* Header */}
    <Header  />
    <div className="flex gap-6"> 
        {/* Konten utama */}
        <main className="bg-white shadow-md flex-1">
            <Outlet />
        </main>
    </div>
    {/* Footer */}
    <Footer />
    </>
);
};

export default layout;