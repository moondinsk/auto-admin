import {createBrowserRouter, Navigate} from "react-router-dom";
import {PATH, SEGMENT} from "./paths";
import PrivateRoute from "./PrivateRoute";
import {lazy} from "react";


const Root = lazy(() => import("../layouts/Root"));
const Home = lazy(() => import("../pages/Home"));
const ProductList = lazy(() => import("../pages/Product/ProductList"));
const ProductDetail = lazy(() => import("../pages/Product/ProductDetail"));
const ErrorPage = lazy(() => import("../pages/Error/Forbidden"));
const Login = lazy(() => import("@/pages/Login/Login"));
const Users = lazy(() => import("@/pages/User/Users"));
const Components = lazy(() => import("@/pages/Components/Components"));
const ComponentsTable = lazy(() => import("@/pages/Components/ComponentsTable"));
const ComponentsModal = lazy(() => import("@/pages/Components/ComponentsModal"));
const ComponentsEtc = lazy(() => import("@/pages/Components/ComponentsEtc"));



export const router = createBrowserRouter([
    {
        path: PATH.HOME,
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            {
                path: SEGMENT.COMPONENTS,
                element: <Components/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to={SEGMENT.COMPONENTS_TABLE} replace/>,
                    },
                    {
                        path: SEGMENT.COMPONENTS_TABLE,
                        element: <ComponentsTable/>,
                    },
                    {
                        path: SEGMENT.COMPONENTS_MODAL,
                        element: <ComponentsModal/>,
                    },
                    {
                        path: SEGMENT.COMPONENTS_ETC,
                        element: <ComponentsEtc/>,
                    },
                ],
            },
            {
                path: SEGMENT.PRODUCT,
                element: <ProductList/>,
            },
            {
                path: SEGMENT.PRODUCT_DETAIL,
                element: <ProductDetail/>,
            },
            {
                path: SEGMENT.LOGIN,
                element: <Login/>,
            },
            {
                path: SEGMENT.FORBIDDEN,
                element: <ErrorPage/>,
            },
            {
                path: SEGMENT.USERS,
                element: (
                    <PrivateRoute>
                        <Users/>
                    </PrivateRoute>
                ),
            },
        ],
    },
]);
