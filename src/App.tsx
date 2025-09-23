// src/App.tsx
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ECommerce from './pages/CustomerDetails';
import DashboardUser from './pagesUser/DashboardUser/Beranda';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import PrivateRoute from './minddleware/PrivateRoute';
import Loader from './common/Loader';
import routes from './routes';
import routesDashboardUser from './routes/indexUser';
import Details from './pagesUser/Details';
import Home from './pagesUser/Home';
import Checkout from './pagesUser/Checkout';
import Complete from './pagesUser/Complete';
import Kategori from './pagesUser/Category';
import Landingpage from './pagesUser/layoutLandingPage/Landingpage';
import Cart from './pagesUser/Cart';
import SearchResult from './pagesUser/SearchResult';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const DashboardSupplier = lazy(() => import('./layout/DashboardSupplier'));
import DashboardUserLayout from './pagesUser/DashboardUser/layout/DasboardUser';
import SubmitChallenge from './pagesUser/DashboardUser/SubmitChallenge';
import Leaderboard from './pagesUser/DashboardUser/Leaderboard';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />

      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />

        <Route element={<Landingpage />}>
          <Route path="/details/:id" element={<Details />} />
          <Route path="/kategori" element={<Kategori />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* ===== Protected Routes (member & admin) ===== */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'member']} />}>
          {/* User routes pakai Landingpage layout */}
          <Route element={<Landingpage />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/complete" element={<Complete />} />
          </Route>

          {/* Dashboard User */}
          <Route element={<DashboardUserLayout />}>
            <Route path="/profil" element={<DashboardUser />} />
            {routesDashboardUser.map(({ path, component: Component }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Route>

        {/* ===== Protected Routes (admin only) ===== */}
        <Route element={<PrivateRoute allowedRoles={['admin','member']} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<ECommerce />} />
            {routes.map(({ path, component: Component }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
          </Route>
          <Route path="/challenge/:id/submit" element={<SubmitChallenge />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
