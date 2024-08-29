import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createFlavourUrl,
  getFlavourUrl,
  updateFlavourUrl,
  getFlavourByIdUrl,
  getProductFlavourListURL,
} from "../api";

export function createFlavour(requestData) {
  return axios({
    url: createFlavourUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateFlavour(requestData) {
  return axios({
    url: updateFlavourUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getFlavourById(requestData) {
  return axios({
    url: getFlavourByIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getFlavour() {
  return axios({
    url: getFlavourUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getProductFlavourList(requestData) {
  return axios({
    url: getProductFlavourListURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
