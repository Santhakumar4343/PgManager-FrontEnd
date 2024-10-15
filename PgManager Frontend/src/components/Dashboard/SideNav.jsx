import { NavLink } from "react-router-dom";
import "./SideNav.css";
import  Logo  from "../../assets/oniesoft.png";
import SummarizeIcon from '@mui/icons-material/Summarize';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from "react";
const SideNav = () => {

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // Function to toggle the sub-menu
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  return (
    <nav className="sidenav">
      <img src={Logo} alt="logo image"  width="200px" height="100px" className="logo"/>
      <h2 style={{color:"white"}}>Admin Dashboard</h2>
      <ul >
        <li >
          <SummarizeIcon/>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >

            Summary
          </NavLink>
        </li>
        <li onClick={toggleSubMenu}>
            <ApartmentIcon/>
          <NavLink
          
            to="/dashboard/properties"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Properties
          </NavLink>
         
        </li>
        {isSubMenuOpen && (
        <li style={{marginLeft:"30px"}}>
          <NavLink
            to="/dashboard/rooms"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Rooms
          </NavLink>
        </li>
      )}
        <li>
            <SupervisorAccountIcon/>
          <NavLink
            to="/dashboard/admins"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admins
          </NavLink>
        </li>
        <li>
            <PersonIcon/>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Users
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
