import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createsubGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sub_group`;
}
export function getsubGroupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_subgroups`;
}

export function updatesubGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sub_group`;
}

export function get_subgroups_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sub_group_by_id`;
}
export function remove_subGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-multiple-subgroups`;
}
