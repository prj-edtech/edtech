import axios from "axios";
import { apiURL } from "./apiURL";

export const fetchAuditLogs = async () => {
  return axios.get(`${apiURL}/audit-logs`);
};

export const deleteAllAuditLogs = async () => {
  return axios.delete(`${apiURL}/audit-logs`);
};
