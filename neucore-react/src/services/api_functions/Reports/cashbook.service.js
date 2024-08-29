import { getHeader } from "@/helpers";
import axios from "axios";
import { get_cashbook_detailsUrl } from "@/services/api";

export function get_cashbook_details(values) {
  return axios({
    url: get_cashbook_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
