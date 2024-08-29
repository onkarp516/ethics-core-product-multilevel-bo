import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function create_levelBUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_levelB`;
}

export function update_levelBUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_levelB`;
}

export function get_outlet_levelBUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_levelB`;
}

export function get_levelB_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_levelB_by_id`;
}

export function remove_levelBUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-muiltpe-levelB`;
}
