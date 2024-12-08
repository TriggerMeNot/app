import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  NotFound,
  Home,
  Playground,
} from "@/pages";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "@/contexts/AuthProvider";
import Layout from "@/components/Layout";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/contexts/DnDContext";

function Router() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><PrivateRoute /></Layout>}>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
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
        </AuthProvider>
    </BrowserRouter>
  )
}

export default Router
