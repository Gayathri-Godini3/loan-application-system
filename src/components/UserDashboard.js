import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/dashboard.css';

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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingLoans, setLoadingLoans] = useState(false);

  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch user data and loan applications
  useEffect(() => {
    if (token) {
      setLoadingProfile(true);
      axios
        .get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });
  };

  // Validate loan application
  const validateApplication = () => {
    if (!applicationData.name || !applicationData.email || !applicationData.phone) {
      return 'Name, Email and Phone are required.';
    }
    if (applicationData.age < 18 || applicationData.age > 65) {
      return 'Age must be between 18 and 65';
    }
    if (applicationData.cibilScore < 300 || applicationData.cibilScore > 900) {
      return 'CIBIL score must be between 300 and 900';
    }
    if (applicationData.loanAmount <= 0) {
      return 'Loan amount must be greater than zero';
    }
    return '';
  };

  // Submit loan application
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateApplication();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/apply',
        applicationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Loan application submitted successfully.');
      setLoanApplications([...loanApplications, response.data]);
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

      // Redirect to acknowledgment page after submission
      navigate("/acknowledgementpage");
    } catch (error) {
      setMessage('Error submitting loan application. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="dashboard-container">
      {userData ? (
        <div className="profile-section">
          <h2>Welcome, {userData.name}</h2>
          <p>We're here to help you with your loan application.</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <div className="apply-loan-section">
        <h3>Apply for a New Loan</h3>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          {Object.keys(applicationData).map((key) => (
            <input
              key={key}
              type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={applicationData[key]}
              onChange={handleChange}
              required={["name", "email", "phone"].includes(key)}
            />
          ))}
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Loan Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
