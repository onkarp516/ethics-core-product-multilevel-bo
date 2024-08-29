import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_order_invoice`;
}
export function getLastSalesOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_order_record`;
}
export function DTSaleOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_order`;
}
export function getSaleOrderListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_orders`;
}

export function AllListSaleOrdersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/all_list_sale_orders`;
}

export function getSaleOrderWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_orders_with_ids`;
}
export function getSundryDebtorsIdUrlOder() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors_by_id`;
}
// export function getSalesOrderByIdURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_order_by_id`;
// }
export function getSalesOrderByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_order_by_id_new`;
}
export function getSalesUpdateOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sales_order`;
}
export function getOrderBillUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_order_bill_print`;
}

export function delete_sales_orderUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_sales_order`;
}

export function get_sales_order_product_fpu_by_idUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_order_product_fpu_by_id`;
}
export function get_sales_order_product_fpu_by_idsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_order_product_fpu_by_ids`;
}

export function get_sales_order_supplierlist_by_productidUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_order_supplierlist_by_productid`;
}


export function getSOPendingOrderWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/saleOrdersPendingList`;
}
export function getSalesOrderValidateNoURL(){
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_order`;
}

export function getSalesOrderValidateNoUpdateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_sales_order_update`;
}