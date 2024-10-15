import { useState, useEffect } from 'react';
import './Profile.css';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';
const Profile = () => {
    const [formData, setFormData] = useState({
        email: '',
        mobileNumber: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate=useNavigate();
    // Fetch user data using email from localStorage
    const fetchUserData = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.email) {
                const response = await fetch(`http://localhost:8082/api/superadmin/get/${storedUser.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        email: data.email,
                        mobileNumber: data.mobileNumber,
                        username: data.username,
                        password: data.password, 
                    });
                    setLoading(false);
                } else {
                    setErrorMessage('Unable to fetch user data');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setErrorMessage('An error occurred while fetching the data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate username
        if (formData.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters.';
        }

        // Validate password
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        // Validate mobile number
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be 10 digits and start with 6 to 9.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (Object.keys(validationErrors).length === 0) {
            try {
                // Send PUT request to update profile
                const response = await fetch(`http://localhost:8082/api/superadmin/update/${storedUser.email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('User profile updated successfully:', data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Profile updated successfully!',
                        timer: 3000, // Close after 3 seconds
                        showCloseButton: true,
                    });
                    navigate('/dashboard')
                    setErrorMessage('Profile updated successfully!');
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: `Error updating profile: ${errorData.message || 'Unknown error'}`,
                    });
                    setErrorMessage(`Error updating profile: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error updating profile:', error);

                setErrorMessage('An error occurred while updating the profile');
            }
        }
    };

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="user-profile-container">
            <h2>Update User Profile</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
             
                    <input
                        type="email"
                        name="email"
                        placeholder='email'
                        value={formData.email}
                        onChange={handleChange}
                        readOnly // Email is usually not editable
                    />
                </div>
                <div className="form-group">
                   
                    <input
                        type="text"
                        name="mobileNumber"
                        placeholder='Mobile Number'
                        value={formData.mobileNumber}
                        onChange={handleChange}
                    />
                    {errors.mobileNumber && <p className="error-text">{errors.mobileNumber}</p>}
                </div>
                <div className="form-group">
                    
                    <input
                        type="text"
                        name="username"
                        placeholder='Use Name'
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error-text">{errors.username}</p>}
                </div>
                <div className="form-group">
                  
                    <input
                    placeholder='Password'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                <button type="submit" className='btn-profile'>Update</button>
            </form>
        </div>
    );
};

export default Profile;
