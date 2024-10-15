import  { useState } from 'react'; // Import useState to manage dropdown state
import { Route, Routes } from 'react-router-dom';
import SideNav from '../Dashboard/SideNav';
import Summary from '../Summary/Summary';
import Properties from '../Property/Properties';
import Admins from '../../components/Admins/Admins';
import Users from '../../components/Users/Users';
import Profile from '../../components/Profile/Profile';
import './Dashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom'; // Import to handle navigation
import PropertyDetails from '../Property/PropertyDetails';
import Rooms from '../Property/Rooms';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility

    // Function to navigate to user profile page
    const handleProfileClick = () => {
        navigate('/dashboard/profile');
    };

    // Function to handle logout
    const handleLogoutClick = () => {
     
       
        navigate('/login'); 
        window.history.replaceState(null, "", "/");// Navigate to login page
    };

    return (
        <div className="dashboard-container">
            <SideNav />
            <div className="content">
                {/* Account icon with hover effect */}
                <div 
                    className="profile-icon-container" 
                    onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
                    onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when mouse leaves
                >
                    <AccountCircleIcon className="profile-icon" />
                    {dropdownVisible && (
                        <div className="dropdown-menu">
                           
                            <div onClick={handleProfileClick}>Profile</div>
                            <div onClick={handleLogoutClick}>Logout</div>
                        </div>
                    )}
                </div>
                <Routes>
                    <Route path="/" element={<Summary />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/:propertyId" element={<PropertyDetails />} />
                    <Route path="/admins" element={<Admins />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/rooms/:id" element={<Rooms />} />
                     {/* Add user profile route */}
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
