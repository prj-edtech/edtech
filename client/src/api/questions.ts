import axios from "axios";
import { apiURL } from "./apiURL";

export const getAllQuestions = async () => {
  return axios.get(`${apiURL}/questions`);
};
