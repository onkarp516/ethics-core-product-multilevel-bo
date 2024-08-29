import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_payment_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_payment_details`;
}
export function get_payment_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payment_details  `;
}
