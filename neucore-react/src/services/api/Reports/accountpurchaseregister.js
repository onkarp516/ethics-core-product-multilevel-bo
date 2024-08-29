import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_pur_register_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_pur_register_details`;
}
export function get_pur_register_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_register_details  `;
}
