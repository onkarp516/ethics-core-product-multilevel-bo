import React from "react";
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
import Select from "react-select";
import delete_icon from "@/assets/images/delete_icon 3.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import Scanner from "@/assets/images/scanner.png";
import {
  getPOPendingOrderWithIds,
  getreceiptlastrecords,
  getSDIEReceipt,
  getdebtorspendingbills,
  getCBADReceipt,
  create_receipts,
  transaction_ledger_details,
  transaction_ledger_list,
} from "@/services/api_functions";

import {
  MyTextDatePicker,
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  ledger_select,
  eventBus,
  MyNotifications,
  isActionExist,
  allEqual,
  companystyle,
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};
const drcrtype = [
  { value: "dr", label: "dr" },
  { value: "cr", label: "cr" },
];
const BankOpt = [
  { label: "Cheque / DD", value: "cheque-dd" },
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Others", value: "others" },
];
const selectOpt = [
  { label: "Dr", value: "Dr" },
  { label: "Cr", value: "Cr" },
];
export default class Receipt extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.ref = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.tranDateRef = React.createRef();
    this.state = {
      show: false,
      invoice_data: "",
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
      paidAmount: "",
      selectedLedger: "",
      billLstSc: [],
      selectedBills: [],
      accountLst: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      rowIndex: -1,
      serialnopopupwindow: false,
      ledgerModal: false,
      ledgerData: "",
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      ledgerList: [],
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      objCR: "",
      errorArrayBorder: "",
      errorArrayBorderBillbyBill: "",
      initVal: {
        receipt_sr_no: 1,
        receipt_code: "",
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
        po_sr_no: 1,
        sundryindirectid: "",
        id: "",
        type: "",
        balancing_method: "",
        amount: "",
      },

      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
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
      totalDebitAmt: 0,
      payableAmt: 0,
      selectedAmt: 0,
      remainingAmt: 0,
      isAdvanceCheck: false,
      advanceAmt: 0,
      selectedBillsData: "",
      isInvoiceExist: false,
      isCreditExist: false,
    };
  }
  // const { i, productLst, setFieldValue, isDisabled } = props;
  handleClose = () => {
    this.setState({ show: false });
  };
  // getElementObject = (index) => {
  //   let elementCheck = this.state.rows.find((v, i) => {
  //     return i == index;
  //   });
  //   console.log("elementCheck", elementCheck);
  //   return elementCheck ? elementCheck : "";
  // };

  initRows = () => {
    let rows = [];
    for (let index = 0; index < 10; index++) {
      let innerrow = {
        type: "",
        perticulars: "",
        paid_amt: "",
        bank_payment_type: "",
        bank_payment_no: "",
        debit: "",
        credit: "",
        narration: "",
      };
      if (index == 0) {
        innerrow["type"] = "cr";
      } else if (index == 1) {
        innerrow["type"] = "dr";
      }
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
  getElementObject = (index) => {
    let { rows } = this.state;
    // console.log("index----", index);
    // console.log("rows----", this.state.rows);

    let elementCheck = rows.find((v, i) => {
      // console.log("i---", i);
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    return elementCheck ? elementCheck : "";
  };

  handleClearPayment = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      // type: "",
      paid_amt: "",
      perticulars: "",
      credit: "",
      debit: "",
      bank_payment_type: "",
      bank_payment_no: "",
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => {});
  };

  lstgetsundrydebtors_indirectexpenses = () => {
    getSDIEReceipt()
      .then((response) => {
        console.log("response", response);
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
                current_balance: v.current_balance,
                balancing_method: "",
                billids: [],
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ cashAcbankLst: resLst, orgCashList: resLst });
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

          console.log({ initVal });
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleBillselection = (id, index, status) => {
    // debugger;
    console.log("id,status,index", id, status, index);
    let {
      billLst,
      selectedBills,
      selectedBillsCredit,
      totalDebitAmt,
    } = this.state;
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

    if (selectedBillsCredit.length > 0) {
      console.log("selectedBillsCredit", selectedBillsCredit);
      console.log("f_billLst", f_billLst);
      let debitTotalAmt = 0;
      let creditTotalAmt = 0;
      f_billLst.map((v, i) => {
        if (v.source == "debit_note") {
          if (selectedBillsCredit.includes(parseInt(v.credit_note_id))) {
            debitTotalAmt += parseFloat(v.credit_paid_amt);
          }
        } else if (v.source == "sales_invoice") {
          if (selectedBills.includes(parseInt(v.invoice_id))) {
            creditTotalAmt += parseFloat(v.paid_amt);
          }
        }
      });
      console.log("debitTotalAmt", debitTotalAmt);
      // let damt = f_billLst.reduce((p,n)=>parseFloat(p)+parseFloat(n.paid_amt))
      remTotalDebitAmt =
        parseFloat(remTotalDebitAmt) +
        parseFloat(debitTotalAmt) -
        parseFloat(creditTotalAmt);
      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
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
                  msg:
                    "selected bill amt is greater than payable amt, do you want to continue",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    console.log(
                      "this.ref.current====>>>????",
                      this.ref.current
                    );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;

                    console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["paid_amt"] = v["amount"];
                    v["remaining_amt"] = 0;
                    console.log("totalDebitAmt", remTotalDebitAmt);
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
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
          if (f_selectedBills.includes(v.invoice_id)) {
            v["paid_amt"] = parseFloat(v.amount);
            v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
            let selectbill = parseFloat(v.amount);
            let remaingbill = parseFloat(v["amount"]) - parseFloat(v.amount);
            this.setState({
              selectedAmt: selectbill,
              remainingAmt: remaingbill,
            });
            console.log(
              "parseFloat(v.amount)",
              parseFloat(v.amount),
              parseFloat(v["amount"]) - parseFloat(v.amount)
            );
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
                    console.log(
                      "this.ref.current====>>>????",
                      this.ref.current
                    );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
                    console.log("remTotalDebitAmt:", remTotalDebitAmt);
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

  handleBillselectionCredit = (id, index, status) => {
    console.log("id,index,status", id, index, status);
    let {
      billLst,
      selectedBillsCredit,
      totalDebitAmt,
      invoiceBillLst,
      debitBillLst,
      selectedBills,
    } = this.state;
    console.log({
      billLst,
      selectedBillsCredit,
      totalDebitAmt,
      invoiceBillLst,
      debitBillLst,
      selectedBills,
    });
    let remTotalDebitAmt = totalDebitAmt;
    let f_selectedBills = selectedBillsCredit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsCredit.length > 0) {
        if (!selectedBillsCredit.includes(id)) {
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

      console.log("selectedBills", selectedBills);
      console.log("f_billLst", f_billLst);
      let debitTotalAmt = 0;
      let creditTotalAmt = 0;
      f_billLst.map((v, i) => {
        if (v.source == "sales_invoice") {
          if (selectedBills.includes(parseInt(v.invoice_id))) {
            debitTotalAmt += parseFloat(v.paid_amt);
          }
        } else if (v.source == "credit_note") {
          if (selectedBillsCredit.includes(parseInt(v.credit_note_id))) {
            creditTotalAmt += parseFloat(v.credit_paid_amt);
          }
        }
      });
      console.log("debitTotalAmt", debitTotalAmt);

      remTotalDebitAmt =
        parseFloat(remTotalDebitAmt) +
        parseFloat(debitTotalAmt) -
        parseFloat(creditTotalAmt);

      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          if (f_selectedBills.includes(v.credit_note_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.total_amt;
              pamt = v.total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["credit_paid_amt"] = pamt;
            v["credit_remaining_amt"] =
              parseFloat(v.total_amt) - parseFloat(pamt);
            this.setState({
              selectedAmt: pamt,
              remainingAmt: parseFloat(v["total_amt"]) - parseFloat(pamt),
            });
            if (v["credit_remaining_amt"] > 0) {
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
                    console.log(
                      "this.ref.current====>>>????",
                      this.ref.current
                    );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["credit_remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;

                    console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["credit_paid_amt"] = v["total_amt"];
                    v["credit_remaining_amt"] = 0;
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
                  },
                  handleFailFn: () => {},
                },
                () => {
                  console.warn("return_data");
                }
              );
            }
          } else {
            v["credit_paid_amt"] = 0;
            v["credit_remaining_amt"] = parseFloat(v.total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.credit_note_id)) {
            v["credit_paid_amt"] = parseFloat(v.total_amt);
            v["credit_remaining_amt"] =
              parseFloat(v["total_amt"]) - parseFloat(v.total_amt);
          } else {
            v["credit_paid_amt"] = 0;
            v["credit_remaining_amt"] = parseFloat(v.total_amt);
          }
        }

        return v;
      });
    } else {
      if (status == true) {
        if (selectedBillsCredit.length > 0) {
          if (!selectedBillsCredit.includes(id)) {
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
          if (f_selectedBills.includes(v.credit_note_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.total_amt;
              pamt = v.total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["credit_paid_amt"] = pamt;
            v["credit_remaining_amt"] =
              parseFloat(v.total_amt) - parseFloat(pamt);

            if (v["credit_remaining_amt"] > 0) {
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
                    console.log(
                      "this.ref.current====>>>????",
                      this.ref.current
                    );

                    let payAmt = parseFloat(this.ref.current.values.payableAmt);
                    let remAmt = parseFloat(v["credit_remaining_amt"]);
                    remTotalDebitAmt = payAmt + remAmt;

                    console.log("remTotalDebitAmt:", remTotalDebitAmt);
                    this.ref.current.setFieldValue(
                      "payableAmt",
                      isNaN(remTotalDebitAmt) ? 0 : remTotalDebitAmt
                    );
                    v["credit_paid_amt"] = v["total_amt"];
                    v["remTotalDebitAmt"] = 0;
                    this.setState({ totalDebitAmt: remTotalDebitAmt });
                  },
                  handleFailFn: () => {},
                },
                () => {
                  console.warn("return_data");
                }
              );
            }
          } else {
            v["credit_paid_amt"] = 0;
            v["credit_remaining_amt"] = parseFloat(v.total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.credit_note_no)) {
            v["credit_paid_amt"] = parseFloat(v.total_amt);
            v["credit_remaining_amt"] =
              parseFloat(v["total_amt"]) - parseFloat(v.total_amt);
          } else {
            v["credit_paid_amt"] = 0;
            v["credit_remaining_amt"] = parseFloat(v.total_amt);
          }
        }

        return v;
      });
    }

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsCredit: f_selectedBills,
      billLst: f_billLst,
    });
  };

  handleBillsSelectionAllCredit = (status) => {
    let { billLst } = this.state;
    console.log("bill check", { billLst });
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["total_amt"]) - parseFloat(v.total_amt);

        return v;
      });

      console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (v.source == "credit_note") {
          v["credit_paid_amt"] = 0;
          v["credit_remaining_amt"] = parseFloat(v.total_amt);
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
    let { billLstSc, selectedBillscredit } = this.state;
    console.log({ id, index, status });
    let f_selectedBills = selectedBillscredit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillscredit.length > 0) {
        console.log("selectedBillscredit", selectedBillscredit);
        if (!selectedBillscredit.includes(id)) {
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
      selectedBillscredit: f_selectedBills,
      billLstSc: f_billLst,
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
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            // ledgerList: res.list,
            ledgerList: res.list.filter((v) => v.type == "SD"),
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {});
  };

  handleBillsSelectionAllDebit = (status) => {
    let { billLstSc } = this.state;
    let fBills = billLstSc;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLstSc.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLstSc);
      fBills = billLstSc.map((v) => {
        if (v.source === "debit_note") {
          v["debit_paid_amt"] = parseFloat(v.Total_amt);
          v["debit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
          return v;
        }

        return v;
      });

      console.log("fBills", fBills);
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

  finalBillAmt = () => {
    const { billLst, billLstSc } = this.state;
    console.log({ billLst, billLstSc });
    let advanceAmt = this.state.advanceAmt;
    let paidAmount = 0;
    if (advanceAmt != 0) {
      billLst.map((next) => {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      });
      paidAmount = paidAmount + advanceAmt;
    } else {
      billLst.map((next) => {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      });
    }

    let creditPaidAmount = 0;
    billLst.map((next) => {
      if ("credit_paid_amt" in next) {
        creditPaidAmount =
          creditPaidAmount +
          parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0);
      }
    });

    // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });

    if (paidAmount >= creditPaidAmount) {
      let amt = paidAmount - creditPaidAmount;
      return amt;
      // billLst.map((v, i) => {
      //   v['paid_amt'] = paidAmount - debitPaidAmount;
      //   return v;
      // });
      // this.handleChangeArrayElement(amt);
    } else {
      return "Go To Payment";
    }
  };

  finalRemainingBillAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

    let remainingAmt = 0;
    billLst.map((next) => {
      if ("remaining_amt" in next) {
        remainingAmt =
          remainingAmt +
          parseFloat(next.remaining_amt ? next.remaining_amt : 0);
      }
    });

    let creditRemainingAmount = 0;
    billLst.map((next) => {
      if ("credit_remaining_amt" in next) {
        creditRemainingAmount =
          creditRemainingAmount +
          parseFloat(next.credit_remaining_amt ? next.credit_remaining_amt : 0);
      }
    });

    let amt = remainingAmt + creditRemainingAmount;
    return amt;
    // billLst.map((v, i) => {
    //   v['paid_amt'] = paidAmount - debitPaidAmount;
    //   return v;
    // });
    // this.handleChangeArrayElement(amt);
  };

  finalInvoiceBillAmt = () => {
    const { billLst, billLstSc } = this.state;
    console.log({ billLst, billLstSc });
    let advanceAmt = this.state.advanceAmt;

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });
    if (advanceAmt != 0) {
      paidAmount = paidAmount + advanceAmt;
    }

    return isNaN(paidAmount) ? 0 : paidAmount;

    // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });
  };
  finalCreditBillAmt = () => {
    const { billLst, billLstSc } = this.state;
    console.log({ billLst, billLstSc });

    let creditPaidAmount = 0;
    billLst.map((next) => {
      if ("credit_paid_amt" in next) {
        creditPaidAmount =
          creditPaidAmount +
          parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0);
      }
    });
    return creditPaidAmount;

    // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });
  };

  FetchPendingBills = (id, type, balancing_method, value) => {
    console.log("balancing_method ", balancing_method, type);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    getdebtorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          console.log("data", data);
          // if (data.length > 0) {
          if (balancing_method === "bill-by-bill" && type === "SD") {
            let invoiceBillLst = data.filter(
              (v) => v.source == "sales_invoice"
            );
            let creditBillLst = data.filter((v) => v.source == "credit_note");
            this.setState({
              billLst: data,
              billadjusmentmodalshow: true,
              selectedBills: [],
              selectedBillscredit: [],
              isAdvanceCheck: false,
              isInvoiceExist: invoiceBillLst.length > 0 ? true : false,
              isCreditExist: creditBillLst.length > 0 ? true : false,
            });
          } else if (balancing_method === "bill-by-bill" && type === "SC") {
            this.setState({
              billLstSc: data,
              billadjusmentDebitmodalshow: true,
              selectedBills: [],
              selectedBillscredit: [],
              isAdvanceCheck: false,
            });
          } else if (balancing_method === "on-account") {
            this.setState({
              billLst: data,
              onaccountmodal: false,
              selectedBills: [],
              selectedBillscredit: [],
              isAdvanceCheck: false,
            });
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
        console.log("Pending Order Response", response);
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
  handleBillByBillDebitSubmit = (v) => {
    let { index, rows, billLstSc } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

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
      payableAmt,
      selectedAmt,
      remainingAmt,
      isAdvanceCheck,
    } = this.state;
    console.log("billLst", billLst);
    console.log("index", index);
    console.log("rows", rows);
    let bills;

    let frow = rows.map((vi, ii) => {
      // if(billLst.paid_amt>0){
      //   let selBillList = billLst;
      //   console.log("SelBillList==???::::",selBillList);
      // }
      let f_billLst = billLst.filter(
        (vf) => vf.paid_amt > 0 || vf.credit_paid_amt > 0
      );
      bills = f_billLst;
      console.log("f_billLst==???::::", f_billLst);
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);
        vi["perticulars"]["billids"] = f_billLst;

        // vi["billids"] = billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["payableAmt"] = parseFloat(payableAmt != null ? payableAmt : 0);
        vi["selectedAmt"] = selectedAmt;
        vi["remainingAmt"] = remainingAmt;
        vi["isAdvanceCheck"] = isAdvanceCheck;
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
        payableAmt: 0,
        selectedAmt: 0,
        remainingAmt: 0,
        isAdvanceCheck: false,
        selectedBillsData: bills,
      },
      () => {
        this.setState({ billadjusmentmodalshow: false, index: -1 });
      }
    );
  };
  handleBillsSelectionAll = (status) => {
    let { billLst, selectedBills } = this.state;
    console.log("Status==>>>", status);
    console.log("billLst---", billLst);
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_id);
      fBills = billLst.map((v) => {
        if (v.source === "sales_invoice") {
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);

          return v;
        }
        return v;
      });

      console.log("lst", lstSelected);
    } else {
      fBills = billLst.map((v) => {
        if (v.source === "sales_invoice") {
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }

        return v;
      });

      console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      selectedBills: lstSelected,
      billLst: fBills,
    });
  };

  finalBillSelectedAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });
    let amt = 0;
    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount =
          paidAmount +
          (parseInt(next.invoice_id) != 0
            ? parseFloat(next.paid_amt ? next.paid_amt : 0)
            : 0);
      }
    });
    let debitPaidAmount = 0;
    billLst.map((next) => {
      if ("credit_paid_amt" in next) {
        debitPaidAmount =
          debitPaidAmount +
          parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0);
      }
    });

    let totalAdvanceAmt = this.state.advanceAmt;
    if (totalAdvanceAmt != 0) {
      amt = paidAmount + debitPaidAmount + totalAdvanceAmt;
    } else {
      amt = paidAmount + debitPaidAmount;
    }
    return amt;
  };

  finalRemaningSelectedAmt = () => {
    let paidAmt = this.state.totalDebitAmt;
    let selectedAmt = this.finalBillSelectedAmt();

    console.log("paidAmt", paidAmt);
    console.log("selectedAmt", selectedAmt);
    if (paidAmt != 0) {
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
    // this.setState({ selAmtDisa: selectedAmt });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // console.log("In A Receipt Creating Page");
      this.setreceiptlastrecords();
      this.lstgetsundrydebtors_indirectexpenses();
      this.lstgetcashAcbankaccount();
      this.transaction_ledger_listFun();

      this.initRows();

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

  // alt key button disabled start
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleAltKeyDisable);
  }
  // alt key button disabled end

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

    console.log({ element, value, index });
    let { rows, ledgerList, selectedLedger } = this.state;
    console.log("ledgerData", { selectedLedger });
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      console.log("v-type => ", v["type"]);
      // console.log("i => ", { v, i });
      if (v["type"] == "cr") {
        // debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        if (index + 1 == i) {
          v["type"] = "dr";
        }
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
          // v["perticularsId"]=selectedLedger.id;
          v["paid_amt"] = value;
          console.log("Dr value", value);
        } else if (element == "credit") {
          // v["perticularsId"]=selectedLedger.id;
          v["paid_amt"] = value;
          console.log("cr value", value);
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

    console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    console.log("lastCrBal ", lastCrBal);

    console.log("frows", { frows });

    if (element == "perticulars") {
      let obj = rows.find((v, i) => i == index);
      console.log("obj", obj);

      if (obj.type == "cr") {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancingMethod
        );
      } else if (obj.type == "dr") {
        console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
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
      // if (i == index) {
      //   if (element == "debit") {
      //     v["paid_amt"] = value;
      //     console.log("Dr value", value);
      //   } else if (element == "credit") {
      //     v["paid_amt"] = value;
      //     console.log("cr value", value);
      //   }
      //   v[element] = value;
      //   return v;
      // } else {
      return v;
      // }
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
    console.log("serial no", rows);
    console.log({ element, index });
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
        console.log("On account -->", v);
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

  handleBankAccountCashAccSubmit = (element, v) => {
    // debugger;

    let { index, rows, paidAmount } = this.state;
    console.log("vv---", v, paidAmount);
    console.log("rows--", rows, index);
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        // v['paid_amt'] = v['paid_amt'];

        return v;
      } else {
        return vi;
      }
    });
    this.setState(
      {
        rows: frow,
        index: index,
      },
      () => {
        this.setState({ bankaccmodal: false, index: -1, ledgerModal: false });
      }
    );
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
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["total_amt"]) - parseFloat(value);
      }
      return v;
    });
    let fDBilllst = billLstSc.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "debit_note") {
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
    this.setState({ billLstSc: fDBilllst });
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
    console.log("Total Debtors ", rows);
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "dr") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });
    return isNaN(creditamt) ? 0 : creditamt;
  };
  // New code
  getCurrentOpt = (index) => {
    let { rows, sundryCreditorLst, cashAcbankLst } = this.state;

    // console.log({ sundryCreditorLst });
    // console.log({ cashAcbankLst });
    let currentObj = rows.find((v, i) => i == index);
    // console.log('currentObject', currentObj);
    if (currentObj.type == "cr") {
      return sundryCreditorLst;
    } else if (currentObj.type == "dr") {
      return cashAcbankLst;
    }
    return [];
  };
  // ! function set border to required fields
  setErrorBorder(index, value, stateVal) {
    // let { [stateVal]} = this.state;
    let errorArrayData = [];
    if (this.state[stateVal].length > 0) {
      errorArrayData = this.state[stateVal];
      if (this.state[stateVal].length >= index) {
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

    this.setState({ [stateVal]: errorArrayData });
  }
  handleAdvaceCheck = (status) => {
    let { billLst, selectedBills } = this.state;
    console.log("billLst", billLst);
    if (status) {
      let advanceAmt = this.finalRemaningSelectedAmt();
      let remTotalDebitAmt = advanceAmt;
      if (parseFloat(advanceAmt) > 0) {
        let obj = billLst.find((v) => v.source == "sales_invoice");
        let newObj = { ...obj };
        newObj["amount"] = advanceAmt;
        newObj["paid_amt"] = advanceAmt;
        newObj["credit_paid_amt"] = 0;
        newObj["credit_remaining_amt"] = 0;
        newObj["invoice_date"] = moment(new Date()).format("YYYY-MM-DD");
        newObj["invoice_id"] = 0;
        newObj["invoice_no"] = "New Ref";
        newObj["remaining_amt"] = 0;
        newObj["total_amt"] = advanceAmt;
        let fBilllst = [...billLst, newObj];
        let f_selectedBills = [
          ...selectedBills,
          parseInt(newObj["invoice_id"]),
        ];

        this.setState({
          billLst: fBilllst,
          isAdvanceCheck: true,
          selectedBills: f_selectedBills,
        });
      }
    } else if (status == false) {
      console.log("selectedBills", selectedBills);
      // let advance = billLst.find((v) => parseInt(v.invoice_id) == 0);
      // console.log("advance==>>>>>>>>>>", advance);
      selectedBills = selectedBills.filter((v) => parseInt(v) != 0);
      billLst = billLst.filter((v) => parseInt(v.invoice_id) != 0);

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
              selectedBills.includes(parseInt(v.invoice_id))
          );
          this.handleBillselection(obj.invoice_id, 0, true);
        }
      );
    }
  };

  handleTableRow(event) {
    const t = event.target;
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
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedgerData = JSON.parse(
          cuurentProduct.getAttribute("value")
        );
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
      }
    }
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

  handleCashLstChange = (e) => {
    // debugger;
    let { orgCashList, orgLedgerList } = this.state;
    console.log("ALLL LIST============::", orgLedgerList);
    if (orgCashList.length > 0) {
      const selectedCashAll = e.target.value;
      console.log("selectedCashAll============||||||||::", selectedCashAll);
      let filterLst = orgCashList;
      let filterAllLst = orgLedgerList;
      console.log("ALLL LIST============||||||||::", filterLst);
      if (selectedCashAll === "Cash/Bank") {
        // filterLst = filterLst.filter((v) => v.type == "cr" || "dr");
        this.setState({
          selectedCashAll: selectedCashAll,
          cashAcbankLst: filterLst,
        });
        // alert(JSON.stringify(filterLst.length));
      } else if (orgLedgerList.length > 0) {
        this.setState({
          selectedCashAll: selectedCashAll,
          cashAcbankLst: filterAllLst,
        });
        // alert(JSON.stringify(ledgerList.length));
      }
    }
  };

  render() {
    const {
      invoice_data,
      invoiceedit,
      createproductmodal,
      adjusmentbillmodal,
      billadjusmentmodalshow,
      billadjusmentDebitmodalshow,
      bankledgershow,
      bankchequeshow,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      rowIndex,
      amtledgershow,
      selectedBills,
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
      selectedPendingOrder,
      initVal,
      sundryindirect,
      billLst,
      cashAcbankLst,
      accountLst,
      isAllCheckeddebit,
      voucher_data,
      voucher_edit,
      sundryCreditorLst,
      show,
      crshow,
      cashAccLedgerLst,
      onaccountcashaccmodal,
      bankaccmodal,
      isDisabled,
      selectedBillsdebit,
      selectedBillsCredit,
      billLstSc,
      ledgerModal,
      ledgerList,
      ledgerData,
      selectedLedger,
      objCR,
      errorArrayBorder,
      errorArrayBorderBillbyBill,
      paidAmount,
      isAdvanceCheck,
      selectedBillsData,
      selectedAll,
      isInvoiceExist,
      isCreditExist,
      selectedCashAll,
    } = this.state;
    return (
      <div className="accountentrystyles">
        {/* <h6>Purchase Invoice</h6> */}
        <div className="cust_table">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initVal}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   // receipt_sr_no: Yup.string()
            //   //   .trim()
            //   //   .required("Receipt  no is required"),
            //   // transaction_dt: Yup.string().required(
            //   //   "Transaction date is required"
            //   // ),
            //   // sundryindirectid: Yup.string().required().value,
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // debugger;
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
                    let data;
                    // debugger;
                    console.log("values--------", values);
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
                          // debugger;
                          let requestData = new FormData();
                          this.setState({
                            invoice_data: values,
                          });

                          let filterRow = rows.filter((v) => {
                            if (v.bank_payment_type != null) {
                              v.bank_payment_type = v.bank_payment_type.value;
                            }
                            return v;
                          });
                          // if (creditamt == debitamt) {
                          let frow = filterRow.filter((v) => v.type != "");
                          let formData = new FormData();

                          console.log("frow >>>>>>>>>>>>>>>>>>>>>>>>", {
                            frow,
                          });
                          frow = frow.map((v, i) => {
                            // debugger;
                            console.log("under frow v ===:::::", v);
                            if (
                              v.perticulars &&
                              v.perticulars.balancingMethod == "bill-by-bill"
                            ) {
                              let billRow = [];
                              v.perticulars &&
                                v.perticulars.billids &&
                                v.perticulars.billids.map((vi, ii) => {
                                  // debugger;
                                  if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                    billRow.push(vi);
                                    // return vi;
                                  } else if (
                                    "credit_paid_amt" in vi &&
                                    vi["credit_paid_amt"] > 0
                                  ) {
                                    // return vi;
                                    billRow.push({
                                      credit_note_id: vi.credit_note_id,
                                      amount: vi.Total_amt,

                                      invoice_date: moment(
                                        vi.credit_note_date
                                      ).format("YYYY-MM-DD"),
                                      credit_note_no: vi.credit_note_no,
                                      source: vi.source,
                                      credit_paid_amt: vi.credit_paid_amt,
                                      credit_remaining_amt:
                                        vi.credit_remaining_amt,
                                    });
                                  } else if (
                                    "debit_paid_amt" in vi &&
                                    vi["debit_paid_amt"] > 0
                                  ) {
                                    // return vi;
                                    billRow.push({
                                      invoice_id: vi.credit_note_no,
                                      amount: vi.Total_amt,

                                      invoice_date: moment(
                                        vi.debit_note_date
                                      ).format("YYYY-MM-DD"),
                                      invoice_no: vi.debit_note_no,
                                      source: vi.source,
                                      paid_amt: vi.debit_paid_amt,
                                      remaining_amt: vi.debit_remaining_amt,
                                    });
                                  }
                                });

                              // console.log("billRow", JSON.stringify(billRow));
                              let perObj = {
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                                payableAmt: v.payableAmt,
                                remainingAmt: v.remainingAmt,
                                selectedAmt: v.selectedAmt,
                                isAdvanceCheck: v.isAdvanceCheck,
                                billids: billRow,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
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
                                perticulars: perObj,
                              };
                            }
                          });
                          console.log("frow ---------", frow);

                          var filtered = frow.filter(function (el) {
                            return el != null;
                          });
                          formData.append("row", JSON.stringify(frow));
                          console.log("Data row ", JSON.stringify(frow));
                          // formData.append('rows', JSON.stringify(frow));
                          console.log("rows", rows);
                          formData.append(
                            "transaction_dt",
                            moment(values.transaction_dt, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )
                          );
                          // console.log(
                          //   "custName Name",
                          //   values.ledger_name && values.ledger_name != ""
                          //     ? values.ledger_name
                          //     : null
                          // );
                          // formData.append("custName", values.ledger_name);
                          formData.append(
                            "receipt_sr_no",
                            values.receipt_sr_no
                          );
                          formData.append("receipt_code", values.receipt_code);
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);
                          formData.append("payableAmt", this.state.payableAmt);
                          formData.append(
                            "selectedAmt",
                            this.state.selectedAmt
                          );
                          formData.append(
                            "remainingAmt",
                            this.state.remainingAmt
                          );
                          formData.append("advanceAmt", this.state.advanceAmt);
                          formData.append(
                            "isAdvance",
                            this.state.isAdvanceCheck
                          );

                          if (values.narration != null) {
                            formData.append("narration", values.narration);
                          }
                          // console.log(formData);
                          for (var pair of formData.entries()) {
                            console.log(pair[0] + ", " + pair[1]);
                          }

                          create_receipts(formData)
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
                                this.initRows();
                                eventBus.dispatch(
                                  "page_change",
                                  "voucher_receipt_list"
                                );
                              } else {
                                setSubmitting(false);
                                if (response.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    // msg: response.message,
                                    msg: " Please Select Ledger First",
                                    is_timeout: true,
                                    delay: 1500,

                                    // is_button_show: true,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: " Please Select Ledger First",
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
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
              setFieldValue,
            }) => (
              // <div className="institute-head p-0 m-3">
              // <Row>
              //   <Col md="12">
              <Form
                onSubmit={handleSubmit}
                noValidate
                className=""
                style={{ overflowY: "hidden", overflowX: "hidden" }}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="institute-head p-2">
                  <Row className="">
                    <Col md="1" className="my-auto">
                      <Form.Label className="pt-0 lbl">
                        Voucher Sr. No123.
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md="2">
                      <Form.Control
                        autoFocus
                        type="text"
                        name="receipt_sr_no"
                        id="receipt_sr_no"
                        className="text-box"
                        onChange={handleChange}
                        value={values.receipt_sr_no}
                        isValid={touched.receipt_sr_no && !errors.receipt_sr_no}
                        isInvalid={!!errors.receipt_sr_no}
                        readOnly={true}
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
                        Receipt No.
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md="2">
                      <Form.Control
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#f5f5f5",
                          // /readonly,
                        }}
                        type="text"
                        readOnly={true}
                        placeholder="1234"
                        className="mb-0"
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
                      {/* <Form.Control
                        type="date"
                        name="transaction_dt"
                        id="transaction_dt"
                        onChange={handleChange}
                        value={values.transaction_dt}
                        isValid={
                          touched.transaction_dt && !errors.transaction_dt
                        }
                        isInvalid={!!errors.transaction_dt}
                        // readOnly={true}
                        className="date-style"
                      /> */}

                      <Form.Group
                        onKeyDown={(e) => {
                          if (e.shiftKey && e.key === "Tab") {
                          } else if (
                            e.key === "Tab" &&
                            values.transaction_dt === "__/__/____"
                          ) {
                            e.preventDefault();
                          }

                          if (e.shiftKey && e.key === "Tab") {
                            let datchco = e.target.value.trim();
                            console.log("datchco", datchco);
                            let checkdate = moment(e.target.value).format(
                              "DD/MM/YYYY"
                            );
                            console.log("checkdate", checkdate);
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
                          } else if (e.key === "Tab") {
                            let datchco = e.target.value.trim();
                            console.log("datchco", datchco);
                            let checkdate = moment(e.target.value).format(
                              "DD/MM/YYYY"
                            );
                            console.log("checkdate", checkdate);
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
                            values.transaction_dt == "" &&
                            errorArrayBorder[0] == "Y"
                              ? "border border-danger tnx-pur-inv-date-style"
                              : "tnx-pur-inv-date-style"
                          }`}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.shiftKey && e.key === "Tab") {
                              let datchco = e.target.value.trim();
                              console.log("datchco", datchco);
                              let checkdate = moment(e.target.value).format(
                                "DD/MM/YYYY"
                              );
                              console.log("checkdate", checkdate);
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
                            } else if (e.key === "Tab") {
                              let datchco = e.target.value.trim();
                              console.log("datchco", datchco);
                              let checkdate = moment(e.target.value).format(
                                "DD/MM/YYYY"
                              );
                              console.log("checkdate", checkdate);
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
                            }
                          }}
                          onBlur={(e) => {
                            console.log("e ", e);
                            console.log("e.target.value ", e.target.value);
                            if (
                              e.target.value != null &&
                              e.target.value != ""
                            ) {
                              this.setErrorBorder(0, "", "errorArrayBorder");
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
                                setFieldValue("transaction_dt", e.target.value);
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
                              this.setErrorBorder(0, "Y", "errorArrayBorder");
                              // document
                              //   .getElementById("transaction_dt")
                              //   .focus();
                            }
                          }}
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
                          console.log("e ", e);
                          console.log("e.target.value ", e.target.value);
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
                            this.tranDateRef
                            .current?.focus();
                          }
                       
                        }}
                        // onBlur={(e) => {
                        //   e.preventDefault();
                        //   if (e.target.value) {
                        //     this.setErrorBorder(0, "");
                        //   } else {
                        //     this.setErrorBorder(0, "Y");
                        //     document
                        //       .getElementById("transaction_dt")
                        //       .focus();
                        //   }
                        // }}
                      /> */}
                      <Form.Control.Feedback type="invalid">
                        {errors.transaction_dt}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </div>
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new1"
                  // style={{ maxHeight: "67vh", height: "67vh" }}
                >
                  {/* {JSON.stringify(rows)} */}
                  <Table size="sm" className="tbl-font mt-2 mb-2">
                    <thead>
                      <tr>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          Type
                        </th>
                        <th style={{ width: "70%", textAlign: "center" }}>
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
                          className="pl-4"                        >
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
                                  width: "10%",
                                }}
                              >
                                <Form.Control
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
                                </Form.Control>
                                {/* <Form.Group>
                                    <Select
                                      styles={customStyles1}
                                      className="selectTo"
                                      options={selectOpt}
                                      onChange={(v) => {
                                        setFieldValue("drCr", v);
                                      }}
                                      
                                      name="drCr"
                                      id="drCr"
                                      value={values.drCr}
                                          // value={this.setElementValue("type", ii)}
                                      placeholder="select type"
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        )
                                          e.preventDefault();
                                      }}
                                    /> 
                                  </Form.Group>*/}
                              </td>

                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
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
                                    console.log("In a Particular On Change.!");
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
                                  className="tnx-pur-inv-text-box"
                                  placeholder=" "
                                  name="perticulars"
                                  id="perticulars"
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.ledgerModalFun(true, ii);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalFun(true, ii);
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    )
                                      e.preventDefault();
                                  }}
                                  value={
                                    rows[ii]["perticulars"]
                                      ? rows[ii]["perticulars"]["ledger_name"]
                                      : ""
                                  }
                                  readOnly={true}
                                />
                              </td>

                              <td
                                style={{
                                  width: "10%",
                                }}
                              >
                                <Form.Control
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    if (v != null) {
                                      this.handleChangeArrayElement(
                                        "debit",
                                        v,
                                        ii
                                      );
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
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    // this.setState({ totalDebitAmt: v });
                                    // this.handleBillByBill("debit", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("debit", ii)}
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
                              <td
                                style={{
                                  width: "10%",
                                }}
                              >
                                <Form.Control
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleChangeArrayElement(
                                      "credit",
                                      v,
                                      ii
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    )
                                      e.preventDefault();
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("credit", ii)}
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
                            </tr>
                          );
                        })}
                      <tr className="entryrow">
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            as="select"
                            placeholder="select type"
                          ></Form.Control>
                        </td>
                        <td
                          style={{
                            width: "70%",
                            background: "#f5f5f5",
                          }}
                        >
                          {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            isClearable
                          /> */}
                        </td>

                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                      </tr>
                      <tr className="entryrow">
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            as="select"
                            placeholder="select type"
                          ></Form.Control>
                        </td>
                        <td
                          style={{
                            width: "70%",
                            background: "#f5f5f5",
                          }}
                        >
                          {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            isClearable
                          /> */}
                        </td>

                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                      </tr>
                      <tr className="entryrow">
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            as="select"
                            placeholder="select type"
                          ></Form.Control>
                        </td>
                        <td
                          style={{
                            width: "70%",
                            background: "#f5f5f5",
                          }}
                        >
                          {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            isClearable
                          /> */}
                        </td>

                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                        <td style={{ width: "10%" }}>
                          <Form.Control
                            type="text"
                            style={{ textAlign: "center" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                    <thead style={{ borderTop: "2px solid transparent" }}>
                      <tr style={{ background: "#DDE2ED" }}>
                        <td className="pr-2 qtotalqty" style={{ width: "10%" }}>
                          {" "}
                        </td>
                        <td
                          style={{
                            width: "70%",
                            textAlign: "end",
                            fontWeight: "500",
                          }}
                        >
                          {" "}
                          Total
                        </td>
                        <td
                          style={{
                            width: "10 %",
                          }}
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
                          />
                        </td>
                        <td style={{ width: "10%" }}>
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
                          />
                        </td>
                        {/* <td></td> */}
                      </tr>
                    </thead>
                  </Table>
                </div>
                <Row className="mb-2 px-2">
                  <Col sm={9}>
                    <Row className="mt-2">
                      <Col sm={1}>
                        <Form.Label className="text-label">
                          Narration:
                        </Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control
                          // as="textarea"
                          type="text"
                          // style={{ height: "72px", resize: "none" }}
                          placeholder="Enter Narration"
                          className="text-box"
                          autoComplete="true"
                          id="narration"
                          onChange={handleChange}
                          // rows={5}
                          // cols={25}
                          name="narration"
                          value={values.narration}
                        />
                        {/* <Form.Control
                          as="textarea"
                          resize="none"
                          placeholder="Enter Narration"
                          style={{ height: "72px" }}
                          className="text-box"
                          id="narration"
                          onChange={handleChange}
                          name="narration"
                          value={values.narration}
                        /> */}
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <div className="voucher-info-table">
                        <Table>
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Invoice No</th>
                              <th>Invoice Date</th>
                              <th>Amount</th>
                              <th>Paid Amd</th>
                              <th>Remaning Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBillsData.length > 0 ? (
                              selectedBillsData.map((v, i) => {
                                if (v.source == "sales_invoice") {
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
                                } else {
                                  return (
                                    <tr>
                                      <td>{v.source}</td>
                                      <td>{v.credit_note_no}</td>

                                      <td>
                                        {moment(v.credit_note_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </td>
                                      <td>{v.amount}</td>
                                      <td>{v.credit_paid_amt}</td>
                                      <td>{v.credit_remaining_amt}</td>
                                      {/* <td>{v.rate}</td> */}
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
                          </tbody>
                        </Table>
                      </div>
                    </Row>
                  </Col>
                </Row>
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
                              name="narration"
                              onChange={handleChange}
                              style={{ width: "100%" }}
                              className="purchace-text"
                              value={values.narration}
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
                              eventBus.dispatch(
                                "page_change",
                                "voucher_receipt_list"
                              );
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
                                eventBus.dispatch(
                                  "page_change",
                                  "voucher_receipt_list"
                                );
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

                <Row className="mx-0 footerstyle">
                  <Col md="2" className="px-0">
                    <Form.Label className="btmstylelbl">
                      <img src={keyboard} className="svg-style mt-0 mx-2"></img>
                      New entry: <span className="shortkey">Ctrl + N</span>
                    </Form.Label>
                  </Col>
                  <Col md="8">
                    <Form.Label className="btmstylelbl">
                      Duplicate: <span className="shortkey">Ctrl + D</span>
                    </Form.Label>
                  </Col>
                  {/* <Col md="8"></Col> */}
                  <Col md="2" className="text-end">
                    <img src={question} className="svg-style ms-1"></img>
                  </Col>
                </Row>
                {/* </div> */}
              </Form>
              //   </Col>
              // </Row>
              // </div>
            )}
          </Formik>
        </div>
        {/* ledgr Modal */}
        <Modal
          show={ledgerModal}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
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
                this.transaction_ledger_listFun();
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
                    autoFocus={true}
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              {objCR && objCR.type == "cr" ? (
                <>
                  <Col lg={1}>
                    <Form.Label>Filter</Form.Label>
                  </Col>
                  <Col lg={2}>
                    <Form.Group className="">
                      <Form.Select
                        className="selectTo"
                        styles={ledger_select}
                        onChange={this.handleLstChange}
                        value={selectedAll}
                        style={{ boxShadow: "none" }}
                      >
                        <option
                          value="Debitor"
                          // selected={
                          //   ledgerList.filterListSales == "SD" ? true : false
                          // }
                        >
                          Debitor
                        </option>
                        <option
                          value="Creditor"
                          // selected={
                          //   ledgerList.filterListSales == "SC" ? true : false
                          // }
                        >
                          Creditor
                        </option>

                        <option value="All">All</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              ) : (
                <>
                  <Col lg={1}>
                    <Form.Label>Filter</Form.Label>
                  </Col>
                  <Col lg={2}>
                    <Form.Group className="">
                      <Form.Select
                        className="selectTo"
                        styles={ledger_select}
                        onChange={this.handleCashLstChange}
                        value={selectedCashAll}
                        style={{ boxShadow: "none" }}
                      >
                        <option
                          value="Cash/Bank"
                          selected
                          // selected={
                          //   ledgerList.filterListSales == "SC" ? true : false
                          // }
                        >
                          Cash/Bank Acc
                        </option>

                        <option value="All">All</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col lg={2}>
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
                        invoice_data:
                          this.myRef != null && this.myRef.current
                            ? this.myRef.current.values
                            : "",
                        from_page: "voucher_receipt",
                      };
                      eventBus.dispatch("page_change", {
                        from: "voucher_receipt",
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
              <Table className="">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Ledger Name</th>
                    <th>Ledger Group</th>
                    <th>City</th>
                    <th>Contact No.</th>
                    <th>Current Balance</th>
                    <th></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* {JSON.stringify(objCR)} */}
                <tbody
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {objCR && objCR.type == "cr" ? (
                    <>
                      {ledgerList.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`productTr_` + i}
                            prId={v.id}
                            tabIndex={i}
                            className={`${
                              JSON.stringify(v) ==
                              JSON.stringify(selectedLedger)
                                ? "selected-tr"
                                : ""
                            }`}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              // console.log(
                              //   "selectedLedger",
                              //   { selectedLedger },
                              //   i,
                              //   rowIndex
                              // );
                              // console.log("rows123", rows);
                              // if (selectedLedger != "") {
                              //   rows[rowIndex]["perticulars"] =
                              //     selectedLedger.ledger_name;
                              //   rows[rowIndex]["perticularsId"] =
                              //     selectedLedger.id;
                              //   rows[rowIndex]["balancingMethod"] =
                              //     selectedLedger.balancingMethod;
                              //   let debitAmt = rows[rowIndex]["paid_amt"];
                              //   // rows[rowIndex]["balancing_method"] =
                              //   //   selectedLedger.balancingMethod;
                              //   rows[rowIndex]["type"] = selectedLedger.type;
                              //   // rows[rowIndex]["id"] = selectedLedger.id;

                              //   console.log(
                              //     "invoice_data rows[rowIndex]d",
                              //     debitAmt,
                              //     rows
                              //   );
                              //   this.setState({
                              //     paidAmount: debitAmt,
                              //     rows: rows,
                              //     ledgerList: ledgerList,
                              //     ledgerModal: false,
                              //     selectedLedger: selectedLedger,
                              //     // rowIndex: -1,
                              //   });
                              // }

                              this.handleChangeArrayElement(
                                "perticulars",
                                v,
                                rowIndex
                              );

                              // this.setState({ totalDebitAmt: v });
                              this.handleBillByBill("debit", v, rowIndex);

                              this.setState({ ledgerModal: false });
                              console.log("v===>>::", v);
                              this.transaction_ledger_listFun();
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
                            <td className="ps-3">
                              {v.type === "SD"
                                ? "Debitor"
                                : v.type === "SC"
                                ? "Creditor"
                                : v.type}
                            </td>

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
                                      from_page: "voucher_receipt",
                                    };

                                    let data = {
                                      source: source,
                                      id: v.id,
                                    };
                                    console.log({ data });
                                    eventBus.dispatch("page_change", {
                                      from: "voucher_receipt",
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
                    </>
                  ) : (
                    <>
                      {/* {JSON.stringify(paidAmount)} */}
                      {cashAcbankLst.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`productTr_` + i}
                            prId={v.id}
                            tabIndex={i}
                            className={`${
                              JSON.stringify(v) ==
                              JSON.stringify(selectedLedger)
                                ? "selected-tr"
                                : ""
                            }`}
                            onDoubleClick={(e) => {
                              e.preventDefault();

                              this.handleChangeArrayElement(
                                "perticulars",
                                v,
                                rowIndex
                              );
                              this.setState({ ledgerModal: false }, () => {
                                if (v.type == "bank_account") {
                                  this.setState({
                                    bankaccmodal: true,
                                    rows: rows,
                                  });
                                }
                              });
                              console.log("v===>>::", v);
                              this.transaction_ledger_listFun();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("vvv", { v });
                              rows[rowIndex]["perticulars"] = v.ledger_name;

                              // if (v.type == "bank_account") {
                              //   this.setState({
                              //     bankaccmodal: true,
                              //     rows: rows,
                              //   });
                              // }

                              // this.setState({ selectedLedger: v }, () => {
                              //   this.transaction_ledger_detailsFun(v.id);
                              // });
                            }}
                          >
                            <td className="ps-3">{v.code}</td>
                            <td className="ps-3">{v.ledger_name}</td>
                            <td className="ps-3">{v.ledger_group}</td>
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
                                      from_page: "voucher_receipt",
                                    };

                                    let data = {
                                      source: source,
                                      id: v.id,
                                    };
                                    console.log({ data });
                                    eventBus.dispatch("page_change", {
                                      from: "voucher_receipt",
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
                    </>
                  )}

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
            {/* <div className="mt-5">
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
              </div> */}
            <div className="ledger_details_style">
              <Row className="mx-1 ">
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0 ">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td>GST No.:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.gst_number : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Licence No.:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.license_number : ""}
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td>FSSAI:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.fssai_number : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td>Contact Person:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.contact_name : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Area:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.area : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Route:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.route : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0 ">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td>Credit Days:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.credit_days : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Transport:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.route : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Bank:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.bank_name : ""}
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
        {/* Bill adjusment modal start */}
        <Modal
          show={billadjusmentmodalshow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          // className="transaction_mdl invoice-mdl-style mainmodal"
          className="voucher-mdl-account-entry"
          onHide={() => this.setState({ billadjusmentmodalshow: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            // closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 mdl"
          >
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-1"
            >
              Bill By Bill
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.setState({ billadjusmentmodalshow: false })}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-0 p-invoice-modal tnx-pur-inv-mdl-body  ">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={initVal}
              innerRef={this.ref}
              // initialValues={this.getElementObject(this.state.index)}
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
                  <div className="pt-2">
                    <Row>
                      <Col lg={3} md={3} sm={3} xs={3}>
                        <Row>
                          <Col
                            lg={4}
                            md={4}
                            sm={4}
                            xs={4}
                            className="pe-0 ps-4"
                          >
                            <Form.Label>Payable Amt </Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Payable Amt."
                                name="payableAmt"
                                id="payableAmt"
                                autoComplete="nope"
                                autoFocus="true"
                                className="text-box  text-end"
                                // innerRef={(payableAmt) => {
                                //   this.ref.current = payableAmt;
                                // }}
                                // onChange={handleChange}
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
                                // className={`${
                                //   values.payableAmt == "" &&
                                //   errorArrayBorderBillbyBill[0] == "t"
                                //     ? "border border-danger text-box text-end"
                                //     : "text-box  text-end"
                                // }`}
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   if (e.target.value) {
                                //     this.setErrorBorder(
                                //       0,
                                //       "",
                                //       "errorArrayBorderBillbyBill"
                                //     );
                                //   } else {
                                //     this.setErrorBorder(
                                //       0,
                                //       "t",
                                //       "errorArrayBorderBillbyBill"
                                //     );
                                //     //   document
                                //     //     .getElementById("companyName")
                                //     //     .focus();
                                //   }
                                // }}
                                // onKeyDown={(e) => {
                                //   if (e.shiftKey && e.key === "Tab") {
                                //   } else if (
                                //     e.key === "Tab" &&
                                //     !e.target.value
                                //   )
                                //     e.preventDefault();
                                // }}
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
                          <Col lg={4} md={4} sm={4} xs={4} className="ps-0">
                            <Form.Label>Selected Amt</Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Selected Amt."
                                name="selectedAmt"
                                id="selectedAmt"
                                autoComplete="nope"
                                disabled
                                className="text-box  text-end"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  e.preventDefault();
                                  let v = e.target.value;
                                  // {
                                  //   this.finalBillInvoiceAmt();
                                  // }
                                  setFieldValue("selectedAmt", e);
                                  console.log("selecteddddddddddddamt==??", e);
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
                          <Col lg={4} md={4} sm={4} xs={4} className="ps-0">
                            <Form.Label>Remaining Amt </Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Remaining Amt."
                                name="remainingAmt"
                                id="remainingAmt"
                                autoComplete="nope"
                                disabled
                                className="text-box  text-end"
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
                          className="pmt-allbtn"
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
                            // onChange={handleChange}
                            // style={{
                            //   verticalAlign: "middle !important",
                            // }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {isInvoiceExist == true ? (
                    <>
                      <Row>
                        <Col md="5" className="m-2 mb-0">
                          <p className="mb-0 billhead">
                            <b>Invoice List : </b>
                          </p>
                        </Col>
                        <Col md="7" className="outstanding_title"></Col>
                      </Row>
                      <div>
                        {billLst.length > 0 && (
                          <div className="tnx-pur-inv-ModalStyle ">
                            <Table className="mb-0">
                              <thead>
                                <tr>
                                  <th style={{ width: "24%" }}>
                                    <Form.Group
                                      controlId="formBasicCheckbox"
                                      className="ml-1 mb-1 pmt-allbtn"
                                    >
                                      <Form.Check
                                        label="Invoice No."
                                        type="checkbox"
                                        checked={
                                          isAllChecked === true ? true : false
                                        }
                                        onChange={(e) => {
                                          this.handleBillsSelectionAll(
                                            e.target.checked
                                          );
                                        }}
                                        style={{
                                          verticalAlign: "middle !important",
                                        }}
                                      />
                                    </Form.Group>
                                    {/* <span className="pt-2 mt-2"> Invoice #.</span> */}
                                  </th>
                                  <th> Invoice Date</th>
                                  <th
                                    className="pl-2 text-center"
                                    style={{ width: "20%" }}
                                  >
                                    Amount
                                  </th>
                                  <th
                                    style={{ width: "23%" }}
                                    className="text-center"
                                  >
                                    Paid Amt
                                  </th>
                                  <th
                                    style={{ width: "14%" }}
                                    className="text-center"
                                  >
                                    Balance
                                  </th>
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
                                          className="pt-1 pr-1 pl-1 pb-0 ps-2"
                                          style={{
                                            borderRight: "1px solid #d9d9d9",
                                          }}
                                        >
                                          <Form.Group>
                                            <Form.Check
                                              id="invoice_no"
                                              name="invoice_no"
                                              type="checkbox"
                                              label={vi.invoice_no}
                                              value={vi.invoice_no}
                                              checked={selectedBills.includes(
                                                vi.invoice_id
                                              )}
                                              onChange={(e) => {
                                                // console.log("click");
                                                if (
                                                  parseInt(vi.invoice_id) != 0
                                                ) {
                                                  this.handleBillselection(
                                                    vi.invoice_id,
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
                                              disabled={
                                                parseInt(values.payableAmt) ==
                                                  this.finalBillSelectedAmt() &&
                                                parseInt(values.payableAmt) >
                                                  0 &&
                                                selectedBills.includes(
                                                  vi.invoice_id
                                                ) != true
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Form.Group>
                                          {/* {vi.invoice_no} */}
                                        </td>
                                        <td
                                          style={{
                                            borderRight: "1px solid #d9d9d9",
                                          }}
                                        >
                                          {moment(vi.invoice_dt).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </td>
                                        <td
                                          className="p-1 text-end"
                                          style={{
                                            borderRight: "1px solid #d9d9d9",
                                          }}
                                        >
                                          {parseFloat(vi.amount).toFixed(2)}{" "}
                                          {parseInt(vi.invoice_no) > 0
                                            ? "Cr"
                                            : "Dr"}
                                        </td>
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
                                            className="tnx-pur-inv-text-box text-end border-0"
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
                                          {parseFloat(vi.remaining_amt).toFixed(
                                            2
                                          )
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
                          <tfoot className="bb-total">
                            <tr style={{ background: "#cee7f1" }}>
                              <td className="bb-t" style={{ width: "24%" }}>
                                {" "}
                                <b>Total</b>
                              </td>
                              <td></td>
                              {/*<td></td> */}
                              <th className="text-end" style={{ width: "20%" }}>
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
                              </th>
                              <th className="text-end" style={{ width: "23%" }}>
                                {this.finalInvoiceBillAmt()}
                                {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                              </th>
                              <th style={{ width: "14%" }} className="text-end">
                                {" "}
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
                                  }, 0)}
                              </th>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {isCreditExist == true ? (
                    <>
                      <Row>
                        <Col md="5" className="m-2 mb-0">
                          <h6 className="billhead">
                            <b>Credit Note : </b>
                          </h6>
                        </Col>
                        <Col md="7" className="outstanding_title"></Col>
                      </Row>

                      {billLst.length > 0 && (
                        <div className="tnx-pur-inv-ModalStyle">
                          <Table className="mb-0">
                            <thead>
                              <tr>
                                <th style={{ width: "27%" }}>
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="ml-1 mb-1 pmt-allbtn"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="Credit Note No."
                                      checked={
                                        isAllCheckeddebit === true
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        this.handleBillsSelectionAllCredit(
                                          e.target.checked
                                        );
                                      }}
                                      style={{ verticalAlign: "middle" }}
                                    />
                                  </Form.Group>
                                  {/* <span className="pt-2 mt-2">
                                      {" "}
                                      Credit Note #.
                                    </span> */}
                                </th>
                                <th style={{ width: "24%" }}>
                                  {" "}
                                  credit Note Date
                                </th>
                                <th className="pl-2 text-center">Amount</th>
                                <th
                                  style={{ width: "23%" }}
                                  className="text-center"
                                >
                                  Receivable Amount
                                </th>
                                <th
                                  style={{ width: "13%" }}
                                  className="text-center"
                                >
                                  Balance
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {billLst.map((vi, ii) => {
                                if (vi.source == "credit_note") {
                                  return (
                                    <tr>
                                      {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                      <td
                                        className="pt-1 p2-1 pl-1 pb-0"
                                        style={{
                                          borderRight: "1px solid #d9d9d9",
                                        }}
                                      >
                                        <Form.Group>
                                          <Form.Check
                                            type="checkbox"
                                            label={vi.credit_note_no}
                                            value={vi.credit_note_no}
                                            checked={selectedBillsCredit.includes(
                                              vi.credit_note_id
                                            )}
                                            onChange={(e) => {
                                              this.handleBillselectionCredit(
                                                vi.credit_note_id,
                                                ii,
                                                e.target.checked
                                              );
                                            }}
                                            style={{ verticalAlign: "middle" }}
                                            disabled={
                                              parseInt(values.payableAmt) ==
                                                this.finalBillSelectedAmt() &&
                                              selectedBillsCredit.includes(
                                                vi.debit_note_id
                                              ) != true
                                                ? true
                                                : false
                                            }
                                          />
                                        </Form.Group>
                                        {/* {vi.invoice_no} */}
                                      </td>
                                      <td
                                        style={{
                                          borderRight: "1px solid #d9d9d9",
                                        }}
                                      >
                                        {moment(vi.invoice_dt).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </td>
                                      <td
                                        className="p-1 text-end"
                                        style={{
                                          borderRight: "1px solid #d9d9d9",
                                        }}
                                      >
                                        {parseFloat(vi.total_amt).toFixed(2)} Dr{" "}
                                      </td>
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
                                            vi.credit_paid_amt
                                              ? vi.credit_paid_amt
                                              : 0
                                          }
                                          className="tnx-pur-inv-text-box text-end"
                                          readOnly={
                                            !selectedBillsCredit.includes(
                                              vi.credit_note_no
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
                          </Table>
                        </div>
                      )}

                      <Table className="mb-0">
                        <tfoot className="bb-total">
                          <tr style={{ background: "#cee7f1" }}>
                            <td className="bb-t" style={{ width: "27%" }}>
                              {" "}
                              <b>Total</b>
                            </td>
                            <td style={{ width: "24%" }}></td>
                            <td></td>
                            <th className="text-end">
                              {this.finalCreditBillAmt()}
                              {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                            </th>
                            <th className="text-end" style={{ width: "13%" }}>
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
                            </th>
                          </tr>
                        </tfoot>
                      </Table>
                    </>
                  ) : (
                    ""
                  )}
                  <Table className="mb-0">
                    <tfoot className="bb-total">
                      <tr>
                        <td className="bb-t">
                          {" "}
                          <b>Grand Total</b>
                        </td>
                        {/* <td></td>
                        <td></td> */}
                        <th style={{ width: "21%" }}>
                          {this.finalBillAmt()}
                          {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                        </th>
                        <th style={{ width: "23%" }}>
                          {this.finalRemainingBillAmt()}
                        </th>
                      </tr>
                    </tfoot>
                  </Table>
                  <Row className="py-1">
                    <Col className="text-end me-2">
                      <Button className="create-btn " type="submit">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* Bill adjusment modal end */}
        {/* Bill adjusment Debit modal start */}
        <Modal
          show={billadjusmentDebitmodalshow}
          size="xl"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ billadjusmentDebitmodalshow: false })}
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
              Bill By Bill-2
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
                  console.log({ values });

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
                              <b>Debit Note </b>
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
                                          console.log("value", e.target.value);
                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            ii
                                          );
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
                                        //}
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
                          <tfoot className="bb-total">
                            <tr style={{ background: "#cee7f1" }}>
                              <td className="bb-t">
                                {" "}
                                <b>Total</b>
                              </td>
                              {/* <td></td> */}
                              <th style={{ width: "21%" }}>
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
                              <th style={{ width: "23%" }}>
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
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
            <Modal.Title id="example-custom-modal-styling-title" className="">
              On Account
            </Modal.Title>
            <CloseButton
              className="pull-right ms-0"
              onClick={(e) => {
                e.preventDefault();
                this.setState({ onaccountmodal: false });
                // productModalStateChange({ onaccountmodal: false });
              }}
            />
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

                        <Button className="create-btn" type="submit">
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
          size="lg"
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
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={this.getElementObject(this.state.index)}
                // validationSchema={Yup.object().shape({
                //   bank_payment_type: Yup.object().required("Select type"),
                //   bank_payment_no: Yup.string().required(
                //     "Transaction Number required"
                //   ),
                //   // paid_amt: Yup.string().required('Amt is required'),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.bank_payment_type == "") {
                    errorArray.push("Y");
                  } else {
                    errorArray.push("");
                  }
                  if (values.bank_payment_no == "") {
                    errorArray.push("Y");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorder: errorArray }, () => {
                    if (allEqual(errorArray)) {
                      // console.log("values", values);
                      this.handleBankAccountCashAccSubmit(
                        "perticulars",
                        values
                      );
                      this.ledgerModalFun(false);
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
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col lg={5}>
                        <Row>
                          <Col lg={3}>
                            <Form.Label>Type</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group
                              className={`${
                                values.bank_payment_type == "" &&
                                errorArrayBorder[1] == "Y"
                                  ? "border border-danger "
                                  : ""
                              }`}
                              style={{ borderRadius: "4px" }}
                            >
                              <Select
                                className="selectTo"
                                placeholder="Select"
                                styles={ledger_select}
                                isClearable
                                options={BankOpt}
                                // borderRadius="0px"
                                // colors="#729"
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
                        </Row>
                      </Col>
                      <Col md="5">
                        <Row>
                          <Col lg={3}>
                            <Form.Label className="mb-1">Number</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="bank_payment_no"
                                placeholder="Bank Payment No"
                                id="bank_payment_no"
                                // className="text-box"
                                onChange={handleChange}
                                value={values.bank_payment_no}
                                // isValid={
                                //   touched.bank_payment_no && !errors.bank_payment_no
                                // }
                                isInvalid={!!errors.bank_payment_no}
                                autoComplete="nope"
                                className={`${
                                  values.bank_payment_type == "" &&
                                  errorArrayBorder[2] == "Y"
                                    ? "border border-danger  text-box"
                                    : "text-box"
                                }`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.bank_payment_no}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      {/* <Col md="3">
                        <Form.Group>
                          <Form.Label>Paid Amount</Form.Label>
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
                      </Col> */}
                      <Col lg="2">
                        {/* <div>
                          <Form.Label style={{ color: "#fff" }}>
                            blank
                            <br />
                          </Form.Label>
                        </div> */}

                        <Button className="create-btn float-end" type="submit">
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
      </div>
    );
  }
}
