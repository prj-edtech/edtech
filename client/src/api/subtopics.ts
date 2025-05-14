import axios from "axios";
import { apiURL } from "./apiURL";

interface Subtopics {
  boardCode: string;
  standardCode: string;
  subjectName: string;
  sectionId: string;
  topicId: string;
  displayName: string;
  priority: number;
  contentPath: string;
  createdBy: string;
}

export const getAllSubtopics = async () => {
  const response = await axios.get(`${apiURL}/subtopics`);
  return response.data.data; // Extract the array of subtopics
};

export const addSubtopic = async (data: Subtopics) => {
  return await axios.post(`${apiURL}/subtopics`, data);
};

export const removeSubtopic = async (id: string) => {
  return axios.delete(`${apiURL}/subtopics/${id}/remove`);
};

export const activateSubtopic = async (id: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/activate`);
};

export const deactivateSubtopic = async (id: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/deactivate`);
};
