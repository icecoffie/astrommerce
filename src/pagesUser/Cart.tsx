// Cart.tsx — Responsive Version (Mobile + Desktop)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type CartItem = {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
};

const initialCart: CartItem[] = [
  { id: 1, name: 'Tray Table', color: 'Black', price: 19.19, quantity: 2, image: '/images/product1.png' },
  { id: 2, name: 'Tray Table', color: 'Red', price: 19.19, quantity: 2, image: '/images/product2.png' },
  { id: 3, name: 'Table lamp', color: 'Gold', price: 39.0, quantity: 2, image: '/images/product3.png' },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [shippingType, setShippingType] = useState<'free' | 'express' | 'pickup'>('free');

  const handleQtyChange = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let shippingCost = 0;
  if (shippingType === 'express') shippingCost = 15;
  if (shippingType === 'pickup') shippingCost = subtotal * 0.21;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen font-sans text-black-2 my-15">
      {/* Header */}
      <main className="max-w-7xl mx-auto px-4 md:px-12">
        <h1 className="text-center text-3xl font-bold mt-6 mb-4">Keranjang</h1>

         {/* Step Bar */}
        <div className="flex justify-between pb-6 text-center text-xs font-medium">
          {["Keranjang", "Detail Pembayaran", "Pesanan Selesai"].map((label, idx) => (
            <div key={idx} className="flex-1 relative py-2">
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center
                  ${idx === 0 ? 'bg-primaryBrandSecond' : 'bg-gray'} text-subtleText`}
              >
                {idx === 0 ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <p className={
                `${idx === 0 ? 'text-[black] font-medium' : 'text-gray-500 text-xs font-medium'}`
              }>{label}</p>
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-sm
                ${idx === 0 ? 'bg-primaryBrand' : ''}`}></div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12 justify-center items-center">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold mb-2 md:sr-only">Produk</h2>
            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold leading-5">{item.name}</p>
                        <p className="text-subtleText text-xs">Warna : {item.color}</p>
                      </div>
                      <p className="font-semibold text-sm">Rp.{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex border rounded overflow-hidden w-fit">
                        <button onClick={() => handleQtyChange(item.id, -1)} className="px-3">−</button>
                        <span className="px-3">{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, 1)} className="px-3">+</button>
                      </div>
                      <button className="text-error text-xs">×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-4 font-semibold">Produk</th>
                    <th className="p-4 text-center font-semibold">Jumlah</th>
                    <th className="p-4 text-center font-semibold">Harga</th>
                    <th className="p-4 text-right font-semibold">Total Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4 flex gap-4 items-center">
                        <img src={item.image} className="w-16 h-16 object-cover rounded border" />
                        <div>
                          <p className="py-1 font-semibold">{item.name}</p>
                          <p className="text-xs text-black-2">Warna : {item.color}</p>
                          <button className="text-xs text-error">× Hapus </button>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex border rounded overflow-hidden">
                          <button onClick={() => handleQtyChange(item.id, -1)} className="flex justify-center px-2 py-2 h-6 w-6 items-center bg-primaryBrand hover:bg-primaryBrandSecond text-white">−</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item.id, 1)} className="flex justify-center px-2 py-2 h-6 w-6 items-center bg-primaryBrand hover:bg-primaryBrandSecond text-white">+</button>
                        </div>
                      </td>
                      <td className="p-4 text-center">${item.price.toFixed(2)}</td>
                      <td className="p-4 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border rounded-lg p-6 space-y-4 text-sm">
            <h3 className="font-semibold text-base">Detail Keranjang</h3>
            <div className="space-y-2">
              {['Gratis', 'expres', 'pickup'].map((type) => (
                <label
                  key={type}
                  className={`flex justify-between items-center border rounded px-4 py-2 ${shippingType === type ? 'bg-gray-100' : ''}`}
                >
                  <input type="radio" name="Pengiriman" checked={shippingType === type} onChange={() => setShippingType(type as any)} />
                  <span className="ml-2 flex-1 capitalize">{type === 'pickup' ? 'Ambil di Tempat' :  `Pengiriman ${type}`}</span>
                  <span>{type === 'Gratis' ? 'Rp. 0.00' : type === 'express' ? '+Rp.15.00' : '% 21.00'}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between pt-2 border-t text-xs">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Pengiriman</span>
              <span>Rp. {shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm pb-2">
              <span>Total Harga </span>
              <span>Rp. {total.toFixed(2)}</span>
            </div>
            <Link to="/Checkout">
            <button className="w-full bg-primaryBrand hover:bg-primaryBrandSecond text-white text-sm py-2.5 rounded">
              Pembayaran
            </button>
          </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;