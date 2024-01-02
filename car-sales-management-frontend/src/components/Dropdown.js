import React, { useState } from "react";
import './../css/Dropdown.css';
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../Helper/Helper";

const Dropdown = () => {

  const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  return (
    <div className="dropdown-container" onClick={toggleDropdown}>
    <div className="profile cursor-pointer">
        <span>{userDetails.name} {getUserRole(userDetails.role)}</span>
      </div>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <div className="purchase-history border-bottom cursor-pointer" onClick={() => navigate("/orders")}>Orders</div>
          {userDetails.role === "A" && <div className="purchase-history border-bottom cursor-pointer" onClick={() => navigate("/sellerRequests")}>Seller Requests</div>}
          <div className="logout cursor-pointer" onClick={handleLogout}>Logout</div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;