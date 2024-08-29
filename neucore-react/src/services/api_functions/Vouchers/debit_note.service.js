import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getTranxDebitNoteLastURL,
  getTranxDebitNoteListInvoiceBillSCURL,
  getTranxPurchaseProductListBillNoURL,
  create_purchase_returns_invoicesURL,
  get_outstanding_pur_return_amtURL,
  getPurchaseReturnLstUrl,
  list_debit_notesURL,
  get_last_record_debitnoteURL,
  create_debitURL,
  get_debit_note_by_idUrl,
  update_debit_noteUrl,
  delete_purchase_returnUrl,
  get_purchase_return_by_idUrl,
  get_pur_returns_product_fpu_by_idUrl,
  get_pur_returns_editUrl,
  edit_purchase_returns_invoicesUrl,
  create_pur_returnsUrl,
  delete_debiteNote_by_url,
  validatePurchaseReturnurl,
  get_pending_billsURL,
  get_purchase_return_supplierlist_by_productidURL,
  getPurchaseReturnBillUrl,
} from "@/services/api";

export function getTranxDebitNoteLast() {
  return axios({
    url: getTranxDebitNoteLastURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getTranxDebitNoteListInvoiceBillSC(requestData) {
  return axios({
    url: getTranxDebitNoteListInvoiceBillSCURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getTranxPurchaseProductListBillNo(requestData) {
  return axios({
    url: getTranxPurchaseProductListBillNoURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function create_purchase_returns_invoices(requestData) {
  return axios({
    url: create_purchase_returns_invoicesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getPurchaseReturnById(requestData) {
  return axios({
    url: get_purchase_return_by_idUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getPurReturnsProductFPUById(requestData) {
  return axios({
    url: get_pur_returns_product_fpu_by_idUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function get_outstanding_pur_return_amt(requestData) {
  return axios({
    url: get_outstanding_pur_return_amtURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getPurchaseReturnLst(requestData) {
  return axios({
    url: getPurchaseReturnLstUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function list_debit_notes(values) {
  return axios({
    url: list_debit_notesURL(),
    method: "POST",
    headers: getHeader(),
    data: values
  });
}
export function getTranxDebitNoteLastRecord() {
  return axios({
    url: get_last_record_debitnoteURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createDebitNote(requestData) {
  return axios({
    url: create_debitURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function get_debit_note_by_id(requestData) {
  return axios({
    url: get_debit_note_by_idUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function update_debit_note(requestData) {
  return axios({
    url: update_debit_noteUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function delete_purchase_return(requestData) {
  return axios({
    url: delete_purchase_returnUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function edit_purchase_return(requestData) {
  return axios({
    url: get_pur_returns_editUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editPurchaseReturnInvoice(requestData) {
  return axios({
    url: edit_purchase_returns_invoicesUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createPurReturns(requestData) {
  return axios({
    url: create_pur_returnsUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function delete_debiteNote(requestData) {
  return axios({
    url: delete_debiteNote_by_url(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_purchase_return_supplierlist_by_productid(requestData) {
  return axios({
    url: get_purchase_return_supplierlist_by_productidURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validatePurchaseReturn(requestData) {
  return axios({
    url: validatePurchaseReturnurl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_pending_bills(requestData) {
  return axios({
    url: get_pending_billsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseReturnBill(requestData) {
  return axios({
    url: getPurchaseReturnBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
