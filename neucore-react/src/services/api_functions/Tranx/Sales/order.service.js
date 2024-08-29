import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesOrderURL,
  getLastSalesOrderURL,
  getSaleOrderListURL,
  AllListSaleOrdersURL,
  getSaleOrderWithIdsURL,
  getAllSalesOrdersURL,
  getSalesOrderByIdURL,
  getSundryDebtorsIdUrlOder,
  getSalesUpdateOrderURL,
  getOrderBillUrl,
  delete_sales_orderUrl,
  get_sales_order_product_fpu_by_idUrl,
  get_sales_order_product_fpu_by_idsUrl,
  get_sales_order_supplierlist_by_productidUrl,
  getSOPendingOrderWithIdsURL,
  getSalesOrderValidateNoURL,
  getSalesOrderValidateNoUpdateURL,
} from "@/services/api";

export function createSalesOrder(requestData) {
  return axios({
    url: createSalesOrderURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesUpdateOrder(requestData) {
  return axios({
    url: getSalesUpdateOrderURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastSalesOrder() {
  return axios({
    url: getLastSalesOrderURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function delete_sales_order(requestData) {
  return axios({
    url: delete_sales_orderUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getAllSalesOrders() {
  return axios({
    url: getAllSalesOrdersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleOrderList(requestData) {
  return axios({
    url: getSaleOrderListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function AllListSaleOrders(requestData) {
  return axios({
    url: AllListSaleOrdersURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSaleOrderWithIds(requestData) {
  return axios({
    url: getSaleOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSundryDebtorsIdOrderClient(requestData) {
  return axios({
    url: getSundryDebtorsIdUrlOder(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesOrderById(requestData) {
  return axios({
    url: getSalesOrderByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getOrderBillById(requestData) {
  return axios({
    url: getOrderBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesOrderProductFpuById(requestData) {
  return axios({
    url: get_sales_order_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesOrderProductFpuByIds(requestData) {
  return axios({
    url: get_sales_order_product_fpu_by_idsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_sales_order_supplierlist_by_productid(requestData) {
  return axios({
    url: get_sales_order_supplierlist_by_productidUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSOPendingOrderWithIds(requestData) {
  return axios({
    url: getSOPendingOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validate_sales_OrderNo(requestData) {
  return axios({
    url: getSalesOrderValidateNoURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validate_sales_order_update(requestData) {
  return axios({
    url: getSalesOrderValidateNoUpdateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}