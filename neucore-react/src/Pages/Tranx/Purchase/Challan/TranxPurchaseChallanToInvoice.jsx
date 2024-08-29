import React, { Component } from "react";
import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

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
  Tab,
  Nav,
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
  get_pur_order_product_fpu_by_Ids,
  getPurChallanProductFpuByIds,
  getPOChallanInvoiceWithIds,
  getPurchaseOrderById,
  getPOInvoiceWithIds,
  get_supplierlist_by_productid,
} from "@/services/api_functions";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
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
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  flavourDD,
  unitDD,
  allEqual,
  INRformat,
  roundDigit,
  configDecimalPlaces,
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

class TranxPurchaseChallanToInvoice extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.inputRef1 = React.createRef();
    this.pi_noRef = React.createRef();

    this.SelecteRefGSTIN = React.createRef();

    this.state = {
      currentTab: "second", //@prathmesh @batch info & product info tab active
      isCreate: false,
      currentLedgerData: "",
      updatedLedgerType: "SC",
      ledgerType: "SC",
      add_button_flag: true,
      currentDate: new Date(),
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
      isEditDataSet: false,
      reference_type: "",
      batchHideShow: true,
      invoice_data: {
        selectedSupplier: "",
        pi_sr_no: "",
        pi_no: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        pi_invoice_dt: moment(new Date()).format("DD/MM/YYYY"),
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
        purchase_discount: "",
        purchase_discount_amt: "",
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
        tcs_amt: 0,
        tcs_per: 0,
        tcs_mode: "",
      },
      gstId: "",
      costingInitVal: "",
      costingMdl: false,
      batch_data_selected: "",
      is_expired: false,
      serialNoLst: [],
      selectSerialModal: false,
      isLedgerSelectSet: false,
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
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      from_source: "tranx_purchase_challan_to_invoice",
      ledgerId: "",
      setLedgerId: false,
      ledgerInputData: "",
      isTextBox: false,
      sourceUnder: "purchase",
      opType: "create", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      ledgerModal: false,
      ledgerNameModal: false,
      newBatchModal: false,
      newBatchSelectModal: false,
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
      selectedLedgerNo: 1,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      product_hover_details: "",
      product_supplier_lst: [],
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      transactionType: "purchase_edit",
      isRowProductSet: false,
      errorArrayBorder: "",

      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",

      ledgerNameFlag: false, // ! for focus
    };
    this.selectRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();

    this.radioRef = React.createRef();
  }
  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end
  get_transaction_ledger_listFun = () => {
    let requestData = new FormData();
    requestData.append("search", "");
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res---->", res.list);
        if (res.responseStatus == 200) {
          this.setState({
            ledgerList: res.list,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
          console.log("transaction_ledger_listFun", opt, codeopt);
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
          // invoice_data["pi_no"] = res.serialNo;
          // if (this.myRef.current) {
          //   this.myRef.current.setFieldValue("pi_sr_no", res.count);
          //   // this.myRef.current.setFieldValue("pi_no", res.serialNo);
          // }
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
        selectedProduct: "",
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
        dis_amt: "",
        dis_per: "",
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
        b_no: "",
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
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TPCTIProductId-particularsname-" + id).focus();
      }, 1000);
    });
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
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            this.setState({
              lstAdditionalLedger: fOpt,
              orglstAdditionalLedger: fOpt,
            });
          }
        }
      })
      .catch((error) => { });
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
      details_id: "",
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
      dis_amt: "",
      dis_per: "",
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
      b_no: "",
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
    let inp_tcs_per = 0;
    let inp_tcs_amt = 0;

    if (this.myRef.current) {
      console.log("this.myRef.current.values ", this.myRef.current.values);
      let {
        purchase_discount,
        purchase_discount_amt,
        supplierCodeId,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
        tcs_per,
        tcs_amt,
      } = this.myRef.current.values;

      inp_tcs_per = tcs_per;
      inp_tcs_amt = tcs_amt;
      ledger_disc_per = purchase_discount;
      ledger_disc_amt = purchase_discount_amt;

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
      tcs_per: inp_tcs_per,
      tcs_amt: inp_tcs_amt,
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
      tcs_per_cal,
      tcs_amt_cal,
    } = resTranxFn;

    let roundoffamt = Math.round(total_final_amt);
    let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);

    this.myRef.current.setFieldValue(
      "tcs_per",
      isNaN(parseFloat(tcs_per_cal)) ? 0 : parseFloat(tcs_per_cal)
    );
    this.myRef.current.setFieldValue(
      "tcs_amt",
      isNaN(parseFloat(tcs_amt_cal)) ? 0 : parseFloat(tcs_amt_cal)
    );

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

  // getProductBatchList = (rowIndex = -1, source = "batch") => {
  //   const { rows, invoice_data, lstBrand } = this.state;

  //   let product_id = rows[rowIndex]["productId"];
  //   let level_a_id = rows[rowIndex]["levelaId"]["value"];
  //   let level_b_id = rows[rowIndex]["levelbId"]["value"];
  //   let level_c_id = rows[rowIndex]["levelcId"]["value"];
  //   let unit_id = rows[rowIndex]["unitId"]["value"];

  //   let isfound = false;
  //   let productData = getSelectValue(lstBrand, product_id);
  //   let batchOpt = [];

  //   if (productData) {
  //     let levelAData = "";
  //     if (level_a_id > 0) {
  //       levelAData = getSelectValue(productData.levelAOpt, level_a_id);
  //     } else {
  //       levelAData = getSelectValue(productData.levelAOpt, "");
  //     }
  //     if (levelAData) {
  //       let levelBData = "";
  //       if (level_b_id > 0) {
  //         levelBData = getSelectValue(levelAData.levelBOpt, level_b_id);
  //       } else {
  //         levelBData = getSelectValue(levelAData.levelBOpt, "");
  //       }
  //       if (levelBData) {
  //         let levelCData = "";
  //         if (level_c_id > 0) {
  //           levelCData = getSelectValue(levelBData.levelCOpt, level_c_id);
  //         } else {
  //           levelCData = getSelectValue(levelBData.levelCOpt, "");
  //         }
  //         if (levelCData) {
  //           let unitdata = "";
  //           if (unit_id > 0) {
  //             unitdata = getSelectValue(levelCData.unitOpt, unit_id);
  //           } else {
  //             unitdata = getSelectValue(levelCData.unitOpt, "");
  //           }
  //           if (unitdata && unitdata.batchOpt) {
  //             isfound = true;
  //             batchOpt = unitdata.batchOpt;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (isfound == false) {
  //     let invoice_value = this.myRef.current.values;
  //     let reqData = new FormData();
  //     reqData.append("product_id", product_id);
  //     reqData.append("level_a_id", level_a_id);
  //     if (
  //       rows[rowIndex]["levelbId"] != "" &&
  //       rows[rowIndex]["levelbId"]["value"] != ""
  //     )
  //       reqData.append("level_b_id", rows[rowIndex]["levelbId"]["value"]);
  //     if (
  //       rows[rowIndex]["levelcId"] != "" &&
  //       rows[rowIndex]["levelcId"]["value"] != ""
  //     )
  //       reqData.append("level_c_id", rows[rowIndex]["levelcId"]["value"]);
  //     reqData.append("unit_id", unit_id);
  //     reqData.append(
  //       "invoice_date",
  //       moment(invoice_value.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
  //     );

  //     invoice_data["costing"] = "";

  //     invoice_data["costingWithTax"] = "";
  //     let res = [];
  //     get_Product_batch(reqData)
  //       .then((res) => res.data)
  //       .then((response) => {
  //         //console.log("get_Product_batch =>", response);
  //         if (response.responseStatus == 200) {
  //           res = response.data;
  //           //console.log("res ", res);

  //           invoice_data["costing"] = response.costing;
  //           invoice_data["costingWithTax"] = response.costingWithTax;
  //           this.setState(
  //             {
  //               invoice_data: invoice_data,
  //               batchData: res,
  //             },
  //             () => {
  //               this.getInitBatchValue(rowIndex, source);
  //             }
  //           );
  //           //console.log("res->batchData  : ", res);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   } else {
  //     this.setState(
  //       {
  //         batchData: batchOpt,
  //       },
  //       () => {
  //         this.getInitBatchValue(rowIndex, source);
  //       }
  //     );
  //   }
  // };

  getProductBatchList = (
    rowIndex = -1,
    source = "batch",
    isBatchEditOrCreate = false
  ) => {
    const { rows, invoice_data, lstBrand } = this.state;
    // console.log("rows--", rows[rowIndex]["productId"]);

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

    let totalqty =
      (isNaN(parseInt(rows[rowIndex]["qty"]))
        ? 0
        : parseInt(rows[rowIndex]["qty"])) +
      (isNaN(parseInt(rows[rowIndex]["free_qty"]))
        ? 0
        : parseInt(rows[rowIndex]["free_qty"]));

    let costingcal = roundDigit(
      parseFloat(rows[rowIndex]["total_amt"]) / totalqty,
      configDecimalPlaces
    );

    let costingwithtaxcal = roundDigit(
      costingcal + parseFloat(rows[rowIndex]["total_igst"]) / totalqty,
      configDecimalPlaces,
      configDecimalPlaces
    );
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
        costingWithTax: costingwithtaxcal,
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

    const { invoice_data, additionalChargesTotal, rows, reference_type } =
      this.state;
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
    requestData.append("supplier_code_id", invoice_data.selectedSupplier.id);
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
      invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
    );
    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);

    // requestData.append(
    //   "tcs",
    //   invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    // );
    requestData.append(
      "tcs_per",
      invoiceValues.tcs_per && invoiceValues.tcs_per != ""
        ? invoiceValues.tcs_per
        : 0
    );
    requestData.append(
      "tcs_amt",
      invoiceValues.tcs_amt && invoiceValues.tcs_amt != ""
        ? invoiceValues.tcs_amt
        : 0
    );
    requestData.append(
      "tcs_mode",
      invoiceValues.tcs_mode && invoiceValues.tcs_mode != ""
        ? invoiceValues.tcs_mode
        : ""
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
        v.inventoryId = v.inventoryId ? v.inventoryId : 0;
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
        v["is_batch"] = v.is_batch != undefined ? v.is_batch : false;
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
    // final_lst = [];
    // validate_final_lst = [];
    // let filter_json = filtered;
    // filter_json.forEach((v) => {
    //   this.addToCart(v);
    // });

    // let new_ref_data = flatten(validate_final_lst);

    // var resArr = [];
    // new_ref_data.filter(function (item) {
    //   var i = resArr.findIndex((x) => x.refId == item.refId);
    //   if (i <= -1) {
    //     resArr.push(item);
    //   }
    //   return null;
    // });

    // requestData.append("refObject", JSON.stringify(resArr));

    requestData.append("reference_type", reference_type);
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
          ? invoiceValues.additionalChgLedger1.value
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
          ? invoiceValues.additionalChgLedger2.value
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
          ? invoiceValues.additionalChgLedger3.value
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
      invoice_data.gstId != "" &&
      parseInt(invoice_data.gstId.state) !=
      parseInt(authenticationService.currentUserValue.state)
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

    const { purchaseEditData } = this.state;

    let s_o_id = purchaseEditData.selectedPCBills.map((v) => {
      return { id: v };
    });


    requestData.append("reference_sc_id", JSON.stringify(s_o_id));
    requestData.append("reference", "PRSCHN");
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

          // eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
          eventBus.dispatch("page_change", {
            from: "tranx_purchase_challan_to_invoice",
            to: "tranx_purchase_invoice_list",
            isNewTab: false,
            isCancel: true,
            prop_data: {
              isCreate: true,
            },
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
    if (prop_data.mdl_additionalcharges) {
      this.setState({
        additionchargesyes: true,
      });
    }

    if (prop_data.invoice_data) {
      this.setState(
        {
          invoice_data: prop_data.invoice_data,
          rows: prop_data.rows,
          additionalCharges: prop_data.additionalCharges,
          ledgerId: prop_data.ledgerId,
          productId: prop_data.productId,
        },
        () => {
          this.setState(
            {
              ledgerId: prop_data.ledgerId,
              setLedgerId: true,
              productId: prop_data.productId,
              setProductId: true,
              setProductRowIndex: prop_data.rowIndex,
            },
            () => {
              // setTimeout(() => {
              //   this.inputLedgerNameRef.current.focus();
              // }, 1500);
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                if (prop_data.isProduct == "productMdl") {
                  document
                    .getElementById(
                      "TPOTIProductId-particularsname-" +
                      this.props.block.prop_data.rowIndex
                    )
                    .focus();
                } else {
                  this.inputLedgerNameRef.current.focus();
                }
              }, 1200);
            }
          );
          console.log(
            ":prop_data.invoice_data.purchaseId ",
            prop_data.invoice_data.purchaseId
          );
          // if (this.myRef.current != null)
          //   this.myRef.current.values.purchaseId =
          //     prop_data.invoice_data.purchaseId;
        }
      );
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
  getProductFlavorpackageUnitbyids = (invoice_id) => {
    const { purchaseEditData } = this.state;

    let reqData = new FormData();
    console.log("purchaseEditData=-> ", purchaseEditData);
    let purchase_order_id = purchaseEditData.selectedPCBills.map((v) => {
      return { id: v };
    });
    console.log("po_challan_ids", purchase_order_id);

    reqData.append("po_challan_ids", JSON.stringify(purchase_order_id));
    getPurChallanProductFpuByIds(reqData)
      .then((res) => res.data)
      .then((response) => {
        if (response.responseStatus == 200) {
          console.log("res---", response);
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
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => { });
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      // this.lstSundryCreditors();
      // this.transaction_product_listFun();
      // this.transaction_ledger_listFun();
      this.transaction_ledger_listFun();
      this.setLastPurchaseSerialNo();
      // this.get_transaction_ledger_listFun();
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
      this.setState({ source: prop_data, purchaseEditData: prop_data }, () => {
        console.log("source", this.state.source);
        if (prop_data.selectedPCBills) {
          this.getProductFlavorpackageUnitbyids(prop_data);
        }

        this.handlePropsData(prop_data);
      });

      eventBus.on(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.componentDidlstProduct
      );
      this.getUserControlLevelFromRedux();
    }
  }
  //@neha @On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
    }
  };
  ledgerModalStateChange = (ele, val) => {
    if (ele === "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputLedgerNameRef.current.focus();
        if (this.state.ledgerNameFlag)
          if (this.state.lstGst.length > 1) {
            this.SelecteRefGSTIN.current.focus();
          } else {
            this.pi_noRef.current.focus();
            // document.getElementById("pi_no").focus();
          }
        else document.getElementById("pi_transaction_dt").focus();
      });
    } else {
      this.setState({ [ele]: val });
    }
  };

  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });

    if (obj.isProduct == "productMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TPCTIProductId-particularsname-" + obj.rowIndex)
        //   .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TPCTIAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TPCTIAddBtn-" + id).focus();
        }, 250);
      }
    }
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

  setPurchaseInvoiceEditData = () => {
    const { purchaseEditData } = this.state;

    console.log("purchaseEditData=-> ", purchaseEditData);
    if (purchaseEditData.selectedPCBills) {
      var purchase_order_id = purchaseEditData.selectedPCBills.map((v) => {
        return { id: v };
      });
    }

    console.log("po_challan_ids", purchase_order_id);
    let reqData = new FormData();
    reqData.append("po_challan_ids", JSON.stringify(purchase_order_id));
    getPOChallanInvoiceWithIds(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, additional_charges, narration } = res;
          // console.log("invoice_data--->", invoice_data);
          console.log("row--->", row, invoice_data);
          // console.log("additional_charges--->", additional_charges);

          let {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstAdditionalLedger,
            lstBrand,
          } = this.state;

          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;
          let reference_type = res.reference_type;

          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();
          let opt = [];
          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1
              ? getSelectValue(lstAdditionalLedger, res.additionLedger1)
              : "";
            additionLedgerAmt1 = res.additionLedgerAmt1;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt1);
          }
          if (res.additionLedger2 > 0) {
            additionLedger2 = res.additionLedger2
              ? getSelectValue(lstAdditionalLedger, res.additionLedger2)
              : "";
            additionLedgerAmt2 = res.additionLedgerAmt2;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt2);
          }
          if (res.additionLedger3 > 0) {
            additionLedger3 = res.additionLedger3
              ? getSelectValue(lstAdditionalLedger, res.additionLedger3)
              : "";
            additionLedgerAmt3 = res.additionLedgerAmt3;
          }

          let initInvoiceData = {
            id: this.state.invoice_data.id,
            pi_sr_no: this.state.invoice_data.pi_sr_no,
            pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
            // gstId: invoice_data.gstId,
            // pi_transaction_dt:
            //   invoice_data.transaction_dt != ""
            //     ? moment(new Date(d)).format("DD/MM/YYYY")
            //     : "",
            gstNo: invoice_data.gstNo,
            purchaseId: getSelectValue(
              purchaseAccLst,
              invoice_data.purchase_id
            ),
            pi_no: this.state.invoice_data.pi_no,
            pi_invoice_dt:
              invoice_data.invoice_dt != ""
                ? moment(
                  new Date(
                    moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
                  )
                ).format("DD/MM/YYYY")
                : "",
            // supplierCodeId: invoice_data.supplier_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.supplier_id)
            //   : "",
            // supplierNameId: invoice_data.supplier_id
            //   ? getSelectValue(supplierNameLst, invoice_data.supplier_id)[
            //       "label"
            //     ]
            //   : "",

            EditsupplierId: invoice_data.supplier_id,
            supplierCodeId: "",
            supplierNameId: "",

            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",
            purchase_discount: discountInPer,
            purchase_discount_amt: discountInAmt,
            additionalChgLedger1: additionLedger1,
            additionalChgLedger2: additionLedger2,
            additionalChgLedger3: additionLedger3,
            additionalChgLedgerAmt1: additionLedgerAmt1,
            additionalChgLedgerAmt2: additionLedgerAmt2,
            additionalChgLedgerAmt3: additionLedgerAmt3,
            reference_type: reference_type,
          };
          console.log("initInvoiceData >>>>>>>>><<<<", initInvoiceData);

          if (
            initInvoiceData.supplierCodeId &&
            initInvoiceData.supplierCodeId != ""
          ) {
            this.myRef.current.setFieldValue(
              "supplierCodeId",
              initInvoiceData.supplierCodeId
            );
            this.myRef.current.setFieldValue(
              "supplierNameId",
              initInvoiceData.supplierNameId
            );

            console.warn("initInvoiceData.supplierNameId", initInvoiceData);
            opt = initInvoiceData.supplierCodeId.gstDetails.map((v, i) => {
              return {
                label: v.gstNo,
                value: v.id,
              };
            });

            if (initInvoiceData.hasOwnProperty("gstNo")) {
              initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
            } else {
              initInvoiceData["gstId"] = opt[0];
            }

            this.myRef.current.setFieldValue("gstId", opt[0]);

            // if (initInvoiceData.gstNo != "" || initInvoiceData.gstNo != undefined)
            // initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
            // else initInvoiceData["gstId"] = opt[0];
          }
          this.myRef.current.setFieldValue("narration", narration);

          console.log("Rowsssss------->", row, "lstBrand", lstBrand);
          let initRowData = [];
          if (row.length > 0) {
            initRowData = row.map((v, i) => {
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              console.log("productOpt ", productOpt);
              let unit_id = {
                gst: v.gst != "" ? v.gst : 0,
                igst: v.igst != "" ? v.igst : 0,
                cgst: v.cgst != "" ? v.cgst : 0,
                sgst: v.sgst != "" ? v.sgst : 0,
              };

              // v["levelAOpt"] = v.levelAOpt.map(function (values) {
              //   return { value: values.levela_id, label: values.levela_name };
              // });

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
              console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
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
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : 0;
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";
              v["reference_id"] = v.reference_id != "" ? v.reference_id : "";
              v["reference_type"] =
                v.reference_type != "" ? v.reference_type : "";

              return v;
            });
          }
          console.warn("rahul::opt ", opt);

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = invoice_data.narration;

          console.log("initRowData", initRowData, initInvoiceData, opt);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              reference_type: res.reference_type,
              isLedgerSelectSet: true,
            },
            () => {
              setTimeout(() => {
                this.setState({ isRowProductSet: true });
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error _______________________ ", error);
      });
  };

  componentDidUpdate() {
    let {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      purchaseEditData,
      lstDisLedger,
    } = this.state;
    // console.warn("rahul::componentDidUpdate", {
    //   purchaseAccLst,
    //   supplierNameLst,
    //   supplierCodeLst,
    //   productLst,
    //   lstAdditionalLedger,
    //   isEditDataSet,
    //   purchaseEditData,
    // });
    if (
      purchaseAccLst.length > 0 &&
      // supplierNameLst.length > 0 &&
      // supplierCodeLst.length > 0 &&
      // productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseEditData != ""
    ) {
      console.warn("setPurchaseInvoiceEditData");
      this.setPurchaseInvoiceEditData();
    }
    // this.setPurchaseInvoiceEditData();
  }

  componentWillUnmount() {
    if (AuthenticationCheck()) {
      eventBus.remove("scroll", this.handleScroll);
      mousetrap.unbind("alt+p", this.productCreate);
      mousetrap.unbindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.unbindGlobal("ctrl+c", this.ledgerCreate);
      document.removeEventListener("keydown", this.handleEscapeKey);
      document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

      eventBus.remove(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.lstProduct
      );
    }
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };
  /***** Validations of Purchase Invoice for Duplicate Invoice Numbers */
  validatePurchaseInvoice = (invoice_no, supplier_id) => {
    //console.log("Invoice Input", invoice_no, supplier_id);
    let reqData = new FormData();
    reqData.append("supplier_id", supplier_id);
    reqData.append("bill_no", invoice_no);
    getValidatePurchaseInvoice(reqData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            is_timeout: true,
            delay: 1000,
          });
          //this.reloadPage();
          setTimeout(() => {
            document.getElementById("pi_no")?.focus();
          }, 1500);

        }
        else {
          this.invoiceDateRef.current.focus();
          // document.getElementById("pi_invoice_dt").focus();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
  // checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
  //   let requestData = new FormData();
  //   requestData.append(
  //     "invoiceDate",
  //     moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  //   );
  //   checkInvoiceDateIsBetweenFY(requestData)
  //     .then((response) => {
  //       console.log("res", response);
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
  //             handleSuccessFn: () => {},
  //             handleFailFn: () => {
  //               setFieldValue("pi_invoice_dt", "");
  //               eventBus.dispatch(
  //                 "page_change",
  //                 "tranx_purchase_invoice_create"
  //               );
  //               // this.reloadPage();
  //             },
  //           },
  //           () => {}
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
              // msg: "Do you want continue with invoice date",
              msg: "Invoice date not valid as per Fiscal year",
              is_button_show: false,
              is_timeout: true,
              delay: 1500,
            },
            () => { }
          );
          setTimeout(() => {
            // document.getElementById("pi_invoice_dt").focus();
            this.invoiceDateRef.current.focus();
          }, 2000);
        } else {
          let d = new Date();
          d.setMilliseconds(0);
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          const enteredDate = moment(invoiceDate, "DD-MM-YYYY");
          const currentDate = moment(d);
          if (enteredDate.isAfter(currentDate)) {
            MyNotifications.fire({
              show: true,
              icon: "confirm",
              title: "confirm",
              msg: "Entered date is greater than current date",
              // is_button_show: true,
              handleSuccessFn: () => {
                if (enteredDate != "") {
                  setTimeout(() => {
                    this.inputRef1.current.focus();
                  }, 500);
                }
              },
              handleFailFn: () => {
                setTimeout(() => {
                  // document.getElementById("pi_invoice_dt").focus();
                  this.invoiceDateRef.current.focus();
                }, 500);
                // this.reloadPage();
              },
            });
          } else if (enteredDate.isBefore(currentDate)) {
            MyNotifications.fire({
              show: true,
              icon: "confirm",
              title: "confirm",
              msg: "Entered date is smaller than current date",
              // is_button_show: true,
              handleSuccessFn: () => {
                if (enteredDate != "") {
                  setTimeout(() => {
                    this.inputRef1.current.focus();
                  }, 500);
                }
              },
              handleFailFn: () => {
                setTimeout(() => {
                  // document.getElementById("pi_invoice_dt").focus();
                  this.invoiceDateRef.current.focus();
                }, 500);
                // this.reloadPage();
              },
            });
          }
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
  // NewBatchModalFun = (status) => {
  //   this.setState({ newBatchModal: status });
  // };
  NewBatchSelectModalFun = (status) => {
    this.setState({ newBatchSelectModal: status });
  };
  NewSerialModalFun = (status) => {
    this.setState({ newSerialModal: status });
  };
  // SelectProductModalFun = (status, row_index = -1) => {
  //   this.setState({ selectProductModal: status, rowIndex: row_index });
  // };

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
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
                  rows[rowIndex]["unitId"] =
                    findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                    "levelCOpt"
                    ][0]["unitOpt"][0];
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
  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    // console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_supplierlist_by_productid(requestData)
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

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ purchaseAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("PUAC")
            );
            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
            } else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            ) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
              console.log("invoice_data", init_d);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // ! function set border to required fields
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

  getLedgerByCode(code) {
    let { ledgerList } = this.state;
    // console.warn("ledgerList->>>>>>>>>>", ledgerList);

    let ledgerData = ledgerList.filter(
      (v) => v.code.toLowerCase() == code.toLowerCase()
    );
    // console.warn(code);
    // console.warn("ledgerData->>>", ledgerData);
    if (ledgerData.length > 0) {
      if (this.myRef.current) {
        this.myRef.current.setFieldValue(
          "supplierNameId",
          ledgerData[0].ledger_name
        );
        let opt =
          ledgerData && ledgerData[0].gstDetails
            ? ledgerData[0].gstDetails.map((vi) => {
              return { label: vi.gstNo, value: vi.id, ...vi };
            })
            : "";
        this.setState({ lstGst: opt }, () => {
          this.myRef.current.setFieldValue(
            "gstId",
            getSelectValue(opt, ledgerData[0].gstDetails[0].id)
          );
        });
      }
    } else {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Warning",
          msg: "invalid ledger code",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            this.ledgerModalStateChange("ledgerModal", true);
            document.getElementById("supplierNameId").focus();
          },
          handleFailFn: () => { },
        },
        () => {
          console.warn("return_data");
        }
      );
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("supplierNameId", "");
      }
      // this.ledgerModalStateChange("ledgerModal", true);
      // alert("invalid ledger code");
    }
  }
  setledgerInputData(propValue, flag) {
    this.setState({ ledgerInputData: propValue, isTextBox: flag, ledgerModal: true }, () => {
      this.myRef.current.setFieldValue("supplierNameId", propValue);
    });
  }

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
          console.warn("selectedLEdger index " + index);
          document.getElementById("LedgerMdlTr_" + index).focus();
        }, 200);
      }
    }
  };

  handleOptionClick = (option) => {
    this.setState(
      (prevState) => ({
        tcs_mode: prevState.tcs_mode === option ? null : option,
      }),
      () => { }
    );
  };

  handleKeyPress = (event, option) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault(); // Prevent the default space bar scrolling behavior
      this.handleOptionClick(option);
    }
  };

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

  render() {
    const {
      currentTab,
      currentLedgerData,
      updatedLedgerType,
      ledgerType,
      gstId,
      costingInitVal,
      costingMdl,
      batch_data_selected,
      serialNoLst,
      selectSerialModal,
      isLedgerSelectSet,
      add_button_flag,
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
      newBatchSelectModal,
      newSerialModal,
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
      selectedLedgerNo,
      orglstAdditionalLedger,
      product_hover_details,
      product_supplier_lst,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      transactionType,
      isRowProductSet,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      setProductRowIndex,
      batchHideShow,
      from_source,
      productId,
      setProductId,
      opType,
      ledgerId,
      setLedgerId,
      ledgerInputData,
      isTextBox,
      sourceUnder,
    } = this.state;
    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active

    return (
      <div>
        <div className="purchaseinvoice" style={{ overflow: "hidden" }}>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            // validationSchema={Yup.object().shape({
            //   // gstId: Yup.object().nullable().required("GST No is required"),
            //   pi_invoice_dt: Yup.string().required("Invoice Date is Required"),
            //   // supplierCodeId: Yup.object()
            //   //   .nullable()
            //   //   .required("Supplier Code is Required"),
            //   purchaseId: Yup.object()
            //     .nullable()
            //     .required("Purchase Account is Required"),
            //   pi_no: Yup.string().required("Invoice No is Required"),
            //   supplierNameId: Yup.string()
            //     .trim()
            //     .required("Supplier Name is Required"),
            // })}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start
              let errorArray = [];
              // if (values.supplierCodeId == "") {
              //   errorArray.push("Y");
              // } else {
              errorArray.push("");
              // }
              if (values.supplierNameId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.pi_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.pi_invoice_dt == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

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
                                this.handleFetchData(selectedSupplier.id);
                              }
                            },
                            handleFailFn: () => { },
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );

                        this.setState({
                          invoice_data: values,
                        });
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
                // style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  <div className="div-style">
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
                                    autoComplete="true"
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
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Label>Tranx Date</Form.Label>
                              </Col>

                              <Col lg={7} md={7} sm={7} xs={7}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  autoFocus="true"
                                  className="tnx-pur-inv-date-style "
                                  name="pi_transaction_dt"
                                  id="pi_transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.pi_transaction_dt}
                                  onChange={handleChange}
                                  readOnly={true}
                                  autoComplete="true"
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
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13 || e.keyCode == 9) {
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
                                          setFieldValue(
                                            "pi_transaction_dt",
                                            ""
                                          );
                                        }
                                      } else {
                                        setFieldValue("pi_transaction_dt", "");
                                      }
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          {/* <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Code</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  // type="text"
                                  // className="tnx-pur-inv-text-box text-start"
                                  placeholder="Ledger Code"
                                  name="supplierCodeId"
                                  id="supplierCodeId"
                                  autoComplete="true"
                                  // disabled={
                                  //   values.pi_transaction_dt !== ""
                                  //     ? false
                                  //     : true
                                  // }
                                  onChange={handleChange}
                                  // className={`${values.supplierCodeId == "" &&
                                  //     errorArrayBorder[0] == "Y"
                                  //     ? "border border-danger tnx-pur-inv-text-box text-start"
                                  //     : "tnx-pur-inv-text-box text-start"
                                  //   }`}
                                  className="tnx-pur-inv-text-box"
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (e.target.value) {
                                  //     this.setErrorBorder(0, "");
                                  //   } else {
                                  //     this.setErrorBorder(0, "Y");
                                  //     // document
                                  //     //   .getElementById("supplierCodeId")
                                  //     //   .focus();
                                  //   }
                                  // }}
                                  // onFocus={(e) => {
                                  //   e.preventDefault();
                                  //   if (values.supplierCodeId == "") {
                                  //     this.ledgerModalStateChange(
                                  //       "ledgerModal",
                                  //       true
                                  //     );
                                  //   }
                                  // }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   if (values.supplierCodeId != "") {
                                  //     this.ledgerModalStateChange(
                                  //       "selectedLedger",
                                  //       values.selectedSupplier
                                  //     );
                                  //     this.ledgerModalStateChange(
                                  //       "ledgerModal",
                                  //       true
                                  //     );
                                  //   } else {
                                  //     this.ledgerModalStateChange(
                                  //       "ledgerModal",
                                  //       true
                                  //     );
                                  //   }
                                  // }}
                                  // value={
                                  //   values.supplierCodeId != ""
                                  //     ? values.supplierCodeId
                                  //     : "Code"
                                  // }
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     !e.target.value
                                  //   )
                                  //     e.preventDefault();
                                  // }}
                                  value={values.supplierCodeId}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (e.key === "Tab") {
                                      // e.preventDefault();

                                      if (e.target.value.trim() != "") {
                                        this.getLedgerByCode(
                                          values.supplierCodeId
                                        );
                                      } else if (
                                        e.target.value.trim() == "" &&
                                        values.supplierNameId == ""
                                      ) {
                                        this.ledgerModalStateChange(
                                          "ledgerModal",
                                          true
                                        );
                                      }
                                    }
                                  }}
                                />

                               
                              </Col>
                            </Row>
                          </Col> */}
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>
                                  Ledger Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <Form.Control
                                  type="text"
                                  ref={this.inputLedgerNameRef}
                                  // className="tnx-pur-inv-text-box text-start"
                                  placeholder="Ledger Name"
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  autoComplete="true"
                                  disabled={
                                    values.pi_transaction_dt !== ""
                                      ? false
                                      : true
                                  }
                                  className={`${values.supplierNameId == "" &&
                                    errorArrayBorder[1] == "Y"
                                    ? "border border-danger tnx-pur-inv-text-box text-start"
                                    : "tnx-pur-inv-text-box text-start"
                                    }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(1, "");
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
                                      this.setErrorBorder(1, "Y");
                                    }
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    this.setState({ ledgerNameFlag: true });
                                    if (values.supplierCodeId != "") {
                                      this.setState(
                                        {
                                          currentLedgerData:
                                            values.selectedSupplier,
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
                                      });
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.supplierNameId}
                                  onChange={(e) => {
                                    e.preventDefault();

                                    this.setledgerInputData(
                                      e.target.value,
                                      true,
                                      setFieldValue
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    this.setState({ ledgerNameFlag: true });
                                    if (e.keyCode == 13) {
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                      this.setState(
                                        {
                                          currentLedgerData:
                                            values.selectedSupplier,
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
                                      e.preventDefault();
                                    } else if (e.key === "Alt") {
                                      e.preventDefault();
                                    } else if (e.keyCode == 40) {
                                      //! this condition for down button press 1409
                                      if (ledgerModal == true)
                                        document
                                          .getElementById("LedgerMdlTr_0")
                                          .focus();
                                    }
                                  }}
                                  readOnly
                                />
                                <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Supplier GSTIN</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Select
                                    ref={this.SelecteRefGSTIN}
                                    className="selectTo"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    options={lstGst}
                                    name="gstId"
                                    id="gstId"
                                    onChange={(v) => {
                                      setFieldValue("gstId", v);
                                    }}
                                    autoComplete="true"
                                    value={values.gstId}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.gstId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={5} md={5} sm={5} xs={5} className="p-0">
                                <Form.Label>Purchase Serial</Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Invoice sr No. "
                                  name="pi_sr_no"
                                  id="pi_sr_no"
                                  onChange={handleChange}
                                  autoComplete="true"
                                  value={values.pi_sr_no}
                                  isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  isInvalid={!!errors.pi_sr_no}
                                  disabled
                                  readOnly
                                  isClearable={false}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_sr_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Label>
                                  Invoice No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  placeholder="Invoice No."
                                  name="pi_no"
                                  id="pi_no"
                                  ref={this.pi_noRef}
                                  // className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  autoComplete="true"
                                  value={values.pi_no}
                                  isValid={touched.pi_no && !errors.pi_no}
                                  isInvalid={!!errors.pi_no}
                                  className={`${values.pi_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                    ? "border border-danger tnx-pur-inv-text-box"
                                    : "tnx-pur-inv-text-box"
                                    }`}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (e.target.value) {
                                  //     this.setErrorBorder(2, "");
                                  //   } else {
                                  //     this.setErrorBorder(2, "Y");
                                  //     // document.getElementById('pi_no').focus();
                                  //   }
                                  // }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value) {
                                      // this.setErrorBorder(2, "");

                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      document.getElementById('pi_no').focus();
                                    }

                                    // alert("On Blur Call");
                                  }}

                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    }
                                    else if (
                                      e.key === "Tab") {
                                      this.validatePurchaseInvoice(
                                        e.target.value,
                                        values.selectedSupplier.id
                                        // values.supplierNameId
                                        // values.supplierCodeId
                                      );
                                      e.preventDefault();
                                      setFieldValue(
                                        "pi_no",
                                        values.pi_no
                                      );
                                    }
                                    else if (
                                      e.keyCode == 13
                                    ) {
                                      if (e.target.value.trim() != "") {
                                        e.preventDefault()
                                        this.validatePurchaseInvoice(
                                          e.target.value,
                                          values.selectedSupplier.id
                                          // values.supplierNameId
                                          // values.supplierCodeId
                                        );
                                        setFieldValue(
                                          "pi_no",
                                          values.pi_no
                                        );
                                      } else {
                                        e.preventDefault();
                                      }
                                    }

                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>
                                  Invoice Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      values.pi_invoice_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    // className="tnx-pur-inv-date-style"
                                    name="pi_invoice_dt"
                                    id="pi_invoice_dt"
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    value={values.pi_invoice_dt}
                                    onChange={handleChange}
                                    autoComplete="true"
                                    className={`${errorArrayBorder[3] == "Y"
                                      ? "border border-danger tnx-pur-inv-date-style"
                                      : "tnx-pur-inv-date-style"
                                      }`}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();
                                    //   console.log("e ", e);
                                    //   console.log(
                                    //     "e.target.value ",
                                    //     e.target.value
                                    //   );
                                    //   if (
                                    //     e.target.value != null &&
                                    //     e.target.value !== ""
                                    //   ) {
                                    //     this.setErrorBorder(3, "");
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
                                    //         msg: "Entered date is greater than current date",
                                    //         // is_button_show: true,
                                    //         handleSuccessFn: () => {},
                                    //         handleFailFn: () => {
                                    //           setFieldValue(
                                    //             "pi_invoice_dt",
                                    //             ""
                                    //           );
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_challan_to_invoice"
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
                                    //         msg: "Entered date is smaller than current date",
                                    //         // is_button_show: true,
                                    //         handleSuccessFn: () => {},
                                    //         handleFailFn: () => {
                                    //           setFieldValue(
                                    //             "pi_invoice_dt",
                                    //             ""
                                    //           );
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_challan_to_invoice"
                                    //           );
                                    //           // this.reloadPage();
                                    //         },
                                    //       });
                                    //     } else {
                                    //       setFieldValue(
                                    //         "pi_invoice_dt",
                                    //         e.target.value
                                    //       );
                                    //       this.checkInvoiceDateIsBetweenFYFun(
                                    //         e.target.value,
                                    //         setFieldValue
                                    //       );
                                    //     }
                                    //   } else {
                                    //     setFieldValue("pi_invoice_dt", "");
                                    //     this.setErrorBorder(3, "Y");
                                    //   }
                                    // }}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.shiftKey == true &&
                                          e.keyCode == 9) ||
                                        e.keyCode == 9
                                      ) {
                                        if (e.target.value) {
                                          // @prathmesh @DD/MM type then current year auto show start
                                          let datchco = e.target.value.trim();
                                          let repl = datchco.replace(/_/g, "");

                                          if (repl.length === 6) {
                                            const currentYear =
                                              new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue(
                                              "pi_invoice_dt",
                                              finle
                                            );
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
                                            const currentYear =
                                              new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue(
                                              "pi_invoice_dt",
                                              finle
                                            );
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
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.pi_invoice_dt}
                                </span>
                              </Col>
                              {/* </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row> */}
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>Purchase A/C</Form.Label>
                              </Col>
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Select
                                    ref={this.inputRef1}
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
                                    autoComplete="true"
                                    value={values.purchaseId}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.purchaseId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Upload Image</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group controlId="formGridEmail">
                                  <Form.Control
                                    type="file"
                                    placeholder=""
                                    className="tnx-pur-inv-text-box"
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13)
                                        this.focusNextElement(e);
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>

                  <CmpTRow
                    isRowProductSet={isRowProductSet}
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
                    batchHideShow={batchHideShow}
                    productLst={productLst}
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    getProductPackageLst={this.getProductPackageLst.bind(this)}
                    selectProductModal={selectProductModal}
                    selectedProduct={selectedProduct}
                    userControl={this.props.userControl}
                    from_source={from_source}
                    invoice_data={
                      this.myRef.current ? this.myRef.current.values : ""
                    }
                    productIdRow={productId}
                    setProductId={setProductId}
                    setProductRowIndex={setProductRowIndex}
                    rowIndex={rowIndex}
                    // productId="TPIEProductId-"
                    productId="TPOTIProductId-"
                    addBtnId="TPICAddBtn-"
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
                    opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
                    isConversion={true}
                  />

                  <Row className="mx-0 btm-data">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="row-top-padding">
                        <Tab.Container
                          id="left-tabs-example"
                          // @prathmesh @batch info & product info tab active start

                          activeKey={
                            ledgerModal === true || isFocused === true
                              ? "first"
                              : productData !== ""
                                ? "second"
                                : "second"
                          }
                          // @prathmesh @batch info & product info tab active end
                          defaultActiveKey="first"
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
                                  id="TPCTI_Ledger_Tab"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      currentTab: "first",
                                    });
                                  }}
                                  className={`${currentTab == "first"
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
                                  id="TPCTI_Product_Tab"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      currentTab: "second",
                                    });
                                  }}
                                  className={`${currentTab == "second"
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
                                        .getElementById("TPCTI_Ledger_Tab")
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

                          <Tab.Content style={{ paddingTop: "5px" }}>
                            <Tab.Pane eventKey="first">
                              <Row className="mt-2">
                                <Col lg={12}>
                                  <Row className="tnx-pur-inv-description-style ">
                                    <Col
                                      lg={3}
                                      style={{
                                        borderRight: "1px solid #EAD8B1",
                                      }}
                                    >
                                      <h6 className="title-style">
                                        Ledger Info:
                                      </h6>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          GST No:
                                        </span>
                                        <span className="span-value">
                                          {ledgerData.gst_number}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Area:
                                        </span>
                                        <span className="span-value">
                                          {ledgerData.area}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Bank:
                                        </span>
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
                                        <span className="span-lable">
                                          Transport:
                                        </span>
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
                                        <span className="span-lable">
                                          FSSAI:
                                        </span>
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
                                        <span className="span-lable">
                                          Route:
                                        </span>
                                        <span className="span-value">
                                          {/* {product_hover_details.tax_type} */}
                                          {ledgerData.route}
                                        </span>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <Row className="mt-2">
                                <Col lg={8} className="pe-0">
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
                                        <span className="span-lable">
                                          Brand:
                                        </span>
                                        <span className="span-value">
                                          {productData.brand}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Group:
                                        </span>
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
                                        <span className="span-lable">
                                          Tax%:
                                        </span>
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
                                        <span className="span-lable">
                                          Cost:
                                        </span>
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
                                      <h6 className="title-style">
                                        Batch Info:
                                      </h6>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Name:
                                        </span>
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
                      </Row>
                      <Row className="mt-2" style={{ paddingBottom: "15px" }}>
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) this.focusNextElement(e);
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
                                      {v.rate}
                                      {INRformat.format(v.rate)}
                                    </td>
                                    <td>
                                      {v.cost}
                                      {INRformat.format(v.cost)}
                                    </td>
                                    <td>{v.dis_per}</td>
                                    <td>
                                      {/* {v.dis_amt} */}
                                      {INRformat.format(v.dis_amt)}
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
                          className="my-auto pe-0"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="0"
                            className="tnx-pur-inv-text-box px-1 text-end"
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) this.focusNextElement(e);
                            }}
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
                            className="tnx-pur-inv-text-box text-end"
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) this.focusNextElement(e);
                            }}
                          />
                        </Col>
                      </Row>
                      {/* <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                      /> */}
                      <CmpTGSTFooter
                        values={values}
                        taxcal={taxcal}
                        gstId={gstId}
                        handleCGSTChange={this.handleCGSTChange.bind(this)}
                        handleSGSTChange={this.handleSGSTChange.bind(this)}
                      />
                      <Row className="">
                        <Row>
                          <Col lg={12}>
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {/* {values.total_qty} */}
                              {INRformat.format(values.total_qty)}
                            </span>
                          </Col>
                        </Row>
                        {/* <Col lg={1}>
                          <p style={{ color: "#B6762B" }}>|</p>
                        </Col> */}

                        <Row className="mt-2">
                          <Col lg={12}>
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
                        <Row className="mt-2">
                          <Col lg={12}>
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {/* {parseFloat(values.roundoff).toFixed(2)} */}
                              {INRformat.format(values.roundoff)}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      className="for_padding p-0"
                    >
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
                              <div className="d-flex mt-2">
                                {/* <Form.Control
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
                                /> */}
                                <Form.Label className="my-auto lebleclass me-1">
                                  Add Charges{" "}
                                </Form.Label>
                                <Button className="btn_img_style">
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="ledger-btn "
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13)
                                        this.focusNextElement(e);
                                    }}
                                  />
                                </Button>
                              </div>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-2 text-end"
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) this.focusNextElement(e);
                                }}
                              />
                            </td>
                          </tr>
                          {/* <tr>
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
                            </td>
                          </tr> */}
                          <tr>
                            <td className="py-0">
                              {/* <Form.Group className="d-flex tdsTCS">
                                <Form.Check
                                  type="radio"
                                  label="TDS"
                                  onChange={handleChange}
                                />
                                <Form.Check
                                  type="radio"
                                  label="TCS"
                                  onChange={handleChange}
                                />
                              </Form.Group> */}
                              {/* @neha @Tcs Tds Radio button true false  */}
                              <Row>
                                <Col lg="12">
                                  <Form.Group
                                    style={{ width: "fit-content" }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13)
                                        this.focusNextElement(e);
                                    }}
                                  >
                                    <Row>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          id="mode1"
                                          name="tcs_mode"
                                          label="TDS"
                                          value="tds"
                                          autoComplete="off"
                                          checked={
                                            this.state.tcs_mode === "tds"
                                          }
                                          onClick={() =>
                                            this.handleOptionClick("tds")
                                          }
                                          onKeyDown={(e) =>
                                            this.handleKeyPress(e, "tds")
                                          }
                                          tabIndex="0"
                                        />
                                      </Col>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          name="tcs_mode"
                                          id="mode2"
                                          label="TCS"
                                          value="tcs"
                                          autoComplete="off"
                                          checked={
                                            this.state.tcs_mode === "tcs"
                                          }
                                          onClick={() =>
                                            this.handleOptionClick("tcs")
                                          }
                                          onKeyDown={(e) =>
                                            this.handleKeyPress(e, "tcs")
                                          }
                                          tabIndex="0"
                                        />
                                      </Col>
                                    </Row>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </td>
                            <td className="p-0 text-end">
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) this.focusNextElement(e);
                                }}
                              />
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
                            <td className="p-0 text-end"></td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                placeholder="Ledger 1"
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 9) {
                                    setTimeout(() => {
                                      this.addLedgerModalFun();
                                    }, 100);
                                  } else if (e.keyCode == 13)
                                    this.focusNextElement(e);
                                }}
                                disabled
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box my-1 text-end"
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) this.focusNextElement(e);
                                }}
                                disabled
                              />
                            </td>
                          </tr>

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {INRformat.format(values.bill_amount)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          id="TPCTI_submit_btn"
                          className="successbtn-style"
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
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
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_challan_to_invoice",
                                    to: "tranx_purchase_challan_list",
                                    isNewTab: false,
                                    isCancel: true,
                                  });
                                },
                                handleFailFn: () => { },
                              },
                              () => {
                                console.warn("return_data");
                              }
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
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
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_challan_to_invoice",
                                      to: "tranx_purchase_challan_list",
                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                  },
                                  handleFailFn: () => { },
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
                    // <Col md="8"></Col>
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
                    </Col> */}
                    <Col md="12" className="my-auto">
                      <Row>
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
                      </Row>
                    </Col>
                  </Row>
                </>
              </Form>
            )}
          </Formik>

          {/* Ledger Modal Starts */}
          <MdlLedger
            ref={this.customModalRef} //@neha @on click outside modal will close
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            currentLedgerData={currentLedgerData}
            updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
            ledgerModal={ledgerModal}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            invoice_data={invoice_data}
            isLedgerSelectSet={isLedgerSelectSet}
            userControl={this.props.userControl}
            from_source={from_source}
            ledgerId={ledgerId}
            setLedgerId={setLedgerId}
            rows={rows}
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            ledgerInputData={ledgerInputData}
            isTextBox={isTextBox}
            searchInputId="supplierNameId"
            setledgerInputDataFun={this.setledgerInputData.bind(this)}
            sourceUnder={sourceUnder} //@Sneha @used for direct set sundry creditor slug in ledger create
            opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
          />
          {/* Ledger Modal Ends */}

          {/* Product Modal Starts */}
          {/* <MdlProduct
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
            isRowProductSet={isRowProductSet}
            userControl={this.props.userControl}
            transactionType={transactionType}
          /> */}
          {/* Product Modal Ends */}

          {/* Serial No Modal Starts */}
          <MdlSerialNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            selectSerialModal={selectSerialModal}
            rows={rows}
            rowIndex={rowIndex}
            serialNoLst={serialNoLst}
          />
          {/* Serial No Modal Ends */}

          {/* Batch No Modal Starts */}

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
          {/* Batch No Modal Ends */}

          {/* Costing  Modal Starts */}

          <MdlCosting
            productModalStateChange={this.productModalStateChange.bind(this)}
            costingMdl={costingMdl}
            costingInitVal={costingInitVal}
            rows={rows}
            rowIndex={rowIndex}
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
          />
          {/* Costing No Modal Ends */}

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
                  initialValues={invoice_data}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let invoiceValues = this.myRef.current.values;
                    // //console.log(
                    //   "Adjust invoiceValues--------->",
                    //   invoiceValues
                    // );
                    let requestData = new FormData();
                    requestData.append("debitNoteReference", values.newReference);
                    let row = billLst.filter((v) => v.Total_amt != "");
                    if (values.newReference == "true") {
                      let bills = [];
                      row.map((v) => {
                        bills.push({
                          debitNoteId: v.id,
                          debitNotePaidAmt: v.debit_paid_amt,
                          debitNoteRemaningAmt: v.debit_remaining_amt,
                          debitNoteTotalAmt: v.Total_amt,
                          source: v.source,
                        });
                      });
                      requestData.append("bills", JSON.stringify(bills));
                    }

                    requestData.append(
                      "invoice_date",
                      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      )
                    );
                    requestData.append("newReference", false);
                    requestData.append("invoice_no", invoice_data.pi_no);
                    requestData.append(
                      "purchase_id",
                      invoice_data.purchaseId.value
                    );
                    requestData.append("purchase_sr_no", invoiceValues.pi_sr_no);
                    requestData.append(
                      "transaction_date",
                      moment(invoice_data.pi_transaction_dt, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      )
                    );
                    requestData.append(
                      "supplier_code_id",
                      invoice_data.selectedSupplier.id
                    );
                    // !Invoice Data
                    requestData.append("roundoff", invoiceValues.roundoff);
                    if (
                      invoiceValues.narration &&
                      invoiceValues.narration != ""
                    ) {
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
                      invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
                    );
                    requestData.append("totalcgst", totalcgst);
                    requestData.append("totalsgst", totalsgst);
                    requestData.append("totaligst", totaligst);

                    requestData.append(
                      "tcs_per",
                      invoiceValues.tcs_per && invoiceValues.tcs_per != ""
                        ? invoiceValues.tcs_per
                        : 0
                    );
                    requestData.append(
                      "tcs_amt",
                      invoiceValues.tcs_amt && invoiceValues.tcs_amt != ""
                        ? invoiceValues.tcs_amt
                        : 0
                    );
                    requestData.append(
                      "tcs_mode",
                      invoiceValues.tcs_mode && invoiceValues.tcs_mode != ""
                        ? invoiceValues.tcs_mode
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

                    // //console.log("row in create", rows);

                    let frow = [];
                    rows.map((v, i) => {
                      if (v.productId != "") {
                        let newObj = {
                          productId: v.productId ? v.productId : "",
                          inventoryId: v.inventoryId ? v.inventoryId : 0,
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
                          invoice_dis_amt:
                            v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0,
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
                          b_purchase_rate:
                            v.b_purchase_rate != "" ? v.b_purchase_rate : 0,
                          b_expiry: v.b_expiry
                            ? moment(v.b_expiry).format("yyyy-MM-DD")
                            : "",
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

                          reference_type: v.reference_type,
                          reference_id: v.reference_id != "" ? v.reference_id : 0,
                        };
                        // //console.log("newObj >>>> ", newObj);
                        frow.push(newObj);
                        // //console.log("frow ----------- ", frow);
                      }
                    });
                    // //console.log("frow =->", frow);

                    var filtered = frow.filter(function (el) {
                      return el && el != null;
                    });
                    // //console.log("filtered", filtered);
                    requestData.append("row", JSON.stringify(filtered));
                    requestData.append(
                      "additionalChargesTotal",
                      this.state.additionalChargesTotal
                    );
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

                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
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
                          this.setState({ adjustbillshow: false });

                          eventBus.dispatch(
                            "page_change",
                            "tranx_purchase_invoice_list"
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
                      .catch((error) => { console.log("error", error); });
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
                                        isAllCheckeddebit === true ? true : false
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
                                        // disabled={
                                        //   this.state.billAmount ==
                                        //     this.handleBillselectionDebit() &&
                                        //     selectedBillsdebit.includes(
                                        //       v.debit_note_no
                                        //     ) != true
                                        //     ? true
                                        //     : false
                                        // }
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
                                      {parseFloat(v.debit_remaining_amt).toFixed(
                                        2
                                      )
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
                                  <b>Total </b>
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
)(TranxPurchaseChallanToInvoice);
