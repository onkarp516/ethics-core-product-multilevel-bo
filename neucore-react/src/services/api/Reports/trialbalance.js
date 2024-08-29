import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_all_ledgers_trial_balanceUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledgers_trial_balance`;
}
