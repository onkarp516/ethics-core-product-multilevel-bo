import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createsubGroupURL,
  getsubGroupsURL,
  updatesubGroupURL,
  get_subgroups_by_idURL,
  remove_subGroupURL,
} from "@/services/api";

export function createSubGroup(requestData) {
  return axios({
    url: createsubGroupURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getsubGroups() {
  return axios({
    url: getsubGroupsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updatesubGroup(requestData) {
  return axios({
    url: updatesubGroupURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_sub_groups_by_id(values) {
  return axios({
    url: get_subgroups_by_idURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function removesubGroups(values) {
  return axios({
    url: remove_subGroupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
