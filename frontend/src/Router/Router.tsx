import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "@/contexts/AuthProvider";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/contexts/DnDContext";
import { Icons } from "@/components/ui/icons";
import AppUrlListener from "./AppUrlListener";

const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/pages/Home"));
const Playground = lazy(() => import("@/pages/Playground"));
const Services = lazy(() => import("@/pages/Services"));
const Layout = lazy(() => import("@/components/Layout"));
const ToS = lazy(() => import("@/pages/ToS"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Settings = lazy(() => import("@/pages/Settings"));

function Router() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppUrlListener />
      <AuthProvider>
        <Suspense fallback={
              <div className="flex justify-center items-center h-full">
                <Icons.spinner className="animate-spin h-8 w-8" />
              </div>
        }>
          <Routes>
            <Route path="/login/*" element={<Login />} />
            <Route path="/terms" element={<ToS />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/" element={<Layout><PrivateRoute /></Layout>}>
              <Route index element={<Home />} />
              <Route path="/services/*" element={<Services />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/playground/" element={<NotFound />} />
            <Route path="/playground/:id" element={
              <ReactFlowProvider>
                <DnDProvider>
                  <Layout>
                    <PrivateRoute />
                  </Layout>
                </DnDProvider>
              </ReactFlowProvider>
            }>
              <Route index element={<Playground />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
