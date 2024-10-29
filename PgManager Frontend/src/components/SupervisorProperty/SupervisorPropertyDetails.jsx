import AddFloors from "../Property/AddFloors.jsx";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL, createFloor, createRoom } from "../API/Api";
import AddRooms from "../Property/AddRooms.jsx";

import "../../components/Property/PropertyDetails.css";
import axios from "axios";
import { Modal } from "@mui/material";

function SupervisorPropertyDetails() {
  const location = useLocation();
  const { updatedProperty: initialProperty } = location.state || {};

  const [updatedProperty, setUpdatedProperty] = useState(initialProperty);
  const [isAddFloorsOpen, setIsAddFloorsOpen] = useState(false);
  const [isAddRoomsOpen, setIsAddRoomsOpen] = useState(false);
  const [newlyAddedFloors, setNewlyAddedFloors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [assignModal, setAssignModal] = useState(false);
  const navigate = useNavigate();
  // Handle input changes for property fields
  const handlePropertyChange = (e) => {
    setUpdatedProperty({
      ...updatedProperty,
      [e.target.name]: e.target.value,
    });
  };
  const user = JSON.parse(localStorage.getItem("user")) || {};
  useEffect(() => {
    axios
      .get(
        `${API_URL}/api/admins/getAdminsByOwnerEmail/${user.email}`
      )
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.email]);

  // Generate new floors starting from the last existing floor
  // Change the way you're triggering the floor addition
  const handleFloorsSubmit = async (numberOfFloors) => {
    if (!updatedProperty.id) {
      console.error("Property ID is not set.");
      return;
    }

    const existingFloors = updatedProperty?.floors || [];
    const lastFloorIndex = existingFloors.length;

    // Create new floors based on the numberOfFloors input
    const newFloors = [];
    for (let i = 0; i < numberOfFloors; i++) {
      const floorIndex = lastFloorIndex + i; // Calculate the new floor index
      newFloors.push({
        floorName: floorIndex === 0 ? "Ground Floor" : `${floorIndex} Floor`,
      });
    }

    const savedFloors = [];
    for (const floor of newFloors) {
      try {
        const savedFloor = await createFloor(updatedProperty.id, floor);
        savedFloors.push(savedFloor);
      } catch (error) {
        console.error(`Failed to save floor: ${floor.floorName}`, error);
      }
    }
    setIsAddFloorsOpen(false);
    setIsAddRoomsOpen(true);
    setNewlyAddedFloors(savedFloors);

    console.log("Newly added floors:", savedFloors);
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
    setIsAddRoomsOpen(false);
    location.reload();
  };

  // Update property details
  const updatePropertyDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/properties/update/${updatedProperty.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProperty),
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Property updated successfully!",
          timer: 3000,
          showCloseButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update property!",
          showCloseButton: true,
        });
      }
    } catch (error) {
      console.error("Error while updating property: ", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again later!",
        showCloseButton: true,
      });
    }
  };

  const handleRoomClick = (property) => {
    navigate(`/admindashboard/rooms/${property.id}`, {
      state: { updatedProperty: property },
    });
    console.log("the property id is ", property.id);
  };

  const handlePropertyAssing = () => {
    setAssignModal(true);
  };
  const hadleAssigneClose = () => {
    setAssignModal(false);
  };

  const assignAdmin = async () => {
    if (!selectedAdmin) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select an admin to assign!",
        showCloseButton: true,
      });
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/properties/assignAdmin/${updatedProperty.id}`,
        null,
        {
          params: { adminId: selectedAdmin },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Admin assigned successfully!",
          timer: 3000,
          showCloseButton: true,
        });
        setUpdatedProperty(response.data); // Update the property state with new data
      }
    } catch (error) {
      console.error("Error assigning admin: ", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to assign admin. Please try again!",
        showCloseButton: true,
      });
    } finally {
      hadleAssigneClose(); // Close the modal
    }
  };
  return (
    <div>
      {updatedProperty && (
        <div className="property-container">
          <h2>Update Property Details</h2>

          <div className="property-info">
            <h3>Property Information</h3>
            <input
              type="text"
              name="name"
              value={updatedProperty.name}
              onChange={handlePropertyChange}
              placeholder="Property Name"
            />
            <input
              type="text"
              name="ownerName"
              value={updatedProperty.ownerName}
              onChange={handlePropertyChange}
              placeholder="Owner Name"
            />
            <input
              type="text"
              name="propertyType"
              value={updatedProperty.propertyType}
              onChange={handlePropertyChange}
              placeholder="Property Type"
            />
            <input
              type="text"
              name="pincode"
              value={updatedProperty.pincode}
              onChange={handlePropertyChange}
              placeholder="Pincode"
            />
          
          </div>

          <button
            onClick={() => setIsAddFloorsOpen(true)}
            style={{ borderRadius: "20px" }}
          >
            Add Floors
          </button>

          {isAddFloorsOpen && (
            <AddFloors className="addFloors" onSubmit={handleFloorsSubmit} />
          )}
          {isAddRoomsOpen && (
            <AddRooms floors={newlyAddedFloors} onSubmit={handleRoomsSubmit} />
          )}
          <button
            onClick={() => handleRoomClick(updatedProperty)}
            style={{ margin: "20px", borderRadius: "20px" }}
          >
            Rooms Details
          </button>
          
        </div>
      )}

     
    </div>
  );
}

export default SupervisorPropertyDetails;
