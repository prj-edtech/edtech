import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchUserByID = async (id: string) => {
  return axios.get(`${apiURL}/users/${id}`);
};
