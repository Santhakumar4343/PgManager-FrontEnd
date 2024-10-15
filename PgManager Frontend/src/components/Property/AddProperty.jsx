// AddProperty.js
import  { useState } from 'react';
import PropTypes from 'prop-types';

function AddProperty({ onSubmit }) {
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ownerName, ownerEmail, pincode, ownerPhoneNumber });
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>Add Property</h2>
      <label>
        Owner Name:
        <input 
          type="text" 
          value={ownerName} 
          onChange={(e) => setOwnerName(e.target.value)} 
          required 
        />
      </label>
      <label>
        Owner Email:
        <input 
          type="email" 
          value={ownerEmail} 
          onChange={(e) => setOwnerEmail(e.target.value)} 
          required 
        />
      </label>
      <label>
        Pincode:
        <input 
          type="text" 
          value={pincode} 
          onChange={(e) => setPincode(e.target.value)} 
          required 
        />
      </label>
      <label>
        Owner Phone Number:
        <input 
          type="text" 
          value={ownerPhoneNumber} 
          onChange={(e) => setOwnerPhoneNumber(e.target.value)} 
          required 
        />
      </label>
      <button type="submit">Add Property</button>
    </form>
  );
}

export default AddProperty;
