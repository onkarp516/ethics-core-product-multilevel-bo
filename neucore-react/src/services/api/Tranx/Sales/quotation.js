import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesQuotationURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_quotation`;
}
export function getLastSalesQuotationNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_quotation_record`;
}
export function getAllSalesOrdersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_sales_orders`;
}

export function DTSaleQuotationURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_quotation`;
}
// export function getSaleQuotationListURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_quotation`;

// }
export function getSaleQuotationWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_quotation_with_ids`;
}
export function getSaleQuotationListIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_quotations`;
}

export function getSaleQuotationListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_quotations`;
}

export function AllListSalesQuotationsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_list_sales_quotations`;
}


// export function getSaleQuotationByIDURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_quotation_by_id`;
// }
export function getSaleQuotationByIDURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_quotation_by_id_new`;
}

export function updateSalesQuotationUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sales_quotation`;
}

export function delete_sales_quotationUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_sales_quotation`;
}
export function getSalesQuotationProductFpuByIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_quotation_product_fpu_by_id`;
}
export function getSalesQuotationProductFpuByIdsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_quotation_product_fpu_by_ids`;
}

export function get_sales_quotation_supplierlist_by_productidUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_quotation_supplierlist_by_productid`;
}

export function getQuotationBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_quotation_bill_print`;
}

export function getSQPendingQuotationWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/sq_pending_list`;
}
export function getSalesQuotationValidateURL(){
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_quotation`;
}

export function getSalesQuotationValidateUpdateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_quotation_update`;
}