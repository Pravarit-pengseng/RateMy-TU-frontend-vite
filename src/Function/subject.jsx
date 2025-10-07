import axios from "axios";

const API = import.meta.env.VITE_APP_API

export const remove = async (id) =>
  await axios.delete(`${API}/course/${id}`);

export const create = async (data) =>
  await axios.post(`${API}/course`, data);

export const getdata = async () =>
  await axios.get(`${API}/course`);

export const read = async (id) =>
  await axios.get(`${API}/course/${id}`);

export const update = async (id, data) =>
  await axios.put(`${API}/course/${id}`, data);
