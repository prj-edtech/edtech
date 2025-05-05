import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchBoards = async () => {
  return axios.get(`${apiURL}/boards`);
};
