import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AdminDashboard from "./Admin/AdminDashboard";
import MentorList from "./Admin/MentorList";
import CampList from "./Admin/CampList";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
    children: [
      {
        path: 'camplist',
        element: <CampList />,
        children: [
          
        ]
      },
      {
        path: 'camplist/:id',
        element: <MentorList />
      }

    ]
  },
])

export default router
