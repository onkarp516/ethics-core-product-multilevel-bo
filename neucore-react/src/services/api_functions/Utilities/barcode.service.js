import { getHeader } from "@/helpers";
import axios from "axios";
import { createBarcodeUrl, getBarcodeUrl } from "@/services/api";

export function createBarcode(requestData) {
  return axios({
    url: createBarcodeUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getBarcode(requestData) {
  return axios({
    url: getBarcodeUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
