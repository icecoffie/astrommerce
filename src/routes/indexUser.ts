import { lazy } from 'react';

const Order = lazy(() => import('../pagesUser/DashboardUser/Pesanan'));
const DetailsOrder = lazy(() => import('../pagesUser/DashboardUser/DetailsPesanan'));
const Cart = lazy(() => import('../pagesUser/DashboardUser/Keranjang'));
const Address= lazy(() => import('../pagesUser/DashboardUser/Alamat'));
const Settings= lazy(() => import('../pagesUser/DashboardUser/Pengaturan'));
const TransaksiCredit= lazy(() => import('../pagesUser/DashboardUser/DetailCicilan'));
const TransaksiCash= lazy(() => import('../pagesUser/DashboardUser/DetailCash'));


const coreRoutes = [
  {
    path: 'PesananSaya', 
    title: 'PesananSaya',
    component: Order,
  },
  {
    path: 'PesananSaya/:order_id/detailCredit', 
    title: 'detailCredit',
    component: TransaksiCredit,
  },
  {
    path: 'PesananSaya/:order_id/detailCash', 
    title: 'detailCash',
    component: TransaksiCash,
  },
  {
    path: 'PesananSaya/:order_id', 
    title: 'PesananSaya',
    component: DetailsOrder,
  },
  {
    path: 'Keranjang', 
    title: 'Keranjang',
    component: Cart,
  },
  {
    path: 'KartuAlamat', 
    title: 'KartuAlamat',
    component: Address,
  },
  {
    path: 'Pengaturan', 
    title: 'Pengaturan',
    component: Settings,
  },
];

export default coreRoutes;