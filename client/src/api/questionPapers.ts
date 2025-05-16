import axios from "axios";
import { apiURL } from "./apiURL";

interface QuestionPaper {
  year: string;
  month: string;
  totalMarks: number;
  attributes: {
    difficulty: string;
    type: string;
  };
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  boardId: string;
  standardId: string;
  subjectId: string;
  boardCode: string;
  standardCode: string;
  subjectName: string;
}

export const addQuestionPaper = async (data: QuestionPaper) => {
  return axios.post(`${apiURL}/question-papers`, data);
};

export const getAllQuestionPaper = async () => {
  return axios.get(`${apiURL}/question-papers`);
};
