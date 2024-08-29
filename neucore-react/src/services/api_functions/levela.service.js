import { getHeader } from "@/helpers";
import axios from "axios";
import {
  create_levelAUrl,
  update_levelAUrl,
  get_outlet_levelAUrl,
  get_levelA_by_idUrl,
  remove_levelAUrl,
} from "../api";

export function create_levelA(requestData) {
  return axios({
    url: create_levelAUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function update_levelA(requestData) {
  return axios({
    url: update_levelAUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outlet_levelA() {
  return axios({
    url: get_outlet_levelAUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_levelA_by_id(requestData) {
  return axios({
    url: get_levelA_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function remove_levelA(requestData) {
  return axios({
    url: remove_levelAUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
