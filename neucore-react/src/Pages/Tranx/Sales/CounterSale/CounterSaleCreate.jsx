import React from "react";
// import ReactDOM from "react-dom";//@mrunal On Escape key press and On outside Modal click Modal will Close
import ReactDOM from "react-dom";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import mousetrap, { bind } from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import Frame from "@/assets/images/Frame.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";
import rightCheckMark from "@/assets/images/checkmark_icon.png";
import delete_icon from "@/assets/images/delete_icon.svg";
import add_icon from "@/assets/images/add_icon.svg";
import print from "@/assets/images/print.png";
import {
  getSundryDebtors,
  //getLastSalesInvoiceNo,
  getLastCounterSalesNo,
  getSalesAccounts,
  getProduct,
  createCounterSales,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  listTranxCreditNotes,
  getInvoiceBill,
  getcounterCustomer,
  getProductFlavourList,
  get_Product_batch,
  checkInvoiceDateIsBetweenFY,
  transaction_product_list,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  delete_Product_list,
  getSalesInvoiceSupplierListByProductId,
  transaction_ledger_list,
  createBatchDetails,
  get_counter_sales_data,
  get_cs_invoice_product_fpu_by_id,
  editBatchDetails,
  updateCounterSales,
  delete_counter_sales,
} from "@/services/api_functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CMPTranxRow from "../../Components/CMPTranxRow";
import {
  MyTextDatePicker,
  getSelectValue,
  ShowNotification,
  calculatePrValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  CheckIsRegisterdCompany,
  purchaseSelect,
  fnTranxCalculationForCS,
  getValue,
  isActionExist,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  numericRegExp,
  unitDD,
  flavourDD,
  allEqual,
  INRformat,
  isUserControlExist,
  OnlyEnterAmount,
  OnlyEnterNumbers,
} from "@/helpers";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";

import { setUserControl } from "@/redux/userControl/Action";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

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
const data = [
  { no: "1", name: "Shreenivaas Narayan Nandal" },
  { no: "2", name: "Shrikant Gopal Ande" },
  { no: "3", name: "Ashwin Rajaram Shendre" },
  { no: "4", name: "Rohan Nandakumar Gurav" },
  { no: "5", name: "Dinesh Janardan Shripuram" },
  { no: "6", name: "LalitKumar Yeladi" },
  { no: "7", name: "Harish Gali" },
  { no: "8", name: "Rahul Sadanand Pola" },
  { no: "9", name: "Vaibhav Kamble" },
  { no: "10", name: "Akshay Salunke" },
];
class CounterSaleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.paymentRef = React.createRef();
    this.counterRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.modalRef = React.createRef(); //mrunal @Ref is created & used at MDLLedger Component Below
    this.formRef = React.createRef();
    this.paymentModalRef = React.createRef();
    this.radioRef = React.createRef();
    this.state = {
      selectedLedgerIndex: 0,
      paymentMdl: false,
      batchModal: false,
      code: "",
      cust_data: data,
      batch: "",
      isEditDataSet: false,
      show: false,
      showPrint: false,
      opendiv: false,
      hidediv: true,
      salesAccLst: [],
      lstBrand: [],
      supplierNameLst: [],
      selectedBillsdebit: [],
      billLst: [],
      adjusmentbillmodal: false,
      isAllChecked: false,
      modeCheck: [],
      modeStatus: false,
      supplierCodeLst: [],
      invoiceedit: false,
      productLst: [],
      orgProductLst: [],
      unitLst: [],
      rows: [],
      isopen: false,
      isBatchOpen: false,
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      Clietdetailmodal: false,
      serialNoLst: [],
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
      editIndex: 0,
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      is_button_show: false,
      supplierData: "",
      paymetmodel: false,
      copt: "",
      saleVal: "",
      batchDataList: [],
      saleRateType: "sale",
      ismodify: false,
      modifyIndex: -1,
      modifyObj: [],
      isRowModify: false,
      paymentMode: "",
      from_source: "tranx_sales_countersale_create",
      custSerialNo: 1,
      editId: "",
      saveFlag: false,
      lstBrand: [],
      invoice_data: {
        sales_sr_no: "",
        bill_no: "",
        clientName: "",
        clientMobile: "",
        creditnoteNo: "",
        newReference: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesAccId: "",
        clientCodeId: "",
        clientNameId: "",
        gstId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        paymentReference: "",
        narration: "",
        tcs: 0,
        sales_discount: 0,
        sales_discount_amt: 0,
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

      initVal: {
        sales_sr_no: 1,

        //bill_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        bill_dt: new Date(),
        clientCodeId: "",
        clientNameId: "",
      },
      lstFlavours: [],
      flavour_index: 0,
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      selectedCounterSalesBills: [],
      selectedSDids: "",
      soBills: [],

      rowDelDetailsIds: [],
      productData: "",
      selectSerialModal: false,
      selectProductModal: false,
      levelOpt: [],
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      product_supplier_lst: [],
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      add_button_flag: false,
      batch_data_selected: "",
      batchHideShow: true,
      costingInitVal: "",
      costingMdl: false,
      transactionTableStyle: "counter_sale",
      errorArrayBorder: "",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      ismodify: false,
      modifyIndex: -1,
      modifyObj: "",
      opType: "create",
    };
  }

  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      // setTimeout(() => {
      //   document.getElementById("TSCSCProductId-" + id).focus();
      // }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  getProductBatchList = (
    rowIndex = -1,
    source = "batch",
    isBatchEditOrCreate = false
  ) => {
    const { rows, invoice_data, lstBrand } = this.state;
    console.log("rows--", rows[rowIndex]["productId"]);

    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let level_b_id = rows[rowIndex]["levelbId"]["value"];
    let level_c_id = rows[rowIndex]["levelcId"]["value"];
    let unit_id = rows[rowIndex]["unitId"]["value"];

    let isfound = false;
    let productData = getSelectValue(lstBrand, product_id);
    let batchOpt = [];

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

    if (isfound == false || isBatchEditOrCreate == true) {
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
      reqData.append("invoice_date", moment(new Date()).format("YYYY-MM-DD"));

      invoice_data["costing"] = "";

      invoice_data["costingWithTax"] = "";
      let res = [];
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          console.log("get_Product_batch =>", response);
          if (response.responseStatus == 200) {
            res = response.data;
            console.log("res--", res);
            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            res = res.map((v) => {
              v["expiry_date"] =
                v["expiry_date"] && v["expiry_date"] != ""
                  ? moment(v["expiry_date"], "YYYY-MM-DD").format("DD/MM/YYYY")
                  : "";
              v["manufacturing_date"] =
                v["manufacturing_date"] && v["manufacturing_date"] != ""
                  ? moment(v["manufacturing_date"], "YYYY-MM-DD").format(
                    "DD/MM/YYYY"
                  )
                  : "";
              return v;
            });
            this.setState(
              {
                invoice_data: invoice_data,
                batchData: res,
                batchDataList: res,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
              }
            );
            //console.log("res->batchData  : ", res);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      if (batchOpt.length > 0) {
        batchOpt = batchOpt.map((v) => {
          v["expiry_date"] =
            v["expiry_date"] && v["expiry_date"] != ""
              ? moment(v["expiry_date"], "YYYY-MM-DD").format("DD/MM/YYYY")
              : "";
          v["manufacturing_date"] =
            v["manufacturing_date"] && v["manufacturing_date"] != ""
              ? moment(v["manufacturing_date"], "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )
              : "";
          return v;
        });
      }
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue(rowIndex, source);
        }
      );
    }
  };

  getInitBatchValue = (rowIndex = -1, source) => {
    let { rows } = this.state;
    let initVal = "";
    console.log("b_no: ", rowIndex, rows);
    if (rowIndex != -1) {
      initVal = {
        b_no: rows[rowIndex]["b_no"],
        b_rate: rows[rowIndex]["b_rate"],
        sales_rate: rows[rowIndex]["sales_rate"],
        rate_a: rows[rowIndex]["rate_a"],
        rate_b: rows[rowIndex]["rate_b"],
        rate_c: rows[rowIndex]["rate_c"],
        min_margin: rows[rowIndex]["min_margin"],
        margin_per: rows[rowIndex]["margin_per"],
        b_purchase_rate: rows[rowIndex]["b_purchase_rate"],
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
      };
    } else {
      initVal = {
        b_no: 0,
        b_rate: 0,
        sales_rate: 0,
        costing: 0,
        cost_with_tax: 0,
        rate_a: 0,
        min_margin: 0,
        manufacturing_date: "",
        b_purchase_rate: 0,
        b_expiry: "",
        b_details_id: 0,
        dummy_date: new Date(),
      };
    }
    console.log("initVal ", initVal);
    let IsBatch = rows[rowIndex]["is_batch"];
    console.log(" IsBatch ", IsBatch);

    if (IsBatch == true && source == "batch") {
      this.setState({
        rowIndex: rowIndex,
        batchInitVal: initVal,
        // newBatchModal: true,
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
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;
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

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
    });
  };
  handleTranxCalculation = () => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    console.log("handleTranxCalculation Row => ", rows);
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
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;

      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      takeDiscountAmountInLumpsum = true;
      isFirstDiscountPerCalculate = false;
    }

    let resTranxFn = fnTranxCalculationForCS({
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
    console.warn("resTranxFn >>>>>>>>>>>>>>>>", resTranxFn);
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

    let roundoffamt = Math.round(total_final_amt);
    let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);

    // this.myRef.current.setFieldValue(
    //   "total_base_amt",
    //   isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_purchase_discount_amt",
    //   isNaN(parseFloat(total_purchase_discount_amt))
    //     ? 0
    //     : parseFloat(total_purchase_discount_amt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_row_gross_amt1",
    //   parseFloat(total_row_gross_amt1)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_row_gross_amt",
    //   parseFloat(total_row_gross_amt)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_taxable_amt",
    //   parseFloat(total_taxable_amt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_tax_amt",
    //   parseFloat(total_tax_amt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "roundoff",
    //   parseFloat(roffamt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "totalamt",
    //   parseFloat(roundoffamt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "bill_amount",
    //   parseFloat(Math.round(bill_amount)).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_invoice_dis_amt",
    //   parseFloat(total_invoice_dis_amt).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_qty",
    //   parseFloat(total_qty).toFixed(2)
    // );
    // this.myRef.current.setFieldValue(
    //   "total_free_qty",
    //   parseFloat(total_free_qty).toFixed(2)
    // );

    // let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      rows: gst_row,
      // taxcal: taxState,
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
    let { rows } = this.state;
    if (value == "" && ele == "qty") {
      value = 0;
    }
    console.log("ele->", rows, ele, parseFloat(value));

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        is_button_show: true,
      });
      rows[rowIndex][ele] = 0;
    } else {
      rows[rowIndex][ele] = value;
    }

    if (ele == "rate") {
      if (
        parseFloat(rows[rowIndex]["b_rate"]) != 0 &&
        parseFloat(value) > parseFloat(rows[rowIndex]["b_rate"])
      ) {
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Purchase rate should be less than MRP",
          is_button_show: true,
        });
        rows[rowIndex][ele] = 0;
      } else {
        rows[rowIndex][ele] = value;
      }
    }

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      } else {
        //console.log("UNITID");
        this.handleRowStateChange(rows, false, rowIndex);
      }
    } else if (
      ele == "qty" &&
      isUserControlExist("is_network_system", this.props.userControl) === true
    ) {
      this.updateProductStockFun(rowIndex, rows);
    } else {
      this.handleRowStateChange(rows, false, rowIndex);
    }
  };

  setLastCounterSalesNo = () => {
    // ;
    let reqData = new FormData();
    reqData.append("sale_type", "counter_sale");
    console.log("Counter Number:", reqData);
    getLastCounterSalesNo()
      .then((response) => {
        let res = response.data;
        console.log("res-lastsalesno----->", res);
        if (res.responseStatus === 200) {
          let { invoice_data, initVal } = this.state;
          invoice_data["clientName"] = "Counter Customer";
          invoice_data["sales_sr_no"] = res.count;
          invoice_data["bill_no"] = res.serialNo;
          this.setState({ initVal: res, invoice_data: invoice_data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  counterCustomer = () => {
    getcounterCustomer()
      .then((response) => {
        let cres = response.data;
        console.log("cres------->", cres);
        if (cres.responseStatus == 200) {
          let nm = cres.data.name;
          console.log("nm------->", nm);
          let { invoice_data } = this.state;
          invoice_data["clientName"] = nm;
          this.setState({ copt: cres.data, invoice_data: invoice_data });
          // console.log("copt------->",copt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    console.log({ invoice_data });
    if (status === true) {
      let reqData = new FormData();
      let sun_id = invoice_data.clientNameId && invoice_data.clientNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          console.log("res", response);
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

  lstProduct = () => {
    getProduct()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let opt = data.map((v) => {
            return {
              label: v.productName,
              value: v.id,
              isBatchNo: v.isBatchNo,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => { });
  };

  /**
   * @description Initialize Product Row
   */

  /**
   * @description Initialize Additional Charges
   */
  initAdditionalCharges = () => {
    // additionalCharges
    let lst = [];
    for (let index = 0; index < 5; index++) {
      let data = {
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
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
      console.log("All BillLst Selection", billLst);
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

      console.log("fBills", fBills);
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
            console.log("rahul:: lstSalesAccounts", { v }, v[0]);
            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);

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
              console.log("invoice_data", init_d);
            }
            //this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
              name: v.ledger_name,
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

            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => { });
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
            orgProductLst: res.list,
          });
        }
      })
      .catch((error) => { });
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
      .catch((error) => { });
  };

  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();
    requestData.append("batchNo", batchNo);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
          });
        }
      })
      .catch((error) => { });
  };

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    getSalesInvoiceSupplierListByProductId(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        // console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          let idc = res.data;

          // onlyfive = idc.filter((e) => {
          //   return null;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
            console.log("lessthan equal to five", onlyfive);
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
            console.log("greater than five", onlyfive);
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
  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });
    if (obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TSCSCAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TSCSCAddBtn-" + id).focus();
        }, 200);
      }
    }
  };

  handlePropsData = (prop_data) => {
    if (prop_data.invoice_data) {
      this.setState({
        invoice_data: prop_data.invoice_data,
        rows: prop_data.rows,
        additionalCharges: prop_data.additionalCharges,
      });
    } else {
    }
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_countersale_create",
      to: "tranx_sales_countersale_list",
    });
  };

  openSerialNo = (rowIndex) => {
    // console.log("rowIndex", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // console.log("serialNoLst", serialNoLst);

    if (serialNoLst.length == 0) {
      serialNoLst = Array(6).fill("");
    }
    this.setState({
      selectSerialModal: true,
      rowIndex: rowIndex,
      serialNoLst: serialNoLst,
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

  componentDidMount() {
    // console.log("props", this.props);
    if (AuthenticationCheck()) {
      // @mrunal @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside);
      this.setLastCounterSalesNo();
      this.transaction_product_listFun();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      // this.transaction_ledger_listFun();
      // this.counterCustomer();
      this.initRow();
      this.lstSalesAccounts();
      // this.initAdditionalCharges();
      const { prop_data } = this.props.block;
      console.log("userpermission-->", this.props.userPermissions);
      console.log("prop_data ", { prop_data });
      this.handlePropsData(prop_data);
      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      this.getUserControlLevelFromRedux();

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);

      this.getProductFlavorpackageUnitbyids();
      // alt key button disabled end
    }
  }
  // @mrunal @ On Escape/clickoutside key press Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ isopen: false });
      this.setState({ isBatchOpen: false });
    }
  };
  // @mrunal @ On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.modalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ isopen: false });
      this.setState({ isBatchOpen: false });
    }
  };
  getProductFlavorpackageUnitbyids = (invoice_id) => {
    // let reqData = new FormData();
    // reqData.append("id", invoice_id);
    get_cs_invoice_product_fpu_by_id()
      .then((res) => res.data)
      .then((response) => {
        console.warn("rahul::response", response);
        if (response.responseStatus == 200) {
          let Opt = response.productIds.map((v) => {
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

          console.warn("rahul::Opt ==->>> ", Opt);
          this.setState({ lstBrand: Opt }, () => { });
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstPackages: [] }, () => { });
      });
  };

  setSalesInvoiceEditData = (value = "") => {
    // console.log("is sales Edit");
    // console.log("Id in setSalesEdidt", this.state.salesEditData.id);
    let formData = new FormData();
    if (value != "") {
      formData.append("payment_mode", value);
    }

    get_counter_sales_data(formData)
      .then((response) => {
        let res = response.data;
        console.log("Sale Invoice Edit data", res);
        if (res.responseStatus === 200) {
          let { row } = res;
          console.log("Sale Invoice ", res.data);

          const { productLst, lstBrand } = this.state;
          console.log({ productLst, lstBrand });

          let initInvoiceData = {
            // id: invoice_data.id,
            // sales_sr_no: initVal.count,
            // bill_no: initVal.serialNo,
            // bill_dt:
            //   invoice_data.invoice_dt != ""
            //     ? moment(new Date(d)).format("DD/MM/YYYY")
            //     : "",
            // gstNo: invoice_data.gstNo,
            // transaction_dt:
            //   invoice_data.invoice_dt != ""
            //     ? moment(new Date(d)).format("DD/MM/YYYY")
            //     : "",
            // salesAccId: getSelectValue(
            //   salesAccLst,
            //   invoice_data.sales_account_ledger_id
            // ),
            // EditsupplierId: 39,
            // supplierCodeId: "",
            // supplierNameId: "",
            paymentReference: res.paymentMode,
            // salesmanId:
            //   invoice_data.salesmanId != ""
            //     ? getSelectValue(salesmanLst, parseInt(invoice_data.salesmanId))
            //     : "",

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
            // roundoff: invoice_data.roundoff != "" ? invoice_data.roundoff : 0,

            // transport_name:
            //   invoice_data.transport_name != null
            //     ? invoice_data.transport_name
            //     : "",
            // reference:
            //   invoice_data.reference != null ? invoice_data.reference : "",

            // sales_discount: discountInPer,
            // sales_discount_amt: discountInAmt,
            // additionalChgLedger1: additionLedger1,
            // additionalChgLedger2: additionLedger2,
            // additionalChgLedger3: additionLedger3,
            // additionalChgLedgerAmt1: additionLedgerAmt1,
            // additionalChgLedgerAmt2: additionLedgerAmt2,
            // additionalChgLedgerAmt3: additionLedgerAmt3,

            // additionalChgLedgerName1: res.additionLedgerAmt1
            //   ? getSelectValue(lstAdditionalLedger, res.additionLedger1)[
            //   "label"
            //   ]
            //   : "",
            // additionalChgLedgerName2: res.additionLedgerAmt2
            //   ? getSelectValue(lstAdditionalLedger, res.additionLedger2)[
            //   "label"
            //   ]
            //   : "",
            // additionalChgLedgerName3: res.additionLedgerAmt3
            //   ? getSelectValue(lstAdditionalLedger, res.additionLedger3)[
            //   "label"
            //   ]
            //   : "",
          };

          let initRowData = [];
          if (row.length > 0) {
            initRowData = row.map((v, i) => {
              console.log("rahul::v", v);
              let productOpt = getSelectValue(lstBrand, parseInt(v.productId));
              console.log("productOpt", productOpt);

              let unit_id = {
                gst: v.gst != "" ? v.gst : 0,
                igst: v.igst != "" ? v.igst : 0,
                cgst: v.cgst != "" ? v.cgst : 0,
                sgst: v.sgst != "" ? v.sgst : 0,
              };

              v["prod_id"] = productOpt ? productOpt : "";
              v["productName"] = v.productName ? v.productName : "";
              v["productId"] = v.productId ? v.productId : "";
              v["details_id"] =
                v.details_id && v.details_id != "" ? v.details_id : 0;
              v["counterNo"] = v.counterNo != "" ? v.counterNo : "";
              v["mobileNo"] = v.mobile_number != "" ? v.mobile_number : "";

              if (v.levelaId == "") {
                v.levelaId = getSelectValue(productOpt.levelAOpt, "");
              } else if (v.levelaId) {
                v.levelaId = getSelectValue(
                  productOpt.levelAOpt,
                  v.levelaId !== "" ? parseInt(v.levelaId) : ""
                );
              }

              if (v.levelbId == "") {
                v.levelbId = getSelectValue(v.levelaId.levelBOpt, "");
              } else if (v.levelbId) {
                v.levelbId = getSelectValue(
                  v.levelaId.levelBOpt,
                  v.levelbId !== "" ? parseInt(v.levelbId) : ""
                );
              }

              if (v.levelcId == "") {
                v.levelcId = getSelectValue(v.levelbId.levelCOpt, "");
              } else if (v.levelcId) {
                v.levelcId = getSelectValue(
                  v.levelbId.levelCOpt,
                  v.levelcId !== "" ? parseInt(v.levelcId) : ""
                );
              }

              console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              v["unit_id"] = unit_id;
              v["qty"] = v.qty != "" ? v.qty : "";
              v["id"] = v.counterId != "" ? v.counterId : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["packing"] = v.pack_name != "" ? v.pack_name : "";
              v["base_amt"] = v.base_amt && v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["dis_amt"] = v.dis_amt;
              v["dis_per"] = v.dis_per;
              v["dis_per_cal"] = 0;
              v["dis_amt_cal"] = 0;
              v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
              v["total_base_amt"] = 0;
              v["gst"] = 0;
              v["igst"] = 0;
              v["cgst"] = 0;
              v["sgst"] = 0;
              v["total_igst"] = 0;
              v["total_cgst"] = 0;
              v["total_sgst"] = 0;
              v["final_amt"] =
                v.final_amt && v.final_amt != "" ? v.final_amt : 0;
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
              v["gross_amt"] = 0;
              v["add_chg_amt"] = 0;
              v["gross_amt1"] = 0;
              v["invoice_dis_amt"] = 0;
              v["net_amt"] = v.final_amt && v.final_amt != "" ? v.final_amt : 0;
              v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

              v["final_discount_amt"] = 0;
              v["discount_proportional_cal"] = 0;
              v["additional_charges_proportional_cal"] = 0;
              v["b_no"] = v.batch_no != "" ? v.batch_no : "";
              v["b_rate"] = v.b_rate != "" ? v.b_rate : 0;
              v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : 0;
              v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : 0;
              v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : 0;
              v["max_discount"] = v.max_discount != "" ? v.max_discount : 0;
              v["min_discount"] = v.min_discount != "" ? v.min_discount : 0;
              v["min_margin"] = v.min_margin != "" ? v.min_margin : 0;
              v["manufacturing_date"] =
                v.manufacturing_date != ""
                  ? moment(v.manufacturing_date, "YYYY-MM-DD").format(
                    "DD/MM/YYYY"
                  )
                  : "";
              v["b_purchase_rate"] =
                v.purchase_rate != "" ? v.purchase_rate : 0;
              v["b_expiry"] =
                v.b_expiry != ""
                  ? moment(v.b_expiry, "YYYY-MM-DD").format("DD/MM/YYYY")
                  : "";
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

              return v;
            });
          }

          console.log("initRowData---===>", initRowData);

          // initInvoiceData["narration"] = res.narrations;
          // console.log("initinvoiceData", initInvoiceData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              //  paymentReference: res.paymentMode,
              rows: initRowData,
              isEditDataSet: true,
              custSerialNo:
                parseInt(initRowData[initRowData.length - 1]["counterNo"]) + 1,
            },
            () => {
              console.log("after state row =-> ", this.state.rows);
              this.handleAddRow();
              setTimeout(() => {
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => { });
  };

  componentDidUpdate() {
    let { isEditDataSet } = this.state;
    if (isEditDataSet == false) {
      this.setSalesInvoiceEditData();
    }
  }

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    console.log("getUserControlLevelFromRedux : ", level);
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
  // @mrunal @ On Escape key press and On outside Modal click Modal will Close
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside);
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
  }

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

  handleChangeArrayElement = (element, value, index, setFieldValue) => {
    console.log({ element, value, index });
    let { rows } = this.state;

    // checkelement[element] = value;
    /**
     * @description Calculate product level calculation
     */
    let frows = rows.map((v, i) => {
      if (i == index) {
        v[element] = value;
        index = i;

        if (element == "productId" && value != null && value != undefined) {
          if (CheckIsRegisterdCompany() == true) {
            v["igst"] = value.igst;
            v["gst"] = value.igst;
            v["cgst"] = value.cgst;
            v["sgst"] = value.sgst;
          } else {
            v["igst"] = 0;
            v["gst"] = 0;
            v["cgst"] = 0;
            v["sgst"] = 0;
          }
          if (value.isSerialNumber == true) {
            let serialnoarray = [];
            for (let index = 0; index < 100; index++) {
              serialnoarray.push({ no: "" });
            }
            v["serialNo"] = serialnoarray;
            this.setState({
              serialnopopupwindow: true,
              serialnoshowindex: i,
              serialnoarray: serialnoarray,
            });
          }

          v["productDetails"] = v["productDetails"].map((vi) => {
            if (CheckIsRegisterdCompany() == true) {
              vi["igst"] = value.igst;
              vi["gst"] = value.igst;
              vi["cgst"] = value.cgst;
              vi["sgst"] = value.sgst;
            } else {
              vi["igst"] = 0;
              vi["gst"] = 0;
              vi["cgst"] = 0;
              vi["sgst"] = 0;
            }
            return vi;
          });
        }

        return v;
      } else {
        return v;
      }
    });
    console.log("frows==----->>>>>>>", frows);
    this.setState({ rows: frows }, () => {
      if (
        element === "productId" &&
        value !== "" &&
        value !== undefined &&
        value !== null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          console.log("in  if statement of getProductPackageLst ");
          this.getProductPackageLst(value.value);
        });
      }
      this.handleAdditionalChargesSubmit();
    });
  };

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
    console.log("serial no", rows);
    console.log({ element, index });
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
    console.log("Confirm Action", confirmAction);
    this.setState({ showPrint: true });

    // <p className="title">{title}</p>
    // <p className="msg">{msg}</p>
    // {
    //   icon == "confirm" && (
    //     <>
    //       <Button
    //         className="sub-button"
    //         type="submit"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           this.getInvoiceBillsLst(is_button_show);

    //           // this.handleHide();
    //         }}
    //       >
    //         Yes
    //       </Button>
    //       <Button
    //         className="sub-button btn-danger"
    //         type="submit"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           eventBus.dispatch("page_change", {
    //             from: "tranx_sales_countersale_create",
    //             to: "tranx_sales_invoice_list",
    //             isNewTab: false,
    //           });
    //           this.handleHide();
    //         }}
    //       >
    //         No
    //       </Button>

    //     </>
    //   );
    // }
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

  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        details_id: 0,
        counterNo: this.state.custSerialNo,
        mobileNo: "",
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
        paymentMode: "",

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
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      details_id: 0,
      counterNo: this.state.custSerialNo,
      mobileNo: "",
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
      paymentMode: "",

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
    console.warn({ new_row });
    rows = [...rows, new_row];
    this.handleMstState(rows);
  };

  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds } = this.state;

    console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!rowDelDetailsIds.includes(uv.details_id)) {
          rowDelDetailsIds.push(uv.details_id);
        }
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    console.warn("rahul::rows ", rows);
    this.handleClearProduct(rows);
  };

  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
    const { rows, additionalChargesTotal } = this.state;
    // console.log({ discamtval, type });

    if (discamtval == "") {
      discamtval = 0;
    }
    if (type != "" && discamtval >= 0) {
      if (type == "sales_discount") {
        this.myRef.current.setFieldValue(
          "sales_discount",
          discamtval != "" ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          "sales_discount_amt",
          discamtval != "" ? discamtval : 0
        );
      }
    }
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v["productId"] != "") {
        let baseamt = 0;
        let i_totalamt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }
          vi["total_amt"] = vi["base_amt"];
          vi["total_b_amt"] = vi["base_amt"];

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
            vi["total_amt"] =
              parseFloat(vi["total_amt"]) - parseFloat(vi["dis_amt"]);
            vi["total_b_amt"] =
              parseFloat(vi["total_b_amt"]) - parseFloat(vi["dis_amt"]);
            vi["dis_amt_cal"] = vi["dis_amt"];
          }
          if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
            let per_amt = calculatePercentage(vi["total_amt"], vi["dis_per"]);
            vi["dis_per_cal"] = per_amt;
            vi["total_b_amt"] = vi["total_b_amt"] - per_amt;

            vi["total_amt"] = vi["total_amt"] - per_amt;
          }
          i_totalamt = parseFloat(i_totalamt) + parseFloat(vi["total_amt"]);

          return vi;
        });
        v["base_amt"] = baseamt;
        v["total_amt"] = i_totalamt;
        totalamt = parseFloat(totalamt) + i_totalamt;
      }
      return v;
    });

    // console.log("row_disc", { row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *purchase Discount ledger selected
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "purchase_discount") {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.sales_discount_amt > 0 &&
              this.myRef.current.values.sales_discount_amt != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(
                    totalamt,
                    parseFloat(this.myRef.current.values.sales_discount_amt),
                    vi["total_amt"]
                  );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          } else {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.purchase_discount > 0 &&
              this.myRef.current.values.purchase_discount != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                let peramt = calculatePercentage(
                  totalamt,
                  parseFloat(this.myRef.current.values.purchase_discount),
                  vi["total_amt"]
                );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  peramt,
                  vi["total_amt"]
                );
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(totalamt, peramt, vi["total_amt"]);

                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          }
        } else {
          if (
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(this.myRef.current.values.purchase_discount),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
          if (
            this.myRef.current.values.sales_discount_amt > 0 &&
            this.myRef.current.values.sales_discount_amt != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(this.myRef.current.values.sales_discount_amt),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", { ntotalamt });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      let add_total_amt = 0;
      let add_prop_cal = 0;
      if (v["productId"] != "") {
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["total_amt"] = parseFloat(
            vi["total_amt"] +
            calculatePrValue(
              ntotalamt,
              additionalChargesTotal,
              vi["total_amt"]
            )
          ).toFixed(2);
          vi["additional_charges_proportional_cal"] = calculatePrValue(
            ntotalamt,
            additionalChargesTotal,
            vi["total_amt"]
          );
          add_total_amt =
            parseFloat(add_total_amt) + parseFloat(vi["total_amt"]);
          add_prop_cal =
            parseFloat(add_prop_cal) +
            parseFloat(vi["additional_charges_proportional_cal"]);
          return vi;
        });
        v["total_amt"] = parseFloat(add_total_amt).toFixed(2);
        v["additional_charges_proportional_cal"] =
          parseFloat(add_prop_cal).toFixed(2);
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;
    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_sales_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    /**
     * GST Calculation
     * **/

    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        let i_total_igst = 0;
        let i_total_cgst = 0;
        let i_total_sgst = 0;
        let i_final_amt = 0;
        let i_total_sales_discount_amt = 0;
        let i_total_discount_proportional_amt = 0;
        let i_total_additional_charges_proportional_amt = 0;
        let i_base_amt = 0;
        let i_total_amt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["igst"] = v["productId"]["igst"];
          vi["gst"] = v["productId"]["igst"];
          vi["cgst"] = v["productId"]["cgst"];
          vi["sgst"] = v["productId"]["sgst"];
          vi["total_igst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["igst"])
          ).toFixed(2);
          vi["total_cgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["cgst"])
          ).toFixed(2);
          vi["total_sgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["sgst"])
          ).toFixed(2);

          vi["final_amt"] = parseFloat(
            parseFloat(vi["total_amt"]) + parseFloat(vi["total_igst"])
          ).toFixed(2);
          // console.log("vi final_amt", vi["final_amt"]);
          i_total_amt = i_total_amt + parseFloat(vi["total_amt"]);
          i_total_igst =
            parseFloat(i_total_igst) + parseFloat(vi["total_igst"]);
          i_total_cgst =
            parseFloat(i_total_cgst) + parseFloat(vi["total_cgst"]);
          i_total_sgst =
            parseFloat(i_total_sgst) + parseFloat(vi["total_sgst"]);
          i_final_amt = parseFloat(i_final_amt) + parseFloat(vi["final_amt"]);
          i_total_sales_discount_amt =
            parseFloat(i_total_sales_discount_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_discount_proportional_amt =
            parseFloat(i_total_discount_proportional_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_additional_charges_proportional_amt =
            parseFloat(i_total_additional_charges_proportional_amt) +
            parseFloat(vi["additional_charges_proportional_cal"]);

          // let baseamt = parseFloat(vi["base_amt"]);
          // if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_amt_cal"]);
          // }
          // if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_per_cal"]);
          // }
          i_base_amt = i_base_amt + parseFloat(vi["total_b_amt"]);

          return vi;
        });
        // console.log("i_final_amt", i_final_amt);
        v["total_igst"] = parseFloat(i_total_igst).toFixed(2);
        v["total_cgst"] = parseFloat(i_total_cgst).toFixed(2);
        v["total_sgst"] = parseFloat(i_total_sgst).toFixed(2);
        v["total_b_amt"] = parseFloat(i_base_amt).toFixed(2);

        v["final_amt"] = parseFloat(i_final_amt).toFixed(2);
        famt = parseFloat(parseFloat(famt) + parseFloat(i_final_amt)).toFixed(
          2
        );

        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
          parseFloat(i_total_sales_discount_amt);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(i_total_discount_proportional_amt);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(i_total_additional_charges_proportional_amt);
        // additional_charges_proportional_cal
        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) + parseFloat(v["total_b_amt"])
        ).toFixed(2);

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(i_total_amt)
        ).toFixed(2);
        totaltaxamt = parseFloat(
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
        ).toFixed(2);
        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  d_gst: v.productId.igst,
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                d_gst: v.productId.igst,
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              // console.log("innerTax", innerTax);
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  d_gst: v.productId.igst,
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                d_gst: v.productId.igst,
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  d_gst: v.productId.igst,

                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                d_gst: v.productId.igst,

                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    // console.log("famt", famt);
    let roundoffamt = Math.round(famt);

    let roffamt = parseFloat(roundoffamt - famt).toFixed(2);

    this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
    this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
    this.myRef.current.setFieldValue("totalqtyL", totalqtyL);

    // this.myRef.current.setFieldValue("totalqty", totalqty);
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
    );
    // ``;
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue("roundoff", roffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    // this.myRef.current.setFieldValue(
    //   "total_b_amt",
    //   parseFloat(t_r_baseamt).toFixed(2)
    // );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    // this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        if (this.state.rows.length != 30) {
          this.initRow(30 - this.state.rows.length);
        }
        if (this.state.additionalCharges.length != 5) {
          this.initAdditionalCharges(5 - this.state.additionalCharges.length);
        }
      }
    );
  };

  handleRoundOffchange = (v) => {
    // console.log("roundoff", v);
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      // console.log("v", v.final_amt);
      if (v["productId"] != "") {
        // if (v['qtyH'] != '' && v['rateH'] != '') {
        //   v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        // }
        // if (v['qtyM'] != '' && v['rateM'] != '') {
        //   v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        // }
        // if (v['qtyL'] != '' && v['rateL'] != '') {
        //   v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        // }

        // v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
        let baseamt = 0;
        v["units"] = v.units.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          return vi;
        });

        v["base_amt"] = baseamt;

        v["total_amt"] = v["base_amt"];
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }
        totalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */

    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (
          this.myRef.current.values.sales_discount > 0 &&
          this.myRef.current.values.sales_discount != ""
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.sales_discount,
            v["total_amt"]
          );
          v["discount_proportional_cal"] = calculatePrValue(
            totalamt,
            peramt,
            v["total_amt"]
          );

          v["total_amt"] =
            v["total_amt"] - calculatePrValue(totalamt, peramt, v["total_amt"]);
        }
        if (
          this.myRef.current.values.sales_discount_amt > 0 &&
          this.myRef.current.values.sales_discount_amt != ""
        ) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            );
          v["discount_proportional_cal"] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            )
          ).toFixed(2);
        }

        ntotalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", ntotalamt);
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
          calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;

    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_sales_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totaligstamt =
          parseFloat(totaligstamt) + parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt =
          parseFloat(totalcgstamt) + parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt =
          parseFloat(totalsgstamt) + parseFloat(v["total_sgst"]).toFixed(2);
        // console.log("final_amt", v["final_amt"]);
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);
        // totalbaseamt =
        //   parseFloat(totalbaseamt) + parseFloat(v["base_amt"]).toFixed(2);

        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) +
          (parseFloat(v["base_amt"]) -
            parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
            parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0))
        ).toFixed(2);
        totaltaxableamt =
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"]).toFixed(2);
        totaltaxamt =
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"]).toFixed(2);
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue("roundoff", v);
    // let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    // this.myRef.current.setFieldValue("roundoff", roundoffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue("totalamt", parseFloat(famt).toFixed(2));
    // this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });

    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        if (this.state.rows.length != 30) {
          this.initRow(30 - this.state.rows.length);
        }
        if (this.state.additionalCharges.length != 5) {
          this.initAdditionalCharges(5 - this.state.additionalCharges.length);
        }
      }
    );
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
    }
  };
  handleBillPayableAmtChange = (value, index) => {
    console.log({ value, index });
    const { billLst } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);

      // console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };

  handleFetchData = (sundry_debtors_id) => {
    // ;
    const { billLst } = this.state;
    let reqData = new FormData();

    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;
        console.log({ res });
        // ;
        let data = res.list;
        if (data.length == 0) {
          console.log("Else.....>", data);
          this.callCreateInvoice();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjusmentbillmodal: true });
            }
          });
        }
      })
      .catch((error) => { });
  };

  callCreateInvoice = () => {
    console.log("callCreateInvoice CreateInvoice");
    //;
    const { invoice_data, rows, initVal, paymentMode, saveFlag, custSerialNo } =
      this.state;
    let invoiceValues = this.myRef.current.values;
    // let paymentvalues = this.paymentRef.current.values;

    console.log("before API Call==-->>>", {
      initVal,
      invoice_data,
      invoiceValues,
    });
    console.log("rows", rows);

    let requestData = new FormData();
    // !Invoice Data
    {
      // requestData.append("sales_sr_no", invoiceValues.sales_sr_no);
      requestData.append("bill_dt", moment(new Date()).format("YYYY-MM-DD"));
      // requestData.append("paymentMode", paymentvalues.paymentReference);
      // console.log("paymentvalues", paymentvalues);

      // requestData.append("bill_no", invoiceValues.bill_no);

      // requestData.append("customer_name", invoiceValues.clientName);
      // requestData.append("mobile_number", invoiceValues.clientMobile);
      // // !Invoice Data
      // requestData.append("roundoff", invoiceValues.roundoff);
      // requestData.append("narration", invoiceValues.narration);
      // requestData.append("total_base_amt", invoiceValues.total_base_amt);
      // requestData.append("totalamt", invoiceValues.totalamt);

      let frow = [];
      rows.map((v, i) => {
        console.log(":v", v);
        if (v.productId != "" && (v.details_id == "" || v.details_id == 0)) {
          let newObj = {
            details_id: v.details_id ? v.details_id : 0,
            counterNo: v.counterNo ? v.counterNo : "",
            mobile_number: v.mobileNo ? v.mobileNo : "",
            productId: v.productId ? v.productId : "",
            levelaId: v.levelaId ? v.levelaId.value : "",
            levelbId: v.levelbId ? v.levelbId.value : "",
            levelcId: v.levelcId ? v.levelcId.value : "",
            unitId: v.unitId ? v.unitId.value : "",
            qty: v.qty ? v.qty : "",
            free_qty: v.free_qty != "" ? v.free_qty : 0,
            unit_conv: v.unitId ? v.unitId.unitConversion : "",
            rate: v.rate,
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
            b_expiry: v.b_expiry
              ? moment(v.b_expiry, "DD/MM/YYYY").format("yyyy-MM-DD")
              : "",
            sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
            rate_a: v.rate_a,
            rate_b: v.rate_b,
            rate_c: v.rate_c,
            min_margin: v.min_margin,
            margin_per: v.margin_per,
            manufacturing_date: v.manufacturing_date
              ? moment(v.manufacturing_date, "DD/MM/YYYY").format("yyyy-MM-DD")
              : "",
            isBatchNo: v.b_no,
            paymentMode: paymentMode != "" ? paymentMode : "",
            reference_type: v.reference_type,
            reference_id: v.reference_id != "" ? v.reference_id : 0,
          };
          // console.log("newObj >>>> ", newObj);
          frow.push(newObj);
          // console.log("frow ----------- ", frow);
        }
      });

      var filtered = frow.filter(function (el) {
        return el != null;
      });
      requestData.append("row", JSON.stringify(filtered));
      requestData.append("paymentMode", paymentMode);
      // requestData.append("print_type", "create");

      // if (
      //   invoiceValues.total_qty &&
      //   invoiceValues.total_qty !== "" &&
      //   invoiceValues.total_qty !== null
      // ) {
      //   requestData.append(
      //     "totalqty",
      //     invoiceValues.total_qty !== "" ? parseInt(invoiceValues.total_qty) : 0
      //   );
      // }
      // if (invoiceValues.total_free_qty && invoiceValues.total_free_qty !== "") {
      //   requestData.append(
      //     "total_free_qty",
      //     invoiceValues.total_free_qty !== "" ? invoiceValues.total_free_qty : 0
      //   );
      // }
      // if (invoiceValues.total_free_qty && invoiceValues.total_free_qty !== "") {
      //   requestData.append("total_base_amt", invoiceValues.total_base_amt);
      // }

      // if (invoiceValues.total_free_qty && invoiceValues.total_free_qty !== "") {
      //   requestData.append(
      //     "total_invoice_dis_amt",
      //     invoiceValues.total_invoice_dis_amt
      //   );
      // }
      // // !Discount

      // // !Taxable Amount
      // requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
      // // !Bill Amount
      // requestData.append("bill_amount", invoiceValues.bill_amount);
      console.log("requestData", requestData);
      for (let [name, value] of requestData) {
        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
      }

      createCounterSales(requestData)
        .then((response) => {
          console.log("in create");
          let res = response.data;
          if (res.responseStatus === 200) {
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
                  this.setState({ paymentMdl: false });
                  console.log("this.state.saveFlag", this.state.saveFlag);
                  if (this.state.saveFlag == true) {
                    this.setState(
                      { custSerialNo: custSerialNo + 1, saveFlag: false },
                      () => {
                        console.log("custSerialNo", custSerialNo, saveFlag);
                        this.handleAddRow();
                      }
                    );
                  }
                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_countersale_create"
                  );
                  this.setSalesInvoiceEditData();

                  // this.getInvoiceBillsLstPrint(initVal.serialNo);
                },
                handleFailFn: () => {
                  this.setState({ paymentMdl: false });

                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_countersale_create"
                  );
                  this.setSalesInvoiceEditData();
                },
              },
              () => {
                console.warn("return_data");
              }
            );

            // this.getInvoiceBillsLst(invoice_data.sales_sr_no);
          } else {
            MyNotifications.fire({
              show: true,
              icon: "confirm",
              title: "Confirm",
              msg: res.message,
              // is_button_show: true,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  updateCreateInvoice = () => {
    console.log("callCreateInvoice CreateInvoice");
    //;
    const {
      invoice_data,
      rows,
      initVal,
      paymentMode,
      saveFlag,
      custSerialNo,
      editIndex,
      editId,
    } = this.state;
    let invoiceValues = this.myRef.current.values;
    // let paymentvalues = this.paymentRef.current.values;

    console.log("before API Call==-->>>", {
      initVal,
      invoice_data,
      invoiceValues,
    });
    console.log("rows-----llll", rows, editId);

    let requestData = new FormData();
    // !Invoice Data
    {
      requestData.append("id", editId);
      requestData.append("bill_dt", moment(new Date()).format("YYYY-MM-DD"));
      // requestData.append("paymentMode", paymentvalues.paymentReference);
      // console.log("paymentvalues", paymentvalues);

      // requestData.append("bill_no", invoiceValues.bill_no);

      // requestData.append("customer_name", invoiceValues.clientName);
      // requestData.append("mobile_number", invoiceValues.clientMobile);
      // // !Invoice Data
      // requestData.append("roundoff", invoiceValues.roundoff);
      // requestData.append("narration", invoiceValues.narration);
      // requestData.append("total_base_amt", invoiceValues.total_base_amt);
      // requestData.append("totalamt", invoiceValues.totalamt);

      let frow = [];
      rows.map((v, i) => {
        console.log(":v", v);
        if (
          v.productId != "" &&
          (v.details_id != "" || v.details_id != 0) &&
          custSerialNo == v["counterNo"]
        ) {
          let newObj = {
            details_id: v.details_id ? v.details_id : 0,
            counterNo: v.counterNo ? v.counterNo : "",
            mobile_number: v.mobileNo ? v.mobileNo : "",
            productId: v.productId ? v.productId : "",
            levelaId: v.levelaId ? v.levelaId.value : "",
            levelbId: v.levelbId ? v.levelbId.value : "",
            levelcId: v.levelcId ? v.levelcId.value : "",
            unitId: v.unitId ? v.unitId.value : "",
            qty: v.qty ? v.qty : "",
            free_qty: v.free_qty != "" ? v.free_qty : 0,
            unit_conv: v.unitId ? v.unitId.unitConversion : "",
            rate: v.rate,
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
            b_expiry: v.b_expiry
              ? moment(v.b_expiry, "DD/MM/YYYY").format("yyyy-MM-DD")
              : "",
            sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
            rate_a: v.rate_a,
            rate_b: v.rate_b,
            rate_c: v.rate_c,
            min_margin: v.min_margin,
            margin_per: v.margin_per,
            manufacturing_date: v.manufacturing_date
              ? moment(v.manufacturing_date, "DD/MM/YYYY").format("yyyy-MM-DD")
              : "",
            isBatchNo: v.b_no,
            paymentMode: paymentMode != "" ? paymentMode : "",
            reference_type: v.reference_type,
            reference_id: v.reference_id != "" ? v.reference_id : 0,
          };
          // console.log("newObj >>>> ", newObj);
          frow.push(newObj);
          // console.log("frow ----------- ", frow);
        }
      });

      var filtered = frow.filter(function (el) {
        return el != null;
      });
      requestData.append("row", JSON.stringify(filtered));
      requestData.append("paymentMode", paymentMode);
      // requestData.append("print_type", "create");

      // if (invoiceValues.total_qty !== "") {
      //   requestData.append(
      //     "totalqty",
      //     invoiceValues.total_qty !== "" ? parseInt(invoiceValues.total_qty) : 0
      //   );
      // }
      // if (invoiceValues.total_free_qty !== "") {
      //   requestData.append(
      //     "total_free_qty",
      //     invoiceValues.total_free_qty !== "" ? invoiceValues.total_free_qty : 0
      //   );
      // }
      // requestData.append("total_base_amt", invoiceValues.total_base_amt);
      // // !Discount
      // requestData.append(
      //   "total_invoice_dis_amt",
      //   invoiceValues.total_invoice_dis_amt
      // );
      // // !Taxable Amount
      // requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
      // // !Bill Amount
      // requestData.append("bill_amount", invoiceValues.bill_amount);
      console.log("requestData", requestData);
      for (let [name, value] of requestData) {
        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
      }

      updateCounterSales(requestData)
        .then((response) => {
          console.log("in create");
          let res = response.data;
          if (res.responseStatus === 200) {
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
                  this.setState({ paymentMdl: false, isRowModify: false });
                  console.log("this.state.saveFlag", this.state.saveFlag);
                  if (this.state.saveFlag == true) {
                    this.setState(
                      { custSerialNo: custSerialNo + 1, saveFlag: false },
                      () => {
                        console.log("custSerialNo", custSerialNo, saveFlag);
                        this.handleAddRow();
                      }
                    );
                  }
                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_countersale_create"
                  );
                  this.setSalesInvoiceEditData();

                  // this.getInvoiceBillsLstPrint(initVal.serialNo);
                },
                handleFailFn: () => {
                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_countersale_create"
                  );
                  this.setSalesInvoiceEditData();
                },
              },
              () => {
                console.warn("return_data");
              }
            );

            // this.getInvoiceBillsLst(invoice_data.sales_sr_no);
          } else {
            MyNotifications.fire({
              show: true,
              icon: "confirm",
              title: "Confirm",
              msg: res.message,
              // is_button_show: true,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
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
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    reqData.append("source", "counter_sales");
    getInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        this.setState({ paymetmodel: false });
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.invoice_details.product_details,
        });

        eventBus.dispatch("page_change", {
          // from: "tranx_sales_countersale_create",
          to: "tranx_sales_countersale_create",
          isNewTab: false,
        });
      }
    });
  };
  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    this.setState({ rows: rowValue }, () => {
      this.setState({ rowIndex: rowIndex }, () => {
        this.getProductBatchList(rowIndex);
      });
      // }
      this.handleTranxCalculation();
    });
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
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
              .length >= 1
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
          console.log("error", error);
          this.setState({ lstBrand: [] });
          // //console.log("error", error);
        });
    }
  };
  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };

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
  // filterData(value) {
  //   let filterData = data.filter(
  //     (v) => v.no.includes(value) || v.name.toLowerCase().includes(value)
  //   );
  //   console.warn("filterData->>>>>>>", filterData);
  //   this.setState({ code: value, cust_data: filterData, code_name: "" });
  // }
  filterBatchData(value) {
    let filterBatchData = data.filter(
      (v) => v.no.includes(value) || v.name.toLowerCase().includes(value)
    );
    console.warn("filterBatchData->>>>>>>", filterBatchData);
    this.setState({ batch: value, cust_data: filterBatchData, code_name: "" });
  }
  toggleBatchModal = () => {
    this.setState((prevState) => ({
      batchModal: !prevState.batchModal,
    }));
  };

  filterData(value) {
    let { productLst, orgProductLst } = this.state;
    console.log("productLst--", productLst);
    console.log("orgProductLst--", orgProductLst);
    let filterData = orgProductLst.filter(
      (v) =>
        v.product_name.toLowerCase().includes(value) ||
        (v.code != null && v.code.toLowerCase().includes(value)) ||
        (v.packing != null && v.packing.includes(value))
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      productLst: filterData.length > 0 ? filterData : [],
      code_name: "",
      isopen: true,
    });
  }
  filterBatchData(value) {
    let filterBatchData = data.filter((v) => v.no.includes(value));
    console.warn("filterBatchData->>>>>>>", filterBatchData);
    this.setState({ batch: value, cust_data: filterBatchData, code_name: "" });
  }

  batchSearchFun = (barcode) => {
    console.log("barcode", barcode);
    console.log("batchDataList search", this.state.batchData);
    let filterData = this.state.batchData.filter((v) =>
      v.batch_no.includes(barcode.trim())
    );
    this.setState({
      batchDataList: filterData.length > 0 ? filterData : [],
      batch: barcode,
      isBatchOpen: true,
    });
  };

  handleCounterSalesBillsSelectionAll = (status) => {
    let {
      salesInvoiceLst,
      selectedSDids,
      InvoiceinitVal,

      ChallaninitVal,
    } = this.state;

    let lstSelected = [];
    let selectedSundryId = "";
    if (status == true) {
      salesInvoiceLst.map((v) => {
        if (
          v.sundry_debtors_id == selectedSDids &&
          v.sales_order_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectedSundryId = selectedSDids;
    } else {
      InvoiceinitVal["clientNameId"] = "";

      ChallaninitVal["clientNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        soBills: lstSelected,
        selectedSDids: selectedSundryId,

        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.soBills.length == 0) {
          this.setState({ selectedSDids: "" });
        }
      }
    );
  };
  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName);
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }
  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }
  handlePaymentModeChange = (id, status, index) => {
    let { modeList, modeCheck, modeStatus, rows } = this.state;
    console.log("e--->", id, status, modeCheck, modeList, rows);
    let f_modeCheck = modeCheck;
    let f_modeList = rows;
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
    console.log("f_modeCheck", f_modeCheck, f_modeList);
    this.setState({
      modeStatus: status,
      modeCheck: f_modeCheck,
      rows: f_modeList,
    });
  };

  handleBillsSelectionAll = (status) => {
    let { modeList, rows, modeCheck } = this.state;
    console.log("Status==>>>", status);
    console.log("modeList---", rows);
    let fBills = rows;
    let lstSelected = [];
    if (status == true) {
      lstSelected = rows.map((v) => v.id);

      console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      modeCheck: lstSelected,
      rows: fBills,
    });
  };
  handleModifyEnable = (i, v) => {
    // debugger;
    console.log("modify value", i, v);
    this.setState({ ismodify: true, modifyIndex: i, modifyObj: { ...v } });
  };

  handleModifyElement = (ele, val) => {
    let { modifyObj } = this.state;
    modifyObj[ele] = val;
    this.setState({ modifyObj: modifyObj });
  };

  clearModifyData = () => {
    this.setState({ ismodify: false, modifyIndex: -1, modifyObj: "" });
  };

  updateBatchData = () => {
    let { modifyObj } = this.state;
    console.log("modifyObj____", modifyObj);
    if (modifyObj.batch_no == "") {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Insert Batch No. ",
        is_timeout: false,
        is_button_show: true,
        // is_timeout: true,
        // delay: 1000,
      });
      document.getElementById("modify_batch_no").focus();
      return 0;
    } else if (modifyObj.mrp == "") {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Insert MRP. ",
        is_timeout: false,
        is_button_show: true,
        // is_timeout: true,
        // delay: 1000,
      });
      document.getElementById("modify_mrp").focus();
      return 0;
    }
    let { rows, rowIndex, selectedSupplier, getProductBatchList } = this.props;
    let requestData = new FormData();

    let obj = rows[rowIndex];

    if (obj) {
      modifyObj["product_id"] = obj.selectedProduct.id;
      modifyObj["level_a_id"] = obj.levelaId?.value;
      modifyObj["level_b_id"] = obj.levelbId?.value;
      modifyObj["level_c_id"] = obj.levelcId?.value;
      modifyObj["unit_id"] = obj.unitId?.value;
    }

    modifyObj["manufacturing_date"] =
      modifyObj["manufacturing_date"] != ""
        ? moment(modifyObj["manufacturing_date"], "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        )
        : "";
    modifyObj["b_expiry"] =
      modifyObj["expiry_date"] != ""
        ? moment(modifyObj["expiry_date"], "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    modifyObj["mrp"] = modifyObj["mrp"] != "" ? modifyObj["mrp"] : 0;

    // console.log("after =->", modifyObj);
    requestData.append("product_id", modifyObj["product_id"]);
    requestData.append("level_a_id", modifyObj["level_a_id"]);
    requestData.append("level_b_id", modifyObj["level_b_id"]);
    requestData.append("level_c_id", modifyObj["level_c_id"]);
    requestData.append("unit_id", modifyObj["unit_id"]);
    requestData.append("manufacturing_date", modifyObj["manufacturing_date"]);
    requestData.append("b_expiry", modifyObj["b_expiry"]);
    requestData.append("mrp", modifyObj["mrp"]);
    requestData.append("supplier_id", selectedSupplier.id);
    requestData.append("b_no", modifyObj["batch_no"]);
    requestData.append("b_details_id", modifyObj["id"]);
    // requestData.append("")
    //! console.log("After values", JSON.stringify(values));
    // for (const pair of requestData.entries()) {
    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    // }
    editBatchDetails(requestData)
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

          this.setState(
            { modifyObj: "", modifyIndex: -1, ismodify: false },
            () => {
              getProductBatchList(rowIndex);
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
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleCounterSaleTableRow(event) {
    console.log("handleCounterSaleTableRow event", event);
    const t = event.target;
    let {
      rowIndex,
      ledgerList,
      selectedLedgerIndex,
      rows,
      productLst,
      saleRateType,
      transactionType,
    } = this.state;
    const k = event.keyCode;
    if (k == 13 || k == 9) {
      let cuurentProduct = t;
      let selectedProduct = JSON.parse(cuurentProduct.getAttribute("value"));
      if (selectedProduct) {
        //rows[rowIndex]["selectedProduct"] = selectedProduct;
        rows[rowIndex]["productName"] = selectedProduct.product_name;
        if (saleRateType == "sale") {
          rows[rowIndex]["rate"] = selectedProduct.sales_rate;
        } else {
          if (transactionType == "purchase_order") {
            rows[rowIndex]["rate"] = selectedProduct.purchaserate;
          }
          if (selectedProduct.is_batch == false) {
            rows[rowIndex]["rate"] = selectedProduct.purchaserate;
          }
        }
        rows[rowIndex]["productId"] = selectedProduct.id;
        rows[rowIndex]["is_level_a"] = getUserControlData(
          "is_level_a",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_level_b"] = getUserControlData(
          "is_level_b",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_level_c"] = getUserControlData(
          "is_level_c",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_batch"] = selectedProduct.is_batch;
        rows[rowIndex]["is_serial"] = selectedProduct.is_serial;

        let unit_id = {
          gst: selectedProduct.igst,
          igst: selectedProduct.igst,
          cgst: selectedProduct.cgst,
          sgst: selectedProduct.sgst,
        };

        rows[rowIndex]["unit_id"] = unit_id;
        rows[rowIndex]["packing"] = selectedProduct.packing;
        console.log("rows-->", rows);

        this.setState({
          rows: rows,
          selectProductModal: false,
          levelOpt: [],
        });
        this.getProductPackageLst(selectedProduct.id, rowIndex);
        this.transaction_product_listFun();
      }
      this.setState(
        {
          isopen: false,
          selectedLedgerIndex: 0,
        },
        () => {
          setTimeout(() => {
            document.getElementById("batchNo-" + rowIndex)?.focus();
          }, 1000);
        }
      );
    } else if (k == 40) {
      console.log("arrowdown", ledgerList, selectedLedgerIndex);
      if (selectedLedgerIndex < productLst.length - 1) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex + 1 }, () => {
          this.FocusTrRowFieldsID(
            `counter-sale-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 38) {
      console.log("arrowup");
      if (selectedLedgerIndex > 0) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex - 1 }, () => {
          this.FocusTrRowFieldsID(
            `counter-sale-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 8) {
      this.FocusTrRowFieldsID(
        `payment-perticulars-${this.state.selectedLedgerIndex}`
      );
    }
  }

  handleBatchTableRow(event) {
    const t = event.target;
    let { batch_no, currentSelectedBatchId } = this.state;
    let { productId } = this.state;

    const k = event.keyCode;
    let { saleRateType, transactionType, isBatch, productModalStateChange } =
      this.props;
    if (k === 40) {
      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));
        // console.log("___________down", val);
        this.transaction_batch_detailsFun(val);
      }
    } else if (k === 38) {
      const prev = t.previousElementSibling;
      if (prev) {
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // console.log("___________up", val);
        this.transaction_batch_detailsFun(val);
      }
    } else if (k === 13) {
      // debugger
      let cuurentBatch = t;
      let b_details_id = JSON.parse(cuurentBatch.getAttribute("value"));

      let { rows, rowIndex, is_expired, selectedSupplier } = this.state;
      console.log("batchData____________", b_details_id);

      // console.log(
      //   "Double Click b_details_id =->",
      //   selectedBatch.expiry_date
      // );
      let currentDate = new Date().toLocaleDateString("en-GB");
      // console.log("currentDate______", currentDate);

      let actuDate = b_details_id.expiry_date;
      // console.log("actuDate______", actuDate);
      // console.log(
      //   "currentDate < b_details_id.expiry_date",
      //   currentDate < selectedBatch.expiry_date
      // );

      // var loginDate = currentDate;

      // loginDate = new Date(
      //   loginDate.split("/")[2],
      //   loginDate.split("/")[1] - 1,
      //   loginDate.split("/")[0]
      // );
      // var mat_date = b_details_id.expiry_date;
      // mat_date = new Date(
      //   mat_date.split("/")[2],
      //   mat_date.split("/")[1] - 1,
      //   mat_date.split("/")[0]
      // );
      // var timeDiff =
      //   mat_date.getTime() - loginDate.getTime();
      // var NoOfDays = Math.ceil(
      //   timeDiff / (1000 * 3600 * 24)
      // );

      let loginDate = moment(currentDate, "DD-MM-YYYY").toDate();
      let mat_date = moment(b_details_id.expiry_date, "DD-MM-YYYY").toDate();
      let NoOfDays = (mat_date.getTime() - loginDate.getTime()) / 86400000;

      let isConfirm = "";
      if (NoOfDays < 0) {
        MyNotifications.fire({
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Batch expired allowed or not?",
          is_button_show: true,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            // if (b_details_id.batch_no !== "") {
            //   setTimeout(() => {
            //     this.qtyRef.current?.focus();
            //   }, 100);
            // }

            let batchError = false;

            if (b_details_id != 0) {
              batchError = false;
              // let salesrate = b_details_id.min_rate_a;

              // if (
              //   selectedSupplier &&
              //   parseInt(selectedSupplier.salesRate) == 2
              // ) {
              //   salesrate = b_details_id.min_rate_b;
              // } else if (
              //   selectedSupplier &&
              //   parseInt(selectedSupplier.salesRate) == 3
              // ) {
              //   salesrate = b_details_id.min_rate_c;
              // }
              // if (
              //   saleRateType == "sale" ||
              //   transactionType == "sales_invoice" ||
              //   transactionType == "sales_edit"
              // ) {
              //   rows[rowIndex]["rate"] = salesrate;
              //   rows[rowIndex]["sales_rate"] = salesrate;
              // } else {
              //   rows[rowIndex]["rate"] =
              //     b_details_id.purchase_rate;
              //   rows[rowIndex]["sales_rate"] = salesrate;
              // }

              rows[rowIndex]["rate"] = b_details_id.mrp;
              // rows[rowIndex]["rate"] =
              //   b_details_id.salesrate;

              rows[rowIndex]["b_details_id"] = b_details_id.id;
              rows[rowIndex]["b_no"] = b_details_id.batch_no;
              rows[rowIndex]["b_rate"] = b_details_id.mrp;

              rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
              rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
              rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
              rows[rowIndex]["margin_per"] = b_details_id.min_margin;
              rows[rowIndex]["b_purchase_rate"] = b_details_id.purchase_rate;
              // rows[rowIndex]["costing"] = values.costing;
              // rows[rowIndex]["costingWithTax"] =
              //   values.costingWithTax;

              rows[rowIndex]["b_expiry"] =
                b_details_id.expiry_date != "" ? b_details_id.expiry_date : "";

              rows[rowIndex]["manufacturing_date"] =
                b_details_id.manufacturing_date != ""
                  ? b_details_id.manufacturing_date
                  : "";

              rows[rowIndex]["is_batch"] = isBatch;
            }
            this.setState({
              batch_error: batchError,
              isBatchOpen: false,
              rowIndex: -1,
              b_details_id: 0,
              isBatch: isBatch,
              rows: rows,
            });
            this.setState({ isBatchOpen: false }, () => {
              setTimeout(() => {
                document.getElementById("qty-" + rowIndex).focus();
              }, 500);
            });
          },
          handleFailFn: () => {
            isConfirm = false;
          },
        });
      } else {
        // isConfirm = true;

        let batchError = false;

        if (b_details_id != 0) {
          batchError = false;
          let salesrate = b_details_id.min_rate_a;

          if (selectedSupplier && parseInt(selectedSupplier.salesRate) == 2) {
            salesrate = b_details_id.min_rate_b;
          } else if (
            selectedSupplier &&
            parseInt(selectedSupplier.salesRate) == 3
          ) {
            salesrate = b_details_id.min_rate_c;
          }
          if (
            saleRateType == "sale" ||
            transactionType == "sales_invoice" ||
            transactionType == "sales_edit"
          ) {
            rows[rowIndex]["rate"] = salesrate;
            rows[rowIndex]["sales_rate"] = salesrate;
          } else {
            rows[rowIndex]["rate"] = b_details_id.purchase_rate;
            rows[rowIndex]["sales_rate"] = salesrate;
          }

          rows[rowIndex]["b_details_id"] = b_details_id.id;
          rows[rowIndex]["b_no"] = b_details_id.batch_no;
          rows[rowIndex]["b_rate"] = b_details_id.mrp;

          rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
          rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
          rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
          rows[rowIndex]["margin_per"] = b_details_id.min_margin;
          rows[rowIndex]["b_purchase_rate"] = b_details_id.purchase_rate;
          // rows[rowIndex]["costing"] = values.costing;
          // rows[rowIndex]["costingWithTax"] =
          //   values.costingWithTax;

          rows[rowIndex]["b_expiry"] =
            b_details_id.expiry_date != "" ? b_details_id.expiry_date : "";

          rows[rowIndex]["manufacturing_date"] =
            b_details_id.manufacturing_date != ""
              ? b_details_id.manufacturing_date
              : "";

          rows[rowIndex]["is_batch"] = isBatch;
        }

        rows[rowIndex]["selectedBatch"] = b_details_id.id;
        rows[rowIndex]["b_details_id"] = b_details_id.id;
        rows[rowIndex]["b_no"] = b_details_id.batch_no;
        rows[rowIndex]["b_rate"] = b_details_id.mrp;
        rows[rowIndex]["closing_stock"] = b_details_id.closing_stock;
        rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
        rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
        rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
        rows[rowIndex]["margin_per"] = b_details_id.min_margin;
        rows[rowIndex]["b_purchase_rate"] = b_details_id.purchase_rate;
        // rows[rowIndex]["costing"] = values.costing;
        // rows[rowIndex]["costingWithTax"] =
        //   values.costingWithTax;

        rows[rowIndex]["b_expiry"] =
          b_details_id.expiry_date != "" ? b_details_id.expiry_date : "";

        rows[rowIndex]["manufacturing_date"] =
          b_details_id.manufacturing_date != ""
            ? b_details_id.manufacturing_date
            : "";

        rows[rowIndex]["is_batch"] = isBatch;
        this.setState({
          batch_error: batchError,
          isBatchOpen: false,
          rowIndex: -1,
          b_details_id: 0,
          isBatch: isBatch,
          rows: rows,
        });
        this.setState({ isBatchOpen: false }, () => {
          document.getElementById("qty-" + rowIndex).focus();
        });
      }
    } else if (k === 8) {
      document.getElementById(currentSelectedBatchId).focus();
    } else if (k === 37 || k === 39) {
    } else {
      // debugger;
      let searchInput = batch_no + event.key;
      this.setBatchInputData(searchInput, false, currentSelectedBatchId);
      // let test = e.target.value;

      let { batchLst, batchDataList } = this.state;
      if (searchInput != "") {
        let filterData = [];
        batchDataList != "" &&
          batchDataList.map((v) => {
            if (v.batch_no.includes(searchInput.trim())) {
              filterData.push(v);
            }
          });
        if (filterData != "" && filterData.length > 0) {
          this.setState(
            {
              batch_no: searchInput,
              batchDataList: filterData,
              isopen: true,
            },
            () => {
              document.getElementById("");
            }
          );
        }
      }
    }
  }
  //Function for batch multi cursor  //batchS
  setBatchInputData(propValue, flag, id) {
    this.setState(
      {
        isTextBoxBatch: flag,
        currentSelectedBatchId: id,
      },
      () => {
        // debugger;
        document.getElementById(id).value = propValue;
      }
    );
  }
  handleKeyDown = (e, index) => {
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    } else if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
      // const index = (38) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    } else if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
      // const index = (39) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
  };

  focusNextElement(e, nextIndex = null) {
    // debugger
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
          // this.setState({ enterKeyPress: index });
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

  deleteCountersales = (id) => {
    console.log("counter sale id", id);
    let formData = new FormData();
    formData.append("id", id);
    delete_counter_sales(formData)
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
          // resetForm();
          // this.initRow();

          this.setSalesInvoiceEditData();
          this.setState({ isRowModify: false });
        }
      })
      .catch((error) => {
        //  this.setState({ purchaseInvoiceLst: [] });
      });
  };

  render() {
    const {
      paymentMdl,
      transactionType,
      modifyIndex,
      rightCheckMark,
      wrongCheckMark,
      batch,
      adjusmentbillmodal,
      initVal,
      lstBrand,
      copt,
      saleVal,
      selectedBillsdebit,
      billLst,
      isAllCheckedCredit,
      opendiv,
      hidediv,
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
      transaction_mdl_show,
      transaction_detail_index,
      lstPackages,
      showPrint,
      is_button_show,
      paymetmodel,
      supplierData,
      customerData,
      invoiceData,
      invoiceDetails,
      batchModalShow,
      serialNoLst,
      batchInitVal,
      batchData,
      b_details_id,
      isBatch,
      is_expired,
      tr_id,
      batchHideShow,
      rowDelDetailsIds,
      batchModal,
      newBatchModal,
      selectProductModal,
      selectedProduct,
      productData,
      rowIndex,
      levelOpt,
      batchDetails,
      product_supplier_lst,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      add_button_flag,
      selectSerialModal,
      batch_data_selected,
      costingMdl,
      costingInitVal,
      transactionTableStyle,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      code,
      cust_data,
      code_name,
      batchDataList,
      isopen,
      isBatchOpen,
      saleRateType,
      ismodify,
      modifyObj,
      from_source,
      paymentMode,
      custSerialNo,
      saveFlag,
      isAllChecked,
      selectedCounterSalesBills,
      selectedSDids,
      soBills,
      modeCheck,
      opType,
      editIndex,
      isRowModify,
      editId,
      selectedLedgerIndex,
      productId,
    } = this.state;
    // console.log(rows);
    return (
      <>
        <div
          className="purchase-tranx counter_sale"
          style={{ overflow: "hidden" }}
        >
          {/* <h6>Purchase Invoice</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   clientMobile: Yup.string()
            //     .nullable()
            //     .trim()
            //     .matches(numericRegExp, "Enter valid mobile number")
            //     .required("Mobile number is required"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let errorArray = [];

              // if (values.clientName == "") {
              //   errorArray.push("y");
              // } else {
              //   errorArray.push("");
              // }
              // if (values.clientMobile == "") {
              //   errorArray.push("y");
              // } else {
              //   errorArray.push("");
              // }
              // validation end

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let productName = [];
                  let unitId = [];
                  let batchNo = [];
                  let qty = [];
                  let rate = [];
                  {
                    rows &&
                      rows.map((v, i) => {
                        if (v.productId) {
                          productName.push("");
                        } else {
                          productName.push("Y");
                        }

                        if (v.unitId) {
                          unitId.push("");
                        } else {
                          unitId.push("Y");
                        }

                        if (v.is_batch) {
                          if (v.b_no) {
                            batchNo.push("");
                          } else {
                            batchNo.push("Y");
                          }
                        } else {
                          batchNo.push("");
                        }

                        if (v.qty) {
                          qty.push("");
                        } else {
                          qty.push("Y");
                        }

                        if (v.rate) {
                          rate.push("");
                        } else {
                          rate.push("Y");
                        }
                      });
                  }

                  this.setState(
                    {
                      productNameData: productName,
                      unitIdData: unitId,
                      batchNoData: batchNo,
                      qtyData: qty,
                      rateData: rate,
                    },
                    () => {
                      if (
                        allEqual(productName) &&
                        allEqual(unitId) &&
                        allEqual(batchNo) &&
                        allEqual(qty) &&
                        allEqual(rate)
                      ) {
                        console.log("hhhh");
                        // MyNotifications.fire(
                        //   {
                        //     show: true,
                        //     icon: "confirm",
                        //     title: "Confirm",
                        //     msg: "Do you want to Submit",
                        //     is_button_show: false,
                        //     is_timeout: false,
                        //     delay: 0,
                        //     handleSuccessFn: () => {
                        //       console.log({ outstanding_sales_return_amt });

                        //       this.setState({ paymetmodel: true });
                        //     },
                        //     handleFailFn: () => { },
                        //   },
                        //   () => {
                        //     console.warn("return_data");
                        //   }
                        // );
                      }
                    }
                  );
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
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                className="frm-counter-sale"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  <div className="div-style">
                    <div>
                      <Row className="mx-0">
                        <Row>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto pe-2"
                              >
                                <Form.Label>
                                  Tranx Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  disabled
                                  className="counter-sale-date-style label_style"
                                  name="transaction_dt"
                                  id="transaction_dt"
                                  placeholderText="DD/MM/YYYY"
                                  value={values.transaction_dt}
                                  readOnly
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Tab" &&
                                      values.transaction_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    } else if (e.shiftKey && e.key === "Tab") {
                                      let datchco = e.target.value.trim();
                                      console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
                                      console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.invoiceDateRef.current.focus();
                                        }, 1000);
                                      }
                                    } else if (e.keyCode === 13) {
                                      let datchco = e.target.value.trim();
                                      console.log("datchco", datchco);
                                      // let checkdate = moment(e.target.value).format(
                                      //   "DD/MM/YYYY"
                                      // );
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.invoiceDateRef.current.focus();
                                        }, 1000);
                                      } else {
                                        this.FocusTrRowFieldsID(
                                          "contra-perticulars-0"
                                        );
                                      }
                                    } else if (e.keyCode === 9) {
                                      let datchco = e.target.value.trim();
                                      console.log("datchco", datchco);
                                      // let checkdate = moment(e.target.value).format(
                                      //   "DD/MM/YYYY"
                                      // );
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.invoiceDateRef.current.focus();
                                        }, 1000);
                                      } else {
                                        this.FocusTrRowFieldsID(
                                          "contra-perticulars-0"
                                        );
                                      }
                                    }
                                  }}
                                ></Form.Control>
                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          {authenticationService.currentUserValue.companyType ==
                            "retailer" ? (
                            <>
                              <Col lg={1}>
                                {modeCheck.length > 0 && (
                                  <Button
                                    className="btnstyle"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        to: "tranx_countersale_to_saleinvoice_gst",
                                        prop_data: { modeCheck },
                                      });

                                      // this.getLastPurchaseChallanSerialNo();
                                    }}
                                    aria-controls="example-collapse-text"
                                  >
                                    To Sale Invoice GST
                                  </Button>
                                )}
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col lg={1}>
                                {modeCheck.length > 0 && (
                                  <Button
                                    className="btnstyle"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        to: "tranx_countersale_to_saleinvoice",
                                        prop_data: { modeCheck },
                                      });

                                      // this.getLastPurchaseChallanSerialNo();
                                    }}
                                    aria-controls="example-collapse-text"
                                  >
                                    To Sale Invoice
                                  </Button>
                                )}
                              </Col>
                            </>
                          )}
                        </Row>
                      </Row>
                    </div>
                  </div>
                  <div className="counter_sale_tbl">
                    <Table className="">
                      <thead
                        style={{
                          border: "1px solid #A8ADB3",
                        }}
                      >
                        <tr>
                          <th style={{ width: "5%", textAlign: "center" }}>
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="stylecheckbox text-center"
                            >
                              <Form.Check
                                type="checkbox"
                                checked={isAllChecked === true ? true : false}
                                onChange={(e) => {
                                  this.handleBillsSelectionAll(
                                    e.target.checked
                                  );
                                }}
                              />
                            </Form.Group>
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "35px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            Sr.No.
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              // width: "135px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="qty py-1"
                          >
                            Mobile No.
                          </th>

                          <th
                            style={{
                              // width: "630px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="purticular-width"
                          >
                            Particulars
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              // width: "179px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="package_width"
                          >
                            Package
                          </th>
                          {ABC_flag_value == "A" ||
                            ABC_flag_value == "AB" ||
                            ABC_flag_value == "ABC" ? (
                            <th
                              style={{
                                textAlign: "center",
                                // width: "179px",
                                borderRight: "1px solid #A8ADB2",
                              }}
                              // className="qty_width"
                              className={`${ABC_flag_value == "A"
                                ? "level_A"
                                : ABC_flag_value == "AB"
                                  ? "level_AB "
                                  : ABC_flag_value == "ABC"
                                    ? "level_ABC "
                                    : "level_no"
                                }`}
                            >
                              {isUserControl(
                                "is_level_a",
                                this.props.userControl
                              )
                                ? levelA["label"]
                                : ""}
                            </th>
                          ) : (
                            ""
                          )}
                          {ABC_flag_value == "AB" || ABC_flag_value == "ABC" ? (
                            <th
                              style={{
                                textAlign: "center",
                                // width: "179px",
                                borderRight: "1px solid #A8ADB2",
                              }}
                              className={`${ABC_flag_value == "AB"
                                ? "level_AB"
                                : ABC_flag_value == "ABC"
                                  ? "level_ABC"
                                  : "level_no"
                                }`}
                            >
                              {isUserControl(
                                "is_level_b",
                                this.props.userControl
                              )
                                ? levelB["label"]
                                : ""}
                            </th>
                          ) : (
                            ""
                          )}
                          {ABC_flag_value == "ABC" ? (
                            <th
                              style={{
                                textAlign: "center",
                                // width: "179px",
                                borderRight: "1px solid #A8ADB2",
                              }}
                              className={`${ABC_flag_value == "ABC"
                                ? "level_ABC"
                                : "level_no"
                                }`}
                            >
                              {isUserControl(
                                "is_level_c",
                                this.props.userControl
                              )
                                ? levelC["label"]
                                : ""}
                            </th>
                          ) : (
                            ""
                          )}
                          <th
                            style={{
                              textAlign: "center",
                              // width: "117px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1 unit_width"
                          >
                            Unit
                          </th>

                          {batchHideShow === true ? (
                            <th
                              style={{
                                textAlign: "center",
                                // width: "200px",
                                borderRight: "1px solid #A8ADB2",
                              }}
                              className="batch_width"
                            >
                              Batch No/Serial No
                            </th>
                          ) : (
                            <></>
                          )}

                          <th
                            style={{
                              textAlign: "center",
                              // width: "115px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="qty"
                          >
                            Quantity
                          </th>

                          {isFreeQtyExist(
                            "is_free_qty",
                            this.props.userControl
                          ) && (
                              <th
                                style={{
                                  textAlign: "center",
                                  // width: "135px",
                                  borderRight: "1px solid #A8ADB2",
                                }}
                                className="free_width"
                              >
                                Free
                              </th>
                            )}
                          <th
                            style={{
                              textAlign: "center",
                              // width: "179px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="rate_width"
                          >
                            Rate
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              // width: "100px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1 disc_width"
                          >
                            Disc.
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              // width: "110px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="net_amt_width"
                          >
                            Net Amount
                          </th>
                          {/* <th
                            style={{
                              textAlign: "center",
                              // width: "110px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="net_amt_width"
                          >
                            Total Amount
                          </th> */}

                          <th
                            style={{
                              textAlign: "center",
                              // width: "110px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="rate_width"
                          >
                            Mode
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "30px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((rv, ri) => {
                          return rv["counterNo"] == this.state.custSerialNo ? (
                            <tr style={{ borderbottom: "1px solid #D9D9D9" }}>
                              {/* <td style={{ width: "2%" }}>
                                <Form.Group
                                  controlId="formBasicCheckbox1"
                                  className="ml-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    className="m-0"
                                    //disabled={v.sales_order_status == "closed"}
                                    style={{ verticalAlign: "middle" }}
                                    checked={
                                      isAllChecked === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAll(
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </td> */}
                              <td style={{ width: "5%", textAlign: "center" }}>
                                <Form.Group
                                  controlId="formBasicCheckbox"
                                // className="ml-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    checked={modeCheck.includes(
                                      parseInt(rv.id)
                                    )}
                                    //  id="countercheck"
                                    onClick={(e) => {
                                      this.handlePaymentModeChange(
                                        rv.id,
                                        e.target.checked,
                                        ri
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </td>
                              <td className="sr-no-style">
                                <Form.Control
                                  className="table-text-box border-0 text-center"
                                  type="text"
                                  name="counterNo"
                                  id="counterNo"
                                  placeholder=""
                                  value={rows[ri]["counterNo"]}
                                // disabled
                                />
                                {/* {saveFlag == true ? (<>
                                </>) : (<></>)} */}
                              </td>
                              <td className="sr-no-style">
                                <Form.Control
                                  autoFocus={true}
                                  id={`mobileNo-${ri}`}
                                  name={`mobileNo-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  autoComplete="nope"
                                  maxLength={10}
                                  onChange={(e) => {
                                    this.handleUnitChange(
                                      "mobileNo",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (
                                        e.target.value != "" &&
                                        e.target.value.length < 10
                                      ) {
                                        this.handleKeyDown(e, `mobileNo-${ri}`);
                                      } else {
                                        setTimeout(() => {
                                          document
                                            .getElementById(`productName-${ri}`)
                                            .focus();
                                        }, 300);
                                      }
                                    }
                                  }}
                                  value={rows[ri]["mobileNo"]}
                                // onKeyPress={(e) => {
                                //   this.OnlyEnterAmount(e);
                                // }}
                                />
                              </td>
                              <td

                              // onMouseOver={(e) => {
                              //   e.preventDefault();
                              //   console.log("mouse over--", e.target.value);
                              //   if (rows[ri]["productId"] !== "") {
                              //     get_supplierlist_by_productidFun(rv.productId);
                              //   }
                              // }}
                              // onMouseOut={(e) => {
                              //   e.preventDefault();
                              //   get_supplierlist_by_productidFun();
                              // }}
                              >
                                <Form.Control
                                  type="text"
                                  // id={`${productId + ri}`}
                                  // name={`${productId + ri}`}
                                  id={`productName-${ri}`}
                                  name={`productName-${ri}`}
                                  // className={`${productNameData && productNameData[ri] == "Y"
                                  //   ? "border border-danger tnx-pur-inv-prod-style text-start"
                                  //   : "tnx-pur-inv-prod-style text-start"
                                  //   }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      isopen: true,
                                      rowIndex: ri,
                                    });
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    this.setState({ rowIndex: ri });
                                    this.filterData(
                                      e.target.value.toLowerCase()
                                    );
                                    this.handleUnitChange(
                                      "productName",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.setState({ rowIndex: ri });
                                      this.filterData(
                                        e.target.value.toLowerCase()
                                      );
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      if (e.target.value === "") {
                                        this.setState({ rowIndex: ri });
                                        this.filterData(
                                          e.target.value.toLowerCase()
                                        );
                                        e.preventDefault();
                                        if (isopen === true) {
                                          document
                                            .getElementById("counter-sale-0")
                                            ?.focus();
                                          document
                                            .getElementById(
                                              "payment-ledger-cashac-0"
                                            )
                                            ?.focus();
                                        }
                                      } else if (
                                        isopen === true &&
                                        e.target.value !== ""
                                      ) {
                                        this.setState({ isopen: false });
                                      }
                                    } else if (e.keyCode == 40) {
                                      //! this condition for down button press 1409
                                      if (isopen == true) {
                                        document
                                          .getElementById("counter-sale-0")
                                          ?.focus();
                                        document
                                          .getElementById(
                                            "payment-ledger-cashac-0"
                                          )
                                          ?.focus();
                                      } else {
                                        console.log("down");
                                        this.FocusTrRowFields(
                                          "particulars",
                                          ri + 1
                                        );
                                      }
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {
                                      console.log("up");
                                      this.FocusTrRowFields(
                                        "particulars",
                                        ri - 1
                                      );
                                      // console.warn("Up");
                                    }
                                  }}
                                  value={rows[ri]["productName"]}
                                  className="formcontrol-style text-start"
                                  placeholder="Particulars"
                                  // value={code_name}
                                  // styles={particularsDD}
                                  colors="#729"
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   //   this.SelectProductModalFun(true, ri);
                                //   productModalStateChange({
                                //     selectProductModal: true,
                                //     rowIndex: ri,
                                //   });
                                // }}
                                // onKeyDown={(e) => {
                                //   if (e.keyCode == 40) {
                                //     this.FocusTrRowFields(productId, ri + 1);
                                //     // console.warn("Down");
                                //   } else if (e.keyCode == 38) {
                                //     this.FocusTrRowFields(productId, ri - 1);
                                //     // console.warn("Up");
                                //   } else if (e.keyCode == 13) {
                                //     productModalStateChange({
                                //       selectProductModal: true,
                                //       rowIndex: ri,
                                //     });
                                //   } else if (e.shiftKey && e.key === "Tab") {
                                //   } else if (e.key === "Tab" && !e.target.value) {
                                //     e.preventDefault();
                                //   }
                                // }}
                                // readOnly
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className=" table-text-box border-0"
                                  id={`packing-${ri}`}
                                  name={`packing-${ri}`}
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleUnitChange(
                                      "packing",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={
                                    rows[ri]["packing"]
                                      ? rows[ri]["packing"]
                                      : ""
                                  }
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 40) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "packing-",
                                  //       ri + 1
                                  //     );
                                  //   } else if (e.keyCode == 38) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "packing-",
                                  //       ri - 1
                                  //     );
                                  //   }
                                  // }}
                                  readOnly
                                  tabIndex={-1}
                                />
                              </td>
                              {ABC_flag_value == "A" ||
                                ABC_flag_value == "AB" ||
                                ABC_flag_value == "ABC" ? (
                                <td>
                                  <Select
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder="select..."
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelAOpt",
                                      ri,
                                      "prod_id"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      // rows[ri]["levelaId"] = value;
                                      this.setState("levelaId", value, ri);
                                      // this.getLevelbOpt(
                                      //   ri,
                                      //   rows[ri]["productId"],
                                      //   value
                                      // );
                                      this.setState();
                                    }}
                                    value={rows[ri]["levelaId"]}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {ABC_flag_value == "AB" ||
                                ABC_flag_value == "ABC" ? (
                                <td>
                                  <Select
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    // components={{
                                    //   // DropdownIndicator: () => null,
                                    //   IndicatorSeparator: () => null,
                                    // }}
                                    placeholder="select..."
                                    styles={flavourDD}
                                    // options={this.getLevelsOpt(
                                    //   "levelBOpt",
                                    //   ri,
                                    //   "levelaId"
                                    // )}
                                    colors="#729"
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {ABC_flag_value == "ABC" ? (
                                <td>
                                  <Select
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    placeholder="select..."
                                    styles={flavourDD}
                                    colors="#729"
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              <td>
                                <Form.Group
                                // className={`${
                                //   unitIdData && unitIdData[ri] == "Y"
                                //     ? "border border-danger "
                                //     : ""
                                //   }`}
                                >
                                  <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    id={`unitId-${ri}`}
                                    name={`unitId-${ri}`}
                                    className="prd-dd-style drop-up "
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder="Unit"
                                    styles={unitDD}
                                    options={this.getLevelsOpt(
                                      "unitOpt",
                                      ri,
                                      "levelcId"
                                    )}
                                    onChange={(value, triggeredAction) => {
                                      setFieldValue("unitId", value, ri);
                                    }}
                                    value={rows[ri]["unitId"]}
                                  />
                                </Form.Group>
                              </td>

                              <>
                                <td>
                                  <Form.Control
                                    id={`batchNo-${ri}`}
                                    name={`batchNo-${ri}`}
                                    // className={`${batchNoData && batchNoData[ri] == "Y"
                                    //   ? "border border-danger table-text-box"
                                    //   : "table-text-box border-0"
                                    //   }`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder=""
                                    // onChange={(e) => {
                                    //   e.preventDefault();
                                    //   this.filterBatchData(e.target.value);
                                    // }}

                                    onInput={(e) => {
                                      e.preventDefault();
                                      // this.getProductBatchList(ri);
                                      console.log("rv", rv);
                                      this.setState({ rowIndex: ri });

                                      this.handleUnitChange(
                                        "b_no",
                                        e.target.value,
                                        ri
                                      );
                                      this.batchSearchFun(e.target.value);

                                      // if (rv.selectedProduct?.is_serial) {
                                      //   console.log(
                                      //     "rv serial",
                                      //     rv.selectedProduct?.is_serial
                                      //   );
                                      //   openSerialNo(ri);
                                      // } else if (rv.selectedProduct?.is_batch) {
                                      //   console.log(
                                      //     "rv batch",
                                      //     rv.selectedProduct?.is_batch
                                      //   );
                                      //   // openBatchNo(ri);
                                      //   this.setState({ rowIndex: ri });

                                      //   this.setState(
                                      //     "batchNo",
                                      //     e.target.value,
                                      //     ri
                                      //   );
                                      //   this.batchSearchFun(e.target.value);
                                      // }
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        isBatchOpen: true,
                                        rowIndex: ri,
                                      });
                                      this.getProductBatchList(
                                        ri,
                                        "batch",
                                        true
                                      );
                                    }}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      this.setState({ rowIndex: ri });
                                      this.batchSearchFun(e.target.value);
                                      this.handleUnitChange(
                                        "b_no",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    // onKeyDown={(e) => {
                                    //   if (
                                    //     e.shiftKey &&
                                    //     e.key === "Tab" &&
                                    //     e.target.value >= 0
                                    //   ) {
                                    //   } else if (e.keyCode == 40) {
                                    //     this.FocusTrRowFields(
                                    //       productId + "batchNo-",
                                    //       ri + 1
                                    //     );
                                    //     // console.warn("Down");
                                    //   } else if (e.keyCode == 38) {
                                    //     this.FocusTrRowFields(
                                    //       productId + "batchNo-",
                                    //       ri - 1
                                    //     );
                                    //     // console.warn("Up");
                                    //   } else if (
                                    //     e.key === "Tab" &&
                                    //     e.target.value == 0
                                    //   ) {
                                    //     e.preventDefault();
                                    //     if (rv.selectedProduct?.is_serial) {
                                    //       openSerialNo(ri);
                                    //     } else if (rv.selectedProduct?.is_batch) {
                                    //       openBatchNo(ri);
                                    //     }
                                    //   } else if (e.keyCode == 13) {
                                    //     if (rv.selectedProduct?.is_serial) {
                                    //       openSerialNo(ri);
                                    //     } else if (rv.selectedProduct?.is_batch) {
                                    //       openBatchNo(ri);
                                    //     }
                                    //   }
                                    // }}
                                    value={rows[ri]["b_no"]}
                                    // // disabled={
                                    // //   !(
                                    // //     rv.selectedProduct?.is_batch ||
                                    // //     rv.selectedProduct?.is_serial
                                    // //   )
                                    // // }
                                    // readOnly
                                    onKeyDown={(e) => {
                                      if (
                                        e.shiftKey &&
                                        e.keyCode === 9 &&
                                        e.target.value >= 0
                                      ) {
                                      } else if (e.keyCode == 40) {
                                        this.FocusTrRowFields(
                                          productId + "batchNo-",
                                          ri + 1
                                        );
                                      } else if (e.keyCode == 38) {
                                        this.FocusTrRowFields(
                                          productId + "batchNo-",
                                          ri - 1
                                        );
                                      } else if (
                                        e.keyCode === 9 &&
                                        e.target.value == 0
                                      ) {
                                        e.preventDefault();
                                        this.setState({
                                          currentSelectedBatchId: `composite-productBatchTr_${ri}`,
                                        });
                                        // if (rv.selectedProduct?.is_serial) {
                                        //   openSerialNo(ri);
                                        // } else
                                        if (rv.selectedProduct?.is_batch) {
                                          // openBatchNo(ri);
                                          this.productModalStateChange({
                                            rowIndex: ri,
                                          });

                                          this.handleUnitChange(
                                            "b_no",
                                            e.target.value,
                                            ri
                                          );
                                          this.batchSearchFun(e.target.value);
                                        }
                                      } else if (e.keyCode === 13) {
                                        e.preventDefault();

                                        this.setState({
                                          currentSelectedBatchId: `composite-productBatchTr_${ri}`,
                                        });
                                        // if (
                                        //   "is_serial" in rows[ri] &&
                                        //   rows[ri]["is_serial"] == true
                                        // ) {
                                        //   // rv.selectedProduct?.is_serial

                                        //   openSerialNo(ri);
                                        // } else
                                        if (
                                          "is_batch" in rows[ri] &&
                                          rows[ri]["is_batch"] == true
                                        ) {
                                          //rv.selectedProduct?.is_batch
                                          // openBatchNo(ri);
                                          this.productModalStateChange({
                                            rowIndex: ri,
                                          });

                                          this.handleUnitChange(
                                            "b_no",
                                            e.target.value,
                                            ri
                                          );
                                          // this.batchSearchFun(e.target.value);
                                          if (
                                            "is_batch" in rows[ri] &&
                                            rows[ri]["is_batch"] == true
                                          ) {
                                            // console.log("batchData ", batchData);
                                            const index = batchData.findIndex(
                                              (object) => {
                                                return (
                                                  object.id ===
                                                  rows[ri]["b_details_id"]
                                                );
                                              }
                                            );
                                            if (index >= 0) {
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "composite-productBatchTr_" +
                                                    index
                                                  )
                                                  ?.focus();
                                              }, 200);
                                            }
                                            this.setState({
                                              isBatchOpen: true,
                                            });
                                          }
                                        }
                                      }
                                      // else if (e.keyCode === 9) {

                                      //   if (e.target.value === "") {
                                      //     e.preventDefault();
                                      //   } else if (
                                      //     isBatchOpen === true &&
                                      //     e.target.value !== ""
                                      //   ) {
                                      //     this.setState({ isBatchOpen: false });
                                      //   }
                                      // }
                                    }}
                                  />
                                </td>
                              </>

                              <td>
                                <Form.Control
                                  // className={`${qtyData && qtyData[ri] == "Y"
                                  //   ? "border border-danger table-text-box"
                                  //   : "table-text-box border-0"
                                  //   }`}
                                  id={`qty-${ri}`}
                                  name={`qty-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    // rows[ri]["qty"] = e.target.value;
                                    this.handleUnitChange(
                                      "qty",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["qty"]}
                                  // onKeyPress={(e) => {
                                  //   OnlyEnterNumbers(e);
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 40) {
                                      this.FocusTrRowFields("qty-", ri + 1);
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {
                                      this.FocusTrRowFields("qty-", ri - 1);
                                      // console.warn("Up");
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                      e.preventDefault();
                                    } else if (e.key === "Tab") {
                                      if (
                                        transactionType === "sale_invoice" ||
                                        transactionType === "sales_edit"
                                      ) {
                                        console.log("rv", rv);
                                        if (rv.qty != null) {
                                          // qtyVerificationById(rv);
                                        }
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value !== "") {
                                        if (
                                          isFreeQtyExist(
                                            "is_free_qty",
                                            this.props.userControl
                                          )
                                        ) {
                                          document
                                            .getElementById("freeQty-" + rowIndex)
                                            .focus();
                                        }
                                        else {
                                          document
                                            .getElementById("rate-" + rowIndex)
                                            .focus();
                                        }
                                      }
                                    }
                                  }}
                                />
                              </td>

                              {isFreeQtyExist(
                                "is_free_qty",
                                this.props.userControl
                              ) && (
                                  <td>
                                    <Form.Control
                                      id={`freeQty-${ri}`}
                                      name={`freeQty-${ri}`}
                                      className="table-text-box border-0"
                                      type="text"
                                      placeholder="0"
                                      onChange={(e) => {
                                        this.handleUnitChange(
                                          "free_qty",
                                          e.target.value,
                                          ri
                                        );
                                      }}
                                      // onBlur={(e) => {
                                      //   // if (
                                      //   //   parseInt(rows[ri]["qty"]) <
                                      //   //     parseInt(rows[ri]["free_qty"]) ===
                                      //   //   true
                                      //   // ) {
                                      //   //   MyNotifications.fire({
                                      //   //     show: true,
                                      //   //     icon: "error",
                                      //   //     title: "Error",
                                      //   //     msg: "Free Qty should be less than Qty",
                                      //   //     is_button_show: true,
                                      //   //   });
                                      //   //   handleUnitChange("free_qty", 0, ri);
                                      //   // }
                                      // }}
                                      value={rows[ri]["free_qty"]}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 40) {
                                          this.FocusTrRowFields(
                                            productId + "freeQty-",
                                            ri + 1
                                          );
                                          // console.warn("Down");
                                        } else if (e.keyCode == 38) {
                                          this.FocusTrRowFields(
                                            productId + "freeQty-",
                                            ri - 1
                                          );
                                          // console.warn("Up");
                                        } else if (e.keyCode == 13) {
                                          document
                                            .getElementById("rate-" + rowIndex)
                                            .focus();
                                        }
                                      }}
                                    />
                                  </td>
                                )}

                              <td>
                                <Form.Control
                                  // className={`${rateData && rateData[ri] == "Y"
                                  //   ? "border border-danger table-text-box "
                                  //   : "table-text-box border-0"
                                  //   }`}
                                  id={`rate-${ri}`}
                                  name={`rate-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleUnitChange(
                                      "rate",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["rate"]}
                                  onKeyPress={(e) => {
                                    OnlyEnterAmount(e);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 40) {
                                      this.FocusTrRowFields(
                                        productId + "rate-",
                                        ri + 1
                                      );
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {
                                      this.FocusTrRowFields(
                                        productId + "rate-",
                                        ri - 1
                                      );
                                      // console.warn("Up");
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 13) {
                                      document
                                        .getElementById("dis1Per-" + rowIndex)
                                        .focus();
                                    }
                                  }}
                                />
                              </td>

                              {/* <td>
                                <Form.Control
                                  id={`grossAmt-${ri}`}
                                  name={`grossAmt-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  value={this.getFloatUnitElement(
                                    "base_amt",
                                    ri
                                  )}
                                  disabled
                                  readOnly
                                />
                              </td> */}

                              <td>
                                <Form.Control
                                  id={`dis1Per-${ri}`}
                                  name={`dis1Per-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleUnitChange(
                                      "dis_per",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["dis_per"]}
                                  onKeyPress={(e) => {
                                    OnlyEnterAmount(e);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 40) {
                                      this.FocusTrRowFields(
                                        productId + "dis1Per-",
                                        ri + 1
                                      );
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {
                                      this.FocusTrRowFields(
                                        productId + "dis1Per-",
                                        ri - 1
                                      );
                                      // console.warn("Up");
                                    } else if (e.keyCode == 13) {
                                      document
                                        .getElementById("addBtnId-" + rowIndex)
                                        .focus();
                                    }
                                  }}
                                />
                              </td>

                              {/* <td>
                    <Form.Control
                    // id={productId + `dis2Per-${ri}`}
                    // name={`dis2Per-${ri}`}
                    className="table-text-box border-0"
                    type="text"
                    placeholder="0"
                    // onChange={(e) => {
                    //   handleUnitChange(
                    //     "dis_per2",
                    //     e.target.value,
                    //     ri
                    //   );
                    // }}
                    // value={rows[ri]["dis_per2"]}
                    // onKeyPress={(e) => {
                    //   OnlyEnterAmount(e);
                    // }}
                    // onKeyDown={(e) => {
                    //   if (e.keyCode == 40) {
                    //     this.FocusTrRowFields(
                    //       productId + "dis2Per-",
                    //       ri + 1
                    //     );
                    //     // console.warn("Down");
                    //   } else if (e.keyCode == 38) {
                    //     this.FocusTrRowFields(
                    //       productId + "dis2Per-",
                    //       ri - 1
                    //     );
                    //     // console.warn("Up");
                    //   }
                    //   }}
                    />
                  </td>


              <td>
                <Form.Control
                  // id={productId + `disAmt-${ri}`}
                  // name={`disAmt-${ri}`}
                  className="table-text-box border-0"
                  type="text"
                  placeholder="0"
                  // onChange={(e) => {
                  //   handleUnitChange("dis_amt", e.target.value, ri);
                  // }}

                  // value={rows[ri]["dis_amt"]}
                  // onKeyPress={(e) => {
                  //   OnlyEnterAmount(e);
                  // }}


                  // onKeyDown={(e) => {
                  //   if (e.keyCode == 40) {
                  //     this.FocusTrRowFields(
                  //       productId + "disAmt-",
                  //       ri + 1
                  //     );
                  //     // console.warn("Down");
                  //   } else if (e.keyCode == 38) {
                  //     this.FocusTrRowFields(
                  //       productId + "disAmt-",
                  //       ri - 1
                  //     );
                  //     // console.warn("Up");
                  //   } else if (e.shiftKey && e.key === "Tab") {
                  //   } else if (e.key === "Tab") {
                  //     if (rv.selectedProduct?.is_serial) {
                  //       // console.log(
                  //       //   "rv serial",
                  //       //   rv.selectedProduct?.is_serial
                  //       // );
                  //       // openSerialNo(ri);
                  //     } else if (rv.selectedProduct?.is_batch) {
                  //       // console.log(
                  //       //   "rv batch",
                  //       //   rv.selectedProduct?.is_batch
                  //       // );
                  //       // openBatchNo(ri);
                  //       getProductBatchList(ri, "costing");
                  //     }
                  //   }
                  // }}
                />
              </td>

              <td>
                <Form.Control
                  // id={`tax-${ri}`}
                  // name={`tax-${ri}`}
                  className="table-text-box border-0"
                  type="text"
                  placeholder="0"
                  // value={rows[ri]["gst"]}
                  disabled
                  readOnly
                />
              </td> */}

                              <td style={{ backgroundColor: "#D2F6E9" }}>
                                <Form.Control
                                  id={`netAmt-${ri}`}
                                  name={`netAmt-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  value={this.getFloatUnitElement(
                                    "final_amt",
                                    ri
                                  )}
                                  disabled
                                  readOnly
                                  style={{ backgroundColor: "#D2F6E9" }}
                                />
                              </td>
                              {/* <td style={{ backgroundColor: "#D2F6E9" }}>
                                    if(rows[rowIndex]["counterNo"])
                                {rows.reduce(
                                  (prev, next) =>
                                    parseFloat(prev) + parseFloat(next.final_amt),

                                  0
                                )}

                                
                              </td> */}

                              <td>
                                <Form.Control
                                  id={`mode-${ri}`}
                                  name={`mode-${ri}`}
                                  className="table-text-box border-0 text-center"
                                  type="text"
                                  placeholder="0"
                                  value={rows[ri]["payment_mode"]}
                                  disabled
                                // style={{ backgroundColor: "#D2F6E9" }}
                                />
                              </td>

                              <td className="d-flex">
                                {rows[ri]["details_id"] == "" &&
                                  rows.length > 1 ? (
                                  <>
                                    <Button
                                      id={`deleteBtn-${ri}`}
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.handleRemoveRow(ri);
                                        // this.setState({
                                        //   add_button_flag: true,
                                        // });
                                        this.setState({
                                          add_button_flag: true,
                                        });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 40) {
                                          this.FocusTrRowFields(
                                            productId + "deleteBtn-",
                                            ri + 1
                                          );
                                          // console.warn("Down");
                                        } else if (e.keyCode == 38) {
                                          this.FocusTrRowFields(
                                            productId + "deleteBtn-",
                                            ri - 1
                                          );
                                          // console.warn("Up");
                                        } else if (e.keyCode === 32) {
                                          e.preventDefault();
                                        } else if (e.keyCode === 13) {
                                          document
                                            .getElementById(`saveBtnId-${ri}`)
                                            ?.focus();
                                        }
                                        // else if (e.keyCode === 13) {
                                        //   handleRemoveRow(ri);
                                        //   this.setState({
                                        //     add_button_flag: true,
                                        //   });
                                        // }
                                      }}
                                    >
                                      <img
                                        isDisabled={rows.length > 0}
                                        src={TableDelete}
                                        alt=""
                                        className="btnimg"
                                      // autoFocus={true}
                                      />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      id={`deleteBtn-${ri}`}
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.deleteCountersales(
                                          rv["counterId"]
                                        );
                                        // this.setState({
                                        //   add_button_flag: true,
                                        // });
                                        this.setState({
                                          add_button_flag: true,
                                        });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          document
                                            .getElementById(`saveBtnId-${ri}`)
                                            ?.focus();
                                        }
                                      }}
                                    >
                                      <img
                                        isDisabled={rows.length > 0}
                                        src={TableDelete}
                                        alt=""
                                        className="btnimg"
                                      // autoFocus={true}
                                      />
                                    </Button>
                                  </>
                                )}
                                {/* {JSON.} */}
                                {rows[ri]["details_id"] == "" ? (
                                  <>
                                    <Button
                                      id={`saveBtnId-${ri}`}
                                      // name="Vinit"
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          paymentMdl: true,
                                          saveFlag: true,
                                        }
                                          // , ()=>{

                                          // }
                                        );
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          console.log("save button");
                                          document
                                            .getElementById(
                                              "addBtnId-" + rowIndex
                                            )
                                            ?.focus();
                                        }
                                      }}
                                    >
                                      <img
                                        src={print}
                                        // name="vinit/"
                                        alt=""
                                        className="btnimg"
                                      />
                                    </Button>
                                    <Button
                                      id={`addBtnId-${ri}`}
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.handleAddRow();
                                        // productModalStateChange({
                                        //   add_button_flag: true,
                                        // });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 32) {
                                          this.handleAddRow();
                                        }
                                      }}
                                    >
                                      <img
                                        src={add_icon}
                                        alt=""
                                        className="btnimg"

                                      // isDisabled={
                                      //   rv && rv.productId && rv.productId != ""
                                      //     ? true
                                      //     : false
                                      // }
                                      />
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {rows[ri]["details_id"] != "" &&
                                  isRowModify == false ? (
                                  <>
                                    <Button
                                      id={`editBtnId + ${ri}`}
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          isRowModify: true,
                                          custSerialNo: rv["counterNo"],
                                          editId: rv["counterId"],
                                        });
                                      }}
                                    >
                                      <img
                                        src={Frame}
                                        alt=""
                                        className="btnimg"
                                      />
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                                {rows[ri]["details_id"] != "" &&
                                  isRowModify == true &&
                                  rv["counterNo"] == custSerialNo ? (
                                  <>
                                    <Button
                                      // id={this.props.addBtnId + ri}
                                      id={`editBtnId+${ri}`}
                                      className="btn_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          paymentMdl: true,
                                          saveFlag: true,
                                        });
                                      }}
                                    >
                                      <img
                                        src={print}
                                        alt=""
                                        className="btnimg"
                                      />
                                    </Button>
                                    <Button
                                      id={`addBtnId + ${ri}`}
                                      className="btn_style"
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          console.log("add1 button");
                                          document
                                            .getElementById(
                                              "addBtnId-" + rowIndex
                                            )
                                            ?.focus();
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.handleAddRow();
                                      }}
                                    >
                                      <img
                                        src={add_icon}
                                        alt=""
                                        className="btnimg"
                                      />
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>
                            </tr>
                          ) : (
                            <>
                              <tr style={{ borderbottom: "1px solid #D9D9D9" }}>
                                {/* <td style={{ width: "2%" }}>
                                <Form.Group
                                  controlId="formBasicCheckbox1"
                                  className="ml-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    className="m-0"
                                    //disabled={v.sales_order_status == "closed"}
                                    checked={soBills.includes(parseInt(rv.id))}
                                    onChange={(e) => {
                                      // e.preventDefault();
                                      this.handleCounterSalesBillsSelection(
                                        rv.id,

                                        e.target.checked,
                                        i
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </td> */}
                                <td
                                  style={{ width: "5%", textAlign: "center" }}
                                >
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                  // className="ml-1 pmt-allbtn"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      checked={modeCheck.includes(
                                        parseInt(rv.id)
                                      )}
                                      onClick={(e) => {
                                        this.handlePaymentModeChange(
                                          rv.id,
                                          e.target.checked,
                                          ri
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                </td>
                                <td className="sr-no-style">
                                  <Form.Control
                                    disabled
                                    readOnly
                                    className="table-text-box border-0"
                                    type="text"
                                    name="counterNo"
                                    id="counterNo"
                                    placeholder=""
                                    value={rows[ri]["counterNo"]}
                                  // disabled
                                  />
                                  {/* {saveFlag == true ? (<>
                                </>) : (<></>)} */}
                                </td>
                                <td className="sr-no-style">
                                  <Form.Control
                                    disabled
                                    readOnly
                                    id={`mobileNo-${ri}`}
                                    name={`mobileNo-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => {
                                      this.handleUnitChange(
                                        "mobileNo",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={rows[ri]["mobileNo"]}
                                  // onKeyPress={(e) => {
                                  //   this.OnlyEnterAmount(e);
                                  // }}
                                  />
                                </td>
                                <td

                                // onMouseOver={(e) => {
                                //   e.preventDefault();
                                //   console.log("mouse over--", e.target.value);
                                //   if (rows[ri]["productId"] !== "") {
                                //     get_supplierlist_by_productidFun(rv.productId);
                                //   }
                                // }}
                                // onMouseOut={(e) => {
                                //   e.preventDefault();
                                //   get_supplierlist_by_productidFun();
                                // }}
                                >
                                  <Form.Control
                                    disabled
                                    readOnly
                                    type="text"
                                    // id={`${productId + ri}`}
                                    // name={`${productId + ri}`}
                                    id={`productName-${ri}`}
                                    name={`productName-${ri}`}
                                    // className={`${productNameData && productNameData[ri] == "Y"
                                    //   ? "border border-danger tnx-pur-inv-prod-style text-start"
                                    //   : "tnx-pur-inv-prod-style text-start"
                                    //   }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        isopen: true,
                                        rowIndex: ri,
                                      });
                                    }}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      this.setState({ rowIndex: ri });
                                      this.filterData(
                                        e.target.value.toLowerCase()
                                      );
                                      this.handleUnitChange(
                                        "productName",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={rows[ri]["productName"]}
                                    className="formcontrol-style text-start"
                                    placeholder="Particulars"
                                    // value={code_name}
                                    // styles={particularsDD}
                                    colors="#729"
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   //   this.SelectProductModalFun(true, ri);
                                  //   productModalStateChange({
                                  //     selectProductModal: true,
                                  //     rowIndex: ri,
                                  //   });
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 40) {
                                  //     this.FocusTrRowFields(productId, ri + 1);
                                  //     // console.warn("Down");
                                  //   } else if (e.keyCode == 38) {
                                  //     this.FocusTrRowFields(productId, ri - 1);
                                  //     // console.warn("Up");
                                  //   } else if (e.keyCode == 13) {
                                  //     productModalStateChange({
                                  //       selectProductModal: true,
                                  //       rowIndex: ri,
                                  //     });
                                  //   } else if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (e.key === "Tab" && !e.target.value) {
                                  //     e.preventDefault();
                                  //   }
                                  // }}
                                  // readOnly
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    className=" table-text-box border-0"
                                    id={`packing-${ri}`}
                                    name={`packing-${ri}`}
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => {
                                      this.handleUnitChange(
                                        "packing",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={
                                      rows[ri]["packing"]
                                        ? rows[ri]["packing"]
                                        : ""
                                    }
                                    // onKeyDown={(e) => {
                                    //   if (e.keyCode == 40) {
                                    //     this.FocusTrRowFields(
                                    //       productId + "packing-",
                                    //       ri + 1
                                    //     );
                                    //   } else if (e.keyCode == 38) {
                                    //     this.FocusTrRowFields(
                                    //       productId + "packing-",
                                    //       ri - 1
                                    //     );
                                    //   }
                                    // }}
                                    tabIndex={-1}
                                  />
                                </td>
                                {ABC_flag_value == "A" ||
                                  ABC_flag_value == "AB" ||
                                  ABC_flag_value == "ABC" ? (
                                  <td>
                                    <Select
                                      className="prd-dd-style "
                                      menuPlacement="auto"
                                      components={{
                                        // DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                      }}
                                      placeholder="select..."
                                      styles={flavourDD}
                                      options={this.getLevelsOpt(
                                        "levelAOpt",
                                        ri,
                                        "prod_id"
                                      )}
                                      colors="#729"
                                      onChange={(value, triggeredAction) => {
                                        // rows[ri]["levelaId"] = value;
                                        this.setState("levelaId", value, ri);
                                        // this.getLevelbOpt(
                                        //   ri,
                                        //   rows[ri]["productId"],
                                        //   value
                                        // );
                                        this.setState();
                                      }}
                                      value={rows[ri]["levelaId"]}
                                      disabled
                                      readOnly
                                    />
                                  </td>
                                ) : (
                                  ""
                                )}
                                {ABC_flag_value == "AB" ||
                                  ABC_flag_value == "ABC" ? (
                                  <td>
                                    <Select
                                      className="prd-dd-style "
                                      menuPlacement="auto"
                                      // components={{
                                      //   // DropdownIndicator: () => null,
                                      //   IndicatorSeparator: () => null,
                                      // }}
                                      placeholder="select..."
                                      styles={flavourDD}
                                      // options={this.getLevelsOpt(
                                      //   "levelBOpt",
                                      //   ri,
                                      //   "levelaId"
                                      // )}
                                      colors="#729"
                                      disabled
                                      readOnly
                                    />
                                  </td>
                                ) : (
                                  ""
                                )}
                                {ABC_flag_value == "ABC" ? (
                                  <td>
                                    <Select
                                      className="prd-dd-style "
                                      menuPlacement="auto"
                                      placeholder="select..."
                                      styles={flavourDD}
                                      colors="#729"
                                      disabled
                                      readOnly
                                    />
                                  </td>
                                ) : (
                                  ""
                                )}
                                <td>
                                  <Form.Group
                                  // className={`${
                                  //   unitIdData && unitIdData[ri] == "Y"
                                  //     ? "border border-danger "
                                  //     : ""
                                  //   }`}
                                  >
                                    <Select
                                      menuPlacement="auto"
                                      menuPosition="fixed"
                                      id={`unitId-${ri}`}
                                      name={`unitId-${ri}`}
                                      className="prd-dd-style drop-up "
                                      components={{
                                        // DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                      }}
                                      placeholder="Unit"
                                      styles={unitDD}
                                      options={this.getLevelsOpt(
                                        "unitOpt",
                                        ri,
                                        "levelcId"
                                      )}
                                      onChange={(value, triggeredAction) => {
                                        setFieldValue("unitId", value, ri);
                                      }}
                                      isDisabled
                                      readOnly
                                      value={rows[ri]["unitId"]}
                                    />
                                  </Form.Group>
                                </td>

                                <>
                                  <td>
                                    <Form.Control
                                      disabled
                                      readOnly
                                      id={`batchNo-${ri}`}
                                      name={`batchNo-${ri}`}
                                      // className={`${batchNoData && batchNoData[ri] == "Y"
                                      //   ? "border border-danger table-text-box"
                                      //   : "table-text-box border-0"
                                      //   }`}
                                      className="table-text-box border-0"
                                      type="text"
                                      placeholder=""
                                      // onChange={(e) => {
                                      //   e.preventDefault();
                                      //   this.filterBatchData(e.target.value);
                                      // }}

                                      onInput={(e) => {
                                        e.preventDefault();
                                        // this.getProductBatchList(ri);
                                        console.log("rv", rv);
                                        this.setState({ rowIndex: ri });

                                        this.handleUnitChange(
                                          "b_no",
                                          e.target.value,
                                          ri
                                        );
                                        this.batchSearchFun(e.target.value);

                                        // if (rv.selectedProduct?.is_serial) {
                                        //   console.log(
                                        //     "rv serial",
                                        //     rv.selectedProduct?.is_serial
                                        //   );
                                        //   openSerialNo(ri);
                                        // } else if (rv.selectedProduct?.is_batch) {
                                        //   console.log(
                                        //     "rv batch",
                                        //     rv.selectedProduct?.is_batch
                                        //   );
                                        //   // openBatchNo(ri);
                                        //   this.setState({ rowIndex: ri });

                                        //   this.setState(
                                        //     "batchNo",
                                        //     e.target.value,
                                        //     ri
                                        //   );
                                        //   this.batchSearchFun(e.target.value);
                                        // }
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          isBatchOpen: true,
                                          rowIndex: ri,
                                        });
                                        this.getProductBatchList(
                                          ri,
                                          "batch",
                                          true
                                        );
                                      }}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        this.setState({ rowIndex: ri });
                                        this.batchSearchFun(e.target.value);
                                        this.handleUnitChange(
                                          "b_no",
                                          e.target.value,
                                          ri
                                        );
                                      }}
                                      // onKeyDown={(e) => {
                                      //   if (
                                      //     e.shiftKey &&
                                      //     e.key === "Tab" &&
                                      //     e.target.value >= 0
                                      //   ) {
                                      //   } else if (e.keyCode == 40) {
                                      //     this.FocusTrRowFields(
                                      //       productId + "batchNo-",
                                      //       ri + 1
                                      //     );
                                      //     // console.warn("Down");
                                      //   } else if (e.keyCode == 38) {
                                      //     this.FocusTrRowFields(
                                      //       productId + "batchNo-",
                                      //       ri - 1
                                      //     );
                                      //     // console.warn("Up");
                                      //   } else if (
                                      //     e.key === "Tab" &&
                                      //     e.target.value == 0
                                      //   ) {
                                      //     e.preventDefault();
                                      //     if (rv.selectedProduct?.is_serial) {
                                      //       openSerialNo(ri);
                                      //     } else if (rv.selectedProduct?.is_batch) {
                                      //       openBatchNo(ri);
                                      //     }
                                      //   } else if (e.keyCode == 13) {
                                      //     if (rv.selectedProduct?.is_serial) {
                                      //       openSerialNo(ri);
                                      //     } else if (rv.selectedProduct?.is_batch) {
                                      //       openBatchNo(ri);
                                      //     }
                                      //   }
                                      // }}
                                      value={rows[ri]["b_no"]}
                                    // // disabled={
                                    // //   !(
                                    // //     rv.selectedProduct?.is_batch ||
                                    // //     rv.selectedProduct?.is_serial
                                    // //   )
                                    // // }
                                    />
                                  </td>
                                </>

                                <td>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    // className={`${qtyData && qtyData[ri] == "Y"
                                    //   ? "border border-danger table-text-box"
                                    //   : "table-text-box border-0"
                                    //   }`}
                                    id={`qty-${ri}`}
                                    name={`qty-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => {
                                      // rows[ri]["qty"] = e.target.value;
                                      this.handleUnitChange(
                                        "qty",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={rows[ri]["qty"]}
                                  // onKeyPress={(e) => {
                                  //   OnlyEnterNumbers(e);
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 40) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "qty-",
                                  //       ri + 1
                                  //     );
                                  //     // console.warn("Down");
                                  //   } else if (e.keyCode == 38) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "qty-",
                                  //       ri - 1
                                  //     );
                                  //     // console.warn("Up");
                                  //   } else if (e.key === "Tab" && !e.target.value) {
                                  //     e.preventDefault();
                                  //   } else if (e.key === "Tab") {
                                  //     if (
                                  //       transactionType === "sale_invoice" ||
                                  //       transactionType === "sales_edit"
                                  //     ) {
                                  //       console.log("rv", rv);
                                  //       if (rv.qty != null) {
                                  //         qtyVerificationById(rv);
                                  //       }
                                  //     }
                                  //   }
                                  // }}
                                  />
                                </td>

                                {isFreeQtyExist(
                                  "is_free_qty",
                                  this.props.userControl
                                ) && (
                                    <td>
                                      <Form.Control
                                        disabled
                                        readOnly
                                        id={`freeQty-${ri}`}
                                        name={`freeQty-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        onChange={(e) => {
                                          this.handleUnitChange(
                                            "free_qty",
                                            e.target.value,
                                            ri
                                          );
                                        }}
                                        // onBlur={(e) => {
                                        //   // if (
                                        //   //   parseInt(rows[ri]["qty"]) <
                                        //   //     parseInt(rows[ri]["free_qty"]) ===
                                        //   //   true
                                        //   // ) {
                                        //   //   MyNotifications.fire({
                                        //   //     show: true,
                                        //   //     icon: "error",
                                        //   //     title: "Error",
                                        //   //     msg: "Free Qty should be less than Qty",
                                        //   //     is_button_show: true,
                                        //   //   });
                                        //   //   handleUnitChange("free_qty", 0, ri);
                                        //   // }
                                        // }}
                                        value={rows[ri]["free_qty"]}
                                      // onKeyPress={(e) => {
                                      //   OnlyEnterNumbers(e);
                                      // }}
                                      // onKeyDown={(e) => {
                                      //   if (e.keyCode == 40) {
                                      //     this.FocusTrRowFields(
                                      //       productId + "freeQty-",
                                      //       ri + 1
                                      //     );
                                      //     // console.warn("Down");
                                      //   } else if (e.keyCode == 38) {
                                      //     this.FocusTrRowFields(
                                      //       productId + "freeQty-",
                                      //       ri - 1
                                      //     );
                                      //     // console.warn("Up");
                                      //   }
                                      // }}
                                      />
                                    </td>
                                  )}

                                <td>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    // className={`${rateData && rateData[ri] == "Y"
                                    //   ? "border border-danger table-text-box "
                                    //   : "table-text-box border-0"
                                    //   }`}
                                    id={`rate-${ri}`}
                                    name={`rate-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => {
                                      this.handleUnitChange(
                                        "rate",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={rows[ri]["rate"]}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 40) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "rate-",
                                  //       ri + 1
                                  //     );
                                  //     // console.warn("Down");
                                  //   } else if (e.keyCode == 38) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "rate-",
                                  //       ri - 1
                                  //     );
                                  //     // console.warn("Up");
                                  //   } else if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (e.key === "Tab" && !e.target.value) {
                                  //     e.preventDefault();
                                  //   }
                                  // }}
                                  />
                                </td>

                                {/* <td>
                                <Form.Control
                                  id={`grossAmt-${ri}`}
                                  name={`grossAmt-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  value={this.getFloatUnitElement(
                                    "base_amt",
                                    ri
                                  )}
                                  disabled
                                  readOnly
                                />
                              </td> */}

                                <td>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    id={`dis1Per-${ri}`}
                                    name={`dis1Per-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => {
                                      this.handleUnitChange(
                                        "dis_per",
                                        e.target.value,
                                        ri
                                      );
                                    }}
                                    value={rows[ri]["dis_per"]}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 40) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "dis1Per-",
                                  //       ri + 1
                                  //     );
                                  //     // console.warn("Down");
                                  //   } else if (e.keyCode == 38) {
                                  //     this.FocusTrRowFields(
                                  //       productId + "dis1Per-",
                                  //       ri - 1
                                  //     );
                                  //     // console.warn("Up");
                                  //   }
                                  // }}
                                  />
                                </td>

                                {/* <td>
                    <Form.Control
                    // id={productId + `dis2Per-${ri}`}
                    // name={`dis2Per-${ri}`}
                    className="table-text-box border-0"
                    type="text"
                    placeholder="0"
                    // onChange={(e) => {
                    //   handleUnitChange(
                    //     "dis_per2",
                    //     e.target.value,
                    //     ri
                    //   );
                    // }}
                    // value={rows[ri]["dis_per2"]}
                    // onKeyPress={(e) => {
                    //   OnlyEnterAmount(e);
                    // }}
                    // onKeyDown={(e) => {
                    //   if (e.keyCode == 40) {
                    //     this.FocusTrRowFields(
                    //       productId + "dis2Per-",
                    //       ri + 1
                    //     );
                    //     // console.warn("Down");
                    //   } else if (e.keyCode == 38) {
                    //     this.FocusTrRowFields(
                    //       productId + "dis2Per-",
                    //       ri - 1
                    //     );
                    //     // console.warn("Up");
                    //   }
                    //   }}
                    />
                  </td>


              <td>
                <Form.Control
                  // id={productId + `disAmt-${ri}`}
                  // name={`disAmt-${ri}`}
                  className="table-text-box border-0"
                  type="text"
                  placeholder="0"
                  // onChange={(e) => {
                  //   handleUnitChange("dis_amt", e.target.value, ri);
                  // }}

                  // value={rows[ri]["dis_amt"]}
                  // onKeyPress={(e) => {
                  //   OnlyEnterAmount(e);
                  // }}


                  // onKeyDown={(e) => {
                  //   if (e.keyCode == 40) {
                  //     this.FocusTrRowFields(
                  //       productId + "disAmt-",
                  //       ri + 1
                  //     );
                  //     // console.warn("Down");
                  //   } else if (e.keyCode == 38) {
                  //     this.FocusTrRowFields(
                  //       productId + "disAmt-",
                  //       ri - 1
                  //     );
                  //     // console.warn("Up");
                  //   } else if (e.shiftKey && e.key === "Tab") {
                  //   } else if (e.key === "Tab") {
                  //     if (rv.selectedProduct?.is_serial) {
                  //       // console.log(
                  //       //   "rv serial",
                  //       //   rv.selectedProduct?.is_serial
                  //       // );
                  //       // openSerialNo(ri);
                  //     } else if (rv.selectedProduct?.is_batch) {
                  //       // console.log(
                  //       //   "rv batch",
                  //       //   rv.selectedProduct?.is_batch
                  //       // );
                  //       // openBatchNo(ri);
                  //       getProductBatchList(ri, "costing");
                  //     }
                  //   }
                  // }}
                />
              </td>

              <td>
                <Form.Control
                  // id={`tax-${ri}`}
                  // name={`tax-${ri}`}
                  className="table-text-box border-0"
                  type="text"
                  placeholder="0"
                  // value={rows[ri]["gst"]}
                  disabled
                  readOnly
                />
              </td> */}

                                <td style={{ backgroundColor: "#D2F6E9" }}>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    id={`netAmt-${ri}`}
                                    name={`netAmt-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="0"
                                    value={this.getFloatUnitElement(
                                      "final_amt",
                                      ri
                                    )}
                                    style={{ backgroundColor: "#D2F6E9" }}
                                  />
                                </td>
                                {/* <td style={{ backgroundColor: "#D2F6E9" }}>
                                    if(rows[rowIndex]["counterNo"])
                                {rows.reduce(
                                  (prev, next) =>
                                    parseFloat(prev) + parseFloat(next.final_amt),

                                  0
                                )}

                                
                              </td> */}

                                <td>
                                  <Form.Control
                                    disabled
                                    readOnly
                                    id={`mode-${ri}`}
                                    name={`mode-${ri}`}
                                    className="table-text-box border-0 text-center"
                                    type="text"
                                    placeholder="0"
                                    value={rows[ri]["payment_mode"]}
                                  // style={{ backgroundColor: "#D2F6E9" }}
                                  />
                                </td>

                                <td className="d-flex">
                                  {rows[ri]["details_id"] == "" &&
                                    rows.length > 1 ? (
                                    <>
                                      <Button
                                        id={`deleteBtn-${ri}`}
                                        className="btn_style"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.handleRemoveRow(ri);
                                          // this.setState({
                                          //   add_button_flag: true,
                                          // });
                                          this.setState({
                                            add_button_flag: true,
                                          });
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 40) {
                                            this.FocusTrRowFields(
                                              productId + "deleteBtn-",
                                              ri + 1
                                            );
                                            // console.warn("Down");
                                          } else if (e.keyCode == 38) {
                                            this.FocusTrRowFields(
                                              productId + "deleteBtn-",
                                              ri - 1
                                            );
                                            // console.warn("Up");
                                          } else if (e.keyCode === 32) {
                                            e.preventDefault();
                                          }
                                          // else if (e.keyCode === 13) {
                                          //   handleRemoveRow(ri);
                                          //   this.setState({
                                          //     add_button_flag: true,
                                          //   });
                                          // }
                                          else if (e.keyCode === 13) {
                                            document
                                              .getElementById(`saveBtnId-${ri}`)
                                              ?.focus();
                                          }
                                        }}
                                      >
                                        <img
                                          isDisabled={rows.length > 0}
                                          src={TableDelete}
                                          alt=""
                                          className="btnimg"
                                        // autoFocus={true}
                                        />
                                      </Button>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {rows[ri]["details_id"] == "" ? (
                                    <>
                                      <Button
                                        // id={this.props.addBtnId + ri}
                                        className="btn_style"
                                        // onClick={(e) => {
                                        //   e.preventDefault();
                                        //   handleAddRow();
                                        //   // this.setState({
                                        //   //   add_button_flag: !add_button_flag,
                                        //   // });
                                        //   productModalStateChange({
                                        //     add_button_flag: true,
                                        //   });
                                        // }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 32) {
                                            e.preventDefault();
                                          }
                                          // else if (e.keyCode === 13) {
                                          //   handleAddRow();
                                          //   productModalStateChange({
                                          //     add_button_flag: true,
                                          //   });
                                          // }
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.setState({
                                            paymentMdl: true,
                                            saveFlag: true,
                                          });
                                        }}
                                      >
                                        <img
                                          src={print}
                                          alt=""
                                          className="btnimg"
                                        />
                                      </Button>
                                      <Button
                                        // id={this.props.addBtnId + ri}
                                        className="btn_style"
                                      // onClick={(e) => {
                                      //   e.preventDefault();
                                      //   handleAddRow();
                                      //   // this.setState({
                                      //   //   add_button_flag: !add_button_flag,
                                      //   // });
                                      //   productModalStateChange({
                                      //     add_button_flag: true,
                                      //   });
                                      // }}
                                      // onKeyDown={(e) => {
                                      //   if (e.keyCode === 32) {
                                      //     e.preventDefault();
                                      //   } else if (e.keyCode === 13) {
                                      //     handleAddRow();
                                      //     productModalStateChange({
                                      //       add_button_flag: true,
                                      //     });
                                      //   }
                                      // }}
                                      >
                                        <img
                                          src={add_icon}
                                          alt=""
                                          className="btnimg"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.handleAddRow();
                                            // productModalStateChange({
                                            //   add_button_flag: true,
                                            // });
                                          }}
                                        // isDisabled={
                                        //   rv && rv.productId && rv.productId != ""
                                        //     ? true
                                        //     : false
                                        // }
                                        />
                                      </Button>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {rows[ri]["details_id"] != "" ? (
                                    <>
                                      <Button
                                        // id={this.props.addBtnId + ri}
                                        className="btn_style"
                                        // onClick={(e) => {
                                        //   e.preventDefault();
                                        //   handleAddRow();
                                        //   // this.setState({
                                        //   //   add_button_flag: !add_button_flag,
                                        //   // });
                                        //   productModalStateChange({
                                        //     add_button_flag: true,
                                        //   });
                                        // }}
                                        // onKeyDown={(e) => {
                                        //   if (e.keyCode === 32) {
                                        //     e.preventDefault();
                                        //   } else if (e.keyCode === 13) {
                                        //     handleAddRow();
                                        //     productModalStateChange({
                                        //       add_button_flag: true,
                                        //     });
                                        //   }
                                        // }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.setState({
                                            // paymentMdl: true,
                                            // saveFlag: true,
                                            // editIndex: ri,

                                            // rows: rows
                                            isRowModify: true,
                                            custSerialNo: rv["counterNo"],
                                            editId: rv["counterId"],
                                          });
                                        }}
                                      >
                                        <img
                                          src={Frame}
                                          alt=""
                                          className="btnimg"
                                        />
                                      </Button>
                                      <Button
                                        // id={this.props.addBtnId + ri}
                                        className="btn_style"
                                      // onClick={(e) => {
                                      //   e.preventDefault();
                                      //   handleAddRow();
                                      //   // this.setState({
                                      //   //   add_button_flag: !add_button_flag,
                                      //   // });
                                      //   productModalStateChange({
                                      //     add_button_flag: true,
                                      //   });
                                      // }}
                                      // onKeyDown={(e) => {
                                      //   if (e.keyCode === 32) {
                                      //     e.preventDefault();
                                      //   } else if (e.keyCode === 13) {
                                      //     handleAddRow();
                                      //     productModalStateChange({
                                      //       add_button_flag: true,
                                      //     });
                                      //   }
                                      // }}
                                      >
                                        <img
                                          src={add_icon}
                                          alt=""
                                          className="btnimg"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.handleAddRow();
                                            // productModalStateChange({
                                            //   add_button_flag: true,
                                            // });
                                          }}
                                        // isDisabled={
                                        //   rv && rv.productId && rv.productId != ""
                                        //     ? true
                                        //     : false
                                        // }
                                        />
                                      </Button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  {/* <Form.Control className="w-20"  />{" "} */}
                  {/* {JSON.stringify(code)}{" "} */}
                  {isopen != "" ? (
                    <Row className="justify-content-end" ref={this.modalRef}>
                      <div className="counter-popup ps-0">
                        <Row style={{ background: "#D9F0FB" }} className="ms-0">
                          <Col lg={6}>
                            <h6 className="table-header-product my-auto">
                              Product
                            </h6>
                          </Col>
                          <Col lg={6} className="text-end">
                            <img
                              src={close_crossmark_icon}
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ isopen: false });
                              }}
                            />
                          </Col>
                        </Row>
                        <div className="countertbl-product-style">
                          <Table
                            className="w-20"
                            onKeyDown={(e) => {
                              e.preventDefault();
                              if (e.keyCode != 9) {
                                this.handleCounterSaleTableRow(e);
                              }
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Code</th>
                                <th>
                                  <Row>
                                    <Col lg={7} className="paddingtop">
                                      Name
                                    </Col>
                                    <Col lg={5} className="text-end ps-0">
                                      <Button
                                        className="add-btn-style"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          // console.log("rowIndex", rowIndex);
                                          if (
                                            isActionExist(
                                              "product",
                                              "create",
                                              this.props.userPermissions
                                            )
                                          ) {
                                            let data = {
                                              rows: rows,
                                              // additionalCharges: additionalCharges,
                                              invoice_data: invoice_data,
                                              from_page: from_source,
                                              rowIndex: rowIndex,
                                              id: invoice_data.id,
                                              opType: opType,
                                            };
                                            eventBus.dispatch("page_change", {
                                              from: from_source,
                                              to: "newproductcreate",
                                              // prop_data: data,
                                              //@vinit @prop_data changed to focus the previous tab were we left
                                              prop_data: {
                                                prop_data: data,
                                                isProduct: "productMdl",
                                                rowIndex: rowIndex,
                                                // opType: opType,
                                              },
                                              isNewTab: false,
                                            });
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Permission is denied!",
                                              is_button_show: true,
                                            });
                                          }
                                        }}
                                      >
                                        + Add
                                      </Button>
                                    </Col>
                                  </Row>
                                </th>
                                <th>Packing</th>
                                <th>Barcode</th>
                                <th>Brand</th>
                                <th>MRP</th>
                                <th>Curr Stock</th>
                                <th>Unit</th>
                                <th>Sale Rate</th>
                                <th>GST</th>
                                <th style={{ width: "5%" }}>Action</th>
                              </tr>
                            </thead>{" "}
                            <tbody>
                              {" "}
                              {productLst.map((pv, i) => {
                                return (
                                  <tr
                                    value={JSON.stringify(pv)}
                                    id={`counter-sale-${i}`}
                                    // prId={pv.id}
                                    tabIndex={i}
                                    className={`${i == selectedLedgerIndex
                                      ? "selected-countersales-ledger-tr"
                                      : ""
                                      }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        selectedProduct: pv,
                                        add_button_flag: true,
                                      });
                                      this.transaction_product_detailsFun(
                                        pv.id
                                      );
                                      // get_supplierlist_by_productidFun(pv.id);
                                    }}
                                    onDoubleClick={(e) => {
                                      e.preventDefault();
                                      console.log(
                                        "selectedProduct 3355",
                                        selectedProduct
                                      );
                                      console.log("rowIndex", rowIndex);
                                      if (selectedProduct) {
                                        //rows[rowIndex]["selectedProduct"] = selectedProduct;
                                        rows[rowIndex]["productName"] =
                                          selectedProduct.product_name;
                                        if (saleRateType == "sale") {
                                          rows[rowIndex]["rate"] =
                                            selectedProduct.sales_rate;
                                        } else {
                                          if (
                                            transactionType == "purchase_order"
                                          ) {
                                            rows[rowIndex]["rate"] =
                                              selectedProduct.purchaserate;
                                          }
                                          if (
                                            selectedProduct.is_batch == false
                                          ) {
                                            rows[rowIndex]["rate"] =
                                              selectedProduct.purchaserate;
                                          }
                                        }
                                        rows[rowIndex]["productId"] =
                                          selectedProduct.id;
                                        rows[rowIndex]["is_level_a"] =
                                          getUserControlData(
                                            "is_level_a",
                                            this.props.userControl
                                          )
                                            ? true
                                            : false;
                                        rows[rowIndex]["is_level_b"] =
                                          getUserControlData(
                                            "is_level_b",
                                            this.props.userControl
                                          )
                                            ? true
                                            : false;
                                        rows[rowIndex]["is_level_c"] =
                                          getUserControlData(
                                            "is_level_c",
                                            this.props.userControl
                                          )
                                            ? true
                                            : false;
                                        rows[rowIndex]["is_batch"] =
                                          selectedProduct.is_batch;
                                        rows[rowIndex]["is_serial"] =
                                          selectedProduct.is_serial;

                                        let unit_id = {
                                          gst: selectedProduct.igst,
                                          igst: selectedProduct.igst,
                                          cgst: selectedProduct.cgst,
                                          sgst: selectedProduct.sgst,
                                        };

                                        rows[rowIndex]["unit_id"] = unit_id;
                                        rows[rowIndex]["packing"] =
                                          selectedProduct.packing;
                                        console.log("rows-->", rows);

                                        this.setState({
                                          rows: rows,
                                          selectProductModal: false,
                                          levelOpt: [],
                                        });
                                        this.getProductPackageLst(
                                          selectedProduct.id,
                                          rowIndex
                                        );
                                        this.transaction_product_listFun();
                                      }
                                      this.setState({
                                        isopen: false,
                                        selectedLedgerIndex: 0,
                                      });
                                    }}
                                  >
                                    <td> {pv.code} </td>
                                    <td> {pv.product_name}</td>
                                    <td> {pv.packing}</td>
                                    <td> {pv.barcode}</td>
                                    <td></td>
                                    <td className="text-end">
                                      {isNaN(pv.mrp)
                                        ? INRformat.format(0)
                                        : INRformat.format(pv.mrp)}
                                    </td>
                                    <td className="text-end">
                                      {isNaN(pv.current_stock)
                                        ? INRformat.format(0)
                                        : INRformat.format(pv.current_stock)}
                                    </td>
                                    <td> {pv.unit}</td>
                                    <td className="text-end">
                                      {pv.sales_rate}
                                    </td>
                                    <td>
                                      {isNaN(pv.igst)
                                        ? INRformat.format(0)
                                        : INRformat.format(pv.igst)}
                                    </td>
                                    <td className="text-center">
                                      <Button className="btn_style">
                                        <img
                                          isDisabled={rows.length > 0}
                                          src={Frame}
                                          alt=""
                                          className="btnimg"
                                          autoFocus={true}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                              isActionExist(
                                                "product",
                                                "edit",
                                                this.props.userPermissions
                                              )
                                            ) {
                                              let source = {
                                                rows: rows,
                                                invoice_data: invoice_data,
                                                from_page: from_source,
                                                rowIndex: rowIndex,
                                              };
                                              let data = {
                                                source: source,
                                                id: pv.id,
                                              };
                                              eventBus.dispatch("page_change", {
                                                from: from_source,
                                                to: "newproductedit",
                                                prop_data: data,
                                                isNewTab: false,
                                              });
                                            } else {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Permission is denied!",
                                                is_button_show: true,
                                              });
                                            }
                                          }}
                                        />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Row>
                  ) : (
                    ""
                  )}

                  {isBatchOpen != "" ? (
                    <Row className="justify-content-end" ref={this.modalRef}>
                      <div className="countertable-style-batch ps-0">
                        <Row style={{ background: "#D9F0FB" }} className="ms-0">
                          <Col lg={6}>
                            <h6 className="table-header-batch my-auto">
                              Batch
                            </h6>
                          </Col>
                          <Col lg={6} className="text-end">
                            <img
                              src={close_crossmark_icon}
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ isBatchOpen: false });
                              }}
                            />
                          </Col>
                        </Row>
                        <div className="tnx-pur-inv-mdl-product">
                          <Formik
                            innerRef={this.formRef}
                            validateOnChange={false}
                            validateOnBlur={false}
                            enableReinitialize={true}
                            initialValues={{
                              product_id: "",
                              b_no: "",
                              b_expiry: "",
                              manufacturing_date: "",
                              level_a_id: "",
                              level_b_id: "",
                              level_c_id: "",
                              unit_id: "",
                              mrp: "",
                            }}
                            validationSchema={Yup.object().shape({
                              b_no: Yup.string().required(
                                "Please Enter batch No"
                              ),
                            })}
                            onSubmit={(
                              values,
                              { setSubmitting, resetForm }
                            ) => {
                              console.log("Before values =-> ", values);
                              let {
                                rows,
                                rowIndex,
                                selectedSupplier,
                                getProductBatchList,
                              } = this.state;
                              console.log("Before values =-> ", rows, rowIndex);

                              let requestData = new FormData();

                              let obj = rows[rowIndex];
                              console.log("obj ", obj);

                              if (obj) {
                                values["product_id"] = obj.productId;
                                values["level_a_id"] = obj.levelaId?.value;
                                values["level_b_id"] = obj.levelbId?.value;
                                values["level_c_id"] = obj.levelcId?.value;
                                values["unit_id"] = obj.unitId?.value;
                              }

                              values["manufacturing_date"] =
                                values["manufacturing_date"] != ""
                                  ? moment(
                                    values["manufacturing_date"],
                                    "DD/MM/YYYY"
                                  ).format("YYYY-MM-DD")
                                  : "";
                              values["b_expiry"] =
                                values["b_expiry"] != ""
                                  ? moment(
                                    values["b_expiry"],
                                    "DD/MM/YYYY"
                                  ).format("YYYY-MM-DD")
                                  : "";
                              values["mrp"] =
                                values["mrp"] != "" ? values["mrp"] : 0;

                              // console.log("after =->", values);
                              requestData.append(
                                "product_id",
                                values["product_id"]
                              );
                              requestData.append(
                                "level_a_id",
                                values["level_a_id"]
                              );
                              requestData.append(
                                "level_b_id",
                                values["level_b_id"]
                              );
                              requestData.append(
                                "level_c_id",
                                values["level_c_id"]
                              );
                              requestData.append("unit_id", values["unit_id"]);
                              requestData.append(
                                "manufacturing_date",
                                values["manufacturing_date"]
                              );
                              requestData.append(
                                "b_expiry",
                                values["b_expiry"]
                              );
                              requestData.append("mrp", values["mrp"]);
                              //  requestData.append("supplier_id", selectedSupplier.id);
                              requestData.append("b_no", values["b_no"]);
                              //! console.log("After values", JSON.stringify(values));
                              // for (const pair of requestData.entries()) {
                              //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
                              // }
                              createBatchDetails(requestData)
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
                                    this.setState({ addBatch: false });
                                    this.getProductBatchList(
                                      rowIndex,
                                      "batch",
                                      true
                                    );
                                    resetForm();
                                    // this.setState({
                                    //   new_batch: true,
                                    // });
                                    let batchid = batchDataList.length;
                                    console.log("batchid", batchid);
                                    setTimeout(() => {
                                      document
                                        .getElementById(
                                          "composite-productBatchTr_" + batchid
                                        )
                                        .focus();
                                    }, 1300);
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: res.message,
                                      // is_button_show: true,
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                  }
                                })
                                .catch((error) => {
                                  console.log("error", error);
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
                              isSubmitting,
                              resetForm,
                            }) => (
                              <Form
                                className=""
                                onSubmit={handleSubmit}
                                autoComplete="off"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <div
                                  style={{
                                    background: "#E6F2F8",
                                    borderBottom: "1px solid #dcdcdc",
                                  }}
                                  className="p-2"
                                >
                                  <Row className=""
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 40) {
                                        document.getElementById(`composite-productBatchTr_0`)?.focus();
                                      }
                                    }}
                                  >
                                    <Col lg={3}>
                                      <Row>
                                        <Col lg={4} className="pe-0">
                                          <Form.Label className="batch-label">
                                            Batch No.
                                          </Form.Label>
                                        </Col>
                                        <Col lg={8}>
                                          <Form.Group>
                                            <Form.Control
                                              autoFocus
                                              autoComplete="off"
                                              type="text"
                                              className="batch-text"
                                              placeholder="Batch No"
                                              name="b_no"
                                              id="b_no"
                                              onChange={handleChange}
                                              value={values.b_no}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                            />
                                          </Form.Group>
                                          <span className="text-danger">
                                            {errors.b_no}
                                          </span>
                                        </Col>
                                      </Row>
                                    </Col>

                                    <Col lg={9} className="ps-0">
                                      <Row>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={5}>
                                              <Form.Label className="batch-label">
                                                MFG Dt
                                              </Form.Label>
                                            </Col>
                                            <Col lg={7} className="p-0">
                                              <MyTextDatePicker
                                                className="batch-date"
                                                // innerRef={(input) => {
                                                //   this.mfgDateRef.current = input;
                                                // }}
                                                autoComplete="off"
                                                name="manufacturing_date"
                                                id="manufacturing_date"
                                                placeholder="DD/MM/YYYY"
                                                value={
                                                  values.manufacturing_date
                                                }
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log("datchco", datchco);
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // console.log("checkdate", checkdate);
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate == "Invalid date"
                                                      datchco.includes("_")
                                                    ) {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Correct Date. ",
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        document
                                                          .getElementById(
                                                            "manufacturing_date"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (
                                                    e.key === "Tab" ||
                                                    e.keyCode == 13
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log("datchco", datchco);
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // console.log("checkdate", checkdate);
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      checkdate ==
                                                      "Invalid date" &&
                                                      datchco.includes("_")
                                                    ) {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Correct Date. ",
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        document
                                                          .getElementById(
                                                            "manufacturing_date"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      // this.focusNextElement(e)
                                                      document
                                                        .getElementById(
                                                          "b_expiry"
                                                        )
                                                        .focus();
                                                    }
                                                  }
                                                }}
                                                // onKeyDown={(e) => {
                                                //   if (e.shiftKey && e.key === "Tab") {
                                                //     let datchco = e.target.value.trim();
                                                //     // console.log("datchco", datchco);
                                                //     let checkdate = moment(e.target.value).format(
                                                //       "DD/MM/YYYY"
                                                //     );
                                                //     // console.log("checkdate", checkdate);
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate == "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg: "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         this.mfgDateRef.current.focus();
                                                //       }, 1000);
                                                //     }
                                                //   } else if (e.key === "Tab") {
                                                //     let datchco = e.target.value.trim();
                                                //     // console.log("datchco", datchco);
                                                //     let checkdate = moment(e.target.value).format(
                                                //       "DD/MM/YYYY"
                                                //     );
                                                //     // console.log("checkdate", checkdate);
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate == "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg: "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         this.mfgDateRef.current.focus();
                                                //       }, 1000);
                                                //     }
                                                //   }
                                                // }}
                                                onBlur={(e) => {
                                                  //console.log("e ", e);
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    if (
                                                      moment(
                                                        e.target.value,
                                                        "DD-MM-YYYY"
                                                      ).isValid() == true
                                                    ) {
                                                      let curdate = new Date();

                                                      let mfgDate = new Date(
                                                        moment(
                                                          e.target.value,
                                                          "DD/MM/YYYY"
                                                        ).toDate()
                                                      );
                                                      let curdatetime =
                                                        curdate.getTime();
                                                      let mfgDateTime =
                                                        mfgDate.getTime();
                                                      if (
                                                        curdatetime >=
                                                        mfgDateTime
                                                      ) {
                                                        setFieldValue(
                                                          "manufacturing_date",
                                                          e.target.value
                                                        );
                                                        // this.checkInvoiceDateIsBetweenFYFun(
                                                        //   e.target.value
                                                        // );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg: "Mfg Date Should not be Greater than todays date",
                                                          // is_button_show: true,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        // setFieldValue("manufacturing_date", "");
                                                        setTimeout(() => {
                                                          this.mfgDateRef.current?.focus();
                                                        }, 1000);
                                                      }
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Invalid date",
                                                        // is_button_show: true,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        this.mfgDateRef.current?.focus();
                                                      }, 1000);
                                                      // setFieldValue("manufacturing_date", "");
                                                    }
                                                  } else {
                                                    // setFieldValue("manufacturing_date", "");
                                                  }
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={5}>
                                              <Form.Label className="batch-label">
                                                Expiry Dt
                                              </Form.Label>
                                            </Col>
                                            <Col lg={7} className="p-0">
                                              <MyTextDatePicker
                                                className="batch-date"
                                                // innerRef={(input) => {
                                                //   this.batchdpRef.current = input;
                                                // }}
                                                autoComplete="off"
                                                name="b_expiry"
                                                id="b_expiry"
                                                placeholder="DD/MM/YYYY"
                                                value={values.b_expiry}
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log("datchco", datchco);
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // console.log("checkdate", checkdate);
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate == "Invalid date"
                                                      datchco.includes("_")
                                                    ) {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Correct Date. ",
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        document
                                                          .getElementById(
                                                            "b_expiry"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (
                                                    e.key === "Tab" ||
                                                    e.keyCode == 13
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log("datchco", datchco);
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // console.log("checkdate", checkdate);
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate == "Invalid date"
                                                      datchco.includes("_")
                                                    ) {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Correct Date. ",
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        document
                                                          .getElementById(
                                                            "b_expiry"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else if (
                                                      e.keyCode == 13
                                                    ) {
                                                      document
                                                        .getElementById("mrp")
                                                        .focus();
                                                    }
                                                  }
                                                }}
                                                onBlur={(e) => {
                                                  //console.log("e ", e);

                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    if (
                                                      moment(
                                                        e.target.value,
                                                        "DD-MM-YYYY"
                                                      ).isValid() == true
                                                    ) {
                                                      let mfgDate = "";
                                                      if (
                                                        values.manufacturing_date !=
                                                        ""
                                                      ) {
                                                        mfgDate = new Date(
                                                          moment(
                                                            values.manufacturing_date,
                                                            " DD-MM-yyyy"
                                                          ).toDate()
                                                        );
                                                        let currentDate =
                                                          new Date();
                                                        let curdatetime =
                                                          currentDate.getTime();
                                                        let expDate = new Date(
                                                          moment(
                                                            e.target.value,
                                                            "DD/MM/YYYY"
                                                          ).toDate()
                                                        );
                                                        if (
                                                          mfgDate.getTime() <
                                                          expDate.getTime() &&
                                                          curdatetime <=
                                                          expDate.getTime()
                                                        ) {
                                                          setFieldValue(
                                                            "b_expiry",
                                                            e.target.value
                                                          );
                                                          // this.checkInvoiceDateIsBetweenFYFun(
                                                          //   e.target.value
                                                          // );
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg: "Expiry date should be greater MFG date / Current Date",
                                                            // is_button_show: true,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          // setFieldValue("b_expiry", "");
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "b_expiry"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                        // }else{

                                                        //   MyNotifications.fire({
                                                        //     show: true,
                                                        //     icon: "error",
                                                        //     title: "Error",
                                                        //     msg: "Expiry date should be greater current date",
                                                        //     is_button_show: true,
                                                        //   });
                                                        //   setFieldValue("b_expiry", "");
                                                        //   this.newbatchdpRef.current.focus();   //console.log("expirt date is not greater than today")
                                                        // }
                                                      } else if (
                                                        values.manufacturing_date ==
                                                        ""
                                                      ) {
                                                        let currentDate =
                                                          new Date();
                                                        let curDate = new Date(
                                                          moment(
                                                            e.target.value,
                                                            "DD-MM-yyyy"
                                                          ).toDate()
                                                        );
                                                        let curdatetime =
                                                          currentDate.getTime();
                                                        let curdatet =
                                                          curDate.getTime();
                                                        // console.log("curdatetime", curdatetime);
                                                        if (
                                                          curdatetime < curdatet
                                                        ) {
                                                          // console.log(
                                                          //   "curdatetime < curdatet",
                                                          //   curdatetime < curdatet
                                                          // );
                                                          setFieldValue(
                                                            "b_expiry",
                                                            e.target.value
                                                          );
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg: "Expiry date should be greater current date",
                                                            // is_button_show: true,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          // setFieldValue("b_expiry", "");
                                                          setTimeout(() => {
                                                            this.newbatchdpRef.current.focus();
                                                          }, 1000);
                                                        }
                                                      } else {
                                                        setFieldValue(
                                                          "b_expiry",
                                                          e.target.value
                                                        );
                                                      }
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Invalid date",
                                                        // is_button_show: true,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                      setTimeout(() => {
                                                        this.newbatchdpRef.current.focus();
                                                      }, 1000);
                                                      // setFieldValue("b_expiry", "");
                                                    }
                                                  } else {
                                                    // setFieldValue("b_expiry", "");
                                                  }
                                                }}
                                              // onKeyDown={(e) => {
                                              //   if (e.shiftKey && e.key === "Tab") {
                                              //     let datchco = e.target.value.trim();
                                              //     // console.log("datchco", datchco);
                                              //     let checkdate = moment(e.target.value).format(
                                              //       "DD/MM/YYYY"
                                              //     );
                                              //     // console.log("checkdate", checkdate);
                                              //     if (
                                              //       datchco != "__/__/____" &&
                                              //       // checkdate == "Invalid date"
                                              //       datchco.includes("_")
                                              //     ) {
                                              //       MyNotifications.fire({
                                              //         show: true,
                                              //         icon: "error",
                                              //         title: "Error",
                                              //         msg: "Please Enter Correct Date. ",
                                              //         is_timeout: true,
                                              //         delay: 1500,
                                              //       });
                                              //       setTimeout(() => {
                                              //         this.batchdpRef.current.focus();
                                              //       }, 1000);
                                              //     }
                                              //   } else if (e.key === "Tab") {
                                              //     let datchco = e.target.value.trim();
                                              //     // console.log("datchco", datchco);
                                              //     let checkdate = moment(e.target.value).format(
                                              //       "DD/MM/YYYY"
                                              //     );
                                              //     // console.log("checkdate", checkdate);
                                              //     if (
                                              //       datchco != "__/__/____" &&
                                              //       // checkdate == "Invalid date"
                                              //       datchco.includes("_")
                                              //     ) {
                                              //       MyNotifications.fire({
                                              //         show: true,
                                              //         icon: "error",
                                              //         title: "Error",
                                              //         msg: "Please Enter Correct Date. ",
                                              //         is_timeout: true,
                                              //         delay: 1500,
                                              //       });
                                              //       setTimeout(() => {
                                              //         this.batchdpRef.current.focus();
                                              //       }, 1000);
                                              //     }
                                              //   }
                                              // }}
                                              // onBlur={(e) => {
                                              //   //console.log("e ", e);

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
                                              //       let mfgDate = "";
                                              //       if (values.manufacturing_date != "") {
                                              //         mfgDate = new Date(
                                              //           moment(
                                              //             values.manufacturing_date,
                                              //             " DD-MM-yyyy"
                                              //           ).toDate()
                                              //         );
                                              //         let currentDate = new Date();
                                              //         let curdatetime = currentDate.getTime();
                                              //         let expDate = new Date(
                                              //           moment(
                                              //             e.target.value,
                                              //             "DD/MM/YYYY"
                                              //           ).toDate()
                                              //         );
                                              //         if (
                                              //           mfgDate.getTime() < expDate.getTime() &&
                                              //           curdatetime <= expDate.getTime()
                                              //         ) {
                                              //           setFieldValue(
                                              //             "b_expiry",
                                              //             e.target.value
                                              //           );
                                              //           // this.checkInvoiceDateIsBetweenFYFun(
                                              //           //   e.target.value
                                              //           // );
                                              //         } else {
                                              //           MyNotifications.fire({
                                              //             show: true,
                                              //             icon: "error",
                                              //             title: "Error",
                                              //             msg: "Expiry date should be greater MFG date / Current Date",
                                              //             // is_button_show: true,
                                              //             is_timeout: true,
                                              //             delay: 1500,
                                              //           });
                                              //           // setFieldValue("b_expiry", "");
                                              //           setTimeout(() => {
                                              //             this.batchdpRef.current.focus();
                                              //           }, 1000);
                                              //         }

                                              //       } else if (
                                              //         values.manufacturing_date == ""
                                              //       ) {
                                              //         let currentDate = new Date();
                                              //         let curDate = new Date(
                                              //           moment(
                                              //             e.target.value,
                                              //             "DD-MM-yyyy"
                                              //           ).toDate()
                                              //         );
                                              //         let curdatetime = currentDate.getTime();
                                              //         let curdatet = curDate.getTime();

                                              //         if (curdatetime < curdatet) {

                                              //           setFieldValue(
                                              //             "b_expiry",
                                              //             e.target.value
                                              //           );
                                              //         } else {
                                              //           MyNotifications.fire({
                                              //             show: true,
                                              //             icon: "error",
                                              //             title: "Error",
                                              //             msg: "Expiry date should be greater current date",

                                              //             is_timeout: true,
                                              //             delay: 1500,
                                              //           });

                                              //           setTimeout(() => {
                                              //             this.batchdpRef.current.focus();
                                              //           }, 1000);
                                              //         }
                                              //       } else {
                                              //         setFieldValue("b_expiry", e.target.value);
                                              //       }
                                              //     } else {
                                              //       MyNotifications.fire({
                                              //         show: true,
                                              //         icon: "error",
                                              //         title: "Error",
                                              //         msg: "Invalid date",
                                              //         // is_button_show: true,
                                              //         is_timeout: true,
                                              //         delay: 1500,
                                              //       });
                                              //       setTimeout(() => {
                                              //         this.batchdpRef.current.focus();
                                              //       }, 1000);
                                              //       // setFieldValue("b_expiry", "");
                                              //     }
                                              //   } else {
                                              //     // setFieldValue("b_expiry", "");
                                              //   }
                                              // }}
                                              />
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={3}>
                                          <Row>
                                            <Col lg={4}>
                                              <Form.Label className="batch-label">
                                                {" "}
                                                MRP
                                              </Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  autoComplete="off"
                                                  type="text"
                                                  placeholder="0.00"
                                                  name="mrp"
                                                  id="mrp"
                                                  className="batch-text text-end"
                                                  onChange={handleChange}
                                                  value={values.mrp}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      document
                                                        .getElementById(
                                                          "newBatchSubmitBtn"
                                                        )
                                                        .focus();
                                                    }
                                                  }}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={1} className="ps-0">
                                          <Button
                                            id="newBatchSubmitBtn"
                                            className="batch-submit"
                                            type="submit"
                                            onKeyDown={(e) => {
                                              if (e.keyCode === 32) {
                                                e.preventDefault();
                                              } else if (e.keyCode === 13) {
                                                this.formRef.current.handleSubmit();
                                                document
                                                  .getElementById(
                                                    `composite-productBatchTr_0`
                                                  )
                                                  ?.focus();
                                              }
                                            }}
                                          >
                                            Add
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                        <div className="batch-table">
                          <Table
                            onKeyDown={(e) => {
                              //batchS
                              e.preventDefault();
                              if (e.keyCode != 9) {
                                if (ismodify === false) {
                                  this.handleBatchTableRow(e);
                                }
                              }
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  borderBottom: "2px solisd transparent",
                                }}
                              >
                                <th>
                                  {/* <Row>
                            <Col lg={7}>Batch</Col>
                            <Col lg={5} className="text-end">
                              <Button
                                className="add-btn"
                                onClick={(e) => {
                                  this.setState({ addBatch: true });
                                }}
                              >
                                + Add Batch
                              </Button>
                            </Col>
                          </Row> */}
                                  Batch
                                </th>

                                <th>MFG Date</th>
                                <th>Expiry</th>
                                <th>MRP</th>
                                <th>Opn.Stk</th>
                                <th>Curr Stk</th>
                                <th>Pur.Rate</th>
                                <th>Cost</th>
                                <th>Cost with tax</th>
                                <th>Sale Rate</th>
                                <th style={{ width: "5%" }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {/* {JSON.stringify(batchDataList)} */}
                              {batchDataList &&
                                batchDataList.length > 0 &&
                                batchDataList.map((v, i) => {
                                  return ismodify == true &&
                                    modifyIndex == i ? (
                                    <tr>
                                      <td
                                        className="p-0"
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          padding: "0px",
                                          textAlign: "end",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            placeholder="Batch No"
                                            name="modify_batch_no"
                                            id="modify_batch_no"
                                            className="mdl-text-box-style text-end"
                                            onChange={(e) => {
                                              let val = e.target.value;
                                              // console.log("val", val);
                                              this.handleModifyElement(
                                                "batch_no",
                                                val
                                              );
                                            }}
                                            value={modifyObj.batch_no}
                                          />
                                        </Form.Group>
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          padding: "0px",
                                        }}
                                      >
                                        <Form.Group>
                                          <MyTextDatePicker
                                            className="mdl-text-box-style text-end"
                                            innerRef={(input) => {
                                              this.edtmfgDateRef.current =
                                                input;
                                            }}
                                            autoComplete="off"
                                            name="modify_manufacturing_date"
                                            id="modify_manufacturing_date"
                                            placeholder="DD/MM/YYYY"
                                            value={modifyObj.manufacturing_date}
                                            onChange={(e) => {
                                              // console.log("date", e);
                                              e.preventDefault();
                                              let val = e.target.value;
                                              // console.log("val", val);
                                              this.handleModifyElement(
                                                "manufacturing_date",
                                                val
                                              );
                                            }}
                                            onKeyDown={(e) => {
                                              if (
                                                e.shiftKey &&
                                                e.key === "Tab"
                                              ) {
                                                let datchco =
                                                  e.target.value.trim();
                                                // console.log("datchco", datchco);
                                                let checkdate = moment(
                                                  e.target.value
                                                ).format("DD/MM/YYYY");
                                                // console.log("checkdate", checkdate);
                                                if (
                                                  datchco != "__/__/____" &&
                                                  // checkdate == "Invalid date"
                                                  datchco.includes("_")
                                                ) {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Please Enter Correct Date. ",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    this.mfgDateRef.current.focus();
                                                  }, 1000);
                                                }
                                              } else if (e.key === "Tab") {
                                                let datchco =
                                                  e.target.value.trim();
                                                // console.log("datchco", datchco);
                                                let checkdate = moment(
                                                  e.target.value
                                                ).format("DD/MM/YYYY");
                                                // console.log("checkdate", checkdate);
                                                if (
                                                  datchco != "__/__/____" &&
                                                  // checkdate == "Invalid date"
                                                  datchco.includes("_")
                                                ) {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Please Enter Correct Date. ",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    this.edtmfgDateRef.current.focus();
                                                  }, 1000);
                                                }
                                              }
                                            }}
                                            onBlur={(e) => {
                                              if (
                                                e.target.value != null &&
                                                e.target.value != ""
                                              ) {
                                                if (
                                                  moment(
                                                    e.target.value,
                                                    "DD-MM-YYYY"
                                                  ).isValid() == true
                                                ) {
                                                  let curdate = new Date();

                                                  let mfgDate = new Date(
                                                    moment(
                                                      e.target.value,
                                                      "DD/MM/YYYY"
                                                    ).toDate()
                                                  );
                                                  let curdatetime =
                                                    curdate.getTime();
                                                  let mfgDateTime =
                                                    mfgDate.getTime();

                                                  if (
                                                    curdatetime < mfgDateTime
                                                  ) {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Mfg Date Should not be Greater than todays date",
                                                      // is_button_show: true,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                    this.handleModifyElement(
                                                      "manufacturing_date",
                                                      ""
                                                    );
                                                    setTimeout(() => {
                                                      this.edtmfgDateRef.current.focus();
                                                    }, 1000);
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid date",
                                                    // is_button_show: true,
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                }
                                              } else {
                                              }
                                            }}
                                          />
                                        </Form.Group>
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          padding: "0px",
                                        }}
                                      >
                                        <Form.Group>
                                          <MyTextDatePicker
                                            className="mdl-text-box-style text-end"
                                            innerRef={(input) => {
                                              this.edtbatchdpRef.current =
                                                input;
                                            }}
                                            autoComplete="off"
                                            name="expiry_date"
                                            id="expiry_date"
                                            placeholder="DD/MM/YYYY"
                                            value={modifyObj.expiry_date}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              let val = e.target.value;
                                              this.handleModifyElement(
                                                "expiry_date",
                                                val
                                              );
                                            }}
                                            onKeyDown={(e) => {
                                              if (
                                                e.shiftKey &&
                                                e.key === "Tab"
                                              ) {
                                                let datchco =
                                                  e.target.value.trim();
                                                // console.log("datchco", datchco);
                                                let checkdate = moment(
                                                  e.target.value
                                                ).format("DD/MM/YYYY");
                                                // console.log("checkdate", checkdate);
                                                if (
                                                  datchco != "__/__/____" &&
                                                  // checkdate == "Invalid date"
                                                  datchco.includes("_")
                                                ) {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Please Enter Correct Date. ",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    this.batchdpRef.current.focus();
                                                  }, 1000);
                                                }
                                              } else if (e.key === "Tab") {
                                                let datchco =
                                                  e.target.value.trim();
                                                // console.log("datchco", datchco);
                                                let checkdate = moment(
                                                  e.target.value
                                                ).format("DD/MM/YYYY");
                                                // console.log("checkdate", checkdate);
                                                if (
                                                  datchco != "__/__/____" &&
                                                  // checkdate == "Invalid date"
                                                  datchco.includes("_")
                                                ) {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Please Enter Correct Date. ",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    this.edtbatchdpRef.current.focus();
                                                  }, 1000);
                                                }
                                              }
                                            }}
                                          // onBlur={(e) => {
                                          //   //console.log("e ", e);
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
                                          //       let mfgDate = "";
                                          //       if (modifyObj.manufacturing_date != "") {
                                          //         mfgDate = new Date(
                                          //           moment(
                                          //             modifyObj.manufacturing_date,
                                          //             " DD-MM-yyyy"
                                          //           ).toDate()
                                          //         );
                                          //         let currentDate = new Date();
                                          //         let curdatetime = currentDate.getTime();
                                          //         let expDate = new Date(
                                          //           moment(
                                          //             e.target.value,
                                          //             "DD/MM/YYYY"
                                          //           ).toDate()
                                          //         );
                                          //         if (
                                          //           mfgDate.getTime() <
                                          //             expDate.getTime() &&
                                          //           curdatetime <= expDate.getTime()
                                          //         ) {
                                          //           // ! DO Nothing
                                          //           // setFieldValue(
                                          //           //   "b_expiry",
                                          //           //   e.target.value
                                          //           // );
                                          //         } else {
                                          //           MyNotifications.fire({
                                          //             show: true,
                                          //             icon: "error",
                                          //             title: "Error",
                                          //             msg: "Expiry date should be greater MFG date / Current Date",
                                          //             // is_button_show: true,
                                          //             is_timeout: true,
                                          //             delay: 1500,
                                          //           });
                                          //           this.handleModifyElement(
                                          //             "expiry_date",
                                          //             ""
                                          //           );

                                          //           setTimeout(() => {
                                          //             this.edtbatchdpRef.current.focus();
                                          //           }, 1000);
                                          //         }
                                          //       } else if (
                                          //         modifyObj.manufacturing_date == ""
                                          //       ) {
                                          //         let currentDate = new Date();
                                          //         let curDate = new Date(
                                          //           moment(
                                          //             e.target.value,
                                          //             "DD-MM-yyyy"
                                          //           ).toDate()
                                          //         );
                                          //         let curdatetime = currentDate.getTime();
                                          //         let curdatet = curDate.getTime();
                                          //         // console.log("curdatetime", curdatetime);
                                          //         if (curdatetime > curdatet) {
                                          //           MyNotifications.fire({
                                          //             show: true,
                                          //             icon: "error",
                                          //             title: "Error",
                                          //             msg: "Expiry date should be greater current date",
                                          //             // is_button_show: true,
                                          //             is_timeout: true,
                                          //             delay: 1500,
                                          //           });
                                          //           this.handleModifyElement(
                                          //             "expiry_date",
                                          //             ""
                                          //           );

                                          //           setTimeout(() => {
                                          //             this.edtbatchdpRef.current.focus();
                                          //           }, 1000);
                                          //         }
                                          //       }
                                          //     } else {
                                          //       MyNotifications.fire({
                                          //         show: true,
                                          //         icon: "error",
                                          //         title: "Error",
                                          //         msg: "Invalid date",
                                          //         // is_button_show: true,
                                          //         is_timeout: true,
                                          //         delay: 1500,
                                          //       });
                                          //       this.handleModifyElement(
                                          //         "expiry_date",
                                          //         ""
                                          //       );
                                          //       setTimeout(() => {
                                          //         this.edtbatchdpRef.current.focus();
                                          //       }, 1000);
                                          //       // setFieldValue("b_expiry", "");
                                          //     }
                                          //   } else {
                                          //     // setFieldValue("b_expiry", "");
                                          //   }
                                          // }}
                                          />
                                        </Form.Group>
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          padding: "0px",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            name="modify_mrp"
                                            id="modify_mrp"
                                            className="mdl-text-box-style text-end"
                                            onChange={(e) => {
                                              e.preventDefault();
                                              let val = e.target.value;
                                              this.handleModifyElement(
                                                "mrp",
                                                val
                                              );
                                            }}
                                            value={modifyObj.mrp}
                                          />
                                        </Form.Group>
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {isNaN(
                                          INRformat.format(v.opening_stock)
                                        )
                                          ? 0
                                          : INRformat.format(v.opening_stock)}
                                        {/* {modifyObj.closing_stock} */}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {isNaN(
                                          INRformat.format(v.closing_stock)
                                        )
                                          ? 0
                                          : INRformat.format(v.closing_stock)}
                                        {/* {modifyObj.closing_stock} */}
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {modifyObj.purchase_rate} */}
                                        {isNaN(
                                          INRformat.format(v.purchase_rate)
                                        )
                                          ? 0
                                          : INRformat.format(v.purchase_rate)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {modifyObj.costing
                              ? parseFloat(modifyObj.costing).toFixed(2)
                              : ""} */}
                                        {isNaN(INRformat.format(v.costing))
                                          ? 0
                                          : INRformat.format(v.costing)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {modifyObj.costingWithTax
                              ? parseFloat(modifyObj.costingWithTax).toFixed(2)
                              : ""} */}
                                        {/* {INRformat.format(v.taxable_amt)} */}
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {modifyObj.min_rate_a} */}
                                        {isNaN(INRformat.format(v.min_rate_a))
                                          ? 0
                                          : INRformat.format(v.min_rate_a)}
                                      </td>

                                      <td className="text-center d-flex">
                                        <img
                                          src={rightCheckMark}
                                          alt=""
                                          className="batch-img"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.updateBatchData();
                                            // console.log("update clicked");
                                          }}
                                        />
                                        <img
                                          src={wrongCheckMark}
                                          alt=""
                                          className="batch-img"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.clearModifyData();
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr
                                      value={JSON.stringify(v)}
                                      id={`composite-productBatchTr_` + i}
                                      prId={v.id}
                                      tabIndex={i}
                                      onFocus={(e) => {
                                        e.preventDefault();
                                        // console.log("mouse over--", e.target.value);
                                        this.transaction_batch_detailsFun(v);
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // this.setState(
                                        //   {
                                        //     b_details_id: v,
                                        //     tr_id: i + 1,
                                        //     is_expired: v.is_expired,
                                        //     batch_data_selected: v,
                                        //   },
                                        //   () => {
                                        //     this.transaction_batch_detailsFun(v);
                                        //   }
                                        // );
                                        this.setState({
                                          batch_data_selected: v,
                                          b_details_id: v,
                                          tr_id: i + 1,
                                          is_expired: v.is_expired,
                                          selectedLedgerIndex: i,
                                        });
                                        // this.transaction_batch_detailsFun(v);
                                        this.transaction_batch_detailsFun(v);
                                      }}
                                      // className={`${
                                      //   new_batch == true && batchDataList.length == i + 1
                                      //     ? "tr-color"
                                      //     : is_expired != true
                                      //     ? tr_id == i + 1
                                      //       ? "tr-color"
                                      //       : ""
                                      //     : ""
                                      // }`}
                                      onDoubleClick={(e) => {
                                        e.preventDefault();
                                        let {
                                          rows,
                                          rowIndex,
                                          b_details_id,
                                          is_expired,
                                          selectedSupplier,
                                        } = this.state;
                                        console.log(
                                          "Double Click b_details_id =->",
                                          b_details_id
                                        );
                                        let batchError = false;

                                        if (b_details_id != 0) {
                                          batchError = false;
                                          // let salesrate = b_details_id.min_rate_a;

                                          // if (
                                          //   selectedSupplier &&
                                          //   parseInt(selectedSupplier.salesRate) == 2
                                          // ) {
                                          //   salesrate = b_details_id.min_rate_b;
                                          // } else if (
                                          //   selectedSupplier &&
                                          //   parseInt(selectedSupplier.salesRate) == 3
                                          // ) {
                                          //   salesrate = b_details_id.min_rate_c;
                                          // }
                                          // if (
                                          //   saleRateType == "sale" ||
                                          //   transactionType == "sales_invoice" ||
                                          //   transactionType == "sales_edit"
                                          // ) {
                                          //   rows[rowIndex]["rate"] = salesrate;
                                          //   rows[rowIndex]["sales_rate"] = salesrate;
                                          // } else {
                                          //   rows[rowIndex]["rate"] =
                                          //     b_details_id.purchase_rate;
                                          //   rows[rowIndex]["sales_rate"] = salesrate;
                                          // }

                                          rows[rowIndex]["rate"] =
                                            b_details_id.mrp;
                                          // rows[rowIndex]["rate"] =
                                          //   b_details_id.salesrate;

                                          rows[rowIndex]["b_details_id"] =
                                            b_details_id.id;
                                          rows[rowIndex]["b_no"] =
                                            b_details_id.batch_no;
                                          rows[rowIndex]["b_rate"] =
                                            b_details_id.mrp;

                                          rows[rowIndex]["rate_a"] =
                                            b_details_id.min_rate_a;
                                          rows[rowIndex]["rate_b"] =
                                            b_details_id.min_rate_b;
                                          rows[rowIndex]["rate_c"] =
                                            b_details_id.min_rate_c;
                                          rows[rowIndex]["margin_per"] =
                                            b_details_id.min_margin;
                                          rows[rowIndex]["b_purchase_rate"] =
                                            b_details_id.purchase_rate;
                                          // rows[rowIndex]["costing"] = values.costing;
                                          // rows[rowIndex]["costingWithTax"] =
                                          //   values.costingWithTax;

                                          rows[rowIndex]["b_expiry"] =
                                            b_details_id.expiry_date != ""
                                              ? b_details_id.expiry_date
                                              : "";

                                          rows[rowIndex]["manufacturing_date"] =
                                            b_details_id.manufacturing_date !=
                                              ""
                                              ? b_details_id.manufacturing_date
                                              : "";

                                          rows[rowIndex]["is_batch"] = isBatch;
                                        }
                                        this.setState({
                                          batch_error: batchError,
                                          isBatchOpen: false,
                                          rowIndex: -1,
                                          b_details_id: 0,
                                          isBatch: isBatch,
                                          rows: rows,
                                        });
                                      }}
                                    >
                                      <td
                                        className="text-end"
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          // padding: "0px",
                                        }}
                                      >
                                        {/* <pre>{JSON.stringify(v, undefined, 2)}</pre> */}
                                        {v.batch_no}
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {v.manufacturing_date}
                                        {/* {moment(v.manufacturing_date).format(
                              "DD-MM-YYYY"
                            ) === "Invalid date"
                              ? ""
                              : moment(v.manufacturing_date).format(
                                "DD-MM-YYYY"
                              )} */}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {v.expiry_date}
                                        {/* {moment(v.expiry_date).format("DD-MM-YYYY") ===
                              "Invalid date"
                              ? ""
                              : moment(v.expiry_date).format("DD-MM-YYYY")} */}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          // padding: "0px",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.mrp} */}
                                        {isNaN(v.mrp)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.mrp)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.closing_stock} */}
                                        {isNaN(v.opening_stock)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.opening_stock)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.closing_stock} */}
                                        {isNaN(v.closing_stock)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.closing_stock)}
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.purchase_rate} */}
                                        {isNaN(v.purchase_rate)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.purchase_rate)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.costing ? parseFloat(v.costing).toFixed(2) : ""} */}
                                        {isNaN(v.costing)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.costing)}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.costingWithTax
                              ? parseFloat(v.costingWithTax).toFixed(2)
                              : ""} */}
                                        {isNaN(v.costingWithTax)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.costingWithTax)}
                                      </td>

                                      <td
                                        style={{
                                          borderRight: "1px solid #dcdcdc",
                                          textAlign: "end",
                                        }}
                                      >
                                        {/* {v.min_rate_a} */}
                                        {isNaN(v.min_rate_a)
                                          ? INRformat.format(0)
                                          : INRformat.format(v.min_rate_a)}
                                      </td>

                                      <td className="text-center d-flex">
                                        <img
                                          src={Frame}
                                          className="batch-edit"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            // enable the row editable
                                            // v["manufacturing_date"] =
                                            //   v["manufacturing_date"] != ""
                                            //     ? moment(
                                            //         v["manufacturing_date"],
                                            //         "DD/MM/YYYY"
                                            //       ).toDate()
                                            //     : "";
                                            // v["b_expiry"] =
                                            //   v["b_expiry"] != ""
                                            //     ? moment(
                                            //         v["b_expiry"],
                                            //         "DD/MM/YYYY"
                                            //       ).toDate()
                                            //     : "";
                                            this.handleModifyEnable(i, v);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Row>
                  ) : (
                    ""
                  )}

                  <Row className="">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Row className="counter_sale_btm_part mx-0 px-2">
                        <Col lg="3" md="3" sm={3} xs="3" className="">
                          <Row>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              xs={3}
                              className=" paddingtop"
                            >
                              <Form.Label>
                                Payment Mode
                                <label style={{ color: "red" }}>*</label>
                              </Form.Label>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              xs={3}
                              className="paddingtop"
                            >
                              <Form.Group
                                style={{ width: "fit-content" }}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.key === "Tab") {
                                  } else if (e.key === "Tab" && !values.mode)
                                    e.preventDefault();
                                }}
                                className="d-flex"
                              >
                                <Form.Check
                                  className="mx-2"
                                  // ref={this.radioRef}
                                  type="radio"
                                  name="mode"
                                  id="mode2"
                                  label="All"
                                  value="credit"
                                  checked={
                                    values.mode == "credit" ? true : false
                                  }
                                  onChange={(e) => {
                                    let aa = e.target.value;
                                    console.log("aa", aa);
                                    this.setSalesInvoiceEditData();
                                  }}
                                  autoComplete="true"
                                />
                                <Form.Check
                                  // ref={this.radioRef}
                                  type="radio"
                                  id="mode1"
                                  name="mode"
                                  label="Cash"
                                  value="cash"
                                  checked={values.mode == "cash" ? true : false}
                                  onChange={(e) => {
                                    let aa = e.target.value;
                                    console.log("aa", aa);
                                    this.setSalesInvoiceEditData(aa);
                                  }}
                                  autoComplete="true"
                                />

                                <Form.Check
                                  // ref={this.radioRef}
                                  type="radio"
                                  name="mode"
                                  id="mode3"
                                  label="Multi"
                                  value="multi"
                                  checked={
                                    values.mode == "multi" ? true : false
                                  }
                                  onChange={(e) => {
                                    let aa = e.target.value;
                                    console.log("aa", aa);
                                    this.setSalesInvoiceEditData(aa);
                                  }}
                                  autoComplete="true"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg="2" md="2" sm={2} xs="2"></Col>
                        {/* <Col lg="7" md="7" sm="7" xs="7" className="px-0">
                          <Row className="counter_sale_btm_part">
                            <Col
                              lg="3"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                              className="px-0"
                            >
                              <Row>
                                <Col lg={10}>
                                  <div className="btmpart">
                                    <span>Gross Total:</span>
                                    <span>
                                      {INRformat.format(values.total_base_amt)}
                                    </span>
                                  </div>
                                </Col>
                                <Col lg={1}>
                                  <span style={{ color: "#4ECB8F" }}>|</span>
                                </Col>
                              </Row>
                            </Col>

                            <Col
                              lg="2"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                              className="px-0"
                            >
                              <Row>
                                <Col lg={10}>
                                  <div className="btmpart">
                                    <span>Disc:</span>
                                    <span>
                                      {" "}
                                      {INRformat.format(
                                        values.total_invoice_dis_amt
                                      )}
                                    </span>
                                  </div>
                                </Col>
                                <Col lg={1}>
                                  <span style={{ color: "#4ECB8F" }}>|</span>
                                </Col>
                              </Row>
                            </Col>

                            <Col
                              lg="2"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                              className="px-0"
                            >
                              <Row>
                                <Col lg={10}>
                                  <div className="btmpart">
                                    <span>Total:</span>
                                    <span>
                                      {INRformat.format(
                                        values.total_taxable_amt
                                      )}
                                    </span>
                                  </div>
                                </Col>
                                <Col lg={1}>
                                  <span style={{ color: "#4ECB8F" }}>|</span>
                                </Col>
                              </Row>
                            </Col>

                            <Col
                              lg="2"
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                              className="px-0"
                            >
                              <Row>
                                <Col lg={10}>
                                  <div
                                    className="btmpart"
                                    // style={{ borderRight: "1px solid #4ECB8F" }}
                                  >
                                    <span>Tax :</span>
                                    <span>
                                      {INRformat.format(values.total_tax_amt)}
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="3" className="px-0">
                              <div className="bill">
                                <span>Bill Amount :</span>
                                <span>502.00</span>
                              </div>
                            </Col>
                          </Row>
                        </Col> */}
                      </Row>
                      {/* <Table className="tnx-pur-inv-btm-amt-tbl">
              <tbody>
                <tr>
                  <td className="py-0">Gross Total</td>
                  <td className="p-0 text-end">

                    {INRformat.format(values.total_base_amt)}
                  </td>
                </tr>

                <tr>
                  <td className="py-0">Discount</td>
                  <td className="p-0 text-end">

                    {INRformat.format(values.total_invoice_dis_amt)}
                  </td>
                </tr>

                <tr>
                  <td className="py-0">Total</td>
                  <td className="p-0 text-end">

                    {INRformat.format(values.total_taxable_amt)}

                  </td>
                </tr>
                <tr>
                  <th>Bill Amount</th>
                  <th className="text-end">

                    {INRformat.format(values.bill_amount)}

                  </th>
                </tr>
              </tbody>
            </Table>  */}

                      {/* <p className="btm-row-size">
                        <Button
                          className="successbtn-style"
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              this.myRef.current.handleSubmit();
                            }
                          }}
                        >
                          Submit
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
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_sales_countersale_list"
                                  );
                                },
                                handleFailFn: () => {},
                              },
                              () => {
                                console.warn("return_data");
                              }
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
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
                                    eventBus.dispatch(
                                      "page_change",
                                      "tranx_sales_countersale_list"
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
                          Cancel
                        </Button>
                      </p> */}
                      {/* {JSON.stringify(selectedLedgerNo)} */}
                    </Col>
                  </Row>

                  <Row className="mx-0 btm-rows-btn1">
                    <Col md="2" className="px-0">
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
                    {/* <Col md="8"></Col> */}
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
                    </Col>
                  </Row>
                </>
              </Form>
            )}
          </Formik>

          {/* payment type modal start */}
          <Modal
            show={paymentMdl}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "lg"
            }
            className="modal-style"
            onHide={() => this.setState({ paymentMdl: false })}
            dialogClassName="modal-200w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Payment </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.setState({ paymentMdl: false })}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-invoice-modal p-0">
              <Formik
                innerRef={this.paymentModalRef}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={invoice_data}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  // packageName: Yup.string()
                  //   .nullable()
                  //   .trim()
                  //   // .matches(alphaNumericRex, "Enter alpha-numeric")
                  //   .required("Package name is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  console.log("invoice data", values);
                  let { isRowModify } = this.state;

                  if (values.paymentReference == "") {
                    errorArray.push("Y");
                  } else {
                    errorArray.push("");
                  }

                  this.setState(
                    {
                      errorArrayBorder: errorArray,
                      paymentMode: values.paymentReference,
                    },
                    () => {
                      if (allEqual(errorArray)) {
                        console.log(
                          "form submit values",
                          values,
                          isRowModify,
                          this.state.custSerialNo
                        );
                        // debugger;
                        if (isRowModify == false) {
                          this.callCreateInvoice();
                        } else {
                          this.updateCreateInvoice();
                        }
                      }
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
                  setFieldValue,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="form-style p-0"
                    autoComplete="off"
                  >
                    <Modal.Body
                      className=" border-0"
                      style={{ background: "#E6F2F8" }}
                    >
                      <Row>
                        <Col lg={10}>
                          <Row>
                            <Col lg={2}>
                              <Form.Label>Payment Mode</Form.Label>
                            </Col>
                            <Col lg={4}>
                              <Form.Group
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   if (values.mode) {
                                //     this.setErrorBorder(0, "");
                                //   } else {
                                //     this.setErrorBorder(0, "Y");
                                //     // this.radioRef.current?.focus();
                                //   }
                                // }}
                                className={`${values.paymentReference == "" &&
                                  errorArrayBorder[0] == "Y"
                                  ? "border border-danger d-flex"
                                  : "d-flex"
                                  }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey === true && e.keyCode === 9) { e.preventDefault() }
                                  else if (e.keyCode === 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              >
                                <Form.Check
                                  autoFocus
                                  ref={this.radioRef}
                                  id="mode1"
                                  className="cpt"
                                  name="paymentReference"
                                  type="radio"
                                  value="cash"
                                  label="Cash"
                                  checked={
                                    values.paymentReference === "cash"
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                />
                                <Form.Check
                                  ref={this.radioRef}
                                  className="cpt"
                                  id="mode2"
                                  name="paymentReference"
                                  type="radio"
                                  value="online"
                                  label="Online"
                                  checked={
                                    values.paymentReference === "online"
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                />
                                <Form.Check
                                  id="mode3"
                                  ref={this.radioRef}
                                  className="cpt"
                                  name="paymentReference"
                                  type="radio"
                                  value="multi"
                                  label="Multi"
                                  checked={
                                    values.paymentReference === "multi"
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        id="CSCPM_SubmitBtn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            this.paymentModalRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ paymentMdl: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
          {/* payment type modal end */}

          {/* Payment Modal */}
          <Modal
            show={paymetmodel}
            size="lg"
            className="mt-5 invoice-mdl-style"
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
                // paymentReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("values", values);
                // this.handleFetchData(values);
                const { supplierNameLst } = this.state;
                // this.handleFetchData(invoice_data.clientNameId.value);
                // {
                //   supplierNameLst.map((v, i) => {
                //     return this.handleFetchData(v.value);
                //   });
                // }
                // console.log("supplierNameLst", supplierNameLst);

                // supplierNameLst.map((v, i) => {
                //   if (v.label === "Counter Customer") {
                //     this.handleFetchData(v.value);
                //     console.log("client name", v);
                //   }
                // });
                this.callCreateInvoice();
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
                    </Row>

                    <Button
                      className="create-btn float-end mt-2 mb-2"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* Show Print Modal */}
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
                      this.getInvoiceBillsLstPrint(is_button_show);

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

                      eventBus.dispatch(
                        "page_change",
                        "tranx_sales_countersale_list"
                      );
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
          {/* {Batch modal} */}
          <Modal
            show={batchModal}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
            onHide={() => this.setState({ batchModal: false })}
          >
            <Modal.Header closeButton className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Add Batch
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Form className="" autoComplete="off">
                <div
                  style={{
                    background: "#E6F2F8",
                    borderBottom: "1px solid #dcdcdc",
                  }}
                  className="p-2"
                >
                  <Row className=""
                    onKeyDown={(e) => {
                      if (e.keyCode === 40) {
                        document.getElementById(`composite-productBatchTr_0`)?.focus();
                      }
                    }}
                  >
                    <Col lg={3}>
                      <Row>
                        <Col lg={4}>
                          <Form.Label>Batch No.</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Group>
                            <Form.Control
                              autoFocus
                              autoComplete="off"
                              type="text"
                              className="mdl-text-box-style"
                              placeholder="Batch No"
                              name="b_no"
                              id="b_no"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={5}>
                          <Form.Label>MFG Date</Form.Label>
                        </Col>
                        <Col lg={7}>
                          <MyTextDatePicker
                            className="mdl-text-box-style"
                            autoComplete="off"
                            name="manufacturing_date"
                            id="manufacturing_date"
                            placeholder="DD/MM/YYYY"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={5}>
                          <Form.Label>Expiry Date</Form.Label>
                        </Col>
                        <Col lg={7}>
                          <MyTextDatePicker
                            className="mdl-text-box-style"
                            autoComplete="off"
                            name="b_expiry"
                            id="b_expiry"
                            placeholder="DD/MM/YYYY"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={4}>
                          <Form.Label>MRP</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              placeholder="0.00"
                              name="mrp"
                              id="mrp"
                              className="mdl-text-box-style text-end"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Form>
              <Row style={{ paddingRight: "10px" }}>
                <Col>
                  <Button className="create-btn float-end my-2" type="submit">
                    Add
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </div>
      </>
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

export default connect(mapStateToProps, mapActionsToProps)(CounterSaleCreate);
