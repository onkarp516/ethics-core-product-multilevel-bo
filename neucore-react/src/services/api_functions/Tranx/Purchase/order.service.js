import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getPurchaseAccountsURL,
  getSundryCreditorsURL,
  getProductURL,
  createPOInvoiceURL,
  getProductEditURL,
  getPOInvoiceListURL,
  getPOURL,
  getPOInvoiceWithIdsURL,
  getLastPOInvoiceNoURL,
  getPurchaseInvoiceByIdURL,
  editPurchaseInvoiceURL,
  getPOPendingOrderWithIdsURL,
  getPurchaseOrderByIdURL,
  getPurchaseOrderEditByIdURL,
  delete_purchase_orderUrl,
  get_pur_order_product_fpu_by_idUrl,
  get_pur_order_product_fpu_by_idsUrl,
  get_order_supplierlist_by_productidURL,
  getPurchaseOrderBillUrl,
  getPOPendingProductOrderWithIdsURL,
} from "@/services/api";

export function createPOInvoice(requestData) {
  return axios({
    url: createPOInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOInvoiceList(requestData) {
  return axios({
    url: getPOInvoiceListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPO() {
  return axios({
    url: getPOURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPOInvoiceWithIds(requestData) {
  return axios({
    url: getPOInvoiceWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOPendingOrderWithIds(requestData) {
  return axios({
    url: getPOPendingOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPOPendingProductOrderWithIds(requestData) {
  return axios({
    url: getPOPendingProductOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastPOInvoiceNo() {
  return axios({
    url: getLastPOInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPurchaseOrderById(requestData) {
  return axios({
    url: getPurchaseOrderByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurchaseOrderEdit(requestData) {
  return axios({
    url: getPurchaseOrderEditByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function delete_purchase_order(requestData) {
  return axios({
    url: delete_purchase_orderUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_pur_order_product_fpu_by_Id(requestData) {
  return axios({
    url: get_pur_order_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_pur_order_product_fpu_by_Ids(requestData) {
  return axios({
    url: get_pur_order_product_fpu_by_idsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_order_supplierlist_by_productid(requestData) {
  return axios({
    url: get_order_supplierlist_by_productidURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseOrderBill(requestData) {
  return axios({
    url: getPurchaseOrderBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
