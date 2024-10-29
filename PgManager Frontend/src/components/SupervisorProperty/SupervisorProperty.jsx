import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../API/Api";
import "./SupervisorProperty.css";
import { useNavigate } from "react-router-dom";

function SupervisorProperty() {
  const [properties, setProperties] = useState([]);
  const [searchTerm,setSearchTerm]= useState("");
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/properties/getPropertyForAdmin/${admin.id}`)
      .then((response) => setProperties(response.data))
      .catch((err) => console.log(err));
  }, [admin.id]);
  console.log(properties);
  console.log(searchTerm);
  const filteredProperties=properties.filter(property=>
    property.ownerName.toLowerCase().includes(searchTerm.toLowerCase())||
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    navigate(`/admindashboard/${property.id}`, {
      state: { updatedProperty: property },
    });
  };
  return (
    <div className="property-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Property name or owner name"
          className="search-box"
          value={searchTerm}
          onChange={(e)=>{setSearchTerm(e.target.value)}}
        ></input>
         
      </div>
    
      <div className="card-container">
        {filteredProperties.map((property) => (
          <div key={property.id} className="card"
          onClick={() => handlePropertyClick(property)}>
            <h2>{property.name}</h2>
            <p>Owner: {property.ownerName}</p>
            <p>Owner Mobile Number:{property.ownerPhoneNumber}</p>
            <p>Address: {property.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupervisorProperty;
