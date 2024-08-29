import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_debitnote_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_debitnote_details`;
}
export function get_debitnote_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_debitnote_details`;
}
