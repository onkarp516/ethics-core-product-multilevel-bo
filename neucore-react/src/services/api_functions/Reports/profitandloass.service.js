import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_profit_and_loss_ac_detailsUrl,
  get_profit_and_loss_ac_details_step1Url,
  get_profit_and_loss_ac_details_step2Url,
  get_profit_and_loss_ac_details_step3Url,
} from "@/services/api";

export function get_profit_and_loss_ac_details(values) {
  return axios({
    url: get_profit_and_loss_ac_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_profit_and_loss_ac_details_step1(values) {
  return axios({
    url: get_profit_and_loss_ac_details_step1Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_profit_and_loss_ac_details_step2(values) {
  return axios({
    url: get_profit_and_loss_ac_details_step2Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_profit_and_loss_ac_details_step3(values) {
  return axios({
    url: get_profit_and_loss_ac_details_step3Url(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
