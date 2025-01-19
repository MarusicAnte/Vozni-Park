import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.tsx";
import UserList from "./pages/UserList.tsx";
import NewReservationList from "./pages/NewReservationList.tsx";
import ApprovedReservationList from "./pages/ApprovedReservationList.tsx";
import RejectedReservationList from "./pages/RejectedReservationList.tsx";
import VehicleList from "./pages/VehicleList.tsx";
import NotFound from "./pages/NotFound.tsx";
import getVehicles from "./services/vehicleService.ts";
import { getUsers } from "./services/userService.ts";
import Login from "./pages/Login.tsx";
import { getNewReservations } from "./services/newReservationService.ts";
import { getApprovedReservations } from "./services/approvedReservationService.ts";
import AuthProvider from "./provider/AuthProvider.tsx";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute.tsx";
import { getRejectedReservations } from "./services/rejectedReservationService.ts";
import FinishedReservationList from "./pages/FinishedReservationList.tsx";
import { getFinishedReservations } from "./services/finishedReservationService.ts";
import VehicleMalfunctionList from "./pages/VehicleMalfunctionList.tsx";
import { getVehicleMalfunctions } from "./services/vehicleMalfunctionService.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "vehicles",
        element: (
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        ),
        loader: async () => await getVehicles(),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        ),
        loader: async () => await getUsers(),
      },
      {
        path: "reservations",
        children: [
          {
            path: "new-created",
            element: (
              <ProtectedRoute>
                <NewReservationList />
              </ProtectedRoute>
            ),
            loader: async () => await getNewReservations(),
          },
          {
            path: "approved",
            element: (
              <ProtectedRoute>
                <ApprovedReservationList />
              </ProtectedRoute>
            ),
            loader: async () => await getApprovedReservations(),
          },
          {
            path: "rejected",
            element: (
              <ProtectedRoute>
                <RejectedReservationList />
              </ProtectedRoute>
            ),
            loader: async () => await getRejectedReservations(),
          },
          {
            path: "finished",
            element: (
              <ProtectedRoute>
                <FinishedReservationList />
              </ProtectedRoute>
            ),
            loader: async () => await getFinishedReservations(),
          },
        ],
      },
      {
        path: "vehicleMalfunctions",
        element: (
          <ProtectedRoute>
            <VehicleMalfunctionList />
          </ProtectedRoute>
        ),
        loader: async () => await getVehicleMalfunctions(),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
