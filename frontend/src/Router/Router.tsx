import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  NotFound
} from "@/pages";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "@/contexts/AuthProvider";

function Router() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<>HOME (va sur le login steuplé)</>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default Router
