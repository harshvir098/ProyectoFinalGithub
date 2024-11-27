import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Layout from "../Layout/Layout";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
