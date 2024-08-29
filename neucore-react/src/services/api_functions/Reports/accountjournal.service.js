import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_journal_detailsUrl,
  get_journal_detailsUrl,
} from "@/services/api";

export function get_monthwise_journal_details(values) {
  return axios({
    url: get_monthwise_journal_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_journal_details(values) {
  return axios({
    url: get_journal_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
