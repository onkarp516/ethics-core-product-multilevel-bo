import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_receipt_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_receipt_details`;
}

export function get_receipt_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_details`;
}
