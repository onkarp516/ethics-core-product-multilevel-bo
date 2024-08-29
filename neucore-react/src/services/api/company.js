import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_company`;
}

export function updateCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_company`;
}

export function get_companies_super_adminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_companies_super_admin`;
}

export function getCompanyByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_company_by_id`;
}

export function createCompanyUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/register_user`;
}

export function updateCompanyUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateUser`;
}

export function get_c_admin_usersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_c_admin_users`;
}

export function get_user_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_user_by_id`;
}

export function getGSTTypesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_gst_type`;
}

export function get_c_adminsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_c_admins`;
}

export function get_c_usersUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_c_users`;
}

export function validateCompanyUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_company`;
}

export function validateCompanyUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_company_update`;
}

export function getCompanyUserByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_user_by_id`;
}

export function getCompanyByUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_company_by_user`;
}
export function getPinnCodeDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pincode`;
}

export function deletecompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_company`;
}

export function validate_PincodeURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_pincode`;
}

export function get_companies_dataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_companies_data`;
}
export function getDisableUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/disable_user`;
}
