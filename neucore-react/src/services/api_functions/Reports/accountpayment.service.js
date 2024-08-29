import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_payment_detailsUrl,
  get_payment_detailsUrl,
} from "@/services/api";

export function get_monthwise_payment_details(values) {
  return axios({
    url: get_monthwise_payment_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_payment_details(values) {
  return axios({
    url: get_payment_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
