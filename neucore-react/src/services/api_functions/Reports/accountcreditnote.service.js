import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_creditnote_detailsUrl,
  get_creditnote_detailsUrl,
} from "@/services/api";

export function get_monthwise_creditnote_details(values) {
  return axios({
    url: get_monthwise_creditnote_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_creditnote_details(values) {
  return axios({
    url: get_creditnote_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
