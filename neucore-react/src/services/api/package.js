import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createPackingUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_packing`;
}

export function updatePackingUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_packing`;
}
export function getPackingsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_packings`;
}
export function getPackingByIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_packing_by_id`;
}

export function removePackagesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-multiple-packages`;
}
