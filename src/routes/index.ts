import { lazy } from 'react';

const OrderManagement = lazy(() => import('../pages/OrderManagement'));
const CustomerDetails = lazy(() => import('../pages/CustomerDetails'));
const Categories = lazy(() => import('../pages/Categories'));
const Transaction = lazy(() => import('../pages/Transaction'));
const TransactionUmroh = lazy(() => import('../pages/TransaksiUmroh'));
const DetailTransaksiCashUmroh = lazy(() => import('../pages/DetailTransaksiCashUmroh'));
const DetailTransaksiUmroh = lazy(() => import('../pages/DetailTransaksiUmroh'));
const AddProduct = lazy(() => import('../pages/AddProduct'));
const AddSupplier = lazy(() => import('../pages/AddSupplier'));
const Campaign = lazy(() => import('../pages/Campaign'));
const AddVariant = lazy(() => import('../pages/AddVariant'));
const AddCategories = lazy(() => import('../pages/AddCategories'));

const DetailTransaksiCredit = lazy(() => import('../pages/DetailTransaksiCredit'));
const DetailTransaksiCash = lazy(() => import('../pages/DetailTransaksiCash'));
const Settings = lazy(() => import('../pages/Settings'));
const ApplyCredit = lazy(() => import('../pages/ApplyCredit'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));

const coreRoutes = [
  {
    path: '/admin/OrderManagement',
    title: 'OrderManagement',
    component: OrderManagement,
  },
  {
    path: '/admin/CustomerDetails',
    title: 'CustomerDetails',
    component: CustomerDetails,
  },
  {
    path: '/admin/Categories',
    title: 'Categories',
    component: Categories,
  },
  {
    path: '/admin/ProductDetail/:id',
    title: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/admin/Transaction',
    title: 'Transaction',
    component: Transaction,
  },
  {
    path: '/admin/TransaksiUmroh',
    title: 'TransaksiUmroh',
    component: TransactionUmroh,
  },
  {
    path: '/admin/Transaction/:order_id/DetailTransaksiCredit',
    title: 'DetailTransaksiCredit',
    component: DetailTransaksiCredit,
  },
  {
    path: '/admin/TransaksiUmroh/:order_id/DetailTransaksiUmroh',
    title: 'DetailTransaksiUmroh',
    component: DetailTransaksiUmroh,
  },
  {
    path: '/admin/TransaksiUmroh:order_id/DetailTransaksiCashUmroh',
    title: 'DetailTransaksiCashUmroh',
    component: DetailTransaksiCashUmroh,
  },
  {
    path: '/admin/Transaction/:order_id/DetailTransaksiCash',
    title: 'DetailTransaksiCash',
    component: DetailTransaksiCash,
  },
  {
    path: '/admin/AddProduct',
    title: 'AddProduct',
    component: AddProduct,
  },
  {
    path: '/admin/AddSupplier',
    title: 'AddSupplier',
    component: AddSupplier,
  },
  {
    path: '/admin/ApplyCredit',
    title: 'ApplyCredit',
    component: ApplyCredit,
  },
  {
    path: '/admin/Campaign',
    title: 'Campaign',
    component: Campaign,
  },
  {
    path: '/admin/AddVariant',
    title: 'AddVariant',
    component: AddVariant,
  },
  {
    path: '/admin/AddCategories',
    title: 'AddCategories',
    component: AddCategories,
  },
  {
    path: '/admin/dashboard',
    title: 'DashboardRoot',
    component: OrderManagement,
  }
];

const routes = [...coreRoutes];
export default routes;