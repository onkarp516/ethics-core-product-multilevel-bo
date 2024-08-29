import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCategoryURL,
  getCategoryURL,
  getAllCategoryURL,
  updateCategoryURL,
  get_categoryURL,
  get_category_by_idURL,
  remove_categoriesURL,
} from "@/services/api";

export function createCategory(requestData) {
  return axios({
    url: createCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateCategory(requestData) {
  return axios({
    url: updateCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_category_by_id(values) {
  return axios({
    url: get_category_by_idURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getAllCategory() {
  return axios({
    url: getAllCategoryURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getCategory(requestData) {
  return axios({
    url: getCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_category(values) {
  return axios({
    url: get_categoryURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function removeCategories(values) {
  return axios({
    url: remove_categoriesURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
