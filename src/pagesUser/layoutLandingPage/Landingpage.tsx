
import { Outlet} from 'react-router-dom';
import Sidebar from '../Header';   // Pastikan path-nya benar
import Footer from '../Footer';   // Pastikan path-nya benar

const Landingpage = () => {
  return (
    <>
      {/* Header */}
      <div className="flex gap-6"> {/* Tambahkan margin top agar tidak tertutup header */}
        {/* Sidebar */}
        <Sidebar  />

        {/* Konten utama */}
        <main className="bg-white rounded-md shadow-md flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Landingpage;
