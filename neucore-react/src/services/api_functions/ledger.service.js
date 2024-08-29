import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getUnderListURL,
  getBalancingMethodsURL,
  createSundryCreditorsURL,
  createSundryDebtorsURL,
  createBankAccountURL,
  createAssetsURL,
  createDutiesTaxesURL,
  createOthersURL,
  getLedgersURL,
  getLedgersByIdURL,
  editSundryCreditorsURL,
  editSundryDebtorsURL,
  editBankAccountURL,
  editAssetsURL,
  editDutiesTaxesURL,
  editOthersURL,
  getDiscountLedgersURL,
  getAdditionalLedgersURL,
  getAdditionalLedgersIndirectExpURL,
  createLedgerURL,
  editLedgerURL,
  counterCustomerURL,
  getLedgerTranxDetailsReportURL,
  getLedgerTranxDetailsReportDateURL,
  getValidateLedgermMasterURL,
  deleteledgerUrl,
  transaction_ledger_listUrl,
  transaction_ledger_detailsUrl,
  vouchers_ledger_listUrl,
  delete_ledger_groupURL,
  get_outlet_appConfigUrl,
  get_monthwise_tranx_detailsUrl,
  get_tranx_detail_of_monthUrl,
  ledgerImportURL,
  getAllLedgersPaginationURL,
} from "../api";

export function getUnderList() {
  return axios({
    url: getUnderListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getLedgers() {
  return axios({
    url: getLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getDiscountLedgers() {
  return axios({
    url: getDiscountLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getAdditionalLedgers() {
  return axios({
    url: getAdditionalLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getAdditionalLedgersIndirectExp() {
  return axios({
    url: getAdditionalLedgersIndirectExpURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getBalancingMethods() {
  return axios({
    url: getBalancingMethodsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getoutletappConfig() {
  return axios({
    url: get_outlet_appConfigUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createSundryCreditors(requestData) {
  return axios({
    url: createSundryCreditorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editSundryCreditors(requestData) {
  return axios({
    url: editSundryCreditorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createSundryDebtors(requestData) {
  return axios({
    url: createSundryDebtorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editSundryDebtors(requestData) {
  return axios({
    url: editSundryDebtorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createBankAccount(requestData) {
  return axios({
    url: createBankAccountURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editBankAccount(requestData) {
  return axios({
    url: editBankAccountURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createAssets(requestData) {
  return axios({
    url: createAssetsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editAssets(requestData) {
  return axios({
    url: editAssetsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createDutiesTaxes(requestData) {
  return axios({
    url: createDutiesTaxesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editDutiesTaxes(requestData) {
  return axios({
    url: editDutiesTaxesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function createOthers(requestData) {
  return axios({
    url: createOthersURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editOthers(requestData) {
  return axios({
    url: editOthersURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getLedgersById(requestData) {
  return axios({
    url: getLedgersByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createLedger(requestData) {
  return axios({
    url: createLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editLedger(requestData) {
  return axios({
    url: editLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getcounterCustomer(requestData) {
  return axios({
    url: counterCustomerURL(),
    method: "GET",
    headers: getHeader(),
    data: requestData,
  });
}

export function getLedgerTranxDetailsReport(requestData) {
  return axios({
    url: getLedgerTranxDetailsReportURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLedgerTranxDetailsReportDate(requestData) {
  return axios({
    url: getLedgerTranxDetailsReportDateURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getValidateLedgermMaster(requestData) {
  return axios({
    url: getValidateLedgermMasterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function delete_ledger(requestData) {
  return axios({
    url: deleteledgerUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function transaction_ledger_list(values) {
  return axios({
    url: transaction_ledger_listUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function transaction_ledger_details(values) {
  return axios({
    url: transaction_ledger_detailsUrl(),
    data: values,
    method: "POST",
    headers: getHeader(),
  });
}

export function vouchers_ledger_list(values) {
  return axios({
    url: vouchers_ledger_listUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_monthwise_tranx_details(values) {
  return axios({
    url: get_monthwise_tranx_detailsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_tranx_detail_of_month(values) {
  return axios({
    url: get_tranx_detail_of_monthUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function ledgerImport(requestData) {
  return axios({
    url: ledgerImportURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  })
}


export function getAllLedgersPagination(requestData) {
  return axios({
    url: getAllLedgersPaginationURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  })
}