import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_category`;
}

export function getAllCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_categories`;
}

export function get_category_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_category_by_id`;
}

export function updateCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_category`;
}

export function getCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_categories`;
}

export function get_categoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_category`;
}

export function remove_categoriesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/remove-multiple-categories`;
}
