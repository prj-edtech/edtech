import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchStandards = async () => {
  return axios.get(`${apiURL}/standards`);
};

export const createStandard = (payload: {
  sortKey: string;
  displayName: string;
  createdBy: string;
}) => {
  return axios.post(`${apiURL}/standards`, payload);
};

export const setActiveStandard = (
  id: string,
  payload: {
    isActive: boolean;
    updatedBy: string;
  }
) => {
  return axios.put(`${apiURL}/standards/${id}`, payload);
};

export const softDeleteStandard = (
  id: string,
  payload: { performedBy: string }
) => {
  return axios.patch(`${apiURL}/standards/${id}`, payload);
};

export const removeStandard = (id: string) => {
  return axios.delete(`${apiURL}/standards/remove/${id}`);
};
