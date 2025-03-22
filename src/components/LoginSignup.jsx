import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginSignup.css';
import user_icon from '../assets/profile.svg';
import id_icon from '../assets/id-card.svg';
import phone_icon from '../assets/phone.svg';
import password_icon from '../assets/password.svg';

export default function LoginSignup() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === "Sign Up") {
      // Handle Sign Up logic
      console.log("Sign Up:", { name, aadhaar, mobile, password });
    } else {
      // Handle Login logic
      console.log("Login:", { mobile, password });
    }
    // Navigate to the dashboard after successful login/signup
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          {action === "Sign Up" && (
            <>
              <div className="input">
                <img className='form-icons' src={user_icon} alt="Name" />
                <input
                  type="text"
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img className='form-icons' src={id_icon} alt="AADHAAR No." />
                <input
                  type="text"
                  placeholder='AADHAAR No.'
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="input" id='mobile-no'>
            <img className='form-icons' src={phone_icon} alt="Mobile No." />
            <input
              type="tel"
              placeholder='Mobile no.'
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img className='form-icons' src={password_icon} alt="Password" />
            <input
              type="password"
              placeholder='Password / OTP'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {action === "Login" && (
            <div className="forgot-password">
              Lost password? <span>Click here!</span>
            </div>
          )}

          <div className="submit-container">
            <div
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => setAction("Sign Up")}
            >
              Sign up
            </div>
            <div
              className={action === "Sign Up" ? "submit gray" : "submit"}
              onClick={() => setAction("Login")}
            >
              Log in
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}