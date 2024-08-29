import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_Payment_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payment_list_by_outlet`;
}
export function get_Payment_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payments_by_id`;
}

export function update_payments_by_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_payments`;
}
export function delete_payments_by_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_payment`;
}
export function get_outlet_bank_master_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_bank_master`;
}

export function getAllPaymentListByOutletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_payment_list_by_outlet
  `;
}
