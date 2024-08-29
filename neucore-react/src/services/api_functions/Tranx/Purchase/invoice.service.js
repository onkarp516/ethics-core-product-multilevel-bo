import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getPurchaseAccountsURL,
  getSundryCreditorsURL,
  getProductURL,
  createPurchaseInvoiceURL,
  getPurchaseInvoiceListURL,
  AllListPurchaseInvoiceURL,
  getLastPurchaseInvoiceNoURL,
  getPurchaseInvoiceByIdURL,
  editPurchaseInvoiceURL,
  getPurchaseInvoiceShowByIdURL,
  listTranxDebitesNotesUrl,
  get_product_packingsUrl,
  delete_purchase_invoicesUrl,
  get_Product_batchUrl,
  fetch_Product_batchUrl,
  getpurchaseidsUrl,
  getProductFlavorpackageUnitbyidUrl,
  getValidatePurchaseInvoiceURL,
  getValidatePurchaseorderURL,
  getValidatePurchaseNoOrderUpdateURL,
  validateInvoiceNoUpdateNoURL,
  transaction_batch_detailsURL,
  transaction_product_list_by_barcodeURL,
  get_supplierlist_by_productidURL,
  updateProductStockURL,
} from "@/services/api";
import { values } from "lodash";

export function getPurchaseAccounts() {
  return axios({
    url: getPurchaseAccountsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSundryCreditors() {
  return axios({
    url: getSundryCreditorsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getProduct() {
  return axios({
    url: getProductURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createPurchaseInvoice(requestData) {
  return axios({
    url: createPurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurchaseInvoiceList(requestData) {
  return axios({
    url: getPurchaseInvoiceListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getLastPurchaseInvoiceNo() {
  return axios({
    url: getLastPurchaseInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPurchaseInvoiceById(requestData) {
  return axios({
    url: getPurchaseInvoiceByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editPurchaseInvoice(requestData) {
  return axios({
    url: editPurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseInvoiceShowById(requestData) {
  return axios({
    url: getPurchaseInvoiceShowByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function listTranxDebitesNotes(requestData) {
  return axios({
    url: listTranxDebitesNotesUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_product_packings(requestData) {
  return axios({
    url: get_product_packingsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_purchase_invoices(requestData) {
  return axios({
    url: delete_purchase_invoicesUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_Product_batch(requestData) {
  return axios({
    url: get_Product_batchUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function fetch_Product_batch(requestData) {
  return axios({
    url: fetch_Product_batchUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getpurchaseids(requestData) {
  return axios({
    url: getpurchaseidsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getProductFlavorpackageUnitbyid(requestData) {
  return axios({
    url: getProductFlavorpackageUnitbyidUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getValidatePurchaseInvoice(requestData) {
  return axios({
    url: getValidatePurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}


export function getValidatePurchaseorder(requestData) {
  return axios({
    url: getValidatePurchaseorderURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function ValidatePurchaseOrderNoUpdate(requestData) {
  return axios({
    url: getValidatePurchaseNoOrderUpdateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}


export function ValidatePurchaseInvoiceUpdate(requestData) {
  return axios({
    url: validateInvoiceNoUpdateNoURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function transaction_batch_details(requestData) {
  return axios({
    url: transaction_batch_detailsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function transaction_product_list_by_barcode(requestData) {
  return axios({
    url: transaction_product_list_by_barcodeURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_supplierlist_by_productid(requestData) {
  return axios({
    url: get_supplierlist_by_productidURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateProductStock(requestData) {
  return axios({
    url: updateProductStockURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function AllListPurchaseInvoice(requestData) {
  return axios({
    url: AllListPurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}