import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createUserRoleURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_user_role`;
}

export function getRolePermissionByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_role_permissions_by_id`;
}
export function getRolePermissionListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_role_permission_list`;
}

export function getRoleByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_role_by_id`;
}

export function updateRoleURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_role`;
}

export function deleteUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_user`;
}

//@Vinit @Duplicate UserRole Not Allowed in RoleCreate page
export function validateUserRoleUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_user_role`;
}

//@Vinit @Duplicate UserRole Not Allowed in RoleEdit page
export function validateUserRoleUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_user_role_update`;
}
