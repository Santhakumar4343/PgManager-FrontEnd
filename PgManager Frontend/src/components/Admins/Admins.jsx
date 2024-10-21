import { Modal, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Admins.css";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';

function Admins() {
  const [addSupervisorModal, setAddSupervisorModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    panNumber: "",
    aadharNumber: "",
    presentAddress: "",
    permanentAddress: "",
    aadharcard: null,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch("http://localhost:8082/api/admins/getAll");
      const data = await response.json();
      setAdmins(data);
    };
    fetchProperties();
  }, []);

  const handleAddSupervisor = () => {
    setEditMode(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      mobileNumber: "",
      panNumber: "",
      aadharNumber: "",
      presentAddress: "",
      permanentAddress: "",
      aadharcard: null,
    });
    setAddSupervisorModal(true);
  };

  const handleEditSupervisor = (admin) => {
    setEditMode(true);
    setSelectedSupervisorId(admin.id);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: admin.password,
      mobileNumber: admin.mobileNumber,
      panNumber: admin.panNumber,
      aadharNumber: admin.aadharNumber,
      presentAddress: admin.presentAddress,
      permanentAddress: admin.permanetAddress,
      aadharcard: null,
    });
    setAddSupervisorModal(true);
  };

  const handleClose = () => {
    setAddSupervisorModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, aadharcard: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("mobileNumber", formData.mobileNumber);
    form.append("panNumber", formData.panNumber);
    form.append("aadharNumber", formData.aadharNumber);
    form.append("presentAddress", formData.presentAddress);
    form.append("permanentAddress", formData.permanentAddress);
    form.append("file", formData.aadharcard);

    try {
      if (editMode) {
        await axios.put(`http://localhost:8082/api/admins/update/${selectedSupervisorId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Supervisor updated successfully!");
      } else {
        await axios.post("http://localhost:8082/api/admins/save", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Supervisor added successfully!");

      }
      handleClose();
      location.reload()
      // Refresh the list after adding/updating
    } catch (error) {
      console.error("Error saving supervisor", error);
      alert("Failed to add/update supervisor. Please try again.");
    }
  };

  
  const deleteSupervisor = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8082/api/admins/delete/${id}`);
        Swal.fire(
          'Deleted!',
          'Supervisor has been deleted.',
          'success'
        );
        location.reload(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting supervisor", error);
        Swal.fire(
          'Error!',
          'Failed to delete supervisor. Please try again.',
          'error'
        );
      }
    }
  };
  
  

  return (
    <div className="admin-container">
      <div className="add-supervisor">
        <button onClick={handleAddSupervisor}>Add Supervisor</button>
        <input
          className="search-Property"
          placeholder="Search by supervisor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-cards">
        {admins
          .filter((admin) =>
            admin.username.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((admin) => (
            <div key={admin.id} className="admin-card">
              <h2>{admin.username}</h2>
              <p>Email: {admin.email}</p>
              <p>Mobile Number: {admin.mobileNumber}</p>
              <p>PAN Number: {admin.panNumber}</p>
              <p>Present Address: {admin.presentAddress}</p>
              <p>Permanent Address: {admin.permanetAddress}</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <DeleteForeverIcon
                  style={{ cursor: "pointer",  }}
                  onClick={() => deleteSupervisor(admin.id)}
                />
                <EditIcon
                  style={{ cursor: "pointer", }}
                  onClick={() => handleEditSupervisor(admin)}
                />
              </div>
            </div>
          ))}
      </div>
      <Modal
        open={addSupervisorModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
     
      >
        <div className="modal-content">
        <h2 style={{textAlign:"center"}}>{editMode ? "Edit Supervisor" : "Add a Supervisor"}</h2>
          <form className="modal-form">
            <div className="modal-row">
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
            <div className="modal-row">
              
            {!editMode && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        )}
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
            <div className="modal-row">
              <TextField
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Aadhar Number"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
            <div className="modal-row">
              <TextField
                label="Present Address"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              
              onChange={handleFileChange}
              style={{ margin: "10px 0" }}
            />
          <div className="button-row">

          <Button
                variant="contained"
                onClick={handleClose}
                className="action-button"
              >
                Close
              </Button>
              
              <Button className="action-button" variant="contained" color="primary" onClick={handleSubmit}>
                {editMode ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
          
        </div>
      </Modal>
    </div>
  );
}

export default Admins;
