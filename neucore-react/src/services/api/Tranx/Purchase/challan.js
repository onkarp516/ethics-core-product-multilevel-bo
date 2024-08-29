import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createPOChallanInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_po_challan_invoices`;
}
export function getPOChallanInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_po_challan_invoice`;
}
export function getPOChallanInvoiceWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_po_challan_invoices_with_ids`;
}
export function getLastPOChallanInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_po_challan_record`;
}

export function DTTranx_purchase_challanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_purchase_challan`;
}
// export function getPurchaseChallanbyIdUrl() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_challan_by_id`;
// }

export function editPurchaseChallanUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_challan`;
}

export function delete_purchase_challanUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_purchase_challan`;
}

export function get_pur_challan_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_challan_product_fpu_by_id`;
}
export function get_pur_challan_product_fpu_by_idsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_challan_product_fpu_by_ids`;
}

export function getPurchaseChallanbyIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_challan_by_id_new`;
}

export function getValidatePurchaseChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_challan`;
}
export function getValidatePurChallanUpdateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_challan_update`;
}
export function getChallanSupplierByProductIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_challan_supplierlist_by_productid`;
}
export function getPurchaseChallanBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/purchase_print_challan`;
}
export function getPCPendingChallanWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/pC_pending_challans`;
}