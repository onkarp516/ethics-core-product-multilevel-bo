import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function create_gst_input_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_gst_input`;
}

export function update_gst_input_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_gst_input`;
}

export function gst_input_list_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/gst_input_list`;
}

export function delete_gst_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_gst`;
}

export function gst_input_by_id_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_gst_input_by_id`;
}

export function create_gst_output_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_gst_output`;
}

export function gst_output_list_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/gst_output_list`;
}

export function gst_output_by_id_url() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/gst_output_by_id`;
}

export function get_last_record_gstInputURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_gstInput`;
}
