import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchUserByID = async (id: string) => {
  return axios.get(`${apiURL}/users/${id}`);
};

export const createUser = async (
  auth0Id: string,
  email: string,
  name: string,
  role: string,
  picture?: string
) => {
  return axios.post(`${apiURL}/users`, { auth0Id, email, name, role, picture });
};
