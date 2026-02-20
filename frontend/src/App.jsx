import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import InsurancePage from "./pages/InsurancePage/InsurancePage";
import Demo from "./pages/Demo/Demo";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<InsurancePage />} />
        <Route path="insurance-page" element={<InsurancePage />} />
        <Route path="demo" element={<Demo />} />
      </Route>
    </Routes>
  );
};

export default App;
