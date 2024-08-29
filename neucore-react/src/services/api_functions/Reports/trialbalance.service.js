import { getHeader } from "@/helpers";
import axios from "axios";
import { get_all_ledgers_trial_balanceUrl } from "@/services/api";

export function get_all_ledgers_trial_balance() {
  return axios({
    url: get_all_ledgers_trial_balanceUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
