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

interface updateTopics {
  priority: number;
  attributes: {
    displayName: string;
  };
  updatedBy: string;
  isActive: boolean;
}

export const addTopics = (data: AddTopics) => {
  return axios.post(`${apiURL}/topics`, data);
};

export const fetchAllTopics = () => {
  return axios.get(`${apiURL}/topics`);
};

export const fetchAllActiveTopics = () => {
  return axios.get(`${apiURL}/topics/active`);
};

export const getTopicsBySection = (sectionId: string) => {
  return axios.get(`${apiURL}/topics/section/${sectionId}`);
};

export const removeTopic = async (id: string, performedBy: string) => {
  return axios.delete(`${apiURL}/topics/${id}/remove`, {
    data: { performedBy },
  });
};

export const editTopic = async (topicId: string, data: updateTopics) => {
  return axios.put(`${apiURL}/topics/${topicId}`, data);
};
