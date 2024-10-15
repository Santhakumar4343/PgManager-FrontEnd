import { useState } from 'react';
import PropTypes from 'prop-types';
import "../../components/Property/AddRooms.css";
import axios from 'axios'; // Import axios for making HTTP requests

function AddRooms({ floors, onSubmit }) {
    const [rooms, setRooms] = useState(
        floors.map((floor) => ({
            floorId: floor.id,
            singleShare: 0,
            doubleShare: 0,
            tripleShare: 0,
            triplePlus: 0,
        }))
    );

    // Handle input changes for room sharing counts
    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...rooms];
        updatedRooms[index][field] = value; 
        setRooms(updatedRooms);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out rooms with zero counts for all sharing types
        const validRooms = rooms.filter(
            (room) =>
                room.singleShare > 0 ||
                room.doubleShare > 0 ||
                room.tripleShare > 0 ||
                room.triplePlus > 0
        );

        if (validRooms.length === 0) {
            alert('Please enter at least one room count greater than 0.');
            return;
        }

        console.log('Submitting the following rooms:', validRooms);

        try {
            // Loop through each valid room and make a request to create rooms and beds
            for (const room of validRooms) {
                const { floorId, singleShare, doubleShare, tripleShare, triplePlus } = room;

                // Create rooms for each sharing type with their respective bed counts
                const roomTypes = [
                    { sharingType: "Single", bedCount: singleShare },
                    { sharingType: "Double", bedCount: doubleShare },
                    { sharingType: "Triple", bedCount: tripleShare },
                    { sharingType: "Triple Plus", bedCount: triplePlus },
                ];

                // Filter out room types with a bed count greater than zero and make API requests
                const roomRequests = roomTypes
                    .filter((rt) => rt.bedCount > 0)
                    .map(async (rt) => {
                        const { sharingType, bedCount } = rt;

                        try {
                            // Make the API request to create rooms
                            const response = await axios.post(`http://localhost:8082/api/rooms/save/${floorId}`, [ // Sending an array
                                { sharingType, bedCount }
                            ]);
                            if (response.status === 201) {
                                console.log(`Room created: ${response.data.roomNumber} with ${bedCount} beds.`);
                            } else {
                                console.warn(`Failed to create room of type ${sharingType} on floor ${floorId}.`);
                            }
                        } catch (error) {
                            console.error(`Error creating room of type ${sharingType} on floor ${floorId}:`, error);
                        }
                    });

                // Execute all room creation requests in parallel for the current floor
                await Promise.all(roomRequests);
            }

            alert('Rooms added successfully!');
            onSubmit(validRooms); // Optionally, call onSubmit to refresh or update the parent state
        } catch (error) {
            console.error('Error adding rooms:', error);
            alert('An error occurred while adding rooms.');
        }
    };

    return (
        <div className="add-rooms-container">
            <form onSubmit={handleSubmit}>
                <h2>Add Rooms</h2>
                {floors.map((floor, index) => (
                    <div key={floor.id} className="room-entry">
                        <h4>{floor.floorName}</h4>
                        <div className="room-details">
                            <label className="label">
                                Single Share:
                                <input
                                    type="number"
                                    min="0"
                                    value={rooms[index].singleShare}
                                    onChange={(e) =>
                                        handleRoomChange(index, 'singleShare', parseInt(e.target.value, 10))
                                    }
                                    required
                                />
                            </label>
                            <label className="label">
                                Double Share:
                                <input
                                    type="number"
                                    min="0"
                                    value={rooms[index].doubleShare}
                                    onChange={(e) =>
                                        handleRoomChange(index, 'doubleShare', parseInt(e.target.value, 10))
                                    }
                                    required
                                />
                            </label>
                        </div>
                        <div className="room-details">
                            <label className="label">
                                Triple Share:
                                <input
                                    type="number"
                                    min="0"
                                    value={rooms[index].tripleShare}
                                    onChange={(e) =>
                                        handleRoomChange(index, 'tripleShare', parseInt(e.target.value, 10))
                                    }
                                    required
                                />
                            </label>
                            <label className="label">
                                Triple Plus:
                                <input
                                    type="number"
                                    min="0"
                                    value={rooms[index].triplePlus}
                                    onChange={(e) =>
                                        handleRoomChange(index, 'triplePlus', parseInt(e.target.value, 10))
                                    }
                                    required
                                />
                            </label>
                        </div>
                    </div>
                ))}
                <button type="submit">Submit Rooms</button>
            </form>
        </div>
    );
}

AddRooms.propTypes = {
    floors: PropTypes.arrayOf(
        PropTypes.shape({
            floorName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired, // This is where you pass your own function to handle room submission
};

export default AddRooms;
