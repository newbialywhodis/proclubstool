import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Page2 } from './pages/Page2';
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
        path: '/table',
        element: <Page2 />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}