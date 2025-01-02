import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';


const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to the Loan Application Portal</h1>
      <p>
        Welcome to <strong>EasyLoan</strong> - your trusted partner for hassle-free loan applications.
        Whether you're looking to achieve a dream, expand your business, or tackle unexpected expenses,
        we've got you covered. <br />
        Sign up today and take the first step towards financial freedom, or log in to continue your journey with us.
    </p>

      <div className="welcome-buttons">
        <button className="btn signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        <button className="btn login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default Welcome;
