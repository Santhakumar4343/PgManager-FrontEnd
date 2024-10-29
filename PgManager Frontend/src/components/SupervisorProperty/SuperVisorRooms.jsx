import { useState, useEffect } from "react";
import axios from "axios";
import HotelIcon from "@mui/icons-material/Hotel";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  TextField,
  Modal,
  ListItem,
  Button,
  Tooltip,
} from "@mui/material";
import "../Property/Rooms.css";
import { useLocation } from "react-router-dom";
import WindowIcon from "@mui/icons-material/Window";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import BathtubIcon from "@mui/icons-material/Bathtub";
import { API_URL } from "../API/Api";
function SupervisorRooms() {
  const location = useLocation();
  const { updatedProperty: initialProperty } = location.state || {};
  const [propertyData, setPropertyData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  


  const [isSearched, setIsSearched] = useState(false);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/getAll`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/properties/get/${initialProperty.id}`
      );
      const data = response.data;
      setPropertyData(data);

      const groundFloor = data.floors.find(
        (floor) => floor.floorName.toLowerCase() === "ground floor"
      );
      setSelectedFloor(groundFloor ? groundFloor.id : data.floors[0].id);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setOpenModal(true);
    fetchUsers();
  };

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/properties/get/${initialProperty.id}`
        );
        const data = response.data;
        setPropertyData(data);

        const groundFloor = data.floors.find(
          (floor) => floor.floorName.toLowerCase() === "ground floor"
        );
        setSelectedFloor(groundFloor ? groundFloor.id : data.floors[0].id);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [initialProperty.id]);

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  const selectedFloorData = propertyData.floors.find(
    (floor) => floor.id === selectedFloor
  );

  const roomOrder = ["single", "double", "triple", "triple plus"];
  const sortedRooms = selectedFloorData.rooms.sort((a, b) => {
    const sharingTypeA = a.sharingType ? a.sharingType.toLowerCase() : "";
    const sharingTypeB = b.sharingType ? b.sharingType.toLowerCase() : "";

    const indexA = roomOrder.indexOf(sharingTypeA);
    const indexB = roomOrder.indexOf(sharingTypeB);

    // Handle cases where sharingType is not found in roomOrder
    const safeIndexA = indexA === -1 ? roomOrder.length : indexA;
    const safeIndexB = indexB === -1 ? roomOrder.length : indexB;

    return safeIndexA - safeIndexB;
  });

  const handleUserSelect = async (user) => {
    try {
      await axios.post(
        `${API_URL}/api/beds/${selectedBed.id}/assign-user/${user.id}`
      );
      alert(`User ${user.username} assigned to bed ${selectedBed.bedNumber}`);
      location.reload()
      setOpenModal(false);
    } catch (error) {
      console.error("Error assigning user to bed:", error);
      alert("Failed to assign user to the bed.");
    }
  };

  

const renderRoomLayout = (room) => {
  if (!room || !room.sharingType) {
    console.error("Room or room.sharingType is undefined", room);
    return null;
  }

  const getTooltipTitle = (bed) => {
    return bed.assignedUser ? `Assigned to  ${bed.assignedUser.username}` : "No user assigned";
  };

  switch (room.sharingType.toLowerCase()) {
    case "single":
      return (
        <div className="room-layout single-room">
          <WindowIcon className="single-window" style={{ gridArea: "window" }} />
          <BathtubIcon className="bathroom" style={{ gridArea: "bathroom" }} />
          <div className="single-room-beds" style={{ gridArea: "room-beds" }}>
            {room.beds.map((bed) => (
              <Tooltip style={{}} key={bed.id} title={getTooltipTitle(bed)}>
                <div className={`bed-icon ${bed.available ? "available" : "unavailable"}`}>
                  <HotelIcon
                    style={{ color: bed.available ? "green" : "red" }}
                    onClick={() => handleBedClick(bed)}
                  />
                  <Typography variant="body2">{bed.bedNumber}</Typography>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      );

    case "double":
      return (
        <div className="room-layout double-room">
          <WindowIcon className="double-window" style={{ gridArea: "window" }} />
          <BathtubIcon className="double-bathroom" style={{ gridArea: "bathroom" }} />
          <div className="double-room-beds" style={{ gridArea: "room-beds" }}>
            {room.beds.map((bed) => (
              <Tooltip key={bed.id} title={getTooltipTitle(bed)}>
                <div className={`bed-icon ${bed.available ? "available" : "unavailable"}`}>
                  <HotelIcon
                    style={{ color: bed.available ? "green" : "red" }}
                    onClick={() => handleBedClick(bed)}
                  />
                  <Typography variant="body2">{bed.bedNumber}</Typography>
                </div>
              </Tooltip>
            ))}
          </div>
          <DoorSlidingIcon className="double-entrance" style={{ gridArea: "entrance" }} />
        </div>
      );

    case "triple":
      return (
        <div className="room-layout triple-room">
          <WindowIcon className="triple-window" style={{ gridArea: "window" }} />
          <BathtubIcon className="triple-bathroom" style={{ gridArea: "bathroom" }} />
          <div className="triple-room-beds" style={{ gridArea: "room-beds" }}>
            {room.beds.map((bed) => (
              <Tooltip key={bed.id} title={getTooltipTitle(bed)}>
                <div className={`bed-icon ${bed.available ? "available" : "unavailable"}`}>
                  <HotelIcon
                    style={{ color: bed.available ? "green" : "red" }}
                    onClick={() => handleBedClick(bed)}
                  />
                  <Typography variant="body2">{bed.bedNumber}</Typography>
                </div>
              </Tooltip>
            ))}
          </div>
          <DoorSlidingIcon className="triple-entrance" style={{ gridArea: "entrance" }} />
        </div>
      );

    case "triple plus":
      return (
        <div className="room-layout triple-plus-room">
          <WindowIcon className="tripleplus-window" style={{ gridArea: "window" }} />
          <BathtubIcon className="tripleplus-bathroom" style={{ gridArea: "bathroom" }} />
          <div className="tripleplus-room-beds" style={{ gridArea: "room-beds" }}>
            {room.beds.map((bed) => (
              <Tooltip key={bed.id} title={getTooltipTitle(bed)}>
                <div className={`bed-icon ${bed.available ? "available" : "unavailable"}`}>
                  <HotelIcon
                    style={{ color: bed.available ? "green" : "red" }}
                    onClick={() => handleBedClick(bed)}
                  />
                  <Typography variant="body2">{bed.bedNumber}</Typography>
                </div>
              </Tooltip>
            ))}
          </div>
          <DoorSlidingIcon className="entrance" style={{ gridArea: "entrance" }} />
        </div>
      );

    default:
      return null;
  }
};


  const handleSearch = () => {
    const foundUser = users.find((user) => user.mobileNumber === searchQuery);
    setSearchResult(foundUser ? foundUser.username : null); // Set search result or null
    setIsSearched(true);
  };
  return (
    <div className="rooms-container">
      <h2 style={{ textAlign: "center" }}>
        Property Name: {propertyData.name}
      </h2>
      <h4 style={{ textAlign: "center" }}>Owner: {propertyData.ownerName}</h4>

      <FormControl variant="outlined" className="floor-select">
        <InputLabel>Select Floor</InputLabel>
        <Select
          value={selectedFloor}
          onChange={handleFloorChange}
          label="Select Floor"
        >
          {propertyData.floors.map((floor) => (
            <MenuItem key={floor.id} value={floor.id}>
              {floor.floorName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFloor && selectedFloorData && (
        <div className="room-card">
          {sortedRooms.map((room) => (
            <div key={room.id}>{renderRoomLayout(room)}</div>
          ))}
        </div>
      )}

      <Modal
        className="modal"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="modal-container">
          <h3>Assign User to Bed {selectedBed?.bedNumber}</h3>
          <TextField
            label="Enter User Mobile Number"
            style={{ borderRadius: "50px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Search
          </Button>

          {searchResult && isSearched ? ( 
            <List>
              <ListItem
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid black",
                  width: "80%",
                  marginLeft: "40px",
                }}
                button
                onClick={() => {
                  const foundUser = users.find(
                    (user) => user.username === searchResult
                  );
                  if (foundUser) {
                    handleUserSelect(foundUser);
                  }
                }}
              >
                {searchResult}
              </ListItem>
            </List>
          ) : isSearched ? (
            <p style={{ marginLeft: "30px" }}>No result found</p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

export default SupervisorRooms;
