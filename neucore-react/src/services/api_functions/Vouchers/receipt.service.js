import { getHeader } from "@/helpers";
import axios from "axios";

import {
  get_receipt_listURL,
  get_receipt_by_idURL,
  create_receipt_Url,
  update_receipt_Url,
} from "@/services/api";

export function get_receipt_list(values) {
  return axios({
    url: get_receipt_listURL(),
    method: "POST",
    headers: getHeader(),
    data: values
  });
}

// export function get_receipt_by_id() {
//   return axios({
//     url: get_receipt_by_idURL(),
//     method: "GET",
//     headers: getHeader(),
//   });
// }

export function get_receipt_by_id(requestData) {
  return axios({
    url: get_receipt_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function create_receipt(requestData) {
  return axios({
    url: create_receipt_Url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function update_receipt(requestData) {
  return axios({
    url: update_receipt_Url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
