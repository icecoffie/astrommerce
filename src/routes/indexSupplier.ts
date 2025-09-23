import { lazy } from 'react';

const SupplierDashboard = lazy(() => import('../component/ProductList'));
const AddVariant = lazy(() => import('../pages/AddVariant'));
const Stock = lazy(() => import('../pages/Campaign'));
const AddProduct = lazy(() => import('../pages/AddProduct'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const supplierRoutes = [
  {
    path: '/supplier/dashboardSupplier',
    title: 'SupplierDashboard',
    component: SupplierDashboard,
  },
  {
    path: '/supplier/addvariant',
    title: 'AddVariant',
    component: AddVariant,
  },
  {
    path: '/supplier/addstock',
    title: 'Stock',
    component: Stock,
  },
  {
    path: '/supplier/addProduct',
    title: 'AddProduct',
    component: AddProduct,
  },
  {
    path: '/supplier/ProductDetail/:id',
    title: 'ProductDetail',
    component: ProductDetail,
  },
];

export default supplierRoutes;
