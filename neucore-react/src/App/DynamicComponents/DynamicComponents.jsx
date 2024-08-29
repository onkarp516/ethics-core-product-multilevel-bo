import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import CustComponets from "./CustComponets";
import MultiTab from "@/MultiTab/MultiTab";

import { eventBus, MyNotifications, convertToSlug } from "@/helpers";
import Menus from "@/Pages/Layout/Menus";
import { authenticationService } from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";

const data = [
  {
    _uid: uuidv4(),
    slug: "shortcutKeys",
    component: "shortcutKeys",
    headline: "ShortcutKeys",
    isActive: true,
    pageName: "ShortcutKeys",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "login",
    component: "login",
    headline: "Login",
    isActive: true,
    pageName: "Login",
    isNewTab: false,
  },
  /**********Bill Format***** */
  {
    _uid: uuidv4(),
    slug: "biradar",
    component: "biradar",
    headline: "Biradar",
    isActive: false,
    pageName: "Biradar",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "woodline",
    component: "woodline",
    headline: "Woodline",
    isActive: false,
    pageName: "Woodline",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "page1",
    component: "page1",
    headline: "Page1",
    isActive: false,
    pageName: "Page1",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "page2",
    component: "page2",
    headline: "Page2",
    isActive: false,
    pageName: "Page2",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "dashboard",
    component: "dashboard",
    headline: "Dashboard",
    isActive: false,
    pageName: "Dashboard",
    isNewTab: true,
    cmpslug: "dashboard",
  },
  {
    _uid: uuidv4(),
    slug: "company",
    component: "company",
    headline: "Company",
    isActive: false,
    pageName: "Company",
    cmpslug: "company",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newCompany",
    component: "newCompany",
    headline: "Company",
    isActive: false,
    pageName: "Company",
    cmpslug: "company",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newCompanyEdit",
    component: "newCompanyEdit",
    headline: "Company Edit",
    isActive: false,
    pageName: "Company Edit",
    cmpslug: "new-Company-Edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "companyList",
    component: "companyList",
    headline: "Company List",
    isActive: false,
    pageName: "Company List",
    cmpslug: "company-List",
    cmpsluglst: ["company", "new-Company-Edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "companyuser",
    component: "companyuser",
    title: "CompanyUser",
    isActive: false,
    pageName: "Company User",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "role",
    component: "role",
    title: "Role",
    isActive: false,
    pageName: "Role",
    cmpslug: "role",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "rolelist",
    component: "rolelist",
    title: "User Role List",
    isActive: false,
    pageName: "User Role List",
    cmpslug: "user-role-list",
    cmpsluglst: ["role", "role-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "roleedit",
    component: "roleedit",
    title: "RoleEdit",
    isActive: false,
    pageName: "RoleEdit",
    cmpslug: "role-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "companyAdmin",
    component: "companyAdmin",
    title: "Company Admin",
    isActive: false,
    pageName: "Company Admin",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "branch",
    component: "branch",
    headline: "Branch",
    isActive: false,
    pageName: "Branch",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "newBranchCreate",
    component: "newBranchCreate",
    headline: "Branch Create",
    isActive: false,
    pageName: "Branch Create",
    cmpslug: "branch-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newbranchedit",
    component: "newbranchedit",
    headline: "Branch Edit",
    isActive: false,
    pageName: "Branch Edit",
    cmpslug: "branch-edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "newBranchAdminList",
    component: "newBranchAdminList",
    headline: "Branch Admin List",
    isActive: false,
    pageName: "Branch Admin List",
    cmpslug: "branch-admin-list",
    cmpsluglst: ["branch-admin-create", "branch-admin-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "branchEdit",
    component: "branchEdit",
    headline: "Branch Edit",
    isActive: false,
    pageName: "Branch Edit",
    cmpslug: "branch-edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "branchAdmin",
    component: "branchAdmin",
    title: "Branch Admin",
    isActive: false,
    pageName: "Branch Admin",
    cmpslug: "branch-admin",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newBranchAdminCreate",
    component: "newBranchAdminCreate",
    title: "Branch Admin Create",
    isActive: false,
    pageName: "Branch Admin Create",
    cmpslug: "branch-admin-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "branchAdminEdit",
    component: "branchAdminEdit",
    title: "Branch Admin Edit",
    isActive: false,
    pageName: "Branch Admin Edit",
    cmpslug: "branch-admin-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newBranchList",
    component: "newBranchList",
    title: "Branch List",
    isActive: false,
    pageName: "Branch List",
    cmpslug: "branch-list",
    cmpsluglst: ["branch-create", "branch-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "catlog",
    component: "catlog",
    headline: "Catlog",
    isActive: false,
    pageName: "Catlog",
    cmpslug: "catlog",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "package",
    component: "package",
    headline: "Package",
    isActive: false,
    pageName: "Package",
    cmpslug: "package",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "flavour",
    component: "flavour",
    headline: "Flavour",
    isActive: false,
    pageName: "Flavour",
    cmpslug: "flavour",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "unit",
    component: "unit",
    headline: "Unit",
    isActive: false,
    pageName: "Unit",
    cmpslug: "unit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "hsn",
    component: "hsn",
    headline: "HSN",
    isActive: false,
    pageName: "HSN",
    cmpslug: "hsn",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tax",
    component: "tax",
    headline: "Tax",
    isActive: false,
    pageName: "Tax",
    cmpslug: "tax",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "area-master",
    component: "areaMaster",
    headline: "AreaMaster",
    isActive: false,
    pageName: "Area Master",
    cmpslug: "area-master",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "bank-master",
    component: "bankMaster",
    headline: "BankMaster",
    isActive: false,
    pageName: "Bank Master",
    cmpslug: "bank-master",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "salasman-master",
    component: "salesmanMaster",
    headline: "SalesmanMaster",
    isActive: false,
    pageName: "Salesman Master",
    cmpslug: "salesman-master",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "filters",
    component: "filters",
    headline: "Filters",
    isActive: false,
    pageName: "Filters",
    cmpslug: "filters",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "subfilters",
    component: "subfilters",
    headline: "SubFilters",
    isActive: false,
    pageName: "SubFilters",
    cmpslug: "subfilters",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "associategroup",
    component: "associategroup",
    title: "Ledger Group",
    isActive: false,
    pageName: "Ledger Group",
    cmpslug: "ledger-group",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerlist",
    component: "ledgerlist",
    title: "Ledger List",
    isActive: false,
    pageName: "Ledger List",
    cmpslug: "ledger-list",
    cmpsluglst: ["ledger-create", "ledger-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "ledgercreate",
    component: "ledgercreate",
    title: "Ledger Create",
    isActive: false,
    pageName: "Ledger Create",
    cmpslug: "ledger-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgeredit",
    component: "ledgeredit",
    title: "Ledger Edit",
    isActive: false,
    pageName: "Ledger Edit",
    cmpslug: "ledger-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerdetails",
    component: "ledgerdetails",
    title: "Ledger Details",
    isActive: false,
    pageName: "Ledger Details",
    cmpslug: "ledger-details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucherdetails",
    component: "voucherdetails",
    title: "Voucher Details",
    isActive: false,
    pageName: "Voucher Details",
    cmpslug: "voucher-details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productlist",
    component: "productlist",
    title: "Product List",
    isActive: false,
    pageName: "Product List",
    cmpslug: "product-list",
    cmpsluglst: ["new-product-create", "new-product-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "newproductcreate",
    component: "newproductcreate",
    title: "New Product Create",
    isActive: false,
    pageName: "New Product Create",
    cmpslug: "new-product-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "newproductedit",
    component: "newproductedit",
    title: "New Product Edit",
    isActive: false,
    pageName: "New Product Edit",
    cmpslug: "new-product-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "usercontrol",
    component: "usercontrol",
    title: "User Control",
    isActive: false,
    pageName: "User Control",
    cmpslug: "user-control",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "productedit",
    component: "productedit",
    title: "Product Edit",
    isActive: false,
    pageName: "Product Edit",
    cmpslug: "product-edit",
    isNewTab: false,
  },

  /****************Tranx Purchase Challan Start ***************************/
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_create",
    component: "tranx_purchase_challan_create",
    headline: "TranxPurchaseChallanCreate",
    isActive: false,
    pageName: "Purchase Challan Create",
    cmpslug: "purchase-challan-create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_list",
    component: "tranx_purchase_challan_list",
    headline: "tranxPurchaseChallanList",
    isActive: false,
    pageName: "Purchase Challan List",
    cmpslug: "purchase-challan-list",
    cmpsluglst: ["purchase-challan-create", "purchase-challan-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_edit",
    component: "tranx_purchase_challan_edit",
    headline: "tranxPurchaseChallanEdit",
    isActive: false,
    pageName: "Purchase Challan Edit",
    cmpslug: "purchase-challan-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_to_invoice",
    component: "tranx_purchase_challan_to_invoice",
    headline: "TranxPurchaseChallanToInvoice",
    isActive: false,
    pageName: "Purchase Challan To Invoice",
    cmpslug: "purchase-challan-to-invoice",
    isNewTab: false,
  },

  /****************Tranx Purchase Order Start ***************************/

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_list",
    component: "tranx_purchase_order_list",
    headline: "TranxPurchaseOrderList",
    isActive: false,
    pageName: "Purchase Order List",
    cmpslug: "purchase-order-list",
    cmpsluglst: ["purchase-order-create", "purchase-order-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_create",
    component: "tranx_purchase_order_create",
    headline: "TranxPurchaseOrderCreate",
    isActive: false,
    pageName: "Purchase Order Create",
    cmpslug: "purchase-order-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_edit",
    component: "tranx_purchase_order_edit",
    headline: "TranxPurchaseOrderEdit",
    isActive: false,
    pageName: "Purchase Order Edit",
    cmpslug: "purchase-order-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_to_invoice",
    component: "tranx_purchase_order_to_invoice",
    headline: "TranxPurchaseOrderToInvoice",
    isActive: false,
    pageName: "Purchase Order To Invoice",
    cmpslug: "purchase-order-to-invoice",
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_to_challan",
    component: "tranx_purchase_order_to_challan",
    headline: "TranxPurchaseOrderToChallan",
    isActive: false,
    pageName: "Purchase Order To Challan",
    cmpslug: "purchase-order-to-challan",
    isNewTab: false,
  },

  /**************************Tranx Purchase Invoice Start **************************/
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_list",
    component: "tranx_purchase_invoice_list",
    headline: "TranxPurchaseInvoiceList",
    isActive: false,
    pageName: "Purchase Invoice List",
    cmpslug: "purchase-invoice-list",
    cmpsluglst: ["purchase-invoice-create", "purchase-invoice-edit"],
    isNewTab: true,
  },

  // {
  //   _uid: uuidv4(),
  //   slug: "tranx_purchase_invoice_create_new",
  //   component: "tranx_purchase_invoice_create_new",
  //   headline: "TranxPurchaseInvoiceCreateNew",
  //   isActive: false,
  //   pageName: "New Purchase Invoice Create ",
  //   isNewTab: false,
  // },
  // {
  //   _uid: uuidv4(),
  //   slug: "tranx_purchase_invoice_create_modified",
  //   component: "tranx_purchase_invoice_create_modified",
  //   headline: "TranxPurchaseInvoiceCreateModified",
  //   isActive: false,
  //   pageName: "Purchase Invoice Create",
  //   isNewTab: false,
  // },

  // {
  //   _uid: uuidv4(),
  //   slug: "create_purchase_invoice",
  //   component: "create_purchase_invoice",
  //   headline: "CreatePurchaseInvoice",
  //   isActive: false,
  //   pageName: "Create Purchase Invoice",
  //   isNewTab: true,
  // },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_create",
    component: "tranx_purchase_invoice_create",
    headline: "TranxPurchaseInvoiceCreate",
    isActive: false,
    pageName: "Purchase Invoice Create",
    cmpslug: "purchase-invoice-create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_list",
    component: "tranx_sales_challan_list",
    headline: "TranxSalesChallanList",
    isActive: false,
    pageName: "Sales Challan List",
    cmpslug: "sales-challan-list",
    cmpsluglst: ["sales-challan-create", "sales-challan-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_create",
    component: "tranx_sales_challan_create",
    headline: "TranxSalesChallanCreate",
    isActive: false,
    pageName: "Sales Challan Create",
    cmpslug: "sales-challan-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_to_invoice",
    component: "tranx_sales_challan_to_invoice",
    headline: "TranxSalesChallanToInvoice",
    isActive: false,
    pageName: "Sales Challan To Invoice",
    cmpslug: "sales-challan-to-invoice",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_list",
    component: "tranx_sales_invoice_list",
    headline: "TranxSaleInvoiceList",
    isActive: false,
    pageName: "Sales Invoice List",
    cmpslug: "sales-invoice-list",
    cmpsluglst: ["sales-invoice-create", "sales-invoice-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_edit",
    cmpslug: "purchase-invoice-edit",
    component: "tranx_purchase_invoice_edit",
    headline: "TranxPurchaseInvoiceEdit",
    isActive: false,
    pageName: "Purchase Invoice Edit",
    cmpslug: "purchase-invoice-edit",
    isNewTab: false,
  },
  // {
  //   _uid: uuidv4(),
  //   slug: "tranx_purchase_invoice_edit_old",
  //   component: "tranx_purchase_invoice_edit_old",
  //   headline: "TranxPurchaseInvoiceEditOld",
  //   isActive: false,
  //   pageName: "Purchase Invoice Edit",
  //   isNewTab: false,
  // },

  /**************************Tranx Purchase Debit_note(Purchase Return) Start **************************/

  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_list",
    component: "tranx_debit_note_list",
    headline: "TranxDebitNoteList",
    isActive: false,
    pageName: "Purchase Return List",
    cmpslug: "purchase-return-list",
    cmpsluglst: ["purchase-return-create", "purchase-return-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_edit",
    component: "tranx_debit_note_edit",
    headline: "TranxDebitNoteEdit",
    isActive: false,
    pageName: "Debit Note Edit",
    cmpslug: "debit-note-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_product_list",
    component: "tranx_debit_note_product_list",
    title: "Debit Note Product List",
    isActive: false,
    pageName: "Purchase Return Create",
    cmpslug: "purchase-return-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_list_B2B",
    component: "tranx_debit_note_list_B2B",
    headline: "TranxDebitNoteListB2B",
    isActive: false,
    pageName: "Purchase Return List",
    cmpslug: "purchase-return-list",
    cmpsluglst: ["purchase-return-create", "purchase-return-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_product_list_B2B",
    component: "tranx_debit_note_product_list_B2B",
    title: "TranxDebitNoteProductListB2B",
    isActive: false,
    pageName: "Purchase Return Create",
    cmpslug: "purchase-return-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_edit_B2B",
    component: "tranx_debit_note_edit_B2B",
    headline: "TranxDebitNoteEditB2B",
    isActive: false,
    pageName: "Purchase Return Edit",
    cmpslug: "purchase-return-edit",
    isNewTab: false,
  },

  /**************************Tranx sales credit_note(Sales Return) Start **************************/

  {
    _uid: uuidv4(),
    slug: "tranx_credit_note_list",
    component: "tranx_credit_note_list",
    headline: "TranxCreditNote",
    isActive: false,
    pageName: "Sale Return",
    cmpslug: "credit_note",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_credit_note_edit",
    component: "tranx_credit_note_edit",
    headline: "TranxCreditNoteEdit",
    isActive: false,
    pageName: "TranxCreditNoteEdit",
    cmpslug: "tranx-credit-note-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_credit_note_product_list",
    component: "tranx_credit_note_product_list",
    title: "Credit Note Product List",
    isActive: false,
    pageName: "Sales Return Create",
    cmpslug: "sales-return-create",
    isNewTab: false,
  },

  /**************************Tranx Sales Order Start **************************/

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_list",
    component: "tranx_sales_order_list",
    headline: "TranxSalesOrderList",
    isActive: false,
    pageName: "Sales Order List",
    cmpslug: "sales-order-list",
    cmpsluglst: ["sales-order-create", "sales-order-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_create",
    component: "tranx_sales_order_create",
    headline: "TranxSalesOrderCreate",
    isActive: false,
    pageName: "Sales Order Create",
    cmpslug: "sales-order-create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_edit",
    component: "tranx_sales_order_edit",
    headline: "TranxSalesOrderEdit",
    isActive: false,
    pageName: "Sales Order Edit",
    cmpslug: "sales-order-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_to_challan",
    component: "tranx_sales_order_to_challan",
    headline: "TranxSalesOrderToChallan",
    isActive: false,
    pageName: "Sales Order To Challan",
    cmpslug: "sales-order-to-challan",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_to_invoice",
    component: "tranx_sales_order_to_invoice",
    headline: "TranxSalesOrderToInvoice",
    isActive: false,
    pageName: "Sales Order To Invoice",
    cmpslug: "sales-order-to-invoice",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_edit",
    component: "tranx_sales_challan_edit",
    headline: "TranxSalesChallanEdit",
    isActive: false,
    pageName: "Sales Challan Edit",
    cmpslug: "sales-challan-edit",
    isNewTab: false,
  },

  /************************Transaction Sales Quotation Start***********************/

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_list",
    component: "tranx_sales_quotation_list",
    headline: "TranxSalesQuotationList",
    isActive: false,
    pageName: "Sales Quotation List",
    cmpslug: "sales-quotation-list",
    cmpsluglst: ["sales-quotation-create", "sales-quotation-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_create",
    component: "tranx_sales_quotation_create",
    headline: "TranxSalesQuotationCreate",
    isActive: false,
    pageName: "Sales Quotation Create",
    cmpslug: "sales-quotation-create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_edit",
    component: "tranx_sales_quotation_edit",
    headline: "TranxSalesQuotationEdit",
    isActive: false,
    pageName: "Sales Quotation Edit",
    cmpslug: "sales-quotation-edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_to_challan",
    component: "tranx_sales_quotation_to_challan",
    headline: "TranxSalesQuotationToChallan",
    isActive: false,
    pageName: "Sales Quotation To Challan",
    cmpslug: "sales-quotation-to-challan",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_to_invoice",
    component: "tranx_sales_quotation_to_invoice",
    headline: "TranxSalesQuotationToInvoice",
    isActive: false,
    pageName: "Sales Quotation To Invoice",
    cmpslug: "sales-quotation-to-invoice",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_create",
    component: "tranx_sales_invoice_create",
    headline: "TranxSaleInvoiceCreate",
    isActive: false,
    pageName: "Sales Invoice Create",
    cmpslug: "sales-invoice-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_composition_create",
    component: "tranx_sales_invoice_composition_create",
    headline: "TranxSaleInvoiceInComposition",
    isActive: false,
    pageName: "Counsumer Sale Create",
    cmpslug: "counsumer-sale-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_composition_list",
    component: "tranx_sales_invoice_composition_list",
    headline: "TranxSaleInvoiceCompositionList",
    isActive: false,
    pageName: "Counsumer Sale List",
    cmpslug: "counsumer-sale-list",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_composition_edit",
    component: "tranx_sales_invoice_composition_edit",
    headline: "TranxSaleInvoiceCompositionEdit",
    isActive: false,
    pageName: "Counsumer Sale Edit",
    cmpslug: "counsumer-sale-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),

    slug: "tranx_sales_quotation_to_order",
    component: "tranx_sales_quotation_to_order",
    headline: "TranxSalesQuotationToOrder",
    isActive: false,
    pageName: "Sales Quotation To Order",
    cmpslug: "sales-quotation-to-order",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_edit",
    component: "tranx_sales_invoice_edit",
    headline: "TranxSalesInvoiceEdit",
    isActive: false,
    pageName: "Sales Invoice Edit",
    cmpslug: "sales-invoice-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_list",
    component: "tranx_sales_countersale_list",
    headline: "CounterSaleList",
    isActive: false,
    pageName: "Counter Sale List",
    cmpslug: "counter-sale-list",
    cmpsluglst: ["counter-sale-create", "counter-sale-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_create",
    component: "tranx_sales_countersale_create",
    headline: "CounterSaleCreate",
    isActive: false,
    pageName: "Counter Sale Create",
    cmpslug: "counter-sales-create",
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_edit",
    component: "tranx_sales_countersale_edit",
    headline: "CounterSaleEdit",
    isActive: false,
    pageName: "Counter Sale Edit",
    cmpslug: "counter-sales-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_countersale_to_saleinvoice",
    component: "tranx_countersale_to_saleinvoice",
    headline: "countertosale",
    isActive: false,
    pageName: "Counter To Sale ",
    cmpslug: "counter-sales-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_countersale_cmptrow",
    component: "tranx_countersale_cmptrow",
    headline: "countercmptrow",
    isActive: false,
    pageName: "Counter To Sale ",
    cmpslug: "counter-cmptrow",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_countersale_to_saleinvoice_gst",
    component: "tranx_countersale_to_saleinvoice_gst",
    headline: "countertosalegst",
    isActive: false,
    pageName: "Counter To Sale GST ",
    cmpslug: "counter-sales-create-gst",
    isNewTab: false,
  },

  /*****************Tranx Vouchers Start***********************/

  {
    _uid: uuidv4(),
    slug: "tranx_contra_List",
    component: "tranx_contra_List",
    headline: "ContraList",
    isActive: false,
    pageName: "Contra List",
    cmpslug: "contra-List",
    cmpsluglst: ["contra", "contra-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_contra",
    component: "tranx_contra",
    headline: "Contra",
    isActive: false,
    pageName: "Contra",
    cmpslug: "contra",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_contra_edit",
    component: "voucher_contra_edit",
    headline: "Contra Edit",
    isActive: false,
    pageName: "Contra Edit",
    cmpslug: "contra-edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_credit_List",
    component: "voucher_credit_List",
    headline: "VoucherCreditList",
    isActive: false,
    pageName: "Credit Note Voucher List",
    cmpslug: "credit-note-vocher-List",
    cmpsluglst: ["voucher-credit-note", "credit-note-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_credit_note",
    component: "voucher_credit_note",
    headline: "VoucherCreditNote",
    isActive: false,
    pageName: "Voucher Credit Note",
    cmpslug: "voucher-credit-note",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_credit_note_edit",
    component: "voucher_credit_note_edit",
    headline: "credit note edit",
    isActive: false,
    pageName: "credit note edit",
    cmpslug: "credit-note-edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_debit_note_List",
    component: "voucher_debit_note_List",
    headline: "VoucherDebitList",
    isActive: false,
    pageName: "Debit Note Voucher List",
    cmpslug: "debit-note-vocher-List",
    cmpsluglst: ["voucher-debit-note", "debit-note-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_debit_note",
    component: "voucher_debit_note",
    headline: "VoucherDebitNote",
    isActive: false,
    pageName: "Voucher Debit Note",
    cmpslug: "voucher-debit-note",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_debit_note_edit",
    component: "voucher_debit_note_edit",
    headline: "VoucherDebitNote",
    isActive: false,
    pageName: "Debit Note Edit",
    cmpslug: "debit-note-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_receipt_list",
    component: "voucher_receipt_list",
    headline: "ReceiptList",
    isActive: false,
    pageName: "Receipt List",
    cmpslug: "receipt-list",
    cmpsluglst: ["receipt", "receipt-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_journal_list",
    component: "voucher_journal_list",
    headline: "JournalList",
    isActive: false,
    pageName: "Journal List",
    cmpslug: "journal-list",
    cmpsluglst: ["journal", "journal-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_journal_edit",
    component: "voucher_journal_edit",
    headline: "Journal Edit",
    isActive: false,
    pageName: "Journal Edit",
    cmpslug: "journal-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_journal",
    component: "voucher_journal",
    headline: "Journal",
    isActive: false,
    pageName: "Journal",
    cmpslug: "journal",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_receipt",
    component: "voucher_receipt",
    headline: "Receipt",
    isActive: false,
    pageName: "Receipt",
    cmpslug: "receipt",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_receipt_edit",
    component: "voucher_receipt_edit",
    headline: "ReceiptEdit",
    isActive: false,
    pageName: "Receipt Edit",
    cmpslug: "receipt-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_payment_edit",
    component: "voucher_payment_edit",
    headline: "Payment Voucher Edit",
    isActive: false,
    pageName: "Payment Voucher Edit",
    cmpslug: "payment-voucher-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_paymentlist",
    component: "voucher_paymentlist",
    headline: "Payment Voucher List",
    isActive: false,
    pageName: "Payment Voucher List",
    cmpslug: "payment-vocher-list",
    cmpsluglst: ["payment-voucher-list", "payment-voucher-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_payment",
    component: "voucher_payment",
    headline: "Payment Voucher",
    isActive: false,
    pageName: "Payment Voucher",
    cmpslug: "payment-voucher",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "gst_input",
    component: "gst_input",
    headline: "GST Input",
    isActive: false,
    pageName: "GST Input",
    cmpslug: "gst-input",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "gst_input_edit",
    component: "gst_input_edit",
    headline: "GST Input Edit",
    isActive: false,
    pageName: "GST Input Edit",
    cmpslug: "gst-input-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "gst_input_list",
    component: "gst_input_list",
    headline: "GST Input List",
    isActive: false,
    pageName: "GST Input List",
    cmpslug: "gst-input-list",
    cmpsluglst: ["gst-input", "gst-input-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "gst_output",
    component: "gst_output",
    headline: "GST Output",
    isActive: false,
    pageName: "GST Output",
    cmpslug: "gst-output",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "gst_output_edit",
    component: "gst_output_edit",
    headline: "GST Output Edit",
    isActive: false,
    pageName: "GST Output Edit",
    cmpslug: "gst-output-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "gst_output_list",
    component: "gst_output_list",
    headline: "GST Output List",
    isActive: false,
    pageName: "GST Output List",
    cmpslug: "gst-output-list",
    cmpsluglst: ["gst-output", "gst-output-edit"],
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "purchaseVoucherList",
    component: "purchaseVoucherList",
    headline: "Purchase List",
    isActive: false,
    pageName: "Purchase List",
    cmpslug: "purchase-List",
    cmpsluglst: ["purchase-Voucher-Create", "purchase-Voucher-Edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "purchaseVoucherCreate",
    component: "purchaseVoucherCreate",
    headline: "Purchase Voucher Create",
    isActive: false,
    pageName: "Purchase Voucher Create",
    cmpslug: "purchase-Voucher-Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "purchaseVoucherEdit",
    component: "purchaseVoucherEdit",
    headline: "Purchase Voucher Edit",
    isActive: false,
    pageName: "Purchase Voucher Edit",
    cmpslug: "purchase-Voucher-Edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "salesVoucherList",
    component: "salesVoucherList",
    headline: "Sales List",
    isActive: false,
    pageName: "Sales List",
    cmpslug: "sales-List",
    cmpsluglst: ["salas-Create", "sales-Voucher-Edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "salesVoucherCreate",
    component: "salesVoucherCreate",
    headline: "Sales Create",
    isActive: false,
    pageName: "Sales Create",
    cmpslug: "sales-Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "salesVoucherEdit",
    component: "salesVoucherEdit",
    headline: "Sales Voucher Edit",
    isActive: false,
    pageName: "Sales Voucher Edit",
    cmpslug: "sales-voucher-edit",
    isNewTab: false,
  },

  // ! User Management
  {
    _uid: uuidv4(),
    slug: "user_access_mngt",
    component: "user_access_mngt",
    headline: "UserAccessManagement",
    isActive: false,
    pageName: "User List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "branchuser",
    component: "branchuser",
    title: "BranchUser",
    isActive: false,
    pageName: "Branch User",
    isNewTab: false,
  },
  /*****************************************Reports************************** */

  {
    _uid: uuidv4(),
    slug: "daybook",
    component: "daybook",
    headline: "DayBook",
    isActive: false,
    pageName: "Day Book",
    cmpslug: "day-book",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "stockSummery",
    component: "stockSummery",
    headline: "stockSummery",
    isActive: false,
    pageName: "Stock Summary",
    cmpslug: "stock-summary",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "trialbalance",
    component: "trialbalance",
    headline: "Trial Balance",
    isActive: false,
    pageName: "Trial Balance",
    cmpslug: "trial-balance",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "trialbalance2",
    component: "trialbalance2",
    headline: "Trial Balance",
    isActive: false,
    pageName: "Trial Balance",
    cmpslug: "trial-balance",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "trialbalance3",
    component: "trialbalance3",
    headline: "Trial Balance",
    isActive: false,
    pageName: "Trial Balance",
    cmpslug: "trial-balance",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "barcodedesign",
    component: "barcodedesign",
    headline: "Barcode Design",
    isActive: false,
    pageName: "Barcode Design",
    cmpslug: "barcode-design",
    isNewTab: true,
  },

  {
    _uid: uuidv4(),
    slug: "user_mgnt_list",
    component: "user_mgnt_list",
    headline: "User List",
    isActive: false,
    pageName: "User List",
    cmpslug: "user-list",
    cmpsluglst: ["user-create", "user-edit"],
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_create",
    component: "user_mgnt_create",
    headline: "User Create",
    isActive: false,
    pageName: "User Create",
    cmpslug: "user-create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "user_mgnt_edit",
    component: "user_mgnt_edit",
    headline: "User Edit",
    isActive: false,
    pageName: "User Edit",
    cmpslug: "user-edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_actions",
    component: "user_mgnt_mst_actions",
    title: "Master Actions",
    isActive: false,
    pageName: "Master Actions",
    cmpslug: "master-actions",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_modules",
    component: "user_mgnt_mst_modules",
    title: "Master Modules",
    isActive: false,
    pageName: "Master Modules",
    cmpslug: "master-modules",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_module_mapping",
    component: "user_mgnt_mst_module_mapping",
    title: "Master Module Mapping",
    isActive: false,
    pageName: "Master Module Mapping",
    cmpslug: "master-module-mapping",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "utilites_barcode_create",
    component: "utilites_barcode_create",
    title: "Barcode Create",
    isActive: false,
    pageName: "Barcode Create",
    cmpslug: "barcode-create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "utilites_print_bill",
    component: "utilites_print_bill",
    title: "Print Bill",
    isActive: false,
    pageName: "Print Bill",
    cmpslug: "print-bill",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "utilites_print_preview",
    component: "utilites_print_preview",
    title: "Print Priview",
    isActive: false,
    pageName: "Print Priview",
    cmpslug: "print-priview",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "productImport",
    component: "productImport",
    title: "Product Import",
    isActive: false,
    pageName: "Product Import",
    cmpslug: "product-import",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "stockImport",
    component: "stockImport",
    title: "Stock Import",
    isActive: false,
    pageName: "Stock Import",
    cmpslug: "stock-import",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerImport",
    component: "ledgerImport",
    title: "Ledger Import",
    isActive: false,
    pageName: "Ledger Import",
    cmpslug: "ledger-import",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "dispatchManagement",
    component: "dispatchManagement",
    title: "Dispatch Management",
    isActive: false,
    pageName: "Dispatch Management",
    cmpslug: "dispatch-management",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "profitbalance",
    component: "profitbalance",
    title: "Profit & Loss Account",
    isActive: false,
    pageName: "Profit & Loss Account",
    cmpslug: "profit-loss-account",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "profitandloss1",
    component: "profitandloss1",
    title: "Profit & Loss A/c",
    isActive: false,
    pageName: "Profit & Loss A/c",
    cmpslug: "profit-loss-a/c",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "profitandloss2",
    component: "profitandloss2",
    title: "Profit & Loss A/c",
    isActive: false,
    pageName: "Profit & Loss A/c",
    cmpslug: "profit-loss-a/c",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "profitandloss3",
    component: "profitandloss3",
    title: "Profit & Loss A/c",
    isActive: false,
    pageName: "Profit & Loss A/c",
    cmpslug: "profit-loss-a/c",
    isNewTab: false,
  },

  // Ledger Report

  {
    _uid: uuidv4(),
    slug: "ledgerReport1",
    component: "ledgerReport1",
    title: "Ledger Report",
    isActive: false,
    pageName: "Ledger Report",
    cmpslug: "ledger-report",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerReport2",
    component: "ledgerReport2",
    title: "Ledger Report",
    isActive: false,
    pageName: "Ledger Report",
    cmpslug: "ledger-report",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerReport3",
    component: "ledgerReport3",
    title: "Ledger Report",
    isActive: false,
    pageName: "Ledger Report",
    cmpslug: "ledger-report",
    isNewTab: false,
  },

  // Debtors
  {
    _uid: uuidv4(),
    slug: "debitNote1",
    component: "debitNote1",
    title: "Debit Note",
    isActive: false,
    pageName: "Debit Note",
    cmpslug: "debit-note",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "debitNote2",
    component: "debitNote2",
    title: "Debit Note",
    isActive: false,
    pageName: "Debit Note",
    cmpslug: "debit-note",
    isNewTab: false,
  },

  // CreditNote
  {
    _uid: uuidv4(),
    slug: "creditNote1",
    component: "creditNote1",
    title: "Credit Note",
    isActive: false,
    pageName: "Credit Note",
    cmpslug: "credit-note",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "creditNote2",
    component: "creditNote2",
    title: "Credit Note2",
    isActive: false,
    pageName: "Credit Note",
    cmpslug: "credit-note",
    isNewTab: false,
  },

  // Debtors
  {
    _uid: uuidv4(),
    slug: "debtors1",
    component: "debtors1",
    title: "Debtors",
    isActive: false,
    pageName: "Debtors",
    cmpslug: "debtors",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "debtors2",
    component: "debtors2",
    title: "Debtors",
    isActive: false,
    pageName: "Debtors",
    cmpslug: "debtors",
    isNewTab: true,
  },

  // Creditors
  {
    _uid: uuidv4(),
    slug: "creditors1",
    component: "creditors1",
    title: "Creditors",
    isActive: false,
    pageName: "Creditors",
    cmpslug: "creditors",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "creditors2",
    component: "creditors2",
    title: "Creditors",
    isActive: false,
    pageName: "Creditors",
    cmpslug: "creditors",
    isNewTab: false,
  },

  // Expenses
  {
    _uid: uuidv4(),
    slug: "expenses",
    component: "expenses",
    title: "Expenses",
    isActive: false,
    pageName: "Expenses",
    cmpslug: "expenses",
    isNewTab: true,
  },

  // DayBoolReport
  {
    _uid: uuidv4(),
    slug: "dayBookReport",
    component: "dayBookReport",
    title: "Day Book",
    isActive: false,
    pageName: "Day Book",
    cmpslug: "day-book",
    isNewTab: true,
  },

  // ReceiptReport
  {
    _uid: uuidv4(),
    slug: "receiptReport1",
    component: "receiptReport1",
    title: "Receipt",
    isActive: false,
    pageName: "Receipt",
    cmpslug: "receipt",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "receiptReport2",
    component: "receiptReport2",
    title: "Receipt",
    isActive: false,
    pageName: "Receipt",
    cmpslug: "receipt",
    isNewTab: false,
  },

  // Payment
  {
    _uid: uuidv4(),
    slug: "payment1",
    component: "payment1",
    title: "Payment",
    isActive: false,
    pageName: "Payment",
    cmpslug: "payment",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "payment2",
    component: "payment2",
    title: "Payment",
    isActive: false,
    pageName: "Payment",
    cmpslug: "payment",
    isNewTab: false,
  },

  // Journal
  {
    _uid: uuidv4(),
    slug: "journal1",
    component: "journal1",
    title: "Journal",
    isActive: false,
    pageName: "Journal",
    cmpslug: "journal",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "journal2",
    component: "journal2",
    title: "Journal",
    isActive: false,
    pageName: "Journal",
    cmpslug: "journal",
    isNewTab: false,
  },

  // Contra
  {
    _uid: uuidv4(),
    slug: "contra1",
    component: "contra1",
    title: "Contra",
    isActive: false,
    pageName: "Contra",
    cmpslug: "contra",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "contra2",
    component: "contra2",
    title: "Contra",
    isActive: false,
    pageName: "Contra",
    cmpslug: "contra",
    isNewTab: false,
  },

  // SalesRegister
  {
    _uid: uuidv4(),
    slug: "salesRegister1",
    component: "salesRegister1",
    title: "SalesRegister",
    isActive: false,
    pageName: "SalesRegister",
    cmpslug: "sales-register",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "salesRegister2",
    component: "salesRegister2",
    title: "SalesRegister",
    isActive: false,
    pageName: "SalesRegister",
    cmpslug: "sales-register",
    isNewTab: false,
  },

  // PurchaseRegister
  {
    _uid: uuidv4(),
    slug: "purchaseRegister1",
    component: "purchaseRegister1",
    title: "Purchase Register",
    isActive: false,
    pageName: "Purchase Register",
    cmpslug: "purchase-register",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "purchaseRegister2",
    component: "purchaseRegister2",
    title: "Purchase Register ",
    isActive: false,
    pageName: "Purchase Register ",
    cmpslug: "purchase-register",
    isNewTab: false,
  },

  // cash/bank book
  {
    _uid: uuidv4(),
    slug: "cashOrBankBook1",
    component: "cashOrBankBook1",
    title: "Cash Or Bank Book",
    isActive: false,
    pageName: "Cash Or Bank Book",
    cmpslug: "cash-bank-book",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "cashOrBankBook2",
    component: "cashOrBankBook2",
    title: "Cash Or Bank Book",
    isActive: false,
    pageName: "Cash Or Bank Book",
    cmpslug: "cash-bank-book",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "cashOrBankBook3",
    component: "cashOrBankBook3",
    title: "Cash Or Bank Book",
    isActive: false,
    pageName: "Cash Or Bank Book",
    cmpslug: "cash-bank-book",
    isNewTab: false,
  },

  //balance sheet start
  {
    _uid: uuidv4(),
    slug: "balancesheet",
    component: "balancesheet",
    title: "Balance Sheet",
    isActive: false,
    pageName: "Balance Sheet",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "balancesheet1",
    component: "balancesheet1",
    title: "Balance Sheet",
    isActive: false,
    pageName: "Balance Sheet",
    cmpslug: "balance-sheet",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "balancesheet2",
    component: "balancesheet2",
    title: "Balance Sheet",
    isActive: false,
    pageName: "Balance Sheet",
    cmpslug: "balance-sheet",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "balancesheet3",
    component: "balancesheet3",
    title: "Balance Sheet",
    isActive: false,
    pageName: "Balance Sheet",
    cmpslug: "balance-sheet",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "balancesheet4",
    component: "balancesheet4",
    title: "Balance Sheet",
    isActive: false,
    pageName: "Balance Sheet",
    cmpslug: "balance-sheet",
    isNewTab: false,
  },

  //balance sheet end

  //voucher start

  {
    _uid: uuidv4(),
    slug: "purchase",
    component: "purchase",
    title: "Purchase",
    isActive: false,
    pageName: "Purchase",
    cmpslug: "purchase",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "purchase1",
    component: "purchase1",
    title: "Purchase1",
    isActive: false,
    pageName: "Purchase Next",
    cmpslug: "purchase-next",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "sales",
    component: "sales",
    title: "sales",
    isActive: false,
    pageName: "Sales",
    cmpslug: "sales",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "sales1",
    component: "sales1",
    title: "sales1",
    isActive: false,
    pageName: "Sales Next",
    cmpslug: "sales-next",
    isNewTab: false,
  },

  //voucher end

  {
    _uid: uuidv4(),
    slug: "login1",
    component: "login1",
    title: "Login1",
    isActive: false,
    pageName: "Login1",
    cmpslug: "login1",
    isNewTab: false,
  },

  // WholeStock
  {
    _uid: uuidv4(),
    slug: "wholeStock1",
    component: "wholeStock1",
    title: "WholeStock",
    isActive: false,
    pageName: "WholeStock",
    cmpslug: "wholestock",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "wholeStock2",
    component: "wholeStock2",
    title: "WholeStock",
    isActive: false,
    pageName: "WholeStock",
    cmpslug: "wholestock",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "wholeStock3",
    component: "wholeStock3",
    title: "WholeStock",
    isActive: false,
    pageName: "WholeStock",
    cmpslug: "wholestock",
    isNewTab: false,
  },

  // AvailableStock
  {
    _uid: uuidv4(),
    slug: "available1",
    component: "available1",
    title: "Available Stock",
    isActive: false,
    pageName: "Available Stock",
    cmpslug: "available-stock",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "available2",
    component: "available2",
    title: "Available Stock",
    isActive: false,
    pageName: "Available Stock",
    cmpslug: "available-stock",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "available3",
    component: "available3",
    title: "Available Stock",
    isActive: false,
    pageName: "Available Stock",
    cmpslug: "available-stock",
    isNewTab: false,
  },
  // BatchStock
  {
    _uid: uuidv4(),
    slug: "batchStock1",
    component: "batchStock1",
    title: "Batch Stock",
    isActive: false,
    pageName: "Batch Stock",
    cmpslug: "available-stock",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "batchStock2",
    component: "batchStock2",
    title: "Batch Stock",
    isActive: false,
    pageName: "Batch Stock",
    cmpslug: "batch-stock",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "batchStock3",
    component: "batchStock3",
    title: "Batch Stock",
    isActive: false,
    pageName: "Batch Stock",
    cmpslug: "batch-stock",
    isNewTab: false,
  },
  // Stock Valuation
  {
    _uid: uuidv4(),
    slug: "valuation1",
    component: "valuation1",
    title: " Stock Valuation",
    isActive: false,
    pageName: " Stock Valuation",
    cmpslug: "stock-valuation",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "valuation2",
    component: "valuation2",
    title: " Stock Valuation",
    isActive: false,
    pageName: " Stock Valuation",
    cmpslug: "stock-valuation",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "valuation3",
    component: "valuation3",
    title: " Stock Valuation",
    isActive: false,
    pageName: " Stock Valuation",
    cmpslug: "stock-valuation",
    isNewTab: false,
  },
  // Stock MinimumLevel
  {
    _uid: uuidv4(),
    slug: "minimumLevel1",
    component: "minimumLevel1",
    title: " Minimum Level",
    isActive: false,
    pageName: " Minimum Level",
    cmpslug: "minimum-level",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "minimumLevel2",
    component: "minimumLevel2",
    title: " Minimum Level",
    isActive: false,
    pageName: " Minimum Level",
    cmpslug: "minimum-level",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "minimumLevel3",
    component: "minimumLevel3",
    title: " Minimum Level",
    isActive: false,
    pageName: " Minimum Level",
    cmpslug: "minimum-level",
    isNewTab: false,
  },
  // Stock MaximumLevel
  {
    _uid: uuidv4(),
    slug: "maximumLevel1",
    component: "maximumLevel1",
    title: " Maximum Level",
    isActive: false,
    pageName: " Maximum Level",
    cmpslug: "maximum-level",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "maximumLevel2",
    component: "maximumLevel2",
    title: " Maximum Level",
    isActive: false,
    pageName: " Maximum Level",
    cmpslug: "maximum-level",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "maximumLevel3",
    component: "maximumLevel3",
    title: " Maximum Level",
    isActive: false,
    pageName: " Maximum Level",
    cmpslug: "maximum-level",
    isNewTab: false,
  },

  // ProductNearExpiry
  {
    _uid: uuidv4(),
    slug: "productNearExpiry1",
    component: "productNearExpiry1",
    title: " Product  Near Expiry",
    isActive: false,
    pageName: "Product Near Expiry",
    cmpslug: "product-near-expiry",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productNearExpiry2",
    component: "productNearExpiry2",
    title: "Product Near Expiry",
    isActive: false,
    pageName: "Product Near Expiry",
    cmpslug: "product-near-expiry",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productNearExpiry3",
    component: "productNearExpiry3",
    title: "Product Near Expiry",
    isActive: false,
    pageName: "Product Near Expiry",
    cmpslug: "product-near-expiry",
    isNewTab: false,
  },

  // ExpiryProduct
  {
    _uid: uuidv4(),
    slug: "expiryProduct1",
    component: "expiryProduct1",
    title: " ExpiryProduct",
    isActive: false,
    pageName: "Expiry Product",
    cmpslug: "expiry-product",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "expiryProduct2",
    component: "expiryProduct2",
    title: "Expiry Product",
    isActive: false,
    pageName: "Expiry Product",
    cmpslug: "expiry-product",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "expiryProduct3",
    component: "expiryProduct3",
    title: "Expiry Product",
    isActive: false,
    pageName: "Expiry Product",
    cmpslug: "expiry-product",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "format1",
    component: "format1",
    title: "Format 1",
    isActive: false,
    pageName: "Format 1",
    cmpslug: "format-1",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "format2",
    component: "format2",
    title: "Format 2",
    isActive: false,
    pageName: "Format 2",
    cmpslug: "format-2",
    isNewTab: true,
  },
];

class DynamicComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMultiTab: false,
      selectedPageTitle: "Page1",
      selectedPageSlug: "page1",
      isNewTab: false,
      data: data,
      isShowMenu: false,
      isCancel: false,
      isVerify: false,
    };
  }
  logOutUserControl = () => {
    authenticationService.logout();
    if (this.props.userControl) {
      this.props.setUserControl("");
    }
    if (this.props.userPermissions) {
      this.props.setUserPermissions("");
    }
  };

  pageChange = (slug) => {
    let { data } = this.state;
    let pageName = "";
    let pslug = "";
    let fromslug = "";
    let isMultiScreen = "";
    let prop_data = "";
    let p_isNewTab = "";
    let isCancel = false;
    if (typeof slug == "string") {
      pslug = slug;
    } else if (typeof slug == "object") {
      pslug = slug["to"] ? slug["to"] : "";
      fromslug = slug["from"] ? slug["from"] : "";
      isMultiScreen = slug["isMultiScreen"] ? slug["isMultiScreen"] : "";
      prop_data = slug["prop_data"] ? slug["prop_data"] : "";
      p_isNewTab = slug["isNewTab"] != undefined ? slug["isNewTab"] : "";
      isCancel = slug["isCancel"] != undefined ? slug["isCancel"] : "";
    }

    let fdata = data;
    if (slug != "logout") {
      fdata = data.filter((v) => {
        v.isActive = false;
        return v;
      });
    }

    let activeNewTabStatus = false;
    let FThemeRoutes = fdata.map((v) => {
      // if (slug == "logout") {
      //   // eventBus.dispatch("handle_main_state", {
      //   //   statekey: "isShowMenu",
      //   //   statevalue: false,
      //   // });
      //   // this.logOutUserControl();
      //   // // authenticationService.logout();
      //   // //window.location.reload();
      //   // if (v.slug == "login") {
      //   //   this.setState({ isMultiTab: false, isShowMenu: false });
      //   //   v.isActive = true;
      //   // }
      //   console.log("logout clicked");
      // } else

      if (v.slug == pslug) {
        pageName = v.pageName;
        if (p_isNewTab === false) {
          activeNewTabStatus = p_isNewTab;
        } else {
          activeNewTabStatus = v.isNewTab;
        }

        v.isActive = true;
        v["handleToggleMultiScreen"] = this.handleToggleMultiScreen.bind(this);
        v["handleMultiScreen"] = this.handleMultiScreen.bind(this);
        v["handleisNewTab"] = this.handleisNewTab.bind(this);
        v["prop_data"] = prop_data ? (prop_data != "" ? prop_data : "") : "";
      }
      return v;
    });
    if (slug != "logout") {
      this.setState({
        data: FThemeRoutes,
        selectedPageTitle: pageName,
        selectedPageSlug: convertToSlug(pageName),
        isNewTab: activeNewTabStatus,
        isCancel: isCancel,
      });
    } else if (slug === "logout") {
      console.log("logout");
      this.setState({ isVerify: true });
    }
  };
  handleMainState = ({ statekey, statevalue }) => {
    this.setState({ [statekey]: statevalue });
  };
  componentDidMount() {
    eventBus.on("page_change", this.pageChange);
    eventBus.on("handle_multiscreen", this.handleMultiScreen);
    eventBus.on("handle_main_state", this.handleMainState);
  }

  componentWillUnmount() {
    eventBus.remove("page_change");
    eventBus.remove("handle_multiscreen");
    eventBus.remove("handle_main_state");
  }

  handleToggleMultiScreen = () => {
    this.setState({ isMultiTab: !this.state.isMultiTab });
  };
  handleMultiScreen = (status) => {
    this.setState({ isMultiTab: status });
  };

  handleisNewTab = (status) => {
    // console.warn("rahul::status", status);
    this.setState({ isNewTab: status });
  };

  setDynamicComponentsStates = (obj) => {
    this.setState(obj);
  };

  handleLogoutAfterVerifyTabs = () => {
    let { data: fdata } = this.state;
    this.logOutUserControl();
    let FThemeRoutes = fdata.map((v) => {
      if (v.slug == "login") {
        v["isActive"] = true;
      } else {
        v["isActive"] = false;
      }
      return v;
    });
    this.setState({
      isMultiTab: false,
      isShowMenu: false,
      data: FThemeRoutes,
      isVerify: false,
      selectedPageTitle: "login",
      selectedPageSlug: convertToSlug("login"),
      isNewTab: false,
      isCancel: false,
    });
  };
  render() {
    let {
      isMultiTab,
      selectedPageTitle,
      isNewTab,
      data,
      isShowMenu,
      selectedPageSlug,
      isCancel,
      isVerify,
    } = this.state;
    return (
      <div className="overflow-hidden">
        <MyNotifications />
        {isShowMenu == true && <Menus />}

        {isMultiTab == true ? (
          <>
            <MultiTab
              title={selectedPageTitle}
              isNewTab={isNewTab}
              selectedPageSlug={selectedPageSlug}
              setDynamicComponentsStates={this.setDynamicComponentsStates.bind(
                this
              )}
              data={data}
              isCancel={isCancel}
              isVerify={isVerify}
              handleLogoutAfterVerifyTabs={this.handleLogoutAfterVerifyTabs.bind(
                this
              )}
            >
              {data.map((block) => {
                if (block.isActive) {
                  return CustComponets(block);
                }
              })}
            </MultiTab>
          </>
        ) : (
          data.map((block) => {
            if (block.isActive) {
              return CustComponets(block);
            }
          })
        )}
      </div>
    );
  }
}
const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(DynamicComponents);
