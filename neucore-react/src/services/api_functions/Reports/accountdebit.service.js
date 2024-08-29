import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_debitnote_detailsUrl,
  get_debitnote_detailsUrl,
} from "@/services/api";

export function get_monthwise_debitnote_details(values) {
  return axios({
    url: get_monthwise_debitnote_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_debitnote_details(values) {
  return axios({
    url: get_debitnote_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
