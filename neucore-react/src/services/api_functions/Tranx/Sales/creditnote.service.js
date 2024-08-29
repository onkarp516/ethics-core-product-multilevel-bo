import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesReturnURL,
  getSalesReturnByIdURL,
  editSalesReturnURL,
  get_sales_returns_by_outletUrl,
  getAllSalesReturnsByOutletUrl,
  delete_sales_returnUrl,
  get_sales_returns_product_fpu_by_idUrl,
  get_sales_return_supplierlist_by_productidURL,
  get_credit_pending_billsURL,
  validate_sales_returnURL,
} from "@/services/api";
export function createSalesReturn(requestData) {
  return axios({
    url: createSalesReturnURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getTranxSalesReturnLst(requestData) {
  return axios({
    url: get_sales_returns_by_outletUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getallSalesReturn(requestData) {
  return axios({
    url: getAllSalesReturnsByOutletUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData
  });
}

export function delete_sales_return(requestData) {
  return axios({
    url: delete_sales_returnUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesReturnsProductFpubyId(requestData) {
  return axios({
    url: get_sales_returns_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editSalesReturn(requestData) {
  return axios({
    url: editSalesReturnURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getSalesReturnById(requestData) {
  return axios({
    url: getSalesReturnByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function get_sales_return_supplierlist_by_productid(requestData) {
  return axios({
    url: get_sales_return_supplierlist_by_productidURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function get_credit_pending_bills(requestData) {
  return axios({
    url: get_credit_pending_billsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function validate_sales_return(requestData) {
  return axios({
    url: validate_sales_returnURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
