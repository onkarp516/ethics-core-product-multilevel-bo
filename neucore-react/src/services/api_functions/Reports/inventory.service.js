import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_closing_stocksUrl,
  get_opening_stocksUrl,
  get_outwardStocksUrl,
  get_inwardStocksUrl,
  get_whole_stock_productUrl,
  get_monthwise_whole_stock_detailsUrl,
  get_monthwise_batch_stock_detailsUrl,
  get_expiry_productUrl,
  get_expiry_product_monthwiseUrl,
  get_expiry_product_detailsUrl,
} from "@/services/api";

export function get_closing_stocks(requestData) {
  return axios({
    url: get_closing_stocksUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_opening_stocks(requestData) {
  return axios({
    url: get_opening_stocksUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_inward_stocks(requestData) {
  return axios({
    url: get_inwardStocksUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outward_stocks(requestData) {
  return axios({
    url: get_outwardStocksUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_whole_stock_product() {
  return axios({
    url: get_whole_stock_productUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_monthwise_whole_stock_details(requestData) {
  return axios({
    url: get_monthwise_whole_stock_detailsUrl(),
    data:requestData,

    method: "POST",
    headers: getHeader(),
  });
}

export function get_monthwise_batch_stock_details(requestData) {
  return axios({
    url: get_monthwise_batch_stock_detailsUrl(),
    data:requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_expiry_product() {
  return axios({
    url: get_expiry_productUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_expiry_product_monthwise(requestData) {
  return axios({
    url: get_expiry_product_monthwiseUrl(),
    method: "POST",
    data:requestData,
    headers: getHeader(),
  });
}

export function get_expiry_product_details(requestData) {
  return axios({
    url: get_expiry_product_detailsUrl(),
    method: "POST",
    data:requestData,
    headers: getHeader(),
  });
}
