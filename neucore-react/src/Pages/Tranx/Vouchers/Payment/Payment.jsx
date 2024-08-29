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
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import delete_icon from "@/assets/images/delete_icon 3.png";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import close_grey_icon from "@/assets/images/close_grey_icon.png";
import Frame from "@/assets/images/Frame.png";
import Filter_img from "@/assets/images/Filter_img.png";
// import { getValue } from "../../helpers/constants";
import {
  getPOPendingOrderWithIds,
  getpaymentinvoicelastrecords,
  getsundrycreditorsindirectexpenses,
  getcreditorspendingbills,
  getcashAcbankaccount,
  create_payments,
  transaction_ledger_details,
  transaction_ledger_list,
  delete_ledger,
  getPaymentModes,
  get_ledger_bank_details,
  checkInvoiceDateIsBetweenFY
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  eventBus,
  ledger_select,
  MyNotifications,
  MyTextDatePicker,
  isActionExist,
  allEqual,
  getValue,
  convertToSlug,
  customStyles1,
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

const drcrtype = [
  { value: "dr", label: "dr" },
  { value: "cr", label: "cr" },
];
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
export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.typeRef = React.createRef();
    this.myRef = React.createRef();
    this.ref = React.createRef();
    // this.ref.current.resetForm();
    this.inputLedgerNameRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ledgerModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.state = {
      // invoice_id,
      pblAmtDisable: false,
      sourceUnder: "payment",
      filterOpen: false,
      ledgerType: true,
      show: false,
      invoice_data: "",
      amtledgershow: false,
      onaccountmodal: false,
      billadjusmentmodalshow: false,
      billadjusmentCreditmodalshow: false,
      bankledgershow: false,
      isDisabled: false,
      bankchequeshow: false,
      sundryindirect: [],
      cashAcbankLst: [],
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      billLst: [],
      billLstSc: [],
      debitBills: [],
      selectedBills: [],
      bankNameOpt: [],
      BankOpt: [],
      ledgerModal: false,
      ledgerData: "",
      bankData: "",
      ledgerList: [],
      selectedBillsdebit: [],
      selectedBillsCredit: [],
      selectedBillsOpening: [],
      objCR: "",
      accountLst: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      errorArrayBorder: "",
      errorArrayBorderBank: "",
      serialnopopupwindow: false,

      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAdvanceCheck: false,
      isAllChecked: false,
      isAllCheckeddebit: false,
      isAllCheckedOpening: false,
      isAllCheckedCredit: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      initVal: {
        payment_sr_no: 1,
        payment_code: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        po_sr_no: 1,
        sundryindirectid: "",
        id: "",
        type: "",
        balancing_method: "",
        amount: "",
        invoice_id: "",
        //po_date: moment().format('YYYY-MM-DD'),
      },

      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        pi_transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
        payment_dt: moment(new Date()).format("DD-MM-YYYY"),
      },
      rows: [],
      sundryCreditorLst: [],
      cashAccLedgerLst: [],
      lstSundryCreditorsPayment: [],
      index: 0,
      crshow: false,
      onaccountcashaccmodal: false,
      bankaccmodal: false,
      invoiceBillLst: "",
      debitBillLst: "",
      remainingSelectedAmt: 0,
      selAmtDisa: 0,
      payableAmt: 0,
      selectedAmt: 0,
      remainingAmt: 0,
      advanceAmt: 0,
      finalInvoiceAmt: 0,
      finalDebitAmt: 0,
      selectedBillsData: [],
      // selectedAll: "",
      debitListExist: false,
      invoiceListExist: false,
      openingListExist: false,
      lstBills: [],
      opType: "create",
      isChecked: true,

      selectedLedgerIndex: 0,
    };
  }
  // const { i, productLst, setFieldValue, isDisabled } = props;
  handleClose = () => {
    let { rows } = this.state;
    this.setState({ show: false });
  };
  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck : "";
  };

  initRows = (len = null) => {
    let lst = [];
    let condition = 0;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < condition; index++) {
      let innerrow = {
        type: "",
        typeobj: "",
        perticulars: "",
        paid_amt: "",
        bank_payment_type: "",
        bank_payment_no: "",
        bank_name: "",
        // check_number:"",
        payment_date: "",
        debit: "",
        credit: "",
        narration: "",
      };
      if (index == 0) {
        innerrow["typeobj"] = getSelectValue(selectOpt, "dr");
        innerrow["type"] = "dr";
      }
      lst.push(innerrow);

    }

    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows }, () => {

        this.handleChangeArrayElement("type", "dr", 0);
      });
    } else {
      this.setState({ rows: lst }, () => {

        this.handleChangeArrayElement("type", "dr", 0);
      });
    }
    // this.setState({ rows: rows });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };
  // getElementObject = (index) => {
  //   let elementCheck = this.state.rows.find((v, i) => {
  //     return i == index;
  //   });
  //   return elementCheck ? elementCheck : "";
  // };

  handleClearPayment = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      perticulars: "",
      paid_amt: "",
      debit: "",
      credit: "",
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => { });
  };

  lstgetsundrycreditors_indirectexpenses = () => {
    getsundrycreditorsindirectexpenses()
      .then((response) => {
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
    getcashAcbankaccount()
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
                current_balance: v.current_balance,
                billids: [],
                ledger_type: v.ledger_type,
              };
              resLst.push(innerrow);
            });
          }
          this.setState({
            cashAcbankLst: resLst,
            orgCashList: resLst,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setpaymentinvoiceSerialNo = () => {
    getpaymentinvoicelastrecords()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          //initVal['payment_sr_no'] = res.count;
          initVal["payment_sr_no"] = res.payment_sr_no;
          initVal["payment_code"] = res.payment_code;

          // console.log({ initVal });
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBillselectionCredit = (id, index, status) => {
    let { billLstSc, selectedBillsCredit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsCredit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillsCredit.length > 0) {
        // console.log("selectedBillsCredit", selectedBillsCredit);
        if (!selectedBillsCredit.includes(id)) {
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
      selectedBillsCredit: f_selectedBills,
      billLstSc: f_billLst,
    });
  };

  handleBillsSelectionAllCredit = (status) => {
    let { billLstSc } = this.state;
    let fBills = billLstSc;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLstSc.map((v) => v.credit_note_no);
      // console.log("All BillLst Selection", billLstSc);
      fBills = billLstSc.map((v) => {
        if (v.source === "credit_note") {
          v["credit_paid_amt"] = parseFloat(v.Total_amt);
          v["credit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
          return v;
        }

        return v;
      });

      // console.log("fBills", fBills);
    } else {
      fBills = billLstSc.map((v) => {
        v["credit_paid_amt"] = 0;
        v["credit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;

        // return v;
      });
    }
    this.setState({
      isAllCheckedCredit: status,
      selectedBillsCredit: lstSelected,
      billLstSc: fBills,
    });
  };

  FetchPendingBills = (id, type, balancing_method) => {
    // debugger;
    // console.log("balancing_method", balancing_method);
    // console.log("type", type);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    // let { startDate, endDate } = this.state;
    // const startDatecon = moment(startDate).format("YYYY-MM-DD");
    // const endDatecon = moment(endDate).format("YYYY-MM-DD");
    // reqData.append("start_date", startDatecon);
    // reqData.append("end_date", endDatecon);
    // console.log("start Date,End Date:::::::::", startDatecon, endDatecon);
    getcreditorspendingbills(reqData)
      .then((response) => {
        // debugger;
        let res = response.data;
        // console.log("res::::::::::", res);
        if (res.responseStatus == 200) {
          let resData = res.list;
          // if (resData.length > 0) {
          if (balancing_method === "bill-by-bill" && type === "SC") {
            let invoiceLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "pur_invoice"
            );
            let debitLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "debit_note"
            );

            let openingLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "opening_balance"
            );

            this.setState({
              billLst: resData,
              debitListExist: debitLst.length > 0 ? true : false,
              invoiceListExist: invoiceLst.length > 0 ? true : false,
              openingListExist: openingLst.length > 0 ? true : false,
              billadjusmentmodalshow: true,
              selectedBills: [],
              selectedBillsdebit: [],
              selectedBillsOpening: [],
              isAdvanceCheck: false,
            });
          } else if (balancing_method === "bill-by-bill" && type === "SD") {
            // this.setState({
            //   billLstSc: resData,
            //   billadjusmentCreditmodalshow: true,
            //   selectedBills: [],
            //   selectedBillsdebit: [],
            //   selectedBillsOpening: [],
            //   isAdvanceCheck: false,
            // });
          } else if (balancing_method === "on-account") {
            // this.setState({
            //   billLst: resData,
            //   onaccountmodal: false,
            //   selectedBills: [],
            //   selectedBillsdebit: [],
            //   selectedBillsOpening: [],
            //   isAdvanceCheck: false,
            // });
          }
          // } else {
          //   MyNotifications.fire({
          //     show: true,
          //     icon: "warning",
          //     title: "warning",
          //     msg: "No Bills Available",
          //     // is_button_show: true,
          //     is_timeout: true,
          //     delay: 1500,
          //   });
          //   setTimeout(() => {
          //     document.getElementById("perticulars").focus();
          //   }, 2000);
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ billLst: [] });
      });
  };

  FetchPendingBillsFilterWise = () => {
    let { startDate, endDate, selectedLedger } = this.state;
    console.log("state start & end date::::::", { startDate, endDate });
    let reqData = new FormData();
    reqData.append("ledger_id", selectedLedger.id);
    reqData.append("type", selectedLedger.type);
    reqData.append("balancing_method", selectedLedger.balancingMethod);
    const startDatecon = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    const endDatecon = moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    console.log("start Date ++++", startDatecon);
    console.log("end Date ++++", endDatecon);

    reqData.append("start_date", startDatecon);
    reqData.append("end_date", endDatecon);
    getcreditorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let resData = res.list;
          if (selectedLedger.balancingMethod === "bill-by-bill" && selectedLedger.type === "SC") {
            console.log("resData=====", resData);

            let invoiceLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "pur_invoice"
            );
            let debitLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "debit_note"
            );

            let openingLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "opening_balance"
            );



            this.setState({
              billLst: resData,
              debitListExist: debitLst.length > 0 ? true : false,
              invoiceListExist: invoiceLst.length > 0 ? true : false,
              openingListExist: openingLst.length > 0 ? true : false,
              billadjusmentmodalshow: true,
              selectedBills: [],
              selectedBillsdebit: [],
              selectedBillsOpening: [],
              isAdvanceCheck: false,
            });
          } else if (selectedLedger.balancingMethod === "bill-by-bill" && selectedLedger.balance_type === "SD") {
            // this.setState({
            //   billLstSc: resData,
            //   billadjusmentCreditmodalshow: true,
            //   selectedBills: [],
            //   selectedBillsdebit: [],
            //   selectedBillsOpening: [],
            //   isAdvanceCheck: false,
            // });
          } else if (selectedLedger.balancingMethod === "on-account") {
            // this.setState({
            //   billLst: resData,
            //   onaccountmodal: false,
            //   selectedBills: [],
            //   selectedBillsdebit: [],
            //   selectedBillsOpening: [],
            //   isAdvanceCheck: false,
            // });
          }
          // } else {
          //   MyNotifications.fire({
          //     show: true,
          //     icon: "warning",
          //     title: "warning",
          //     msg: "No Bills Available",
          //     // is_button_show: true,
          //     is_timeout: true,
          //     delay: 1500,
          //   });
          //   setTimeout(() => {
          //     document.getElementById("perticulars").focus();
          //   }, 2000);
          // }
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
        // console.log("Pending Order Response", response);
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
        // console.log(" on account v", v);
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

  handleBillByBillCreditSubmit = (v) => {
    let { index, rows, billLstSc } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        // console.log("vi", vi);
        // console.log("v", v);

        v["perticulars"]["billids"] = billLstSc;

        v["credit_paid_amt"] = billLstSc.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0)
          );
        }, 0);

        let total = v["credit_paid_amt"] != null ? v["credit_paid_amt"] : 0;

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
        this.setState({ billadjusmentCreditmodalshow: false, index: -1 });
      }
    );
  };
  handleBillByBillSubmit = (v) => {
    let {
      index,
      rows,
      billLst,
      payableAmt,
      selectedAmt,
      remainingAmt,
      isAdvanceCheck,
    } = this.state;
    let bills;
    let paidAmount = 0;
    let frow = rows.map((vi, ii) => {
      let f_billLst = billLst.filter((vf) => vf.paid_amt > 0);
      bills = f_billLst;
      // console.log("bills============>>>>>>>>>>>>>>>>>>>", bills);

      if (ii == index) {
        vi["perticulars"]["billids"] = f_billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["payableAmt"] = parseFloat(payableAmt != null ? payableAmt : 0);
        vi["selectedAmt"] = selectedAmt;
        vi["remainingAmt"] = remainingAmt;
        vi["isAdvanceCheck"] = isAdvanceCheck;
        // vi["paid_amt"] = billLst.reduce(function (prev, next) {
        //   return (
        //     parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
        //   );
        // }, 0);
        billLst.map((next) => {
          if (next.balancing_type.trim().toLowerCase() == "cr") {
            if ("paid_amt" in next) {
              paidAmount =
                paidAmount +
                (parseInt(next.invoice_id) != 0
                  ? parseFloat(next.paid_amt ? next.paid_amt : 0)
                  : 0);
            }
          }
        });
        // console.log("paidAmount in select::::::::", paidAmount);
        let debitPaidAmount = 0;
        billLst.map((next) => {
          if (
            next.balancing_type.trim().toLowerCase() == "dr" &&
            next.invoice_no != "New Ref"
          ) {
            if ("paid_amt" in next) {
              debitPaidAmount =
                debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
            }
          }
        });

        let totalAdvanceAmt = this.state.advanceAmt;
        if (totalAdvanceAmt != 0) {
          vi["paid_amt"] = paidAmount - debitPaidAmount + totalAdvanceAmt;
        } else {
          vi["paid_amt"] = paidAmount - debitPaidAmount;
          // console.log("in else amt::::::::", amt);
        }

        let total = vi["paid_amt"];
        // console.log("total in submit", total);

        vi["debit"] = total;
        vi["paid_amt"] = total;
      }
      return vi;
    });

    this.setState(
      {
        rows: frow,
        selectedBillsData: bills,
        billLst: [],
        payableAmt: 0,
        selectedAmt: 0,
        remainingAmt: 0,
        isAdvanceCheck: false,
      },
      () => {
        let innerrow = {
          type: "cr",
          typeobj: getSelectValue(selectOpt, "cr"),
          perticulars: "",
          paid_amt: "",
          bank_payment_type: "",
          bank_payment_no: "",
          bank_name: "",
          // check_number:"",
          payment_date: "",
          debit: "",
          credit: "",
          narration: "",
        };
        this.setState(
          {
            billadjusmentmodalshow: false,
            index: -1,
            rows: [...this.state.rows, innerrow],
          },
          () => {
            this.FocusTrRowFieldsID(`payment-perticulars-${index + 1}`);
          }
        );

        // this.initRows(this.state.rows.length);
      }
    );
  };

  // finalBillAmt = () => {
  //   const { billLst } = this.state;
  //   console.log("bills in final function", { billLst });
  //   let advanceAmt = this.state.advanceAmt;
  //   let paidAmount = 0;
  //   console.log("advance amt ", advanceAmt);
  //   if (advanceAmt != 0) {
  //     billLst.map((next) => {
  //       if (next.balancing_type.trim().toLowerCase() == "cr") {
  //         if ("paid_amt" in next) {
  //           paidAmount =
  //             paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
  //         }
  //       }
  //     });
  //     paidAmount = paidAmount + advanceAmt;
  //   } else {
  //     billLst.map((next) => {
  //       if (next.balancing_type.trim().toLowerCase() == "cr") {
  //         if ("paid_amt" in next) {
  //           paidAmount =
  //             paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
  //         }
  //       }
  //     });
  //   }

  //   let debitPaidAmount = 0;
  //   billLst.map((next) => {
  //     if (next.balancing_type.trim().toLowerCase() == "dr") {
  //       if ("paid_amt" in next) {
  //         debitPaidAmount =
  //           debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
  //       }
  //     }
  //   });

  //   // console.log({ paidAmount, debitPaidAmount });

  //   if (paidAmount >= debitPaidAmount) {
  //     let amt = paidAmount - debitPaidAmount;
  //     return amt;
  //     // billLst.map((v, i) => {
  //     //   v['paid_amt'] = paidAmount - debitPaidAmount;
  //     //   return v;
  //     // });
  //     // this.handleChangeArrayElement(amt);
  //   } else {
  //     return "Go To Receipt";
  //   }
  // };

  finalBillAmt = () => {
    const { billLst } = this.state;
    // let advanceAmt = this.state.advanceAmt;
    let opnAmount = this.finalBillOpeningAmt();
    let invAmount = this.finalBillInvoiceAmt();
    let paidAmount = opnAmount + invAmount;

    let debitPaidAmount = this.finalBillDebitAmt();

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

  finalRemainingBillAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });

    let remainingAmt = this.finalRemaningOpeningAmt();
    let invoiceRemainingAmt = this.finalRemaningInvoiceAmt();
    // billLst.map((next) => {
    //   if ("remaining_amt" in next) {
    //     remainingAmt =
    //       remainingAmt +
    //       parseFloat(next.remaining_amt ? next.remaining_amt : 0);
    //   }
    // });

    let debitRemainingAmount = this.finalRemaningDebitAmt();
    // billLst.map((next) => {
    //   if (next.source == "debit_note") {
    //     if ("remaining_amt" in next) {
    //       debitRemainingAmount =
    //         debitRemainingAmount +
    //         parseFloat(next.remaining_amt ? next.remaining_amt : 0);
    //     }
    //   }
    // });

    let amt = remainingAmt + invoiceRemainingAmt - debitRemainingAmount;
    return amt;
    // billLst.map((v, i) => {
    //   v['paid_amt'] = paidAmount - debitPaidAmount;
    //   return v;
    // });
    // this.handleChangeArrayElement(amt);
  };

  finalBillInvoiceAmt = () => {
    // debugger;
    let { billLst } = this.state;
    // console.log({ billLst });
    let advanceAmt = this.state.advanceAmt;
    let paidAmount = 0;
    billLst.map((next) => {
      if (next.source == "pur_invoice") {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });
    // console.log("paid in bill invoice", paidAmount);
    // if (advanceAmt != 0) {
    //   paidAmount = paidAmount + advanceAmt;
    //   console.log("paid in bill invoice in adv", paidAmount);
    // }

    return isNaN(paidAmount) ? 0 : paidAmount;
  };
  finalBalanceInvoiceAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "pur_invoice") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  finalRemaningSelectedAmt = () => {
    let paidAmt = this.state.totalDebitAmt;
    let selectedAmt = this.finalBillSelectedAmt();
    // console.log("paidAmt", paidAmt);
    // console.log("selectedAmt", selectedAmt);

    if (paidAmt != 0) {
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
  };

  finalBillDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });

    let debitPaidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        if (next.source == "debit_note") {
          debitPaidAmount =
            debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    return isNaN(debitPaidAmount) ? 0 : debitPaidAmount;
  };
  finalBillOpeningAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
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

  finalBalanceOpeningAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
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
  finalRemaningOpeningAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
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
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "pur_invoice") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };
  finalRemaningDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "debit_note") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };

  finalBalanceDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "debit_note") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  finalBillSelectedAmt = () => {
    const { billLst } = this.state;
    let amt = 0;
    let paidAmount = 0;

    // console.log({ billLst });
    billLst.map((next) => {
      if (next.balancing_type.trim().toLowerCase() == "cr") {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount +
            (parseInt(next.invoice_id) != 0
              ? parseFloat(next.paid_amt ? next.paid_amt : 0)
              : 0);
        }
      }
    });
    // console.log("paidAmount in select::::::::", paidAmount);
    let debitPaidAmount = 0;
    billLst.map((next) => {
      if (
        next.balancing_type.trim().toLowerCase() == "dr" &&
        next.invoice_no != "New Ref"
      ) {
        if ("paid_amt" in next) {
          debitPaidAmount =
            debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    let totalAdvanceAmt = this.state.advanceAmt;
    if (totalAdvanceAmt != 0) {
      amt = paidAmount - debitPaidAmount + totalAdvanceAmt;
    } else {
      amt = paidAmount - debitPaidAmount;
      // console.log("in else amt::::::::", amt);
    }
    return amt;
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
    } = this.state;
    let remTotalDebitAmt = totalDebitAmt;

    let f_selectedBills = selectedBills;

    let f_billLst = billLst;
    if (status == true) {
      this.setState({ pblAmtDisable: true })
      if (selectedBills.length > 0) {
        if (!selectedBills.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
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
                msg: "selected bill amt is greater than payable amt, do you want to continue",
                is_button_show: false,
                is_timeout: false,
                delay: 0,
                handleSuccessFn: () => {
                  let payAmt = parseFloat(this.ref.current.values.payableAmt);
                  let remAmt = parseFloat(v["remaining_amt"]);
                  remTotalDebitAmt = payAmt + remAmt;
                  this.setState({ totalDebitAmt: remTotalDebitAmt });
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
                handleFailFn: () => { },
              },
              () => {
                // console.warn("return_data");
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

    console.log("selectedBills====", selectedBills);
    console.log("billLst====", billLst);
    console.log("f_billLst====", f_billLst);

    this.setState({
      isAllChecked: f_billLst.length == f_selectedBills.length ? true : false,
      isAllCheckeddebit: f_billLst.length == f_selectedBills.length ? true : false,
      isAllCheckedOpening: f_billLst.length == f_selectedBills.length ? true : false,
      selectedBills: f_selectedBills,
      billLst: f_billLst,
    }, () => {
      if (this.state.selectedBills.length > 0) {
        this.setState({ pblAmtDisable: true })
      } else {
        this.setState({ pblAmtDisable: false })
        setTimeout(() => {
          document.getElementById("payableAmt").focus();
        }, 200)
      }
    });
  };

  handleBillselection = (id, index, status) => {
    // debugger;
    // console.log("id,status,index", id, status, index);
    let { billLst, selectedBills, selectedBillsdebit, totalDebitAmt } =
      this.state;
    let remTotalDebitAmt = totalDebitAmt;

    let f_selectedBills = selectedBills;

    let f_billLst = billLst;
    if (status == true) {
      if (selectedBills.length > 0) {
        if (!selectedBills.includes(id)) {
          f_selectedBills = [...f_selectedBills, parseInt(id)];
        }
      } else {
        f_selectedBills = [...f_selectedBills, parseInt(id)];
      }
    } else {
      f_selectedBills = f_selectedBills.filter(
        (v, i) => parseInt(v) != parseInt(id)
      );
    }

    if (selectedBillsdebit.length > 0) {
      // console.log("selectedBillsdebit", selectedBillsdebit);
      // console.log("f_billLst", f_billLst);
      let debitTotalAmt = 0;
      let creditTotalAmt = 0;
      f_billLst.map((v, i) => {
        if (v.source == "debit_note") {
          if (selectedBillsdebit.includes(parseInt(v.invoice_id))) {
            debitTotalAmt += parseFloat(v.debit_paid_amt);
          }
        } else if (v.source == "pur_invoice") {
          if (selectedBills.includes(parseInt(v.invoice_id))) {
            creditTotalAmt += parseFloat(v.paid_amt);
          }
        }
      });
      // console.log("debitTotalAmt", debitTotalAmt);
      // console.log("remTotalDebitAmt", remTotalDebitAmt);
      // let damt = f_billLst.reduce((p,n)=>parseFloat(p)+parseFloat(n.paid_amt))
      remTotalDebitAmt =
        parseFloat(remTotalDebitAmt) +
        parseFloat(debitTotalAmt) -
        parseFloat(creditTotalAmt);
      // console.log("remTotalDebitAmt", remTotalDebitAmt);
      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          // debugger;

          if (f_selectedBills.includes(v.invoice_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
              remTotalDebitAmt = remTotalDebitAmt - v["amount"];
              pamt = v["amount"];
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["paid_amt"] = pamt;
            v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);
            let selectbill = this.finalBillSelectedAmt() - pamt;
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
                  msg: "selected bill amt is greater than payable amt, do you want to continue",
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

                    // console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["paid_amt"] = v["amount"];
                    v["remaining_amt"] = 0;
                    // console.log("totalDebitAmt", remTotalDebitAmt);
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
                    let selectbill = parseFloat(v["amount"]);
                    let remaingbill = 0;
                    this.setState({
                      selectedAmt: selectbill,
                      remainingAmt: remaingbill,
                    });
                  },
                  handleFailFn: () => { },
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }
          } else {
            v["paid_amt"] = 0;
            v["remaining_amt"] = parseFloat(v.amount);
          }
        } else {
          // debugger;

          if (f_selectedBills.includes(v.invoice_id)) {
            v["paid_amt"] = parseFloat(v.amount);
            v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
            let selectbill = parseFloat(v.amount);
            let remaingbill = parseFloat(v["amount"]) - parseFloat(v.amount);
            this.setState({
              selectedAmt: selectbill,
              remainingAmt: remaingbill,
            });
            // console.log(
            //   "parseFloat(v.amount)",
            //   parseFloat(v.amount),
            //   parseFloat(v["amount"]) - parseFloat(v.amount)
            // );
          } else {
            v["paid_amt"] = 0;
            v["remaining_amt"] = parseFloat(v.amount);
            this.setState({
              selectedAmt: 0,
              remainingAmt: parseFloat(v.amount),
            });
          }
        }

        return v;
      });
    } else {
      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          // console.log(
          //   "remTotalDebitAmt============:::::::::",
          //   remTotalDebitAmt
          // );
          if (f_selectedBills.includes(v.invoice_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
              remTotalDebitAmt = remTotalDebitAmt - v["amount"];
              pamt = v["amount"];
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["paid_amt"] = pamt;
            v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);
            // console.log("pamttttttt:::::::::", pamt);
            // console.log(
            //   "selected Final Amt :::::::::::::::::",
            //   this.finalBillSelectedAmt()
            // );
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
                  msg: "selected bill amt is greater than payable amt, do you want to continue",
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
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
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
                  handleFailFn: () => { },
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }
          } else {
            v["paid_amt"] = 0;
            v["remaining_amt"] = parseFloat(v.amount);
          }
        } else {
          if (f_selectedBills.includes(v.invoice_id)) {
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
    }

    this.setState({
      isAllChecked: f_billLst.length == f_selectedBills.length ? true : false,
      selectedBills: f_selectedBills,
      billLst: f_billLst,
    });
  };

  handleBillselectiondebit = (id, index, status) => {
    // console.log("id,index,status", id, index, status);
    let {
      billLst,
      selectedBillsdebit,
      totalDebitAmt,
      invoiceBillLst,
      debitBillLst,
      selectedBills,
    } = this.state;
    // console.log({
    //   billLst,
    //   selectedBillsdebit,
    //   totalDebitAmt,
    //   invoiceBillLst,
    //   debitBillLst,
    //   selectedBills,
    // });
    let remTotalDebitAmt = totalDebitAmt;
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        if (!selectedBillsdebit.includes(id)) {
          f_selectedBills = [...f_selectedBills, parseInt(id)];
        }
      } else {
        f_selectedBills = [...f_selectedBills, parseInt(id)];
      }
    } else {
      f_selectedBills = f_selectedBills.filter(
        (v, i) => parseInt(v) != parseInt(id)
      );
    }
    if (selectedBills.length > 0) {
      // let debitBills = debitBillLst.filter((v) =>
      //   selectedBills.includes(parseInt(v.invoice_id))
      // );
      // console.log("debitBills", debitBills);
      // let remTotalDebitAmt = totalDebitAmt;

      // console.log("selectedBills", selectedBills);
      // console.log("f_billLst", f_billLst);
      let debitTotalAmt = 0;
      let creditTotalAmt = 0;
      f_billLst.map((v, i) => {
        if (v.source == "pur_invoice") {
          if (selectedBills.includes(parseInt(v.invoice_id))) {
            debitTotalAmt += parseFloat(v.paid_amt);
          }
        } else if (v.source == "debit_note") {
          if (selectedBillsdebit.includes(parseInt(v.debit_note_id))) {
            creditTotalAmt += parseFloat(v.debit_paid_amt);
          }
        }
      });
      // console.log("debitTotalAmt", debitTota/Amt);
      remTotalDebitAmt =
        parseFloat(remTotalDebitAmt) +
        parseFloat(debitTotalAmt) -
        parseFloat(creditTotalAmt);
      // console.log("remTotalDebitAmt", remTotalDebitAmt);

      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          if (f_selectedBills.includes(v.debit_note_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.total_amt;
              pamt = v.total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["debit_paid_amt"] = pamt;
            v["debit_remaining_amt"] =
              parseFloat(v.total_amt) - parseFloat(pamt);
            this.setState({
              selectedAmt: pamt,
              remainingAmt: parseFloat(v["total_amt"]) - parseFloat(pamt),
            });
            if (v["debit_remaining_amt"] > 0) {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "selected bill amt is greater than payable amt, do you want to continue",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    // console.log(
                    //   "this.ref.current====>>>????",
                    //   this.ref.current
                    // );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["debit_remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;

                    // console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["debit_paid_amt"] = v["total_amt"];
                    v["debit_remaining_amt"] = 0;
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
                  },
                  handleFailFn: () => { },
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.debit_note_id)) {
            v["debit_paid_amt"] = parseFloat(v.total_amt);
            v["debit_remaining_amt"] =
              parseFloat(v["total_amt"]) - parseFloat(v.total_amt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.total_amt);
          }
        }

        return v;
      });
    } else {
      if (status == true) {
        if (selectedBillsdebit.length > 0) {
          if (!selectedBillsdebit.includes(id)) {
            f_selectedBills = [...f_selectedBills, parseInt(id)];
          }
        } else {
          f_selectedBills = [...f_selectedBills, parseInt(id)];
        }
      } else {
        f_selectedBills = f_selectedBills.filter(
          (v, i) => parseInt(v) != parseInt(id)
        );
      }
      let remTotalDebitAmt = totalDebitAmt;

      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          if (f_selectedBills.includes(v.debit_note_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.total_amt;
              pamt = v.total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["debit_paid_amt"] = pamt;
            v["debit_remaining_amt"] =
              parseFloat(v.total_amt) - parseFloat(pamt);
            this.setState({
              selectedAmt: pamt,
              remainingAmt: parseFloat(v["amount"]) - parseFloat(pamt),
            });
            // let amt = this.state.payableAmt;
            // let finalpayAmt = parseFloat(pamt) + parseFloat(amt);
            // console.log("finalpayAmt::::::", finalpayAmt);
            // this.setState({ totalDebitAmt: finalpayAmt });
            // this.ref.current.setFieldValue(
            //   "payableAmt",
            //   isNaN(finalpayAmt) ? 0 : finalpayAmt
            // );
            if (v["debit_remaining_amt"] > 0) {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "selected bill amt is greater than payable amt, do you want to continue",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    // console.log(
                    //   "this.ref.current====>>>????",
                    //   this.ref.current
                    // );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["debit_remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;

                    // console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["debit_paid_amt"] = v["total_amt"];
                    v["remTotalDebitAmt"] = 0;
                    this.setState({
                      totalDebitAmt: remTotalDebitAmt,
                    });
                  },
                  handleFailFn: () => { },
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.debit_note_id)) {
            v["debit_paid_amt"] = parseFloat(v.total_amt);
            v["debit_remaining_amt"] =
              parseFloat(v["total_amt"]) - parseFloat(v.total_amt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.total_amt);
          }
        }

        return v;
      });
    }

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
      lstSelected = billLst.map((v) => v.invoice_id);
      // console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        if (v.source === "debit_note") {
          v["paid_amt"] = parseFloat(v.total_amt);
          v["remaining_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v.total_amt);

          return v;
        }

        return v;
      });

      // console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        v["paid_amt"] = 0;
        v["remaining_amt"] = parseFloat(v.total_amt);
        return v;

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBills: lstSelected,
      billLst: fBills,
    });
  };

  handleBillsSelectionAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      // console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        if (v.source === "pur_invoice") {
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

      // console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (v.source == "pur_invoice") {
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

  handleBillsSelectionOpeningAll = (status,) => {
    let { billLst, selectedBills } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      fBills = billLst.map((v) => {
        if (
          v.source === "opening_balance"
        ) {
          selectedBills = [...selectedBills, v.invoice_unique_id];
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
        }
        return v;
      });
    } else {
      console.log("in else all selec::::::::::::::");
      fBills = billLst.map((v) => {
        if (
          v.source == "opening_balance"
        ) {
          selectedBills = selectedBills.filter(
            (vi) => vi != v.invoice_unique_id
          );
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }
        return v;
      });
    }

    this.setState({
      isAllCheckedOpening: status,
      selectedBills: selectedBills,
      billLst: fBills,
    });
  };

  handleBillsSelectionInvoiceAll = (status) => {
    let { billLst, selectedBills } = this.state;
    let fBills = billLst;
    // let lstSelected = [];
    if (status == true) {
      fBills = billLst.map((v) => {
        // lstSelected = billLst.map((v) => v.invoice_id);
        if (v.source === "pur_invoice") {
          selectedBills = [...selectedBills, v.invoice_unique_id];
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
        }
        return v;
      });
    } else {
      console.log("in else all selec::::::::::::::");
      fBills = billLst.map((v) => {
        if (
          v.source == "pur_invoice"
        ) {
          selectedBills = selectedBills.filter(
            (vi) => vi != v.invoice_unique_id
          );
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }
        return v;
      });
    }

    this.setState({
      isAllChecked: status,
      selectedBills: selectedBills,
      billLst: fBills,
    });
  };

  handleBillsSelectionDebitAll = (status) => {
    let { billLst, selectedBills } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      fBills = billLst.map((v) => {
        // lstSelected = billLst.map((v) => v.invoice_id);
        if (v.source === "debit_note") {
          selectedBills = [...selectedBills, v.invoice_unique_id];
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
        }
        return v;
      });
      console.log("in if all selectedBills::::::::::::::", selectedBills)
    } else {
      console.log("in else all selec::::::::::::::");
      fBills = billLst.map((v) => {
        if (
          v.source == "debit_note"
        ) {
          selectedBills = selectedBills.filter(
            (vi) => vi != v.invoice_unique_id
          );
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }
        return v;
      });
      console.log("in else false selectedBills::::::::::::::", selectedBills)
    }

    this.setState({
      isAllCheckeddebit: status,
      selectedBills: selectedBills,
      billLst: fBills,
    });
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "voucher_payment",
      to: "voucher_paymentlist",
    });
  };

  ledgerModalFun = (status, index = -1) => {
    let { rows } = this.state;
    let obj = rows.find((v, i) => i == index);

    this.setState({
      // ledgerData: "",
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

            // ledgerList: res.list,
            ledgerList: res.list.filter((v) => v.type == "SC"),
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  OutletBankMasterList = () => {
    let { selectedLedger } = this.state;
    let requestData = new FormData();
    requestData.append("ledger_id", selectedLedger.id);
    get_ledger_bank_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let bankList = res.list;
          let bankNameOpt = [];
          if (bankList.length > 0) {
            bankNameOpt = bankList.map((v) => {
              return {
                label: v.bank_name,
                value: v.id,
              };
            });
          }

          this.setState({
            bankNameOpt: bankNameOpt,
          });
        }
      })
      .catch((error) => { });
  };

  handleBillByBill = (element, value, index) => {
    let { rows, selectedLedger } = this.state;
    let debitBal = 0;
    let creditBal = 0;
    let debitamt = 0;
    let frows = rows.map((v, i) => {
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
      } else if (v["type"] == "cr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      return v;
    });

    let lastCrBal = debitBal - creditBal;

    if (element == "debit") {
      let obj = rows.find((v, i) => i == index);

      if (obj.type == "dr" && selectedLedger) {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancingMethod,
          value
        );
      } else if (obj.type == "cr") {
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            //  (lastCrBal -lastCrBal - vi["paid_amt"]),
            vi["credit"] = lastCrBal;
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }

    this.setState({ rows: frows, index: index });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // @mrunal @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      this.setpaymentinvoiceSerialNo();
      this.lstgetsundrycreditors_indirectexpenses();
      this.lstgetcashAcbankaccount();
      this.transaction_ledger_listFun();
      this.lstModeOfPayment();
      let { prop_data } = this.props.block;
      // console.log("prop_data---:::--", prop_data.invoice_data);

      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.initRows(1);
      this.setState({ source: prop_data }, () => {
        this.handlePropsData(prop_data);
        // console.log("source", this.state.source);
      });
      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close
      // alt key button disabled end
    }
  }
  //@neha @On outside Modal click Modal will Close billadjusmentmodalshow
  handleClickOutside = (event) => {
    //@shubh @On billadjusmentmodalshow close on click body instaed any target ele
    if (event.target.classList.contains('tbl-body-style-new1')) {
      this.setState({ billadjusmentmodalshow: false });
    }
    const modalNode = ReactDOM.findDOMNode(this.ledgerModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ billadjusmentmodalshow: false });

      this.setState({ ledgerModal: false });
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
    }
  };
  // @mrunal @ On outside Modal click Modal will Close
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
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index) => {
    let debitBal = 0;
    let creditBal = 0;
    let { rows } = this.state;
    console.log("rows:::::::::::", rows);
    let frows = rows.map((v, i) => {
      if (v["type"] == "dr") {
        if (index + 1 == i) {
          v["type"] = "cr";
        }
        if (v["paid_amt"] != "" && i != index)
          debitBal = debitBal + parseFloat(v["paid_amt"]);
      } else if (v["type"] == "cr" && i != index) {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          // console.log("dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          // console.log("cr value", value);
        }
        if (element == "perticulars") {
          value["selectedAmt"] = 0;
          value["payableAmt"] = 0;
          value["remainingAmt"] = 0;
          value["isAdvanceCheck"] = false;
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    // console.log("debitBal, creditBal ", { debitBal, creditBal });

    let lastCrBal = debitBal - creditBal;

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);

      if (obj.type == "dr") {
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancing_method
        );
      } else if (obj.type == "cr") {
        // console.log("obj", obj);

        setTimeout(() => {
          if (document.getElementById(`payment-credit-${index}`) != null) {
            //@Vinit @Focusing the previous tab were we left
            document.getElementById(`payment-credit-${index}`).focus();
          }
        }, 1000);


        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
            vi["credit"] = lastCrBal;
            // console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    // console.log("frows", { frows });
    this.setState({ rows: frows, index: index });
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
        // console.log("On account -->", v);
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
    let { index, rows, rowIndex } = this.state;
    console.warn(">>>>>>>>>>>>>>>>>>>>>>.", index, rows, rowIndex)
    console.log("rowIndexxxxxxxx", rowIndex)
    let currentR = rows[rowIndex];
    console.log("rows::::", rows, v);
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        v['paid_amt'] = v['credit'];

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
        this.setState({ bankaccmodal: false, index: -1 },
          () => {
            if (v["type"] == "cr") {
              console.log("cr v", v)
              this.FocusTrRowFieldsID(`payment-credit-${rowIndex}`);
            } else {
              // alert("hekdsfgko")
              console.log("dr v", v)
              this.FocusTrRowFieldsID(`payment-debit-${rowIndex}`);
            }
          });
      }
    );
    // this.FocusTrRowFieldsID(`contra-debit-${rowIndex}`);
  };

  handleBillPayableAmtChange = (value, index) => {
    // console.log({ value, index });
    const { billLst, debitBills, billLstSc } = this.state;
    // console.log("billLstSc", billLstSc);
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "pur_invoice") {
        v["paid_amt"] = (value);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "debit_note") {
        v["paid_amt"] = (value);
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      } else if (i == index && v.source == "opening_balance") {
        v["paid_amt"] = (value);
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };
  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
      }
    });
    return isNaN(debitamt) ? 0 : debitamt;
  };

  getTotalCreditAmt = () => {
    let { rows } = this.state;
    // console.log("Total Credit ", rows);
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "cr") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });
    // console.log("Total Credit Amount ", creditamt);
    return isNaN(creditamt) ? 0 : creditamt;
  };
  // New code
  getCurrentOpt = (index) => {
    let { rows, sundryCreditorLst, cashAcbankLst } = this.state;

    // console.log({ sundryCreditorLst });
    // console.log({ cashAcbankLst });
    let currentObj = rows.find((v, i) => i == index);
    // console.log('currentObject', currentObj);
    if (currentObj.type == "dr") {
      return sundryCreditorLst;
    } else if (currentObj.type == "cr") {
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
  handleAdvaceCheck = (status) => {
    let { billLst, selectedBills } = this.state;
    if (status) {
      let advanceAmt = this.finalRemaningSelectedAmt();
      // console.log("advanceAmt on check================", advanceAmt);
      let remTotalDebitAmt = advanceAmt;
      if (parseFloat(advanceAmt) > 0) {
        let obj = billLst.find((v) => v.source == "pur_invoice");
        let newObj = { ...obj };
        newObj["amount"] = advanceAmt;
        newObj["paid_amt"] = advanceAmt;
        newObj["debit_paid_amt"] = 0;
        newObj["debit_remaining_amt"] = 0;
        newObj["invoice_date"] = moment(new Date()).format("YYYY-MM-DD");
        newObj["invoice_id"] = 0;
        newObj["invoice_no"] = "New Ref";
        newObj["invoice_unique_id"] = convertToSlug("new-ref");
        newObj["remaining_amt"] = 0;
        newObj["total_amt"] = advanceAmt;
        newObj["balancing_type"] = "Dr";
        newObj["source"] = "pur_invoice";

        let fBilllst = [...billLst, newObj];
        let f_selectedBills = [...selectedBills, newObj["invoice_unique_id"]];
        // console.log("FBilllst:::::::::::::", fBilllst);

        let invoiceLst = fBilllst.filter(
          (v) => v.source.trim().toLowerCase() == "pur_invoice"
        );

        this.setState({
          billLst: fBilllst,
          isAdvanceCheck: true,
          selectedBills: f_selectedBills,
          advanceAmt: advanceAmt,
          invoiceListExist: invoiceLst.length > 0 ? true : false,
        });
      }
    } else if (status == false) {
      // console.log("selectedBills", selectedBills);
      // let advance = billLst.find((v) => parseInt(v.invoice_id) == 0);
      // console.log("billLst==>>>>>>>>>>", billLst);
      selectedBills = selectedBills.filter(
        (v) => v != convertToSlug("new-ref")
      );
      billLst = billLst.filter(
        (v) => v.invoice_unique_id != convertToSlug("new-ref")
      );

      this.setState(
        {
          billLst: billLst,
          isAdvanceCheck: false,
          selectedBills: selectedBills,
          advanceAmt: 0,
          // advanceAmt: advance ? advance.paid_amt : 0,
        },
        () => {
          let obj = billLst.find(
            (v) =>
              v.source == "pur_invoice" &&
              selectedBills.includes(v.invoice_unique_id)
          );
          // this.handleBillselectionOpening(obj.invoice_id, 0, true);
        }
      );
    }
  };

  handlePaymentLedgerTableRow(event) {
    // console.log("handlePaymentLedgerTableRow", event);
    let { rowIndex, ledgerList, selectedLedgerIndex, rows, cashAcbankLst } =
      this.state;
    // let { handleBillByBill, ledgerData } = this.props;
    // console.log("objCR==>", objCR, rowIndex);
    let currentR = rows[rowIndex];
    const k = event.keyCode;
    if (currentR && currentR["type"].toLowerCase() == "dr") {
      if (k == 13) {
        // !Enter key
        // console.log("enter work", selectedLedgerIndex, rowIndex);
        let obj = ledgerList[selectedLedgerIndex];
        // console.log("enter work", obj);
        if (obj) {
          this.setState(
            {
              ledgerModal: false,
              selectedLedgerIndex: 0,
              selectedLedger: obj,
            },
            () => {
              this.handleChangeArrayElement("perticulars", obj, rowIndex);
              if (obj.balancingMethod != "on-account") {
                this.handleBillByBill("debit", obj, rowIndex);
              } else {
                let innerrow = {
                  type: "cr",
                  typeobj: getSelectValue(selectOpt, "cr"),
                  perticulars: "",
                  paid_amt: "",
                  bank_payment_type: "",
                  bank_payment_no: "",
                  bank_name: "",
                  // check_number:"",
                  payment_date: "",
                  debit: "",
                  credit: "",
                  narration: "",
                };
                this.setState(
                  {
                    billadjusmentmodalshow: false,
                    index: -1,
                    rows: [...this.state.rows, innerrow],
                  },
                  () => {
                    this.FocusTrRowFieldsID(
                      `payment-debit-${this.state.selectedLedgerIndex}`
                    );
                  }
                );
              }
              this.transaction_ledger_listFun();
            }
          );
        }
      } else if (k == 40) {
        // !Arrowdown
        // console.log("arrowdown", ledgerList, selectedLedgerIndex);
        if (selectedLedgerIndex < ledgerList.length - 1) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex + 1 },
            () => {
              this.FocusTrRowFieldsID(
                `payment-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 38) {
        //! ArrowUp
        // console.log("arrowup");
        if (selectedLedgerIndex > 0) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex - 1 },
            () => {
              this.FocusTrRowFieldsID(
                `payment-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 8) {
        this.FocusTrRowFieldsID(
          `payment-perticulars-${this.state.selectedLedgerIndex}`
        );
      }
    } else if (currentR && currentR["type"].toLowerCase() == "cr") {
      if (k == 13) {
        // console.log("enter work", selectedLedgerIndex, rowIndex);
        let obj = cashAcbankLst[selectedLedgerIndex];
        console.log("enter work", obj);
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
        // console.log("arrowdown", ledgerList, selectedLedgerIndex);
        if (selectedLedgerIndex < cashAcbankLst.length - 1) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex + 1 },
            () => {
              this.FocusTrRowFieldsID(
                `payment-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 38) {
        // console.log("arrowup");
        if (selectedLedgerIndex > 0) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex - 1 },
            () => {
              this.FocusTrRowFieldsID(
                `payment-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      } else if (k == 8) {
        this.FocusTrRowFieldsID(
          `payment-perticulars-${this.state.selectedLedgerIndex}`
        );
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
  // handleLstChange = (e) => {
  //   let { orgLedgerList } = this.state;
  //   if (orgLedgerList.length > 0) {
  //     const selectedAll = e.target.value;
  //     let filterLst = orgLedgerList;
  //     if (selectedAll === "Creditor") {
  //       filterLst = filterLst.filter((v) => v.type == "SC");
  //       // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
  //       this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
  //       // alert(JSON.stringify(filterLst.length));
  //     } else if (selectedAll === "Debitor") {
  //       filterLst = filterLst.filter((v) => v.type == "SD");
  //       // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
  //       this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
  //       // alert(JSON.stringify(filterLst.length));
  //     } else {
  //       // console.warn("filterLst->>>>>>>>", orgLedgerList, selectedAll);
  //       this.setState({ selectedAll: selectedAll, ledgerList: orgLedgerList });
  //       // alert(JSON.stringify(ledgerList.length));
  //     }
  //   }
  // };
  handleCashLstChange = (e) => {
    let { orgCashList, orgLedgerList } = this.state;
    if (orgCashList.length > 0) {
      const selectedCashAll = e.target.value;
      let filterLst = orgCashList;
      let filterAllLst = orgLedgerList;
      if (selectedCashAll === "Cash/Bank") {
        // filterLst = filterLst.filter((v) => v.type == "cr" || "dr");
        this.setState({
          selectedCashAll: selectedCashAll,
          cashAcbankLst: filterLst,
        });
      } else if (orgLedgerList.length > 0) {
        this.setState({
          selectedCashAll: selectedCashAll,
          cashAcbankLst: filterAllLst,
        });
      }
    }
  };

  handlePropsData = (prop_data) => {
    if (prop_data.invoice_data) {
      this.setState(
        {
          initVal: prop_data.invoice_data,
          rows: prop_data.rows,
          // productId: prop_data.productId,
          ledgerId: prop_data.ledgerId,
        },
        () => {
          this.setState(
            {
              // productId: prop_data.productId,
              ledgerId: prop_data.ledgerId,
              setLedgerId: true,
              setProductId: true,
              setProductRowIndex: prop_data.rowIndex,
            },
            () => {
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                if (this.props.block.prop_data != "") {
                  this.FocusTrRowFieldsID(`payment-perticulars-${this.props.block.prop_data.rowIndex}`);
                } else if (this.inputLedgerNameRef.current) {
                  this.inputLedgerNameRef.current.focus();
                }
              }, 1000);
            }
          );
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
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
          // resetForm();
          // this.initRow();
          this.componentDidMount();
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
  handleLstChange = () => {
    let { orgLedgerList, selectedAll } = this.state;
    // console.log("selectedAll------>", selectedAll);
    // console.log("orgLedgerList------>", orgLedgerList);
    if (orgLedgerList.length > 0) {
      // const selectedAll = e.target.value;
      let filterLst = orgLedgerList;
      if (selectedAll == true) {
        filterLst = filterLst.filter((v) => v.type == "SC");
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
  handleCreditdebitBalance = (e, index) => {
    let { rows } = this.state;
    let debitAmt = this.getTotalDebitAmt();
    let creditAmt = this.getTotalCreditAmt();
    // let count = index + 1;
    //@shubh added the condn to check i.e input filled then only calculate and render next input
    if (e.target.value != "") {
      let frows = rows.map((v, i) => {
        if (debitAmt != creditAmt) {
          console.log("index same====", i != index);
          if (v["perticulars"] != "" && i != index) {
            let innerrow = {
              type: "cr",
              typeobj: getSelectValue(selectOpt, "cr"),
              paid_amt: "",
            };

            this.setState({ rows: [...this.state.rows, innerrow] }, () => {
              // console.log("row innerrow====", this.state.rows);
              this.typeRef.current.focus();
            });
          }
        }
      });
    }

  };

  filterData = (value) => {
    // console.log("value in filter>>>>>>>>>>>>>>>", value);
    let { ledgerList, orgLedgerList } = this.state;
    // console.log("productLst--", ledgerList);
    // console.log("orgProductLst", orgLedgerList);
    let filterData = orgLedgerList.filter((v) =>
      v.ledger_name.toLowerCase().includes(value)
    );
    // console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      ledgerList: filterData.length > 0 ? filterData : [],
      ledgerModal: true,
    });
  };

  dateFilter = () => {
    let { startDate, endDate, selectedLedger } = this.state;
    this.FetchPendingBills(
      selectedLedger.id,
      selectedLedger.type,
      selectedLedger.balancingMethod
    );
    // console.log("in filter function");
  };

  lstModeOfPayment = () => {
    getPaymentModes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          // console.log("payment modes:", data);
          let Opt = data.map(function (values) {
            return { value: values.id, label: values.payment_mode };
          });
          this.setState({ BankOpt: Opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }

  FocusTrRowFieldsID(fieldName) {
    // console.log("fieldName", fieldName)
    setTimeout(() => {
      if (document.getElementById(fieldName) != null) {
        document.getElementById(fieldName).focus();
      }
    }, 1000);

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
          form.elements[index].focus()
          // index === 1 ? form.elements[0].focus() : form.elements[index].focus()
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

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
            // this.invoiceDateRef.current.focus();
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
                    // this.inputRef1.current.focus();
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
                  // this.invoiceDateRef.current.focus();
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
                    // this.inputRef1.current.focus();
                  }, 500);
                }
              },
              handleFailFn: () => {
                // setFieldValue("pi_invoice_dt", "");
                // eventBus.dispatch("page_change", {
                //   from: "tranx_purchase_invoice_create",
                //   to: "tranx_purchase_invoice_list",
                //   isNewTab: false,
                // });

                setTimeout(() => {
                  // document.getElementById("pi_invoice_dt").focus();
                  // this.invoiceDateRef.current.focus();
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

  render() {
    let {
      sourceUnder,
      invoice_data,
      ledgerType,
      invoiceedit,
      createproductmodal,
      adjusmentbillmodal,
      billadjusmentmodalshow,
      billadjusmentCreditmodalshow,
      bankledgershow,
      bankchequeshow,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      amtledgershow,
      selectedBills,
      selectedBillsdebit,
      onaccountmodal,
      productLst,
      serialnopopupwindow,
      pendingordermodal,
      pendingorderprdctsmodalshow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      purchasePendingOrderLst,
      isAllChecked,
      isAllCheckedOpening,
      selectedPendingOrder,
      initVal,
      sundryindirect,
      billLst,
      billLstSc,
      cashAcbankLst,
      accountLst,
      debitBills,
      selectedBillsCredit,
      isAllCheckeddebit,
      isAllCheckedCredit,
      voucher_data,
      voucher_edit,
      sundryCreditorLst,
      show,
      crshow,
      cashAccLedgerLst,
      onaccountcashaccmodal,
      bankaccmodal,
      isDisabled,
      ledgerModal,
      ledgerList,
      ledgerData,
      bankData,
      selectedLedger,
      objCR,
      rowIndex,
      errorArrayBorder,
      payableAmt,
      selectedAmt,
      isAdvanceCheck,
      remainingAmt,
      selectedBillsData,
      selectedAll,
      debitListExist,
      invoiceListExist,
      openingListExist,
      selectedCashAll,
      ledgerModalFun,
      filterOpen,
      selectedBillsOpening,
      bankNameOpt,
      lstBills,
      isChecked,
      BankOpt,
      errorArrayBorderBank,
      opType,
      selectedLedgerIndex,
    } = this.state;
    return (
      <div className="accountentrynewstyle">
        {/* <h6>Purchase Invoice</h6> */}
        <div className="cust_table">
          <Formik
            validateOnChange={false}
            // validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initVal}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   payment_sr_no: Yup.string()
            //     .trim()
            //     .required("Payment  no is required"),
            // pi_transaction_dt: Yup.string().required(
            //   "Transaction date is required"
            // ),
            //   sundryindirectid: Yup.string().required().value,
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start
              // console.log("this.ref.current.=====?????", values);

              let errorArray = [];
              if (
                values.pi_transaction_dt == "" ||
                values.pi_transaction_dt == "__/__/____"
              ) {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              let data;

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
                        msg: "Do you want to save",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          // console.log("rows===", rows);
                          let filterRow = rows.filter((v) => {
                            // console.log("v>>>>>>>>>>>>>>>>>>", v);
                            if (v.bank_payment_type != "") {
                              v.bank_payment_type = v.bank_payment_type
                                ? v.bank_payment_type.value
                                : "";
                              v.bank_name = v.bank_name
                                ? v.bank_name.value
                                : "";
                              v.bank_payment_no = v.bank_payment_no
                                ? v.bank_payment_no
                                : "";
                              // v.payment_date = v.payment_date;
                              v.payment_date = moment(v.payment_date).format(
                                "YYYY-MM-DD"
                              );
                            }
                            return v;
                          });
                          // if (creditamt == debitamt) {
                          let frow = filterRow.filter((v) => v.type != "");
                          let formData = new FormData();
                          // console.log("frow", frow);

                          frow = frow.map((v, i) => {
                            // debugger;
                            if (
                              v.perticulars &&
                              v.perticulars.balancingMethod == "bill-by-bill"
                            ) {
                              let billRow = [];
                              v.perticulars &&
                                v.perticulars.billids &&
                                v.perticulars.billids.map((vi, ii) => {
                                  if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                    // return vi;
                                    billRow.push(vi);
                                  } else if (
                                    "credit_paid_amt" in vi &&
                                    vi["credit_paid_amt"] > 0
                                  ) {
                                    // return vi;
                                    billRow.push({
                                      invoice_id: vi.credit_note_id,
                                      amount: vi.Total_amt,

                                      invoice_date: moment(
                                        vi.credit_note_date
                                      ).format("YYYY-MM-DD"),
                                      invoice_no: vi.credit_note_no,
                                      source: vi.source,
                                      paid_amt: vi.credit_paid_amt,
                                      remaining_amt: vi.credit_remaining_amt,
                                    });
                                  }
                                });

                              // console.log("billrow >>>>>>", billRow);
                              // billRow = billRow.filter((v) => v != undefined);
                              // console.log("billrow >>>>>>", billRow);

                              let perObj = {
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                                payableAmt:
                                  v.payableAmt != null ? v.payableAmt : 0,
                                remainingAmt: v.remainingAmt,
                                selectedAmt: v.selectedAmt,
                                isAdvanceCheck: v.isAdvanceCheck,

                                billids: billRow,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                // bank_payment_type: v.bank_payment_type,
                                // bank_payment_no: v.bank_payment_no,
                                perticulars: perObj,
                              };
                            } else if (
                              v.perticulars &&
                              v.perticulars.type == "IE"
                            ) {
                              let perObj = {
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.label,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.debit,

                                perticulars: perObj,
                              };
                            } else if (
                              v.perticulars &&
                              v.perticulars.balancingMethod == "on-account"
                            ) {
                              let perObj = {
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                // bank_payment_type: v.bank_payment_type,
                                // bank_payment_no: v.bank_payment_no,
                                perticulars: perObj,
                              };
                            } else {
                              let perObj = {
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.credit,
                                bank_payment_type: v.bank_payment_type,
                                bank_payment_no: v.bank_payment_no,
                                bank_name: v.bank_name,
                                // check_number:v.check_number,
                                payment_date: v.payment_date,
                                perticulars: perObj,
                              };
                            }
                          });
                          // console.log("frow ---------", frow);

                          // var filtered = frow.filter(function (el) {
                          //   return el != null;
                          // });
                          formData.append("row", JSON.stringify(frow));

                          // formData.append('rows', JSON.stringify(frow));
                          // console.log('rows', rows);
                          formData.append(
                            "transaction_dt",
                            moment(
                              values.pi_transaction_dt,
                              "DD/MM/YYYY"
                            ).format("YYYY-MM-DD")
                          );
                          formData.append(
                            "payment_sr_no",
                            values.payment_sr_no
                          );
                          formData.append("payment_code", values.payment_code);
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);

                          let invoice_total_amt = this.finalBillInvoiceAmt();
                          // console.log("invoice_total_amt", invoice_total_amt);

                          formData.append(
                            "total_invoice_amt",
                            invoice_total_amt
                          );
                          let debit_total_amt = this.finalBillDebitAmt();

                          formData.append("tota_debit_amt", debit_total_amt);

                          formData.append("payableAmt", this.state.payableAmt);
                          formData.append(
                            "selectedAmt",
                            this.state.selectedAmt
                          );
                          formData.append(
                            "remainingAmt",
                            isNaN(this.state.remainingAmt)
                              ? 0
                              : this.state.remainingAmt
                          );
                          formData.append(
                            "isAdvance",
                            this.state.isAdvanceCheck
                          );

                          if (values.narration != null) {
                            formData.append("narration", values.narration);
                          }
                          // for (const pair of formData.entries()) {
                          //   console.log(
                          //     `key => ${pair[0]}, value =>${pair[1]}`
                          //   );
                          // }
                          // console.log(
                          //   "Debit total amt",
                          //   this.getTotalDebitAmt()
                          // );
                          // console.log(
                          //   "credit total amt",
                          //   this.getTotalCreditAmt()
                          // );
                          create_payments(formData)
                            .then((response) => {
                              // console.log("response", response);
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
                                  from: "voucher_payment",
                                  to: "voucher_paymentlist",
                                  isNewTab: false,
                                });
                                resetForm();
                                this.initRows();
                              } else {
                                // ShowNotification("Please Correct the Credit and Debit values");
                                setSubmitting(false);
                                if (response.responseStatus == 401) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: response.message,
                                    is_button_show: true,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Please Select Ledger First",
                                    // is_button_show: true,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // console.log(
                                  //   "Server Error! Please Check Your Connectivity"
                                  // );
                                }
                              }
                            })
                            .catch((error) => {
                              console.log("error", error);
                            });
                        },
                        handleFailFn: () => { },
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
                      msg: "Please match the Credit and debit Amount",
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
              <Form
                onSubmit={handleSubmit}
                noValidate
                className="frm-accountentry"
                style={{ overflow: "hidden" }}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                {/* {JSON.stringify(rows)} */}
                <div className="div-style">
                  <div className="inner-div-account">
                    <Row>
                      <Col md="1" className="my-auto">
                        <Form.Label className="pt-0 lbl">
                          Voucher Sr. No.
                          {/* <span className="pt-1 pl-1 req_validation">
                          *
                        </span>:{" "} */}
                        </Form.Label>
                      </Col>
                      <Col md="2">
                        <Form.Control
                          type="text"
                          className="accountentry-text-box"
                          placeholder=" "
                          // autoFocus={true}
                          name="payment_sr_no"
                          id="payment_sr_no"
                          onChange={handleChange}
                          value={values.payment_sr_no}
                          isValid={
                            touched.payment_sr_no && !errors.payment_sr_no
                          }
                          isInvalid={!!errors.payment_sr_no}
                          readOnly={true}
                          disabled
                          onKeyDown={(e) => {
                            if (e.keyCode == 13 || e.keyCode == 9) {
                              if (
                                e.target.value != null &&
                                e.target.value != ""
                              ) {

                                this.focusNextElement(e);


                              } else {
                                // setFieldValue("pi_transaction_dt", "");
                              }
                            }
                          }}
                        // disabled
                        />
                      </Col>
                      <Col md="1" className="my-auto">
                        {/* <h6>Voucher Sr. #.</h6>:{' '} */}
                        {/* <span>
                                      {invoice_data
                                        ? invoice_data.purchase_sr_no
                                        : ''}
                                    </span> */}
                        <Form.Label className="pt-0 lbl">
                          Voucher No.
                          {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                        </Form.Label>
                      </Col>
                      <Col md="2">
                        <Form.Control
                          type="text"
                          placeholder="1234"
                          readOnly={true}
                          disabled
                          id="payment_code"
                          name="payment_code"

                          className="mb-0 accountentry-text-box"
                          value={values.payment_code}
                          onChange={handleChange}

                          onKeyDown={(e) => {
                            if (e.keyCode == 13 || e.keyCode == 9) {
                              if (
                                e.target.value != null &&
                                e.target.value != ""
                              ) {

                                this.focusNextElement(e);


                              } else {
                                // setFieldValue("pi_transaction_dt", "");
                              }
                            }
                          }}
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
                            } else if (
                              e.key === "Tab" &&
                              values.pi_transaction_dt === "__/__/____"
                            ) {
                              e.preventDefault();
                            }

                            if (e.shiftKey && e.key === "Tab") {
                              setTimeout(() => {
                                document
                                  .getElementById("pi_transaction_dt")
                                  ?.focus();
                              }, 200);

                              let datchco = e.target.value.trim();
                              // console.log("datchco", datchco);
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
                                  document
                                    .getElementById("pi_transaction_dt")
                                    ?.focus();
                                }, 1000);
                              }
                            } else if (e.key === "Tab") {
                              let datchco = e.target.value.trim();
                              // console.log("datchco", datchco);
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
                                  document
                                    .getElementById("pi_transaction_dt")
                                    .focus();
                                }, 1000);
                              }
                            }
                          }}
                        >
                          <MyTextDatePicker
                            innerRef={(input) => {
                              this.invoiceDateRef.current = input;
                            }}
                            // className="tnx-pur-inv-date-style "
                            name="pi_transaction_dt"
                            id="pi_transaction_dt"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            autoComplete="true"
                            autoFocus
                            value={values.pi_transaction_dt}
                            className={`${errorArrayBorder[0] == "Y"
                              ? "border border-danger accountentry-date-style"
                              : "accountentry-date-style"
                              }`}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              // console.log("tr date keydown", e);
                              if (e.keyCode === 13) {
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
                                }
                                this.FocusTrRowFieldsID(
                                  `payment-perticulars-0`
                                );
                              } else if (e.shiftKey && e.key === "Tab") {
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
                                }
                                let datchco = e.target.value.trim();
                                // console.log("datchco", datchco);
                                let checkdate = moment(e.target.value).format(
                                  "DD/MM/YYYY"
                                );
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
                                    document
                                      .getElementById("pi_transaction_dt")
                                      .focus();
                                  }, 1000);
                                }
                              } else if (e.key === "Tab") {

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
                                }

                                let datchco = e.target.value.trim();
                                // console.log("datchco", datchco);
                                let checkdate = moment(e.target.value).format(
                                  "DD/MM/YYYY"
                                );
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
                                    document
                                      .getElementById("pi_transaction_dt")
                                      .focus();
                                  }, 1000);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // console.log("e ", e);
                              // console.log("e.target.value ", e.target.value);
                              if (
                                e.target.value != null &&
                                e.target.value != "" &&
                                e.target.value != "__/__/____"
                              ) {
                                this.setErrorBorder(0, "");
                                // console.warn(
                                //   "warn:: isValid",
                                //   moment(e.target.value, "DD-MM-YYYY").isValid()
                                // );
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
                                    // is_button_show: true,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // this.invoiceDateRef.current.focus();
                                  // setFieldValue("pi_transaction_dt", "");
                                  setTimeout(() => {
                                    this.invoiceDateRef.current.focus();
                                  }, 1000);
                                }
                              } else {
                                // setFieldValue("pi_transaction_dt", "");
                                this.setErrorBorder(0, "Y");
                                // document
                                //   .getElementById("pi_transaction_dt")
                                //   .focus();
                              }
                            }}
                          />
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                          {errors.pi_transaction_dt}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </div>
                </div>
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new1"
                // style={{ maxHeight: "60vh", height: "60vh" }}
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
                        <th
                          style={{ width: "10%", textAlign: "center" }}
                          className="pl-4"
                        >
                          Debit
                        </th>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          Credit
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
                              <td
                                style={{
                                  width: "5%",
                                }}
                              >
                                {/* <Form.Control
                                  as="select"
                                  onChange={(e) => {
                                    this.handleChangeArrayElement(
                                      "type",
                                      e.target.value,
                                      ii
                                    );
                                  }}
                                  value={this.setElementValue("type", ii)}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    )
                                      e.preventDefault();
                                  }}
                                  placeholder="select type"
                                >
                                  <option value=""></option>
                                  <option value="dr">Dr</option>
                                  <option value="cr" selected>
                                    Cr
                                  </option>
                                </Form.Control> */}
                                <Form.Group>
                                  <Select
                                    ref={this.typeRef}
                                    styles={customStyles1}
                                    className="selectTo"
                                    // value={selectOpt.value}
                                    defaultValue={selectOpt[0]}
                                    options={selectOpt}
                                    onChange={(v) => {
                                      setFieldValue("type", v.label);
                                      this.handleChangeArrayElement(
                                        "type",
                                        v.label.trim().toLowerCase(),
                                        ii
                                      );
                                      // setTimeout(() => {
                                      this.handleChangeArrayElement(
                                        "typeobj",
                                        v,
                                        ii
                                      );
                                      // }, 100);
                                    }}
                                    name={`payment-type-${ii}`}
                                    id={`payment-type-${ii}`}
                                    value={this.setElementValue("typeobj", ii)}
                                    // value={values.drCr}
                                    placeholder="Type"
                                    // onKeyDown={(e) => {
                                    //   console.log("keydown type =-> ", e);
                                    //   if (e.shiftKey && e.key === "Tab") {
                                    //   } else if (e.key === "Tab") {
                                    //     e.preventDefault();
                                    //     this.FocusTrRowFieldsID(
                                    //       `payment-perticulars-${ii}`
                                    //     );
                                    //     this.ledgerModalFun(true, ii);
                                    //   }
                                    // }}
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
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
                                  className="tnx-pur-inv-text-box border-0"
                                  placeholder=" "
                                  // ref={this.inputLedgerNameRef}
                                  name={`payment-perticulars-${ii}`}
                                  id={`payment-perticulars-${ii}`}
                                  // id="data"
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
                                    if (billadjusmentmodalshow === false) {
                                      this.ledgerModalFun(true, ii);

                                    }
                                  }}
                                  value={
                                    rows[ii]["perticulars"]
                                      ? rows[ii]["perticulars"]["ledger_name"]
                                      : ""
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalFun(true, ii);
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      if (e.target.value === "") {
                                        this.ledgerModalFun(true, ii);
                                        e.preventDefault();
                                        if (ledgerModal === true) {
                                          document
                                            .getElementById("payment-ledger-0")
                                            ?.focus();
                                          document
                                            .getElementById(
                                              "payment-ledger-cashac-0"
                                            )
                                            ?.focus();
                                        }
                                      } else if (
                                        ledgerModal === true &&
                                        e.target.value !== ""
                                      ) {
                                        this.setState({ ledgerModal: false });
                                      }
                                    } else if (e.keyCode == 40) {
                                      //! this condition for down button press 1409
                                      if (ledgerModal == true) {
                                        document
                                          .getElementById("payment-ledger-0")
                                          ?.focus();
                                        document
                                          .getElementById(
                                            "payment-ledger-cashac-0"
                                          )
                                          ?.focus();
                                      } else {
                                        this.FocusTrRowFields(
                                          "particulars",
                                          ii + 1
                                        );
                                      }
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {
                                      this.FocusTrRowFields(
                                        "particulars",
                                        ii - 1
                                      );
                                      // console.warn("Up");
                                    }
                                  }}
                                // readOnly={true}
                                />
                              </td>
                              {/* {JSON.stringify(rows[ii]["perticulars"]["ledger_name"]) !== "" ? "ifffff" : ""} */}
                              <td
                                style={{
                                  width: "10%",
                                }}
                              >
                                <Form.Control
                                  id={`payment-debit-${ii}`}
                                  name={`payment-debit-${ii}`}
                                  className="table-text-box border-0"
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleChangeArrayElement(
                                      "debit",
                                      v,
                                      ii
                                    );
                                  }}
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     !e.target.value.trim()
                                  //   )
                                  //     e.preventDefault();
                                  // }}
                                  onBlur={(e) => {
                                    this.handleCreditdebitBalance(ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("debit", ii)}
                                  readOnly={
                                    this.setElementValue("type", ii) == "dr"
                                      ? false
                                      : true
                                  }
                                  disabled={
                                    this.setElementValue("type", ii) == "dr"
                                      ? false
                                      : true
                                  }
                                />
                              </td>
                              <td
                                style={{
                                  width: "10%",
                                }}
                              >
                                <Form.Control
                                  type="text"
                                  id={`payment-credit-${ii}`}
                                  name={`payment-credit-${ii}`}
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleChangeArrayElement(
                                      "credit",
                                      v,
                                      ii
                                    );
                                  }}
                                  className="table-text-box border-0"

                                  //@shubh keydown imple for enter key and tab key
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13 || e.keyCode === 9) {
                                      this.handleCreditdebitBalance(e, ii);
                                    }
                                  }}
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab"
                                  //   ) {
                                  //       document.getElementById("narration").focus();
                                  //   }
                                  //   e.preventDefault();
                                  // }}

                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     !e.target.value.trim()
                                  //   ) {
                                  //     e.preventDefault();
                                  //   }
                                  // }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("credit", ii)}
                                  readOnly={
                                    this.setElementValue("type", ii) == "cr"
                                      ? false
                                      : true
                                  }
                                  disabled={
                                    this.setElementValue("type", ii) == "cr"
                                      ? false
                                      : true
                                  }
                                />
                              </td>
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
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      Total:
                    </td>
                    <td
                      style={{
                        width: "70%",
                        textAlign: "end",
                      }}
                    ></td>

                    <td
                      style={{
                        width: "10%",
                      }}
                      className="qtotalqty"
                    >
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
                    <td
                      style={{
                        width: "10%",
                      }}
                      className="qtotalqty"
                    >
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
                  <Row>
                    <Col lg="8">
                      <Row className="accountentry-description-style">
                        <Col
                          lg={3}
                          style={{ borderRight: "1px solid #EAD8B1" }}
                        >
                          <p className="title-style mb-0">Ledger Info:</p>

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
                        </Col>
                        <Col
                          lg={3}
                          style={{ borderRight: "1px solid #EAD8B1" }}
                        >
                          <div className="d-flex">
                            <span className="span-lable">Contact Person :</span>
                            <span className="span-value">
                              &nbsp;&nbsp;
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
                            <span className="span-lable">Credit Days :</span>
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
                            <span className="span-lable">Lisence No :</span>
                            <span className="span-value">
                              &nbsp;&nbsp;
                              {ledgerData.license_number}
                            </span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">Route :</span>
                            <span className="span-value">
                              &nbsp;&nbsp;
                              {ledgerData.route}
                              {/* {product_hover_details.tax_type} */}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="4">
                      <Row className="accountentry-description-style">
                        {/* {JSON.stringify(bankData)} */}
                        <Col
                          lg="6"
                          style={{ borderRight: "1px solid #EAD8B1" }}
                        >
                          <p className="title-style mb-0">Bank Info:</p>
                          <div className="d-flex">
                            <span className="span-lable">Payment Mode :</span>
                            <span className="span-value">
                              &nbsp;&nbsp;
                              {bankData.bank_payment_type}
                            </span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">
                              Cheque/DD/Receipt :
                            </span>
                            <span className="span-value">
                              &nbsp;&nbsp;
                              {bankData.bank_payment_no}
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
                              &nbsp;&nbsp;
                              {bankData.bank_name}
                            </span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">Payment Date :</span>
                            <span className="span-value">
                              &nbsp;&nbsp;
                              {bankData.payment_date}
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
                            placeholder="Enter Narration"
                            // style={{ height: "72px", resize: "none" }}
                            className="text-box"
                            autoComplete="true"
                            id="narration"
                            type="text"
                            onChange={handleChange}
                            // rows={5}
                            // cols={25}
                            name="narration"
                            value={values.narration}
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
                              </tr>
                            </thead>
                            <tbody>
                              {/* {JSON.stringify(selectedBillsData)} */}
                              {selectedBillsData.length > 0 ? (
                                selectedBillsData.map((v, i) => {
                                  if (
                                    v.source == "pur_invoice" ||
                                    v.source == "opening_balance" ||
                                    v.source == "debit_note"
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
                                  //       <td>{v.debit_note_no}</td>
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
                                eventBus.dispatch("page_change", {
                                  from: "voucher_payment",
                                  to: "voucher_paymentlist",
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
                      // onKeyDown={(e) => {
                      //   if (e.keyCode === 32) {
                      //     e.preventDefault();
                      //   } else if (e.keyCode === 13) {
                      //     MyNotifications.fire(
                      //       {
                      //         show: true,
                      //         icon: "confirm",
                      //         title: "Confirm",
                      //         msg: "Do you want to Cancel",
                      //         is_button_show: false,
                      //         is_timeout: false,
                      //         delay: 0,
                      //         handleSuccessFn: () => {
                      //           eventBus.dispatch("page_change", {
                      //             from: "voucher_payment",
                      //             to: "voucher_paymentlist",
                      //             isNewTab: false,
                      //             isCancel: true,
                      //           });
                      //         },
                      //         handleFailFn: () => {},
                      //       },
                      //       () => {
                      //         console.warn("return_data");
                      //       }
                      //     );
                      //   }
                      // }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </div>
                <Row className="mx-0 btm-rows-btn1">
                  {/* <Col md="2" className="px-0">
                    <Form.Label className="btm-label">
                      <img src={keyboard} className="svg-style mt-0 mx-2"></img>
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
              </Form>
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
                      this.setState({
                        billadjusmentmodalshow: false,
                        payableAmt: 0,
                        selectedAmt: 0,
                      })
                    }
                  />
                </Col>
              </Row>

              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                innerRef={this.ref}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {

                  let selectedAmount = document.getElementById("selectedAmt");
                  if (this.state.selectedBills.length === 0) {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: "Please Select Invoice",
                      is_button_show: true,
                    });
                    return false
                  }
                  // else if (selectedAmount.value != values.payableAmt) {
                  //   MyNotifications.fire({
                  //     show: true,
                  //     icon: "error",
                  //     title: "Error",
                  //     msg: "Payable Amt and selected Amt are not equal",
                  //     is_button_show: true,
                  //   });
                  //   return false
                  // } 
                  else {
                    this.setState(
                      {
                        paidAmount: values.paid_amt,
                        totalDebitAmt: 0,
                        selectedAmt: this.finalBillSelectedAmt(),
                        payableAmt: values.payableAmt,
                        remainingAmt: this.finalRemaningSelectedAmt(),
                      },
                      () => {
                        this.handleBillByBillSubmit(values);
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
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    className="frm-accountentry"
                  >
                    <div className="p-2" style={{ background: "#E6F2F8" }}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={5}>
                              <Form.Label>Payable Amt</Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Payable Amt."
                                  name="payableAmt"
                                  id="payableAmt"
                                  disabled={this.state.pblAmtDisable}
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
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      remainingAmt:
                                        this.finalRemaningSelectedAmt(),
                                    });
                                  }}
                                  autoFocus={true}
                                  className="bill-text"
                                  value={values.payableAmt === 0 ? "" : values.payableAmt}
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
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    setFieldValue("selectedAmt", v);
                                    if (v != "") {
                                      this.setState({ selectedAmt: v });
                                    }
                                  }}
                                  className="bill-text text-end"
                                  value={this.finalBillSelectedAmt() === 0 ? "" : this.finalBillSelectedAmt()}
                                  isValid={
                                    touched.selectedAmt && !errors.selectedAmt
                                  }
                                  disabled
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
                              <Form.Label>Remaining Amt</Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Payable Amt."
                                  name="remainingAmt"
                                  id="remainingAmt"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    if (v != "") {
                                      this.setState({ remainingAmt: v });
                                    }
                                  }}
                                  disabled
                                  // value={values.remainingAmt}
                                  value={this.finalRemaningSelectedAmt() === 0 ? "" : this.finalRemaningSelectedAmt()}
                                  isValid={
                                    touched.remainingAmt && !errors.remainingAmt
                                  }
                                  className="bill-text text-end"
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
                          <Form.Group className="checkboxstyle">
                            <Form.Check
                              type="checkbox"
                              id="isAdvanceCheck"
                              name="isAdvanceCheck"
                              label="Advance Amt."
                              checked={isAdvanceCheck === true ? true : false}
                              // checked={isAdvanceCheck}
                              value={isAdvanceCheck}
                              // onChange={(e) => {
                              //   const checked = e.target.checked;
                              //   this.handleAdvaceCheck(checked);
                              // }}
                              onClick={(e) => {
                                // console.log("e=======:::::", e.target.checked);
                                this.handleAdvaceCheck(e.target.checked);
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
                    <>
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
                                      innerRef={(input) => {
                                        this.invoiceDateRef.current = input;
                                      }}
                                      className="form-control"
                                      name="d_start_date"
                                      id="d_start_date"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.d_start_date}
                                      onChange={handleChange}
                                      onBlur={(e) => {
                                        // console.log("e ", e);
                                        // console.log(
                                        //   "e.target.value ",
                                        //   e.target.value
                                        // );
                                        // debugger
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          // console.warn(
                                          //   "warn:: isValid",
                                          //   moment(
                                          //     e.target.value,
                                          //     "DD-MM-YYYY"
                                          //   ).isValid()
                                          // );
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            setFieldValue(
                                              "d_start_date",
                                              e.target.value
                                            );
                                            this.setState(
                                              { startDate: e.target.value },
                                              // () => {
                                              //   this.FetchPendingBillsFilterWise();
                                              // }
                                            );
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid Start date",
                                              is_button_show: true,
                                            });
                                            this.invoiceDateRef.current.focus();
                                            setFieldValue("d_start_date", "");
                                            this.setState(
                                              { startDate: e.target.value },
                                              // () => {
                                              //   this.FetchPendingBillsFilterWise();
                                              // }
                                            );
                                          }
                                        } else {
                                          setFieldValue("d_start_date", "");
                                          this.setState(
                                            { startDate: e.target.value },
                                            // () => {
                                            //   this.FetchPendingBillsFilterWise();
                                            // }
                                          );
                                        }
                                      }}
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
                                      innerRef={(input) => {
                                        this.invoiceDateRef.current = input;
                                      }}
                                      className="form-control"
                                      name="d_end_date"
                                      id="d_end_date"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.d_end_date}
                                      onChange={handleChange}
                                      onFocus={() => {
                                        this.setState({ hideDp: true });
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
                                            setFieldValue(
                                              "d_end_date",
                                              e.target.value
                                            );
                                            // this.getlstLedgerTranxDetailsReportsPageLoad(
                                            //   values
                                            // );
                                            this.setState(
                                              { endDate: e.target.value },
                                              // () => {
                                              //   this.FetchPendingBillsFilterWise();
                                              // }
                                            );
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid End date",
                                              is_button_show: true,
                                            });
                                            this.invoiceDateRef.current.focus();
                                            setFieldValue("d_end_date", "");
                                            this.setState(
                                              { endDate: e.target.value },
                                              // () => {
                                              //   this.FetchPendingBillsFilterWise();
                                              // }
                                            );
                                          }
                                        } else {
                                          setFieldValue("d_end_date", "");
                                          // this.lstPurchaseInvoice();
                                          this.setState(
                                            { endDate: e.target.value },
                                            // () => {
                                            //   this.FetchPendingBillsFilterWise();
                                            // }
                                          );
                                        }
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={6}>
                                    <Button
                                      className="applybtn"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        this.FetchPendingBillsFilterWise();
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.FetchPendingBillsFilterWise();
                                        }
                                      }}

                                    >Apply</Button>
                                  </Col>
                                  <Col lg={6} className="text-center px-0">
                                    <Form.Label>Clear</Form.Label>

                                    <img
                                      src={close_grey_icon}
                                      className="filterimg ms-2"
                                      onClick={() =>
                                        this.setState(
                                          { filterOpen: false },
                                          () => {
                                            this.dateFilter();
                                          }
                                        )
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </>
                    <div className="bill-main">
                      {openingListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="ps-3">
                              <p className="tilte-name">Opening Balance :</p>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>

                          <div>
                            {/* {JSON.stringify(billLst)} */}
                            {billLst.length > 0 && (
                              <div className="billByBilltable">
                                <Table>
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        <Form.Group>
                                          <Form.Check
                                            type="checkbox"
                                            className="checkboxstyle"
                                            // label="Invoice No."
                                            checked={
                                              isAllCheckedOpening === true
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              let source = "openingList";
                                              this.handleBillsSelectionOpeningAll(
                                                e.target.checked,
                                                source
                                              );
                                            }}
                                            style={{ verticalAlign: "middle" }}
                                          // disabled={
                                          //   parseInt(values.payableAmt) ==
                                          //     this.finalBillSelectedAmt() &&
                                          //   selectedBills.includes(
                                          //     vi.invoice_id
                                          //   ) != true
                                          //     ? true
                                          //     : false
                                          // }
                                          />
                                        </Form.Group>
                                      </th>
                                      <th> Invoice No.</th>
                                      <th> Invoice Amt.</th>
                                      <th style={{ width: "2%" }}>Type</th>
                                      <th> Bill Date</th>
                                      <th className=" text-center">Balance</th>
                                      {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                  {/* {JSON.stringify(billLst)} */}
                                  <tbody>
                                    {billLst.map((vi, ii) => {
                                      if (vi.source == "opening_balance") {
                                        return (
                                          <tr>
                                            <td
                                              className="text-center"
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              <Form.Group>
                                                <Form.Check
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_unique_id}
                                                  checked={selectedBills.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onChange={(e) => {
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
                                                // disabled={this.checkboxDisable()}
                                                />
                                              </Form.Group>
                                            </td>
                                            <td>{vi.invoice_no}</td>
                                            <td>
                                              {parseFloat(vi.total_amt).toFixed(
                                                2
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {vi.balancing_type}
                                            </td>{" "}
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
                                            {/* <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {parseInt(vi.invoice_no) > 0
                                                ? "Cr"
                                                : "Dr"}
                                            </td> */}
                                            {/* <td></td> */}
                                            <td></td>
                                            <td>{vi.due_days}</td>
                                            <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {/* {vi.paid_amt} */}
                                              <Form.Control
                                                type="text"
                                                onChange={(e) => {
                                                  e.preventDefault();
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
                                                //   !selectedBills.includes(vi.invoice_no)
                                                // }
                                                style={{
                                                  borderRadius: "0px",
                                                }}
                                              />
                                            </td>
                                            <td className="text-end p-2">
                                              {parseFloat(vi.remaining_amt)
                                                ? vi.remaining_amt.toFixed(2)
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
                                      <th colSpan={3}>
                                        {this.finalBalanceOpeningAmt().toFixed(
                                          2
                                        )}
                                      </th>

                                      <th className="text-end">
                                        {this.finalBillOpeningAmt().toFixed(2)}
                                      </th>
                                      <th className="text-end">
                                        {this.finalRemaningOpeningAmt().toFixed(
                                          2
                                        )}
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
                            <Table className="mb-0"></Table>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {invoiceListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="ps-3">
                              <p className="tilte-name">Invoice List :</p>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>
                          {/* {JSON.stringify(billLst)} */}
                          <div>
                            {billLst.length > 0 && (
                              <div className="billByBilltable">
                                <Table>
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        <Form.Group>
                                          <Form.Check
                                            type="checkbox"
                                            className="checkboxstyle"
                                            // label="Invoice No."
                                            checked={
                                              isAllChecked === true
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              // let source = "invoiceList"
                                              this.handleBillsSelectionInvoiceAll(
                                                e.target.checked
                                              );
                                            }}
                                            style={{ verticalAlign: "middle" }}
                                          // disabled={
                                          //   parseInt(values.payableAmt) ==
                                          //     this.finalBillSelectedAmt() &&
                                          //   selectedBills.includes(
                                          //    vi.invoice_id
                                          //   ) != true
                                          //     ? true
                                          //     : false
                                          // }
                                          />
                                        </Form.Group>
                                      </th>
                                      <th> Invoice No.</th>
                                      <th> Invoice Amt.</th>
                                      <th style={{ width: "2%" }}>Type</th>
                                      <th> Bill Date</th>
                                      <th className=" text-center">Balance</th>
                                      {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                      if (vi.source == "pur_invoice") {
                                        return (
                                          <tr>
                                            <td
                                              className="text-center"
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              <Form.Group>
                                                <Form.Check
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_unique_id}
                                                  checked={selectedBills.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onChange={(e) => {
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
                                                // disabled={this.checkboxDisable()}
                                                />
                                              </Form.Group>
                                            </td>
                                            <td>{vi.invoice_no}</td>
                                            <td>
                                              {parseFloat(vi.total_amt).toFixed(
                                                2
                                              )}
                                            </td>
                                            <td
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
                                            {/* <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {parseInt(vi.invoice_no) > 0
                                                ? "Cr"
                                                : "Dr"}
                                            </td> */}
                                            <td></td>
                                            <td>{vi.due_days}</td>
                                            <td
                                              style={{
                                                borderRight:
                                                  "1px solid #d9d9d9",
                                              }}
                                            >
                                              {/* {JSON.stringify(vi)} */}
                                              <Form.Control
                                                type="text"
                                                onChange={(e) => {
                                                  e.preventDefault();

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
                                                className="bill-text text-end border-0"
                                                // readOnly={
                                                //   !selectedBills.includes(vi.invoice_no)
                                                // }
                                                style={{
                                                  borderRadius: "0px",
                                                }}
                                              />
                                            </td>
                                            <td className="text-end p-2">
                                              {parseFloat(vi.remaining_amt)
                                                ? vi.remaining_amt.toFixed(2)
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
                                      <th colSpan={3}>
                                        {this.finalBalanceInvoiceAmt().toFixed(
                                          2
                                        )}
                                      </th>

                                      <th className="text-end">
                                        {this.finalBillInvoiceAmt().toFixed(2)}
                                      </th>
                                      <th className="text-end">
                                        {this.finalRemaningInvoiceAmt().toFixed(
                                          2
                                        )}
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

                      {debitListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="ps-3">
                              <p className="tilte-name">Debit Note :</p>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>
                          <div>
                            <div className="billByBilltable ">
                              <Table className="mb-2">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      <Form.Group>
                                        <Form.Check
                                          // label="Debit Note No."
                                          type="checkbox"
                                          checked={
                                            isAllCheckeddebit === true
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            // let source = "debitList"
                                            this.handleBillsSelectionDebitAll(
                                              e.target.checked
                                            );
                                          }}
                                          className="checkboxstyle"
                                        />
                                      </Form.Group>
                                    </th>
                                    <th> Invoice No.</th>
                                    <th> Invoice Amt.</th>
                                    <th style={{ width: "2%" }}>Type</th>
                                    <th> Bill Date</th>
                                    <th className=" text-center">Balance</th>
                                    {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                    if (vi.source == "debit_note") {
                                      return (
                                        <tr>
                                          <td
                                            className="text-center"
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            <Form.Group>
                                              <Form.Check
                                                type="checkbox"
                                                // label={vi.debit_note_no}
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
                                              />
                                            </Form.Group>
                                          </td>
                                          <td>{vi.invoice_no}</td>
                                          <td>
                                            {parseFloat(vi.total_amt).toFixed(
                                              2
                                            )}
                                          </td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {/* {parseInt(vi.invoice_id) > 0
                                              ? "Dr"
                                              : "Cr"} */}
                                            {vi.balancing_type}
                                          </td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                            className="pe-2"
                                          >
                                            {moment(vi.invoice_date).format(
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {parseFloat(vi.amount).toFixed(2)}
                                          </td>
                                          {/* <td></td> */}
                                          <td></td>
                                          <td></td>
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {/* {vi.paid_amt} */}
                                            <Form.Control
                                              type="text"
                                              onChange={(e) => {
                                                e.preventDefault();

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
                                              className="bill-text text-end border-0"
                                              readOnly={
                                                !selectedBills.includes(
                                                  vi.invoice_no
                                                )
                                              }
                                              style={{
                                                borderRadius: "0px",
                                              }}
                                            />
                                          </td>

                                          <td className="text-end p-2">
                                            {parseFloat(vi.remaining_amt)
                                              ? vi.remaining_amt.toFixed(2)
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
                                    <th colSpan={3}>
                                      {this.finalBalanceDebitAmt().toFixed(2)}
                                    </th>

                                    <th className="text-end">
                                      {this.finalBillDebitAmt().toFixed(2)}
                                    </th>
                                    <th className="text-end">
                                      {this.finalRemaningDebitAmt().toFixed(2)}
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

                            <Table className="mb-0"></Table>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <Table className="mb-2">
                        <thead className="footertbl1">
                          <tr style={{ background: "#A0EFD2" }}>
                            <td colSpan={2} className="bb-t">
                              {" "}
                              <b>Grand Total</b>
                            </td>
                            {/* <td></td>
                        <td colSpan={2}></td> */}

                            <th style={{ width: "13%" }} className="text-end">
                              {this.finalBillAmt()}
                            </th>
                            {/* <th>{this.handleBillRemainingselection()}</th> */}
                            <th style={{ width: "10.8%" }} className="text-end">
                              {this.finalRemainingBillAmt}
                            </th>
                          </tr>
                        </thead>
                      </Table>
                    </div>
                    <Row
                      className="py-1"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                      }}
                    >
                      <Col className="text-end me-2">
                        <Button className="create-btn " type="submit">
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
        {/* Bill adjusment credit modal start */}
        <Modal
          show={billadjusmentCreditmodalshow}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ billadjusmentCreditmodalshow: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
        //centered
        >
          <Modal.Header
            closeButton
            closeVariant="white"
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
                  // console.log({ values });

                  this.handleBillByBillCreditSubmit(values);
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
                    {billLstSc.length > 0 && (
                      <div className="table_wrapper1">
                        <Row>
                          <Col md="5" className="mb-2">
                            <h6>
                              <b>Credit Note : </b>
                            </h6>
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
                                      isAllCheckedCredit === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAllCredit(
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
                                  Credit Note #.
                                </span>
                              </th>
                              <th> Credit Note Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>

                          <tbody>
                            {billLstSc.map((vi, ii) => {
                              if (vi.source == "credit_note") {
                                return (
                                  <tr>
                                    <td className="pt-1 p2-1 pl-1 pb-0">
                                      <Form.Group>
                                        <Form.Check
                                          type="checkbox"
                                          label={vi.credit_note_no}
                                          value={vi.credit_note_no}
                                          checked={selectedBillsCredit.includes(
                                            vi.credit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionCredit(
                                              vi.credit_note_no,
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
                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            ii
                                          );
                                        }}
                                        value={
                                          vi.credit_paid_amt
                                            ? vi.credit_paid_amt
                                            : 0
                                        }
                                        className="paidamttxt"
                                        readOnly={
                                          !selectedBillsCredit.includes(
                                            vi.credit_note_no
                                          )
                                        }
                                      //style={{ paddingTop: "0" }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(
                                        vi.credit_remaining_amt
                                      ).toFixed(2)
                                        ? vi.credit_remaining_amt
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
                              <td>
                                {billLstSc.length > 0 &&
                                  billLstSc.reduce(function (prev, next) {
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
                                {billLstSc.length > 0 &&
                                  billLstSc.reduce(function (prev, next) {
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
                    )}

                    <Button className="createbtn pull-right" type="submit">
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        {/* Bill adjusment credit modal end */}
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
        {/*  On Account payment- Cash Acc - Payable amount */}
        <Modal
          show={onaccountcashaccmodal}
          size="lg"
          className="mt-5"
          onHide={() => this.setState({ onaccountcashaccmodal: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              On Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="institute-head purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.handleOnAccountCashAccSubmit(values);
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
                      {/* {accountLst.map((v, i) => {
                        return (
                          
                        );
                      })} */}
                      <Col md="3">
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
                      <Col md="2">
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
        {/* On Account payment- Cash Acc - Payable amount */}
        {/*  On Account payment- Bank Acc - Payable amount */}
        <Modal
          show={bankaccmodal}
          size="xl"
          className="transaction_mdl invoice-mdl-style"
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
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal pt-0">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={this.getElementObject(this.state.index)}
              // validationSchema={Yup.object().shape({
              //   bank_payment_type: Yup.object().required("Select type"),
              //   bank_payment_no: Yup.string().required("No is required"),
              //   // paid_amt: Yup.string().required('Amt is required'),
              // })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("values===>>>", values);

                let errorArray = [];
                if (values.bank_payment_type == "") {
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
                    this.handleBankAccountCashAccSubmit(values);
                    // this.ledgerModalFun(false);
                    // this.state({ ledgerModalFun: false });
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
                <Form onSubmit={handleSubmit} noValidate className="pt-0 ">
                  {/* {JSON.stringify(values)} */}
                  <Row
                    style={{ backgroundColor: "#E6f2f8", padding: "5px" }}
                    className="mb-2"
                  >
                    <Col lg={3}>
                      <Row>
                        <Col lg={5}>
                          <Form.Label>Payment Mode</Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Group
                            className={`${values.bank_payment_type == "" &&
                              errorArrayBorderBank[0] == "Y"
                              ? "border border-danger "
                              : ""
                              }`}
                            style={{ borderRadius: "4px" }}
                          >
                            <Select
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
                              autoFocus={true}
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
                              >
                                <Select
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
                                  className="text-box"
                                  // className={`${values.bank_payment_no == "" &&
                                  //   errorArrayBorder[0] == "Y"
                                  //   ? "border border-danger  text-box"
                                  //   : "text-box"
                                  //   }`}
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
                                      className="text-box"
                                      // className={`${values.bank_payment_no == "" &&
                                      //   errorArrayBorder[0] == "Y"
                                      //   ? "border border-danger  text-box"
                                      //   : "text-box"
                                      //   }`}
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
                          <Form.Label className="mb-1">Payment Date</Form.Label>
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
                              // className={`${errorArrayBorder[0] == "Y"
                              //   ? "border border-danger accountentry-date-style form-control"
                              //   : "accountentry-date-style form-control"
                              //   }`}
                              onChange={handleChange}
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
                            //         document
                            //           .getElementById("payment_date")
                            //           .focus();
                            //       }, 1000);
                            //     }
                            //   } else if (e.key === "Tab") {
                            //     let datchco = e.target.value.trim();
                            //     // console.log("datchco", datchco);
                            //     let checkdate = moment(e.target.value).format(
                            //       "DD/MM/YYYY"
                            //     );
                            //     console.log("checkdate", checkdate);
                            //     if (
                            //       datchco != "__/__/____" &&
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
                            //         document
                            //           .getElementById("payment_date")
                            //           .focus();
                            //       }, 1000);
                            //     }
                            //   }
                            // }}
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              {errors.bank_payment_no}
                            </Form.Control.Feedback> */}
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col className="text-end">
                      <Button className="successbtn-style" type="submit">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* On Account payment- Bank Acc - Payable amount */}
        {/* ledger Modal */}
        {/* @neha @added refrence*/}
        {ledgerModal ? (
          <Row className="justify-content-end" ref={this.ledgerModalRef}>
            <div className="ledger-table-popup-voucher ps-0">
              <Row style={{ background: "#D9F0FB" }} className="ms-0">
                <Col lg={6}>
                  {/* {JSON.stringify(selectedAll)} */}
                  {/* <h6 className="table-header-ledger my-auto">Ledger</h6> */}
                  <Form.Check
                    // label={"Creditor"}
                    label={ledgerType === "SD" ? "Debitor" : "Creditor"}
                    // label={isChecked === true ? "Creditor" : "Debitor"}
                    type="switch"
                    // className="ms-1"
                    // onClick={this.handleLstChange}
                    onChange={(e) => {
                      let val = e.target.checked;

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
                      display: objCR && objCR.type == "dr" ? "block" : "none",
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
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "voucher_payment",
                                    opType: opType,
                                    sourceUnder: sourceUnder,
                                    rowIndex: rowIndex,
                                  };
                                  eventBus.dispatch("page_change", {
                                    from: "voucher_payment",
                                    to: "ledgercreate",
                                    // prop_data: data,
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
                            // onKeyDown={(e) => {
                            //   if (e.keyCode === 40) {
                            //     document
                            //       .getElementById("productTr_0")
                            //       .focus();
                            //   }
                            // }}
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
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="prouctTableTr">
                    {objCR && objCR.type == "dr" ? (
                      <>
                        {ledgerList.map((v, i) => {
                          return (
                            <tr
                              // value={JSON.stringify(v)}
                              // id={`productTr_` + i}
                              id={`payment-ledger-${i}`}
                              // prId={v.id}
                              tabIndex={i}
                              className={`${i == selectedLedgerIndex
                                ? "payment-ledger-selected-tr"
                                : ""
                                }`}
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
                              // onKeyDown={(e) => {
                              //   e.preventDefault();
                              //   console.log("ledger keydown table", e);
                              //   if (e.keyCode === 13) {
                              //     this.setState(
                              //       {
                              //         ledgerModal: false,
                              //         selectedLedger: v,
                              //         selectedLedgerId: v.id,
                              //       },
                              //       () => {
                              //         this.handleChangeArrayElement(
                              //           "perticulars",
                              //           v,
                              //           rowIndex
                              //         );

                              //         this.handleBillByBill(
                              //           "debit",
                              //           v,
                              //           rowIndex
                              //         );
                              //         this.transaction_ledger_listFun();
                              //       }
                              //     );
                              //   }
                              // }}
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
                              <td className="ps-3">
                                {v.type === "SD"
                                  ? "Debitor"
                                  : v.type === "SC"
                                    ? "Creditor"
                                    : v.type}
                              </td>
                              <td className="ps-3">{v.city}</td>
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
                                        from_page: "voucher_payment",
                                        opType: opType
                                      };

                                      let data = {
                                        source: source,
                                        id: v.id,
                                      };

                                      eventBus.dispatch("page_change", {
                                        from: "voucher_payment",
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
                      </>
                    ) : (
                      <>
                        {cashAcbankLst.map((v, i) => {
                          return (
                            <tr
                              // value={JSON.stringify(v)}
                              id={`payment-ledger-cashac-${i}`}
                              // prId={v.id}
                              tabIndex={i}
                              className={`${i == selectedLedgerIndex
                                ? "payment-ledger-selected-tr"
                                : ""
                                }`}
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
                                    this.setState({
                                      bankaccmodal: true,
                                    });
                                  }
                                });
                              }}
                              // onKeyDown={(e) => {
                              //   e.preventDefault();
                              //   if (e.keyCode === 13) {
                              //     this.handleChangeArrayElement(
                              //       "perticulars",
                              //       v,
                              //       rowIndex
                              //     );
                              //     this.setState({ ledgerModal: false }, () => {
                              //       if (v.type == "bank_account") {
                              //         this.OutletBankMasterList();
                              //         this.setState({
                              //           bankaccmodal: true,
                              //           rows: rows,
                              //         });
                              //       }
                              //     });
                              //   }
                              //   rows[rowIndex]["perticulars"] = v.ledger_name;
                              // }}
                              onClick={(e) => {
                                e.preventDefault();

                                rows[rowIndex]["perticulars"] = v.ledger_name;

                                this.setState(
                                  { selectedLedger: v, selectedLedgerIndex: i }
                                  // () => {
                                  //   this.transaction_ledger_detailsFun(v.id);
                                  // }
                                );
                              }}
                            >
                              {/* {JSON.stringify(v)} */}
                              <td className="ps-3">{v.code}</td>
                              <td className="ps-3">{v.ledger_name}</td>
                              <td className="ps-3">{v.city}</td>
                              <td className="ps-3">{v.contact_number}</td>
                              <td className="ps-3">{v.contact_number}</td>
                              <td className="ps-3 text-end">
                                {v.current_balance}
                              </td>
                              <td className="ps-3">
                                {v.ledger_type.toUpperCase()}{" "}
                              </td>
                              {/* <td className="ps-3">{v.type}</td> */}

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
                                        from_page: "voucher_payment",
                                      };

                                      let data = {
                                        source: source,
                                        id: v.id,
                                      };

                                      eventBus.dispatch("page_change", {
                                        from: "voucher_payment",
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
