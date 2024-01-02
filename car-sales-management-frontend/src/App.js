import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./authentication/LoginForm";
import RegistrationForm from "./authentication/RegistrationForm";
import DashBoard from "./components/DashBoard";
import OrderRequest from "./components/OrderRequest";
import AddressCard from "./modals/AddressCard";
import HomePage from "./authentication/HomePage";
import SellerRequest from "./components/SellerRequest";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={HomePage} />
        <Route exact path="/login/:userType" Component={LoginForm} />
        <Route exact path="/signUp/:userType" Component={RegistrationForm} />
        <Route exact path="/dashboard" Component={DashBoard} />
        <Route exact path="/orders" Component={OrderRequest} />
        <Route exact path="/sellerRequests" Component={SellerRequest} />
        <Route exact path="/address" Component={AddressCard} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;