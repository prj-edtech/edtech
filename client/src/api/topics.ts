import axios from "axios";
import { apiURL } from "./apiURL";

interface AddTopics {
  boardId: string;
  standardId: string;
  subjectId: string;
  sectionId: string;
  priority: number;
  attributes: {
    displayName: string;
  };
  createdBy: string;
}

export const addTopics = (data: AddTopics) => {
  return axios.post(`${apiURL}/topics`, data);
};

export const fetchAllTopics = () => {
  return axios.get(`${apiURL}/topics`);
};
