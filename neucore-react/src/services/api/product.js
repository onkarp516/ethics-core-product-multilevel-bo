import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_product`;
}
export function getProductLstURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product`;
}
export function getProductEditURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_by_id_flavour`;
}
export function updateProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_product`;
}

export function DTProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTProduct`;
}

export function get_product_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_productMaster_by_id`;
}

export function get_product_SearchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/searchProduct`;
}
export function validate_productURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_product`;
}
export function validate_product_codeURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_product_code`;
}
export function validate_product_code_updateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_product_code_update`;
}
export function validate_product_updateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_product_update`;
}
export function get_all_product_units_packings_flavourURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product_units_packings_flavour`;
}
export function get_product_units_levelsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_units_levels`;
}

export function delete_Product_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_product`;
}
// modified by ashwin: for searching default barcode and company barcode 
export function transaction_product_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_product_list_new`;
}

export function transaction_product_detailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_product_details`;
}

export function product_details_levelBURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/product_details_levelB`;
}

export function product_details_levelCURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/product_details_levelC`;
}

export function product_unitsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/product_units`;
}

export function get_outlet_appConfigURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_appConfig`;
}
export function get_last_product_dataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_product_data`;
}

// ! New Product Scenario
export function createProductNewURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_new_product`;
}
export function getNewProductEditURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_by_id_new`;
}
export function updateNewProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_product_new`;
}

//import product in utilities section
export function importProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/import_product`;
}
export function stockImportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/import_product_stock`;
}
// export function ledgerImportURL(){
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/import_ledger_master`;
// }


export function ProductListImportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product_new`;
}