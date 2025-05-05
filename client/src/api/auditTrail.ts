import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchAuditLogs = async () => {
  return axios.get(`${apiURL}/audit-logs`);
};
