import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_group`;
}


export function getGroupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_groups`;
}








export function updateGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_group`;
}

export function get_groups_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_groups_by_id`;
}

export function get_groupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_group`;
}
export function get_outlet_groupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_groups`;
}

export function validate_groupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_group`;
}
export function remove_GroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-multiple-groups`;
}
