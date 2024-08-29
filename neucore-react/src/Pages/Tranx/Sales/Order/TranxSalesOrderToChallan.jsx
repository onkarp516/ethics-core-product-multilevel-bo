import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

import React, { Component } from "react";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import add_icon from "@/assets/images/add_icon.svg";
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
import moment from "moment";
import {
  getSundryDebtors,
  getSalesAccounts,
  getProduct,
  createSalesChallan,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  getProductPackageList,
  getLastSalesChallanNo,
  get_Product_batch,
  getProductFlavourList,
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
  get_sales_challan_supplierlist_by_productid,
  getSalesOrderProductFpuByIds,
  getSaleOrderWithIds,
  get_supplierlist_by_productid,
  getSalesmanMasterOutlet,
  getPurchaseAccounts,
} from "@/services/api_functions";

import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
// import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
// import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
  Nav,
  Tab,
} from "react-bootstrap";
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
  OnlyEnterNumbers,
  getValue,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  allEqual,
  flavourDD,
  INRformat,
  handlesetFieldValue,
  OnlyEnterAmount,
  roundDigit,
  configDecimalPlaces,
  fnTranxCalculationRoundDecimalPlaces,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class TranxSalesOrderToChallan extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.selectRef = React.createRef();
    // this.radioRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.dateRef = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.inputRef1 = React.createRef();
    this.clientGSTINRef = React.createRef();
    this.salesAccRef = React.createRef();
    this.state = {
      salesmanLst: [],
      currentTab: "second", //@prathmesh @batch info & product info tab active
      transactionLedgerStyle: "ledgerstyle",
      sc_sr_no: "",
      isEditDataSet: false,
      product_supplier_lst: [],
      product_supplier_unit: {
        supplier_name: "",
        invoice_no: "",
        invoice_date: "",
        batch: "",
        mrp: "",
        quantity: "",
        rate: "",
        cost: "",
        dis_per: "",
        dis_amt: "",
      },
      add_button_flag: true,
      isBranch: false,
      isAdditionalCharges: false,
      show: false,
      opendiv: false,
      hidediv: true,
      ledgerType: "SD",
      updatedLedgerType: "SD",
      sc_sr_no: "",
      scbill_no: "",
      invoice_data: {
        selectedSupplier: "",
        sc_sr_no: "",
        scbill_no: "",
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

        tcs_amt: "",
        tcs_per: "",
        tcs_mode: "",
      },
      additionalDelDetailsIds: [],
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      Clietdetailmodal: false,
      clientinfo: [],
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      lstBrand: [],
      taxcal: { igst: [], cgst: [], sgst: [] },
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      lstFlavours: [],
      flavour_index: 0,
      lstGst: [],
      rowDelDetailsIds: [],

      productData: "",
      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerNameModal: false,
      newBatchModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      currentLedgerData: "",
      selectedLedgerIndExp: "",
      ledgerInputData: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      isRoundOffCheck: false,
      showLedgerDiv: false,
      selectedLedgerNo: 1,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      isLedgerSelectSet: false,
      delAdditionalCahrgesLst: [],
      isRowProductSet: false,
      costingMdl: false,
      costingInitVal: "",
      gstId: "",
      selectSerialModal: false,
      serialNoLst: [],
      batch_data_selected: "",
      batchHideShow: false,
      errorArrayBorder: "",
      saleRateType: "sale",
      transactionType: "sales_edit",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      from_source: "tranx_sales_order_to_challan",
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
    };
    this.dateRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();
  }

  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

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
            // this.myRef.current.setFieldValue("salesAccId", v[0]);
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
        if (res.responseStatus == 200) {
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
      .catch((error) => {});
  };

  setLastSalesChallanSerialNo = () => {
    getLastSalesChallanNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("sc_sr_no", res.count);
            this.myRef.current.setFieldValue("scbill_no", res.serialNo);
            this.setState({ sc_sr_no: res.count, scbill_no: res.serialNo });
            //this.myRef.current.setFieldValue("scbill_no", res.serialNo);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setSupplierData = (clientId = "", setFieldValue) => {
    console.warn("rahul :: clientId", clientId);
    let requestData = new FormData();
    requestData.append("ledgerId", clientId && clientId.value);
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
              handleSuccessFn: () => {
                console.warn("rahul:: continue invoice");
              },
              handleFailFn: () => {
                console.warn("rahul:: exit from invoice or reload page");
                this.reloadPage();
              },
            },
            () => {
              console.warn("rahul :: return_data");
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });

    let opt = [];
    opt = clientId.gstDetails.map((v, i) => {
      return {
        label: v.gstin,
        value: v.id,
      };
    });

    this.setState({ lstGst: opt }, () => {
      if (opt.length > 0) setFieldValue("gstId", opt[0]);
    });
  };

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
              delay: 1000,
            },
            () => {}
          );
          setTimeout(() => {
            this.invoiceDateRef.current.focus();
          }, 1300);
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
                  // document.getElementById("transaction_dt").focus();
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
                  // document.getElementById("transaction_dt").focus();
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

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.state;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };

  // handleUnitChange = (ele, value, rowIndex) => {
  //   let { rows, showBatch } = this.state;
  //   console.log("(ele, value, rowIndex) ", ele, value, rowIndex);

  //   if (value == "" && ele == "qty") {
  //     value = 0;
  //   }
  //   rows[rowIndex][ele] = value;

  //   if (ele == "unitId") {
  //     if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
  //       this.handleRowStateChange(
  //         rows,
  //         rows[rowIndex]["is_batch"], // true,
  //         rowIndex
  //       );
  //     }
  //   } else {
  //     this.handleRowStateChange(rows);
  //   }
  // };

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

  initAdditionalCharges = () => {
    // additionalCharges
    let lst = [];
    for (let index = 0; index < 1; index++) {
      let data = {
        additional_charges_details_id: 0,
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
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

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    //console.log({ invoice_data });
    if (status == true) {
      let reqData = new FormData();
      let sun_id =
        invoice_data.supplierNameId && invoice_data.supplierNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          //console.log("res", response);
          let res = response.data;
          if (res.responseStatus == 200) {
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

  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleOptionClick = (option) => {
    this.setState(
      (prevState) => ({
        tcs_mode: prevState.tcs_mode === option ? null : option,
      }),
      () => {}
    );
  };

  handleKeyPress = (event, option) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault(); // Prevent the default space bar scrolling behavior
      this.handleOptionClick(option);
    }
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    this.setState({ rows: rowValue }, () => {
      this.setState(
        {
          rowIndex: rowIndex,
        },
        () => {
          this.getProductBatchList(rowIndex);
        }
      );

      this.handleTranxCalculation();
    });
  };

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
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
    // debugger;
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

  batchModalShow = (status) => {
    this.setState({ batchModalShow: status });
  };
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
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
    this.setState({ ledgerModalIndExp: false }, () => {
      this.handleTranxCalculation();
    });
  };

  handleAddAdditionalCharges = () => {
    let { additionalCharges } = this.state;
    let data = {
      details_id: "",
      ledgerId: "",
      amt: "",
    };
    additionalCharges = [...additionalCharges, data];
    this.setState({ additionalCharges: additionalCharges });
  };

  handleRemoveAddtionalChargesRow = (rowIndex = -1) => {
    let { additionalCharges, additionalDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    if (additionalCharges.length > 1) {
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
    }
  };
  handleClearProduct1 = (frows) => {
    this.setState({ additionalCharges: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  handleTranxCalculation = (elementFrom = "", isCal = false) => {
    // !Most IMP̥
    let { rows, additionalChargesTotal, isRoundOffCheck } = this.state;

    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;
    let inp_tcs_per = 0;
    let inp_tcs_amt = 0;

    // debugger;
    if (this.myRef.current) {
      //console.log("this.myRef.current.values ", this.myRef.current.values);
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
      // //console.log("suppliercodeId", supplierCodeId);
      // takeDiscountAmountInLumpsum = supplierCodeId.takeDiscountAmountInLumpsum;
      // isFirstDiscountPerCalculate = supplierCodeId.isFirstDiscountPerCalculate;

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

    let resTranxFn = fnTranxCalculationRoundDecimalPlaces({
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
      configDecimalPlaces: configDecimalPlaces,
    });
    //console.log({ resTranxFn });
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

    // let roundoffamt = Math.round(total_final_amt);
    // let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);

    let roundoffamt = 0;
    let roffamt = 0;

    if (
      (elementFrom.toLowerCase() == "roundoff" && isCal == true) ||
      isRoundOffCheck == false
    ) {
      roundoffamt = roundDigit(total_final_amt, configDecimalPlaces);
      roffamt = 0;
      bill_amount = roundDigit(bill_amount, configDecimalPlaces);
    } else {
      roundoffamt = Math.round(total_final_amt);
      bill_amount = Math.round(parseFloat(bill_amount));
      roffamt = roundDigit(roundoffamt - total_final_amt, configDecimalPlaces);
    }

    this.myRef.current.setFieldValue(
      "tcs_per",
      isNaN(parseFloat(tcs_per_cal))
        ? 0
        : roundDigit(tcs_per_cal, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "tcs_amt",
      isNaN(parseFloat(tcs_amt_cal))
        ? 0
        : roundDigit(tcs_amt_cal, configDecimalPlaces)
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
      Math.abs(parseFloat(roffamt).toFixed(2))
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(bill_amount).toFixed(2)
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

  getProductBatchList = (rowIndex, source = "batch") => {
    // debugger;
    const { rows, invoice_data, lstBrand } = this.state;

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
              isfound = source == "batch" ? false : true;
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
      let res = [];
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          ////console.log("get_Product_batch =>", response);
          if (response.responseStatus == 200) {
            res = response.data;
            ////console.log("res ", res);

            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            this.setState(
              {
                invoice_data: invoice_data,
                batchData: res,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
              }
            );
            ////console.log("res->batchData  : ", res);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
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
    // let id = parseInt(this.state.rows.length) - 1;
    // if (document.getElementById("TSOTCAddBtn-" + id) != null) {
    //   setTimeout(() => {
    //     document.getElementById("TSOTCAddBtn-" + id).focus();
    //   });
    // }
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
    // debugger;
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

  // ledgerModalFun = (status) => {
  //   this.setState({ ledgerData: "", ledgerModal: status });
  // };
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

  handleRoundOffCheck = (value) => {
    this.setState({ isRoundOffCheck: value }, () => {
      this.handleTranxCalculation("roundoff", !value);
    });
  };

  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  handlePropsData = (prop_data) => {
    if ("prop_data" in prop_data) {
      console.warn("prop_data.isproduct", prop_data);
      this.setState(
        {
          invoice_data: prop_data.prop_data.invoice_data,
          // rows: prop_data.prop_data.rows,
          rows: prop_data.prop_data.rows,
          productId: prop_data.prop_data.productId,
          ledgerId: prop_data.prop_data.ledgerId,
          setProductRowIndex: prop_data.prop_data.rowIndex,
          additionalChargesId: prop_data.additionalChargesId,
          setAdditionalChargesId: true,
          setAdditionalChargesIndex: prop_data.setAdditionalChargesIndex,
          setLedgerId: true,
          setProductId: true,
        },
        () => {
          setTimeout(() => {
            //@Vinit @Focusing the previous tab were we left
            if (prop_data.isProduct == "productMdl") {
              document
                .getElementById(
                  "TSOTCProductId-particularsname-" + prop_data.rowIndex
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
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TSOTCProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
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

  qtyVerificationById = (rv, elementId = null, rowIndex = -1) => {
    //console.log("verify----", rv, elementId);
    let { rows } = this.state;
    let requestData = new FormData();
    requestData.append("product_id", rv.productId);
    requestData.append("levelAId", rv.levelaId != "" ? rv.levelaId.value : "");

    requestData.append("levelBId", rv.levelbId != "" ? rv.levelbId.value : "");
    requestData.append("levelCId", rv.levelcId != "" ? rv.levelcId.value : "");
    requestData.append("unitId", rv.unitId.value);
    requestData.append("batchId", rv.b_details_id);
    requestData.append("qty", parseInt(rv.qty));

    // quantityVerificationById(requestData).then((response) => {
    //   //console.log("res : ", response);
    //   let res = response.data;
    //   //console.log("res validate", res);
    //   if (res.responseStatus == 409) {
    //     // rows[rowIndex]["qty"] = "";
    //     this.setState({ rows: rows }, () => {
    //       document.getElementById(elementId).value = "";
    //       document.getElementById(elementId).focus();
    //       MyNotifications.fire({
    //         show: true,
    //         icon: "error",
    //         title: "Error",
    //         msg: res.message,
    //         // is_button_show: false,
    //         is_timeout: true,
    //         delay: 1500,
    //       });
    //     });
    //   }
    // });
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
            // console.log("prop_data", prop_data);

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
              // console.log("invoice_data", init_d);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      this.setLastSalesChallanSerialNo();
      this.lstPurchaseAccounts();
      this.initRow();
      this.initAdditionalCharges();
      this.lstAdditionalLedgers();
      this.lstSalesmanMaster();
      // this.transaction_product_listFun();
      this.transaction_ledger_listFun();
      const { prop_data } = this.props.block;
      //console.log("userpermission-->", this.props.userPermissions);
      //console.log("prop_data ", { prop_data });
      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      this.setState({ salesEditData: prop_data }, () => {
        if (prop_data.selectedBills) {
          this.getSalesOrderProductFpuByIds();
        }
      });
      this.handlePropsData(prop_data);
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
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputRef1.current.focus();
        if (this.state.lstGst.length > 1 && this.clientGSTINRef.current) {
          this.clientGSTINRef.current.focus();
        } else if (this.salesAccRef.current) {
          this.salesAccRef.current.focus();
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
          .getElementById("TSOTCProductId-particularsname-" + obj.rowIndex)
          .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
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

  openSerialNo = (rowIndex) => {
    // debugger
    //console.log("rowIndex-->>", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // //console.log("serialNoLst", serialNoLst);

    if (serialNoLst && serialNoLst.length == 0) {
      serialNoLst = Array(6)
        .fill("")
        .map((v) => {
          return { serial_detail_id: 0, serial_no: v };
        });
    } else if (serialNoLst == undefined) {
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

  openBatchNo = (rowIndex) => {
    let { rows } = this.state;
    this.handleRowStateChange(
      rows,
      rows[rowIndex]["is_batch"], // true,
      rowIndex
    );
  };

  handleCGSTChange = (ele, value, rowIndex) => {
    ////console.log("ele", { ele, value, rowIndex });
    let { taxcal, cgstData } = this.state;
    ////console.log("amt", value);
    const newData = taxcal;
    ////console.log("newData", newData);

    newData.cgst[rowIndex].amt = value;
    // newData.sgst[rowIndex].amt = value1;
    // let igstData = value + value1;
    // newData.igst[rowIndex].amt = igstData;

    ////console.log("newData", newData.cgst[rowIndex].amt);
    ////console.log("newData---", newData, this.state.taxcal);

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
    ////console.log("ele", { ele, value, rowIndex });
    let { taxcal, sgstData, cgstData } = this.state;
    ////console.log("amt", value);
    const newData = taxcal;
    ////console.log("newData", newData);

    newData.sgst[rowIndex].amt = value;
    ////console.log("newData", newData.sgst[rowIndex].amt);
    ////console.log("newData---", newData, this.state.taxcal);
    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, sgstData: newData.sgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    ////console.log("totaltaxAmt--totalAmt-", totaltaxAmt, totalAmt);

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    // //console.log(
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

  getSalesOrderProductFpuByIds = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    //console.log("salesEditData=-> ", salesEditData);
    let s_o_id = salesEditData.selectedBills.map((v) => {
      return { id: v };
    });
    //console.log("s_o_id", s_o_id);

    reqData.append("s_o_id", JSON.stringify(s_o_id));

    getSalesOrderProductFpuByIds(reqData)
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

  componentDidUpdate() {
    let {
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      salesEditData,
      // lstDisLedger,
      lstBrand,
    } = this.state;

    // console.warn("rahul::didupdate ", {
    //   salesAccLst,
    //   supplierNameLst,
    //   supplierCodeLst,
    //   productLst,
    //   lstAdditionalLedger,
    //   isEditDataSet,
    //   salesEditData,
    //   //  lstDisLedger,
    //   lstBrand,
    // });

    if (
      salesAccLst.length > 0 &&
      // supplierNameLst.length > 0 &&
      // supplierCodeLst.length > 0 &&
      // productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      // lstBrand.length > 0 &&
      //  lstDisLedger.length > 0 &&
      isEditDataSet === false &&
      salesEditData !== ""
    ) {
      this.setSalesOrderEditData();
    }
  }

  setSalesOrderEditData = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    //console.log("salesEditData=-> ", salesEditData);
    let sales_order_ids = salesEditData.selectedBills.map((v) => {
      return { id: v };
    });
    //console.log("sales_order_ids", sales_order_ids);

    reqData.append("sales_order_ids", JSON.stringify(sales_order_ids));

    getSaleOrderWithIds(reqData)
      .then((response) => {
        //console.log("response >>>", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, narration } = res;
          const {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstBrand,
            lstAdditionalLedger,
            lstDisLedger,
            sc_sr_no,
            scbill_no,
          } = this.state;
          let opt = [];
          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          /*   console.log(
              "supplierNameLst,  supplierCodeLst,",
              supplierNameLst,
              supplierCodeLst
            ); */
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

          // debugger;
          let initInvoiceData = {
            id: invoice_data.id,
            sc_sr_no: sc_sr_no,
            narration: invoice_data.narration,
            // bill_no: invoice_data.sales_quotation_no,
            scbill_no: scbill_no,
            gstNo: invoice_data.gstNo,
            bill_dt:
              invoice_data.invoice_dt != ""
                ? moment(
                    new Date(
                      moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
                    )
                  ).format("DD/MM/YYYY")
                : "",
            transaction_dt:
              invoice_data.invoice_dt != ""
                ? moment(
                    new Date(
                      moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
                    )
                  ).format("DD/MM/YYYY")
                : "",

            EditsupplierId: invoice_data.debtors_id,
            supplierCodeId: "",
            supplierNameId: "",
            salesAccId: invoice_data.sales_account_id
              ? getSelectValue(salesAccLst, invoice_data.sales_account_id)
              : "",
            // supplierCodeId: invoice_data.debtors_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.debtors_id)
            //   : "",
            // supplierNameId: invoice_data.debtors_id
            //   ? getSelectValue(supplierNameLst, invoice_data.debtors_id)
            //   : "",
            // supplierNameId: invoice_data.debtors_name,

            tcs: res.tcs ? res.tcs : 0,
            roundoff: invoice_data.roundoff != "" ? invoice_data.roundoff : 0,
            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",

            sales_discount: discountInPer > 0 ? discountInPer : "",
            sales_discount_amt: discountInAmt > 0 ? discountInAmt : "",
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

            tcs_mode: res.tcs_mode ? res.tcs_mode : "",
            tcs_per: res.tcs_per ? res.tcs_per : "",
            tcs_amt: res.tcs_amt ? res.tcs_amt : "",
          };
          //console.log("lstBrand", lstBrand);
          //console.log("initInvoiceData", initInvoiceData);

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

          if (
            initInvoiceData.hasOwnProperty("gstId") &&
            initInvoiceData.gstId != undefined
          ) {
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstId);
          } else {
            initInvoiceData["gstId"] = opt[0];
          }

          this.myRef.current.setFieldValue("gstId", opt[0]);
          // this.myRef.current.setFieldValue(
          //   "scbill_no",
          //   initInvoiceData.bill_no
          // );
          //console.log("initInvoiceData >>>>>", initInvoiceData);
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

              v["selectedProduct"] = "";
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
              v["rate"] = v.rate != "" ? v.rate : "";
              v["base_amt"] = v.base_amt != "" ? v.base_amt : "";
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : "";
              v["packing"] = v.pack_name != "" ? v.pack_name : "";
              v["dis_amt"] = v.dis_amt != "" ? v.dis_amt : "";
              v["dis_per"] = v.dis_per != "" ? v.dis_per : "";
              v["dis_per_cal"] = v.dis_per_cal != "" ? v.dis_per_cal : "";
              v["dis_amt_cal"] = v.dis_amt_cal != "" ? v.dis_amt_cal : "";
              v["total_amt"] = v.total_amt != "" ? v.total_amt : "";
              v["total_base_amt"] =
                v.total_base_amt != "" ? v.total_base_amt : "";
              v["gst"] = v.gst != "" ? v.gst : "";
              v["igst"] = v.igst != "" ? v.igst : "";
              v["cgst"] = v.cgst != "" ? v.cgst : "";
              v["sgst"] = v.sgst != "" ? v.sgst : "";
              v["total_igst"] = v.total_igst != "" ? v.total_igst : "";
              v["total_cgst"] = v.total_cgst != "" ? v.total_cgst : "";
              v["total_sgst"] = v.total_sgst > 0 ? v.total_sgst : "";
              v["final_amt"] = v.final_amt != "" ? v.final_amt : "";
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null && v.free_qty > 0
                  ? v.free_qty
                  : "";
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : "";
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : "";
              v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : "";
              v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : "";
              v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : "";
              v["invoice_dis_amt"] =
                v.invoice_dis_amt != "" ? v.invoice_dis_amt : "";
              v["net_amt"] = v.final_amt != "" ? v.final_amt : "";
              v["taxable_amt"] = v.total_amt != "" ? v.total_amt : "";

              v["final_discount_amt"] =
                v.final_discount_amt != "" ? v.final_discount_amt : "";
              v["discount_proportional_cal"] =
                v.discount_proportional_cal != ""
                  ? v.discount_proportional_cal
                  : "";
              v["additional_charges_proportional_cal"] =
                v.additional_charges_proportional_cal != ""
                  ? v.additional_charges_proportional_cal
                  : "";
              v["b_no"] = v.batch_no != "" ? v.batch_no : "";
              v["b_rate"] = v.b_rate != "" ? v.b_rate : "";
              v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : "";
              v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : "";
              v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : "";
              v["max_discount"] = v.max_discount != "" ? v.max_discount : "";
              v["min_discount"] = v.min_discount != "" ? v.min_discount : "";
              v["min_margin"] = v.min_margin != "" ? v.min_margin : "";
              v["manufacturing_date"] =
                v.manufacturing_date != "" ? v.manufacturing_date : "";
              v["b_purchase_rate"] =
                v.purchase_rate != "" ? v.purchase_rate : "";
              v["b_expiry"] = v.b_expiry != "" ? v.b_expiry : "";
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["is_batch"] = v.is_batch != undefined ? v.is_batch : false;

              return v;
            });
          }
          // console.warn("opt ", opt);

          //console.log("invoice_data", invoice_data);
          // console.warn("row---===>", initRowData);
          // debugger;
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              lstGst: opt,
              isLedgerSelectSet: true,
              isRowProductSet: true,
              isRoundOffCheck: true,
            },
            () => {
              setTimeout(() => {
                this.handleTranxCalculation();
                this.invoiceDateRef.current.focus();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error:>>>>", error);
      });
  };

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };

  get_sales_challan_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    //console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_sales_challan_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        //console.log("Supplier data-", res);
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
  lstSalesmanMaster = () => {
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.firstName + " " + v.lastName, value: v.id };
          });
          this.setState({ salesmanLst: opt }, () => {});
        }
      })
      .catch((error) => {});
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
    let {
      currentTab, //@prathmesh @batch info & product info tab
      updatedLedgerType,
      ledgerType,
      salesmanLst,
      batchHideShow,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      errorArrayBorder,
      selectSerialModal,
      serialNoLst,
      isRowProductSet,
      batch_data_selected,
      costingMdl,
      costingInitVal,
      gstId,
      isLedgerSelectSet,
      product_supplier_lst,
      product_supplier_unit,
      isBranch,
      add_button_flag,
      invoice_data,
      invoiceedit,
      salesAccLst,
      rows,
      productLst,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      batchModalShow,
      is_expired,
      b_details_id,
      batchInitVal,
      isBatch,
      batchData,
      tr_id,
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
      selectedLedgerNo,
      orglstAdditionalLedger,
      product_hover_details,
      transactionLedgerStyle,
      from_source,
      setProductRowIndex,
      productId,
      setProductId,
      opType, // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
      currentLedgerData,
      ledgerInputData,
      salesEditData,

      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      ledgerDataIndExp,
      selectedLedgerIndExp,
      additionalCharges,
      isAdditionalCharges,
      delAdditionalCahrgesLst,
      isRoundOffCheck,
      saleRateType,
    } = this.state;
    //console.log(rows);

    return (
      <>
        <div className="purchase-tranx">
          {/* <h6>Purchase Invoice</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={invoice_data}
            innerRef={this.myRef}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   // salesAccId: Yup.object().nullable().required("Required"),
            //   // supplierCodeId: Yup.object()
            //   //   .nullable()
            //   //   .required("select client code"),
            //   // supplierNameId: Yup.object()
            //   //   .nullable()
            //   //   .required("Client Name is Required"),
            //   transaction_dt: Yup.string().required("Challan Date is Required"),
            //   scbill_no: Yup.string().required("Challan No. is Required"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // ! Validation Start
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
              if (values.scbill_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              // ! Validation end
              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  // console.warn("rows->>>>>>>>>>>>>>", rows);
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
                        //console.log("values >>>", values);

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
                              let requestData = new FormData();
                              // !Invoice Data
                              if (
                                values.transaction_dt != "" &&
                                values.transaction_dt != null
                              ) {
                                requestData.append(
                                  "bill_dt",
                                  moment(
                                    values.transaction_dt,
                                    "DD/MM/YYYY"
                                  ).format("YYYY-MM-DD")
                                );
                              }
                              requestData.append("bill_no", values.scbill_no);
                              requestData.append(
                                "sales_acc_id",
                                values.salesAccId.value
                              );
                              requestData.append(
                                "sales_sr_no",
                                values.sc_sr_no
                              );
                              requestData.append(
                                "debtors_id",
                                values.selectedSupplier.id
                              );
                              requestData.append(
                                "gstNo",
                                values.gstId !== "" ? values.gstId.label : ""
                              );
                              // !Invoice Data
                              requestData.append("roundoff", values.roundoff);
                              requestData.append("narration", values.narration);
                              requestData.append(
                                "total_base_amt",
                                values.total_base_amt
                              );
                              requestData.append("totalamt", values.totalamt);
                              requestData.append(
                                "taxable_amount",
                                values.total_taxable_amt
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
                                values.totalqty && values.totalqty != ""
                                  ? values.totalqty
                                  : 0
                              );
                              requestData.append("tcs", values.tcs);
                              requestData.append(
                                "sales_discount",
                                values.sales_discount &&
                                  values.sales_discount != ""
                                  ? values.sales_discount
                                  : 0
                              );

                              requestData.append(
                                "sales_discount_amt",
                                values.sales_discount_amt &&
                                  values.sales_discount_amt != ""
                                  ? values.sales_discount_amt
                                  : 0
                              );
                              requestData.append(
                                "total_sales_discount_amt",
                                values.total_purchase_discount_amt &&
                                  values.total_purchase_discount_amt != ""
                                  ? values.total_purchase_discount_amt
                                  : 0
                              );

                              let frow = rows.map((v, i) => {
                                if (v.productId != "") {
                                  v.productId = v.productId ? v.productId : "";
                                  v.details_id = v.details_id
                                    ? v.details_id
                                    : "";
                                  v["unit_conv"] = v.unitId
                                    ? v.unitId.unitConversion
                                    : "";
                                  v["unitId"] = v.unitId ? v.unitId.value : "";
                                  v["levelaId"] = v.levelaId
                                    ? v.levelaId.value
                                    : "";
                                  v["levelbId"] = v.levelbId
                                    ? v.levelbId.value
                                    : "";
                                  v["levelcId"] = v.levelcId
                                    ? v.levelcId.value
                                    : "";

                                  v["is_multi_unit"] = v.is_multi_unit;
                                  v["rate"] = v.rate;
                                  v["dis_amt"] =
                                    v.dis_amt != "" ? v.dis_amt : 0;
                                  v["free_qty"] =
                                    v.free_qty != "" ? v.free_qty : 0;
                                  v["dis_per"] =
                                    v.dis_per != "" ? v.dis_per : 0;
                                  v["dis_per2"] =
                                    v.dis_per2 != "" ? v.dis_per2 : 0;
                                  v["rate_a"] = v.rate_a;
                                  v["rate_b"] = v.rate_b;
                                  v["rate_c"] = v.rate_c;
                                  v["margin_per"] = v.margin_per;
                                  v["min_margin"] = v.min_margin;
                                  v["b_details_id"] =
                                    v.b_details_id != "" ? v.b_details_id : 0;
                                  v["b_expiry"] =
                                    v.b_expiry !== ""
                                      ? moment(v.b_expiry).format("yyyy-MM-DD")
                                      : "";
                                  v["manufacturing_date"] =
                                    v.manufacturing_date !== ""
                                      ? moment(v.manufacturing_date).format(
                                          "yyyy-MM-DD"
                                        )
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
                              requestData.append(
                                "row",
                                JSON.stringify(filtered)
                              );

                              // console.log("additionalCharges", additionalCharges);
                              let filteradditionalCharges = additionalCharges.map(
                                (v) => {
                                  return {
                                    additional_charges_details_id:
                                      v.additional_charges_details_id,
                                    ledgerId: v.ledgerId.id,
                                    amt: v.amt,
                                  };
                                }
                              );

                              if (
                                filteradditionalCharges != "" &&
                                filteradditionalCharges
                              ) {
                                requestData.append(
                                  "additionalCharges",
                                  JSON.stringify(filteradditionalCharges)
                                );
                              }

                              requestData.append(
                                "additionalChargesTotal",
                                additionalChargesTotal
                              );
                              requestData.append("sale_type", "sales_invoice");

                              if (
                                values.additionalChgLedger1 !== "" &&
                                values.additionalChgLedgerAmt1 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger1",
                                  values.additionalChgLedger1 !== ""
                                    ? values.additionalChgLedger1.value
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt1",
                                  values.additionalChgLedgerAmt1 !== ""
                                    ? values.additionalChgLedgerAmt1
                                    : 0
                                );
                              }
                              if (
                                values.additionalChgLedger2 !== "" &&
                                values.additionalChgLedgerAmt2 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger2",
                                  values.additionalChgLedger2 !== ""
                                    ? values.additionalChgLedger2.value
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt2",
                                  values.additionalChgLedgerAmt2 !== ""
                                    ? values.additionalChgLedgerAmt2
                                    : 0
                                );
                              }
                              if (
                                values.additionalChgLedger3 !== "" &&
                                values.additionalChgLedgerAmt3 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger3",
                                  values.additionalChgLedger3 !== ""
                                    ? values.additionalChgLedger3.value
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt3",
                                  values.additionalChgLedgerAmt3 !== ""
                                    ? values.additionalChgLedgerAmt3
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
                                requestData.append(
                                  "taxCalculation",
                                  JSON.stringify(taxCal)
                                );
                              } else {
                                let taxCal = {
                                  cgst: this.state.taxcal.cgst,
                                  sgst: this.state.taxcal.sgst,
                                };
                                // //console.log("taxCal", taxCal);
                                requestData.append(
                                  "taxCalculation",
                                  JSON.stringify(taxCal)
                                );
                                requestData.append("taxFlag", true);
                              }
                              if (values.total_qty !== "") {
                                requestData.append(
                                  "total_qty",
                                  values.total_qty !== ""
                                    ? parseInt(values.total_qty)
                                    : 0
                                );
                              }
                              if (values.total_free_qty !== "") {
                                requestData.append(
                                  "total_free_qty",
                                  values.total_free_qty !== ""
                                    ? values.total_free_qty
                                    : 0
                                );
                              }

                              // !Total Qty*Rate
                              requestData.append(
                                "total_row_gross_amt",
                                values.total_row_gross_amt
                              );
                              requestData.append(
                                "total_base_amt",
                                values.total_base_amt
                              );
                              // !Discount
                              requestData.append(
                                "total_invoice_dis_amt",
                                values.total_invoice_dis_amt
                              );
                              // !Taxable Amount
                              requestData.append(
                                "taxable_amount",
                                values.total_taxable_amt
                              );
                              // !Taxable Amount
                              requestData.append(
                                "total_tax_amt",
                                values.total_tax_amt
                              );
                              // !Bill Amount
                              requestData.append(
                                "bill_amount",
                                values.bill_amount
                              );

                              let filterRowDetail = [];
                              if (rowDelDetailsIds.length > 0) {
                                filterRowDetail = rowDelDetailsIds.map((v) => {
                                  return { del_id: v };
                                });
                              }

                              let filterACRowDetail = [];
                              if (delAdditionalCahrgesLst.length > 0) {
                                filterACRowDetail = delAdditionalCahrgesLst.map(
                                  (v) => {
                                    return { del_id: v };
                                  }
                                );
                              }
                              requestData.append(
                                "rowDelDetailsIds",
                                JSON.stringify(filterRowDetail)
                              );
                              requestData.append(
                                "acDelDetailsIds",
                                JSON.stringify(filterACRowDetail)
                              );

                              let s_o_id = salesEditData.selectedBills.map(
                                (v) => {
                                  return { id: v };
                                }
                              );
                              requestData.append(
                                "reference_so_id",
                                JSON.stringify(s_o_id)
                              );
                              requestData.append("reference", "SLSORD");

                              createSalesChallan(requestData)
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

                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_challan_create",
                                      to: "tranx_sales_challan_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: { rowId: 0 },
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
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
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
                style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  {/* {JSON.stringify(errors)} */}
                  <div className="div-style">
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
                                  Challan Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (
                                      e.keyCode === 9 &&
                                      values.transaction_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <MyTextDatePicker
                                    // ref={this.dateRef}
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    autoFocus="true"
                                    //className="tnx-pur-inv-date-style "
                                    name="transaction_dt"
                                    id="transaction_dt"
                                    placeholder="DD/MM/YYYY"
                                    value={values.transaction_dt}
                                    onChange={handleChange}
                                    className={`${
                                      values.transaction_dt == "" &&
                                      errorArrayBorder[0] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode === 9) {
                                      } else if (e.keyCode === 9) {
                                        e.preventDefault();
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
                                            setFieldValue(
                                              "transaction_dt",
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
                                              "transaction_dt",
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
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.invoiceDateRef.current.focus();
                                            }, 1000);
                                            setFieldValue("transaction_dt", "");
                                          }
                                        } else {
                                          setFieldValue("transaction_dt", "");
                                        }
                                      } else if (e.keyCode === 13) {
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
                                            setFieldValue(
                                              "transaction_dt",
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
                                              "transaction_dt",
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
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.invoiceDateRef.current.focus();
                                            }, 1000);
                                            setFieldValue("transaction_dt", "");
                                          }
                                        } else {
                                          setFieldValue("transaction_dt", "");
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
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
                                className=" my-auto"
                              >
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <div className="d-flex w-100">
                                  <Form.Control
                                    ref={this.inputRef1}
                                    type="text"
                                    //className="tnx-pur-inv-text-box text-start"
                                    placeholder="Ledger Name"
                                    name="supplierNameId"
                                    id="supplierNameId"
                                    className={`${
                                      values.supplierNameId == "" &&
                                      errorArrayBorder[1] == "Y"
                                        ? "border border-danger tnx-pur-inv-text-box text-start"
                                        : "tnx-pur-inv-text-box text-start"
                                    }`}
                                    value={values.supplierNameId}
                                    readOnly={true}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode === 9) {
                                      } else if (e.keyCode === 9) {
                                        e.preventDefault();
                                        if (e.target.value.trim() !== "") {
                                          this.setErrorBorder(1, "");
                                          this.focusNextElement(e);
                                        } else {
                                          this.setErrorBorder(1, "Y");
                                        }
                                      } else if (e.keyCode === 13) {
                                        if (e.target.value.trim() !== "") {
                                          this.setErrorBorder(1, "");
                                          this.focusNextElement(e);
                                        } else {
                                          this.setErrorBorder(1, "Y");
                                        }
                                      }
                                    }}
                                  />
                                </div>
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
                                className="my-auto"
                              >
                                <Form.Label>Client GST</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      this.focusNextElement(e);
                                    } else if (e.keyCode === 13) {
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
                                    onChange={(v) => {
                                      setFieldValue("gstId", v);
                                    }}
                                    value={values.gstId}
                                  />
                                </Form.Group>
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
                                className="my-auto p-0"
                              >
                                <Form.Label>Sales A/C</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8} className="pe-0">
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      this.focusNextElement(e);
                                    } else if (e.keyCode === 13) {
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
                                className="my-auto"
                              >
                                <Form.Label>Challan Sr. No.</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Challan Sr"
                                  name="sc_sr_no"
                                  id="sc_sr_no"
                                  disabled
                                  onChange={handleChange}
                                  isClearable={false}
                                  value={values.sc_sr_no}
                                  isValid={touched.sc_sr_no && !errors.sc_sr_no}
                                  isInvalid={!!errors.sc_sr_no}
                                  readOnly={true}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sc_sr_no}
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
                                className="pe-0 my-auto"
                              >
                                <Form.Label>
                                  Challan No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Control
                                  //className="tnx-pur-inv-text-box"
                                  type="text"
                                  placeholder="Challan No."
                                  name="scbill_no"
                                  id="scbill_no"
                                  isClearable={true}
                                  onChange={handleChange}
                                  className={`${
                                    values.scbill_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  value={values.scbill_no}
                                  isValid={
                                    touched.scbill_no && !errors.scbill_no
                                  }
                                  isInvalid={!!errors.scbill_no}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode === 9) ||
                                      e.keyCode === 9 ||
                                      e.keyCode === 13
                                    ) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "scbill_no",
                                        e.target.value
                                      );
                                    }
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      if (e.target.value.trim() !== "") {
                                        this.setErrorBorder(2, "");
                                        this.focusNextElement(e);
                                      } else {
                                        this.setErrorBorder(2, "Y");
                                      }
                                    } else if (e.keyCode === 13) {
                                      if (e.target.value.trim() !== "") {
                                        this.setErrorBorder(2, "");
                                        this.focusNextElement(e);
                                      } else {
                                        this.setErrorBorder(2, "Y");
                                      }
                                    }
                                  }}
                                />
                              </Col>

                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className=" my-auto"
                              >
                                <Form.Label>Salesman</Form.Label>
                              </Col>

                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Select
                                  className="selectTo"
                                  // disabled={isInputDisabled}
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  options={salesmanLst}
                                  name="salesmanId"
                                  id="salesmanId"
                                  onChange={(v) => {
                                    setFieldValue("salesmanId", v);
                                  }}
                                  value={values.salesmanId}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      document
                                        .getElementById(
                                          "TSOTCProductId-particularsname-0"
                                        )
                                        .focus();
                                      this.setState({ currentTab: "second" });
                                    } else if (e.keyCode === 13) {
                                      document
                                        .getElementById(
                                          "TSOTCProductId-particularsname-0"
                                        )
                                        .focus();
                                      this.setState({ currentTab: "second" });
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>

                  <CmpTRow
                    qtyVerificationById={this.qtyVerificationById.bind(this)}
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
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    productId="TSOTCProductId-"
                    addBtnId="TSOTCAddBtn-"
                    getProductPackageLst={this.getProductPackageLst.bind(this)}
                    selectProductModal={selectProductModal}
                    selectedProduct={selectedProduct}
                    userControl={this.props.userControl}
                    from_source={from_source}
                    invoice_data={
                      this.myRef.current ? this.myRef.current.values : ""
                    }
                    setProductRowIndex={setProductRowIndex}
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
                    opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
                    conversionEditData={salesEditData}
                    saleRateType={saleRateType}
                    isConversion={true}
                  />

                  {/* <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">HSN:</span>
                          <span className="span-value">
                            {" "}
                            {product_hover_details.hsn}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">
                            {" "}
                            {product_hover_details.tax_type}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Batch Expiry:</span>
                          <span className="span-value">
                            {moment(product_hover_details.batch_expiry).format(
                              "DD-MM-YYYY"
                            ) === "Invalid date"
                              ? ""
                              : moment(
                                product_hover_details.batch_expiry
                              ).format("DD/MM/YYYY")}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {" "}
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
                            {" "}
                            {product_hover_details.barcode}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}
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
                        defaultActiveKey="first"
                        activeKey={currentTab}
                        // @prathmesh @batch info & product info tab active end
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
                                id="TSCTI_Ledger_Tab"
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
                                id="TSCTI_Product_Tab"
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
                                      .getElementById("TSCTI_Ledger_Tab")
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
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <Row className="mt-2">
                              <Col lg={9} className="pe-0">
                                <Row className="tnx-pur-inv-description-style">
                                  <Col
                                    lg={6}
                                    className="pe-"
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
                              <Col lg={3}>
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
                      <Row className="mt-2 p-2">
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
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box text-end"
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
                          <Form.Label>Dis. ₹</Form.Label>
                        </Col>
                        <Col lg={5} className="mt-2">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box text-end"
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
                      <Row>
                        <Row>
                          <Col lg={12} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="errormsg">{values.total_qty}</span>
                          </Col>
                        </Row>

                        <Row className="tMS">
                          <Col lg={6} className="for_remove_padding">
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
                        <Row className="mt-1">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0"
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) this.focusNextElement(e);
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

                          <Col lg={11}>
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
                    <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                      {/* {Json.stringify(showLedgerDiv)} */}
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
                                      /*  console.log(
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
                            <td
                              className="py-0 ps-1"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex mt-2">
                                <Form.Label className="my-auto lebleclass">
                                  Add.Charges
                                </Form.Label>
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
                                {/* </InputGroup> */}
                                <Button
                                  id="TPIEaddCharges"
                                  className="btn_img_style"
                                  onKeyDown={(e) => {
                                    // e.preventDefault();
                                    if (e.keyCode === 32) {
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
                                    } else if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
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

                                      // debugger;

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
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Add. amt"
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
                                value={
                                  additionalChargesTotal > 0
                                    ? additionalChargesTotal.toFixed(2)
                                    : ""
                                }
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                readOnly={
                                  parseInt(additionalChargesTotal) > 0
                                    ? false
                                    : true
                                }
                                style={{ marginLeft: "-10px", width: "110%" }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) this.focusNextElement(e);
                                }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-0 ps-1">
                              {/* @neha @Tcs Tds Radio button true false  */}
                              <Row>
                                <Col lg="8">
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
                                          onChange={handleChange}
                                          checked={
                                            this.state.tcs_mode === "tds"
                                          }
                                          // checked={
                                          //   values.tcs_mode === "tds"
                                          //     ? true
                                          //     : false
                                          // }
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
                                          onChange={handleChange}
                                          checked={
                                            this.state.tcs_mode === "tcs"
                                          }
                                          // checked={
                                          //   values.tcs_mode === "tcs"
                                          //     ? true
                                          //     : false
                                          // }
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
                            <td className="p-0 text-end ps-1">
                              <Row>
                                <Col lg="5" md="5" className="pe-0 ps-0">
                                  <InputGroup>
                                    <div className="d-flex">
                                      <Form.Control
                                        placeholder=""
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
                                          // console.log("name ", e.target);
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
                                        value={
                                          values.tcs_per > 0
                                            ? values.tcs_per
                                            : ""
                                        }
                                        onKeyPress={(e) => {
                                          OnlyEnterAmount(e);
                                        }}
                                        // readOnly={
                                        //   parseInt(values.tcs_per) > 0
                                        //     ? false
                                        //     : true
                                        // }
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13)
                                            if (
                                              e.target.name
                                                .trim()
                                                .toLowerCase() == "tcs_per"
                                            ) {
                                              //  setTimeout(() => {
                                              this.handleTranxCalculation(
                                                "tcs_per"
                                              );
                                              this.focusNextElement(e);
                                              // }, 100);
                                            }
                                        }}
                                      />
                                      <span className="my-auto">%</span>
                                    </div>
                                  </InputGroup>
                                </Col>
                                <Col lg="7" md="7" className="ps-0 pe-1">
                                  <InputGroup>
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
                                          // console.log("name ", e.target);
                                          if (
                                            e.target.name
                                              .trim()
                                              .toLowerCase() == "tcs_amt"
                                          ) {
                                            //  setTimeout(() => {
                                            this.handleTranxCalculation(
                                              "tcs_amt"
                                            );
                                            // }, 100);
                                          }
                                        }}
                                        value={
                                          values.tcs_amt > 0
                                            ? values.tcs_amt
                                            : ""
                                        }
                                        onKeyPress={(e) => {
                                          OnlyEnterAmount(e);
                                        }}
                                        // readOnly={
                                        //   parseInt(values.tcs_amt) > 0
                                        //     ? false
                                        //     : true
                                        // }
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13)
                                            if (
                                              e.target.name
                                                .trim()
                                                .toLowerCase() == "tcs_amt"
                                            ) {
                                              //  setTimeout(() => {
                                              this.handleTranxCalculation(
                                                "tcs_amt"
                                              );
                                              this.focusNextElement(e);
                                              // }, 100);
                                            }
                                        }}
                                      />
                                      <span className="my-auto">₹</span>
                                    </div>
                                  </InputGroup>
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
                              {INRformat.format(values.total_taxable_amt)}
                              {/* 99999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {INRformat.format(values.total_tax_amt)}
                              {/* 9999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Cess</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {/* 9999.99 */}
                              {INRformat.format(values.total_tax_amt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                disabled
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
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
                              {INRformat.format(values.bill_amount)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          id="TSOTC_submit_btn"
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
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_order_to_challan",
                                    to: "tranx_sales_order_list",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: salesEditData,
                                  });
                                },
                                handleFailFn: () => {
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_sales_challan_create"
                                  );
                                },
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
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_order_to_challan",
                                      to: "tranx_sales_order_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: salesEditData,
                                    });
                                  },
                                  handleFailFn: () => {
                                    eventBus.dispatch(
                                      "page_change",
                                      "tranx_sales_challan_create"
                                    );
                                  },
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
            tranxRef={this.myRef}
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerModal={ledgerModal}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            currentLedgerData={currentLedgerData}
            ledgerInputData={ledgerInputData}
            invoice_data={invoice_data}
            isLedgerSelectSet={isLedgerSelectSet}
            transactionLedgerStyle={transactionLedgerStyle}
            from_source={from_source}
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
            opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
            searchInputId="supplierNameId"
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
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
          /> */}
          {/* Product Modal Ends */}

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
          /> */}
          {/* Batch No Modal Ends */}

          {/* Serial No Modal Starts */}
          <MdlSerialNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            selectSerialModal={selectSerialModal}
            rows={rows}
            rowIndex={rowIndex}
            serialNoLst={serialNoLst}
          />
          {/* Serial No Modal Ends */}

          {/* IndirectExp Ledger Modal Starts */}
          <MdlLedgerIndirectExp
            ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
              this
            )}
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
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
            isAdditionalCharges={isAdditionalCharges}
            handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(
              this
            )}
            initAdditionalCharges={this.initAdditionalCharges.bind(this)}
          />

          {/* Costing  Modal Starts */}

          {/* <MdlCosting
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
          /> */}
          {/* Costing No Modal Ends */}
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

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxSalesOrderToChallan);
