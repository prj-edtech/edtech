import axios from "axios";
import { apiURL } from "./apiURL";

export const getAllChangeLogs = async () => {
  return axios.get(`${apiURL}/change-logs`);
};

export const deleteAllChangeLogs = async () => {
  return axios.delete(`${apiURL}/change-logs`);
};
