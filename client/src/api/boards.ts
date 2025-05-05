import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchBoards = async () => {
  return axios.get(`${apiURL}/boards`);
};

export const createBoard = (payload: {
  sortKey: string;
  displayName: string;
  createdBy: string;
}) => {
  return axios.post(`${apiURL}/boards`, payload);
};

export const updateBoard = (id: string, payload: any) => {
  return axios.put(`${apiURL}/boards/${id}`, payload);
};

export const softDeleteBoard = (
  id: string,
  payload: { performedBy: string }
) => {
  return axios.patch(`${apiURL}/boards/${id}`, payload);
};

export const removeBoard = (id: string) => {
  return axios.delete(`${apiURL}/boards/remove/${id}`);
};
