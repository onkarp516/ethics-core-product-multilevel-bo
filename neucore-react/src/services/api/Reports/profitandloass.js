import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_profit_and_loss_ac_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_profit_and_loss_ac`;
}
export function get_profit_and_loss_ac_details_step1Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_profit_and_loss_ac_step1`;
}
export function get_profit_and_loss_ac_details_step2Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_profit_and_loss_ac_step2`;
}
export function get_profit_and_loss_ac_details_step3Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_profit_and_loss_ac_step3`;
}
