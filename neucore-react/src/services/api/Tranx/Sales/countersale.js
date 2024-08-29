import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getCounterSaleLastInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_last_invoice_record`;
}
export function createCounterSalesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_counter_sales_invoice`;
}
export function getCounterSaleInvoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices`;
}
export function getCounterSalesClientListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_client_list_for_sale`;
}

export function getCounterSalesWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices_with_ids`;
}

export function getCounterSalesWithIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_by_id_new`;
}

export function updateCounterSalesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_counter_sales_invoices`;
}

export function DTTranx_counter_sales_invoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_counter_sales_invoice`;
}

export function get_counter_sales_product_fpu_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_product_fpu_by_id`;
}
export function delete_counter_salesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_counter_sales`;
}
export function get_counter_sales_dataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_data`;
}
export function get_cs_invoice_product_fpu_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_cs_invoice_product_fpu_by_id`;
}

export function get_counter_sales_by_noURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_by_no`;
}

export function get_counter_sales_product_fpu_by_idsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_product_fpu_by_ids`;
}
