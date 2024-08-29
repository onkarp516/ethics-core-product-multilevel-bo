import { getHeader } from "@/helpers";
import axios from "axios";
import {
  create_levelBUrl,
  update_levelBUrl,
  get_outlet_levelBUrl,
  get_levelB_by_idUrl,
  remove_levelBUrl,
} from "../api";

export function create_levelB(requestData) {
  return axios({
    url: create_levelBUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function update_levelB(requestData) {
  return axios({
    url: update_levelBUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outlet_levelB() {
  return axios({
    url: get_outlet_levelBUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_levelB_by_id(requestData) {
  return axios({
    url: get_levelB_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function remove_levelB(requestData) {
  return axios({
    url: remove_levelBUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
