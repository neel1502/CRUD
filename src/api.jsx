
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to add a new user
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};


export const editUser = async (payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users`, payload)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getStates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getstates`)
    return response;
  } catch (error) {
    console.error("Error fetching states:", error);
  }
}
