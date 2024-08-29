import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_hsn`;
}

export function getAllHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_hsn_by_outlet`;
}
//start of  testing of hsn list in json format
// export function getHsnListTestURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/hsn_list_test`;
// }
//end of testing of hsn list in json format
export function updateHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_hsn`;
}
export function DTHsnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTHsn`;
}

export function get_hsn_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_hsn_by_id`;
}
export function validate_HSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_HSN`;
}
export function delete_product_hsnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_product_hsn
  `;
}
export function validate_HSN_UpdateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_HSN_update`;
}