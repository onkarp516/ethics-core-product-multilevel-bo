import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesChallanURL,
  getLastSalesChallanNoURL,
  // getSaleChallanListURL,
  getSaleChallanWithIdsURL,
  getSalesChallanListURL,
  AllListSaleChallanURL,
  getSaleChallanWithIdURL,
  editSaleChallanURL,
  getSaleChallanByIdURL,
  delete_sales_challanUrl,
  get_sales_challan_product_fpu_by_idUrl,
  get_sales_challan_product_fpu_by_idsUrl,
  get_sales_challan_supplierlist_by_productidUrl,
  SC_pending_listUrl,
  getSalesChallanValidateURL
} from "@/services/api";

export function createSalesChallan(requestData) {
  return axios({
    url: createSalesChallanURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editSaleChallan(requestData) {
  return axios({
    url: editSaleChallanURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastSalesChallanNo() {
  return axios({
    url: getLastSalesChallanNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleChallanList(requestData) {
  return axios({
    url: getSalesChallanListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function AllListSaleChallan(requestData) {
  return axios({
    url: AllListSaleChallanURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSaleChallanWithIds(requestData) {
  return axios({
    url: getSaleChallanWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSaleChallanWithId(requestData) {
  return axios({
    url: getSaleChallanWithIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_sales_challan(requestData) {
  return axios({
    url: delete_sales_challanUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSaleChallanById(requestData) {
  return axios({
    url: getSaleChallanByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesChallanProductFpuById(requestData) {
  return axios({
    url: get_sales_challan_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesChallanProductFpuByIds(requestData) {
  return axios({
    url: get_sales_challan_product_fpu_by_idsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_sales_challan_supplierlist_by_productid(requestData) {
  return axios({
    url: get_sales_challan_supplierlist_by_productidUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSCPendingChallanWithIds(requestData) {
  return axios({
    url: SC_pending_listUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validate_sales_ChallanNo(requestData) {
  return axios({
    url: getSalesChallanValidateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}