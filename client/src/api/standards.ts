import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchStandards = async () => {
  return axios.get(`${apiURL}/standards`);
};

export const fetchStandardsByBoard = async (boardId: string) => {
  return axios.get(`${apiURL}/standards/${boardId}/board`);
};

export const fetchActiveStandards = async () => {
  return axios.get(`${apiURL}/standards/active`);
};

export const createStandard = (payload: {
  boardId: string;
  sortKey: string;
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
  return axios.patch(`${apiURL}/standards/${id}/deactivate`, payload);
};

export const activateStandard = (
  id: string,
  payload: { performedBy: string }
) => {
  return axios.patch(`${apiURL}/standards/${id}/activate`, payload);
};

export const removeStandard = (id: string, performedBy: string) => {
  return axios.delete(`${apiURL}/standards/${id}`, { data: { performedBy } });
};
