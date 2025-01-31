import React, { useState, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, Stack, Select, MenuItem, RadioGroup, FormLabel, FormControlLabel, Radio } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const API_BASE_URL = "http://localhost:8000";

const skills = [
  'Java',
  'Python',
  'ASP.NET',
  'Angular',
  'Reactjs',
  'Nodejs',
];

const EditUser = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/state`);
        setStates(response.data.data);
      } catch (error) {
        console.error("Error fetching states:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        setUserDetails(response.data.data);
        formik.setValues({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          password: response.data.data.password,
          contactNo: response.data.data.contactNo,
          skills: response.data.data.skills,
          gender: response.data.data.gender,
          address: {
            line1: response.data.data.address.line1,
            line2: response.data.data.address.line2 || "",
            city: response.data.data.address.city,
            state: response.data.data.address.state,
            zipCode: response.data.data.address.zipCode,
          },
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters long"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contactNo: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
      .required("Contact number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    skills: Yup.array()
      .min(1, "Please select at least one skill.")
      .required("This field is required."),
    gender: Yup.string().oneOf(["male", "female"], "Invalid gender").required("Gender is required"),
    address: Yup.object({
      line1: Yup.string().required("Address line 1 is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string()
        .matches(/^\d{6}$/, "Zip code must be 6 digits")
        .required("Zip code is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNo: "",
      skills: [],
      gender: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.put(`${API_BASE_URL}/users/${id}`, values);
        setSnackbarMessage("User updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/users");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!userDetails) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h4>Edit user Form</h4>

      <form onSubmit={formik.handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <OutlinedInput
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.firstName}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <OutlinedInput
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.lastName}
              </div>
            )}
          </FormControl>

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              <FormLabel id="demo-radio-buttons-group-label" className="mt-2 me-2" sx={{ fontWeight: 'bold' }}>Gender:</FormLabel>
              <FormControlLabel
                value="male"
                control={<Radio sx={{ '&.Mui-checked': { color: 'black' }, '&.Mui-focusVisible': { outline: 'none' } }} />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio sx={{ '&.Mui-checked': { color: 'black' }, '&.Mui-focusVisible': { outline: 'none' } }} />}
                label="Female"
              />
            </RadioGroup>
            {formik.touched.gender && formik.errors.gender && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.gender}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.email}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="contactNo">Contact No</InputLabel>
            <OutlinedInput
              id="contactNo"
              name="contactNo"
              label="ContactNo"
              type="number"
              value={formik.values.contactNo}
              onChange={formik.handleChange}
              inputProps={{ maxLength: 10 }}
            />
            {formik.touched.contactNo && formik.errors.contactNo && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.contactNo}
              </div>
            )}
          </FormControl>

          <FormControl sx={{ m: 1, width:'35ch'}} error={formik.touched.skills && Boolean(formik.errors.skills)}>
            <Select
              multiple
              displayEmpty
              id="skills"
              name="skills"
              value={formik.values.skills}
              onChange={(event) => formik.setFieldValue("skills", event.target.value)}
              onBlur={formik.handleBlur}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Skills</em>;
                }
                return selected.join(", ");
              }}
            >
              <MenuItem disabled value="">
                <em>Skills</em>
              </MenuItem>
              {skills.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.skills && formik.errors.skills && (
              <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.skills}</div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.password}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="address.line1">Address Line 1</InputLabel>
            <OutlinedInput
              id="address.line1"
              name="address.line1"
              label="Address line1"
              value={formik.values.address.line1}
              onChange={formik.handleChange}
            />
            {formik.touched.address?.line1 && formik.errors.address?.line1 && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.address.line1}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="address.line2">Address Line 2</InputLabel>
            <OutlinedInput
              id="address.line2"
              name="address.line2"
              label="Address line2"
              value={formik.values.address.line2}
              onChange={formik.handleChange}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{ width: "35ch", m: 1 }}
            error={formik.touched.address?.state && formik.errors.address?.state}
          >
            <InputLabel id="address.state-label">State</InputLabel>
            <Select
              id="address.state"
              name="address.state"
              label="State"
              value={formik.values.address.state}
              onChange={formik.handleChange}
            >
              {loading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                states.map((state) => (
                  <MenuItem key={state.Code} value={state.label}>
                    {state.Code}-{state.label}
                  </MenuItem>
                ))
              )}
            </Select>
            {formik.touched.address?.state && formik.errors.address?.state && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.address.state}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="address.city">City</InputLabel>
            <OutlinedInput
              id="address.city"
              name="address.city"
              label="city"
              value={formik.values.address.city}
              onChange={formik.handleChange}
            />
            {formik.touched.address?.city && formik.errors.address?.city && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.address.city}
              </div>
            )}
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "35ch", m: 1 }}>
            <InputLabel htmlFor="address.zipCode">Zip Code</InputLabel>
            <OutlinedInput
              id="address.zipCode"
              name="address.zipCode"
              label="Zip Code"
              type="number"
              value={formik.values.address.zipCode}
              onChange={formik.handleChange}
              onInput={(e) => {
                if (e.target.value.length > 6) {
                  e.target.value = e.target.value.slice(0, 6);
                }
              }}
              inputProps={{
                maxLength: 6,
              }}
            />
            {formik.touched.address?.zipCode && formik.errors.address?.zipCode && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {formik.errors.address.zipCode}
              </div>
            )}
          </FormControl>
        </div>

        <Stack sx={{ alignItems: 'center' }}>
          <Button variant="contained" size="medium" type="submit" disabled={isLoading}>
            Update
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

    </div>
  );
};

export default EditUser;
