import AddFloors from "./AddFloors";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createFloor, createRoom } from "../API/Api";
import AddRooms from "./AddRooms";

import "../../components/Property/PropertyDetails.css"

function PropertyDetails() {
    const location = useLocation();
    const { updatedProperty: initialProperty } = location.state || {};

    const [updatedProperty, setUpdatedProperty] = useState(initialProperty);
    const [isAddFloorsOpen, setIsAddFloorsOpen] = useState(false);
    const [isAddRoomsOpen, setIsAddRoomsOpen] = useState(false);
    const [newlyAddedFloors, setNewlyAddedFloors] = useState([]);
    const navigate = useNavigate();
    // Handle input changes for property fields
    const handlePropertyChange = (e) => {
        setUpdatedProperty({
            ...updatedProperty,
            [e.target.name]: e.target.value,
        });
    };

    // Handle input changes for floor fields
    const handleFloorChange = (index, e) => {
        const updatedFloors = [...updatedProperty.floors];
        updatedFloors[index] = {
            ...updatedFloors[index],
            [e.target.name]: e.target.value,
        };
        setUpdatedProperty({ ...updatedProperty, floors: updatedFloors });
    };

    // Handle input changes for room fields
    const handleRoomChange = (floorIndex, roomIndex, e) => {
        const updatedFloors = [...updatedProperty.floors];
        updatedFloors[floorIndex].rooms[roomIndex] = {
            ...updatedFloors[floorIndex].rooms[roomIndex],
            [e.target.name]: e.target.value,
        };
        setUpdatedProperty({ ...updatedProperty, floors: updatedFloors });
    };

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
  
    // Save only the new floors to the database
    const savedFloors = [];
    for (const floor of newFloors) {
      try {
        const savedFloor = await createFloor(updatedProperty.id, floor); 
        savedFloors.push(savedFloor); // Collect saved floors if needed
      } catch (error) {
        console.error(`Failed to save floor: ${floor.floorName}`, error);
      }
    }
    setIsAddFloorsOpen(false)
    setIsAddRoomsOpen(true);
    setNewlyAddedFloors(savedFloors);
    // Optionally log the saved floors or update the UI state here
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
  
    const updateFloorDetails = async (floorId, index) => {
        const updatedFloor = updatedProperty.floors[index];
        console.log("Updating Floor:", updatedFloor); 
        try {
            const response = await fetch(
                `http://localhost:8082/api/floors/update/${floorId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedFloor),
                }
            );
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Floor updated successfully!",
                    timer: 3000,
                    showCloseButton: true,
                });
            } else {
                console.error("Update failed:", response.statusText); // Log any errors
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Failed to update floor!",
                    showCloseButton: true,
                });
            }
        } catch (error) {
            console.error("Error while updating floor: ", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong. Please try again later!",
                showCloseButton: true,
            });
        }
    };
    

    // Update room details
    const updateRoomDetails = async (roomId, floorIndex, roomIndex) => {
        const updatedRoom = updatedProperty.floors[floorIndex].rooms[roomIndex];
        try {
            const response = await fetch(
                `http://localhost:8082/api/rooms/update/${roomId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedRoom),
                }
            );
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Room updated successfully!",
                    timer: 3000,
                    showCloseButton: true,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Failed to update room!",
                    showCloseButton: true,
                });
            }
        } catch (error) {
            console.error("Error while updating room: ", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong. Please try again later!",
                showCloseButton: true,
            });
        }
    };

    // Update property details
    const updatePropertyDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:8082/api/properties/update/${updatedProperty.id}`,
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

const  handleRoomClick=(property)=>{

    navigate(`/dashboard/rooms/${property.id}`,{ state: { updatedProperty: property } })
    console.log( "the property id is ",property.id);
}
    return (
        <div>
            {updatedProperty && (
                <div>
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
                            name="pincode"
                            value={updatedProperty.pincode}
                            onChange={handlePropertyChange}
                            placeholder="Pincode"
                        />
                        <button onClick={updatePropertyDetails}>Update Property</button>
                    </div>

                    <button onClick={() => setIsAddFloorsOpen(true)}>Add Floors</button>

                    {isAddFloorsOpen && <AddFloors  className="addFloors" onSubmit={handleFloorsSubmit} />}
                    {isAddRoomsOpen && (
  <AddRooms
    floors={newlyAddedFloors}
    onSubmit={handleRoomsSubmit}
  />
)}
                    <button onClick={()=>handleRoomClick(updatedProperty)} style={{margin:"20px"}}>Rooms Details</button>
                    {/* Floor Section */}
                    {/* {updatedProperty.floors.map((floor, index) => (
                        <div key={floor.id}>
                            <h3>Floor Information</h3>
                            <input
                                type="text"
                                name="floorName"
                                value={floor.floorName}
                                onChange={(e) => handleFloorChange(index, e)}
                                placeholder="Floor Name"
                            />

                           

                            {floor.rooms.map((room, roomIndex) => (
                               <div key={room.id} className="rooms-info">
                               <h4>Room Information</h4>
                               <div className="room-shares">
                                   <label>
                                       Single share
                                       <input
                                           type="number"
                                           name="singleShare"
                                           value={room.singleShare}
                                           onChange={(e) => handleRoomChange(index, roomIndex, e)}
                                           placeholder="Single Share"
                                       />
                                   </label>
                                   <label>
                                       Double share
                                       <input
                                           type="number"
                                           name="doubleShare"
                                           value={room.doubleShare}
                                           onChange={(e) => handleRoomChange(index, roomIndex, e)}
                                           placeholder="Double Share"
                                       />
                                   </label>
                                   <label>
                                       Triple share
                                       <input
                                           type="number"
                                           name="tripleShare"
                                           value={room.tripleShare}
                                           onChange={(e) => handleRoomChange(index, roomIndex, e)}
                                           placeholder="Triple Share"
                                       />
                                   </label>
                                   <label>
                                       Triple Plus Share
                                       <input
                                           type="number"
                                           name="triplePlus"
                                           value={room.triplePlus}
                                           onChange={(e) => handleRoomChange(index, roomIndex, e)}
                                           placeholder="Triple Plus Share"
                                       />
                                   </label>
                               </div>
                               <button onClick={() => updateRoomDetails(room.id, index, roomIndex)}>
                                   Update Room
                               </button>
                           </div>
                           
                            ))}
                        </div>
                    ))} */}
                </div>
            )}
        </div>
    );
}

export default PropertyDetails;
