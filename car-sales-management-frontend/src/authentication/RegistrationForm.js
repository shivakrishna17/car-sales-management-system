import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import '../css/style.css';
import UserService from "../services/UserService";
import { getRole } from "../Helper/Helper";

const RegistrationForm = () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userService = UserService();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { userType } = useParams();
  const [userDetails, setUserDetails] = useState({
    "name": '',
    "email": '',
    "phonenumber": '',
    "location": "",
    "ssn": '',
    "username": '',
    "password": '',
    "role": getRole(userType)
  });

  const validateFields = (e) => {
    setErrors({});
    if (e.target.id.indexOf('username') > -1 && !e.target.value) {
      return "Username is mandatory";
    }
    if (e.target.id.indexOf('name') > -1 && !e.target.value) {
      return "Full name is mandatory";
    }
    if (e.target.id.indexOf('email') > -1) {
      if (!e.target.value) {
        return "Email is mandatory";
      }
      if (!emailRegex.test(e.target.value)) {
        return "Enter valid Email";
      }
    }
    if (e.target.id.indexOf('phonenumber') > -1 && !e.target.value) {
      return "mobile number is mandatory";
    }
    if (e.target.id.indexOf('location') > -1 && !e.target.value) {
      return "Location is mandatory";
    }
    if (e.target.id.indexOf('ssn') > -1 && !e.target.value) {
      return "SSN is mandatory";
    }
    if (e.target.id.indexOf('password') > -1) {
      if (!e.target.value) {
        return "Password is mandatory";
      }
      if (!passwordRegex.test(e.target.value) || e.target.value.length < 8 || e.target.value.length > 15) {
        return "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-15 characters long.";
      }
    }
    if (e.target.id.indexOf('confirmPassword') > -1) {
      if (!e.target.value) {
        return "Confirm Password is mandatory";
      }
      if (e.target.value !== userDetails.password) {
        return "Password doesn't match";
      }
    }
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const hasEmptyFields = Object.values(userDetails).some(value => value === '');
    if (hasEmptyFields) {
      alert("All fields are required. Please fill in all the fields.");
      return;
    }
    userService.registerUser(userDetails).then((response) => {
      if (response.status === 200) {
        alert(response.data);
        navigate(`/login/${userType}`);
      }

    }).catch((error) => {
      if (error.response.status >= 400) {
        alert(error.response.data);
      }
    })
  }

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const errorMessage = validateFields(event);
    if (errorMessage) {
      setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
    } else {
      setErrors({ ...errors, [id]: '' });
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUserDetails((prevUserInfo) => ({
        ...prevUserInfo,
        [id]: id === 'phonenumber' ? value.replace(/\D/g, '').slice(0, 10) : value,
      }));
    }
  };

  return (
    <>
      <div className="signup template d-flex justify-content-center align-items-center vh-100  car-background">
        <div className="form_container p-2 rounded shadow-lg" style={{ "width": "45%" }}>
          <form className="row">
            <div className="d-flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 36 36" className="" style={{"cursor": "pointer"}} onClick={() => {navigate("/")}}>
                <g id="leftarrow_black_icon_36px" transform="translate(0 -0.003)">
                  <rect id="BG_Guide" data-name="BG Guide" width="36" height="36" transform="translate(0 0.003)" fill="none" />
                  <path id="Path_22927" data-name="Path 22927" d="M64.191,319.236a1.372,1.372,0,0,0-.9.357L49.343,332.652a1.406,1.406,0,0,0,0,1.968L63.3,347.5a1.418,1.418,0,0,0,1.968-.178,1.4,1.4,0,0,0,0-1.968L54.173,334.977H83.51a1.431,1.431,0,0,0,0-2.862H54.173L65.442,321.74a1.271,1.271,0,0,0,.537-1.073,2.549,2.549,0,0,0-.357-1.074A8.079,8.079,0,0,0,64.191,319.236Z" transform="translate(-48.941 -315.233)" fill="#080808" />
                </g>
              </svg>
              <h3 className="text-center" style={{ "margin-left": "30%" }}>Sign Up</h3>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="name" placeholder="Enter Fullname" className="form-control" onChange={handleInputChange} value={userDetails.name} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.name}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" placeholder="Enter Email" className="form-control" onChange={handleInputChange} value={userDetails.email} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.email}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="phonenumber">Mobile Number</label>
              <input type="text" id="phonenumber" placeholder="Enter Phone Number" className="form-control" onChange={handleInputChange} maxLength={10} value={userDetails.phonenumber} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.phonenumber}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" placeholder="Enter location" className="form-control" onChange={handleInputChange} maxLength={50} value={userDetails.location} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.location}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="ssn">SSN</label>
              <input type="text" id="ssn" placeholder="Enter SSN" className="form-control" onChange={handleInputChange} maxLength={10} value={userDetails.ssn} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.ssn}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Enter Username" className="form-control" onChange={handleInputChange} value={userDetails.username} autoComplete="off" onBlur={handleInputChange} />
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.username}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="password" >Password</label>
              <div className="password-input-container">
                <input type={visiblePassword ? "text" : "password"} id="password" placeholder="Enter password" className="form-control" onChange={handleInputChange} value={userDetails.password} onBlur={handleInputChange} />
                <span className="password-toggle" onClick={() => setVisiblePassword(!visiblePassword)}> {visiblePassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
              </div>
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.password}</div>
            </div>
            <div className="mb-2 col-6">
              <label htmlFor="confirmPassword" >Confirm Password</label>
              <div className="password-input-container">
                <input type={visibleConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Re-Enter password" className="form-control" onChange={handleInputChange} value={confirmPassword} onBlur={handleInputChange} />
                <span className="password-toggle" onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)}> {visibleConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
              </div>
              <div className="text-danger" style={{ fontSize: '12px' }}>{errors.confirmPassword}</div>
            </div>
            <div className="text-center mb-2">
              <button type="submit" className="btn  col-5 btn-primary" onClick={handleRegister}>Sign Up</button>
            </div>
            <p className="text-right">Already have an account? <Link to={`/login/${userType}`}>Login</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegistrationForm;