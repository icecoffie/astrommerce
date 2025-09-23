import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface PrivateRouteProps {
  allowedRoles: string[];
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ambil role dari object user
        const role = res.data.role;
        setUserRole(role);
      } catch (err) {
        console.error('Gagal ambil data user', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
    else {
      setLoading(false);
      setError(true);
    }
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (error || !userRole || !allowedRoles.includes(userRole)) {
    Swal.fire({
      icon: 'error',
      title: 'Akses ditolak',
      text: 'Anda tidak memiliki izin untuk mengakses halaman ini',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      navigate('/', { replace: true });
    });
    return null; 
  }

  return <Outlet />;
};

export default PrivateRoute;
