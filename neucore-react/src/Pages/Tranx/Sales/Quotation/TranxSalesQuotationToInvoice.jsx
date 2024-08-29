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
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
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

import delete_icon from "@/assets/images/delete_icon.svg";
import add_icon from "@/assets/images/add_icon.svg";

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
  getSalesQuotationProductFpuByIds,
  getSaleQuotationWithIds,
  getSalesInvoiceSupplierListByProductId,
  get_supplierlist_by_productid,
  getLastSalesChallanNo,
  getCBADReceipt,
  getSalesmanMasterOutlet,
  quantityVerificationById,
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
  isMultiDiscountExist,
  isFreeQtyExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  flavourDD,
  isUserControlExist,
  allEqual,
  INRformat,
  OnlyEnterAmount,
  CheckIsRegisterdCompany,
  fnTranxCalculationRoundDecimalPlaces,
  configDecimalPlaces,
  roundDigit,
} from "@/helpers";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setUserControl } from "@/redux/userControl/Action";

class TranxSalesQuotationToInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.paymentRef = React.createRef();
    this.counterRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.inputRef1 = React.createRef();
    this.clientGSTINRef = React.createRef();
    this.salesAccRef = React.createRef();
    this.state = {
      isCreate: false,
      isCancelConv: false,
      salesmanLst: [],
      ledgerNameFlag: false, //!for focus
      currentTab: "second", //@prathmesh @batch info & product info tab active
      add_button_flag: true,
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
      initVal: {
        sales_sr_no: 1,
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesId: "",
        bill_dt: moment(new Date()).format("DD/MM/YYYY"),
        clientCodeId: "",
        clientNameId: "",
      },
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      selectSerialModal: false,
      paymentModeModal: false,
      serialNoLst: [],
      modeCheck: [],
      modeStatus: false,
      totalAmount: "",
      returnAmount: "",
      pendingAmount: "",
      ledgerType: "SD",
      updatedLedgerType: "SD",
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerDataIndExp: "",
      selectedLedgerIndExp: "",
      additionalChargesId: "",
      setAdditionalChargesId: false,
      invoice_data: {
        selectedSupplier: "",
        sales_sr_no: "",
        bill_no: "",
        creditnoteNo: "",
        newReference: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesAccId: "",
        supplierCodeId: "",
        supplierNameId: "",
        // clientCodeId: "",
        // clientNameId: "",
        mode: "",
        modes: "",
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
        additionalCharges: "",
      },
      unitIds: {},
      rowDelDetailsIds: [],
      batch_data_selected: "",
      productData: "",
      ledgerModal: false,
      ledgerNameModal: false,
      newBatchModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      selectedLedger: "",
      currentLedgerData: "",
      ledgerInputData: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      selectedLedgerNo: 1,
      product_hover_details: "",
      product_supplier_lst: [],
      additionalCharges: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      isLedgerSelectSet: false,
      isRowProductSet: false,
      costingMdl: false,
      costingInitVal: "",
      gstId: "",
      cashAcbankLst: "",
      pendingAmount: "",
      returnAmount: "",
      transactionType: "sales_edit",
      errorArrayBorder: "",
      additionalDelDetailsIds: [],
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      transactionTableStyle: "salesssss",
      from_source: "tranx_sales_quotation_to_invoice",
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
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
  setLastSalesSerialNo = () => {
    // ;
    // let reqData = new FormData();
    // reqData.append("sales_type", "sales");
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          const { invoice_data } = this.state;
          // initVal["sales_sr_no"] = res.count;
          // initVal["bill_no"] = res.serialNo;
          invoice_data["sales_sr_no"] = res.count;
          invoice_data["bill_no"] = res.serialNo;

          this.setState({ invoice_data: invoice_data });
          // if (this.myRef.current) {
          //   this.myRef.current.setFieldValue("sales_sr_no", res.count);
          // this.myRef.current.setFieldValue("bill_no", res.serialNo);
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
        document.getElementById("TSQTIProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
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
            //console.log("rahul:: lstSalesAccounts", { v }, v[0]);
            const { prop_data } = this.props.block;
            console.warn("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["salesAccId"] = v[0];
              this.setState({ invoice_data: init_d });
            } else if (
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
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputRef1.current.focus();
        // if (this.state.ledgerNameFlag) {
        //   if (this.state.lstGst.length > 1 && this.clientGSTINRef.current) {
        //     this.clientGSTINRef.current.focus();
        //   } else if (this.salesAccRef.current) {
        //     this.salesAccRef.current.focus();
        //   }
        // }
        if (this.state.ledgerNameFlag) {
          if (this.state.lstGst.length > 1 && this.selectGstClientRef.current) {
            this.selectGstClientRef.current.focus();
          } else if (this.selectSalesAccRef.current) {
            this.selectSalesAccRef.current.focus();
          }
        } else {
          document.getElementById("transaction_dt").focus();
        }
      });
    } else {
      this.setState({ [ele]: val });
    }
  };

  // setLastSalesChallanSerialNo = () => {
  //   getLastSalesChallanNo()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         if (this.myRef.current) {
  //           // this.myRef.current.setFieldValue("sc_sr_no", res.count);
  //           // this.setState({ sc_sr_no: res.count });
  //           //this.myRef.current.setFieldValue("scbill_no", res.serialNo);
  //           let { invoice_data } = this.state;
  //           invoice_data["sc_sr_no"] = res.count;
  //           invoice_data["scbill_no"] = res.serialNo;

  //           this.setState({ invoice_data: invoice_data });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/
  setSupplierData = (supplierId = "", setFieldValue) => {
    console.warn("warn :: supplierId", supplierId);
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

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
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
            },
            () => {}
          );
          setTimeout(() => {
            // document.getElementById("transaction_dt").focus();
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
        //         setTimeout(() => {
        //           // document.getElementById("transaction_dt").focus();
        //           this.invoiceDateRef.current.focus();
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
        //         setTimeout(() => {
        //           // document.getElementById("transaction_dt").focus();
        //           this.invoiceDateRef.current.focus();
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
    console.warn("rahul :: salesInvoiceNo", salesInvoiceNo);
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
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum
                ? v.takeDiscountAmountInLumpsum
                : "",
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
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum
                ? v.takeDiscountAmountInLumpsum
                : "",
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
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum
                ? v.takeDiscountAmountInLumpsum
                : "",
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
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum
                ? v.takeDiscountAmountInLumpsum
                : "",
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
            levelOpt: res.levelAOpt.map(function (values) {
              return { value: values.levela_id, label: values.levela_name };
            }),
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
    // //console.log("elementCheck", elementCheck);
    // //console.log("element", element);
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

  handlePropsData = (prop_data) => {
    this.setState({
      ledgerModalIndExp: prop_data.ledgerModalIndExp,
      ledgerModalIndExp1: true,
      ledgerModalIndExp2: true,
      ledgerModalIndExp3: true,
    });
    if (prop_data.invoice_data) {
      this.setState(
        {
          invoice_data: prop_data.invoice_data,
          rows: prop_data.rows,
          productId: prop_data.productId,
          ledgerId: prop_data.ledgerId,
          setProductRowIndex: prop_data.prop_data.rowIndex,

          additionalChargesId: prop_data.additionalChargesId,
        },
        () => {
          this.setState(
            {
              ledgerId: prop_data.ledgerId,
              additionalChargesId: prop_data.additionalChargesId,
              setAdditionalChargesId: true,
              setAdditionalChargesIndex: prop_data.setAdditionalChargesIndex,
              setLedgerId: true,
              productId: prop_data.productId,
              setProductId: true,
              setProductRowIndex: prop_data.rowIndex,
            },
            () => {
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                if (prop_data.isProduct == "productMdl") {
                  document
                    .getElementById(
                      "TPICProductId-particularsname-" +
                        this.props.block.prop_data.rowIndex
                    )
                    ?.focus();
                } else {
                  this.inputRef1.current.focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                }
              }, 1200);
            }
          );
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  handleChangeArrayElement = (element, value, index, setFieldValue) => {
    // console.log({ element, value, index });
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
            vi["igst"] = value.igst;
            vi["gst"] = value.igst;
            vi["cgst"] = value.cgst;
            vi["sgst"] = value.sgst;
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
    this.setState({ rows: frows, lstPackages: [] }, () => {
      if (
        element == "productId" &&
        value != "" &&
        value != undefined &&
        value != null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          this.getProductPackageLst(value.value);
          //   console.log("in  if statement of getProductPackageLst ");
        });
      }
      this.handleAdditionalChargesSubmit();
    });
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
    }
  };

  handleRowChange = (
    rows,
    showBatch = false,
    rowIndex = 0,
    transactionDetailIndex = 0
  ) => {
    this.setState({ rows: rows }, () => {
      this.handleAdditionalChargesSubmit();
      if (showBatch == true) {
        this.setState(
          {
            rowIndex: rowIndex,
            transactionDetailIndex: transactionDetailIndex,
          },
          () => {
            // this.getInitBatchValue();
            this.getProductBatchList();
          }
        );
      }
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

  initAdditionalCharges = (len = 0) => {
    // additionalCharges
    if (len > 0) {
      len = len;
    } else {
      len = 5;
    }
    let lst = [];
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
    // //console.log("props", this.props);
    if (AuthenticationCheck()) {
      this.setLastSalesSerialNo();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      // this.lstSundrydebtors();
      this.lstSalesAccounts();
      // this.transaction_product_listFun();
      this.transaction_ledger_listFun();
      // this.setLastSalesChallanSerialNo();
      // this.setLastSalesSerialNo();
      this.lstgetcashAcbankaccount();
      this.lstSalesmanMaster();

      this.initRow();
      this.initAdditionalCharges(1);
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;
      //console.log("userpermission-->", this.props.userPermissions);
      //console.log("prop_data ", { prop_data });

      // if ("invoice_data" in prop_data)
      //   this.setState({ invoice_data: prop_data.invoice_data });
      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      this.setState({ salesEditData: prop_data }, () => {
        if (prop_data.selectedBills) {
          this.getSalesQuotationProductFpuByIds();
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

  getSalesQuotationProductFpuByIds = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    //console.log("salesEditData=-> ", salesEditData);
    let sale_quotation_ids = salesEditData.selectedBills.map((v) => {
      return { id: v };
    });
    //console.log("sale_quotation_ids", sale_quotation_ids);

    reqData.append("sale_quotation_ids", JSON.stringify(sale_quotation_ids));

    getSalesQuotationProductFpuByIds(reqData)
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
    const {
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

    console.warn("didupdate ", {
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      salesEditData,
      // lstDisLedger,
      lstBrand,
    });

    if (
      salesAccLst.length > 0 &&
      // supplierNameLst.length > 0 &&
      // supplierCodeLst.length > 0 &&
      // productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      // lstBrand.length > 0 &&
      // lstDisLedger.length > 0 &&
      isEditDataSet === false &&
      salesEditData !== ""
    ) {
      this.setSalesQuotationEditData();
    }
  }

  setSalesQuotationEditData = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    //console.log("salesEditData=-> ", salesEditData);
    let sale_quotation_ids = salesEditData.selectedBills.map((v) => {
      return { id: v };
    });
    // console.log("sale_quotation_ids", sale_quotation_ids);

    reqData.append("sale_quotation_ids", JSON.stringify(sale_quotation_ids));

    getSaleQuotationWithIds(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, narration } = res;
          const {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            lstAdditionalLedger,
            productLst,
            lstBrand,
          } = this.state;
          let opt = [];

          /* console.log(
            "supplierNameLst,  supplierCodeLst,",
            supplierNameLst,
            supplierCodeLst
          ); */

          let initInvoiceData = {
            id: invoice_data.id,
            // sales_sr_no: invoice_data.sales_sr_no,
            sales_sr_no: this.state.invoice_data.sales_sr_no,
            narration: invoice_data.narration,
            // bill_no: invoice_data.sales_quotation_no,
            // gstId: invoice_data.gstId,
            bill_no: this.state.invoice_data.bill_no,
            gstNo: invoice_data.gstNo,
            bill_dt:
              invoice_data.sq_transaction_dt != ""
                ? moment(
                    new Date(
                      moment(
                        invoice_data.sq_transaction_dt,
                        "YYYY-MM-DD"
                      ).toDate()
                    )
                  ).format("DD/MM/YYYY")
                : "",
            transaction_dt:
              invoice_data.sq_transaction_dt != ""
                ? moment(
                    new Date(
                      moment(
                        invoice_data.sq_transaction_dt,
                        "YYYY-MM-DD"
                      ).toDate()
                    )
                  ).format("DD/MM/YYYY")
                : "",
            EditsupplierId: invoice_data.debtors_id,
            supplierCodeId: "",
            supplierNameId: "",
            salesAccId: invoice_data.sales_account_id
              ? getSelectValue(salesAccLst, invoice_data.sales_account_id)
              : "",
            // clientCodeId: invoice_data.debtors_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.debtors_id)
            //   : "",
            // supplierNameId: invoice_data.debtors_id
            //   ? getSelectValue(supplierNameLst, invoice_data.debtors_id)[
            //       "label"
            //     ]
            //   : "",
            mode: invoice_data.paymentMode,
            tcs: res.tcs,
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

            opt = initInvoiceData.clientCodeId.gstDetails.map((v, i) => {
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
            initInvoiceData["gstId"] = getSelectValue(
              opt,
              initInvoiceData.gstId
            );
          } else {
            initInvoiceData["gstId"] = opt[0];
          }

          this.myRef.current.setFieldValue("gstId", opt[0]);
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

              return v;
            });
          }
          console.warn("opt ", opt);
          // let paymentData = [];
          // console.log("payment_type", payment_type);
          // if (payment_type.length > 0) {
          //   paymentData = payment_type.map((vi, ii) => {
          //     vi["id"] = vi.ledger_id;
          //     vi["type"] = vi.type;
          //     vi["value"] = vi.ledger_id;
          //     vi["label"] = vi.label;
          //     vi["amount"] = vi.amount;
          //     return vi;
          //   });
          // }

          //console.log("invoice_data", invoice_data);
          //console.log("row---===>", initRowData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              lstGst: opt,
              isLedgerSelectSet: true,

              // cashAcbankLst: paymentData,
            },
            () => {
              setTimeout(() => {
                this.setState({ isRowProductSet: true });
                this.handleTranxCalculation();
              }, 25);
            }
          );
          // console.log("invoice_data_______", this.state.invoice_data.id);
        }
      })
      .catch((error) => {});
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };

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
  // handleAdditionalCharges = (element, index, value) => {
  //   // console.log({ element, index, value });

  //   let { additionalCharges } = this.state;
  //   let fa = additionalCharges.map((v, i) => {
  //     if (i == index) {
  //       v[element] = value;

  //       if (value == undefined || value == null) {
  //         v["amt"] = "";
  //       }
  //     }
  //     return v;
  //   });
  //   let totalamt = 0;
  //   fa.map((v) => {
  //     if (v.amt != "") {
  //       totalamt += parseFloat(v.amt);
  //     }
  //   });
  //   this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  // };
  handleAdditionalCharges = (element, index, value) => {
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
  // handleAdditionalChargesHide = () => {
  //   this.setState({ additionchargesyes: false }, () => {
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

  // handleTranxCalculation = (elementFrom = "", isCal = false) => {
  //   // !Most IMP̥
  //   let { rows, additionalChargesTotal } = this.state;

  //   let ledger_disc_amt = 0;
  //   let ledger_disc_per = 0;
  //   let takeDiscountAmountInLumpsum = false;
  //   let isFirstDiscountPerCalculate = false;
  //   let addChgLedgerAmt1 = 0;
  //   let addChgLedgerAmt2 = 0;
  //   let addChgLedgerAmt3 = 0;
  //   let inp_tcs_per = 0;
  //   let inp_tcs_amt = 0;

  //   if (this.myRef.current) {
  //     let {
  //       sales_discount,
  //       sales_discount_amt,
  //       supplierCodeId,
  //       additionalChgLedgerAmt1,
  //       additionalChgLedgerAmt2,
  //       additionalChgLedgerAmt3,
  //       tcs_per,
  //       tcs_amt,
  //     } = this.myRef.current.values;

  //     inp_tcs_per = tcs_per;
  //     inp_tcs_amt = tcs_amt;
  //     ledger_disc_per = sales_discount;
  //     ledger_disc_amt = sales_discount_amt;

  //     addChgLedgerAmt1 = additionalChgLedgerAmt1;
  //     addChgLedgerAmt2 = additionalChgLedgerAmt2;
  //     addChgLedgerAmt3 = additionalChgLedgerAmt3;

  //     // takeDiscountAmountInLumpsum =
  //     //   supplierCodeId != undefined
  //     //     ? supplierCodeId.takeDiscountAmountInLumpsum
  //     //     : "";
  //     // isFirstDiscountPerCalculate =
  //     //   supplierCodeId != undefined
  //     //     ? supplierCodeId.isFirstDiscountPerCalculate
  //     //     : "";

  //     let UserisFirstDiscountPerCalculate = isUserControl(
  //       "is_discount_first_calculation",
  //       this.props.userControl
  //     );
  //     let UsertakeDiscountAmountInLumpsum = isUserControl(
  //       "is_discount_amount_per_unit",
  //       this.props.userControl
  //     );
  //     takeDiscountAmountInLumpsum = UsertakeDiscountAmountInLumpsum;
  //     isFirstDiscountPerCalculate = UserisFirstDiscountPerCalculate;
  //   }

  //   let resTranxFn = fnTranxCalculation({
  //     elementFrom: elementFrom,
  //     rows: rows,
  //     ledger_disc_per: ledger_disc_per,
  //     ledger_disc_amt: ledger_disc_amt,
  //     additionalChargesTotal: additionalChargesTotal,

  //     additionalChgLedgerAmt1: addChgLedgerAmt1,
  //     additionalChgLedgerAmt2: addChgLedgerAmt2,
  //     additionalChgLedgerAmt3: addChgLedgerAmt3,

  //     takeDiscountAmountInLumpsum,
  //     isFirstDiscountPerCalculate,
  //     tcs_per: inp_tcs_per,
  //     tcs_amt: inp_tcs_amt,
  //   });
  //   let {
  //     base_amt,
  //     total_purchase_discount_amt,
  //     total_taxable_amt,
  //     total_tax_amt,
  //     gst_row,
  //     total_final_amt,
  //     gst_total_amt,
  //     taxIgst,
  //     taxCgst,
  //     taxSgst,

  //     total_invoice_dis_amt,
  //     total_qty,
  //     total_free_qty,
  //     bill_amount,
  //     total_row_gross_amt,
  //     total_row_gross_amt1,
  //     tcs_per_cal,
  //     tcs_amt_cal,
  //   } = resTranxFn;

  //   // let roundoffamt = Math.round(total_final_amt);
  //   // let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);
  //   let roundoffamt = 0;
  //   let roffamt = 0;

  //   if (elementFrom.toLowerCase() == "roundoff" && isCal == true) {
  //     roundoffamt = parseFloat(total_final_amt);
  //     roffamt = 0;
  //     bill_amount = parseFloat(bill_amount);
  //   } else {
  //     roundoffamt = Math.round(total_final_amt);
  //     bill_amount = Math.round(parseFloat(bill_amount));
  //     roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);
  //   }
  //   this.myRef.current.setFieldValue(
  //     "tcs_per",
  //     isNaN(parseFloat(tcs_per_cal)) ? 0 : parseFloat(tcs_per_cal)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "tcs_amt",
  //     isNaN(parseFloat(tcs_amt_cal)) ? 0 : parseFloat(tcs_amt_cal)
  //   );

  //   this.myRef.current.setFieldValue(
  //     "total_base_amt",
  //     isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_purchase_discount_amt",
  //     // isNaN(parseFloat(total_purchase_discount_amt))
  //     //   ? 0
  //     //   : parseFloat(total_purchase_discount_amt).toFixed(2)
  //     parseFloat(total_purchase_discount_amt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_row_gross_amt1",
  //     parseFloat(total_row_gross_amt1)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_row_gross_amt",
  //     parseFloat(total_row_gross_amt)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_taxable_amt",
  //     parseFloat(total_taxable_amt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_tax_amt",
  //     parseFloat(total_tax_amt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "roundoff",
  //     Math.abs(parseFloat(roffamt).toFixed(2))
  //   );
  //   this.myRef.current.setFieldValue(
  //     "totalamt",
  //     parseFloat(roundoffamt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "bill_amount",
  //     parseFloat(bill_amount).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_invoice_dis_amt",
  //     parseFloat(total_invoice_dis_amt).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_qty",
  //     parseFloat(total_qty).toFixed(2)
  //   );
  //   this.myRef.current.setFieldValue(
  //     "total_free_qty",
  //     parseFloat(total_free_qty).toFixed(2)
  //   );

  //   let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

  //   this.setState({
  //     rows: gst_row,
  //     taxcal: taxState,
  //   });
  // };

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

    if (this.myRef.current) {
      let {
        purchase_discount,
        purchase_discount_amt,
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
      isNaN(parseFloat(base_amt))
        ? 0
        : roundDigit(base_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      roundDigit(total_purchase_discount_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt1",
      roundDigit(total_row_gross_amt1, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt",
      roundDigit(total_row_gross_amt, configDecimalPlaces)
    );

    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      roundDigit(total_taxable_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      roundDigit(total_tax_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      roundDigit(Math.abs(roffamt), configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      roundDigit(roundoffamt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      roundDigit(bill_amount, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_invoice_dis_amt",
      roundDigit(total_invoice_dis_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_qty",
      roundDigit(total_qty, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_free_qty",
      roundDigit(total_free_qty, configDecimalPlaces)
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

  // handleUnitChange = (ele, value, rowIndex) => {
  //   let { rows } = this.state;
  //   if (value == "" && ele == "qty") {
  //     value = 0;
  //   }
  //   //console.log("ele->", ele, parseFloat(value));

  //   if (ele == "dis_per" && parseFloat(value) >= parseFloat(100)) {
  //     MyNotifications.fire({
  //       show: true,
  //       icon: "warning",
  //       title: "Warning",
  //       msg: "Discount is exceeding 100%",
  //       //  is_timeout: true,
  //       //  delay: 1000,
  //       is_button_show: true,
  //     });
  //     //console.log("discount is greater than 99");
  //     // this.myRef.current.setFieldValue("dis_per", 0);
  //     rows[rowIndex][ele] = 0;
  //   } else {
  //     rows[rowIndex][ele] = value;
  //   }

  //   if (ele == "unitId") {
  //     if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
  //       this.handleRowStateChange(
  //         rows,
  //         rows[rowIndex]["is_batch"], // true,
  //         rowIndex
  //       );
  //     } else {
  //       //console.log("UNITID");
  //       this.handleRowStateChange(rows, false, rowIndex);
  //     }
  //   } else if (
  //     ele == "qty" &&
  //     isUserControlExist("is_network_system", this.props.userControl) === true
  //   ) {
  //     this.updateProductStockFun(rowIndex, rows);
  //   } else {
  //     this.handleRowStateChange(rows);
  //   }
  // };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows, showBatch } = this.state;
    console.log("(ele, value, rowIndex) ", ele, value, rowIndex, { rows });

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
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });

    if (obj.isProduct == "productMdl") {
      setTimeout(() => {
        document
          .getElementById("TSQTIProductId-particularsname-" + obj.rowIndex)
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
    // console.log("serialNoLst", serialNoLst);

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
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };

  handleFetchData = (sundry_debtors_id) => {
    //console.log("handleFetchData", sundry_debtors_id);
    let reqData = new FormData();
    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;
        let data = res.list;
        console.warn("rahul::data.length >>>>>>>>>>>", data.length);
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
      additionalCharges,
      additionalChargesTotal,
      rowDelDetailsIds,
      rows,
      initVal,
      cashAcbankLst,
      totalAmount,
      returnAmount,
      pendingAmount,
      isRoundOffCheck,
      salesEditData,
    } = this.state;
    let invoiceValues = this.myRef.current.values;

    /*  console.log("before API Call==-->>>", {
      initVal,
      invoice_data,
      invoiceValues,
    }); */

    let requestData = new FormData();
    // !Invoice Data
    requestData.append(
      "bill_dt",
      moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("bill_no", invoiceValues.bill_no);
    requestData.append("sales_acc_id", invoiceValues.salesAccId.value);
    requestData.append("sales_sr_no", invoiceValues.sales_sr_no);
    requestData.append(
      "gstNo",
      invoiceValues.gstId !== "" ? invoiceValues.gstId.label : ""
    );

    requestData.append("debtors_id", invoice_data.selectedSupplier.id);
    // requestData.append(
    //   "debtors_id",
    //   values.selectedSupplier.id
    // );
    // !Invoice Data
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

    let frow = rows.map((v, i) => {
      if (v.productId != "") {
        v.productId = v.productId ? v.productId : "";
        v["unit_conv"] = v.unitId ? v.unitId.unitConversion : "";
        v["unitId"] = v.unitId ? v.unitId.value : "";
        v["levelaId"] = v.levelaId ? v.levelaId.value : "";
        v["levelbId"] = v.levelbId ? v.levelbId.value : "";
        v["levelcId"] = v.levelcId ? v.levelcId.value : "";

        v["is_multi_unit"] = v.is_multi_unit;
        v["rate"] = v.rate;
        v["dis_amt"] = v.dis_amt != "" ? v.dis_amt : 0;
        v["dis_per"] = v.dis_per != "" ? v.dis_per : 0;
        v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
        v["rate_a"] = v.rate_a != "" ? v.rate_a : 0;
        v["rate_b"] = v.rate_b != "" ? v.rate_b : 0;
        v["rate_c"] = v.rate_c != "" ? v.rate_c : 0;
        v["margin_per"] = v.margin_per;
        v["min_margin"] = v.min_margin;
        v["b_details_id"] = v.b_details_id != "" ? v.b_details_id : 0;
        v["b_expiry"] = moment(v.b_expiry).format("yyyy-MM-DD");
        v["manufacturing_date"] = moment(v.manufacturing_date).format(
          "yyyy-MM-DD"
        );

        v["is_batch"] = v.is_batch != undefined ? v.is_batch : false;
        v["isBatchNo"] = v.b_no != undefined ? v.b_no : 0;
        v["igst"] = v.igst != "" ? v.igst : 0;
        v["cgst"] = v.cgst != "" ? v.cgst : 0;
        v["sgst"] = v.sgst != "" ? v.sgst : 0;
        return v;
      }
    });
    //console.log("rows, frow =->", rows, frow);

    var filtered = frow.filter(function (el) {
      return el != null;
    });
    let filteradditionalCharges = additionalCharges.map((v) => {
      return {
        ledgerId: v.ledgerId.id,
        amt: v.amt,
      };
    });
    requestData.append("row", JSON.stringify(filtered));
    requestData.append("additionalChargesTotal", additionalChargesTotal);
    requestData.append(
      "additionalCharges",
      JSON.stringify(filteradditionalCharges)
    );
    requestData.append("sale_type", "sales");
    requestData.append("print_type", "create");
    requestData.append("paymentMode", this.state.invoice_data.mode);
    if (this.state.invoice_data.mode == "multi") {
      requestData.append(
        "payment_type",
        JSON.stringify(this.state.cashAcbankLst)
      );
      requestData.append("p_totalAmount", this.state.totalAmount);
      requestData.append("p_returnAmount", this.state.returnAmount);
      requestData.append("p_pendingAmount", this.state.pendingAmount);
    }

    // if (
    //   invoiceValues.additionalChgLedger1 &&
    //   invoiceValues.additionalChgLedger1 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt1 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger1",
    //     invoiceValues.additionalChgLedger1 &&
    //       invoiceValues.additionalChgLedger1 !== ""
    //       ? invoiceValues.additionalChgLedger1
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt1",
    //     invoiceValues.additionalChgLedgerAmt1 &&
    //       invoiceValues.additionalChgLedgerAmt1 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt1
    //       : 0
    //   );
    // }
    // if (
    //   invoiceValues.additionalChgLedger2 &&
    //   invoiceValues.additionalChgLedger2 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt2 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger2",
    //     invoiceValues.additionalChgLedger2 &&
    //       invoiceValues.additionalChgLedger2 !== ""
    //       ? invoiceValues.additionalChgLedger2
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt2",
    //     invoiceValues.additionalChgLedgerAmt2 &&
    //       invoiceValues.additionalChgLedgerAmt2 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt2
    //       : 0
    //   );
    // }
    // if (
    //   invoiceValues.additionalChgLedger3 &&
    //   invoiceValues.additionalChgLedger3 !== "" &&
    //   invoiceValues.additionalChgLedgerAmt3 !== ""
    // ) {
    //   requestData.append(
    //     "additionalChgLedger3",
    //     invoiceValues.additionalChgLedger3 !== ""
    //       ? invoiceValues.additionalChgLedger3
    //       : ""
    //   );
    //   requestData.append(
    //     "addChgLedgerAmt3",
    //     invoiceValues.additionalChgLedgerAmt3 !== ""
    //       ? invoiceValues.additionalChgLedgerAmt3
    //       : 0
    //   );
    // }

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

    let s_o_id = salesEditData.selectedBills.map((v) => {
      return { id: v };
    });
    requestData.append("reference_sq_id", JSON.stringify(s_o_id));
    requestData.append("reference", "SLSQTN");

    createSalesInvoice(requestData)
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
          this.setState({ paymentModeModal: false });
          // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
          eventBus.dispatch("page_change", {
            from: "tranx_sales_quotation_to_invoice",
            to: "tranx_sales_invoice_list",
            isNewTab: false,
            isCancel: true,
            prop_data: {
              isCreate: true,
            },
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
    // getInvoiceBill(reqData).then((response) => {
    //   let responseData = response.data;
    //   if (responseData.responseStatus == 200) {
    //     console.log("responseData ---->>>", responseData);
    //     eventBus.dispatch("callprint", {
    //       customerData: responseData.customer_data,
    //       invoiceData: responseData.invoice_data,
    //       supplierData: responseData.supplier_data,
    //       invoiceDetails: responseData.invoice_details.product_details,
    //     });

    //     eventBus.dispatch("page_change", {
    //       // from: "tranx_sales_invoice_create",
    //       to: "tranx_sales_invoice_list",
    //       isNewTab: false,
    //     });
    //   }
    // });
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

  // handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
  //   console.warn(" rahul rowValue ::", showBatch, rowIndex, rowValue);
  //   this.setState({ rows: rowValue }, () => {
  //     if (showBatch == true && rowIndex >= 0) {
  //       this.setState(
  //         {
  //           rowIndex: rowIndex,
  //         },
  //         () => {
  //           console.warn(" rahul getProductBatchList ::");
  //           this.getProductBatchList(rowIndex);
  //         }
  //       );
  //     }

  //     this.handleTranxCalculation();
  //   });
  // };

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
      console.log("findProductPackges ", findProductPackges);
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

  getProductBatchList = (rowIndex = -1, source = "batch") => {
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
              isfound = true;
              batchOpt =
                unitdata.batchOpt && unitdata.batchOpt.length > 0
                  ? unitdata.batchOpt.map((v) => {
                      v["expiry_date"] =
                        v["expiry_date"] && v["expiry_date"] != ""
                          ? moment(v["expiry_date"], "YYYY-MM-DD").format(
                              "DD/MM/YYYY"
                            )
                          : "";
                      v["manufacturing_date"] =
                        v["manufacturing_date"] && v["manufacturing_date"] != ""
                          ? moment(
                              v["manufacturing_date"],
                              "YYYY-MM-DD"
                            ).format("DD/MM/YYYY")
                          : "";
                      return v;
                    })
                  : [];
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
      // let res = [];
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          //console.log("get_Product_batch =>", response);
          if (response.responseStatus == 200) {
            let res = response.data;
            //console.log("res ", res);

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
    // if (document.getElementById("TSQTIAddBtn-" + id) != null) {
    //   setTimeout(() => {
    //     document.getElementById("TSQTIAddBtn-" + id).focus();
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
  // NewBatchModalFun = (status) => {
  //   this.setState({ newBatchModal: status });
  // };
  // SelectProductModalFun = (status, row_index = -1) => {
  //   this.setState({ selectProductModal: status, rowIndex: row_index });
  // };

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
      add_button_flag,
      salesmanLst,
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
      ledgerNameModal,
      newBatchModal,
      paymentModeModal,
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
      product_hover_details,
      product_supplier_lst,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      isLedgerSelectSet,
      selectSerialModal,
      serialNoLst,
      isRowProductSet,
      batch_data_selected,
      costingMdl,
      costingInitVal,
      gstId,
      cashAcbankLst,
      totalAmount,
      returnAmount,
      pendingAmount,
      transactionType,
      errorArrayBorder,
      errorArray,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      transactionTableStyle,
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
      setAdditionalChargesId,
      additionalChargesId,
    } = this.state;

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
              // clientCodeId: Yup.object()
              //   .nullable()
              //   .required("select client code"),
              // supplierNameId: Yup.string()
              //   .nullable()
              //   .required("Client Name is Required"),
              // transaction_dt: Yup.string().required("Invoice Date is Required"),
              // bill_no: Yup.string().trim().required("Invoice No. is Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //console.log("inside onSubmit >>>", values);
              let errorArray = [];
              if (values.transaction_dt == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }
              if (values.supplierNameId == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }
              if (values.bill_no == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }
              if (values.mode == undefined || values.mode == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              //validation End
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
                        if (values.mode == "multi") {
                          this.setState({
                            paymentModeModal: true,
                            invoice_data: values,
                          });
                        } else {
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
                                this.setState({
                                  invoice_data: values,
                                  opendiv: false,
                                });
                                let {
                                  selectedSupplier,
                                } = this.myRef.current.values;
                                if (selectedSupplier) {
                                  this.handleFetchData(selectedSupplier.id);
                                }
                                //console.log("selectedSupplier", values);
                              },
                              handleFailFn: () => {},
                            },
                            () => {
                              console.warn("return_data");
                            }
                          );
                        }
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
                                  Invoice Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Tab" &&
                                      values.transaction_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    autoFocus="true"
                                    autoComplete={true}
                                    // className="tnx-pur-inv-date-style "
                                    className={`${
                                      values.transaction_dt == "" &&
                                      errorArrayBorder[0] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
                                    name="transaction_dt"
                                    id="transaction_dt"
                                    placeholder="DD/MM/YYYY"
                                    value={values.transaction_dt}
                                    onChange={handleChange}
                                    // onBlur={(e) => {
                                    //   console.log("e ", e);
                                    //   console.log(
                                    //     "e.target.value ",
                                    //     e.target.value
                                    //   );
                                    //   if (
                                    //     e.target.value != null &&
                                    //     e.target.value != ""
                                    //   ) {
                                    //     this.setErrorBorder(0, "");
                                    //     console.warn(
                                    //       "rahul:: isValid",
                                    //       moment(
                                    //         e.target.value,
                                    //         "DD-MM-YYYY"
                                    //       ).isValid()
                                    //     );
                                    //     if (
                                    //       moment(
                                    //         e.target.value,
                                    //         "DD-MM-YYYY"
                                    //       ).isValid() == true
                                    //     ) {
                                    //       setFieldValue(
                                    //         "transaction_dt",
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
                                    //       setFieldValue("transaction_dt", "");
                                    //     }
                                    //   } else {
                                    //     this.setErrorBorder(0, "Y");
                                    //     // document
                                    //     //   .getElementById("transaction_dt")
                                    //     //   .focus();
                                    //     setFieldValue("transaction_dt", "");
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
                                    tabIndex={-1}
                                    ref={this.inputRef1}
                                    autoComplete="off"
                                    type="text"
                                    // className="tnx-pur-inv-text-box"
                                    className={`${
                                      values.supplierNameId == "" &&
                                      errorArrayBorder[1] == "Y"
                                        ? "border border-danger tnx-pur-inv-text-box"
                                        : "tnx-pur-inv-text-box"
                                    }`}
                                    placeholder="Ledger Name"
                                    name="supplierNameId"
                                    id="supplierNameId"
                                    onChange={(e) => {
                                      e.preventDefault();

                                      this.setledgerInputData(
                                        e.target.value,
                                        true,
                                        setFieldValue
                                      );
                                    }}
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
                                        // document.getElementById('supplierNameId').focus()
                                      }
                                    }}
                                    //@prathmesh @ledger modal selection not required
                                    // onClick={(e) => {
                                    //   e.preventDefault();

                                    //   if (values.selectedSupplier != "") {
                                    //     this.setState(
                                    //       {
                                    //         currentLedgerData:
                                    //           values.selectedSupplier,
                                    //       },
                                    //       () => {
                                    //         this.ledgerFilterData();
                                    //       }
                                    //     );
                                    //     this.ledgerModalStateChange(
                                    //       "selectedLedger",
                                    //       values.selectedSupplier
                                    //     );

                                    //     this.ledgerModalStateChange(
                                    //       "ledgerModal",
                                    //       true
                                    //     );
                                    //   } else {
                                    //     this.setState({
                                    //       currentLedgerData: "",
                                    //     });
                                    //     this.ledgerModalStateChange(
                                    //       "ledgerModal",
                                    //       true
                                    //     );
                                    //   }
                                    //   this.setState({ currentTab: "first" }); //@prathmesh @batch info & product info tab active
                                    // }}
                                    onFocus={(e) => {
                                      e.preventDefault();
                                      this.setState({ currentTab: "first" });
                                    }}
                                    //@prathmesh @ledger modal selection not required
                                    // onKeyDown={(e) => {
                                    //   if (e.keyCode == 13) {
                                    //     this.ledgerModalStateChange(
                                    //       "ledgerModal",
                                    //       true
                                    //     );
                                    //     this.setState(
                                    //       {
                                    //         currentLedgerData:
                                    //           values.selectedSupplier,
                                    //       },
                                    //       () => {
                                    //         this.ledgerFilterData();
                                    //       }
                                    //     );
                                    //   } else if (
                                    //     e.shiftKey &&
                                    //     e.key === "Tab"
                                    //   ) {
                                    //   } else if (
                                    //     e.key === "Tab" &&
                                    //     !e.target.value.trim()
                                    //   ) {
                                    //     e.preventDefault();
                                    //   } else if (e.key === "Alt") {
                                    //     e.preventDefault();
                                    //   } else if (e.keyCode == 40) {
                                    //     //! this condition for down button press 1409
                                    //     if (ledgerModal == true)
                                    //       document
                                    //         .getElementById("LedgerMdlTr_0")
                                    //         .focus();
                                    //   }
                                    // }}
                                    value={values.supplierNameId}
                                    readOnly={true}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.supplierNameId}
                                  </span>
                                </div>
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
                                    ref={this.clientGSTINRef}
                                    className="selectTo"
                                    autoComplete={true}
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
                                    autoComplete={true}
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
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>
                                  Invoice No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                {" "}
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  placeholder="Order No."
                                  name="bill_no"
                                  id="bill_no"
                                  // className="tnx-pur-inv-text-box"
                                  className={`${
                                    values.bill_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    //console.log("e ", e);
                                    /*   console.log(
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
                                      // document
                                      //   .getElementById("bill_no")
                                      //   .focus();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                      e.preventDefault();
                                    } else if (
                                      e.keyCode == 13 &&
                                      e.target.value
                                    ) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  value={values.bill_no}
                                  isValid={touched.bill_no && !errors.bill_no}
                                  isInvalid={!!errors.bill_no}
                                />
                                <span className="text-danger errormsg">
                                  {errors.bill_no}
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
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="p-0">
                                <Form.Label>
                                  Payment Mode
                                  <label style={{ color: "red" }}>*</label>
                                </Form.Label>
                              </Col>
                              <Col
                                lg={9}
                                md={9}
                                sm={9}
                                xs={9}
                                className="paddingtop"
                              >
                                <Form.Group
                                  style={{ width: "fit-content" }}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (values.mode) {
                                  //     this.setErrorBorder(3, "");
                                  //   } else {
                                  //     this.setErrorBorder(3, "Y");
                                  //     // this.radioRef.current?.focus();
                                  //   }
                                  // }}
                                  className={`${
                                    errorArrayBorder[3] == "Y"
                                      ? "border border-danger d-flex label_style"
                                      : "d-flex label_style"
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !values.mode
                                    ) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 13 && values.mode) {
                                      this.focusNextElement(e);
                                      this.setState({ currentTab: "second" });
                                    }
                                  }}
                                >
                                  <Form.Check
                                    ref={this.radioRef}
                                    type="radio"
                                    id="mode1"
                                    name="mode"
                                    label="Cash"
                                    value="cash"
                                    checked={
                                      values.mode == "cash" ? true : false
                                    }
                                    onChange={handleChange}
                                  />

                                  <Form.Check
                                    ref={this.radioRef}
                                    type="radio"
                                    name="mode"
                                    id="mode2"
                                    label="Credit"
                                    value="credit"
                                    checked={
                                      values.mode == "credit" ? true : false
                                    }
                                    onChange={handleChange}
                                    className="mx-3"
                                  />

                                  <Form.Check
                                    ref={this.radioRef}
                                    type="radio"
                                    name="mode"
                                    id="mode3"
                                    label="Multi"
                                    value="multi"
                                    checked={
                                      values.mode == "multi" ? true : false
                                    }
                                    onChange={handleChange}
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
                    transactionType={transactionType}
                    batchHideShow={true}
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    productId="TSQTIProductId-"
                    addBtnId="TSQTIAddBtn-"
                    getProductPackageLst={this.getProductPackageLst.bind(this)}
                    selectProductModal={selectProductModal}
                    selectedProduct={selectedProduct}
                    userControl={this.props.userControl}
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
                    from_source={from_source}
                    productIdRow={productId}
                    setProductId={setProductId}
                    opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
                    conversionEditData={salesEditData}
                    isConversion={true}
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
                        activeKey={currentTab}
                        // @prathmesh @batch info & product info tab active end
                        defaultActiveKey="second"
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
                                id="TSIE_Ledger_Tab"
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
                                id="TSIE_Product_Tab"
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
                                      .getElementById("TSIE_Ledger_Tab")
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
                      <Row className="mt-2 pb-2">
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
                        <Col lg={3} className="rPStyle">
                          <Form.Control
                            placeholder="0"
                            className="tnx-pur-inv-text-box px-1 mt-1 text-end"
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
                        <Col lg={5}>
                          <Form.Control
                            placeholder="0.00"
                            className="tnx-pur-inv-text-box mt-1 text-end"
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
                        <Row className="tMS">
                          <Col lg={12} className="for_remove_padding">
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
                            <td className="py-0" style={{ cursor: "pointer" }}>
                              <div className="d-flex">
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
                                >
                                  <Button
                                    className="btn_img_style"
                                    id="TSIE_add_charges_btn"
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
                                      } else {
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  >
                                    <img
                                      src={add_icon}
                                      alt=""
                                      className="btnimg"
                                    />
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
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
                              <Row>
                                <Col lg="5" md="5" className="pe-0">
                                  <InputGroup>
                                    <div className="d-flex">
                                      <Form.Control
                                        placeholder="%"
                                        className="tnx-pur-inv-text-box mt-1 text-end px-0"
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
                                      className="tnx-pur-inv-text-box mt-1 text-end px-0"
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
                              {INRformat.format(values.total_invoice_dis_amt)}
                              {/* {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )} */}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {INRformat.format(values.total_taxable_amt)}
                              {/* {parseFloat(values.total_taxable_amt).toFixed(2)} */}
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
                              <InputGroup className="  mdl-text d-flex">
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
                                    } else {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  value={values.additionalChgLedgerName3}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 300);
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
                                className="tnx-pur-inv-text-box mt-1 text-end"
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
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
                          id="TSQTI_submit_btn"
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
                            console.warn("salesEditData->>>>", salesEditData);
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
                                    from: "tranx_sales_quotation_to_invoice",
                                    to: "tranx_sales_quotation_list",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: salesEditData,
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
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_quotation_to_invoice",
                                      to: "tranx_sales_quotation_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: salesEditData,
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
                      {/* {JSON.stringify(selectedLedgerNo)} */}
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
            salesmanLst={salesmanLst}
            invoice_data={invoice_data}
            isLedgerSelectSet={isLedgerSelectSet}
            transactionTableStyle={transactionTableStyle}
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

          {/* IndirectExp Ledger Modal Starts */}
          <MdlLedgerIndirectExp
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
              this
            )}
            ledgerList={
              this.props.block.prop_data.ledgerList
                ? this.props.block.prop_data.ledgerList
                : ""
            }
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
            additionalChargesId={additionalChargesId}
            setAdditionalChargesId={setAdditionalChargesId}
            opType={opType} // @vinit @used for previous tab focus
          />
          {/* IndirectExp Ledger Modal Ends */}

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
                          let { selectedSupplier } = this.myRef.current.values;
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
                        <Row className="">
                          <div className=" tnx-pur-inv-paymentModalStyle">
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
                          </div>
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
                            </Button>
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
)(TranxSalesQuotationToInvoice);
