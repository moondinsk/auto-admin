import { createBrowserRouter, Navigate } from "react-router-dom";

import Root from "../layouts/Root";

import Home from "../pages/Home";
import ProductList from "../pages/Product/ProductList";
import ProductDetail from "../pages/Product/ProductDetail";
import ErrorPage from "../pages/Error/Forbidden";

import { PATH, SEGMENT } from "./paths";
import PrivateRoute from "./PrivateRoute";
import Login from "@/pages/Login/Login";
import Forbidden from "../pages/Error/Forbidden";
import Users from "@/pages/User/Users";
import Components from "@/pages/Components/Components";
import ComponentsTable from "@/pages/Components/ComponentsTable";
import ComponentsModal from "@/pages/Components/ComponentsModal";
import ComponentsEtc from "@/pages/Components/ComponentsEtc";

export const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: SEGMENT.COMPONENTS,
        element: <Components />,
        children: [
          {
            index: true,
            element: <Navigate to={SEGMENT.COMPONENTS_TABLE} replace />,
          },
          {
            path: SEGMENT.COMPONENTS_TABLE,
            element: <ComponentsTable />,
          },
          {
            path: SEGMENT.COMPONENTS_MODAL,
            element: <ComponentsModal />,
          },
          {
            path: SEGMENT.COMPONENTS_ETC,
            element: <ComponentsEtc />,
          },
        ],
      },
      {
        path: SEGMENT.PRODUCT,
        element: <ProductList />,
      },
      {
        path: SEGMENT.PRODUCT_DETAIL,
        element: <ProductDetail />,
      },
      {
        path: SEGMENT.LOGIN,
        element: <Login />,
      },
      {
        path: SEGMENT.FORBIDDEN,
        element: <Forbidden />,
      },
      {
        path: SEGMENT.USERS,
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
