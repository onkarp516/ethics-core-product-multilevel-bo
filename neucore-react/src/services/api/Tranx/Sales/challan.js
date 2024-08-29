import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_challan`;
}
export function getLastSalesChallanNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_challan_record`;
}

export function DTSaleChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_challan`;
}
export function getSalesChallanListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_challan`;
}

export function AllListSaleChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_list_sale_challan`;
}

export function getSaleChallanWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_challan_with_ids`;
}

export function getSaleChallanWithIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_challan_with_id`;
}
export function getSaleChallanByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_challan_by_id_new`;
}


export function editSaleChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_sales_challan`;
}

export function delete_sales_challanUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_sales_challan`;
}

export function get_sales_challan_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_challan_product_fpu_by_id`;
}
export function get_sales_challan_product_fpu_by_idsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_challan_product_fpu_by_ids`;
}

export function get_sales_challan_supplierlist_by_productidUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_challan_supplierlist_by_productid`;
}

export function SC_pending_listUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/saleChallan_pending_list`;
}
export function getSalesChallanValidateURL(){
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_challan`;
}