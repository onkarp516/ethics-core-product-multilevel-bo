import { getHeader } from "@/helpers";
import axios from "axios";
import {
  create_levelCUrl,
  update_levelCUrl,
  get_outlet_levelCUrl,
  get_levelC_by_idUrl,
  remove_levelCUrl,
} from "../api";

export function create_levelC(requestData) {
  return axios({
    url: create_levelCUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function update_levelC(requestData) {
  return axios({
    url: update_levelCUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outlet_levelC() {
  return axios({
    url: get_outlet_levelCUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_levelC_by_id(requestData) {
  return axios({
    url: get_levelC_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function remove_levelC(requestData) {
  return axios({
    url: remove_levelCUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
