import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_all_ledger_tranx_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledger_tranx_details`;
}
