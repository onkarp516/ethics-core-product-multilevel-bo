import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getChallanSupplierByProductIdURL,
  createPOChallanInvoiceURL,
  getPOChallanInvoiceListURL,
  getLastPOChallanInvoiceNoURL,
  getPOChallanInvoiceWithIdsURL,
  getPurchaseChallanbyIdUrl,
  editPurchaseChallanUrl,
  delete_purchase_challanUrl,
  get_pur_challan_product_fpu_by_idUrl,
  get_pur_challan_product_fpu_by_idsUrl,
  getValidatePurchaseChallanURL,
  getValidatePurChallanUpdateURL,
  getPurchaseChallanBillUrl,
  getPCPendingChallanWithIdsURL
} from "@/services/api";

export function getLastPOChallanInvoiceNo() {
  return axios({
    url: getLastPOChallanInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function createPOChallanInvoice(requestData) {
  return axios({
    url: createPOChallanInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOChallanInvoiceList(requestData) {
  return axios({
    url: getPOChallanInvoiceListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOChallanInvoiceWithIds(requestData) {
  return axios({
    url: getPOChallanInvoiceWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseChallanbyId(requestData) {
  return axios({
    url: getPurchaseChallanbyIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editPurchaseChallan(requestData) {
  return axios({
    url: editPurchaseChallanUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_purchase_challan(requestData) {
  return axios({
    url: delete_purchase_challanUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurChallanProductFpuById(requestData) {
  return axios({
    url: get_pur_challan_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurChallanProductFpuByIds(requestData) {
  return axios({
    url: get_pur_challan_product_fpu_by_idsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getValidatePurchaseChallan(requestData) {
  return axios({
    url: getValidatePurchaseChallanURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getValidatePurChallanUpdate(requestData) {
  return axios({
    url: getValidatePurChallanUpdateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getChallanSupplierByProductId(requestData) {
  return axios({
    url: getChallanSupplierByProductIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseChallanBill(requestData) {
  return axios({
    url: getPurchaseChallanBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPCPendingChallanWithIds(requestData) {
  return axios({
    url: getPCPendingChallanWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
