import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBrandURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_brand`;
}

export function getAllBrandsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_brands`;
}

export function updateBrandURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_brand`;
}

export function get_brand_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_brand_by_id`;
}

export function getBrandCategoryLevelOptURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_group_level`;
}
export function validate_subgroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_subgroup`;
}

export function remove_brandURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-multiple-brand`;
}
