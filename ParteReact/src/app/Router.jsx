import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Layout from "../Layout/Layout";

const Router = () => {
  return (
    // Asegúrate de devolver el JSX con un return
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/eventos" element={<Perfil />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
