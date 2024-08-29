import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_balance_sheet_ac_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balance_sheet_ac`;
}
export function get_balance_ac_details_step1Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balance_ac_step1`;
}
export function get_balance_ac_step2Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balance_ac_step2`;
}
export function get_balance_ac_step3Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balance_ac_step3`;
}
export function get_balance_ac_step4Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balance_ac_step4`;
}
