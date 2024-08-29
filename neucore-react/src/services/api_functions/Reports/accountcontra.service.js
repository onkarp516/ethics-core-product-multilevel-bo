import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_contra_detailsUrl,
  get_contra_detailsUrl,
} from "@/services/api";

export function get_monthwise_contra_details(values) {
  return axios({
    url: get_monthwise_contra_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_contra_details(values) {
  return axios({
    url: get_contra_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
