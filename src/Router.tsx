import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { LineupBuilderPage } from './pages/LineupBuilder.page';
import { Competitions } from './pages/Competitions.page';
import { LeagueTablePage } from './pages/LeagueTablePage';
import { Layout } from './Layout';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/lineupbuilder',
        element: <LineupBuilderPage />,
      },
      {
        path: '/competitions',
        element: <Competitions />,
      },
      {
        path: '/league/:leagueSlug',
        element: <LeagueTablePage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}