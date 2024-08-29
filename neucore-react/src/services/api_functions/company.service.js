import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCompanyURL,
  getCompanyByIdURL,
  updateCompanyURL,
  get_companies_super_adminURL,
  createCompanyUserURL,
  updateCompanyUserURL,
  get_c_admin_usersURL,
  get_user_by_idURL,
  getCompanyByUserURL,
  getCompanyUserByIdURL,
  getGSTTypesURL,
  get_c_adminsUrl,
  get_c_usersUrl,
  deletecompanyURL,
  validateCompanyUrl,
  validateCompanyUpdateUrl,
  getPinnCodeDataURL,
  validate_PincodeURL,
  get_companies_dataURL,
  getDisableUserURL,
} from "../api";

export function createCompany(requestData) {
  return axios({
    url: createCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCompanyByUser(requestData) {
  return axios({
    url: getCompanyByUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getCompanyUserById(requestData) {
  return axios({
    url: getCompanyUserByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateCompany(requestData) {
  return axios({
    url: updateCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCompanyById(requestData) {
  return axios({
    url: getCompanyByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_companies_super_admin() {
  return axios({
    url: get_companies_super_adminURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function get_c_admins() {
  return axios({
    url: get_c_adminsUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
export function get_c_users() {
  return axios({
    url: get_c_usersUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createCompanyUser(requestData) {
  return axios({
    url: createCompanyUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateCompanyUser(requestData) {
  return axios({
    url: updateCompanyUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_c_admin_users() {
  return axios({
    url: get_c_admin_usersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_user_by_id(requestData) {
  return axios({
    url: get_user_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getGSTTypes() {
  return axios({
    url: getGSTTypesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function validateCompany(requestData) {
  return axios({
    url: validateCompanyUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validateCompanyUpdate(requestData) {
  return axios({
    url: validateCompanyUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPincodeData(requestData) {
  return axios({
    url: getPinnCodeDataURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function delete_company(requestData) {
  return axios({
    url: deletecompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validate_pincode(requestData) {
  return axios({
    url: validate_PincodeURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_companies_data() {
  return axios({
    url: get_companies_dataURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getDisableUser(requestData) {
  return axios({
    url: getDisableUserURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
