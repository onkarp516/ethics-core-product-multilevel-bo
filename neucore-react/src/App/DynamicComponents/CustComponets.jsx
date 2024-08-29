import React, { Suspense } from "react";
import Page1 from "@/Pages/Page1";
import Catlog from "@/Pages/Catlog/Catlog";
import Page2 from "@/Pages/Page2";

import Login from "@/Pages/Login/Login";
// import PrintPreview from "../../Pages/Utilities/Barcode/PrintPreview";

const Dashboard = React.lazy(() => import("@/Pages/Dashboard/Dashboard"));
const Company = React.lazy(() => import("@/Pages/Company/Company"));
const CompanyList = React.lazy(() => import("@/Pages/Company/CompanyList"));

const NewCompany = React.lazy(() => import("@/Pages/Company/NewCompany"));
const NewCompanyEdit = React.lazy(() =>
  import("@/Pages/Company/NewCompanyEdit")
);
const CompanyAdmin = React.lazy(() => import("@/Pages/Company/CompanyAdmin"));
const CompanyUser = React.lazy(() => import("@/Pages/Company/CompanyUser"));
const Role = React.lazy(() => import("@/Pages/Role/Role"));
const RoleList = React.lazy(() => import("@/Pages/Role/RoleList"));
const RoleEdit = React.lazy(() => import("@/Pages/Role/RoleEdit"));

const Branch = React.lazy(() => import("@/Pages/Branch/Branch"));
const NewBranchCreate = React.lazy(() =>
  import("@/Pages/Branch/NewBranchCreate")
);
const NewBranchEdit = React.lazy(() => import("@/Pages/Branch/NewBranchEdit"));

const NewBranchAdminList = React.lazy(() =>
  import("@/Pages/Branch/NewBranchAdminList")
);
// const BranchEdit = React.lazy(() => import("@/Pages/Branch/BranchEdit"));
const BranchAdmin = React.lazy(() => import("@/Pages/Branch/BranchAdmin"));
const NewBranchAdminCreate = React.lazy(() =>
  import("@/Pages/Branch/NewBranchAdminCreate")
);
// const BranchAdminEdit = React.lazy(() =>
//   import("@/Pages/Branch/BranchAdminEdit")
// );
const NewBranchList = React.lazy(() => import("@/Pages/Branch/NewBranchList"));

// import CompanyUser from '@render/pages/Company/CompanyUser';
const Unit = React.lazy(() => import("@/Pages/Unit/Unit"));
const HSN = React.lazy(() => import("@/Pages/HSN/HSN"));
const AreaMaster = React.lazy(() => import("@/Pages/AreaMaster/AreaMaster"));
const BankMaster = React.lazy(() => import("@/Pages/BankMaster/BankMaster"));
const SalesmanMaster = React.lazy(() =>
  import("@/Pages/SalesmanMaster/SalesmanMaster")
);
const Package = React.lazy(() => import("@/Pages/Package/Package"));
const Flavour = React.lazy(() => import("@/Pages/Flavour/Flavour"));

const Tax = React.lazy(() => import("@/Pages/Tax/Tax"));
const Filters = React.lazy(() => import("@/Pages/Filters/Filters"));
const SubFilters = React.lazy(() => import("@/Pages/SubFilters/SubFilters"));

const Login1 = React.lazy(() => import("@/Pages/Login/Login1"));

const AssociateGroup = React.lazy(() =>
  import("@/Pages/AssociateGroup/AssociateGroup")
);
const LedgerList = React.lazy(() => import("@/Pages/Ledger/LedgerList"));
const LedgerCreate = React.lazy(() => import("@/Pages/Ledger/LedgerCreate"));
const LedgerEdit = React.lazy(() => import("@/Pages/Ledger/LedgerEdit"));
const LedgerDetails = React.lazy(() => import("@/Pages/Ledger/LedgerDetails"));
const VoucherDetails = React.lazy(() =>
  import("@/Pages/Ledger/VoucherDetails")
);
const ProductList = React.lazy(() => import("@/Pages/Product/ProductList"));

const NewProductCreate = React.lazy(() =>
  import("@/Pages/Product/NewProductCreate")
);
const NewProductEdit = React.lazy(() =>
  import("@/Pages/Product/NewProductEdit")
);

const ProductEdit = React.lazy(() => import("@/Pages/Product/ProductEdit"));
const Biradar = React.lazy(() => import("@/Pages/FormatPrinter/Biradar"));
const Woodline = React.lazy(() => import("@/Pages/FormatPrinter/Woodline"));

/*****************Tranx Purchase start****************/
const TranxPurchaseChallanCreate = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Challan/TranxPurchaseChallanCreate")
);
const TranxPurchaseChallanList = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Challan/TranxPurchaseChallanList")
);
const TranxPurchaseChallanEdit = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Challan/TranxPurchaseChallanEdit")
);
const TranxPurchaseOrderList = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Order/TranxPurchaseOrderList")
);
const TranxPurchaseOrderCreate = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Order/TranxPurchaseOrderCreate")
);
const TranxPurchaseOrderEdit = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Order/TranxPurchaseOrderEdit")
);
const TranxPurchaseChallanToInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Challan/TranxPurchaseChallanToInvoice")
);
const TranxPurchaseOrderToChallan = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Order/TranxPurchaseOrderToChallan")
);
const TranxPurchaseOrderToInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Order/TranxPurchaseOrderToInvoice")
);
const TranxPurchaseInvoiceList = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceList")
);
const TranxPurchaseInvoiceCreate = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceCreate")
);
// const TranxPurchaseInvoiceCreateNew = React.lazy(() =>
//   import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceCreateNew")
// );
// const TranxPurchaseInvoiceCreateModified = React.lazy(() =>
//   import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceCreateModified")
// );
const CreatePurchaseInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Invoice/CreatePurchaseInvoice")
);
const TranxSalesChallanList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Challan/TranxSalesChallanList")
);
const TranxSalesChallanCreate = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Challan/TranxSalesChallanCreate")
);
const TranxSalesChallanEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Challan/TranxSalesChallanEdit")
);
const TranxSalesChallanToInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Challan/TranxSalesChallanToInvoice")
);
const TranxSaleInvoiceList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceList")
);

// const TranxSaleInvoiceCreate = React.lazy(() =>
//   import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceCreate")
// );
const TranxSalesInvoiceCreate = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSalesInvoiceCreate")
);
const TranxSaleInvoiceCompositionList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceCompositionList")
);
const TranxSaleInvoiceCompositionEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceCompositionEdit")
);
const TranxSaleInvoiceInComposition = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceInComposition")
);
const TranxSalesInvoiceEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSalesInvoiceEdit")
);

const TranxPurchaseInvoiceEdit = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceEdit")
);

// const TranxPurchaseInvoiceEditOld = React.lazy(() =>
//   import("@/Pages/Tranx/Purchase/Invoice/TranxPurchaseInvoiceEditOld")
// );
/************************Transaction sales Start*************************** */
const TranxSalesOrderList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Order/TranxSalesOrderList")
);
const TranxSalesOrderCreate = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Order/TranxSalesOrderCreate")
);

const TranxSalesOrderEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Order/TranxSalesOrderEdit")
);

const TranxSalesOrderToChallan = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Order/TranxSalesOrderToChallan")
);
const TranxSalesOrderToInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Order/TranxSalesOrderToInvoice")
);
const TranxSalesQuotationList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationList")
);
const TranxSalesQuotationEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationEdit")
);
const TranxSalesQuotationCreate = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationCreate")
);
const TranxSalesQuotationToChallan = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationToChallan")
);
const TranxSalesQuotationToInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationToInvoice")
);
const TranxSalesQuotationToOrder = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Quotation/TranxSalesQuotationToOrder")
);
const CounterSaleList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterSaleList")
);

const CounterSaleCreate = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterSaleCreate")
);

const CounterSaleEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterSaleEdit")
);
const ContraList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Contra/ContraList")
);
const CounterToSaleInvoice = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterToSaleInvoice")
);
const CounterToSaleInvoiceGST = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterToSaleInvoiceGST")
);
const CounterCmpTRow = React.lazy(() =>
  import("@/Pages/Tranx/Sales/CounterSale/CounterCmpTRow")
);
const Contra = React.lazy(() => import("@/Pages/Tranx/Vouchers/Contra/Contra"));
const ContraEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Contra/ContraEdit")
);
const VoucherCreditList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Credit/VoucherCreditList")
);
const VoucherCreditNote = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Credit/VoucherCreditNote")
);
const VoucherCreditEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Credit/VoucherCreditEdit")
);
const VoucherDebitList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Debit/VoucherDebitList")
);
const VoucherDebitNote = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Debit/VoucherDebitNote")
);
const VoucherDebitEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Debit/VoucherDebitEdit")
);
const TranxCreditNote = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Credit_Note/TranxCreditNote")
);

const TranxCreditNoteProductList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Credit_Note/TranxCreditNoteProductList")
);

const TranxCreditNoteEdit = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Credit_Note/TranxCreditNoteEdit")
);

const TranxDebitNoteList = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteList")
);

const TranxDebitNoteListB2B = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteListB2B")
);

const TranxDebitNoteProductList = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteProductList")
);

const TranxDebitNoteProductCreateB2B = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteProductCreateB2B")
);

const TranxDebitNoteEdit = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteEdit")
);

const TranxDebitNoteEditB2B = React.lazy(() =>
  import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteEditB2B")
);

const ReceiptList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/ReceiptList")
);
const Receipt = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/Receipt")
);

const ReceiptEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/ReceiptEdit")
);
const PaymentList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Payment/PaymentList")
);
const Payment = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Payment/Payment")
);
const PaymentEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Payment/PaymentEdit")
);
const PurchaseVoucherList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Purchase/PurchaseVoucherList")
);
const PurchaseVoucherCreate = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Purchase/PurchaseVoucherCreate")
);
const PurchaseVoucherEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Purchase/PurchaseVoucherEdit")
);
const SalesVoucherList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Sales/SalesVoucherList")
);
const SalesVoucherCreate = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Sales/SalesVoucherCreate")
);
const SalesVoucherEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Sales/SalesVoucherEdit")
);
const Journal = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/Journal")
);
const JournalList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/JournalList")
);
const JournalEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/JournalEdit")
);

const GSTInput = React.lazy(() => import("@/Pages/Tranx/Vouchers/GSTInput"));
const GSTInputEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/GSTInputEdit")
);
const GSTInputList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/GSTInputList")
);
const GSTOutput = React.lazy(() => import("@/Pages/Tranx/Vouchers/GSTOutput"));
const GSTOutputEdit = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/GSTOutputEdit")
);
const GSTOutputList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/GSTOutputList")
);

// ! User Management
const UserAccessManagement = React.lazy(() =>
  import("@/Pages/UserManagement/UserList")
);
const BranchUser = React.lazy(() => import("@/Pages/Branch/BranchUser"));

const UserMgntList = React.lazy(() =>
  import("@/Pages/UserManagement/UserList")
);

const UserMgntCreate = React.lazy(() =>
  import("@/Pages/UserManagement/UserCreate")
);

const UserMgntEdit = React.lazy(() =>
  import("@/Pages/UserManagement/UserEdit")
);

const MstActions = React.lazy(() =>
  import("@/Pages/UserManagement/MstActions")
);
const MstModules = React.lazy(() =>
  import("@/Pages/UserManagement/MstModules")
);
const MstModuleMapping = React.lazy(() =>
  import("@/Pages/UserManagement/MstModuleMapping")
);

const BarcodeCreate = React.lazy(() =>
  import("@/Pages/Utilities/Barcode/BarcodeCreate")
);
const PrintBill = React.lazy(() =>
  import("@/Pages/Utilities/Barcode/PrintBill")
);
const PrintPreview = React.lazy(() =>
  import("@/Pages/Utilities/Barcode/PrintPreview")
);

const DayBook = React.lazy(() => import("@/Pages/Reports/DayBook"));
// const stockSummery = React.lazy(() => import("@Pages/Inventory/stockSummery"));

const stockSummery = React.lazy(() => import("@/Pages/Inventory/stockSummery"));

const TrialBalance = React.lazy(() =>
  import("@/Pages/TrialBalance/TrialBalance")
);
const TrialBalance2 = React.lazy(() =>
  import("@/Pages/TrialBalance/TrialBalance2")
);
const TrialBalance3 = React.lazy(() =>
  import("@/Pages/TrialBalance/TrialBalance3")
);
const BarcodeDesign = React.lazy(() => import("@/Pages/Reports/BarcodeDesign"));
const ProfitBalance = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ProfitBalance")
);
const ProfitAndLoss1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ProfitAndLoss1")
);
const ProfitAndLoss2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ProfitAndLoss2")
);
const ProfitAndLoss3 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ProfitAndLoss3")
);
// LedgerRepor
const LedgerReport1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/LedgerReport1")
);
const LedgerReport2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/LedgerReport2")
);
const LedgerReport3 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/LedgerReport3")
);
// Debit Note
const DebitNote1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/DebitNote1")
);
const DebitNote2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/DebitNote2")
);

// Credit Note
const CreditNote1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/CreditNote1")
);
const CreditNote2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/CreditNote2")
);

// Debtors
const Debtors1 = React.lazy(() => import("@/Pages/Reports/Accounts/Debtors1"));
const Debtors2 = React.lazy(() => import("@/Pages/Reports/Accounts/Debtors2"));

// Creditors
const Creditors1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/Creditors1")
);
const Creditors2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/Creditors2")
);

const Expenses = React.lazy(() => import("@/Pages/Reports/Accounts/Expenses"));

const DayBookReport = React.lazy(() =>
  import("@/Pages/Reports/Accounts/DayBookReport")
);
// ReceiptReport
const ReceiptReport1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ReceiptReport1")
);

const ReceiptReport2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/ReceiptReport2")
);

// Payment
const Payment1 = React.lazy(() => import("@/Pages/Reports/Accounts/Payment1"));

const Payment2 = React.lazy(() => import("@/Pages/Reports/Accounts/Payment2"));

// Journal
const Journal1 = React.lazy(() => import("@/Pages/Reports/Accounts/Journal1"));

const Journal2 = React.lazy(() => import("@/Pages/Reports/Accounts/Journal2"));

// Journal
const Contra1 = React.lazy(() => import("@/Pages/Reports/Accounts/Contra1"));

const Contra2 = React.lazy(() => import("@/Pages/Reports/Accounts/Contra2"));

// SalesRegister
const SalesRegister1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/SalesRegister1")
);

const SalesRegister2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/SalesRegister2")
);

// PurchaseRegister
const PurchaseRegister1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/PurchaseRegister1")
);

const PurchaseRegister2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/PurchaseRegister2")
);

// Cash/Bank Book
const CashOrBankBook1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/CashOrBankBook1")
);
const CashOrBankBook2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/CashOrBankBook2")
);
const CashOrBankBook3 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/CashOrBankBook3")
);

// WholeStock
const WholeStock1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/WholeStock1")
);
const WholeStock2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/WholeStock2")
);
const WholeStock3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/WholeStock3")
);

// Available Stock
const Available1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Available1")
);
const Available2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Available2")
);
const Available3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Available3")
);

// Batch Stock
const BatchStock1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/BatchStock1")
);
const BatchStock2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/BatchStock2")
);
const BatchStock3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/BatchStock3")
);

// stock Valuation
const Valuation1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Valuation1")
);
const Valuation2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Valuation2")
);
const Valuation3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/Valuation3")
);

// stock maximum level
const MaximumLevel1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MaximumLevel1")
);
const MaximumLevel2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MaximumLevel2")
);
const MaximumLevel3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MaximumLevel3")
);

// stock minimum level
const MinimumLevel1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MinimumLevel1")
);
const MinimumLevel2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MinimumLevel2")
);
const MinimumLevel3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/MinimumLevel3")
);

// ProductNearExpiry
const ProductNearExpiry1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ProductNearExpiry1")
);
const ProductNearExpiry2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ProductNearExpiry2")
);
const ProductNearExpiry3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ProductNearExpiry3")
);

// ExpiryProduct
const ExpiryProduct1 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ExpiryProduct1")
);
const ExpiryProduct2 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ExpiryProduct2")
);
const ExpiryProduct3 = React.lazy(() =>
  import("@/Pages/Reports/StockBook/ExpiryProduct3")
);

//balance sheet start

const BalanceSheet = React.lazy(() =>
  import("@/Pages/Reports/Accounts/BalanceSheet")
);
const BalanceSheet1 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/BalanceSheet1")
);
const BalanceSheet2 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/BalanceSheet2")
);
const BalanceSheet3 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/BalanceSheet3")
);
const BalanceSheet4 = React.lazy(() =>
  import("@/Pages/Reports/Accounts/BalanceSheet4")
);

//balance sheet end

//vouchers start
const Purchase = React.lazy(() => import("@/Pages/Reports/Vouchers/Purchase"));
const Purchase1 = React.lazy(() =>
  import("@/Pages/Reports/Vouchers/Purchase1")
);
const Sales = React.lazy(() => import("@/Pages/Reports/Vouchers/Sales"));
const Sales1 = React.lazy(() => import("@/Pages/Reports/Vouchers/Sales1"));
const UserControl = React.lazy(() => import("@/Pages/UserControl/Usercontrol"));

//vouchers end
const ShortcutKeys = React.lazy(() =>
  import("@/Pages/ShortcutKeys/ShortcutKeys")
);

//Utilities start

const ProductImport = React.lazy(() =>
  import("@/Pages/Utilities/ImpExport/ProductImport")
);
const StockImport = React.lazy(() =>
  import("@/Pages/Utilities/ImpExport/StockImport")
);
const LedgerImport = React.lazy(() =>
  import("@/Pages/Utilities/ImpExport/LedgerImport")
);
const DispatchManagement = React.lazy(() =>
  import("@/Pages/Utilities/DispatchManagement")
);
//Utilities end

//! Bill Format Start
const Format1 = React.lazy(() => import("@/Pages/BillFormat/Format1"));
const Format2 = React.lazy(() => import("@/Pages/BillFormat/Format2"));
//? Bill Format End

// testing hsn start
// const HSNTest = React.lazy(() => import("@/Pages/HSNTest/HsnTest"));
// testing hsn end

// ! User Management

const Components = {
  shortcutKeys: ShortcutKeys,
  page1: Page1,
  catlog: Catlog,
  page2: Page2,
  login: Login1,
  dashboard: Dashboard,
  company: Company,
  companyList: CompanyList,
  newCompany: NewCompany,
  newCompanyEdit: NewCompanyEdit,
  companyAdmin: CompanyAdmin,
  companyuser: CompanyUser,
  role: Role,
  roleedit: RoleEdit,
  rolelist: RoleList,
  branch: Branch,
  newBranchCreate: NewBranchCreate,
  newbranchedit: NewBranchEdit,
  newBranchAdminList: NewBranchAdminList,
  // branchEdit: BranchEdit,
  branchAdmin: BranchAdmin,
  newBranchAdminCreate: NewBranchAdminCreate,
  // branchAdminEdit: BranchAdminEdit,
  newBranchList: NewBranchList,
  package: Package,
  flavour: Flavour,
  unit: Unit,
  hsn: HSN,
  areaMaster: AreaMaster,
  bankMaster: BankMaster,
  salesmanMaster: SalesmanMaster,
  associategroup: AssociateGroup,
  ledgerlist: LedgerList,
  ledgercreate: LedgerCreate,
  ledgeredit: LedgerEdit,
  ledgerdetails: LedgerDetails,
  voucherdetails: VoucherDetails,
  productlist: ProductList,
  newproductcreate: NewProductCreate,
  newproductedit: NewProductEdit,

  productedit: ProductEdit,
  tax: Tax,
  filters: Filters,
  subfilters: SubFilters,
  usercontrol: UserControl,
  /*********************Bill Format***************************/

  biradar: Biradar,
  woodline: Woodline,
  /****************Tranx Purchase Order Start ***************************/

  tranx_purchase_order_list: TranxPurchaseOrderList,
  tranx_purchase_order_create: TranxPurchaseOrderCreate,
  tranx_purchase_order_edit: TranxPurchaseOrderEdit,
  tranx_purchase_order_to_challan: TranxPurchaseOrderToChallan,
  tranx_purchase_order_to_invoice: TranxPurchaseOrderToInvoice,

  /****************Tranx Purchase Challan Start ***************************/

  tranx_purchase_challan_create: TranxPurchaseChallanCreate,
  tranx_purchase_challan_list: TranxPurchaseChallanList,
  tranx_purchase_challan_edit: TranxPurchaseChallanEdit,
  tranx_purchase_challan_to_invoice: TranxPurchaseChallanToInvoice,

  /****************Tranx Purchase Invoice Start ***************************/

  tranx_purchase_invoice_list: TranxPurchaseInvoiceList,
  tranx_purchase_invoice_create: TranxPurchaseInvoiceCreate,
  // tranx_purchase_invoice_create_new: TranxPurchaseInvoiceCreateNew,
  // tranx_purchase_invoice_create_modified: TranxPurchaseInvoiceCreateModified,
  create_purchase_invoice: CreatePurchaseInvoice,

  /*****************Tranx Sales Challan Start*************************/

  tranx_sales_challan_list: TranxSalesChallanList,
  tranx_sales_challan_create: TranxSalesChallanCreate,
  tranx_sales_challan_edit: TranxSalesChallanEdit,
  tranx_sales_challan_to_invoice: TranxSalesChallanToInvoice,
  tranx_sales_invoice_list: TranxSaleInvoiceList,
  tranx_sales_invoice_create: TranxSalesInvoiceCreate,
  tranx_sales_invoice_composition_create: TranxSaleInvoiceInComposition,
  tranx_sales_invoice_composition_list: TranxSaleInvoiceCompositionList,
  tranx_sales_invoice_composition_edit: TranxSaleInvoiceCompositionEdit,
  tranx_sales_invoice_edit: TranxSalesInvoiceEdit,
  tranx_purchase_invoice_edit: TranxPurchaseInvoiceEdit,
  // tranx_purchase_invoice_edit_old: TranxPurchaseInvoiceEditOld,

  /****************Tranx Purchase Debit_note(Purchase Return B2C) Start ***************************/

  tranx_debit_note_list: TranxDebitNoteList,
  tranx_debit_note_product_list: TranxDebitNoteProductList,
  tranx_debit_note_edit: TranxDebitNoteEdit,

  /****************Tranx Purchase Debit_note(Purchase Return B2B) Start ***************************/

  tranx_debit_note_list_B2B: TranxDebitNoteListB2B,
  tranx_debit_note_product_list_B2B: TranxDebitNoteProductCreateB2B,
  tranx_debit_note_edit_B2B: TranxDebitNoteEditB2B,

  /****************Tranx Sales Credit_note(Sales Return) Start ***************************/

  tranx_credit_note_list: TranxCreditNote,
  tranx_credit_note_product_list: TranxCreditNoteProductList,

  tranx_credit_note_edit: TranxCreditNoteEdit,

  /****************Tranx Sales Order Start ***************************/

  tranx_sales_order_list: TranxSalesOrderList,
  tranx_sales_order_create: TranxSalesOrderCreate,
  tranx_sales_order_edit: TranxSalesOrderEdit,
  tranx_sales_order_to_challan: TranxSalesOrderToChallan,
  tranx_sales_order_to_invoice: TranxSalesOrderToInvoice,

  /****************Tranx Sales Quotation Start ***************************/

  tranx_sales_quotation_list: TranxSalesQuotationList,
  tranx_sales_quotation_create: TranxSalesQuotationCreate,
  tranx_sales_quotation_edit: TranxSalesQuotationEdit,
  tranx_sales_quotation_to_challan: TranxSalesQuotationToChallan,
  tranx_sales_quotation_to_invoice: TranxSalesQuotationToInvoice,
  tranx_sales_quotation_to_order: TranxSalesQuotationToOrder,

  /****************Tranx Counter  Sales  Start ***************************/

  tranx_sales_countersale_list: CounterSaleList,
  tranx_sales_countersale_create: CounterSaleCreate,
  tranx_sales_countersale_edit: CounterSaleEdit,
  tranx_countersale_to_saleinvoice: CounterToSaleInvoice,
  tranx_countersale_to_saleinvoice_gst: CounterToSaleInvoiceGST,
  tranx_countersale_cmptrow: CounterCmpTRow,

  /*******************Tranx Vouchers start*********************/
  tranx_contra_List: ContraList,
  tranx_contra: Contra,
  voucher_contra_edit: ContraEdit,
  voucher_credit_List: VoucherCreditList,
  voucher_credit_note: VoucherCreditNote,
  voucher_credit_note_edit: VoucherCreditEdit,
  voucher_debit_note_List: VoucherDebitList,
  voucher_debit_note_edit: VoucherDebitEdit,
  voucher_debit_note: VoucherDebitNote,
  voucher_receipt_list: ReceiptList,
  voucher_receipt: Receipt,
  voucher_receipt_edit: ReceiptEdit,
  voucher_paymentlist: PaymentList,
  voucher_payment: Payment,
  voucher_payment_edit: PaymentEdit,
  voucher_journal_list: JournalList,
  voucher_journal: Journal,
  voucher_journal_edit: JournalEdit,
  user_access_mngt: UserAccessManagement,
  branchuser: BranchUser,
  gst_input: GSTInput,
  gst_input_edit: GSTInputEdit,
  gst_input_list: GSTInputList,
  gst_output: GSTOutput,
  gst_output_edit: GSTOutputEdit,
  gst_output_list: GSTOutputList,
  purchaseVoucherList: PurchaseVoucherList,
  purchaseVoucherCreate: PurchaseVoucherCreate,
  purchaseVoucherEdit: PurchaseVoucherEdit,
  salesVoucherList: SalesVoucherList,
  salesVoucherCreate: SalesVoucherCreate,
  salesVoucherEdit: SalesVoucherEdit,
  login1: Login1,
  /****************************************Reports*********************************/
  daybook: DayBook,
  stockSummery: stockSummery,
  trialbalance: TrialBalance,
  trialbalance2: TrialBalance2,
  trialbalance3: TrialBalance3,
  barcodedesign: BarcodeDesign,
  //! /*! UserMgntList */

  user_mgnt_list: UserMgntList,
  user_mgnt_create: UserMgntCreate,
  user_mgnt_edit: UserMgntEdit,
  user_mgnt_mst_actions: MstActions,
  user_mgnt_mst_modules: MstModules,
  user_mgnt_mst_module_mapping: MstModuleMapping,
  //! /*! UserMgntList */

  // ? BarcodeCreate Start

  utilites_barcode_create: BarcodeCreate,
  utilites_print_bill: PrintBill,
  utilites_print_preview: PrintPreview,
  profitbalance: ProfitBalance,
  profitandloss1: ProfitAndLoss1,
  profitandloss2: ProfitAndLoss2,
  profitandloss3: ProfitAndLoss3,
  //balance sheet start
  balancesheet: BalanceSheet,
  balancesheet1: BalanceSheet1,
  balancesheet2: BalanceSheet2,
  balancesheet3: BalanceSheet3,
  balancesheet4: BalanceSheet4,
  //balance sheet end
  // LedgerRepor
  ledgerReport1: LedgerReport1,
  ledgerReport2: LedgerReport2,
  ledgerReport3: LedgerReport3,

  // Debit Note
  debitNote1: DebitNote1,
  debitNote2: DebitNote2,

  // Credit Note
  creditNote1: CreditNote1,
  creditNote2: CreditNote2,

  //  Detors
  debtors1: Debtors1,
  debtors2: Debtors2,

  //Expenses
  expenses: Expenses,

  //DayBookReport
  dayBookReport: DayBookReport,

  // ReceiptReport
  receiptReport1: ReceiptReport1,
  receiptReport2: ReceiptReport2,

  // Payment
  payment1: Payment1,
  payment2: Payment2,

  // SalesRegister
  salesRegister1: SalesRegister1,
  salesRegister2: SalesRegister2,

  // PurchaseRegister
  purchaseRegister1: PurchaseRegister1,
  purchaseRegister2: PurchaseRegister2,

  // cash/bank book
  cashOrBankBook1: CashOrBankBook1,
  cashOrBankBook2: CashOrBankBook2,
  cashOrBankBook3: CashOrBankBook3,

  // Journal
  journal1: Journal1,
  journal2: Journal2,

  // Contra
  contra1: Contra1,
  contra2: Contra2,

  // Creditors
  creditors1: Creditors1,
  creditors2: Creditors2,
  //vouchers start
  purchase: Purchase,
  purchase1: Purchase1,
  sales: Sales,
  sales1: Sales1,
  //vouchers end

  // WholeStock
  wholeStock1: WholeStock1,
  wholeStock2: WholeStock2,
  wholeStock3: WholeStock3,

  // Available Stock
  available1: Available1,
  available2: Available2,
  available3: Available3,

  // Batch Stock
  batchStock1: BatchStock1,
  batchStock2: BatchStock2,
  batchStock3: BatchStock3,

  // Stock Valuation
  valuation1: Valuation1,
  valuation2: Valuation2,
  valuation3: Valuation3,

  // Stock MinimumLevel
  minimumLevel1: MinimumLevel1,
  minimumLevel2: MinimumLevel2,
  minimumLevel3: MinimumLevel3,

  // Stock MaximumLevel
  maximumLevel1: MaximumLevel1,
  maximumLevel2: MaximumLevel2,
  maximumLevel3: MaximumLevel3,

  // ProductNearExpiry
  productNearExpiry1: ProductNearExpiry1,
  productNearExpiry2: ProductNearExpiry2,
  productNearExpiry3: ProductNearExpiry3,

  // ExpiryProduct
  expiryProduct1: ExpiryProduct1,
  expiryProduct2: ExpiryProduct2,
  expiryProduct3: ExpiryProduct3,

  //Product Import
  productImport: ProductImport,
  stockImport: StockImport,
  ledgerImport: LedgerImport,
  dispatchManagement: DispatchManagement,
  //Bill Format
  format1: Format1,
  format2: Format2,

  // testing hsn start
  // hsntest: HSNTest,
  // testing hsn end
};

export default function CustComponets(block) {
  if (typeof Components[block.component] !== "undefined") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {React.createElement(Components[block.component], {
          key: block._uid,
          block: block,
        })}
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {React.createElement(
        () => (
          <div>The component {block.component} has not been created yet.</div>
        ),
        { key: block._uid }
      )}
    </Suspense>
  );
}
