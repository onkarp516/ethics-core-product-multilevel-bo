import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createProductURL,
  getProductLstURL,
  updateProductURL,
  getProductEditURL,
  get_product_by_IdURL,
  get_product_SearchURL,
  validate_productURL,
  get_all_product_units_packings_flavourURL,
  get_product_units_levelsURL,
  delete_Product_listURL,
  transaction_product_listURL,
  transaction_product_detailsURL,
  product_details_levelBURL,
  product_details_levelCURL,
  product_unitsURL,
  get_outlet_appConfigURL,
  get_last_product_dataURL,
  createProductNewURL,
  updateNewProductURL,
  getNewProductEditURL,
  validate_product_codeURL,
  validate_product_code_updateURL,
  validate_product_updateURL,
  importProductURL,
  stockImportURL,
  ProductListImportURL,
} from "../api";

export function createProduct(requestData) {
  return axios({
    url: createProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateProduct(requestData) {
  return axios({
    url: updateProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getProductEdit(requestData) {
  return axios({
    url: getProductEditURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getProductLst() {
  return axios({
    url: getProductLstURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getOutletAppConfig() {
  return axios({
    url: get_outlet_appConfigURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function get_product_by_Id(values) {
  return axios({
    url: get_product_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function searchProduct(values) {
  return axios({
    url: get_product_SearchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function validate_product(values) {
  return axios({
    url: validate_productURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function validate_product_code(values) {
  return axios({
    url: validate_product_codeURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function validate_product_code_update(values) {
  return axios({
    url: validate_product_code_updateURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function validate_product_update(values) {
  return axios({
    url: validate_product_updateURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getAllProductUnitsPackingsFlavour(values) {
  return axios({
    url: get_all_product_units_packings_flavourURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_product_units_levels(values) {
  return axios({
    url: get_product_units_levelsURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function delete_Product_list(values) {
  return axios({
    url: delete_Product_listURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function transaction_product_list(values) {
  return axios({
    url: transaction_product_listURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function transaction_product_details(values) {
  return axios({
    url: transaction_product_detailsURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function product_details_levelB(values) {
  return axios({
    url: product_details_levelBURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function product_details_levelC(values) {
  return axios({
    url: product_details_levelCURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function product_units(values) {
  return axios({
    url: product_unitsURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_last_product_data(values) {
  return axios({
    url: get_last_product_dataURL(),
    method: "GET",
    headers: getHeader(),
    data: values,
  });
}

export function createProductNew(requestData) {
  return axios({
    url: createProductNewURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateNewProduct(requestData) {
  return axios({
    url: updateNewProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getNewProductEdit(requestData) {
  return axios({
    url: getNewProductEditURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

//for import_product api
export function importProduct(requestData) {
  return axios({
    url: importProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  })
}

//for stock import
export function stockImport(requestData) {
  return axios({
    url: stockImportURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  })
}

// for pagination
export function ProductListImport(requestData) {
  return axios({
    url: ProductListImportURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  })
}