import axios from "axios";
import { apiURL } from "./apiURL";

interface AddQuestions {
  performedBy: string;
  boardCode: string;
  standardCode: string;
  subject: string;
  year: string;
  month: string;
  questionId: string;
  questionPaperId: string;
  sectionId: string;
  topicId: string;
  subTopicId: string;
  marks: number;
  priority: number;
  questionType: string;
  questionContentPath: string;
  questionAnswerPath: string;
  attributes: {
    notes: string;
  };
}

export const getAllQuestions = async () => {
  return axios.get(`${apiURL}/questions`);
};

export const addQuestions = async (data: AddQuestions) => {
  return axios.post(`${apiURL}/questions`, data);
};

export const activateQuestion = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/questions/activate/${id}`, { performedBy });
};

export const approveQuestion = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/questions/approve/${id}`, { performedBy });
};

export const resetQuestion = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/questions/reset/${id}`, { performedBy });
};

export const rejectQuestion = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/questions/reject/${id}`, { performedBy });
};

export const deactivateQuestion = async (id: string, performedBy: string) => {
  return axios.patch(`${apiURL}/questions/deactivate/${id}`, { performedBy });
};

export const deleteQuestion = async (id: string, performedBy: string) => {
  return axios.delete(`${apiURL}/questions/remove/${id}`, {
    data: { performedBy },
  });
};
