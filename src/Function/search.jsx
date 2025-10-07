import axios from "axios";

const API = import.meta.env.VITE_APP_API

// search
export const searchCourses = async (searchTerm) =>
  await axios.post(`${API}/search`, { searchTerm });

// save search history
export const saveSearchHistory = async (searchTerm) =>
  await axios.post(`${API}/history`, { searchTerm });

// get search history
export const getSearchHistory = async () =>
  await axios.get(`${API}/history`);

// delete search history item
export const deleteSearchHistory = async (historyId) =>
  await axios.delete(`${API}/history/${historyId}`);

// get popular searches
export const getPopularSearches = async () =>
  await axios.get(`${API}/popular`);

// increase popularity when user clicks
export const increasePopularity = async (courseId) =>
  await axios.post(`${API}/popularity/${courseId}`);
