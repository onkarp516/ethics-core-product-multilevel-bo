import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createBrandURL,
  getAllBrandsURL,
  updateBrandURL,
  get_brand_by_IdURL,
  getBrandCategoryLevelOptURL,
  validate_subgroupURL,
  remove_brandURL,
} from "@/services/api";

export function createBrand(requestData) {
  return axios({
    url: createBrandURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllBrands() {
  return axios({
    url: getAllBrandsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function updateBrand(requestData) {
  return axios({
    url: updateBrandURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_brand(values) {
  return axios({
    url: get_brand_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getBrandCategoryLevelOpt(requestData) {
  return axios({
    url: getBrandCategoryLevelOptURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validate_subgroup(values) {
  return axios({
    url: validate_subgroupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function removeBrandlist(values) {
  return axios({
    url: remove_brandURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
