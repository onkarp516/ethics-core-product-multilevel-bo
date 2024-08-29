import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_closing_stocksUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_closing_stocks`;
}

export function get_opening_stocksUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_opening_stocks`;
}

export function get_inwardStocksUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_inwards_stocks`;
}

export function get_outwardStocksUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outwards_stocks`;
}

export function get_whole_stock_productUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_whole_stock_product`;
}

export function get_monthwise_whole_stock_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_whole_stock_details`;
}

export function get_monthwise_batch_stock_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_batch_stock_details`;
}

export function get_expiry_productUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_expiry_product`;
}

export function get_expiry_product_monthwiseUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_expiry_product_monthwise`;
}

export function get_expiry_product_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_expiry_product_details`;
}

