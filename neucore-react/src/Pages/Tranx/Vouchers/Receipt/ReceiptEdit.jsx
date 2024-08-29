import React from "react";
import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import Select from "react-select";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import delete_icon from "@/assets/images/delete_icon 3.png";
import TableEdit from "@/assets/images/Edit.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import Frame from "@/assets/images/Frame.png";
import Filter_img from "@/assets/images/Filter_img.png";
import close_grey_icon from "@/assets/images/close_grey_icon.png";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getProduct,
  createPurchaseInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPOPendingOrderWithIds,
  getPOInvoiceWithIds,
  getreceiptlastrecords,
  getSDIEReceipt,
  getdebtorspendingbills,
  getCBADReceipt,
  create_receipts,
  update_receipt,
  get_receipt_by_id,
  transaction_ledger_list,
  transaction_ledger_details,
  getOutletBankMasterList,
  getPaymentModes,
  get_ledger_bank_details,
  checkInvoiceDateIsBetweenFY,
  // getSundryCreditorsPaymentAmout,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  customStyles1,
  eventBus,
  MyNotifications,
  isActionExist,
  allEqual,
  MyTextDatePicker,
  ledger_select,
  convertToSlug,
  getValue,
} from "@/helpers";
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
// import { type } from 'os';

// const customStyles1 = {
//   control: (base, state) => ({
//     ...base,
//     height: 26,
//     minHeight: 26,
//     border: "none",
//     padding: "0 6px",
//     boxShadow: "none",
//     //lineHeight: "10",
//     background: "transparent",
//     // borderBottom: '1px solid #ccc',
//     // '&:focus': {
//     //   borderBottom: '1px solid #1e3989',
//     // },
//     // border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
//   }),
//   dropdownIndicator: (base) => ({
//     ...base,
//     display: "none",
//   }),
// };
const drcrtype = [
  { value: "dr", label: "dr" },
  { value: "cr", label: "cr" },
];
// const ledger_type_options = [
//   { label: "Yes", value: true },
//   { label: "No", value: false },
//   // more options...
// ];

// const BankOpt = [
//   { label: "Cheque / DD", value: "cheque-dd" },
//   { label: "NEFT", value: "neft" },
//   { label: "IMPS", value: "imps" },
//   { label: "UPI", value: "upi" },
//   { label: "Others", value: "others" },
// ];
const selectOpt = [
  { label: "Dr", value: "dr" },
  { label: "Cr", value: "cr" },
];
export default class ReceiptEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.NewMyEditRef = React.createRef();
    this.bankListRef = React.createRef();
    this.bankNameRef = React.createRef();
    this.ref = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.tranDateRef = React.createRef();
    this.ledgerModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.state = {
      sourceUnder: "receipt",
      isPropDataSet: false,
      ldview: 0,
      from_source: "voucher_receipt_edit",
      opType: "edit",
      filterOpen: false,
      show: false,
      ledgerType: true, //@neha @for filter
      invoice_data: "",
      receiptEditData: "",
      amtledgershow: false,
      onaccountmodal: false,
      billadjusmentmodalshow: false,
      billadjusmentDebitmodalshow: false,
      bankledgershow: false,
      isDisabled: false,
      bankchequeshow: false,
      isAllCheckeddebit: false,
      sundryindirect: [],
      cashAcbankLst: [],
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      selectedBillsdebit: [],
      selectedBillsCredit: [],
      billLst: [],
      billLstSc: [],
      selectedBills: [],
      accountLst: [],
      bankNameOpt: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      ledgerModal: false,
      ledgerData: [],
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      objCR: "",
      ledgerList: [],
      selectedLedger: "",
      isEditDataSet: false,
      initVal: {
        receipt_sr_no: 1,
        receipt_code: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        po_sr_no: 1,
        sundryindirectid: "",
        id: "",
        type: "",
        balancing_method: "",
        amount: "",
      },
      errorArrayBorder: "",
      errorArrayBorderBank: "",
      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        transaction_dt: moment().format("DD-MM-YYYY"),
        payment_dt: moment().format("YYYY-MM-DD"),
      },
      rows: [],
      sundryCreditorLst: [],
      cashAccLedgerLst: [],
      lstSundryCreditorsPayment: [],

      index: 0,
      crshow: false,
      onaccountcashaccmodal: false,
      bankaccmodal: false,
      totalDebitAmt: 0,
      isAdvanceCheck: false,
      payableAmt: 0,
      selectedAmt: 0,
      remainingAmt: 0,
      uncheckRowData: [],
      debitUncheckData: [],
      openingUncheckData: [],
      perticularsDelete: "",
      selectedBillsData: "",
      creditListExit: false,
      invoiceListExist: false,
      openingListExist: false,
      isChecked: false,
      bankData: "",
      myNewLedgrData: [],

      selectedLedgerIndex: 0,
    };
  }
  // const { i, productLst, setFieldValue, isDisabled } = props;
  handleClose = () => {
    this.setState({ show: false });
  };
  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    //console.log("elementCheck===->>>>", elementCheck);
    return elementCheck ? elementCheck : "";
  };

  initRows = (len = 10) => {
    let { rows } = this.state;

    for (let index = 0; index < len; index++) {
      let innerrow = {
        type: "",
        perticulars: "",
        paid_amt: "",
        bank_payment_type: "",
        bank_payment_no: "",
        bank_name: "",
        payment_date: "",
        debit: "",
        credit: "",
        receiptEdtNarration: "",
      };
      // if (index == 0) {
      //   innerrow['type'] = 'cr';
      // }
      rows.push(innerrow);
    }
    this.setState({ rows: rows });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };

  getPayableAmt = (index, type) => {
    // return i == index;
    let elementCheck;
    let res = 0;
    if (elementCheck) {
      if (elementCheck["type"] == type) {
        res = elementCheck
          ? elementCheck["paid_amt"]
            ? elementCheck["paid_amt"]
            : 0
          : 0;
      }
    }
    //console.log({ res });
    return res;
  };
  handleClearPayment = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      type: "",
      paid_amt: "",
      perticulars: "",
      credit: "",
      debit: "",
      bank_payment_type: "",
      bank_payment_no: "",
      bank_name: "",
      // check_number:"",
      payment_date: "",
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => {});
  };

  lstgetsundrydebtors_indirectexpenses = () => {
    getSDIEReceipt()
      .then((response) => {
        //console.log("response", response);
        let res = response.data ? response.data : [];
        let resLst = [];

        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            res.list.map((v) => {
              let innerrow = {
                id: v.id,
                //ledger_id: v.ledger_id,
                type: v.type,
                ledger_name: v.ledger_name,
                balancing_method: v.balancing_method,
                value: v.id,
                label: v.ledger_name,
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ sundryCreditorLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
                ledger_name: v.name,
                balancing_method: "",
                billids: [],
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
  setreceiptlastrecords = () => {
    getreceiptlastrecords()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          //initVal['payment_sr_no'] = res.count;
          initVal["receipt_sr_no"] = res.receipt_sr_no;
          initVal["receipt_code"] = res.receipt_code;

          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setReceiptEditData = () => {
    const { id } = this.state.receiptEditData;
    //console.log("ID", this.state.receiptEditData);
    let formData = new FormData();
    formData.append("receipt_id", id);
    get_receipt_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { perticulars } = res;
          const { sundryCreditorLst, cashAcbankLst } = this.state;

          this.myRef.current.setFieldValue("receipt_sr_no", res.receipt_sr_no);

          this.myRef.current.setFieldValue("receipt_code", res.receipt_no);
          this.myRef.current.setFieldValue(
            "transaction_dt",
            moment(res.tranx_date).format("DD-MM-YYYY")
          );
          this.myRef.current.setFieldValue("total_amt", res.total_amt);

          this.myRef.current.setFieldValue(
            "receiptEdtNarration",
            res.narrations
          );

          // let initInvoiceData = {
          //   type: perticulars.type,
          //   ledger_type: perticulars.ledger_type,
          //   ledger_name: perticulars.ledger_name,
          //   paid_amt: perticulars.paid_amt,
          //   bank_payment_no: perticulars.bank_payment_no,
          //   bank_payment_type: perticulars.bank_payment_type,
          // };

          //console.log("receipt_peritculars", perticulars);
          let initRowData = [];
          let bankData = [];

          let billsdata = [];
          let myData = "";
          if (perticulars.length > 0) {
            perticulars.map((v) => {
              if (v.ledger_type == "bank_account") {
                myData = {
                  id: v.ledger_id,
                  ledger_type: v.ledger_type,
                  type: v.type,
                  ledger_name: v.ledger_name,
                  bank_payment_type: v.bank_payment_type,
                  paymentTranxNo: v.paymentTranxNo,
                  payment_date: moment(v.payment_date, "YYYY-MM-DD").format(
                    "DD-MM-YYYY"
                  ),
                };
              }
              //console.log("==='''vvvv", v);
              let per = "";
              if (v.type == "cr") {
                per = getSelectValue(sundryCreditorLst, v.ledger_id);
                this.setState({ perticularsDelete: v.ledger_id });
              }
              if (v.type == "dr") {
                per = getSelectValue(cashAcbankLst, v.ledger_id);
                this.setState({ perticularsDelete: v.ledger_id });
              }
              if (v.type === "cr") {
                //console.log("per >>>>>", per, "v.type  ", v.type);
                //console.log("v.bills >>>>>", v.bills, v.bills.length);
                v.bills.map((vi, i) => {
                  billsdata.push(vi);
                });
                per["bills"] = v.bills;
                per["isAdvanceCheck"] = v.isAdvanceCheck;
                per["payableAmt"] = v.payableAmt;
                per["remainingAmt"] = v.remainingAmt;
                per["selectedAmt"] = v.selectedAmt;
                per["bill_details_id"] =
                  v.bill_details_id != "" ? v.bill_details_id : 0;
                per["deleteRow"] = [];
                per["debitdeleteRow"] = [];
                per["openingdeleteRow"] = [];
              }
              //console.log("per", per);

              let inner_data = {
                details_id: v.details_id != 0 ? v.details_id : 0,
                type: v.type && v.type != null ? v.type : "",
                perticulars: per,
                paid_amt: v.type == "cr" ? v.cr : v.dr,
                typeobj:
                  v.type && v.type != ""
                    ? getSelectValue(selectOpt, v.type)
                    : "",
                bank_payment_no:
                  v.paymentTranxNo != null ? v.paymentTranxNo : "",
                bank_payment_type:
                  v.bank_payment_type != null ? v.bank_payment_type : "",
                bank_name: v.ledger_name != null ? v.ledger_name : "",
                payment_date:
                  v.payment_date != null
                    ? moment(v.payment_date, "YYYY-MM-DD").format("DD-MM-YYYY")
                    : "",
                debit: v.type == "cr" ? v.cr : "",
                credit: v.type == "dr" ? v.dr : "",
                receiptEdtNarration: "",
                isAdvanceCheck: per.isAdvanceCheck ? per.isAdvanceCheck : "",
                payableAmt: per.payableAmt ? per.payableAmt : 0,
                remainingAmt: per.remainingAmt ? per.remainingAmt : 0,
                selectedAmt: per.selectedAmt ? per.selectedAmt : 0,
                balancingMethod:
                  per.balancingMethod != "" ? per.balancingMethod : "",
              };
              // let innerrow = {
              //   type: "",
              //   perticulars: "",
              //   paid_amt: "",
              //   bank_payment_type: "",
              //   bank_payment_no: "",
              //   debit: "",
              //   credit: "",
              //   receiptEdtNarration: "",
              // };
              if (v.type == "cr") {
                let bankselectedData = {
                  bank_payment_no:
                    v.paymentTranxNo != null ? v.paymentTranxNo : "",
                  bank_payment_type:
                    v.bank_payment_type != null ? v.bank_payment_type : "",
                  bank_name: v.ledger_name != null ? v.ledger_name : "",
                  payment_date:
                    v.payment_date != null
                      ? moment(v.payment_date, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )
                      : "",
                };
                bankData.push(bankselectedData);
                //console.log("bankselectedData", bankselectedData);
              }
              //console.log("inner_data", inner_data);
              initRowData.push(inner_data);
            });
          }
          //console.log("Edit Row ==>", initRowData);
          //console.log("Edit Row perticulars==>", perticulars);
          //console.log("myData", myData);
          // let innerData = perticulars.map((v, i) => {
          //   myData = {
          //     id: v.ledger_id,
          //     ledger_type: v.ledger_type,
          //     type: v.type,
          //     ledger_name: v.ledger_name,
          //     bank_payment_type: v.bank_payment_type,
          //     paymentTranxNo: v.paymentTranxNo,
          //     payment_date: v.payment_date,
          //   };
          //   return myData;
          // });

          // //console.log("innerData--------->", innerData);

          this.setState(
            {
              rows: initRowData,
              isEditDataSet: true,
              selectedLedger: perticulars,
              selectedBillsData: billsdata,
              ledgerData: perticulars,
              myNewLedgrData: myData,
              // payableAmt:initRowData.payableAmt,
            },
            () => {
              this.transaction_ledger_detailsFun(perticulars.ledger_id);
              this.lstgetcashAcbankaccount();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBillselectionOpening = (id, index, status) => {
    // debugger;
    // console.log("id,status,index", id, status, index);
    let {
      lstBills,
      selectedBills,
      selectedBillsdebit,
      selectedBillsOpening,
      totalDebitAmt,
      billLst,
      uncheckRowData,
      debitUncheckData,
      openingUncheckData,
      payableAmt,
    } = this.state;
    let remTotalDebitAmt = payableAmt;
    //console.log("selectedBills====", selectedBills);
    // console.log("selectedBillsdebit====", selectedBillsdebit);
    // console.log("selectedBillsOpening====", selectedBillsOpening);

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
        //console.log("uncheck id", v);
        if (v.invoice_no == id) {
          if (v.source == "sales_invoice") {
            uncheckRowData = uncheckRowData
              ? uncheckRowData.filter((v) => v != id)
              : [];
          }
          if (v.source == "opening_balance") {
            openingUncheckData = openingUncheckData
              ? openingUncheckData.filter((v) => v != id)
              : [];
          }
          if (v.source == "credit_note") {
            debitUncheckData = debitUncheckData
              ? debitUncheckData.filter((v) => v != id)
              : [];
          }
        }
      });
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);

      f_billLst.map((v, i) => {
        //console.log("uncheck id", v);
        if (v.invoice_no == id) {
          if (v.source == "sales_invoice") {
            uncheckRowData = [...uncheckRowData, id];
          }
          if (v.source == "opening_balance") {
            openingUncheckData = [...openingUncheckData, id];
          }
          if (v.source == "credit_note") {
            debitUncheckData = [...debitUncheckData, id];
          }
        }
      });
      /* console.log(
        "uncheck data of invoice",
        uncheckRowData,
        openingUncheckData,
        debitUncheckData
      ); */

      if (id == 0) {
        this.setState({ isAdvanceCheck: false });
      }
    }

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        //console.log("remTotalDebitAmt============:::::::::", remTotalDebitAmt);
        if (f_selectedBills.includes(v.invoice_unique_id)) {
          let pamt = 0;
          if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
            remTotalDebitAmt = remTotalDebitAmt - v["amount"];
            pamt = v["amount"];
          } else {
            let payAmt = parseFloat(this.ref.current.values.payableAmt);
            let remAmt = payAmt - this.finalBillSelectedAmt();

            pamt = remAmt;
            remTotalDebitAmt = 0;
            // console.log("in else of selection",remAmt);
          }
          v["paid_amt"] = pamt;
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);

          let selectbill = pamt + this.finalBillSelectedAmt();
          let remaingbill = parseFloat(v["amount"]) - parseFloat(pamt);
          this.setState({
            selectedAmt: selectbill,
            remainingAmt: remaingbill,
          });
          if (v["remaining_amt"] > 0) {
            MyNotifications.fire(
              {
                show: true,
                icon: "confirm",
                title: "Confirm",
                msg:
                  "selected bill amt is greater than payable amt, do you want to continue",
                is_button_show: false,
                is_timeout: false,
                delay: 0,
                handleSuccessFn: () => {
                  // console.log(
                  //   "this.ref.current====>>>????",
                  //   this.ref.current
                  // );

                  let payAmt = parseFloat(this.ref.current.values.payableAmt);
                  let remAmt = parseFloat(v["remaining_amt"]);
                  remTotalDebitAmt = payAmt + remAmt;
                  this.setState({
                    totalDebitAmt: remTotalDebitAmt,
                    payableAmt: remTotalDebitAmt,
                  });

                  // console.log("remTotalDebitAmt:", remTotalDebitAmt);
                  this.ref.current.setFieldValue(
                    "payableAmt",
                    isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                  );
                  v["paid_amt"] = v["amount"];
                  v["remaining_amt"] = 0;
                  let selectbill = parseFloat(v["amount"]);
                  let remaingbill = 0;
                  this.setState({
                    selectedAmt: selectbill,
                    remainingAmt: remaingbill,
                  });
                },
                handleFailFn: () => {},
              },
              () => {
                console.warn("return_data");
              }
            );
          }
        } else {
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v.amount);
        }
      } else {
        if (f_selectedBills.includes(v.invoice_unique_id)) {
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
          let selectbill = parseFloat(v.amount);
          let remaingbill = parseFloat(v["amount"]) - parseFloat(v.amount);
          this.setState({
            selectedAmt: selectbill,
            remainingAmt: remaingbill,
          });
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
      billLst: f_billLst,
      uncheckRowData: uncheckRowData,
      openingUncheckData: openingUncheckData,
      debitUncheckData: debitUncheckData,
    });
  };

  handleBillsSelectionAllCredit = (status) => {
    // ;
    let { billLst } = this.state;
    //console.log({ billLst });
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;

        return v;
      });

      //console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (v.source == "credit_note") {
          v["credit_paid_amt"] = 0;
          v["credit_remaining_amt"] = parseFloat(v.Total_amt);
          return v;
        }

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsCredit: lstSelected,
      billLst: fBills,
    });
  };

  handleBillselectionDebit = (id, index, status) => {
    let { billLstSc, selectedBillsdebit } = this.state;
    //console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        //console.log("selectedBillsdebit", selectedBillsdebit);
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
      billLstSc: f_billLst,
    });
  };

  handleBillsSelectionAllDebit = (status) => {
    let { billLstSc } = this.state;
    let fBills = billLstSc;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLstSc.map((v) => v.debit_note_no);
      //console.log("All BillLst Selection", billLstSc);
      fBills = billLstSc.map((v) => {
        if (v.source === "debit_note") {
          v["debit_paid_amt"] = parseFloat(v.Total_amt);
          v["debit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

          return v;
        }

        return v;
      });

      //console.log("fBills", fBills);
    } else {
      fBills = billLstSc.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsDebit: lstSelected,
      billLstSc: fBills,
    });
  };

  // finalBillAmt = () => {
  //   const { billLst, billLstSc } = this.state;
  //   console.log({ billLst, billLstSc });

  //   let paidAmount = 0;
  //   billLst.map((next) => {
  //     if ("paid_amt" in next) {
  //       paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
  //     }
  //   });

  //   let creditPaidAmount = 0;
  //   billLst.map((next) => {
  //     if ("credit_paid_amt" in next) {
  //       creditPaidAmount =
  //         creditPaidAmount +
  //         parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0);
  //     }
  //   });

  //   // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });

  //   if (paidAmount >= creditPaidAmount) {
  //     let amt = paidAmount - creditPaidAmount;
  //     return amt;
  //     // billLst.map((v, i) => {
  //     //   v['paid_amt'] = paidAmount - debitPaidAmount;
  //     //   return v;
  //     // });
  //     // this.handleChangeArrayElement(amt);
  //   } else {
  //     return "Go To Payment";
  //   }
  // };

  finalBillAmt = () => {
    const { billLst } = this.state;
    //console.log("bills in final function", { billLst });
    // let advanceAmt = this.state.advanceAmt;
    let opnAmount = this.finalBillOpeningAmt();
    let invAmount = this.finalInvoiceBillAmt();
    let paidAmount = opnAmount + invAmount;

    let debitPaidAmount = this.finalCreditBillAmt();

    if (paidAmount >= debitPaidAmount) {
      let amt = paidAmount - debitPaidAmount;
      return amt;
      // billLst.map((v, i) => {
      //   v['paid_amt'] = paidAmount - debitPaidAmount;
      //   return v;
      // });
      // this.handleChangeArrayElement(amt);
    } else {
      return "Go To Receipt";
    }
  };

  FetchPendingBills = (id, type, balancing_method, value) => {
    //console.log("balancing_method ", balancing_method, type);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    getdebtorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        //console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          let { editBillData, rows, index } = this.state;
          //console.log("data", data);
          if (data.length > 0 || rows.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SD") {
              let { editBillData, rows, index } = this.state;
              //console.log("rows=->", rows);
              //console.log("index=->", index);
              let selectedAmt = 0;
              let payableAmt = 0;
              let remainingAmt = 0;
              let isAdvanceCheck = false;
              let bills = [];
              let uncheckRowData = [];
              let debitUncheckData = [];
              let openingUncheckData = [];

              if (index != -1) {
                let obj = rows[index]["perticulars"];
                //console.log("obj", obj);
                if (obj) {
                  selectedAmt = obj.selectedAmt ? obj.selectedAmt : 0;
                  payableAmt = obj.payableAmt ? obj.payableAmt : 0;
                  remainingAmt = obj.remainingAmt ? obj.remainingAmt : 0;
                  isAdvanceCheck = obj.isAdvanceCheck
                    ? obj.isAdvanceCheck
                    : false;
                  bills = obj.bills ? obj.bills : [];
                  uncheckRowData = obj.deleteRow ? obj.deleteRow : [];
                  openingUncheckData = obj.openingdeleteRow
                    ? obj.openingdeleteRow
                    : [];
                  debitUncheckData = obj.debitdeleteRow
                    ? obj.debitdeleteRow
                    : [];
                }
              }

              let f_selectedBills = [];
              let f_selectedDebitBills = [];

              let data_ids = bills.map(
                (vi) => vi.invoice_unique_id
                // );
                // let data_deb_ids = bills.map(
                //   (vi) => vi.source === "credit_note" && vi.credit_note_id
              );

              let newBills = [...bills];
              f_selectedBills = data_ids;
              data.map((dv, di) => {
                if (
                  "invoice_unique_id" in dv &&
                  !data_ids.includes(dv.invoice_unique_id)
                ) {
                  newBills.push(dv);
                }
              });

              let invoiceLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "sales_invoice"
              );
              //console.log("invoiceLst", invoiceLst);
              //console.log("After invoiceLst newBills =-> ", newBills);
              let debitLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "credit_note"
              );
              //console.log("debitLst", debitLst);
              //console.log("After debitLst newBills =-> ", newBills);
              let openingLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "opening_balance"
              );
              this.setState({
                billLst: newBills,
                billadjusmentmodalshow: true,
                selectedBills: f_selectedBills,
                selectedBillscredit: f_selectedDebitBills,
                selectedAmt: selectedAmt,
                payableAmt: payableAmt,
                remainingAmt: remainingAmt,
                isAdvanceCheck: isAdvanceCheck,
                uncheckRowData: uncheckRowData,
                debitUncheckData: debitUncheckData,
                openingUncheckData: openingUncheckData,
                openingUncheckData: openingUncheckData,
                debitListExist: debitLst.length > 0 ? true : false,
                invoiceListExist: invoiceLst.length > 0 ? true : false,
                openingListExist: openingLst.length > 0 ? true : false,
              });
            } else if (balancing_method === "bill-by-bill" && type === "SC") {
              this.setState({
                billLstSc: data,
                billadjusmentDebitmodalshow: true,
                selectedBills: [],
                selectedBillscredit: [],
                isAdvanceCheck: false,
                uncheckRowData: [],
                debitUncheckData: [],
                openingUncheckData: [],
              });
            } else if (balancing_method === "on-account") {
              this.setState({
                billLst: data,
                onaccountmodal: false,
                selectedBills: [],
                selectedBillscredit: [],
                isAdvanceCheck: false,
                uncheckRowData: [],
                debitUncheckData: [],
                openingUncheckData: [],
                openingUncheckData: [],
              });
            }
          }
          // document.getElementById("perticulars").focus();
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ billLst: [] });
      });
  };

  lstPOPendingOrder = (values) => {
    const { invoice_data } = this.state;
    let { supplierCodeId } = invoice_data;

    let reqData = new FormData();
    reqData.append(
      "supplier_code_id",
      supplierCodeId ? supplierCodeId.value : ""
    );
    getPOPendingOrderWithIds(reqData)
      .then((response) => {
        //console.log("Pending Order Response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchasePendingOrderLst: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ purchasePendingOrderLst: [] });
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
  handleOnAccountSubmit = (v) => {
    let { index, rows } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["debit"] = v.paid_amt;
        //console.log(" on account v", v);
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountmodal: false, index: -1 });
      }
    );
  };
  handleBillByBillDebitSubmit = (v) => {
    let { index, rows, billLstSc } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        //console.log("vi", vi);
        //console.log("v", v);

        v["perticulars"]["billids"] = billLstSc;

        v["debit_paid_amt"] = billLstSc.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.debit_paid_amt ? next.debit_paid_amt : 0)
          );
        }, 0);

        let total = v["debit_paid_amt"] != null ? v["debit_paid_amt"] : 0;

        v["debit"] = total;

        v["paid_amt"] = total;
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
        billLstSc: [],
      },
      () => {
        this.setState({ billadjusmentDebitmodalshow: false, index: -1 });
      }
    );
  };
  handleBillByBillSubmit = (v) => {
    let {
      index,
      rows,
      billLst,
      uncheckRowData,
      debitUncheckData,
      openingUncheckData,
      payableAmt,
    } = this.state;
    //console.log("billLst", billLst);
    //console.log("index", index);
    //console.log("rows", rows);
    let selectedAmt = this.finalBillSelectedAmt();
    let remainingAmt = this.finalRemaningSelectedAmt();
    let frow = rows.map((vi, ii) => {
      // if(billLst.paid_amt>0){
      //   let selBillList = billLst;
      //   //console.log("SelBillList==???::::",selBillList);
      // }
      let f_billLst = billLst.filter((vf) => vf.paid_amt != 0);
      //console.log("f_billLst==???::::", f_billLst);
      if (ii == index) {
        //console.log("vi", vi);
        //console.log("v", v);
        vi["perticulars"]["billids"] = f_billLst;
        vi["perticulars"]["deleteRow"] = uncheckRowData;
        vi["perticulars"]["openingdeleteRow"] = openingUncheckData;
        vi["perticulars"]["debitdeleteRow"] = debitUncheckData;
        vi["perticulars"]["payableAmt"] = payableAmt;
        vi["perticulars"]["selectedAmt"] = selectedAmt;
        vi["perticulars"]["remainingAmt"] = remainingAmt;
        vi["billids"] = billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        vi["credit_paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0)
          );
        }, 0);

        let total =
          vi["paid_amt"] -
          (vi["credit_paid_amt"] != null ? vi["credit_paid_amt"] : 0);

        vi["debit"] = total;

        vi["paid_amt"] = total;
      }
      return vi;
    });
    //console.log("frow ", frow);

    this.setState(
      {
        rows: frow,
        billLst: [],
      },
      () => {
        let innerrow = {
          type: "cr",
          typeobj: getValue(selectOpt, "cr"),
          perticulars: "",
          paid_amt: "",
          bank_payment_type: "",
          bank_payment_no: "",
          bank_name: "",
          // check_number:"",
          payment_date: "",
          debit: "",
          credit: "",
          receiptEdtNarration: "",
        };
        // let RowDataExist = rows[rows.length - 1].perticulars;
        this.setState({ billadjusmentmodalshow: false, index: -1 }, () => {
          this.FocusTrRowFieldsID(`receipt-edit-perticulars-${index + 1}`);
        });
      }
    );
  };
  handleBillsSelectionAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(v.amount);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);

        return v;
      });

      //console.log("lst", lstSelected);
    } else {
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(0);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(0);

        return v;
      });

      //console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      selectedBills: lstSelected,
      billLst: fBills,
    });
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "voucher_receipt_edit",
      to: "voucher_receipt_list",
    });
  };

  ledgerModalFun = (status, index = -1) => {
    let { rows } = this.state;
    let obj = rows.find((v, i) => i == index);

    this.setState({
      ledgerData: [],
      ledgerModal: status,
      rowIndex: index,
      objCR: obj,
    });
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
              id: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              balance_type: v.balance_type,
              balancingMethod: v.balancingMethod,
              type: v.type,
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
              id: parseInt(v.id),
              name: v.ledger_name,
              state: stateCode,
              balance_type: v.balance_type,
              balancingMethod: v.balancingMethod,
              type: v.type,
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
  handleBillByBill = (element, value, index) => {
    let { rows, ledgerList, selectedLedger } = this.state;
    //console.log("BillByBill==>>", element, value, index, rows);
    // this.setState({ billadjusmentmodalshow: true, index: index,rows });
    // let lastCrBal = 0;
    let debitBal = 0;
    let creditBal = 0;

    //console.log({ element, value, index });
    //console.log("ledgerData", { selectedLedger });
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      //console.log("v-type => ", v["type"]);
      //console.log("i => ", { v, i });
      if (v["type"] == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // //console.log('bal', bal);
      } else if (v["type"] == "dr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          //console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          //console.log("cr value", value);
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    //console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    //console.log("lastCrBal ", lastCrBal);

    //console.log("frows", { frows });

    if (element == "debit") {
      let obj = rows.find((v, i) => i == index);
      //console.log("obj", obj);

      if (obj.type == "cr") {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancing_method,
          value
        );
      } else if (obj.type == "dr") {
        //console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            //  (lastCrBal -lastCrBal - vi["paid_amt"]),
            vi["credit"] = lastCrBal;
            vi["paid_amt"] = lastCrBal;
            //console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    //console.log("frows", { frows });

    this.setState({ rows: frows, index: index });
  };

  finalRemainingBillAmt = () => {
    const { billLst } = this.state;
    //console.log({ billLst });

    let remainingAmt = this.finalRemaningOpeningAmt();
    let invoiceRemaningAmt = this.finalRemaningInvoiceAmt();
    let creditRemainingAmount = this.finalRemaningDebitAmt();

    let amt = remainingAmt + invoiceRemaningAmt - creditRemainingAmount;
    return amt;
    // billLst.map((v, i) => {
    //   v['paid_amt'] = paidAmount - debitPaidAmount;
    //   return v;
    // });
    // this.handleChangeArrayElement(amt);
  };

  handlePropsData = (prop_data) => {
    // debugger;
    console.warn("prop_data=====>><<>><<", prop_data);
    // let { cashAcbankLst } = this.state;
    console.warn("cashBankList:::::::::-->", this.state.cashAcbankLst);
    // debugger;
    let { ledgerList, cashAcbankLst } = this.state;

    // alert("Hello")
    // //console.log("prop_data", this.props.block)
    if (prop_data.prop_data.invoice_data) {
      // alert("helloOOOOOO")
      this.setState(
        {
          initVal: prop_data.prop_data.invoice_data,
          rows: prop_data.prop_data.rows,
          // productId: prop_data.productId,
          ledgerId: prop_data.prop_data.ledgerId,
          // additionalChargesId: prop_data.additionalChargesId,
        },
        () => {
          let frows = [...this.state.rows];
          // //console.log("frows=====>", frows);
          // //console.log("prop_data", prop_data);
          // //console.log("ledgerList", ledgerList);
          // //console.log("ledgerID", parseInt(this.state.ledgerId));
          // //console.log(
          //   "ledgerobj",
          //   getSelectValue(cashAcbankLst, parseInt(this.state.ledgerId))
          // );
          frows[prop_data.prop_data.rowIndex]["typeobj"] = getSelectValue(
            selectOpt,
            frows[prop_data.prop_data.rowIndex]["type"]
          );

          if (frows[prop_data.prop_data.rowIndex]["type"] === "cr") {
            frows[prop_data.prop_data.rowIndex]["perticulars"] = getSelectValue(
              ledgerList,
              parseInt(this.state.ledgerId)
            )
              ? getSelectValue(ledgerList, parseInt(this.state.ledgerId))
              : "";
          } else {
            frows[prop_data.prop_data.rowIndex]["perticulars"] = getSelectValue(
              cashAcbankLst,
              parseInt(this.state.ledgerId)
            )
              ? getSelectValue(cashAcbankLst, parseInt(this.state.ledgerId))
              : "";
          }

          this.setState(
            { rows: frows, isPropDataSet: false, prop_data: "" },
            () => {
              console.warn(
                "data->>>>>>>",
                cashAcbankLst,
                parseInt(this.state.ledgerId)
              );
              console.warn(
                "ledger name->>>>>>",
                getSelectValue(cashAcbankLst, parseInt(this.state.ledgerId))
              );
              // debugger;
              if (frows[prop_data.prop_data.rowIndex]["type"] !== "cr") {
                if (
                  frows[prop_data.prop_data.rowIndex]["type"] == "dr" &&
                  frows[prop_data.prop_data.rowIndex]["perticulars"] == ""
                ) {
                  setTimeout(() => {
                    if (prop_data != "") {
                      this.FocusTrRowFieldsID(
                        `receipt-edit-perticulars-${this.props.block.prop_data.prop_data.rowIndex}`
                      );
                    }
                  }, 1000);
                } else if (
                  frows[prop_data.prop_data.rowIndex]["type"] !== "cr"
                ) {
                  this.handleChangeArrayElement(
                    "perticulars",
                    getSelectValue(cashAcbankLst, parseInt(this.state.ledgerId))
                      ? getSelectValue(
                          cashAcbankLst,
                          parseInt(this.state.ledgerId)
                        )
                      : "",
                    prop_data.prop_data.rowIndex
                  );
                  setTimeout(() => {
                    this.FocusTrRowFieldsID(
                      `receipt-edit-credit-${this.props.block.prop_data.prop_data.rowIndex}`
                    );
                  }, 1000);
                }
              } else {
                setTimeout(() => {
                  if (prop_data != "") {
                    this.FocusTrRowFieldsID(
                      `receipt-edit-perticulars-${this.props.block.prop_data.prop_data.rowIndex}`
                    );
                  } else {
                  }
                }, 1000);
              }
            }
          );
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // @mrunal @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      // this.setreceiptlastrecords();
      this.lstgetsundrydebtors_indirectexpenses();
      this.lstgetcashAcbankaccount();
      this.initRows();
      this.transaction_ledger_listFun();
      this.lstModeOfPayment();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      let { prop_data } = this.props.block;
      this.setState({ ldview: prop_data.ldview });
      // //console.log("prop_data Receipt", prop_data);
      // // console.warn("rahul::prop_data", prop_data);
      // this.setState(
      //   { source: prop_data, receiptEditData: prop_data.prop_data },
      //   () => {
      //     console.warn("receiptEditData", this.state.receiptEditData);
      //     this.handlePropsData(prop_data);
      //     // //console.log("source", this.state.source);
      //   }
      // );
      // this.setState({ receiptEditData: prop_data.prop_data });

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close
      // alt key button disabled end
    }
  }
  //@neha @On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.ledgerModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
      // this.setState({ billadjusmentmodalshow: false });
    }
  };
  // alt key button disabled start
  // @mrunal @ On Escape key press and On outside Modal click Modal will Close
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close
  }
  // alt key button disabled end
  // @mrunal @ On Escape key press Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
      this.setState({ billadjusmentmodalshow: false });
      this.setState({ bankaccmodal: false });
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

  componentDidUpdate() {
    const {
      isEditDataSet,
      receiptEditData,
      cashAcbankLst,
      sundryCreditorLst,
    } = this.state;
    //console.log("receiptEditData", cashAcbankLst);

    if (
      drcrtype.length > 0 &&
      isEditDataSet == false &&
      receiptEditData != "" &&
      cashAcbankLst.length > 0 &&
      sundryCreditorLst.length > 0 &&
      receiptEditData.id != ""
    ) {
      this.setReceiptEditData();
    }
    // let { prop_data } = this.props.block;
    // //console.log("receipt prop_data", prop_data);
    // // if (cashAcbankLst.length > 0 && prop_data != "") {
    // this.handlePropsData(prop_data);
  }

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleCreditdebitBalance = (index) => {
    // debugger;
    let { rows } = this.state;
    //console.log("rows-->", rows);
    let debitAmt = this.getTotalDebitAmt();
    let creditAmt = this.getTotalCreditAmt();
    // let count = index + 1;
    rows.map((v, i) => {
      if (debitAmt != creditAmt) {
        if (v["perticulars"] != "" && i != index) {
          let innerrow = {
            type: "dr",
            typeobj: getSelectValue(selectOpt, "dr"),
            perticulars: "",
            paid_amt: "",
            bank_payment_type: "",
            bank_payment_no: "",
            bank_name: "",
            payment_date: "",
            debit: "",
            credit: "",
            receiptEdtNarration: "",
          };

          this.setState({ rows: [...this.state.rows, innerrow] }, () => {
            // //console.log("row innerrow====", this.state.rows);
            // this.typeRef.current.focus();
            this.FocusTrRowFieldsID(`receipt-edit-perticulars-${rows.length}`);
          });
        }
      }
    });
  };

  handleChangeArrayElement = (element, value, index) => {
    let debitBal = 0;
    let creditBal = 0;
    // //console.log({ element, value, index });
    console.warn("value->>>>>>>>", value);
    // debugger;
    let { rows } = this.state;
    let debitamt = 0;
    let creditamt = 0;
    //console.log("rows", rows);
    let frows = rows.map((v, i) => {
      if (v["type"] == "cr") {
        if (v["paid_amt"] != "" && i != index)
          debitBal = debitBal + parseFloat(v["paid_amt"]);
      } else if (v["type"] == "dr" && i != index) {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          //console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          //console.log("cr value", value);
        }
        if (element == "perticulars") {
          if (v.type == "cr") {
            value["selectedAmt"] = 0;
            value["payableAmt"] = 0;
            value["remainingAmt"] = 0;
            value["isAdvanceCheck"] = false;
          }
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    //console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    // let lastCrBal = debitBal;
    //console.log("lastCrBal ", lastCrBal);
    //console.log("frows", { frows });

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      //console.log("obj======>>>>>>>>", obj);
      if (obj.type == "cr") {
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancingMethod
        );
      } else if (obj.type == "dr") {
        //console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
            vi["credit"] = lastCrBal;
            //console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    //console.log("frows", { frows });
    this.setState({ rows: frows, index: index }, () => {
      this.FocusTrRowFieldsID(`receipt-edit-credit-${index}`);
    });
  };
  handleUnitLstOpt = (productId) => {
    // //console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // //console.log("productId", productId);
    if (productId != undefined && productId) {
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
      if (i == index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };

  // New code

  handleElementClick = (index) => {
    let type = this.setElementValue("type", index);
    if (type == "dr") {
      // this.setState({ show: true, index: index });
      this.setState({ index: index });
    } else if (type == "cr") {
      // this.setState({ crshow: true, index: index });
      this.setState({ index: index });
    }
  };
  handleOnAccountSubmit = (v) => {
    let { index, rows } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["debit"] = v.paid_amt;
        //console.log("On account -->", v);
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountmodal: false, index: -1 });
      }
    );
  };

  handleOnAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        return v;
      } else {
        return vi;
      }
    });
    // debit;
    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountcashaccmodal: false, index: -1 });
      }
    );
  };

  handleBankAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let bankData = [];

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        // v['credit'] = v['paid_amt'];

        return v;
      } else {
        return vi;
      }
    });

    bankData["bank_payment_type"] = v.bank_payment_type
      ? v.bank_payment_type.label
      : "";
    bankData["bank_name"] = v.bank_name ? v.bank_name.label : "";
    bankData["bank_payment_no"] = v.bank_payment_no;
    bankData["payment_date"] = v.payment_date;
    this.setState(
      {
        rows: frow,
        index: index,
        bankData: bankData,
      },
      () => {
        this.setState({ bankaccmodal: false, index: -1 });
      }
    );
  };

  handleBillPayableAmtChange = (value, index) => {
    //console.log({ value, index });
    const { billLst, billLstSc } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // //console.log('v', v);
      // //console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "sales_invoice") {
        v["paid_amt"] = value;
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "credit_note") {
        v["paid_amt"] = value;
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      } else if (i == index && v.source == "opening_balance") {
        v["paid_amt"] = value;
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
    // this.setState({ billLstSc: fDBilllst });
  };

  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
      }
    });
    return isNaN(debitamt) ? 0 : debitamt;
  };
  getTotalCreditAmt = () => {
    let { rows } = this.state;
    // //console.log("Total Credit ", rows);
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "dr") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
        //console.log("creditamt", creditamt);
      }
    });
    return isNaN(creditamt) ? 0 : creditamt;
  };
  // New code
  getCurrentOpt = (index) => {
    let { rows, sundryCreditorLst, cashAcbankLst } = this.state;

    // //console.log({ sundryCreditorLst });
    // //console.log({ cashAcbankLst });
    let currentObj = rows.find((v, i) => i == index);
    // //console.log('currentObject', currentObj);
    if (currentObj.type == "cr") {
      return sundryCreditorLst;
    } else if (currentObj.type == "dr") {
      return cashAcbankLst;
    }
    return [];
  };
  // ! function set border to required fields
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
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
  finalBillSelectedAmt = () => {
    const { billLst } = this.state;
    let amt = 0;
    let paidAmount = 0;
    // //console.log("bill in selected final amt",{ billLst });
    billLst.map((next) => {
      if (
        next.balancing_type.trim().toLowerCase() == "dr" ||
        parseInt(next.invoice_id) == 0
      ) {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });
    // //console.log("paidAmount in select::::::::", paidAmount);
    let debitPaidAmount = 0;
    billLst.map((next) => {
      if (
        next.balancing_type.trim().toLowerCase() == "cr" &&
        next.invoice_no != "New Ref"
      ) {
        if ("paid_amt" in next) {
          debitPaidAmount =
            debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });
    // //console.log("debitPaidAmount::::::::", debitPaidAmount);

    amt = paidAmount - debitPaidAmount;
    // //console.log("in else amt::::::::", amt);
    // }
    return amt;
  };
  finalBalanceOpeningAmt = () => {
    const { billLst } = this.state;
    //console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "opening_balance") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };
  finalBalanceInvoiceAmt = () => {
    const { billLst } = this.state;
    // //console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "sales_invoice") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };
  finalInvoiceBillAmt = () => {
    // debugger;
    let { billLst } = this.state;
    //console.log({ billLst });
    let advanceAmt = this.state.advanceAmt;
    let paidAmount = 0;
    billLst.map((next) => {
      if (next.source == "sales_invoice") {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });
    //console.log("paid in bill invoice", paidAmount);
    // if (advanceAmt != 0) {
    //   paidAmount = paidAmount + advanceAmt;
    //   //console.log("paid in bill invoice in adv", paidAmount);
    // }

    return isNaN(paidAmount) ? 0 : paidAmount;
  };

  finalBillOpeningAmt = () => {
    const { billLst } = this.state;
    // //console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        if (next.source == "opening_balance") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  finalRemaningOpeningAmt = () => {
    const { billLst } = this.state;
    // //console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "opening_balance") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };

  finalRemaningInvoiceAmt = () => {
    const { billLst } = this.state;
    // //console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "sales_invoice") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });
    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };

  finalRemaningCreditAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "credit_note") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };

  finalRemaningSelectedAmt = () => {
    let paidAmt = this.state.payableAmt;
    let selectedAmt = this.finalBillSelectedAmt();
    if (paidAmt != 0) {
      //console.log("paidAmt", paidAmt);
      //console.log("selectedAmt", selectedAmt);
      // this.setState({ selAmtDisa: selectedAmt });
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
  };

  finalCreditBillAmt = () => {
    const { billLst, billLstSc } = this.state;
    //console.log({ billLst, billLstSc });

    let creditPaidAmount = 0;
    billLst.map((next) => {
      if (next.source == "credit_note") {
        if ("paid_amt" in next) {
          creditPaidAmount =
            creditPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });
    return creditPaidAmount;

    // //console.log({ paidAmount, creditPaidAmount, debitPaidAmount });
  };
  handleAdvaceCheck = (status) => {
    //console.log("advanceAmt Status===:::", status);
    let { billLst, selectedBills, remainingAmt, uncheckRowData } = this.state;
    /*  console.log("billLst, selectedBills, remainingAmt", {
      billLst,
      selectedBills,
      remainingAmt,
    }); */
    if (status == true) {
      // debugger;
      let advanceAmt = this.finalRemaningSelectedAmt();
      // let advanceAmt = remainingAmt;
      //console.log("advance amt in check:::::", advanceAmt);
      let remTotalDebitAmt = advanceAmt;
      if (parseFloat(advanceAmt) > 0) {
        let obj = billLst.find((v) => v.source == "sales_invoice");
        let newObj = { ...obj };
        newObj["amount"] = advanceAmt;
        newObj["paid_amt"] = advanceAmt;
        newObj["debit_paid_amt"] = 0;
        newObj["debit_remaining_amt"] = 0;
        newObj["invoice_date"] = moment(new Date()).format("YYYY-MM-DD");
        newObj["invoice_id"] = 0;
        newObj["invoice_no"] = "New Ref";
        newObj["invoice_unique_id"] = "" + convertToSlug("new-ref") + ",0";
        newObj["remaining_amt"] = 0;
        newObj["total_amt"] = advanceAmt;
        newObj["balancing_type"] = "Cr";
        newObj["source"] = "sales_invoice";
        newObj["bill_details_id"] = 0;
        let fBilllst = [...billLst, newObj];
        let f_selectedBills = [...selectedBills, newObj["invoice_unique_id"]];

        uncheckRowData = uncheckRowData.filter(
          (v) => parseInt(v) != parseInt(newObj["invoice_id"])
        );

        let invoiceLst = fBilllst.filter(
          (v) => v.source.trim().toLowerCase() == "sales_invoice"
        );
        this.setState({
          billLst: fBilllst,
          isAdvanceCheck: true,
          selectedBills: f_selectedBills,
          advanceAmt: advanceAmt,
          uncheckRowData: uncheckRowData,
          invoiceListExist: invoiceLst.length > 0 ? true : false,
        });
      }
    } else if (status == false) {
      //console.log("selectedBills", selectedBills);
      let advance = billLst.find(
        (v) => convertToSlug(v.invoice_no) == convertToSlug("new-ref")
      );
      //console.log("advance==>>>>>>>>>>", advance);
      selectedBills = selectedBills.filter(
        (v) => v != advance.invoice_unique_id
      );
      billLst = billLst.filter(
        (v) => convertToSlug(v.invoice_no) != convertToSlug("new-ref")
      );
      uncheckRowData = [...uncheckRowData, advance.invoice_unique_id];
      this.setState(
        {
          billLst: billLst,
          isAdvanceCheck: false,
          selectedBills: selectedBills,
          advanceAmt: 0,
          remainingAmt: advance ? advance.paid_amt : 0,
          uncheckRowData: uncheckRowData,
          // advanceAmt: advance ? advance.paid_amt : 0,
        },
        () => {
          let obj = billLst.find(
            (v) =>
              v.source == "sales_invoice" &&
              selectedBills.includes(v.invoice_unique_id)
          );
          // this.handleBillselection(obj.invoice_unique_id, 0, true);
        }
      );
    }
  };

  // handleTableRow(event) {
  //   const t = event.target;
  //   // console.warn("current ->>>>>>>>>>", t);
  //   let { rowIndex, objCR } = this.state;
  //   let { handleBillByBill, ledgerData } = this.props;
  //   const k = event.keyCode;
  //   if (k === 40) {
  //     //right

  //     const next = t.nextElementSibling;
  //     if (next) {
  //       next.focus();

  //       let val = JSON.parse(next.getAttribute("value"));

  //       // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

  //       this.transaction_ledger_detailsFun(val.id);
  //       // transaction_ledger_detailsFun(val.id);
  //     }
  //   } else if (k === 38) {
  //     let prev = t.previousElementSibling;
  //     if (prev) {
  //       // console.warn('prev ->>>>>>>>>>', prev)
  //       // prev = t.previousElementSibling;
  //       prev.focus();
  //       let val = JSON.parse(prev.getAttribute("value"));
  //       // const da = document.getElementById(prev.getAttribute("id"));
  //       // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

  //       this.transaction_ledger_detailsFun(val.id);
  //       // transaction_ledger_detailsFun(val.id);
  //     }
  //   } else if (k === 13) {
  //     let cuurentProduct = t;
  //     let selectedLedgerData = JSON.parse(cuurentProduct.getAttribute("value"));
  //     console.warn("selectedLedger->>>>>>>>", selectedLedgerData);
  //     if (objCR && objCR.type == "cr") {
  //       this.setState(
  //         { ledgerModal: false, selectedLedger: selectedLedgerData },
  //         () => {
  //           this.handleChangeArrayElement(
  //             "perticulars",
  //             selectedLedgerData,
  //             rowIndex
  //           );
  //           this.handleBillByBill("debit", selectedLedgerData, rowIndex);
  //         }
  //       );
  //       //console.log("v===>>::", selectedLedgerData);
  //     } else {
  //       this.handleChangeArrayElement(
  //         "perticulars",
  //         selectedLedgerData,
  //         rowIndex
  //       );
  //       this.setState({
  //         ledgerModal: false,
  //         selectedLedger: selectedLedgerData,
  //       });
  //       //console.log("v===>>::", selectedLedgerData);
  //     }
  //   } else if (k == 8) {
  //     //! condition for backspace key press 1409
  //     document.getElementById(`"perticulars-${rowIndex}"`).focus();
  //   } else if (k == 37 || k == 39) {
  //     //! condition for left & right key press 1409
  //   }
  // }

  handlePaymentLedgerTableRow(event) {
    // //console.log("handlePaymentLedgerTableRow", event);
    let {
      rowIndex,
      ledgerList,
      selectedLedgerIndex,
      objCR,
      rows,
      cashAcbankLst,
    } = this.state;
    // let { handleBillByBill, ledgerData } = this.props;
    //console.log("objCR==>", objCR, rowIndex);
    console.warn("cashAcbankLst", cashAcbankLst);
    let currentR = rows[rowIndex];
    const k = event.keyCode;
    if (currentR && currentR["type"].toLowerCase() == "cr") {
      if (k == 13) {
        // //console.log("enter work", selectedLedgerIndex, rowIndex);
        let obj = ledgerList[selectedLedgerIndex];
        // //console.log("enter work", obj);
        if (obj) {
          this.setState(
            {
              ledgerModal: false,
              selectedLedgerIndex: 0,
              selectedLedger: obj,
            },
            () => {
              this.handleChangeArrayElement("perticulars", obj, rowIndex);
              this.handleBillByBill("debit", obj, rowIndex);
              this.transaction_ledger_listFun();
            }
          );
        }
      } else if (k == 40) {
        // //console.log("arrowdown", ledgerList, selectedLedgerIndex);
        if (selectedLedgerIndex < ledgerList.length - 1) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex + 1 },
            () => {
              this.FocusTrRowFieldsID(
                `receipt-edit-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 38) {
        // //console.log("arrowup");
        if (selectedLedgerIndex > 0) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex - 1 },
            () => {
              this.FocusTrRowFieldsID(
                `receipt-edit-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      }
    } else if (currentR && currentR["type"].toLowerCase() == "dr") {
      if (k == 13) {
        // alert("Hello")
        // //console.log("enter work", selectedLedgerIndex, rowIndex);
        let obj = cashAcbankLst[selectedLedgerIndex];
        // //console.log("enter work", obj);
        if (obj.type == "bank_account") {
          this.OutletBankMasterList();
          setTimeout(() => {
            this.bankListRef.current.focus();
          }, 100);
        }

        if (obj) {
          this.setState(
            {
              ledgerModal: false,
              selectedLedgerIndex: 0,
              selectedLedger: obj,
            },
            () => {
              this.handleChangeArrayElement("perticulars", obj, rowIndex);
              // this.handleBillByBill("debit", obj, rowIndex);
              this.transaction_ledger_listFun();
            }
          );
        }
      } else if (k == 40) {
        console.warn("arrowdown", selectedLedgerIndex, cashAcbankLst.length);
        if (selectedLedgerIndex < cashAcbankLst.length - 1) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex + 1 },
            () => {
              this.FocusTrRowFieldsID(
                `receipt-edit-ledger-cashac-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 38) {
        // //console.log("arrowup");
        if (selectedLedgerIndex > 0) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex - 1 },
            () => {
              this.FocusTrRowFieldsID(
                `receipt-edit-ledger-cashac-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      }
    }

    // const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);

    // if (k === 40) {
    //   //right

    //   const next = t.nextElementSibling;
    //   if (next) {
    //     next.focus();

    //     let val = JSON.parse(next.getAttribute("value"));

    //     // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

    //     this.transaction_ledger_detailsFun(val.id);
    //     // transaction_ledger_detailsFun(val.id);
    //   }
    // } else if (k === 38) {
    //   let prev = t.previousElementSibling;
    //   if (prev) {
    //     // console.warn('prev ->>>>>>>>>>', prev)
    //     // prev = t.previousElementSibling;
    //     prev.focus();
    //     let val = JSON.parse(prev.getAttribute("value"));
    //     // const da = document.getElementById(prev.getAttribute("id"));
    //     // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

    //     this.transaction_ledger_detailsFun(val.id);
    //     // transaction_ledger_detailsFun(val.id);
    //   }
    // } else if (k === 13) {
    //   let cuurentProduct = t;
    //   let selectedLedgerData = JSON.parse(cuurentProduct.getAttribute("value"));
    //   // console.warn("selectedLedger->>>>>>>>", selectedLedgerData);
    //   if (objCR && objCR.type == "cr") {
    //     this.setState(
    //       { ledgerModal: false, selectedLedger: selectedLedgerData },
    //       () => {
    //         this.handleChangeArrayElement(
    //           "perticulars",
    //           selectedLedgerData,
    //           rowIndex
    //         );
    //         this.handleBillByBill("debit", selectedLedgerData, rowIndex);
    //       }
    //     );
    //     // console.log("v===>>::", selectedLedgerData);
    //   } else {
    //     this.handleChangeArrayElement(
    //       "perticulars",
    //       selectedLedgerData,
    //       rowIndex
    //     );
    //     this.setState({
    //       ledgerModal: false,
    //       selectedLedger: selectedLedgerData,
    //     });
    //     // console.log("v===>>::", selectedLedgerData);
    //   }
    // } else if (k == 8) {
    //   //! condition for backspace key press 1409
    //   // console.log("backspace", rowIndex);
    //   document.getElementById(`"perticulars-${rowIndex}"`).focus();
    //   // setTimeout(() => {
    //   // }, 100);
    // } else if (k == 37 || k == 39) {
    //   //! condition for left & right key press 1409
    // }
  }

  handleLstChange = (e) => {
    let { orgLedgerList } = this.state;
    if (orgLedgerList.length > 0) {
      const selectedAll = e.target.value;
      let filterLst = orgLedgerList;
      if (selectedAll === "Creditor") {
        filterLst = filterLst.filter((v) => v.type == "SC");
        // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
        // alert(JSON.stringify(filterLst.length));
      } else if (selectedAll === "Debitor") {
        filterLst = filterLst.filter((v) => v.type == "SD");
        // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
        // alert(JSON.stringify(filterLst.length));
      } else {
        // console.warn("filterLst->>>>>>>>", orgLedgerList, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: orgLedgerList });
        // alert(JSON.stringify(ledgerList.length));
      }
    }
  };
  //@neha @handlelstChange for filter
  handleLstChange = () => {
    let { orgLedgerList, selectedAll } = this.state;
    //console.log("selectedAll------>", selectedAll);
    if (orgLedgerList.length > 0) {
      // const selectedAll = e.target.value;
      let filterLst = orgLedgerList;
      if (selectedAll == true) {
        filterLst = filterLst.filter((v) => v.type == "SD");
        // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
        // alert(JSON.stringify(filterLst.length));
      }
      // else if (selectedAll === "SD") {
      //   filterLst = filterLst.filter((v) => v.type == "SD");
      //   // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
      //   this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
      //   // alert(JSON.stringify(filterLst.length));
      // }
      else {
        // console.warn("filterLst->>>>>>>>", orgLedgerList, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: orgLedgerList });
        // alert(JSON.stringify(ledgerList.length));
      }
    }
  };
  finalRemaningDebitAmt = () => {
    const { billLst } = this.state;
    // //console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "credit_note") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };

  OutletBankMasterList = () => {
    getOutletBankMasterList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let bankList = res.responseObject;
          //console.log("bank list==========", bankList);
          let bankNameOpt = [];
          if (bankList.length > 0) {
            bankNameOpt = bankList.map((v) => {
              return {
                label: v.bank_name,
                value: v.id,
              };
            });
          }
          //console.log("bankNameOpt==========", bankNameOpt);

          this.setState({
            bankNameOpt: bankNameOpt,
          });
        }
      })
      .catch((error) => {});
  };

  handleBillsSelectionOpeningAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      // //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        if (
          v.source === "opening_balance" ||
          v.source === "sales_invoice" ||
          v.source === "credit_note"
        ) {
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

      // //console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (
          v.source == "opening_balance" ||
          v.source === "sales_invoice" ||
          v.source === "credit_note"
        ) {
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

  filterData = (value) => {
    //console.log("value in filter>>>>>>>>>>>>>>>", value);
    let { ledgerList, orgLedgerList } = this.state;
    //console.log("productLst--", ledgerList);
    //console.log("orgProductLst", orgLedgerList);
    let filterData = orgLedgerList.filter((v) =>
      v.ledger_name.toLowerCase().includes(value.toLowerCase())
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      ledgerList: filterData.length > 0 ? filterData : [],
      ledgerModal: true,
    });
  };
  lstModeOfPayment = () => {
    getPaymentModes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          //console.log("payment modes:", data);
          let Opt = data.map(function (values) {
            return { value: values.id, label: values.payment_mode };
          });
          this.setState({ BankOpt: Opt }, () => {
            let { prop_data } = this.props.block;
            //console.log("prop_data Receipt", prop_data);
            // console.warn("rahul::prop_data", prop_data);
            this.setState(
              { source: prop_data, receiptEditData: prop_data.prop_data },
              () => {
                console.warn("receiptEditData", this.state.receiptEditData);
                this.handlePropsData(prop_data);
                // //console.log("source", this.state.source);
              }
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  OutletBankMasterList = () => {
    let { selectedLedger } = this.state;
    //console.log("selected ledger in bank master", { selectedLedger });
    if (parseInt(selectedLedger.id) > 0) {
      let requestData = new FormData();
      requestData.append("ledger_id", selectedLedger.id);
      get_ledger_bank_details(requestData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let bankList = res.responseObject;
            // //console.log("bank list==========", bankList);
            let bankNameOpt = [];
            if (bankList.length > 0) {
              bankNameOpt = bankList.map((v) => {
                return {
                  label: v.bank_name,
                  value: v.id,
                };
              });
            }
            //console.log("bankNameOpt==========", bankNameOpt);

            this.setState({
              bankNameOpt: bankNameOpt,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };
  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }

  FocusTrRowFieldsID(fieldName) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
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

  /**** Check Invoice date between Fiscal year *****/
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
              // msg: "",
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
            document.getElementById("transaction_dt").focus();
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
                    document
                      .getElementById("receipt-edit-perticulars-0")
                      .focus();
                  }, 500);
                }
              },
              handleFailFn: () => {
                // setFieldValue("pi_invoice_dt", "");
                // eventBus.dispatch(
                //   "page_change",
                //   "tranx_purchase_invoice_create"
                // );

                setTimeout(() => {
                  // document.getElementById("pi_invoice_dt").focus();
                  document.getElementById("transaction_dt").focus();
                }, 500);
                // this.reloadPage();
              },
            });
          } else {
            this.FocusTrRowFieldsID(`receipt-edit-perticulars-0`);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  render() {
    const {
      myNewLedgrData,
      errorArrayBorderBank,
      ledgerType,
      sourceUnder,
      opType,
      from_source,
      billadjusmentmodalshow,
      billadjusmentDebitmodalshow,
      rows,
      selectedBills,
      onaccountmodal,
      additionalCharges,
      isAllChecked,
      initVal,
      billLst,
      cashAcbankLst,
      isAllCheckeddebit,
      bankaccmodal,
      selectedBillsdebit,
      billLstSc,
      ledgerModal,
      objCR,
      ldview,
      ledgerList,
      selectedLedger,
      rowIndex,
      errorArrayBorder,
      isAdvanceCheck,
      selectedAll,
      selectedBillsData,
      filterOpen,
      creditListExit,
      invoiceListExist,
      openingListExist,
      bankNameOpt,
      isChecked,
      bankData,
      BankOpt,
      ledgerData,
      selectedLedgerIndex,
    } = this.state;
    //console.log("rows", rows);
    return (
      <div className="accountentrynewstyle">
        <div className="cust_table">
          {/* <h6>Purchase Invoice</h6> */}

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initVal}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   receipt_sr_no: Yup.string()
            //     .trim()
            //     .required("Receipt  no is required"),
            //   // transaction_dt: Yup.string().required(
            //   //   "Transaction date is required"
            //   // ),
            //   sundryindirectid: Yup.string().required().value,
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //console.log("values----------->", values);
              let data;
              //console.log("Debit total amt", this.getTotalDebitAmt());
              //console.log("credit total amt", this.getTotalCreditAmt());
              //! validation required start
              let errorArray = [];
              if (
                values.transaction_dt == "" ||
                values.transaction_dt == "__/__/____"
              ) {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  if (
                    this.getTotalDebitAmt() == this.getTotalCreditAmt() &&
                    this.getTotalCreditAmt() > 0 &&
                    this.getTotalDebitAmt() > 0
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
                          let requestData = new FormData();
                          this.setState({
                            invoice_data: values,
                          });
                          let filterRow = rows.filter((v) => {
                            if (v.bank_payment_type != "") {
                              // v.bank_payment_type = v.bank_payment_type;
                              v.bank_payment_type = v.bank_payment_type
                                ? v.bank_payment_type.id
                                : "";
                              v.bank_name = v.bank_name;
                              v.bank_payment_no = v.bank_payment_no;
                              // v.payment_date = v.payment_date;
                              v.payment_date =
                                v.payment_date != ""
                                  ? moment(v.payment_date).format("YYYY-MM-DD")
                                  : "";
                            }
                            return v;
                          });
                          //console.log("rows", rows);
                          //console.log("filterRow", filterRow);
                          // if (creditamt == debitamt) {
                          let frow = filterRow.filter((v) => v.type != "");
                          let formData = new FormData();
                          //console.log("frow", frow);

                          frow = frow.map((v, i) => {
                            let perticulareDelete = "";
                            if (
                              v.perticulars.id != this.state.perticularsDelete
                            ) {
                              perticulareDelete = this.state.perticularsDelete;
                            }
                            if (
                              v.perticulars &&
                              v.perticulars.balancing_method == "bill-by-bill"
                            ) {
                              let billRow =
                                v.perticulars &&
                                v.perticulars.billids &&
                                v.perticulars.billids.map((vi, ii) => {
                                  if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                    vi["bill_details_id"] = vi[
                                      "bill_details_id"
                                    ]
                                      ? vi["bill_details_id"]
                                      : 0;
                                    return vi;
                                  }
                                });

                              // //console.log("vi >>>>>>", vi);
                              // billRow = billRow.filter((v) => v != undefined);
                              // //console.log("billrow >>>>>>", billRow);

                              let perObj = {
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                                payableAmt: v.perticulars.payableAmt,
                                remainingAmt: v.perticulars.remainingAmt,
                                selectedAmt: v.perticulars.selectedAmt,
                                isAdvanceCheck: v.isAdvanceCheck,
                                billids: billRow,
                                deleteRow: v.perticulars.deleteRow,
                                debitdeleteRow: v.perticulars.debitdeleteRow,
                                OpeningDeleteRow:
                                  v.perticulars.openingdeleteRow,

                                // billids: billRow,
                              };
                              //console.log("perObj===>", perObj);
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,

                                perticulars: perObj,
                              };
                            } else if (
                              v.perticulars &&
                              v.perticulars.balancing_method == "on-account"
                            ) {
                              let perObj = {
                                id: v.perticulars.id,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                perticulars: perObj,
                              };
                            } else {
                              let perObj = {
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                perticulareDelete: perticulareDelete,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.credit,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                bank_payment_type: v.bank_payment_type,
                                bank_payment_no: v.bank_payment_no,

                                perticulars: perObj,
                              };
                            }
                          });
                          //console.log("frow ---------", frow);

                          // var filtered = frow.filter(function (el) {
                          //   return el != null;
                          // });
                          formData.append("row", JSON.stringify(frow));

                          // formData.append('rows', JSON.stringify(frow));
                          // //console.log("rows", rows);
                          formData.append(
                            "transaction_dt",
                            moment(values.transaction_dt, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )
                          );
                          formData.append("receiptId", values.receipt_sr_no);

                          formData.append(
                            "receipt_sr_no",
                            values.receipt_sr_no
                          );
                          formData.append("receipt_code", values.receipt_code);
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);

                          if (values.receiptEdtNarration != null) {
                            formData.append(
                              "narration",
                              values.receiptEdtNarration
                            );
                          }
                          //console.log("Form Date ", formData);
                          for (var pair of formData.entries()) {
                            //console.log(pair[0] + ", " + pair[1]);
                          }
                          formData.append(
                            "uncheckRowData",
                            JSON.stringify(this.state.uncheckRowData)
                          );

                          update_receipt(formData)
                            .then((response) => {
                              //console.log("response", response);
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
                                this.initRows();
                                if ("ledgerId" in this.state.source != "") {
                                  eventBus.dispatch("page_change", {
                                    from: "voucher_receipt_list",
                                    to: "ledgerdetails",
                                    // prop_data: this.state.source["ledgerId"],
                                    prop_data: {
                                      prop_data: this.state.source["ledgerId"],
                                      ldview: this.props.block.prop_data.ldview,
                                    },
                                    isNewTab: false,
                                  });
                                  // this.setState({ source: "" });
                                } else {
                                  // eventBus.dispatch(
                                  //   "page_change",
                                  //   "voucher_receipt_list"
                                  // );
                                  eventBus.dispatch("page_change", {
                                    from: "voucher_receipt_edit",
                                    to: "voucher_receipt_list",
                                    prop_data: {
                                      editId: this.state.receiptEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                    isCancel: true,
                                    isNewTab: false,
                                  });
                                  console.warn(
                                    "editId",
                                    this.state.receiptEditData.id
                                  );
                                  console.warn(
                                    "rowId",
                                    this.props.block.prop_data.rowId
                                  );
                                }
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
                  } else {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: " Please Select check credit & debit Amount",
                      // is_button_show: true,
                      is_timeout: true,
                      delay: 1500,
                    });
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
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <div className="new_trnx_design">
                <Form
                  onSubmit={handleSubmit}
                  noValidate
                  className="frm-accountentry"
                  style={{
                    overflow: "hidden",
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="" style={{ height: "auto" }}>
                    <div className="div-style">
                      <div className="inner-div-account">
                        <Row>
                          <Col md="1" className="my-auto">
                            <Form.Label className="pt-0 lbl">
                              Voucher Sr.No.
                              {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                            </Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Control
                              // className="mb-0 voucherstyle"
                              type="text"
                              name="receipt_sr_no"
                              id="receipt_sr_no"
                              onChange={handleChange}
                              value={values.receipt_sr_no}
                              isValid={
                                touched.receipt_sr_no && !errors.receipt_sr_no
                              }
                              isInvalid={!!errors.receipt_sr_no}
                              readOnly={true}
                              className="accountentry-text-box"
                              disabled
                            />
                          </Col>
                          {/* <h6>Voucher Sr. #.</h6>:{' '} */}
                          {/* <span>
                                      {invoice_data
                                        ? invoice_data.purchase_sr_no
                                        : ''}
                                    </span> */}
                          <Col md="1" className="my-auto">
                            <Form.Label className="pt-0 lbl">
                              Voucher No.
                              {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                            </Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Control
                              // className="mb-0 voucherstyle"
                              type="text"
                              readOnly={true}
                              placeholder="1234"
                              className="mb-0 accountentry-text-box"
                              value={values.receipt_code}
                              disabled
                            />
                          </Col>
                          <Col md="1" className="my-auto">
                            <Form.Label className="pt-0 lbl">
                              Transaction Date
                              <span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col md="2" className="tdmarg">
                            <Form.Group
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Tab") {
                                  e.preventDefault();
                                } else if (e.key === "Tab") {
                                  e.preventDefault();
                                  let datchco = e.target.value.trim();

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
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("transaction_dt")
                                        .focus();
                                    }, 1300);
                                  } else {
                                    let repl = datchco.replace(/_/g, "");

                                    if (repl.length === 6) {
                                      const currentYear = new Date().getFullYear();
                                      let position = 6;
                                      repl = repl.split("");
                                      repl.splice(position, 0, currentYear);
                                      let finle = repl.join("");
                                      //console.log("finfinfinfin", finle);
                                      e.target.value = finle;
                                      setFieldValue("transaction_dt", finle);
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
                                        "transaction_dt"
                                      );
                                      this.FocusTrRowFieldsID(
                                        `receipt-edit-perticulars-0`
                                      );
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid invoice date",
                                        // is_button_show: true,
                                        is_button_show: false,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("transaction_dt")
                                          .focus();
                                        // setFieldValue(
                                        //   "transaction_dt",
                                        //   ""
                                        // );
                                      }, 500);
                                    }
                                  }
                                } else if (e.keyCode === 13) {
                                  let datchco = e.target.value.trim();

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
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("transaction_dt")
                                        .focus();
                                    }, 1300);
                                  } else {
                                    let repl = datchco.replace(/_/g, "");

                                    if (repl.length === 6) {
                                      const currentYear = new Date().getFullYear();
                                      let position = 6;
                                      repl = repl.split("");
                                      repl.splice(position, 0, currentYear);
                                      let finle = repl.join("");
                                      //console.log("finfinfinfin", finle);
                                      e.target.value = finle;
                                      setFieldValue("transaction_dt", finle);
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
                                        "transaction_dt"
                                      );
                                      this.FocusTrRowFieldsID(
                                        `receipt-edit-perticulars-0`
                                      );
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid invoice date",
                                        // is_button_show: true,
                                        is_button_show: false,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("transaction_dt")
                                          .focus();
                                        // setFieldValue(
                                        //   "transaction_dt",
                                        //   ""
                                        // );
                                      }, 500);
                                    }
                                  }
                                  // } else {
                                  //   this.FocusTrRowFieldsID(
                                  //     `receipt-perticulars-0`
                                  //   );
                                  // }
                                }
                              }}
                            >
                              <MyTextDatePicker
                                innerRef={(input) => {
                                  this.invoiceDateRef.current = input;
                                }}
                                // className="tnx-pur-inv-date-style "
                                autoFocus
                                name="transaction_dt"
                                id="transaction_dt"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
                                autoComplete="true"
                                value={values.transaction_dt}
                                className={`${
                                  errorArrayBorder[0] == "Y"
                                    ? "border border-danger accountentry-date-style"
                                    : "accountentry-date-style"
                                }`}
                                onChange={handleChange}
                              />
                            </Form.Group>
                            {/* <Form.Control
                          ref={this.tranDateRef}
                            innerRef={(input) => {
                              this.invoiceDateRef.current = input;
                            }}
                            // className="tnx-pur-inv-date-style "
                            // className="mb-0 voucherstyle"
                            autoComplete="true"
                            name="transaction_dt"
                            id="transaction_dt"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            value={values.transaction_dt}
                            className={`${
                              errorArrayBorder[0] == "Y"
                                ? "border border-danger tnx-pur-inv-text-box"
                                : "tnx-pur-inv-text-box"
                            }`}
                            isValid={
                              touched.transaction_dt && !errors.transaction_dt
                            }
                            isInvalid={!!errors.transaction_dt}
                            // readOnly={true}
                            // className="tnx-pur-inv-text-box"
                            onChange={handleChange}
                            onBlur={(e) => {
                              //console.log("e ", e);
                              //console.log("e.target.value ", e.target.value);
                              if (
                                e.target.value != null &&
                                e.target.value != ""
                              ) {
                                this.setErrorBorder(0, "");
                                console.warn(
                                  "warn:: isValid",
                                  moment(e.target.value, "DD-MM-YYYY").isValid()
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
                                  // this.checkInvoiceDateIsBetweenFYFun(
                                  //   e.target.value,
                                  //   setFieldValue
                                  // );
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
                                this.setErrorBorder(0, "Y");
                                this.tranDateRef.current?.focus();
                               
                              }
                             
      
                            }}
                          /> */}
                            <Form.Control.Feedback type="invalid">
                              {errors.transaction_dt}
                            </Form.Control.Feedback>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    {/* right side menu start */}
                    {/* right side menu end */}
                    <div
                      className="tbl-body-style-new1"
                      // style={{ maxHeight: "67vh", height: "67vh" }}
                    >
                      <Table size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: "5%", textAlign: "center" }}>
                              Type
                            </th>
                            <th style={{ width: "75%", textAlign: "center" }}>
                              Particulars
                            </th>
                            <th style={{ width: "10%", textAlign: "center" }}>
                              Credit &nbsp;
                            </th>
                            <th
                              style={{ width: "10%", textAlign: "center" }}
                              className="pl-4"
                            >
                              Debit &nbsp;
                            </th>
                            {/* <th
                          style={{ width: "5%", textAlign: "center" }}
                          className="pl-4"
                        >
                          Action
                        </th> */}
                          </tr>
                        </thead>

                        <tbody style={{ borderTop: "2px solid transparent" }}>
                          {rows.length > 0 &&
                            rows.map((vi, ii) => {
                              return (
                                <tr className="entryrow">
                                  <td style={{ width: "5%" }}>
                                    {/* <Form.Control
                                      className="mb-0 voucherstyle"
                                      as="select"
                                      onChange={(e) => {
                                        this.handleChangeArrayElement(
                                          "type",
                                          e.target.value,
                                          ii
                                        );
                                      }}
                                      value={this.setElementValue("type", ii)}
                                      placeholder="select type"
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        )
                                          e.preventDefault();
                                      }}
                                    >
                                      <option value=""></option>
                                      <option value="dr">Dr</option>
                                      <option value="cr" selected>
                                        Cr
                                      </option>
                                    </Form.Control> */}
                                    <Form.Group>
                                      <Select
                                        styles={customStyles1}
                                        className="selectTo"
                                        options={selectOpt}
                                        onChange={(v) => {
                                          setFieldValue("type", v.label);
                                          //console.log("v============", v);
                                          this.handleChangeArrayElement(
                                            "type",
                                            v.label.trim().toLowerCase(),
                                            ii
                                          );
                                          setTimeout(() => {
                                            this.handleChangeArrayElement(
                                              "typeobj",
                                              v,
                                              ii
                                            );
                                          }, 100);
                                        }}
                                        name="type"
                                        id="type"
                                        value={this.setElementValue(
                                          "typeobj",
                                          ii
                                        )}
                                        // value={this.setElementValue("type", ii)}
                                        placeholder="Type"
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !e.target.value.trim()
                                          )
                                            e.preventDefault();
                                        }}
                                      />
                                    </Form.Group>
                                  </td>

                                  <td
                                    style={{
                                      width: "75%",
                                    }}
                                  >
                                    {/* <Select
                                  className="selectTo"
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder=""
                                  styles={customStyles1}
                                  isClearable
                                  options={this.getCurrentOpt(ii)}
                                  theme={(theme) => ({
                                    ...theme,
                                    height: "26px",
                                    borderRadius: "5px",
                                  })}
                                  onChange={(v, triggeredAction) => {
                                    console.log("In a Particular On Change.!");
                                    console.log({ triggeredAction });
                                    if (v == null) {
                                      // Clear happened
                                      console.log("clear index=>", ii);
                                      this.handleClearPayment(ii);
                                    } else {
                                      this.handleChangeArrayElement(
                                        "perticulars",
                                        v,
                                        ii
                                      );
                                    }
                                  }}
                                  value={this.setElementValue(
                                    "perticulars",
                                    ii
                                  )}
                                /> */}
                                    <Form.Control
                                      type="text"
                                      className="account-prod-style border-0"
                                      placeholder=" "
                                      // name={`"perticulars-${ii}"`}
                                      // id={`"perticulars-${ii}"`}
                                      name={`receipt-edit-perticulars-${ii}`}
                                      id={`receipt-edit-perticulars-${ii}`}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        this.filterData(e.target.value);
                                        this.handleChangeArrayElement(
                                          "perticulars",
                                          e,
                                          ii
                                        );
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (rows[ii]["type"] === "cr") {
                                          this.ledgerModalFun(false, ii);
                                        } else {
                                          this.ledgerModalFun(true, ii);
                                          this.setState(
                                            {
                                              ledgerModal: true,
                                            },
                                            () => {
                                              if (vi && vi.type == "dr") {
                                                if (vi.perticulars.id != "") {
                                                  const index = cashAcbankLst.findIndex(
                                                    (object) => {
                                                      return (
                                                        object.id ===
                                                        vi.perticulars.id
                                                      );
                                                    }
                                                  );
                                                  if (index >= 0) {
                                                    this.setState(
                                                      {
                                                        selectedLedgerIndex: index,
                                                      },
                                                      () => {
                                                        document
                                                          .getElementById(
                                                            "receipt-edit-ledger-cashac-" +
                                                              index
                                                          )
                                                          ?.focus();
                                                      }
                                                    );
                                                  }
                                                }
                                              }
                                            }
                                          );
                                        }
                                      }}
                                      value={
                                        rows[ii]["perticulars"]
                                          ? rows[ii]["perticulars"][
                                              "ledger_name"
                                            ]
                                          : ""
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.keyCode == 13 ||
                                          e.keyCode === 32
                                        ) {
                                          if (rows[ii]["type"] === "cr") {
                                            this.ledgerModalFun(false, ii);
                                            // document
                                            //   .getElementById(
                                            //     `"receipt-edit-debit-${ii}"`
                                            //   )
                                            //   .focus();
                                            this.focusNextElement(e);
                                          } else {
                                            this.ledgerModalFun(true, ii);
                                            this.setState(
                                              {
                                                ledgerModal: true,
                                              },
                                              () => {
                                                if (vi && vi.type == "dr") {
                                                  if (vi.perticulars.id != "") {
                                                    const index = cashAcbankLst.findIndex(
                                                      (object) => {
                                                        return (
                                                          object.id ===
                                                          vi.perticulars.id
                                                        );
                                                      }
                                                    );
                                                    if (index >= 0) {
                                                      this.setState(
                                                        {
                                                          selectedLedgerIndex: index,
                                                        },
                                                        () => {
                                                          document
                                                            .getElementById(
                                                              "receipt-edit-ledger-cashac-" +
                                                                index
                                                            )
                                                            ?.focus();
                                                        }
                                                      );
                                                    }
                                                  }
                                                }
                                              }
                                            );
                                          }
                                        } else if (
                                          e.shiftKey &&
                                          e.key === "Tab"
                                        ) {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        ) {
                                          if (e.target.value === "") {
                                            e.preventDefault();
                                            if (ledgerModal === true) {
                                              document
                                                .getElementById("addProduct")
                                                .focus();
                                            }
                                          } else if (
                                            ledgerModal === true &&
                                            e.target.value !== ""
                                          ) {
                                            this.setState({
                                              ledgerModal: false,
                                            });
                                          }
                                        } else if (e.keyCode == 40) {
                                          //! this condition for down button press 1409
                                          if (ledgerModal == true) {
                                            document
                                              .getElementById(
                                                "receipt-edit-ledger-0"
                                              )
                                              ?.focus();
                                            document
                                              .getElementById(
                                                "receipt-edit-ledger-cashac-0"
                                              )
                                              ?.focus();
                                          } else {
                                            this.FocusTrRowFields(
                                              "particulars",
                                              ii + 1
                                            );
                                          }
                                          // console.warn("Down");
                                        }
                                      }}
                                      readOnly={true}
                                    />
                                  </td>

                                  <td style={{ width: "10%" }}>
                                    <Form.Control
                                      className="table-text-box border-0"
                                      type="text"
                                      id={`receipt-edit-debit-${ii}`}
                                      onChange={(e) => {
                                        let v = e.target.value;
                                        this.handleChangeArrayElement(
                                          "debit",
                                          v,
                                          ii
                                        );
                                      }}
                                      // onBlur={(e) => {
                                      //   console.log("Inside onBlur");
                                      //   this.handleCreditdebitBalance(ii);

                                      // e.preventDefault();
                                      // let v = e.target.value;
                                      // // console.log(v.value);
                                      // this.setState(
                                      //   {
                                      //     selectedLedger: rows[ii][
                                      //       "perticulars"
                                      //     ]
                                      //       ? rows[ii]["perticulars"]
                                      //       : "",
                                      //   },
                                      //   () => {
                                      //     if (vi.type == "cr") {
                                      //       this.handleBillByBill(
                                      //         "debit",
                                      //         v,
                                      //         ii
                                      //       );
                                      //     }
                                      //   }
                                      // );
                                      // }}
                                      style={{ textAlign: "center" }}
                                      value={this.setElementValue("debit", ii)}
                                      readOnly={
                                        this.setElementValue("type", ii) == "cr"
                                          ? false
                                          : true
                                      }
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (e.key === "Tab") {
                                          let v = e.target.value;
                                          // console.log(v.value);
                                          this.setState(
                                            {
                                              selectedLedger: rows[ii][
                                                "perticulars"
                                              ]
                                                ? rows[ii]["perticulars"]
                                                : "",
                                            },
                                            () => {
                                              if (vi.type == "cr") {
                                                this.handleBillByBill(
                                                  "debit",
                                                  v,
                                                  ii
                                                );
                                              }
                                            }
                                          );
                                        } else if (e.keyCode == 13) {
                                          {
                                            let v = e.target.value;
                                            // console.log(v.value);
                                            this.setState(
                                              {
                                                selectedLedger: rows[ii][
                                                  "perticulars"
                                                ]
                                                  ? rows[ii]["perticulars"]
                                                  : "",
                                              },
                                              () => {
                                                if (vi.type == "cr") {
                                                  this.handleBillByBill(
                                                    "debit",
                                                    v,
                                                    ii
                                                  );
                                                  document
                                                    .getElementById(
                                                      "receipt-edit-perticulars-1"
                                                    )
                                                    .focus();
                                                }
                                              }
                                            );
                                          }
                                        }
                                        // e.preventDefault();
                                      }}
                                      disabled={
                                        this.setElementValue("type", ii) == "cr"
                                          ? false
                                          : true
                                      }
                                    />
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <Form.Control
                                      className="table-text-box border-0"
                                      type="text"
                                      id={`receipt-edit-credit-${ii}`}
                                      onChange={(e) => {
                                        let v = e.target.value;
                                        this.handleChangeArrayElement(
                                          "credit",
                                          v,
                                          ii
                                        );
                                      }}
                                      // onBlur={(e) => {
                                      //   this.handleCreditdebitBalance();
                                      // }}
                                      style={{ textAlign: "center" }}
                                      value={this.setElementValue("credit", ii)}
                                      readOnly={
                                        this.setElementValue("type", ii) == "dr"
                                          ? false
                                          : true
                                      }
                                      // onKeyDown={(e) => {
                                      //   if (e.shiftKey && e.key === "Tab") {
                                      //   } else if (
                                      //     e.key === "Tab" &&
                                      //     !e.target.value.trim()
                                      //   )
                                      //     e.preventDefault();
                                      // }}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (e.key === "Tab") {
                                          e.preventDefault();
                                          if (
                                            this.getTotalCreditAmt() ===
                                            this.getTotalDebitAmt()
                                          )
                                            document
                                              .getElementById(
                                                "receiptEdtNarration"
                                              )
                                              .focus();
                                          else
                                            this.handleCreditdebitBalance(ii);
                                        } else if (e.keyCode == 13) {
                                          if (
                                            this.getTotalCreditAmt() ===
                                            this.getTotalDebitAmt()
                                          ) {
                                            document
                                              .getElementById(
                                                "receiptEdtNarration"
                                              )
                                              .focus();
                                          } else
                                            this.handleCreditdebitBalance(ii);
                                        }
                                      }}
                                      disabled={
                                        this.setElementValue("type", ii) == "dr"
                                          ? false
                                          : true
                                      }
                                    />
                                  </td>
                                  {/* <td style={{ textAlign: "center" }}> */}
                                  {/* <img
                                  src={delete_icon}
                                  style={{
                                    width: "36px",

                                    height: "36px",
                                  }}
                                  // // title="Delete"
                                  // // onClick={(e) => {
                                  // //   this.deletepurchase(vi.id);
                                  // }}
                                /> */}
                                  {/* </td> */}
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                    <thead className="account_btm_part">
                      <tr>
                        <td
                          className="pr-2 qtotalqty"
                          style={{
                            width: "5%",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          Total:
                        </td>
                        <td
                          style={{
                            width: "75%",
                            textAlign: "end",
                          }}
                        >
                          {" "}
                        </td>
                        <td style={{ width: "10%" }} className="qtotalqty">
                          <Form.Control
                            style={{
                              textAlign: "center",
                              // width: "8%",
                              background: "transparent",
                              border: "none",
                            }}
                            type="text"
                            placeholder=""
                            value={this.getTotalDebitAmt()}
                            readonly
                            disabled
                          />
                        </td>
                        <td style={{ width: "10%" }} className="qtotalqty">
                          {" "}
                          <Form.Control
                            style={{
                              textAlign: "center",
                              //width: '8%',
                              background: "transparent",
                              border: "none",
                            }}
                            type="text"
                            placeholder=""
                            value={this.getTotalCreditAmt()}
                            readonly
                            disabled
                          />
                        </td>
                        {/* <td></td> */}
                      </tr>
                    </thead>
                    <div className="btm-data px-2">
                      {/* {JSON.stringify(myNewLedgrData)} */}
                      <Row>
                        <Col lg="8">
                          <Row className="accountentry-description-style">
                            <Col
                              lg={3}
                              style={{ borderRight: "1px solid #EAD8B1" }}
                            >
                              <p className="title-style mb-0">Ledger Info:</p>

                              {/* {JSON.stringify(ledgerData)} */}
                              {/* {JSON.stringify(selectedLedger)} */}

                              <div className="d-flex">
                                <span className="span-lable">GST No :</span>
                                <span className="span-value">
                                  {ledgerData.gst_number}
                                </span>
                              </div>

                              <div className="d-flex">
                                <span className="span-lable">Area :</span>
                                <span className="span-value">
                                  {ledgerData.area}
                                </span>
                              </div>

                              <div className="d-flex">
                                <span className="span-lable">Bank :</span>
                                <span className="span-value">
                                  {ledgerData.bank_name}
                                </span>
                              </div>
                            </Col>
                            <Col
                              lg={3}
                              style={{ borderRight: "1px solid #EAD8B1" }}
                            >
                              <div className="d-flex">
                                <span className="span-lable">
                                  Contact Person :
                                </span>
                                <span className="span-value">
                                  {ledgerData.contact_name}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span className="span-lable">Transport :</span>
                                <span className="span-value">
                                  {/* {product_hover_details.hsn} */}
                                </span>
                              </div>
                            </Col>
                            <Col
                              lg={3}
                              style={{ borderRight: "1px solid #EAD8B1" }}
                            >
                              <div className="d-flex">
                                <span className="span-lable">
                                  Credit Days :
                                </span>
                                <span className="span-value">
                                  {ledgerData.credit_days}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span className="span-lable">FSSAI :</span>
                                <span className="span-value">
                                  {/* {product_hover_details.tax_type} */}
                                  {ledgerData.fssai_number}
                                </span>
                              </div>
                            </Col>
                            <Col lg={3}>
                              <div className="d-flex">
                                <span className="span-lable">Lisence No :</span>
                                <span className="span-value">
                                  {ledgerData.license_number}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span className="span-lable">Route :</span>
                                <span className="span-value">
                                  {/* {product_hover_details.tax_type} */}
                                  {ledgerData.route}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg="4">
                          <Row className="accountentry-description-style">
                            <Col
                              lg="6"
                              style={{ borderRight: "1px solid #EAD8B1" }}
                            >
                              <p className="title-style mb-0">Bank Info:</p>
                              {/* {JSON.stringify(myNewLedgrData)} */}
                              <div className="d-flex">
                                <span className="span-lable">
                                  Payment Mode :
                                </span>
                                <span className="span-value">
                                  {myNewLedgrData &&
                                    myNewLedgrData.bank_payment_type &&
                                    myNewLedgrData.bank_payment_type.label}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span className="span-lable">
                                  Cheque/DD/Receipt :
                                </span>
                                <span className="span-value">
                                  {myNewLedgrData &&
                                    myNewLedgrData.paymentTranxNo}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span
                                  className="span-lable"
                                  style={{ color: "transparent" }}
                                >
                                  .
                                </span>
                                <span className="span-value"></span>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="d-flex">
                                <span className="span-lable">Bank Name :</span>
                                <span className="span-value">
                                  {bankData.bank_name}
                                </span>
                              </div>
                              <div className="d-flex">
                                <span className="span-lable">
                                  Payment Date :
                                </span>
                                <span className="span-value">
                                  {myNewLedgrData &&
                                    myNewLedgrData.payment_date}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="px-2">
                        <Col sm={10}>
                          <Row className="mt-2">
                            <Col sm={1}>
                              <Form.Label className="text-label">
                                Narration:
                              </Form.Label>
                            </Col>
                            <Col sm={11}>
                              <Form.Control
                                // as="textarea"
                                autoComplete="true"
                                placeholder="Enter Narration"
                                type="text"
                                className="accountentry-text-box"
                                // style={{ height: "72px", resize: "none" }}
                                id="receiptEdtNarration"
                                onChange={handleChange}
                                // rows={5}
                                // cols={25}
                                name="receiptEdtNarration"
                                value={values.receiptEdtNarration}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    document
                                      .getElementById(
                                        "receipt_create_submit_btn"
                                      )
                                      .focus();
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            {" "}
                            <div className="accountentry-info-table mt-2">
                              <Table>
                                <thead>
                                  <tr>
                                    <th>Source</th>
                                    <th>Inv No</th>
                                    <th>Inv Date</th>
                                    <th>Bill Amount</th>
                                    <th>Paid Amount</th>
                                    <th>Remaining Amt</th>
                                    <th>Paid Amount</th>
                                    <th>Remaining Amt</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedBillsData.length > 0 ? (
                                    selectedBillsData.map((v, i) => {
                                      if (
                                        v.source == "sales_invoice" ||
                                        v.source == "opening_balance" ||
                                        v.source == "credit_note"
                                      ) {
                                        return (
                                          <tr>
                                            <td>{v.source}</td>
                                            <td>{v.invoice_no}</td>

                                            <td>
                                              {moment(v.invoice_date).format(
                                                "DD-MM-YYYY"
                                              )}
                                            </td>

                                            <td>{v.amount}</td>
                                            <td>{v.paid_amt}</td>
                                            <td>{v.remaining_amt}</td>
                                            {/* <td>{v.rate}</td> */}
                                          </tr>
                                        );
                                      }
                                      // else {
                                      //   return (
                                      //     <tr>
                                      //       <td>{v.source}</td>
                                      //       <td>{v.credit_note_no}</td>

                                      //       <td>
                                      //         {moment(
                                      //           v.credit_note_date
                                      //         ).format("DD-MM-YYYY")}
                                      //       </td>
                                      //       <td></td>
                                      //       <td></td>
                                      //       <td></td>
                                      //       <td></td>
                                      //       <td>{v.amount}</td>
                                      //       <td>{v.credit_paid_amt}</td>
                                      //       <td>{v.credit_remaining_amt}</td>
                                      //       {/* <td>{v.rate}</td> */}
                                      //     </tr>
                                      //   );
                                      // }
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
                          </Row>
                        </Col>
                      </Row>
                      <Row className="py-1">
                        <Col className="text-end">
                          <Button
                            className="successbtn-style"
                            id="receipt_create_submit_btn"
                            type="submit"
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
                            className="cancel-btn ms-2"
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
                                    if ("ledgerId" in this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "voucher_receipt_edit",
                                        to: "ledgerdetails",
                                        // prop_data: this.state.source[
                                        //   "ledgerId"
                                        // ],
                                        prop_data: {
                                          prop_data: this.state.source[
                                            "ledgerId"
                                          ],
                                          ldview: this.props.block.prop_data
                                            .ldview,
                                        },
                                        isNewTab: false,
                                      });
                                      // this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch("page_change", {
                                        from: "voucher_receipt_edit",
                                        to: "voucher_receipt_list",
                                        isNewTab: false,
                                        isCancel: true,
                                        prop_data: {
                                          editId: this.state.receiptEditData.id,
                                          rowId: this.props.block.prop_data
                                            .rowId,
                                        },
                                      });
                                    }
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "voucher_receipt_list"
                                    // );
                                  },
                                  handleFailFn: () => {},
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
                                      if (
                                        "ledgerId" in this.state.source !=
                                        ""
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "voucher_receipt_edit",
                                          to: "ledgerdetails",
                                          // prop_data: this.state.source[
                                          //   "ledgerId"
                                          // ],
                                          prop_data: {
                                            prop_data: this.state.source[
                                              "ledgerId"
                                            ],
                                            ldview: this.props.block.prop_data
                                              .ldview,
                                          },

                                          isNewTab: false,
                                        });
                                        // this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "voucher_receipt_edit",
                                          to: "voucher_receipt_list",
                                          isNewTab: false,
                                          isCancel: true,
                                          prop_data: {
                                            editId: this.state.receiptEditData
                                              .id,
                                            rowId: this.props.block.prop_data
                                              .rowId,
                                          },
                                        });
                                      }
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "voucher_receipt_list"
                                      // );
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
                        </Col>
                      </Row>
                    </div>
                    {/* <div className="summery mx-2 p-2 invoice-btm-style"> */}
                    {/* <Row>
                    <Col md="10"> */}
                    {/* <div className="summerytag">
                        <fieldset>
                          <legend>Narration :</legend>
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              rows={7}
                              cols={25}
                              name="receiptEdtNarration"
                              onChange={handleChange}
                              style={{ width: "100%" }}
                              className="purchace-text"
                              value={values.receiptEdtNarration}
                              //placeholder="Narration"
                            />
                          </Form.Group>
                        </fieldset>
                      </div> */}
                    {/* </Col>
                    <Col md="2" className="text-center">
                      <ButtonGroup className="pt-4">
                        <Button variant="primary submit-btn mt-4" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn mx-2"
                          onClick={(e) => {
                            e.preventDefault();

                            eventBus.dispatch("page_change", {
                              from: "voucher_receipt",
                              to: "voucher_receipt_list",
                              isNewTab: false,
                            });
                          }}
                          className="mt-4"
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row> */}

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
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>

        {/* Bill adjusment modal start */}

        {billadjusmentmodalshow ? (
          <Row className="justify-content-end">
            <div className="billByBill-popup p-0">
              <Row
                style={{
                  background: "#D9F0FB",
                  borderBottom: "1px solid #d9d9d9",
                }}
                className="ms-0"
              >
                <Col lg={6}>
                  <h6 className="header-title">Bill by bill</h6>
                </Col>
                <Col lg={6} className="text-end pe-4 pt-1">
                  <img
                    src={close_crossmark_icon}
                    onClick={() =>
                      this.setState({ billadjusmentmodalshow: false })
                    }
                  />
                </Col>
              </Row>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                // initialValues={initVal}
                innerRef={this.ref}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.payableAmt == "") {
                    errorArray.push("t");
                  } else {
                    errorArray.push("");
                  }
                  if (values.selectedAmt == "") {
                    errorArray.push("t");
                  } else {
                    errorArray.push("");
                  }
                  if (values.remainingAmt == "") {
                    errorArray.push("t");
                  } else {
                    errorArray.push("");
                  }
                  this.handleBillByBillSubmit(values);

                  // this.setState(
                  //   { errorArrayBorderBillbyBill: errorArray },
                  //   () => {
                  //     if (allEqual(errorArray)) {
                  //       // console.log("billbybilldata--", { values });
                  //       this.setState(
                  //         {
                  //           paidAmount: values.paid_amt,
                  //           totalDebitAmt: 0,
                  //           selectedAmt: this.finalBillSelectedAmt(),
                  //           payableAmt: values.payableAmt,
                  //           remainingAmt: this.finalRemaningSelectedAmt(),
                  //         },
                  //         () => {
                  //           this.handleBillByBillSubmit(values);
                  //         }
                  //       );
                  //     }
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
                  <Form
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    className="frm-accountentry"
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {/* <div className="pmt-select-ledger"> */}
                    {/* <pre>{JSON.stringify(billLst)}</pre> */}
                    <div className="p-2" style={{ background: "#E6F2F8" }}>
                      <Row>
                        {/* {JSON.stringify(values)} */}
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Row>
                            <Col
                              lg={5}
                              md={5}
                              sm={5}
                              xs={5}
                              className="pe-0 ps-4"
                            >
                              <Form.Label>Payable Amt </Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Form.Group>
                                <Form.Control
                                  autoFocus
                                  type="text"
                                  placeholder="Payable Amt."
                                  name="payableAmt"
                                  id="payableAmt"
                                  autoComplete="nope"
                                  className="bill-text"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    setFieldValue("payableAmt", v);
                                    if (v != "") {
                                      this.setState({
                                        totalDebitAmt: v,
                                        payableAmt: v,
                                      });
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "isAdvanceCheck");
                                    }
                                  }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      remainingAmt: this.finalRemaningSelectedAmt(),
                                    });
                                  }}
                                  value={values.payableAmt}
                                  isValid={
                                    touched.payableAmt && !errors.payableAmt
                                  }
                                  isInvalid={!!errors.payableAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.payableAmt}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={5} className="ps-0">
                              <Form.Label>Selected Amt</Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Selected Amt."
                                  name="selectedAmt"
                                  id="selectedAmt"
                                  autoComplete="nope"
                                  disabled
                                  className="bill-text text-end"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    // {
                                    //   this.finalBillInvoiceAmt();
                                    // }
                                    setFieldValue("selectedAmt", v);
                                    /*  console.log(
                                      "selecteddddddddddddamt==??",
                                      e
                                    ); */
                                    if (v != "") {
                                      this.setState({ selectedAmt: v });
                                    }
                                  }}
                                  value={this.finalBillSelectedAmt()}
                                  isValid={
                                    touched.selectedAmt && !errors.selectedAmt
                                  }
                                  isInvalid={!!errors.selectedAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.selectedAmt}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={5} className="ps-0">
                              <Form.Label>Remaining Amt </Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Remaining Amt."
                                  name="remainingAmt"
                                  id="remainingAmt"
                                  autoComplete="nope"
                                  disabled
                                  className="bill-text text-end"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    if (v != "") {
                                      this.setState({ remainingAmt: v });
                                    }
                                  }}
                                  value={this.finalRemaningSelectedAmt()}
                                  isValid={
                                    touched.remainingAmt && !errors.remainingAmt
                                  }
                                  isInvalid={!!errors.remainingAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.remainingAmt}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                          <Form.Group
                            controlId="formBasicCheckbox"
                            className="checkboxstyle"
                          >
                            <Form.Check
                              type="checkbox"
                              id="isAdvanceCheck"
                              name="isAdvanceCheck"
                              label="Advance Amt."
                              checked={isAdvanceCheck === true ? true : false}
                              value={isAdvanceCheck}
                              onClick={(e) => {
                                this.handleAdvaceCheck(e.target.checked);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "commonChkId");
                                }
                              }}
                              // onChange={handleChange}
                              // style={{
                              //   verticalAlign: "middle !important",
                              // }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                    <Row className="mt-1">
                      <Col lg={5}></Col>
                      <Col md="7" className="my-auto">
                        {filterOpen == false ? (
                          <Row>
                            <Col lg={12} className="text-end pe-4">
                              <Form.Label>Filter</Form.Label>

                              <img
                                src={Filter_img}
                                className="filterimg"
                                onClick={() =>
                                  this.setState({ filterOpen: true })
                                }
                              />
                            </Col>
                          </Row>
                        ) : (
                          <Row>
                            <Col lg={4}>
                              <Row>
                                <Col lg={4} className="pe-0">
                                  {" "}
                                  <Form.Label>Form Dt.</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  {" "}
                                  <MyTextDatePicker
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    className="accountentry-date-style"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={4}>
                              <Row>
                                <Col lg={4}>
                                  {" "}
                                  <Form.Label>To Dt.</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  {" "}
                                  <MyTextDatePicker
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    className="accountentry-date-style"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={4}>
                              <Row>
                                <Col lg={6}>
                                  <Button className="applybtn">Apply</Button>
                                </Col>
                                <Col lg={6} className="text-center px-0">
                                  <Form.Label>Clear</Form.Label>

                                  <img
                                    src={close_grey_icon}
                                    className="filterimg ms-2"
                                    onClick={() =>
                                      this.setState({ filterOpen: false })
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                    <div className="bill-main">
                      <>
                        {openingListExist == true ? (
                          <>
                            <Row>
                              <Col md="5" className="ps-3">
                                <p className="tilte-name">Opening Balance :</p>
                              </Col>
                            </Row>
                            <div>
                              {billLst.length > 0 && (
                                <div className="billByBilltable">
                                  <Table className="mb-0">
                                    <thead>
                                      <tr>
                                        <th className="text-center">
                                          <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check
                                              className="checkboxstyle"
                                              // label="Invoice No."
                                              id="commonChkId"
                                              type="checkbox"
                                              checked={
                                                isAllChecked === true
                                                  ? true
                                                  : false
                                              }
                                              onChange={(e) => {
                                                this.handleBillsSelectionOpeningAll(
                                                  e.target.checked
                                                );
                                              }}
                                              style={{
                                                verticalAlign:
                                                  "middle !important",
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                            />
                                          </Form.Group>
                                          {/* <span className="pt-2 mt-2"> Invoice #.</span> */}
                                        </th>
                                        <th> Invoice No.</th>
                                        <th> Invoice Amt.</th>
                                        <th style={{ width: "2%" }}>Type</th>
                                        <th> Bill Date</th>
                                        <th className=" text-center">
                                          Balance
                                        </th>
                                        <th style={{ width: "2%" }}>Type</th>
                                        <th>Due Date</th>
                                        <th>Day</th>
                                        <th
                                          className="text-center"
                                          style={{ width: "13%" }}
                                        >
                                          Paid Amt
                                        </th>
                                        <th className="text-center">Balance</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {/* {JSON.stringify(billLst)} */}
                                      {billLst.map((vi, ii) => {
                                        if (vi.source == "opening_balance") {
                                          return (
                                            <tr>
                                              {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                              <td
                                                className="text-center"
                                                style={{
                                                  borderRight:
                                                    "1px solid #d9d9d9",
                                                }}
                                              >
                                                <Form.Group>
                                                  <Form.Check
                                                    id={`invoice_no-${ii}`}
                                                    name="invoice_no"
                                                    type="checkbox"
                                                    // label={vi.invoice_no}
                                                    value={vi.invoice_unique_id}
                                                    checked={selectedBills.includes(
                                                      vi.invoice_unique_id
                                                    )}
                                                    onChange={(e) => {
                                                      // console.log("click");
                                                      if (
                                                        parseInt(
                                                          vi.invoice_unique_id
                                                        ) != 0
                                                      ) {
                                                        this.handleBillselectionOpening(
                                                          vi.invoice_unique_id,
                                                          ii,
                                                          e.target.checked
                                                        );
                                                      } else {
                                                        this.handleAdvaceCheck(
                                                          e.target.checked
                                                        );
                                                      }
                                                    }}
                                                    style={{
                                                      verticalAlign:
                                                        "middle !important",
                                                    }}
                                                    className="checkboxstyle"
                                                    disabled={
                                                      parseInt(
                                                        values.payableAmt
                                                      ) ==
                                                        this.finalBillSelectedAmt() &&
                                                      parseInt(
                                                        values.payableAmt
                                                      ) > 0 &&
                                                      selectedBills.includes(
                                                        vi.invoice_unique_id
                                                      ) != true
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </Form.Group>
                                                {/* {vi.invoice_no} */}
                                              </td>
                                              <td>{vi.invoice_no}</td>
                                              <td></td>
                                              <td></td>
                                              <td
                                                style={{
                                                  borderRight:
                                                    "1px solid #d9d9d9",
                                                }}
                                              >
                                                {moment(vi.invoice_date).format(
                                                  "DD-MM-YYYY"
                                                )}
                                              </td>
                                              <td>
                                                {" "}
                                                {parseFloat(vi.amount).toFixed(
                                                  2
                                                )}{" "}
                                              </td>
                                              <td
                                                className="p-1 text-end"
                                                style={{
                                                  borderRight:
                                                    "1px solid #d9d9d9",
                                                }}
                                              >
                                                {/* {parseInt(vi.invoice_no) > 0
                                              ? "Cr"
                                              : "Dr"} */}
                                                {vi.balancing_type}
                                              </td>
                                              <td></td>
                                              <td></td>
                                              <td
                                                style={{
                                                  borderRight:
                                                    "1px solid #d9d9d9",
                                                }}
                                              >
                                                {/* {vi.paid_amt} */}
                                                <Form.Control
                                                  type="text"
                                                  id={`opening_paid_amt-${ii}`}
                                                  onChange={(e) => {
                                                    e.preventDefault();
                                                    /*   console.log(
                                                      "value",
                                                      e.target.value
                                                    ); */
                                                    this.handleBillPayableAmtChange(
                                                      e.target.value,
                                                      ii
                                                    );
                                                  }}
                                                  value={
                                                    vi.paid_amt
                                                      ? vi.paid_amt
                                                      : 0
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                  className="bill-text text-end border-0"
                                                  // readOnly={
                                                  //   !selectedBills.includes(
                                                  //     vi.invoice_id
                                                  //   )
                                                  // }
                                                  style={{
                                                    borderRadius: "0px",
                                                    // borderTop: "0px",
                                                    // borderBottom: "0px",
                                                  }}
                                                />
                                              </td>
                                              <td className="text-end p-2">
                                                {parseFloat(
                                                  vi.remaining_amt
                                                ).toFixed(2)
                                                  ? vi.remaining_amt
                                                  : 0}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                    </tbody>
                                  </Table>
                                </div>
                              )}

                              <Table className="mb-0">
                                <tfoot className="footertbl">
                                  <tr
                                    style={{
                                      background: "#D2F6E9",
                                      border: "transparent",
                                    }}
                                  >
                                    <td className="bb-t">
                                      {" "}
                                      <b>Total</b>
                                    </td>

                                    {/*<td></td> */}
                                    {/* <th className="text-end">
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.amount ? next.amount : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </th> */}
                                    <th
                                      className="text-end"
                                      style={{ width: "13%" }}
                                    >
                                      {this.finalBalanceOpeningAmt()}
                                    </th>
                                    <th
                                      className="text-end"
                                      style={{ width: "13%" }}
                                    >
                                      {this.finalBillOpeningAmt()}
                                      {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                                    </th>
                                    <th
                                      style={{ width: "10%" }}
                                      className="text-end"
                                    >
                                      {this.finalRemaningOpeningAmt()}
                                      {/* {" "}
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
                                    }, 0)} */}
                                    </th>
                                  </tr>
                                </tfoot>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>

                      {invoiceListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="m-2 mb-0">
                              <p className="tilte-name mb-0">
                                <b>Invoice List : </b>
                              </p>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>
                          <div>
                            {billLst.length > 0 && (
                              <div className="billByBilltable">
                                <Table className="mb-0">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        <Form.Group controlId="formBasicCheckbox">
                                          <Form.Check
                                            // label="Invoice No."
                                            id="commonChkId"
                                            type="checkbox"
                                            className="checkboxstyle"
                                            checked={
                                              isAllChecked === true
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              this.handleBillsSelectionOpeningAll(
                                                e.target.checked
                                              );
                                            }}
                                            style={{
                                              verticalAlign:
                                                "middle !important",
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.keyCode == 13) {
                                                this.focusNextElement(e);
                                              }
                                            }}
                                          />
                                        </Form.Group>
                                        {/* <span className="pt-2 mt-2"> Invoice #.</span> */}
                                      </th>
                                      <th> Invoice No.</th>
                                      <th> Invoice Amt.</th>
                                      <th style={{ width: "2%" }}>Type</th>
                                      <th> Bill Date</th>
                                      <th className=" text-center">Balance</th>
                                      <th style={{ width: "2%" }}>Type</th>
                                      <th>Due Date</th>
                                      <th>Day</th>
                                      <th
                                        className="text-center"
                                        style={{ width: "13%" }}
                                      >
                                        Paid Amt
                                      </th>
                                      <th className="text-center">Balance</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {/* {JSON.stringify(billLst)} */}
                                    {billLst.map((vi, ii) => {
                                      if (vi.source == "sales_invoice") {
                                        return (
                                          <tr>
                                            {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                            <td
                                              className="text-center"
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              <Form.Group>
                                                <Form.Check
                                                  id={`invoice_no-${ii}`}
                                                  name="invoice_no"
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_unique_id}
                                                  checked={selectedBills.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onChange={(e) => {
                                                    // console.log("click");
                                                    if (
                                                      parseInt(
                                                        vi.invoice_unique_id
                                                      ) != 0
                                                    ) {
                                                      this.handleBillselectionOpening(
                                                        vi.invoice_unique_id,
                                                        ii,
                                                        e.target.checked
                                                      );
                                                    } else {
                                                      this.handleAdvaceCheck(
                                                        e.target.checked
                                                      );
                                                    }
                                                  }}
                                                  style={{
                                                    verticalAlign:
                                                      "middle !important",
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                  className="checkboxstyle"
                                                  disabled={
                                                    parseInt(
                                                      values.payableAmt
                                                    ) ==
                                                      this.finalBillSelectedAmt() &&
                                                    parseInt(
                                                      values.payableAmt
                                                    ) > 0 &&
                                                    selectedBills.includes(
                                                      vi.invoice_unique_id
                                                    ) != true
                                                      ? true
                                                      : false
                                                  }
                                                />
                                              </Form.Group>
                                              {/* {vi.invoice_no} */}
                                            </td>
                                            <td>{vi.invoice_no}</td>
                                            <td></td>
                                            <td></td>
                                            <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {moment(vi.invoice_date).format(
                                                "DD-MM-YYYY"
                                              )}
                                            </td>
                                            <td>
                                              {" "}
                                              {parseFloat(vi.amount).toFixed(
                                                2
                                              )}{" "}
                                            </td>
                                            <td
                                              // className="p-1 text-end"
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {/* {parseInt(vi.invoice_no) > 0
                                              ? "Cr"
                                              : "Dr"} */}
                                              {vi.balancing_type}
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {/* {vi.paid_amt} */}
                                              <Form.Control
                                                type="text"
                                                id={`invoice_paid_amt-${ii}`}
                                                onChange={(e) => {
                                                  e.preventDefault();
                                                  /*  console.log(
                                                    "value",
                                                    e.target.value
                                                  ); */
                                                  this.handleBillPayableAmtChange(
                                                    e.target.value,
                                                    ii
                                                  );
                                                }}
                                                value={
                                                  vi.paid_amt ? vi.paid_amt : 0
                                                }
                                                className="bill-text text-end border-0"
                                                // readOnly={
                                                //   !selectedBills.includes(
                                                //     vi.invoice_id
                                                //   )
                                                // }
                                                style={{
                                                  borderRadius: "0px",
                                                  // borderTop: "0px",
                                                  // borderBottom: "0px",
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
                                              />
                                            </td>
                                            <td className="text-end p-2">
                                              {parseFloat(
                                                vi.remaining_amt
                                              ).toFixed(2)
                                                ? vi.remaining_amt
                                                : 0}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                  <tfoot
                                    className="footertbl"
                                    style={{
                                      borderTop: "2px solid transparent",
                                    }}
                                  >
                                    <tr
                                      style={{
                                        background: "#D2F6E9",
                                        border: "transparent",
                                      }}
                                    >
                                      <td className="bb-t" colSpan={5}>
                                        {" "}
                                        <b>Total</b>
                                      </td>
                                      <th colSpan={4}>
                                        {this.finalBalanceInvoiceAmt()}
                                      </th>

                                      {/*<td></td> */}
                                      {/* <th className="text-end">
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.amount ? next.amount : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </th> */}
                                      <th className="text-end">
                                        {this.finalInvoiceBillAmt()}
                                        {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                                      </th>
                                      <th className="text-end">
                                        {this.finalRemaningInvoiceAmt()}
                                        {/* {" "}
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
                                    }, 0)} */}
                                      </th>
                                    </tr>
                                  </tfoot>
                                </Table>
                              </div>
                            )}

                            {/* <Table className="mb-0"></Table> */}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {creditListExit == true ? (
                        <>
                          <Row>
                            <Col md="5" className="m-2 mb-0">
                              <h6 className="tilte-name mb-0">
                                <b>Credit Note : </b>
                              </h6>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>

                          {billLst.length > 0 && (
                            <div className="billByBilltable">
                              <Table className="mb-0">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                          type="checkbox"
                                          // label="Credit Note No."
                                          id="commonChkId"
                                          checked={
                                            isAllCheckeddebit === true
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            this.handleBillsSelectionOpeningAll(
                                              e.target.checked
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                              this.focusNextElement(e);
                                            }
                                          }}
                                          style={{ verticalAlign: "middle" }}
                                          className="checkboxstyle"
                                        />
                                      </Form.Group>
                                      {/* <span className="pt-2 mt-2">
                                      {" "}
                                      Credit Note #.
                                    </span> */}
                                    </th>
                                    <th> Invoice No.</th>
                                    <th> Invoice Amt.</th>
                                    <th style={{ width: "2%" }}>Type</th>
                                    <th> Bill Date</th>
                                    <th className=" text-center">Balance</th>
                                    <th style={{ width: "2%" }}>Type</th>
                                    <th>Due Date</th>
                                    <th>Day</th>
                                    <th
                                      className="text-center"
                                      style={{ width: "13%" }}
                                    >
                                      Paid Amt
                                    </th>
                                    <th className="text-center">Balance</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {billLst.map((vi, ii) => {
                                    if (vi.source == "credit_note") {
                                      return (
                                        <tr>
                                          {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                          <td
                                            className="text-center"
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            <Form.Group>
                                              <Form.Check
                                                type="checkbox"
                                                id={`creditList-${ii}`}
                                                // label={vi.credit_note_no}
                                                value={vi.invoice_unique_id}
                                                checked={selectedBills.includes(
                                                  vi.invoice_unique_id
                                                )}
                                                onChange={(e) => {
                                                  this.handleBillselectionOpening(
                                                    vi.invoice_unique_id,
                                                    ii,
                                                    e.target.checked
                                                  );
                                                }}
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                                className="checkboxstyle"
                                                disabled={
                                                  parseInt(values.payableAmt) ==
                                                    this.finalBillSelectedAmt() &&
                                                  selectedBills.includes(
                                                    vi.invoice_unique_id
                                                  ) != true
                                                    ? true
                                                    : false
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
                                              />
                                            </Form.Group>
                                            {/* {vi.invoice_no} */}
                                          </td>
                                          <td>{vi.invoice_no}</td>
                                          <td></td>
                                          <td></td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {moment(vi.invoice_date).format(
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td
                                            className="p-1 text-end"
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {parseFloat(vi.total_amt).toFixed(
                                              2
                                            )}{" "}
                                            Dr{" "}
                                          </td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {/* {vi.paid_amt} */}
                                            <Form.Control
                                              id={`creditPaidAmt-${ii}`}
                                              type="text"
                                              onChange={(e) => {
                                                e.preventDefault();
                                                /*   console.log(
                                                  "value",
                                                  e.target.value
                                                ); */
                                                this.handleBillPayableAmtChange(
                                                  e.target.value,
                                                  ii
                                                );
                                              }}
                                              value={
                                                vi.paid_amt ? vi.paid_amt : 0
                                              }
                                              className="bill-text text-end border-0"
                                              // readOnly={
                                              //   !selectedBills.includes(
                                              //     vi.invoice_no
                                              //   )
                                              // }
                                              style={{
                                                borderRadius: "0px",
                                                borderTop: "0px",
                                                borderBottom: "0px",
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                            />
                                          </td>
                                          <td className="text-end p-2">
                                            {parseFloat(
                                              vi.remaining_amt
                                            ).toFixed(2)
                                              ? vi.remaining_amt
                                              : 0}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  })}
                                </tbody>
                                <tfoot
                                  className="footertbl"
                                  style={{ borderTop: "2px solid transparent" }}
                                >
                                  <tr
                                    style={{
                                      background: "#D2F6E9",
                                      border: "transparent",
                                    }}
                                  >
                                    <td className="bb-t" colSpan={5}>
                                      {" "}
                                      <b>Total</b>
                                    </td>
                                    <th className="text-end">
                                      {this.finalCreditBillAmt()}
                                      {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                                    </th>
                                    <th className="text-end">
                                      {this.finalRemaningDebitAmt()}

                                      {/* {" "}
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
                                  }, 0)} */}
                                    </th>
                                  </tr>
                                </tfoot>
                              </Table>
                            </div>
                          )}

                          {/* <Table className="mb-0"></Table> */}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <Table className="mb-0">
                      <thead className="footertbl1">
                        <tr style={{ background: "#A0EFD2" }}>
                          <td className="bb-t" colSpan={2}>
                            {" "}
                            <b>Grand Total</b>
                          </td>
                          {/* <td></td>
                        <td></td> */}
                          <th className="text-end">
                            {this.finalBillAmt()}
                            {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                          </th>
                          <th style={{ width: "9%" }} className="text-end">
                            {this.finalRemainingBillAmt()}
                          </th>
                        </tr>
                      </thead>
                    </Table>
                    <Row className="py-1">
                      <Col className="text-end me-2">
                        <Button
                          className="create-btn "
                          type="submit"
                          id="billByBill_submit_edit_btn"
                          onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                              this.ref.current.handleSubmit();
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
            </div>
          </Row>
        ) : (
          <></>
        )}
        {/* Bill adjusment modal end */}

        {/* Bill adjusment Debit modal start */}
        <Modal
          show={billadjusmentDebitmodalshow}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ billadjusmentDebitmodalshow: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            closeButton
            closeVariant="warning"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Bill By Bill
            </Modal.Title>
            {/* <CloseButton
              variant="white"
              className="pull-right"
              //  onClick={this.handleClose}
              onClick={() => this.billadjusmentmodalshow(false)}
            /> */}
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="pmt-select-ledger">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  //console.log({ values });

                  this.handleBillByBillDebitSubmit(values);
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
                  <Form onSubmit={handleSubmit} noValidate>
                    {/* <div className="pmt-select-ledger"> */}

                    {/* <pre>{JSON.stringify(billLst)}</pre> */}
                    {billLstSc.length > 0 && (
                      <div className="table_wrapper1">
                        <Row md="8">
                          <Col md="7" className="mb-2">
                            <p className="mb-0 billhead">
                              <b>Debit Note</b>
                            </p>
                          </Col>
                          <Col md="7" className="outstanding_title"></Col>
                        </Row>
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
                                      isAllCheckeddebit === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAllDebit(
                                        e.target.checked
                                      );
                                    }}
                                    style={{ verticalAlign: "middle" }}
                                  />
                                </Form.Group>
                                <span
                                  className="pt-2 mt-2"
                                  style={{ verticalAlign: "middle" }}
                                >
                                  {" "}
                                  Debit Note #.
                                </span>
                              </th>
                              <th> Debit Note Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>

                          <tbody>
                            {billLstSc.map((vi, ii) => {
                              if (vi.source == "debit_note") {
                                return (
                                  <tr>
                                    {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                    <td className="pt-1 p2-1 pl-1 pb-0">
                                      <Form.Group>
                                        <Form.Check
                                          type="checkbox"
                                          label={vi.debit_note_no}
                                          value={vi.debit_note_no}
                                          checked={selectedBillsdebit.includes(
                                            vi.debit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionDebit(
                                              vi.debit_note_no,
                                              ii,
                                              e.target.checked
                                            );
                                          }}
                                          style={{ verticalAlign: "middle" }}
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
                                      {parseFloat(vi.Total_amt).toFixed(2)} Dr{" "}
                                    </td>
                                    <td>
                                      {/* {vi.paid_amt} */}
                                      <Form.Control
                                        type="text"
                                        onChange={(e) => {
                                          e.preventDefault();
                                          /*   console.log("value", e.target.value);
                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            ii
                                          ); */
                                        }}
                                        value={
                                          vi.debit_paid_amt
                                            ? vi.debit_paid_amt
                                            : 0
                                        }
                                        className="paidamttxt"
                                        // readOnly={
                                        //   !selectedBillsdebit.includes(
                                        //     vi.debit_note_no
                                        //   )
                                        // }
                                        //style={{ paddingTop: "0" }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(
                                        vi.debit_remaining_amt
                                      ).toFixed(2)
                                        ? vi.debit_remaining_amt
                                        : 0}
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                          <tfoot
                            className="bb-total"
                            style={{ borderTop: "2px solid transparent" }}
                          >
                            <tr style={{ background: "#cee7f1" }}>
                              <td className="bb-t" colSpan={3}>
                                {" "}
                                <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;
                              </td>
                              {/* <td></td>
                              <td></td> */}
                              <th>
                                {billLstSc.length > 0 &&
                                  billLstSc.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.debit_paid_amt
                                            ? next.debit_paid_amt
                                            : 0
                                        )
                                    ).toFixed(2);
                                  }, 0)}
                              </th>
                              <th>
                                {" "}
                                {billLstSc.length > 0 &&
                                  billLstSc.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.debit_remaining_amt
                                            ? next.debit_remaining_amt
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

                    <Button className="create-btn pull-right" type="submit">
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        {/* Bill adjusment Debit modal end */}

        {/*  On Account payment Date edit */}
        <Modal
          show={onaccountmodal}
          //size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ onaccountmodal: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              On Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-4 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.handleOnAccountSubmit(values);
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
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      {billLst.map((v, i) => {
                        return (
                          <Col md="4">
                            <Form.Group>
                              <Form.Label>Total Amount</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                name="amount"
                                id="amount"
                                onChange={handleChange}
                                value={v.amount ? v.amount : 0}
                                isValid={touched.amount && !errors.amount}
                                isInvalid={!!errors.amount}
                                readOnly={true}
                                style={{ paddingLeft: "6px" }}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.amount}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        );
                      })}

                      <Col md="4">
                        <Form.Group>
                          <Form.Label>Payable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="paid_amt"
                            id="paid_amt"
                            onChange={handleChange}
                            value={values.paid_amt}
                            isValid={touched.paid_amt && !errors.paid_amt}
                            isInvalid={!!errors.paid_amt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.paid_amt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="4" className="btn_align">
                        <div>
                          <Form.Label style={{ color: "#fff" }}>
                            blank
                            <br />
                          </Form.Label>
                        </div>

                        <Button className="createbtn" type="submit">
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
        {/* On Account payment Date edit */}

        {/*  On Account payment- Bank Acc - Payable amount */}
        <Modal
          show={bankaccmodal}
          size="xl"
          className="invoice-mdl-style"
          onHide={() => this.setState({ bankaccmodal: false })}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header
            closeButton
            // closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Bank Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-0 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                innerRef={this.NewMyEditRef}
                initialValues={this.getElementObject(this.state.index)}
                // validationSchema={Yup.object().shape({
                //   bank_payment_type: Yup.object().required("Select type"),
                //   bank_payment_no: Yup.string().required("No is required"),
                //   // paid_amt: Yup.string().required('Amt is required'),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (
                    values.bank_payment_type == "" ||
                    values.bank_payment_type == null
                  ) {
                    errorArray.push("Y");
                  } else {
                    errorArray.push("");
                  }
                  // if (values.bank_payment_no == "") {
                  //   errorArray.push("Y");
                  // } else {
                  //   errorArray.push("");
                  // }
                  this.setState({ errorArrayBorderBank: errorArray }, () => {
                    if (allEqual(errorArray)) {
                      //console.log("values", values);
                      this.handleBankAccountCashAccSubmit(values);
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
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Row
                      style={{ backgroundColor: "#E6f2f8", padding: "5px" }}
                      className="mb-2 mx-0"
                    >
                      <Col lg={3}>
                        <Row>
                          <Col lg={5}>
                            <Form.Label>Payment Mode</Form.Label>
                          </Col>
                          <Col lg={7}>
                            <Form.Group
                              className={`${
                                values.bank_payment_type == "" ||
                                (values.bank_payment_type == null &&
                                  errorArrayBorderBank[0] == "Y")
                                  ? "border border-danger "
                                  : ""
                              }`}
                              style={{ borderRadius: "4px" }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  /*    console.log(
                                    "values.bank_payment_type",
                                    values.bank_payment_type
                                  ); */
                                  if (
                                    values.bank_payment_type &&
                                    values.bank_payment_type.label == "Cheque"
                                  ) {
                                    this.bankNameRef.current.focus();
                                  } else if (
                                    (values.bank_payment_type &&
                                      values.bank_payment_type.label ==
                                        "NEFT") ||
                                    (values.bank_payment_type &&
                                      values.bank_payment_type.label ==
                                        "IMPS") ||
                                    (values.bank_payment_type &&
                                      values.bank_payment_type.label == "UPI")
                                  ) {
                                    this.handleKeyDown(e, "bank_payment_no");
                                  } else {
                                    e.preventDefault();
                                  }
                                }
                              }}
                            >
                              <Select
                                ref={this.bankListRef}
                                className="selectTo"
                                placeholder="Select Type"
                                styles={ledger_select}
                                isClearable
                                options={BankOpt}
                                // borderRadius="0px"
                                // colors="#729"
                                name="bank_payment_type"
                                onChange={(value) => {
                                  setFieldValue("bank_payment_type", value);
                                  this.setState();
                                }}
                                value={values.bank_payment_type}
                                // autoFocus={true}
                              />
                              <span className="text-danger">
                                {errors.bank_payment_type}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      {/* {JSON.stringify(values.bank_payment_type)} */}
                      {values.bank_payment_type &&
                      values.bank_payment_type.label == "Cheque" ? (
                        <>
                          <Col lg={3}>
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Bank Name</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group
                                  // className={`${values.bank_payment_type == "" &&
                                  //   errorArrayBorder[0] == "Y"
                                  //   ? "border border-danger "
                                  //   : ""
                                  //   }`}
                                  style={{ borderRadius: "4px" }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.bank_name) {
                                        this.handleKeyDown(
                                          e,
                                          "bank_payment_no"
                                        );
                                      } else {
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.bankNameRef}
                                    className="selectTo"
                                    placeholder="Select Type"
                                    styles={ledger_select}
                                    isClearable
                                    options={bankNameOpt}
                                    // borderRadius="0px"
                                    // colors="#729"
                                    name="bank_name"
                                    onChange={(value) => {
                                      setFieldValue("bank_name", value);
                                    }}
                                    value={values.bank_name}
                                  />
                                  <span className="text-danger">
                                    {errors.bank_name}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3">
                            <Row>
                              <Col lg={4}>
                                <Form.Label className="mb-1">
                                  Cheque/DD
                                </Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    name="bank_payment_no"
                                    placeholder="Bank Payment No"
                                    id="bank_payment_no"
                                    onChange={handleChange}
                                    value={values.bank_payment_no}
                                    // isValid={
                                    //   touched.bank_payment_no && !errors.bank_payment_no
                                    // }
                                    autoComplete="nope"
                                    // className={`${values.bank_payment_no == "" &&
                                    //   errorArrayBorder[2] == "Y"
                                    //   ? "border border-danger  text-box"
                                    //   : "text-box"
                                    //   }`}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.handleKeyDown(e, "payment_date");
                                      }
                                    }}
                                    isInvalid={!!errors.bank_payment_no}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.bank_payment_no}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </>
                      ) : (
                        <>
                          {(values.bank_payment_type &&
                            values.bank_payment_type.label == "NEFT") ||
                          (values.bank_payment_type &&
                            values.bank_payment_type.label == "IMPS") ||
                          (values.bank_payment_type &&
                            values.bank_payment_type.label == "UPI") ? (
                            <>
                              <Col md="3">
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label className="mb-1">
                                      Cheque/DD
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        name="bank_payment_no"
                                        placeholder="Bank Payment No"
                                        id="bank_payment_no"
                                        onChange={handleChange}
                                        value={values.bank_payment_no}
                                        // isValid={
                                        //   touched.bank_payment_no && !errors.bank_payment_no
                                        // }
                                        autoComplete="nope"
                                        // className={`${values.bank_payment_no == "" &&
                                        //   errorArrayBorder[3] == "Y"
                                        //   ? "border border-danger  text-box"
                                        //   : "text-box"
                                        //   }`}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(
                                              e,
                                              "payment_date"
                                            );
                                          }
                                        }}
                                        isInvalid={!!errors.bank_payment_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.bank_payment_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      <Col md="3">
                        <Row>
                          <Col lg={4}>
                            <Form.Label className="mb-1">
                              Payment Date
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <MyTextDatePicker
                                innerRef={(input) => {
                                  this.invoiceDateRef.current = input;
                                }}
                                // className="tnx-pur-inv-date-style "
                                name="payment_date"
                                id="payment_date"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
                                autoComplete="true"
                                // autoFocus
                                value={values.payment_date}
                                className="accountentry-date-style form-control"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode === 9) {
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      let datchco = e.target.value.trim();
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
                                            .getElementById("payment_date")
                                            .focus();
                                        }, 1000);
                                      }
                                    }
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    // debugger;
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      let datchco = e.target.value.trim();
                                      if (datchco === "__/__/____") {
                                        this.handleKeyDown(
                                          e,
                                          "bank_submit_btn"
                                        );
                                      } else if (
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
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("payment_date")
                                            .focus();
                                        }, 1300);
                                      } else if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        this.handleKeyDown(
                                          e,
                                          "bank_submit_btn"
                                        );
                                      }
                                    }
                                  } else if (e.keyCode === 13) {
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      let datchco = e.target.value.trim();
                                      if (datchco === "__/__/____") {
                                        this.handleKeyDown(
                                          e,
                                          "bank_submit_btn"
                                        );
                                      } else if (
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
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("payment_date")
                                            .focus();
                                        }, 1300);
                                      } else if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        this.handleKeyDown(
                                          e,
                                          "bank_submit_btn"
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid Date. ",
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        // setTimeout(() => {
                                        //   document
                                        //     .getElementById("payment_date")
                                        //     .focus();
                                        // }, 1300);
                                      }
                                    }
                                  }
                                }}
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              {errors.bank_payment_no}
                            </Form.Control.Feedback> */}
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mb-2 mx-0">
                      <Col className="text-end">
                        <Button
                          className="successbtn-style"
                          type="submit"
                          id="bank_submit_Edit_btn"
                          onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                              this.NewMyEditRef.current.handleSubmit();
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
            </div>
          </Modal.Body>
        </Modal>
        {/* On Account payment- Bank Acc - Payable amount */}

        {/* ledgr Modal */}

        {ledgerModal ? (
          <Row className="justify-content-end" ref={this.ledgerModalRef}>
            <div className="ledger-table-popup-voucher ps-0">
              <Row style={{ background: "#D9F0FB" }} className="ms-0">
                <Col lg={6}>
                  {/* <h6 className="table-header-ledger my-auto">Ledger</h6> */}
                  {/* @neha @added form check for filter */}

                  <Form.Check
                    // style={{ marginTop: "2px" }}
                    // label={"Creditor"}
                    label={ledgerType === "SC" ? "Creditor" : "Debitor"}
                    type="switch"
                    // className="ms-1"
                    // onClick={this.handleLstChange}
                    onChange={(e) => {
                      let val = e.target.checked;
                      //console.log("Is Checked:--->", val);
                      this.setState(
                        {
                          isChecked: val,
                          selectedAll: val === true ? ledgerType : "All",
                        },
                        () => {
                          this.handleLstChange();
                        }
                      );
                      // if (val === true) {
                      //   // if (selectedAll === "Creditor") {
                      // } else {
                      //   this.setState({
                      //     selectedAll: "All"
                      //   }, () => {
                      //     this.handleLstChange()
                      //   })
                      // }
                    }}
                    checked={isChecked}
                    style={{
                      display: objCR && objCR.type == "cr" ? "block" : "none",
                      marginTop: "2px",
                    }}
                  />
                </Col>
                <Col lg={6} className="text-end">
                  <img
                    src={close_crossmark_icon}
                    onClick={(e) => {
                      e.preventDefault();
                      this.ledgerModalFun(false);
                      this.transaction_ledger_listFun();
                    }}
                  />
                </Col>
              </Row>
              <div className="ledger-table">
                <Table
                  className=""
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handlePaymentLedgerTableRow(e);
                    }
                  }}
                >
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>
                        <Row>
                          <Col lg={6}>Ledger Name</Col>
                          <Col lg={6} className="text-end">
                            <Button
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
                                  let data = {
                                    rows: rows,
                                    rowIndex: rowIndex,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: from_source,
                                    sourceUnder: sourceUnder,
                                    opType: opType,
                                  };
                                  eventBus.dispatch("page_change", {
                                    from: from_source,
                                    to: "ledgercreate",
                                    prop_data: { prop_data: data },
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
                              onKeyDown={(e) => {
                                if (e.keyCode === 40) {
                                  document
                                    .getElementById("productTr_0")
                                    .focus();
                                }

                                // else if (e.keyCode === 13) {
                                //   if  (
                                //     isActionExist(
                                //       "ledger",
                                //       "create",
                                //       this.props.userPermissions
                                //     )
                                //   ) {
                                //     let data = {
                                //       rows: rows,
                                //       rowIndex : rowIndex,
                                //       // additionalCharges: additionalCharges,
                                //       invoice_data:
                                //         this.myRef != null && this.myRef.current
                                //           ? this.myRef.current.values
                                //           : "",
                                //       from_page: from_source,
                                //       sourceUnder: sourceUnder,
                                //       opType: opType,
                                //     };
                                //     eventBus.dispatch("page_change", {
                                //       from:  from_source,
                                //       to: "ledgercreate",
                                //       prop_data: { prop_data: data },
                                //       isNewTab: false,
                                //     });
                                //   } else {
                                //     MyNotifications.fire({
                                //       show: true,
                                //       icon: "error",

                                //       title: "Error",
                                //       msg: "Permission is denied!",
                                //       is_button_show: true,
                                //     });
                                //   }
                                // }
                              }}
                              id="addProduct"
                            >
                              + Add Ledger
                            </Button>
                          </Col>
                        </Row>
                      </th>
                      <th>Ledger Group</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className="prouctTableTr"
                    // onKeyDown={(e) => {
                    //   e.preventDefault();
                    //   if (e.keyCode != 9) {
                    //     this.handleTableRow(e);
                    //   }
                    // }}
                  >
                    {objCR && objCR.type == "cr" ? (
                      <>
                        {ledgerList.map((v, i) => {
                          return (
                            <tr
                              // value={JSON.stringify(v)}
                              // id={`productTr_` + i}
                              // prId={v.id}
                              id={`receipt-edit-ledger-${i}`}
                              tabIndex={i}
                              // className={`${JSON.stringify(v) ==
                              //   JSON.stringify(selectedLedger)
                              //   ? "selected-tr"
                              //   : ""
                              //   }`}
                              className={`${
                                i == selectedLedgerIndex
                                  ? "receipt-edit-ledger-selected-tr"
                                  : ""
                              }`}
                              // onDoubleClick={(e) => {
                              //   e.preventDefault();

                              //   this.handleChangeArrayElement(
                              //     "perticulars",
                              //     v,
                              //     rowIndex
                              //   );
                              //   this.handleBillByBill("debit", v, rowIndex);

                              //   this.setState({ ledgerModal: false });
                              //   console.log("v===>>::", v);
                              //   this.transaction_ledger_listFun();
                              // }}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                this.setState(
                                  {
                                    ledgerModal: false,
                                    selectedLedgerIndex: 0,
                                    selectedLedger: v,
                                  },
                                  () => {
                                    this.handleChangeArrayElement(
                                      "perticulars",
                                      v,
                                      rowIndex
                                    );
                                    this.handleBillByBill("debit", v, rowIndex);
                                    this.transaction_ledger_listFun();
                                  }
                                );
                              }}
                              onClick={(e) => {
                                e.preventDefault();

                                this.setState(
                                  {
                                    selectedLedger: v,
                                    selectedLedgerIndex: i,
                                  },
                                  () => {
                                    this.transaction_ledger_detailsFun(v.id);
                                  }
                                );
                              }}
                            >
                              <td className="ps-3">{v.code}</td>
                              <td className="ps-3">{v.ledger_name}</td>
                              <td className="ps-3">{v.city}</td>
                              <td></td>
                              <td className="ps-3">{v.contact_number}</td>
                              <td className="ps-3 text-end">
                                {v.current_balance.toFixed(2)}
                              </td>
                              <td className="ps-3">{v.balance_type}</td>
                              <td>
                                <img
                                  src={Frame}
                                  alt=""
                                  className="ledger-icon"
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
                                          this.myRef != null &&
                                          this.myRef.current
                                            ? this.myRef.current.values
                                            : "",
                                        from_page:
                                          "tranx_purchase_invoice_create",
                                      };

                                      let data = {
                                        source: source,
                                        id: v.id,
                                      };
                                      //console.log({ data });
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_invoice_create",
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
                                  className="ledger-icon"
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
                      </>
                    ) : (
                      <>
                        {/* {JSON.stringify(cashAcbankLst)} */}
                        {/* {JSON.stringify(paidAmount)} */}
                        {cashAcbankLst.map((v, i) => {
                          return (
                            <tr
                              // value={JSON.stringify(v)}
                              // id={`productTr_` + i}
                              // prId={v.id}
                              id={`receipt-edit-ledger-cashac-${i}`}
                              tabIndex={i}
                              // className={`${JSON.stringify(v) ==
                              //   JSON.stringify(selectedLedger)
                              //   ? "selected-tr"
                              //   : ""
                              //   }`}
                              className={`${
                                i == selectedLedgerIndex
                                  ? "receipt-edit-ledger-selected-tr"
                                  : ""
                              }`}
                              // onDoubleClick={(e) => {
                              //   e.preventDefault();
                              //   // console.log(
                              //   //   "selectedLedger",
                              //   //   { selectedLedger },
                              //   //   i,
                              //   //   rowIndex
                              //   // );
                              //   // console.log("rows", rows);
                              //   // if (selectedLedger != "") {
                              //   //   rows[rowIndex]["perticulars"] = v.label;
                              //   //   rows[rowIndex]["perticularsId"] =
                              //   //     selectedLedger.id;
                              //   //   rows[rowIndex]["balancingMethod"] =
                              //   //     selectedLedger.balancingMethod;
                              //   //   // selectedLedger.ledger_name;
                              //   //   // rows[rowIndex]["debit"] = paidAmount;

                              //   //   console.log("invoice_data", { invoice_data });
                              //   //   this.setState({
                              //   //     rows: rows,
                              //   //     ledgerList: ledgerList,

                              //   //     ledgerModal: false,
                              //   //     selectedLedger: selectedLedger,
                              //   //     // rowIndex: -1,
                              //   //   });
                              //   // }

                              //   this.handleChangeArrayElement(
                              //     "perticulars",
                              //     v,
                              //     rowIndex
                              //   );
                              //   this.setState({ ledgerModal: false }, () => {
                              //     if (v.type == "bank_account") {
                              //       this.setState({
                              //         bankaccmodal: true,
                              //         rows: rows,
                              //         // perticularsDelete: v.type,
                              //       });
                              //     }
                              //     // this.setState({ perticularsDelete: v.type });
                              //   });
                              //   console.log("v===>>::", v);
                              //   this.transaction_ledger_listFun();
                              // }}
                              onDoubleClick={(e) => {
                                e.preventDefault();

                                this.setState({ ledgerModal: false }, () => {
                                  this.handleChangeArrayElement(
                                    "perticulars",
                                    v,
                                    rowIndex
                                  );
                                  if (v.type == "bank_account") {
                                    this.OutletBankMasterList();
                                    this.setState(
                                      {
                                        bankaccmodal: true,
                                      },
                                      () => {
                                        setTimeout(() => {
                                          this.bankListRef.current.focus();
                                        }, 100);
                                      }
                                    );
                                  }
                                });
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                //console.log("vvv", { v });
                                rows[rowIndex]["perticulars"] = v.ledger_name;

                                // this.setState({ selectedLedger: v }, () => {
                                //   this.transaction_ledger_detailsFun(v.id);
                                // });
                              }}
                            >
                              <td className="ps-3">{v.code}</td>
                              <td className="ps-3">{v.ledger_name}</td>
                              <td className="ps-3">{v.city}</td>
                              <td></td>
                              <td className="ps-3">{v.contact_number}</td>
                              <td className="ps-3 text-end">
                                {v.current_balance}
                              </td>
                              <td className="ps-3">{v.balance_type}</td>

                              <td>
                                <img
                                  src={Frame}
                                  alt=""
                                  className="ledger-icon"
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
                                          this.myRef != null &&
                                          this.myRef.current
                                            ? this.myRef.current.values
                                            : "",
                                        from_page:
                                          "tranx_purchase_invoice_create",
                                      };

                                      let data = {
                                        source: source,
                                        id: v.id,
                                      };
                                      //console.log({ data });
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_invoice_create",
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
                                  className="ledger-icon"
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
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
