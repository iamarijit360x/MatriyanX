import { lazy } from 'react';
import { Navigate } from 'react-router-dom'; // for redirection

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { ProtectedRoute } from 'middlewares/apiMiddleware';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const History = Loadable(lazy(() => import('pages/history/index')));
const Records = Loadable(lazy(() => import('pages/record-table/index')));
const Account = Loadable(lazy(() => import('pages/account/index')));

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />, // Protect the entire route
  children: [
    {
      path: '/',
      element: <Dashboard />, // Main layout with sidebar and navbar
      children: [
        {
          index: true, // This makes `/` redirect to `/dashboard`
          element: <Navigate to="dashboard" />
        },
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'history',
          element: <History />
        },
        {
          path: 'records/:timegroup',
          element: <Records />
        },
        {
          path: 'account',
          element: <Account />
        }
      ]
    }
  ]
};

export default MainRoutes;
