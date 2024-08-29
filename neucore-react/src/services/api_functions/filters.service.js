import { getHeader } from "@/helpers";
import axios from "axios";
import {
   create_filterURL,
   get_filters_listURL,
   get_filterURL,
   update_filterURL,
   validate_filterURL,
  } from "@/services/api";
  
export function create_filter(requestData) {
    return axios({
      url: create_filterURL(),
      data: requestData,
      method: "POST",
      headers: getHeader(),
    });
  }
  export function get_filters_lists(values) {
    return axios({
      url: get_filters_listURL(),
      method: "GET",
      headers: getHeader(),
      data: values,
    });
  }

  export function get_filter(values) {
    return axios({
      url: get_filterURL(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  export function update_filter(values) {
    return axios({
      url: update_filterURL(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  export function validate_filter(values) {
    return axios({
      url: validate_filterURL(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
