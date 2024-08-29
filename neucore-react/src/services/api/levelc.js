import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function create_levelCUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_levelC`;
}

export function update_levelCUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_levelC`;
}

export function get_outlet_levelCUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_levelC`;
}

export function get_levelC_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_levelC_by_id`;
}

export function remove_levelCUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-muiltpe-levelC`;
}
