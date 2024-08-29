import React from "react";
import ReactDOM from "react-dom";
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
// import TRowComponent from '../Tranx/Components/TRowComponent';
import moment from "moment";
import Select from "react-select";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import delete_icon from "@/assets/images/delete_icon 3.png";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import Frame from "@/assets/images/Frame.png";
import close_grey_icon from "@/assets/images/close_grey_icon.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import Filter_img from "@/assets/images/Filter_img.png";
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
  create_credit,
  getLedgers,
  getTranxCreditNoteLastRecord,
  get_credit_note_by_id,
  update_credit_note,
  transaction_ledger_details,
  transaction_ledger_list,
  getdebtorspendingbills,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  MyNotifications,
  isActionExist,
  allEqual,
  MyTextDatePicker,
  convertToSlug,
  getValue,
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    fontSize: "13px",
    border: "none",
    padding: "0 6px",
    fontFamily: "Inter",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};

const BankOpt = [
  { label: "Cheque / DD", value: "cheque-dd" },
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Others", value: "others" },
];

const selectOpt = [
  { label: "Dr", value: "dr" },
  { label: "Cr", value: "cr" },
];
export default class VoucherCreditEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ref = React.createRef();
    this.typeRef = React.createRef();
    this.ledgerModalRef = React.createRef();

    this.state = {
      rowIndex: -1,
      pblAmtDisable: false,
      filterOpen: false,
      bankaccmodal: false,
      isEditDataSet: false,
      ledgersLst: [],
      rows: [],

      ledgerModal: false,
      ledgerData: "",
      ledgerList: [],
      objCR: "",
      billadjusmentmodalshow: false,
      creditNoteEditData: "",
      errorArrayBorder: "",
      initVal: {
        voucher_debit_sr_no: 1,
        voucher_debit_no: 1,
        transaction_dt: moment().format("DD-MM-YYYY"),
      },
      sourceUnder: "receipt",
      from_source: "voucher_credit_note_edit",
      opType: "edit",
      isPropDataSet: false,
      filterOpen: false,
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
      objCR: "",
      ledgerList: [],
      selectedLedger: "",
      isAdvanceCheck: false,
      billLst: [],
      selectedBills: [],
      isAllChecked: false,
      isAllCheckeddebit: false,
      selectedLedgerIndex: 0,
    };
  }

  getTranxCreditNoteLastRecordFun = () => {
    getTranxCreditNoteLastRecord()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let lastRow = res.response;
          let initVal = {
            voucher_credit_sr_no: res.count,
            voucher_credit_no: res.creditnoteNo,
            transaction_dt: moment().format("DD-MM-YYYY"),
          };
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  //   getlstLedgerdetails = () => {
  //     getLedgers()
  //       .then((response) => {
  //         let res = response.data ? response.data : [];
  //         let resLst = [];

  //         if (res.responseStatus == 200) {
  //           if (res.list.length > 0) {
  //             res.list.map((v) => {
  //               let innerrow = {
  //                 id: v.id,
  //                 type: v.type,
  //                 value: v.id,
  //                 label: v.name,
  //               };
  //               resLst.push(innerrow);
  //             });
  //           }
  //           this.setState({ ledgersLst: resLst });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('error', error);
  //       });
  //   };

  //   getlstLedger = () => {
  //     getLedgers()
  //       .then((response) => {
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           this.setState({ lstLedger: res.responseList }, () => {
  //             this.getFilterLstLedger();
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         ShowNotification('Error', 'Unable to connect the server');
  //       });
  //   };
  //   getFilterLstLedger = () => {
  //     let { isLedgerFilterd, lstLedger } = this.state;

  //     if (lstLedger.length > 0) {
  //       let filterLst = lstLedger;
  //       if (isLedgerFilterd) {
  //         filterLst = filterLst.filter(
  //           (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
  //         );
  //       }
  //       this.setState({ ledgersLst: filterLst });
  //     }
  //   };

  getlstLedger = () => {
    getLedgers().then((response) => {
      let res = response.data;
      if (res.responseStatus == 200) {
        let d = res.responseList;
        let Opt = d.map((v, i) => {
          let innerOpt = {};
          if (v.subprinciple_name != "") {
            innerOpt["value"] = v.id;
            // innerOpt['value'] = v.principle_id + '_' + v.sub_principle_id;
            innerOpt["ledger_name"] = v.ledger_name;
            // innerOpt['ledger_name'] = v.ledger_name;
            innerOpt["ledger_form_parameter_slug"] =
              v.ledger_form_parameter_slug;
            // innerOpt['principle_id'] = v.principle_id;
            innerOpt["principle_name"] = v.principle_name;
            innerOpt["sub_principle_id"] = v.sub_principle_id;
            innerOpt["subprinciple_name"] = v.subprinciple_name;
            // innerOpt['under_prefix'] = v.under_prefix;
            // innerOpt['associates_id'] = v.associates_id;
            // innerOpt['associates_name'] = v.associates_name;
          } else {
            // innerOpt['value'] = v.principle_id;
            innerOpt["value"] = v.id;
            innerOpt["ledger_name"] = v.ledger_name;
            // innerOpt['ledger_form_parameter_id'] = v.ledger_form_parameter_id;
            innerOpt["ledger_form_parameter_slug"] =
              v.ledger_form_parameter_slug;
            innerOpt["ledger_name"] = v.ledger_name;
            innerOpt["principle_id"] = v.principle_id;
            innerOpt["principle_name"] = v.principle_name;
            innerOpt["sub_principle_id"] = v.sub_principle_id;
            innerOpt["subprinciple_name"] = v.subprinciple_name;
            innerOpt["under_prefix"] = v.under_prefix;
            innerOpt["associates_id"] = v.associates_id;
            innerOpt["associates_name"] = v.associates_name;
          }
          return innerOpt;
        });

        console.log({ Opt });
        this.setState({ ledgersLst: Opt });
      }
    });
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
        narration: "",
      };
      // if (index == 0) {
      //   innerrow['type'] = 'cr';
      // }
      rows.push(innerrow);
    }
    this.setState({ rows: rows });
  };

  handleClear = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      perticulars: "",
      paid_amt: "",
      debit: "",
      credit: "",
      type: "dr",
    };
    frows[index] = data;
    console.log("frows", { frows });
    this.setState({ rows: frows });
  };

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
    console.log({ element, value, index });
    let { rows } = this.state;
    let debitamt = 0;
    let creditamt = 0;
    console.log("rows", rows);
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
          console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          console.log("cr value", value);
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

    console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    // let lastCrBal = debitBal;
    console.log("lastCrBal ", lastCrBal);
    console.log("frows", { frows });

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      console.log("obj======>>>>>>>>", obj);
      if (obj.type == "cr") {
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancingMethod
        );
      } else if (obj.type == "dr") {
        console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
            vi["credit"] = lastCrBal;
            vi["paid_amt"] = lastCrBal;

            console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    console.log("frows", { frows });
    this.setState({ rows: frows, index: index }, () => {
      this.FocusTrRowFieldsID(`receipt-edit-credit-${index}`);
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };
  handleBillPayableAmtChange = (value, index) => {
    console.log({ value, index });
    const { billLst, billLstSc } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "sales_invoice") {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "credit_note") {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      } else if (i == index && v.source == "opening_balance") {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
    // this.setState({ billLstSc: fDBilllst });
  };
  finalBillSelectedAmt = () => {
    const { billLst } = this.state;
    let amt = 0;
    let paidAmount = 0;
    // console.log("bill in selected final amt",{ billLst });
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
    // console.log("paidAmount in select::::::::", paidAmount);
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
    // console.log("debitPaidAmount::::::::", debitPaidAmount);

    amt = paidAmount - debitPaidAmount;
    // console.log("in else amt::::::::", amt);
    // }
    return amt;
  };
  finalBalanceOpeningAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });
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
    // console.log({ billLst });
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
    console.log({ billLst });
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
    console.log("paid in bill invoice", paidAmount);
    // if (advanceAmt != 0) {
    //   paidAmount = paidAmount + advanceAmt;
    //   console.log("paid in bill invoice in adv", paidAmount);
    // }

    return isNaN(paidAmount) ? 0 : paidAmount;
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
      console.log("paidAmt", paidAmt);
      console.log("selectedAmt", selectedAmt);
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
    console.log({ billLst, billLstSc });

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

    // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });
  };
  handleAdvaceCheck = (status) => {
    console.log("advanceAmt Status===:::", status);
    let { billLst, selectedBills, remainingAmt, uncheckRowData } = this.state;
    console.log("billLst, selectedBills, remainingAmt", {
      billLst,
      selectedBills,
      remainingAmt,
    });
    if (status == true) {
      // debugger;
      let advanceAmt = this.finalRemaningSelectedAmt();
      // let advanceAmt = remainingAmt;
      console.log("advance amt in check:::::", advanceAmt);
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
      console.log("selectedBills", selectedBills);
      let advance = billLst.find(
        (v) => v.invoice_no == convertToSlug("new-ref")
      );
      console.log("advance==>>>>>>>>>>", advance);
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
              selectedBills.includes(parseInt(v.invoice_unique_id))
          );
          // this.handleBillselection(obj.invoice_unique_id, 0, true);
        }
      );
    }
  };
  finalRemaningDebitAmt = () => {
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
  handleBillsSelectionOpeningAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      // console.log("All BillLst Selection", billLst);
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

      // console.log("fBills", fBills);
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
  filterData = (value, index) => {
    console.log("value in filter>>>>>>>>>>>>>>>", value);
    let { ledgerList, orgLedgerList } = this.state;
    console.log("productLst--", ledgerList);
    console.log("orgProductLst", orgLedgerList);
    let filterData = orgLedgerList.filter((v) =>
      v.ledger_name.toLowerCase().includes(value)
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      ledgerList: filterData.length > 0 ? filterData : [],
      ledgerModal: true,
      rowIndex: index,
    });
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
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "dr" && v["credit"] != "") {
        console.log("v", v);
        creditamt = parseFloat(creditamt) + parseFloat(v["paid_amt"]);
      }
    });
    console.log({ creditamt });
    return isNaN(creditamt) ? 0 : creditamt;
  };

  getElementObject = (index) => {
    console.log({ index });
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    console.log("elementCheck", elementCheck);
    return elementCheck ? elementCheck : "";
  };

  handleBankAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        // v['credit'] = v['paid_amt'];

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
        this.setState({ bankaccmodal: false, index: -1 });
      }
    );
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "voucher_credit_note_edit",
      to: "voucher_credit_List",
    });
  };

  ledgerModalFun = (status, index = -1) => {
    let { rows } = this.state;
    let obj = rows.find((v, i) => i == index);

    this.setState({
      ledgerData: "",
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
              ledger_name: v.ledger_name,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
            ledgersLst: codeopt,
            // ledgerList: res.list,
            ledgerList: codeopt,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {});
  };

  handlePropsData = (prop_data) => {
    let { ledgerList, ledgersLst } = this.state;
    if (prop_data.prop_data.invoice_data) {
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
          console.log("prop_data", prop_data);
          console.log("ledgerList", ledgersLst);
          console.log("ledgerID", parseInt(this.state.ledgerId));
          console.log(
            "ledgerobj",
            getSelectValue(ledgersLst, parseInt(this.state.ledgerId))
          );
          frows[prop_data.prop_data.rowIndex]["typeobj"] = getSelectValue(
            selectOpt,
            frows[prop_data.prop_data.rowIndex]["type"]
          );
          frows[prop_data.prop_data.rowIndex]["perticulars"] = getSelectValue(
            ledgerList,
            parseInt(this.state.ledgerId)
          )
            ? getSelectValue(ledgerList, parseInt(this.state.ledgerId))
            : "";
          this.setState(
            { rows: frows, isPropDataSet: false, prop_data: "" },
            () => {
              setTimeout(() => {
                if (prop_data != "") {
                  this.FocusTrRowFieldsID(
                    `perticulars-edt-${this.props.block.prop_data.prop_data.rowIndex}`
                  );
                } else {
                }
              }, 1000);

              console.log("prop_data", prop_data);
              console.log(
                "this.props.block.prop_data.rowIndex",
                prop_data.rowIndex
              );
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
      this.getTranxCreditNoteLastRecordFun();
      // this.getlstLedger();
      this.transaction_ledger_listFun();

      //   this.getlstLedgerdetails();
      // this.initRows();
      let { prop_data } = this.props.block;
      console.log("prop_data==---->", prop_data);
      this.setState({ creditNoteEditData: prop_data.prop_data, prop_data: prop_data, isPropDataSet: true }, () => {
        console.warn("prop_data", prop_data);

        // this.handlePropsData(prop_data); //@sapana @new Ledger creation redirected data props
      });
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      document.addEventListener("mousedown", this.handleClickOutside);
      // alt key button disabled end
    }
  }

  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.ledgerModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
      this.setState({ billadjusmentmodalshow: false })
    }
  };

  // alt key button disabled start
  // @mrunal @ On Escape key press and On outside Modal click Modal will Close
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  // alt key button disabled end
  // @mrunal @ On Escape key press Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
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
  componentDidUpdate() {
    const { isEditDataSet, creditNoteEditData, ledgersLst, isPropDataSet, prop_data } = this.state;
    console.log("setCreditEditData ", creditNoteEditData);

    if (
      isEditDataSet == false &&
      creditNoteEditData != "" &&
      ledgersLst.length > 0 &&
      creditNoteEditData.id != "" &&
      isPropDataSet == true &&
      prop_data != "" 
    ) {
      this.setCreditEditData();
      this.handlePropsData(prop_data);
    }
  }

  setCreditEditData = () => {
    const { id } = this.state.creditNoteEditData;
    let formData = new FormData();
    formData.append("credit_id", id);
    get_credit_note_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { credit_details } = res;
          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            lstAdditionalLedger,
            lstDisLedger,
            receiptEditData,
            sundryCreditorLst,
            cashAcbankLst,
            ledgersLst,
          } = this.state;
          console.log("ledgersLst", ledgersLst);

          this.myRef.current.setFieldValue(
            "voucher_credit_sr_no",
            res.credit_sr_no
          );

          this.myRef.current.setFieldValue("voucher_credit_no", res.credit_no);
          this.myRef.current.setFieldValue(
            "transaction_dt",
            moment(res.tranx_date).format("DD-MM-YYYY")
          );
          this.myRef.current.setFieldValue("total_amt", res.total_amount);

          this.myRef.current.setFieldValue("narration", res.narrations);

          // let initInvoiceData = {
          //   type: perticulars.type,
          //   ledger_type: perticulars.ledger_type,
          //   ledger_name: perticulars.ledger_name,
          //   paid_amt: perticulars.paid_amt,
          //   bank_payment_no: perticulars.bank_payment_no,
          //   bank_payment_type: perticulars.bank_payment_type,
          // };

          console.log("credit_details", credit_details);
          let initRowData = [];
          let billsdata = [];

          if (credit_details.length > 0) {
            credit_details.map((v) => {
              // ;
              console.log("==='''vvvv", v);
              let per = "";
              console.log("ledger_id", v.ledger_id);

              if (v.type != "") {
                per = getSelectValue(ledgersLst, v.ledger_id);
              }
              if (v.type === "cr") {
                console.log("per >>>>>", per, "v.type  ", v.type);
                console.log("v.bills >>>>>", v.bills, v.bills.length);
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
              // console.log("per", per);

              let inner_data = {
                details_id:
                  v.details_id && v.details_id != 0 ? v.details_id : 0,
                type: v.type && v.type != null ? v.type : "",
                perticulars: per,
                paid_amt: v.type == "cr" ? v.cr : v.dr,
                typeobj:
                  v.type && v.type != ""
                    ? getSelectValue(selectOpt, v.type)
                    : "",
                bank_payment_no:
                  v.paymentTranxNo && v.paymentTranxNo != null
                    ? v.paymentTranxNo
                    : "",
                bank_payment_type:
                  v.bank_payment_type && v.bank_payment_type != null
                    ? v.bank_payment_type
                    : "",
                bank_name:
                  v.ledger_name && v.ledger_name != null ? v.ledger_name : "",
                payment_date:
                  v.payment_date && v.payment_date != null
                    ? v.payment_date
                    : "",
                debit: v.type == "cr" ? v.cr : "",
                credit: v.type == "dr" ? v.dr : "",
                narration: "",
                isAdvanceCheck: per.isAdvanceCheck,
                payableAmt: per.payableAmt,
                remainingAmt: per.remainingAmt,
                selectedAmt: per.selectedAmt,
                balancingMethod:
                  per.balancingMethod && per.balancingMethod != ""
                    ? per.balancingMethod
                    : "",
              };

              initRowData.push(inner_data);
            });
          }
          console.log("Edit Row ==>", initRowData);

          this.setState({
            rows: initRowData,
            isEditDataSet: true,
            selectedLedger: credit_details,
            selectedBillsData: billsdata,
          });
        }
      })
      .catch((error) => {});
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
  handleCreditNoteTableRow(event) {
    let {
      rowIndex,
      rows,
      objCR,
      index,
      selectedLedgerIndex,
      ledgersLst,
      cashAcbankLst,
    } = this.state;
    console.log("objCR==>", objCR, rowIndex, selectedLedgerIndex);
    let currentR = rows[rowIndex];
    console.log("currentR-->", currentR);
    const k = event.keyCode;
    if (k == 13) {
      // console.log("enter work", selectedLedgerIndex, rowIndex);
      let obj = ledgersLst[selectedLedgerIndex];
      console.log("enter work---->", obj);
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
              this.setState(
                {
                  billadjusmentmodalshow: false,
                  index: -1,
                  // rows: [...this.state.rows, innerrow],
                },
                () => {
                  // console.log("row innerrow====", this.state.rows);
                  if (currentR && currentR["type"] == "dr") {
                    this.FocusTrRowFieldsID(`creditNote-credit-${rowIndex}`);
                  } else if (currentR && currentR["type"] == "cr") {
                    this.FocusTrRowFieldsID(`creditNote-debit-${rowIndex}`);
                  }
                }
              );
              this.FocusTrRowFieldsID("narration");
            }

            this.transaction_ledger_listFun();
          }
        );
      }
    } else if (k == 40) {
      // console.log("arrowdown", ledgersLst, selectedLedgerIndex);
      if (selectedLedgerIndex < ledgersLst.length - 1) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex + 1 }, () => {
          this.FocusTrRowFieldsID(
            `creditNoteTable-edt-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 38) {
      // console.log("arrowup");
      if (selectedLedgerIndex > 0) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex - 1 }, () => {
          this.FocusTrRowFieldsID(
            `creditNoteTable-edt-${this.state.selectedLedgerIndex}`
          );
        });
      }
    }

    /*     const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let { rowIndex, objCR } = this.state;
    let { handleBillByBill, ledgerData } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        this.transaction_ledger_detailsFun(val.id);
        // transaction_ledger_detailsFun(val.id);
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

        this.transaction_ledger_detailsFun(val.id);
        // transaction_ledger_detailsFun(val.id);
      }
    } else if (k === 13) {
      let cuurentProduct = t;
      let selectedLedgerData = JSON.parse(cuurentProduct.getAttribute("value"));
      console.warn("selectedLedger->>>>>>>>", selectedLedgerData);
      if (objCR && objCR.type == "cr") {
        this.setState(
          { ledgerModal: false, selectedLedger: selectedLedgerData },
          () => {
            this.handleChangeArrayElement(
              "perticulars",
              selectedLedgerData,
              rowIndex
            );
            this.handleBillByBill("debit", selectedLedgerData, rowIndex);
          }
        );
        console.log("v===>>::", selectedLedgerData);
      } else {
        this.handleChangeArrayElement(
          "perticulars",
          selectedLedgerData,
          rowIndex
        );
        this.setState({
          ledgerModal: false,
          selectedLedger: selectedLedgerData,
        });
        console.log("v===>>::", selectedLedgerData);
      }
    } else if (k == 8) {
      //! condition for backspace key press 1409
      console.log("backspace", rowIndex);
      document.getElementById(`"perticulars-${rowIndex}"`).focus();
      // setTimeout(() => {
      // }, 100);
    } else if (k == 37 || k == 39) {
      //! condition for left & right key press 1409
    } */
  }
  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }
  handleBillByBill = (element, value, index) => {
    let { rows, ledgerList, selectedLedger } = this.state;
    console.log("BillByBill==>>", element, value, index, rows);
    // this.setState({ billadjusmentmodalshow: true, index: index,rows });
    // let lastCrBal = 0;
    let debitBal = 0;
    let creditBal = 0;

    console.log({ element, value, index });
    console.log("ledgerData", { selectedLedger });
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      console.log("v-type => ", v["type"]);
      console.log("i => ", { v, i });
      if (v["type"] == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // console.log('bal', bal);
      } else if (v["type"] == "dr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          console.log("cr value", value);
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    console.log("lastCrBal ", lastCrBal);

    console.log("frows", { frows });

    if (element == "debit") {
      let obj = rows.find((v, i) => i == index);
      console.log("obj", obj);

      if (obj.type == "cr") {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancing_method,
          value
        );
      } else if (obj.type == "dr") {
        console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            //  (lastCrBal -lastCrBal - vi["paid_amt"]),
            vi["credit"] = lastCrBal;
            console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    console.log("frows", { frows });

    this.setState({ rows: frows, index: index });
  };

  finalRemainingBillAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

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
    console.log("selectedBills====", selectedBills);
    // console.log("selectedBillsdebit====", selectedBillsdebit);
    // console.log("selectedBillsOpening====", selectedBillsOpening);

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
      f_billLst.map((v, i) => {
        console.log("uncheck id", v);
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
        console.log("uncheck id", v);
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
      console.log(
        "uncheck data of invoice",
        uncheckRowData,
        openingUncheckData,
        debitUncheckData
      );

      if (id == 0) {
        this.setState({ isAdvanceCheck: false });
      }
    }

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        console.log("remTotalDebitAmt============:::::::::", remTotalDebitAmt);
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
          console.log("pamttttttt:::::::::", pamt);
          console.log(
            "selected Final Amt :::::::::::::::::",
            this.finalBillSelectedAmt()
          );
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
  finalBillAmt = () => {
    const { billLst } = this.state;
    console.log("bills in final function", { billLst });
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
    console.log("balancing_method ", balancing_method, type);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    reqData.append("source", "credit");

    getdebtorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          let { editBillData, rows, index } = this.state;
          console.log("data", data);
          if (data.length > 0 || rows.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SD") {
              let { editBillData, rows, index } = this.state;
              console.log("rows=->", rows);
              console.log("index=->", index);
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
                console.log("obj", obj);
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
              console.log("invoiceLst", invoiceLst);
              console.log("After invoiceLst newBills =-> ", newBills);
              let debitLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "credit_note"
              );
              console.log("debitLst", debitLst);
              console.log("After debitLst newBills =-> ", newBills);
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
  handleOnAccountSubmit = (v) => {
    let { index, rows } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["debit"] = v.paid_amt;
        console.log(" on account v", v);
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
    console.log("billLst", billLst);
    console.log("index", index);
    console.log("rows", rows);
    let selectedAmt = this.finalBillSelectedAmt();
    let remainingAmt = this.finalRemaningSelectedAmt();
    let frow = rows.map((vi, ii) => {
      // if(billLst.paid_amt>0){
      //   let selBillList = billLst;
      //   console.log("SelBillList==???::::",selBillList);
      // }
      let f_billLst = billLst.filter((vf) => vf.paid_amt != 0);
      console.log("f_billLst==???::::", f_billLst);
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);
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
    console.log("frow ", frow);

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
          narration: "",
        };
        this.setState({ billadjusmentmodalshow: false, index: -1 });
      }
    );
  };

  handleBillByBill = (element, value, index) => {
    let { rows, ledgerList, selectedLedger } = this.state;
    console.log("BillByBill==>>", element, value, index, rows);
    // this.setState({ billadjusmentmodalshow: true, index: index,rows });
    // let lastCrBal = 0;
    let debitBal = 0;
    let creditBal = 0;

    console.log({ element, value, index });
    console.log("ledgerData", { selectedLedger });
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      console.log("v-type => ", v["type"]);
      console.log("i => ", { v, i });
      if (v["type"] == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // console.log('bal', bal);
      } else if (v["type"] == "dr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          console.log("cr value", value);
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    console.log("lastCrBal ", lastCrBal);

    console.log("frows", { frows });

    if (element == "debit") {
      let obj = rows.find((v, i) => i == index);
      console.log("obj", obj);

      if (obj.type == "cr") {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancingMethod,
          value
        );
      } else if (obj.type == "dr") {
        console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            //  (lastCrBal -lastCrBal - vi["paid_amt"]),
            vi["credit"] = lastCrBal;
            console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    console.log("frows", { frows });

    this.setState({ rows: frows, index: index });
  };

  finalRemainingBillAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

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

  FocusTrRowFieldsID(fieldName) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }

  handleCreditdebitBalance = (index) => {
    let { rows } = this.state;
    let debitAmt = this.getTotalDebitAmt();
    let creditAmt = this.getTotalCreditAmt();
    // let count = index + 1;

    rows.map((v, i) => {
      if (debitAmt != creditAmt) {
        // if (v["perticulars"] != "" && i != index) {
        let innerrow = {
          type: "dr",
          typeobj: getSelectValue(selectOpt, "dr"),
          paid_amt: "",
          perticulars: "",
          bank_payment_type: "",
          bank_payment_no: "",
          bank_name: "",
          payment_date: "",
          debit: "",
          credit: "",
          narration: "",
        };
        let RowDataExist = rows[rows.length - 1].hasOwnProperty("perticulars");
        this.setState(
          {
            // rows: [...this.state.rows, innerrow]
            rows:
              RowDataExist != ""
                ? [...this.state.rows, innerrow]
                : [...this.state.rows],
          },
          () => {
            this.FocusTrRowFieldsID(`creditNote-perticulars-${index + 1}`);
          }
        );
        // }
      }
    });
  };
  // handleCreditdebitBalance = (index) => {
  //   // debugger;
  //   let { rowIndex, rows } = this.state;
  //   console.log("rowindex", rowIndex);
  //   console.log("rows", rows);
  //   let debitAmt = this.getTotalDebitAmt();
  //   let creditAmt = this.getTotalCreditAmt();
  //   console.log("debitAmt =>", debitAmt);
  //   console.log("creditAmt =>", creditAmt);

  //   if (debitAmt != creditAmt) {
  //     let innerrow = {
  //       type: "dr",
  //       typeobj: getSelectValue(selectOpt, "dr"),
  //       perticulars: "",
  //       paid_amt: "",
  //       bank_payment_type: "",
  //       bank_payment_no: "",
  //       bank_name: "",
  //       // check_number:"",
  //       payment_date: "",
  //       debit: "",
  //       credit: "",
  //       narration: "",
  //     };
  //     if (rows.length <= index + 1) {
  //       this.setState({ rows: [...this.state.rows, innerrow] }, () => {
  //         // console.log("row innerrow====", this.state.rows);
  //         this.typeRef.current.focus();
  //       });
  //     }
  //   }
  // };

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

  render() {
    const {
      opType,
      from_source,
      selectedLedgerIndex,
      bankaccmodal,
      rows,
      ledgersLst,
      initVal,
      ledgerModal,
      selectedLedger,
      additionalCharges,
      rowIndex,
      errorArrayBorder,
      billadjusmentmodalshow,
      filterOpen,
      creditListExit,
      invoiceListExist,
      openingListExist,
      BankOpt,
      selectedBills,
      isAllChecked,
      billLst,
      isAllCheckeddebit,
      isAdvanceCheck,
    } = this.state;
    return (
      <div
        className="accountentrynewstyle"
        //style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
        <div className="cust_table">
          {/* <h6>Purchase Invoice</h6> */}

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            enableReinitialize={true}
            initialValues={initVal}
            // validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("values ----", values);
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
                        msg: "Do you want to save",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          let requestData = new FormData();
                          this.setState({
                            invoice_data: values,
                          });

                          let frow = rows.filter((v) => v.type != "");
                          let formData = new FormData();
                          console.log("rows===", JSON.stringify(frow));
                          console.log("row", rows);

                          frow = frow.map((v, i) => {
                            let perticulareDelete = "";
                            if (
                              v.perticulars.id != this.state.perticularsDelete
                            ) {
                              perticulareDelete = this.state.perticularsDelete;
                            }
                            if (
                              v.perticulars &&
                              v.perticulars.balancingMethod == "bill-by-bill"
                            ) {
                              let billRow =
                                v.perticulars &&
                                v.perticulars.bills &&
                                v.perticulars.bills.map((vi, ii) => {
                                  if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                    vi["bill_details_id"] = vi[
                                      "bill_details_id"
                                    ]
                                      ? vi["bill_details_id"]
                                      : 0;
                                    return vi;
                                  }
                                  if (
                                    "credit_paid_amt" in vi &&
                                    vi["credit_paid_amt"] > 0
                                  ) {
                                    // return vi;
                                    return {
                                      invoice_id: vi.credit_note_id,
                                      amount: vi.Total_amt,

                                      invoice_date: moment(
                                        vi.credit_note_date
                                      ).format("YYYY-MM-DD"),
                                      invoice_no: vi.credit_note_no,
                                      source: vi.source,
                                      paid_amt: vi.credit_paid_amt,
                                      remaining_amt: vi.credit_remaining_amt,
                                    };
                                  }
                                  if (
                                    "debit_paid_amt" in vi &&
                                    vi["debit_paid_amt"] > 0
                                  ) {
                                    // return vi;
                                    return {
                                      invoice_id: vi.debit_note_id,
                                      amount: vi.Total_amt,
                                      // details_id: v.details_id != "" ? v.details_id : 0,
                                      invoice_date: moment(
                                        vi.debit_note_date
                                      ).format("YYYY-MM-DD"),
                                      invoice_no: vi.debit_note_no,
                                      source: vi.source,
                                      paid_amt: vi.debit_paid_amt,
                                      remaining_amt: vi.debit_remaining_amt,
                                    };
                                  }
                                });

                              // console.log("billrow >>>>>>", billRow);
                              // billRow = billRow.filter((v) => v != undefined);
                              // console.log("billrow >>>>>>", billRow);

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
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,

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
                          console.log("frow ---------", JSON.stringify(frow));

                          if (
                            values.narration != null &&
                            values.narration != ""
                          )
                            formData.append("narration", values.narration);
                          formData.append("rows", JSON.stringify(frow));
                          formData.append(
                            "transaction_dt",
                            moment(values.transaction_dt, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )
                          );
                          formData.append(
                            "voucher_credit_sr_no",
                            values.voucher_credit_sr_no
                          );
                          formData.append(
                            "credit_id",
                            values.voucher_credit_sr_no
                          );
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);
                          formData.append(
                            "voucher_credit_no",
                            values.voucher_credit_no
                          );
                          console.log("Form Date ", formData);
                          for (var pair of formData.entries()) {
                            console.log(pair[0] + ", " + pair[1]);
                          }

                          if (
                            this.getTotalDebitAmt() == this.getTotalCreditAmt()
                          ) {
                            update_credit_note(formData)
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
                                  // this.componentDidMount();

                                  eventBus.dispatch("page_change", {
                                    from: "voucher_credit_note",
                                    to: "voucher_credit_List",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: {
                                      editId: this.state.creditNoteEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                  });
                                } else {
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
                                      msg:
                                        "Server Error! Please Check Your Connectivity",
                                    });
                                    console.log(
                                      "Server Error! Please Check Your Connectivity"
                                    );
                                  }
                                }
                              })
                              .catch((error) => {
                                console.log("error", error);
                              });
                          } else {
                            ShowNotification(
                              "Please Correct the Credit and Debit values"
                            );
                          }
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
                      is_button_show: true,
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
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="div-style">
                  <div className="inner-div-account">
                    <Row>
                      {/* <Col md="12">
                              <div className="supplie-det">
                                <ul>
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="5"
                                        className="pt-0"
                                      >
                                        <h6>Credit Sr. #.</h6>:{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          style={{
                                            textAlign: "left",
                                            paddingRight: "10px",
                                            background: "#f5f5f5",
                                          }}
                                          type="text"
                                          name="voucher_credit_sr_no"
                                          id="voucher_credit_sr_no"
                                          disabled
                                          placeholder="Jour1234"
                                          className="mb-0 mt-2"
                                          value={values.voucher_credit_sr_no}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="5"
                                        className="pt-0"
                                      >
                                        <h6>Credit #.</h6>:{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          style={{
                                            textAlign: "left",
                                            paddingRight: "10px",
                                            background: "#f5f5f5",
                                            // /readonly,
                                          }}
                                          type="text"
                                          disabled
                                          placeholder="1234"
                                          className="mb-0 mt-1"
                                          value={values.voucher_credit_no}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="6"
                                        className="pt-0"
                                      >
                                        <b>Transaction Date : </b>
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          type="date"
                                          className="mt-2"
                                          name="transaction_dt"
                                          id="transaction_dt"
                                          onChange={handleChange}
                                          value={values.transaction_dt}
                                          isValid={
                                            touched.transaction_dt &&
                                            !errors.transaction_dt
                                          }
                                          isInvalid={!!errors.transaction_dt}
                                          readOnly={true}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                </ul>
                              </div>
                            </Col> */}
                      <Col md="1" className="my-auto">
                        <Form.Label className="pt-0 lbl">
                          Voucher Sr. No.
                        </Form.Label>
                      </Col>
                      <Col md="2">
                        <Form.Control
                          type="text"
                          name="voucher_credit_sr_no"
                          id="voucher_credit_sr_no"
                          disabled
                          placeholder="Jour1234"
                          className="accountentry-text-box"
                          value={values.voucher_credit_sr_no}
                        />
                      </Col>

                      <Col md="1" className="my-auto">
                        <Form.Label className="pt-0 lbl">
                          Voucher No.
                          {/* <span className="pt-1 pl-1 req_validation">
                                  *
                                </span> */}
                        </Form.Label>
                      </Col>
                      <Col md="2">
                        <Form.Control
                          type="text"
                          disabled
                          placeholder="1234"
                          className="accountentry-text-box"
                          value={values.voucher_credit_no}
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
                            // className="tnx-pur-inv-date-style "
                            name="transaction_dt"
                            id="transaction_dt"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            autoComplete="true"
                            autoFocus={true}
                            value={values.transaction_dt}
                            className={`${
                              errorArrayBorder[0] == "Y"
                                ? "border border-danger accountentry-date-style"
                                : "accountentry-date-style"
                            }`}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === "Tab") {
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
                                      .getElementById("transaction_dt")
                                      .focus();
                                  }, 1000);
                                }
                              } else if (e.key === "Tab" || e.keyCode == 13) {
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
                                      .getElementById("transaction_dt")
                                      .focus();
                                  }, 1000);
                                } else {
                                  this.FocusTrRowFieldsID(`perticulars-edt-0`)
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // console.log("e ", e);
                              // console.log("e.target.value ", e.target.value);
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
                                    // is_button_show: true,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // this.invoiceDateRef.current.focus();
                                  // setFieldValue("transaction_dt", "");
                                  setTimeout(() => {
                                    this.invoiceDateRef.current.focus();
                                  }, 1000);
                                }
                              } else {
                                // setFieldValue("transaction_dt", "");
                                this.setErrorBorder(0, "Y");
                                // document
                                //   .getElementById("transaction_dt")
                                //   .focus();
                              }
                            }}
                          />
                        </Form.Group>
                        {/* <Form.Control
                                type="date"
                                // className=""
                                autoComplete="true"
                                name="transaction_dt"
                                id="transaction_dt"
                                onChange={handleChange}
                                value={values.transaction_dt}
                                className={`${
                                  errorArrayBorder[0] == "Y"
                                    ? "border border-danger tnx-pur-inv-date-style"
                                    : "tnx-pur-inv-date-style"
                                }`}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  if (e.target.value) {
                                    this.setErrorBorder(0, "");
                                  } else {
                                    this.setErrorBorder(0, "Y");
                                    document
                                      .getElementById("transaction_dt")
                                      .focus();
                                  }
                                }}
                                isValid={
                                  touched.transaction_dt &&
                                  !errors.transaction_dt
                                }
                                isInvalid={!!errors.transaction_dt}
                                readOnly={true}
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
                  //style={{ maxHeight: "67vh", height: "67vh" }}
                >
                  <Table size="sm">
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
                          Credit &nbsp;
                        </th>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          Debit &nbsp;
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
                      {rows.length > 0 &&
                        rows.map((vi, ii) => {
                          return (
                            <tr className="entryrow">
                              <td style={{ width: "5%" }}>
                                {/* <Form.Control
                                          as="select"
                                          onChange={(e) => {
                                            if (e.target.value != "") {
                                              this.handleChangeArrayElement(
                                                "type",
                                                e.target.value,
                                                ii
                                              );
                                            } else {
                                              this.handleClear(ii);
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                          }}
                                          value={this.setElementValue(
                                            "type",
                                            ii
                                          )}
                                          
                                          placeholder="select type"
                                        >
                                          {ii == 0 ? (
                                            <option selected value="dr">
                                              Dr
                                            </option>
                                          ) : (
                                            <>
                                              <option value=""></option>
                                              <option value="dr">Dr</option>
                                            </>
                                          )}
                                          <option value="cr">Cr</option>
                                        </Form.Control> */}
                                <Form.Group>
                                  <Select
                                    ref={this.typeRef}
                                    styles={customStyles1}
                                    className="selectTo"
                                    defaultValue={selectOpt[1]}
                                    options={selectOpt}
                                    // onFocus={(e) => {
                                    //   e.preventDefault();
                                    //   this.setState({ rowIndex: ii });
                                    // }}
                                    onChange={(v) => {
                                      setFieldValue("type", v.label);
                                      console.log("v============", v);
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
                                    // name="type"
                                    // id="type"
                                    name={`creditNote-edt-type-${ii}`}
                                    id={`creditNote-edt-type-${ii}`}
                                    value={this.setElementValue("typeobj", ii)}
                                    // value={this.setElementValue("type", ii)}
                                    placeholder="Type"
                                    // onKeyDown={(e) => {
                                    //   if (e.shiftKey && e.key === "Tab") {
                                    //   } else if (
                                    //     e.key === "Tab" &&
                                    //     !e.value.trim()
                                    //   )
                                    //     e.preventDefault();
                                    // }}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.key === "Tab") {
                                      } else if (e.key === "Tab") {
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              >
                                {/* <Select
                                          components={{
                                            DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null,
                                          }}
                                          placeholder=""
                                          styles={customStyles1}
                                          isClearable
                                          options={ledgersLst}
                                          theme={(theme) => ({
                                            ...theme,
                                            height: "26px",
                                            borderRadius: "5px",
                                          })}
                                          onChange={(v) => {
                                            if (v != null) {
                                              this.handleChangeArrayElement(
                                                "perticulars",
                                                v,
                                                ii
                                              );
                                            } else {
                                              this.handleClear(ii);
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
                                  name={`perticulars-edt-${ii}`}
                                  id={`perticulars-edt-${ii}`}
                                  // onChange={handleChange}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    this.setState({ rowIndex: ii });
                                  }}
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
                                    this.ledgerModalFun(true, ii);
                                    this.setState(
                                      {
                                        ledgerModal: true,
                                      },
                                      () => {
                                        if (vi.perticulars.id != "") {
                                          const index = ledgersLst.findIndex(
                                            (object) => {
                                              return (
                                                object.id ===
                                                vi.perticulars.id
                                              );
                                            }
                                          );
                                          if (index >= 0) {
                                            this.setState({
                                              selectedLedgerIndex: index
                                            })
                                            document
                                              .getElementById(
                                                "creditNoteTable-edt-" + index
                                              )
                                              .focus();
                                          }
                                        }

                                      }
                                    );
                                  }}
                                  value={
                                    rows[ii]["perticulars"]
                                      ? rows[ii]["perticulars"]["ledger_name"]
                                      : ""
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalFun(true, ii);
                                      this.setState(
                                        {
                                          ledgerModal: true,
                                        },
                                        () => {
                                          if (vi.perticulars.id != "") {
                                            const index = ledgersLst.findIndex(
                                              (object) => {
                                                return (
                                                  object.id ===
                                                  vi.perticulars.id
                                                );
                                              }
                                            );
                                            if (index >= 0) {
                                              this.setState({
                                                selectedLedgerIndex: index
                                              })
                                              document
                                                .getElementById(
                                                  "creditNoteTable-edt-" + index
                                                )
                                                .focus();
                                            }
                                          }

                                        }
                                      );
                                      setTimeout(() => {
                                        document
                                          .getElementById("VCNE-addProduct-edit")
                                          .focus();
                                      }, 1000);
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      if (e.target.value === "") {
                                        e.preventDefault();
                                        if (ledgerModal === true) {
                                          document
                                            .getElementById("VCNE-addProduct-edit")
                                            .focus();
                                        }
                                      } else if (
                                        ledgerModal === true &&
                                        e.target.value !== ""
                                      ) {
                                        this.setState({ ledgerModal: false });
                                      }
                                    } else if (e.keyCode == 40) {
                                      //! this condition for down button press 1409
                                      if (ledgerModal == true)
                                        document
                                          .getElementById(
                                            "creditNoteTable-edt-0"
                                          )
                                          ?.focus();
                                      else
                                        this.FocusTrRowFields(
                                          "particulars",
                                          ii + 1
                                        );
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
                              <td style={{ width: "10%" }}>
                                <Form.Control
                                  className="table-text-box border-0"
                                  type="text"
                                  id={`creditNote-edt-debit-${ii}`}
                                  name={`creditNote-edt-debit-${ii}`}
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
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 13) {
                                      this.handleCreditdebitBalance(ii);
                                    }
                                  }}
                                  onBlur={(e) => {
                                    this.handleCreditdebitBalance();
                                  }}
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (e.key === "Tab") {
                                  //     let v = e.target.value;
                                  //     // console.log(v.value);
                                  //     this.setState(
                                  //       {
                                  //         selectedLedger: rows[ii][
                                  //           "perticulars"
                                  //         ]
                                  //           ? rows[ii]["perticulars"]
                                  //           : "",
                                  //       },
                                  //       () => {
                                  //         if (vi.type == "cr") {
                                  //           this.handleBillByBill(
                                  //             "debit",
                                  //             v,
                                  //             ii
                                  //           );
                                  //         }
                                  //       }
                                  //     );
                                  //   } else if (e.keyCode == 13) {
                                  //     {
                                  //       let v = e.target.value;
                                  //       // console.log(v.value);
                                  //       this.setState(
                                  //         {
                                  //           selectedLedger: rows[ii][
                                  //             "perticulars"
                                  //           ]
                                  //             ? rows[ii]["perticulars"]
                                  //             : "",
                                  //         },
                                  //         () => {
                                  //           if (vi.type == "cr") {
                                  //             this.handleBillByBill(
                                  //               "debit",
                                  //               v,
                                  //               ii
                                  //             );
                                  //           }
                                  //         }
                                  //       );
                                  //     }
                                  //   }
                                  //   // e.preventDefault();
                                  // }}
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
                                  id={`creditNote-edt-credit-${ii}`}
                                  name={`creditNote-edt-credit-${ii}`}
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleChangeArrayElement(
                                      "credit",
                                      v,
                                      ii
                                    );
                                  }}
                                  onBlur={(e) => {
                                    this.handleCreditdebitBalance();
                                  }}
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
                                          .getElementById("VCNE_narration")
                                          .focus();
                                      else this.handleCreditdebitBalance(ii);
                                    } else if (e.keyCode === 13) {
                                      if (
                                        this.getTotalCreditAmt() ===
                                        this.getTotalDebitAmt()
                                      ) {
                                        document
                                          .getElementById("VCNE_narration")
                                          .focus();
                                      } else {
                                        this.handleCreditdebitBalance(ii);
                                      }
                                    }
                                  }}
                                  disabled={
                                    this.setElementValue("type", ii) == "dr"
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
                      {" "}
                      Total
                    </td>
                    <td style={{ width: "70%" }}></td>

                    <td
                      style={{
                        textAlign: "center",
                        paddingRight: "10px",
                        width: "10%",
                      }}
                    >
                      <Form.Control
                        style={{
                          //textAlign: "right",
                          // width: "8%",
                          background: "transparent",
                          textAlign: "center",
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
                        textAlign: "center",
                        paddingRight: "10px",
                        width: "10%",
                      }}
                    >
                      <Form.Control
                        style={{
                          //textAlign: "right",
                          //width: '8%',
                          textAlign: "center",
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
                            <span className="span-value"></span>
                          </div>

                          <div className="d-flex">
                            <span className="span-lable">Area :</span>
                            <span className="span-value"></span>
                          </div>

                          <div className="d-flex">
                            <span className="span-lable">Bank :</span>
                            <span className="span-value"></span>
                          </div>
                        </Col>
                        <Col
                          lg={3}
                          style={{ borderRight: "1px solid #EAD8B1" }}
                        >
                          <div className="d-flex">
                            <span className="span-lable">Contact Person :</span>
                            <span className="span-value"></span>
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
                            <span className="span-value"></span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">FSSAI :</span>
                            <span className="span-value">
                              {/* {product_hover_details.tax_type} */}
                            </span>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex">
                            <span className="span-lable">Lisence No :</span>
                            <span className="span-value"></span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">Route :</span>
                            <span className="span-value">
                              {/* {product_hover_details.tax_type} */}
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
                          <div className="d-flex">
                            <span className="span-lable">Payment Mode :</span>
                            <span className="span-value"></span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">
                              Cheque/DD/Receipt :
                            </span>
                            <span className="span-value"></span>
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
                            <span className="span-value"></span>
                          </div>
                          <div className="d-flex">
                            <span className="span-lable">Payment Date :</span>
                            <span className="span-value"></span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className=" px-2">
                    <Col sm={10}>
                      <Row className="mt-2 ">
                        <Col sm={1}>
                          <Form.Label className="text-label">
                            Narration:
                          </Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            // as="textarea"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Narration"
                            // style={{ height: "72px", resize: "none" }}
                            className="accountentry-text-box"
                            id="VCNE_narration"
                            onChange={handleChange}
                            // rows={5}
                            // cols={25}
                            name="narration"
                            value={values.narration}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.handleKeyDown(e, "VCNE_submit_btn");
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    {" "}
                    <div className="accountentry-info-table mt-2">
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
                            <th>Dis%</th>
                            <th>Dis</th>
                          </tr>
                        </thead>
                        {/* <tbody>
                            
                            {selectedBillsData.length > 0 ? (
                              selectedBillsData.map((v, i) => {
                                if (v.source == "pur_invoice") {
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
                                     
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <tr>
                                      <td>{v.source}</td>
                                      <td>{v.debit_note_no}</td>

                                      <td>
                                        {moment(v.debit_note_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </td>
                                       <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                      <td>{v.amount}</td>
                                      <td>{v.debit_paid_amt}</td>
                                      <td>{v.debit_remaining_amt}</td>
                                     
                                    </tr>
                                  );
                                }
                              })
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center">
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody> */}
                      </Table>
                    </div>
                  </Row>
                  <Row className="py-1">
                    <Col className="text-end">
                      <Button
                        id="VCNE_submit_btn"
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
                                eventBus.dispatch("page_change", {
                                  from: "voucher_credit_note",
                                  to: "voucher_credit_List",
                                  isNewTab: false,
                                  prop_data: {
                                    editId: this.state.creditNoteEditData.id,
                                    rowId: this.props.block.prop_data.rowId,
                                  },
                                  isCancel: true,
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
                                    from: "voucher_credit_note",
                                    to: "voucher_credit_List",
                                    isNewTab: false,
                                    prop_data: {
                                      editId: this.state.creditNoteEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                    isCancel: true,
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
                    </Col>
                  </Row>
                </div>

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
              </Form>
            )}
          </Formik>
        </div>
        {ledgerModal ? (
          <Row className="justify-content-end" ref={this.ledgerModalRef}>
            <div className="ledger-table-popup-voucher ps-0">
              <Row style={{ background: "#D9F0FB" }} className="ms-0">
                <Col lg={6}>
                  <h6 className="table-header-ledger my-auto">Ledger</h6>
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
                      this.handleCreditNoteTableRow(e);
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
                                    opType: opType,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    // from_page: "tranx_purchase_invoice_create",
                                    from_page: from_source,
                                  };
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_invoice_create",
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
                              onKeyDown={(e) => {
                                if (e.keyCode === 40) {
                                  document
                                    .getElementById("creditNoteTable-edt-0")
                                    .focus();
                                }
                                else if (e.keyCode === 13) {
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
                                      opType: opType,
                                      additionalCharges: additionalCharges,
                                      invoice_data:
                                        this.myRef != null && this.myRef.current
                                          ? this.myRef.current.values
                                          : "",
                                      // from_page: "tranx_purchase_invoice_create",
                                      from_page: from_source,
                                    };
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_create",
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
                                }
                              }}
                              id="VCNE-addProduct-edit"
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  {/* {JSON.stringify(objCR)} */}
                  <tbody className="prouctTableTr">
                    <>
                      {/* {JSON.stringify(cashAcbankLst)} */}
                      {/* {JSON.stringify(ledgersLst)} */}
                      {ledgersLst.map((v, i) => {
                        return (
                          <tr
                            // value={JSON.stringify(v)}
                            // id={`productTr_` + i}
                            // prId={v.id}
                            id={`creditNoteTable-edt-${i}`}
                            tabIndex={i}
                            // className={`${
                            //   JSON.stringify(v) ==
                            //   JSON.stringify(selectedLedger)
                            //     ? "selected-tr"
                            //     : ""
                            // }`}
                            className={`${
                              i == selectedLedgerIndex
                                ? "payment-ledger-selected-tr"
                                : ""
                            }`}
                            onDoubleClick={(e) => {
                              e.preventDefault();

                              this.handleChangeArrayElement(
                                "perticulars",
                                v,
                                rowIndex
                              );
                              let currentR = rows[rowIndex];
                              console.log("currentROnDoubleClick-->", currentR);
                              if (v.balancingMethod != "on-account") {
                                // console.log("objCR.type---->", objCR.type);
                                this.handleBillByBill("debit", v, rowIndex);
                                if (currentR && currentR["type"] == "dr") {
                                  this.FocusTrRowFieldsID(
                                    `creditNote-edt-credit-${rowIndex}`
                                  );
                                } else if (
                                  currentR &&
                                  currentR["type"] == "cr"
                                ) {
                                  this.FocusTrRowFieldsID(
                                    `creditNote-edt-debit-${rowIndex}`
                                  );
                                }
                              } else {
                                console.log("row  o innerrow====", currentR);

                                this.setState(
                                  {
                                    billadjusmentmodalshow: false,
                                    index: -1,
                                    // rows: [...this.state.rows, innerrow],
                                  },
                                  () => {
                                    console.log("row innerrow====", currentR);
                                    if (currentR && currentR["type"] == "dr") {
                                      this.FocusTrRowFieldsID(
                                        `creditNote-credit-${rowIndex}`
                                      );
                                    } else if (
                                      currentR &&
                                      currentR["type"] == "cr"
                                    ) {
                                      this.FocusTrRowFieldsID(
                                        `creditNote-debit-${rowIndex}`
                                      );
                                    }
                                  }
                                );
                                this.FocusTrRowFieldsID("VCNE_narration");
                              }

                              this.setState({
                                ledgerModal: false,
                                selectedLedgerIndex: 0,
                                selectedLedger: v,
                              });
                              this.transaction_ledger_listFun(e.target.value);
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("vvv", { v });
                              rows[rowIndex]["perticulars"] = v.ledger_name;

                              if (v.type == "bank_account") {
                                this.setState({
                                  bankaccmodal: true,
                                  rows: rows,
                                });
                              }

                              // this.setState({ selectedLedger: v }, () => {
                              //   this.transaction_ledger_detailsFun(v.id);
                              // });
                            }}
                          >
                            <td className="ps-3">{v.code}</td>
                            <td className="ps-3">{v.ledger_name}</td>
                            <td className="ps-3">{v.city}</td>
                            <td className="ps-3">{v.contact_number}</td>
                            <td className="ps-3">{v.value}</td>
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
                                        this.myRef != null && this.myRef.current
                                          ? this.myRef.current.values
                                          : "",
                                      from_page:
                                        "tranx_purchase_invoice_create",
                                    };

                                    let data = {
                                      source: source,
                                      id: v.id,
                                    };
                                    console.log({ data });
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

                    {/* {ledgerList.map((v, i) => {
                    return (
                      <tr
                        className={`${JSON.stringify(v) == JSON.stringify(selectedLedger)
                          ? "selected-tr"
                          : ""
                          }`}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          console.log("selectedLedger", { selectedLedger }, i, rowIndex);
                          console.log("rows", rows);
                          if (selectedLedger != "") {
                            rows[rowIndex]["perticulars"] =
                              selectedLedger.ledger_name;

                            console.log("invoice_data", { invoice_data });
                            this.setState({
                              rows: rows,
                              ledgerList: ledgerList,


                              ledgerModal: false,
                              selectedLedger: selectedLedger,
                              // rowIndex: -1,
                            });
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("vvv", { v });
                          this.setState({ selectedLedger: v }, () => {
                            this.transaction_ledger_detailsFun(v.id);
                          });
                        }}
                      >
                        <td className="ps-3">{v.code}</td>
                        <td className="ps-3">{v.ledger_name}</td>
                        <td className="ps-3">{v.city}</td>
                        <td className="ps-3">{v.contact_number}</td>
                        <td className="ps-3">{v.current_balance}</td>
                        <td className="ps-3">{v.balance_type}</td>
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
                                  from_page: "tranx_purchase_invoice_create",
                                };

                                let data = {
                                  source: source,
                                  id: v.id,
                                };
                                console.log({ data });
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
                  })} */}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
        ) : (
          <></>
        )}

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
                  // this.handleBillByBillSubmit(values);
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
                      { errorArrayBorderBillbyBill: errorArray },
                      () => {
                        if (allEqual(errorArray)) {
                          // console.log("billbybilldata--", { values });
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
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault()
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
                                  autoFocus="true"
                                  type="text"
                                  placeholder="Payable Amt."
                                  name="payableAmt"
                                  id="payableAmt"
                                  disabled={this.state.pblAmtDisable}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "isAdvanceCheck");
                                    }
                                  }}
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
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      remainingAmt: this.finalRemaningSelectedAmt(),
                                    });
                                  }}
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
                                    console.log(
                                      "selecteddddddddddddamt==??",
                                      e
                                    );
                                    if (v != "") {
                                      this.setState({ selectedAmt: v });
                                    }
                                  }}
                                  value={this.finalBillSelectedAmt() === 0 ? "" : this.finalBillSelectedAmt()}
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
                                  value={this.finalRemaningSelectedAmt() === 0 ? "" : this.finalRemaningSelectedAmt()}
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
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "commoncheckid");
                                }
                              }}
                              checked={isAdvanceCheck === true ? true : false}
                              value={isAdvanceCheck}
                              onClick={(e) => {
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
                                              id="commoncheckid"
                                              className="checkboxstyle"
                                              // label="Invoice No."
                                              type="checkbox"
                                              checked={
                                                isAllChecked === true
                                                  ? true
                                                  : false
                                              }
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                              onChange={(e) => {
                                                this.handleBillsSelectionOpeningAll(
                                                  e.target.checked
                                                );
                                              }}
                                              style={{
                                                verticalAlign:
                                                  "middle !important",
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
                                                    id={`opening-check-${ii}`}
                                                    name="invoice_no"
                                                    type="checkbox"
                                                    // label={vi.invoice_no}
                                                    value={vi.invoice_unique_id}
                                                    checked={selectedBills.includes(
                                                      vi.invoice_unique_id
                                                    )}
                                                    onKeyDown={(e) => {
                                                      if (e.keyCode == 13) {
                                                        this.focusNextElement(e);
                                                      }
                                                    }}
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
                                                {moment(vi.invoice_dt).format(
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
                                                  id={`opening-paid-amount-${ii}`}
                                                  type="text"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                  onChange={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                      "value",
                                                      e.target.value
                                                    );
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
                                                      vi.invoice_id
                                                    )
                                                  }
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
                                            id="commoncheckid"
                                            // label="Invoice No."
                                            type="checkbox"
                                            className="checkboxstyle"
                                            checked={
                                              isAllChecked === true
                                                ? true
                                                : false
                                            }
                                            onKeyDown={(e) => {
                                              if (e.keyCode == 13) {
                                                this.focusNextElement(e);
                                              }
                                            }}
                                            onChange={(e) => {
                                              this.handleBillsSelectionOpeningAll(
                                                e.target.checked
                                              );
                                            }}
                                            style={{
                                              verticalAlign:
                                                "middle !important",
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
                                                  id={`invoice-check-${ii}`}
                                                  name="invoice_no"
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_unique_id}
                                                  checked={selectedBills.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
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
                                              {moment(vi.invoice_dt).format(
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
                                                id={`invoice-paid-amount-${ii}`}
                                                type="text"
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}  
                                                onChange={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "value",
                                                    e.target.value
                                                  );
                                                  this.handleBillPayableAmtChange(
                                                    e.target.value,
                                                    ii
                                                  );
                                                }}
                                                value={
                                                  vi.paid_amt ? vi.paid_amt : 0
                                                }
                                                className="bill-text text-end border-0"
                                                readOnly={
                                                  !selectedBills.includes(
                                                    vi.invoice_id
                                                  )
                                                }
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
                                          id="commoncheckid"
                                          type="checkbox"
                                          // label="Credit Note No."
                                          checked={
                                            isAllCheckeddebit === true
                                              ? true
                                              : false
                                          }
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                              this.focusNextElement(e);
                                            }
                                          }}
                                          onChange={(e) => {
                                            this.handleBillsSelectionOpeningAll(
                                              e.target.checked
                                            );
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
                                                id={`debit-check-${ii}`}
                                                type="checkbox"
                                                // label={vi.credit_note_no}
                                                value={vi.invoice_unique_id}
                                                checked={selectedBills.includes(
                                                  vi.invoice_unique_id
                                                )}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
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
                                            {moment(vi.invoice_dt).format(
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
                                              id={`debit-paid-amount-${ii}`}
                                              type="text"
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                              onChange={(e) => {
                                                e.preventDefault();
                                                console.log(
                                                  "value",
                                                  e.target.value
                                                );
                                                this.handleBillPayableAmtChange(
                                                  e.target.value,
                                                  ii
                                                );
                                              }}
                                              value={
                                                vi.paid_amt ? vi.paid_amt : 0
                                              }
                                              className="bill-text text-end border-0"
                                              readOnly={
                                                !selectedBills.includes(
                                                  vi.invoice_no
                                                )
                                              }
                                              style={{
                                                borderRadius: "0px",
                                                borderTop: "0px",
                                                borderBottom: "0px",
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
                          id="bill-by-bill-submit-btn"
                          onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                              this.ref.current.handleSubmit();
                            }
                          }}
                          className="create-btn "
                          type="submit">
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
          <Modal.Body className="purchaseumodal p-invoice-modal pt-0">
            <Form noValidate className="pt-0">
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
                        // className={`${values.bank_payment_type == "" &&
                        //   errorArrayBorder[0] == "Y"
                        //   ? "border border-danger "
                        //   : ""
                        //   }`}
                        className="border border-danger"
                        style={{ borderRadius: "4px" }}
                      >
                        <Select
                          className="selectTo"
                          placeholder="Select Type"
                          // styles={ledger_select}
                          isClearable
                          options={BankOpt}
                          // borderRadius="0px"
                          // colors="#729"
                          name="bank_payment_type"
                          autoFocus={true}
                          // onChange={(value) => {
                          //   setFieldValue("bank_payment_type", value);
                          // }}
                          // value={values.bank_payment_type}
                        />
                        {/* <span className="text-danger">
                          {errors.bank_payment_type}
                        </span> */}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
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
                        className="border border-danger"
                        style={{ borderRadius: "4px" }}
                      >
                        <Select
                          className="selectTo"
                          placeholder="Select Type"
                          // styles={ledger_select}
                          isClearable
                          options={BankOpt}
                          // borderRadius="0px"
                          // colors="#729"
                          name="bank_payment_type"
                          // onChange={(value) => {
                          //   setFieldValue("bank_payment_type", value);
                          // }}
                          // value={values.bank_payment_type}
                        />
                        {/* <span className="text-danger">
                          {errors.bank_payment_type}
                        </span> */}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col lg="3">
                  <Row>
                    <Col lg={4}>
                      <Form.Label className="mb-1">Cheque/DD</Form.Label>
                    </Col>
                    <Col lg={8}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="bank_payment_no"
                          placeholder="Bank Payment No"
                          id="bank_payment_no"
                          // onChange={handleChange}
                          // value={values.bank_payment_no}
                          autoComplete="nope"
                          // className={`${values.bank_payment_no == "" &&
                          //   errorArrayBorder[0] == "Y"
                          //   ? "border border-danger  text-box"
                          //   : "text-box"
                          //   }`}
                          className="border border-danger text-box"
                          // isInvalid={!!errors.bank_payment_no}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                              {errors.bank_payment_no}
                            </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col lg="3">
                  <Row>
                    <Col lg={4}>
                      <Form.Label className="mb-1">payment Date</Form.Label>
                    </Col>
                    <Col lg={8}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="bank_payment_no"
                          placeholder="Bank Payment No"
                          id="bank_payment_no"
                          // onChange={handleChange}
                          // value={values.bank_payment_no}
                          autoComplete="nope"
                          // className={`${values.bank_payment_no == "" &&
                          //   errorArrayBorder[0] == "Y"
                          //   ? "border border-danger  text-box"
                          //   : "text-box"
                          //   }`}
                          className="border border-danger text-box"
                          // isInvalid={!!errors.bank_payment_no}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                              {errors.bank_payment_no}
                            </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="text-end">
                  <Button className="successbtn-style" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
