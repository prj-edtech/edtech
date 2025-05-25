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

export const removeSubtopic = async (id: string, performedBy: string) => {
  return axios.delete(`${apiURL}/subtopics/${id}/remove`, {
    data: { performedBy },
  });
};

export const activateSubtopic = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/activate`, {
    data: { performedBy },
  });
};

export const deactivateSubtopic = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/deactivate`, {
    data: { performedBy },
  });
};

export const getSubtopicById = async (id: string) => {
  return axios.get(`${apiURL}/subtopics/${id}/content`);
};

export const approveSubtopic = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/approve`, {
    data: { performedBy },
  });
};

export const rejectSubtopic = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/disapprove`, {
    data: { performedBy },
  });
};

export const resetSubtopic = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/subtopics/${id}/reset`, {
    data: { performedBy },
  });
};
