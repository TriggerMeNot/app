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

function Router() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><PrivateRoute /></Layout>}>
              <Route index element={<Home />} />
              <Route path="/playground/:id" element={<Playground />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default Router
