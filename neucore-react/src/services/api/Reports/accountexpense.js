import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_expenses_reportsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_expenses_reports`;
}
// export function get_debitnote_detailsUrl() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_debitnote_details`;
// }
