import { getHeader } from "@/helpers";
import axios from "axios";
import {
  create_gst_input_url,
  update_gst_input_url,
  gst_input_list_url,
  delete_gst_url,
  gst_input_by_id_url,
  create_gst_output_url,
  gst_output_list_url,
  gst_output_by_id_url,
  get_last_record_gstInputURL,
} from "@/services/api";

export function createGstInput(requestData) {
  return axios({
    url: create_gst_input_url(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function updateGstInput(requestData) {
  return axios({
    url: update_gst_input_url(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getGStInputList() {
  return axios({
    url: gst_input_list_url(),
    method: "GET",
    headers: getHeader(),
  });
}

export function delete_gst_input(requestData) {
  return axios({
    url: delete_gst_url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getGstInputById(requestData) {
  return axios({
    url: gst_input_by_id_url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

/******* GST Output********/

export function createGstOutput() {
  return axios({
    url: create_gst_output_url(),
    method: "POST",
    headers: getHeader(),
  });
}

export function getGStOutputList() {
  return axios({
    url: gst_output_list_url(),
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_gst_output() {
  return axios({
    url: delete_gst_url(),
    method: "POST",
    headers: getHeader(),
  });
}

export function getGstOutputById() {
  return axios({
    url: gst_output_by_id_url(),
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastRecordGSTInput() {
  return axios({
    url: get_last_record_gstInputURL(),
    method: "GET",
    headers: getHeader(),
  });
}
