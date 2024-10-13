import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const History= Loadable(lazy(() => import('pages/history/index')));
const Records= Loadable(lazy(() => import('pages/record-table/index')));
const Account=Loadable(lazy(() => import('pages/account/index')));
// render - sample page

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path:'history',
      element:<History/>
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
};

export default MainRoutes;
