import { useState } from 'react';
import "../../components/superAdmin/superAdminLogin.css";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
const SuperAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(''); // Reset error message on change
  };

  const validateForm = () => {
    const { email, password } = formData;
    let errors = [];

    if (!email && !password) {
      errors.push("Please enter email and password");
    } else {
      if (!email) {
        errors.push("Please enter email");
      }
      if (!password) {
        errors.push("Please enter password");
      }
    }

    return errors.length > 0 ? errors.join(', ') : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    // Call the login endpoint
    const response = await fetch('http://localhost:8082/api/superadmin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      const user = {
        email: formData.email,
       
      };

      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
      console.log('Login successful:', data);
      // Redirect or perform actions on successful login
    } else {
      setErrorMessage(data); // Display backend error message
    }
  };

  return (
    <div className="register-container">
      <div className="logo-container">
        <HomeIcon className="pg-logo" />
        <h2 className="logo-text">Onie Soft PG Manager</h2>
      </div>

      <div className="register-form">
        <h2 className="register-title">Login to your Account</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password" // Changed type to password
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">Login</button>
        </form>
      </div>
      <div className="login">
        <p>New Here?</p>
        <a href="/registration" className="create-account">Register</a>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
