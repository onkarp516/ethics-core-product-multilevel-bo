import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createPackingUrl,
  getPackingsUrl,
  updatePackingUrl,
  getPackingByIdUrl,
  removePackagesURL,
} from "../api";

export function createPacking(requestData) {
  return axios({
    url: createPackingUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updatePacking(requestData) {
  return axios({
    url: updatePackingUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPackingById(requestData) {
  return axios({
    url: getPackingByIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPackings() {
  return axios({
    url: getPackingsUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function removePackages(requestData) {
  return axios({
    url: removePackagesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
