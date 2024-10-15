import { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  createProperty,
  createFloor,
  createRoom,
} from "../../components/API/Api.jsx";
import AddFloors from "./AddFloors";
import AddRooms from "./AddRooms";
import "../../components/Property/Property.css"; // Custom CSS for modal and form
import { useNavigate } from "react-router-dom";

// Bind the modal to your app element (root)
Modal.setAppElement("#root");

function Properties() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [property, setProperty] = useState({
    owneremail: user.email || "",
    name: "",
    pincode: "",
    ownerName: "",
    ownerPhoneNumber: "",
    propertyType:""
  });
  const [floors, setFloors] = useState([]);
  const [newlyAddedFloors, setNewlyAddedFloors] = useState([]);
  const [isFloorsAdded, setIsFloorsAdded] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isRoomsVisible, setIsRoomsVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [updatedProperty, setUpdatedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProperty) {
      setUpdatedProperty(selectedProperty);
    }
  }, [selectedProperty]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch("http://localhost:8082/api/properties/getAll");
      const data = await response.json();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    navigate(`/dashboard/${property.id}`, { state: { updatedProperty: property } });
  };                        

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const savedProperty = await createProperty(property);
    setPropertyId(savedProperty.id);
    setIsFloorsAdded(true);
    setIsAddPropertyModalOpen(false);
    // Trigger the floor addition right after saving the property
    handleFloorsSubmit(1); // For example, automatically add 1 floor, or prompt for more
  };
  
  // Change the way you're triggering the floor addition
  const handleFloorsSubmit = async (numberOfFloors) => {
    if (!propertyId) {
      console.error("Property ID is not set.");
      return;
    }
  
    const existingFloors = updatedProperty?.floors || [];
    const lastFloorIndex = existingFloors.length;
    const newFloors = [];
  
    for (let i = 0; i < numberOfFloors; i++) {
      const floorIndex = lastFloorIndex + i;
      newFloors.push({
        floorName: floorIndex === 0 ? "Ground Floor" : `${floorIndex} Floor`,
      });
    }
  
    const savedFloors = [];
    for (const floor of newFloors) {
      try {
        const savedFloor = await createFloor(propertyId, floor); 
        savedFloors.push(savedFloor);
      } catch (error) {
        console.error(`Failed to save floor: ${floor.floorName}`, error);
      }
    }
  
    setFloors([...existingFloors, ...savedFloors]);
    setIsRoomsVisible(true);
    setNewlyAddedFloors(savedFloors);
    setIsFloorsAdded(false);
  };
  

  const handleRoomsSubmit = async (rooms) => {
    for (const room of rooms) {
      const roomData = {
        singleShare: room.singleShare,
        doubleShare: room.doubleShare,
        tripleShare: room.tripleShare,
        triplePlus: room.triplePlus,
      };
      await createRoom(room.floorId, roomData);
      console.log("Room saved:", roomData);
    }
    setIsRoomsVisible(false);
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="property-container">
      <div className="search">
        <button
          className="open-modal-button"
          onClick={() => setIsAddPropertyModalOpen(true)}
        >
          Add Property
        </button>

        <input
         className="search-Property"
          placeholder="Search by property name or owner name …"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="property-cards">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="property-card"
            onClick={() => handlePropertyClick(property)}
          >
            <h3>{property.name}</h3>
            <p>Owner: {property.ownerName}</p>
            <p>Pincode: {property.pincode}</p>
            <p>Email: {property.owneremail}</p>
            <p>Phone: {property.ownerPhoneNumber}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddPropertyModalOpen}
        onRequestClose={() => setIsAddPropertyModalOpen(false)}
        className="property-modal"
        overlayClassName="property-modal-overlay"
      >
        <h2>Add Property</h2>
        <form onSubmit={handlePropertySubmit} className="property-form">
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            onChange={handlePropertyChange}
            required
          />
<input
  type="text"
  name="propertyType"
  placeholder="Property Type"
  list="propertyTypeOptions"   // Link to the datalist
  onChange={handlePropertyChange}
  required
/>

<datalist id="propertyTypeOptions">
  <option value="Male" />
  <option value="Female" />
  <option value="Co-Living" />
  
</datalist>

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handlePropertyChange}
            required
          />
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            onChange={handlePropertyChange}
            required
          />
          <input
            type="text"
            name="ownerPhoneNumber"
            placeholder="Owner Phone Number"
            onChange={handlePropertyChange}
            required
          />
          <button type="submit" className="submit-button">
            Add Property
          </button>
        </form>
      </Modal>

      {isFloorsAdded && (
        <Modal
          isOpen={isFloorsAdded}
          onRequestClose={() => setIsFloorsAdded(false)}
          className="property-modal"
          overlayClassName="property-modal-overlay"
        >
          <h2>Add Floors</h2>
          <AddFloors onSubmit={handleFloorsSubmit} />
        </Modal>
      )}

      {isRoomsVisible && (
        <Modal
          isOpen={isRoomsVisible}
          onRequestClose={() => setIsRoomsVisible(false)}
          className="property-modal-rooms"
          overlayClassName="property-modal-overlay"
        >
          <AddRooms floors={floors} onSubmit={handleRoomsSubmit} />
        </Modal>
      )}
    </div>
  );
}

export default Properties;
