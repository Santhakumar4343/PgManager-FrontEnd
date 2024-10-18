import { NavLink } from "react-router-dom";
import "./SideNav.css";
import  Logo  from "../../assets/oniesoft.png";
import SummarizeIcon from '@mui/icons-material/Summarize';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';

const SideNav = () => {

 
  return (
    <nav className="sidenav">
      <div className="nav-container">
      <img src={Logo} alt="logo image"  width="200px" height="100px" className="logo"/>
      <h2 style={{color:"black"}}>Owner Dashboard</h2>
      <ul >
        <div className="nav-links">
        <li>
          <SummarizeIcon className="icons"/>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >

            Summary
          </NavLink>
        </li>
        </div>
        <div className="nav-links">
        <li >
            <ApartmentIcon className="icons"/>
          <NavLink
          
            to="/dashboard/properties"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Properties
          </NavLink>
         
      </li>
      </div>
      <div className="nav-links">
        <li>
            <SupervisorAccountIcon className="icons"/>
          <NavLink
            to="/dashboard/admins"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admins
          </NavLink>
        </li>
        </div>
        <div className="nav-links">
        <li>
            <PersonIcon className="icons"/>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Users
          </NavLink>
        </li>
        </div>
      </ul>
      </div>
    </nav>
  );
};

export default SideNav;
