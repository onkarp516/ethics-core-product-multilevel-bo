import { getHeader } from "@/helpers";
import axios from "axios";
import {
  create_sub_filterURL,
  get_filter_listURL,
  get_sub_filter_listURL,
  update_sub_filterURL,
  validate_sub_filterURL,
  get_sub_filterURL,
  get_all_sub_filterURL,
} from "../api";

export function create_sub_filter(requestData) {
  return axios({
    url: create_sub_filterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_filter_list() {
  return axios({
    url: get_filter_listURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function update_sub_filter(requestData) {
  return axios({
    url: update_sub_filterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validate_sub_filter(values) {
  return axios({
    url: validate_sub_filterURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_sub_filter_list() {
  return axios({
    url: get_sub_filter_listURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_sub_filter(values) {
  return axios({
    url: get_sub_filterURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_all_sub_filter(values) {
  return axios({
    url: get_all_sub_filterURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
