import React, { useState } from "react";
import '../css/style.css';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { getRole } from "../Helper/Helper";

const LoginForm = () => {

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  const userService = UserService();
  const navigate = useNavigate();
  const { userType } = useParams();
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    "username": '',
    "password": '',
    "role": getRole(userType)
  });

  const validateFields = (e) => {
    setErrors({});
    if (e.target.id.indexOf('username') > -1 && !e.target.value) {
      return "Username is mandatory";
    }
    if (e.target.id.indexOf('password') > -1) {
      if (!e.target.value) {
        return "Password is mandatory";
      }
      if (getRole(userType) !== "A"  && (!passwordRegex.test(e.target.value) || e.target.value.length < 8 || e.target.value.length > 15)) {
        return "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-15 characters long.";
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }
    userService.loginUser(userDetails).then((response) => {
      if (response.status === 200) {
        localStorage.setItem("userDetails", JSON.stringify(response.data));
        navigate("/dashboard");
      }
    }).catch((error) => {
      if (!error.response && error.message != null) {
        alert(error.message);
      } else if (error.response.status >= 400) {
        alert(error.response.data);
      }
    })
  }

  const validate = () => {
    let validationErrors = {};
    if (!userDetails.username) {
      validationErrors.username = 'Username is required';
    }
    if (!userDetails.password) {
      validationErrors.password = 'Password is required';
    } else if (userDetails.password.length < 8 || userDetails.password.length > 15) {
      validationErrors.password = 'Password must be at least 8 - 15 characters ';
    }
    return validationErrors;
  }

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const errorMessage = validateFields(event);
    if (errorMessage) {
      setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
    } else {
      setErrors({ ...errors, [id]: '' });
    }
    setUserDetails((prevUserInfo) => ({
      ...prevUserInfo,
      [id]: value,
    }));
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100  car-background">
      <div className="form_container p-5 rounded shadow-lg">
        <form>
          <div className="d-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 36 36" className="" style={{"cursor": "pointer"}} onClick={() => {navigate("/")}}>
              <g id="leftarrow_black_icon_36px" transform="translate(0 -0.003)">
                <rect id="BG_Guide" data-name="BG Guide" width="36" height="36" transform="translate(0 0.003)" fill="none" />
                <path id="Path_22927" data-name="Path 22927" d="M64.191,319.236a1.372,1.372,0,0,0-.9.357L49.343,332.652a1.406,1.406,0,0,0,0,1.968L63.3,347.5a1.418,1.418,0,0,0,1.968-.178,1.4,1.4,0,0,0,0-1.968L54.173,334.977H83.51a1.431,1.431,0,0,0,0-2.862H54.173L65.442,321.74a1.271,1.271,0,0,0,.537-1.073,2.549,2.549,0,0,0-.357-1.074A8.079,8.079,0,0,0,64.191,319.236Z" transform="translate(-48.941 -315.233)" fill="#080808" />
              </g>
            </svg>
            <h3 className="text-center" style={{ "margin-left": "30%" }}>Sign In</h3>
          </div>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter Username" className="form-control" value={userDetails.username} onChange={handleInputChange} autoComplete="off" onBlur={handleInputChange} />
            {errors.username && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.username}</div>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" >Password</label>
            <div className="password-input-container">
              <input type={visible ? "text" : "password"} id="password" placeholder="Enter password" value={userDetails.password} className="form-control" onChange={handleInputChange} onBlur={handleInputChange} />
              <span className="password-toggle" onClick={() => setVisible(!visible)}> {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
            </div>
            {errors.password && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.password}</div>}
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign In</button>
          </div>
          {getRole(userType) !== "A" && <p className="text-right mt-2">Don't have an account? <Link to={`/signup/${userType}`}>Sign Up</Link></p>}
        </form>
      </div>
    </div>
  )

}

export default LoginForm;