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

interface EditQuestionPaper {
  month: string;
  totalMarks: number;
  attributes: {
    displayName: string;
    notes: string;
    heading: string;
    questionPaperInstruction: string;
  };
  updatedBy: string;
}

export const addQuestionPaper = async (data: QuestionPaper) => {
  return axios.post(`${apiURL}/question-papers`, data);
};

export const getAllQuestionPaper = async () => {
  return axios.get(`${apiURL}/question-papers`);
};

export const updateQuestionPaper = async (
  id: string,
  data: EditQuestionPaper
) => {
  return axios.put(`${apiURL}/question-papers/${id}`, data);
};

export const removeQuestionPaper = async (id: string, performedBy: string) => {
  return axios.delete(`${apiURL}/question-papers/${id}/remove`, {
    data: { performedBy },
  });
};

export const deactivateQuestionPaper = async (
  id: string,
  performedBy: string
) => {
  return axios.delete(`${apiURL}/question-papers/${id}`, {
    data: { performedBy },
  });
};

export const activateQuestionPaper = async (
  id: string,
  performedBy: string
) => {
  return axios.patch(`${apiURL}/question-papers/${id}/activate`, {
    performedBy,
  });
};
