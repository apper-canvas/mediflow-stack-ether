import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Patients = lazy(() => import("@/components/pages/Patients"));
const Appointments = lazy(() => import("@/components/pages/Appointments"));
const Doctors = lazy(() => import("@/components/pages/Doctors"));
const Departments = lazy(() => import("@/components/pages/Departments"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const suspenseFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-primary-600 font-medium">Loading MediFlow...</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={suspenseFallback}><Dashboard /></Suspense>
  },
  {
    path: "patients",
    element: <Suspense fallback={suspenseFallback}><Patients /></Suspense>
  },
  {
    path: "appointments",
    element: <Suspense fallback={suspenseFallback}><Appointments /></Suspense>
  },
  {
    path: "doctors",
    element: <Suspense fallback={suspenseFallback}><Doctors /></Suspense>
  },
  {
    path: "departments",
    element: <Suspense fallback={suspenseFallback}><Departments /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={suspenseFallback}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);