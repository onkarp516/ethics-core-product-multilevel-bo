import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesReturnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_returns_invoices`;
}

export function get_sales_returns_by_outletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_returns_by_outlet`;
}

export function getAllSalesReturnsByOutletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_sales_returns_by_outlet`;
}

export function get_sales_returns_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_returns_product_fpu_by_id`;
}

export function editSalesReturnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_sales_returns_invoices`;
}

export function getSalesReturnByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_return_by_id_new`;
}
// export function get_sales_returns_product_fpu_by_idUrl() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_returns_product_fpu_by_id`;
// }

export function get_sales_return_supplierlist_by_productidURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_return_supplierlist_by_productid`;
}

export function get_credit_pending_billsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_credit_pending_bills`;
}
export function validate_sales_returnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_return`;
}
