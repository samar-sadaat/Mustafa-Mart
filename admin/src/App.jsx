import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}