import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesQuotationURL,
  getLastSalesQuotationNoURL,
  getSaleQuotationListIdsURL,
  getSaleQuotationListURL,
  AllListSalesQuotationsURL,
  getSaleQuotationWithIdsURL,
  getSaleQuotationByIDURL,
  updateSalesQuotationUrl,
  delete_sales_quotationUrl,
  getSalesQuotationProductFpuByIdUrl,
  getSalesQuotationProductFpuByIdsUrl,
  get_sales_quotation_supplierlist_by_productidUrl,
  getQuotationBillUrl,
  getSQPendingQuotationWithIdsURL,
  getSalesQuotationValidateURL,
  getSalesQuotationValidateUpdateURL,
} from "@/services/api";

export function createSalesQuotation(requestData) {
  return axios({
    url: createSalesQuotationURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateSalesQuotation(requestData) {
  return axios({
    url: updateSalesQuotationUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastSalesQuotationNo() {
  return axios({
    url: getLastSalesQuotationNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSaleQuotationList() {
  return axios({
    url: getSaleQuotationListIdsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleQuotationWithIds(requestData) {
  return axios({
    url: getSaleQuotationWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesQuotationList(requestData) {
  return axios({
    url: getSaleQuotationListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSaleQuotationByID(requestData) {
  return axios({
    url: getSaleQuotationByIDURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_sales_quotation(requestData) {
  return axios({
    url: delete_sales_quotationUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesQuotationProductFpuById(requestData) {
  return axios({
    url: getSalesQuotationProductFpuByIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesQuotationProductFpuByIds(requestData) {
  return axios({
    url: getSalesQuotationProductFpuByIdsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_sales_quotation_supplierlist_by_productid(requestData) {
  return axios({
    url: get_sales_quotation_supplierlist_by_productidUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesQuotationBill(requestData) {
  return axios({
    url: getQuotationBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSQPendingQuotationWithIds(requestData) {
  return axios({
    url: getSQPendingQuotationWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function AllListSalesQuotations(requestData) {
  return axios({
    url: AllListSalesQuotationsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validate_sales_quotationNo(requestData) {
  return axios({
    url: getSalesQuotationValidateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validate_sales_quotation_update(requestData) {
  return axios({
    url: getSalesQuotationValidateUpdateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}