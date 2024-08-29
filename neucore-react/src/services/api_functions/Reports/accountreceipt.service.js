import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_receipt_detailsUrl,
  get_receipt_detailsUrl,
} from "@/services/api";

export function get_monthwise_receipt_details(values) {
  return axios({
    url: get_monthwise_receipt_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_receipt_details(values) {
  return axios({
    url: get_receipt_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
