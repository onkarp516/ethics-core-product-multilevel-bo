import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_expenses_reportsUrl,
  get_debitnote_detailsUrl,
} from "@/services/api";

export function get_expenses_reports(values) {
  return axios({
    url: get_expenses_reportsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
// export function get_debitnote_details(values) {
//   return axios({
//     url: get_debitnote_detailsUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }
