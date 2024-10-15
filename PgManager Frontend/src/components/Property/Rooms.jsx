//   import { useState, useEffect } from 'react';
//   import axios from 'axios';
//   import HotelIcon from '@mui/icons-material/Hotel';
//   import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
//   import './Rooms.css'; // Import the custom CSS file
// import { useLocation } from 'react-router-dom';

//   function Rooms() {
//     const location = useLocation();
//     const { updatedProperty: initialProperty } = location.state || {};
//     const [propertyData, setPropertyData] = useState(null);
//     const [shareCounts, setShareCounts] = useState({
//       singleShare: 0,
//       doubleShare: 0,
//       tripleShare: 0,
//       triplePlus: 0,
//     });
//     const [selectedFloor, setSelectedFloor] = useState(''); // Floor selection state

//     useEffect(() => {
//       const fetchPropertyData = async () => {
//         try {
//           const response = await axios.get(`http://localhost:8082/api/properties/get/${initialProperty.id}`);
//           const data = response.data;
//           setPropertyData(data);

//           // Calculate the total counts across all floors (initial load)
//           let singleShareCount = 0;
//           let doubleShareCount = 0;
//           let tripleShareCount = 0;
//           let triplePlusCount = 0;

//           data.floors.forEach((floor) => {
//             floor.rooms.forEach((room) => {
//               singleShareCount += room.singleShare;
//               doubleShareCount += room.doubleShare;
//               tripleShareCount += room.tripleShare;
//               triplePlusCount += room.triplePlus;
//             });
//           });

//           setShareCounts({
//             singleShare: singleShareCount,
//             doubleShare: doubleShareCount,
//             tripleShare: tripleShareCount,
//             triplePlus: triplePlusCount,
//           });
//         } catch (error) {
//           console.error('Error fetching property data:', error);
//         }
//       };

//       fetchPropertyData();
//     }, []);

//     // Handle dropdown floor change
//     const handleFloorChange = (event) => {
//       const selectedFloorId = event.target.value;
//       setSelectedFloor(selectedFloorId);

//       // Find the selected floor data
//       const selectedFloorData = propertyData.floors.find((floor) => floor.id === selectedFloorId);
      
//       // Calculate share counts for the selected floor
//       let singleShareCount = 0;
//       let doubleShareCount = 0;
//       let tripleShareCount = 0;
//       let triplePlusCount = 0;

//       if (selectedFloorData) {
//         selectedFloorData.rooms.forEach((room) => {
//           singleShareCount += room.singleShare;
//           doubleShareCount += room.doubleShare;
//           tripleShareCount += room.tripleShare;
//           triplePlusCount += room.triplePlus;
//         });
//       }

//       setShareCounts({
//         singleShare: singleShareCount,
//         doubleShare: doubleShareCount,
//         tripleShare: tripleShareCount,
//         triplePlus: triplePlusCount,
//       });
//     };

//     const renderBedIcons = (count) => {
//       return Array(count)
//         .fill(null)
//         .map((_, index) => <HotelIcon key={index} />);
//     };

//     if (!propertyData) {
//       return <div>Loading...</div>;
//     }

//     const totalCount = shareCounts.singleShare + shareCounts.doubleShare + shareCounts.tripleShare + shareCounts.triplePlus;

//     return (
//       <div className="rooms-container">
//         <h2>Property Name: {propertyData.name}</h2>
//         <h4>Owner: {propertyData.ownerName}</h4>

//         <FormControl fullWidth variant="outlined" className="floor-select">
//           <InputLabel>Select Floor</InputLabel>
//           <Select value={selectedFloor} onChange={handleFloorChange} label="Select Floor">
//             {propertyData.floors.map((floor) => (
//               <MenuItem key={floor.id} value={floor.id}>
//                 {floor.floorName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <h3>Total Bed Count for Selected Floor: {totalCount}</h3>

//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={4}>
//           <Card className="share-card">
//   <CardContent>
//     {shareCounts.singleShare > 0 && (
//       <>
//         <Typography variant="h6">Single Share</Typography>
//         <Typography variant="body2">Count: {shareCounts.singleShare}</Typography>
//         <div className="icons">{renderBedIcons(1)}</div>
//       </>
//     )}

//     {shareCounts.doubleShare > 0 && (
//       <>
//         <Typography variant="h6">Double Share</Typography>
//         <Typography variant="body2">Count: {shareCounts.doubleShare}</Typography>
//         <div className="icons">{renderBedIcons(2)}</div>
//       </>
//     )}

//     {shareCounts.tripleShare > 0 && (
//       <>
//         <Typography variant="h6">Triple Share</Typography>
//         <Typography variant="body2">Count: {shareCounts.tripleShare}</Typography>
//         <div className="icons">{renderBedIcons(3)}</div>
//       </>
//     )}

//     {shareCounts.triplePlus > 0 && (
//       <>
//         <Typography variant="h6">Triple Plus Share</Typography>
//         <Typography variant="body2">Count: {shareCounts.triplePlus}</Typography>
//         <div className="icons">{renderBedIcons(4)}</div>
//       </>
//     )}
//   </CardContent>
// </Card>

//           </Grid>
         
          
        
//         </Grid>
//       </div>
//     );
//   }

//   export default Rooms;
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import HotelIcon from '@mui/icons-material/Hotel';
// import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import './Rooms.css'; // Import the custom CSS file
// import { useLocation } from 'react-router-dom';

// function Rooms() {
//   const location = useLocation();
//   const { updatedProperty: initialProperty } = location.state || {};
//   const [propertyData, setPropertyData] = useState(null);
//   const [selectedFloor, setSelectedFloor] = useState(''); // Floor selection state

//   useEffect(() => {
//     const fetchPropertyData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8082/api/properties/get/${initialProperty.id}`);
//         const data = response.data;
//         setPropertyData(data);

//         // Set default floor to Ground Floor
//         const groundFloor = data.floors.find(floor => floor.floorName.toLowerCase() === 'ground floor');
//         setSelectedFloor(groundFloor ? groundFloor.id : data.floors[0].id); // Fallback to the first floor if Ground Floor is not found
//       } catch (error) {
//         console.error('Error fetching property data:', error);
//       }
//     };

//     fetchPropertyData();
//   }, [initialProperty.id]);

//   // Handle dropdown floor change
//   const handleFloorChange = (event) => {
//     setSelectedFloor(event.target.value);
//   };

//   if (!propertyData) {
//     return <div>Loading...</div>;
//   }

//   // Find the selected floor data
//   const selectedFloorData = propertyData.floors.find((floor) => floor.id === selectedFloor);

//   return (
//     <div className="rooms-container">
//       <h2>Property Name: {propertyData.name}</h2>
//       <h4>Owner: {propertyData.ownerName}</h4>

//       <FormControl fullWidth variant="outlined" className="floor-select">
//         <InputLabel>Select Floor</InputLabel>
//         <Select value={selectedFloor} onChange={handleFloorChange} label="Select Floor">
//           {propertyData.floors.map((floor) => (
//             <MenuItem key={floor.id} value={floor.id}>
//               {floor.floorName}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {selectedFloor && selectedFloorData && (
//         <Grid container spacing={3} className="rooms-grid">
//           {selectedFloorData.rooms.map((room) => (
//             <Grid item xs={12} sm={6} md={4} key={room.id}>
//               <Card className="room-card">
//                 <CardContent>
//                   <Typography variant="h6" style={{color:"black"}}>Room {room.roomNumber} - {room.sharingType}</Typography>
//                   <div className="beds">
//                     {room.beds.map((bed) => (
//                       <div
//                         key={bed.id}
//                         className={`bed-icon ${bed.available ? 'available' : 'unavailable'}`}
//                         style={{
//                           color: bed.available ? 'white' : 'black',
//                         }}
//                       >
//                         <HotelIcon />
//                         <Typography variant="body2" style={{color:"black"}}>{bed.bedNumber}</Typography>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </div>
//   );
// }

// export default Rooms;



import { useState, useEffect } from 'react';
import axios from 'axios';
import HotelIcon from '@mui/icons-material/Hotel';
import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './Rooms.css';
import { useLocation } from 'react-router-dom';

function Rooms() {
  const location = useLocation();
  const { updatedProperty: initialProperty } = location.state || {};
  const [propertyData, setPropertyData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/properties/get/${initialProperty.id}`);
        const data = response.data;
        setPropertyData(data);

        const groundFloor = data.floors.find(floor => floor.floorName.toLowerCase() === 'ground floor');
        setSelectedFloor(groundFloor ? groundFloor.id : data.floors[0].id);
      } catch (error) {
        console.error('Error fetching property data:', error);
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

  const selectedFloorData = propertyData.floors.find((floor) => floor.id === selectedFloor);

  const generateRoomNumbers = (floorData) => {
    const roomNumbers = {};
    floorData.rooms.forEach((room) => {
      const floorCode = floorData.floorName === 'Ground Floor' ? 'G1' : floorData.floorName.replace(' Floor', '').trim();
      const sharingType = room.sharingType.toLowerCase();

      if (!roomNumbers[sharingType]) {
        roomNumbers[sharingType] = 0;
      }
      roomNumbers[sharingType]++;

      room.roomNumber = `${floorCode}${roomNumbers[sharingType]}`;
    });
  };

  if (selectedFloorData) {
    generateRoomNumbers(selectedFloorData);
  }

  const roomOrder = ['single', 'double', 'triple', 'triple plus'];

  const sortedRooms = selectedFloorData.rooms.sort((a, b) => {
    const indexA = roomOrder.indexOf(a.sharingType.toLowerCase());
    const indexB = roomOrder.indexOf(b.sharingType.toLowerCase());
    return indexA - indexB;
  });

  // Calculate bed counts for the selected floor
  const totalBeds = sortedRooms.reduce((acc, room) => acc + room.beds.length, 0);
  const occupiedBeds = sortedRooms.reduce(
    (acc, room) => acc + room.beds.filter((bed) => !bed.available).length,
    0
  );
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <div className="rooms-container">
      <h2>Property Name: {propertyData.name}</h2>
      <h4>Owner: {propertyData.ownerName}</h4>

      <FormControl fullWidth variant="outlined" className="floor-select">
        <InputLabel>Select Floor</InputLabel>
        <Select value={selectedFloor} onChange={handleFloorChange} label="Select Floor">
          {propertyData.floors.map((floor) => (
            <MenuItem key={floor.id} value={floor.id}>
              {floor.floorName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFloor && selectedFloorData && (
        <>
          <div className="bed-summary">
  <Typography variant="h6" style={{ display: "flex", alignItems: "center", color: "blue" }}>
    <HotelIcon style={{ marginRight: "5px" }} />: {totalBeds}
  </Typography>
  <Typography variant="h6" style={{ display: "flex", alignItems: "center", color: "red" }}>
    <HotelIcon style={{ marginRight: "5px" }} />: {occupiedBeds}
  </Typography>
  <Typography variant="h6" style={{ display: "flex", alignItems: "center", color: "green" }}>
    <HotelIcon style={{ marginRight: "5px" }} />: {availableBeds}
  </Typography>
</div>


          <Grid container spacing={3} className="rooms-grid">
            {sortedRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card className="room-card">
                  <CardContent>
                    <Typography variant="h6" style={{ color: "black" }}>
                      Room {room.roomNumber} - {room.sharingType}
                    </Typography>
                    <div className="beds">
                      {room.beds.map((bed) => (
                        <div
                          key={bed.id}
                          className={`bed-icon ${bed.available ? 'available' : 'unavailable'}`}
                          style={{
                            color: bed.available ? 'white' : 'black',
                          }}
                        >
                          <HotelIcon />
                          <Typography variant="body2" style={{ color: "black" }}>
                            {bed.bedNumber}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}

export default Rooms;


