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
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import delete_icon from "@/assets/images/delete_icon 3.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import {
  getPOPendingOrderWithIds,
  getreceiptlastrecords,
  getSDIEReceipt,
  getdebtorspendingbills,
  getCBADReceipt,
  create_receipts,
} from "@/services/api_functions";

import {
  MyTextDatePicker,
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  MyNotifications,
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
export default class Receipt extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
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
      serialnopopupwindow: false,

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
    console.log("elementCheck", elementCheck);
    return elementCheck ? elementCheck : "";
  };

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
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
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
                label: v.name,
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

          console.log({ initVal });
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBillselection = (id, index, status) => {
    let { billLst, selectedBills } = this.state;
    // console.log({ id, index, status });
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
    f_billLst = f_billLst.map((v, i) => {
      if (v.source == "sales_invoice") {
        if (f_selectedBills.includes(v.invoice_no)) {
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
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
    });
  };
  handleBillselectionCredit = (id, index, status) => {
    let { billLst, selectedBillsCredit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsCredit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsCredit.length > 0) {
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
      if (v.source == "credit_note") {
        if (f_selectedBills.includes(v.credit_note_no)) {
          v["credit_paid_amt"] = parseFloat(v.Total_amt);
          v["credit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
        } else {
          v["credit_paid_amt"] = 0;
          v["credit_remaining_amt"] = parseFloat(v.Total_amt);
        }
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsCredit: f_selectedBills,
      billLst: f_billLst,
    });
  };

  handleBillsSelectionAllCredit = (status) => {
    let { billLst } = this.state;
    console.log({ billLst });
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;

        return v;
      });

      console.log("fBills", fBills);
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
    console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        console.log("selectedBillsdebit", selectedBillsdebit);
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

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });

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

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });
    return paidAmount;

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

  FetchPendingBills = (id, type, balancing_method) => {
    console.log("balancing_method", balancing_method);
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
          if (data.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SD") {
              //console.log('OPT', opt);
              this.setState({ billLst: data, billadjusmentmodalshow: true });
            } else if (balancing_method === "bill-by-bill" && type === "SC") {
              this.setState({
                billLstSc: data,
                billadjusmentDebitmodalshow: true,
              });
            } else if (balancing_method === "on-account") {
              this.setState({
                billLst: data,
                onaccountmodal: true,
              });
            }
          }
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
    let { index, rows, billLst } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

        v["perticulars"]["billids"] = billLst;
        v["paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        v["credit_paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0)
          );
        }, 0);

        let total =
          v["paid_amt"] -
          (v["credit_paid_amt"] != null ? v["credit_paid_amt"] : 0);

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
        billLst: [],
      },
      () => {
        this.setState({ billadjusmentmodalshow: false, index: -1 });
      }
    );
  };
  handleBillsSelectionAll = (status) => {
    let { billLst, selectedBills } = this.state;
    console.log("billLst---", billLst);
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => parseInt(v.invoice_no));
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(v.amount);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);

        return v;
      });

      console.log("lst", lstSelected);
    } else {
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(0);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(0);

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
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "voucher_receipt",
      to: "voucher_receipt_list",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      // console.log("In A Receipt Creating Page");
      this.setreceiptlastrecords();
      this.lstgetsundrydebtors_indirectexpenses();
      this.lstgetcashAcbankaccount();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.initRows();
    }
  }

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

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);

      if (obj.type == "cr") {
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancing_method
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
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });
    let fDBilllst = billLstSc.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "debit_note") {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
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
    // console.log("Total Credit ", rows);
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
            validationSchema={Yup.object().shape({
              receipt_sr_no: Yup.string()
                .trim()
                .required("Receipt  no is required"),
              transaction_dt: Yup.string().required(
                "Transaction date is required"
              ),
              sundryindirectid: Yup.string().required().value,
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    msg: "Do you want to save",
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
                          v.bank_payment_type = v.bank_payment_type.value;
                        }
                        return v;
                      });
                      // if (creditamt == debitamt) {
                      let frow = filterRow.filter((v) => v.type != "");
                      let formData = new FormData();

                      console.log("frow >>>>>>>>>>>>>>>>>>>>>>>>", { frow });
                      frow = frow.map((v, i) => {
                        if (
                          v.perticulars &&
                          v.perticulars.balancing_method == "bill-by-bill"
                        ) {
                          let billRow = [];
                          v.perticulars &&
                            v.perticulars.billids &&
                            v.perticulars.billids.map((vi, ii) => {
                              if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                billRow.push(vi);
                                // return vi;
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
                              } else if (
                                "debit_paid_amt" in vi &&
                                vi["debit_paid_amt"] > 0
                              ) {
                                // return vi;
                                billRow.push({
                                  invoice_id: vi.debit_note_id,
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

                          console.log("billRow", JSON.stringify(billRow));
                          let perObj = {
                            id: v.perticulars.id,
                            type: v.perticulars.type,
                            ledger_name: v.perticulars.ledger_name,
                            balancing_method: v.perticulars.balancing_method,
                            billids: billRow,
                          };
                          return {
                            type: v.type,
                            paid_amt: v.paid_amt,
                            perticulars: perObj,
                          };
                        } else if (
                          v.perticulars &&
                          v.perticulars.balancing_method == "on-account"
                        ) {
                          let perObj = {
                            id: v.perticulars.id,
                            type: v.perticulars.type,
                            ledger_name: v.perticulars.ledger_name,
                            balancing_method: v.perticulars.balancing_method,
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
                            ledger_name: v.perticulars.label,
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
                        moment().format("yyyy-MM-DD")
                      );
                      console.log(
                        "custName Name",
                        values.ledger_name && values.ledger_name != ""
                          ? values.ledger_name
                          : null
                      );
                      formData.append("custName", values.ledger_name);
                      formData.append("receipt_sr_no", values.receipt_sr_no);
                      formData.append("receipt_code", values.receipt_code);
                      let total_amt = this.getTotalDebitAmt();
                      formData.append("total_amt", total_amt);

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

                                is_button_show: true,
                              });
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: " Please Select Ledger First",
                                is_button_show: true,
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
                  is_button_show: true,
                });
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
            }) => (
              // <div className="institute-head p-0 m-3">
              // <Row>
              //   <Col md="12">
              <Form
                onSubmit={handleSubmit}
                noValidate
                className=""
                style={{ overflowY: "hidden", overflowX: "hidden" }}
              >
                <div className="institute-head p-2">
                  <Row>
                    <Col md="1" className="my-auto">
                      <Form.Label className="pt-0 lbl">
                        Voucher Sr. No.
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md="2">
                      <Form.Control
                        type="text"
                        name="receipt_sr_no"
                        id="receipt_sr_no"
                        onChange={handleChange}
                        value={values.receipt_sr_no}
                        isValid={touched.receipt_sr_no && !errors.receipt_sr_no}
                        isInvalid={!!errors.receipt_sr_no}
                        readOnly={true}
                        className="tnx-pur-inv-text-box"
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
                        type="text"
                        readOnly={true}
                        placeholder="1234"
                        value={values.receipt_code}
                        className="tnx-pur-inv-text-box mb-0"
                      />
                    </Col>
                    <Col md="1" className="my-auto">
                      <Form.Label className="pt-0 lbl">
                        Transaction Date
                        {/* <span className="pt-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md="2">
                      <MyTextDatePicker
                        innerRef={(input) => {
                          this.invoiceDateRef.current = input;
                        }}
                        className="tnx-pur-inv-date-style "
                        name="pi_transaction_dt"
                        id="pi_transaction_dt"
                        placeholder="DD/MM/YYYY"
                        dateFormat="dd/MM/yyyy"
                        value={values.pi_transaction_dt}
                        onChange={handleChange}
                        onBlur={(e) => {
                          console.log("e ", e);
                          console.log("e.target.value ", e.target.value);
                          if (e.target.value != null && e.target.value != "") {
                            console.warn(
                              "warn:: isValid",
                              moment(e.target.value, "DD-MM-YYYY").isValid()
                            );
                            if (
                              moment(e.target.value, "DD-MM-YYYY").isValid() ==
                              true
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
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.transaction_dt}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </div>
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new"
                  // style={{ maxHeight: "67vh", height: "67vh" }}
                >
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
                                >
                                  <option value=""></option>
                                  <option value="dr">Dr</option>
                                  <option value="cr" selected>
                                    Cr
                                  </option>
                                </Form.Control>
                              </td>

                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              >
                                <Select
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
                                      "debit",
                                      v,
                                      ii
                                    );
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("debit", ii)}
                                  readOnly={
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
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("credit", ii)}
                                  readOnly={
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
                    <thead>
                      <tr style={{ background: "#DDE2ED" }}>
                        <td className="pr-2 qtotalqty" style={{ width: "10%" }}>
                          {" "}
                          Total
                        </td>
                        <td style={{ width: "70%" }}></td>
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
                          as="textarea"
                          placeholder="Enter Narration"
                          style={{ height: "72px", resize: "none" }}
                          className="text-box"
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
                    <Button className="successbtn-style me-2" type="submit">
                      Submit
                    </Button>

                    <Button
                      className="cancel-btn"
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
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
                <Row className="footerstyle">
                  <Col md="1" className="pe-0">
                    <Form.Label className="btmstylelbl">
                      <img
                        src={keyboard}
                        className="svg-style mt-0"
                        style={{ borderRight: "1px solid #c7c7c7" }}
                      ></img>
                      New entry:<span className="shortkey">Ctrl+N</span>
                    </Form.Label>
                  </Col>
                  <Col md="9">
                    {" "}
                    <Form.Label className="btmstylelbl">
                      Duplicate: <span className="shortkey">Ctrl+D</span>
                    </Form.Label>
                  </Col>
                  {/* <Col md="8"></Col> */}
                  <Col md="2" className="text-end">
                    <img
                      src={question}
                      className="svg-style ms-1"
                      style={{ borderLeft: "1px solid #c7c7c7" }}
                    ></img>
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

        {/* Bill adjusment modal start */}
        <Modal
          show={billadjusmentmodalshow}
          size="lg"
          // className="transaction_mdl invoice-mdl-style mainmodal"
          className="voucher-mdl-product"
          onHide={() => this.setState({ billadjusmentmodalshow: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            closeButton
            // closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 mdl"
          >
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Bill By Bill
            </Modal.Title>
            {/* <CloseButton
              variant="white"
              className="pull-right"
              //  onClick={this.handleClose}
              onClick={() => this.billadjusmentmodalshow(false)}
            /> */}
          </Modal.Header>
          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={this.getElementObject(this.state.index)}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log({ values });

                this.handleBillByBillSubmit(values);
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
                  {billLst.length > 0 && (
                    <div className="table_wrapper1">
                      <Row>
                        <Col md="5" className="m-2">
                          <h6>
                            <b>Invoice List : </b>
                          </h6>
                        </Col>
                        <Col md="7" className="outstanding_title"></Col>
                      </Row>
                      <div className="tnx-pur-inv-ModalStyle ">
                        <Table hover>
                          <thead>
                            <tr>
                              <th className="">
                                <Form.Group
                                  controlId="formBasicCheckbox"
                                  className="ml-1 mb-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    label="Invoice #."
                                    type="checkbox"
                                    checked={
                                      isAllChecked === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAll(
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </Form.Group>
                                {/* <span className="pt-2 mt-2"> Invoice #.</span> */}
                              </th>
                              <th> Invoice Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>

                          <tbody>
                            {billLst.map((vi, ii) => {
                              if (vi.source == "sales_invoice") {
                                return (
                                  <tr>
                                    {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                    <td className="pt-1 p2-1 pl-1 pb-0 ps-2">
                                      <Form.Group>
                                        <Form.Check
                                          type="checkbox"
                                          label={vi.invoice_no}
                                          value={vi.invoice_no}
                                          checked={selectedBills.includes(
                                            vi.invoice_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselection(
                                              vi.invoice_no,
                                              ii,
                                              e.target.checked
                                            );
                                          }}
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
                                      {parseFloat(vi.amount).toFixed(2)} Cr{" "}
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
                                        value={vi.paid_amt ? vi.paid_amt : 0}
                                        className="tnx-pur-inv-text-box"
                                        readOnly={
                                          !selectedBills.includes(vi.invoice_no)
                                        }
                                        style={{ background: "white" }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(vi.remaining_amt).toFixed(2)
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
                    </div>
                  )}
                  <Table className="mb-2">
                    <tfoot className="bb-total">
                      <tr style={{ background: "#cee7f1" }}>
                        <td className="bb-t">
                          {" "}
                          <b>Total</b>
                        </td>
                        {/* <td></td>
                        <td></td> */}
                        <th style={{ width: "21%" }}>
                          {this.finalInvoiceBillAmt()}
                          {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                        </th>
                        <th style={{ width: "23%" }}>
                          {" "}
                          {billLst.length > 0 &&
                            billLst.reduce(function (prev, next) {
                              return parseFloat(
                                parseFloat(prev) +
                                  parseFloat(
                                    next.remaining_amt ? next.remaining_amt : 0
                                  )
                              ).toFixed(2);
                            }, 0)}
                        </th>
                      </tr>
                    </tfoot>
                  </Table>

                  <Row md="8">
                    <Col md="7" className="m-2">
                      <h6>
                        <b>Credit Note : </b>
                      </h6>
                    </Col>
                    <Col md="7" className="outstanding_title"></Col>
                  </Row>

                  {billLst.length > 0 && (
                    <div className="tnx-pur-inv-ModalStyle ">
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
                                  label="Credit Note #."
                                  checked={
                                    isAllCheckeddebit === true ? true : false
                                  }
                                  onChange={(e) => {
                                    this.handleBillsSelectionAllCredit(
                                      e.target.checked
                                    );
                                  }}
                                />
                              </Form.Group>
                              {/* <span className="pt-2 mt-2">
                                      {" "}
                                      Credit Note #.
                                    </span> */}
                            </th>
                            <th> credit Note Dt</th>
                            <th className="pl-2">Amt</th>
                            <th style={{ width: "23%" }}>Receivable Amt</th>
                            <th>Remaining Amt</th>
                          </tr>
                        </thead>

                        <tbody>
                          {billLst.map((vi, ii) => {
                            if (vi.source == "credit_note") {
                              return (
                                <tr>
                                  {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
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
                                      />
                                    </Form.Group>
                                    {/* {vi.invoice_no} */}
                                  </td>
                                  <td>
                                    {moment(vi.invoice_dt).format("DD-MM-YYYY")}
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
                                        vi.credit_paid_amt
                                          ? vi.credit_paid_amt
                                          : 0
                                      }
                                      className="tnx-pur-inv-text-box"
                                      readOnly={
                                        !selectedBillsCredit.includes(
                                          vi.credit_note_no
                                        )
                                      }
                                      style={{ background: "white" }}
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
                      </Table>
                    </div>
                  )}

                  <Table className="mb-2">
                    <tfoot className="bb-total">
                      <tr style={{ background: "#cee7f1" }}>
                        <td className="bb-t">
                          {" "}
                          <b>Total</b>
                        </td>
                        {/* <td></td>
                        <td></td> */}
                        <th style={{ width: "21%" }}>
                          {this.finalCreditBillAmt()}
                          {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                        </th>
                        <th style={{ width: "23%" }}>
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

                  <Table className="mb-2">
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

                  <Button className="create-btn float-end mb-2" type="submit">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
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
                            <h6>
                              <b>Debit Note : </b>
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
                                      isAllCheckeddebit === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAllDebit(
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </Form.Group>
                                <span className="pt-2 mt-2">
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
                                        readOnly={
                                          !selectedBillsdebit.includes(
                                            vi.debit_note_no
                                          )
                                        }
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
          size="lg"
          className="invoice-mdl-style"
          onHide={() => this.setState({ bankaccmodal: false })}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          keyboard={false}
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
                validationSchema={Yup.object().shape({
                  bank_payment_type: Yup.object().required("Select type"),
                  bank_payment_no: Yup.string().required(
                    "Transaction Number required"
                  ),
                  // paid_amt: Yup.string().required('Amt is required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log("values", values);
                  this.handleBankAccountCashAccSubmit(values);
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
                      <Col md="3">
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
                            placeholder="Bank Payment No"
                            id="bank_payment_no"
                            onChange={handleChange}
                            value={values.bank_payment_no}
                            isValid={
                              touched.bank_payment_no && !errors.bank_payment_no
                            }
                            isInvalid={!!errors.bank_payment_no}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bank_payment_no}
                          </Form.Control.Feedback>
                        </Form.Group>
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
                      <Col md="6">
                        {/* <div>
                          <Form.Label style={{ color: "#fff" }}>
                            blank
                            <br />
                          </Form.Label>
                        </div> */}

                        <Button
                          className="successbtn-style float-end mt-4"
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
        {/* On Account payment- Bank Acc - Payable amount */}
      </div>
    );
  }
}
