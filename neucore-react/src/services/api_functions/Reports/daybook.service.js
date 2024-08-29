import { getHeader } from "@/helpers";
import axios from "axios";
import { get_all_ledger_tranx_detailsUrl } from "@/services/api";

export function get_all_ledger_tranx_details(values) {
  return axios({
    url: get_all_ledger_tranx_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data:values
  });
}
