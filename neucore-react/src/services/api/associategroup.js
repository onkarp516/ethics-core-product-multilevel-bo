import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createAssociateGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_associate_groups`;
}

export function updateAssociateGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_associate_groups`;
}

export function getAssociateGroupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_associate_groups`;
}

export function DTAssociateGroupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTAssociateGroups`;
}

export function get_associate_groupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_associate_group`;
}

export function delete_ledger_groupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_ledger_group`;
}
export function validate_associate_groupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_associate_groups`;
}
export function validate_associate_groups_updateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_associate_groups_update`;
}