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
import delete_icon from "@/assets/images/delete_icon.svg";
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
  getSalesAccounts,
  getLastSalesOrder,
  createSalesOrder,
  getSalesOrderById,
  getSundryDebtors,
  getProductFlavorpackageUnitbyid,
  getSalesOrderProductFpuById,
  getSalesUpdateOrder,
  listTranxCreditNotes,
  get_sales_order_supplierlist_by_productid,
  get_supplierlist_by_productid,
  getOrderBillById,
  validate_sales_order_update,
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
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  flavourDD,
  allEqual,
  INRformat,
} from "@/helpers";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import { setUserControl } from "@/redux/userControl/Action";
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

class TranxSalesOrderEdit extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.clientGSTINRef = React.createRef();
    this.salesAccRef = React.createRef();

    this.state = {
      isTextBox: false,
      ledgerNameFlag: false, //!for focus
      currentTab: "second", //@prathmesh @batch info & product info tab active
      ledgerInputData: "",
      add_button_flag: true,
      product_supplier_lst: [],
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      productLst: [],
      productData: "",
      rows: [],
      isBranch: false,
      additionalCharges: [],
      additionalChargesTotal: 0,
      rowDelDetailsIds: [],
      lstDisLedger: [],
      lstAdditionalLedger: [],
      selectedBillsdebit: [],
      selectedPendingOrder: [],
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      outstanding_pur_return_amt: 0,
      saleEditData: "",
      isEditDataSet: false,
      batchHideShow: false,
      isLedgerSelectSet: false,
      isRowProductSet: false,
      ledgerType: "SD",
      updatedLedgerType: "SD",
      invoice_data: {
        selectedSupplier: "",
        bill_dt: "",
        so_bill_no: "",
        salesAccId: "",
        so_sr_no: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        bill_dt: "",
        salesAccId: "",
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

        total_qty: 0,
        total_free_qty: 0,
        bill_amount: 0,
        total_row_gross_amt1: 0,
      },
      ledgerId: "",
      setLedgerId: false,
      from_source: "tranx_sales_order_edit",

      productId: "",
      setProductId: false,
      setProductRowIndex: -1,

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
      currentLedgerData: "",
      batchData: [],
      batchDetails: "",
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      saleRateType: "sale",
      transactionType: "sales_order",
      transactionTableStyle: "salesOrder",
      errorArrayBorder: "",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      sourceUnder: "sale",
    };
    this.selectRef = React.createRef();
    this.radioRef = React.createRef();
  }

  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        let res = response.data;
        //console.log("Result:", res);
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ salesAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("SLAC")
            );
            //console.log("sid:: lstSalesAccounts", { v }, v[0]);

            const { prop_data } = this.props.block;
            //console.log("sid:: prop_data", prop_data);
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
              // takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
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

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res--", res);
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
          console.log("opt--", opt);
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
        if (res.responseStatus == 200) {
          this.setState({
            ledgerData: res.result,
          });
          let { ledgerModalStateChange } = this.props;
          ledgerModalStateChange("ledgerData", res.result);
        }
      })
      .catch((error) => {});
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
    requestData.append("batchNo", batchNo);
    requestData.append("id", batchNo.b_details_id);
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

  setLastSalesOrderSerialNo = () => {
    getLastSalesOrder()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ initVal: res });
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("so_sr_no", res.count);
            this.myRef.current.setFieldValue("so_bill_no", res.serialNo);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        inventoryId: 0,
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
        document.getElementById("TSOEProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
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
      .catch((error) => {});
  };
  lstAdditionalLedgers = () => {
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
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {});
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
        .catch((error) => {});
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
          this.getProdutBatchList();
        });
      }
      this.handleTranxCalculation();
    });
  };

  handlebatchModalShow = (status) => {
    if (status == false) {
      this.setState({ batchModalShow: status, tr_id: "", batch_error: false });
    } else {
      this.setState({ batchModalShow: status, tr_id: "" });
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

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
    });
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      inventoryId: "",
      selectedProduct: "",
      details_id: 0,
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

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
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
      //console.log("this.myRef.current.values ", this.myRef.current.values);
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

      addChgLedgerAmt1 = 0;
      addChgLedgerAmt2 = 0;
      addChgLedgerAmt3 = 0;

      takeDiscountAmountInLumpsum = 0;
      isFirstDiscountPerCalculate = 0;
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
    //console.log("resTranxFn", { resTranxFn });
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
      isNaN(parseFloat(Math.round(bill_amount)))
        ? 0
        : parseFloat(Math.round(bill_amount)).toFixed(2)
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
    }
    // else if (ele == "qty") {
    //   if (
    //     parseFloat(rows[rowIndex]["qty"]) == 0 &&
    //     !isFreeQtyExist("is_free_qty", this.props.userControl)
    //   ) {
    //     rows[rowIndex][ele] = "";
    //   } else if (
    //     parseFloat(rows[rowIndex]["is_negative"]) == false &&
    //     parseFloat(rows[rowIndex]["qty"]) >
    //     parseFloat(rows[rowIndex]["closing_stock"])
    //   ) {
    //     rows[rowIndex][ele] = "";
    //     MyNotifications.fire({
    //       show: true,
    //       icon: "warning",
    //       title: "Warning",
    //       msg: "Quantity is greater than current stock",
    //       is_button_show: true,
    //     });
    //   }
    // }

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

  getProdutBatchList = (rowIndex = -1) => {
    const { rows, invoice_data } = this.state;
    //console.log("rows", { rows, invoice_data });
    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let unit_id = rows[rowIndex]["unitId"]["value"];

    let invoice_value = this.myRef.current.values;
    let reqData = new FormData();
    reqData.append("product_id", product_id);
    reqData.append("level_a_id", level_a_id);
    if (rows[rowIndex]["levelbId"] != "")
      reqData.append("level_b_id", rows[rowIndex]["levelbId"]["value"]);
    if (rows[rowIndex]["levelcId"] != "")
      reqData.append("level_c_id", rows[rowIndex]["levelcId"]);
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
        //console.log("response ", response);
        if (response.responseStatus == 200) {
          res = response.data;
          //console.log("res ", res);

          invoice_data["costing"] = response.costing;
          invoice_data["costingWithTax"] = response.costingWithTax;
          this.setState(
            {
              invoice_data: invoice_data,
              batchData: res,
            },
            () => {
              if (res.length > 0) {
                this.getInitBatchValue(rowIndex);
              } else {
                this.getInitBatchValue(rowIndex);
              }
            }
          );
        }
      })
      .catch((error) => {});
  };

  getInitBatchValue = (rowIndex = -1) => {
    let { rows } = this.state;
    let initVal = "";
    //console.log("b_no: ", rowIndex, rows);
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
    //console.log("initVal ", initVal);
    let IsBatch = rows[rowIndex]["is_batch"];
    //console.log(" IsBatch ", IsBatch);
    //console.log("initVal", initVal);
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

  handleFetchData = (sundry_debtors_id) => {
    // debugger;
    const { billLst } = this.state;
    let reqData = new FormData();

    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;
        let data = res.list;
        if (data.length == 0) {
          this.callUpdatesaleOrder();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjustbillshow: true });
            }
          });
        }
      })
      .catch((error) => {});
  };
  /*Update Purchase Order */
  setSaleOrderEditData = () => {
    const { id } = this.state.saleEditData;
    let formData = new FormData();
    formData.append("id", id);
    getSalesOrderById(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, additional_charges, narration } = res;
          //console.log("invoice_data--->", invoice_data);
          //console.log("row--->", row);
          // //console.log("additional_charges--->", additional_charges);

          let {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            saleEditData,
            lstAdditionalLedger,
            lstBrand,
          } = this.state;

          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();
          let opt = [];

          let initInvoiceData = {
            id: invoice_data.id,
            so_sr_no: invoice_data.sales_sr_no,
            so_bill_no: invoice_data.so_bill_no,
            gstNo: invoice_data.gstNo,
            transaction_dt:
              invoice_data.transaction_dt != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
            bill_dt:
              invoice_data.bill_date != ""
                ? moment(new Date(invoice_data.bill_date)).format("DD/MM/YYYY")
                : "",
            salesAccId: invoice_data.sales_account_id
              ? getSelectValue(salesAccLst, invoice_data.sales_account_id)
              : "",
            // supplierCodeId: invoice_data.debtor_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.debtor_id)
            //   : "",
            // supplierNameId: invoice_data.debtor_id
            //   ? getSelectValue(supplierNameLst, invoice_data.debtor_id)["label"]
            //   : "",
            EditsupplierId: invoice_data.debtor_id,
            supplierCodeId: "",
            supplierNameId: "",

            narration: narration,
          };
          //console.log("initInvoiceData >>>>>>>>><<<<", initInvoiceData);

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
            opt = initInvoiceData.supplierCodeId.gstDetails.map((v, i) => {
              return {
                label: v.gstNo,
                value: v.id,
              };
            });
          }
          if (initInvoiceData.hasOwnProperty("gstNo")) {
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          } else {
            initInvoiceData["gstId"] = opt[0];
          }

          this.myRef.current.setFieldValue("gstId", opt[0]);

          this.myRef.current.setFieldValue("narration", narration);

          //console.log("Rowsssss------->", row);
          let initRowData = [];
          if (row.length > 0) {
            initRowData = row.map((v, i) => {
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              //console.log("productOpt ", productOpt);
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
              //console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              v["unit_id"] = unit_id;
              v["qty"] = v.qty != "" ? v.qty : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["packing"] = v.pack_name != "" ? v.pack_name : ""; //for display the package
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

              return v;
            });
          }

          initInvoiceData["purchase_discount"] = res.discountInPer;
          initInvoiceData["purchase_discount_amt"] = res.discountInAmt;
          console.warn("opt ", opt);

          // if (initInvoiceData.gstNo != "")
          //   initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          // else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;

          //console.log("initRowData", initRowData, initInvoiceData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              // additionalChargesTotal: totalAdditionalCharges,
              isLedgerSelectSet: true,
              isRowProductSet: true,
              lstGst: opt,
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
        //console.log("error _______________________ ", error);
      });
  };

  callUpdatesaleOrder = () => {
    //console.log("in create!!!!!");

    const { invoice_data, rows, rowDelDetailsIds } = this.state;
    let invoiceValues = this.myRef.current.values;
    //console.log("invoiceValues >>>>>>>>>>>>>>>>>>", invoiceValues);
    //console.log("invoice_data", invoice_data);

    let requestData = new FormData();
    // //console.log("this.state", this.state);
    // !Invoice Data
    requestData.append("id", invoice_data.id);

    requestData.append(
      "bill_dt",
      moment(invoice_data.bill_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    if (this.state.selectedPendingOrder.length > 0) {
      requestData.append(
        "reference_so_id",
        this.state.selectedPendingOrder.join(",")
      );
    }
    requestData.append("newReference", false);
    requestData.append("bill_no", invoice_data.so_bill_no);
    requestData.append("sales_acc_id", invoice_data.salesAccId.value);
    requestData.append("sales_sr_no", invoiceValues.so_sr_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );

    requestData.append("debtors_id", invoice_data.selectedSupplier.id);
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

    requestData.append(
      "tcs",
      invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    );

    requestData.append(
      "sales_discount",
      invoiceValues.purchase_discount && invoiceValues.purchase_discount != ""
        ? invoiceValues.purchase_discount
        : 0
    );

    requestData.append(
      "sales_discount_amt",
      invoiceValues.purchase_discount_amt &&
        invoiceValues.purchase_discount_amt != ""
        ? invoiceValues.purchase_discount_amt
        : 0
    );

    requestData.append(
      "total_sales_discount_amt",
      invoiceValues.total_purchase_discount_amt &&
        invoiceValues.total_purchase_discount_amt != ""
        ? invoiceValues.total_purchase_discount_amt
        : 0
    );

    //console.log("row in create", rows);

    let frow = rows.map((v, i) => {
      if (v.productId != "") {
        v.productId = v.productId ? v.productId : "";
        v.details_id = v.details_id != "" ? v.details_id : 0;
        v["unit_conv"] = v.unitId ? v.unitId.unitConversion : "";
        v["unitId"] = v.unitId ? v.unitId.value : "";
        v["levelaId"] = v.levelaId ? v.levelaId.value : "";
        v["levelbId"] = v.levelbId ? v.levelbId.value : "";
        v["levelcId"] = v.levelcId ? v.levelcId.value : "";
        v["rate"] = v.rate;
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
    //console.log("frow =->", frow);

    var filtered = frow.filter(function (el) {
      return el && el != null;
    });
    //console.log("filtered", filtered);
    requestData.append("row", JSON.stringify(filtered));
    // requestData.append("additionalChargesTotal", additionalChargesTotal);
    // if (
    //   invoiceValues.additionalChgLedger1 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt1 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger1",
    //     invoiceValues.additionalChgLedger1 !== ""
    //       ? invoiceValues.additionalChgLedger1.value
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt1",
    //     invoiceValues.additionalChgLedgerAmt1 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt1
    //       : 0
    //   );
    // }
    // if (
    //   invoiceValues.additionalChgLedger2 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt2 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger2",
    //     invoiceValues.additionalChgLedger2 !== ""
    //       ? invoiceValues.additionalChgLedger2.value
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt2",
    //     invoiceValues.additionalChgLedgerAmt2 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt2
    //       : 0
    //   );
    // }
    // if (
    //   invoiceValues.additionalChgLedger3 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt3 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger3",
    //     invoiceValues.additionalChgLedger3 !== ""
    //       ? invoiceValues.additionalChgLedger3.value
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt3",
    //     invoiceValues.additionalChgLedgerAmt3 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt3
    //       : 0
    //   );
    // }

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
    //console.log({ rowDelDetailsIds });
    let filterRowDetail = [];
    if (rowDelDetailsIds.length > 0) {
      filterRowDetail = rowDelDetailsIds.map((v) => {
        return { del_id: v };
      });
    }

    let filterACRowDetail = [];

    //console.log("filterACRowDetail", filterACRowDetail);
    //console.log("filterRowDetail", filterRowDetail);
    //console.log("frow", frow);
    requestData.append("rowDelDetailsIds", JSON.stringify(filterRowDetail));
    // requestData.append("acDelDetailsIds", JSON.stringify(filterACRowDetail));

    for (const pair of requestData.entries()) {
      //console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    }
    getSalesUpdateOrder(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          // MyNotifications.fire({
          //   show: true,
          //   icon: "success",
          //   title: "Success",
          //   msg: res.message,
          //   is_timeout: true,
          //   delay: 1000,
          // });
          // // resetForm();
          // this.initRow();

          // eventBus.dispatch("page_change", "tranx_sales_order_list");

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
                // this.setState({ paymentModeModal: false });

                // eventBus.dispatch("page_change", "tranx_sales_invoice_list");

                this.getInvoiceBillsLstPrint(invoiceValues.so_bill_no);
              },
              handleFailFn: () => {
                // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
                if ("ledgerId" in this.state.source != "") {
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_order_edit",
                    to: "ledgerdetails",
                    prop_data: this.state.source["ledgerId"],

                    isNewTab: false,
                  });
                  // this.setState({ source: "" });
                } else {
                  // eventBus.dispatch("page_change", "tranx_sales_order_list");
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_order_edit",
                    to: "tranx_sales_order_list",
                    prop_data: {
                      editId: this.state.saleEditData.id,
                      rowId: this.props.block.prop_data.rowId,
                    },
                    isNewTab: false,
                    isCancel: true,
                  });
                }
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
      })
      .catch((error) => {});
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // //console.log("elementCheck", elementCheck);
    // //console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleBillselectionDebit = (id, index, status) => {
    let { billLst, selectedBillsdebit } = this.state;
    // //console.log({ id, index, status });
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
      // //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;
      });

      // //console.log("fBills", fBills);
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
    // //console.log({ value, index });
    const { billLst, debitBills } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // //console.log('v', v);
      // //console.log('payable_amt', v['payable_amt']);
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
    if (prop_data.prop_data.invoice_data) {
      console.warn("prop_data.isproduct", prop_data);
      this.setState(
        {
          invoice_data: prop_data.prop_data.invoice_data,
          // rows: prop_data.prop_data.rows,
          rows: prop_data.prop_data.rows,
          productId: prop_data.prop_data.productId,
          ledgerId: prop_data.prop_data.ledgerId,
          setProductRowIndex: prop_data.prop_data.rowIndex,
        },
        () => {
          this.setState(
            {
              ledgerId: prop_data.prop_data.ledgerId,
              setLedgerId: true,
              productId: prop_data.prop_data.productId,
              setProductId: true,
              setProductRowIndex: prop_data.prop_data.rowIndex,
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
                      "TSOEProductId-particularsname-" + prop_data.rowIndex
                    )
                    .focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                } else {
                  this.inputLedgerNameRef.current.focus();
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

  getLevelbOpt = (rowIndex, product_id, levelaId) => {
    //console.log({ rowIndex, product_id, levelaId });
    let { rows } = this.state;
    rows[rowIndex]["levelaId"] = levelaId;
    let formData = new FormData();
    formData.append("level_a_id", levelaId.value);
    formData.append("product_id", product_id);
    product_details_levelB(formData).then((response) => {
      // //console.log("response", response);
      let res = response.data;
      if (res.responseStatus === 200) {
        let opt = res.levelBOpt.map((v, i) => {
          return {
            label: v.levelb_name,
            value: v.levelb_id,
          };
        });

        rows[rowIndex]["levelBOpt"] = opt;
      }
      //console.log({ rows });
      this.setState({ rows: rows }, () => {
        this.product_unitsFun(rowIndex, product_id, levelaId);
      });
    });
  };

  getLevelcOpt = (rowIndex, product_id, levelaId, levelbId) => {
    //console.log({ rowIndex, product_id, levelaId, levelbId });

    let { rows } = this.state;
    rows[rowIndex]["levelbId"] = levelbId;

    let formData = new FormData();
    formData.append("level_a_id", levelaId.value);
    formData.append("level_b_id", levelbId.value);
    formData.append("product_id", product_id);
    product_details_levelC(formData).then((response) => {
      // //console.log("response", response);
      let res = response.data;
      if (res.responseStatus === 200) {
        let { rows } = this.state;
        let opt = res.levelCOpt.map((v, i) => {
          return {
            label: v.levelc_name,
            value: v.levelc_id,
          };
        });
        rows[rowIndex]["levelCOpt"] = opt;
      }
      //console.log({ rows });
      this.setState({ rows: rows }, () => {
        this.product_unitsFun(rowIndex, product_id, levelaId, levelbId);
      });
    });
  };

  product_unitsFun = (
    rowIndex,
    product_id,
    levelaId,
    levelbId = null,
    levelcId = null
  ) => {
    //console.log({ rowIndex, product_id, levelaId, levelbId, levelcId });
    let { rows } = this.state;

    let formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("level_a_id", levelaId.value);
    formData.append("level_b_id", levelbId != null ? levelbId.value : levelbId);
    formData.append("level_c_id", levelcId != null ? levelcId.value : levelcId);
    product_units(formData).then((response) => {
      //console.log("response", response);
      let res = response.data;
      if (res.responseStatus === 200) {
        let { rows } = this.state;
        let opt = res.response.map((v, i) => {
          return {
            label: v.unitCode,
            value: v.unitId,
            unitConversion: v.unitConversion,
          };
        });
        rows[rowIndex]["unitOpt"] = opt;
      }
      //console.log({ rows });
      this.setState({ rows: rows });
    });
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
    console.warn("rahul::findProductPackges ", findProductPackges);
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
  getProductFlavorpackageUnitbyids = (invoice_id) => {
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getSalesOrderProductFpuById(reqData)
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

          //console.log("Opt", { Opt });
          this.setState({ lstBrand: Opt }, () => {});
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => {});
      });
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_order_edit",
      to: "tranx_sales_order_list",
    });
  };

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    reqData.append("source", "sales_order");
    getOrderBillById(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        //console.log("responseData ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.product_details,
        });

        eventBus.dispatch("page_change", {
          from: "tranx_sales_order_edit",
          to: "tranx_sales_order_list",
          isNewTab: false,
          isCancel: true,
        });
      }
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      // this.lstSundrydebtors();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      // this.transaction_ledger_listFun();
      // this.transaction_product_listFun();
      this.setLastSalesOrderSerialNo();
      this.transaction_ledger_listFun();
      this.initRow();

      const { prop_data } = this.props.block;
      //console.log("prop_data =->>> ", prop_data);
      this.setState(
        { source: prop_data, saleEditData: prop_data.prop_data },
        () => {
          //console.log("source", this.state.source);
          if (prop_data.prop_data.id) {
            this.getProductFlavorpackageUnitbyids(prop_data.prop_data.id);
          }

          // this.handlePropsData(prop_data);
        }
      );
      // this.setState({ invoice_data: prop_data });
      this.handlePropsData(prop_data);
      // mousetrap.bindGlobal("ctrl+v", this.handleResetForm);
      // mousetrap.bindGlobal("ctrl+c", this.ledgerCreate);
      // mousetrap.bind("alt+p", this.productCreate);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      eventBus.on(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.componentDidlstProduct
      );
      this.getUserControlLevelFromRedux();
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
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

    // alt key button disabled end
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
  /***** Validations of Purchase Invoice for Duplicate Invoice Numbers */
  //Start For validation of duplicate sales quotation number
  validate_sales_orderFun = (invoice_no, invoice_id) => {
    let reqData = new FormData();
    reqData.append("invoice_id", invoice_id);
    reqData.append("salesOrderNo", invoice_no);
    validate_sales_order_update(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          //this.reloadPage();
          document.getElementById("bill_no").focus();
        } else {
          document.getElementById("bill_dt").focus();
        }
      })
      .catch((error) => {});
  };
  //End of validation of duplicate sales quotation number
  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/

  validatePurchaseRate = (mrp = 0, p_rate = 0, setFieldValue) => {
    //console.log("MRP =", parseFloat(mrp));
    //console.log("Purchase rate ::", parseFloat(p_rate));
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
  //               eventBus.dispatch("page_change", "tranx_sales_order_edit");
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
        //console.log("res", response);
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
              //   setFieldValue("bill_dt", "");
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
            // document.getElementById("bill_dt").focus();
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
        //         // setFieldValue("bill_dt", "");
        //         // eventBus.dispatch(
        //         //   "page_change",
        //         //   "tranx_purchase_invoice_create"
        //         // );

        //         setTimeout(() => {
        //           document.getElementById("bill_dt").focus();
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
        //         // setFieldValue("bill_dt", "");
        //         // eventBus.dispatch("page_change", {
        //         //   from: "tranx_purchase_invoice_create",
        //         //   to: "tranx_purchase_invoice_list",
        //         //   isNewTab: false,
        //         // });

        //         setTimeout(() => {
        //           document.getElementById("bill_dt").focus();
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

  componentDidUpdate() {
    const {
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,

      isEditDataSet,
      saleEditData,
      lstBrand,
      lstDisLedger,
    } = this.state;
    console.warn("componentDidUpdate", {
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      isEditDataSet,
      saleEditData,
    });
    // this.setSaleOrderEditData();
    if (
      salesAccLst.length > 0 &&
      lstBrand.length > 0 &&
      // supplierNameLst.length > 0 &&
      // supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      isEditDataSet == false &&
      saleEditData != ""
    ) {
      console.warn("setSaleOrderEditData");
      this.setSaleOrderEditData();
    }
  }

  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
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

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };

  get_sales_order_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    //console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_sales_order_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        // //console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          this.setState({
            product_supplier_lst: res.data,
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

  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputLedgerNameRef.current.focus();
        if (this.state.ledgerNameFlag) {
          if (this.state.lstGst.length > 1 && this.clientGSTINRef.current) {
            this.clientGSTINRef.current.focus();
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
          console.warn("selectedLEdger index " + index);
          document.getElementById("LedgerMdlTr_" + index).focus();
        }, 200);
      }
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
        document
          .getElementById("TSOEProductId-particularsname-" + obj.rowIndex)
          .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.isBatchMdl == "batchMdl") {
      setTimeout(() => {
        document
          .getElementById("TSOEProductId-batchNo-" + obj.rowIndex)
          .focus();
      }, 250);
    }
  };

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("productId", product_id);
    get_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        if (res.responseStatus == 200) {
          let idc = res.data;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
          }

          this.setState({
            product_supplier_lst: onlyfive,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ product_supplier_lst: [] });
      });
  };
  getProductBatchList = (rowIndex = -1) => {
    const { rows, invoice_data } = this.state;
    //console.log({ rows, invoice_data });
    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let unit_id = rows[rowIndex]["unitId"]["value"];

    let invoice_value = this.myRef.current.values;
    let reqData = new FormData();
    reqData.append("product_id", product_id);
    reqData.append("level_a_id", level_a_id);
    if (rows[rowIndex]["levelbId"] != "")
      reqData.append("level_b_id", rows[rowIndex]["levelbId"]["value"]);
    if (rows[rowIndex]["levelcId"] != "")
      reqData.append("level_c_id", rows[rowIndex]["levelcId"]);
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
        //console.log("response ", response);
        if (response.responseStatus == 200) {
          res = response.data;
          //console.log("res ", res);

          invoice_data["costing"] = response.costing;
          invoice_data["costingWithTax"] = response.costingWithTax;
          this.setState(
            {
              invoice_data: invoice_data,
              batchData: res,
            },
            () => {
              if (res.length > 0) {
                this.getInitBatchValue(rowIndex);
              } else {
                this.getInitBatchValue(rowIndex);
              }
            }
          );
        }
      })
      .catch((error) => {});
    // let id = parseInt(this.state.rows.length) - 1;
    // if (document.getElementById("TSOEAddBtn-" + id) != null) {
    //   setTimeout(() => {
    //     document.getElementById("TSOEAddBtn-" + id).focus();
    //   });
    // }
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
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  render() {
    const {
      currentTab, //@prathmesh @batch info & product info tab
      isTextBox,
      ledgerInputData,
      add_button_flag,
      product_supplier_lst,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      invoice_data,
      salesAccLst,
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
      rowDelDetailsIds,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      batchHideShow,
      transactionType,
      isLedgerSelectSet,
      isRowProductSet,
      transactionTableStyle,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      ledgerId,
      setLedgerId,
      from_source,
      productId,
      setProductId,
      setProductRowIndex,
      saleRateType,
      opType,
      currentLedgerData,
      updatedLedgerType,
      ledgerType,
      sourceUnder,
    } = this.state;
    const isFocused = this.isInputFocused();
    return (
      <div>
        <div className="purchase-tranx" style={{ overflow: "hidden" }}>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            // validationSchema={Yup.object().shape({
            //   // gstId: Yup.object().nullable().required("GST No is required"),
            //   bill_dt: Yup.string().required("Order Date is Required"),
            //   // salesAccId: Yup.object().nullable().required("Required"),

            //   // clientNameId: Yup.object().nullable().required("Required"),
            //   so_bill_no: Yup.string().required("Order No. is Required"),
            //   // pi_invoice_dt: Yup.string().required("Invoice Date is Required"),
            //   // supplierCodeId: Yup.object()
            //   //   .nullable()
            //   //   .required("Supplier Code is Required"),
            //   // purchaseId: Yup.object()
            //   //   .nullable()
            //   //   .required("Purchase Account is Required"),
            //   // pi_no: Yup.string().required("Invoice No is Required"),
            //   supplierNameId: Yup.string()
            //     .trim()
            //     .required("Client Name is Required"),
            // })}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let errorArray = [];
              if (values.supplierNameId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.so_bill_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.bill_dt == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  console.warn("rows->>>>>>>>>>>>>>", rows);
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

                        // if (v.is_batch) {
                        //   if (v.b_no) {
                        //     batchNo.push("");
                        //   } else {
                        //     batchNo.push("Y");
                        //   }
                        // } else {
                        batchNo.push("");
                        // }

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
                            msg: "Do you want to Update ?",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              this.callUpdatesaleOrder();
                              // let { supplierCodeId } = values;
                              // if (supplierCodeId) {
                              //   this.handleFetchData(supplierCodeId.value);
                              // }
                            },
                            handleFailFn: () => {},
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
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto ps-2"
                              >
                                <Form.Label>Tranx Date</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <MyTextDatePicker
                                  autoFocus
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style "
                                  name="transaction_dt"
                                  id="transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.transaction_dt}
                                  onChange={handleChange}
                                  autoComplete="true"
                                  readOnly={true}
                                  onBlur={(e) => {
                                    // console.log("e ", e);
                                    /*  console.log(
                                      "e.target.value ",
                                      e.target.value
                                    ); */
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
                                  {errors.so_transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          {/* <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Code</Form.Label>
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
                                          label: v.gstin,
                                          value: v.id,
                                        };
                                      });
                                      this.setState(
                                        {
                                          lstGst: opt,
                                        },
                                        () => {
                                          setFieldValue("gstId", opt[0]);
                                        }
                                      );
                                    }
                                  }}
                                  value={values.supplierCodeId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.supplierCodeId}
                                </span>
                              </Col>
                            </Row>
                          </Col> */}
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="my-auto"
                              >
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <Form.Control
                                  ref={this.inputLedgerNameRef}
                                  type="text"
                                  // className="tnx-pur-inv-text-box text-start"
                                  placeholder="Ledger Name"
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  // onChange={handleChange}
                                  autoComplete="true"
                                  className={`${
                                    values.supplierNameId == "" &&
                                    errorArrayBorder[0] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box text-start"
                                      : "tnx-pur-inv-text-box text-start"
                                  }`}
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
                                  onChange={(e) => {
                                    e.preventDefault();

                                    this.setledgerInputData(
                                      e.target.value,
                                      true
                                    );
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
                                  value={values.supplierNameId}
                                  disabled={
                                    values.transaction_dt != "" ? false : true
                                  }
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
                                          /*    console.log(
                                            "values.supplierNameId::",
                                            values.supplierNameId
                                          ); */
                                          this.ledgerFilterData();
                                        }
                                      );
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 40) {
                                      this.setState({ ledgerNameFlag: true });
                                      if (ledgerModal == true)
                                        document
                                          .getElementById("LedgerMdlTr_0")
                                          .focus();
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="p-0 my-auto"
                              >
                                <Form.Label>Client GSTIN</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.clientGSTINRef}
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
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>Sales A/C</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
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
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable={true}
                                    options={salesAccLst}
                                    name="salesAccId"
                                    id="salesAccId"
                                    onChange={(v) => {
                                      setFieldValue("salesAccId", v);
                                    }}
                                    autoComplete="true"
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
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto ps-2"
                              >
                                <Form.Label>Sales Serial</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Sales sr No. "
                                  name="so_sr_no"
                                  id="so_sr_no"
                                  disabled
                                  onChange={handleChange}
                                  autoComplete="true"
                                  value={values.so_sr_no}
                                  isValid={touched.so_sr_no && !errors.so_sr_no}
                                  isInvalid={!!errors.so_sr_no}
                                  readOnly={true}
                                  isClearable={false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.so_sr_no}
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
                                className="my-auto"
                              >
                                <Form.Label>
                                  Order No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Control
                                  type="text"
                                  placeholder="Order No."
                                  name="so_bill_no"
                                  id="so_bill_no"
                                  // className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  autoComplete="true"
                                  value={values.so_bill_no}
                                  isValid={
                                    touched.so_bill_no && !errors.so_bill_no
                                  }
                                  /*  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
                                  isInvalid={!!errors.so_bill_no}
                                  className={`${
                                    values.so_bill_no == "" &&
                                    errorArrayBorder[1] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (e.keyCode == 9) {
                                      if (e.target.value) {
                                        e.preventDefault();
                                        this.validate_sales_orderFun(
                                          values.so_bill_no,
                                          values.id,
                                          setFieldValue
                                        );
                                        // this.focusNextElement(e);
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value) {
                                        this.validate_sales_orderFun(
                                          values.so_bill_no,
                                          values.id,
                                          setFieldValue
                                        );
                                        // this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.so_bill_no}
                                </span> */}
                              </Col>
                              {/* </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row> */}
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="p-0 my-auto"
                              >
                                <Form.Label>
                                  Order Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      values.bill_dt === "__/__/____"
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
                                    name="bill_dt"
                                    id="bill_dt"
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    value={values.bill_dt}
                                    onChange={handleChange}
                                    autoComplete="true"
                                    className={`${
                                      values.bill_dt == "" &&
                                      errorArrayBorder[2] == "Y"
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
                                    //     this.setErrorBorder(2, "");
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
                                    //           setFieldValue("bill_dt", "");
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_sales_order_edit"
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
                                    //           setFieldValue("bill_dt", "");
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_sales_order_edit"
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
                                    //     this.setErrorBorder(2, "Y");
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
                                    //         "bill_dt",
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
                                    //       setFieldValue("bill_dt", "");
                                    //     }
                                    //   } else {
                                    //     setFieldValue("bill_dt", "");
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
                                            const currentYear = new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            //console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue("bill_dt", finle);
                                          }
                                          //current year auto show end
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            setFieldValue(
                                              "bill_dt",
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
                                            setFieldValue("bill_dt", "");
                                          }
                                        } else {
                                          setFieldValue("bill_dt", "");
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
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            //console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue("bill_dt", finle);
                                          }
                                          //current year auto show end
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            setFieldValue(
                                              "bill_dt",
                                              e.target.value
                                            );
                                            this.checkInvoiceDateIsBetweenFYFun(
                                              e.target.value,
                                              setFieldValue
                                            );
                                            this.focusNextElement(e);
                                            this.setState({
                                              currentTab: "second",
                                            });
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid invoice date",
                                              is_button_show: true,
                                            });
                                            this.invoiceDateRef.current.focus();
                                            setFieldValue("bill_dt", "");
                                          }
                                        } else {
                                          setFieldValue("bill_dt", "");
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.bill_dt}
                                </span>
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
                    // openSerialNo={this.openSerialNo.bind(this)}
                    // openBatchNo={this.openBatchNo.bind(this)}
                    getProductBatchList={this.getProductBatchList.bind(this)}
                    add_button_flag={add_button_flag}
                    rows={rows}
                    batchHideShow={batchHideShow}
                    productLst={productLst}
                    transactionType={transactionType}
                    transactionTableStyle={transactionTableStyle}
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    saleRateType={saleRateType}
                    productId="TSOEProductId-"
                    addBtnId="TSOEAddBtn-"
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
                    newBatchModal={newBatchModal}
                    batchInitVal={batchInitVal}
                    b_details_id={b_details_id}
                    isBatch={isBatch}
                    batchData={batchData}
                    is_expired={is_expired}
                    tr_id={tr_id}
                    // batch_data_selected={batch_data_selected}
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
                  />

                  {/* <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={4}>
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
                    <Col lg={4} className="for_padding">
                      <Row>
                        <Col lg={6} className="my-auto colset">
                          <span className="span-lable">Batch Expiry:</span>
                          {product_hover_details.batch_expiry ? (
                            <span className="span-value">
                              {moment(
                                product_hover_details.batch_expiry
                              ).format("DD-MM-YYYY") === "Invalid date"
                                ? ""
                                : moment(
                                    product_hover_details.batch_expiry
                                  ).format("DD/MM/YYYY")}
                            </span>
                          ) : (
                            <></>
                          )}
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {INRformat.format(product_hover_details.mrp)}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Profit:</span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                        </Col>
                      </Row>
                    </Col>

                  </Row> */}
                  <Row className="mx-0 btm-data-saleOrder">
                    <Col
                      lg={9}
                      md={9}
                      sm={9}
                      xs={9}
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
                                id="TSOE_Ledger_Tab"
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
                                id="TSOE_Product_Tab"
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
                                      .getElementById("TSOE_Ledger_Tab")
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
                                    &nbsp;&nbsp;
                                    {ledgerData.gst_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Area:</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.area}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Bank:</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
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
                                    &nbsp;&nbsp;
                                    {ledgerData.contact_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Transport:</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
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
                                    &nbsp;&nbsp;
                                    {ledgerData.credit_days}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">FSSAI:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    &nbsp;&nbsp;
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
                                    &nbsp;&nbsp;
                                    {ledgerData.license_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Route:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    &nbsp;&nbsp;
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
                                        &nbsp;&nbsp;
                                        {productData.brand}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Group:</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.group}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Category:
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.category}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Supplier:
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
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
                                        &nbsp;&nbsp;
                                        {productData.hsn}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Tax Type:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.tax_type} */}
                                        &nbsp;&nbsp;
                                        {productData.tax_type}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Tax%:</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.tax_per}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Margin%:
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.margin_per}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col lg={3} className="col-top-margin pe-0">
                                    <div className="d-flex">
                                      <span className="span-lable">Cost:</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.cost}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Shelf ID:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.hsn} */}
                                        &nbsp;&nbsp;
                                        {productData.shelf_id}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Min Stock:
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {[productData.min_stocks]}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Max Stock:
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
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
                                        &nbsp;&nbsp;
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
                                        &nbsp;&nbsp;
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
                                        &nbsp;&nbsp;
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
                      <Row className="mt-2 pb-2">
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            autoComplete="off"
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
                      <div className="tnx-pur-ord-info-table">
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
                    {/* <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <Row>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto pe-0"
                        >
                          <Form.Label>Dis. %</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <Form.Control
                            placeholder="Dis."
                            className="text-box"
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
                          className="my-auto pe-0"
                        >
                          <Form.Label>Dis. %</Form.Label>
                        </Col>
                        <Col lg={5}>
                          <Form.Control
                            placeholder="Dis."
                            className="text-box"
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
                        <Col lg={6}>
                          <span>Total Qty:</span>
                          <span>{values.total_qty}</span>
                        </Col>
                        <Col lg={6}>
                          <span>R.Off(+/-):</span>
                          <span>{parseFloat(values.roundoff).toFixed(2)}</span>
                        </Col>
                        <Col lg={6}>
                          <span>Free Qty:</span>
                          <span>
                            {isNaN(values.total_free_qty) === true
                              ? 0
                              : values.total_free_qty}
                          </span>
                        </Col>
                      </Row>
                    </Col> */}
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Table className="tnx-pur-inv-btm-amt-tbl">
                        <tbody>
                          {/* <tr>
                            <td
                              className="py-0"
                              style={{ cursor: "pointer" }}
                              // onClick={(e) => {
                              //   e.preventDefault();
                              //   this.ledgerNameModalFun(true);
                              // }}
                            >
                              <Select
                                placeholder="Ledger 1"
                                isClearable
                                className="selectTo"
                                styles={purchaseSelect}
                                options={lstAdditionalLedger}
                                name="additionalChgLedger1"
                                id="additionalChgLedger1"
                                onChange={(v) => {
                                  setFieldValue("additionalChgLedger1", "");
                                  if (v != null) {
                                    setFieldValue("additionalChgLedger1", v);
                                  }
                                }}
                                value={values.additionalChgLedger1}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="text-box"
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
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Select
                                placeholder="Ledger 2"
                                isClearable
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                styles={purchaseSelect}
                                options={lstAdditionalLedger}
                                name="additionalChgLedger2"
                                id="additionalChgLedger2"
                                onChange={(v) => {
                                  setFieldValue("additionalChgLedger2", "");
                                  if (v != null) {
                                    setFieldValue("additionalChgLedger2", v);
                                  }
                                }}
                                value={values.additionalChgLedger2}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="text-box"
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
                              />
                            </td>
                          </tr> */}
                          <tr className="mt-4">
                            <td className="py-0">Gross Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_base_amt).toFixed(2)} */}
                              {INRformat.format(values.total_base_amt)}
                            </td>
                          </tr>

                          <tr className="mt-4">
                            <td className="py-0">Discount</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )} */}
                              {INRformat.format(values.total_invoice_dis_amt)}
                            </td>
                          </tr>

                          <tr className="mt-4">
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_taxable_amt).toFixed(2)} */}
                              {INRformat.format(values.total_taxable_amt)}
                              {/* 99999.99 */}
                            </td>
                          </tr>
                          <tr className="mt-4">
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {/* 9999.99 */}
                              {INRformat.format(values.total_tax_amt)}
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="py-0">
                              <Select
                                placeholder="Ledger 1"
                                isClearable
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                styles={purchaseSelect}
                                options={lstAdditionalLedger}
                                name="additionalChgLedger3"
                                id="additionalChgLedger3"
                                onChange={(v) => {
                                  setFieldValue("additionalChgLedger3", "");
                                  if (v != null) {
                                    setFieldValue("additionalChgLedger3", v);
                                  }
                                }}
                                value={values.additionalChgLedger3}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="text-box"
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
                              />
                            </td>
                          </tr> */}

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {INRformat.format(values.bill_amount)}
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="orderbtn">
                        <Button
                          id="TSOE_submit_btn"
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
                                  // "page_change",
                                  // "tranx_sales_order_list"
                                  //);
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_order_edit",
                                    to: "tranx_sales_order_list",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: {
                                      editId: this.state.saleEditData.id,
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_sales_order_list"
                                    // );
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_order_edit",
                                      to: "tranx_sales_order_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: {
                                        editId: this.state.saleEditData.id,
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
          {/* Ledger Modal Starts */}
          <MdlLedger
            ref={this.customModalRef} //@neha @on click outside modal will close
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerModal={ledgerModal}
            tranxRef={this.myRef}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            invoice_data={invoice_data}
            currentLedgerData={currentLedgerData}
            isLedgerSelectSet={isLedgerSelectSet}
            from_source={from_source}
            ledgerId={ledgerId}
            setLedgerId={setLedgerId}
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
            ledgerInputData={ledgerInputData}
            isTextBox={isTextBox}
            searchInputId="supplierNameId"
            setledgerInputDataFun={this.setledgerInputData.bind(this)}
            rows={rows}
            transactionTableStyle={transactionTableStyle}
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
            opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
            sourceUnder={sourceUnder}
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
            userControl={this.props.userControl}
            isRowProductSet={isRowProductSet}
            transactionType={transactionType}
            productId={productId}
            setProductId={setProductId}
            setProductRowIndex={setProductRowIndex}
            from_source={from_source}
            invoice_data={this.myRef.current ? this.myRef.current.values : ""}
            saleRateType={saleRateType}
          /> */}
          {/* Product Modal Ends */}
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

export default connect(mapStateToProps, mapActionsToProps)(TranxSalesOrderEdit);
