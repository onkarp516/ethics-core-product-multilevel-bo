import { getHeader } from "@/helpers";
import axios from "axios";
import { getSysAllPermissionsURL, getUserPermissionURL } from "@/services/api";

export function getSysAllPermissions() {
  return axios({
    url: getSysAllPermissionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getUserPermission(requestData) {
  return axios({
    url: getUserPermissionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
