import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function create_levelAUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_levelA`;
}

export function update_levelAUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_levelA`;
}

export function get_outlet_levelAUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_levelA`;
}

export function get_levelA_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_levelA_by_id`;
}

export function remove_levelAUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-muiltpe-levelA`;
}
