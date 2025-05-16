import axios from "axios";
import { apiURL } from "./apiURL";

interface AddSubjects {
  sortKey: string;
  boardId: string;
  standardId: string;
  createdBy: string;
}

export const addSubject = async (data: AddSubjects) => {
  return axios.post(`${apiURL}/subjects`, data);
};

export const getAllSubjects = async () => {
  return axios.get(`${apiURL}/subjects`);
};

export const getAllActiveSubjects = async () => {
  return axios.get(`${apiURL}/subjects/active`);
};

export const removeSubject = async (id: string) => {
  return axios.delete(`${apiURL}/subjects/${id}/remove`);
};

export const activeSubject = async (id: string, updatedBy: string) => {
  return axios.patch(`${apiURL}/subjects/${id}/activate`, { updatedBy });
};

export const deactiveSubject = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subjects/${id}/deactivate`, { performedBy });
};
