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
  return axios.get(`${apiURL}/subtopics`);
};

export const addSubtopic = async (data: Subtopics) => {
  return axios.post(`${apiURL}/subtopics`, data);
};
