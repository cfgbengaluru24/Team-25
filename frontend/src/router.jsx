import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AdminDashboard from "./Admin/AdminDashboard";
import MentorList from "./Admin/MentorList";
import CampList from "./Admin/CampList";
import TraineeDashboard from "./Trainee/TraineeDashboard";
import Courses from "./Trainee/Courses";
import TrainerDashboard from "./Trainer/TrainerDashboard";
import TravelDetails from "./Trainer/TravelDetails";
import AddTrainer from "./Admin/AddTrainer";
import TravelList from "./Admin/TravelList";
import MapComponent from "./Admin/TrainerMap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "camplist",
        element: <CampList />,
        children: [],
      },
      {
        path: "camplist/:id",
        element: <MentorList />,
      },
      {
        path: "add-trainer",
        element: <AddTrainer />,
      },
      {
        path: "travel/:id",
        element: <TravelList />,
      },
      {
        path: "trainer-map",
        element: <MapComponent />,
      },
    ],
  },
  {
    path: "/trainee",
    element: <TraineeDashboard />,
    children: [
      {
        path: "courses",
        element: <Courses />,
      },
    ],
  },
  {
    path: "/trainer",
    element: <TrainerDashboard />,
    children: [
      {
        path: "travel",
        element: <TravelDetails />,
      },
    ],
  },
]);

export default router;
