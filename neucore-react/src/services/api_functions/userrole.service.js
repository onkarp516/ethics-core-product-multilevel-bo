import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getRolePermissionByIdURL,
  createUserRoleURL,
  getRolePermissionListURL,
  getRoleByIdURL,
  updateRoleURL,
  deleteUserURL,
  validateUserRoleUrl,
  validateUserRoleUpdateUrl,
} from "../api";

export function createRole(requestData) {
  return axios({
    url: createUserRoleURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getRolePermissionById(requestData) {
  return axios({
    url: getRolePermissionByIdURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function getRolePermissionList(requestData) {
  return axios({
    url: getRolePermissionListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getRoleById(requestData) {
  return axios({
    url: getRoleByIdURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function updateRole(requestData) {
  return axios({
    url: updateRoleURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function delete_user(requestData) {
  return axios({
    url: deleteUserURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function validateUsersRole(requestData) {
  return axios({
    url: validateUserRoleUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validateUserRoleUpdate(requestData) {
  return axios({
    url: validateUserRoleUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
