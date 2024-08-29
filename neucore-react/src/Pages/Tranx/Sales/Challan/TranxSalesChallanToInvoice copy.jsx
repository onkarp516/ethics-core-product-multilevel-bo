import React from "react";
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
import CMPTranxRow from "../../Components/CMPTranxRow";
import calendar2 from "@/assets/images/calendar2.png";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import mousetrap, { bind } from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  getSaleChallanWithIds,
  get_supplierlist_by_productid,
  getSalesChallanProductFpuByIds,
} from "@/services/api_functions";

import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";

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
} from "@/helpers";

import { setUserControl } from "@/redux/userControl/Action";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    border: "none",
    background: "transparent",
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
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

class TranxSalesChallanToInvoice extends React.Component {
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
    this.state = {
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
      invoice_data: {
        sales_sr_no: "",
        bill_no: "",
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
      },
      unitIds: {},
      rowDelDetailsIds: [],

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
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
    };
  }

  setLastSalesSerialNo = () => {
    // ;
    // let reqData = new FormData();
    // reqData.append("sales_type", "sales");
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          const { initVal } = this.state;
          // initVal["sales_sr_no"] = res.count;
          // initVal["bill_no"] = res.serialNo;
          this.setState({ initVal: res });
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("sales_sr_no", res.count);
            this.myRef.current.setFieldValue("bill_no", res.serialNo);
            this.myRef.current.setFieldValue(
              "transaction_dt",
              moment(new Date()).format("DD/MM/YYYY")
            );
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows });
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
            };
          });
          this.setState({ salesAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.label.toLowerCase().includes("sales a/c")
            );
            console.log("rahul:: lstSalesAccounts", { v }, v[0]);
            const { prop_data } = this.props.block;

            if (v != null && v != undefined && prop_data.invoice_data != null)
              this.myRef.current.setFieldValue("salesAccId", v[0]);
            else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            )
              this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/
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

  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    console.warn("rahul :: invoiceDate", invoiceDate);
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
              handleSuccessFn: () => {
                console.warn("rahul:: continue invoice");
              },
              handleFailFn: () => {
                console.warn("rahul:: exit from invoice or reload page");
                // this.reloadPage();
                this.invoiceDateRef.current.focus();
                setFieldValue("transaction_dt", "");
                // eventBus.dispatch("page_change", "tranx_sales_invoice_create");
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
  };

  validate_sales_invoicesFun = (salesInvoiceNo = "", setFieldValue) => {
    console.warn("rahul :: salesInvoiceNo", salesInvoiceNo);
    let requestData = new FormData();
    requestData.append("salesInvoiceNo", salesInvoiceNo);
    validate_sales_invoices(requestData)
      .then((response) => {
        console.log("res", response);
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
    // let requestData = new FormData();
    // requestData.append("product_id", product_id);
    // transaction_product_details(requestData)
    //   .then((response) => {
    //     let res = response.data;
    //     if (res.responseStatus == 200) {
    //       this.setState({
    //         productData: res.result,
    //         levelOpt: res.levelAOpt.map(function (values) {
    //           return { value: values.levela_id, label: values.levela_name };
    //         }),
    //       });
    //     }
    //   })
    //   .catch((error) => {});
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
        console.log("data------------>", data);
      }
    });
  };

  reloadPage = () => {
    console.log("reloading....");
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_create",
      to: "tranx_sales_invoice_list",
      isNewTab: false,
    });
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

  componentDidMount() {
    // console.log("props", this.props);
    if (AuthenticationCheck()) {
      this.setLastSalesSerialNo();
      // this.lstSundrydebtors();
      this.lstSalesAccounts();
      this.transaction_product_listFun();
      this.transaction_ledger_listFun();

      this.initRow();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;
      console.log("userpermission-->", this.props.userPermissions);
      console.log("prop_data ", { prop_data });
      this.handlePropsData(prop_data);

      // if ("invoice_data" in prop_data)
      //   this.setState({ invoice_data: prop_data.invoice_data });
      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      this.setState({ salesEditData: prop_data }, () => {
        if (prop_data.scBills) {
          this.getSalesQuotationProductFpuByIds();
        }
      });
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

  getSalesQuotationProductFpuByIds = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    console.log("salesEditData=-> ", salesEditData);
    let s_c_ids = salesEditData.scBills.map((v) => {
      return { id: v };
    });
    console.log("s_c_id", s_c_ids);

    reqData.append("s_c_id", JSON.stringify(s_c_ids));

    getSalesChallanProductFpuByIds(reqData)
      .then((res) => res.data)
      .then((response) => {
        if (response.responseStatus == 200) {
          let Opt = response.productIds.invoice_list.map((v) => {
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
      lstDisLedger,
      lstBrand,
    } = this.state;

    console.warn("rahul::didupdate ", {
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      salesEditData,
      lstDisLedger,
      lstBrand,
    });

    if (
      salesAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      lstBrand.length > 0 &&
      lstDisLedger.length > 0 &&
      isEditDataSet === false &&
      salesEditData !== ""
    ) {
      this.setSalesQuotationEditData();
    }
  }

  setSalesQuotationEditData = () => {
    const { salesEditData } = this.state;

    let reqData = new FormData();
    console.log("salesEditData=-> ", salesEditData);
    let sales_challan_ids = salesEditData.scBills.map((v) => {
      return { id: v };
    });
    console.log("sales_challan_ids", sales_challan_ids);

    reqData.append("sales_challan_ids", JSON.stringify(sales_challan_ids));

    getSaleChallanWithIds(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, narration } = res;
          const {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstBrand,
          } = this.state;
          let opt = [];

          console.log(
            "supplierNameLst,  supplierCodeLst,",
            supplierNameLst,
            supplierCodeLst
          );

          let initInvoiceData = {
            id: invoice_data.id,
            sales_sr_no: invoice_data.sales_sr_no,
            narration: invoice_data.narration,
            bill_no: invoice_data.sales_quotation_no,
            gstId: invoice_data.gstId,
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
            transaction_dt: moment(new Date()).format("DD/MM/YYYY"),

            salesAccId: invoice_data.sales_account_id
              ? getSelectValue(salesAccLst, invoice_data.sales_account_id)
              : "",
            clientCodeId: invoice_data.debtors_id
              ? getSelectValue(supplierCodeLst, invoice_data.debtors_id)
              : "",
            supplierNameId: invoice_data.debtors_id
              ? getSelectValue(supplierNameLst, invoice_data.debtors_id)[
                  "label"
                ]
              : "",

            tcs: res.tcs,
          };
          console.log("lstBrand", lstBrand);
          console.log("initInvoiceData", initInvoiceData);

          if (
            initInvoiceData.clientCodeId &&
            initInvoiceData.clientCodeId != ""
          ) {
            this.myRef.current.setFieldValue(
              "clientCodeId",
              initInvoiceData.clientCodeId
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
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstId);
          } else {
            initInvoiceData["gstId"] = opt[0];
          }

          this.myRef.current.setFieldValue("gstId", opt[0]);
          console.log("initInvoiceData >>>>>", initInvoiceData);
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
          console.warn("opt ", opt);

          console.log("invoice_data", invoice_data);
          console.log("row---===>", initRowData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
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
      .catch((error) => {});
  };

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
  }

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
  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
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

  handleTranxCalculation = () => {
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
        clientNameId,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;

      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      takeDiscountAmountInLumpsum =
        clientNameId != undefined
          ? clientNameId.takeDiscountAmountInLumpsum
          : "";
      isFirstDiscountPerCalculate =
        clientNameId != undefined
          ? clientNameId.isFirstDiscountPerCalculate
          : "";
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
    console.log("getFloatUnitElement", ele, rowIndex, rows);
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows, showBatch } = this.state;
    console.log("(ele, value, rowIndex) ", ele, value, rowIndex);

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
    console.log("handleFetchData", sundry_debtors_id);
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
    console.log("callCreateInvoice CreateInvoice");

    const { invoice_data, additionalChargesTotal, rows, initVal } = this.state;
    let invoiceValues = this.myRef.current.values;

    console.log("before API Call==-->>>", {
      initVal,
      invoice_data,
      invoiceValues,
    });

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

    requestData.append("debtors_id", invoice_data.clientCodeId.value);
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
        v["rate_a"] = v.rate_a;
        v["rate_b"] = v.rate_b;
        v["rate_c"] = v.rate_c;
        v["margin_per"] = v.margin_per;
        v["min_margin"] = v.min_margin;
        v["b_details_id"] = v.b_details_id != "" ? v.b_details_id : 0;
        v["b_expiry"] = moment(v.b_expiry).format("yyyy-MM-DD");
        v["manufacturing_date"] = moment(v.manufacturing_date).format(
          "yyyy-MM-DD"
        );
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
      return el != null;
    });
    requestData.append("row", JSON.stringify(filtered));
    requestData.append("additionalChargesTotal", additionalChargesTotal);
    requestData.append("sale_type", "sales");
    requestData.append("print_type", "create");

    if (
      invoiceValues.additionalChgLedger1 &&
      invoiceValues.additionalChgLedger1 !== "" &&
      invoiceValues.additionalChgLedgerAmt1 !== ""
    ) {
      requestData.append(
        "additionalChgLedger1",
        invoiceValues.additionalChgLedger1 &&
          invoiceValues.additionalChgLedger1 !== ""
          ? invoiceValues.additionalChgLedger1
          : ""
      );
      requestData.append(
        "addChgLedgerAmt1",
        invoiceValues.additionalChgLedgerAmt1 &&
          invoiceValues.additionalChgLedgerAmt1 !== ""
          ? invoiceValues.additionalChgLedgerAmt1
          : 0
      );
    }
    if (
      invoiceValues.additionalChgLedger2 &&
      invoiceValues.additionalChgLedger2 !== "" &&
      invoiceValues.additionalChgLedgerAmt2 !== ""
    ) {
      requestData.append(
        "additionalChgLedger2",
        invoiceValues.additionalChgLedger2 &&
          invoiceValues.additionalChgLedger2 !== ""
          ? invoiceValues.additionalChgLedger2
          : ""
      );
      requestData.append(
        "addChgLedgerAmt2",
        invoiceValues.additionalChgLedgerAmt2 &&
          invoiceValues.additionalChgLedgerAmt2 !== ""
          ? invoiceValues.additionalChgLedgerAmt2
          : 0
      );
    }
    if (
      invoiceValues.additionalChgLedger3 &&
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
      invoice_data.clientNameId &&
      invoice_data.clientNameId.state !=
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

    createSalesInvoice(requestData)
      .then((response) => {
        // ;
        console.log("in create");
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
          eventBus.dispatch("page_change", "tranx_sales_invoice_list");
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
    console.log("id Invoice----", id);
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

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    console.warn(" rahul rowValue ::", showBatch, rowIndex, rowValue);
    this.setState({ rows: rowValue }, () => {
      if (showBatch == true && rowIndex >= 0) {
        this.setState(
          {
            rowIndex: rowIndex,
          },
          () => {
            console.warn(" rahul getProductBatchList ::");
            this.getProductBatchList(rowIndex);
          }
        );
      }

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

  getProductBatchList = (rowIndex) => {
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

    console.warn({ unit_id });

    let isfound = false;
    let batchOpt = [];
    let productData = getSelectValue(lstBrand, product_id);
    console.log("productData", productData);
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
                this.getInitBatchValue(rowIndex);
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
          this.getInitBatchValue(rowIndex);
        }
      );
    }
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
  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
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

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
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

  render() {
    const {
      add_button_flag,
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
              supplierNameId: Yup.string()
                .nullable()
                .required("Client Name isRequired"),
              transaction_dt: Yup.string().required("Invoice Date is Required"),
              // bill_no: Yup.string().trim().required("Invoice No. is Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("inside onSubmit >>>", values);
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to save",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    this.setState({
                      invoice_data: values,
                      opendiv: false,
                    });
                    let { clientCodeId } = this.myRef.current.values;
                    if (clientCodeId) {
                      this.handleFetchData(clientCodeId.value);
                    }
                    console.log("clientCodeId", values);
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
              setTouched,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
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

                          <Col lg={3} md={3} sm={3} xs={3}>
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
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style "
                                  name="transaction_dt"
                                  id="transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  value={values.transaction_dt}
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
                                        "rahul:: isValid",
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
                                />
                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col
                                lg={3}
                                md={3}
                                sm={3}
                                xs={3}
                                className="px-0 my-auto"
                              >
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <div className="d-flex w-100">
                                  <Form.Control
                                    type="button"
                                    className="tnx-pur-inv-text-box text-start"
                                    placeholder="Ledger Name"
                                    name="supplierNameId"
                                    id="supplierNameId"
                                    onChange={handleChange}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.ledgerModalFun(true);
                                    }}
                                    readOnly={true}
                                    value={
                                      values.supplierNameId != ""
                                        ? values.supplierNameId
                                        : ""
                                    }
                                  />
                                </div>

                                <span className="text-danger errormsg">
                                  {touched.supplierNameId &&
                                    errors.supplierNameId}
                                </span>
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
                                <Select
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
                                  name="salesAccId"
                                  onChange={(v) => {
                                    setFieldValue("salesAccId", v);
                                  }}
                                  value={values.salesAccId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.salesAccId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="mt-2 "
                              >
                                <Form.Label>
                                  Invoice No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                className="mt-2 "
                              >
                                {" "}
                                <Form.Control
                                  type="text"
                                  placeholder="Order No."
                                  name="bill_no"
                                  id="bill_no"
                                  className="tnx-pur-inv-text-box"
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
                                      this.validate_sales_invoicesFun(
                                        e.target.value,
                                        setFieldValue
                                      );
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
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="px-0 my-auto"
                              >
                                <Form.Label>Salesman</Form.Label>
                              </Col>

                              <Col
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                className="mt-2 "
                              >
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  placeholder="Salesman"
                                  name="salesman"
                                  id="salesman"
                                  value={values.salesman}
                                  readOnly
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                  <div class="outer-wrapper">
                    <div class="table-wrapper">
                      <div className="tnx-pur-inv-tbl-style">
                        <Table>
                          <thead
                            style={{
                              border: "1px solid #A8ADB3",
                            }}
                          >
                            <tr>
                              <th className="py-1 sr_no_width">Sr. No.</th>

                              <th className="particulars_width">Particulars</th>

                              {ABC_flag_value == "A" ||
                              ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <th
                                  className={`${
                                    ABC_flag_value == "A"
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

                              {ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <th
                                  className={`${
                                    ABC_flag_value == "AB"
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
                                  className={`${
                                    ABC_flag_value == "ABC"
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

                              <th className="py-1 unit_width">Unit</th>

                              <th className="batch_width">Batch No</th>

                              <th className="qty_width">Quantity</th>

                              {isFreeQtyExist(
                                "is_free_qty",
                                this.props.userControl
                              ) && <th className="free_width">Free</th>}
                              <th className="rate_width">Rate</th>

                              <th className="gross_width">Gross Amount</th>

                              <th className="py-1 dis1_width">
                                1-Dis.
                                <br />%
                              </th>

                              {isMultiDiscountExist(
                                "is_multi_discount",
                                this.props.userControl
                              ) && (
                                <th className="py-1 dis2_width">
                                  2-Dis.
                                  <br />%
                                </th>
                              )}
                              <th className="py-1 disR_width">
                                Disc.
                                <br />₹
                              </th>

                              <th className="py-1 tax_width">
                                Tax
                                <br />%
                              </th>

                              <th className="netAmt_width">Net Amount</th>

                              <th className="add_del_btn_width"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows &&
                              rows.length > 0 &&
                              rows.map((vi, ri) => {
                                return (
                                  <tr
                                    style={{
                                      borderbottom: "1px solid #D9D9D9",
                                    }}
                                    onMouseOver={(e) => {
                                      if (rows[ri]["productId"] !== "") {
                                        this.transaction_product_Hover_detailsFun(
                                          vi.productId
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
                                          this.get_supplierlist_by_productidFun(
                                            vi.productId
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
                                        styles={particularsDD}
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
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
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
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
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
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
                                            rows[ri]["levelcId"] = value;
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
                                          this.handleUnitChange(
                                            "unitId",
                                            value,
                                            ri
                                          );
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
                                          this.handleUnitChange(
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
                                            this.handleUnitChange(
                                              "free_qty",
                                              e.target.value,
                                              ri
                                            );
                                          }}
                                          onBlur={(e) => {
                                            if (
                                              parseInt(rows[ri]["qty"]) <
                                                parseInt(
                                                  rows[ri]["free_qty"]
                                                ) ===
                                              true
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Free Qty should be less than Qty",
                                              });
                                              this.handleUnitChange(
                                                "free_qty",
                                                0,
                                                ri
                                              );
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
                                          this.handleUnitChange(
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
                                      {/* <Form.Control
                                    id={`grossAmt-${ri}`}
                                    name={`grossAmt-${ri}`}
                                    className="table-text-box border-0"
                                    type="text"
                                    placeholder="99999999.00"
                                    // value={rows[ri]["total_base_amt"]}
                                    value={this.getFloatUnitElement(
                                      "gross_amt",
                                      ri
                                    )}
                                    readOnly
                                  /> */}
                                    </td>

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
                                            this.handleUnitChange(
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
                                          this.handleUnitChange(
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
                                      />
                                    </td>

                                    <td className="d-flex">
                                      {rows.length > 1 && (
                                        <Button
                                          className="btn_img_style"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.handleRemoveRow(ri);
                                            this.setState({
                                              add_button_flag: true,
                                            });
                                          }}
                                        >
                                          <img
                                            isDisabled={
                                              rows.length === 0 ? true : false
                                            }
                                            src={TableDelete}
                                            alt=""
                                            className="btnimg"
                                          />
                                        </Button>
                                      )}
                                      {add_button_flag === true &&
                                        this.checkLastRow(
                                          ri,
                                          rows.length - 1,
                                          vi,
                                          rows[ri]["unitId"],
                                          rows[ri]["qty"]
                                        ) && (
                                          <Button
                                            className="btn_img_style"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              this.handleAddRow();
                                              this.setState({
                                                add_button_flag:
                                                  !add_button_flag,
                                              });
                                            }}
                                          >
                                            <img
                                              src={add_icon}
                                              alt=""
                                              className="btnimg"
                                            />
                                          </Button>
                                        )}
                                      {add_button_flag === true &&
                                        this.checkLastRow(
                                          ri,
                                          rows.length - 1,
                                          vi,
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
                                                add_button_flag:
                                                  !add_button_flag,
                                              });
                                            }}
                                          />
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

                  <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={1} className="my-auto">
                      <span className="span-lable">HSN:</span>
                      <span className="span-value">
                        {" "}
                        {product_hover_details.hsn}
                      </span>
                      <span className="custom_hr_style">|</span>
                    </Col>
                    <Col lg={1} className="my-auto">
                      <span className="span-lable">Tax Type:</span>
                      <span className="span-value">
                        {" "}
                        {product_hover_details.tax_type}
                      </span>
                      <span className="custom_hr_style">|</span>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Batch Expiry:</span>
                          <span className="span-value">
                            {" "}
                            {product_hover_details.batch_expiry}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {" "}
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
                            {" "}
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
                            {product_hover_details.packing}
                          </span>
                        </Col>
                        {/* <Col lg={6} className="my-auto">
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">{product_hover_details.tax_type}</span>
                          <span className="custom_hr_style">|</span>
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
                                    <td>{v.mrp}</td>
                                    <td>{v.quantity}</td>
                                    <td>{v.rate}</td>
                                    <td>{v.cost}</td>
                                    <td>{v.dis_per}</td>
                                    <td>{v.dis_amt}</td>
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
                          className="my-auto ps-1"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="0"
                            className="tnx-pur-inv-text-box px-1"
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
                            className="tnx-pur-inv-text-box"
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
                            value={values.sales_discount_amt}
                          />
                        </Col>
                      </Row>
                      <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                      />
                      <Row>
                        <Col lg={6} className="for_remove_padding">
                          <span className="tnx-pur-inv-span-text">
                            Total Qty:
                          </span>
                          <span>{values.total_qty}</span>
                        </Col>
                        <Row className="tMS">
                          <Col lg={6} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span>
                              {parseFloat(values.roundoff).toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                        <Row className="tMS">
                          <Col lg={6} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span>
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
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
                                className="tnx-pur-inv-text-box mt-1"
                                name="additionalChgLedgerName1"
                                id="additionalChgLedgerName1"
                                styles={purchaseSelect}
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
                                  }, 150);
                                }}
                                value={values.additionalChgLedgerName1}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 100);
                                }}
                              />
                              {/* <Select
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.ledgerNameModalFun(true);
                                }}
                                value={values.additionalChgLedger1}
                              /> */}
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1"
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
                                styles={purchaseSelect}
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
                                styles={purchaseSelect}
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
                      <p
                        className="btm-row-size d-flex"
                        style={{ float: "right" }}
                      >
                        <Button className="successbtn-style" type="submit">
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
                                msg: "Do you want to cancel",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_sales_invoice_list"
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
                          Cancel
                        </Button>
                      </p>
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

          {/* serial no start */}
          <Modal
            show={serialnopopupwindow}
            size="sm"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ serialnopopupwindow: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Serial No.
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                <Form className="serailnoscreoolbar">
                  <Table className="serialnotbl">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Serial No.</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderSerialNo()}</tbody>
                  </Table>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSerialNoSubmit();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* additional charges */}
          <Modal
            show={additionchargesyes}
            // size="sm"
            className="mt-5 mainmodal"
            onHide={() => this.handleAdditionalChargesHide()}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="dark"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Additional Charges
              </Modal.Title>
              {/* <CloseButton
              variant="white"
              className="pull-right"
              onClick={() => this.handleAdditionalChargesSubmit(false)}
            /> */}
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                {additionalCharges.length > 0 && (
                  <Table className="serialnotbl additionachargestbl  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>
                          Ledger
                          <img
                            src={add}
                            className="add-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "create",
                                  this.props.userPermissions
                                )
                              ) {
                                eventBus.dispatch("page_change", {
                                  from: "tranx_sales_invoice_create",
                                  to: "ledgercreate",
                                  prop_data: {
                                    from_page: "tranx_sales_invoice_create",
                                    rows: rows,
                                    invoice_data: invoice_data,
                                    mdl_additionalcharges: true,
                                  },
                                  isNewTab: false,
                                });
                                // eventBus.dispatch(
                                //   "page_change",
                                //   "ledgercreate"
                                // );
                                let prop_data = {
                                  sundary_creditor_from_purchase:
                                    "sundry_creditors",
                                };
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
                          ></img>
                        </th>
                        <th> Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalCharges.map((v, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td style={{ width: "75%" }}>
                              <Select
                                className="selectTo"
                                components={{
                                  DropdownIndicator: () => null,
                                  IndicatorSeparator: () => null,
                                }}
                                placeholder=""
                                styles={customStyles1}
                                isClearable
                                options={lstAdditionalLedger}
                                borderRadius="0px"
                                colors="#729"
                                onChange={(value) => {
                                  this.handleAdditionalCharges(
                                    "ledgerId",
                                    i,
                                    value
                                  );
                                }}
                                value={this.setAdditionalCharges("ledgerId", i)}
                              />
                            </td>
                            <td className="additionamt pr-5 pl-1">
                              <Form.Control
                                type="text"
                                placeholder=""
                                onChange={(value) => {
                                  this.handleAdditionalCharges(
                                    "amt",
                                    i,
                                    value.target.value
                                  );
                                }}
                                value={this.setAdditionalCharges("amt", i)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          Total:{" "}
                        </td>
                        <td clasName="additionamt pr-5 pl-1">
                          <Form.Control
                            type="text"
                            placeholder=""
                            // onChange={(value) => {
                            //   console.log(value);
                            // }}
                            readOnly
                            value={additionalChargesTotal}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="p-0">
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();

                  this.handleAdditionalChargesHide();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

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
                console.log("values", values);
                // debugger;
                const {
                  invoice_data,
                  additionalCharges,
                  additionalChargesTotal,
                  rows,
                  initVal,
                  supplierNameLst,
                  salesAccLst,
                } = this.state;
                // this.handleFetchData(values);
                let invoiceValues = this.myRef.current.values;
                // let paymentvalues = this.paymentRef.current.values;
                // console.log("paymentvalues", paymentvalues);

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
                console.log("bal", bal);
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
                    invoiceValues.gstId !== "" ? invoiceValues.gstId.label : ""
                  );

                  requestData.append(
                    "debtors_id",
                    invoice_data.clientNameId.value
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
                              vc["subcategoryDetails"] =
                                vc.subcategoryDetails.map((vs) => {
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
                  console.log("frow =->", frow);
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

                  if (
                    authenticationService.currentUserValue.state &&
                    invoice_data &&
                    invoice_data.clientNameId &&
                    invoice_data.clientNameId.state !=
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

                  console.log("requestData", requestData.values());
                  // List key/value pairs
                  for (let [name, value] of requestData) {
                    console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
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
                            //  this.getInvoiceBillsLstPrint(invoiceValues.bill_no);
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
                console.log("form submit values", values);
                // debugger;
                // this.handleFetchData(values);
                let { clientNameId } = this.myRef.current.values;
                if (clientNameId) {
                  this.handleFetchData(clientNameId.value);
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
                        ? this.handleFetchData(invoice_data.clientNameId.value)
                        : null} */}
                      {/* this.handleFetchData(invoice_data.clientNameId.value); */}
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

          {/* New Batch Modal */}
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
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 2
                    ) {
                      salesrate = b_details_id.min_rate_b;
                    } else if (
                      this.myRef.current.values &&
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 3
                    ) {
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
                    rows[rowIndex]["b_purchase_rate"] =
                      b_details_id.purchase_rate;
                    rows[rowIndex]["costing"] = b_details_id.costing;
                    rows[rowIndex]["cost_with_tax"] =
                      b_details_id.costingWithTax;

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
                    rows[rowIndex]["costing"] = invoice_data.costingWithTax;
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
                  console.log("batch modal rows ", rows[rowIndex]);
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
                            <th>Retailer Rate</th>
                            <th>Distributor Rate</th>
                            <th>Stockist Rate</th>
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
                                className={`${
                                  is_expired != true
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
                                <td>{v.min_rate_a}</td>
                                <td>{v.min_rate_b}</td>
                                <td>{v.min_rate_c}</td>
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
                    {/* <div className=" mt-5">
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
                    <Row>
                      <Col md="12 p-3" className="btn_align">
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
                            this.setState({ newBatchModal: false });
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

          {/* ledgr Modal */}
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
                          scBills: this.state.salesEditData.scBills,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "tranx_sales_challan_to_invoice",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_sales_challan_to_invoice",
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
                <Table hover>
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
                          className={`${
                            JSON.stringify(v) == JSON.stringify(selectedLedger)
                              ? "selected-tr"
                              : ""
                          }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ selectedLedger });
                            if (selectedLedger != "") {
                              if (this.myRef.current) {
                                let opt = [];
                                if (selectedLedger != null) {
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
                                  selectedLedger != "" ? selectedLedger.id : ""
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
                              this.setState({
                                ledgerModal: false,
                                // invoice_data: invoice_data,
                                selectedLedger: "",
                              });
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
                                    scBills: this.state.salesEditData.scBills,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "tranx_sales_challan_to_invoice",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_challan_to_invoice",
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
                                      handleFailFn: () => {},
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
              <div className="mt-5">
                <Row className="mx-1">
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          GST No.:
                        </Form.Label>
                      </Col>
                      <Col lg={8} className="sub_col_style">
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.gst_number : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label ">
                          Licence No.:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.license_number : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label ">
                          FSSAI:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.fssai_number : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={5}>
                        <Form.Label className="colored_label ">
                          Contact Person:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.contact_name : ""}
                        </p>
                      </Col>
                      <Col lg={5}>
                        <Form.Label className="colored_label ">
                          Area:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.area : ""}
                        </p>
                      </Col>
                      <Col lg={5}>
                        <Form.Label className="colored_label ">
                          Route:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.route : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label ">
                          Credit Days:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.credit_days : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label ">
                          Transport:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.route : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label ">
                          Bank:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.bank_name : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col md="12 p-3" className="btn_align">
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
          {/* select Product modal */}
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
                          scBills: this.state.salesEditData.scBills,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "tranx_sales_challan_to_invoice",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_sales_challan_to_invoice",
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
                          className={`${
                            JSON.stringify(pv) ==
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
                              rows[rowIndex]["levelAOpt"] =
                                levelOpt.length > 0 ? levelOpt : [];

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
                              this.get_supplierlist_by_productidFun(pv.id);
                            });
                            this.setState({ add_button_flag: true });
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
                                    scBills: this.state.salesEditData.scBills,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "tranx_sales_challan_to_invoice",
                                  };

                                  let data = {
                                    source: source,
                                    id: pv.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_challan_to_invoice",
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
                                    handleFailFn: () => {},
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
              <div className="mt-5">
                <Row className="mx-1">
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Brand:
                        </Form.Label>
                      </Col>
                      <Col lg={8} className="sub_col_style">
                        <p className="colored_sub_text">
                          {productData != "" ? productData.brand : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Group:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.group : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Category:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.category : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
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
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label">HSN:</Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.hsn : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Tax Type:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.tax_type : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Tax %:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.tax_per : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
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
                  <Col lg={4} className="tbl-color">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label">Cost:</Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.cost : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
                          Shelf ID:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {productData != "" ? productData.shelf_id : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label">
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
                        <Form.Label className="colored_label ">
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
)(TranxSalesChallanToInvoice);
