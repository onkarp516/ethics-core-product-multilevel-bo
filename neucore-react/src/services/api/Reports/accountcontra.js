import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_contra_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_contra_details`;
}
export function get_contra_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_conta_details  `;
}
