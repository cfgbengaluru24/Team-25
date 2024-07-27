import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

const router = createBrowserRouter([
    {
        path:'/',
        element: <App />
    },
    {
        path:'/login',
        element: <Login />
    },
    {
        path:'/signup',
        element: <Signup />
    }
])

export default router
