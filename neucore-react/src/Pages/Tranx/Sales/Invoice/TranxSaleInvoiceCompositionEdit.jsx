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

import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import {
  getSundryDebtors,
  getSalesAccounts,
  getProduct,
  getAdditionalLedgers,
  authenticationService,
  get_outstanding_sales_return_amt,
  getSundryDebtorsIdClient,
  getSalesInvoiceById,
  editSalesInvoice,
  listTranxCreditNotes,
  getInvoiceBill,
  get_Product_batch,
  getSalesInvoiceProductFpuById,
  getProductFlavourList,
  checkInvoiceDateIsBetweenFY,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  transaction_ledger_list,
  transaction_product_list,
  transaction_ledger_details,
  validate_sales_invoices_update,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  getLastSalesInvoiceNo,
  delete_Product_list,
  getSalesInvoiceSupplierListByProductId,
  quantityVerificationById,
  getCBADReceipt,
  get_supplierlist_by_productid,
  getSalesmanMasterOutlet,
  createSalesInvoice,
  removeInstance,
  get_sales_comp_invoice_product_fpu_by_id,
  get_sales_comp_invoice_by_id,
  edit_sales_comp_invoices,
} from "@/services/api_functions";
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
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";
import calendar2 from "@/assets/images/calendar2.png";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import add_icon from "@/assets/images/add_icon.svg";

import {
  getSelectValue,
  ShowNotification,
  calculatePrValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  CheckIsRegisterdCompany,
  purchaseSelect,
  fnTranxCalculation,
  fnTranxCalculationRoundDecimalPlaces,
  MyTextDatePicker,
  isActionExist,
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
  OnlyEnterAmount,
  OnlyEnterNumbers,
  addDataLock,
  removeDataLock,
  checkDataLockExist,
  roundDigit,
  configDecimalPlaces,
  fnTranxCalculationInComposition,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import CmpTRowComposition from "@/Pages/Tranx/CMP/CmpTRowComposition";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";

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

class TranxSalesInvoiceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.inputRef1 = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below

    this.state = {
      ldview: 0,
      currentTab: "second", //@prathmesh @batch info & product info tab active
      sourceUnder: "sale",
      isTextBox: false,

      transactionTableStyle: "salesssss",
      product_supplier_lst: [],
      selectedBillsdebit: [],
      isEditDataSet: false,
      show: false,
      isBranch: false,
      opendiv: false,
      hidediv: false,
      //   invoice_data: "",
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      productLst: [],
      unitLst: [],
      rows: [],
      salesmanLst: [],
      serialnopopupwindow: false,
      Clietdetailmodal: false,
      adjusmentbillmodal: false,
      clientinfo: [],
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      outstanding_sales_return_amt: 0,
      salesEditData: "",
      isEditDataSet: false,
      lstBrand: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      rowDelDetailsIds: [],
      billLst: [],
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      selectedSaleRate: "",
      modeCheck: [],
      modeStatus: false,
      totalAmount: "",
      returnAmount: "",
      pendingAmount: "",
      selectSerialModal: false,
      isLedgerSelectSet: false,
      add_button_flag: false,
      isRowProductSet: false,
      batchHideShow: false,
      batch_data_selected: "",
      cashAcbankLst: "",
      serialNoLst: [],
      sourceUnder: "sale",

      ledgerType: "SD",
      updatedLedgerType: "SD",
      invoice_data: {
        selectedSupplier: "",
        sales_sr_no: "",
        bill_no: "",
        selectedSupplier: "",
        salesmanId: "",
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
        sales_discount_amt: 0,
        total_sales_discount_amt: 0,
        total_purchase_discount_amt: 0,
        mode: "",
        modes: "",
        client_name: "",
        client_address: "",
        mobile_number: "",
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
        additionalCharges: "",

        total_qty: 0,
        total_free_qty: 0,
        bill_amount: 0,
        total_row_gross_amt1: 0,
        tcs_amt: 0,
        tcs_per: 0,
        tcs_mode: "",
      },
      lstGst: [],
      saleRateType: "sale",
      transactionType: "sales_edit",
      batchHideShow: true,
      delAdditionalCahrgesLst: [],
      gstId: "",
      productData: "",
      ledgerModal: false,
      additionalCharges: "",

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
      ledgerDataIndExp: "",
      selectedLedger: "",
      currentLedgerData: "",
      selectedLedgerIndExp: "",
      selectedProduct: "",
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
      errorArrayBorder: "",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      ledgerId: "",
      setLedgerId: false,
      from_source: "tranx_sales_invoice_edit",
      isAllCheckeddebit: false,
      adjustbillshow: false,
      selectedBillsdebit: [],
      // datalockSlug: ""
      isRoundOffCheck: true,
      ledgerInputData: "",
      // type: "edit",
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab

      additionalCharges: [],
      additionalDelDetailsIds: [],
      additionalChargesId: "",
      setAdditionalChargesId: false,

      ledgerNameFlag: false, // ! for focus
    };
    this.selectRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();

    this.radioRef = React.createRef();
    this.selectGstClientRef = React.createRef();
    this.selectSalesAccRef = React.createRef();
  }
  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end
  getProductFlavorpackageUnitbyids = (invoice_id) => {
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    get_sales_comp_invoice_product_fpu_by_id(reqData)
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

          this.setState({ lstBrand: Opt }, () => {});
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstPackages: [] }, () => {});
      });
  };

  get_outstanding_sales_return_amtFun = (sundry_debtors_id) => {
    let reqData = new FormData();
    reqData.append("sundry_debtors_id", sundry_debtors_id);
    get_outstanding_sales_return_amt(reqData)
      .then((response) => {
        //console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            isEditDataSet: true,
            outstanding_sales_return_amt: res.balance,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

            const { prop_data } = this.props.block;
            //console.log("prop_data", prop_data);
            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["salesAccId"] = v[0];
              this.setState({ invoice_data: init_d });
            }
            // this.myRef.current.setFieldValue("salesAccId", v[0]);
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

  finalInvoiceAmt = () => {
    let returnValues = this.myRef.current.values;
    // requestData.append('totalamt', returnValues.totalamt);
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  handleBillselectionCredit = (id, index, status) => {
    let { billLst, selectedBillsdebit } = this.state;
    //console.log({ id, index, status, selectedBillsdebit });
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

  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // //console.log("res", response);

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
  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    reqData.append("source", "sales_invoice");
    getInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        //console.log("responseData ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.product_details,
        });

        if ("ledgerId" in this.state.source != "") {
          eventBus.dispatch("page_change", {
            from: "tranx_sales_invoice_edit",
            to: "ledgerdetails",
            prop_data: this.state.source["ledgerId"],

            isNewTab: false,
          });
          // this.setState({ source: "" });
        } else {
          // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
          eventBus.dispatch("page_change", {
            from: "tranx_sales_invoice_edit",
            to: "tranx_sales_invoice_list",
            isNewTab: false,
            isCancel: true,
          });
        }

        // eventBus.dispatch("page_change", {
        //   // from: "tranx_sales_invoice_edit",
        //   to: "tranx_sales_invoice_list",
        //   isNewTab: false,
        // });
      }
    });
  };

  handleClientForm = () => {
    this.handleClientDetails(true);
  };

  handleFetchData = (sundry_debtors_id) => {
    // debugger;
    const { billLst } = this.state;
    let reqData = new FormData();

    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;

        //console.log({ res });
        // ;
        let data = res.list;
        if (data.length == 0) {
          //console.log("Else.....>");
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

  handleAdditionalChargesHide = () => {
    this.setState({ ledgerModalIndExp: false }, () => {
      this.handleTranxCalculation();
    });
  };

  callCreateInvoice = () => {
    const {
      invoice_data,
      additionalCharges,
      additionalChargesTotal,
      outstanding_sales_return_amt,
      rowDelDetailsIds,
      rows,
      delAdditionalCahrgesLst,
      cashAcbankLst,
      totalAmount,
      returnAmount,
      pendingAmount,
      isRoundOffCheck,
    } = this.state;
    let values = this.myRef.current.values;
    //console.log("callCreateInvoice CreateInvoice ", values);

    let requestData = new FormData();
    requestData.append("id", invoice_data.id);
    requestData.append("newReference", "NO");
    requestData.append(
      "outstanding_sales_return_amt",
      outstanding_sales_return_amt
    );

    // !Invoice Data
    requestData.append(
      "bill_dt",
      moment(
        new Date(moment(invoice_data.transaction_dt, "DD/MM/YYYY").toDate())
      ).format("YYYY-MM-DD")
    );
    requestData.append("bill_no", invoice_data.bill_no);
    requestData.append("sales_acc_id", invoice_data.salesAccId.value);
    requestData.append("sales_sr_no", invoice_data.sales_sr_no);
    requestData.append(
      "client_name",
      invoice_data.client_name && invoice_data.client_name != ""
        ? invoice_data.client_name
        : ""
    );
    requestData.append(
      "client_address",
      invoice_data.client_address && invoice_data.client_address != ""
        ? invoice_data.client_address
        : ""
    );
    requestData.append(
      "mobile_number",
      invoice_data.mobile_number && invoice_data.mobile_number != ""
        ? invoice_data.mobile_number
        : ""
    );
    requestData.append(
      "gstNo",
      invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
    );
    requestData.append("debtors_id", invoice_data.selectedSupplier.id);
    if (values.narration && values.narration !== "") {
      requestData.append("narration", values.narration);
    }
    // !Invoice Data
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
    requestData.append("isRoundOffCheck", isRoundOffCheck);
    requestData.append("roundoff", values.roundoff);
    // requestData.append("narration", values.narration);
    requestData.append("total_base_amt", values.total_base_amt);
    requestData.append("totalamt", values.totalamt);
    requestData.append("taxable_amount", values.total_taxable_amt);
    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);
    requestData.append(
      "totalqty",
      values.totalqty && values.totalqty != "" ? values.totalqty : 0
    );
    // requestData.append("tcs", values.tcs && values.tcs != "" ? values.tcs : 0);
    requestData.append(
      "tcs_per",
      values.tcs_per && values.tcs_per != "" ? values.tcs_per : 0
    );
    requestData.append(
      "tcs_amt",
      values.tcs_amt && values.tcs_amt != "" ? values.tcs_amt : 0
    );
    requestData.append(
      "tcs_mode",
      values.tcs_mode && values.tcs_mode != "" ? values.tcs_mode : ""
    );

    requestData.append(
      "sales_discount",
      values.purchase_discount && values.purchase_discount != ""
        ? values.purchase_discount
        : 0
    );

    requestData.append(
      "total_sales_discount_amt",
      values.total_purchase_discount_amt &&
        values.total_purchase_discount_amt != ""
        ? values.total_purchase_discount_amt
        : 0
    );

    requestData.append(
      "sales_discount_amt",
      values.purchase_discount_amt && values.purchase_discount_amt != ""
        ? values.purchase_discount_amt
        : 0
    );

    requestData.append(
      "sales_disc_ledger",
      values.sales_disc_ledger ? values.sales_disc_ledger.value : 0
    );
    let frow = [];
    rows.map((v, i) => {
      if (v.productId != "") {
        let newObj = {
          details_id: v.details_id ? v.details_id : 0,
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
          b_expiry:
            v.b_expiry != "" ? moment(v.b_expiry).format("yyyy-MM-DD") : "",
          sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
          rate_a: v.rate_a,
          rate_b: v.rate_b,
          rate_c: v.rate_c,
          min_margin: v.min_margin,
          margin_per: v.margin_per,
          manufacturing_date:
            v.manufacturing_date != ""
              ? moment(v.manufacturing_date).format("yyyy-MM-DD")
              : "",
          isBatchNo: v.b_no,

          reference_type: v.reference_type,
          reference_id: v.reference_id != "" ? v.reference_id : 0,
        };
        //console.log("newObj >>>> ", newObj);
        frow.push(newObj);
        //console.log("frow ----------- ", frow);
      }
    });

    //console.log("frow in edit", frow);

    var filtered = frow.filter(function (el) {
      return el && el != null;
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

    requestData.append("sale_type", "sales_invoice");
    requestData.append(
      "salesmanId",
      invoice_data.salesmanId ? invoice_data.salesmanId.value : ""
    );
    requestData.append("paymentMode", invoice_data.mode);
    if (invoice_data.mode == "multi") {
      requestData.append("payment_type", JSON.stringify(cashAcbankLst));
      requestData.append("p_totalAmount", totalAmount);
      requestData.append("p_returnAmount", returnAmount);
      requestData.append("p_pendingAmount", pendingAmount);
    }

    if (
      values.additionalChgLedger1 !== "" &&
      values.additionalChgLedgerAmt1 !== ""
    ) {
      requestData.append(
        "additionalChgLedger1",
        values.additionalChgLedger1 !== "" ? values.additionalChgLedger1 : ""
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
        values.additionalChgLedger2 !== "" ? values.additionalChgLedger2 : ""
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
        values.additionalChgLedger3 !== "" ? values.additionalChgLedger3 : ""
      );
      requestData.append(
        "addChgLedgerAmt3",
        values.additionalChgLedgerAmt3 !== ""
          ? values.additionalChgLedgerAmt3
          : 0
      );
    }

    if (
      invoice_data.gstId &&
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
      // //console.log("taxCal", taxCal);
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
    //console.log("filterRowDetail", filterRowDetail);
    requestData.append("rowDelDetailsIds", JSON.stringify(filterRowDetail));

    if (values.total_qty !== "") {
      requestData.append(
        "total_qty",
        values.total_qty !== "" ? parseInt(values.total_qty) : 0
      );
    }
    if (values.total_free_qty !== "") {
      requestData.append(
        "total_free_qty",
        values.total_free_qty !== "" ? values.total_free_qty : 0
      );
    }

    // !Total Qty*Rate
    requestData.append("total_row_gross_amt", values.total_row_gross_amt);
    requestData.append("total_base_amt", values.total_base_amt);
    // !Discount
    requestData.append("total_invoice_dis_amt", values.total_invoice_dis_amt);
    // !Taxable Amount
    requestData.append("taxable_amount", values.total_taxable_amt);
    // !Taxable Amount
    requestData.append("total_tax_amt", values.total_tax_amt);
    // !Bill Amount
    requestData.append("bill_amount", values.bill_amount);

    edit_sales_comp_invoices(requestData)
      .then((response) => {
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
                // this.setState({ paymentModeModal: false });

                // eventBus.dispatch("page_change", "tranx_sales_invoice_list");

                this.getInvoiceBillsLstPrint(invoice_data.bill_no);
              },
              handleFailFn: () => {
                // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
                if ("ledgerId" in this.state.source != "") {
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_invoice_edit",
                    to: "ledgerdetails",
                    // prop_data: {
                    //   editId: this.state.source["ledgerId"],
                    //   rowId: this.props.block.prop_data.rowId,
                    // },
                    // prop_data: this.state.source["ledgerId"],
                    prop_data: {
                      prop_data: this.state.source["ledgerId"],
                      ldview: this.props.block.prop_data.ldview,
                    },
                    isNewTab: false,
                  });
                  // this.setState({ source: "" });
                } else {
                  // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_invoice_composition_edit",
                    to: "tranx_sales_invoice_composition_list",
                    prop_data: {
                      editId: this.state.salesEditData.id,
                      rowId: this.props.block.prop_data.rowId,
                    },
                    isCancel: true,
                    isNewTab: false,
                  });
                }
              },
            },
            () => {
              // console.warn("return_data");
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

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
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

  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
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

  setSalesInvoiceEditData = () => {
    // console.log("is sales Edit");
    const { id } = this.state.salesEditData;
    //console.log("Id in setSalesEdidt", this.state.salesEditData.id);
    let formData = new FormData();
    formData.append("id", id);
    get_sales_comp_invoice_by_id(formData)
      .then((response) => {
        let res = response.data;
        //console.log("Sale Invoice Edit data", res);
        if (res.responseStatus === 200) {
          let { invoice_data, row, payment_type } = res;
          console.log("invoice_Data-->", invoice_data, row);
          const {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            lstAdditionalLedger,
            lstDisLedger,
            lstBrand,
            salesmanLst,
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
            mode: invoice_data.paymentMode,
            salesmanId:
              invoice_data.salesmanId != ""
                ? getSelectValue(salesmanLst, parseInt(invoice_data.salesmanId))
                : "",

            // supplierCodeId: invoice_data.debtor_id ? invoice_data.debtor_id : "",

            // supplierCodeId: invoice_data.debtor_id
            //   ? getSelectValue(supplierCodeLst, invoice_data.debtor_id)
            //   : ",
            // supplierNameId: invoice_data.debtor_id
            //   ? getSelectValue(supplierNameLst, invoice_data.debtor_id)["label"]
            //   : "",

            // supplierNameId: invoice_data.debtor_name
            //   ? invoice_data.debtor_name
            //   : "",
            roundoff: invoice_data.roundoff != "" ? invoice_data.roundoff : 0,

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
          };

          if (
            initInvoiceData.supplierNameId &&
            initInvoiceData.supplierNameId != ""
          ) {
            opt = initInvoiceData.supplierNameId.gstDetails.map((v, i) => {
              return {
                label: v.gstNo,
                value: v.id,
              };
            });
          }

          let initRowData = [];
          if (row.length > 0) {
            //console.log("Rowsssss------->", row);
            initRowData = row.map((v, i) => {
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              //console.log("productOpt", productOpt);

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
              v["org_rate"] = v.rate != "" ? v.rate : 0;
              v["rate"] = "";
              v["base_amt"] =
                v.base_amt != "" && v.base_amt != null ? v.base_amt : 0;
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

          if (initInvoiceData.gstNo != "")
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;
          let paymentData = [];
          let totalAmt = 0;
          //console.log("payment_type", payment_type);
          if (payment_type.length > 0) {
            paymentData = payment_type.map((vi, ii) => {
              vi["id"] = vi.id;
              vi["ledger_id"] = vi.ledger_id;
              vi["type"] = vi.type;
              vi["value"] = vi.ledger_id;
              vi["label"] = vi.label;
              vi["amount"] = vi.amount;

              return vi;
            });
          }

          //console.log("paymentData", paymentData);
          //console.log("initInvoiceData", initInvoiceData);
          // let returnAmt = (invoice_data.p_totalAmount - res.totalamt);

          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              isLedgerSelectSet: true,
              isRoundOffCheck: res.invoice_data.isRoundOffCheck,
              cashAcbankLst: paymentData,
              pendingAmount: invoice_data.p_pendingAmount,
              totalAmount: invoice_data.p_totalAmount,
              returnAmount: invoice_data.p_returnAmount,
              // datalockSlug: "salesInvoice_" + invoice_data.id
            },
            () => {
              // //TODO: Add slug to datalock
              // if (this.state.datalockSlug != "") {
              //   if (!checkDataLockExist(this.state.datalockSlug)) {
              //     addDataLock(this.state.datalockSlug)
              //   }
              // }
              // setTimeout(() => {
              //   this.setState({ isRowProductSet: true });
              //   this.handleTranxCalculation();
              // }, 25);
              // setTimeout(() => {
              //   this.setState({ isRowProductSet: true });
              //   this.handleTranxCalculation();
              // }, 25);
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
              }, 1500);
            }
          );
        }
        // else if (res.responseStatus == 409) {
        //   // ShowNotification("Error", data.message);
        //   //console.log("data msg", res.message);
        //   MyNotifications.fire({
        //     show: true,
        //     icon: "error",
        //     title: "Error",
        //     msg: res.message,
        //     is_timeout: true,
        //     delay: 3000,
        //   });
        //   setTimeout(() => {
        //     eventBus.dispatch("page_change", {
        //       to: "tranx_sales_invoice_list",
        //       from: "tranx_sales_invoice_edit",
        //       isNewTab: false,
        //     });
        //   }, 2000);
        // } else {
        //   this.setState({ isEditDataSet: true });
        //   ShowNotification("Error", res.responseStatus);
        // }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_invoice_edit",
      to: "tranx_sales_invoice_list",
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
      // console.log(
      //   "did update",
      //   supplierNameLst,
      //   supplierCodeLst,
      //   salesAccLst,
      //   lstAdditionalLedger,
      //   isEditDataSet,
      //   salesEditData,
      //   lstDisLedger,
      //   productLst,
      //   lstBrand,
      //   lstPackages
      // );
      if (
        // supplierNameLst.length > 0 &&
        // supplierCodeLst.length > 0 &&
        salesAccLst.length > 0 &&
        lstBrand.length > 0 &&
        lstAdditionalLedger.length > 0 &&
        // productLst.length > 0 &&
        isEditDataSet == false &&
        salesEditData != ""
      ) {
        this.setSalesInvoiceEditData();
        // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      }
    }
  }
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

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    // console.log("serial no", rows);
    // console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
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
                <Form.Control
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

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res---->", res.list);
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
      .catch((error) => {
        console.log("error", error);
      });
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

    let resTranxFn = fnTranxCalculationInComposition({
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

  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };

  getProductBatchList = (rowIndex, source = "batch") => {
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

    let isfound = false;
    let batchOpt = [];
    let productData = getSelectValue(lstBrand, product_id);
    // console.log("productData", productData);
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
        moment(invoice_value.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );

      invoice_data["costing"] = "";
      invoice_data["costingWithTax"] = "";
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          if (response.responseStatus == 200) {
            // let res = response.data;
            let res = response.data.filter(
              (v) => parseInt(v.closing_stock) > 0
            );

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
    // let id = parseInt(this.state.rows.length) - 1;
    // if (document.getElementById("TSIEAddBtn-" + id) != null) {
    //   setTimeout(() => {
    //     document.getElementById("TSIEAddBtn-" + id).focus();
    //   });
    // }
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TSIEProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  getInitBatchValue = (rowIndex = -1, source) => {
    let { rows } = this.state;
    let initVal = "";
    // console.log("b_no: ", rowIndex, rows);
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
    //console.log("initVal", initVal);
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

  setSupplierData = (clientId = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append("ledgerId", clientId && clientId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: `${res.message} expired...`,
              msg: "Do you want continue with invoice date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {
                // console.warn("rahul:: continue invoice");
              },
              handleFailFn: () => {
                this.reloadPage();
              },
            },
            () => {
              // console.warn("rahul :: return_data");
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
              delay: 1500,
              // handleSuccessFn: () => {},
              // handleFailFn: () => {
              //   setFieldValue("transaction_dt", "");
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
        //         // setFieldValue("transaction_dt", "");
        //         // eventBus.dispatch(
        //         //   "page_change",
        //         //   "tranx_purchase_invoice_create"
        //         // );

        //         setTimeout(() => {
        //           document.getElementById("transaction_dt").focus();
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
        //         // setFieldValue("transaction_dt", "");
        //         // eventBus.dispatch("page_change", {
        //         //   from: "tranx_purchase_invoice_create",
        //         //   to: "tranx_purchase_invoice_list",
        //         //   isNewTab: false,
        //         // });

        //         setTimeout(() => {
        //           document.getElementById("transaction_dt").focus();
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
    rows = [...rows, new_row];
    this.handleMstState(rows);
  };

  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!rowDelDetailsIds.includes(uv.details_id)) {
          rowDelDetailsIds.push(uv.details_id);
        }
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    this.handleClearProduct(rows);
  };
  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  searchLedger = (search = "") => {
    // console.log({ search });
    let { orglstAdditionalLedger, element1, element2 } = this.state;
    let orglstAdditionalLedger_F = [];
    if (search.length > 0) {
      orglstAdditionalLedger_F = orglstAdditionalLedger.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.unique_code.toLowerCase().includes(search.toLowerCase())
      );

      // console.log({ orglstAdditionalLedger });
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
    //console.log("props", this.props);
    if (AuthenticationCheck()) {
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      this.lstSalesAccounts();
      this.initRow();
      this.initAdditionalCharges(1);
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      this.setLastSalesSerialNo();
      this.lstSalesmanMaster();
      this.transaction_ledger_listFun();

      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      const { prop_data } = this.props.block;
      this.handlePropsData(prop_data);
      this.setState({ ldview: prop_data.ldview });
      console.log("prop_data-->", prop_data);
      this.setState(
        { source: prop_data, salesEditData: prop_data.prop_data },
        () => {
          if (this.state.salesEditData.id) {
            this.getProductFlavorpackageUnitbyids(this.state.salesEditData.id);
          }
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
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

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

  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };
  // alt key button disabled end

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    //console.log("prooduct id", product_id);
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

    quantityVerificationById(requestData).then((response) => {
      //console.log("res : ", response);
      let res = response.data;
      //console.log("res validate", res);
      if (res.responseStatus == 409) {
        // rows[rowIndex]["qty"] = "";
        this.setState({ rows: rows }, () => {
          document.getElementById(elementId).value = "";
          document.getElementById(elementId).focus();
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: false,
            is_timeout: true,
            delay: 1500,
          });
        });
      }
    });
  };

  handleBatchModalDoubleClick = (values, setFieldValue) => {
    let {
      rows,
      rowIndex,
      b_details_id,
      is_expired,
      invoice_data,
      isBatch,
      selectedSaleRate,
    } = this.state;

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
  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputRef1.current.focus();
        // setTimeout(() => {
        //   //@Vinit @Focusing the previous tab were we left
        //   if (this.props.block.prop_data.isProduct === "productMdl") {
        //     document.getElementById("TSIEProductId-" + this.props.block.prop_data.rowIndex).focus();
        //   } else {
        //     this.inputRef1.current.focus();
        //   }
        // }, 1200);
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

  ledgerFilterData = () => {
    let {
      orgLedgerList,
      updatedLedgerType,
      currentLedgerData,
      ledgerInputData,
    } = this.state;

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
      if (currentLedgerData) {
        const index = filterData.findIndex((object) => {
          return object.id === currentLedgerData.id;
        });
        if (index >= 0) {
          setTimeout(() => {
            document.getElementById("LedgerMdlTr_" + index).focus();
          }, 200);
        }
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
          .getElementById("TSIEProductId-particularsname-" + obj.rowIndex)
          .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.isBatchMdl == "batchMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TSIEProductId-batchNo-" + obj.rowIndex)    //commented due to focus on qty after batch selection
        //   .focus();
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
  validate_sales_invoicesFun = (
    salesInvoiceNo = "",
    setFieldValue,
    salesEditData
  ) => {
    let requestData = new FormData();
    requestData.append("salesInvoiceNo", salesInvoiceNo);
    requestData.append("invoice_id", salesEditData);
    validate_sales_invoices_update(requestData)
      .then((response) => {
        //console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          // this.props.history.push("/TranxSalesInvoiceEdit");
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
    //     parseFloat(roundoffamt).toFixed(2)
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

  render() {
    const {
      currentTab, //@prathmesh @batch info & product info tab
      isTextBox,
      product_supplier_lst,
      isBranch,
      adjusmentbillmodal,
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
      lstBrand,
      billLst,
      batchModalShow,
      is_expired,
      b_details_id,
      batchInitVal,
      isBatch,
      batchData,
      tr_id,
      lstGst,
      rowDelDetailsIds,
      sourceUnder,
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
      isLedgerSelectSet,
      selectSerialModal,
      serialNoLst,
      isRowProductSet,
      batch_data_selected,
      add_button_flag,
      gstId,
      transactionType,
      batchHideShow,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      salesmanLst,
      setProductRowIndex,
      setProductId,
      productId,
      from_source,
      salesEditData,
      ledgerId,
      setLedgerId,
      isAllCheckeddebit,
      adjustbillshow,
      selectedBillsdebit,
      isRoundOffCheck,
      transactionTableStyle,
      ledgerInputData,
      opType, // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
      setAdditionalChargesId,
      additionalChargesId,

      currentLedgerData,
      updatedLedgerType,
      ledgerType,
      ldview,
      saleRateType,
    } = this.state;
    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active

    return (
      <>
        {/* <h6>Purchase Invoice</h6> */}
        <div className="purchase-tranx" style={{ overflow: "hidden" }}>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   salesAccId: Yup.object().nullable().required("Required"),
            //   // supplierCodeId: Yup.object()
            //   //   .nullable()
            //   //   .required("select client code"),
            //   // supplierNameId: Yup.string()
            //   //   .trim()
            //   //   .nullable()
            //   //   .required("Client Name is Required"),
            //   transaction_dt: Yup.string().required("Invoice Date is Required"),
            //   bill_no: Yup.string().trim().required("Invoice No. is Required"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start
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
              if (values.mode == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.mode == undefined || values.mode == "") {
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
                        //console.log("values1111-->", values);
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
                              msg: "Do you want to Update ?",
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
                                    let { selectedSupplier } =
                                      this.myRef.current.values;
                                    if (selectedSupplier) {
                                      //this.handleFetchData(selectedSupplier.id);
                                      this.callCreateInvoice();
                                    }

                                    // alert('hi')
                                  }
                                );
                                // eventBus.dispatch("page_change", {
                                //   from: "tranx_sales_invoice_edit",
                                //   to: "tranx_sales_invoice_list",
                                //   isNewTab: false,
                                //   isCancel: true,
                                //   prop_data: {
                                //     editId: this.state.salesEditData.id,
                                //     rowId: this.props.block.prop_data.rowId,
                                //   },
                                // });
                              },
                              handleFailFn: () => {},
                            },
                            () => {
                              // console.warn("return_data");
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
              isSubmitting,
              resetForm,
              setFieldValue,
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
                  {/* {JSON.stringify(errors)} */}
                  {/* {JSON.stringify(values)} */}
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
                                    )
                                      e.preventDefault();
                                  }}
                                >
                                  <MyTextDatePicker
                                    autoFocus={true}
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    // className="tnx-pur-inv-date-style "
                                    name="transaction_dt"
                                    id="transaction_dt"
                                    placeholder="DD/MM/YYYY"
                                    value={values.transaction_dt}
                                    onChange={handleChange}
                                    // onChange={({ target: { value } }) => {
                                    //   setFieldValue("transaction_dt", value);
                                    // }}
                                    autoComplete="true"
                                    className={`${
                                      values.transaction_dt == "" &&
                                      errorArrayBorder[0] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.shiftKey == true &&
                                          e.keyCode == 9) ||
                                        e.keyCode == 9 ||
                                        e.keyCode == 13
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
                                            //console.log("finfinfinfin", finle);
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
                                              is_button_show: true,
                                            });
                                            this.invoiceDateRef.current.focus();
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
                                    ref={this.inputRef1}
                                    type="text"
                                    // className="tnx-pur-inv-text-box text-start"
                                    placeholder="Client Name"
                                    name="supplierNameId"
                                    id="supplierNameId"
                                    // onChange={handleChange}
                                    autoComplete="true"
                                    className={`${
                                      values.supplierNameId == "" &&
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
                                    onChange={(e) => {
                                      e.preventDefault();

                                      this.setledgerInputData(
                                        e.target.value,
                                        true,
                                        setFieldValue
                                      );
                                    }}
                                    disabled={
                                      values.transaction_dt != "" ? false : true
                                    }
                                    value={values.supplierNameId}
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
                                      } else if (e.key === "Tab") {
                                        e.preventDefault();
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
                                            this.ledgerFilterData();
                                          }
                                        );
                                      } else if (e.key === "Alt") {
                                        e.preventDefault();
                                      } else if (e.keyCode == 40) {
                                        this.setState({ ledgerNameFlag: true });
                                        //! this condition for down button press 1409
                                        if (ledgerModal == true)
                                          document
                                            .getElementById("LedgerMdlTr_0")
                                            .focus();
                                      }
                                    }}
                                  />
                                </div>

                                {/* <span className="text-danger errormsg">
                                  {touched.supplierNameId &&
                                    errors.supplierNameId}
                                </span> */}
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
                                <Form.Label>Client Name </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                {" "}
                                <Form.Control
                                  type="text"
                                  placeholder="Client Name."
                                  name="client_name"
                                  id="client_name"
                                  // className="tnx-pur-inv-text-box"
                                  isClearable={false}
                                  // readOnly={true}
                                  onChange={handleChange}
                                  autoComplete="off"
                                  className={`${
                                    values.client_name == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(2, "");
                                      console.log("e ", e);
                                      console.log(
                                        "e.target.value ",
                                        e.target.value
                                      );
                                      if (
                                        e.target.value.trim() != null &&
                                        e.target.value.trim() != ""
                                      ) {
                                        // this.validate_sales_invoicesFun(
                                        //   e.target.value,
                                        //   setFieldValue
                                        // );
                                      }
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      document
                                        .getElementById("client_name")
                                        .focus();
                                    }
                                  }}
                                  value={values.client_name}
                                  isValid={
                                    touched.client_name && !errors.client_name
                                  }
                                  isInvalid={!!errors.client_name}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                    }
                                    // else if (e.keyCode == 13) {
                                    //   this.focusNextElement(e);
                                    // }
                                    // e.preventDefault();
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.bill_no}
                                </span> */}
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
                                <Form.Label>
                                  Mobile Number{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                {" "}
                                <Form.Control
                                  type="text"
                                  placeholder="mobile_number."
                                  name="mobile_number"
                                  id="mobile_number"
                                  // className="tnx-pur-inv-text-box"
                                  isClearable={false}
                                  // readOnly={true}
                                  onChange={handleChange}
                                  autoComplete="off"
                                  className={`${
                                    values.mobile_number == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(2, "");
                                      console.log("e ", e);
                                      console.log(
                                        "e.target.value ",
                                        e.target.value
                                      );
                                      if (
                                        e.target.value.trim() != null &&
                                        e.target.value.trim() != ""
                                      ) {
                                        // this.validate_sales_invoicesFun(
                                        //   e.target.value,
                                        //   setFieldValue
                                        // );
                                      }
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      document
                                        .getElementById("mobile_number")
                                        .focus();
                                    }
                                  }}
                                  value={values.mobile_number}
                                  isValid={
                                    touched.mobile_number &&
                                    !errors.mobile_number
                                  }
                                  isInvalid={!!errors.mobile_number}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.bill_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          {/* <Col lg={3} md={3} sm={3} xs={3}>
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
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Select
                                    ref={this.selectGstClientRef}
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
                                    autoComplete="true"
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
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Select
                                    ref={this.selectSalesAccRef}
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
                                    autoComplete="true"
                                    value={values.salesAccId}
                                  />
                                </Form.Group>

                                <span className="text-danger errormsg">
                                  {errors.salesAccId}
                                </span>
                              </Col>
                            </Row>
                          </Col> */}
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
                                  type="text"
                                  placeholder="Invoice No."
                                  name="bill_no"
                                  id="bill_no"
                                  // className="tnx-pur-inv-text-box"
                                  // readOnly={true}
                                  isClearable={false}
                                  onChange={handleChange}
                                  autoComplete="true"
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
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(2, "");
                                      //console.log("e ", e);
                                      /*  console.log(
                                        "e.target.value ",
                                        e.target.value
                                      ); */
                                      if (
                                        e.target.value.trim() != null &&
                                        e.target.value.trim() != ""
                                      ) {
                                        this.validate_sales_invoicesFun(
                                          e.target.value,
                                          setFieldValue,
                                          salesEditData.id
                                        );
                                      }
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
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
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
                                <Form.Label>Salesman</Form.Label>
                              </Col>

                              <Col lg={5} md={5} sm={5} xs={5}>
                                {/* <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  onChange={handleChange}
                                  autoComplete="true"
                                  placeholder="Salesman"
                                  name="salesman"
                                  id="salesman"
                                  value={values.salesman}
                                  readOnly
                                /> */}
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
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
                                  />
                                </Form.Group>
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
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
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
                                className="my-auto"
                              >
                                <Form.Label>
                                  Client Address{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                {" "}
                                <Form.Control
                                  type="text"
                                  placeholder="Client Address."
                                  name="client_address"
                                  id="client_address"
                                  // className="tnx-pur-inv-text-box"
                                  isClearable={false}
                                  // readOnly={true}
                                  onChange={handleChange}
                                  autoComplete="off"
                                  className={`${
                                    values.client_address == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(2, "");
                                      console.log("e ", e);
                                      console.log(
                                        "e.target.value ",
                                        e.target.value
                                      );
                                      if (
                                        e.target.value.trim() != null &&
                                        e.target.value.trim() != ""
                                      ) {
                                        // this.validate_sales_invoicesFun(
                                        //   e.target.value,
                                        //   setFieldValue
                                        // );
                                      }
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      document
                                        .getElementById("client_address")
                                        .focus();
                                    }
                                  }}
                                  value={values.client_address}
                                  isValid={
                                    touched.client_address &&
                                    !errors.client_address
                                  }
                                  isInvalid={!!errors.client_address}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.bill_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="p-0">
                                <Form.Label>
                                  Payment Mode{" "}
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
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.mode) {
                                      this.setErrorBorder(3, "");
                                    } else {
                                      this.setErrorBorder(3, "Y");
                                      this.radioRef.current?.focus();
                                    }
                                  }}
                                  // className="d-flex label_style"
                                  className={`${
                                    values.mode == "" &&
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
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  {/* @prathmesh @only cash condition checked start */}
                                  {this.state.invoice_data.mode === "cash" ? (
                                    <>
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
                                        autoComplete="true"
                                      />
                                      <Form.Check
                                        disabled
                                        className="mx-2"
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
                                        autoComplete="true"
                                      />
                                      <Form.Check
                                        disabled
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
                                        autoComplete="true"
                                      />
                                    </>
                                  ) : (
                                    <>
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
                                        autoComplete="true"
                                      />
                                      <Form.Check
                                        className="mx-2"
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
                                        autoComplete="true"
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
                                        autoComplete="true"
                                      />
                                    </>
                                  )}
                                  {/* only cash condition checked end */}
                                  {/* <Form.Check
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
                                    autoComplete="true"
                                  />
                                  <Form.Check
                                    className="mx-2"
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
                                    autoComplete="true"
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
                                    autoComplete="true"
                                  /> */}
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>

                  <CmpTRowComposition
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
                    qtyVerificationById={this.qtyVerificationById.bind(this)}
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
                    productId="TSIEProductId-"
                    addBtnId="TSIEAddBtn-"
                    transactionType={transactionType}
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
                    saleRateType={saleRateType}
                    opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
                    isRowProductSet={isRowProductSet}
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
                        //     ? "second"
                        //     : "second"
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
                            <Row className="tnx-pur-inv-description-style ">
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <h6 className="title-style">Ledger Info:</h6>
                                <div className="d-flex">
                                  <span className="span-lable">GST No :</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.gst_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Area :</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.area}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Bank :</span>
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
                                    Contact Person :
                                  </span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.contact_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">
                                    Transport :
                                  </span>
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
                                    Credit Days :
                                  </span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.credit_days}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">FSSAI :</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.fssai_number}
                                  </span>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="d-flex">
                                  <span className="span-lable">
                                    License No :
                                  </span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {ledgerData.license_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Route :</span>
                                  <span className="span-value">
                                    &nbsp;&nbsp;
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.route}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <Row>
                              <Col lg={8} className="pe-0">
                                <Row className="tnx-pur-inv-description-style">
                                  <Col
                                    lg={6}
                                    style={{
                                      borderRight: "1px solid #EAD8B1",
                                    }}
                                    className="pe-0"
                                  >
                                    <h6 className="title-style">
                                      Product Info:
                                    </h6>
                                    <div className="d-flex">
                                      {" "}
                                      <span className="span-lable">
                                        Brand :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.brand}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Group :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.group}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Category :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.category}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Supplier :
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
                                      <span className="span-lable">HSN :</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {/* {product_hover_details.hsn} */}
                                        {productData.hsn}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Tax Type :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {/* {product_hover_details.tax_type} */}
                                        {productData.tax_type}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Tax% :</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.tax_per}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Margin% :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.margin_per}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col lg={3} className="col-top-margin pe-0">
                                    <div className="d-flex">
                                      <span className="span-lable">Cost :</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {productData.cost}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Shelf ID :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {/* {product_hover_details.hsn} */}
                                        {productData.shelf_id}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Min Stock :
                                      </span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {[productData.min_stocks]}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Max Stock :
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
                                      <span className="span-lable">Name :</span>
                                      <span className="span-value">
                                        &nbsp;&nbsp;
                                        {batchDetails != ""
                                          ? batchDetails.supplierName
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Bill no :
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
                                        Bill Date :
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
                      <Row className=" p-2">
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
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="Dis."
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
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
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
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
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
                            <span className="errormsg">{values.total_qty}</span>
                          </Col>
                        </Row>

                        <Row className="">
                          <Col lg={12}>
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
                          <Col lg={11}>
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="errormsg">
                              {INRformat.format(values.roundoff)}
                              {/* {Math.abs(parseFloat(values.roundoff).toFixed(2))} */}
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
                                      /*   console.log(
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
                                    placeholder="Add.charges"
                                    className="tnx-pur-inv-text-box mt-2"
                                    name="additionalChgLedgerName1"
                                    id="additionalChgLedgerName1"
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
                                  //   }, 300);
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
                              {/* <InputGroup className="  mdl-text d-flex">
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
                                  //   }, 300);
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
                                          name="tcs_mode"
                                          label="TDS"
                                          value="tds"
                                          autoComplete="off"
                                          checked={
                                            values.tcs_mode == "tds"
                                              ? true
                                              : false
                                          }
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
                                    if (
                                      e.shiftKey === true &&
                                      e.keyCode === 9
                                    ) {
                                    } else if (e.keyCode == 32) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else if (e.keyCode === 13) {
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
                          id="TSIE_submit_btn"
                          className="successbtn-style"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            this.myRef.current.handleSubmit();
                          }}
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
                                  // this.CancelAPICall();
                                  // if ("ledgerId" in this.state.source != "") {
                                  if (
                                    "ledgerId" in this.state.source &&
                                    this.state.source.ledgerId !== ""
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_invoice_edit",
                                      to: "ledgerdetails",
                                      // prop_data: this.state.source["ledgerId"],
                                      prop_data: {
                                        prop_data:
                                          this.state.source["ledgerId"],
                                        ldview:
                                          this.props.block.prop_data.ldview,
                                      },
                                      isNewTab: false,
                                    });
                                    // this.setState({ source: "" });
                                  } else {
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_sales_invoice_list"
                                    // );
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_invoice_edit",
                                      to: "tranx_sales_invoice_list",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: {
                                        editId: this.state.salesEditData.id,
                                        rowId: this.props.block.prop_data.rowId,
                                      },
                                    });
                                  }
                                  // eventBus.dispatch(
                                  //   "page_change",
                                  //   "tranx_sales_invoice_list"
                                  // );
                                },
                                handleFailFn: () => {},
                              },
                              () => {
                                // console.warn("return_data");
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
                                    // if ("ledgerId" in this.state.source != "") {
                                    if (
                                      "ledgerId" in this.state.source &&
                                      this.state.source.ledgerId !== ""
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_sales_invoice_edit",
                                        to: "ledgerdetails",
                                        prop_data:
                                          this.state.source["ledgerId"],

                                        isNewTab: false,
                                      });
                                      // this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "tranx_sales_invoice_list"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_sales_invoice_edit",
                                        to: "tranx_sales_invoice_list",
                                        isNewTab: false,
                                        isCancel: true,
                                        prop_data: {
                                          editId: this.state.salesEditData.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                        },
                                      });
                                    }
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_sales_invoice_list"
                                    // );
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  // console.warn("return_data");
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
            tranxRef={this.myRef}
            ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
            ledgerModal={ledgerModal}
            ledgerData={ledgerData}
            selectedLedger={selectedLedger}
            currentLedgerData={currentLedgerData}
            invoice_data={invoice_data}
            isLedgerSelectSet={isLedgerSelectSet}
            transactionType={transactionType}
            from_source={from_source}
            ledgerId={ledgerId}
            setLedgerId={setLedgerId}
            rows={rows}
            transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
              this
            )}
            transactionTableStyle={transactionTableStyle}
            ledgerInputData={ledgerInputData}
            isTextBox={isTextBox}
            searchInputId="supplierNameId"
            setledgerInputDataFun={this.setledgerInputData.bind(this)}
            ledgerType={ledgerType} // @prathmesh @ledger filter added
            updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
            sourceUnder={sourceUnder}
            opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
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
            from_source={from_source}
            invoice_data={this.myRef.current ? this.myRef.current.values : ""}
            productId={productId}
            setProductId={setProductId}
            setProductRowIndex={setProductRowIndex}
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
            getProductBatchList={this.getProductBatchList.bind(this)}
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
                    // console.warn("return_data");
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
                        <Row>
                          <div className=" tnx-pur-inv-paymentModalStyle">
                            <Table hover size="sm" className="">
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
                                      <th></th>
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
                              {cashAcbankLst
                                .reduce(
                                  (prev, next) =>
                                    prev + parseFloat(next.amount),
                                  0
                                )
                                .toFixed(2)}
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
                              {pendingAmount.toFixed(2)}/-
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
                              {returnAmount.toFixed(2)}/-
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

                    const {
                      invoice_data,
                      additionalChargesTotal,
                      rows,
                      initVal,
                      totalAmount,
                      pendingAmount,
                      returnAmount,
                      cashAcbankLst,
                    } = this.state;

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
                    requestData.append(
                      "sales_sr_no",
                      invoiceValues.sales_sr_no
                    );

                    requestData.append(
                      "gstNo",
                      invoiceValues.gstId !== ""
                        ? invoiceValues.gstId.label
                        : ""
                    );

                    requestData.append(
                      "debtors_id",
                      invoice_data.selectedSupplier.id
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
                    requestData.append(
                      "totalqty",
                      invoiceValues.totalqty && invoiceValues.totalqty != ""
                        ? invoiceValues.totalqty
                        : 0
                    );
                    requestData.append(
                      "tcs",
                      invoiceValues.tcs && invoiceValues.tcs != ""
                        ? invoiceValues.tcs
                        : 0
                    );

                    requestData.append(
                      "sales_discount",
                      invoiceValues.purchase_discount &&
                        invoiceValues.purchase_discount != ""
                        ? invoiceValues.purchase_discount
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
                      invoiceValues.purchase_discount_amt &&
                        invoiceValues.purchase_discount_amt != ""
                        ? invoiceValues.purchase_discount_amt
                        : 0
                    );

                    let frow = [];
                    rows.map((v, i) => {
                      if (v.productId != "") {
                        let newObj = {
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
                          b_details_id:
                            v.b_details_id != "" ? v.b_details_id : 0,
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
                          serialNo: v.serialNo
                            ? v.serialNo.filter((vi) => vi.serial_no != "")
                            : [],
                          reference_type: v.reference_type,
                          reference_id:
                            v.reference_id != "" ? v.reference_id : 0,
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
                    requestData.append(
                      "additionalChargesTotal",
                      additionalChargesTotal
                    );
                    requestData.append("sale_type", "sales");
                    requestData.append(
                      "salesmanId",
                      invoice_data.salesmanId
                        ? invoice_data.salesmanId.value
                        : ""
                    );
                    requestData.append("print_type", "create");
                    requestData.append("paymentMode", invoice_data.mode);
                    if (invoice_data.mode == "multi") {
                      requestData.append(
                        "payment_type",
                        JSON.stringify(cashAcbankLst)
                      );
                      requestData.append("p_totalAmount", totalAmount);
                      requestData.append("p_returnAmount", returnAmount);
                      requestData.append("p_pendingAmount", pendingAmount);
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
                    requestData.append(
                      "bill_amount",
                      invoiceValues.bill_amount
                    );

                    // console.log(JSON.stringify(requestData));
                    // debugger;
                    createSalesInvoice(requestData)
                      .then((response) => {
                        // ;
                        //console.log("in create");
                        let res = response.data;
                        if (res.responseStatus === 200) {
                          // MyNotifications.fire({
                          //   show: true,
                          //   icon: "success",
                          //   title: "Success",
                          //   msg: res.message,
                          //   is_timeout: true,
                          //   delay: 1000,
                          // });
                          this.setState({ paymentModeModal: false });

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
                                this.getInvoiceBillsLstPrint(
                                  invoiceValues.bill_no
                                );
                                // eventBus.dispatch(
                                //   "page_change",
                                //   "tranx_sales_invoice_list"
                                // );
                              },
                              handleFailFn: () => {
                                eventBus.dispatch(
                                  "page_change",
                                  "tranx_sales_invoice_list"
                                );
                              },
                            },
                            () => {
                              // console.warn("return_data");
                            }
                          );
                          // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
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
          <Modal
            show={adjusmentbillmodal}
            size="lg"
            className="mt-5 invoice-mdl-style"
            onHide={() => this.setState({ adjusmentbillmodal: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Adjustment and Pending Bills
              </Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                // onClick={this.handleClose}
                onClick={() => this.handeladjusmentbillmodal(false)}
              />
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={{
                creditnoteNo: "",
                newReference: "",
              }}
              validationSchema={Yup.object().shape({
                newReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                //console.log("values", values);
                let invoiceValues = this.myRef.current.values;

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
                  if (invoiceValues.newReference == "true") {
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
                  let values = this.myRef.current.values;

                  let requestData = new FormData();
                  requestData.append("id", invoice_data.id);
                  requestData.append("newReference", "NO");
                  requestData.append(
                    "outstanding_sales_return_amt",
                    outstanding_sales_return_amt
                  );

                  // !Invoice Data
                  requestData.append(
                    "bill_dt",
                    moment(
                      new Date(
                        moment(
                          invoice_data.transaction_dt,
                          "DD/MM/YYYY"
                        ).toDate()
                      )
                    ).format("YYYY-MM-DD")
                  );
                  requestData.append("bill_no", invoice_data.bill_no);
                  requestData.append(
                    "sales_acc_id",
                    invoice_data.salesAccId.value
                  );
                  requestData.append("sales_sr_no", invoice_data.sales_sr_no);
                  requestData.append(
                    "gstNo",
                    invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
                  );
                  requestData.append(
                    "debtors_id",
                    invoice_data.supplierNameId.value
                  );
                  if (values.narration !== "") {
                    requestData.append("narration", values.narration);
                  }
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
                  // !Invoice Data
                  requestData.append("roundoff", values.roundoff);
                  requestData.append("narration", values.narration);
                  requestData.append("total_base_amt", values.total_base_amt);
                  requestData.append("totalamt", values.totalamt);
                  requestData.append(
                    "taxable_amount",
                    values.total_taxable_amt
                  );
                  requestData.append("totalcgst", totalcgst);
                  requestData.append("totalsgst", totalsgst);
                  requestData.append("totaligst", totaligst);
                  requestData.append("totalqty", values.totalqty);
                  requestData.append("tcs", values.tcs);
                  requestData.append("sales_discount", values.sales_discount);
                  requestData.append(
                    "sales_discount",
                    values.sales_discount && values.sales_discount != ""
                      ? values.sales_discount
                      : 0
                  );

                  requestData.append(
                    "total_sales_discount_amt",
                    values.total_purchase_discount_amt &&
                      values.total_purchase_discount_amt != ""
                      ? values.total_purchase_discount_amt
                      : 0
                  );

                  requestData.append(
                    "sales_discount_amt",
                    values.sales_discount_amt && values.sales_discount_amt != ""
                      ? values.sales_discount_amt
                      : 0
                  );

                  requestData.append(
                    "sales_disc_ledger",
                    values.sales_disc_ledger
                      ? values.sales_disc_ledger.value
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
                                  vs["packageDetails"] = vs.packageDetails.map(
                                    (vp) => {
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
                                          vu["max_discount"] = vu.max_discount;
                                          vu["min_discount"] = vu.min_discount;
                                          vu["min_margin"] = vu.min_margin;
                                          vu["b_expiry"] =
                                            vu.b_expiry != ""
                                              ? moment(vu.b_expiry).format(
                                                  "YYYY-MM-DD"
                                                )
                                              : "";
                                          vu["manufacturing_date"] =
                                            vu.manufacturing_date != ""
                                              ? moment(
                                                  vu.manufacturing_date
                                                ).format("yyyy-MM-DD")
                                              : "";
                                          vu["is_batch"] = vu.is_batch;
                                          vu["isBatchNo"] = vu.isBatchNo;
                                          vu["igst"] =
                                            vu.igst != "" ? vu.igst : 0;
                                          vu["cgst"] =
                                            vu.cgst != "" ? vu.cgst : 0;
                                          vu["sgst"] =
                                            vu.sgst != "" ? vu.sgst : 0;

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
                                          vu["b_expiry"] =
                                            vu.b_expiry != ""
                                              ? moment(vu.b_expiry).format(
                                                  "YYYY-MM-DD"
                                                )
                                              : "";
                                          vu["manufacturing_date"] =
                                            vu.manufacturing_date != ""
                                              ? moment(
                                                  vu.manufacturing_date
                                                ).format("yyyy-MM-DD")
                                              : "";
                                          vu["is_batch"] = vu.is_batch;
                                          vu["isBatchNo"] = vu.isBatchNo;
                                          vu["igst"] =
                                            vu.igst != "" ? vu.igst : 0;
                                          vu["cgst"] =
                                            vu.cgst != "" ? vu.cgst : 0;
                                          vu["sgst"] =
                                            vu.sgst != "" ? vu.sgst : 0;

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
                                          vu["b_expiry"] =
                                            vu.b_expiry != ""
                                              ? moment(vu.b_expiry).format(
                                                  "YYYY-MM-DD"
                                                )
                                              : "";
                                          vu["manufacturing_date"] =
                                            vu.manufacturing_date != ""
                                              ? moment(
                                                  vu.manufacturing_date
                                                ).format("yyyy-MM-DD")
                                              : "";
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

                  //console.log("frow in edit", frow);

                  var filtered = frow.filter(function (el) {
                    return el != null;
                  });
                  /*  console.log(
                    "additionalCharges in request",
                    additionalCharges
                  ); */
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
                  /*    console.log(
                    "additionalChargesfilter in  sales",
                    additionalChargesfilter
                  ); */
                  requestData.append(
                    "additionalChargesTotal",
                    additionalChargesTotal
                  );
                  requestData.append("row", JSON.stringify(filtered));
                  requestData.append(
                    "additionalCharges",
                    JSON.stringify(additionalChargesfilter)
                  );
                  requestData.append("sale_type", "sales_invoice");

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

                  //console.log({ rowDelDetailsIds });
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

                  editSalesInvoice(requestData)
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

                        // if ("ledgerId" in this.state.source != "") {
                        //   eventBus.dispatch("page_change", {
                        //     from: "tranx_sales_invoice_edit",
                        //     to: "ledgerdetails",
                        //     prop_data: this.state.source["ledgerId"],

                        //     isNewTab: false,
                        //   });
                        //   // this.setState({ source: "" });
                        // } else {
                        //   eventBus.dispatch(
                        //     "page_change",
                        //     "tranx_sales_invoice_list"
                        //   );
                        // }

                        // eventBus.dispatch("page_change", {
                        //   from: "tranx_sales_invoice_edit",
                        //   to: "tranx_sales_invoice_list",
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
                      console.log("error", error);
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
                    <div className="purchasescreen pb-2 pt-0 pl-2 pr-2">
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Label>
                              Outstanding Amount {outstanding_sales_return_amt}
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Label>
                              Adjust Amount In Bill?{" "}
                              <span className="redstar">*</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="2">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="YES"
                                checked={
                                  values.newReference === "YES" ? true : false
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
                                value="NO"
                                onChange={handleChange}
                                checked={
                                  values.newReference === "NO" ? true : false
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
                        <Col md="7" className="btn_align">
                          <Button
                            className="createbtn"
                            type="submit"
                            style={{ marginTop: "-9px" }}
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
)(TranxSalesInvoiceEdit);
