import { getHeader } from "@/helpers";
import axios from "axios";
import { get_journal_list_by_outletUrl } from "../api";

export function get_journal_list_by_outlet(values) {
  return axios({
    url: get_journal_list_by_outletUrl(),
    method: "POST",
    headers: getHeader(),
    data: values
  });
}
