import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="align-items-center flex-column d-flex justify-content-center vh-100 car-background">
        <h1 style={{"position": "absolute", "top" : "10%"}} className="no-data-box">CAR SALES MANAGEMENT</h1>
        <h3 className="text-center">Proceed as</h3>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" onClick={() => { navigate("/login/admin") }}>Admin</Button>
          <Button variant="primary" onClick={() => { navigate("/login/buyer") }} > Buyer</Button>
          <Button variant="primary" onClick={() => { navigate("/login/seller") }}>Seller</Button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
