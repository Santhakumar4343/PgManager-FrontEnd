import { useState } from 'react';
import "../../components/superAdmin/superAdminRegistration.css";
import HomeIcon from '@mui/icons-material/Home';

const SuperAdminRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    // Validate username
    if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters.';
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits and start with 6 to 9.';
    }

    // Validate email
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be in lowercase and follow @gmail.com format.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Send registration request
      try {
        const response = await fetch('http://localhost:8082/api/superadmin/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.text();
        if (response.ok) {
          console.log('OTP sent');
          setIsOtpSent(true);
        } else {
          setErrors({ server: data });
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP here
    if (otp.length === 6) { // Assuming OTP is 6 digits
      try {
        const response = await fetch('http://localhost:8082/api/superadmin/validate-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }), // Only sending OTP now
        });
  
        const data = await response.text();
        if (response.ok) {
          alert('User registered successfully');
          setFormData({
            username: '',
            password: '',
            email: '',
            mobileNumber: '',
          })
          setIsOtpSent(false);
        } else {
          setOtpError(data); // Display backend error message
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      setOtpError('Please enter a valid OTP.');
    }
  };
  
  return (
    <div className="register-container">
      <div className="logo-container">
        <HomeIcon className="pg-logo" />
        <h3 className="logo-text">Onie Soft PG Manager</h3>
      </div>

      {!isOtpSent ? (
        <div className="register-form">
          <h2 className="register-title">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-container">
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
              {errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
            </div>

            <div className="terms-container">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#">Privacy Policy</a> & <a href="#">Terms of Service</a>.
              </span>
            </div>
            <button type="submit" className="register-btn">Register</button>
          </form>
          <div className="register">
            <p>Already have an account?</p>
            <a href="/login" className="create-account">Login</a>
          </div>
        </div>
      ) : (
        <div className="otpmodal">
          <h2>Enter OTP</h2>
          <form onSubmit={handleOtpSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                required
              />
              {otpError && <p className="error">{otpError}</p>}
            </div>
            <button type="submit" className="otp-submit-btn">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRegistration;
