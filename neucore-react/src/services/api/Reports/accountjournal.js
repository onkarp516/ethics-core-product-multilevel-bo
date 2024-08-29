import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_monthwise_journal_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_journal_details`;
}
export function get_journal_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_journal_details  `;
}
