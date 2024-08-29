import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createGroupURL,
  getGroupsURL,
  get_groupURL,
  updateGroupURL,
  get_outlet_groupsURL,
  validate_groupURL,
  get_groups_by_idURL,
  remove_GroupURL,
} from "@/services/api";

export function createGroup(requestData) {
  return axios({
    url: createGroupURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getGroups() {
  return axios({
    url: getGroupsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateGroup(requestData) {
  return axios({
    url: updateGroupURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_group(values) {
  return axios({
    url: get_groupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_groups_by_id(values) {
  return axios({
    url: get_groups_by_idURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_outlet_groups(values) {
  return axios({
    url: get_outlet_groupsURL(),
    method: "GET",
    headers: getHeader(),
    data: values,
  });
}

export function validate_group(values) {
  return axios({
    url: validate_groupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function removeGroups(values) {
  return axios({
    url: remove_GroupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
