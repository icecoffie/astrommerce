import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface SignupForm {
  username: string;
  password: string;
  confirmPassword: string;
  supplier_name: string;
  supplier_address: string;
  supplier_email: string;
  supplier_contact: string;
  image_path: File | null;
}

const SignUpSupp: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    password: '',
    confirmPassword: '',
    supplier_name: '',
    supplier_address: '',
    supplier_email: '',
    supplier_contact: '',
    image_path: null,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image_path: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi tidak cocok');
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('password', formData.password);
      data.append('supplier_name', formData.supplier_name);
      data.append('supplier_address', formData.supplier_address);
      data.append('supplier_email', formData.supplier_email);
      data.append('supplier_contact', formData.supplier_contact);
      if (formData.image_path) {
        data.append('image_path', formData.image_path);
      }

      await axios.post(`${VITE_API_URL}/addSuppliers`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Registrasi Berhasil, Mohon Tunggu Validasi!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      alert('Gagal mendaftar');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#3C50E0] mb-6">
          Daftar Akun Supplier
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="text"
            name="supplier_name"
            placeholder="Supplier Name"
            value={formData.supplier_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="text"
            name="supplier_address"
            placeholder="Supplier Address"
            value={formData.supplier_address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="email"
            name="supplier_email"
            placeholder="Supplier Email"
            value={formData.supplier_email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="tel"
            name="supplier_contact"
            placeholder="Supplier Contact"
            value={formData.supplier_contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 karakter)"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#3C50E0]"
          />

          <input
            type="file"
            name="image_path"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md text-sm text-gray-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-[#3C50E0] text-white font-semibold rounded-md hover:bg-[#2b3dba] transition"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Sudah Punya Akun ? {' '}
            <Link to="/auth/signin" className="text-primary">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpSupp;
