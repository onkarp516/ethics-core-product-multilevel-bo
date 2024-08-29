import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_journal_list_by_outletUrl,
  get_last_record_journalUrl,
  get_ledger_list_by_outletUrl,
  create_journalUrl,
  get_journal_by_idUrl,
  update_journalUrl,
  delete_journalUrl,
} from "@/services/api";

export function get_journal_list_by_outlet(values) {
  return axios({
    url: get_journal_list_by_outletUrl(),

    method: "POST",
    headers: getHeader(),
    data: values
  });
}

export function get_last_record_journal() {
  return axios({
    url: get_last_record_journalUrl(),

    method: "GET",
    headers: getHeader(),
  });
}
export function get_ledger_list_by_outlet() {
  return axios({
    url: get_ledger_list_by_outletUrl(),

    method: "GET",
    headers: getHeader(),
  });
}
export function create_journal(requestData) {
  return axios({
    url: create_journalUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_journal_by_id(requestData) {
  return axios({
    url: get_journal_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function update_journal(requestData) {
  return axios({
    url: update_journalUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function delete_journal(requestData) {
  return axios({
    url: delete_journalUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}