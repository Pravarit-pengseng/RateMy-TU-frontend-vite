import axios from "axios";

const API = import.meta.env.VITE_APP_API;

export const getCurrentProfile = async (authtoken) =>
  await axios.post(`${API}/current-user`, {}, { headers: { authtoken } });

export const updateProfile = async (userId, formData, authtoken) =>
  await axios.put(`${API}/updateProfile/${userId}`, formData, {
    headers: {
      authtoken,
      "Content-Type": "multipart/form-data",
    },
  });

export const removeProfileImage = async (userId, authtoken) =>
  await axios.delete(`${API}/deleteProfile/${userId}`, {
    headers: { authtoken },
  });
