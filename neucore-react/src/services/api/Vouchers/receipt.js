import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_receipt_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_list_by_outlet`;
}
export function get_receipt_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_by_id`;
}
export function update_receipt_Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_receipt`;
}
export function create_receipt_Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_receipt`;
}
