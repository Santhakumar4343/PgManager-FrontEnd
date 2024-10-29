// src/API/Api.jsx
import axios from 'axios';

 export const API_URL = 'http://localhost:8082'; 

export const createProperty = async (property) => {
    const response = await axios.post(`${API_URL}/api/properties/save`, property);
    return response.data;
};

export const createFloor = async (propertyId, floor) => {
    const response = await axios.post(`${API_URL}/api/floors/save/${propertyId}`, floor);
    return response.data;
};

export const createRoom = async (floorId, room) => {
    const response = await axios.post(`${API_URL}/api/rooms/save/${floorId}`, room);
    return response.data;
};
