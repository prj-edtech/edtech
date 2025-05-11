import axios from "axios";
import { apiURL } from "./apiURL";

interface AddSubjects {
  sortKey: string;
  boardId: string;
  standardId: string;
  createdBy: string;
}

export const AddSubject = async (data: AddSubjects) => {
  return axios.post(`/${apiURL}/subjects`, data);
};

export const getAllSubjects = async () => {
  return axios.get(`${apiURL}/subjects`);
};
