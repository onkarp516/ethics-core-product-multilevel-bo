import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_balance_sheet_ac_detailsUrl,
  get_balance_ac_details_step1Url,
  get_balance_ac_step2Url,
  get_balance_ac_step3Url,
  get_balance_ac_step4Url,
} from "@/services/api";

export function get_balance_sheet_ac_details(values) {
  return axios({
    url: get_balance_sheet_ac_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_balance_ac_details_step1(values) {
  return axios({
    url: get_balance_ac_details_step1Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_balance_ac_details_step2(values) {
  return axios({
    url: get_balance_ac_step2Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_balance_ac_step3(values) {
  return axios({
    url: get_balance_ac_step3Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_balance_ac_step4(values) {
  return axios({
    url: get_balance_ac_step4Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
