import { useState, useEffect } from "react";
import axios from "axios";
import HotelIcon from "@mui/icons-material/Hotel";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./Rooms.css";
import { useLocation } from "react-router-dom";
import WindowIcon from '@mui/icons-material/Window';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import BathtubIcon from '@mui/icons-material/Bathtub';
function Rooms() {
  const location = useLocation();
  const { updatedProperty: initialProperty } = location.state || {};
  const [propertyData, setPropertyData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState("");

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/api/properties/get/${initialProperty.id}`
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
    const indexA = roomOrder.indexOf(a.sharingType.toLowerCase());
    const indexB = roomOrder.indexOf(b.sharingType.toLowerCase());
    return indexA - indexB;
  });

  // const renderRoomLayout = (room) => {
  //   return (
  //     <div className="room-layout">
  //       <div className="window">Window</div>
  //       <div className="room-beds">
  //         {room.beds.map((bed) => (
  //           <div
  //             key={bed.id}
  //             className={`bed-icon ${
  //               bed.available ? "available" : "unavailable"
  //             }`}
  //           >
  //             <HotelIcon style={{ color: bed.available ? "green" : "red" }} />
  //             <Typography variant="body2">{bed.bedNumber}</Typography>
  //           </div>
  //         ))}
  //       </div>
  //       <div className="bathroom">Bathroom</div>
  //       <div className="entrance">Entrance</div>
  //     </div>
  //   );
  // };
  const renderRoomLayout = (room) => {
    switch (room.sharingType.toLowerCase()) {
      case "single":
        return (
          <div className="room-layout single-room">
          <WindowIcon className="single-window" style={{ gridArea: 'window' }} />
          
          <BathtubIcon className="bathroom" style={{ gridArea: 'bathroom' }} />
          
          <div className="single-room-beds" style={{ gridArea: 'room-beds' }}>
            <div className="bed-container top-bed">
              {room.beds.length > 0 && (
                <div
                  key={room.beds[0].id}
                  className={`bed-icon ${room.beds[0].available ? "available" : "unavailable"}`}
                >
                  <HotelIcon 
                    style={{ color: room.beds[0].available ? "green" : "red" }} 
                    onClick={() => { alert("Assign bed "); }} 
                  />
                  <Typography variant="body2">{room.beds[0].bedNumber}</Typography>
                </div>
              )}
            </div>
            
            <div className="bed-container bottom-bed">
              {room.beds.length > 1 && (
                <div
                  key={room.beds[1].id}
                  className={`bed-icon ${room.beds[1].available ? "available" : "unavailable"}`}
                >
                  <HotelIcon 
                    style={{ color: room.beds[1].available ? "green" : "red" }} 
                    onClick={() => { alert("Assign bed "); }} 
                  />
                  <Typography variant="body2">{room.beds[1].bedNumber}</Typography>
                </div>
              )}
            </div>
          </div>
        
          <DoorSlidingIcon className="single-entrance" style={{ gridArea: 'entrance' }} />
        </div>
        
        );
      case "double":
        return (
          <div className="room-layout double-room">
  <WindowIcon className="double-window" style={{ gridArea: 'window' }} />
  <BathtubIcon className="double-bathroom" style={{ gridArea: 'bathroom' }} />
  
  <div className="double-room-beds" style={{ gridArea: 'room-beds' }}>
    <div className="bed-container top-bed">
      {room.beds.length > 0 && (
        <div
          key={room.beds[0].id}
          className={`bed-icon ${room.beds[0].available ? "available" : "unavailable"}`}
        >
          <HotelIcon style={{ color: room.beds[0].available ? "green" : "red" }} />
          <Typography variant="body2">{room.beds[0].bedNumber}</Typography>
        </div>
      )}
    </div>
    
    <div className="bed-container bottom-bed">
      {room.beds.length > 1 && (
        <div
          key={room.beds[1].id}
          className={`bed-icon ${room.beds[1].available ? "available" : "unavailable"}`}
        >
          <HotelIcon style={{ color: room.beds[1].available ? "green" : "red" }} />
          <Typography variant="body2">{room.beds[1].bedNumber}</Typography>
        </div>
      )}
    </div>
  </div>

  <DoorSlidingIcon className="double-entrance" style={{ gridArea: 'entrance' }} />
</div>
        );
      case "triple":
        return (
          <div className="room-layout triple-room">
          <WindowIcon className="triple-window" style={{ gridArea: 'window' }} />
          
          <BathtubIcon className="triple-bathroom" style={{ gridArea: 'bathroom' }} />
          
          <div className="triple-room-beds" style={{ gridArea: 'room-beds' }}>
            <div className="bed-container top-bed">
              {room.beds.length > 0 && (
                <div
                  key={room.beds[0].id}
                  className={`bed-icon ${room.beds[0].available ? "available" : "unavailable"}`}
                >
                  <HotelIcon 
                    style={{ color: room.beds[0].available ? "green" : "red" }} 
                  />
                  <Typography variant="body2">{room.beds[0].bedNumber}</Typography>
                </div>
              )}
            </div>
            
            <div className="bed-container middle-bed">
              {room.beds.length > 1 && (
                <div
                  key={room.beds[1].id}
                  className={`bed-icon ${room.beds[1].available ? "available" : "unavailable"}`}
                >
                  <HotelIcon 
                    style={{ color: room.beds[1].available ? "green" : "red" }} 
                  />
                  <Typography variant="body2">{room.beds[1].bedNumber}</Typography>
                </div>
              )}
            </div>
        
            <div className="bed-container bottom-bed">
              {room.beds.length > 2 && (
                <div
                  key={room.beds[2].id}
                  className={`bed-icon ${room.beds[2].available ? "available" : "unavailable"}`}
                >
                  <HotelIcon 
                    style={{ color: room.beds[2].available ? "green" : "red" }} 
                  />
                  <Typography variant="body2">{room.beds[2].bedNumber}</Typography>
                </div>
              )}
            </div>
          </div>
        
          <DoorSlidingIcon className="triple-entrance" style={{ gridArea: 'entrance' }} />
        </div>
        
        );
      case "triple plus":
        return (
          <div className="room-layout triple-plus-room">
           
            < WindowIcon className="tripleplus-window"/>
            < BathtubIcon className="tripleplus-bathroom"/>
            <div className="tripleplus-room-beds">
              {room.beds.map((bed) => (
                <div
                  key={bed.id}
                  className={`bed-icon ${bed.available ? "available" : "unavailable"}`}
                >
                  <HotelIcon style={{ color: bed.available ? "green" : "red" }} />
                  <Typography variant="body2">{bed.bedNumber}</Typography>
                </div>
              ))}
            </div>
          
            < DoorSlidingIcon className="entrance"/>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="rooms-container">
      <h2 style={{textAlign:"center"}}>Property Name: {propertyData.name}</h2>
      <h4  style={{textAlign:"center"}}>Owner: {propertyData.ownerName}</h4>

      <FormControl  variant="outlined" className="floor-select">
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
        // <Grid container spacing={3} className="rooms-grid">
        //   {sortedRooms.map((room) => (
        //     <Grid item xs={12} sm={6} md={4} key={room.id}>
        //       <Card className="room-card">
        //         <CardContent>
        //           <Typography variant="h6">
        //             Room {room.roomNumber} - {room.sharingType}
        //           </Typography>
        //           {renderRoomLayout(room)}
        //         </CardContent>
        //       </Card>
        //     </Grid>
        //   ))}
        // </Grid>
        <div className="room-card">
  {sortedRooms.map((room) => (
    <div key={room.id} > 
      {renderRoomLayout(room)} 
    </div>
  ))}
</div>

      )}
    </div>
  );
}

export default Rooms;
