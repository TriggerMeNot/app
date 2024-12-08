import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  NotFound
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
              <Route index element={<>HOME (va sur le login steuplé)</>} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default Router
