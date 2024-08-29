import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_cashbook_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_cashbook_details`;
}
// export function get_contra_detailsUrl() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_conta_details  `;
// }
