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

import {
  getPOPendingOrderWithIds,
  getpaymentinvoicelastrecords,
  getsundrycreditorsindirectexpenses,
  getcreditorspendingbills,
  getcashAcbankaccount,
  create_payments,
  transaction_ledger_details,
  transaction_ledger_list,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  MyTextDatePicker,
  isActionExist,
  allEqual,
} from "@/helpers";
// import { type } from 'os';

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
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
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
export default class Payment extends React.Component {
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
      ledgerModal: false,
      ledgerData: "",
      ledgerList: [],
      selectedBillsdebit: [],
      selectedBillsCredit: [],
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
      serialnopopupwindow: false,

      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      isAllCheckeddebit: false,
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
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck : "";
  };

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
    this.setState({ rows: frows }, () => {});
  };

  lstgetsundrycreditors_indirectexpenses = () => {
    getsundrycreditorsindirectexpenses()
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
  setpaymentinvoiceSerialNo = () => {
    getpaymentinvoicelastrecords()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          //initVal['payment_sr_no'] = res.count;
          initVal["payment_sr_no"] = res.payment_sr_no;
          initVal["payment_code"] = res.payment_code;

          console.log({ initVal });
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBillselectionCredit = (id, index, status) => {
    let { billLstSc, selectedBillsCredit } = this.state;
    console.log({ id, index, status });
    let f_selectedBills = selectedBillsCredit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillsCredit.length > 0) {
        console.log("selectedBillsCredit", selectedBillsCredit);
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
      console.log("All BillLst Selection", billLstSc);
      fBills = billLstSc.map((v) => {
        if (v.source === "credit_note") {
          v["credit_paid_amt"] = parseFloat(v.Total_amt);
          v["credit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

          return v;
        }

        return v;
      });

      console.log("fBills", fBills);
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
    console.log("balancing_method", balancing_method);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    getcreditorspendingbills(reqData)
      .then((response) => {
        // debugger;
        let res = response.data;
        console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          console.log("data", data);
          if (data.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SC") {
              //console.log('OPT', opt);
              let invoiceBillLst = data.filter(
                (v) => v.source == "pur_invoice"
              );
              let debitBillLst = data.filter((v) => v.source == "debit_note");
              this.setState({ billLst: data, billadjusmentmodalshow: true });
            } else if (balancing_method === "bill-by-bill" && type === "SD") {
              this.setState({
                billLstSc: data,
                billadjusmentCreditmodalshow: true,
              });
            } else {
              if (balancing_method === "on-account")
                this.setState({
                  billLst: data,
                  onaccountmodal: false,
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

  handleBillByBillCreditSubmit = (v) => {
    let { index, rows, billLstSc } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

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
    let { index, rows, billLst } = this.state;

    let frow = rows.map((vi, ii) => {
      let f_billLst = billLst.filter((vf) => vf.paid_amt != 0);
      console.log("f_billLst==???::::", f_billLst);
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

        vi["perticulars"]["billids"] = f_billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        vi["debit_paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.debit_paid_amt ? next.debit_paid_amt : 0)
          );
        }, 0);

        console.log({ v });

        let total =
          vi["paid_amt"] -
          (vi["debit_paid_amt"] != null ? vi["debit_paid_amt"] : 0);

        // v['debit'] = vi.paid_amt; original code
        vi["debit"] = total;
        vi["paid_amt"] = total;
      }
      return vi;
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
  finalBillAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });

    let debitPaidAmount = 0;
    billLst.map((next) => {
      if ("debit_paid_amt" in next) {
        debitPaidAmount =
          debitPaidAmount +
          parseFloat(next.debit_paid_amt ? next.debit_paid_amt : 0);
      }
    });

    console.log({ paidAmount, debitPaidAmount });

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
    console.log({ billLst });

    let remainingAmt = 0;
    billLst.map((next) => {
      if ("remaining_amt" in next) {
        remainingAmt =
          remainingAmt +
          parseFloat(next.remaining_amt ? next.remaining_amt : 0);
      }
    });

    let debitRemainingAmount = 0;
    billLst.map((next) => {
      if ("debit_remaining_amt" in next) {
        debitRemainingAmount =
          debitRemainingAmount +
          parseFloat(next.debit_remaining_amt ? next.debit_remaining_amt : 0);
      }
    });

    let amt = remainingAmt + debitRemainingAmount;
    return amt;
    // billLst.map((v, i) => {
    //   v['paid_amt'] = paidAmount - debitPaidAmount;
    //   return v;
    // });
    // this.handleChangeArrayElement(amt);
  };

  // finalRemainingAmt = () => {
  //   const { selectedAmt, totalDebitAmt } = this.state;
  //   console.log({ selectedAmt, totalDebitAmt });
  //   let totalRemainingAmt = 0;
  //   let debitAmt = totalDebitAmt;
  //   let selectRAmt = selectedAmt;
  //   totalRemainingAmt = debitAmt - selectRAmt;
  //   return totalRemainingAmt;
  // };

  finalBillInvoiceAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });
    this.setState({ selectedAmt: paidAmount });
    return paidAmount;
  };

  finalBillDebitAmt = () => {
    const { billLst } = this.state;
    console.log({ billLst });

    let debitPaidAmount = 0;
    billLst.map((next) => {
      if ("debit_paid_amt" in next) {
        debitPaidAmount =
          debitPaidAmount +
          parseFloat(next.debit_paid_amt ? next.debit_paid_amt : 0);
      }
    });
    return debitPaidAmount;
  };
  handleBillselection = (id, index, status) => {
    console.log("id,status,index", id, status, index);
    let {
      billLst,
      selectedBills,
      selectedBillsdebit,
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

    if (selectedBillsdebit.length > 0) {
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
          } else {
            v["paid_amt"] = 0;
            v["remaining_amt"] = parseFloat(v.amount);
          }
        } else {
          if (f_selectedBills.includes(v.invoice_id)) {
            v["paid_amt"] = parseFloat(v.amount);
            v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
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
    console.log("id,index,status", id, index, status);
    let {
      billLst,
      selectedBillsdebit,
      totalDebitAmt,
      invoiceBillLst,
      debitBillLst,
      selectedBills,
    } = this.state;
    console.log({
      billLst,
      selectedBillsdebit,
      totalDebitAmt,
      invoiceBillLst,
      debitBillLst,
      selectedBills,
    });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLst;
    if (selectedBillsdebit.length > 0) {
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
      let debitBills = debitBillLst.filter((v) =>
        selectedBills.includes(parseInt(v.invoice_id))
      );
      console.log("debitBills", debitBills);
      let remTotalDebitAmt = totalDebitAmt;

      f_billLst = f_billLst.map((v, i) => {
        if (remTotalDebitAmt > 0) {
          if (f_selectedBills.includes(v.debit_note_id)) {
            let pamt = 0;
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.Total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.Total_amt;
              pamt = v.Total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["debit_paid_amt"] = pamt;
            v["debit_remaining_amt"] =
              parseFloat(v.Total_amt) - parseFloat(pamt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.Total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.debit_note_id)) {
            v["debit_paid_amt"] = parseFloat(v.Total_amt);
            v["debit_remaining_amt"] =
              parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.Total_amt);
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
            if (parseFloat(remTotalDebitAmt) > parseFloat(v.Total_amt)) {
              remTotalDebitAmt = remTotalDebitAmt - v.Total_amt;
              pamt = v.Total_amt;
            } else {
              pamt = remTotalDebitAmt;
              remTotalDebitAmt = 0;
            }
            v["debit_paid_amt"] = pamt;
            v["debit_remaining_amt"] =
              parseFloat(v.Total_amt) - parseFloat(pamt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.Total_amt);
          }
        } else {
          if (f_selectedBills.includes(v.debit_note_id)) {
            v["debit_paid_amt"] = parseFloat(v.Total_amt);
            v["debit_remaining_amt"] =
              parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
          } else {
            v["debit_paid_amt"] = 0;
            v["debit_remaining_amt"] = parseFloat(v.Total_amt);
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
      lstSelected = billLst.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
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
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handleBillsSelectionAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_no);
      console.log("All BillLst Selection", billLst);
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

      console.log("fBills", fBills);
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

            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {});
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
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // console.log('bal', bal);
      } else if (v["type"] == "cr") {
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

      if (obj.type == "dr") {
        this.FetchPendingBills(
          selectedLedger.id,
          selectedLedger.type,
          selectedLedger.balancingMethod,
          value
        );
      } else if (obj.type == "cr") {
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setpaymentinvoiceSerialNo();
      this.lstgetsundrycreditors_indirectexpenses();
      this.lstgetcashAcbankaccount();
      this.transaction_ledger_listFun();

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
    console.log("rows", rows);
    let frows = rows.map((v, i) => {
      console.log("v-type => ", v["type"]);
      console.log("i => ", { v, i });
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // console.log('bal', bal);
      } else if (v["type"] == "cr") {
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

      if (obj.type == "dr") {
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancing_method
        );
      } else if (obj.type == "cr") {
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
    const { billLst, debitBills, billLstSc } = this.state;
    console.log("billLstSc", billLstSc);
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "pur_invoice") {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "debit_note") {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    let fDBilllst = billLstSc.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);

      if (i == index && v.source == "credit_note") {
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
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
      if (v.type == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
      }
    });
    return isNaN(debitamt) ? 0 : debitamt;
  };
  getTotalCreditAmt = () => {
    let { rows } = this.state;
    console.log("Total Credit ", rows);
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "cr") {
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
  render() {
    const {
      invoice_data,
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
      isAllCheckeddebit,
      selectedPendingOrder,
      initVal,
      sundryindirect,
      billLst,
      billLstSc,
      cashAcbankLst,
      accountLst,
      debitBills,
      selectedBillsCredit,
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
      selectedLedger,
      objCR,
      rowIndex,
      errorArrayBorder,
    } = this.state;
    return (
      <div className="accountentrystyles">
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
              let errorArray = [];
              if (
                values.transaction_dt == "" ||
                values.transaction_dt == "__/__/____"
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
                          console.log("frow", frow);

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
                                perticulars: perObj,
                              };
                            }
                          });
                          console.log("frow ---------", frow);

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

                          if (values.narration != null) {
                            formData.append("narration", values.narration);
                          }
                          // console.log("Debit total amt", this.getTotalDebitAmt());
                          // console.log("credit total amt", this.getTotalCreditAmt());
                          create_payments(formData)
                            .then((response) => {
                              console.log("response", response);
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

                                eventBus.dispatch("page_change", {
                                  from: "voucher_payment",
                                  to: "voucher_paymentlist",
                                  isNewTab: false,
                                });
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
                                    is_button_show: true,
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
                // className="common-form-style form-style"
                style={{ overflow: "hidden" }}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="institute-head p-2">
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
                        className="tnx-pur-inv-text-box"
                        placeholder=" "
                        name="payment_sr_no"
                        id="payment_sr_no"
                        onChange={handleChange}
                        value={values.payment_sr_no}
                        isValid={touched.payment_sr_no && !errors.payment_sr_no}
                        isInvalid={!!errors.payment_sr_no}
                        readOnly={true}
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
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#ffffff",
                          // /readonly,
                        }}
                        type="text"
                        disabled
                        placeholder="1234"
                        className="tnx-pur-inv-text-box mb-0"
                        value={values.payment_code}
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
                          value={values.pi_transaction_dt}
                          className={`${
                            errorArrayBorder[0] == "Y"
                              ? "border border-danger tnx-pur-inv-date-style"
                              : "tnx-pur-inv-date-style"
                          }`}
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
                                  is_button_show: true,
                                });
                                this.invoiceDateRef.current.focus();
                                setFieldValue("pi_transaction_dt", "");
                              }
                            } else {
                              setFieldValue("pi_transaction_dt", "");
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
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new"
                  // style={{ maxHeight: "60vh", height: "60vh" }}
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
                        <th
                          style={{ width: "10%", textAlign: "center" }}
                          className="pl-4"
                        >
                          Debit &nbsp;
                        </th>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          Credit &nbsp;
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
                                  className="tnx-pur-inv-text-box"
                                  placeholder=" "
                                  name="perticulars"
                                  id="perticulars"
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.ledgerModalFun(true, ii);
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
                                    this.handleChangeArrayElement(
                                      "debit",
                                      v,
                                      ii
                                    );
                                  }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    console.log("vi", vi);
                                    // if (vi.type == "dr") {
                                    //   // this.setState({ totalDebitAmt: v });
                                    //   this.handleBillByBill("debit", v, ii);
                                    // }
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("debit", ii)}
                                  readOnly={
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
                                    this.setElementValue("type", ii) == "cr"
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
                    <thead style={{ borderTop: "2px solid transparent" }}>
                      <tr style={{ background: "#dde2ed" }}>
                        <td
                          className="pr-2 qtotalqty"
                          style={{
                            width: "10%",
                          }}
                        >
                          Total
                        </td>
                        <td
                          style={{
                            width: "70%",
                          }}
                        ></td>

                        <td
                          style={{
                            width: "10%",
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
                        <td
                          style={{
                            width: "10%",
                          }}
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
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col className="text-end">
                    <Button className="successbtn-style" type="submit">
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
                            msg: "Do you want to cancel",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              eventBus.dispatch(
                                "page_change",
                                "voucher_paymentlist"
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
                  <Col md="2" className="pe-0">
                    <Form.Label className="btmstylelbl">
                      <img
                        src={keyboard}
                        className="svg-style mt-0"
                        style={{ borderRight: "1px solid #c7c7c7" }}
                      ></img>
                      New entry:<span className="shortkey">Ctrl+N</span>
                    </Form.Label>
                  </Col>
                  <Col md="8">
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
                {/* <div className="summery mx-2 p-2 invoice-btm-style">
                  <Row>
                    <Col md="10">
                      <div className="summerytag narrationdiv">
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
                      </div>
                    </Col>
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
                              from: "voucher_payment",
                              to: "voucher_paymentlist",
                              isNewTab: false,
                            });
                          }}
                          className="mt-4"
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="9"></Col>
                  </Row>
                </div> */}
              </Form>
            )}
          </Formik>
        </div>
        {/* Bill adjusment modal start */}
        <Modal
          show={billadjusmentmodalshow}
          size="xl"
          className="voucher-mdl-account-entry"
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
                console.log("billbybilldata--", { values });
                this.setState({
                  paidAmount: values.paid_amt,
                  totalDebitAmt: 0,
                });

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
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>
                          Payable Amt{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Payable Amt."
                          name="payableAmt"
                          id="payableAmt"
                          // onChange={handleChange}
                          onChange={(e) => {
                            e.preventDefault();
                            let v = e.target.value;

                            this.setState({ totalDebitAmt: v });
                          }}
                          value={values.payableAmt}
                          isValid={touched.payableAmt && !errors.payableAmt}
                          isInvalid={!!errors.payableAmt}
                        />
                        <span className="text-danger errormsg">
                          {errors.payableAmt}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>
                          Selected Amt{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Selected Amt."
                          name="selectedAmt"
                          id="selectedAmt"
                          // onChange={handleChange}
                          onChange={(e) => {
                            e.preventDefault();
                            // let v = e.target.value;
                            // {
                            //   this.finalBillInvoiceAmt();
                            // }
                          }}
                          value={this.finalBillInvoiceAmt()}
                          isValid={touched.selectedAmt && !errors.selectedAmt}
                          isInvalid={!!errors.selectedAmt}
                        />
                        <span className="text-danger errormsg">
                          {errors.selectedAmt}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>
                          Remaining Amt{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Payable Amt."
                          name="remainingAmt"
                          id="remainingAmt"
                          // onChange={handleChange}
                          onChange={(e) => {
                            e.preventDefault();
                            let v = e.target.value;
                          }}
                          value={values.remainingAmt}
                          // value={this.finalRemainingAmt()}
                          isValid={touched.remainingAmt && !errors.remainingAmt}
                          isInvalid={!!errors.remainingAmt}
                        />
                        <span className="text-danger errormsg">
                          {errors.remainingAmt}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="5" className="m-2">
                      <p className="mb-0 billhead">
                        <b>Invoice List : </b>
                      </p>
                    </Col>
                    <Col md="7" className="outstanding_title"></Col>
                  </Row>
                  <div>
                    {billLst.length > 0 && (
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
                                    type="checkbox"
                                    label="Invoice #."
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
                              </th>
                              <th> Invoice Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>
                          {/* {JSON.stringify(billLst)} */}
                          <tbody>
                            {billLst.map((vi, ii) => {
                              if (vi.source == "pur_invoice") {
                                // JSON.stringify("")
                                return (
                                  <tr>
                                    {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                    <td className="pt-1 pr-1 pl-1 pb-0 ps-2">
                                      <Form.Group>
                                        <Form.Check
                                          type="checkbox"
                                          label={vi.invoice_no}
                                          value={vi.invoice_no}
                                          checked={selectedBills.includes(
                                            vi.invoice_id
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselection(
                                              vi.invoice_id,
                                              ii,
                                              e.target.checked
                                            );
                                          }}
                                          style={{
                                            verticalAlign: "middle !important",
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
                                        className="paidamttxt"
                                        // readOnly={
                                        //   !selectedBills.includes(vi.invoice_no)
                                        // }
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
                    )}
                    <Table className="mb-0">
                      <tfoot className="bb-total">
                        <tr style={{ background: "#cee7f1" }}>
                          <td className="bb-t">
                            {" "}
                            <b>Total</b>
                          </td>
                          {/* <td></td>
                            <td></td> */}

                          {/* <td colSpan={2}></td> */}
                          <th style={{ width: "23%" }}>
                            {" "}
                            {billLst.length > 0 &&
                              billLst.reduce(function (prev, next) {
                                return parseFloat(
                                  parseFloat(prev) +
                                    parseFloat(next.amount ? next.amount : 0)
                                ).toFixed(2);
                              }, 0)}
                          </th>

                          <th style={{ width: "22%" }}>
                            {this.finalBillInvoiceAmt()}
                          </th>
                          <th style={{ width: "23%" }}>
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

                  <Row>
                    <Col md="5" className="m-2">
                      <p className="mb-0 billhead">
                        <b>Debit Note : </b>
                      </p>
                    </Col>
                    <Col md="7" className="outstanding_title"></Col>
                  </Row>
                  <div>
                    {billLst.length > 0 && (
                      // billLst.map((vi, ii) => {
                      //   if (vi.source == 'debit_note') {
                      //     return (
                      <div className="tnx-pur-inv-ModalStyle ">
                        {/* <Row md="8">
                                <Col md="7" className="mb-2">
                                  <h6>
                                    <b>Debit Note : </b>
                                  </h6>
                                </Col>
                                <Col md="7" className="outstanding_title"></Col>
                              </Row> */}
                        <Table className="mb-2">
                          <thead>
                            <tr>
                              <th className="">
                                <Form.Group
                                  controlId="formBasicCheckbox"
                                  className="ml-1 mb-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    label="Debit Note #."
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
                              </th>
                              <th> Debit Note Dt</th>
                              <th className="pl-2">Amt</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>

                          <tbody>
                            {billLst.map((vi, ii) => {
                              if (vi.source == "debit_note") {
                                return (
                                  <tr>
                                    {/* <pre>{JSON.stringify(vi, undefined, 2)}</pre> */}
                                    <td className="pt-1 p2-1 pl-1 pb-0 ps-2">
                                      <Form.Group>
                                        <Form.Check
                                          type="checkbox"
                                          label={vi.debit_note_no}
                                          value={vi.debit_note_no}
                                          checked={selectedBillsdebit.includes(
                                            vi.debit_note_id
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectiondebit(
                                              vi.debit_note_id,
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
                                        className="tnx-pur-inv-text-box"
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
                        </Table>
                      </div>
                    )}
                    <Table className="mb-0">
                      <tfoot className="bb-total">
                        <tr style={{ background: "#cee7f1" }}>
                          <td className="bb-t">
                            {" "}
                            <b>Total</b>
                          </td>
                          {/* <td></td>
                        <td colSpan={2}></td> */}

                          <th style={{ width: "22%" }}>
                            {this.finalBillDebitAmt()}
                          </th>
                          <th style={{ width: "21%" }}>
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
                          </th>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>

                  {/* } })} */}
                  <Table className="mb-2">
                    <tfoot className="bb-total">
                      <tr>
                        <td colSpan={2} className="bb-t">
                          {" "}
                          <b>Grand Total</b>
                        </td>
                        {/* <td></td>
                        <td colSpan={2}></td> */}

                        <th style={{ width: "22%" }}>{this.finalBillAmt()}</th>
                        {/* <th>{this.handleBillRemainingselection()}</th> */}
                        <th style={{ width: "21%" }}>
                          {this.finalRemainingBillAmt}
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
              Bill By Bill---1
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
                    {/* <div className="pmt-select-ledger"> */}

                    {/* <pre>{JSON.stringify(billLst)}</pre> */}
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
                          <tfoot className="bb-total">
                            <tr style={{ background: "#cee7f1" }}>
                              <td className="bb-t">
                                {" "}
                                <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;
                              </td>
                              {/* <td></td>
                              <td></td> */}
                              <td style={{ width: "23%" }}>
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
                              <td style={{ width: "20%" }}>
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
                  console.log("values", values);
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
          size="lg"
          className="transaction_mdl invoice-mdl-style"
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
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={this.getElementObject(this.state.index)}
              validationSchema={Yup.object().shape({
                bank_payment_type: Yup.object().required("Select type"),
                bank_payment_no: Yup.string().required("No is required"),
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
                          className="selectTo mt-2"
                          placeholder="Select Type"
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
                    <Col md="6" className="text-end">
                      {/* <div>
                        <Form.Label style={{ color: "#fff" }}>
                          blank
                          <br />
                        </Form.Label>
                      </div> */}

                      <Button className="successbtn-style mt-4" type="submit">
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
              <Col lg={{ span: 2, offset: 4 }}>
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
                        from_page: "tranx_purchase_invoice_create",
                      };
                      eventBus.dispatch("page_change", {
                        from: "tranx_purchase_invoice_create",
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
              <Table hover className="">
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
                {/* {JSON.stringify(objCR)} */}
                <tbody>
                  {objCR && objCR.type == "dr" ? (
                    <>
                      {ledgerList.map((v, i) => {
                        return (
                          <tr
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

                              this.handleBillByBill("debit", v, rowIndex);
                              this.setState({ ledgerModal: false });
                              console.log("v===>>::", v);
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
                      {/* {JSON.stringify(cashAcbankLst)} */}
                      {/* {JSON.stringify(paidAmount)} */}
                      {cashAcbankLst.map((v, i) => {
                        return (
                          <tr
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
                              // console.log("rows", rows);
                              // if (selectedLedger != "") {
                              //   rows[rowIndex]["perticulars"] = v.label;
                              //   rows[rowIndex]["perticularsId"] =
                              //     selectedLedger.id;
                              //   rows[rowIndex]["balancingMethod"] =
                              //     selectedLedger.balancingMethod;
                              //   // selectedLedger.ledger_name;
                              //   // rows[rowIndex]["debit"] = paidAmount;

                              //   console.log("invoice_data", { invoice_data });
                              //   this.setState({
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
                              this.setState({ ledgerModal: false });
                              console.log("v===>>::", v);
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
      </div>
    );
  }
}
