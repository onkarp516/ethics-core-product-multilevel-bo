import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_creditnote_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_creditnote_details`;
}
export function get_creditnote_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_creditnote_details  `;
}
