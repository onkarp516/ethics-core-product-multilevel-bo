import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createBranchURL,
  getBranchesURL,
  createBranchUserURL,
  getBranchesByUserURL,
  getBranchByIdURL,
  updateBranchByIdURL,
  getBranchByInstituteAndUserURL,
  getBranchesByCompanyUrl,
  get_branches_superAdminURL,
  get_b_adminsUrl,
  get_b_usersUrl,
  getBranchBySelectionCompanyURL,
  validateUrl,
  validateUserUrl,
  validateUserUpdateUrl,
  validateCadminUpdateUrl,
  validateBranchUrl,
  validateBranchAdminURL,
  validateBranchUpdateUrl,
} from "../api";

export function createBranch(requestData) {
  return axios({
    url: createBranchURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getBranchBySelectionCompany(requestData) {
  return axios({
    url: getBranchBySelectionCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_b_admins() {
  return axios({
    url: get_b_adminsUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
export function get_b_users() {
  return axios({
    url: get_b_usersUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
// export function getBranchByInstituteAndUser() {
//   return axios({
//     url: getBranchByInstituteAndUserURL(),
//     method: "GET",
//     headers: getHeader(),
//   });
// }

export function getBranchById(requestData) {
  return axios({
    url: getBranchByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateBranchById(requestData) {
  return axios({
    url: updateBranchByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function createBranchUser(requestData) {
  return axios({
    url: createBranchUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

// export function getBranchesByUser() {
//   return axios({
//     url: getBranchesByUserURL(),
//     method: "GET",
//     headers: getHeader(),
//   });
// }

// export function getBranchesByCompany(values) {
//   return axios({
//     url: getBranchesByCompanyUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }

export function getBranchesByCompany() {
  return axios({
    url: getBranchesByCompanyUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_branches_superAdmin(requestData) {
  return axios({
    url: get_branches_superAdminURL(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}

export function validateUsers(requestData) {
  return axios({
    url: validateUserUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

//@Vinit@Duplicate User Not Allowed in UserEdit page
export function validateUsersUpdate(requestData) {
  return axios({
    url: validateUserUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

//@Vinit@Duplicate User Not Allowed in Company Admin Edit page
export function validateCadminUpdate(requestData) {
  return axios({
    url: validateCadminUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validateBranch(requestData) {
  return axios({
    url: validateBranchUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
//for edit branch
export function validateBranchUpdate(requestData) {
  return axios({
    url: validateBranchUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validateBranchAdmin(requestData) {
  return axios({
    url: validateBranchAdminURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
