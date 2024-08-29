import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getTranxDebitNoteLastURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_pur_returns_record`;
}

export function getTranxDebitNoteListInvoiceBillSCURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_pur_invoice_supplier_wise`;
}

export function getTranxPurchaseProductListBillNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_pur_invoice_product_list`;
}
// list_pur_invoice_product_list
// export function DTTranx_purchase_challanURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_purchase_challan`;
// }

export function create_purchase_returns_invoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_purchase_returns_invoices`;
}

export function get_outstanding_pur_return_amtURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outstanding_pur_return_amt`;
}

export function getPurchaseReturnLstUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_returns_by_outlet`;
}
export function list_debit_notesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_debit_notes`;
}
export function get_last_record_debitnoteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_debitnote`;
}
export function create_debitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_debit`;
}

export function get_debit_note_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_debit_note_by_id`;
}

export function update_debit_noteUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_debit_note`;
}
export function delete_purchase_returnUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_purchase_return`;
}

// export function get_purchase_return_by_idUrl() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_return_by_id`;
// }

export function get_purchase_return_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_return_by_id_new`;
}

export function get_pur_returns_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_returns_product_fpu_by_id`;
}

export function get_pur_returns_editUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_pur_returns`;
}

export function edit_purchase_returns_invoicesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_returns_invoices`;
}

export function create_pur_returnsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_pur_returns`;
}
export function delete_debiteNote_by_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_debit_note`;
}
export function get_purchase_return_supplierlist_by_productidURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_return_supplierlist_by_productid`;
}
export function validatePurchaseReturnurl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_return_invoices`;
}
export function get_pending_billsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pending_bills`;
}

export function getPurchaseReturnBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/purchase_print_return`;
}
