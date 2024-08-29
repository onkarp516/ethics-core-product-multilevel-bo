import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_sales_register_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_sales_register_details`;
}
export function get_sales_register_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_register_details  `;
}
