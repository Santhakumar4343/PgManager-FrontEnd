// src/API/Api.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8082/api'; 

export const createProperty = async (property) => {
    const response = await axios.post(`${API_URL}/properties/save`, property);
    return response.data;
};

export const createFloor = async (propertyId, floor) => {
    const response = await axios.post(`${API_URL}/floors/save/${propertyId}`, floor);
    return response.data;
};

export const createRoom = async (floorId, room) => {
    const response = await axios.post(`${API_URL}/rooms/save/${floorId}`, room);
    return response.data;
};
