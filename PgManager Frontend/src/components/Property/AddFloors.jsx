import { useState } from 'react';
import PropTypes from 'prop-types';
import './AddFloors.css'; // Import the custom CSS

function AddFloors({ onSubmit }) {
    const [numberOfFloors, setNumberOfFloors] = useState(0);

    const handleNumberChange = (e) => {
        setNumberOfFloors(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(numberOfFloors);
    };

    return (
        <form onSubmit={handleSubmit} className="add-floors-form">
            <h2>Add Floors</h2>
            <input
                type="number"
                value={numberOfFloors}
                onChange={handleNumberChange}
                min="1"
                required
            />
            <button type="submit">Add Floors</button>
        </form>
    );
}

AddFloors.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default AddFloors;
