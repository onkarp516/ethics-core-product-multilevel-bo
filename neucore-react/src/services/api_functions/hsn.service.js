import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createHSNURL,
  getAllHSNURL,
  getHsnListTestURL,
  updateHSNURL,
  get_hsn_by_IdURL,
  validate_HSNURL,
  delete_product_hsnURL,
  validate_HSN_UpdateURL
} from "../api";

export function createHSN(requestData) {
  return axios({
    url: createHSNURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateHSN(requestData) {
  return axios({
    url: updateHSNURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllHSN() {
  return axios({
    url: getAllHSNURL(),
    method: "GET",
    headers: getHeader(),
  });
}
//testing of hsn list
// export function getHsnListTest(values) {
//   return axios({
//     url: getHsnListTestURL(),
//     method: "POST",
//     headers: getHeader(),
//     data: values
//   });
// }

export function get_hsn(values) {
  return axios({
    url: get_hsn_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function validate_HSN(values) {
  return axios({
    url: validate_HSNURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function delete_product_hsn(values) {
  return axios({
    url: delete_product_hsnURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function validate_HSN_Update(values) {
  return axios({
    url:validate_HSN_UpdateURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}