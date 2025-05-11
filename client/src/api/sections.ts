import axios from "axios";
import { apiURL } from "./apiURL";

interface AddSections {
  sortKey: string;
  boardId: string;
  standardId: string;
  subjectId: string;
  priority: number;
  displayName: string;
  createdBy: string;
}

export const addSection = async (data: AddSections) => {
  return axios.post(`/${apiURL}/sections`, data);
};

export const getAllSections = async () => {
  return axios.get(`${apiURL}/sections`);
};
