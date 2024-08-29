import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_Payment_listURL,
  getAllPaymentListByOutletUrl,
  get_Payment_by_idURL,
  update_payments_by_url,
  delete_payments_by_url,
  payment_modesUrl,
  get_outlet_bank_master_url,
  get_ledger_bank_details_Url,
 } from "@/services/api";
 
export function get_Payment_list(values) {
  return axios({
    url: get_Payment_listURL(),
    method: "POST",
    headers: getHeader(),
    data: values
  });
}
export function getAllPaymentList(requestData) {
  return axios({
    url: getAllPaymentListByOutletUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function get_Payment_by_id(requestData) {
  return axios({
    url: get_Payment_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function update_payments(requestData) {
  return axios({
    url: update_payments_by_url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_payment(requestData) {
  return axios({
    url: delete_payments_by_url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_ledger_bank_details(requestData) {
  return axios({
    url: get_ledger_bank_details_Url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPaymentModes(requestData) {
  return axios({
    url: payment_modesUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getOutletBankMasterList(requestData) {
  return axios({
    url: get_outlet_bank_master_url(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
