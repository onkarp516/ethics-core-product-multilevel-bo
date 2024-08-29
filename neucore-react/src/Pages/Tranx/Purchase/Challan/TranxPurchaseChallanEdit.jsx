import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

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
import moment from "moment";

import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
import delete_icon2 from "@/assets/images/delete_icon2.png";
import add_icon from "@/assets/images/add_icon.svg";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
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
  getSelectValue,
  MyDatePicker,
  MyTextDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  TRAN_NO,
  purchaseSelect,
  fnTranxCalculation,
  isActionExist,
  getValue,
  calculatePercentage,
  isMultiDiscountExist,
  isFreeQtyExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  flavourDD,
  unitDD,
  allEqual,
  INRformat,
  isUserControlExist,
  OnlyEnterNumbers,
  OnlyEnterAmount,
} from "@/helpers";

import { setUserControl } from "@/redux/userControl/Action";

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
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getProduct,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPurchaseChallanbyId,
  getPurChallanProductFpuById,
  editPurchaseChallan,
  listTranxDebitesNotes,
  getProductFlavourList,
  get_Product_batch,
  getProductFlavorpackageUnitbyid,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  checkInvoiceDateIsBetweenFY,
  product_details_levelB,
  product_details_levelC,
  product_units,
  delete_ledger,
  delete_Product_list,
  transaction_ledger_list,
  transaction_product_list,
  transaction_ledger_details,
  transaction_product_details,
  transaction_batch_details,
  getChallanSupplierByProductId,
  get_supplierlist_by_productid,
  getLastPurchaseInvoiceNo,
  getValidatePurChallanUpdate,
} from "@/services/api_functions";

const particularsDD = {
  control: (base, state) => ({
    ...base,
    borderRadius: "none",
    marginTop: 0,
    height: 32,
    minHeight: 32,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "12px",
    width: 700,
    color: "#000000",
    background: "transparent",

    "&:hover": {
      background: "transparent",
      border: "1px solid #dcdcdc !important",
    },
    "&:focus": {
      width: 680,
    },
    border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
  }),
  dropdownIndicator: (base) => ({
    color: " #ADADAD",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "12px",
  }),
};

class TranxPurchaseChallanEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();
    this.inputRef1 = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below

    this.SelecteRefGSTIN = React.createRef();

    this.state = {
      additionalDelDetailsIds: [],
      currentTab: "second", //@prathmesh @batch info & product info tab active
      isTextBox: false,
      sourceUnder: "purchase",
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      errorArrayBorder: "",
      selectedSupplier: "",
      add_button_flag: true,
      currentDate: new Date(),
      productSupplierLst: [],
      show: false,
      // invoice_data: "",
      ledgerType: "SC",
      updatedLedgerType: "SC",
      currentLedgerData: "",
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      selectedPendingOrder: [],
      selectedPendingChallan: [],
      invoiceedit: false,
      productLst: [],
      productData: "",
      unitLst: [],
      rows: [],
      costingMdl: false,
      unitLst: [],
      batch_data_selected: "",
      billLst: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      purchaseEditData: "",
      isEditDataSet: false,
      isBranch: false,
      lstBrand: [],
      transaction_mdl_show: false,
      adjustbillshow: false,
      transaction_detail_index: 0,
      opendiv: false,
      hidediv: true,
      rowDelDetailsIds: [],
      isAllCheckeddebit: false,
      selectedBillsdebit: [],
      isBatchNo: "",
      batchModalShow: false,
      batchData: "",
      batchInitVal: "",
      b_details_id: 0,
      isBatch: false,
      tr_id: "",
      fetchBatch: [],
      selectSerialModal: false,
      serialNoLst: [],
      lstFlavours: [],
      flavour_index: 0,
      productIds: [],
      b_details_id: 0,
      isLedgerSelectSet: false,
      isRowProductSet: false,
      isRoundOffCheck: false,

      invoice_data: {
        filterListSales: "SC",
        pi_sr_no: "",
        pi_no: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
        gstNo: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
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
        additionalCharges: "",

        total_qty: 0,
        total_free_qty: 0,
        bill_amount: 0,
        total_row_gross_amt1: 0,
      },
      ledgerId: "",
      setLedgerId: false,
      from_source: "tranx_purchase_challan_edit",
      ledgerInputData: "",
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      lstGst: [],
      delAdditionalCahrgesLst: [],
      additionalCharges: "",

      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      newBatchModal: false,
      newBatchSelectModal: false,
      newSerialModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      selectedLedgerIndExp: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      selectedLedgerNo: 1,
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      batchHideShow: false,
      transactionType: "purchase_edit",
      ledgerList: [],
      orgLedgerList: [],

      ledgerNameFlag: false, // ! for focus
    };
  }
  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
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

      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
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

  validatePurchaseRate = (mrp = 0, p_rate = 0) => {
    console.log("MRP ::", mrp);
    console.log("Purchase rate ::", p_rate);
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
            //console.log("sid:: lstPurchaseAccounts", { v }, v[0]);

            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null)
              this.myRef.current.setFieldValue("purchaseId", v[0]);
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
            //this.myRef.current.setFieldValue("purchaseId", v[0]);
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

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
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
      .catch((error) => { });
  };

  handleResetForm = () => {
    this.handleclientinfo(true);
  };

  ledgerCreate = () => {
    // eventBus.dispatch("page_change", "ledgercreate");
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_invoice_edit",
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
      from: "tranx_purchase_invoice_edit",
      to: "newproductcreate",
      isNewTab: true,
      prop_data: { tran_no: TRAN_NO.prd_tranx_purchase_invoice_edit },
    });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    console.log("handleRowStateChange>>>", rowValue);
    this.setState({ rows: rowValue }, () => {
      this.setState({ rowIndex: rowIndex }, () => {
        this.getProductBatchList(rowIndex);
      });

      this.handleTranxCalculation();
    });
  };

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TPCEProductId-particularsname-" + id).focus();
      }, 1000);
      this.handleTranxCalculation();
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    console.log("findProductPackges >>>>>>>>>>>>>", findProductPackges);
    if (findProductPackges) {
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
          // debugger;
          let responseData = response.data;
          if (responseData.responseStatus == 200) {
            let levelData = responseData.responseObject;
            let data = responseData.responseObject.lst_packages;

            let levelAOpt = data.map((v) => {
              let levelBOpt = v.levelBOpts.map((gv) => {
                let levelCOpt = gv.levelCOpts.map((vc) => {
                  let unitOpt = vc.unitOpts.map((vi) => {
                    return {
                      label: vi.label,
                      value: vi.value,
                      ...vi,
                    };
                  });
                  return {
                    label: vc.label != "" ? vc.label : "",
                    value: vc.value != "" ? vc.value : "",
                    unitOpt: unitOpt,
                  };
                });
                return {
                  // ...v,
                  label: gv.label != "" ? gv.label : "",
                  value: gv.value != "" ? gv.value : "",
                  levelCOpt: levelCOpt,
                };
              });
              return {
                // ...v,
                label: v.label != "" ? v.label : "",
                value: v.value != "" ? v.value : "",
                levelBOpt: levelBOpt,
              };
            });
            let fPackageLst = [
              ...lstBrand,
              {
                product_id: product_id,
                value: product_id,
                levelAOpt: levelAOpt,
              },
            ];
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              console.log("findProductPackges =-> ", findProductPackges);
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
              console.log("rows <<<<<<<<<<<<< ", rows);
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

  batchModalShow = (status) => {
    this.setState({ batchModalShow: status });
  };
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };

  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges, delAdditionalCahrgesLst } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;
        if (value == undefined || value == null) {
          v["amt"] = "";

          let details_id = v["additional_charges_details_id"];
          if (details_id !== 0) {
            if (!delAdditionalCahrgesLst.includes(details_id)) {
              delAdditionalCahrgesLst.push(details_id);
            }
          }
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

  handleTranxCalculation = (elementFrom = "", isCal = false) => {
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
    });
    // console.log({ resTranxFn });
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
    console.log("roffamt", roffamt);
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

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.state;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };
  handleUnitChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    if (value == "" && ele == "qty") {
      value = 0;
    }
    //console.log("ele->", ele, parseFloat(value));

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        //  is_timeout: true,
        //  delay: 1000,
        is_button_show: true,
      });

      // this.myRef.current.setFieldValue("dis_per", 0);
      rows[rowIndex][ele] = 0;
    } else {
      rows[rowIndex][ele] = value;
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

  getProductBatchList = (rowIndex = -1, source = "batch") => {
    const { rows, invoice_data, lstBrand } = this.state;

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
          //console.log("get_Product_batch =>", response);
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

  // handleFetchData = (sundry_creditor_id) => {
  //   const { billLst } = this.state;
  //   let reqData = new FormData();

  //   reqData.append("sundry_creditor_id", sundry_creditor_id);
  //   listTranxDebitesNotes(reqData)
  //     .then((response) => {
  //       let res = response.data;
  //       let data = res.list;
  //       if (data.length == 0) {
  //         this.callCreateInvoice();
  //       } else if (data.length > 0) {
  //         this.setState({ billLst: data }, () => {
  //           if (data.length > 0) {
  //             this.setState({ adjustbillshow: true });
  //           }
  //         });
  //       }
  //     })
  //     .catch((error) => {});
  // };

  setPurchaseInvoiceEditData = () => {
    const { id } = this.state.purchaseEditData;
    let formData = new FormData();
    formData.append("id", id);
    getPurchaseChallanbyId(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, additional_charges, narration } = res;
          // console.log("invoice_data--->", invoice_data);
          console.log("response row--->", row);
          console.log("response res--->", res);

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

          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();
          let opt = [];
          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
            additionLedgerAmt1 = res.additionLedgerAmt1;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt1);
          }
          if (res.additionLedger2 > 0) {
            additionLedger2 = res.additionLedger2 ? res.additionLedger2 : "";
            additionLedgerAmt2 = res.additionLedgerAmt2;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt2);
          }
          if (res.additionLedger3 > 0) {
            additionLedger3 = res.additionLedger3 ? res.additionLedger3 : "";
            additionLedgerAmt3 = res.additionLedgerAmt3;
          }

          let initInvoiceData = {
            id: invoice_data.id,
            pi_sr_no: invoice_data.purchase_sr_no,

            pi_transaction_dt:
              invoice_data.transaction_dt != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
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
            // supplierCodeId: invoice_data.supplierId
            //   ? getSelectValue(supplierCodeLst, invoice_data.supplierId)
            //   : "",
            // supplierNameId: invoice_data.supplierId
            //   ? getSelectValue(supplierNameLst, invoice_data.supplierId)[
            //   "label"
            //   ]
            //   : "",
            EditsupplierId: invoice_data.supplierId,
            supplierCodeId: "",
            supplierNameId: "",
            roundoff: invoice_data.roundoff,
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
            filterListSales: "SC",
          };
          // console.log("initInvoiceData >>>>>>>>><<<<", initInvoiceData);

          if (
            initInvoiceData.supplierCodeId &&
            initInvoiceData.supplierCodeId != ""
          ) {
            opt = initInvoiceData.supplierCodeId.gstDetails.map((v, i) => {
              return {
                label: v.gstNo,
                value: v.id,
              };
            });
          }

          console.log("Rowsssss------->", row);
          let initRowData = [];
          if (row.length > 0) {
            initRowData = row.map((v, i) => {
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              // console.log("productOpt ", productOpt);
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
              v["gross_amt1"] = v.grossAmt1 != "" ? v.grossAmt1 : 0;
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

          console.log("initRowData", initRowData);

          if (initInvoiceData.gstNo != "")
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;

          // console.log("initRowData", initRowData, initInvoiceData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              isLedgerSelectSet: true,
              isRoundOffCheck: res.invoice_data.isRoundOffCheck,
              add_button_flag: true,
            },
            () => {
              setTimeout(() => {
                if (res.invoice_data.roundoff == 0) {
                  this.setState({ isRoundOffCheck: false }, () => {
                    this.handleTranxCalculation("roundoff", !false);
                  });
                } else {
                  this.setState({ isRoundOffCheck: true }, () => {
                    this.handleTranxCalculation("roundoff", !true);
                  });
                }
              }, 50);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error _______________________ ", error);
      });
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
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;
      });

      console.log("fBills", fBills);
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

  callCreateInvoice = () => {
    // debugger;
    const {
      invoice_data,
      additionalChargesTotal,
      rows,
      rowDelDetailsIds,
      delAdditionalCahrgesLst,
      isRoundOffCheck,
      additionalCharges,
    } = this.state;

    let invoiceValues = this.myRef.current.values;
    // console.log("invoiceValues", invoiceValues);
    // console.log("invoice_data", invoice_data);
    // console.log("this.state", this.state);

    let requestData = new FormData();
    // !Invoice Data
    requestData.append("id", invoice_data.id);
    requestData.append(
      "invoice_date",
      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("newReference", false);
    requestData.append("invoice_no", invoiceValues.pi_no);
    requestData.append("purchase_id", invoice_data.purchaseId.value);
    requestData.append("purchase_sr_no", invoiceValues.pi_sr_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.pi_transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("supplier_code_id", invoice_data.selectedSupplier.id);
    // !Invoice Data
    requestData.append("isRoundOffCheck", isRoundOffCheck);

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
      invoice_data.gstNo !== "" ? invoice_data.gstNo : ""
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
        v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
        v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
        v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
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
    // console.log("filtered", filtered);
    let filteradditionalCharges = additionalCharges.map((v) => {
      return {
        ledgerId: v.ledgerId.id,
        amt: v.amt,
      };
    });
    requestData.append("row", JSON.stringify(filtered));

    requestData.append("additionalChargesTotal", additionalChargesTotal);
    console.log("additionalChargesTotal", additionalChargesTotal);

    requestData.append(
      "additionalCharges",
      JSON.stringify(filteradditionalCharges)
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
    console.log({ rowDelDetailsIds });
    let filterRowDetail = [];
    if (rowDelDetailsIds.length > 0) {
      filterRowDetail = rowDelDetailsIds.map((v) => {
        return { del_id: v };
      });
    }

    let filterACRowDetail = [];
    if (delAdditionalCahrgesLst.length > 0) {
      filterACRowDetail = delAdditionalCahrgesLst.map((v) => {
        return { del_id: v };
      });
    }
    console.log("filterACRowDetail", filterACRowDetail);
    console.log("filterRowDetail", filterRowDetail);
    console.log("frow", frow);
    requestData.append("rowDelDetailsIds", JSON.stringify(filterRowDetail));
    requestData.append("acDelDetailsIds", JSON.stringify(filterACRowDetail));

    for (const pair of requestData.entries()) {
      console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    }

    editPurchaseChallan(requestData)
      .then((response) => {
        let res = response.data;
        console.log("api res", res);
        if (res.responseStatus === 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 600,
          });
          // resetForm();
          this.initRow();
          console.log("Source", this.state.source);
          if ("ledgerId" in this.state.source != "") {
            eventBus.dispatch("page_change", {
              from: "tranx_purchase_challan_edit",
              to: "ledgerdetails",
              prop_data: this.state.source["ledgerId"],

              isNewTab: false,
            });
            // this.setState({ source: "" });
          } else {
            // eventBus.dispatch("page_change", "tranx_purchase_challan_list");
            eventBus.dispatch("page_change", {
              from: "tranx_purchase_challan_edit",
              to: "tranx_purchase_challan_list",
              prop_data: {
                editId: this.state.purchaseEditData.id,
                rowId: this.props.block.prop_data.rowId,
              },
              isNewTab: false,
              isCancel: true,
            });
          }
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
  // handlePropsData = (prop_data) => {
  //   if (prop_data.invoice_data) {
  //     this.setState(
  //       {
  //         invoice_data: prop_data.invoice_data,
  //         rows: prop_data.rows,
  //         additionalCharges: prop_data.additionalCharges,
  //         ledgerId: prop_data.ledgerId,
  //         productId: prop_data.productId,
  //       },
  //       () => {
  //         this.setState(
  //           {
  //             ledgerId: prop_data.ledgerId,
  //             setLedgerId: true,
  //             productId: prop_data.productId,
  //             setProductId: true,
  //             setProductRowIndex: prop_data.rowIndex,
  //           },
  //           () => {
  //             setTimeout(() => {
  //               this.inputLedgerNameRef.current.focus();
  //             }, 1500);
  //           }
  //         );
  //       }
  //     );
  //   } else {
  //     // this.setState({ invoice_data: prop_data });
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
                      "TPCEProductId-particularsname-" + prop_data.rowIndex
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

  handleScroll = (e) => {
    e.preventDefault();
    let { rows } = this.state;
    if (rows.length <= 10) {
      this.initRow(rows.length + 10);
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
  //       //console.log("res", response);
  //       let res = response.data;
  //       if (res.responseStatus != 200) {
  //         MyNotifications.fire(
  //           {
  //             show: true,
  //             icon: "error",
  //             title: "Invoice date not valid as per FY",
  //             msg: "Do you want continue with invoice date",
  //             is_button_show: true,
  //             is_timeout: false,
  //             delay: 0,
  //             handleSuccessFn: () => {},
  //             handleFailFn: () => {
  //               setFieldValue("invoice_dt", "");
  //               eventBus.dispatch("page_change", "tranx_purchase_invoice_edit");
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
            () => { }
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
        //         if (enteredDate != "") {
        //           setTimeout(() => {
        //             this.inputRef1.current.focus();
        //           }, 500);
        //         }
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
        //         if (enteredDate != "") {
        //           setTimeout(() => {
        //             this.inputRef1.current.focus();
        //           }, 500);
        //         }
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

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    // console.log("rows[rowIndex][parent]")
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
  };

  getLevelbOpt = (rowIndex, product_id, levelaId) => {
    console.log({ rowIndex, product_id, levelaId });
    let { rows } = this.state;
    rows[rowIndex]["levelaId"] = levelaId;
    let formData = new FormData();
    formData.append("level_a_id", levelaId.value);
    formData.append("product_id", product_id);
    product_details_levelB(formData).then((response) => {
      // console.log("response", response);
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
      console.log({ rows });
      this.setState({ rows: rows }, () => {
        this.product_unitsFun(rowIndex, product_id, levelaId);
      });
    });
  };

  getLevelcOpt = (rowIndex, product_id, levelaId, levelbId) => {
    console.log({ rowIndex, product_id, levelaId, levelbId });

    let { rows } = this.state;
    rows[rowIndex]["levelbId"] = levelbId;

    let formData = new FormData();
    formData.append("level_a_id", levelaId.value);
    formData.append("level_b_id", levelbId.value);
    formData.append("product_id", product_id);
    product_details_levelC(formData).then((response) => {
      // console.log("response", response);
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
      console.log({ rows });
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
    console.log({ rowIndex, product_id, levelaId, levelbId, levelcId });
    let { rows } = this.state;

    let formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("level_a_id", levelaId.value);
    formData.append("level_b_id", levelbId != null ? levelbId.value : levelbId);
    formData.append("level_c_id", levelcId != null ? levelcId.value : levelcId);
    product_units(formData).then((response) => {
      console.log("response", response);
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
      console.log({ rows });
      this.setState({ rows: rows });
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
          let { ledgerModalStateChange } = this.props;
          ledgerModalStateChange("ledgerData", res.result);
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
    requestData.append("batchNo", batchNo.batch_no);
    requestData.append("id", batchNo.b_details_id);
    // requestData.append("id", batchNo.id);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
            filterbatchDetails: res.response,
          });
        }
      })
      .catch((error) => { });
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
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getPurChallanProductFpuById(reqData)
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
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => { });
      });
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_challan_create",
      to: "tranx_purchase_challan_list",
    });
  };

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
      len = 5
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
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      this.setLastPurchaseSerialNo();
      // this.lstSundryCreditors();
      // this.transaction_product_listFun();
      this.transaction_ledger_listFun();
      this.lstAdditionalLedgers();
      this.initRow();
      // this.get_transaction_ledger_listFun();
      this.initAdditionalCharges();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      const { prop_data } = this.props.block;
      //console.warn("rahul::prop_data", prop_data);
      this.setState(
        { source: prop_data, purchaseEditData: prop_data.prop_data },
        () => {
          //console.log("source", this.state.source);
          if (prop_data.prop_data.id) {
            this.getProductFlavorpackageUnitbyids(prop_data.prop_data.id);
          }

          // this.handlePropsData(prop_data.prop_data);
          this.handlePropsData(prop_data);
        }
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
  // alt key button disabled start
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };

  // alt key button disabled end

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

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
      //supplierNameLst,
      // supplierCodeLst,
      //productLst,
      lstAdditionalLedger,
      isEditDataSet,
      purchaseEditData,
      lstDisLedger,
      lstBrand,
    } = this.state;
    //console.warn("rahul::componentDidUpdate", {
    //purchaseAccLst,
    //supplierNameLst,
    //supplierCodeLst,
    //productLst,
    // lstAdditionalLedger,
    //isEditDataSet,
    //purchaseEditData,
    //lstBrand,
    //});
    if (
      purchaseAccLst.length > 0 &&
      // supplierNameLst.length > 0 &&
      // supplierCodeLst.length > 0 &&
      lstBrand.length > 0 &&
      //productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseEditData != ""
    ) {
      //console.warn("rahul::setPurchaseInvoiceEditData");
      this.setPurchaseInvoiceEditData();
    } else {
      // MyNotifications.fire({
      //   show: true,
      //   icon: "error",
      //   title: "Error",
      //   msg: "Data Inconsistencey, Please check data",
      //   is_timeout: true,
      //   delay: 3000,
      //   is_button_show: true,
      // });
    }
  }

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
      Math.abs(parseFloat(roffamt).toFixed(2))
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
      Math.abs(parseFloat(roffamt).toFixed(2))
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
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
  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
  };
  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  NewBatchSelectModalFun = (status) => {
    this.setState({ newBatchSelectModal: status });
  };
  NewSerialModalFun = (status) => {
    this.setState({ newSerialModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  // getChallanSupplierByProductIdFun = (product_id = 0) => {
  //   let requestData = new FormData();
  //   requestData.append("productId", product_id);
  //   getChallanSupplierByProductId(requestData)
  //     .then((response) => {
  //       let res = response.data;
  //       let onlyfive = [];
  //       console.log("res challan : ", res);
  //       if (res.responseStatus == 200) {
  //         let idc = res.data;

  //         // onlyfive = idc.filter((e) => {
  //         //   return null;
  //         if (idc.length <= 10) {
  //           for (let i = 0; i < idc.length; i++) {
  //             onlyfive.push(idc[i]);
  //           }
  //           console.log("lessthan equal to five", onlyfive);
  //         } else {
  //           var count = 1;
  //           onlyfive = idc.filter((e) => {
  //             if (count <= 10) {
  //               count++;
  //               return e;
  //             }
  //             return null;
  //           });
  //           console.log("greater than five", onlyfive);
  //         }
  //         this.setState({
  //           productSupplierLst: onlyfive,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ productSupplierLst: [] });
  //     });
  // };

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("productId", product_id);
    get_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        console.log("res challan : ", res);
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
            productSupplierLst: onlyfive,
          });
        }
      })
      .catch((error) => {
        this.setState({ productSupplierLst: [] });
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
  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputLedgerNameRef.current.focus();
        if (this.state.ledgerNameFlag)
          if (this.state.lstGst.length > 1) {
            this.SelecteRefGSTIN.current.focus();
          } else {
            document.getElementById("pi_no").focus();
          }
        else document.getElementById("pi_transaction_dt").focus();
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

    if (currentLedgerData != "" && currentLedgerData != undefined) {
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

      const index = filterData.findIndex((object) => {
        return object.id === currentLedgerData.id;
      });
      if (index >= 0) {
        setTimeout(() => {
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

  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      console.log("callTrxCal0", callTrxCal);
      if (callTrxCal) {
        console.log("obj", obj);
        console.log("callTrxCal1", callTrxCal);
        this.handleTranxCalculation();
      }
    });
    if (obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TPCEAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TPCEAddBtn-" + id).focus();
        }, 250);
      }
    }

    if (obj.isProduct == "productMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TPCEProductId-particularsname-" + obj.rowIndex)
        //   .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.isBatchMdl == "batchMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TPCEProductId-batchNo-" + obj.rowIndex)
        //   .focus();
      }, 250);
    }
  };

  openSerialNo = (rowIndex) => {
    // console.log("rowIndex", rowIndex);
    let { rows } = this.state;
    console.log("rows", rows);

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
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data } = this.state;
          invoice_data["pi_sr_no"] = res.count;

          this.setState({ invoice_data: invoice_data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  validatePurchaseInvoice = (invoice_no, supplier_id, purchaseEditData) => {
    console.log("Invoice Input", invoice_no, supplier_id);
    let reqData = new FormData();
    reqData.append("supplier_id", supplier_id);
    reqData.append("bill_no", invoice_no);
    reqData.append("challan_id", purchaseEditData);
    getValidatePurChallanUpdate(reqData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,

            // is_timeout: true,
            // delay: 1000,
          });
          //this.reloadPage();
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
          if (opt.length > 0 && ledgerData) {
            this.myRef.current.setFieldValue(
              "gstId",
              getSelectValue(opt, ledgerData[0].gstDetails[0].id)
            );
          }
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
          },
          handleFailFn: () => { },
        },
        () => {
          console.warn("return_data");
        }
      );
      document.getElementById("supplierNameId").focus();
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("supplierNameId", "");
      }
      // this.ledgerModalStateChange("ledgerModal", true);
      // alert("invalid ledger code");
    }
  }

  handleRoundOffCheck = (value) => {
    this.setState({ isRoundOffCheck: value }, () => {
      this.handleTranxCalculation("roundoff", !value);
    });
  };
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
  handleRemoveAddtionalChargesRow = (rowIndex = -1) => {
    let { additionalCharges, additionalDelDetailsIds } = this.state;

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
  render() {
    let {
      currentTab, //@prathmesh @batch info & product info tab
      isTextBox,
      sourceUnder,
      errorArrayBorder,
      add_button_flag,
      batch_data_selected,
      productSupplierLst,
      serialNoLst,
      costingInitVal,
      invoice_data,
      invoiceedit,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      costingMdl,
      productLst,
      delAdditionalCahrgesLst,
      isBranch,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      rowDelDetailsIds,
      lstBrand,
      adjustbillshow,
      billLst,
      isAllCheckeddebit,
      selectedBillsdebit,
      batchModalShow,
      batchInitVal,
      batchData,
      b_details_id,
      isBatch,
      is_expired,
      tr_id,
      lstGst,
      ledgerModal,
      ledgerNameModal,
      newBatchModal,
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      newBatchSelectModal,
      newSerialModal,
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
      selectSerialModal,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      isLedgerSelectSet,
      isRowProductSet,
      batchHideShow,
      transactionType,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      purchaseEditData,
      ledgerId,
      setLedgerId,
      from_source,
      productId,
      setProductId,
      setProductRowIndex,
      isRoundOffCheck,
      ledgerInputData,
      gstId,
      opType, // @vinit@Passing as prop in CmpTRow  and MDLLedger for Focusing previous Tab
      ledgerType,
      updatedLedgerType,
      currentLedgerData,
    } = this.state;
    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active

    return (
      <>
        <div className="purchaseinvoice" style={{ overflow: "hidden" }}>
          {/* <h6>Purchase Invoice</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   gstId: Yup.object().nullable().required("GST No is required"),
            //   pi_invoice_dt: Yup.string().required("Invoice Date is Required"),
            //   // supplierCodeId: Yup.object()
            //   // .nullable()
            //   // .required("Supplier Code is Required"),
            //   purchaseId: Yup.object()
            //     .nullable()
            //     .required("Purchase Account is Required"),
            //   supplierNameId: Yup.string()
            //     .trim()
            //     .required("Supplier Name is Required"),
            //   pi_no: Yup.string().required("Invoice No is Required"),
            // })}
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
              //! validation required end
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
                        console.log("values", values);
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
                              console.log("on Submit values", values);

                              this.setState({
                                invoice_data: values,
                              });
                              let { selectedSupplier } = values;
                              console.log("supplierCodeId", selectedSupplier);
                              if (selectedSupplier) {
                                //  this.handleFetchData(supplierCodeId.value);
                                this.callCreateInvoice();
                              }
                            },
                            handleFailFn: () => { },
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
                                  autoFocus={true}
                                  className="tnx-pur-inv-date-style"
                                  name="pi_transaction_dt"
                                  id="pi_transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.pi_transaction_dt}
                                  onChange={handleChange}
                                  readOnly={true}
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
                                  // type="button"
                                  type="text"
                                  // className="tnx-pur-inv-text-box text-start"
                                  placeholder="Ledger Code"
                                  name="supplierCodeId"
                                  id="supplierCodeId"
                                  // disabled={
                                  //   values.pi_transaction_dt !== ""
                                  //     ? false
                                  //     : true
                                  // }
                                  onChange={handleChange}
                                  className="tnx-pur-inv-text-box"
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
                                  //     : ""
                                  // }
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
                                  //  onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  // }} 
                                  value={values.supplierCodeId}
                                  // readOnly={true}
                                />
                               
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
                                className="pe-0 paddingLeft"
                              >
                                <Form.Label>
                                  Ledger Name{" "}
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
                                  disabled={
                                    values.pi_transaction_dt !== ""
                                      ? false
                                      : true
                                  }
                                  // onChange={handleChange}
                                  onMouseOver={(e) => {
                                    e.preventDefault();

                                    if (
                                      values.selectedSupplier != "" &&
                                      values.selectedSupplier != null &&
                                      values.selectedSupplier != undefined
                                    ) {
                                      this.ledgerModalStateChange(
                                        "selectedLedger",
                                        values.selectedSupplier
                                      );
                                      this.transaction_ledger_detailsFun(
                                        values.selectedSupplier.id
                                      );
                                    }
                                  }}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    this.setState({ currentTab: "first" });
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();

                                    this.setledgerInputData(
                                      e.target.value,
                                      true
                                    );
                                    this.setState({ ledgerNameFlag: true });
                                  }}
                                  className={`${values.supplierNameId == "" &&
                                    errorArrayBorder[1] == "Y"
                                    ? "border border-danger tnx-pur-inv-text-box text-start "
                                    : "tnx-pur-inv-text-box text-start"
                                    }`}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  //   console.log(
                                  //     "ledgerInputData---",
                                  //     e.target.value
                                  //   );
                                  //   this.setState({
                                  //     ledgerInputData: e.target.value.toLowerCase(),
                                  //   });
                                  //   // this.filterData(e.target.value);
                                  // }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value) {
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
                                    // if (values.supplierNameId) {
                                    //   this.setErrorBorder(1, "");
                                    // } else {

                                    // document.getElementById("supplierNameId").focus()
                                    // }
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    if (values.selectedSupplier != "") {
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
                                      this.setState({ currentLedgerData: "" });
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    }
                                    this.setState({
                                      currentTab: "first",
                                      ledgerNameFlag: true,
                                    }); //@prathmesh @batch info & product info tab active
                                  }}
                                  value={values.supplierNameId}
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
                                          this.ledgerFilterData();
                                        }
                                      );
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                      e.preventDefault();
                                    } else if (e.key === "Alt") {
                                      e.preventDefault();
                                    } else if (e.keyCode == 40) {
                                      if (ledgerModal == true)
                                        document
                                          .getElementById("LedgerMdlTr_0")
                                          .focus();
                                    }
                                  }}
                                // readOnly
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span> */}
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
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Label>Purchase Serial</Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Purchase sr No. "
                                  name="pi_sr_no"
                                  id="pi_sr_no"
                                  onChange={handleChange}
                                  value={values.pi_sr_no}
                                  isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  isInvalid={!!errors.pi_sr_no}
                                  isClearable={false}
                                  disabled
                                  readOnly
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
                              <Col lg={5} md={5} sm={5} xs={5} className="pe-0">
                                <Form.Label>
                                  Challan No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  placeholder="Challan No.."
                                  name="pi_no"
                                  id="pi_no"
                                  // className="text-box"
                                  onChange={handleChange}
                                  value={values.pi_no}
                                  isValid={touched.pi_no && !errors.pi_no}
                                  isInvalid={!!errors.pi_no}
                                  className={`${values.pi_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                    ? "border border-danger tnx-pur-inv-text-box "
                                    : "tnx-pur-inv-text-box"
                                    }`}
                                  /*  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
                                  onBlur={(e) => {
                                    e.preventDefault();

                                    this.validatePurchaseInvoice(
                                      values.pi_no,
                                      values.selectedSupplier.id,
                                      purchaseEditData.id
                                    );
                                    e.preventDefault();
                                    if (values.pi_no) {
                                      this.setErrorBorder(2, "");
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      // document.getElementById("pi_no").focus()
                                    }
                                    // alert("On Blur Call");
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                    else if (
                                      e.keyCode == 13 &&
                                      e.target.value.trim() != ""
                                    ) {
                                      this.validatePurchaseInvoice(
                                        values.pi_no,
                                        values.selectedSupplier.id,
                                        purchaseEditData.id
                                      );
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.pi_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>
                                  Challan Date{" "}
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
                                    // className="tnx-pur-inv-text-box"
                                    name="pi_invoice_dt"
                                    id="pi_invoice_dt"
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    value={values.pi_invoice_dt}
                                    onChange={handleChange}
                                    className={`${errorArrayBorder[3] == "Y"
                                      ? "border border-danger tnx-pur-inv-date-style "
                                      : "tnx-pur-inv-date-style"
                                      }`}
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
                                    //     e.preventDefault();

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
                                    //           setFieldValue(
                                    //             "pi_invoice_dt",
                                    //             ""
                                    //           );
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_challan_edit"
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
                                    //           setFieldValue(
                                    //             "pi_invoice_dt",
                                    //             ""
                                    //           );
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_challan_edit"
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
                                    //     // document.getElementById("pi_invoice_dt").focus()
                                    //   }
                                    // }}
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
                                    }}
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
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="my-auto paddingLeft"
                              >
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
                                    // onKeyDown={(e) => {
                                    //   if (e.keyCode == 13)
                                    //     this.focusNextElement(e);
                                    // }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.focusNextElement(e);
                                        this.setState({ currentTab: "second" })
                                      }
                                      else if (e.keyCode == 9) {
                                        e.preventDefault();
                                        this.focusNextElement(e);
                                        this.setState({ currentTab: "second" })
                                      }
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
                    productId="TPCEProductId-"
                    addBtnId="TPCEAddBtn-"
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
                    opType={opType} // @vinit@Passing as prop in CmpTRow  and MDLLedger for Focusing previous Tab
                  />

                  <Row className="mx-0 btm-data-invoice">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="row-top-padding">
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
                                  id="TPCE_Ledger_Tab"
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
                                  id="TPCE_Product_Tab"
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
                                        .getElementById("TPCE_Ledger_Tab")
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
                                      className="col-top-margin"
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
                                          Tax%:
                                        </span>
                                        <span className="span-value">
                                          {productData.tax_per}
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
                                          Margin%:
                                        </span>
                                        <span className="span-value">
                                          {productData.margin_per}
                                        </span>
                                      </div>
                                    </Col>
                                    <Col lg={3} className="col-top-margin">
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
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                            onInput={(e) => {
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
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
                            {productSupplierLst.length > 0 ? (
                              productSupplierLst.map((v, i) => {
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
                        <Col lg={3} className="mt-2">
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
                      <Row>
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

                        <Row className="mt-1">
                          <Col lg={12}>
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {/* {isNaN(values.total_free_qty) === true
                              ? 0
                              : values.total_free_qty} */}
                              {/* {values.total_free_qty} */}
                              {INRformat.format(values.total_free_qty)}
                            </span>
                          </Col>
                        </Row>
                        <Row className="my-auto">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0 "
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

                      <Table className="tnx-pur-inv-btm-amt-tbl ">
                        <tbody>
                          <tr>
                            <td className="py-0">
                              <div className="d-flex mt-1">
                                {/* <InputGroup className="  mdl-text d-flex">
                                  <Form.Control
                                    placeholder="Add.Charges"
                                    className="tnx-pur-inv-text-box mt-1"
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
                                    //   }, 150);
                                    // }}

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
                                    //   }, 100);
                                    // }}
                                  />
                                  {values.additionalChgLedgerName1 != "" &&
                                  (parseInt(values.additionalChgLedgerAmt1) ===
                                    0 ||
                                    values.additionalChgLedgerAmt1 === "") ? (
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
                                <Form.Label className="my-auto lebleclass me-1">
                                  Add Charges{" "}
                                </Form.Label>
                                <Button
                                  id="TPCE_add_charges_btn"
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
                                    className="ledger-btn"
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
                                      e.preventDefault();
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
                                  />
                                </Button>
                              </div>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1 text-end"
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
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                readOnly={
                                  parseInt(additionalChargesTotal) > 0
                                    ? false
                                    : true
                                }
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="py-0">
                              <InputGroup className="  mdl-text d-flex">
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
                                  //   }, 150);
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
                                  //   }, 100);
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
                              </InputGroup>
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
                            </tr>
                          </tr>
                              */}
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
                            <td className="p-0 text-end"></td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <InputGroup className="  mdl-text d-flex">
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
                                  //   }, 150);
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
                                //   }, 100);
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
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                readOnly={
                                  parseInt(values.additionalChgLedger3) > 0
                                    ? false
                                    : true
                                }
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              />
                            </td>
                          </tr>

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {parseFloat(values.bill_amount).toFixed(2)}
                              {/* {INRformat.format(values.bill_amount)} */}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          id="TPCE_submit_btn"
                          className="successbtn-style"
                          type="Submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
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
                                  //   "tranx_purchase_challan_list"
                                  // );
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_challan_edit",
                                    to: "tranx_purchase_challan_list",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: {
                                      editId: this.state.purchaseEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_purchase_challan_list"
                                    // );
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_challan_edit",
                                      to: "tranx_purchase_challan_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: {
                                        editId: this.state.purchaseEditData.id,
                                        rowId: this.props.block.prop_data.rowId,
                                      },
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
          {/* Settlement Amout */}
          <Modal
            show={adjustbillshow}
            size="lg"
            className="transaction_mdl invoice-mdl-style"
            onHide={() => this.setState({ adjustbillshow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header
            // closeButton
            // closeVariant="white"
            // className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Settlement of Bills
              </Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                // onClick={this.handleClose}
                onClick={() => this.setState({ adjustbillshow: false })}
              />
            </Modal.Header>

            <Modal.Body className="p-0">
              <div className="table_wrapper">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={{
                    debitnoteNo: "",
                    newReference: "",
                  }}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // this.handleFetchData(values);
                    // this.setState({ billLst: values, adjustbillshow: false });
                    let requestData = new FormData();
                    requestData.append(
                      "debitNoteReference",
                      values.newReference
                    );
                    let row = billLst.filter((v) => v.Total_amt != "");
                    if (values.newReference == "true") {
                      let bills = [];
                      row.map((v) => {
                        // if (selectedBills.includes(parseInt(v.id))) {
                        bills.push({
                          debitNoteId: v.id,
                          debitNotePaidAmt: v.debit_paid_amt,
                          debitNoteRemaningAmt: v.debit_remaining_amt,
                          source: v.source,
                        });
                      });
                      requestData.append("bills", JSON.stringify(bills));
                    }

                    requestData.append("id", invoice_data.id);
                    // !Invoice Data
                    requestData.append(
                      "invoice_date",
                      moment(invoice_data.pi_invoice_dt).format("yyyy-MM-DD")
                    );
                    requestData.append("invoice_no", invoice_data.invoice_no);
                    requestData.append(
                      "purchase_id",
                      invoice_data.purchaseId.value
                    );
                    requestData.append(
                      "purchase_sr_no",
                      invoice_data.purchase_sr_no
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
                      invoice_data.selectedSupplier.id
                    );
                    // !Invoice Data
                    let returnValues = this.myRef.current.values;
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
                    requestData.append(
                      "tcs",
                      returnValues.tcs && returnValues.tcs != ""
                        ? returnValues.tcs
                        : 0
                    );

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
                        v.productId = v.productId ? v.productId.value : "";
                        v.details_id = v.details_id != "" ? v.details_id : 0;
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
                                            vu["details_id"] =
                                              vu.details_id != ""
                                                ? vu.details_id
                                                : 0;
                                            vu["b_details_id"] =
                                              vu.b_details_id != ""
                                                ? vu.b_details_id
                                                : 0;
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

                    console.warn("additionalCharges ", additionalCharges);
                    let additionalChargesfilter = additionalCharges.filter(
                      (v) => {
                        if (
                          v.ledger_id != "" &&
                          v.ledger_id != undefined &&
                          v.ledger_id != null
                        ) {
                          v["ledgerId"] = v["ledgerId"]["value"];
                          return v;
                        }
                      }
                    );
                    console.warn(
                      "additionalChargesfilter ",
                      additionalChargesfilter
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
                      // console.log("taxCal", taxCal);
                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
                      requestData.append("taxFlag", true);
                    }

                    // List key/value pairs
                    for (let [name, value] of requestData) {
                      // console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                    }
                    let filterRowDetail = [];
                    if (rowDelDetailsIds.length > 0) {
                      filterRowDetail = rowDelDetailsIds.map((v) => {
                        return { del_id: v };
                      });
                    }
                    console.log("filterRowDetail", filterRowDetail);
                    requestData.append(
                      "rowDelDetailsIds",
                      JSON.stringify(filterRowDetail)
                    );

                    editPurchaseChallan(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus === 200) {
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: res.message,
                            is_timeout: true,
                            delay: 500,
                          });
                          resetForm();
                          this.initRow();
                          if ("ledgerId" in this.state.source != "") {
                            eventBus.dispatch("page_change", {
                              from: "tranx_purchase_challan_list",
                              to: "ledgerdetails",
                              prop_data: this.state.source["ledgerId"],

                              isNewTab: false,
                            });
                            // this.setState({ source: "" });
                          } else {
                            // eventBus.dispatch(
                            //   "page_change",
                            //   "tranx_purchase_challan_list"
                            // );
                            eventBus.dispatch("page_change", {
                              from: "tranx_purchase_challan_edit",
                              to: "tranx_purchase_challan_list",
                              prop_data: {
                                editId: this.state.purchaseEditData.id,
                                rowId: this.props.block.prop_data.rowId,
                              },
                              isCancel: true,
                              isNewTab: false,
                            });
                          }

                          // eventBus.dispatch("page_change", {
                          //   from: "tranx_purchase_invoice_edit",
                          //   to: "tranx_purchase_invoice_list",

                          //   isNewTab: false,
                          // });
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
                        // console.log('error', error);
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
                      <Row className="m-2">
                        <Col md="12">
                          <Form.Group>
                            <Form.Label>
                              {/* Adjust Amount In Bill?{' '} */}
                              <span className="redstar"></span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
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
                              <span className="ms-3">YES</span>
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
                              <span className="ms-3">NO</span>
                            </Form.Label>

                            <span className="text-danger">
                              {errors.newReference && "Select Option"}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                      {values.newReference === "true" && (
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
                                        isAllCheckeddebit === true
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        this.handleBillsSelectionAllDebit(
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
                                            v.debit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionDebit(
                                              v.debit_note_no,
                                              i,
                                              e.target.checked
                                            );
                                          }}
                                          // onClick={(e) => {
                                          //   let checked = e.target.checked;

                                          //   if (checked == true) {
                                          //     this.handleBillPayableAmtChange(
                                          //       v.Total_amt,
                                          //       i
                                          //     );
                                          //   } else {
                                          //     this.handleBillPayableAmtChange(
                                          //       0,
                                          //       i
                                          //     );
                                          //   }
                                          // }}
                                          label={i + 1}
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
                                        value={v.debit_paid_amt}
                                        className="paidamttxt"
                                      //style={{ paddingTop: "0" }}
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
                          <Button className="createbtn float-end" type="submit">
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
          {/* Ledger Modal Starts */}
          <MdlLedger
            ref={this.customModalRef} //@neha @on click outside modal will close
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            updatedLedgerType={updatedLedgerType}
            currentLedgerData={currentLedgerData}
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerModal={ledgerModal}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            invoice_data={invoice_data}
            isLedgerSelectSet={isLedgerSelectSet}
            from_source={from_source}
            ledgerId={ledgerId}
            setLedgerId={setLedgerId}
            rows={rows}
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
            ledgerInputData={ledgerInputData}
            isTextBox={isTextBox}
            searchInputId="supplierNameId"
            sourceUnder={sourceUnder}
            setledgerInputDataFun={this.setledgerInputData.bind(this)}
            opType={opType} // @vinit@Passing as prop in CmpTRow  and MDLLedger for Focusing previous Tab
          />
          {/* Ledger Modal Ends */}
          {/* IndirectExp Ledger Modal Starts */}
          <MdlLedgerIndirectExp
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(this)}
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
          />
          {/*  Ledger Modal Ends */}
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
)(TranxPurchaseChallanEdit);
