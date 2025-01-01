import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    monthlyIncome: '',
    loanAmount: '',
    tenure: '',
    cibilScore: '',
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Fetch user data and loan applications
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      axios
        .get('http://localhost:5000/api/user/loan-applications', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setLoanApplications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching loan applications:", error);
        });
    }
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });
  };

  // Submit loan application
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!applicationData.name || !applicationData.email || !applicationData.phone) {
      setMessage('Please fill out all required fields');
      return;
    }

    axios
      .post('http://localhost:5000/api/user/apply', applicationData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setMessage('Loan application submitted successfully');
        setLoanApplications([...loanApplications, applicationData]);
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          age: '',
          address: '',
          monthlyIncome: '',
          loanAmount: '',
          tenure: '',
          cibilScore: '',
        });
      })
      .catch((error) => {
        setMessage('Error submitting loan application');
        console.error(error);
      });
  };

  return (
    <div className="user-dashboard">
      {userData ? (
        <div className="profile-section">
          <h2>Welcome, {userData.name}</h2>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <h3>Loan Applications</h3>
      {message && <p>{message}</p>}

      <div className="loan-applications">
        <h4>Your Previous Loan Applications</h4>
        {loanApplications.length > 0 ? (
          <ul>
            {loanApplications.map((loan, index) => (
              <li key={index}>
                <p>Loan Amount: {loan.loanAmount}</p>
                <p>Status: {loan.status || "Pending"}</p>
                <p>Tenure: {loan.tenure} months</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No loan applications found.</p>
        )}
      </div>

      <div className="apply-loan-section">
        <h3>Apply for a New Loan</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={applicationData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={applicationData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={applicationData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={applicationData.age}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Address"
            value={applicationData.address}
            onChange={handleChange}
          />
          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income"
            value={applicationData.monthlyIncome}
            onChange={handleChange}
          />
          <input
            type="number"
            name="loanAmount"
            placeholder="Loan Amount"
            value={applicationData.loanAmount}
            onChange={handleChange}
          />
          <input
            type="number"
            name="tenure"
            placeholder="Loan Tenure (in months)"
            value={applicationData.tenure}
            onChange={handleChange}
          />
          <input
            type="number"
            name="cibilScore"
            placeholder="CIBIL Score"
            value={applicationData.cibilScore}
            onChange={handleChange}
          />
          <button type="submit">Submit Loan Application</button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
