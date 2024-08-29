import React from "react";
import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
  Tab,
  Nav,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import mousetrap, { bind } from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import add_icon from "@/assets/images/add_icon.svg";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import {
  getSundryDebtors,
  getLastSalesInvoiceNo,
  getSalesAccounts,
  getProduct,
  createSalesInvoice,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  getInvoiceBill,
  get_Product_batch,
  getProductFlavourList,
  listTranxCreditNotes,
  getDiscountLedgers,
  salesValidation,
  getGSTListByLedgerId,
  checkInvoiceDateIsBetweenFY,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  validate_sales_invoices,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  delete_Product_list,
  product_units,
  transaction_ledger_list,
  transaction_product_list,
  transaction_ledger_details,
  getSalesInvoiceSupplierListByProductId,
  quantityVerificationById,
  getCBADReceipt,
  getSalesInvoiceById,
  getTranxDebitNoteListInvoiceBillSC,
  get_supplierlist_by_productid,
  getSalesReturnsProductFpubyId,
  getSalesReturnById,
  getdebtorspendingbills,
  getTranxCreditNoteListInvoiceBillSC,
  createSalesReturn,
  editSalesReturn,
  get_credit_pending_bills,
  getSalesReturnBill,
} from "@/services/api_functions";

import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import {
  MyTextDatePicker,
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  TRAN_NO,
  purchaseSelect,
  isActionExist,
  fnTranxCalculation,
  dateRegex,
  getValue,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  allEqual,
  INRformat,
  OnlyEnterAmount,
  isUserControl,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { values } from "lodash";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
import MdlBillLst from "@/Pages/Tranx/CMP/MdlBillLst";
import MdlRowProductSelect from "@/Pages/Tranx/CMP/MdlRowProductSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faHouse,
  faCirclePlus,
  faPen,
  faFloppyDisk,
  faTrash,
  faXmark,
  faCalculator,
  faGear,
  faRightFromBracket,
  faPrint,
  faArrowUpFromBracket,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    border: "none",
    background: "transparent",
  }),
};

const particularsDD = {
  control: (base, state) => ({
    ...base,
    // marginLeft: -25,
    borderRadius: "none",
    // border: "1px solid transparent",
    marginTop: 0,
    height: 32,
    minHeight: 32,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "12px",
    width: 700,
    // letterSpacing: "-0.02em",
    // textDecorationLine: "underline",
    color: "#000000",
    background: "transparent",

    "&:hover": {
      background: "transparent",
      border: "1px solid #dcdcdc !important",
    },
    "&:focus": {
      width: 680,
    },
    // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
    border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
    color: " #ADADAD",
    // marginRight: "5px",
    // height: "4.5px",
    // width: "9px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "12px",
  }),
};
const modeList = [
  { value: 1, label: "Cash" },
  { value: 2, label: "Credit Card" },
  { value: 3, label: "Bank " },
];

class TranxCreditNoteProductList extends React.Component {
  constructor(props) {
    super(props);
    this.inputLedgerNameRef = React.createRef();
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.paymentRef = React.createRef();
    this.counterRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.inputRef1 = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.selectGSTINRef = React.createRef();
    this.billbybillRef = React.createRef();
    this.salesAccRef = React.createRef();

    this.state = {
      ledgerNameFlag: false, //! for focus
      currentTab: "second", //@prathmesh @batch info & product info tab active
      isTextBox: false,
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      ledgerInputData: "",
      from_source: "tranx_credit_note_edit",
      sourceUnder: "sale",
      ledgerId: "",
      setLedgerId: false,
      errorArrayBorder: "",
      transactionTableStyle: "salesssss",
      add_button_flag: false,
      product_supplier_lst: [],
      isEditDataSet: false,
      show: false,
      showPrint: false,
      opendiv: false,
      hidediv: true,
      isBranch: false,
      salesAccLst: [],
      supplierNameLst: [],
      selectedBillsdebit: [],
      lstFlavours: [],
      flavour_index: 0,
      lstBrand: [],
      lstGst: [],
      lstCategory: [],
      lstSubCategory: [],
      billLst: [],
      adjusmentbillmodal: false,
      supplierCodeLst: [],
      invoiceedit: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      Clietdetailmodal: false,
      clientinfo: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      outstanding_sales_return_amt: 0,
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      is_button_show: false,
      supplierData: "",
      paymetmodel: false,
      batchHideShow: false,
      selectedSaleRate: "",
      modeCheck: [],
      modeStatus: false,
      totalAmount: "",
      returnAmount: "",
      pendingAmount: "",
      selectSerialModal: false,
      serialNoLst: [],
      org_selectedBills: [],
      selectedBills: [],
      productId: "",

      setProductId: false,
      setProductRowIndex: -1,
      gstId: "",
      initVal: {
        sales_sr_no: 1,
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesId: "",
        bill_dt: moment(new Date()).format("DD/MM/YYYY"),
        supplierCodeId: "",
        supplierNameId: "",
        pi_invoice_dt: moment(new Date()).format("DD/MM/YYYY"),
      },
      batchData: "",
      is_expired: false,
      batch_data_selected: "",
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      ledgerType: "SD",
      updatedLedgerType: "SD",
      invoice_data: {
        pi_invoice_dt: moment(new Date()).format("DD/MM/YYYY"),
        sales_sr_no: "",
        selectedSupplier: "",
        bill_no: "",
        salesman: "",
        creditnoteNo: "",
        newReference: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesAccId: "",
        supplierCodeId: "",
        supplierNameId: "",
        gstId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        mode: "",
        modes: "",
        sales_discount: "",
        sales_discount_amt: "",
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        sales_disc_ledger: "",
        total_discount_proportional_amt: 0,
        total_additional_charges_proportional_amt: 0,
        gstId: "",

        total_invoice_dis_amt: 0,
        additionalChgLedger1: "",
        additionalChgLedgerAmt1: "",
        additionalChgLedger2: "",
        additionalChgLedgerAmt2: "",
        additionalChgLedger3: "",
        additionalChgLedgerAmt3: "",

        additionalChgLedgerName1: "",
        additionalChgLedgerName2: "",
        additionalChgLedgerName3: "",

        total_qty: 0,
        total_free_qty: 0,
        bill_amount: 0,
        total_row_gross_amt1: 0,
      },
      unitIds: {},
      rowDelDetailsIds: [],
      cashAcbankLst: "",
      modeList: ["Cash", "Credit Card", "Bank Name"],
      transactionType: "credit_note",
      batchHideShow: true,
      productData: "",
      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerNameModal: false,
      newBatchModal: false,
      paymentModeModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      currentLedgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      selectedLedgerIndExp: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      gstId: "",
      orglstAdditionalLedger: [],
      selectedLedgerNo: 1,
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      transaction_type: "sale",
      invoiceBillModal: false,
      invoiceBillLst: [],
      selectedBillNo: "",
      orginvoiceBillLst: [],
      selectedProductsFromRow: [],
      lstProductRows: [],
      orgLstProductRows: [],
      rowProductModal: false,
      isRowProductSet: false,
      billadjusmentmodalshow: false,
      gstId: "",
      totalDebitAmt: "",
      isAllChecked: false,
      salesEditData: false,
      isRoundOffCheck: true,
      additionalCharges: [],
      additionalDelDetailsIds: [],
      additionalChargesId: "",
      setAdditionalChargesId: false,
      sourceArr: [],
      uncheckRowData: [],
      selectedProductRow: [],
    };
  }

  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

  getPurchaseInvoiceDetails = () => {
    console.log("selectedBillNo", this.state.selectedBillNo);

    let { invoice_id } = this.state.selectedBillNo;

    // ! Call Units
    this.getProductFlavorpackageUnitbyids(invoice_id);
  };
  getSalesInvoiceByIdFun = (invoice_id) => {
    let formData = new FormData();
    formData.append("id", invoice_id);
    getSalesInvoiceById(formData)
      .then((response) => {
        let res = response.data;
        //console.log("res", res);
        if (res.responseStatus == 200) {
          let { invoice_data } = this.state;

          let lstProductRows = res.row;
          console.log("lstProductRows------>", lstProductRows);
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          invoice_data["purchase_discount"] = discountInPer;
          invoice_data["purchase_discount_amt"] = discountInAmt;
          this.setState(
            {
              lstProductRows: lstProductRows,
              orgLstProductRows: lstProductRows,
              rowProductModal: true,
              invoice_data: invoice_data,
            }
            // , () => {
            //   setTimeout(() => {
            //     document.getElementById('productMdlSearch').focus();
            //   }, 500);
            // }
          );
        }
      })
      .catch((error) => {
        console.log("error  ", error);
      });
  };
  setLastSalesSerialNo = () => {
    // ;
    // let reqData = new FormData();
    // reqData.append("sales_type", "sales");
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let { invoice_data } = this.state;
          invoice_data["sales_sr_no"] = res.count;
          invoice_data["bill_no"] = res.serialNo;

          this.setState({ invoice_data: invoice_data });

          // initVal["sales_sr_no"] = res.count;
          // initVal["bill_no"] = res.serialNo;
          // this.setState({ initVal: res,invoice_data: });
          // if (this.myRef.current) {
          //   this.myRef.current.setFieldValue("sales_sr_no", res.count);
          //   this.myRef.current.setFieldValue("bill_no", res.serialNo);
          //   this.myRef.current.setFieldValue(
          //     "transaction_dt",
          //     moment(new Date()).format("DD/MM/YYYY")
          //   );
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TSREProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  // lstSalesAccounts = () => {
  //   getSalesAccounts()
  //     .then((response) => {
  //       // console.log("res", response);
  //       let res = response.data;
  //       if (res.responseStatus === 200) {
  //         let opt = res.list.map((v, i) => {
  //           return {
  //             label: v.name,
  //             value: v.id,
  //           };
  //         });
  //         this.setState({ salesAccLst: opt }, () => {
  //           let v = opt.filter((v) =>
  //             v.label.toLowerCase().includes("sales a/c")
  //           );
  //           console.log("lstSalesAccounts", { v }, v[0]);
  //           const { prop_data } = this.props.block;

  //           if (v != null && v != undefined && prop_data.invoice_data != null) {
  //             let { invoice_data } = this.state;
  //             let init_d = { ...invoice_data };
  //             init_d["salesAccId"] = v[0];
  //             this.setState({ invoice_data: init_d });
  //           }

  //           // this.myRef.current.setFieldValue("salesAccId", v[0]);
  //           else if (
  //             v != null &&
  //             v != undefined &&
  //             !prop_data.hasOwnProperty("invoice_data")
  //           ) {
  //             let { invoice_data } = this.state;
  //             let init_d = { ...invoice_data };
  //             init_d["salesAccId"] = v[0];
  //             this.setState({ invoice_data: init_d });
  //           }
  //           // this.myRef.current.setFieldValue("salesAccId", v[0]);
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };
  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus === 200) {
          let opt = res.list.map((v, i) => {
            return {
              label: v.name,
              value: v.id,
              ...v,
            };
          });
          this.setState({ salesAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("SLAC")
            );
            //console.log("rahul:: lstSalesAccounts", { v }, v[0]);
            const { prop_data } = this.props.block;
            //console.log("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null)
              this.myRef.current.setFieldValue("salesAccId", v[0]);
            else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            ) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["salesAccId"] = v[0];
              this.setState({ invoice_data: init_d });
              //console.log("invoice_data", init_d);
            }
            //this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  qtyVerificationById = (
    productId,
    levelaId,
    levelbId = "",
    levelcId = "",
    unitId,
    batchId,
    qty,
    rowIndex = -1
  ) => {
    /* console.log(
      "verify----",
      productId,
      levelaId,
      levelbId,
      levelcId,
      unitId,
      batchId,
      qty
    ); */
    let { rows } = this.state;
    let requestData = new FormData();
    requestData.append("product_id", productId);
    requestData.append("levelAId", levelaId.value);

    requestData.append("levelBId", levelbId != "" ? levelbId.value : "");
    requestData.append("levelCId", levelcId != "" ? levelcId.value : "");
    requestData.append("unitId", unitId.value);
    requestData.append("batchId", batchId);
    requestData.append("qty", qty);

    quantityVerificationById(requestData).then((response) => {
      //console.log("res : ", response);
      let res = response.data;
      //console.log("res validate", res);
      if (res.responseStatus == 409) {
        rows[rowIndex]["qty"] = "";
        this.setState({ rows: rows }, () => {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        });
      }
    });
  };
  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/
  setSupplierData = (supplierId = "", setFieldValue) => {
    // console.warn("warn :: supplierId", supplierId);
    let requestData = new FormData();
    requestData.append("ledgerId", supplierId && supplierId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        //console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: `${res.message} expired...`,
              msg: "Do you want continue with invoice",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {},
              handleFailFn: () => {
                this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });

    let opt = [];
    opt = supplierId.gstDetails.map((v, i) => {
      return {
        label: v.gstin,
        value: v.id,
      };
    });
    this.setState({ lstGst: opt }, () => {
      if (opt.length > 0) setFieldValue("gstId", opt[0]);
    });
  };
  validatePurchaseRate = (mrp = 0, p_rate = 0) => {
    //console.log("MRP ::", mrp);
    //console.log("Purchase rate ::", p_rate);
    if (parseFloat(mrp) < parseFloat(p_rate)) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "MRP shouldn't less than purchase rate",
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };
  validateMaxDiscount = (maxDiscount, purchaseRate, salesRates, minMargin) => {
    let discountInPer = parseFloat(purchaseRate * 100) / parseFloat(salesRates);
    let discountInAmt =
      (parseFloat(salesRates) * parseFloat(maxDiscount)) / 100;
    let minMarginAmt = (parseFloat(purchaseRate) * parseFloat(minMargin)) / 100;
    let maxDiscountAmt = minMarginAmt + parseFloat(purchaseRate);
    if (discountInAmt > maxDiscountAmt) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: `Can't set discount amount ${parseFloat(discountInAmt).toFixed(
          2
        )} is more than Max disc.amt(margin included)  ${parseFloat(
          maxDiscountAmt
        ).toFixed(2)} `,
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };
  validateSalesRate = (mrp, purchaseRate, salesRates) => {
    if (
      parseFloat(salesRates) < parseFloat(purchaseRate) ||
      parseFloat(salesRates) > parseFloat(mrp)
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };

  // checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
  //   console.warn("rahul :: invoiceDate", invoiceDate);
  //   let requestData = new FormData();
  //   requestData.append(
  //     "invoiceDate",
  //     moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  //   );
  //   checkInvoiceDateIsBetweenFY(requestData)
  //     .then((response) => {
  //       //console.log("res", response);
  //       let res = response.data;
  //       if (res.responseStatus != 200) {
  //         MyNotifications.fire(
  //           {
  //             show: true,
  //             icon: "confirm",
  //             title: "Invoice date not valid as per FY",
  //             msg: "Do you want continue with invoice date",
  //             is_button_show: false,
  //             is_timeout: false,
  //             delay: 0,
  //             handleSuccessFn: () => {
  //               console.warn("rahul:: continue invoice");
  //             },
  //             handleFailFn: () => {
  //               console.warn("rahul:: exit from invoice or reload page");
  //               // this.reloadPage();
  //               this.invoiceDateRef.current.focus();
  //               setFieldValue("transaction_dt", "");
  //               // eventBus.dispatch("page_change", "tranx_sales_invoice_create");
  //             },
  //           },
  //           () => {
  //             console.warn("rahul :: return_data");
  //           }
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };
  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append(
      "invoiceDate",
      moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "warning",
              title: "Warning",
              msg: "Invoice date not valid as per Fiscal year",
              // msg: " ",
              is_button_show: false,
              is_timeout: true,
              delay: 1500,
              // handleSuccessFn: () => {},
              // handleFailFn: () => {
              //   setFieldValue("pi_invoice_dt", "");
              //   eventBus.dispatch("page_change", {
              //     from: "tranx_purchase_invoice_create",
              //     to: "tranx_purchase_invoice_list",
              //     isNewTab: false,
              //   });
              //   // this.reloadPage();
              // },
            },
            () => {}
          );
          setTimeout(() => {
            // document.getElementById("pi_invoice_dt").focus();
            this.invoiceDateRef.current.focus();
          }, 2000);
        }
        // else {
        //   let d = new Date();
        //   d.setMilliseconds(0);
        //   d.setHours(0);
        //   d.setMinutes(0);
        //   d.setSeconds(0);
        //   const enteredDate = moment(invoiceDate, "DD-MM-YYYY");
        //   const currentDate = moment(d);
        //   if (enteredDate.isAfter(currentDate)) {
        //     MyNotifications.fire({
        //       show: true,
        //       icon: "confirm",
        //       title: "confirm",
        //       msg: "Entered date is greater than current date",
        //       // is_button_show: true,
        //       handleSuccessFn: () => {
        //         // if (enteredDate != "") {
        //         //   setTimeout(() => {
        //         //     this.inputRef1.current.focus();
        //         //   }, 500);
        //         // }
        //       },
        //       handleFailFn: () => {
        //         // setFieldValue("pi_invoice_dt", "");
        //         // eventBus.dispatch(
        //         //   "page_change",
        //         //   "tranx_purchase_invoice_create"
        //         // );

        //         setTimeout(() => {
        //           document.getElementById("pi_invoice_dt").focus();
        //         }, 500);
        //         // this.reloadPage();
        //       },
        //     });
        //   } else if (enteredDate.isBefore(currentDate)) {
        //     MyNotifications.fire({
        //       show: true,
        //       icon: "confirm",
        //       title: "confirm",
        //       msg: "Entered date is smaller than current date",
        //       // is_button_show: true,
        //       handleSuccessFn: () => {
        //         // if (enteredDate != "") {
        //         //   setTimeout(() => {
        //         //     this.inputRef1.current.focus();
        //         //   }, 500);
        //         // }
        //       },
        //       handleFailFn: () => {
        //         // setFieldValue("pi_invoice_dt", "");
        //         // eventBus.dispatch("page_change", {
        //         //   from: "tranx_purchase_invoice_create",
        //         //   to: "tranx_purchase_invoice_list",
        //         //   isNewTab: false,
        //         // });

        //         setTimeout(() => {
        //           document.getElementById("pi_invoice_dt").focus();
        //         }, 500);
        //         // this.reloadPage();
        //       },
        //     });
        //   }
        // }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  validate_sales_invoicesFun = (salesInvoiceNo = "", setFieldValue) => {
    // console.warn("rahul :: salesInvoiceNo", salesInvoiceNo);
    let requestData = new FormData();
    requestData.append("salesInvoiceNo", salesInvoiceNo);
    validate_sales_invoices(requestData)
      .then((response) => {
        //console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
          setFieldValue("bill_no", "");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name, ...values };
            });
            let fOpt = Opt.filter(
              (v) => v.name.trim().toLowerCase() != "round off"
            );
            //console.log({ fOpt });
            this.setState({
              lstAdditionalLedger: fOpt,
              orglstAdditionalLedger: fOpt,
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleclientinfo = (status) => {
    let { invoice_data } = this.state;

    if (status == true) {
      let reqData = new FormData();
      let sunC_Id =
        invoice_data.supplierNameId && invoice_data.supplierNameId.value;
      reqData.append("sundry_creditors_id", sunC_Id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => {});
    }
    this.setState({ clientinfo: status });
  };
  handleResetForm = () => {
    this.handleclientinfo(true);
  };

  lstDiscountLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            this.setState({ lstDisLedger: fOpt });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // console.log("res", response);

        let res = response.data;
        if (res.responseStatus === 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    //console.log({ invoice_data });
    if (status === true) {
      let reqData = new FormData();
      let sun_id =
        invoice_data.supplierNameId && invoice_data.supplierNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          //console.log("res", response);
          let res = response.data;
          if (res.responseStatus === 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    this.setState({ Clietdetailmodal: status });
  };

  handleClientForm = () => {
    this.handleClientDetails(true);
  };

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.stateCode;
            }
            return {
              label: v.ledger_name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.ledger_name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {});
  };
  transaction_product_listFun = (search = "", barcode = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    requestData.append("barcode", barcode);
    transaction_product_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            productLst: res.list,
          });
        }
      })
      .catch((error) => {});
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("ledgerDataDetails", res.result);
        if (res.responseStatus == 200) {
          let { ledgerModalStateChange } = this.props;
          ledgerModalStateChange("ledgerData", res.result);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  transaction_product_detailsFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("product_id", product_id);
    transaction_product_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            productData: res.result,
          });
        }
      })
      .catch((error) => {});
  };

  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();
    requestData.append("batchNo", batchNo.batch_no);
    requestData.append("id", batchNo.b_details_id);
    // requestData.append("id", batchNo.id);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
          });
        }
      })
      .catch((error) => {});
  };

  handleBillselectionCredit = (id, index, status) => {
    let { billLst, selectedBillsdebit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        if (!selectedBillsdebit.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (f_selectedBills.includes(v.credit_note_no)) {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
      } else {
        v["credit_paid_amt"] = 0;
        v["credit_remaining_amt"] = parseFloat(v.Total_amt);
      }

      return v;
    });

    this.setState({
      isAllCheckedCredit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillsSelectionAllCredit = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.credit_note_no);
      //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
        // v['debit_paid_amt'] = isNaN(parseFloat(v.Total_amt))
        //   ? parseFloat(v.Total_amt)
        //   : 0;
        // v['debit_remaining_amt'] = isNaN(
        //   parseFloat(v['Total_amt']) - parseFloat(v.Total_amt)
        // )
        //   ? parseFloat(v['Total_amt']) - parseFloat(v.Total_amt)
        //   : 0;

        return v;
      });

      //console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = 0;
        v["credit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;
      });
    }
    this.setState({
      isAllCheckedCredit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  ledgerCreate = () => {
    // eventBus.dispatch("page_change", "ledgercreate");
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_create",
      to: "ledgercreate",

      prop_data: {},
      isNewTab: true,
    });
  };
  productCreate = (e = null) => {
    if (e != null) {
      e.preventDefault();
    }
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_create",
      to: "newproductcreate",
      isNewTab: true,
      prop_data: { tran_no: TRAN_NO.prd_tranx_sales_invoice_create },
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  invoiceNoValidation = (bill_no) => {
    salesValidation().then((response) => {
      let res = response.data;
      if (res.responseStatus == 200) {
        let data = res.responseObject;
        //console.log("data------------>", data);
      }
    });
  };

  reloadPage = () => {
    //console.log("reloading....");
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_create",
      to: "tranx_sales_invoice_list",
      isNewTab: false,
    });
  };

  // handlePropsData = (prop_data) => {
  //   if (prop_data.invoice_data) {
  //     this.setState({
  //       invoice_data: prop_data.invoice_data,
  //       rows: prop_data.rows,
  //       additionalCharges: prop_data.additionalCharges,
  //     });
  //   } else {
  //   }
  // };

  handlePropsData = (prop_data) => {
    if (prop_data.prop_data.invoice_data) {
      console.warn("prop_data.isproduct", prop_data);
      this.setState(
        {
          invoice_data: prop_data.prop_data.invoice_data,
          // rows: prop_data.prop_data.rows,
          rows: prop_data.prop_data.rows,
          productId: prop_data.prop_data.productId,
          additionalChargesId: prop_data.additionalChargesId,
          ledgerId: prop_data.prop_data.ledgerId,
          // setProductRowIndex: prop_data.prop_data.rowIndex,
        },
        () => {
          this.setState(
            {
              ledgerId: prop_data.prop_data.ledgerId,
              setLedgerId: true,
              productId: prop_data.prop_data.productId,
              setProductId: true,
              setProductRowIndex: prop_data.prop_data.rowIndex,
              additionalChargesId: prop_data.additionalChargesId,
              setAdditionalChargesId: true,
              setAdditionalChargesIndex: prop_data.setAdditionalChargesIndex,
            },
            () => {
              // setTimeout(() => {
              //   this.inputRef1.current.focus();
              // }, 1500);
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                if (prop_data.isProduct == "productMdl") {
                  document
                    .getElementById(
                      "TSREProductId-particularsname-" + prop_data.rowIndex
                    )
                    .focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                } else {
                  this.inputRef1.current.focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                }
              }, 1500);
            }
          );
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_create",
      to: "tranx_sales_invoice_list",
    });
  };
  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputLedgerNameRef.current.focus();
        // debugger;
        if (this.state.ledgerNameFlag) {
          if (this.state.lstGst.length > 1 && this.selectGSTINRef.current) {
            this.selectGSTINRef.current.focus();
          } else if (this.salesAccRef.current) {
            this.salesAccRef.current.focus();
          }
        } else {
          document.getElementById("transaction_dt").focus();
        }
      });
    } else {
      this.setState({ [ele]: val });
    }
  };

  ledgerFilterData = () => {
    let {
      orgLedgerList,
      updatedLedgerType,
      currentLedgerData,
      ledgerInputData,
    } = this.state;

    // console.warn(
    //   "{ orgLedgerList, updatedLedgerType, currentLedgerData, ledgerInputData }::",
    //   { updatedLedgerType, currentLedgerData }
    // );
    if (currentLedgerData != "") {
      let filterData = [];
      orgLedgerList != "" &&
        orgLedgerList.map((v) => {
          if (
            v.ledger_name
              .toLowerCase()
              .includes(ledgerInputData.toLowerCase()) ||
            (v.code != null &&
              v.code.toLowerCase().includes(ledgerInputData.toLowerCase()))
          ) {
            filterData.push(v);
          }
        });
      if (updatedLedgerType === "SC") {
        filterData = filterData.filter((v) => v.type == "SC");
      } else if (updatedLedgerType === "SD") {
        filterData = filterData.filter((v) => v.type == "SD");
      }
      // console.warn("filterData::", filterData);
      const index = filterData.findIndex((object) => {
        return object.id === currentLedgerData.id;
      });
      if (index >= 0) {
        setTimeout(() => {
          // console.warn("selectedLEdger index " + index);
          document.getElementById("LedgerMdlTr_" + index).focus();
        }, 200);
      }
    }
  };

  ledgerIndExpModalStateChange = (ele, val) => {
    if (ele == "ledgerModalIndExp" && val == true) {
      this.setState({ ledgerDataIndExp: "", [ele]: val });
    }
    // else if (ele == "ledgerDataIndExp2" && val == true) {
    //   this.setState({ ledgerDataIndExp: "", [ele]: val });
    // } else if (ele == "ledgerDataIndExp3" && val == true) {
    //   this.setState({ ledgerDataIndExp: "", [ele]: val });
    // }
    else {
      this.setState({ [ele]: val });
    }
  };

  handleAddAdditionalCharges = () => {
    let { additionalCharges } = this.state;
    let data = {
      ledgerId: "",
      amt: "",
    };
    additionalCharges = [...additionalCharges, data];
    this.setState({ additionalCharges: additionalCharges });
  };

  initAdditionalCharges = (len = 0) => {
    // additionalCharges
    let lst = [];
    if (len > 0) {
      len = len;
    } else {
      len = 5;
    }
    for (let index = 0; index < len; index++) {
      let data = {
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
  };

  componentDidMount() {
    // console.log("props", this.props);
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;

      this.setLastSalesSerialNo();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      // this.lstSundrydebtors();
      this.lstSalesAccounts();
      this.transaction_product_listFun();
      this.transaction_ledger_listFun();
      this.lstgetcashAcbankaccount();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      this.initRow();
      this.initAdditionalCharges();
      this.handlePropsData(prop_data);
      //console.log("Purchase return Edit Prop Data", prop_data);
      this.setState(
        { source: prop_data, salesEditData: prop_data.prop_data },
        () => {
          // console.log("source", this.state.source);
          if (prop_data.prop_data.id) {
            this.getProductFlavorpackageUnitbyids(prop_data.prop_data.id);
          }
        }
      );
      // this.lstDiscountLedgers();
      // this.lstAdditionalLedgers();
      // const { prop_data } = this.props.block;
      // console.log("userpermission-->", this.props.userPermissions);
      // console.log("prop_data ", { prop_data });
      // this.handlePropsData(prop_data);

      // // if ("invoice_data" in prop_data)
      // //   this.setState({ invoice_data: prop_data.invoice_data });
      // mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      // this.getUserControlLevelFromRedux();

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }
  //@neha @On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
    }
  };
  getProductFlavorpackageUnitbyids = (invoice_id) => {
    //console.log("invoice_id", invoice_id);
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getSalesReturnsProductFpubyId(reqData)
      .then((response) => {
        // console.log("response", response);
        if (response.data.responseStatus == 200) {
          let Opt = response.data.productIds.map((v) => {
            let levela_opt = v.levelAOpt.map((vb) => {
              let levelb_opt = vb.levelBOpts.map((vg) => {
                let levelc_opt = vg.levelCOpts.map((vc) => {
                  let unit_opt = vc.unitOpts.map((z) => {
                    return {
                      label: z.label,
                      value: z.value != "" ? parseInt(z.value) : "",
                      isDisabled: false,
                      ...z,

                      // batchOpt: z.batchOpt,
                    };
                  });
                  return {
                    label: vc.label,
                    value: vc.value != "" ? parseInt(vc.value) : "",
                    isDisabled: false,

                    unitOpt: unit_opt,
                  };
                });
                return {
                  label: vg.label,
                  value: vg.value != "" ? parseInt(vg.value) : "",
                  isDisabled: false,

                  levelCOpt: levelc_opt,
                };
              });
              return {
                label: vb.label,
                value: vb.value != "" ? parseInt(vb.value) : "",
                isDisabled: false,

                levelBOpt: levelb_opt,
              };
            });
            return {
              product_id: v.product_id,
              value: v.value != "" ? parseInt(v.value) : "",
              isDisabled: false,

              // set levels category data
              isLevelA: true,
              isLevelB: true,
              isLevelC: true,

              levelAOpt: levela_opt,
            };
          });

          this.setState({ lstBrand: Opt }, () => {
            if (invoice_id != 0) {
              this.getSalesInvoiceByIdFun(invoice_id);
            }
          });
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => {});
      });
  };

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let {
        supplierNameLst,
        supplierCodeLst,
        salesAccLst,
        lstAdditionalLedger,
        isEditDataSet,
        salesEditData,
        lstDisLedger,
        productLst,
        lstBrand,
        lstPackages,
      } = this.state;
      /*  console.log(
        "did update",

        salesAccLst,

        isEditDataSet,

        lstDisLedger,

        lstBrand
      ); */
      if (
        // supplierNameLst.length > 0 &&
        // supplierCodeLst.length > 0 &&
        salesAccLst.length > 0 &&
        lstBrand.length > 0 &&
        //lstAdditionalLedger.length > 0 &&
        // productLst.length > 0 &&
        isEditDataSet == false &&
        salesEditData != ""
      ) {
        this.setSalesInvoiceEditData();
        // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      }
    }
  }
  setSalesInvoiceEditData = () => {
    // console.log("is sales Edit");
    const { id } = this.state.salesEditData;
    //console.log("Id in setSalesEdidt", this.state.salesEditData.id);
    let formData = new FormData();
    formData.append("id", id);
    getSalesReturnById(formData)
      .then((response) => {
        let res = response.data;
        console.log("Sale Invoice Edit data", res);
        if (res.responseStatus === 200) {
          let { invoice_data, row } = res;
          // debugger;
          this.setState({
            selectedBillNo: res,
          });
          const { salesAccLst, lstAdditionalLedger, lstBrand } = this.state;

          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();

          let opt = [];
          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
            // additionLedger1 = res.additionLedger1
            //   ? getSelectValue(lstAdditionalLedger, res.additionLedger1)
            //   : "";
            additionLedgerAmt1 = res.additionLedgerAmt1;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt1);
          }
          if (res.additionLedger2 > 0) {
            additionLedger2 = res.additionLedger2;
            additionLedgerAmt2 = res.additionLedgerAmt2;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt2);
          }
          if (res.additionLedger3 > 0) {
            additionLedger3 = res.additionLedger3;
            additionLedgerAmt3 = res.additionLedgerAmt3;
          }

          let initInvoiceData = {
            id: invoice_data.id,
            sales_sr_no: invoice_data.sales_sr_no,
            bill_no: invoice_data.invoice_no,
            bill_dt:
              invoice_data.invoice_dt != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
            gstNo: invoice_data.gstNo,
            transaction_dt:
              invoice_data.invoice_dt != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
            salesAccId: getSelectValue(
              salesAccLst,
              invoice_data.sales_account_ledger_id
            ),
            EditsupplierId: invoice_data.debtor_id,
            supplierCodeId: "",
            supplierNameId: "",
            mode:
              invoice_data.paymentMode != null ? invoice_data.paymentMode : "",
            // supplierCodeId: invoice_data.debtor_id ? invoice_data.debtor_id : "",

            // supplierCodeId: invoice_data.debtor_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.debtor_id)
            //   : "",
            // supplierNameId: invoice_data.debtor_id
            //   ? getSelectValue(supplierNameLst, invoice_data.debtor_id)["label"]
            //   : "",

            // supplierNameId: invoice_data.debtor_name
            //   ? invoice_data.debtor_name
            //   : "",

            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",

            sales_discount: discountInPer,
            sales_discount_amt: discountInAmt,
            additionalChgLedger1: additionLedger1,
            additionalChgLedger2: additionLedger2,
            additionalChgLedger3: additionLedger3,
            additionalChgLedgerAmt1: additionLedgerAmt1,
            additionalChgLedgerAmt2: additionLedgerAmt2,
            additionalChgLedgerAmt3: additionLedgerAmt3,

            additionalChgLedgerName1: res.additionLedgerAmt1
              ? getSelectValue(lstAdditionalLedger, res.additionLedger1)[
                  "label"
                ]
              : "",
            additionalChgLedgerName2: res.additionLedgerAmt2
              ? getSelectValue(lstAdditionalLedger, res.additionLedger2)[
                  "label"
                ]
              : "",
            additionalChgLedgerName3: res.additionLedgerAmt3
              ? getSelectValue(lstAdditionalLedger, res.additionLedger3)[
                  "label"
                ]
              : "",
          };

          //console.log("initinvoiceData---->", initInvoiceData);
          //console.log("lstBrand", lstBrand);

          // //console.log("paymentData---->", paymentData);
          // console.log("res", res);

          let billLstData = [];
          let selectedBill = [];
          if (res.billLst.length > 0) {
            // console.log("billLst--", res.billLst);
            billLstData = res.billLst.map((vi, ii) => {
              vi["invoice_id"] = vi.invoice_id != "" ? vi.invoice_id : 0;
              vi["id"] = vi.id != "" ? vi.id : 0;
              vi["amount"] =
                vi.total_amt != 0 && vi.total_amt ? vi.total_amt : 0;
              vi["invoice_date"] =
                vi.invoice_date != "" && vi.invoice_date ? vi.invoice_date : "";
              vi["invoice_no"] =
                vi.invoice_no != "" && vi.invoice_no ? vi.invoice_no : "";
              vi["invoice_unique_id"] =
                vi.invoice_unique_id != "" && vi.invoice_unique_id
                  ? vi.invoice_unique_id
                  : "";
              vi["paid_amt"] = vi.paid_amt != 0 ? vi.paid_amt : 0;
              vi["remaining_amt"] =
                vi.remaining_amt != 0 ? vi.remaining_amt : 0;
              vi["source"] = vi.source != "" ? vi.source : "";
              selectedBill.push(parseInt(vi["invoice_id"]));
              return vi;
            });
          }
          // console.log("billLstData before", billLstData);

          // let remTotalDebitAmt = this.state.totalDebitAmt;
          // billLstData = billLstData.map((v, i) => {
          //   if (remTotalDebitAmt > 0) {
          //     if (selectedBill.includes(v.invoice_id)) {
          //       let pamt = 0;
          //       if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
          //         remTotalDebitAmt = remTotalDebitAmt - v["amount"];
          //         pamt = v["amount"];
          //       } else {
          //         pamt = remTotalDebitAmt;
          //         remTotalDebitAmt = 0;
          //       }
          //       v["paid_amt"] = pamt;
          //       v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);
          //     } else {
          //       v["paid_amt"] = 0;
          //       v["remaining_amt"] = parseFloat(v.amount);
          //     }
          //   } else {
          //     if (selectedBill.includes(v.invoice_id)) {
          //       v["paid_amt"] = parseFloat(v.amount);
          //       v["remaining_amt"] =
          //         parseFloat(v["amount"]) - parseFloat(v.amount);
          //     } else {
          //       v["paid_amt"] = 0;
          //       v["remaining_amt"] = parseFloat(v.amount);
          //     }
          //   }
          //   return v;
          // });

          // console.log("billLstData After", billLstData);

          let initRowData = [];
          let selectedProduct = [];
          if (row.length > 0) {
            //console.log("Rowsssss------->", row);
            console.log("lstBrand", lstBrand);

            initRowData = row.map((v, i) => {
              console.log("v.product_id", v.product_id);

              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              console.log("productOpt", productOpt);

              let unit_id = {
                gst: v.gst != "" ? v.gst : 0,
                igst: v.igst != "" ? v.igst : 0,
                cgst: v.cgst != "" ? v.cgst : 0,
                sgst: v.sgst != "" ? v.sgst : 0,
              };

              v["prod_id"] = productOpt ? productOpt : "";
              v["productName"] = v.product_name ? v.product_name : "";
              v["productId"] = v.product_id ? v.product_id : "";
              v["details_id"] = v.details_id != "" ? v.details_id : 0;

              if (v.level_a_id == "") {
                v.levelaId = getSelectValue(productOpt.levelAOpt, "");
              } else if (v.level_a_id) {
                v.levelaId = getSelectValue(
                  productOpt.levelAOpt,
                  v.level_a_id !== "" ? parseInt(v.level_a_id) : ""
                );
              }

              if (v.level_b_id == "") {
                v.levelbId = getSelectValue(v.levelaId.levelBOpt, "");
              } else if (v.level_b_id) {
                v.levelbId = getSelectValue(
                  v.levelaId.levelBOpt,
                  v.level_b_id !== "" ? parseInt(v.level_b_id) : ""
                );
              }

              if (v.level_c_id == "") {
                v.levelcId = getSelectValue(v.levelbId.levelCOpt, "");
              } else if (v.level_c_id) {
                v.levelcId = getSelectValue(
                  v.levelbId.levelCOpt,
                  v.level_c_id !== "" ? parseInt(v.level_c_id) : ""
                );
              }

              //console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              v["unit_id"] = unit_id;
              v["qty"] = v.qty != "" ? v.qty : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["packing"] = v.pack_name != "" ? v.pack_name : "";
              v["dis_amt"] = v.dis_amt;
              v["dis_per"] = v.dis_per;
              v["dis_per_cal"] = v.dis_per_cal != "" ? v.dis_per_cal : 0;
              v["dis_amt_cal"] = v.dis_amt_cal != "" ? v.dis_amt_cal : 0;
              v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
              v["total_base_amt"] =
                v.total_base_amt != "" ? v.total_base_amt : 0;
              v["gst"] = v.gst != "" ? v.gst : 0;
              v["igst"] = v.igst != "" ? v.igst : 0;
              v["cgst"] = v.cgst != "" ? v.cgst : 0;
              v["sgst"] = v.sgst != "" ? v.sgst : 0;
              v["total_igst"] = v.total_igst != "" ? v.total_igst : 0;
              v["total_cgst"] = v.total_cgst != "" ? v.total_cgst : 0;
              v["total_sgst"] = v.total_sgst > 0 ? v.total_sgst : 0;
              v["final_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
              v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
              v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
              v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
              v["invoice_dis_amt"] =
                v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0;
              v["net_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

              v["final_discount_amt"] =
                v.final_discount_amt != "" ? v.final_discount_amt : 0;
              v["discount_proportional_cal"] =
                v.discount_proportional_cal != ""
                  ? v.discount_proportional_cal
                  : 0;
              v["additional_charges_proportional_cal"] =
                v.additional_charges_proportional_cal != ""
                  ? v.additional_charges_proportional_cal
                  : 0;
              v["b_no"] = v.batch_no != "" ? v.batch_no : "";
              v["b_rate"] = v.b_rate != "" ? v.b_rate : 0;
              v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : 0;
              v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : 0;
              v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : 0;
              v["max_discount"] = v.max_discount != "" ? v.max_discount : 0;
              v["min_discount"] = v.min_discount != "" ? v.min_discount : 0;
              v["min_margin"] = v.min_margin != "" ? v.min_margin : 0;
              v["manufacturing_date"] =
                v.manufacturing_date != "" ? v.manufacturing_date : "";
              v["b_purchase_rate"] =
                v.purchase_rate != "" ? v.purchase_rate : 0;
              v["b_expiry"] = v.b_expiry != "" ? v.b_expiry : "";
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";
              // selectedProduct.push(parseInt(v["product_id"]));

              //console.log("::v >>>>>>", v);
              return v;
            });

            //console.log("initRowData------->", initRowData);
          }
          // console.warn("::opt ", opt);
          //console.log("initRowData-->", initRowData, initInvoiceData);

          if (initInvoiceData.gstNo != "")
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;

          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              // selectedProduct: selectedProduct,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              isLedgerSelectSet: true,
              isRoundOffCheck: res.invoice_data.isRoundOffCheck,
              billLst: billLstData,
              selectedBills: selectedBill,
              org_selectedBills: selectedBill,
              add_button_flag: true,
              // cashAcbankLst: paymentData,
            },
            () => {
              setTimeout(() => {
                // this.setState({ isRowProductSet: true });
                // this.handleTranxCalculation();
                if (res.invoice_data.roundoff == 0) {
                  this.setState({ isRoundOffCheck: false }, () => {
                    this.handleTranxCalculation("roundoff", !false);
                  });
                } else {
                  this.setState({ isRoundOffCheck: true }, () => {
                    this.handleTranxCalculation("roundoff", !true);
                  });
                }
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    //console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });

    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelC: l_C });
    }
  };

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

    // alt key button disabled end
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };
  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
    // console.log({ product, element });
    if (product != "") {
      if (element == "qtyH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "rateH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "qtyM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "rateM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "qtyL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
      if (element == "rateL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
    }
    return "";
  };

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  finalInvoiceAmt = () => {
    let returnValues = this.myRef.current.values;
    // requestData.append('totalamt', returnValues.totalamt);
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i === index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId !== undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId !== undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    //console.log("serial no", rows);
    //console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i === index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };
  valueSerialNo = (index) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.find((v, i) => i == index);
    return fn ? fn.no : "";
  };
  renderSerialNo = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;
    // console.log({ rows, serialnoshowindex });
    if (serialnoshowindex != -1) {
      let rdata = rows.find((v, i) => i == serialnoshowindex);

      return serialnoarray.map((vi, ii) => {
        return (
          <tr>
            <td>{ii + 1}</td>
            <td>
              <Form.Group>
                <Form.ControlconfirmAction
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    // console.log(e.target.value);
                    this.handleSerialNoValue(ii, e.target.value);
                  }}
                  value={this.valueSerialNo(ii)}
                />
              </Form.Group>
            </td>
          </tr>
        );
      });
    }
  };
  confirmAction = () => {
    // eventBus.dispatch("page_change", {
    //   // from: "tranx_sales_invoice_list",
    //   to: "biradar",
    //   isNewTab: false,
    // });

    let confirmAction = window.confirm("Are you sure you want to print");
    //console.log("Confirm Action", confirmAction);
    this.setState({ showPrint: true });
  };
  handleSerialNoSubmit = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;

    if (serialnoshowindex != -1) {
      let rdata = rows.map((v, i) => {
        if (i == serialnoshowindex) {
          let no = serialnoarray.filter((vi, ii) => {
            if (vi.no != "") {
              return vi.no;
            }
          });
          v["serialNo"] = no;
          v["qtyH"] = no.length;
        }
        return v;
      });
      this.setState({
        rows: rdata,
        serialnoshowindex: -1,
        serialnoarray: [],
        serialnopopupwindow: false,
      });
    }
  };
  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;

        if (value == undefined || value == null) {
          v["amt"] = "";
        }
      }
      return v;
    });
    let totalamt = 0;
    fa.map((v) => {
      if (v.amt != "") {
        totalamt += parseFloat(v.amt);
      }
    });
    this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  };

  handleRemoveAddtionalChargesRow = (rowIndex = -1) => {
    let { additionalCharges, additionalDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = additionalCharges.filter((v, i) => i === rowIndex);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!additionalDelDetailsIds.includes(uv.details_id)) {
          additionalDelDetailsIds.push(uv.details_id);
        }
      });
    }

    additionalCharges = additionalCharges.filter((v, i) => i != rowIndex);
    this.handleClearProduct1(additionalCharges);
  };
  handleClearProduct1 = (frows) => {
    this.setState({ additionalCharges: frows }, () => {
      this.handleTranxCalculation();
    });
  };
  // handleClearProduct = (frows) => {
  //   this.setState({ additionalCharges: frows }, () => {
  //     this.handleTranxCalculation();
  //   });
  // };

  handleAdditionalChargesHide = () => {
    this.setState({ ledgerModalIndExp: false }, () => {
      this.handleTranxCalculation();
    });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      productId: "",
      levelaId: "",
      levelbId: "",
      levelcId: "",
      unitCount: "",
      unitId: "",
      unit_conv: 0,
      qty: "",
      free_qty: "",
      rate: "",
      base_amt: 0,
      dis_amt: 0,
      dis_per: 0,
      dis_per2: 0,
      dis_per_cal: 0,
      dis_amt_cal: 0,
      total_base_amt: 0,

      row_dis_amt: 0,
      gross_amt: 0,
      add_chg_amt: 0,
      gross_amt1: 0,
      invoice_dis_amt: 0,
      total_amt: 0,
      net_amt: 0,

      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
      final_discount_amt: 0,
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,

      // batch_details
      b_no: 0,
      b_rate: 0,
      rate_a: 0,
      rate_b: 0,
      rate_c: 0,
      max_discount: 0,
      min_discount: 0,
      min_margin: 0,
      manufacturing_date: 0,
      dummy_date: 0,
      b_purchase_rate: 0,
      b_expiry: 0,
      b_details_id: 0,
      is_batch: false,

      dis_per_cal: 0,
      dis_amt_cal: 0,
      total_amt: 0,
      total_b_amt: 0,

      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
      reference_id: "",
      reference_type: "",
    };
    // console.warn({ new_row });
    rows = [...rows, new_row];
    this.handleMstState(rows);
  };

  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName);
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }

  handleRemoveRow = (rowIndex = -1) => {
    //function for delete the cmpt row
    let { rows, rowDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    // console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!rowDelDetailsIds.includes(uv.details_id)) {
          rowDelDetailsIds.push(uv.details_id);
        }
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    // console.warn("rahul::rows ", rows);
    this.handleClearProduct(rows);
  };

  handleTranxCalculation = (elementFrom = "", isCal = false) => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    // console.log("handleTranxCalculation Row => ", rows);
    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;

    if (this.myRef.current) {
      let {
        sales_discount,
        sales_discount_amt,
        supplierNameId,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;

      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      let UserisFirstDiscountPerCalculate = isUserControl(
        "is_discount_first_calculation",
        this.props.userControl
      );
      let UsertakeDiscountAmountInLumpsum = isUserControl(
        "is_discount_amount_per_unit",
        this.props.userControl
      );
      takeDiscountAmountInLumpsum = UsertakeDiscountAmountInLumpsum;
      isFirstDiscountPerCalculate = UserisFirstDiscountPerCalculate;
    }

    let resTranxFn = fnTranxCalculation({
      rows: rows,
      ledger_disc_per: ledger_disc_per,
      ledger_disc_amt: ledger_disc_amt,
      additionalChargesTotal: additionalChargesTotal,

      additionalChgLedgerAmt1: addChgLedgerAmt1,
      additionalChgLedgerAmt2: addChgLedgerAmt2,
      additionalChgLedgerAmt3: addChgLedgerAmt3,

      takeDiscountAmountInLumpsum,
      isFirstDiscountPerCalculate,
    });
    // console.warn("resTranxFn >>>>>>>>>>>>>>>>", resTranxFn);
    let {
      base_amt,
      total_purchase_discount_amt,
      total_taxable_amt,
      total_tax_amt,
      gst_row,
      total_final_amt,
      gst_total_amt,
      taxIgst,
      taxCgst,
      taxSgst,

      total_invoice_dis_amt,
      total_qty,
      total_free_qty,
      bill_amount,
      total_row_gross_amt,
      total_row_gross_amt1,
    } = resTranxFn;

    // let roundoffamt = Math.round(total_final_amt);
    // let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);

    let roundoffamt = 0;
    let roffamt = 0;
    if (elementFrom.toLowerCase() == "roundoff" && isCal == true) {
      roundoffamt = parseFloat(total_final_amt);
      roffamt = 0;
      bill_amount = parseFloat(bill_amount);
    } else {
      roundoffamt = Math.round(total_final_amt);
      bill_amount = Math.round(parseFloat(bill_amount));
      roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);
    }

    this.myRef.current.setFieldValue(
      "total_base_amt",
      isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      isNaN(parseFloat(total_purchase_discount_amt))
        ? 0
        : parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt1",
      parseFloat(total_row_gross_amt1)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt",
      parseFloat(total_row_gross_amt)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(total_taxable_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(total_tax_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(bill_amount)).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_invoice_dis_amt",
      parseFloat(total_invoice_dis_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_qty",
      parseFloat(total_qty).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_free_qty",
      parseFloat(total_free_qty).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      rows: gst_row,
      taxcal: taxState,
    });
  };

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.state;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };

  handleNumChange = (ele, value, rowIndex) => {
    let { rows } = this.state;

    if (value == "") {
      rows[rowIndex][ele] = 0;
    } else if (!isNaN(value)) {
      rows[rowIndex][ele] = value;
    }
    this.handleRowStateChange(rows);
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows, showBatch } = this.state;
    //console.log("(ele, value, rowIndex) ", ele, value, rowIndex, { rows });

    // if (value == "" && ele == "qty") {
    //   value = 0;
    // }
    rows[rowIndex][ele] = value;

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      rows[rowIndex][ele] = "";
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        is_button_show: true,
      });
    } else if (ele == "rate") {
      if (
        parseFloat(rows[rowIndex]["b_rate"]) != 0 &&
        parseFloat(value) > parseFloat(rows[rowIndex]["b_rate"])
      ) {
        rows[rowIndex][ele] = "";
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Sale rate should be less than MRP",
          is_button_show: true,
        });
      }
    } else if (ele == "qty") {
      if (
        parseFloat(rows[rowIndex]["qty"]) == 0 &&
        !isFreeQtyExist("is_free_qty", this.props.userControl)
      ) {
        rows[rowIndex][ele] = "";
      } else if (
        parseFloat(rows[rowIndex]["is_negative"]) == false &&
        parseFloat(rows[rowIndex]["qty"]) >
          parseFloat(rows[rowIndex]["closing_stock"])
      ) {
        rows[rowIndex][ele] = "";
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Quantity is greater than current stock",
          is_button_show: true,
        });
      }
    }

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      }
    } else {
      this.handleRowStateChange(rows, false, rowIndex);
    }
  };

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        levelaId: "",
        levelbId: "",
        levelcId: "",
        unitCount: "",
        unitId: "",
        unit_conv: 0,
        qty: "",
        free_qty: "",
        rate: "",
        base_amt: 0,
        dis_amt: 0,
        dis_per: 0,
        dis_per2: 0,
        dis_per_cal: 0,
        dis_amt_cal: 0,
        row_dis_amt: 0,
        gross_amt: 0,
        add_chg_amt: 0,
        gross_amt1: 0,
        invoice_dis_amt: 0,
        total_amt: 0,
        net_amt: 0,
        taxable_amt: 0,
        total_base_amt: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        final_discount_amt: 0,
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,

        // batch_details
        b_no: 0,
        b_rate: 0,
        rate_a: 0,
        rate_b: 0,
        rate_c: 0,
        max_discount: 0,
        min_discount: 0,
        min_margin: 0,
        manufacturing_date: 0,
        dummy_date: 0,
        b_purchase_rate: 0,
        b_expiry: 0,
        b_details_id: 0,
        is_batch: false,

        dis_per_cal: 0,
        dis_amt_cal: 0,
        total_amt: 0,
        total_b_amt: 0,

        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: "",
        reference_type: "",
      };
      lst.push(data);
    }

    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows });
    } else {
      this.setState({ rows: lst });
    }
  };

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };
  /**
   * @description Calculate the formula discount + Additional charges
   */

  finalInvoiceAmt = () => {
    let returnValues = this.myRef.current.values;
    // requestData.append('totalamt', returnValues.totalamt);
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  handleBillPayableAmtChange = (value, index) => {
    //console.log({ value, index });
    const { billLst } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);

      // console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };

  handleFetchData = (sundry_debtors_id) => {
    let reqData = new FormData();
    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;
        let data = res.list;
        // console.warn("rahul::data.length >>>>>>>>>>>", data.length);
        if (data.length == 0) {
          this.callCreateInvoice();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjusmentbillmodal: true });
            }
          });
        }
      })
      .catch((error) => {});
  };

  callCreateInvoice = () => {
    //console.log("callCreateInvoice CreateInvoice");

    const {
      invoice_data,
      additionalChargesTotal,
      rows,
      initVal,
      totalAmount,
      pendingAmount,
      returnAmount,
      cashAcbankLst,
      billLst,
      selectedBillNo,
      isRoundOffCheck,
    } = this.state;
    let invoiceValues = this.myRef.current.values;

    console.log("before API Call==-->>>", {
      initVal,
      invoice_data,
      invoiceValues,
      selectedBillNo,
    });

    let requestData = new FormData();
    // !Invoice Data
    requestData.append("id", invoice_data.id);
    requestData.append(
      "bill_dt",
      moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("sales_return_no", invoiceValues.bill_no);
    requestData.append("sales_acc_id", invoiceValues.salesAccId.value);
    requestData.append("sales_return_sr_no", invoiceValues.sales_sr_no);
    requestData.append(
      "gstNo",
      invoiceValues.gstId !== "" ? invoiceValues.gstId.label : ""
    );
    requestData.append(
      "sales_invoice_id",
      selectedBillNo.invoice_id != "" && selectedBillNo
        ? selectedBillNo.invoice_id
        : ""
    );
    requestData.append(
      "source",
      selectedBillNo.invoice_data.source != "" && selectedBillNo
        ? selectedBillNo.invoice_data.source
        : ""
    );

    requestData.append("debtors_id", invoice_data.selectedSupplier.id);
    // !Invoice Data
    requestData.append("isRoundOffCheck", isRoundOffCheck);
    requestData.append("roundoff", invoiceValues.roundoff);
    requestData.append("narration", invoiceValues.narration);
    requestData.append("total_base_amt", invoiceValues.total_base_amt);
    requestData.append("totalamt", invoiceValues.totalamt);
    requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
    let totalcgst = this.state.taxcal.cgst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );
    let totalsgst = this.state.taxcal.sgst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );
    let totaligst = this.state.taxcal.igst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );
    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);
    requestData.append(
      "totalqty",
      invoiceValues.totalqty && invoiceValues.totalqty != ""
        ? invoiceValues.totalqty
        : 0
    );
    requestData.append(
      "tcs",
      invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    );
    requestData.append(
      "sales_discount",
      invoiceValues.sales_discount && invoiceValues.sales_discount != ""
        ? invoiceValues.sales_discount
        : 0
    );

    requestData.append(
      "total_sales_discount_amt",
      invoiceValues.total_purchase_discount_amt &&
        invoiceValues.total_purchase_discount_amt != ""
        ? invoiceValues.total_purchase_discount_amt
        : 0
    );

    requestData.append(
      "sales_discount_amt",
      invoiceValues.sales_discount_amt && invoiceValues.sales_discount_amt != ""
        ? invoiceValues.sales_discount_amt
        : 0
    );

    let frow = [];
    rows.map((v, i) => {
      if (v.productId != "") {
        let newObj = {
          details_id: v.details_id && v.details_id != "" ? v.details_id : 0,
          productId: v.productId ? v.productId : "",
          levelaId: v.levelaId ? v.levelaId.value : "",
          levelbId: v.levelbId ? v.levelbId.value : "",
          levelcId: v.levelcId ? v.levelcId.value : "",
          unitId: v.unitId ? v.unitId.value : "",
          qty: parseFloat(v.qty) != 0 ? parseInt(v.qty) : 0,
          free_qty: v.free_qty != "" ? v.free_qty : 0,
          unit_conv: parseFloat(v.unitId)
            ? parseFloat(v.unitId.unitConversion)
            : "",
          rate: parseFloat(v.rate) != 0 ? parseFloat(v.rate) : 0,
          dis_amt: v.dis_amt != "" ? v.dis_amt : 0,
          dis_per: v.dis_per != "" ? v.dis_per : 0,
          dis_per2: v.dis_per2 != "" ? v.dis_per2 : 0,
          row_dis_amt: v.row_dis_amt != "" ? v.row_dis_amt : 0,
          gross_amt: v.gross_amt != "" ? v.gross_amt : 0,
          add_chg_amt: v.add_chg_amt != "" ? v.add_chg_amt : 0,
          gross_amt1: v.gross_amt1 != "" ? v.gross_amt1 : 0,
          invoice_dis_amt: v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0,
          dis_per_cal: v.dis_per_cal != "" ? v.dis_per_cal : 0,
          dis_amt_cal: v.dis_amt_cal != "" ? v.dis_amt_cal : 0,
          total_amt: v.total_amt != "" ? v.total_amt : 0,
          igst: v.igst != "" ? v.igst : 0,
          sgst: v.sgst != "" ? v.sgst : 0,
          cgst: v.cgst != "" ? v.cgst : 0,
          total_igst: v.total_igst != "" ? v.total_igst : 0,
          total_sgst: v.total_sgst != "" ? v.total_sgst : 0,
          total_cgst: v.total_cgst != "" ? v.total_cgst : 0,
          final_amt: v.final_amt != "" ? v.final_amt : 0,
          is_batch: v.is_batch,
          b_details_id: v.b_details_id != "" ? v.b_details_id : 0,
          b_no: v.b_no != "" ? v.b_no : 0,
          b_rate: v.b_rate != "" ? v.b_rate : 0,
          b_purchase_rate: v.b_purchase_rate != "" ? v.b_purchase_rate : 0,
          b_expiry: v.b_expiry ? moment(v.b_expiry).format("yyyy-MM-DD") : "",
          sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
          rate_a: v.rate_a,
          rate_b: v.rate_b,
          rate_c: v.rate_c,
          min_margin: v.min_margin,
          margin_per: v.margin_per,
          manufacturing_date: v.manufacturing_date
            ? moment(v.manufacturing_date).format("yyyy-MM-DD")
            : "",
          isBatchNo: v.b_no,
          serialNo: v.serialNo
            ? v.serialNo.filter((vi) => vi.serial_no != "")
            : [],
          reference_type: v.reference_type,
          reference_id: v.reference_id != "" ? v.reference_id : 0,
        };
        // console.log("newObj >>>> ", newObj);
        frow.push(newObj);
        // console.log("frow ----------- ", frow);
      }
    });
    //console.log("frow =->", frow);

    var filtered = frow.filter(function (el) {
      return el != null;
    });
    requestData.append("row", JSON.stringify(filtered));
    requestData.append("additionalChargesTotal", additionalChargesTotal);
    requestData.append("sale_type", "sales");
    requestData.append("print_type", "create");
    requestData.append("paymentMode", invoiceValues.mode);
    if (invoiceValues.mode == "adjust") {
      let billRow = [];

      billLst.map((vi, ii) => {
        if ("paid_amt" in vi && vi["paid_amt"] > 0) {
          // return vi;
          billRow.push(vi);
        } else if ("credit_paid_amt" in vi && vi["credit_paid_amt"] > 0) {
          // return vi;
          billRow.push({
            invoice_id: vi.credit_note_id,
            amount: vi.Total_amt,

            invoice_date: moment(vi.credit_note_date).format("YYYY-MM-DD"),
            invoice_no: vi.credit_note_no,
            source: vi.source,
            paid_amt: vi.credit_paid_amt,
            remaining_amt: vi.credit_remaining_amt,
          });
        }
      });
      requestData.append("billLst", JSON.stringify(billRow));
    }

    if (
      invoiceValues.additionalChgLedger1 !== "" &&
      invoiceValues.additionalChgLedgerAmt1 !== ""
    ) {
      requestData.append(
        "additionalChgLedger1",
        invoiceValues.additionalChgLedger1 !== ""
          ? invoiceValues.additionalChgLedger1
          : ""
      );
      requestData.append(
        "addChgLedgerAmt1",
        invoiceValues.additionalChgLedgerAmt1 !== ""
          ? invoiceValues.additionalChgLedgerAmt1
          : 0
      );
    }
    if (
      invoiceValues.additionalChgLedger2 !== "" &&
      invoiceValues.additionalChgLedgerAmt2 !== ""
    ) {
      requestData.append(
        "additionalChgLedger2",
        invoiceValues.additionalChgLedger2 !== ""
          ? invoiceValues.additionalChgLedger2
          : ""
      );
      requestData.append(
        "addChgLedgerAmt2",
        invoiceValues.additionalChgLedgerAmt2 !== ""
          ? invoiceValues.additionalChgLedgerAmt2
          : 0
      );
    }
    if (
      invoiceValues.additionalChgLedger3 !== "" &&
      invoiceValues.additionalChgLedgerAmt3 !== ""
    ) {
      requestData.append(
        "additionalChgLedger3",
        invoiceValues.additionalChgLedger3 !== ""
          ? invoiceValues.additionalChgLedger3
          : ""
      );
      requestData.append(
        "addChgLedgerAmt3",
        invoiceValues.additionalChgLedgerAmt3 !== ""
          ? invoiceValues.additionalChgLedgerAmt3
          : 0
      );
    }

    if (
      authenticationService.currentUserValue.state &&
      invoice_data &&
      invoice_data.supplierNameId &&
      invoice_data.supplierNameId.state !=
        authenticationService.currentUserValue.state
    ) {
      let taxCal = {
        igst: this.state.taxcal.igst,
      };

      requestData.append("taxFlag", false);
      requestData.append("taxCalculation", JSON.stringify(taxCal));
    } else {
      let taxCal = {
        cgst: this.state.taxcal.cgst,
        sgst: this.state.taxcal.sgst,
      };
      // console.log("taxCal", taxCal);
      requestData.append("taxCalculation", JSON.stringify(taxCal));
      requestData.append("taxFlag", true);
    }

    if (invoiceValues.total_qty !== "") {
      requestData.append(
        "total_qty",
        invoiceValues.total_qty !== "" ? parseInt(invoiceValues.total_qty) : 0
      );
    }
    if (invoiceValues.total_free_qty !== "") {
      requestData.append(
        "total_free_qty",
        invoiceValues.total_free_qty !== "" ? invoiceValues.total_free_qty : 0
      );
    }

    // !Total Qty*Rate
    requestData.append(
      "total_row_gross_amt",
      invoiceValues.total_row_gross_amt
    );
    requestData.append("total_base_amt", invoiceValues.total_base_amt);
    // !Discount
    requestData.append(
      "total_invoice_dis_amt",
      invoiceValues.total_invoice_dis_amt
    );
    // !Taxable Amount
    requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
    // !Taxable Amount
    requestData.append("total_tax_amt", invoiceValues.total_tax_amt);
    // !Bill Amount
    requestData.append("bill_amount", invoiceValues.bill_amount);
    console.log("uncheck Row Data::::", this.state.uncheckRowData);
    requestData.append("bills_uncheck_data", this.state.uncheckRowData);

    // console.log(JSON.stringify(requestData));
    for (const pair of requestData.entries()) {
      console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    }

    editSalesReturn(requestData)
      .then((response) => {
        // ;
        //console.log("in create");
        let res = response.data;
        if (res.responseStatus === 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          this.setState({ billadjusmentmodalshow: false });
          // eventBus.dispatch("page_change", "tranx_credit_note_list");
          eventBus.dispatch("page_change", {
            from: "tranx_credit_note_edit",
            to: "tranx_credit_note_list",
            prop_data: {
              editId: this.state.salesEditData.id,
              rowId: this.props.block.prop_data.rowId,
            },
            isNewTab: false,
            isCancel: true,
          });
          // this.getInvoiceBillsLstPrint(invoiceValues.bill_no);
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleImage = () => {
    let { icon } = this.state;
    switch (icon) {
      case "success":
        return <img alt="" src={success_icon} />;
        break;
      case "warning":
        return <img alt="" src={warning_icon} />;
        break;
      case "error":
        return <img alt="" src={error_icon} />;
        break;
      case "confirm":
        return <img alt="" src={confirm_icon} />;
        break;
      default:
        return <img alt="" src={success_icon} />;
        break;
    }
  };

  getInvoiceBillsLstPrint = (id) => {
    //console.log("id Invoice----", id);
    // ;

    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    getSalesReturnBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.product_details,
        });

        eventBus.dispatch("page_change", {
          // from: "tranx_sales_invoice_create",
          to: "tranx_credit_note_list",
          isNewTab: false,
        });
      }
    });
  };
  batchModalShow = (status) => {
    // console.log("status->", status);
    this.setState({ batchModalShow: status });
  };
  handlebatchModalShow = (status) => {
    // const { batchData } = this.state;
    // console.log("batchData.length", batchData.length);
    // if (batchData.length > 0) {
    this.setState({ batchModalShow: status, tr_id: "" });
    // }
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    // console.warn(" rahul rowValue ::", showBatch, rowIndex, rowValue);
    this.setState({ rows: rowValue }, () => {
      this.setState(
        {
          rowIndex: rowIndex,
        },
        () => {
          // console.warn(" rahul getProductBatchList ::");
          this.getProductBatchList(rowIndex);
        }
      );

      this.handleTranxCalculation();
    });
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
  };

  deleteledgerFun = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          this.transaction_ledger_listFun();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  deleteproduct = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_Product_list(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          this.transaction_product_listFun();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    if (findProductPackges) {
      //console.log("findProductPackges ", findProductPackges);
      if (findProductPackges && rowIndex != -1) {
        rows[rowIndex]["prod_id"] = findProductPackges;
        rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

        if (findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1) {
          rows[rowIndex]["levelbId"] =
            findProductPackges["levelAOpt"][0]["levelBOpt"][0];

          if (
            findProductPackges["levelAOpt"][0]["levelBOpt"][0]["levelCOpt"]
              .length >= 0
          ) {
            rows[rowIndex]["levelcId"] =
              findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                "levelCOpt"
              ][0];
          }
          rows[rowIndex]["unitId"] =
            findProductPackges["levelAOpt"][0]["levelBOpt"][0]["levelCOpt"][0][
              "unitOpt"
            ][0];
        }

        rows[rowIndex]["isLevelA"] = true;
      }
      this.setState({ rows: rows });
    } else {
      reqData.append("product_id", product_id);

      getProductFlavourList(reqData)
        .then((response) => {
          let responseData = response.data;
          if (responseData.responseStatus == 200) {
            let levelData = responseData.responseObject;
            let data = responseData.responseObject.lst_packages;

            let levelAOpt = data.map((vb) => {
              let levelb_opt = vb.levelBOpts.map((vg) => {
                let levelc_opt = vg.levelCOpts.map((vc) => {
                  let unit_opt = vc.unitOpts.map((z) => {
                    return {
                      label: z.label,
                      value: z.value != "" ? parseInt(z.value) : "",
                      isDisabled: false,
                      ...z,
                    };
                  });
                  return {
                    label: vc.label,
                    value: vc.value != "" ? parseInt(vc.value) : "",
                    isDisabled: false,

                    unitOpt: unit_opt,
                  };
                });
                return {
                  label: vg.label,
                  value: vg.value != "" ? parseInt(vg.value) : "",
                  isDisabled: false,

                  levelCOpt: levelc_opt,
                };
              });
              return {
                label: vb.label,
                value: vb.value != "" ? parseInt(vb.value) : "",
                isDisabled: false,

                levelBOpt: levelb_opt,
              };
            });

            let fPackageLst = [
              ...lstBrand,
              {
                product_id: product_id,
                value: product_id,
                levelAOpt: levelAOpt,
                // set levels category data
                isLevelA: true,
                isLevelB: true,
                isLevelC: true,
              },
            ];
            //console.log("fPackageLst =-> ", fPackageLst);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              //console.log("findProductPackges =-> ", findProductPackges);
              // if (findProductPackges && rowIndex != -1) {
              //   rows[rowIndex]["prod_id"] = findProductPackges;
              //   rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

              //   if (
              //     findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
              //   ) {
              //     rows[rowIndex]["levelbId"] =
              //       findProductPackges["levelAOpt"][0]["levelBOpt"][0];

              //     if (
              //       findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //         "levelCOpt"
              //       ].length >= 1
              //     ) {
              //       rows[rowIndex]["levelcId"] =
              //         findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //           "levelCOpt"
              //         ][0];
              //     }
              //     {
              //       rows[rowIndex]["unitId"] =
              //         findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //           "levelCOpt"
              //         ][0]["unitOpt"][0];
              //     }
              //   }

              //   rows[rowIndex]["isLevelA"] = true;
              //   // rows[rowIndex]["isGroup"] = levelData.isGroup;
              //   // rows[rowIndex]["isCategory"] = levelData.isCategory;
              //   // rows[rowIndex]["isSubCategory"] = levelData.isSubcategory;
              //   // rows[rowIndex]["isPackage"] = levelData.isPackage;

              //   // setTimeout(() => {
              //   //   var allElements =
              //   //     document.getElementsByClassName("unitClass");
              //   //   for (var i = 0; i < allElements.length; i++) {
              //   //     document.getElementsByClassName("unitClass")[
              //   //       i
              //   //     ].style.border = "1px solid";
              //   //   }
              //   // }, 1);
              // }
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["prod_id"] = findProductPackges;
                if (findProductPackges["levelAOpt"].length >= 1) {
                  rows[rowIndex]["levelaId"] =
                    findProductPackges["levelAOpt"][0];
                  if (
                    findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
                  ) {
                    rows[rowIndex]["levelbId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0];

                    if (
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                        "levelCOpt"
                      ].length >= 0
                    ) {
                      rows[rowIndex]["levelcId"] =
                        findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                          "levelCOpt"
                        ][0];
                    }

                    rows[rowIndex]["unitId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                        "levelCOpt"
                      ][0]["unitOpt"][0];
                  }
                }

                rows[rowIndex]["isLevelA"] = true;
                // rows[rowIndex]["isGroup"] = levelData.isGroup;
                // rows[rowIndex]["isCategory"] = levelData.isCategory;
                // rows[rowIndex]["isSubCategory"] = levelData.isSubcategory;
                // rows[rowIndex]["isPackage"] = levelData.isPackage;

                // setTimeout(() => {
                //   var allElements =
                //     document.getElementsByClassName("unitClass");
                //   for (var i = 0; i < allElements.length; i++) {
                //     document.getElementsByClassName("unitClass")[
                //       i
                //     ].style.border = "1px solid";
                //   }
                // }, 1);
              }
              this.setState({ rows: rows });
            });
          } else {
            this.setState({ lstBrand: [] });
          }
        })
        .catch((error) => {
          this.setState({ lstBrand: [] });
          console.log("error", error);
        });
    }
  };
  getInitBatchValue = (rowIndex = -1, source) => {
    let { rows } = this.state;
    let costingcal = rows[rowIndex]["total_amt"] / rows[rowIndex]["qty"];
    let initVal = "";
    if (rowIndex != -1) {
      initVal = {
        productName: rows[rowIndex]["productName"]
          ? rows[rowIndex]["productName"]
          : "",
        b_no: rows[rowIndex]["b_no"],
        b_rate: rows[rowIndex]["b_rate"],
        sales_rate: rows[rowIndex]["sales_rate"],
        rate_a: rows[rowIndex]["rate_a"],
        rate_b: rows[rowIndex]["rate_b"],
        costing: costingcal,
        rate_c: rows[rowIndex]["rate_c"],
        min_margin: rows[rowIndex]["min_margin"],
        margin_per: rows[rowIndex]["margin_per"],
        // b_purchase_rate: rows[rowIndex]["b_purchase_rate"]!=0?rows[rowIndex]["b_purchase_rate"]:rows[rowIndex]["rate"],
        b_purchase_rate: rows[rowIndex]["rate"],

        b_expiry:
          rows[rowIndex]["b_expiry"] != ""
            ? moment(
                new Date(
                  moment(rows[rowIndex]["b_expiry"], "YYYY-MM-DD").toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        manufacturing_date:
          rows[rowIndex]["manufacturing_date"] != ""
            ? moment(
                new Date(
                  moment(
                    rows[rowIndex]["manufacturing_date"],
                    "YYYY-MM-DD"
                  ).toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        b_details_id: rows[rowIndex]["b_details_id"],
        serialNo: "",
      };
    } else {
      let firstDiscCol = rows[rowIndex]["dis_per"];
      let secondDiscCol = rows[rowIndex]["dis_per2"];

      initVal = {
        productName: rows[rowIndex]["productName"]
          ? rows[rowIndex]["productName"]
          : "",
        b_no: 0,
        b_rate: 0,
        rate_a: 0,
        sales_rate: 0,
        costing: costingcal,
        cost_with_tax: 0,
        margin_per: 0,
        min_margin: 0,
        manufacturing_date: "",
        dummy_date: new Date(),
        b_purchase_rate: rows[rowIndex]["rate"],
        b_expiry: "",
        b_details_id: 0,
        serialNo: "",
      };
    }
    let IsBatch = rows[rowIndex]["is_batch"];
    if (IsBatch == true && source == "batch") {
      this.setState({
        rowIndex: rowIndex,
        batchInitVal: initVal,
        newBatchModal: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    } else if (IsBatch == true && source == "costing") {
      this.setState({
        rowIndex: rowIndex,
        costingInitVal: initVal,
        costingMdl: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    }
  };

  getProductBatchList = (rowIndex = -1, source = "batch") => {
    let { rows, invoice_data, lstBrand } = this.state;
    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let level_b_id = 0;
    let level_c_id = 0;

    if (
      rows[rowIndex]["levelbId"] != "" &&
      rows[rowIndex]["levelbId"]["value"] != ""
    )
      level_b_id = rows[rowIndex]["levelbId"]["value"];
    if (
      rows[rowIndex]["levelcId"] != "" &&
      rows[rowIndex]["levelcId"]["value"] != ""
    )
      level_c_id = rows[rowIndex]["levelcId"]["value"];

    let unit_id = rows[rowIndex]["unitId"]["value"];

    // console.warn({ unit_id });

    let isfound = false;
    let batchOpt = [];
    let productData = getSelectValue(lstBrand, product_id);
    //console.log("productData", productData);
    if (productData) {
      let levelAData = "";
      if (level_a_id > 0) {
        levelAData = getSelectValue(productData.levelAOpt, level_a_id);
      } else {
        levelAData = getSelectValue(productData.levelAOpt, "");
      }
      if (levelAData) {
        let levelBData = "";
        if (level_b_id > 0) {
          levelBData = getSelectValue(levelAData.levelBOpt, level_b_id);
        } else {
          levelBData = getSelectValue(levelAData.levelBOpt, "");
        }

        if (levelBData) {
          let levelCData = "";
          if (level_c_id > 0) {
            levelCData = getSelectValue(levelBData.levelCOpt, level_c_id);
          } else {
            levelCData = getSelectValue(levelBData.levelCOpt, "");
          }
          if (levelCData) {
            let unitdata = "";
            if (unit_id > 0) {
              unitdata = getSelectValue(levelCData.unitOpt, unit_id);
            } else {
              unitdata = getSelectValue(levelCData.unitOpt, "");
            }
            if (unitdata && unitdata.batchOpt) {
              isfound = true;
              batchOpt = unitdata.batchOpt;
            }
          }
        }
      }
    }
    if (isfound == false) {
      let invoice_value = this.myRef.current.values;
      let reqData = new FormData();
      reqData.append("product_id", product_id);
      reqData.append("level_a_id", level_a_id);
      if (
        rows[rowIndex]["levelbId"] != "" &&
        rows[rowIndex]["levelbId"]["value"] != ""
      )
        reqData.append("level_b_id", rows[rowIndex]["levelbId"]["value"]);
      if (
        rows[rowIndex]["levelcId"] != "" &&
        rows[rowIndex]["levelcId"]["value"] != ""
      )
        reqData.append("level_c_id", rows[rowIndex]["levelcId"]["value"]);
      reqData.append("unit_id", unit_id);
      reqData.append(
        "invoice_date",
        moment(invoice_value.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );

      invoice_data["costing"] = "";
      invoice_data["costingWithTax"] = "";
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          if (response.responseStatus == 200) {
            let res = response.data;

            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            this.setState(
              {
                batchData: res,
                invoice_data: invoice_data,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
              }
            );
          }
        })
        .catch((error) => {});
    } else {
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue(rowIndex, source);
        }
      );
    }
    let id = parseInt(this.state.rows.length) - 1;
    if (document.getElementById("TSREAddBtn-" + id) != null) {
      setTimeout(() => {
        document.getElementById("TSREAddBtn-" + id).focus();
      });
    }
  };

  searchLedger = (search = "") => {
    //console.log({ search });
    let { orglstAdditionalLedger, element1, element2 } = this.state;
    let orglstAdditionalLedger_F = [];
    if (search.length > 0) {
      orglstAdditionalLedger_F = orglstAdditionalLedger.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.unique_code.toLowerCase().includes(search.toLowerCase())
      );

      //console.log({ orglstAdditionalLedger });
      this.setState({
        lstAdditionalLedger: orglstAdditionalLedger_F,
      });
    } else {
      this.setState({
        lstAdditionalLedger:
          orglstAdditionalLedger_F.length > 0
            ? orglstAdditionalLedger_F
            : orglstAdditionalLedger,
      });
    }
  };

  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
  };
  addLedgerModalFun = (status = false, element1 = "", element2 = "") => {
    let { orglstAdditionalLedger } = this.state;
    this.setState(
      {
        ledgerData: "",
        showLedgerDiv: status,
        addchgElement1: element1,
        addchgElement2: element2,
      },
      () => {
        if (status === false) {
          this.setState({ lstAdditionalLedger: orglstAdditionalLedger });
        }
      }
    );
    // this.setState({ ledgerNameModal: [status] });
  };
  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };
  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });

    if (obj.isProduct == "productMdl") {
      setTimeout(() => {
        document
          .getElementById("TSREProductId-particularsname-" + obj.rowIndex)
          .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.isBatchMdl == "batchMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TSREProductId-batchNo-" + obj.rowIndex)
        //   .focus();
      }, 250);
    }
  };
  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    //console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    // getSalesInvoiceSupplierListByProductId(requestData)
    get_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        // //console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          let idc = res.data;

          // onlyfive = idc.filter((e) => {
          //   return null;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
            //console.log("lessthan equal to five", onlyfive);
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
            //console.log("greater than five", onlyfive);
          }
          this.setState({
            product_supplier_lst: onlyfive,
          });
        }
      })
      .catch((error) => {
        this.setState({ product_supplier_lst: [] });
      });
  };
  transaction_product_Hover_detailsFun = (product_id = 0) => {
    if (product_id != 0) {
      let obj = this.state.productLst.find((v) => v.id === product_id);
      if (obj) {
        this.setState({ product_hover_details: obj });
        return obj;
      }
    }
    return null;
  };
  handleBatchModalDoubleClick = (values, setFieldValue) => {
    //console.log("values-->", values);

    let {
      rows,
      rowIndex,
      b_details_id,
      is_expired,
      invoice_data,
      isBatch,
      selectedSaleRate,
    } = this.state;
    //console.log("values-->", values);
    //console.log("selectedSaleRate-->", selectedSaleRate);

    // console.warn(
    //   "rahul::batch values, is_expired, rowIndex",
    //   values,
    //   is_expired,
    //   rowIndex
    // );
    // console.warn(
    //   "rahul::b_details_id",
    //   values,
    //   is_expired,
    //   b_details_id,
    //   this.myRef.current.values
    // );
    let batchError = false;
    // if (b_details_id == 0 && batchData.length > 0) {
    //   batchError = true;
    // } else
    {
      if (b_details_id != 0) {
        batchError = false;

        let salesrate = b_details_id.min_rate_a;

        // if (
        //   this.myRef.current.values &&
        //   this.myRef.current.values.supplierNameId &&
        //   parseInt(
        //     this.myRef.current.values.supplierNameId.salesRate
        //   ) == 2
        // ) {
        //   salesrate = b_details_id.min_rate_b;
        // } else if (
        //   this.myRef.current.values &&
        //   this.myRef.current.values.supplierNameId &&
        //   parseInt(
        //     this.myRef.current.values.supplierNameId.salesRate
        //   ) == 3
        // ) {
        //   salesrate = b_details_id.min_rate_c;
        // }
        if (selectedSaleRate.salesRate == 2) {
          salesrate = b_details_id.min_rate_b;
        } else if (selectedSaleRate.salesRate == 3) {
          salesrate = b_details_id.min_rate_c;
        }
        rows[rowIndex]["rate"] = salesrate;
        rows[rowIndex]["sales_rate"] = salesrate;

        rows[rowIndex]["b_details_id"] = b_details_id.id;
        rows[rowIndex]["b_no"] = b_details_id.batch_no;
        rows[rowIndex]["b_rate"] = b_details_id.b_rate;

        rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
        rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
        rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
        rows[rowIndex]["margin_per"] = b_details_id.min_margin;
        rows[rowIndex]["b_purchase_rate"] = b_details_id.purchase_rate;
        rows[rowIndex]["costing"] = invoice_data.costing;
        rows[rowIndex]["cost_with_tax"] = invoice_data.costingWithTax;

        rows[rowIndex]["b_expiry"] =
          b_details_id.expiry_date != "" ? b_details_id.expiry_date : "";

        rows[rowIndex]["manufacturing_date"] =
          b_details_id.manufacturing_date != ""
            ? b_details_id.manufacturing_date
            : "";

        rows[rowIndex]["is_batch"] = isBatch;
      } else {
        let salesrate = values.rate_a;

        if (
          this.myRef.current.values &&
          this.myRef.current.values.supplierCodeId &&
          parseInt(this.myRef.current.values.supplierCodeId.salesRate) == 2
        ) {
          salesrate = values.rate_b;
        } else if (
          this.myRef.current.values &&
          this.myRef.current.values.supplierCodeId &&
          parseInt(this.myRef.current.values.supplierCodeId.salesRate) == 3
        ) {
          salesrate = values.rate_c;
        }

        rows[rowIndex]["rate"] = values.b_purchase_rate;
        rows[rowIndex]["sales_rate"] = salesrate;
        rows[rowIndex]["b_details_id"] = values.b_details_id;
        rows[rowIndex]["b_no"] = values.b_no;
        rows[rowIndex]["b_rate"] = values.b_rate;
        rows[rowIndex]["rate_a"] = values.rate_a;
        rows[rowIndex]["rate_b"] = values.rate_b;
        rows[rowIndex]["rate_c"] = values.rate_c;
        rows[rowIndex]["margin_per"] = values.margin_per;
        rows[rowIndex]["b_purchase_rate"] = values.b_purchase_rate;
        rows[rowIndex]["costing"] = invoice_data.costing;
        rows[rowIndex]["cost_with_tax"] = invoice_data.costingWithTax;

        rows[rowIndex]["b_expiry"] =
          values.b_expiry != ""
            ? moment(
                new Date(moment(values.b_expiry, "DD/MM/YYYY").toDate())
              ).format("YYYY-MM-DD")
            : "";

        rows[rowIndex]["manufacturing_date"] =
          values.manufacturing_date != ""
            ? moment(
                new Date(
                  moment(values.manufacturing_date, "DD/MM/YYYY").toDate()
                )
              ).format("YYYY-MM-DD")
            : "";

        rows[rowIndex]["is_batch"] = isBatch;
      }
      //console.log("batch modal rows ", rows[rowIndex]);
      this.setState(
        {
          batch_error: batchError,
          newBatchModal: false,
          rowIndex: -1,
          b_details_id: 0,
          isBatch: isBatch,
          // rows: rows,
        },
        () => {
          this.handleRowStateChange(rows);
        }
      );
    }
  };

  lstgetcashAcbankaccount = () => {
    getCBADReceipt()
      .then((response) => {
        let res = response.data ? response.data : [];
        let resLst = [];

        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            res.list.map((v) => {
              let innerrow = {
                id: v.id,
                type: v.type,
                value: v.id,
                label: v.name,
                amount: 0,
              };

              resLst.push(innerrow);
            });
          }
          this.setState({ cashAcbankLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handlePaymentModeChange = (id, status, index) => {
    let { modeList, modeCheck, modeStatus, cashAcbankLst } = this.state;
    //console.log("e--->", id, status, modeCheck, modeList, cashAcbankLst);
    let f_modeCheck = modeCheck;
    let f_modeList = cashAcbankLst;
    if (status == true) {
      if (modeCheck.length > 0) {
        if (!modeCheck.includes(id)) {
          f_modeCheck = [...f_modeCheck, id];
        }
      } else {
        f_modeCheck = [...f_modeCheck, id];
      }
    } else {
      f_modeCheck = f_modeCheck.filter((v, i) => v != id);
    }
    //console.log("f_modeCheck", f_modeCheck, f_modeList);
    this.setState({
      modeStatus: status,
      modeCheck: f_modeCheck,
      cashAcbankLst: f_modeList,
    });
  };

  handleAmountValue = (ele, amount, index, netAmt) => {
    //console.log("amount", amount, index);
    let { cashAcbankLst } = this.state;
    if (amount == "") {
      cashAcbankLst[index][ele] = 0;
    } else if (!isNaN(amount)) {
      cashAcbankLst[index][ele] = amount;
    }
    let returningAmt = 0;
    let pendingAmt = 0;

    let totalAmt = cashAcbankLst.reduce(
      (prev, next) => prev + parseFloat(next.amount),
      0
    );
    if (netAmt > totalAmt) {
      pendingAmt = netAmt - totalAmt;
    }
    if (totalAmt > netAmt) {
      returningAmt = totalAmt - netAmt;
    }

    this.setState({
      cashAcbankLst: cashAcbankLst,
      totalAmount: totalAmt,
      returnAmount: returningAmt,
      pendingAmount: pendingAmt,
    });
  };
  openBatchNo = (rowIndex) => {
    let { rows } = this.state;
    this.handleRowStateChange(
      rows,
      rows[rowIndex]["is_batch"], // true,
      rowIndex
    );
  };
  handleCGSTChange = (ele, value, rowIndex) => {
    //console.log("ele", { ele, value, rowIndex });
    let { taxcal, cgstData } = this.state;
    //console.log("amt", value);
    const newData = taxcal;
    //console.log("newData", newData);

    newData.cgst[rowIndex].amt = value;
    // newData.sgst[rowIndex].amt = value1;
    // let igstData = value + value1;
    // newData.igst[rowIndex].amt = igstData;

    //console.log("newData", newData.cgst[rowIndex].amt);
    //console.log("newData---", newData, this.state.taxcal);

    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, cgstData: newData.cgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxAmt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
  };

  handleSGSTChange = (ele, value, rowIndex) => {
    //console.log("ele", { ele, value, rowIndex });
    let { taxcal, sgstData, cgstData } = this.state;
    //console.log("amt", value);
    const newData = taxcal;
    //console.log("newData", newData);

    newData.sgst[rowIndex].amt = value;
    //console.log("newData", newData.sgst[rowIndex].amt);
    //console.log("newData---", newData, this.state.taxcal);
    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, sgstData: newData.sgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    //console.log("totaltaxAmt--totalAmt-", totaltaxAmt, totalAmt);

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    // console.log(
    //   "totaltaxAmt--totalAmt-",
    //   totaltaxAmt,
    //   totalAmt,
    //   billAmt,
    //   roffamt
    // );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxAmt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
  };
  openSerialNo = (rowIndex) => {
    // console.log("rowIndex", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // console.log("serialNoLst", serialNoLst);

    if (serialNoLst.length == 0) {
      serialNoLst = Array(6)
        .fill("")
        .map((v) => {
          return { serial_detail_id: 0, serial_no: v };
        });
    }
    this.setState({
      selectSerialModal: true,
      rowIndex: rowIndex,
      serialNoLst: serialNoLst,
    });
  };
  openInvoiceBillLst = (value) => {
    let reqData = new FormData();
    reqData.append("sundry_debtors_id", value);
    getTranxCreditNoteListInvoiceBillSC(reqData)
      .then((response) => {
        let res = response.data;
        let lst = res.data;
        if (res.responseStatus == 200) {
          this.setState({
            invoiceBillLst: lst,
            orginvoiceBillLst: lst,
            invoiceBillModal: true,
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "warn",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  onSubmitRowProductSelect = (row) => {
    console.log("row?????????????s", row);
    let { lstBrand } = this.state;
    let initRowData = [];
    if (row.length > 0) {
      initRowData = row.map((v, i) => {
        console.log("lstBrand?????????", lstBrand);
        let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
        console.log("v.product_id?????????", v.product_id);

        console.log("productOpt:::::::::", productOpt);
        let unit_id = {
          gst: v.gst != "" ? v.gst : 0,
          igst: v.igst != "" ? v.igst : 0,
          cgst: v.cgst != "" ? v.cgst : 0,
          sgst: v.sgst != "" ? v.sgst : 0,
        };
        v["selectedProduct"] = "";
        v["prod_id"] = productOpt ? productOpt : "";
        v["productName"] = v.product_name ? v.product_name : "";
        v["productId"] = v.product_id ? v.product_id : "";
        v["details_id"] = v.details_id != "" ? v.details_id : 0;
        v["inventoryId"] = v.inventoryId != "" ? v.inventoryId : 0;

        if (v.level_a_id == "") {
          v.levelaId = getSelectValue(productOpt.levelAOpt, "");
        } else if (v.level_a_id) {
          v.levelaId = getSelectValue(
            productOpt.levelAOpt,
            v.level_a_id !== "" ? parseInt(v.level_a_id) : ""
          );
        }

        if (v.level_b_id == "") {
          v.levelbId = getSelectValue(v.levelaId.levelBOpt, "");
        } else if (v.level_b_id) {
          v.levelbId = getSelectValue(
            v.levelaId.levelBOpt,
            v.level_b_id !== "" ? parseInt(v.level_b_id) : ""
          );
        }

        if (v.level_c_id == "") {
          v.levelcId = getSelectValue(v.levelbId.levelCOpt, "");
        } else if (v.level_c_id) {
          v.levelcId = getSelectValue(
            v.levelbId.levelCOpt,
            v.level_c_id !== "" ? parseInt(v.level_c_id) : ""
          );
        }
        v["unitId"] = v.unitId
          ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
          : "";
        v["unit_id"] = unit_id;
        v["qty"] = v.qty != "" ? v.qty : "";
        v["rate"] = v.rate != "" ? v.rate : 0;
        v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
        v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
        v["dis_amt"] = v.dis_amt;
        v["dis_per"] = v.dis_per;
        v["dis_per_cal"] = v.dis_per_cal != "" ? v.dis_per_cal : 0;
        v["dis_amt_cal"] = v.dis_amt_cal != "" ? v.dis_amt_cal : 0;
        v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
        v["total_base_amt"] = v.total_base_amt != "" ? v.total_base_amt : 0;
        v["gst"] = v.gst != "" ? v.gst : 0;
        v["igst"] = v.igst != "" ? v.igst : 0;
        v["cgst"] = v.cgst != "" ? v.cgst : 0;
        v["sgst"] = v.sgst != "" ? v.sgst : 0;
        v["total_igst"] = v.total_igst != "" ? v.total_igst : 0;
        v["total_cgst"] = v.total_cgst != "" ? v.total_cgst : 0;
        v["total_sgst"] = v.total_sgst > 0 ? v.total_sgst : 0;
        v["final_amt"] = v.final_amt != "" ? v.final_amt : 0;
        v["free_qty"] = v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
        v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
        v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
        v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
        v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
        v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
        v["invoice_dis_amt"] = v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0;
        v["net_amt"] = v.final_amt != "" ? v.final_amt : 0;
        v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

        v["final_discount_amt"] =
          v.final_discount_amt != "" ? v.final_discount_amt : 0;
        v["discount_proportional_cal"] =
          v.discount_proportional_cal != "" ? v.discount_proportional_cal : 0;
        v["additional_charges_proportional_cal"] =
          v.additional_charges_proportional_cal != ""
            ? v.additional_charges_proportional_cal
            : 0;
        v["b_no"] = v.batch_no != "" ? v.batch_no : "";
        v["b_rate"] = v.b_rate != "" ? v.b_rate : 0;
        v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : 0;
        v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : 0;
        v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : 0;
        v["max_discount"] = v.max_discount != "" ? v.max_discount : 0;
        v["min_discount"] = v.min_discount != "" ? v.min_discount : 0;
        v["min_margin"] = v.min_margin != "" ? v.min_margin : 0;
        v["manufacturing_date"] =
          v.manufacturing_date != "" ? v.manufacturing_date : "";
        v["b_purchase_rate"] = v.purchase_rate != "" ? v.purchase_rate : 0;
        v["b_expiry"] = v.b_expiry != "" ? v.b_expiry : "";
        v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
        v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

        return v;
      });
    }

    this.setState(
      {
        rows: initRowData,
        // isEditDataSet: true,
        // additionalChargesTotal: totalAdditionalCharges,
        // lstGst: opt,
        isLedgerSelectSet: true,
        isRowProductSet: true,
        add_button_flag: true,
      },
      () => {
        setTimeout(() => {
          this.handleTranxCalculation();
        }, 25);
      }
    );
  };
  finalBillInvoiceAmt = () => {
    const { billLst } = this.state;
    //console.log({ billLst });

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });
    return paidAmount;
  };
  handleBillsSelectionAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_no);
      //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        if (v.source === "pur_invoice") {
          // v['paid_amt'] = isNaN(parseFloat(v.amount))
          //   ? parseFloat(v.amount)
          //   : 0;
          // v['remaining_amt'] = isNaN(
          //   parseFloat(v['amount']) - parseFloat(v.amount)
          // )
          //   ? parseFloat(v['amount']) - parseFloat(v.amount)
          //   : 0;

          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);

          return v;
        }

        return v;
      });

      //console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (v.source == "pur_invoice") {
          v["paid_amt"] = 0;
          // v['remaining_amt'] = isNaN(parseFloat(v['amount']))
          //   ? parseFloat(v['amount'])
          //   : 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }
        //  else if (v.source == 'debite_note') {
        //   v['debite_paid_amt'] = isNaN(parseFloat(0)) ? parseFloat(0) : 0;
        //   v['debite_remaining_amt'] = isNaN(
        //     parseFloat(v['Total_amt']) - parseFloat(0)
        //   )
        //     ? parseFloat(v['Total_amt']) - parseFloat(0)
        //     : 0;
        // }

        return v;
      });
    }
    this.setState({
      isAllChecked: status,
      selectedBills: lstSelected,
      billLst: fBills,
    });
  };

  handleBillselection = (id, index, status) => {
    let { billLst, selectedBills, totalDebitAmt, uncheckRowData } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBills;

    let f_billLst = billLst;
    if (status == true) {
      if (selectedBills.length > 0) {
        if (!selectedBills.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
      f_billLst.map((v, i) => {
        // console.log("uncheck id", v);
        if (v.invoice_unique_id == id) {
          if (v.source == "sales_invoice") {
            uncheckRowData = uncheckRowData
              ? uncheckRowData.filter((v) => v != id)
              : [];
          }
        }
      });
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
      f_billLst.map((v, i) => {
        console.log("uncheck id", v);
        if (v.invoice_unique_id == id) {
          if (v.source == "sales_invoice") {
            uncheckRowData = [...uncheckRowData, id];
          }
        }
      });
    }
    let remTotalDebitAmt = parseFloat(this.myRef.current.values.bill_amount);

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        if (f_selectedBills.includes(v.invoice_unique_id)) {
          let pamt = 0;
          if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
            remTotalDebitAmt = remTotalDebitAmt - v["amount"];
            pamt = v["amount"];
          } else {
            pamt = remTotalDebitAmt;
            remTotalDebitAmt = 0;
          }
          v["paid_amt"] = pamt;
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);
          // if (v["remaining_amt"] > 0) {
          //   MyNotifications.fire(
          //     {
          //       show: true,
          //       icon: "confirm",
          //       title: "Confirm",
          //       msg: "selected bill amt is greater than bill amt, do you want to continue",
          //       is_button_show: false,
          //       is_timeout: false,
          //       delay: 0,
          //       handleSuccessFn: () => {
          //         let payAmt = parseFloat(this.myRef.current.values.bill_amount);
          //         let remAmt = parseFloat(v["remaining_amt"]);
          //         remTotalDebitAmt = payAmt + remAmt;
          //         this.setState({ totalDebitAmt: remTotalDebitAmt });
          //         // console.log("remTotalDebitAmt:", remTotalDebitAmt);

          //         v["paid_amt"] = v["amount"];
          //         v["remaining_amt"] = 0;
          //         // let selectbill = parseFloat(v["amount"]);
          //         // let remaingbill = 0;
          //         // this.setState({
          //         //   selectedAmt: selectbill,
          //         //   remainingAmt: remaingbill,
          //         // });
          //       },
          //       handleFailFn: () => { },
          //     },
          //     () => {
          //       // console.warn("return_data");
          //     }
          //   );
          // }
        } else {
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v.amount);
        }
      } else {
        if (f_selectedBills.includes(v.invoice_unique_id)) {
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
        } else {
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v.amount);
        }
      }

      return v;
    });

    this.setState({
      isAllChecked: f_billLst.length == f_selectedBills.length ? true : false,
      selectedBills: f_selectedBills,
      uncheckRowData: uncheckRowData,
      billLst: f_billLst,
    });
  };
  // FetchPendingBills = (id, type, balancing_method) => {
  //   let { billLst } = this.state;
  //   console.log("billLst fetch", billLst, billLst.length);

  //   // if (billLst.length > 0) {
  //   //   this.setState({ billadjusmentmodalshow: true });
  //   // } else {
  //   //console.log("balancing_method", balancing_method, id, type);
  //   let reqData = new FormData();
  //   reqData.append("ledger_id", id);
  //   reqData.append("type", type);
  //   reqData.append("balancing_method", balancing_method);
  //   get_credit_pending_bills(reqData)
  //     .then((response) => {
  //       let res = response.data;
  //       //console.log("Res Bill List ", res);
  //       if (res.responseStatus == 200) {
  //         let data = res.list;
  //         console.log("data", data);
  //         if (data.length > 0) {
  //           if (balancing_method === "bill-by-bill" && type === "SC") {
  //             console.log("billLst::???????::::::::", { billLst });

  //             this.setState({ billLst: data, billadjusmentmodalshow: true });
  //           } else if (balancing_method === "bill-by-bill" && type === "SD") {
  //             console.log("billLst::::::::::", { billLst });
  //             this.setState({
  //               billLst: data,
  //               billadjusmentmodalshow: true,
  //             });
  //           } else {
  //             if (balancing_method === "on-account")
  //               this.setState({
  //                 billLst: data,
  //                 onaccountmodal: true,
  //               });
  //           }
  //         } else {
  //           MyNotifications.fire({
  //             show: true,
  //             icon: "error",
  //             title: "Error",
  //             msg: "No Adjust bills found",
  //             is_button_show: true,
  //           });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //       this.setState({ billLst: [] });
  //     });
  //   // }
  // };
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  handleRoundOffCheck = (value) => {
    this.setState({ isRoundOffCheck: value }, () => {
      this.handleTranxCalculation("roundoff", !value);
    });
    // let { taxcal } = this.state;

    // if (value == true) {
    //   let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
    //   let totalAmt = this.myRef.current.values.total_taxable_amt;

    //   let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

    //   let roundoffamt = Math.round(billAmt);
    //   let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    //   this.myRef.current.setFieldValue(
    //     "total_tax_amt",
    //     parseFloat(totaltaxAmt)
    //   );
    //   this.myRef.current.setFieldValue(
    //     "roundoff",
    //     Math.abs(parseFloat(roffamt).toFixed(2))
    //   );
    //   this.myRef.current.setFieldValue("bill_amount", roundoffamt);
    // } else {
    //   let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
    //   let totalAmt = this.myRef.current.values.total_taxable_amt;

    //   let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

    //   let roundoffamt = 0;

    //   this.myRef.current.setFieldValue(
    //     "total_tax_amt",
    //     parseFloat(totaltaxAmt).toFixed(2)
    //   );
    //   this.myRef.current.setFieldValue(
    //     "roundoff",
    //     Math.abs(parseFloat(roundoffamt).toFixed(2))
    //   );
    //   this.myRef.current.setFieldValue("bill_amount", billAmt);
    // }
  };

  setledgerInputData(propValue, flag) {
    this.setState(
      { ledgerInputData: propValue, isTextBox: flag, ledgerModal: true },
      () => {
        this.myRef.current.setFieldValue("supplierNameId", propValue);
      }
    );
  }

  // @harish @ focusToNextElement onKeyDown == 13
  focusNextElement(e, nextIndex = null) {
    var form = e.target.form;
    var cur_index =
      nextIndex != null
        ? nextIndex
        : Array.prototype.indexOf.call(form, e.target);
    let ind = cur_index + 1;
    for (let index = ind; index <= form.elements.length; index++) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].id != ""
        ) {
          form.elements[index].focus();
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

  FetchPendingBills = (id, type, balancing_method) => {
    // debugger;
    console.log("balancing_method", balancing_method, id, type);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    getdebtorspendingbills(reqData)
      .then((response) => {
        // debugger;
        let res = response.data;
        //console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          //console.log("data", data);
          if (data.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SC") {
              //console.log('OPT', opt);
              this.setState({ billLst: data, billadjusmentmodalshow: true }, () => {
                setTimeout(() => {
                  document.getElementById("invoice_no_id-0").focus();
                }, 100);
              });
            } else if (balancing_method === "bill-by-bill" && type === "SD") {
              let { billLst } = this.state;
              console.log("billLst:::::::::", { billLst });
              console.log("billLst::data:::::::", data);
              let f_selectedBills = [];
              let data_ids = billLst.map((vi) => vi.invoice_unique_id);
              let newBills = billLst.map((vi, i) => {
                vi["invoice_id"] = vi.invoice_id;
                vi["invoice_date"] = vi.invoice_date;
                vi["total_amt"] = vi.total_amt;
                vi["paid_amt"] = parseFloat(
                  this.myRef.current.values.bill_amount
                );
                vi["remaining_amt"] =
                  vi.total_amt -
                  parseFloat(this.myRef.current.values.bill_amount);
                vi["invoice_no"] = vi.invoice_no;
              });
              f_selectedBills = data_ids;
              data.map((dv, di) => {
                if (
                  "invoice_unique_id" in dv &&
                  !data_ids.includes(dv.invoice_unique_id)
                ) {
                  newBills.push(dv);
                }
              });

              this.setState({
                billLst: billLst,
                selectedBills: f_selectedBills,
                billadjusmentmodalshow: true,
              }, () => {
                setTimeout(() => {
                  document.getElementById("invoice_no_id-0").focus();
                }, 100);
              });
            } else {
              if (balancing_method === "on-account")
                this.setState({
                  billLst: data,
                  onaccountmodal: true,
                });
            }
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: "No Adjust bills found",
              // is_button_show: true,
              is_timeout: true,
              delay: 1500,
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ billLst: [] });
      });
  };

  render() {
    const {
      currentTab, //@prathmesh @batch info & product info tab
      sourceUnder,
      isTextBox,
      ledgerInputData,
      errorArrayBorder,
      add_button_flag,
      product_supplier_lst,
      isBranch,
      adjusmentbillmodal,
      selectedBillsdebit,
      billLst,
      isAllCheckedCredit,
      outstanding_sales_return_amt,
      invoice_data,
      invoiceedit,
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      productLst,
      serialnopopupwindow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      Clietdetailmodal,
      clientinfo,
      taxcal,
      showPrint,
      is_button_show,
      paymetmodel,
      batchModalShow,
      is_expired,
      b_details_id,
      batchInitVal,
      isBatch,
      batchData,
      tr_id,
      lstBrand,
      lstGst,
      unitIds,
      rowDelDetailsIds,

      ledgerModal,
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      ledgerNameModal,
      newBatchModal,
      paymentModeModal,
      selectProductModal,
      ledgerList,
      ledgerData,
      ledgerDataIndExp,
      selectedLedger,
      selectedLedgerIndExp,
      selectedProduct,
      productData,
      rowIndex,
      levelOpt,
      batchDetails,
      showLedgerDiv,
      addchgElement1,
      addchgElement2,
      orglstAdditionalLedger,
      selectedLedgerNo,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      selectedSaleRate,
      cashAcbankLst,
      modeCheck,
      modeStatus,
      totalAmount,
      returnAmount,
      pendingAmount,
      batch_data_selected,
      gstId,
      transactionType,
      selectSerialModal,
      serialNoLst,
      batchHideShow,
      invoiceBillModal,
      invoiceBillLst,
      orginvoiceBillLst,
      selectedProductsFromRow,
      selectedBillNo,
      lstProductRows,
      orgLstProductRows,
      rowProductModal,
      isRowProductSet,
      billadjusmentmodalshow,
      selectedBills,
      isAllChecked,
      salesEditData,
      isEditDataSet,
      isLedgerSelectSet,
      org_selectedBills,
      isRoundOffCheck,
      transactionTableStyle,
      opType, // @vinit@Passing as prop in CmpTRow  and MDLLedger for Focusing previous Tab
      from_source,
      ledgerId,
      setLedgerId,
      currentLedgerData,
      updatedLedgerType,
      ledgerType,
      setAdditionalChargesId,
      additionalChargesId,
      setProductId,
      setProductRowIndex,
      productId,
    } = this.state;

    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active

    return (
      <div>
        <div className="purchase-tranx" style={{ overflow: "hidden" }}>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={invoice_data}
            innerRef={this.myRef}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              // salesAccId: Yup.object().nullable().required("Required"),
              // supplierCodeId: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("select client code"),
              // supplierNameId: Yup.string()
              //   .nullable()
              //   .required("Client Name is Required"),
              // transaction_dt: Yup.string().required("Invoice Date is Required"),
              // bill_no: Yup.string().trim().required("Invoice No. is Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("values1111-->", values);

              let errorArray = [];
              if (values.transaction_dt == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.supplierNameId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.bill_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  console.log("values1111in if-->", values);
                  if (values.mode == "adjust") {
                    let { selectedSupplier } = values;

                    this.FetchPendingBills(
                      selectedSupplier.id,
                      selectedSupplier.type,
                      selectedSupplier.balancingMethod
                    );
                  } else {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Update",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          this.setState(
                            {
                              invoice_data: values,
                              opendiv: false,
                            },
                            () => {
                              let { selectedSupplier } = values;
                              if (selectedSupplier) {
                                this.callCreateInvoice();
                                // this.handleFetchData(selectedSupplier.id);
                              }
                            }
                          );
                        },
                        handleFailFn: () => {},
                      },
                      () => {
                        console.warn("return_data");
                      }
                    );
                  }
                }
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
              setTouched,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  {/* {JSON.stringify(values)}
                  {JSON.stringify(errors)} */}
                  <div className="div-style div-styleNew">
                    <div>
                      <Row className="mx-0 inner-div-style">
                        <Row>
                          {isBranch == true && (
                            <Col lg={2} md={2} sm={2} xs={2}>
                              <Row>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={4}
                                  xs={4}
                                  className="my-auto"
                                >
                                  <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8}>
                                  <Select
                                    className="selectTo"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    options={salesAccLst}
                                    isDisabled
                                    name="purchaseId"
                                    onChange={(v) => {
                                      setFieldValue("branchId", v);
                                    }}
                                    value={values.branchId}
                                  />

                                  <span className="text-danger errormsg">
                                    {errors.branchId}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          )}

                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="pe-0 my-auto"
                              >
                                <Form.Label>
                                  Tranx Date{" "}
                                  {/* <label style={{ color: "red" }}>*</label>{" "} */}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  readOnly={true}
                                  className={`${
                                    values.transaction_dt == "" &&
                                    errorArrayBorder[0] == "Y"
                                      ? "border border-danger tnx-pur-inv-date-style"
                                      : "tnx-pur-inv-date-style"
                                  }`}
                                  // className="tnx-pur-inv-date-style "
                                  autoFocus="true"
                                  name="transaction_dt"
                                  id="transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  value={values.transaction_dt}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    //console.log("e ", e.target.value);
                                    /*    console.log(
                                      "e.target.value ",
                                      e.target.value
                                    ); */
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      this.setErrorBorder(0, "");

                                      if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        setFieldValue(
                                          "transaction_dt",
                                          e.target.value
                                        );
                                        this.checkInvoiceDateIsBetweenFYFun(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid invoice date",
                                          is_button_show: true,
                                        });
                                        this.invoiceDateRef.current.focus();
                                        setFieldValue("transaction_dt", "");
                                      }
                                    } else {
                                      this.setErrorBorder(0, "Y");

                                      setFieldValue("transaction_dt", "");
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="px-0 my-auto"
                              >
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <div className="d-flex w-100">
                                  <Form.Control
                                    ref={this.inputLedgerNameRef}
                                    type="text"
                                    className={`${
                                      values.supplierNameId == "" &&
                                      errorArrayBorder[1] == "Y"
                                        ? "border border-danger tnx-pur-inv-text-box"
                                        : "tnx-pur-inv-text-box"
                                    }`}
                                    // className="tnx-pur-inv-text-box"
                                    placeholder="Client Name"
                                    name="supplierNameId"
                                    id="supplierNameId"
                                    autoFocus="true"
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      e.preventDefault();

                                      this.setledgerInputData(
                                        e.target.value,
                                        true
                                      );
                                    }}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (e.target.value.trim()) {
                                        this.setErrorBorder(0, "");
                                      } else {
                                        if (
                                          values.selectedSupplier != "" &&
                                          values.selectedSupplier != null
                                        ) {
                                          setFieldValue(
                                            "supplierNameId",
                                            values.selectedSupplier.ledger_name
                                          );
                                        }
                                        this.setErrorBorder(0, "Y");
                                        // document
                                        //   .getElementById("supplierNameId")
                                        //   .focus();
                                      }
                                    }}
                                    // onInput={(e) => {
                                    //   e.target.value = this.getDataCapitalised(
                                    //     e.target.value
                                    //   );
                                    //   console.log(
                                    //     "ledgerInputData---",
                                    //     e.target.value
                                    //   );
                                    //   this.setState({
                                    //     ledgerInputData:
                                    //       e.target.value.toLowerCase(),
                                    //   });
                                    // }}
                                    // onFocus={(e) => {
                                    //   e.preventDefault();
                                    //   if (values.supplierNameId == "") {
                                    //     this.ledgerModalStateChange(
                                    //       "ledgerModal",
                                    //       true
                                    //     );
                                    //   }
                                    // }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.ledgerModalStateChange(
                                          "ledgerModal",
                                          true
                                        );
                                        this.setState(
                                          {
                                            currentLedgerData:
                                              values.selectedSupplier,
                                            ledgerNameFlag: true,
                                          },
                                          () => {
                                            // console.log(
                                            //   "values.supplierNameId::",
                                            //   values.supplierNameId
                                            // );
                                            this.ledgerFilterData();
                                          }
                                        );
                                      } else if (
                                        e.shiftKey &&
                                        e.key === "Tab"
                                      ) {
                                      } else if (
                                        e.key === "Tab" &&
                                        !e.target.value.trim()
                                      ) {
                                        this.setErrorBorder(1, "Y");
                                      } else if (
                                        e.key === "Tab" &&
                                        e.target.value.trim()
                                      ) {
                                        this.setErrorBorder(1, "");
                                      } else if (e.keyCode == 40) {
                                        this.setState({ ledgerNameFlag: true });
                                        if (ledgerModal == true)
                                          document
                                            .getElementById("LedgerMdlTr_0")
                                            .focus();
                                      }
                                      // e.preventDefault();
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();

                                      if (values.selectedSupplier != "") {
                                        this.setState(
                                          {
                                            currentLedgerData:
                                              values.selectedSupplier,
                                            ledgerNameFlag: true,
                                          },
                                          () => {
                                            this.ledgerFilterData();
                                          }
                                        );
                                        this.ledgerModalStateChange(
                                          "selectedLedger",
                                          values.selectedSupplier
                                        );

                                        this.ledgerModalStateChange(
                                          "ledgerModal",
                                          true
                                        );
                                      } else {
                                        this.setState({
                                          currentLedgerData: "",
                                          ledgerNameFlag: true,
                                        });
                                        this.ledgerModalStateChange(
                                          "ledgerModal",
                                          true
                                        );
                                      }
                                      this.setState({ currentTab: "first" }); //@prathmesh @batch info & product info tab active
                                    }}
                                    onFocus={(e) => {
                                      e.preventDefault();
                                      this.setState({ currentTab: "first" });
                                    }}
                                    disabled={
                                      values.transaction_dt != "" ? false : true
                                    }
                                    value={values.supplierNameId}
                                  />
                                </div>

                                {/* <span className="text-danger errormsg">
                                  {touched.supplierNameId &&
                                    errors.supplierNameId}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={3}
                                md={3}
                                sm={3}
                                xs={3}
                                className="my-auto p-0"
                              >
                                <Form.Label>Client GST</Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.selectGSTINRef}
                                    className="selectTo"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    options={lstGst}
                                    id="gstId"
                                    name="gstId"
                                    onChange={(v) => {
                                      setFieldValue("gstId", v);
                                      this.setState({ gstId: v });
                                    }}
                                    value={values.gstId}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {touched.gstId && errors.gstId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>Sales A/C</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8} className="pe-0">
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.salesAccRef}
                                    className="selectTo"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    options={salesAccLst}
                                    name="salesAccId"
                                    onChange={(v) => {
                                      setFieldValue("salesAccId", v);
                                    }}
                                    value={values.salesAccId}
                                  />
                                </Form.Group>

                                <span className="text-danger errormsg">
                                  {errors.salesAccId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>
                                  Return No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                {" "}
                                <Form.Control
                                  type="text"
                                  placeholder="Invoice No."
                                  name="bill_no"
                                  id="bill_no"
                                  className={`${
                                    values.bill_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  /*  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
                                  // className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    //console.log("e ", e);
                                    /*  console.log(
                                      "e.target.value ",
                                      e.target.value
                                    ); */
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      this.setErrorBorder(2, "");

                                      this.validate_sales_invoicesFun(
                                        e.target.value,
                                        setFieldValue
                                      );
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      document
                                        .getElementById("bill_no")
                                        .focus();
                                    }
                                  }}
                                  value={values.bill_no}
                                  isValid={touched.bill_no && !errors.bill_no}
                                  isInvalid={!!errors.bill_no}
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" && !e.target.value) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.bill_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="px-0 my-auto"
                              >
                                <Form.Label>Return Date</Form.Label>
                                <label style={{ color: "red" }}>*</label>{" "}
                              </Col>

                              <Col lg={3} md={3} sm={3} xs={3}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style"
                                  name="pi_invoice_dt"
                                  id="pi_invoice_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.pi_invoice_dt}
                                  onChange={handleChange}
                                  // onBlur={(e) => {
                                  //   console.log("e ", e);
                                  //   console.log(
                                  //     "e.target.value ",
                                  //     e.target.value
                                  //   );
                                  //   if (
                                  //     e.target.value != null &&
                                  //     e.target.value !== ""
                                  //   ) {
                                  //     let d = new Date();
                                  //     d.setMilliseconds(0);
                                  //     d.setHours(0);
                                  //     d.setMinutes(0);
                                  //     d.setSeconds(0);
                                  //     const enteredDate = moment(
                                  //       e.target.value,
                                  //       "DD-MM-YYYY"
                                  //     );
                                  //     const currentDate = moment(d);

                                  //     if (enteredDate.isAfter(currentDate)) {
                                  //       MyNotifications.fire({
                                  //         show: true,
                                  //         icon: "confirm",
                                  //         title: "confirm",
                                  //         msg:
                                  //           "Entered date is greater than current date",
                                  //         // is_button_show: true,
                                  //         handleSuccessFn: () => {},
                                  //         handleFailFn: () => {
                                  //           setFieldValue("bill_dt", "");
                                  //           eventBus.dispatch(
                                  //             "page_change",
                                  //             "tranx_credit_note_product_list"
                                  //           );
                                  //           // this.reloadPage();
                                  //         },
                                  //       });
                                  //     } else if (
                                  //       enteredDate.isBefore(currentDate)
                                  //     ) {
                                  //       MyNotifications.fire({
                                  //         show: true,
                                  //         icon: "confirm",
                                  //         title: "confirm",
                                  //         msg:
                                  //           "Entered date is smaller than current date",
                                  //         // is_button_show: true,
                                  //         handleSuccessFn: () => {},
                                  //         handleFailFn: () => {
                                  //           setFieldValue("bill_dt", "");
                                  //           eventBus.dispatch(
                                  //             "page_change",
                                  //             "tranx_credit_note_product_list"
                                  //           );
                                  //           // this.reloadPage();
                                  //         },
                                  //       });
                                  //     } else {
                                  //       setFieldValue(
                                  //         "bill_dt",
                                  //         e.target.value
                                  //       );
                                  //       this.checkInvoiceDateIsBetweenFYFun(
                                  //         e.target.value,
                                  //         setFieldValue
                                  //       );
                                  //     }
                                  //   } else {
                                  //     setFieldValue("bill_dt", "");
                                  //   }
                                  // }}
                                  // onBlur={(e) => {
                                  //   if (
                                  //     e.target.value != null &&
                                  //     e.target.value != ""
                                  //   ) {
                                  //     if (
                                  //       moment(
                                  //         e.target.value,
                                  //         "DD-MM-YYYY"
                                  //       ).isValid() == true
                                  //     ) {
                                  //       setFieldValue(
                                  //         "pi_invoice_dt",
                                  //         e.target.value
                                  //       );
                                  //       this.checkInvoiceDateIsBetweenFYFun(
                                  //         e.target.value,
                                  //         setFieldValue
                                  //       );
                                  //     } else {
                                  //       MyNotifications.fire({
                                  //         show: true,
                                  //         icon: "error",
                                  //         title: "Error",
                                  //         msg: "Invalid invoice date",
                                  //         is_button_show: true,
                                  //       });
                                  //       this.invoiceDateRef.current.focus();
                                  //       setFieldValue("pi_invoice_dt", "");
                                  //     }
                                  //   } else {
                                  //     setFieldValue("pi_invoice_dt", "");
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey == true && e.keyCode == 9) ||
                                      e.keyCode == 9
                                    ) {
                                      if (e.target.value) {
                                        // @prathmesh @DD/MM type then current year auto show start
                                        let datchco = e.target.value.trim();
                                        let repl = datchco.replace(/_/g, "");

                                        if (repl.length === 6) {
                                          const currentYear = new Date().getFullYear();
                                          let position = 6;
                                          repl = repl.split("");
                                          repl.splice(position, 0, currentYear);
                                          let finle = repl.join("");
                                          //console.log("finfinfinfin", finle);
                                          e.target.value = finle;
                                          setFieldValue("pi_invoice_dt", finle);
                                        }
                                        //current year auto show end
                                        if (
                                          moment(
                                            e.target.value,
                                            "DD-MM-YYYY"
                                          ).isValid() == true
                                        ) {
                                          setFieldValue(
                                            "pi_invoice_dt",
                                            e.target.value
                                          );
                                          this.checkInvoiceDateIsBetweenFYFun(
                                            e.target.value,
                                            setFieldValue
                                          );
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid invoice date",
                                            is_button_show: true,
                                          });
                                          this.invoiceDateRef.current.focus();
                                          setFieldValue("pi_invoice_dt", "");
                                        }
                                      } else {
                                        setFieldValue("pi_invoice_dt", "");
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value) {
                                        // @prathmesh @DD/MM type then current year auto show start
                                        let datchco = e.target.value.trim();
                                        let repl = datchco.replace(/_/g, "");

                                        if (repl.length === 6) {
                                          const currentYear = new Date().getFullYear();
                                          let position = 6;
                                          repl = repl.split("");
                                          repl.splice(position, 0, currentYear);
                                          let finle = repl.join("");
                                          //console.log("finfinfinfin", finle);
                                          e.target.value = finle;
                                          setFieldValue("pi_invoice_dt", finle);
                                        }
                                        //current year auto show end
                                        if (
                                          moment(
                                            e.target.value,
                                            "DD-MM-YYYY"
                                          ).isValid() == true
                                        ) {
                                          setFieldValue(
                                            "pi_invoice_dt",
                                            e.target.value
                                          );
                                          this.checkInvoiceDateIsBetweenFYFun(
                                            e.target.value,
                                            setFieldValue
                                          );
                                          this.focusNextElement(e);
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid invoice date",
                                            is_button_show: true,
                                          });
                                          this.invoiceDateRef.current.focus();
                                          setFieldValue("pi_invoice_dt", "");
                                        }
                                      } else {
                                        setFieldValue("pi_invoice_dt", "");
                                      }
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_invoice_dt}
                                </span>
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="px-0 my-auto"
                              >
                                <Form.Label>Delivery Type</Form.Label>
                              </Col>
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Select
                                  className="selectTo"
                                  // disabled={isInputDisabled}
                                  // components={{
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  // options={salesmanLst}
                                  name="salesmanId"
                                  id="salesmanId"
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                      this.setState({ currentTab: "second" });
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg="6"
                                md="6"
                                sm="6"
                                xs="6"
                                className="d-flex"
                              >
                                {selectedLedger &&
                                selectedLedger.balancingMethod ==
                                  "bill-by-bill" ? (
                                  <>
                                    {/* <Col lg={2} md={2} sm={2} xs={2}>
                                <Row className="mt-2"> */}
                                    <Col
                                      lg={5}
                                      md={5}
                                      sm={5}
                                      xs={5}
                                      className="p-0 my-auto"
                                    >
                                      <Form.Label>
                                        Payment Mode
                                        <label style={{ color: "red" }}>
                                          *
                                        </label>{" "}
                                      </Form.Label>
                                    </Col>
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      xs={6}
                                      className="my-auto"
                                    >
                                      <Form.Group
                                        ref={this.inputRef1}
                                        style={{ width: "fit-content" }}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (values.mode) {
                                            this.setErrorBorder(4, "");
                                          } else {
                                            this.setErrorBorder(4, "Y");
                                            // this.radioRef.current?.focus();
                                          }
                                        }}
                                        // className="d-flex label_style"
                                        // className={`${errorArrayBorder[4] == "Y"
                                        //   ? "border border-danger d-flex label_style"
                                        //   : "d-flex label_style"
                                        //   }`}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !values.mode
                                          ) {
                                            e.preventDefault();
                                          } else if (e.keyCode == 13) {
                                            this.focusNextElement(e);
                                          }
                                        }}
                                        className="d-flex"
                                      >
                                        <Form.Check
                                          type="radio"
                                          id="mode1"
                                          name="mode"
                                          label="Adjust"
                                          value="adjust"
                                          checked={
                                            values.mode == "adjust"
                                              ? true
                                              : false
                                          }
                                          onChange={handleChange}
                                        />

                                        <Form.Check
                                          className="ms-2"
                                          type="radio"
                                          name="mode"
                                          id="mode2"
                                          label="Credit"
                                          value="credit"
                                          checked={
                                            values.mode == "credit"
                                              ? true
                                              : false
                                          }
                                          onChange={handleChange}
                                        />
                                      </Form.Group>
                                    </Col>
                                    {/* </Row>
                              </Col> */}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>

                  <CmpTRow
                    productModalStateChange={this.productModalStateChange.bind(
                      this
                    )}
                    get_supplierlist_by_productidFun={this.get_supplierlist_by_productidFun.bind(
                      this
                    )}
                    handleUnitChange={this.handleUnitChange.bind(this)}
                    handleAddRow={this.handleAddRow.bind(this)}
                    handleRemoveRow={this.handleRemoveRow.bind(this)}
                    openSerialNo={this.openSerialNo.bind(this)}
                    openBatchNo={this.openBatchNo.bind(this)}
                    getProductBatchList={this.getProductBatchList.bind(this)}
                    add_button_flag={add_button_flag}
                    rows={rows}
                    productLst={productLst}
                    batchHideShow={true}
                    transactionType={transactionType}
                    // productNameData={productNameData}
                    // unitIdData={unitIdData}
                    productData={productData}
                    // batchNoData={batchNoData}
                    // qtyData={qtyData}
                    // rateData={rateData}
                    productId="TSREProductId-"
                    // addBtnId="TSREAddBtn-"
                    getProductPackageLst={this.getProductPackageLst.bind(this)}
                    selectProductModal={selectProductModal}
                    selectedProduct={selectedProduct}
                    userControl={this.props.userControl}
                    from_source={from_source}
                    invoice_data={
                      this.myRef.current ? this.myRef.current.values : ""
                    }
                    // productIdRow={productId}
                    // setProductId={setProductId}
                    // setProductRowIndex={setProductRowIndex}
                    rowIndex={rowIndex}
                    newBatchModal={newBatchModal}
                    batchInitVal={batchInitVal}
                    b_details_id={b_details_id}
                    isBatch={isBatch}
                    batchData={batchData}
                    is_expired={is_expired}
                    tr_id={tr_id}
                    batch_data_selected={batch_data_selected}
                    selectedSupplier={
                      this.myRef.current
                        ? this.myRef.current.values.selectedSupplier
                        : ""
                    }
                    transaction_batch_detailsFun={this.transaction_batch_detailsFun.bind(
                      this
                    )}
                    transaction_product_detailsFun={this.transaction_product_detailsFun.bind(
                      this
                    )}
                    productIdRow={productId}
                    setProductId={setProductId}
                    setProductRowIndex={setProductRowIndex}
                    orgLstProductRows={orgLstProductRows}
                    opType={opType} // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
                  />

                  <Row className="mx-0 btm-data">
                    <Col
                      lg={8}
                      md={8}
                      sm={8}
                      xs={8}
                      style={{ paddingTop: "5px" }}
                    >
                      <Tab.Container
                        id="left-tabs-example"
                        // @prathmesh @batch info & product info tab active start
                        // activeKey={
                        //   ledgerModal === true || isFocused === true
                        //     ? "first"
                        //     : productData !== ""
                        //       ? "second"
                        //       : "second"
                        // }
                        activeKey={currentTab}
                        // @prathmesh @batch info & product info tab active end
                        defaultActiveKey="second" // @prathmesh @product info tab active
                      >
                        <Nav variant="pills" className="flex-row">
                          <Nav.Item>
                            <Nav.Link
                              eventKey="first"
                              className="me-2 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ currentTab: "first" }); //@prathmesh @batch info & product info tab active
                              }}
                              tabIndex={-1}
                            >
                              <Button
                                id="TSIC_Ledger_Tab"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "first",
                                  });
                                }}
                                className={`${
                                  currentTab == "first"
                                    ? "nav-link active"
                                    : "nav-link"
                                }`}
                                onFocus={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "first",
                                  });
                                }}
                                onKeyDown={(e) => {
                                  // if (e.keyCode == 13) {
                                  //   this.focusNextElement(e);
                                  // } else
                                  if (e.shiftKey && e.keyCode == 9) {
                                  } else if (
                                    e.keyCode == 9 ||
                                    e.keyCode == 13 ||
                                    e.keyCode == 39
                                  ) {
                                    e.preventDefault();
                                    this.focusNextElement(e);
                                    this.setState({ currentTab: "second" });
                                  }
                                }}
                              >
                                Ledger
                              </Button>
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              className="p-0"
                              eventKey="second"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
                              }}
                              tabIndex={-1}
                            >
                              <Button
                                id="TSIC_Product_Tab"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "second",
                                  });
                                }}
                                className={`${
                                  currentTab == "second"
                                    ? "nav-link active"
                                    : "nav-link"
                                }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                    this.setState({ currentTab: "first" });
                                  } else if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  } else if (e.keyCode == 37) {
                                    document
                                      .getElementById("TSIC_Ledger_Tab")
                                      .focus();
                                    this.setState({ currentTab: "first" });
                                  }
                                }}
                              >
                                Product
                              </Button>
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>

                        <Tab.Content style={{ paddingTop: "15px" }}>
                          <Tab.Pane eventKey="first">
                            <Row className="tnx-pur-inv-description-style ">
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <h6 className="title-style">Ledger Info:</h6>
                                <div className="d-flex">
                                  <span className="span-lable">GST No:</span>
                                  <span className="span-value">
                                    {ledgerData.gst_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Area:</span>
                                  <span className="span-value">
                                    {ledgerData.area}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Bank:</span>
                                  <span className="span-value">
                                    {ledgerData.bank_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span
                                    className="span-lable"
                                    style={{ color: "transparent" }}
                                  >
                                    {" "}
                                    .
                                  </span>
                                  <span className="span-value"></span>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <div className="d-flex">
                                  <span className="span-lable">
                                    Contact Person:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.contact_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Transport:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.hsn} */}
                                    {/* {ledgerData.area} */}
                                  </span>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <div className="d-flex">
                                  <span className="span-lable">
                                    Credit Days:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.credit_days}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">FSSAI:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.fssai_number}
                                  </span>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="d-flex">
                                  <span className="span-lable">
                                    License No:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.license_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Route:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.route}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <Row>
                              <Col lg={8} className="">
                                <Row className="tnx-pur-inv-description-style">
                                  <Col
                                    lg={6}
                                    className="pe-0"
                                    style={{
                                      borderRight: "1px solid #EAD8B1",
                                    }}
                                  >
                                    <h6 className="title-style">
                                      Product Info:
                                    </h6>
                                    <div className="d-flex">
                                      {" "}
                                      <span className="span-lable">Brand:</span>
                                      <span className="span-value">
                                        {productData.brand}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Group:</span>
                                      <span className="span-value">
                                        {productData.group}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Category:
                                      </span>
                                      <span className="span-value">
                                        {productData.category}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Supplier:
                                      </span>
                                      <span className="span-value">
                                        {productData.supplier}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col
                                    lg={3}
                                    style={{
                                      borderRight: "1px solid #EAD8B1",
                                    }}
                                    className="col-top-margin pe-0"
                                  >
                                    <div className="d-flex">
                                      <span className="span-lable">HSN:</span>
                                      <span className="span-value">
                                        {/* {product_hover_details.hsn} */}
                                        {productData.hsn}
                                      </span>
                                    </div>

                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Tax Type:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.tax_type} */}
                                        {productData.tax_type}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Tax%:</span>
                                      <span className="span-value">
                                        {productData.tax_per}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Margin%:
                                      </span>
                                      <span className="span-value">
                                        {productData.margin_per}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col lg={3} className="col-top-margin pe-0">
                                    <div className="d-flex">
                                      <span className="span-lable">Cost:</span>
                                      <span className="span-value">
                                        {productData.cost}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Shelf ID:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.hsn} */}
                                        {productData.shelf_id}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Min Stock:
                                      </span>
                                      <span className="span-value">
                                        {[productData.min_stocks]}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Max Stock:
                                      </span>
                                      <span className="span-value">
                                        {productData.max_stocks}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row className="tnx-pur-inv-description-style">
                                  <Col lg={12}>
                                    <h6 className="title-style">Batch Info:</h6>
                                    <div className="d-flex">
                                      <span className="span-lable">Name:</span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? batchDetails.supplierName
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Bill no:
                                      </span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? batchDetails.billNo
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Bill Date:
                                      </span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? moment(
                                              batchDetails.billDate
                                            ).format("DD/MM/YYYY")
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span
                                        className="span-lable"
                                        style={{ color: "transparent" }}
                                      >
                                        {" "}
                                        .
                                      </span>
                                      <span className="span-value"></span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                      <Row className="py-2">
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                            onInput={(e) => {
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <div className="tnx-pur-inv-info-table">
                        <Table>
                          <thead>
                            <tr>
                              <th>Supplier Name</th>
                              <th>Inv No</th>
                              <th>Inv Date</th>
                              <th>Batch</th>
                              <th>MRP</th>
                              <th>Qty</th>
                              <th>Rate</th>
                              <th>Cost</th>
                              <th>Dis. %</th>
                              <th>Dis. ₹</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product_supplier_lst.length > 0 ? (
                              product_supplier_lst.map((v, i) => {
                                return (
                                  <tr>
                                    <td>{v.supplier_name}</td>
                                    <td>{v.invoice_no}</td>
                                    <td>
                                      {moment(v.invoice_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>{v.batch}</td>
                                    <td>
                                      {/* {v.mrp} */}
                                      {INRformat.format(v.mrp)}
                                    </td>
                                    <td>{v.quantity}</td>
                                    <td>
                                      {/* {v.rate} */}
                                      {INRformat.format(v.rate)}
                                    </td>
                                    <td>
                                      {/* {v.cost} */}
                                      {INRformat.format(v.cost)}
                                    </td>
                                    <td>{v.dis_per}</td>
                                    <td>
                                      {/* {v.dis_amt} */}
                                      {INRformat.format(v.dis_per)}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center">
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      className="pe-0"
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <Row className="pe-2">
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto ps-1"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col lg={3} className="mt-2 rPStyle">
                          <Form.Control
                            placeholder="0"
                            className="tnx-pur-inv-text-box px-1 text-end"
                            id="sales_discount"
                            name="sales_discount"
                            onChange={(e) => {
                              setFieldValue("sales_discount", e.target.value);

                              let ledger_disc_amt = calculatePercentage(
                                values.total_row_gross_amt1,
                                parseFloat(e.target.value)
                              );
                              if (isNaN(ledger_disc_amt) === true)
                                ledger_disc_amt = "";
                              setFieldValue(
                                "sales_discount_amt",
                                ledger_disc_amt !== ""
                                  ? parseFloat(ledger_disc_amt).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                            value={values.sales_discount}
                          />
                        </Col>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto pe-0"
                        >
                          <Form.Label>Dis.₹</Form.Label>
                        </Col>
                        <Col lg={5} className="mt-2">
                          <Form.Control
                            placeholder="0.00"
                            className="tnx-pur-inv-text-box rP text-end"
                            id="sales_discount_amt"
                            name="sales_discount_amt"
                            onChange={(e) => {
                              setFieldValue(
                                "sales_discount_amt",
                                e.target.value
                              );

                              let ledger_disc_per =
                                (parseFloat(e.target.value) * 100) /
                                parseFloat(values.total_row_gross_amt1);
                              if (isNaN(ledger_disc_per) === true)
                                ledger_disc_per = "";
                              setFieldValue(
                                "sales_discount",
                                ledger_disc_per !== ""
                                  ? parseFloat(ledger_disc_per).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                            value={values.sales_discount_amt}
                          />
                        </Col>
                      </Row>
                      <CmpTGSTFooter
                        values={values}
                        taxcal={taxcal}
                        gstId={gstId}
                        handleCGSTChange={this.handleCGSTChange.bind(this)}
                        handleSGSTChange={this.handleSGSTChange.bind(this)}
                      />
                      <Row>
                        <Row>
                          <Col lg={12} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="errormsg">{values.total_qty}</span>
                          </Col>
                        </Row>

                        <Row className="">
                          <Col lg={12} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span className="errormsg">
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                        <Row className="">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0 mt-1"
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            >
                              <Form.Check
                                id="isRoundOff"
                                name="isRoundOff"
                                className="Roff"
                                type="checkbox"
                                checked={
                                  isRoundOffCheck === true ? true : false
                                }
                                onChange={(e) => {
                                  this.handleRoundOffCheck(e.target.checked);
                                }}
                                label=""
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={11} className="">
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="errormsg">
                              {/* {parseFloat(values.roundoff).toFixed(2)} */}
                              {INRformat.format(values.roundoff)}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                      {showLedgerDiv === true ? (
                        <div
                          className={`small-tbl   ${
                            selectedLedgerNo === 1
                              ? "addLedger1"
                              : selectedLedgerNo === 2
                              ? "addLedger2"
                              : "addLedger3"
                          }`}
                        >
                          <Table hover style={{ position: "sticky" }}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Unique Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lstAdditionalLedger.map((v, i) => {
                                return (
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      /*    console.log(
                                        "v ",
                                        v,
                                        addchgElement1,
                                        addchgElement2,
                                        this.myRef.current
                                      ); */
                                      if (this.myRef.current != null) {
                                        this.myRef.current.setFieldValue(
                                          addchgElement1,
                                          v.name
                                        );
                                        this.myRef.current.setFieldValue(
                                          addchgElement2,
                                          v.id
                                        );
                                        this.addLedgerModalFun();
                                      }
                                    }}
                                    style={{
                                      background:
                                        v.id === values[addchgElement2]
                                          ? "#f8f4d3"
                                          : "",
                                    }}
                                  >
                                    <td>{v.name}</td>
                                    <td>{v.unique_code}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        ""
                      )}
                      <Table className="tnx-pur-inv-btm-amt-tbl">
                        <tbody>
                          <tr>
                            <td className="py-0" style={{ cursor: "pointer" }}>
                              <div className="d-flex">
                                {/* <InputGroup className="  mdl-text d-flex">
                                  <Form.Control
                                    placeholder="Add.Chareges"
                                    className="tnx-pur-inv-text-box mt-2"
                                    name="additionalChgLedgerName1"
                                    id="additionalChgLedgerName1"
                                    // styles={purchaseSelect}
                                    onChange={(v) => {
                                      setFieldValue(
                                        "additionalChgLedgerName1",
                                        v.target.value
                                      );
                                      setFieldValue("additionalChgLedger1", "");
                                      // this.searchLedger(v.target.value);
                                    }}
                                    onFocus={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName1 == ""
                                      ) {
                                        this.ledgerIndExpModalStateChange(
                                          "ledgerModalIndExp1",
                                          true,
                                          "additionalChgLedgerName1"
                                        );
                                      } else {
                                        this.ledgerIndExpModalStateChange(
                                          "ledgerModalIndExp1",
                                          false,
                                          "additionalChgLedgerName1"
                                        );
                                      }
                                    }}
                                    // onClick={(e) => {
                                    //   e.preventDefault();
                                    //   setTimeout(() => {
                                    //     this.setState(
                                    //       { selectedLedgerNo: 1 },
                                    //       () => {
                                    //         this.addLedgerModalFun(
                                    //           true,
                                    //           "additionalChgLedgerName1",
                                    //           "additionalChgLedger1"
                                    //         );
                                    //       }
                                    //     );
                                    //   }, 100);
                                    // }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        ledgerModalIndExp1: true,
                                      });

                                      if (
                                        values.additionalChgLedgerName1 != ""
                                      ) {
                                        this.ledgerIndExpModalStateChange(
                                          "selectedLedgerIndExp",
                                          values.selectedSupplier
                                        );
                                        this.ledgerIndExpModalStateChange(
                                          "ledgerModalIndExp",
                                          true
                                        );
                                      } else {
                                        this.ledgerIndExpModalStateChange(
                                          "ledgerModalIndExp",
                                          true
                                        );
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.ledgerIndExpModalStateChange(
                                          "ledgerModalIndExp",
                                          true
                                        );
                                      }
                                    }}
                                    value={values.additionalChgLedgerName1}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 200);
                                  // }}
                                  />
                                  {values.additionalChgLedgerName1 != "" &&
                                    (parseInt(values.additionalChgLedgerAmt1) ===
                                      0 ||
                                      values.additionalChgLedgerAmt1 === "") ? (
                                    <InputGroup.Text
                                      style={{
                                        position: "absolute",
                                        margin: "12px 105px",
                                        padding: "4px",
                                        background: "aliceblue",
                                        color: "red",
                                      }}
                                      className="int-grp"
                                      id="basic-addon1"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                          values.additionalChgLedgerName1 != ""
                                        ) {
                                          setFieldValue(
                                            "additionalChgLedgerName1",
                                            ""
                                          );
                                          setFieldValue(
                                            "additionalChgLedgerAmt1",
                                            ""
                                          );

                                          setTimeout(() => {
                                            document
                                              .getElementById(
                                                "additionalChgLedgerName1"
                                              )
                                              .focus();
                                          }, 200);
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </InputGroup.Text>
                                  ) : (
                                    ""
                                  )}
                                </InputGroup> */}
                                <Form.Label className="my-auto lebleclass">
                                  Add Charges{" "}
                                </Form.Label>
                                <div
                                  className="btn_img_style mt-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp1: true });

                                    if (values.additionalChgLedgerName1 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Button
                                    className="btn_img_style"
                                    id="TCNE_addCharges_btn"
                                  >
                                    <img
                                      src={add_icon}
                                      alt=""
                                      className="btnimg"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          ledgerModalIndExp1: true,
                                        });

                                        if (
                                          values.additionalChgLedgerName1 != ""
                                        ) {
                                          this.ledgerIndExpModalStateChange(
                                            "selectedLedgerIndExp",
                                            values.selectedSupplier
                                          );
                                          this.ledgerIndExpModalStateChange(
                                            "ledgerModalIndExp",
                                            true
                                          );
                                        } else {
                                          this.ledgerIndExpModalStateChange(
                                            "ledgerModalIndExp",
                                            true
                                          );
                                        }
                                      }}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Additional Total"
                                className="tnx-pur-inv-text-box mt-2 text-end"
                                id="additionalChargesTotal"
                                name="additionalChargesTotal"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChargesTotal",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={additionalChargesTotal.toFixed(2)}
                                readOnly={
                                  parseInt(additionalChargesTotal) > 0
                                    ? false
                                    : true
                                }
                                style={{ marginLeft: "-10px", width: "110%" }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              {/* <InputGroup className="  mdl-text d-flex">
                                <Form.Control
                                  placeholder="Ledger 2"
                                  className="tnx-pur-inv-text-box mt-1"
                                  // styles={purchaseSelect}
                                  name="additionalChgLedgerName2"
                                  id="additionalChgLedgerName2"
                                  onChange={(v) => {
                                    setFieldValue(
                                      "additionalChgLedgerName2",
                                      v.target.value
                                    );
                                    setFieldValue("additionalChgLedger2", "");
                                    // this.searchLedger(v.target.value);
                                  }}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    if (values.additionalChgLedgerName2 == "") {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp2",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp2",
                                        false
                                      );
                                    }
                                  }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.setState(
                                  //       { selectedLedgerNo: 2 },
                                  //       () => {
                                  //         this.addLedgerModalFun(
                                  //           true,
                                  //           "additionalChgLedgerName2",
                                  //           "additionalChgLedger2"
                                  //         );
                                  //       }
                                  //     );
                                  //   }, 100);
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp2: true });

                                    if (values.additionalChgLedgerName2 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.additionalChgLedgerName2}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 200);
                                  // }}
                                />
                                {values.additionalChgLedgerName2 != "" &&
                                (parseInt(values.additionalChgLedgerAmt2) ===
                                  0 ||
                                  values.additionalChgLedgerAmt2 === "") ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "8px 105px",
                                      padding: "4px",
                                      background: "aliceblue",
                                      color: "red",
                                    }}
                                    className="int-grp"
                                    id="basic-addon1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName2 != ""
                                      ) {
                                        setFieldValue(
                                          "additionalChgLedgerName2",
                                          ""
                                        );
                                        setFieldValue(
                                          "additionalChgLedgerAmt2",
                                          ""
                                        );

                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "additionalChgLedgerName2"
                                            )
                                            .focus();
                                        }, 200);
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup> */}
                              {/* <Row>
                                <Col lg="6">
                                  <Form.Group style={{ width: "fit-content" }}>
                                    <Form.Check
                                      type="radio"
                                      id="mode1"
                                      name="mode"
                                      label="TDS"
                                      value="tds"
                                      autoComplete="off"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg="6">
                                  <Form.Group style={{ width: "fit-content" }}>
                                    <Form.Check
                                      type="radio"
                                      name="mode"
                                      id="mode2"
                                      label="TCS"
                                      value="tcs"
                                      autoComplete="off"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row> */}

                              {/* @neha @Tcs Tds Radio button true false  */}
                              <Row>
                                <Col lg="8">
                                  <Form.Group
                                    style={{ width: "fit-content" }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  >
                                    <Row>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          id="mode1"
                                          name="mode"
                                          label="TDS"
                                          value="tds"
                                          autoComplete="off"
                                        />
                                      </Col>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          name="mode"
                                          id="mode2"
                                          label="TCS"
                                          value="tcs"
                                          autoComplete="off"
                                        />
                                      </Col>
                                    </Row>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </td>
                            {/* <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1 text-end"
                                id="additionalChgLedgerAmt2"
                                name="additionalChgLedgerAmt2"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt2",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt2}
                                readOnly={
                                  parseInt(values.additionalChgLedger2) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td> */}
                            <td className="p-0 text-end">
                              <Row>
                                <Col lg="5" md="5" className="p-0">
                                  <InputGroup>
                                    <div className="d-flex">
                                      <Form.Control
                                        placeholder="%"
                                        className="tnx-pur-inv-text-box mt-1 text-end px-1"
                                        id="tcs_per"
                                        name="tcs_per"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "tcs_per",
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          //console.log("name ", e.target.name);
                                          if (
                                            e.target.name
                                              .trim()
                                              .toLowerCase() == "tcs_per"
                                          ) {
                                            //  setTimeout(() => {
                                            this.handleTranxCalculation(
                                              "tcs_per"
                                            );
                                            // }, 100);
                                          }
                                        }}
                                        value={values.tcs_per}
                                        onKeyPress={(e) => {
                                          OnlyEnterAmount(e);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.focusNextElement(e);
                                          }
                                        }}
                                        // readOnly={
                                        //   parseInt(values.tcs_per) > 0
                                        //     ? false
                                        //     : true
                                        // }
                                      />
                                      <span className="my-auto">%</span>
                                    </div>
                                  </InputGroup>
                                </Col>
                                <Col lg="7" md="7" className="ps-1">
                                  <div className="d-flex">
                                    <Form.Control
                                      placeholder="Amt."
                                      className="tnx-pur-inv-text-box mt-1 text-end px-1"
                                      id="tcs_amt"
                                      name="tcs_amt"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "tcs_amt",
                                          e.target.value
                                        );
                                        // setTimeout(() => {
                                        //   this.handleTranxCalculation("tcs_amt");
                                        // }, 100);
                                      }}
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        //console.log("name ", e.target.name);
                                        if (
                                          e.target.name.trim().toLowerCase() ==
                                          "tcs_amt"
                                        ) {
                                          //  setTimeout(() => {
                                          this.handleTranxCalculation(
                                            "tcs_amt"
                                          );
                                          // }, 100);
                                        }
                                      }}
                                      value={values.tcs_amt}
                                      onKeyPress={(e) => {
                                        OnlyEnterAmount(e);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.focusNextElement(e);
                                        }
                                      }}
                                      // readOnly={
                                      //   parseInt(values.tcs_amt) > 0
                                      //     ? false
                                      //     : true
                                      // }
                                    />
                                    <span className="my-auto">₹</span>
                                  </div>
                                </Col>
                              </Row>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Gross Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_base_amt).toFixed(2)} */}
                              {INRformat.format(values.total_base_amt)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Discount</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )} */}
                              {INRformat.format(values.total_invoice_dis_amt)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_taxable_amt).toFixed(2)} */}
                              {/* 99999.99 */}
                              {INRformat.format(values.total_taxable_amt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {/* 9999.99 */}
                              {INRformat.format(values.total_tax_amt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Cess</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              00.00
                              {/* {INRformat.format(values.total_tax_amt)} */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <InputGroup className="  mdl-text d-flex">
                                <Form.Control
                                  placeholder="Ledger 1"
                                  className="tnx-pur-inv-text-box mt-1 mb-1"
                                  name="additionalChgLedgerName3"
                                  id="additionalChgLedgerName3"
                                  // styles={purchaseSelect}
                                  onChange={(v) => {
                                    setFieldValue(
                                      "additionalChgLedgerName3",
                                      v.target.value
                                    );
                                    setFieldValue("additionalChgLedger3", "");
                                    // this.searchLedger(v.target.value);
                                  }}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    if (values.additionalChgLedgerName3 == "") {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp3",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp3",
                                        false
                                      );
                                    }
                                  }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.setState(
                                  //       { selectedLedgerNo: 3 },
                                  //       () => {
                                  //         this.addLedgerModalFun(
                                  //           true,
                                  //           "additionalChgLedgerName3",
                                  //           "additionalChgLedger3"
                                  //         );
                                  //       }
                                  //     );
                                  //   }, 100);
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp3: true });

                                    if (values.additionalChgLedgerName3 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  value={values.additionalChgLedgerName3}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 200);
                                  // }}
                                />
                                {values.additionalChgLedgerName3 != "" &&
                                (parseInt(values.additionalChgLedgerAmt3) ===
                                  0 ||
                                  values.additionalChgLedgerAmt3 === "") ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "8px 105px",
                                      padding: "4px",
                                      background: "aliceblue",
                                      color: "red",
                                    }}
                                    className="int-grp"
                                    id="basic-addon1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName3 != ""
                                      ) {
                                        setFieldValue(
                                          "additionalChgLedgerName3",
                                          ""
                                        );
                                        setFieldValue(
                                          "additionalChgLedgerAmt3",
                                          ""
                                        );

                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "additionalChgLedgerName3"
                                            )
                                            .focus();
                                        }, 200);
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1 mb-1 text-end"
                                id="additionalChgLedgerAmt3"
                                name="additionalChgLedgerAmt3"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt3",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt3}
                                readOnly={
                                  parseInt(values.additionalChgLedger3) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {/* 123456789.99 */}
                              {INRformat.format(values.bill_amount)}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      {/* {JSON.stringify(selectedLedgerNo)} */}
                      <p className="btm-row-size">
                        <Button
                          id="TCNE_submit_btn"
                          className="successbtn-style"
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              this.myRef.current.handleSubmit();
                            }
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="secondary cancel-btn ms-2"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            MyNotifications.fire(
                              {
                                show: true,
                                icon: "confirm",
                                title: "Confirm",
                                msg: "Do you want to Cancel",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  // eventBus.dispatch(
                                  //   "page_change",
                                  //   "tranx_credit_note_list"
                                  // );
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_credit_note_edit",
                                    to: "tranx_credit_note_list",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: {
                                      editId: this.state.salesEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                  });
                                },
                                handleFailFn: () => {},
                              },
                              () => {
                                console.warn("return_data");
                              }
                            );
                          }}
                        >
                          Cancel
                        </Button>
                      </p>
                    </Col>
                  </Row>

                  <Row className="mx-0 btm-rows-btn1">
                    {/* <Col md="2" className="px-0">
                      <Form.Label className="btm-label">
                        <img
                          src={keyboard}
                          className="svg-style mt-0 mx-2"
                        ></img>
                        New entry: <span className="shortkey">Ctrl + N</span>
                      </Form.Label>
                    </Col>
                    <Col md="8">
                      <Form.Label className="btm-label">
                        Duplicate: <span className="shortkey">Ctrl + D</span>
                      </Form.Label>
                    </Col>
                   
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
                    </Col> */}
                    <Col md="12" className="my-auto">
                      {/* <Row>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faHouse}
                                  className="svg-style icostyle mt-0 mx-2"
                                />

                                <span className="shortkey">Ctrl+A</span>
                              </Form.Label>
                            </Col>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faCirclePlus}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">F2</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6" className="">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+E</span>
                              </Form.Label>
                            </Col>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faFloppyDisk}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+S</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+D</span>
                              </Form.Label>
                            </Col>
                            <Col md="6" className="">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+C</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faCalculator}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Alt+C</span>
                              </Form.Label>
                            </Col>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faGear}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">F11</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faRightFromBracket}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+Z</span>
                              </Form.Label>
                            </Col>
                            <Col md="6" className="">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faPrint}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Ctrl+P</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="2" className="">
                          <Row>
                            <Col md="6" className="">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faArrowUpFromBracket}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">Export</span>
                              </Form.Label>
                            </Col>
                            <Col md="6">
                              <Form.Label className="btm-label d-flex">
                                <FontAwesomeIcon
                                  icon={faCircleQuestion}
                                  className="svg-style icostyle mt-0 mx-2"
                                />
                                <span className="shortkey">F1</span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                      </Row> */}
                    </Col>
                  </Row>
                </>
              </Form>
            )}
          </Formik>

          <Modal
            //show={serialnopopupwindow}
            show={Clietdetailmodal}
            size="sm"
            className="mt-5 mainmodal"
            onHide={() => {
              this.handleClientDetails(false);
            }}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Client Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2">
              {/* <pre>{JSON.stringify(clientinfo, undefined, 2)}</pre> */}

              <div className="purchasescreen">
                {clientinfo && (
                  <Table bordered>
                    <thead>
                      <th> Name </th>
                      <th>Address </th>
                      <th>Contact No </th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.sundry_debtors_name}
                        </td>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.address}
                        </td>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.mobile}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                //className="createbtn seriailnobtn"
                onClick={() => {
                  this.handleClientDetails(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Adjustment Bill Modal */}
          <Modal
            show={adjusmentbillmodal}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ adjusmentbillmodal: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              // closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Adjustment and Pending Bills
              </Modal.Title>
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={invoice_data}
              validationSchema={Yup.object().shape({
                newReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                //console.log("values", values);

                const {
                  invoice_data,
                  additionalCharges,
                  additionalChargesTotal,
                  rows,
                  totalAmount,
                  pendingAmount,
                  returnAmount,
                } = this.state;
                // this.handleFetchData(values);
                let invoiceValues = this.myRef.current.values;
                // let paymentvalues = this.paymentRef.current.values;
                // //console.log("paymentvalues", paymentvalues);

                let requestData = new FormData();
                let row = billLst.filter((v) => v.Total_amt != "");
                requestData.append("creditNoteReference", values.newReference);
                let bal = billLst.reduce(function (prev, next) {
                  return parseFloat(
                    parseFloat(prev) +
                      parseFloat(
                        next.credit_paid_amt ? next.credit_paid_amt : 0
                      )
                  );
                }, 0);
                //console.log("bal", bal);
                let totalamt = parseFloat(invoiceValues.totalamt);

                if (bal <= totalamt) {
                  if (values.newReference == "true") {
                    let bills = [];
                    row.map((v) => {
                      if (v.credit_paid_amt != 0) {
                        bills.push({
                          creditNoteId: v.id,
                          creditNotePaidAmt: v.credit_paid_amt,
                          creditNoteRemaningAmt: v.credit_remaining_amt,
                          source: v.source,
                        });
                      }
                    });
                    requestData.append("bills", JSON.stringify(bills));
                  }
                  // requestData.append('newReference', values.newReference);
                  // requestData.append(
                  //   'outstanding_sales_return_amt',
                  //   outstanding_sales_return_amt
                  // );

                  // !Invoice Data

                  requestData.append(
                    "bill_dt",
                    moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                  );

                  requestData.append("bill_no", invoiceValues.bill_no);
                  requestData.append(
                    "sales_acc_id",
                    invoiceValues.salesAccId.value
                  );
                  requestData.append("sales_sr_no", invoiceValues.sales_sr_no);
                  requestData.append(
                    "gstNo",
                    invoiceValues.gstId !== "" && invoice_data.gstId
                      ? invoiceValues.gstId.label
                      : ""
                  );

                  requestData.append(
                    "debtors_id",
                    invoice_data.supplierNameId.value
                  );
                  // !Invoice Data
                  requestData.append("roundoff", invoiceValues.roundoff);
                  requestData.append("narration", invoiceValues.narration);
                  requestData.append(
                    "total_base_amt",
                    invoiceValues.total_base_amt
                  );
                  requestData.append("totalamt", invoiceValues.totalamt);
                  requestData.append(
                    "taxable_amount",
                    invoiceValues.total_taxable_amt
                  );
                  let totalcgst = this.state.taxcal.cgst.reduce(
                    (n, p) => n + parseFloat(p.amt),
                    0
                  );
                  let totalsgst = this.state.taxcal.sgst.reduce(
                    (n, p) => n + parseFloat(p.amt),
                    0
                  );
                  let totaligst = this.state.taxcal.igst.reduce(
                    (n, p) => n + parseFloat(p.amt),
                    0
                  );
                  requestData.append("totalcgst", totalcgst);
                  requestData.append("totalsgst", totalsgst);
                  requestData.append("totaligst", totaligst);
                  requestData.append("totalqty", invoiceValues.totalqty);
                  requestData.append(
                    "tcs",
                    invoiceValues.tcs && invoiceValues.tcs != ""
                      ? invoiceValues.tcs
                      : 0
                  );
                  requestData.append(
                    "sales_discount",
                    invoiceValues.sales_discount &&
                      invoiceValues.sales_discount != ""
                      ? invoiceValues.sales_discount
                      : 0
                  );

                  requestData.append(
                    "total_sales_discount_amt",
                    invoiceValues.total_purchase_discount_amt &&
                      invoiceValues.total_purchase_discount_amt != ""
                      ? invoiceValues.total_purchase_discount_amt
                      : 0
                  );

                  requestData.append(
                    "sales_discount_amt",
                    invoiceValues.sales_discount_amt &&
                      invoiceValues.sales_discount_amt != ""
                      ? invoiceValues.sales_discount_amt
                      : 0
                  );

                  requestData.append(
                    "sales_disc_ledger",
                    invoiceValues.sales_disc_ledger
                      ? invoiceValues.sales_disc_ledger.value
                      : 0
                  );

                  let frow = rows.map((v, i) => {
                    if (v.productId != "") {
                      v.productId = v.productId ? v.productId.value : "";
                      v.brandDetails = v.brandDetails.filter((vi) => {
                        vi["brandId"] = vi.brandId ? vi.brandId.value : "";
                        vi["groupDetails"] = vi.groupDetails.map((gv) => {
                          gv["groupId"] = gv.groupId ? gv.groupId.value : "";
                          gv["categoryDetails"] = gv.categoryDetails.map(
                            (vc) => {
                              vc["categoryId"] = vc.categoryId
                                ? vc.categoryId.value
                                : "";
                              vc[
                                "subcategoryDetails"
                              ] = vc.subcategoryDetails.map((vs) => {
                                vs["subcategoryId"] = vs.subcategoryId
                                  ? vs.subcategoryId.value
                                  : "";
                                vs["packageDetails"] = vs.packageDetails.map(
                                  (vp) => {
                                    vp["packageId"] = vp.packageId
                                      ? vp.packageId.value
                                      : "";
                                    vp.unitDetails = vp.unitDetails.map(
                                      (vu) => {
                                        vu["unitId"] = vu.unitId
                                          ? vu.unitId.value
                                          : "";

                                        vu["is_multi_unit"] = vu.is_multi_unit;
                                        vu["rate"] = vu.rate;
                                        vu["dis_amt"] =
                                          vu.dis_amt != "" ? vu.dis_amt : 0;
                                        vu["dis_per"] =
                                          vu.dis_per != "" ? vu.dis_per : 0;
                                        vu["rate_a"] = vu.rate_a;
                                        vu["rate_b"] = vu.rate_b;
                                        vu["rate_c"] = vu.rate_c;
                                        vu["max_discount"] = vu.max_discount;
                                        vu["min_discount"] = vu.min_discount;
                                        vu["min_margin"] = vu.min_margin;
                                        vu["b_expiry"] = moment(
                                          vu.b_expiry
                                        ).format("yyyy-MM-DD");
                                        vu["manufacturing_date"] = moment(
                                          vu.manufacturing_date
                                        ).format("yyyy-MM-DD");
                                        vu["is_batch"] = vu.is_batch;
                                        vu["isBatchNo"] = vu.isBatchNo;
                                        vu["igst"] =
                                          vu.igst != "" ? vu.igst : 0;
                                        vu["cgst"] =
                                          vu.cgst != "" ? vu.cgst : 0;
                                        vu["sgst"] =
                                          vu.sgst != "" ? vu.sgst : 0;

                                        return vu;
                                      }
                                    );
                                    return vp;
                                  }
                                );
                                return vs;
                              });
                              return vc;
                            }
                          );

                          return gv;
                        });
                        return vi;
                      });
                      return v;
                    }
                  });
                  //console.log("frow =->", frow);
                  var filtered = frow.filter(function (el) {
                    return el != null;
                  });
                  let additionalChargesfilter = additionalCharges.filter(
                    (v) => {
                      if (
                        v.ledgerId != "" &&
                        v.ledgerId != undefined &&
                        v.ledgerId != null
                      ) {
                        v["ledger"] = v["ledgerId"]["value"];
                        return v;
                      }
                    }
                  );
                  requestData.append(
                    "additionalChargesTotal",
                    additionalChargesTotal
                  );
                  requestData.append("row", JSON.stringify(filtered));
                  requestData.append(
                    "additionalCharges",
                    JSON.stringify(additionalChargesfilter)
                  );
                  requestData.append("sale_type", "sales");
                  requestData.append("print_type", "create");

                  requestData.append(
                    "payment_mode",
                    JSON.stringify(cashAcbankLst)
                  );
                  requestData.append("p_totalAmount", totalAmount);
                  requestData.append("p_returnAmount", returnAmount);
                  requestData.append("p_pendingAmount", pendingAmount);

                  if (
                    authenticationService.currentUserValue.state &&
                    invoice_data &&
                    invoice_data.supplierNameId &&
                    invoice_data.supplierNameId.state !=
                      authenticationService.currentUserValue.state
                  ) {
                    let taxCal = {
                      igst: this.state.taxcal.igst,
                    };

                    requestData.append("taxFlag", false);
                    requestData.append(
                      "taxCalculation",
                      JSON.stringify(taxCal)
                    );
                  } else {
                    let taxCal = {
                      cgst: this.state.taxcal.cgst,
                      sgst: this.state.taxcal.sgst,
                    };
                    // console.log("taxCal", taxCal);
                    requestData.append(
                      "taxCalculation",
                      JSON.stringify(taxCal)
                    );
                    requestData.append("taxFlag", true);
                  }

                  //console.log("requestData", requestData.values());
                  // List key/value pairs
                  for (let [name, value] of requestData) {
                    //console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                  }
                  createSalesInvoice(requestData).then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want Print",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                            this.getInvoiceBillsLstPrint(invoiceValues.bill_no);
                          },
                          handleFailFn: () => {
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          },
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
                    } else {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: res.message,
                        is_button_show: true,
                      });
                    }
                  });
                } else {
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
                resetForm,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="purchaseumodal p-4 p-invoice-modal ">
                    <Row>
                      <Col md="2">
                        <Form.Group className="gender nightshiftlabel">
                          <Form.Label>
                            <input
                              name="newReference"
                              type="radio"
                              value="true"
                              checked={
                                values.newReference === "true" ? true : false
                              }
                              onChange={handleChange}
                              className="mr-3"
                            />
                            <span className="ms-2">YES</span>
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="nightshiftlabel">
                          <Form.Label className="ml-3">
                            <input
                              name="newReference"
                              type="radio"
                              value="false"
                              onChange={handleChange}
                              checked={
                                values.newReference === "false" ? true : false
                              }
                              className="mr-3"
                            />
                            <span className="ms-2">NO</span>
                          </Form.Label>

                          <span className="text-danger">
                            {errors.newReference && "Select Option"}
                          </span>
                        </Form.Group>
                      </Col>

                      {values.newReference === "true" && (
                        <Col className="btn_align md-5">
                          <span>
                            <h4>Invoice Amount :{this.finalInvoiceAmt()}</h4>
                          </span>
                        </Col>
                      )}
                    </Row>
                    {values.newReference === "true" && (
                      <Row>
                        <div className="table_wrapper1">
                          <Table className="mb-2">
                            <thead>
                              <tr>
                                <th className="">
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="ml-1 mb-1 pmt-allbtn"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      checked={
                                        isAllCheckedCredit === true
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        this.handleBillsSelectionAllCredit(
                                          e.target.checked
                                        );
                                      }}
                                      label="Sr.#"
                                    />
                                  </Form.Group>
                                  {/* <span className="pt-2 mt-2"> Debit Note No</span> */}
                                </th>
                                <th>Debit Note No</th>
                                <th> Debit Note Date</th>
                                <th>Total amount</th>
                                <th style={{ width: "23%" }}>Paid Amt</th>
                                <th>Remaining Amt</th>

                                {/* <th style={{ width: '23%' }}>Paid Amt</th>
                            <th>Remaining Amt</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {billLst.map((v, i) => {
                                return (
                                  <tr>
                                    <td style={{ width: "5%" }}>
                                      <Form.Group
                                        controlId="formBasicCheckbox1"
                                        className="ml-1 pmt-allbtn"
                                      >
                                        <Form.Check
                                          type="checkbox"
                                          checked={selectedBillsdebit.includes(
                                            v.credit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionCredit(
                                              v.credit_note_no,
                                              i,
                                              e.target.checked
                                            );
                                          }}
                                          label={i + 1}
                                        />
                                      </Form.Group>
                                    </td>
                                    <td>{v.credit_note_no}</td>

                                    <td>
                                      {moment(v.credit_note_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>

                                    <td>{v.Total_amt}</td>
                                    <td>
                                      {/* {vi.paid_amt} */}
                                      <Form.Control
                                        type="text"
                                        onChange={(e) => {
                                          e.preventDefault();

                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            i
                                          );
                                        }}
                                        value={v.credit_paid_amt}
                                        className="paidamttxt"
                                        //style={{ paddingTop: "0" }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(
                                        v.credit_remaining_amt
                                      ).toFixed(2)
                                        ? v.credit_remaining_amt
                                        : 0}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bb-total">
                              <tr>
                                <td colSpan={2} className="bb-t">
                                  {" "}
                                  <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td></td>
                                <td>
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.Total_amt ? next.Total_amt : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                                <td>
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.credit_paid_amt
                                              ? next.credit_paid_amt
                                              : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                                <td>
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.credit_remaining_amt
                                              ? next.credit_remaining_amt
                                              : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </Row>
                    )}

                    <Button
                      className="successbtn-style float-end mt-2 mb-2"
                      type="submit"
                      style={{
                        borderRadius: "15px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      Submit
                    </Button>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* payment mode */}
          <Modal
            show={paymetmodel}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ paymetmodel: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              // closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Payment Mode
              </Modal.Title>
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              innerRef={this.paymentRef}
              enableReinitialize={true}
              initialValues={{
                creditnoteNo: "",
                paymentReference: "",
                bank_payment_type: "",
                bank_payment_no: "",
              }}
              validationSchema={Yup.object().shape({
                paymentReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                //console.log("form submit values", values);

                // this.handleFetchData(values);
                let { selectedSupplier } = this.myRef.current.values;
                if (selectedSupplier) {
                  this.handleFetchData(selectedSupplier.id);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
                resetForm,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="purchaseumodal p-4 p-invoice-modal ">
                    <Row>
                      <Col md="2">
                        <Form.Group className="gender nightshiftlabel">
                          <Form.Label>
                            <input
                              name="paymentReference"
                              type="radio"
                              value="cash"
                              checked={
                                values.paymentReference === "cash"
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              className="mr-3"
                            />
                            <span className="ms-2">Cash</span>
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="nightshiftlabel">
                          <Form.Label className="ml-3">
                            <input
                              name="paymentReference"
                              type="radio"
                              value="online"
                              onChange={handleChange}
                              checked={
                                values.paymentReference === "online"
                                  ? true
                                  : false
                              }
                              className="mr-3"
                            />
                            <span className="ms-2">Online</span>
                          </Form.Label>

                          <span className="text-danger">
                            {errors.paymentReference && "Select Option"}
                          </span>
                        </Form.Group>
                      </Col>

                      {/* {values.paymentReference != null
                        ? this.handleFetchData(invoice_data.supplierNameId.value)
                        : null} */}
                      {/* this.handleFetchData(invoice_data.supplierNameId.value); */}
                    </Row>

                    {/* {values.paymentReference === "online" ? (
                      <Row>
                        <hr></hr>
                        <Col md="5">
                          <Form.Group className="">
                            <Form.Label>Type</Form.Label>
                            <Select
                              className="selectTo mt-1"
                              placeholder="Select"
                              styles={customStyles}
                              isClearable
                              options={BankOpt}
                              borderRadius="0px"
                              colors="#729"
                              name="bank_payment_type"
                              onChange={(value) => {
                                setFieldValue("bank_payment_type", value);
                              }}
                              value={values.bank_payment_type}
                            />
                            <span className="text-danger">
                              {errors.bank_payment_type}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label className="mb-1">Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="bank_payment_no"
                              placeholder="bank_payment_no"
                              id="bank_payment_no"
                              onChange={handleChange}
                              value={values.bank_payment_no}
                              isValid={
                                touched.bank_payment_no &&
                                !errors.bank_payment_no
                              }
                              isInvalid={!!errors.bank_payment_no}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bank_payment_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : null} */}
                    <Button
                      className="successbtn-style float-end mt-2 mb-2"
                      type="submit"
                      style={{
                        borderRadius: "15px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      Submit
                    </Button>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* show print */}
          <Modal
            show={showPrint}
            size="md"
            // className={`${icon}-alert`}
            onHide={() => {
              this.setState({ show: false });
            }}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <CloseButton
                variant="black"
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              />
            </Modal.Header>
            <Modal.Body className="text-center">
              {this.handleImage()}
              {/* <p className="title">{title}</p>
              <p className="msg">{msg}</p> */}
              {this.state.icon === "confirm" && (
                <>
                  <Button
                    className="sub-button"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getInvoiceBillsLst(is_button_show);

                      // this.handleHide();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className="sub-button btn-danger"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      // eventBus.dispatch("page_change", {
                      //   from: "tranx_sales_invoice_create",
                      //   to: "tranx_sales_invoice_list",
                      //   isNewTab: false,
                      // });
                      eventBus.dispatch(
                        "page_change",
                        "tranx_sales_invoice_list"
                      );
                      // this.handleHide();
                    }}
                  >
                    No
                  </Button>
                </>
              )}
              {isNaN(is_button_show) !== false && is_button_show == true && (
                <Button
                  className="sub-button"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleHide();
                  }}
                >
                  Ok
                </Button>
              )}
            </Modal.Body>
          </Modal>

          {/* Payment Mode Modal start*/}
          <Modal
            show={paymentModeModal}
            // size={
            //   window.matchMedia("(min-width:992px) and (max-width:1024px)")
            //     .matches
            //     ? "xl"
            //     : "lg"
            // }
            size="xl"
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Payment Mode
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ paymentModeModal: false });
                }}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              innerRef={this.myRef}
              initialValues={invoice_data}
              // validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                if (values.mode == "adjust") {
                  let { selectedSupplier } = values;

                  //   this.FetchPendingBills(
                  //     selectedSupplier.id,
                  //     selectedSupplier.type,
                  //     selectedSupplier.balancingMethod
                  //   );
                  // } else {

                  MyNotifications.fire(
                    {
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to Submit",
                      is_button_show: false,
                      is_timeout: false,
                      delay: 0,
                      handleSuccessFn: () => {
                        this.setState(
                          {
                            invoice_data: values,
                            opendiv: false,
                          },
                          () => {
                            let {
                              selectedSupplier,
                            } = this.myRef.current.values;
                            if (selectedSupplier) {
                              this.handleFetchData(selectedSupplier.id);
                            }
                          }
                        );
                      },
                      handleFailFn: () => {},
                    },
                    () => {
                      console.warn("return_data");
                    }
                  );
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                resetForm,
              }) => (
                <Form className="" onSubmit={handleSubmit} autoComplete="off">
                  <Modal.Body className="tnx-pur-inv-mdl-body">
                    <Row>
                      <Col lg={8} style={{ borderRight: "1px dashed" }}>
                        <Row className="mt-2">
                          <Table hover size="sm" className="tbl-font mt-2">
                            <thead>
                              <tr>
                                {/* <th
                                  style={{ width: "5%" }}
                                  className="counter-s-checkbox pl-0"
                                > */}
                                {/* {selectedSDids != "" ? ( */}
                                {/* <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="ml-1 mb-1"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      // checked={isAllChecked === true ? true : false}
                                      // onChange={(e) => {
                                      //   this.handleCounterSalesBillsSelectionAll(
                                      //     e.target.checked
                                      //   );
                                      // }}
                                      label="Select"
                                    />
                                  </Form.Group> */}
                                {/* ) : (
                                    "Select"
                                  )} */}
                                {/* </th> */}
                                <th>Ledger Name</th>
                                <th>Amount</th>
                                <th>Closing Balance</th>
                              </tr>
                            </thead>
                            <tbody
                              style={{ borderTop: "2px solid transparent" }}
                            >
                              {cashAcbankLst.map((v, i) => {
                                return (
                                  <tr>
                                    {/* <td style={{ width: "5%" }}>
                                      <Form.Group
                                        controlId="formBasicCheckbox1"
                                        className="ml-1 pmt-allbtn"
                                      >
                                        <Form.Check
                                          type="checkbox"
                                          checked={modeCheck.includes(v.id)}
                                          onClick={(e) => {
                                            this.handlePaymentModeChange(
                                              v.id,
                                              e.target.checked,
                                              i
                                            );
                                          }}
                                        />
                                      </Form.Group>
                                    </td> */}
                                    <td>{v.label}</td>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        className="tnx-pur-inv-text-box"
                                        placeholder="amount"
                                        id={`amount-${i}`}
                                        name={`amount-${i}`}
                                        onChange={(e) => {
                                          this.handleAmountValue(
                                            "amount",
                                            e.target.value,
                                            i,
                                            values.totalamt
                                          );
                                        }}
                                        value={cashAcbankLst[i]["amount"]}
                                      />
                                    </td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            {/* <tfoot>
                              <tr
                                style={{
                                  color: "blue",
                                }}
                              >
                                <th colspan={2} className="th-total-color">
                                  <b>TOTAL</b>
                                </th>
                                <th className="th-total-color"></th>
                                <th className="th-total-color">
                                  <b>
                                    {cashAcbankLst.reduce(
                                      (prev, next) =>
                                        prev + parseFloat(next.amount),
                                      0
                                    )}
                                  </b>
                                </th>
                              </tr>
                            </tfoot> */}
                          </Table>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <div className="mdl">
                          <h1 className="subTitle p-2">Total amount</h1>
                        </div>
                        <Row>
                          <Col lg={4}>
                            <p className="common_text">Total Paid</p>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderTop: "1px dashed #dcdcdc" }}
                          ></Col>
                          <Col lg={4}>
                            <p className="common_text text-end">
                              {cashAcbankLst.reduce(
                                (prev, next) => prev + parseFloat(next.amount),
                                0
                              )}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} className="rP">
                            <p className="common_text">Pending Amount</p>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderTop: "1px dashed #dcdcdc" }}
                          ></Col>
                          <Col lg={4}>
                            <p className="common_text text-end">
                              {pendingAmount}/-
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} className="rP">
                            <p className="red_text">Return amount</p>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderTop: "1px dashed #dcdcdc" }}
                          ></Col>
                          <Col lg={4}>
                            <p className="common_text text-end">
                              {returnAmount}/-
                            </p>
                          </Col>
                        </Row>
                        <div style={{ borderBottom: "1px dashed" }}></div>
                        <Row className="mt-2">
                          <Col lg={6}>
                            <p>Net Total</p>
                          </Col>
                          <Col lg={6} className="text-end">
                            <p>{values.totalamt}</p>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col className="text-end">
                            <Button
                              type="submit"
                              className="successbtn-style"
                              style={{ padding: "inherit" }}
                            >
                              Submit
                            </Button>{" "}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>
          {/* Payment Mode Modal end*/}

          {/* show print */}
          <Modal
            show={showPrint}
            size="md"
            // className={`${icon}-alert`}
            onHide={() => {
              this.setState({ show: false });
            }}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <CloseButton
                variant="black"
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              />
            </Modal.Header>
            <Modal.Body className="text-center">
              {this.handleImage()}
              {/* <p className="title">{title}</p>
              <p className="msg">{msg}</p> */}
              {this.state.icon === "confirm" && (
                <>
                  <Button
                    className="sub-button"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getInvoiceBillsLst(is_button_show);

                      // this.handleHide();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className="sub-button btn-danger"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      // eventBus.dispatch("page_change", {
                      //   from: "tranx_sales_invoice_create",
                      //   to: "tranx_sales_invoice_list",
                      //   isNewTab: false,
                      // });
                      eventBus.dispatch(
                        "page_change",
                        "tranx_sales_invoice_list"
                      );
                      // this.handleHide();
                    }}
                  >
                    No
                  </Button>
                </>
              )}
              {isNaN(is_button_show) !== false && is_button_show == true && (
                <Button
                  className="sub-button"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleHide();
                  }}
                >
                  Ok
                </Button>
              )}
            </Modal.Body>
          </Modal>
          {/* <MdlBatchNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            newBatchModal={newBatchModal}
            rows={rows}
            rowIndex={rowIndex}
            batchInitVal={batchInitVal}
            b_details_id={b_details_id}
            isBatch={isBatch}
            batchData={batchData}
            is_expired={is_expired}
            tr_id={tr_id}
            batch_data_selected={batch_data_selected}
            selectedSupplier={
              this.myRef.current
                ? this.myRef.current.values.selectedSupplier
                : ""
            }
            transactionType={transactionType}
          /> */}
          {/* Serial No Modal Starts */}
          <MdlSerialNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            selectSerialModal={selectSerialModal}
            rows={rows}
            rowIndex={rowIndex}
            serialNoLst={serialNoLst}
          />
          {/* Serial No Modal Ends */}

          {/* Ledger Modal Starts */}
          <MdlLedger
            ref={this.customModalRef} //@neha @on click outside modal will close
            tranxRef={this.myRef}
            openInvoiceBillLst={this.openInvoiceBillLst.bind(this)}
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerModal={ledgerModal}
            currentLedgerData={currentLedgerData}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            invoice_data={invoice_data}
            ledgerInputData={ledgerInputData}
            isTextBox={isTextBox}
            searchInputId="supplierNameId"
            setledgerInputDataFun={this.setledgerInputData.bind(this)}
            transactionType={transactionType}
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
            isLedgerSelectSet={isLedgerSelectSet}
            transactionTableStyle={transactionTableStyle}
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
            sourceUnder={sourceUnder}
            from_source={from_source}
            ledgerId={ledgerId}
            setLedgerId={setLedgerId}
            rows={rows}
            opType={opType} // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
          />

          {/* IndirectExp Ledger Modal Starts */}
          <MdlLedgerIndirectExp
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
              this
            )}
            ledgerModalIndExp={ledgerModalIndExp}
            ledgerModalIndExp1={ledgerModalIndExp1}
            ledgerModalIndExp2={ledgerModalIndExp2}
            ledgerModalIndExp3={ledgerModalIndExp3}
            ledgerDataIndExp={ledgerDataIndExp}
            selectedLedgerIndExp={selectedLedgerIndExp}
            userControl={this.props.userControl}
            rows={rows}
            invoice_data={this.myRef.current ? this.myRef.current.values : ""}
            from_source={from_source}
            additionalCharges={additionalCharges}
            setAdditionalCharges={this.setAdditionalCharges.bind(this)}
            handleAdditionalCharges={this.handleAdditionalCharges.bind(this)}
            handleAdditionalChargesHide={this.handleAdditionalChargesHide.bind(
              this
            )}
            handleAddAdditionalCharges={this.handleAddAdditionalCharges.bind(
              this
            )}
            handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(
              this
            )}
            opType={opType} // @vinit @used for previous tab focus
            additionalChargesId={additionalChargesId}
            setAdditionalChargesId={setAdditionalChargesId}
          />
          {/* IndirectExp Ledger Modal Ends */}

          <MdlProduct
            productModalStateChange={this.productModalStateChange.bind(this)}
            get_supplierlist_by_productidFun={this.get_supplierlist_by_productidFun.bind(
              this
            )}
            getProductPackageLst={this.getProductPackageLst.bind(this)}
            rows={rows}
            rowIndex={rowIndex}
            selectProductModal={selectProductModal}
            selectedProduct={selectedProduct}
            productData={productData}
            userControl={this.props.userControl}
            transactionType={transactionType}
          />
          {/* BillLst Modal Starts */}
          <MdlBillLst
            productModalStateChange={this.productModalStateChange.bind(this)}
            invoiceBillModal={invoiceBillModal}
            invoiceBillLst={invoiceBillLst}
            selectedBillNo={selectedBillNo}
            orginvoiceBillLst={orginvoiceBillLst}
            rows={rows}
            rowIndex={rowIndex}
            lstProductRows={lstProductRows}
            selectedProductsFromRow={selectedProductsFromRow}
            selectedSupplier={
              this.myRef.current
                ? this.myRef.current.values.selectedSupplier
                : ""
            }
            getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails.bind(
              this
            )}
          />
          {/* BillLst Modal Ends */}

          {/* Row Product Select Modal Starts */}
          {/* <MdlRowProductSelect
            productModalStateChange={this.productModalStateChange.bind(this)}
            onSubmitRowProductSelect={this.onSubmitRowProductSelect.bind(this)}
            rowProductModal={rowProductModal}
            selectedBillNo={selectedBillNo}
            orgLstProductRows={orgLstProductRows}
            lstProductRows={lstProductRows}
            // selectedProduct={selectedProduct}
            selectedProductsFromRow={selectedProductsFromRow}
          /> */}
          {/* Row Product Select Modal Ends */}

          {/* Bill adjusment modal start */}
          <Modal
            show={billadjusmentmodalshow}
            size="xl"
            className="voucher-mdl-account-entry"
            onHide={() => this.setState({ billadjusmentmodalshow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header
              closeButton
              // closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 mdl"
            >
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Bill By Bill
              </Modal.Title>
              {/* <CloseButton
              variant="white"
              className="pull-right"
              //  onClick={this.handleClose}
              onClick={() => this.billadjusmentmodalshow(false)}
            /> */}
            </Modal.Header>
            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                innerRef={this.billbybillRef}
                enableReinitialize={true}
                initialValues={invoice_data}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  //console.log({ values });
                  //console.log("billbybilldata--", { values });
                  this.setState({
                    paidAmount: values.paid_amt,
                    totalDebitAmt: 0,
                  });

                  MyNotifications.fire(
                    {
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to Submit",
                      is_button_show: false,
                      is_timeout: false,
                      delay: 0,
                      handleSuccessFn: () => {
                        let { selectedSupplier } = values;
                        if (selectedSupplier) {
                          this.callCreateInvoice();
                          this.setState({ billadjusmentmodalshow: false });
                          // this.handleFetchData(selectedSupplier.id);
                        }
                      },
                      handleFailFn: () => {},
                    },
                    () => {
                      console.warn("return_data");
                    }
                  );
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    noValidate
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Row>
                      <Col md="5" className="m-2">
                        <p className="mb-0 billhead">
                          <b>Invoice List : </b>
                        </p>
                      </Col>
                      <Col md="7" className="outstanding_title"></Col>
                    </Row>

                    {billLst.length > 0 && (
                      <div className="tnx-pur-inv-ModalStyle ">
                        <Table hover>
                          <thead>
                            <tr>
                              <th className="">
                                Invoice No
                                {/* <Form.Group
                                  controlId="formBasicCheckbox"
                                  className="ml-1 mb-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    label="Invoice #."
                                    checked={
                                      isAllChecked === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAll(
                                        e.target.checked
                                      );
                                    }}
                                    style={{
                                      verticalAlign: "middle !important",
                                    }}
                                    autoFocus={true}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        // this.FocusTrRowFieldsID(
                                        //   `invoice_no_id-0`
                                        // );
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  />
                                </Form.Group> */}
                              </th>
                              <th> Invoice Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>
                          {/* {JSON.stringify(billLst)} */}
                          <tbody>
                            {billLst.map((vi, ii) => {
                              if (vi.source == "sales_invoice") {
                                // JSON.stringify("")
                                return (
                                  <tr>
                                    {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                    <td className="pt-1 pr-1 pl-1 pb-0 ps-2">
                                      <Form.Group>
                                        <Form.Check
                                          id={`invoice_no_id-${ii}`}
                                          type="checkbox"
                                          label={vi.invoice_no}
                                          value={vi.invoice_unique_id}
                                          checked={selectedBills.includes(
                                            vi.invoice_unique_id
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselection(
                                              vi.invoice_unique_id,
                                              ii,
                                              e.target.checked
                                            );
                                          }}
                                          style={{
                                            verticalAlign: "middle !important",
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode === 13) {
                                              // this.FocusTrRowFieldsID(
                                              //   `paid_ids-${ii}`
                                              // );
                                              this.focusNextElement(e);
                                            }
                                          }}
                                        />
                                      </Form.Group>
                                      {/* {vi.invoice_no} */}
                                    </td>
                                    <td>
                                      {moment(vi.invoice_dt).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td className="p-1">
                                      {parseFloat(vi.amount).toFixed(2)} Cr{" "}
                                    </td>
                                    <td>
                                      {/* {vi.paid_amt} */}
                                      <Form.Control
                                        id={`paid_ids-${ii}`}
                                        type="text"
                                        onChange={(e) => {
                                          e.preventDefault();
                                          //console.log("value", e.target.value);
                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            ii
                                          );
                                        }}
                                        value={vi.paid_amt ? vi.paid_amt : 0}
                                        className="tnx-pur-inv-text-box"
                                        // readOnly={
                                        //   !selectedBills.includes(vi.invoice_no)
                                        // }
                                        style={{ background: "white" }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 13) {
                                            console.log(
                                              "iiiii",
                                              billLst.length,
                                              ii
                                            );
                                            //   if ((billLst.length - 1) == ii) {
                                            //     this.FocusTrRowFieldsID(
                                            //       "submitbillid"
                                            //     );

                                            //   } else {
                                            //     this.FocusTrRowFieldsID(
                                            //       `invoice_no_id-${ii + 1}`
                                            //     );
                                            //   }
                                            this.focusNextElement(e);
                                          }
                                        }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(vi.remaining_amt).toFixed(2)
                                        ? vi.remaining_amt
                                        : 0}
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                        </Table>
                        <Table className="mb-2">
                          <tfoot className="bb-total">
                            <tr style={{ background: "#cee7f1" }}>
                              <td className="bb-t">
                                {" "}
                                <b>Total</b>
                              </td>
                              {/* <td></td>
                            <td></td> */}

                              {/* <td colSpan={2}></td> */}

                              <th style={{ width: "22%" }}>
                                {this.finalBillInvoiceAmt()}
                              </th>
                              <th style={{ width: "23%" }}>
                                {" "}
                                {billLst.length > 0 &&
                                  billLst.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.remaining_amt
                                            ? next.remaining_amt
                                            : 0
                                        )
                                    ).toFixed(2);
                                  }, 0)}
                              </th>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    )}

                    {/* <Table className="mb-2">
                    <tfoot className="bb-total">
                      <tr>
                        <td colSpan={2} className="bb-t">
                          {" "}
                          <b>Grand Total</b>
                        </td>

                        <th style={{ width: "22%" }}>{this.finalBillAmt()}</th>
                        <th style={{ width: "21%" }}>
                          {this.finalRemainingBillAmt}
                        </th>
                      </tr>
                    </tfoot>
                  </Table> */}
                    <Row className="py-1">
                      <Col className="text-end me-2">
                        <Button
                          className="create-btn "
                          type="submit"
                          id="submitbillid"
                          onKeyDown={(e) => {
                            if (
                              e.keyCode === 13 &&
                              this.billbybillRef.current
                            ) {
                              this.billbybillRef.current.handleSubmit();
                            }
                          }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
          {/* Bill adjusment modal end */}
        </div>
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

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxCreditNoteProductList);
