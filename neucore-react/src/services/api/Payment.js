import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getpaymentinvoicelastrecordsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payment_invoice_last_records`;
}

export function getsundrycreditorsindirectexpensesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_creditors_indirect_expenses
  `;
}

export function getcreditorspendingbillsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_creditors_pending_bills`;
}

export function getcashAcbankaccountUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_cashAc_bank_account_details`;
}

export function create_paymentsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_payments`;
}

export function payment_modesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payment_mode`;
}
export function get_ledger_bank_details_Url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_bank_details`;
}