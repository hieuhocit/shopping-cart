import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Shop, { loader as shopLoader } from '../pages/Shop';
import Details, { loader as detailsLoader } from '../components/Details';
import ErrorElement from '../components/ErrorElement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop/characters/:query',
        element: <Shop />,
        loader: shopLoader,
      },
      {
        path: 'shop/characters/character/:id',
        element: <Details />,
        loader: detailsLoader,
      },
    ],
  },
]);

export default router;
