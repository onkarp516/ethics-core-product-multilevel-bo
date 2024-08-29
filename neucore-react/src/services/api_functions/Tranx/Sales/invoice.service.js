import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getSalesAccountsURL,
  getSundryDebtorsURL,
  createSalesInvoiceURL,
  getProductEditURL,
  getSalesInvoiceListURL,
  getSInvPGListURL,
  getSalesCounterListURL,
  getLastSalesInvoiceNoURL,
  getLastCounterSalesNoURL,
  getPurchaseInvoiceByIdURL,
  editSalesInvoiceUrl,
  getSundryDebtorsIdUrl,
  get_outstanding_sales_return_amtUrl,
  getSalesInvoiceByIdURL,
  listTranxCreditNotesUrl,
  getInvoiceBillUrl,
  delete_sales_invoiceUrl,
  get_sales_invoice_product_fpu_by_idUrl,
  salesValidationUrl,
  getGSTListByLedgerIdUrl,
  checkInvoiceDateIsBetweenFYUrl,
  checkLedgerDrugAndFssaiExpiryByLedgerIdUrl,
  validate_sales_invoicesUrl,
  getSalesInvoiceSupplierListByProductIdURL,
  quantityVerificationByIdURL,
  getPurchaseInvoiceBillUrl,
  create_batch_detailsURL,
  validate_sales_invoicesUpdateUrl,
  edit_batch_detailsURL,
  AllTransactionSaleListURL,
  allListCounterSaleURL,
  create_sales_comp_invoicesURL,
  getLastSalesInvoiceConsumerNoURL,
  list_sale_comp_invoiceURL,
  get_sales_comp_invoice_by_idURL,
  get_sales_comp_invoice_product_fpu_by_idURL,
  edit_sales_comp_invoicesURL
} from "@/services/api";

export function getSalesAccounts() {
  return axios({
    url: getSalesAccountsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSundryDebtors() {
  return axios({
    url: getSundryDebtorsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createSalesInvoice(requestData) {
  return axios({
    url: createSalesInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function listTranxCreditNotes(requestData) {
  return axios({
    url: listTranxCreditNotesUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editSalesInvoice(requestData) {
  return axios({
    url: editSalesInvoiceUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesInvoiceList(values) {
  return axios({
    url: getSalesInvoiceListURL(),
    data: values,
    method: "POST",
    headers: getHeader(),
  });
}
// export function getSInvoicePGList(values) {
//   return axios({
//     url: getSInvPGListURL(),
//     data: values,
//     method: "POST",
//     headers: getHeader(),
//   });
// }

export function getSalesCounterList(requestData) {
  return axios({
    url: getSalesCounterListURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastSalesInvoiceNo(requestData) {
  return axios({
    url: getLastSalesInvoiceNoURL(),
    method: "GET",
    data: requestData,
    headers: getHeader(),
  });
}

export function getLastCounterSalesNo(requestData) {
  return axios({
    url: getLastCounterSalesNoURL(),
    method: "GET",
    data: requestData,
    headers: getHeader(),
  });
}

export function getSundryDebtorsIdClient(requestData) {
  return axios({
    url: getSundryDebtorsIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outstanding_sales_return_amt(requestData) {
  return axios({
    url: get_outstanding_sales_return_amtUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesInvoiceById(requestData) {
  return axios({
    url: getSalesInvoiceByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInvoiceBill(requestData) {
  return axios({
    url: getInvoiceBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurchaseInvoiceBill(requestData) {
  return axios({
    url: getPurchaseInvoiceBillUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function delete_sales_invoice(requestData) {
  return axios({
    url: delete_sales_invoiceUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSalesInvoiceProductFpuById(requestData) {
  return axios({
    url: get_sales_invoice_product_fpu_by_idUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function salesValidation(requestData) {
  return axios({
    url: salesValidationUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getGSTListByLedgerId(requestData) {
  return axios({
    url: getGSTListByLedgerIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function checkInvoiceDateIsBetweenFY(requestData) {
  return axios({
    url: checkInvoiceDateIsBetweenFYUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function checkLedgerDrugAndFssaiExpiryByLedgerId(requestData) {
  return axios({
    url: checkLedgerDrugAndFssaiExpiryByLedgerIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function validate_sales_invoices(requestData) {
  return axios({
    url: validate_sales_invoicesUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesInvoiceSupplierListByProductId(requestData) {
  return axios({
    url: getSalesInvoiceSupplierListByProductIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function quantityVerificationById(requestData) {
  return axios({
    url: quantityVerificationByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function createBatchDetails(requestData) {
  return axios({
    url: create_batch_detailsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function editBatchDetails(requestData) {
  return axios({
    url: edit_batch_detailsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function validate_sales_invoices_update(requestData) {
  return axios({
    url: validate_sales_invoicesUpdateUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function AllTransactionSaleList() {
  return axios({
    url: AllTransactionSaleListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function allListCounterSale() {
  return axios({
    url: allListCounterSaleURL(),
    method: "GET",
    headers: getHeader(),
  });
}
//Consumer api service
export function create_sales_comp_invoices(requestData) {
  return axios({
    url: create_sales_comp_invoicesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}


export function getLastSalesInvoiceConsumerNo(requestData) {
  return axios({
    url: getLastSalesInvoiceConsumerNoURL(),
    method: "GET",
    data: requestData,
    headers: getHeader(),
  });
}
export function list_sale_comp_invoice(requestData) {
  return axios({
    url: list_sale_comp_invoiceURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}
export function get_sales_comp_invoice_by_id(requestData) {
  return axios({
    url: get_sales_comp_invoice_by_idURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function get_sales_comp_invoice_product_fpu_by_id(requestData) {
  return axios({
    url: get_sales_comp_invoice_product_fpu_by_idURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}

export function edit_sales_comp_invoices(requestData) {
  return axios({
    url: edit_sales_comp_invoicesURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}