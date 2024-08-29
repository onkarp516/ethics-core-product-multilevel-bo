import { getCurrentIpaddress, getPortNo } from "@/helpers";
export function create_filterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/create_filter`;
  }

  export function get_filters_listURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_filter_list`;
  }
  export function get_filterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_filter`;
  }
  export function update_filterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/update_filter`;
  }
  export function validate_filterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_filter`;
  }
  