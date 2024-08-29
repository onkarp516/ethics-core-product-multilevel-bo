import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getSalesAccountsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_accounts`;
}

export function getSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors`;
}

export function getLastSalesInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_last_invoice_record`;
}
export function getLastCounterSalesNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_last_invoice_record`;
}

export function createSalesInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_invoices`;
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_order_invoice`;
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_quotation`;
}

export function getSalesInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_invoice`;
}

//for testing of sales invoice pagination
// export function getSInvPGListURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/pg_sales_invoice_list`;
// }

export function getSalesCounterListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices`;
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/list_counter_sale`;
}

export function allListCounterSaleURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_list_counter_sale`;
}

// export function editPurchaseInvoiceURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_invoices`;
// }
export function DTSaleInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_invoice`;
}
export function getSundryDebtorsIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors_by_id`;
}

export function get_outstanding_sales_return_amtUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outstanding_sales_return_amt`;
}

// export function getSalesInvoiceByIdURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_by_id`;
// }
export function getSalesInvoiceByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_by_id_new`;
}
export function editSalesInvoiceUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_sales_invoices`;
}

export function listTranxCreditNotesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_tranx_credit_notes`;
}
export function getInvoiceBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_invoice_bill_print`;
}
export function getPurchaseInvoiceBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/purchase_print_invoice`;
}

export function delete_sales_invoiceUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_sales_invoice`;
}

export function get_sales_invoice_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_product_fpu_by_id`;
}

export function salesValidationUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_invoices`;
}

export function getGSTListByLedgerIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getGSTListByLedgerId`;
}

export function checkInvoiceDateIsBetweenFYUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/checkInvoiceDateIsBetweenFY`;
}

export function checkLedgerDrugAndFssaiExpiryByLedgerIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/checkLedgerDrugAndFssaiExpiryByLedgerId`;
}

export function validate_sales_invoicesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_invoices`;
}

export function getSalesInvoiceSupplierListByProductIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_supplierlist_by_productid`;
}
export function quantityVerificationByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/sales_qty_verification_by_id`;
}
export function create_batch_detailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_batch_details`;

}
export function validate_sales_invoicesUpdateUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_invoices_update`;
}

export function edit_batch_detailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_batch_details`;

}

export function AllTransactionSaleListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_transaction_sale_list`;

}

//Consumer apis
export function create_sales_comp_invoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_comp_invoices`;
}

export function getLastSalesInvoiceConsumerNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_comp_last_invoice_record`;
}

export function list_sale_comp_invoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_comp_invoice`;
}

export function get_sales_comp_invoice_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_comp_invoice_by_id`;
}

export function get_sales_comp_invoice_product_fpu_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_comp_invoice_product_fpu_by_id`;
}

export function edit_sales_comp_invoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_sales_comp_invoices`;
}