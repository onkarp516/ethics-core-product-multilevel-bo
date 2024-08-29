import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function create_sub_filterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sub_filter`;
}

export function get_filter_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_filter_list`;
}
export function update_sub_filterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sub_filter`;
}

export function validate_sub_filterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sub_filter`;
}

export function get_sub_filter_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sub_filter_list`;
}

export function get_sub_filterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sub_filter`;
}

export function get_all_sub_filterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_sub_filter`;
}
