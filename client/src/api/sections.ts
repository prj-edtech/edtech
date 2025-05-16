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
  return axios.post(`${apiURL}/sections`, data);
};

export const getAllSections = async () => {
  return axios.get(`${apiURL}/sections`);
};

export const getAllActiveSections = async () => {
  return axios.get(`${apiURL}/sections/active`);
};

export const removeSection = async (id: string) => {
  return axios.delete(`${apiURL}/sections/${id}`);
};

export const softDeleteSection = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/sections/${id}`, { performedBy });
};

export const editSection = async (
  sectionId: string,
  displayName: string,
  priority: string,
  isActive: boolean,
  updatedBy: string
) => {
  return axios.put(`${apiURL}/sections/${sectionId}`, {
    displayName,
    priority,
    isActive,
    updatedBy,
  });
};
