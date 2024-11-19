import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  NotFound
} from "./pages";

function Router() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  )
}

export default Router
