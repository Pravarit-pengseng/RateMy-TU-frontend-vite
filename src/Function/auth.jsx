import axios from "axios";

const API = import.meta.env.VITE_APP_API

export const register = async (data) =>
  await axios.post(API + "/register", data);

export const login = async (data) =>
  await axios.post(API + "/login", data);

export const currentUser = async (authtoken) =>
  await axios.post(
    API + "/current-user",
    {},
    { headers: { authtoken } }
  );

export const currentAdmin = async (authtoken) =>
  await axios.post(
    API + "/current-admin",
    {},
    { headers: { authtoken } }
  );
