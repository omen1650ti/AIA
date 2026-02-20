import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import InsurancePage from "./pages/InsurancePage/InsurancePage";
import PolicyDetails from "./pages/PolicyDetails/PolicyDetails";
import ClaimReviewer from "./pages/ClaimReviewer/ClaimReviewer";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<InsurancePage />} />
        <Route path="insurance-page" element={<InsurancePage />} />
        {/* <Route path="policies" element={<Policy />} /> */}


        <Route path="policy-details/:policyId" element={<PolicyDetails />} />
        <Route path="claim-reviewer" element={<ClaimReviewer />} />
      </Route>

    </Routes>
  );
};

export default App;
