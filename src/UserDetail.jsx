import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import userApis from './service/api/user'

const UserDetail = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);


  const API_BASE_URL = 'http://localhost:8000';

  const fetchUsers = async () => {
    try {
      const response = await userApis.getUsers();
      const users = response.data.data.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        password: user.password,
        contactNo: user.contactNo,
        skills: user.skills,
        address: `${user.address.line1}, ${user.address.city}, ${user.address.state}, ${user.address.zipCode}`,
      }));
      setRows(users);
      setUserInfo(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserDetail = () => {
    navigate("/adduser");
  };


  const handleEdit = (user) => {
    navigate(`/edituser/${user.id}`);
  };



  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userToDelete.id}`);
      console.log("User deleted:", response.data.message);
      fetchUsers();
      setOpenDialog(false);
      setSnackbarMessage("User deleted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setUserToDelete(null);
  };


  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 110
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 110
    },
    {
      field: "email",
      headerName: "Email",
      width: 200
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100
    },
    {
      field: "contactNo",
      headerName: "Contact No",
      width: 130
    },
    {
      field: "skills",
      headerName: "Skills",
      width: 140
    },
    {
      field: "address",
      headerName: "Address",
      width: 300
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <div>
      <div className="d-flex justify-content-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleAddUserDetail}
          sx={{ mb: 2 }}
        >
          <AddIcon />
          Add
        </Button>
      </div>

      <Box sx={{ height: 400, width: "100%" }}>
        {/* {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : ( */}
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />

      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
      >
        <div className="d-flex justify-content-between align-items-center p-2">
          <DialogTitle className="m-0">Confirm Deletion</DialogTitle>
          <CloseIcon className="cursor-pointer" onClick={handleCancelDelete} sx={{ cursor: 'pointer' }} />
        </div>

        <DialogContent>
          Are you sure you want to delete <span style={{ fontWeight: 'bolder' }}>{userToDelete?.firstName} {userToDelete?.lastName}?</span>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="large" onClick={handleCancelDelete} color="#fff" >
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={handleDelete}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserDetail;
