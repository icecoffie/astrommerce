import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const AddSupplier: React.FC = () => {
  const [supplierName, setSupplierName] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSupplier = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !supplierName ||
      !supplierAddress ||
      !supplierEmail ||
      !supplierContact
    ) {
      Swal.fire({
          title: 'Peringatan',
          text: 'Mohon lengkapi semua field',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('supplier_name', supplierName);
    formData.append('supplier_address', supplierAddress);
    formData.append('supplier_email', supplierEmail);
    formData.append('supplier_contact', supplierContact);
    if (image) {
      formData.append('image_path', image);
    }

    try {
      const response = await axios.post(
        `${VITE_API_URL}/addSuppliers`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('✅ Supplier saved:', response.data);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Merek berhasil ditambahkan',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
        },
        buttonsStyling: false,
      });

      // Reset form
      setSupplierName('');
      setSupplierAddress('');
      setSupplierEmail('');
      setSupplierContact('');
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      console.error(
        '❌ Error saving supplier:',
        error.response?.data || error.message,
      );
    Swal.fire({
      title: 'Gagal!',
      text: 'Gagal menambahkan merek',
      icon: 'error',
      timer: 2000,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-primaryBrand text-white px-4 py-2 rounded hover:bg-primaryBrandSecond',
      },
      buttonsStyling: false,
    });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tambah Merek</h2>

      <form onSubmit={handleAddSupplier} className="mb-4">
        <label className="block font-medium">Nama Merek</label>
        <div className="space-y-2 mb-3">
          <label className="block text-lg">Unggah Logo Merek</label>
          {!preview ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 rounded p-2 w-full dark:bg-boxdark"
            />
          ) : (
            <div className="w-full">
              <img
                src={preview}
                alt="Preview Logo"
                className="w-full h-auto mb-2"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="text-blue-500 underline"
              >
                Ubah Foto
              </button>
            </div>
          )}
        </div>

        <input
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="Nama Merek"
          className="w-full border p-2 rounded mb-3"
        />
        <input
          value={supplierAddress}
          onChange={(e) => setSupplierAddress(e.target.value)}
          placeholder="Alamat Merek"
          className="w-full border p-2 rounded mb-3"
        />
        <input
          value={supplierEmail}
          onChange={(e) => setSupplierEmail(e.target.value)}
          placeholder="Email Merek"
          className="w-full border p-2 rounded mb-3"
          type="email"
        />
        <input
          value={supplierContact}
          onChange={(e) => setSupplierContact(e.target.value)}
          placeholder="Kontak Merek"
          className="w-full border p-2 rounded mb-3"
        />

        <button
          type="submit"
          className="border border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-50"
        >
          Tambah Merek
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;
