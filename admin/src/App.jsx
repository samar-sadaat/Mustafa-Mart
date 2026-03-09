import AdminCreateProduct from "./components/product"
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminCreateProduct />} />
      </Routes>
    </>
  )
}

export default App
