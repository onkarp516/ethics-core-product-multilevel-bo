import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_branch`;
}
// export function getBranchesURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches`;
// }
export function getBranchByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branch_by_id`;
}
export function updateBranchByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_branch`;
}
export function createBranchUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/register_user`;
}
// export function getBranchesByUserURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_by_users`;
// }
export function getBranchesByCompanyUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_by_company`;
}
export function get_branches_superAdminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_super_admin`;
}

export function get_b_adminsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_b_admins`;
}
export function get_b_usersUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_b_users`;
}

export function validateUserUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_user`;
}
//@Vinit@Duplicate User Not Allowed in UserEdit page
export function validateUserUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_user_update`;
}

//@Vinit@Duplicate User Not Allowed in Company Admin edit page
export function validateCadminUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_cadmin_update`;
}


export function validateBranchUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_branch`;
}
export function validateBranchUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_branch_update`;
}

export function getBranchBySelectionCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_by_selection_of_company`;
}

export function validateBranchAdminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_branch_admin`;
} 
