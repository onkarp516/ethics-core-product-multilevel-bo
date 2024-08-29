import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getUnderListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_under_list`;
}

export function getBalancingMethodsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balancing_methods`;
}

export function createSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sundry_creditors`;
}
export function editSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sundry_creditors`;
}

export function createSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sundry_debtors`;
}
export function editSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sundry_debtors`;
}

export function createBankAccountURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_bank_account_ledger`;
}
export function editBankAccountURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_bank_account_ledger`;
}
export function createDutiesTaxesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_duties_taxes_ledger`;
}

export function editDutiesTaxesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_duties_taxes_ledger`;
}

export function createAssetsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_assets`;
}
export function editAssetsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_assets`;
}

export function createOthersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_others_ledger`;
}
export function editOthersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_others_ledger`;
}
export function getLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledgers`;
}
export function getLedgersByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledgers_by_id`;
}

export function getDiscountLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_indirect_incomes`;
}

export function getAdditionalLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_indirect_expenses`;
}

export function getAdditionalLedgersIndirectExpURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_indirect_expenses_list`;
}

export function createLedgerURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_ledger_master`;
}

export function editLedgerURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_ledger_master`;
}

export function DTGetAllLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTGet_all_ledgers`;
}

export function counterCustomerURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_customer`;
}

export function getLedgerTranxDetailsReportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_tranx_details_report`;
}
export function getLedgerTranxDetailsReportDateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_tranx_details_report_with_dates
  `;
}
export function getValidateLedgermMasterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_ledger_master`;
}

export function deleteledgerUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_ledger`;
}

export function transaction_ledger_listUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_ledger_list`;
}

export function transaction_ledger_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/transaction_ledger_details`;
}

export function vouchers_ledger_listUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/vouchers_ledger_list`;
}

export function get_outlet_appConfigUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_appConfig`;
}
export function get_monthwise_tranx_detailsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_monthwise_tranx_details`;
}
export function get_tranx_detail_of_monthUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_tranx_detail_of_month`;
}
//ledger import in utilities
export function ledgerImportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/import_ledger_master`;
}

//ledger page Pagination
export function getAllLedgersPaginationURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledgers_pagination`;
}