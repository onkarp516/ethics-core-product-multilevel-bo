import React, { Component } from "react";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";
import CMPTranxRow from "../../Components/CMPTranxRow";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import closeBtn from "@/assets/images/close_grey_icon@3x.png";

import moment from "moment";
import delete_icon2 from "@/assets/images/delete_icon2.png";
import add_icon from "@/assets/images/add_icon.svg";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
  Alert,
} from "react-bootstrap";

import {
  getPurchaseAccounts,
  getSundryCreditors,
  getLastPurchaseInvoiceNo,
  getProduct,
  createPurchaseInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPurchaseInvoiceShowById,
  getProductFlavourList,
  get_Product_batch,
  listTranxDebitesNotes,
  getValidatePurchaseInvoice,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  checkInvoiceDateIsBetweenFY,
  transaction_ledger_details,
  transaction_ledger_list,
  transaction_product_list,
  product_details_levelB,
  product_details_levelC,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  delete_Product_list,
  product_units,
  getTranxDebitNoteListInvoiceBillSC,
  getTranxPurchaseProductListBillNo,
  getProductFlavorpackageUnitbyid,
  create_purchase_returns_invoices,
  validatePurchaseReturn,
  get_purchase_return_supplierlist_by_productid,
} from "@/services/api_functions";

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
  getValue,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  userControl,
  isUserControl,
  getUserControlLevel,
  getUserControlData,
  flavourDD,
  unitDD,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

const unitOps = [
  { label: "Box", value: "B" },
  { label: "Ctn", value: "C" },
  { label: "Pcs", value: "P" },
];

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

class TranxDebitNoteProductCreateB2B extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();

    this.state = {
      add_button_flag: false,
      currentDate: new Date(),
      product_hover_details: "",
      product_purchase_return_supplier_lst: [],
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      productLst: [],
      productData: "",
      rows: [],
      isBranch: false,
      additionalCharges: [],
      additionalChargesTotal: 0,
      lstDisLedger: [],
      lstAdditionalLedger: [],
      selectedBillsdebit: [],
      selectedPendingOrder: [],
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      outstanding_pur_return_amt: 0,
      purchaseReturnData: "",
      invoiceLstSC: [],
      outstanding: "",
      invoice_data: {
        pi_sr_no: "",
        pi_no: "",
        gstNo: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        debitnoteNo: "",
        newReference: "",
        purchase_discount: 0,
        purchase_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_b_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        purchase_disc_ledger: "",
        total_discount_proportional_amt: 0,
        total_additional_charges_proportional_amt: 0,
        total_invoice_dis_amt: 0,
        gstId: "",
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
      adjusmentbillmodal: false,
      lerdgerCreate: false,
      lstBrand: [],
      batchModalShow: false,
      batchInitVal: "",
      b_details_id: 0,
      isBatch: false,
      tr_id: "",
      fetchBatch: [],
      isBatchNo: "",
      rowIndex: -1,
      brandIndex: -1,
      categoryIndex: -1,
      subcategoryIndex: -1,
      flavourIndex: -1,
      packageIndex: -1,
      unitIndex: -1,
      taxcal: { igst: [], cgst: [], sgst: [] },
      lstGst: [],
      rowDelDetailsIds: [],
      batch_error: false,

      ledgerModal: false,
      ledgerNameModal: false,
      newBatchModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      selectedLedger: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      selectedLedgerNo: 1,
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
    };
  }

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        console.log("Result:", res);
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.label.toLowerCase().includes("purchase")
            );
            console.log("sid:: lstPurchaseAccounts", { v }, v[0]);

            const { prop_data } = this.props.block;

            if (v != null && v != undefined && prop_data.invoice_data != null)
              this.myRef.current.setFieldValue("purchaseId", v[0]);
            else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            )
              this.myRef.current.setFieldValue("purchaseId", v[0]);
          });
        }
      })
      .catch((error) => { });
  };

  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
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
            let stateCode;
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
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
      .catch((error) => { });
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
          });
        }
      })
      .catch((error) => { });
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerData: res.result,
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

  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { invoice_data } = this.state;
          invoice_data["pi_sr_no"] = res.count;
          // initVal["pi_no"] = res.serialNo;
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("pi_sr_no", res.count);
            // this.myRef.current.setFieldValue("pi_no", res.serialNo);
          }
          this.setState({ invoice_data: invoice_data });
        }
      })
      .catch((error) => { });
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
        free_qty: 0,
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
  handleMstState = (rows) => {
    this.setState({ rows: rows });
  };

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
  lstDiscountLedgers = () => {
    getDiscountLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            this.setState({ lstDisLedger: Opt });
          }
        }
      })
      .catch((error) => { });
  };
  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
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
            console.log({ fOpt });
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
      getPurchaseInvoiceShowById(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => { });
    }
    this.setState({ clientinfo: status });
  };

  handleResetForm = () => {
    this.handleclientinfo(true);
  };

  ledgerCreate = () => {
    // eventBus.dispatch("page_change", "ledgercreate");
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_invoice_create_modified",
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
      from: "tranx_purchase_invoice_create_modified",
      to: "newproductcreate",
      isNewTab: true,
      prop_data: { tran_no: TRAN_NO.prd_tranx_purchase_invoice_create },
    });
  };

  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    console.warn(" rahul rowValue ::", showBatch, rowIndex, rowValue);
    this.setState({ rows: rowValue }, () => {
      if (showBatch == true && rowIndex >= 0) {
        this.setState({ rowIndex: rowIndex }, () => {
          this.getProductBatchList(rowIndex);
        });
      }
      this.handleTranxCalculation();
    });
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

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
    });
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

  handleTranxCalculation = (elementFrom = "") => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;

    if (this.myRef.current) {
      console.log("this.myRef.current.values ", this.myRef.current.values);
      let {
        purchase_discount,
        purchase_discount_amt,
        supplierCodeId,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;
      ledger_disc_per = purchase_discount;
      ledger_disc_amt = purchase_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      takeDiscountAmountInLumpsum = supplierCodeId.takeDiscountAmountInLumpsum;
      isFirstDiscountPerCalculate = supplierCodeId.isFirstDiscountPerCalculate;
    }

    let resTranxFn = fnTranxCalculation({
      elementFrom: elementFrom,
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
    console.log({ resTranxFn });
    let {
      base_amt,
      total_purchase_discount_amt,
      total_taxable_amt,
      total_tax_amt,
      gst_row,
      total_final_amt,
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

    this.myRef.current.setFieldValue(
      "total_base_amt",
      isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
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

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows, showBatch } = this.state;
    if (value == "" && ele == "qty") {
      value = 0;
    }
    rows[rowIndex][ele] = value;

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      }
    } else {
      this.handleRowStateChange(rows);
    }
  };

  getProductBatchList = (rowIndex = -1) => {
    const { rows, invoice_data, lstBrand } = this.state;
    console.log({ rows, invoice_data });
    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let level_b_id = rows[rowIndex]["levelbId"]["value"];
    let level_c_id = rows[rowIndex]["levelcId"]["value"];
    let unit_id = rows[rowIndex]["unitId"]["value"];

    let isfound = false;
    let productData = getSelectValue(lstBrand, product_id);
    let batchOpt = [];
    console.log("productData", productData, level_a_id, level_b_id, level_c_id);
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

    console.warn("isfound,batchOpt ", isfound, batchOpt);
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
        moment(invoice_value.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );

      invoice_data["costing"] = "";
      invoice_data["costingWithTax"] = "";
      let res = [];
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          console.log("response ", response);
          if (response.responseStatus == 200) {
            res = response.data;
            console.log("res ", res);

            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            this.setState(
              {
                invoice_data: invoice_data,
                batchData: res,
              },
              () => {
                this.getInitBatchValue(rowIndex);
              }
            );
            console.log("res->batchData  : ", res);
          }
        })
        .catch((error) => { });
    } else {
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue(rowIndex);
        }
      );
    }
  };

  getInitBatchValue = (rowIndex = -1) => {
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
        rate_a: 0,
        sales_rate: 0,
        costing: 0,
        cost_with_tax: 0,
        margin_per: 0,
        min_margin: 0,
        manufacturing_date: "",
        dummy_date: new Date(),
        b_purchase_rate: 0,
        b_expiry: "",
        b_details_id: 0,
      };
    }
    console.log("initVal ", initVal);
    let IsBatch = rows[rowIndex]["is_batch"];
    console.log(" IsBatch ", IsBatch);
    if (IsBatch == true) {
      this.setState({
        rowIndex: rowIndex,
        batchInitVal: initVal,
        newBatchModal: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    }
  };

  handleFetchData = (sundry_creditor_id) => {
    let reqData = new FormData();
    reqData.append("sundry_creditor_id", sundry_creditor_id);
    listTranxDebitesNotes(reqData)
      .then((response) => {
        let res = response.data;
        let data = res.list;
        if (data.length == 0) {
          this.callCreateInvoice();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjustbillshow: true });
            }
          });
        }
      })
      .catch((error) => { });
  };

  callCreateInvoice = () => {
    console.log("in create!!!!!");

    const { invoice_data, additionalChargesTotal, rows } = this.state;
    let invoiceValues = this.myRef.current.values;
    console.log("invoiceValues >>>>>>>>>>>>>>>>>>", invoiceValues);
    console.log("invoice_data", invoice_data);

    let requestData = new FormData();
    // console.log("this.state", this.state);
    // !Invoice Data
    requestData.append(
      "invoice_date",
      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("newReference", false);
    requestData.append("invoice_no", invoice_data.pi_no);
    requestData.append("purchase_id", invoice_data.purchaseId.value);
    requestData.append("purchase_sr_no", invoiceValues.pi_sr_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.pi_transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("supplier_code_id", invoice_data.supplierCodeId.value);
    // !Invoice Data
    requestData.append("roundoff", invoiceValues.roundoff);
    if (invoiceValues.narration && invoiceValues.narration != "") {
      requestData.append("narration", invoiceValues.narration);
    }

    requestData.append("totalamt", invoiceValues.totalamt);
    requestData.append(
      "total_purchase_discount_amt",
      isNaN(parseFloat(invoiceValues.total_purchase_discount_amt))
        ? 0
        : parseFloat(invoiceValues.total_purchase_discount_amt)
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

    requestData.append(
      "gstNo",
      invoice_data.gstNo !== "" ? invoice_data.gstNo.label : ""
    );
    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);

    requestData.append(
      "tcs",
      invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    );

    requestData.append(
      "purchase_discount",
      invoiceValues.purchase_discount && invoiceValues.purchase_discount != ""
        ? invoiceValues.purchase_discount
        : 0
    );

    requestData.append(
      "purchase_discount_amt",
      invoiceValues.purchase_discount_amt &&
        invoiceValues.purchase_discount_amt != ""
        ? invoiceValues.purchase_discount_amt
        : 0
    );

    requestData.append(
      "total_purchase_discount_amt",
      invoiceValues.total_purchase_discount_amt &&
        invoiceValues.total_purchase_discount_amt != ""
        ? invoiceValues.total_purchase_discount_amt
        : 0
    );
    if (this.state.selectedPendingOrder.length > 0) {
      requestData.append(
        "reference_po_ids",
        this.state.selectedPendingOrder.join(",")
      );
    }

    if (this.state.selectedPendingChallan.length > 0) {
      requestData.append(
        "reference_pc_ids",
        this.state.selectedPendingChallan.join(",")
      );
    }

    console.log("row in create", rows);

    let frow = rows.map((v, i) => {
      if (v.productId != "") {
        v.productId = v.productId ? v.productId : "";
        v["unit_conv"] = v.unitId ? v.unitId.unitConversion : "";
        v["unitId"] = v.unitId ? v.unitId.value : "";
        v["levelaId"] = v.levelaId ? v.levelaId.value : "";
        v["levelbId"] = v.levelbId ? v.levelbId.value : "";
        v["levelcId"] = v.levelcId ? v.levelcId.value : "";
        v["rate"] = v.rate;
        v["free_qty"] = v.free_qty != "" ? v.free_qty : 0;
        v["dis_amt"] = v.dis_amt != "" ? v.dis_amt : 0;
        v["dis_per"] = v.dis_per != "" ? v.dis_per : 0;
        v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
        v["rate_a"] = v.rate_a;
        v["margin_per"] = v.margin_per;
        v["min_margin"] = v.min_margin;
        v["b_details_id"] = v.b_details_id != "" ? v.b_details_id : 0;
        v["b_expiry"] = v.b_expiry
          ? moment(v.b_expiry).format("yyyy-MM-DD")
          : "";
        v["manufacturing_date"] = v.manufacturing_date
          ? moment(v.manufacturing_date).format("yyyy-MM-DD")
          : "";
        v["is_batch"] = v.is_batch;
        v["isBatchNo"] = v.b_no;
        v["igst"] = v.igst != "" ? v.igst : 0;
        v["cgst"] = v.cgst != "" ? v.cgst : 0;
        v["sgst"] = v.sgst != "" ? v.sgst : 0;
        return v;
      }
    });
    console.log("frow =->", frow);

    var filtered = frow.filter(function (el) {
      return el && el != null;
    });
    console.log("filtered", filtered);
    requestData.append("row", JSON.stringify(filtered));
    requestData.append("additionalChargesTotal", additionalChargesTotal);
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

    if (
      authenticationService.currentUserValue.state &&
      invoice_data &&
      invoice_data.supplierCodeId &&
      invoice_data.supplierCodeId.state !=
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

      requestData.append("taxCalculation", JSON.stringify(taxCal));
      requestData.append("taxFlag", true);
    }
    for (const pair of requestData.entries()) {
      console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    }
    createPurchaseInvoice(requestData)
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
          this.initRow();

          eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
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
      .catch((error) => { });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleBillselectionDebit = (id, index, status) => {
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
      if (f_selectedBills.includes(v.debit_note_no)) {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
      } else {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillsSelectionAllDebit = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      // console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;
      });

      // console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handlePendingOrderSelection = (id, status) => {
    let { selectedPendingOrder } = this.state;
    if (status == true) {
      if (!selectedPendingOrder.includes(id)) {
        selectedPendingOrder = [...selectedPendingOrder, id];
      }
    } else {
      selectedPendingOrder = selectedPendingOrder.filter((v) => v != id);
    }
    this.setState({
      selectedPendingOrder: selectedPendingOrder,
    });
  };

  handleBillPayableAmtChange = (value, index) => {
    // console.log({ value, index });
    const { billLst, debitBills } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };
  handlePropsData = (prop_data) => {
    if (prop_data.invoice_data) {
      this.setState({
        invoice_data: prop_data.invoice_data,
        rows: prop_data.rows,
        additionalCharges: prop_data.additionalCharges,
      });
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
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

  handleSubmitSCList = (value) => {
    console.log("value", value);

    let reqData = new FormData();
    reqData.append("sundry_creditor_id", value);

    getTranxDebitNoteListInvoiceBillSC(reqData)
      .then((response) => {
        //debugger;
        // console.log('before response', response);
        let res = response.data;
        let lst = res.data;
        if (res.responseStatus == 200) {
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
            show: true,
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

  setPurchaseInvoiceEditData = () => {
    console.log("purchaseReturnData", this.state.purchaseReturnData);
    const data = this.state.purchaseReturnData;

    let formData = new FormData();
    formData.append("pur_invoice_id", data.returnData.id);
    formData.append("source", data.returnData.source);

    getTranxPurchaseProductListBillNo(formData)
      .then((response) => {
        let res = response.data;
        console.log("Edit response", res);
        if (res.responseStatus == 200) {
          let { invoice_data, row, lstAdditionalLedger } = res;

          const { purchaseAccLst, supplierNameLst, lstBrand, supplierCodeLst } =
            this.state;
          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          console.log({ invoice_data, supplierNameLst });
          let opt = [];
          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();

          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
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
            pi_sr_no: invoice_data.purchase_sr_no,

            pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
            gstNo: invoice_data.gstNo,
            purchaseId: getSelectValue(
              purchaseAccLst,
              invoice_data.purchase_account_ledger_id
            ),
            pi_no: invoice_data.invoice_no,
            pi_invoice_dt:
              invoice_data.invoice_dt != ""
                ? moment(
                  new Date(
                    moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
                  )
                ).format("DD/MM/YYYY")
                : "",
            supplierCodeId: invoice_data.supplierId
              ? getSelectValue(supplierCodeLst, invoice_data.supplierId)
              : "",
            supplierNameId: invoice_data.supplierId
              ? getSelectValue(supplierNameLst, invoice_data.supplierId)[
              "label"
              ]
              : "",

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
            tcs: res.tcs,
            narration: res.narration,
            transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
          };
          console.log("initInvoiceData", initInvoiceData);
          let initRowData = [];
          if (row.length > 0) {
            console.log("Rowsssss------->", row);
            initRowData = row.map((v, i) => {
              console.log("rahul::v", v);
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
                v.levelaId = getSelectValue(productOpt.brandOpt, "");
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

              console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
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

              return v;
            });
          }
          console.log("initInvoiceData", initInvoiceData);
          console.log("initRowData", initRowData);
          data.returnInitVal["outstanding"] = data.returnData.total_amount;
          this.setState(
            {
              salesReturnObject: this.state.purchaseReturnData.returnIntiVal,
              invoice_data: initInvoiceData,
              initVal: data.returnInitVal,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
            },
            () => {
              setTimeout(() => {
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getProductFlavorpackageUnitbyids = () => {
    let reqData = new FormData();
    reqData.append("id", this.state.purchaseReturnData.returnData.id);
    getProductFlavorpackageUnitbyid(reqData)
      .then((res) => res.data)
      .then((response) => {
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

          console.log("Opt", { Opt });
          this.setState({ lstBrand: Opt }, () => { });
          this.setPurchaseInvoiceEditData();
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => { });
      });
  };

  handleRowClick = (v) => {
    // debugger;
    console.log("v", v);

    let { initVal } = this.state;
    let prop_data = {
      returnInitVal: this.myRef.current.values,
      returnData: v,
      invoice_data: v,
    };

    this.setState({ purchaseReturnData: prop_data, show: false }, () => {
      this.getProductFlavorpackageUnitbyids();
    });
  };

  setSupplierData = (supplierId = "", setFieldValue) => {
    console.warn("warn :: supplierId", supplierId);
    let requestData = new FormData();
    requestData.append("ledgerId", supplierId && supplierId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        console.log("res", response);
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
              handleSuccessFn: () => { },
              handleFailFn: () => {
                this.reloadPage();
              },
            },
            () => { }
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      // this.lstSundryCreditors();
      this.transaction_product_listFun();
      this.transaction_ledger_listFun();
      this.setLastPurchaseSerialNo();
      this.initRow();
      this.initAdditionalCharges();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;
      console.log("prop_data =->>> ", prop_data);
      // this.setState({ invoice_data: prop_data });
      this.handlePropsData(prop_data);
      // mousetrap.bindGlobal("ctrl+v", this.handleResetForm);
      // mousetrap.bindGlobal("ctrl+c", this.ledgerCreate);
      // mousetrap.bind("alt+p", this.productCreate);

      eventBus.on(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.componentDidlstProduct
      );
      this.getUserControlLevelFromRedux();
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

  componentDidUpdate() {
    const {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstBrand,
      // lstAdditionalLedger,
      isEditDataSet,
      purchaseReturnData,
    } = this.state;
    console.warn(
      "const---->",
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstBrand,
      // lstAdditionalLedger,
      isEditDataSet,
      purchaseReturnData
    );
    if (
      purchaseAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      lstBrand.length > 0 &&
      // lstAdditionalLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseReturnData != ""
    ) {
      this.setPurchaseInvoiceEditData();
    }
    //  this.setPurchaseInvoiceEditData();
  }

  componentWillUnmount() {
    if (AuthenticationCheck()) {
      eventBus.remove("scroll", this.handleScroll);
      mousetrap.unbind("alt+p", this.productCreate);
      mousetrap.unbindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.unbindGlobal("ctrl+c", this.ledgerCreate);
      eventBus.remove(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.lstProduct
      );
    }
  }
  /***** Validations of Purchase Invoice for Duplicate Invoice Numbers */
  validatePurchaseInvoice = (invoice_no, supplier_id) => {
    console.log("Invoice Input", invoice_no, supplier_id);
    let reqData = new FormData();
    reqData.append("supplier_id", supplier_id);
    reqData.append("bill_no", invoice_no);
    validatePurchaseReturn(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_timeout: true,
            // delay: 1000,
          });
          //this.reloadPage();
        }
      })
      .catch((error) => { });
  };
  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/

  validatePurchaseRate = (mrp = 0, p_rate = 0, setFieldValue) => {
    console.log("MRP =", parseFloat(mrp));
    console.log("Purchase rate ::", parseFloat(p_rate));
    if (parseFloat(mrp) < parseFloat(p_rate) === true) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Purchase rate should less than MRP",
        //  is_timeout: true,
        //  delay: 1000,
      });
      setFieldValue("b_purchase_rate", 0);
    }
  };

  validateSalesRate = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    element,
    setFieldValue
  ) => {
    if (
      parseFloat(salesRates) > parseFloat(purchaseRate) === false ||
      parseFloat(salesRates) < parseFloat(mrp) === false
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        //  is_timeout: true,
        //  delay: 1000,
      });
      setFieldValue(element, 0);
    }
  };
  /**** Check Invoice date between Fiscal year *****/
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
              icon: "confirm",
              title: "Invoice date not valid as per FY",
              msg: "Do you want continue with invoice date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => { },
              handleFailFn: () => {
                setFieldValue("pi_invoice_dt", "");
                eventBus.dispatch(
                  "page_change",
                  "tranx_purchase_invoice_create"
                );
                // this.reloadPage();
              },
            },
            () => { }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  clearBatchValue = (setFieldValue) => {
    setFieldValue("b_no", 0);
    setFieldValue("b_rate", 0);
    setFieldValue("rate_a", 0);
    setFieldValue("rate_b", 0);
    setFieldValue("rate_c", 0);
    setFieldValue("max_discount", 0);
    setFieldValue("min_discount", 0);
    setFieldValue("min_margin", 0);
    setFieldValue("manufacturing_date", "");
    setFieldValue("b_purchase_rate", 0);
    setFieldValue("b_expiry", "");
  };

  searchLedger = (search = "") => {
    console.log({ search });
    let { orglstAdditionalLedger, element1, element2 } = this.state;
    let orglstAdditionalLedger_F = [];
    if (search.length > 0) {
      orglstAdditionalLedger_F = orglstAdditionalLedger.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.unique_code.toLowerCase().includes(search.toLowerCase())
      );

      console.log({ orglstAdditionalLedger });
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
  ledgerNameModalFun = (status) => {
    this.setState({ ledgerNameModal: [status] });
  };

  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    // debugger;
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    if (findProductPackges) {
      console.log("findProductPackges ", findProductPackges);
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
            console.log("fPackageLst =-> ", fPackageLst);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              console.log("findProductPackges =-> ", findProductPackges);
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["prod_id"] = findProductPackges;
                rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

                if (
                  findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
                ) {
                  rows[rowIndex]["levelbId"] =
                    findProductPackges["levelAOpt"][0]["levelBOpt"][0];

                  if (
                    findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                      "levelCOpt"
                    ].length >= 1
                  ) {
                    rows[rowIndex]["levelcId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                      "levelCOpt"
                      ][0];
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
          // console.log("error", error);
        });
    }
  };
  get_purchase_return_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    // console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_purchase_return_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          let idc = res.data;
          let onlyfive = [];
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
            product_purchase_return_supplier_lst: onlyfive,
          });
        }
      })
      .catch((error) => {
        this.setState({ product_purchase_return_supplier_lst: [] });
      });
  };

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
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

  handleNumChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    if (value == "") {
      rows[rowIndex][ele] = 0;
    } else if (!isNaN(value)) {
      rows[rowIndex][ele] = value;
    }

    this.handleRowStateChange(rows);
  };

  render() {
    const {
      add_button_flag,
      product_purchase_return_supplier_lst,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      invoice_data,
      rows,
      additionchargesyes,
      lstDisLedger,
      isBranch,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      adjustbillshow,
      billLst,
      selectedBillsdebit,
      isAllCheckeddebit,
      batchModalShow,
      batchInitVal,
      batchData,
      b_details_id,
      isBatch,
      is_expired,
      tr_id,
      productLst,
      lstBrand,
      lstGst,
      rowDelDetailsIds,
      ledgerModal,
      ledgerNameModal,
      newBatchModal,
      selectProductModal,
      ledgerList,
      ledgerData,
      selectedLedger,
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
      purchaseReturnData,
      invoiceLstSC,
      show,
      adjusmentbillmodal,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
    } = this.state;
    return (
      <div>
        <div className="purchaseinvoice" style={{ overflow: "hidden" }}>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            validationSchema={Yup.object().shape({
              // gstNo: Yup.object().nullable().required("GST No is required"),
              pi_invoice_dt: Yup.string().required("Return Date is Required"),
              supplierCodeId: Yup.object()
                .nullable()
                .required("Supplier Code is Required"),
              purchaseId: Yup.object()
                .nullable()
                .required("Purchase Account is Required"),
              pi_no: Yup.string().required("Return No is Required"),
              supplierNameId: Yup.string()
                .trim()
                .required("Supplier Name is Required"),
            })}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to submit",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    this.setState({ adjusmentbillmodal: true });
                  },
                  handleFailFn: () => { },
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
                // style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
              >
                <>
                  <div className="div-style p-3">
                    <div>
                      <Row className="mx-0 inner-div-style">
                        <Row>
                          {isBranch == true && (
                            <Col lg={2} md={2} sm={2} xs={2}>
                              <Row>
                                {/* // If company has multiple branch then enable only branch */}
                                {/* selection otherwise hide it as per Pavan's sir told on solapur visit */}

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
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    isDisabled
                                    options={purchaseAccLst}
                                    name="branchId"
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
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Tranx Date</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style "
                                  name="pi_transaction_dt"
                                  id="pi_transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.pi_transaction_dt}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    console.log("e ", e);
                                    console.log(
                                      "e.target.value ",
                                      e.target.value
                                    );
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      console.warn(
                                        "warn:: isValid",
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid()
                                      );
                                      if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        setFieldValue(
                                          "pi_transaction_dt",
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
                                        setFieldValue("pi_transaction_dt", "");
                                      }
                                    } else {
                                      setFieldValue("pi_transaction_dt", "");
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>
                                  Code <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  isClearable
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  options={supplierCodeLst}
                                  name="supplierCodeId"
                                  isDisabled={
                                    values.pi_transaction_dt !== ""
                                      ? false
                                      : true
                                  }
                                  onChange={(v) => {
                                    setFieldValue("supplierCodeId", "");
                                    setFieldValue("supplierNameId", "");
                                    setFieldValue("gstId", "");
                                    if (v != null) {
                                      setFieldValue("supplierCodeId", v);
                                      setFieldValue("supplierNameId", v.name);

                                      let opt = [];
                                      opt = v.gstDetails.map((v, i) => {
                                        return {
                                          label: v.gstNo,
                                          value: v.id,
                                        };
                                      });
                                      this.setState(
                                        {
                                          lstGst: opt,
                                        },
                                        () => {
                                          setFieldValue(
                                            "gstId",
                                            opt[0]["label"]
                                          );
                                        }
                                      );
                                      this.handleSubmitSCList(v.value);
                                    }
                                  }}
                                  value={values.supplierCodeId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.supplierCodeId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Ledger Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Control
                                  type="button"
                                  className="tnx-pur-inv-text-box text-start"
                                  placeholder="Ledger Name"
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  onChange={handleChange}
                                  disabled={
                                    values.pi_transaction_dt !== ""
                                      ? false
                                      : true
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.ledgerModalFun(true);
                                  }}
                                  value={values.supplierNameId}
                                // readOnly={true}
                                />
                                <span className="text-danger errormsg">
                                  {errors.supplierNameId != ""
                                    ? values.supplierNameId
                                    : "Ledger Name"}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Supplier GSTIN</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="GSTIN"
                                  name="gstNo"
                                  id="gstNo"
                                  readOnly
                                  onChange={handleChange}
                                  value={values.gstNo}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gstNo}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Purchase Serial</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Invoice sr No. "
                                  name="pi_sr_no"
                                  id="pi_sr_no"
                                  onChange={handleChange}
                                  value={values.pi_sr_no}
                                  isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  isInvalid={!!errors.pi_sr_no}
                                  readOnly={true}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_sr_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>
                                  Return No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  placeholder="Return No."
                                  name="pi_no"
                                  id="pi_no"
                                  className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  value={values.pi_no}
                                  // isValid={touched.pi_no && !errors.pi_no}
                                  // isInvalid={!!errors.pi_no}
                                  onBlur={(e) => {
                                    e.preventDefault();

                                    this.validatePurchaseInvoice(
                                      values.pi_no,
                                      values.supplierCodeId.value
                                    );
                                    // alert("On Blur Call");
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Return Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={4} md={4} sm={4} xs={4}>
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
                                  onBlur={(e) => {
                                    console.log("e ", e);
                                    console.log(
                                      "e.target.value ",
                                      e.target.value
                                    );
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      console.warn(
                                        "warn:: isValid",
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid()
                                      );
                                      if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        let curdate = new Date(
                                          moment(
                                            this.state.currentDate,
                                            "DD/MM/YYYY"
                                          ).toDate()
                                        );
                                        let return_date = new Date(
                                          moment(
                                            e.target.value,
                                            "DD/MM/YYYY"
                                          ).toDate()
                                        );
                                        console.log(
                                          "curdate >= return_date",
                                          curdate >= return_date
                                        );
                                        console.log("curdate", curdate);
                                        console.log("tranx_date", return_date);
                                        if (curdate >= return_date) {
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
                                            msg: "Return date should not be Greater than today's date",
                                            is_button_show: true,
                                          });
                                          setFieldValue("pi_invoice_dt", "");
                                        }
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
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_invoice_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Purchase A/C</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  options={purchaseAccLst}
                                  name="purchaseId"
                                  id="purchaseId"
                                  onChange={(v) => {
                                    setFieldValue("purchaseId", v);
                                  }}
                                  value={values.purchaseId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.purchaseId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>

                  <div className="tnx-pur-inv-tbl-style">
                    {/* {JSON.stringify(rows)} */}
                    <Table>
                      <thead
                        style={{
                          border: "1px solid #A8ADB3",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              width: "35px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            Sr. No.
                          </th>

                          <th
                            style={{
                              width: "630px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          >
                            Particulars
                          </th>

                          {ABC_flag_value == "A" ||
                            ABC_flag_value == "AB" ||
                            ABC_flag_value == "ABC" ? (
                            <th
                              className={`${ABC_flag_value == "A"
                                ? "Level_A"
                                : ABC_flag_value == "AB"
                                  ? "Level_AB"
                                  : ABC_flag_value == "ABC"
                                    ? "Level_ABC"
                                    : "Level_no"
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
                              className={`${ABC_flag_value == "AB"
                                ? "Level_AB"
                                : ABC_flag_value == "ABC"
                                  ? "Level_ABC"
                                  : "Level_no"
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
                              className={`${ABC_flag_value == "ABC"
                                ? "Level_ABC"
                                : "Level_no"
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
                              width: "100px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            Unit
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "200px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          >
                            Batch No
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "115px",
                              borderRight: "1px solid #A8ADB2",
                            }}
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
                                  width: "135px",
                                  borderRight: "1px solid #A8ADB2",
                                }}
                              >
                                Free
                              </th>
                            )}

                          <th
                            style={{
                              textAlign: "center",
                              width: "179px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          >
                            Rate
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "135px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          >
                            Gross Amount
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "75px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            1-Dis.
                            <br />%
                          </th>

                          {isMultiDiscountExist(
                            "is_multi_discount",
                            this.props.userControl
                          ) && (
                              <th
                                style={{
                                  textAlign: "center",
                                  width: "75px",
                                  borderRight: "1px solid #A8ADB2",
                                }}
                                className="py-1"
                              >
                                2-Dis.
                                <br />%
                              </th>
                            )}
                          <th
                            style={{
                              textAlign: "center",
                              width: "100px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            Disc.
                            <br />₹
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "75px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                            className="py-1"
                          >
                            Tax
                            <br />%
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "110px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          >
                            Net Amount
                          </th>

                          <th
                            style={{
                              textAlign: "center",
                              width: "25px",
                              borderRight: "1px solid #A8ADB2",
                            }}
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((rv, ri) => {
                          return (
                            <tr
                              style={{ borderbottom: "1px solid #D9D9D9" }}
                              onMouseOver={(e) => {
                                if (rows[ri]["productId"] !== "") {
                                  this.transaction_product_Hover_detailsFun(
                                    rv.productId
                                  );
                                }
                              }}
                            >
                              <td className="sr-no-style">
                                {parseInt(ri) + 1}
                              </td>
                              <td
                                onMouseOver={(e) => {
                                  e.preventDefault();
                                  if (rows[ri]["productId"] !== "") {
                                    this.get_purchase_return_supplierlist_by_productidFun(
                                      rv.productId
                                    );
                                  }
                                }}
                              >
                                <Form.Control
                                  type="button"
                                  id={`productName-${ri}`}
                                  name={`productName-${ri}`}
                                  className="tnx-pur-inv-prod-style text-start"
                                  placeholder=""
                                  // styles={particularsDD}
                                  colors="#729"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.SelectProductModalFun(true, ri);
                                  }}
                                  value={rows[ri]["productName"]}
                                  readOnly
                                />
                              </td>
                              {ABC_flag_value == "A" ||
                                ABC_flag_value == "AB" ||
                                ABC_flag_value == "ABC" ? (
                                <td>
                                  <Select
                                    isDisabled={
                                      rows[ri]["is_level_a"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelaId-${ri}`}
                                    name={`levelaId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder=""
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelAOpt",
                                      ri,
                                      "prod_id"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      rows[ri]["levelaId"] = value;
                                      // this.getLevelbOpt(
                                      //   ri,
                                      //   rows[ri]["productId"],
                                      //   value
                                      // );
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
                                    isDisabled={
                                      rows[ri]["is_level_b"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelbId-${ri}`}
                                    name={`levelbId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder=""
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelBOpt",
                                      ri,
                                      "levelaId"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      rows[ri]["levelbId"] = value;
                                      // this.getLevelcOpt(
                                      //   ri,
                                      //   rows[ri]["productId"],
                                      //   rows[ri]["levelaId"],
                                      //   value
                                      // );
                                    }}
                                    value={rows[ri]["levelbId"]}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {ABC_flag_value == "ABC" ? (
                                <td>
                                  <Select
                                    isDisabled={
                                      rows[ri]["is_level_c"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelbId-${ri}`}
                                    name={`levelbId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder=""
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelCOpt",
                                      ri,
                                      "levelbId"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      rows[ri]["levelcId"] = value;
                                      // this.handleUnitChange(
                                      //   "levelcId",
                                      //   value,
                                      //   ri
                                      // );
                                    }}
                                    value={rows[ri]["levelcId"]}
                                  />
                                </td>
                              ) : (
                                ""
                              )}

                              <td>
                                <Select
                                  id={`unitId-${ri}`}
                                  name={`unitId-${ri}`}
                                  className="prd-dd-style "
                                  menuPlacement="auto"
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder=""
                                  styles={unitDD}
                                  options={this.getLevelsOpt(
                                    "unitOpt",
                                    ri,
                                    "levelcId"
                                  )}
                                  onChange={(value, triggeredAction) => {
                                    // rows[ri]["unit_id"] = value;
                                    console.log("unitId", { value });
                                    this.handleUnitChange("unitId", value, ri);
                                  }}
                                  value={rows[ri]["unitId"]}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  id={`batchNo-${ri}`}
                                  name={`batchNo-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder=""
                                  onInput={(e) => {
                                    e.preventDefault();
                                    this.getProductBatchList(ri);
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.getProductBatchList(ri);
                                  }}
                                  value={rows[ri]["b_no"]}
                                  readOnly
                                  disabled={
                                    rows[ri]["is_batch"] === false
                                      ? true
                                      : false
                                  }
                                />
                              </td>

                              <td>
                                <Form.Control
                                  id={`qty-${ri}`}
                                  name={`qty-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    // rows[ri]["qty"] = e.target.value;
                                    this.handleNumChange(
                                      "qty",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["qty"]}
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
                                        this.handleNumChange(
                                          "free_qty",
                                          e.target.value,
                                          ri
                                        );
                                      }}
                                      onBlur={(e) => {
                                        if (
                                          parseInt(rows[ri]["qty"]) <
                                          parseInt(rows[ri]["free_qty"]) ===
                                          true
                                        ) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Free Qty should be less than Qty",
                                          });
                                          this.handleNumChange("free_qty", 0, ri);
                                        }
                                      }}
                                      value={rows[ri]["free_qty"]}
                                    />
                                  </td>
                                )}
                              <td>
                                <Form.Control
                                  id={`rate-${ri}`}
                                  name={`rate-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleNumChange(
                                      "rate",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["rate"]}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  id={`grossAmt-${ri}`}
                                  name={`grossAmt-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  // value={rows[ri]["total_base_amt"]}
                                  value={this.getFloatUnitElement(
                                    "base_amt",
                                    ri
                                  )}
                                  readOnly
                                />
                              </td>

                              <td>
                                <Form.Control
                                  id={`dis1Per-${ri}`}
                                  name={`dis1Per-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleNumChange(
                                      "dis_per",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["dis_per"]}
                                />
                              </td>

                              {isMultiDiscountExist(
                                "is_multi_discount",
                                this.props.userControl
                              ) && (
                                  <td>
                                    <Form.Control
                                      id={`dis2Per-${ri}`}
                                      name={`dis2Per-${ri}`}
                                      className="table-text-box border-0"
                                      type="text"
                                      placeholder="0"
                                      onChange={(e) => {
                                        this.handleNumChange(
                                          "dis_per2",
                                          e.target.value,
                                          ri
                                        );
                                      }}
                                      value={rows[ri]["dis_per2"]}
                                    />
                                  </td>
                                )}
                              <td>
                                <Form.Control
                                  id={`disAmt-${ri}`}
                                  name={`disAmt-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  onChange={(e) => {
                                    this.handleNumChange(
                                      "dis_amt",
                                      e.target.value,
                                      ri
                                    );
                                  }}
                                  value={rows[ri]["dis_amt"]}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  id={`tax-${ri}`}
                                  name={`tax-${ri}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  value={rows[ri]["gst"]}
                                  readOnly
                                />
                              </td>

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
                                  readOnly
                                  style={{ backgroundColor: "#D2F6E9" }}
                                />
                              </td>

                              <td className="d-flex">
                                {rows.length > 1 && (
                                  <img
                                    isDisabled={rows.length > 0}
                                    src={TableDelete}
                                    alt=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleRemoveRow(ri);
                                      this.setState({ add_button_flag: true });
                                    }}
                                    className="btnimg"
                                  />
                                )}

                                {add_button_flag === true &&
                                  this.checkLastRow(
                                    ri,
                                    rows.length - 1,
                                    rv,
                                    rows[ri]["unitId"],
                                    rows[ri]["qty"]
                                  ) && (
                                    <img
                                      src={add_icon}
                                      alt=""
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.handleAddRow();
                                        this.setState({
                                          add_button_flag: !add_button_flag,
                                        });
                                      }}
                                      isDisabled={
                                        rv && rv.productId && rv.productId != ""
                                          ? true
                                          : false
                                      }
                                    />
                                  )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

                  <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">HSN:</span>
                          <span className="span-value">
                            {product_hover_details.hsn}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">
                            {product_hover_details.tax_type}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3} className="for_padding">
                      <Row>
                        <Col lg={6} className="my-auto colset">
                          <span className="span-lable">Batch Expiry:</span>
                          <span className="span-value">
                            {product_hover_details.batch_expiry}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {product_hover_details.mrp}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Profit:</span>
                          <span className="span-value">-</span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Package:</span>
                          <span className="span-value">
                            {" "}
                            {product_hover_details.packing}
                          </span>
                        </Col>
                        {/* <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                        </Col> */}
                      </Row>
                    </Col>
                    {/* <Col lg={{ span: 1, offset: 2 }}>
                      <span className="span-lable">Gross Total</span>
                    </Col>
                    <Col lg={1}>
                      <span className="span-value">
                        {parseFloat(values.totalamt).toFixed(2)}
                      </span>
                    </Col> */}
                  </Row>
                  <Row className="mx-0 btm-data">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="mt-2 pb-2">
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            as="textarea"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
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
                            {product_purchase_return_supplier_lst.length > 0 ? (
                              product_purchase_return_supplier_lst.map(
                                (v, i) => {
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
                                      <td>{v.mrp}</td>
                                      <td>{v.quantity}</td>
                                      <td>{v.rate}</td>
                                      <td>{v.cost}</td>
                                      <td>{v.dis_per}</td>
                                      <td>{v.dis_amt}</td>
                                    </tr>
                                  );
                                }
                              )
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
                      <Row>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto ps-1"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box px-1"
                            id="purchase_discount"
                            name="purchase_discount"
                            onChange={(e) => {
                              setFieldValue(
                                "purchase_discount",
                                e.target.value
                              );

                              let ledger_disc_amt = calculatePercentage(
                                values.total_row_gross_amt1,
                                parseFloat(e.target.value)
                              );
                              if (isNaN(ledger_disc_amt) === true)
                                ledger_disc_amt = "";
                              setFieldValue(
                                "purchase_discount_amt",
                                ledger_disc_amt !== ""
                                  ? parseFloat(ledger_disc_amt).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            value={values.purchase_discount}
                          />
                        </Col>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto p-0"
                        >
                          <Form.Label>Dis.₹</Form.Label>
                        </Col>
                        <Col lg={5} className="mt-2">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box"
                            id="purchase_discount_amt"
                            name="purchase_discount_amt"
                            onChange={(e) => {
                              setFieldValue(
                                "purchase_discount_amt",
                                e.target.value
                              );

                              let ledger_disc_per =
                                (parseFloat(e.target.value) * 100) /
                                parseFloat(values.total_row_gross_amt1);
                              if (isNaN(ledger_disc_per) === true)
                                ledger_disc_per = "";
                              setFieldValue(
                                "purchase_discount",
                                ledger_disc_per !== ""
                                  ? parseFloat(ledger_disc_per).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            value={values.purchase_discount_amt}
                          />
                        </Col>
                      </Row>
                      <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                      />
                      <Row>
                        <Row>
                          <Col lg={6}>
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {values.total_qty}
                            </span>
                          </Col>
                        </Row>

                        {/* <Col lg={1}>
                          <p style={{ color: "#B6762B" }}>|</p>
                        </Col> */}
                        <Row className="mt-2">
                          <Col lg={6}>
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {parseFloat(values.roundoff).toFixed(2)}
                            </span>
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col lg={6}>
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>

                    <Col lg={2} md={2} sm={2} xs={2} className="for_padding">
                      {/* {Json.stringify(showLedgerDiv)} */}
                      {showLedgerDiv === true ? (
                        <div
                          className={`small-tbl   ${selectedLedgerNo === 1
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
                                      console.log(
                                        "v ",
                                        v,
                                        addchgElement1,
                                        addchgElement2,
                                        this.myRef.current
                                      );
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
                              <Form.Control
                                placeholder="Ledger 1"
                                className="tnx-pur-inv-text-box mt-2"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                name="additionalChgLedgerName1"
                                id="additionalChgLedgerName1"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName1",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger1", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 1 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName1",
                                          "additionalChgLedger1"
                                        );
                                      }
                                    );
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerName1}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 200);
                                }}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-2"
                                id="additionalChgLedgerAmt1"
                                name="additionalChgLedgerAmt1"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt1",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt1}
                                readOnly={
                                  parseInt(values.additionalChgLedger1) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                placeholder="Ledger 2"
                                className="tnx-pur-inv-text-box mt-1"
                                name="additionalChgLedgerName2"
                                id="additionalChgLedgerName2"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName2",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger2", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 2 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName2",
                                          "additionalChgLedger2"
                                        );
                                      }
                                    );
                                  }, 150);
                                }}
                                value={values.additionalChgLedgerName2}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 100);
                                }}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1"
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
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Gross Total</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_base_amt).toFixed(2)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Discount</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_taxable_amt).toFixed(2)}
                              {/* 99999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_tax_amt).toFixed(2)}
                              {/* 9999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                placeholder="Ledger 3"
                                className="tnx-pur-inv-text-box mt-1 mb-1"
                                name="additionalChgLedgerName3"
                                id="additionalChgLedgerName3"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName3",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger3", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 3 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName3",
                                          "additionalChgLedger3"
                                        );
                                      }
                                    );
                                  }, 150);
                                }}
                                value={values.additionalChgLedgerName3}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 100);
                                }}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1 mb-1"
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
                              {parseFloat(values.bill_amount).toFixed(2)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size d-flex">
                        <Button
                          className="successbtn-style  me-2"
                          type="submit"
                        >
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            MyNotifications.fire(
                              {
                                show: true,
                                icon: "confirm",
                                title: "Confirm",
                                msg: "Do you want to cancel",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_debit_note_list_B2B"
                                  );
                                },
                                handleFailFn: () => { },
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

                  <Row className="mx-0 btm-rows-btn1 ">
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
          ;{/* Bill List */}
          <Modal
            show={show}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
            //centered
            animation={false}
          >
            <Modal.Header
              //closeButton
              closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Debit Note
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.setState({ show: false })}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="purchasescreen">
                {invoiceLstSC.length > 0 && (
                  <div className="all_bills">
                    {/* <h6>Bills</h6> */}
                    <div className="bills_dt">
                      <div className="pb-2 pt-0 pl-2 pr-2">
                        <div className="">
                          <Table className="serialnotbl  table-bordered">
                            <thead>
                              <tr>
                                <th style={{ textAlign: "left" }} className="">
                                  {" "}
                                  Sr.
                                </th>
                                <th style={{ textAlign: "left" }} className="">
                                  Bill
                                </th>
                                <th style={{ textAlign: "left" }} className="">
                                  Bill Amt
                                </th>
                                <th style={{ textAlign: "left" }} className="">
                                  Bill Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceLstSC.map((v, i) => {
                                return (
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      console.log("v", v);
                                      this.handleRowClick(v);
                                    }}
                                  >
                                    <td>{i + 1}</td>
                                    <td>{v.invoice_no}</td>
                                    <td>{v.total_amount}</td>
                                    <td>
                                      {moment(v.invoice_date).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal>
          ;{/* additional charges */}
          {/* Adjustment Bill Amount */}
          <Modal
            show={adjustbillshow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ adjustbillshow: false })}
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Settlement of Bills
              </Modal.Title>

              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.setState({ adjustbillshow: false })}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2 ">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  // initialValues={invoice_data}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let invoiceValues = this.myRef.current.values;
                    console.log(
                      "Adjust invoiceValues--------->",
                      invoiceValues
                    );

                    let requestData = new FormData();
                    requestData.append(
                      "debitNoteReference",
                      values.newReference
                    );
                    let row = billLst.filter((v) => v.Total_amt != "");
                    if (values.newReference == "true") {
                      let bills = [];
                      row.map((v) => {
                        bills.push({
                          debitNoteId: v.id,
                          debitNotePaidAmt: v.debit_paid_amt,
                          debitNoteRemaningAmt: v.debit_remaining_amt,
                          source: v.source,
                        });
                      });
                      requestData.append("bills", JSON.stringify(bills));
                    }

                    // !Invoice Data

                    requestData.append(
                      "invoice_date",
                      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      )
                    );
                    requestData.append("invoice_no", invoiceValues.pi_no);
                    requestData.append(
                      "purchase_id",
                      invoice_data.purchaseId.value
                    );
                    requestData.append(
                      "purchase_sr_no",
                      invoiceValues.pi_sr_no
                    );
                    requestData.append(
                      "transaction_date",
                      moment(invoice_data.pi_transaction_dt).format(
                        "yyyy-MM-DD"
                      )
                    );

                    if (this.state.selectedPendingOrder.length > 0) {
                      requestData.append(
                        "reference_po_ids",
                        this.state.selectedPendingOrder.join(",")
                      );
                    }

                    if (this.state.selectedPendingChallan.length > 0) {
                      requestData.append(
                        "reference_pc_ids",
                        this.state.selectedPendingChallan.join(",")
                      );
                    }
                    requestData.append(
                      "supplier_code_id",
                      invoice_data.supplierCodeId.value
                    );
                    // !Invoice Data
                    let returnValues = this.myRef.current.values;
                    console.log("Adjust returnValues--------->", returnValues);
                    requestData.append("roundoff", returnValues.roundoff);
                    if (
                      returnValues.narration &&
                      returnValues.narration != ""
                    ) {
                      requestData.append("narration", returnValues.narration);
                    }
                    requestData.append(
                      "total_base_amt",
                      returnValues.total_base_amt
                    );
                    // requestData.append("total_b_amt", returnValues.total_b_amt);
                    requestData.append("totalamt", returnValues.totalamt);
                    requestData.append(
                      "taxable_amount",
                      returnValues.total_taxable_amt
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
                    // requestData.append(
                    //   "gstNo",
                    //   invoice_data.gstNo !== "" ? invoice_data.gstNo.label : ""
                    // );
                    requestData.append("gstNo", invoiceValues.gstNo);

                    requestData.append("totalcgst", totalcgst);
                    requestData.append("totalsgst", totalsgst);
                    requestData.append("totaligst", totaligst);
                    // requestData.append("totalqty", returnValues.totalqty);
                    requestData.append(
                      "totalqty",
                      returnValues.totalqty && returnValues.totalqty != ""
                        ? returnValues.totalqty
                        : 0
                    );
                    // requestData.append("tcs", returnValues.tcs);
                    // requestData.append(
                    //   "purchase_discount",
                    //   invoiceValues.purchase_discount
                    // );
                    requestData.append(
                      "tcs",
                      returnValues.tcs && returnValues.tcs != ""
                        ? returnValues.tcs
                        : 0
                    );
                    requestData.append(
                      "purchase_discount",
                      invoiceValues.purchase_discount &&
                        invoiceValues.purchase_discount != ""
                        ? invoiceValues.purchase_discount
                        : 0
                    );
                    requestData.append(
                      "purchase_discount_amt",
                      invoiceValues.purchase_discount_amt &&
                        invoiceValues.purchase_discount_amt != ""
                        ? invoiceValues.purchase_discount_amt
                        : 0
                    );

                    requestData.append(
                      "total_purchase_discount_amt",
                      invoiceValues.total_purchase_discount_amt &&
                        invoiceValues.total_purchase_discount_amt != ""
                        ? invoiceValues.total_purchase_discount_amt
                        : 0
                    );
                    requestData.append(
                      "purchase_disc_ledger",
                      returnValues.purchase_disc_ledger
                        ? returnValues.purchase_disc_ledger.value
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
                                vc["subcategoryDetails"] =
                                  vc.subcategoryDetails.map((vs) => {
                                    vs["subcategoryId"] = vs.subcategoryId
                                      ? vs.subcategoryId.value
                                      : "";
                                    vs["packageDetails"] =
                                      vs.packageDetails.map((vp) => {
                                        vp["packageId"] = vp.packageId
                                          ? vp.packageId.value
                                          : "";
                                        vp.unitDetails = vp.unitDetails.map(
                                          (vu) => {
                                            vu["unitId"] = vu.unitId
                                              ? vu.unitId.value
                                              : "";

                                            vu["is_multi_unit"] =
                                              vu.is_multi_unit;
                                            vu["rate"] = vu.rate;
                                            vu["dis_amt"] =
                                              vu.dis_amt != "" ? vu.dis_amt : 0;
                                            vu["dis_per"] =
                                              vu.dis_per != "" ? vu.dis_per : 0;
                                            vu["rate_a"] = vu.rate_a;
                                            vu["rate_b"] = vu.rate_b;
                                            vu["rate_c"] = vu.rate_c;
                                            vu["max_discount"] =
                                              vu.max_discount;
                                            vu["min_discount"] =
                                              vu.min_discount;
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
                                      });
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

                    if (
                      authenticationService.currentUserValue.state &&
                      invoice_data &&
                      invoice_data.supplierCodeId &&
                      invoice_data.supplierCodeId.state !=
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
                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
                      requestData.append("taxFlag", true);
                    }

                    for (let [name, value] of requestData) {
                    }
                    // MyNotifications.fire(
                    //   {
                    //     show: true,
                    //     icon: "confirm",
                    //     title: "Confirm",
                    //     msg: "Do you want to submit",
                    //     is_button_show: false,
                    //     is_timeout: false,
                    //     delay: 0,
                    //     handleSuccessFn: () => {
                    createPurchaseInvoice(requestData)
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
                          resetForm();
                          this.initRow();

                          eventBus.dispatch("page_change", {
                            from: "tranx_purchase_invoice_create",
                            to: "tranx_debit_note_list_B2B",

                            isNewTab: false,
                          });
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
                        setSubmitting(false);
                        console.log("error", error);
                      });
                    // },
                    //     handleFailFn: () => {
                    //       setSubmitting(false);
                    //       // this.setState({ opendiv: false });
                    //     },
                    //   },
                    //   () => {
                    //     console.warn("return_data");
                    //   }
                    // );
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
                      {/* {JSON.stringify(invoice_data)} */}
                      <Row className="mb-3">
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
                              <span className="ml-3">&nbsp;&nbsp;YES</span>
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
                              <span className="ml-3">&nbsp;&nbsp;NO</span>
                            </Form.Label>

                            <span className="text-danger">
                              {errors.newReference && "Select Option"}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                      {values.newReference === "true" && (
                        <div className="">
                          <Table className="serialnotbl additionachargestbl  table-bordered">
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
                                        isAllCheckeddebit === true
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        this.handleBillsSelectionAllDebit(
                                          e.target.checked
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                </th>
                                <th>Debit Note No</th>
                                <th> Debit Note Date</th>
                                <th>Total amount</th>
                                <th style={{ width: "23%" }}>Paid Amt</th>
                                <th>Remaining Amt</th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                borderTop: "2px solid transparent",
                                textAlign: "center",
                              }}
                            >
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
                                            v.debit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionDebit(
                                              v.debit_note_no,
                                              i,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                      </Form.Group>
                                    </td>
                                    <td>{v.debit_note_no}</td>

                                    <td>
                                      {moment(v.debit_note_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>

                                    <td>{v.Total_amt}</td>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        onChange={(e) => {
                                          e.preventDefault();

                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            i
                                          );
                                        }}
                                        value={v.debit_paid_amt}
                                        className="paidamttxt"
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(
                                        v.debit_remaining_amt
                                      ).toFixed(2)
                                        ? v.debit_remaining_amt
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
                                          next.debit_paid_amt
                                            ? next.debit_paid_amt
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
                                          next.debit_remaining_amt
                                            ? next.debit_remaining_amt
                                            : 0
                                        )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      )}

                      <Row className="m-2">
                        <Col md={12}>
                          <Button
                            className="successbtn-style  float-end"
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Modal.Body>
          </Modal>
          ;{/* ledgr Modal */}
          <Modal
            show={ledgerModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Select Ledger
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.ledgerModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-2  mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={{ span: 1, offset: 4 }}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "ledger",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "tranx_debit_note_product_list_B2B",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_debit_note_product_list_B2B",
                          to: "ledgercreate",
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
                  >
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="tnx-pur-inv-ModalStyle">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ledger Name</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerList.map((v, i) => {
                      return (
                        <tr
                          className={`${JSON.stringify(v) == JSON.stringify(selectedLedger)
                            ? "selected-tr"
                            : ""
                            }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ selectedLedger });
                            let id = 0;
                            if (selectedLedger != "") {
                              if (this.myRef.current) {
                                let opt = [];
                                if (selectedLedger != null) {
                                  id = selectedLedger.id;
                                  opt = selectedLedger.gstDetails.map(
                                    (v, i) => {
                                      return {
                                        label: v.gstNo,
                                        value: v.id,
                                        state: v.state,
                                      };
                                    }
                                  );
                                  console.log("opt", opt);
                                  this.setState({
                                    lstGst: opt,
                                  });
                                }
                                console.log("lstGst", lstGst, supplierCodeLst);
                                this.myRef.current.setFieldValue(
                                  "clientNameId",
                                  selectedLedger != ""
                                    ? selectedLedger.ledger_name
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "clientCodeId",
                                  selectedLedger != ""
                                    ? getSelectValue(
                                      supplierCodeLst,
                                      selectedLedger.id
                                    )
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "salesman",
                                  selectedLedger != ""
                                    ? selectedLedger.sales_man
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "gstId",
                                  selectedLedger != ""
                                    ? getValue(opt, ledgerData.gst_number)
                                    : ""
                                );
                              }
                              this.setState(
                                {
                                  ledgerModal: false,
                                  // invoice_data: invoice_data,
                                  selectedLedger: "",
                                },
                                () => {
                                  this.handleSubmitSCList(id);
                                }
                              );
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log({ v });
                            this.setState({ selectedLedger: v }, () => {
                              this.transaction_ledger_detailsFun(v.id);
                            });
                          }}
                        >
                          <td>{v.code}</td>
                          <td>{v.ledger_name}</td>
                          <td>{v.city}</td>
                          <td>{v.contact_number}</td>
                          <td>{v.current_balance}</td>
                          <td>{v.balance_type}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "ledger",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page:
                                      "tranx_debit_note_product_list_B2B",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_debit_note_product_list_B2B",
                                    to: "ledgeredit",
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
                            <img
                              src={TableDelete}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "ledger",
                                    "delete",
                                    this.props.userPermissions
                                  )
                                ) {
                                  MyNotifications.fire(
                                    {
                                      show: true,
                                      icon: "confirm",
                                      title: "Confirm",
                                      msg: "Do you want to Delete",
                                      is_button_show: false,
                                      is_timeout: false,
                                      delay: 0,
                                      handleSuccessFn: () => {
                                        this.deleteledgerFun(v.id);
                                      },
                                      handleFailFn: () => { },
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
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {/* <div>
                <Table>
                  <tbody className="gradient">
                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label"> GST No.:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.gst_number : ""}
                      </td>
                      <td className="colored_label">Contact Person:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.contact_name : ""}
                      </td>
                      <td className="colored_label">Credit Days:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.credit_days : ""}
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label"> Licence No.:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.license_number : ""}
                      </td>
                      <td className="colored_label">Area: </td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.area : ""}
                      </td>
                      <td className="colored_label"> Transport:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.route : ""}
                      </td>
                    </tr>

                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label">FSSAI:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.fssai_number : ""}
                      </td>
                      <td className="colored_label"> Route:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.route : ""}
                      </td>
                      <td className="colored_label">Bank:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.bank_name : ""}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div> */}
              <div className="ledger_details_style">
                <Row className="mx-1">
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0 ">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>GST No.:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.gst_number : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Licence No.:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != ""
                                ? ledgerData.license_number
                                : ""}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td>FSSAI:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.fssai_number : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Contact Person:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.contact_name : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Area:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.area : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Route:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0 ">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Credit Days:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.credit_days : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Transport:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Bank:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.bank_name : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col md="12 p-3" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style"
                    type="button"

                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedLedger: "" }, () => {
                        this.ledgerModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button> */}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          ;{/* Ledger Name modal */}
          <Modal show={ledgerNameModal} size="xl" className="mt-5 mainmodal">
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Ledger Name Select
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ ledgerNameModal: false });
                }}
              />
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="ledger_details_style">
                <Row className="mx-1 mb-3">
                  <Col lg={4}>
                    <Row>
                      <Col lg={5}>
                        <Form.Label className="colored_label">
                          Ledger Name 1:
                        </Form.Label>
                      </Col>
                      <Col lg={7} className="sub_col_style">
                        <Select
                          className="selectTo"
                          styles={purchaseSelect}
                          isClearable={true}
                          name=""
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4}>
                    <Row>
                      <Col lg={5}>
                        <Form.Label className="colored_label">
                          Ledger Name 1:
                        </Form.Label>
                      </Col>
                      <Col lg={7} className="sub_col_style">
                        <Select
                          className="selectTo"
                          styles={purchaseSelect}
                          isClearable={true}
                          name=""
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4}>
                    <Row>
                      <Col lg={5}>
                        <Form.Label className="colored_label">
                          Ledger Name 1:
                        </Form.Label>
                      </Col>
                      <Col lg={7} className="sub_col_style">
                        <Select
                          className="selectTo"
                          styles={purchaseSelect}
                          isClearable={true}
                          name=""
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col md="12" className="btn_align">
                  <Button
                    className="submit-btn successbtn-style me-2"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to cancel",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            if (this.state.source != "") {
                              eventBus.dispatch("page_change", {
                                from: "newproductcreate",
                                to: this.state.source.from_page,
                                prop_data: {
                                  rows: this.state.source.rows,
                                  invoice_data: this.state.source.invoice_data,
                                },
                                isNewTab: false,
                              });
                              this.setState({ source: "" });
                            } else {
                              eventBus.dispatch("page_change", "productlist");
                            }
                          },
                          handleFailFn: () => {
                            eventBus.dispatch(
                              "page_change",
                              "newproductcreate"
                            );
                          },
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {/* <Button
                    className="ml-2 alterbtn"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv }, () => {
                        this.pageReload();
                      });
                    }}
                  >
                    Cancel
                  </Button> */}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          ;{/* New Batch Modal */}
          <Modal
            show={newBatchModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            {" "}
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Batch
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ newBatchModal: false });
                }}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={batchInitVal}
              // validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let { rows, rowIndex, b_details_id, is_expired } = this.state;

                console.warn(
                  "rahul::batch values, is_expired, rowIndex",
                  values,
                  is_expired,
                  rowIndex
                );
                console.warn(
                  "rahul::b_details_id",
                  values,
                  is_expired,
                  b_details_id,
                  this.myRef.current.values
                );
                // debugger;
                let batchError = false;
                // if (b_details_id == 0 && batchData.length > 0) {
                //   batchError = true;
                // } else
                {
                  if (b_details_id != 0) {
                    batchError = false;
                    let salesrate = b_details_id.min_rate_a;

                    if (
                      this.myRef.current.values &&
                      this.myRef.current.values.supplierCodeId &&
                      parseInt(
                        this.myRef.current.values.supplierCodeId.salesRate
                      ) == 2
                    ) {
                      salesrate = b_details_id.min_rate_b;
                    } else if (
                      this.myRef.current.values &&
                      this.myRef.current.values.supplierCodeId &&
                      parseInt(
                        this.myRef.current.values.supplierCodeId.salesRate
                      ) == 3
                    ) {
                      salesrate = b_details_id.min_rate_c;
                    }

                    rows[rowIndex]["rate"] = b_details_id.purchase_rate;
                    rows[rowIndex]["sales_rate"] = salesrate;

                    rows[rowIndex]["b_details_id"] = b_details_id.id;
                    rows[rowIndex]["b_no"] = b_details_id.batch_no;
                    rows[rowIndex]["b_rate"] = b_details_id.b_rate;

                    rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
                    rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
                    rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
                    rows[rowIndex]["margin_per"] = b_details_id.min_margin;
                    rows[rowIndex]["b_purchase_rate"] =
                      b_details_id.purchase_rate;
                    rows[rowIndex]["costing"] = invoice_data.costing;
                    rows[rowIndex]["cost_with_tax"] =
                      invoice_data.costingWithTax;

                    rows[rowIndex]["b_expiry"] =
                      b_details_id.expiry_date != ""
                        ? b_details_id.expiry_date
                        : "";

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
                      parseInt(
                        this.myRef.current.values.supplierCodeId.salesRate
                      ) == 2
                    ) {
                      salesrate = values.rate_b;
                    } else if (
                      this.myRef.current.values &&
                      this.myRef.current.values.supplierCodeId &&
                      parseInt(
                        this.myRef.current.values.supplierCodeId.salesRate
                      ) == 3
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
                    rows[rowIndex]["cost_with_tax"] =
                      invoice_data.costingWithTax;

                    rows[rowIndex]["b_expiry"] =
                      values.b_expiry != ""
                        ? moment(
                          new Date(
                            moment(values.b_expiry, "DD/MM/YYYY").toDate()
                          )
                        ).format("YYYY-MM-DD")
                        : "";

                    rows[rowIndex]["manufacturing_date"] =
                      values.manufacturing_date != ""
                        ? moment(
                          new Date(
                            moment(
                              values.manufacturing_date,
                              "DD/MM/YYYY"
                            ).toDate()
                          )
                        ).format("YYYY-MM-DD")
                        : "";

                    rows[rowIndex]["is_batch"] = isBatch;
                  }
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
                  {/* {JSON.stringify(b_details_id)}
                  {JSON.stringify(rowIndex)} */}
                  <Modal.Body className="tnx-pur-inv-mdl-body p-0">
                    <div style={{ background: "#E6F2F8" }} className="p-3">
                      <Row className="mb-3">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Batch No.</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Batch No"
                                  name="b_no"
                                  id="b_no"
                                  onChange={handleChange}
                                  value={values.b_no}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>MRP</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="MRP"
                                  name="b_rate"
                                  id="b_rate"
                                  onChange={handleChange}
                                  value={values.b_rate}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Purchase Rate</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Purchase Rate"
                                  name="b_purchase_rate"
                                  id="b_purchase_rate"
                                  onChange={handleChange}
                                  value={values.b_purchase_rate}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.validatePurchaseRate(
                                      values.b_rate,
                                      values.b_purchase_rate,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Sales Rate A</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Sales Rate A"
                                  name="rate_a"
                                  id="rate_a"
                                  onChange={handleChange}
                                  value={values.rate_a}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_a > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_a,
                                        "rate_a",
                                        setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Sales Rate B</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Sales Rate B"
                                  name="rate_b"
                                  id="rate_b"
                                  onChange={handleChange}
                                  value={values.rate_b}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_b > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_b,
                                        "rate_b",
                                        setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Sales Rate C</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Sales Rate C"
                                  name="rate_c"
                                  id="rate_c"
                                  onChange={handleChange}
                                  value={values.rate_c}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_c > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_c,
                                        "rate_c",
                                        setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>MFG Date</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <MyTextDatePicker
                                className="form-control"
                                innerRef={(input) => {
                                  this.mfgDateRef.current = input;
                                }}
                                name="manufacturing_date"
                                id="manufacturing_date"
                                placeholder="DD/MM/YYYY"
                                value={values.manufacturing_date}
                                onChange={handleChange}
                                onBlur={(e) => {
                                  console.log("e ", e);
                                  console.log(
                                    "e.target.value ",
                                    e.target.value
                                  );
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
                                        msg: "Invalid date",
                                        is_button_show: true,
                                      });
                                      this.mfgDateRef.current.focus();
                                      setFieldValue("manufacturing_date", "");
                                    }
                                  } else {
                                    setFieldValue("manufacturing_date", "");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Expiry Date</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <MyTextDatePicker
                                className="form-control"
                                innerRef={(input) => {
                                  this.batchdpRef.current = input;
                                }}
                                name="b_expiry"
                                id="b_expiry"
                                placeholder="DD/MM/YYYY"
                                value={values.b_expiry}
                                onChange={handleChange}
                                onBlur={(e) => {
                                  console.log("e ", e);

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
                                      let mfgDate = values.manufacturing_date;
                                      if (mfgDate == "" && mfgDate == null) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "First input manufacturing date",
                                          is_button_show: true,
                                        });
                                        this.mfgDateRef.current.focus();
                                        setFieldValue("b_expiry", "");
                                      } else {
                                        mfgDate = new Date(
                                          moment(
                                            values.manufacturing_date
                                          ).format("DD-MM-yyyy")
                                        );

                                        let expDate = new Date(
                                          moment(
                                            e.target.value,
                                            "DD/MM/YYYY"
                                          ).toDate()
                                        );
                                        console.log(
                                          "rahul:: mfgDate, expDate",
                                          mfgDate,
                                          expDate
                                        );
                                        console.warn(
                                          "rahul::compare",
                                          mfgDate < expDate
                                        );

                                        if (mfgDate < expDate) {
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
                                            msg: "Expiry date should be greater MFG date",
                                            is_button_show: true,
                                          });
                                          setFieldValue("b_expiry", "");
                                          this.batchdpRef.current.focus();
                                        }
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid date",
                                        is_button_show: true,
                                      });
                                      this.batchdpRef.current.focus();
                                      setFieldValue("b_expiry", "");
                                    }
                                  } else {
                                    setFieldValue("b_expiry", "");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Margin %</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Margin %"
                                  name="margin_per"
                                  id="margin_per"
                                  onChange={handleChange}
                                  value={values.margin_per}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Costing</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Control
                                type="text"
                                placeholder="Costing"
                                name="costing"
                                id="costing"
                                onChange={handleChange}
                                value={invoice_data.costing}
                                readOnly
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Cost with tax</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Cost with tax"
                                  name="cost_with_tax"
                                  id="cost_with_tax"
                                  onChange={handleChange}
                                  value={invoice_data.costingWithTax}
                                  readOnly
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>

                    <div
                      className="tnx-pur-inv-ModalStyle"
                      style={{ height: "18vh" }}
                    >
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Batch</th>
                            <th>Current Stock</th>
                            <th>Sale Rate</th>
                            <th>MRP</th>
                            <th>Purchase Rate</th>
                            <th>Net Rate</th>
                            <th>Sale Rate with tax</th>
                            <th>MFG Date</th>
                            <th>Expiry</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchData.map((v, i) => {
                            return (
                              <tr
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState(
                                    {
                                      b_details_id: v,
                                      tr_id: i + 1,
                                      is_expired: v.is_expired,
                                    },
                                    () => {
                                      this.transaction_batch_detailsFun(
                                        v.batch_no
                                      );
                                    }
                                  );
                                }}
                                className={`${is_expired != true
                                  ? tr_id == i + 1
                                    ? "tr-color"
                                    : ""
                                  : ""
                                  // v.is_expired == true ? "bg-danger" : ""
                                  }`}
                              >
                                <td>{v.batch_no}</td>
                                <td>{v.closing_stock}</td>
                                <td>{v.sales_rate}</td>
                                <td>{v.mrp}</td>
                                <td>{v.purchase_rate}</td>
                                <td>{parseFloat(v.net_rate).toFixed(2)}</td>
                                <td>
                                  {parseFloat(v.sales_rate_with_tax).toFixed(2)}
                                </td>
                                <td>{v.manufacturing_date}</td>
                                <td>{v.expiry_date}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                    {/* <div className=" mt-2">
                      <Row className="mx-1">
                        <Col lg={6} className="tbl-color">
                          <Row>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Supplier:
                              </Form.Label>
                            </Col>
                            <Col lg={8} className="sub_col_style">
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.supplierName
                                  : ""}
                              </p>
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Bill No.:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != "" ? batchDetails.billNo : ""}
                              </p>
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Bill Date:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.billDate
                                  : ""}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6} className="tbl-color">
                          <Row>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Margin %:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.minMargin
                                  : ""}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div> */}
                    <div className="ledger_details_style">
                      <Row className="mx-1">
                        <Col lg={6} md={6} sm={6} xs={6} className="tbl-color">
                          <Table className="colored_label mb-0 ">
                            <tbody style={{ borderBottom: "0px transparent" }}>
                              <tr>
                                <td>Supplier:</td>
                                <td>
                                  {" "}
                                  <p className="colored_sub_text mb-0">
                                    {batchDetails != ""
                                      ? batchDetails.supplierName
                                      : ""}
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td> Bill Date:</td>
                                <td>
                                  {" "}
                                  <p className="colored_sub_text mb-0">
                                    {batchDetails != ""
                                      ? batchDetails.billDate
                                      : ""}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6} className="tbl-color">
                          <Table className="colored_label mb-0">
                            <tbody style={{ borderBottom: "0px transparent" }}>
                              <tr>
                                <td> Margin %:</td>
                                <td>
                                  {" "}
                                  <p className="colored_sub_text mb-0">
                                    {batchDetails != ""
                                      ? batchDetails.minMargin
                                      : ""}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td>Bill No.:</td>
                                <td>
                                  <p className="colored_sub_text mb-0">
                                    {batchDetails != ""
                                      ? batchDetails.billNo
                                      : ""}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </div>
                    <Row className="my-2 pe-1">
                      <Col md="12" className="btn_align">
                        <Button
                          className="submit-btn successbtn-style me-2"
                          type="submit"
                        >
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          Cancel
                        </Button>
                        {/* <Button
                    className="ml-2 alterbtn"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv }, () => {
                        this.pageReload();
                      });
                    }}
                  >
                    Cancel
                  </Button> */}
                      </Col>
                    </Row>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>
          ;{/* select Product modal */}
          <Modal
            show={selectProductModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            {" "}
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Select Product
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.SelectProductModalFun(false);
                }}
              />
            </Modal.Header>
            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-3 mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_product_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={1} className="mt-2">
                  <Form.Label>Barcode</Form.Label>
                </Col>
                <Col lg={3}>
                  <InputGroup className="mdl-text">
                    <Form.Control
                      autoFocus="true"
                      type="text"
                      placeholder="Enter"
                      name="gst_per"
                      id="gst_per"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_product_listFun("", e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="scanner_icon" src={Scanner} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>

                <Col lg={2}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "product",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "tranx_debit_note_product_list_B2B",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_debit_note_product_list_B2B",
                          to: "newproductcreate",
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
                  >
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="tnx-pur-inv-ModalStyle">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Packing</th>
                      <th>Barcode</th>
                      <th>MRP</th>
                      <th>Current Stock</th>
                      <th>Sale Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLst.map((pv, pi) => {
                      return (
                        <tr
                          className={`${JSON.stringify(pv) ==
                            JSON.stringify(selectedProduct)
                            ? "selected-tr"
                            : ""
                            }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ selectedProduct, rowIndex });
                            if (selectedProduct != "") {
                              rows[rowIndex]["productName"] =
                                selectedProduct.product_name;
                              rows[rowIndex]["productId"] = selectedProduct.id;
                              rows[rowIndex]["is_level_a"] =
                                productData.is_level_a;
                              rows[rowIndex]["is_level_b"] =
                                productData.is_level_b;
                              rows[rowIndex]["is_level_c"] =
                                productData.is_level_c;
                              rows[rowIndex]["is_batch"] = productData.is_batch;

                              let unit_id = {
                                gst: productData.igst,
                                igst: productData.igst,
                                cgst: productData.cgst,
                                sgst: productData.sgst,
                              };

                              rows[rowIndex]["unit_id"] = unit_id;

                              console.log({ rows });

                              this.setState(
                                {
                                  rows: rows,
                                  selectProductModal: false,
                                  levelOpt: [],
                                },
                                () => {
                                  this.getProductPackageLst(
                                    selectedProduct.id,
                                    rowIndex
                                  );
                                }
                              );
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ selectedProduct: pv }, () => {
                              this.transaction_product_detailsFun(pv.id);
                              this.get_purchase_return_supplierlist_by_productidFun(
                                pv.id
                              );
                              this.setState({ add_button_flag: true });
                            });
                          }}
                        >
                          <td>{pv.code}</td>
                          <td>{pv.product_name}</td>
                          <td>{pv.packing}</td>
                          <td>{pv.barcode}</td>
                          <td>{pv.mrp}</td>
                          <td>{pv.current_stock}</td>
                          <td>{pv.sales_rate}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "product",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page:
                                      "tranx_debit_note_product_list_B2B",
                                  };

                                  let data = {
                                    source: source,
                                    id: pv.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_debit_note_product_list_B2B",
                                    to: "productedit",
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
                            <img
                              src={TableDelete}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                MyNotifications.fire(
                                  {
                                    show: true,
                                    icon: "confirm",
                                    title: "Confirm",
                                    msg: "Do you want to Delete",
                                    is_button_show: false,
                                    is_timeout: false,
                                    delay: 0,
                                    handleSuccessFn: () => {
                                      this.deleteproduct(pv.id);
                                    },
                                    handleFailFn: () => { },
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {/* <div className="ledger_details_style mt-5">
                <Row className="mx-1">
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Brand:
                        </Form.Label>
                      </Col>
                      <Col lg={8} className="sub_col_style">
                        <p className="colored_sub_text">
                          {productData != "" ? productData.brand : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Group:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.group : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Category:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.category : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Supplier:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.supplier : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          HSN:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.hsn : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Tax Type:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.tax_type : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Tax %:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.tax_per : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Margin %:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.margin_per : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Cost:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.cost : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Shelf ID:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.shelf_id : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Min Stock:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {productData != "" ? productData.min_stock : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2 ">
                          Max Stock:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {productData != "" ? productData.max_stock : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div> */}
              <div>
                <div className="">
                  <Row className="mx-1">
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>Brand:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.brand : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Group:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.group : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Category:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.category : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Supplier:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.supplier : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>HSN:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.hsn : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Tax Type:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.tax_type : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Tax%:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.tax_per : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Margin%:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != ""
                                  ? productData.margin_per
                                  : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>Cost:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.cost : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Shelf ID:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.shelf_id : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Min Stock:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {" "}
                                {productData != "" ? productData.min_stock : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Max Stock:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {" "}
                                {productData != "" ? productData.max_stock : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              </div>
              <Row className="p-3">
                <Col md="12 mt-1" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style me-2"
                    type="button"

                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedProduct: "" }, () => {
                        this.SelectProductModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button> */}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          ;{/* Adjustment and pending bill modal  start*/}
          <Modal
            show={adjusmentbillmodal}
            // size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ adjusmentbillmodal: false })}
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Adjust Bills
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handeladjusmentbillmodal(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              innerRef={this.AdjustBillRef}
              initialValues={{
                newReference: "",
                credit: "",
                refund: "",
                cr: "",
                outstanding:
                  this.myRef.current && this.myRef.current.values.bill_amount,
                outstanding1:
                  this.myRef.current && this.myRef.current.values.bill_amount,
                transaction_dt: moment().format("YYYY-MM-DD"),
                paidAmount: "",
              }}
              validationSchema={Yup.object().shape({
                newReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("values---rohan", values);
                let invoiceValues = this.myRef.current.values;
                console.log("Invoice----", invoiceValues);

                let requestData = new FormData();
                requestData.append("type", values.newReference);

                // console.log({ invoice_data, initVal, invoiceLstSC });
                if (values.newReference !== "credit") {
                  requestData.append("value", values.paidAmount);
                } else {
                  requestData.append("value", values.outstanding);
                }

                // console.log('purchaseReturnData.returnData', purchaseReturnData);
                if (purchaseReturnData.returnData.source == "pur_invoice") {
                  requestData.append(
                    "source",
                    purchaseReturnData.returnData.source
                  );
                  requestData.append(
                    "pur_invoice_id",
                    purchaseReturnData.returnData.id
                  );
                } else if (
                  purchaseReturnData.returnData.source == "pur_challan"
                ) {
                  requestData.append(
                    "source",
                    purchaseReturnData.returnData.source
                  );
                  requestData.append(
                    "pur_challan_id",
                    purchaseReturnData.returnData.id
                  );
                }

                // !Invoice Data

                requestData.append(
                  "pur_return_invoice_no",
                  invoiceValues.pi_no
                );
                requestData.append(
                  "purchase_return_date",
                  moment(invoice_data.invoice_dt).format("yyyy-MM-DD")
                );

                requestData.append(
                  "purchase_account_id",
                  invoiceValues.purchaseId.value
                );

                requestData.append(
                  "purchase_return_sr_no",
                  invoiceValues.pi_sr_no
                );

                requestData.append(
                  "transaction_dt",
                  moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                );
                requestData.append(
                  "supplier_code_id",
                  invoiceValues.supplierCodeId.value
                );
                // !Invoice Data

                let returnValues = this.myRef.current.values;
                requestData.append("roundoff", returnValues.roundoff);
                if (returnValues.narration && returnValues.narration != "") {
                  requestData.append("narration", returnValues.narration);
                }

                requestData.append(
                  "total_base_amt",
                  returnValues.total_base_amt
                );
                requestData.append("totalamt", returnValues.totalamt);
                requestData.append(
                  "taxable_amount",
                  returnValues.total_taxable_amt
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
                requestData.append(
                  "totalqty",
                  returnValues.totalqty && returnValues.totalqty != ""
                    ? returnValues.totalqty
                    : 0
                );
                requestData.append("tcs", returnValues.tcs);
                requestData.append(
                  "purchase_discount",
                  returnValues.purchase_discount &&
                    returnValues.purchase_discount != ""
                    ? returnValues.purchase_discount
                    : 0
                );
                requestData.append(
                  "purchase_discount_amt",
                  returnValues.purchase_discount_amt &&
                    returnValues.purchase_discount_amt != ""
                    ? returnValues.purchase_discount_amt
                    : 0
                );
                requestData.append(
                  "total_purchase_discount_amt",
                  returnValues.total_purchase_discount_amt &&
                    returnValues.total_purchase_discount_amt != ""
                    ? returnValues.total_purchase_discount_amt
                    : 0
                );
                requestData.append(
                  "purchase_disc_ledger",
                  returnValues.purchase_disc_ledger
                    ? returnValues.purchase_disc_ledger.value
                    : 0
                );

                let frow = rows.map((v, i) => {
                  if (v.productId != "") {
                    v.details_id = v.details_id != "" ? v.details_id : 0;
                    v.productId = v.productId ? v.productId : "";
                    v["unit_conv"] = v.unitId ? v.unitId.unitConversion : "";
                    v["unitId"] = v.unitId ? v.unitId.value : "";
                    v["levelaId"] = v.levelaId ? v.levelaId.value : "";
                    v["levelbId"] = v.levelbId ? v.levelbId.value : "";
                    v["levelcId"] = v.levelcId ? v.levelcId.value : "";
                    v["rate"] = v.rate;
                    v["free_qty"] = v.free_qty != "" ? v.free_qty : 0;
                    v["dis_amt"] = v.dis_amt != "" ? v.dis_amt : 0;
                    v["dis_per"] = v.dis_per != "" ? v.dis_per : 0;
                    v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
                    v["rate_a"] = v.rate_a;
                    v["margin_per"] = v.margin_per;
                    v["min_margin"] = v.min_margin;
                    v["b_details_id"] =
                      v.b_details_id != "" ? v.b_details_id : 0;
                    v["b_expiry"] = v.b_expiry
                      ? moment(v.b_expiry).format("yyyy-MM-DD")
                      : "";
                    v["manufacturing_date"] = v.manufacturing_date
                      ? moment(v.manufacturing_date).format("yyyy-MM-DD")
                      : "";
                    v["is_batch"] = v.is_batch;
                    v["isBatchNo"] = v.b_no;
                    v["igst"] = v.igst != "" ? v.igst : 0;
                    v["cgst"] = v.cgst != "" ? v.cgst : 0;
                    v["sgst"] = v.sgst != "" ? v.sgst : 0;
                    return v;
                  }
                });

                var filtered = frow.filter(function (el) {
                  return el != null;
                });

                let additionalChargesfilter = additionalCharges.filter((v) => {
                  if (
                    v.ledgerId != "" &&
                    v.ledgerId != undefined &&
                    v.ledgerId != null
                  ) {
                    v["ledger"] = v["ledgerId"]["value"];
                    return v;
                  }
                });
                requestData.append(
                  "additionalChargesTotal",
                  additionalChargesTotal
                );
                requestData.append("row", JSON.stringify(filtered));
                // requestData.append(
                //   "additionalCharges",
                //   JSON.stringify(additionalChargesfilter)
                // );

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
                  invoice_data.supplierCodeId &&
                  invoice_data.supplierCodeId.state !=
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

                // let filterRowDetail = [];
                // if (rowDelDetailsIds.length > 0) {
                //   filterRowDetail = rowDelDetailsIds.map((v) => {
                //     return { del_id: v };
                //   });
                // }
                // requestData.append(
                //   "rowDelDetailsIds",
                //   JSON.stringify(filterRowDetail)
                // );
                if (invoiceValues.total_qty !== "") {
                  requestData.append(
                    "total_qty",
                    invoiceValues.total_qty !== ""
                      ? parseInt(invoiceValues.total_qty)
                      : 0
                  );
                }
                if (invoiceValues.total_free_qty !== "") {
                  requestData.append(
                    "total_free_qty",
                    invoiceValues.total_free_qty !== ""
                      ? invoiceValues.total_free_qty
                      : 0
                  );
                }
                // !Total Qty*Rate
                requestData.append(
                  "total_row_gross_amt",
                  invoiceValues.total_row_gross_amt
                );
                requestData.append(
                  "total_base_amt",
                  invoiceValues.total_base_amt
                );
                // !Discount
                requestData.append(
                  "total_invoice_dis_amt",
                  invoiceValues.total_invoice_dis_amt
                );
                // !Taxable Amount
                requestData.append(
                  "taxable_amount",
                  invoiceValues.total_taxable_amt
                );
                // !Taxable Amount
                requestData.append(
                  "total_tax_amt",
                  invoiceValues.total_tax_amt
                );
                // !Bill Amount
                requestData.append("bill_amount", invoiceValues.bill_amount);
                console.log("requestData", requestData.values());
                // List key/value pairs
                for (let [name, value] of requestData) {
                  console.log(`Formdata ${name} = ${value}`); // key1 = value1, then key2 = value2
                }

                console.log("submit call");
                create_purchase_returns_invoices(requestData)
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
                      resetForm();
                      this.initRow();

                      eventBus.dispatch("page_change", {
                        from: "tranx_debit_note_product_list_B2B",
                        to: "tranx_debit_note_list_B2B",

                        isNewTab: false,
                      });
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
                  <Modal.Body className="purchaseumodal p-invoice-modal ">
                    <div className="purchasescreen pb-2 pt-0 pl-2 pr-2">
                      <Row>
                        <Col md="3">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="cash"
                                checked={
                                  values.newReference === "cash" ? true : false
                                }
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;Cash</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="credit"
                                checked={
                                  values.newReference === "credit"
                                    ? true
                                    : false
                                }
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;Credit</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="nightshiftlabel">
                            <Form.Label className="ml-3">
                              <input
                                name="newReference"
                                type="radio"
                                value="mobilePayment"
                                onChange={handleChange}
                                checked={
                                  values.newReference === "mobilePayment"
                                    ? true
                                    : false
                                }
                                className="mr-3"
                              />
                              <span className="ml-3">
                                &nbsp;&nbsp;Mobile Payment
                              </span>
                            </Form.Label>

                            <span className="text-danger">
                              {errors.newReference && "Select Option"}
                            </span>
                          </Form.Group>
                        </Col>

                        {values.newReference !== "" &&
                          values.newReference !== "credit" && (
                            <Row className="mt-4">
                              <Col lg={4} md={3}>
                                <Form.Group className="gender nightshiftlabel">
                                  <Form.Label>Paid Amount</Form.Label>
                                  <Form.Control
                                    placeholder="Paid Amount"
                                    className="text-box"
                                    id="paidAmount"
                                    name="paidAmount"
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      e.preventDefault();

                                      let val = e.target.value;
                                      setFieldValue("paidAmount", val);
                                      if (
                                        parseFloat(val) >
                                        parseFloat(values.outstanding1)
                                      ) {
                                        setFieldValue("paidAmount", "");
                                        setFieldValue(
                                          "outstanding",
                                          values.outstanding1
                                        );
                                      } else if (
                                        parseFloat(val) > 0 &&
                                        parseFloat(val) <=
                                        parseFloat(values.outstanding1)
                                      ) {
                                        let res =
                                          parseFloat(values.outstanding1) -
                                          parseFloat(val);
                                        setFieldValue(
                                          "outstanding",
                                          parseFloat(res).toFixed(2)
                                        );
                                      } else {
                                        setFieldValue("paidAmount", "");
                                        setFieldValue(
                                          "outstanding",
                                          values.outstanding1
                                        );
                                      }
                                    }}
                                    value={values.paidAmount}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={4} md={3}>
                                <Form.Group className="gender nightshiftlabel">
                                  <Form.Label>Outstanding</Form.Label>
                                  <Form.Control
                                    placeholder="Paid Amount"
                                    className="text-box"
                                    id="outstanding"
                                    name="outstanding"
                                    onChange={handleChange}
                                    value={values.outstanding}
                                    readOnly
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          )}

                        <Col md="12" className="btn_align">
                          <Button
                            className="successbtn-style ms-2"
                            type="submit"
                            style={{
                              borderRadius: "4px",
                              // paddingLeft: "20px",
                              // paddingRight: "20px",
                            }}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>
          ;
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
)(TranxDebitNoteProductCreateB2B);
