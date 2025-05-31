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
