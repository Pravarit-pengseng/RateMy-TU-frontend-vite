// subject.js
import axios from "axios";

const API = import.meta.env.VITE_APP_API;

export const update = async (id, data, authtoken) =>
  await axios.put(`${API}/course/${id}`, data, {
    headers: {
      authtoken,
    },
  });

export const remove = async (id, authtoken) =>
  await axios.delete(`${API}/course/${id}`, {
    headers: {
      authtoken,
    },
  });

export const read = async (id) => await axios.get(`${API}/course/${id}`);

export const getdata = async () => await axios.get(`${API}/course`);

export const create = async (data, authtoken) =>
  await axios.post(`${API}/course`, data, {
    headers: {
      authtoken,
    },
  });
