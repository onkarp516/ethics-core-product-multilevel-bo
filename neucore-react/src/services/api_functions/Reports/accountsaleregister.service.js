import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_monthwise_sales_register_detailsUrl,
  get_sales_register_detailsUrl,
} from "@/services/api";

export function get_monthwise_sales_register_details(values) {
  return axios({
    url: get_monthwise_sales_register_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_sales_register_details(values) {
  return axios({
    url: get_sales_register_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
