import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getreceiptlastrecordsUrl,
  getSDIEReceiptUrl,
  getCBADReceiptUrl,
  getdebtorspendingbillsUrl,
  create_receiptUrl,
  delete_receiptUrl,
} from "../api";

export function getreceiptlastrecords(requestData) {
  return axios({
    url: getreceiptlastrecordsUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}

export function getSDIEReceipt(requestData) {
  return axios({
    url: getSDIEReceiptUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getCBADReceipt(requestData) {
  return axios({
    url: getCBADReceiptUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getdebtorspendingbills(requestData) {
  return axios({
    url: getdebtorspendingbillsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function create_receipts(requestData) {
  return axios({
    url: create_receiptUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_receipts(requestData) {
  return axios({
    url: delete_receiptUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
