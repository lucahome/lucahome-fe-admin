/* eslint-disable perfectionist/sort-named-imports */
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ChangePassPage = lazy(() => import('src/pages/change-pass'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const BookingPage = lazy(() => import('src/pages/booking'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router(props) {
  
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: !props?.token ? <Navigate to="/login" replace /> : <IndexPage />, index: true },
        { path: 'user', element: !props?.token ? <Navigate to="/login" replace /> : <UserPage /> },
        { path: 'homestay', element: !props?.token ? <Navigate to="/login" replace /> : <ProductsPage /> },
        { path: 'booking', element: !props?.token ? <Navigate to="/login" replace /> : <BookingPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: props?.token ? <Navigate to="/" replace /> : <LoginPage onLogin={props.onLogin} />,
    },
    {
      path: 'changePass',
      element: !props?.token ? <Navigate to="/login" replace /> : <ChangePassPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    },
  ]);

  return routes;
}
