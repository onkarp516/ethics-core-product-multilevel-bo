import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createFlavourUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_flavour`;
}

export function updateFlavourUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_flavour`;
}

export function getFlavourUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_flavour`;
}

export function getFlavourByIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_flavour_by_id`;
}

export function getProductFlavourListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product_units_packings_flavour`;
}
