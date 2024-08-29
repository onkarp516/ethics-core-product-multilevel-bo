import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getPurchaseAccountsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_accounts`;
}
export function getSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_creditors`;
}
export function getProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product`;
}
export function createPurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_purchase_invoices`;
}

export function editPurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_invoices`;
}

export function getPurchaseInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_purchase_invoice`;
}
export function getLastPurchaseInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_invoice_record`;
}
// export function getPurchaseInvoiceByIdURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_invoice_by_id`;
// }
export function getPurchaseInvoiceShowByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_creditors_by_id`;
}
export function listTranxDebitesNotesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_tranx_debites_notes`;
}

export function get_product_packingsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_packings`;
}

export function delete_purchase_invoicesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_purchase_invoices`;
}
export function get_Product_batchUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_Product_batch`;
}
export function fetch_Product_batchUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/fetch_Product_batch `;
}

export function getpurchaseidsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_ids `;
}
export function getProductFlavorpackageUnitbyidUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_flavor_package_unit_by_id `;
}

export function getPurchaseInvoiceByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_invoice_by_id_new`;
}
export function getValidatePurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_invoices`;
}


export function getValidatePurchaseorderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_order`;
}

export function validateInvoiceNoUpdateNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_invoices_update`;
}

export function getValidatePurchaseNoOrderUpdateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_purchase_order_update`;
}

export function transaction_batch_detailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_batch_details`;
}

export function transaction_product_list_by_barcodeURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_product_list_by_barcode`;
}
export function get_supplierlist_by_productidURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_supplierlist_by_productid`;
}

export function updateProductStockURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateProductStock`;
}

export function AllListPurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_list_purchase_invoice`;
}