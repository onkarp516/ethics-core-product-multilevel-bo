import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getCounterSaleLastInvoiceURL,
  createCounterSalesURL,
  getCounterSaleInvoicesURL,
  getCounterSalesClientListURL,
  getCounterSalesWithIdsURL,
  getCounterSalesWithIdURL,
  updateCounterSalesURL,
  get_counter_sales_product_fpu_by_idURL,
  delete_counter_salesURL,
  get_counter_sales_dataURL,
  get_cs_invoice_product_fpu_by_idURL,
  get_counter_sales_by_noURL,
  get_counter_sales_product_fpu_by_idsURL,
} from "@/services/api";

export function getCounterSaleLastInvoice() {
  return axios({
    url: getCounterSaleLastInvoiceURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createCounterSales(requestData) {
  return axios({
    url: createCounterSalesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCounterSaleInvoices() {
  return axios({
    url: getCounterSaleInvoicesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getCounterSalesClientList() {
  return axios({
    url: getCounterSalesClientListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getCounterSalesWithIds(requestData) {
  return axios({
    url: getCounterSalesWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getCounterSalesWithId(requestData) {
  return axios({
    url: getCounterSalesWithIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateCounterSales(requestData) {
  return axios({
    url: updateCounterSalesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_counter_sales_product_fpu_by_id(requestData) {
  return axios({
    url: get_counter_sales_product_fpu_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function delete_counter_sales(requestData) {
  return axios({
    url: delete_counter_salesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_counter_sales_data(requestData) {
  return axios({
    url: get_counter_sales_dataURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_cs_invoice_product_fpu_by_id(requestData) {
  return axios({
    url: get_cs_invoice_product_fpu_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_counter_sales_by_no(requestData) {
  return axios({
    url: get_counter_sales_by_noURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_counter_sales_product_fpu_by_ids(requestData) {
  return axios({
    url: get_counter_sales_product_fpu_by_idsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}