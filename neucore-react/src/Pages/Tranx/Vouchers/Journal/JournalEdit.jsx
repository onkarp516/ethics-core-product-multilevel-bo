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
// import TRowComponent from '../Tranx/Components/TRowComponent';
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import Select from "react-select";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import delete_icon from "@/assets/images/delete_icon 3.png";
import Filter_img from "@/assets/images/Filter_img.png";
import close_grey_icon from "@/assets/images/close_grey_icon.png";
import Frame from "@/assets/images/Frame.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import {
  create_journal,
  get_last_record_journal,
  get_ledger_list_by_outlet,
  update_journal,
  get_journal_by_id,
  transaction_ledger_details,
  transaction_ledger_list,
  getcreditorspendingbills,
  getdebtorspendingbills,
  getsundrycreditorsindirectexpenses,
  checkInvoiceDateIsBetweenFY,
} from "@/services/api_functions";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  getSelectValue,
  MyNotifications,
  isActionExist,
  allEqual,
  MyTextDatePicker,
  customStyles1,
  convertToSlug,
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

// const customStyles1 = {
//   control: (base) => ({
//     ...base,
//     height: 30,
//     minHeight: 30,
//     fontSize: "13px",
//     border: "none",
//     padding: "0 6px",
//     fontFamily: "Inter",
//     boxShadow: "none",
//     //lineHeight: "10",
//     background: "transparent",
//     // borderBottom: '1px solid #ccc',
//     // '&:focus': {
//     //   borderBottom: '1px solid #1e3989',
//     // },
//   }),
// };

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
export default class JournalEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ledgerModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.state = {
      selectedLedgerIndex: 0,
      bankaccmodal: false,
      isEditDataSet: false,
      rows: [],
      sundryCreditorLst: [],

      ledgersLst: [],
      rows: [],
      ledgerModal: false,
      ledgerData: "",
      ledgerList: [],
      objCR: "",
      additionalCharges: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      errorArrayBorder: "",
      billadjusmentmodalshow: false,
      sdbilladjusmentmodalshow: false,
      selectedBillsData: "",
      filterOpen: false,
      initVal: {
        voucher_journal_sr_no: 1,
        voucher_journal_no: 1,
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
      },
      openingListExist: false,
      isAdvanceCheck: false,
      billLst: [],
      billLstSD: [],
      isAllChecked: false,
      isAllCheckeddebit: false,
      payableAmt: 0,
      selectedAmt: 0,
      remainingAmt: 0,
      advanceAmt: 0,
      selectedBills: [],
      selectedBillsdebit: [],
      uncheckRowData: [],
      debitUncheckData: [],
      openingUncheckData: [],
      debitListExist: false,
      invoiceListExist: false,
      isChecked: false,
      sdPayableAmt: 0,
      sdSelectedAmt: 0,
      sdRemainingAmt: 0,
      sdAdvanceAmt: 0,
      isSDAdvanceCheck: false,
      totalDebitAmt: 0,
      sdTotalDebitAmt: 0,
    };
  }

  get_last_record_journalFun = () => {
    get_last_record_journal()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let lastRow = res.response;
          let initVal = {
            voucher_journal_sr_no: res.count,
            voucher_journal_no: res.journalNo,
            transaction_dt: moment().format("DD/MM/YYYY"),
          };
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstgetledgerDetails = () => {
    get_ledger_list_by_outlet()
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
              };
              resLst.push(innerrow);
              // console.log("resLst", resLst);
            });
          }
          this.setState({ ledgersLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  initRows = (len = null) => {
    let rows = [];
    let condition = 0;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < condition; index++) {
      let innerrow = {
        type: "",
        typeobj: "",
        paid_amt: "",
      };
      if (index == 0) {
        innerrow["typeobj"] = getSelectValue(selectOpt, "dr");
        innerrow["type"] = "dr";
      }
      rows.push(innerrow);
    }
    if (len != null) {
      let Initrows = [...this.state.rows, ...rows];
      this.setState({ rows: Initrows }, () => {
        this.handleChangeArrayElement("type", "dr", 0);
      });
    } else {
      this.setState({ rows: rows }, () => {
        this.handleChangeArrayElement("type", "dr", 0);
      });
    }
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
    // console.log("frows", { frows });
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
    let frows = rows.map((v, i) => {
      // console.log("v-type => ", v["type"]);
      // console.log("i => ", { v, i });
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
        // bal = parseFloat(bal);
        if (v["debit"] != "" && !isNaN(v["debit"])) {
          debitBal = debitBal + parseFloat(v["debit"]);
        }
        // console.log('bal', bal);
      } else if (v["type"] == "cr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          // console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          // console.log("cr value", value);
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    // console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    // console.log("lastCrBal ", lastCrBal);

    // console.log("frows", { frows });

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      console.log("obj::::::::::::", obj);

      if (obj.perticulars.type == "SC") {
        console.log("in if condition array", obj);
        this.FetchPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancing_method
        );
      } else if (obj.perticulars.type == "SD") {
        this.FetchDebtorsPendingBills(
          obj.perticulars.id,
          obj.perticulars.type,
          obj.perticulars.balancing_method
        );
      } else if (obj.type == "cr" || obj.type == "dr") {
        // console.log("obj in else", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
            vi["credit"] = lastCrBal;
            vi["paid_amt"] = lastCrBal;
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

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };

  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
      }
    });
    // console.log({ debitamt });
    return isNaN(debitamt) ? 0 : debitamt;
  };

  getTotalCreditAmt = () => {
    let { rows } = this.state;
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "cr" && v["credit"] != "") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });
    // console.log({ creditamt });
    return isNaN(creditamt) ? 0 : creditamt;
  };

  getElementObject = (index) => {
    // console.log({ index });
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
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
      from: "voucher_journal",
      to: "voucher_journal_list",
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
      .catch((error) => { });
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
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
            ledgersLst: codeopt,
            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => { });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // @mrunal @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      this.get_last_record_journalFun();
      // this.lstgetledgerDetails();
      // this.lstgetsundrycreditors_indirectexpenses();
      this.initRows();
      const { prop_data } = this.props.block;
      // console.log("prop_data==---->", prop_data);
      this.setState({ journalEditData: prop_data.prop_data });
      this.transaction_ledger_listFun();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

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
      this.setState({ billadjusmentmodalshow: false });
    }
  };
  // @mrunal @ On Escape key press Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
      this.setState({ billadjusmentmodalshow: false });
    }
  };
  // @mrunal @ On outside Modal click Modal will Close
  // alt key button disabled start
  // @mrunal @ On Escape key press and On outside Modal click Modal will Close
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close
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

  componentDidUpdate() {
    const { isEditDataSet, journalEditData, ledgersLst } = this.state;
    // console.log("journalEdit ", isEditDataSet, journalEditData, ledgersLst);

    if (
      isEditDataSet == false &&
      journalEditData != "" &&
      ledgersLst.length > 0 &&
      // sundryCreditorLst.length > 0
      journalEditData.id != ""
    ) {
      this.setJournalEditData();
    }
  }

  setJournalEditData = () => {
    // debugger;
    const { id } = this.state.journalEditData;
    let formData = new FormData();
    formData.append("journal_id", id);
    get_journal_by_id(formData)
      .then((response) => {
        let res = response.data;
        console.log("res=======", res);
        if (res.responseStatus == 200) {
          let { perticulars } = res;
          const { ledgersLst } = this.state;
          console.log("ledgersLst", ledgersLst);

          this.myRef.current.setFieldValue(
            "voucher_journal_sr_no",
            res.journal_sr_no
          );

          this.myRef.current.setFieldValue(
            "voucher_journal_no",
            res.journal_no
          );

          this.myRef.current.setFieldValue(
            "transaction_dt",
            moment(res.tranx_date).format("DD-MM-YYYY")
          );
          this.myRef.current.setFieldValue("total_amt", res.total_amt);

          this.myRef.current.setFieldValue(
            "journalEdtNarration",
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

          console.log("journal_details", perticulars);
          let initRowData = [];
          let bankData = [];
          let billsdata = [];

          if (perticulars.length > 0) {
            perticulars.map((v) => {
              console.log("===vvvv===->", v);
              let per = "";
              // if (v.type == "dr") {
              per = getSelectValue(ledgersLst, v.ledger_id);
              this.setState({ perticularsDelete: v.ledger_id });
              // }
              // if (v.type == "cr") {
              //   per = getSelectValue(cashAcbankLst, v.ledger_id);
              //   this.setState({ perticularsDelete: v.ledger_id });
              // }
              // if (v.type === "dr") {
              console.log("per >>>>>", per);
              console.log("v.bills >>>>>", v.bills, v.bills.length);
              v.bills.map((vi, i) => {
                billsdata.push(vi);
              });
              let inner_data = [];

              if (per.type == "SC") {
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

                console.log("per >>>>>", JSON.stringify(per));
                inner_data = {
                  details_id:
                    v.details_id && v.details_id != 0 ? v.details_id : 0,
                  type: v.type && v.type != null ? v.type : "",
                  typeobj:
                    v.type && v.type != ""
                      ? getSelectValue(selectOpt, v.type)
                      : "",
                  perticulars: per,
                  paid_amt: v.type.trim().toLowerCase() == "cr" ? v.cr : v.dr,
                  bank_payment_no:
                    v.paymentTranxNo != null ? v.paymentTranxNo : "",
                  bank_payment_type:
                    v.paymentMethod != null ? v.paymentMethod : "",
                  bank_name: v.ledger_name != null ? v.ledger_name : "",
                  payment_date: v.payment_date != null ? v.payment_date : "",
                  debit: v.type.trim().toLowerCase() == "dr" ? v.dr : "",
                  credit: v.type.trim().toLowerCase() == "cr" ? v.cr : "",
                  journalEdtNarration: "",
                  isAdvanceCheck: per.isAdvanceCheck,
                  payableAmt: per.payableAmt,
                  remainingAmt: per.remainingAmt,
                  selectedAmt: per.selectedAmt,
                  balancingMethod:
                    per.balancingMethod != "" ? per.balancingMethod : "",
                };
              } else if (per.type == "SD") {
                per["bills"] = v.bills;
                per["isSDAdvanceCheck"] = v.isAdvanceCheck;
                per["sdPayableAmt"] = v.payableAmt;
                per["sdRemainingAmt"] = v.remainingAmt;
                per["sdSelectedAmt"] = v.selectedAmt;
                per["bill_details_id"] =
                  v.bill_details_id != "" ? v.bill_details_id : 0;
                per["deleteRow"] = [];
                per["debitdeleteRow"] = [];
                per["openingdeleteRow"] = [];

                console.log("per >>>>>", JSON.stringify(per));
                inner_data = {
                  details_id:
                    v.details_id && v.details_id != 0 ? v.details_id : 0,
                  type: v.type && v.type != null ? v.type : "",
                  typeobj:
                    v.type && v.type != ""
                      ? getSelectValue(selectOpt, v.type)
                      : "",
                  perticulars: per,
                  paid_amt: v.type.trim().toLowerCase() == "cr" ? v.cr : v.dr,
                  bank_payment_no:
                    v.paymentTranxNo != null ? v.paymentTranxNo : "",
                  bank_payment_type:
                    v.paymentMethod != null ? v.paymentMethod : "",
                  bank_name: v.ledger_name != null ? v.ledger_name : "",
                  payment_date: v.payment_date != null ? v.payment_date : "",
                  debit: v.type.trim().toLowerCase() == "dr" ? v.dr : "",
                  credit: v.type.trim().toLowerCase() == "cr" ? v.cr : "",
                  journalEdtNarration: "",
                  isSDAdvanceCheck: per.isSDAdvanceCheck,
                  sdPayableAmt: per.sdPayableAmt,
                  sdRemainingAmt: per.sdRemainingAmt,
                  sdSelectedAmt: per.sdSelectedAmt,
                  balancingMethod:
                    per.balancingMethod != "" ? per.balancingMethod : "",
                };
              }

              console.log("inner_data", inner_data);

              initRowData.push(inner_data);
            });
          }
          console.log("Edit Row ==>", initRowData);

          this.setState({
            rows: initRowData,
            isEditDataSet: true,
            selectedLedger: perticulars,
            selectedBillsData: billsdata,
          });
        }
      })
      .catch((error) => { });
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
  //     let selectedLedgerData = JSON.parse(
  //       cuurentProduct.getAttribute("value")
  //     );
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
  //       // console.log("v===>>::", selectedLedgerData);
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
  //       // console.log("v===>>::", selectedLedgerData);
  //     }
  //   } else if (k == 8) {
  //     //! condition for backspace key press 1409
  //     // console.log("backspace", rowIndex);
  //     document.getElementById(`"perticulars-${rowIndex}"`).focus();
  //     // setTimeout(() => {
  //     // }, 100);

  //   } else if (k == 37 || k == 39) {
  //     //! condition for left & right key press 1409
  //   }
  // }

  dateFilter = () => {
    let { startDate, endDate, selectedLedger } = this.state;
    this.FetchPendingBills(
      selectedLedger.id,
      selectedLedger.type,
      selectedLedger.balancingMethod
    );
    // console.log("in filter function");
  };

  FetchPendingBills = (id, type, balancingMethod) => {
    console.log("balancingMethod", balancingMethod);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("source", "journal");
    reqData.append("balancingMethod", balancingMethod);

    getcreditorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;

          let { editBillData, rows, index } = this.state;
          // console.log({ rows, index });

          if (data.length > 0 || rows.length > 0) {
            if (balancingMethod === "bill-by-bill" && type === "SC") {
              let { editBillData, rows, index } = this.state;
              // console.log({ rows, index });
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
                console.log("objjjjjjjjjjjjjjjjjj", obj);
                console.log("selected===", selectedAmt);
              }

              let f_selectedBills = [];

              let data_ids = bills.map((vi) => vi.invoice_unique_id);

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
                (v) => v.source.trim().toLowerCase() == "pur_invoice"
              );
              console.log("invoiceLst", invoiceLst);
              console.log("After invoiceLst newBills =-> ", newBills);
              let debitLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "debit_note"
              );
              console.log("debitLst", debitLst);
              console.log("After debitLst newBills =-> ", newBills);
              let openingLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "opening_balance"
              );

              // console.log("newBills", JSON.stringify(newBills));

              console.log("f_selectedBills:::::::::::", f_selectedBills);
              // console.log(
              //   "f_selectedDebitBills:::::::::::",
              //   f_selectedDebitBills
              // );

              this.setState(
                {
                  // rows: rows,
                  billLst: newBills,
                  billadjusmentmodalshow: true,
                  selectedBills: f_selectedBills,
                  selectedAmt: selectedAmt,
                  payableAmt: payableAmt,
                  remainingAmt: remainingAmt,
                  isAdvanceCheck: isAdvanceCheck,
                  // advanceAmt: advance_amt,
                  uncheckRowData: uncheckRowData,
                  debitUncheckData: debitUncheckData,
                  openingUncheckData: openingUncheckData,
                  debitListExist: debitLst.length > 0 ? true : false,
                  invoiceListExist: invoiceLst.length > 0 ? true : false,
                  openingListExist: openingLst.length > 0 ? true : false,
                },
                () => {
                  // this.handleBillselectionOpening(f_selectedBills[0], index, true);
                }
              );
            } else if (balancingMethod === "bill-by-bill" && type === "SD") {
              this.setState({
                billLstSc: data,
                billadjusmentCreditmodalshow: true,
                selectedBills: [],
                selectedBillscredit: [],
                isAdvanceCheck: false,
                uncheckRowData: [],
                debitUncheckData: [],
                openingUncheckData: [],
              });
            } else {
              if (balancingMethod === "on-account")
                this.setState({
                  billLst: data,
                  onaccountmodal: false,
                  selectedBills: [],
                  selectedBillscredit: [],
                  isAdvanceCheck: false,
                  uncheckRowData: [],
                  debitUncheckData: [],
                  openingUncheckData: [],
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
  SCFetchPendingBillsFilterWise = () => {
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
          if (
            selectedLedger.balancingMethod === "bill-by-bill" &&
            selectedLedger.type === "SC"
          ) {
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
          } else if (
            selectedLedger.balancingMethod === "bill-by-bill" &&
            selectedLedger.balance_type === "SD"
          ) {
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

  FetchDebtorsPendingBills = (id, type, balancing_method, value) => {
    console.log("sd balancing_method ", balancing_method, type);
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
                  selectedAmt = obj.sdSelectedAmt ? obj.sdSelectedAmt : 0;
                  payableAmt = obj.sdPayableAmt ? obj.sdPayableAmt : 0;
                  remainingAmt = obj.sdRemainingAmt ? obj.sdRemainingAmt : 0;
                  isAdvanceCheck = obj.isSDAdvanceCheck
                    ? obj.isSDAdvanceCheck
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
              console.log("payableAmt==", payableAmt);

              // let f_selectedBills = [];
              let f_selectedDebitBills = [];

              let data_ids = bills.map(
                (vi) => vi.invoice_unique_id
                // );
                // let data_deb_ids = bills.map(
                //   (vi) => vi.source === "credit_note" && vi.credit_note_id
              );
              console.log("data_ids", data_ids);

              let newBills = [...bills];
              f_selectedDebitBills = data_ids;
              console.log("f_selectedDebitBills", f_selectedDebitBills);

              data.map((dv, di) => {
                if (
                  "invoice_unique_id" in dv &&
                  !data_ids.includes(dv.invoice_unique_id)
                ) {
                  newBills.push(dv);
                }
              });
              console.log("new bills:::::::::::::", newBills);

              let invoiceLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "sales_invoice"
              );
              console.log("invoiceLst", invoiceLst);
              console.log("After invoiceLst newBills =-> ", newBills);
              let creditLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "credit_note"
              );
              console.log("creditLst", creditLst);
              console.log("After creditLst newBills =-> ", newBills);
              console.log("selectedAmt =-> ", selectedAmt);
              let openingLst = newBills.filter(
                (v) => v.source.trim().toLowerCase() == "opening_balance"
              );
              this.setState({
                billLstSD: newBills,
                sdbilladjusmentmodalshow: true,
                // selectedBills: f_selectedBills,
                selectedBillsdebit: f_selectedDebitBills,
                sdSelectedAmt: selectedAmt,
                sdPayableAmt: payableAmt,
                sdRemainingAmt: remainingAmt,
                isSDAdvanceCheck: isAdvanceCheck,
                uncheckRowData: uncheckRowData,
                debitUncheckData: debitUncheckData,
                openingUncheckData: openingUncheckData,
                openingUncheckData: openingUncheckData,
                debitListExist: creditLst.length > 0 ? true : false,
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
                billLstSD: data,
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
        this.setState({ billLstSD: [] });
      });
  };

  SDFetchPendingBillsFilterWise = () => {
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
    getdebtorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let resData = res.list;
          if (
            selectedLedger.balancingMethod === "bill-by-bill" &&
            selectedLedger.type === "SD"
          ) {
            console.log("resData=====", resData);

            let invoiceLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "sales_invoice"
            );
            let creditLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "credit_note"
            );

            let openingLst = resData.filter(
              (v) => v.source.trim().toLowerCase() == "opening_balance"
            );

            this.setState({
              billLstSD: resData,
              debitListExist: creditLst.length > 0 ? true : false,
              invoiceListExist: invoiceLst.length > 0 ? true : false,
              openingListExist: openingLst.length > 0 ? true : false,
              billadjusmentmodalshow: true,
              selectedBills: [],
              selectedBillsdebit: [],
              selectedBillsOpening: [],
              isAdvanceCheck: false,
            });
          } else if (
            selectedLedger.balancingMethod === "bill-by-bill" &&
            selectedLedger.balance_type === "SC"
          ) {
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

  handleBillByBill = (element, value, index) => {
    let { rows, selectedLedger } = this.state;
    let debitBal = 0;
    let creditBal = 0;
    let debitamt = 0;
    // console.log("ledgerData", { selectedLedger });
    // console.log("rows in handle bill by bill", this.state.rows, index, value);
    let frows = rows.map((v, i) => {
      // console.log("v:::::::::::::::::", v);
      return v;
    });

    // if (element == "debit") {
    let obj = rows.find((v, i) => i == index);
    // console.log("obj:=:=:", obj);

    if (obj.perticulars.type == "SC") {
      this.FetchPendingBills(
        selectedLedger.id,
        selectedLedger.type,
        selectedLedger.balancingMethod,
        value,
        true
      );
    } else if (obj.perticulars.type == "SD") {
      this.FetchDebtorsPendingBills(
        selectedLedger.id,
        selectedLedger.type,
        selectedLedger.balancingMethod,
        value
      );
    } else if (obj.type == "cr" || obj.type == "dr") {
      frows = rows.map((vi, ii) => {
        if (ii == index) {
          //  (lastCrBal -lastCrBal - vi["paid_amt"]),
          // vi["credit"] = lastCrBal;
        }
        return vi;
      });
      if (obj.perticulars.type == "others") {
      } else if (obj.perticulars.type == "bank_account") {
        this.setState({ bankaccmodal: true });
      }
    }
    // }

    this.setState({ rows: frows, index: index });
  };

  lstgetsundrycreditors_indirectexpenses = () => {
    getsundrycreditorsindirectexpenses()
      .then((response) => {
        // console.log("response", response);
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
                balancingMethod: v.balancing_method,
                value: v.id,
                label: v.ledger_name,
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ sundryCreditorLst: resLst, ledgersLst: resLst });
        }
      })
      .catch((error) => {
        // console.log("error", error);
      });
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
      uncheckRowData,
      debitUncheckData,
      openingUncheckData,
    } = this.state;
    let bills;
    let frow = rows.map((vi, ii) => {
      let f_billLst = billLst.filter((vf) => vf.paid_amt > 0);
      bills = f_billLst;
      if (ii == index) {
        vi["perticulars"]["billids"] = f_billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["perticulars"]["deleteRow"] = uncheckRowData;
        vi["perticulars"]["openingdeleteRow"] = openingUncheckData;
        vi["perticulars"]["debitdeleteRow"] = debitUncheckData;
        vi["payableAmt"] = parseFloat(payableAmt != null ? payableAmt : 0);
        vi["selectedAmt"] = selectedAmt;
        vi["remainingAmt"] = remainingAmt;
        vi["isAdvanceCheck"] = isAdvanceCheck;
        vi["paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        let total = vi["paid_amt"];

        if (vi["type"].trim().toLowerCase() == "cr") {
          vi["credit"] = total;
        } else if (vi["type"].trim().toLowerCase() == "dr") {
          vi["debit"] = total;
        }

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
        advanceAmt: 0,
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
          journalEdtNarration: "",
        };
        this.setState(
          {
            billadjusmentmodalshow: false,
            sdbilladjusmentmodalshow: false,
            index: -1,
          },
          () => {
            setTimeout(() => {
              this.FocusTrRowFieldsID(`journaledit-perticulars-${index + 1}`);
            }, 300);
            this.handleCreditdebitBalance();
            // this.FocusTrRowFieldsID(`journaledit-perticulars-${index + 1}`);

            // console.log("row innerrow====", this.state.rows);
          }
        );

        // this.initRows(this.state.rows.length);
      }
    );
  };
  handleBillByBillSDSubmit = (v) => {
    let {
      index,
      rows,
      billLst,
      billLstSD,
      sdPayableAmt,
      sdSelectedAmt,
      sdRemainingAmt,
      isSDAdvanceCheck,
      uncheckRowData,
      debitUncheckData,
      openingUncheckData,
    } = this.state;
    let bills;
    let frow = rows.map((vi, ii) => {
      let f_billLst = billLstSD.filter((vf) => vf.paid_amt > 0);
      bills = f_billLst;
      if (ii == index) {
        vi["perticulars"]["billids"] = f_billLst;
        vi["perticularsId"] = vi.perticularsId;
        vi["balancingMethod"] = vi.balancingMethod;
        vi["perticulars"]["deleteRow"] = uncheckRowData;
        vi["perticulars"]["openingdeleteRow"] = openingUncheckData;
        vi["perticulars"]["debitdeleteRow"] = debitUncheckData;
        vi["sdPayableAmt"] = parseFloat(
          sdPayableAmt != null ? sdPayableAmt : 0
        );
        vi["sdSelectedAmt"] = sdSelectedAmt;
        vi["sdRemainingAmt"] = sdRemainingAmt;
        vi["isSDAdvanceCheck"] = isSDAdvanceCheck;
        vi["paid_amt"] = billLstSD.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        let total = vi["paid_amt"];

        if (vi["type"].trim().toLowerCase() == "cr") {
          vi["credit"] = total;
        } else if (vi["type"].trim().toLowerCase() == "dr") {
          vi["debit"] = total;
        }

        vi["paid_amt"] = total;
      }
      return vi;
    });

    this.setState(
      {
        rows: frow,
        selectedBillsData: bills,
        billLstSD: [],
        sdPayableAmt: 0,
        sdSelectedAmt: 0,
        sdRemainingAmt: 0,
        isSDAdvanceCheck: false,
        sdAdvanceAmt: 0,
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
          journalEdtNarration: "",
        };
        this.setState(
          {
            billadjusmentmodalshow: false,
            sdbilladjusmentmodalshow: false,
          },
          () => {
            // console.log("row innerrow====", this.state.rows);
            setTimeout(() => {
              this.FocusTrRowFieldsID(`journaledit-perticulars-${index + 1}`);
            }, 300);
            this.handleCreditdebitBalance();
          }
        );

        // this.initRows(this.state.rows.length);
      }
    );
  };

  handleAdvaceCheck = (status) => {
    // console.log("advanceAmt Status===:::", status);
    let {
      billLst,
      selectedBills,
      remainingAmt,
      uncheckRowData,
      openingUncheckData,
      debitUncheckData,
    } = this.state;

    if (status == true) {
      // debugger;
      let advanceAmt = this.finalRemaningSelectedAmt();
      // let advanceAmt = remainingAmt;
      // console.log("advance amt in check:::::", advanceAmt);
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
        newObj["invoice_unique_id"] = "" + convertToSlug("new-ref") + ",0";
        newObj["remaining_amt"] = 0;
        newObj["total_amt"] = advanceAmt;
        newObj["balancing_type"] = "Dr";
        newObj["source"] = "pur_invoice";
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
      let advance = billLst.find(
        (v) => convertToSlug(v.invoice_no) == convertToSlug("new-ref")
      );

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
              v.source == "pur_invoice" &&
              selectedBills.includes(v.invoice_unique_id)
          );
          // this.handleBillselection(obj.invoice_unique_id, 0, true);
        }
      );
    }
  };

  handleJournalEditLedgerTableRow(event) {
    // console.log("handleJournalEditLedgerTableRow", event);
    let { rowIndex, ledgerList, selectedLedgerIndex, objCR, rows } = this.state;
    // let { handleBillByBill, ledgerData } = this.props;
    console.log("objCR==>", objCR, rowIndex);
    let currentR = rows[rowIndex];
    const k = event.keyCode;
    // if (currentR && currentR["type"].toLowerCase() == "dr") {
    if (k == 13) {
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
            if (obj.balancingMethod == "bill-by-bill") {
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
                    this.FocusTrRowFieldsID(`journaledit-debit-${rowIndex}`);
                  } else if (currentR && currentR["type"] == "cr") {
                    this.FocusTrRowFieldsID(`journaledit-credit-${rowIndex}`);
                  }
                }
              );
            }
            this.transaction_ledger_listFun();
          }
        );
      }
    } else if (k == 40) {
      console.log("arrowdown", selectedLedgerIndex);

      if (selectedLedgerIndex < ledgerList.length - 1) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex + 1 }, () => {
          this.FocusTrRowFieldsID(
            `journaledit-ledger-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 38) {
      // console.log("arrowup");
      if (selectedLedgerIndex > 0) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex - 1 }, () => {
          this.FocusTrRowFieldsID(
            `journaledit-ledger-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 40) {
      console.log("arrowdown", selectedLedgerIndex);

      if (selectedLedgerIndex < ledgerList.length - 1) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex + 1 }, () => {
          this.FocusTrRowFieldsID(
            `journaledit-ledger-${this.state.selectedLedgerIndex}`
          );
        });
      }
    } else if (k == 38) {
      // console.log("arrowup");
      if (selectedLedgerIndex > 0) {
        this.setState({ selectedLedgerIndex: selectedLedgerIndex - 1 }, () => {
          this.FocusTrRowFieldsID(
            `journaledit-ledger-${this.state.selectedLedgerIndex}`
          );
        });
      }
    }
    // }
    /*  else if (currentR && currentR["type"].toLowerCase() == "cr") {
      if (k == 13) {
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
              // this.handleBillByBill("debit", obj, rowIndex);
              this.transaction_ledger_listFun();
            }
          );
        }
      } else if (k == 40) {
        // console.log("arrowdown", ledgerList, selectedLedgerIndex);
        if (selectedLedgerIndex < ledgerList.length - 1) {
          this.setState(
            { selectedLedgerIndex: selectedLedgerIndex + 1 },
            () => {
              this.FocusTrRowFieldsID(
                `journaledit-ledger-${this.state.selectedLedgerIndex}`
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
                `journaledit-ledger-${this.state.selectedLedgerIndex}`
              );
            }
          );
        }
      }
    } */

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

  handleSDAdvaceCheck = (status) => {
    let { billLstSD, selectedBillsdebit, uncheckRowData } = this.state;
    if (status) {
      let advanceAmt = this.finalSDRemaningSelectedAmt();
      // console.log("advanceAmt on check================", advanceAmt);
      let remTotalDebitAmt = advanceAmt;
      if (parseFloat(advanceAmt) > 0) {
        let obj = billLstSD.find((v) => v.source == "sales_invoice");
        let newObj = { ...obj };
        newObj["amount"] = advanceAmt;
        newObj["paid_amt"] = advanceAmt;

        newObj["invoice_date"] = moment(new Date()).format("YYYY-MM-DD");
        newObj["invoice_id"] = 0;
        newObj["invoice_no"] = "New Ref";
        newObj["invoice_unique_id"] = "" + convertToSlug("new-ref") + ",0";
        newObj["remaining_amt"] = 0;
        newObj["total_amt"] = advanceAmt;
        newObj["balancing_type"] = "Cr";
        newObj["source"] = "sales_invoice";
        newObj["bill_details_id"] = 0;

        let fBilllst = [...billLstSD, newObj];
        let f_selectedBills = [
          ...selectedBillsdebit,
          newObj["invoice_unique_id"],
        ];

        uncheckRowData = uncheckRowData.filter(
          (v) => parseInt(v) != parseInt(newObj["invoice_id"])
        );

        let invoiceLst = fBilllst.filter(
          (v) => v.source.trim().toLowerCase() == "sales_invoice"
        );

        this.setState({
          billLstSD: fBilllst,
          isSDAdvanceCheck: true,
          selectedBillsdebit: f_selectedBills,
          sdAdvanceAmt: advanceAmt,
          uncheckRowData: uncheckRowData,
          invoiceListExist: invoiceLst.length > 0 ? true : false,
        });
      }
    } else if (status == false) {
      // console.log("selectedBills", selectedBillsdebit);
      let advance = billLstSD.find(
        (v) => v.invoice_no == convertToSlug("new-ref")
      );
      // console.log("billLst==>>>>>>>>>>advance", advance);
      selectedBillsdebit = selectedBillsdebit.filter(
        (v) => v != advance.invoice_unique_id
      );
      billLstSD = billLstSD.filter(
        (v) => v.invoice_no != convertToSlug("new-ref")
      );
      uncheckRowData = [...uncheckRowData, advance.invoice_unique_id];

      this.setState(
        {
          billLstSD: billLstSD,
          isSDAdvanceCheck: false,
          selectedBillsdebit: selectedBillsdebit,
          sdAdvanceAmt: 0,
          sdRemainingAmt: advance ? advance.paid_amt : 0,
          uncheckRowData: uncheckRowData,
          // advanceAmt: advance ? advance.paid_amt : 0,
        },
        () => {
          let obj = billLstSD.find(
            (v) =>
              v.source == "sales_invoice" &&
              selectedBillsdebit.includes(parseInt(v.invoice_no))
          );
          // this.handleBillselectionOpening(obj.invoice_id, 0, true);
        }
      );
    }
  };

  handleBillsSelectionOpeningAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.invoice_no);
      // console.log("All billLst Selection", billLst);
      fBills = billLst.map((v) => {
        if (
          v.source === "opening_balance" ||
          v.source === "pur_invoice" ||
          v.source === "debit_note"
        ) {
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
          v.source === "pur_invoice" ||
          v.source === "debit_note"
        ) {
          v["paid_amt"] = 0;
          // v['remaining_amt'] = isNaN(parseFloat(v['amount']))
          //   ? parseFloat(v['amount'])
          //   : 0;
          v["remaining_amt"] = parseFloat(v["amount"]);
        }

        return v;
      });
    }
    this.setState({
      isAllChecked: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handleSDBillsSelectionOpeningAll = (status) => {
    let { billLstSD } = this.state;
    let fBills = billLstSD;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLstSD.map((v) => v.invoice_no);
      // console.log("All billLstSD Selection", billLstSD);
      fBills = billLstSD.map((v) => {
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
      fBills = billLstSD.map((v) => {
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
      selectedBillsdebit: lstSelected,
      billLstSD: fBills,
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
    // console.log("selectedBills====", selectedBills);
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
        // console.log("uncheck id", v);
        if (v.invoice_unique_id == id) {
          if (v.source == "pur_invoice") {
            uncheckRowData = uncheckRowData
              ? uncheckRowData.filter((v) => v != id)
              : [];
          }
          if (v.source == "opening_balance") {
            openingUncheckData = openingUncheckData
              ? openingUncheckData.filter((v) => v != id)
              : [];
          }
          if (v.source == "debit_note") {
            debitUncheckData = debitUncheckData
              ? debitUncheckData.filter((v) => v != id)
              : [];
          }
        }
      });
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);

      f_billLst.map((v, i) => {
        // console.log("uncheck id", v);
        if (v.invoice_unique_id == id) {
          if (v.source == "pur_invoice") {
            uncheckRowData = [...uncheckRowData, id];
          }
          if (v.source == "opening_balance") {
            openingUncheckData = [...openingUncheckData, id];
          }
          if (v.source == "debit_note") {
            debitUncheckData = [...debitUncheckData, id];
          }
        }
      });
      // console.log(
      //   "uncheck data of invoice",
      //   uncheckRowData,
      //   openingUncheckData,
      //   debitUncheckData
      // );

      if (id == 0) {
        this.setState({ isAdvanceCheck: false });
      }
    }

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        // console.log("remTotalDebitAmt============:::::::::", remTotalDebitAmt);
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
            // console.log("in else of selection", remAmt);
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
                  // let a = parseFloat(v["amount"]) - payAmt;
                  // console.log("A", a);
                  // let selectbill = payAmt + Math.abs(a);
                  let selectbill = parseFloat(v["amount"]);

                  let remaingbill = 0;
                  // this.setState({ totalDebitAmt: selectbill });

                  this.setState({
                    selectedAmt: selectbill,
                    remainingAmt: remaingbill,
                  });
                },
                handleFailFn: () => { },
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

  handleSDBillselectionOpening = (id, index, status) => {
    // debugger;
    // console.log("id,status,index in sd", id, status, index);
    let {
      lstBills,
      selectedBills,
      selectedBillsdebit,
      selectedBillsOpening,
      sdTotalDebitAmt,
      billLstSD,
    } = this.state;
    let remTotalDebitAmt = sdTotalDebitAmt;
    // console.log("selectedBills====::::", selectedBills);
    // console.log("selectedBillsdebit====", selectedBillsdebit);
    // console.log("selectedBillsOpening====", selectedBillsOpening);

    let f_selectedBills = selectedBillsdebit;

    let f_billLst = billLstSD;
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
    // console.log("f_billLst====::::", f_billLst);

    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        // console.log("remTotalDebitAmt============:::::::::", remTotalDebitAmt);
        if (f_selectedBills.includes(v.invoice_unique_id)) {
          let pamt = 0;
          if (parseFloat(remTotalDebitAmt) > parseFloat(v["amount"])) {
            remTotalDebitAmt = remTotalDebitAmt - v["amount"];
            pamt = v["amount"];
          } else {
            let payAmt = parseFloat(this.sdref.current.values.sdPayableAmt);
            let remAmt = payAmt - this.finalSDBillSelectedAmt();

            pamt = remAmt;
            remTotalDebitAmt = 0;
            // console.log("in else of selection", remAmt);
          }
          v["paid_amt"] = pamt;
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(pamt);
          // console.log("pamttttttt:::::::::", pamt);
          // console.log(
          //   "selected Final Amt :::::::::::::::::",
          //   this.finalBillSelectedAmt()
          // );
          let selectbill = pamt + this.finalSDBillSelectedAmt();
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

                  let payAmt = parseFloat(
                    this.sdref.current.values.sdPayableAmt
                  );
                  let remAmt = parseFloat(v["remaining_amt"]);
                  remTotalDebitAmt = payAmt + remAmt;
                  this.setState({ sdTotalDebitAmt: remTotalDebitAmt });
                  // console.log("remTotalDebitAmt:", remTotalDebitAmt);
                  this.sdref.current.setFieldValue(
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
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };

  handleBillPayableAmtChange = (value, index) => {
    // console.log({ value, index });
    const { billLst, debitBills, billLstSc } = this.state;
    // console.log("billLstSc", billLstSc);
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "pur_invoice") {
        v["paid_amt"] = value;
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "debit_note") {
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

  handleSDBillPayableAmtChange = (value, index) => {
    // console.log({ value, index });
    const { billLstSD, billLstSc } = this.state;
    let fBilllst = billLstSD.map((v, i) => {
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

    this.setState({ billLstSD: fBilllst });
    // this.setState({ billLstSc: fDBilllst });
  };
  finalBillDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });

    let debitPaidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        if (next.source == "debit_note" || next.source == "credit_note") {
          debitPaidAmount =
            debitPaidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    return isNaN(debitPaidAmount) ? 0 : debitPaidAmount;
  };
  finalBillCreditAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });

    let debitPaidAmount = 0;
    billLstSD.map((next) => {
      if ("paid_amt" in next) {
        if (next.source == "credit_note") {
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
  finalSDBillOpeningAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLstSD.map((next) => {
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
  finalSDBalanceOpeningAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLstSD.map((next) => {
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
  finalSDRemaningOpeningAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLstSD.map((next) => {
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
        if (next.source == "pur_invoice" || next.source == "sales_invoice") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };
  finalSDRemaningInvoiceAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLstSD.map((next) => {
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

  finalRemaningDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "debit_note" || next.source == "credit_note") {
          invoiceRemAmount =
            invoiceRemAmount +
            parseFloat(next.remaining_amt ? next.remaining_amt : 0);
        }
      }
    });

    return isNaN(invoiceRemAmount) ? 0 : invoiceRemAmount;
  };
  finalRemaningCreditAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let invoiceRemAmount = 0;
    billLstSD.map((next) => {
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

  finalBalanceDebitAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "debit_note" || next.source == "credit_note") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  finalSDBalanceDebitAmt = () => {
    const { billLstSD } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLstSD.map((next) => {
      if ("amount" in next) {
        if (next.source == "credit_note") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

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
  finalSDBillAmt = () => {
    const { billLstSD } = this.state;
    // let advanceAmt = this.state.advanceAmt;
    let opnAmount = this.finalSDBillOpeningAmt();
    let invAmount = this.finalSDBillInvoiceAmt();
    let paidAmount = opnAmount + invAmount;

    let debitPaidAmount = this.finalBillCreditAmt();

    if (paidAmount >= debitPaidAmount) {
      let amt = paidAmount - debitPaidAmount;
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
    // console.log({ billLst });

    let remainingAmt = this.finalRemaningOpeningAmt();
    let invoiceRemainingAmt = this.finalRemaningInvoiceAmt();

    let debitRemainingAmount = this.finalRemaningDebitAmt();

    let amt = remainingAmt + invoiceRemainingAmt - debitRemainingAmount;
    return amt;
  };

  finalSDRemainingBillAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });

    let remainingAmt = this.finalSDRemaningOpeningAmt();
    let invoiceRemainingAmt = this.finalSDRemaningInvoiceAmt();

    let debitRemainingAmount = this.finalRemaningCreditAmt();

    let amt = remainingAmt + invoiceRemainingAmt - debitRemainingAmount;
    return amt;
  };

  finalBalanceInvoiceAmt = () => {
    const { billLst } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLst.map((next) => {
      if ("amount" in next) {
        if (next.source == "pur_invoice" || "sales_invoice") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  finalBillInvoiceAmt = () => {
    // debugger;
    let { billLst } = this.state;
    // console.log({ billLst });
    let advanceAmt = this.state.advanceAmt;
    let paidAmount = 0;
    billLst.map((next) => {
      if (next.source == "pur_invoice" || next.source == "sales_invoice") {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    return isNaN(paidAmount) ? 0 : paidAmount;
  };
  finalSDBillInvoiceAmt = () => {
    // debugger;
    let { billLstSD } = this.state;
    // console.log({ billLst });
    let advanceAmt = this.state.advanceAmt;
    let paidAmount = 0;
    billLstSD.map((next) => {
      if (next.source == "sales_invoice") {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

    return isNaN(paidAmount) ? 0 : paidAmount;
  };

  finalSDBalanceInvoiceAmt = () => {
    const { billLst, billLstSD } = this.state;
    // console.log({ billLst });
    let opnPaidAmount = 0;
    billLstSD.map((next) => {
      if ("amount" in next) {
        if (next.source == "sales_invoice") {
          opnPaidAmount =
            opnPaidAmount + parseFloat(next.amount ? next.amount : 0);
        }
      }
    });

    return isNaN(opnPaidAmount) ? 0 : opnPaidAmount;
  };

  handleCreditdebitBalance = () => {
    let { rowIndex, rows } = this.state;
    console.log("rowindex", rowIndex);

    let debitAmt = this.getTotalDebitAmt();
    let creditAmt = this.getTotalCreditAmt();

    if (debitAmt != creditAmt) {
      let innerrow = {
        type: "cr",
        typeobj: getSelectValue(selectOpt, "cr"),
        paid_amt: "",
      };
      if (rows.length <= rowIndex + 1) {
        this.setState({ rows: [...this.state.rows, innerrow] }, () => {
          this.FocusTrRowFieldsID(`journaledit-perticulars-${rowIndex + 1}`);
          // console.log("row innerrow====", this.state.rows);
        });
      }
    } else {
      this.FocusTrRowFieldsID(`journalEdtNarration`);
    }
  };
  selectedBillOnOver = (index) => {
    let { rows } = this.state;
    // console.log("rows of index on over", rows);
    let selectedBills = rows[index]["perticulars"]
      ? rows[index]["perticulars"]["bills"]
      : [];
    this.setState({ selectedBillsData: selectedBills });
  };

  filterData = (value) => {
    // console.log("value in filter>>>>>>>>>>>>>>>", value);
    let { ledgerList, orgLedgerList } = this.state;
    // console.log("productLst--", ledgerList);
    // console.log("orgProductLst", orgLedgerList);
    let filterData = orgLedgerList.filter((v) =>
      v.ledger_name.toLowerCase().includes(value)
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      ledgerList: filterData.length > 0 ? filterData : [],
      ledgerModal: true,
    });
  };
  finalBillSelectedAmt = () => {
    const { billLst } = this.state;
    let amt = 0;
    let paidAmount = 0;

    // console.log({ billLst });
    billLst.map((next) => {
      if (
        next.balancing_type.trim().toLowerCase() == "cr" ||
        parseInt(next.invoice_id) == 0
      ) {
        if ("paid_amt" in next) {
          paidAmount =
            paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
        }
      }
    });

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

    // let totalAdvanceAmt = this.state.advanceAmt;

    // if (totalAdvanceAmt != 0) {
    //   amt = paidAmount - debitPaidAmount + totalAdvanceAmt;
    // } else {
    amt = paidAmount - debitPaidAmount;
    // }
    return amt;
  };

  finalRemaningSelectedAmt = () => {
    let paidAmt = this.state.payableAmt;
    let selectedAmt = this.finalBillSelectedAmt();
    // console.log("paid amount==", paidAmt);
    // console.log("selected amount===", selectedAmt);

    if (paidAmt != 0) {
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
  };
  finalSDBillSelectedAmt = () => {
    const { billLstSD } = this.state;
    let amt = 0;
    let paidAmount = 0;

    // console.log({ billLstSD });
    billLstSD.map((next) => {
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
    // console.log("paidAmount=====", paidAmount);

    let debitPaidAmount = 0;
    billLstSD.map((next) => {
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
    // console.log("debitPaidAmount=====", debitPaidAmount);

    // let totalAdvanceAmt = this.state.sdAdvanceAmt;
    // // let totalAdvanceAmt = 0;
    // if (totalAdvanceAmt != 0) {
    //   amt = paidAmount - debitPaidAmount + totalAdvanceAmt;
    // } else {
    amt = paidAmount - debitPaidAmount;
    // }
    // console.log("amt=====", amt);

    return amt;
  };

  finalSDRemaningSelectedAmt = () => {
    let paidAmt = this.state.sdPayableAmt;
    let selectedAmt = this.finalSDBillSelectedAmt();

    if (paidAmt != 0) {
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
  };

  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append(
      "invoiceDate",
      moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        // console.log("res", response);
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
            () => { }
          );
          setTimeout(() => {
            // document.getElementById("bill_dt").focus();
            this.invoiceDateRef.current.focus();
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
              handleSuccessFn: () => { },
              handleFailFn: () => {
                setTimeout(() => {
                  // document.getElementById("bill_dt").focus();
                  this.invoiceDateRef.current.focus();
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
              handleSuccessFn: () => { },
              handleFailFn: () => {
                setTimeout(() => {
                  // document.getElementById("bill_dt").focus();
                  this.invoiceDateRef.current.focus();
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

  focusNextElement(e, nextIndex = null) {
    var form = e.target.form;
    // debugger
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

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
    }
  };

  render() {
    const {
      bankaccmodal,
      invoice_data,
      selectedLedgerIndex,
      isEditDataSet,
      rows,
      ledgersLst,
      initVal,
      ledgerModal,
      ledgerList,
      ledgerData,
      selectedLedger,
      objCR,
      additionalCharges,
      supplierCodeLst,
      rowIndex,
      errorArrayBorder,
      billadjusmentmodalshow,
      selectedBillsData,
      sundryCreditorLst,
      sdbilladjusmentmodalshow,
      filterOpen,
      billLst,
      billLstSD,
      selectedBills,
      isAdvanceCheck,
      debitListExist,
      invoiceListExist,
      openingListExist,
      bankNameOpt,
      isAllChecked,
      isAllCheckeddebit,
      selectedBillsdebit,
      isSDAdvanceCheck,
    } = this.state;
    return (
      <div className="accountentrynewstyle">
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
              // console.log("values ----", values);
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
                          // console.log("rows", JSON.stringify(frow));
                          // console.log(rows);

                          frow = frow.map((v, i) => {
                            if (
                              v.perticulars &&
                              v.perticulars.balancingMethod == "bill-by-bill"
                            ) {
                              let billRow = [];
                              let perObj = [];
                              v.perticulars &&
                                v.perticulars.billids &&
                                v.perticulars.billids.map((vi, ii) => {
                                  if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                    // return vi;
                                    vi["bill_details_id"] = vi[
                                      "bill_details_id"
                                    ]
                                      ? vi["bill_details_id"]
                                      : 0;
                                    billRow.push(vi);
                                  }
                                });

                              perObj = {
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancing_method: v.perticulars.balancingMethod,
                                payableAmt:
                                  v.payableAmt != null ? v.payableAmt : 0,
                                remainingAmt: v.remainingAmt,
                                selectedAmt: v.selectedAmt,
                                isAdvanceCheck: v.isAdvanceCheck,
                                deleteRow: v.perticulars.deleteRow,
                                debitDeleteRow: v.perticulars.debitdeleteRow,
                                OpeningDeleteRow:
                                  v.perticulars.openingdeleteRow,

                                billids: billRow,
                              };

                              if (v["debit"] != "" && v["type"] == "dr") {
                                v["paid_amt"] = v.debit;
                              } else if (
                                v["credit"] != "" &&
                                v["type"] == "cr"
                              ) {
                                v["paid_amt"] = v.credit;
                              }

                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                perticulars: perObj,
                              };
                            } else if (
                              v.perticulars &&
                              v.perticulars.type == "IE"
                            ) {
                              let perObj = {
                                id: v.perticulars.id,
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.label,
                                balancingMethod: v.perticulars.balancingMethod,
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
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                balancingMethod: v.perticulars.balancingMethod,
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
                                details_id:
                                  v.details_id != "" ? v.details_id : 0,
                                id: v.perticulars.id,
                                type: v.perticulars.type,
                                ledger_name: v.perticulars.ledger_name,
                                // perticulareDelete: perticulareDelete,
                              };
                              return {
                                type: v.type,
                                paid_amt: v.credit,
                                bank_payment_type: v.bank_payment_type,
                                bank_payment_no: v.bank_payment_no,
                                // perticulareDelete: perticulareDelete,
                                perticulars: perObj,
                              };
                            }
                          });
                          console.log("frow ---------", JSON.stringify(frow));

                          let formData = new FormData();

                          if (
                            values.journalEdtNarration != null &&
                            values.journalEdtNarration != ""
                          )
                            formData.append(
                              "journalEdtNarration",
                              values.journalEdtNarration
                            );
                          formData.append("rows", JSON.stringify(frow));
                          formData.append(
                            "transaction_dt",
                            moment(values.transaction_dt, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )
                          );
                          formData.append(
                            "voucher_journal_sr_no",
                            values.voucher_journal_sr_no
                          );
                          formData.append(
                            "journal_id",
                            values.voucher_journal_sr_no
                          );
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);
                          formData.append(
                            "voucher_journal_no",
                            values.voucher_journal_no
                          );
                          for (const pair of formData.entries()) {
                            console.log(
                              `key => ${pair[0]}, value =>${pair[1]}`
                            );
                          }

                          update_journal(formData)
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
                                // if ("ledgerId" in this.state.source != "") {
                                //   eventBus.dispatch("page_change", {
                                //     from: "voucher_journal_list",
                                //     to: "ledgerdetails",
                                //     prop_data: this.state.source["ledgerId"],

                                //     isNewTab: false,
                                //   });
                                //   // this.setState({ source: "" });
                                // } else {
                                //   eventBus.dispatch(
                                //     "page_change",
                                //     "voucher_journal_list"
                                //   );
                                // }

                                eventBus.dispatch("page_change", {
                                  from: "voucher_journal",
                                  to: "voucher_journal_list",
                                  isNewTab: false,
                                  prop_data: {
                                    editId: this.state.journalEditData.id,
                                    rowId: this.props.block.prop_data.rowId,
                                  },
                                  isCancel: true,
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
              <div
                className="new_trnx_design"
              // style={{ overflowX: "hidden", overflowY: "hidden" }}
              >
                <Row>
                  <Col md="12">
                    <Form
                      onSubmit={handleSubmit}
                      noValidate
                      autoComplete="off"
                      className="frm-accountentry"
                      style={{ overflow: "hidden" }}
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
                                        <h6>Journal Sr. #.</h6>:{" "}
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
                                          name="voucher_journal_sr_no"
                                          id="voucher_journal_sr_no"
                                          disabled
                                          placeholder="Jour1234"
                                          className="mb-0"
                                          value={values.voucher_journal_sr_no}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                  <li>
                                    {/* <h6>Voucher Sr. #.</h6>:{' '} */}
                              {/* <span>
                                      {invoice_data
                                        ? invoice_data.purchase_sr_no
                                        : ''}
                                    </span> */}
                              {/*   <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="5"
                                        className="pt-0"
                                      >
                                        <h6>Journal #.</h6>:{" "}
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
                                          className="mb-0"
                                          value={values.voucher_journal_no}
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
                                          className=""
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
                                  {/* <span className="pt-1 pl-1 req_validation">
                                  *
                                </span> */}
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Control
                                  style={{
                                    textAlign: "left",
                                    paddingRight: "10px",
                                    background: "#f5f5f5",
                                  }}
                                  type="text"
                                  name="voucher_journal_sr_no"
                                  id="voucher_journal_sr_no"
                                  disabled
                                  placeholder="Jour1234"
                                  className="accountentry-text-box"
                                  value={values.voucher_journal_sr_no}
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
                                  {/* <span className="pt-1 pl-1 req_validation">
                                  *
                                </span> */}
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
                                  disabled
                                  placeholder="1234"
                                  className="accountentry-text-box mb-0"
                                  value={values.voucher_journal_no}
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
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     values.transaction_dt === "__/__/____"
                                  //   ) {
                                  //     e.preventDefault();
                                  //   }
                                  // }}
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
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
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
                                          this.invoiceDateRef.current.focus();
                                        }, 1000);
                                      }
                                    } else if (
                                      e.key === "Tab" ||
                                      e.keyCode === 13
                                    ) {
                                      let datchco = e.target.value.trim();
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
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
                                          this.invoiceDateRef.current.focus();
                                        }, 1000);
                                      } else {
                                        this.FocusTrRowFieldsID(
                                          `journaledit-perticulars-0`
                                        );
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
                                    className={`${errorArrayBorder[0] == "Y"
                                      ? "border border-danger accountentry-date-style"
                                      : "accountentry-date-style"
                                      }`}
                                    onChange={handleChange}
                                    // onBlur={(e) => {
                                    //   let datchco = e.target.value.trim();
                                    //   // console.log("datchco", datchco);
                                    //   let checkdate = moment(
                                    //     e.target.value
                                    //   ).format("DD/MM/YYYY");
                                    //   // console.log("checkdate", checkdate);
                                    //   if (
                                    //     datchco != "" &&
                                    //     checkdate == "Invalid date"
                                    //   ) {
                                    //     MyNotifications.fire({
                                    //       show: true,
                                    //       icon: "error",
                                    //       title: "Error",
                                    //       msg: "Please Enter Correct Date. ",
                                    //       is_timeout: true,
                                    //       delay: 1500,
                                    //     });
                                    //     setTimeout(() => {
                                    //       this.invoiceDateRef.current.focus();
                                    //     }, 1000);
                                    //   }

                                    //   // console.log("e ", e);
                                    //   // console.log(
                                    //   //   "e.target.value ",
                                    //   //   e.target.value
                                    //   // );
                                    //   if (
                                    //     e.target.value != null &&
                                    //     e.target.value != ""
                                    //   ) {
                                    //     this.setErrorBorder(0, "");
                                    //     console.warn(
                                    //       "warn:: isValid",
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
                                    //       // this.checkInvoiceDateIsBetweenFYFun(
                                    //       //   e.target.value,
                                    //       //   setFieldValue
                                    //       // );
                                    //     } else {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "error",
                                    //         title: "Error",
                                    //         msg: "Invalid invoice date",
                                    //         // is_button_show: true,
                                    //         is_timeout: true,
                                    //         delay: 1500,
                                    //       });
                                    //       // this.invoiceDateRef.current.focus();
                                    //       // setFieldValue("transaction_dt", "");
                                    //       setTimeout(() => {
                                    //         this.invoiceDateRef.current.focus();
                                    //       }, 1000);
                                    //     }
                                    //   } else {
                                    //     // setFieldValue("transaction_dt", "");
                                    //     this.setErrorBorder(0, "Y");
                                    //     // document
                                    //     //   .getElementById("transaction_dt")
                                    //     //   .focus();
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
                                            // console.log("finfinfinfin", finle);
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
                                      }
                                    }}
                                  />
                                </Form.Group>
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
                        // style={{ maxHeight: "68vh", height: "68vh" }}
                        >
                          <Table size="sm" className="mb-0">
                            <thead>
                              <tr>
                                <th
                                  style={{ width: "5%", textAlign: "center" }}
                                >
                                  Type
                                </th>
                                <th
                                  style={{ width: "75%", textAlign: "center" }}
                                >
                                  Particulars
                                </th>
                                <th
                                  style={{ width: "10%", textAlign: "center" }}
                                >
                                  Debit &nbsp;
                                </th>
                                <th
                                  style={{ width: "10%", textAlign: "center" }}
                                  className="pl-4"
                                >
                                  Credit &nbsp;
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              style={{ borderTop: "2px solid transparent" }}
                            >
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
                                            styles={customStyles1}
                                            className="selectTo"
                                            options={selectOpt}
                                            onChange={(v) => {
                                              setFieldValue("type", v.label);
                                              // console.log("v============", v);
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
                                            name="type"
                                            id="type"
                                            // value={values.drCr}
                                            value={this.setElementValue(
                                              "typeobj",
                                              ii
                                            )}
                                            placeholder="Type"
                                            onKeyDown={(e) => {
                                              if (
                                                e.shiftKey &&
                                                e.key === "Tab"
                                              ) {
                                              } else if (e.keyCode === 13) {
                                                this.focusNextElement(e);
                                              }
                                              else if (
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
                                          name={`journaledit-perticulars-${ii}`}
                                          id={`journaledit-perticulars-${ii}`}
                                          className="account-prod-style border-0"
                                          placeholder=" "
                                          // name={`"perticulars-${ii}"`}
                                          // id={`"perticulars-${ii}"`}
                                          onChange={(e) => {
                                            e.preventDefault();
                                            if (
                                              ledgerList[selectedLedgerIndex]
                                                .balancingMethod == "billbybill"
                                            ) {
                                              this.filterData(e.target.value);
                                            }
                                            this.handleChangeArrayElement(
                                              "perticulars",
                                              e,
                                              ii
                                            );
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                              ledgerList[selectedLedgerIndex]
                                                .balancingMethod == "billbybill"
                                            ) {
                                              this.ledgerModalFun(true, ii);
                                              this.setState(
                                                {
                                                  ledgerModal: true,
                                                },
                                                () => {
                                                  if (vi.perticulars.id != "") {
                                                    const index = ledgerList.findIndex(
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
                                                              "journaledit-ledger-" +
                                                              index
                                                            )
                                                            ?.focus();
                                                        }
                                                      );
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
                                          onMouseOver={(e) => {
                                            e.preventDefault();
                                            // console.log("selected bill", rows[ii]["perticulars"]);
                                            let id = rows[ii]["perticulars"]
                                              ? rows[ii]["perticulars"]["id"]
                                              : "";
                                            this.transaction_ledger_detailsFun(
                                              id
                                            );
                                            this.selectedBillOnOver(ii);
                                            // this.handleBillByBillSubmit();
                                          }}
                                          // onKeyDown={(e) => {
                                          //   if (e.keyCode == 13) {
                                          //     this.ledgerModalFun(true, ii);
                                          //   } else if (
                                          //     e.shiftKey &&
                                          //     e.key === "Tab"
                                          //   ) {
                                          //   } else if (
                                          //     e.key === "Tab" &&
                                          //     !e.target.value.trim()
                                          //   ) { e.preventDefault(); }
                                          //   else if (e.keyCode == 40) {
                                          //     //! this condition for down button press 1409
                                          //     if (ledgerModal == true)
                                          //       document
                                          //         .getElementById("productTr_0")
                                          //         .focus();
                                          //     else
                                          //       this.FocusTrRowFields(
                                          //         "particulars",
                                          //         ii + 1
                                          //       );
                                          //     // console.warn("Down");
                                          //   } else if (e.keyCode == 38) {
                                          //     this.FocusTrRowFields(
                                          //       "particulars",
                                          //       ii - 1
                                          //     );
                                          //     // console.warn("Up");
                                          //   }
                                          // }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                              // if (
                                              //   ledgerList[selectedLedgerIndex]
                                              //     .balancingMethod ==
                                              //   "billbybill"
                                              // ) {
                                              //   this.ledgerModalFun(true, ii);
                                              // }
                                              this.focusNextElement(e);
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
                                                    .getElementById(
                                                      "addProduct"
                                                    )
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
                                                    "journaledit-ledger-0"
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
                                          readOnly={true}
                                        />
                                      </td>

                                      <td style={{ width: "10%" }}>
                                        <Form.Control
                                          type="text"
                                          name={`journaledit-debit-${ii}`}
                                          id={`journaledit-debit-${ii}`}
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "debit",
                                              v,
                                              ii
                                            );
                                          }}
                                          className="table-text-box border-0"
                                          style={{ textAlign: "center" }}
                                          value={this.setElementValue(
                                            "debit",
                                            ii
                                          )}
                                          // onBlur={(e) => {
                                          //   e.preventDefault();
                                          //   let v = e.target.value;
                                          //   this.setState(
                                          //     {
                                          //       selectedLedger: rows[ii][
                                          //         "perticulars"
                                          //       ]
                                          //         ? rows[ii]["perticulars"]
                                          //         : "",
                                          //     },
                                          //     () => {
                                          //       if (vi.type == "dr") {
                                          //         this.handleBillByBill(
                                          //           "debit",
                                          //           v,
                                          //           ii
                                          //         );
                                          //       }
                                          //     }
                                          //   );
                                          //   this.handleCreditdebitBalance();
                                          // }}
                                          onKeyDown={(e) => {
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            ) {
                                              e.preventDefault();
                                              this.FocusTrRowFieldsID(
                                                `journaledit-perticulars-${rowIndex + 1
                                                }`
                                              );
                                            } else if (e.keyCode === 13) {
                                              let v = e.target.value;
                                              this.setState(
                                                {
                                                  selectedLedger: rows[ii][
                                                    "perticulars"
                                                  ]
                                                    ? rows[ii]["perticulars"]
                                                    : "",
                                                },
                                                () => {
                                                  if (vi.type == "dr") {
                                                    this.handleBillByBill(
                                                      "debit",
                                                      v,
                                                      ii
                                                    );
                                                  }
                                                }
                                              );
                                              this.handleCreditdebitBalance();
                                            }
                                          }}
                                          disabled={
                                            this.setElementValue("type", ii) ==
                                              "dr"
                                              ? false
                                              : true
                                          }
                                        // readOnly={
                                        //   this.setElementValue("type", ii) ==
                                        //     "dr"
                                        //     ? false
                                        //     : true
                                        // }
                                        />
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        <Form.Control
                                          type="text"
                                          className="table-text-box border-0"
                                          name={`journaledit-credit-${ii}`}
                                          id={`journaledit-credit-${ii}`}
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "credit",
                                              v,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "center" }}
                                          value={this.setElementValue(
                                            "credit",
                                            ii
                                          )}
                                          onKeyDown={(e) => {
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (e.keyCode === 13) {
                                              // e.preventDefault();
                                              let v = e.target.value;
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
                                                      "credit",
                                                      v,
                                                      ii
                                                    );
                                                  }
                                                }
                                              );
                                              this.handleCreditdebitBalance();
                                            }
                                            else if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            ) { e.preventDefault(); }
                                          }}
                                          disabled={
                                            this.setElementValue("type", ii) ==
                                              "cr"
                                              ? false
                                              : true
                                          }
                                        // onBlur={(e) => {
                                        //   e.preventDefault();
                                        //   let v = e.target.value;
                                        //   this.setState(
                                        //     {
                                        //       selectedLedger: rows[ii][
                                        //         "perticulars"
                                        //       ]
                                        //         ? rows[ii]["perticulars"]
                                        //         : "",
                                        //     },
                                        //     () => {
                                        //       if (vi.type == "cr") {
                                        //         this.handleBillByBill(
                                        //           "credit",
                                        //           v,
                                        //           ii
                                        //         );
                                        //       }
                                        //     }
                                        //   );
                                        //   this.handleCreditdebitBalance();
                                        // }}
                                        // readOnly={
                                        //   this.setElementValue("type", ii) ==
                                        //     "cr"
                                        //     ? false
                                        //     : true
                                        // }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </Table>
                        </div>
                        <thead
                          className="account_btm_part"
                          style={{
                            borderTop: "2px solid transparent",
                          }}
                        >
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
                              Total
                            </td>
                            <td style={{ width: "75%" }}></td>

                            <td style={{ width: "10%" }} className="qtotalqty">
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
                            <td style={{ width: "10%" }} className="qtotalqty">
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
                                  <p className="title-style mb-0">
                                    Ledger Info:
                                  </p>

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
                                    <span className="span-lable">
                                      Contact Person :
                                    </span>
                                    <span className="span-value"></span>
                                  </div>
                                  <div className="d-flex">
                                    <span className="span-lable">
                                      Transport :
                                    </span>
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
                                    <span className="span-lable">
                                      Lisence No :
                                    </span>
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
                                    <span className="span-lable">
                                      Payment Mode :
                                    </span>
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
                                    <span className="span-lable">
                                      Bank Name :
                                    </span>
                                    <span className="span-value"></span>
                                  </div>
                                  <div className="d-flex">
                                    <span className="span-lable">
                                      Payment Date :
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
                                    type="text"
                                    autoComplete="true"
                                    placeholder="Enter Narration"
                                    // style={{ height: "72px", resize: "none" }}
                                    className="text-box"
                                    id="journalEdtNarration"
                                    onChange={handleChange}
                                    // rows={5}
                                    // cols={25}
                                    name="journalEdtNarration"
                                    value={values.journalEdtNarration}
                                  />
                                </Col>
                              </Row>
                              <Row>
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
                                      {selectedBillsData &&
                                        selectedBillsData.length > 0 ? (
                                        selectedBillsData.map((v, i) => {
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
                                        })
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={8}
                                            className="text-center"
                                          >
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
                                          from: "voucher_journal_edit",
                                          to: "voucher_journal_list",
                                          isNewTab: false,
                                          isCancel: true,
                                          prop_data: {
                                            editId: this.state.journalEditData
                                              .id,
                                            rowId: this.props.block.prop_data
                                              .rowId,
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
                                          eventBus.dispatch("page_change", {
                                            from: "voucher_journal_edit",
                                            to: "voucher_journal_list",
                                            isNewTab: false,
                                            isCancel: true,
                                            prop_data: {
                                              editId: this.state.journalEditData
                                                .id,
                                              rowId: this.props.block.prop_data
                                                .rowId,
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
                            </Col>
                          </Row>
                        </div>
                        <Row className="btm-rows-btn1">
                          {/* <Col md="2" className="pe-0">
                            <Form.Label className="btm-label">
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
                            <Form.Label className="btm-label">
                              Duplicate:{" "}
                              <span className="shortkey">Ctrl+D</span>
                            </Form.Label>
                          </Col>
                        
                          <Col md="2" className="text-end">
                            <img
                              src={question}
                              className="svg-style ms-1"
                              style={{ borderLeft: "1px solid #c7c7c7" }}
                            ></img>
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
                  </Col>
                </Row>
              </div>
            )}
          </Formik>
        </div>

        {/* Bill SC adjusment modal start */}
        {billadjusmentmodalshow ? (
          <Row className="justify-content-end" ref={this.ledgerModalRef}>
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
                innerRef={this.ref}
                initialValues={this.getElementObject(this.state.index)}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log({ values });
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
                      if (e.keyCode === 13) {
                        e.preventDefault();
                      }
                    }}
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
                                  autoFocus={true}
                                  className="bill-text"
                                  value={values.payableAmt}
                                  isValid={
                                    touched.payableAmt && !errors.payableAmt
                                  }
                                  isInvalid={!!errors.payableAmt}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                      // this.handleKeyDown(e, "isAdvanceCheck");
                                    }
                                  }}
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
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    // setFieldValue("selectedAmt", v);
                                    if (v != "") {
                                      this.setState({ selectedAmt: v });
                                    }
                                  }}
                                  className="bill-text text-end"
                                  value={this.finalBillSelectedAmt()}
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
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    if (v != "") {
                                      this.setState({ remainingAmt: v });
                                    }
                                  }}
                                  disabled
                                  value={this.finalRemaningSelectedAmt()}
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
                              value={isAdvanceCheck}
                              onClick={(e) => {
                                // console.log("e=======:::::", e.target.checked);
                                this.handleAdvaceCheck(e.target.checked);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
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
                                              { startDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
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
                                              { startDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
                                              // }
                                            );
                                          }
                                        } else {
                                          setFieldValue("d_start_date", "");
                                          this.setState(
                                            { startDate: e.target.value }
                                            // () => {
                                            //   this.SCFetchPendingBillsFilterWise();
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
                                              { endDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
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
                                              { endDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
                                              // }
                                            );
                                          }
                                        } else {
                                          setFieldValue("d_end_date", "");
                                          // this.lstPurchaseInvoice();
                                          this.setState(
                                            { endDate: e.target.value }
                                            // () => {
                                            //   this.SCFetchPendingBillsFilterWise();
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
                                        e.preventDefault();
                                        this.SCFetchPendingBillsFilterWise();
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.SCFetchPendingBillsFilterWise();
                                        }
                                      }}
                                    >
                                      Apply
                                    </Button>
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

                    {/* <Row>
                      <Col md="5">
                      </Col>
                      <Col md="7" className="my-auto">

                        {filterOpen == false ? <Row>
                          <Col lg={12} className="text-end pe-4">
                            <Form.Label>Filter</Form.Label>

                            <img src={Filter_img} className="filterimg"
                              onClick={() => this.setState({ filterOpen: true })} />
                          </Col>
                        </Row> : (
                        <Row>
                          <Col lg={4}><Row>
                            <Col lg={4} className="pe-0"> <Form.Label>Form Dt.</Form.Label></Col>
                            <Col lg={8}> <MyTextDatePicker
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              className="accountentry-date-style"
                            /></Col></Row></Col>
                          <Col lg={4}><Row>
                            <Col lg={4}> <Form.Label>To Dt.</Form.Label></Col>
                            <Col lg={8}> <MyTextDatePicker
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              className="accountentry-date-style" /></Col></Row></Col>
                          <Col lg={4}>
                            <Row>
                              <Col lg={6}>
                                <Button className="applybtn">Apply</Button>
                              </Col>
                              <Col lg={6} className="text-center">
                                <Form.Label>Clear</Form.Label>

                                <img src={close_grey_icon} className="filterimg ms-2" onClick={() => this.setState({ filterOpen: false })} />
                              </Col>
                            </Row>
                          </Col>
                          </Row>
                          )}
                      </Col>
                    </Row> */}
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
                            {/* {JSON.stringify(lstBills)} */}
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
                                            id="cmnChkId"
                                            // label="Invoice No."
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
                                                  id={`opening_chk_${ii}`}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
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
                                                id={`opening_paid_amt_${ii}`}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
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
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalBalanceOpeningAmt()}
                                  </th>

                                  <th
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalBillOpeningAmt()}
                                  </th>
                                  <th
                                    style={{ width: "10.8%" }}
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
                                            id="cmnChkId"
                                            className="checkboxstyle"
                                            // label="Invoice No."
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
                                            onKeyDown={(e) => {
                                              if (e.keyCode == 13) {
                                                this.focusNextElement(e);
                                              }
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
                                                  id={`invoice_chk_${ii}`}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
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
                                                id={`invoice_paid_amt_${ii}`}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
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
                                    <b>Grand Total</b>
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
                                  <th
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalBalanceInvoiceAmt()}
                                  </th>

                                  <th
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalBillInvoiceAmt()}
                                  </th>
                                  <th
                                    style={{ width: "10.8%" }}
                                    className="text-end"
                                  >
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
                                          id="cmnChkId"
                                          checked={
                                            isAllCheckeddebit === true
                                              ? true
                                              : false
                                          }
                                          onKeyDown={(e) => {
                                            if (e.keyCode === 13) {
                                              this.focusNextElement(e);
                                            }
                                          }}
                                          onChange={(e) => {
                                            this.handleBillsSelectionOpeningAll(
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
                                                id={`debit_chk_${ii}`}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
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
                                              id={`debit_paid_amt_${ii}`}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
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
                                              //   !selectedBills.includes(
                                              //     vi.invoice_no
                                              //   )
                                              // }
                                              style={{
                                                borderRadius: "0px",
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
                                  <td style={{ width: "13%" }}></td>
                                  <td></td>

                                  <th className="text-end">
                                    {this.finalBalanceDebitAmt()}
                                  </th>

                                  <th className="text-end">
                                    {this.finalBillDebitAmt()}
                                  </th>
                                  <th
                                    style={{ width: "10.8%" }}
                                    className="text-end"
                                  >
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
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <Table className="mb-2">
                      <thead className="footertbl1">
                        <tr style={{ background: "#A0EFD2" }}>
                          <td colSpan={2} className="bb-t">
                            {" "}
                            <b>Grand Total</b>
                          </td>

                          <th style={{ width: "13%" }} className="text-end">
                            {this.finalBillAmt()}
                          </th>

                          <th style={{ width: "10.8%" }} className="text-end">
                            {this.finalRemainingBillAmt()}
                          </th>
                        </tr>
                      </thead>
                    </Table>
                    <Row
                      className="py-1"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                      }}
                    >
                      <Col className="text-end me-2">
                        <Button
                          className="create-btn "
                          id="billbybillsubmitbtn"
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
          </Row>
        ) : (
          <></>
        )}

        {/* Bill SD adjusment modal start */}

        {sdbilladjusmentmodalshow ? (
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
                      this.setState({ sdbilladjusmentmodalshow: false })
                    }
                  />
                </Col>
              </Row>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                innerRef={this.sdref}
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
                            sdTotalDebitAmt: 0,
                            sdSelectedAmt: this.finalSDBillSelectedAmt(),
                            sdPayableAmt: values.sdPayableAmt,
                            sdRemainingAmt: this.finalSDRemaningSelectedAmt(),
                          },
                          () => {
                            this.handleBillByBillSDSubmit(values);
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
                  <Form
                    onSubmit={handleSubmit}
                    noValidate autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                      }

                    }}
                  >
                    {/* <div className="pmt-select-ledger"> */}
                    {/* <pre>{JSON.stringify(billLst)}</pre> */}
                    <div className="p-2" style={{ background: "#E6F2F8" }}>
                      <Row>
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
                                  type="text"
                                  placeholder="Payable Amt."
                                  name="sdPayableAmt"
                                  id="sdPayableAmt"
                                  autoComplete="nope"
                                  autoFocus="true"
                                  className="bill-text"
                                  // innerRef={(sdPayableAmt) => {
                                  //   this.ref.current = sdPayableAmt;
                                  // }}
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    setFieldValue("sdPayableAmt", v);
                                    if (v != "") {
                                      this.setState({
                                        sdTotalDebitAmt: v,
                                        sdPayableAmt: v,
                                      });
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      sdRemainingAmt: this.finalSDRemaningSelectedAmt(),
                                    });
                                  }}
                                  value={this.state.sdPayableAmt}
                                  isValid={
                                    touched.sdPayableAmt && !errors.sdPayableAmt
                                  }
                                  isInvalid={!!errors.sdPayableAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sdPayableAmt}
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
                                  name="sdSelectedAmt"
                                  id="sdSelectedAmt"
                                  autoComplete="nope"
                                  disabled
                                  className="bill-text text-end"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;

                                    // setFieldValue("sdSelectedAmt", e);
                                    // console.log(
                                    //   "selecteddddddddddddamt==??",
                                    //   e
                                    // );
                                    if (v != "") {
                                      this.setState({ sdSelectedAmt: v });
                                    }
                                  }}
                                  value={this.finalSDBillSelectedAmt()}
                                  isValid={
                                    touched.sdSelectedAmt &&
                                    !errors.sdSelectedAmt
                                  }
                                  isInvalid={!!errors.sdSelectedAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sdSelectedAmt}
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
                                  name="sdRemainingAmt"
                                  id="sdRemainingAmt"
                                  autoComplete="nope"
                                  disabled
                                  className="bill-text text-end"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let v = e.target.value;
                                    if (v != "") {
                                      this.setState({ sdRemainingAmt: v });
                                    }
                                  }}
                                  value={this.finalSDRemaningSelectedAmt()}
                                  isValid={
                                    touched.sdRemainingAmt &&
                                    !errors.sdRemainingAmt
                                  }
                                  isInvalid={!!errors.sdRemainingAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sdRemainingAmt}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        {/* {JSON.stringify(isAdvanceCheck)} */}
                        <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                          <Form.Group
                            controlId="formBasicCheckbox"
                            className="checkboxstyle"
                          >
                            <Form.Check
                              type="checkbox"
                              id="isSDAdvanceCheck"
                              name="isSDAdvanceCheck"
                              label="Advance Amt."
                              checked={isSDAdvanceCheck === true ? true : false}
                              value={isSDAdvanceCheck}
                              onClick={(e) => {
                                this.handleSDAdvaceCheck(e.target.checked);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  this.focusNextElement(e);
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

                    <div className="bill-main">
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
                                                { startDate: e.target.value }
                                                // () => {
                                                //   this.SCFetchPendingBillsFilterWise();
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
                                                { startDate: e.target.value }
                                                // () => {
                                                //   this.SCFetchPendingBillsFilterWise();
                                                // }
                                              );
                                            }
                                          } else {
                                            setFieldValue("d_start_date", "");
                                            this.setState(
                                              { startDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
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
                                                { endDate: e.target.value }
                                                // () => {
                                                //   this.SCFetchPendingBillsFilterWise();
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
                                                { endDate: e.target.value }
                                                // () => {
                                                //   this.SCFetchPendingBillsFilterWise();
                                                // }
                                              );
                                            }
                                          } else {
                                            setFieldValue("d_end_date", "");
                                            // this.lstPurchaseInvoice();
                                            this.setState(
                                              { endDate: e.target.value }
                                              // () => {
                                              //   this.SCFetchPendingBillsFilterWise();
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
                                          e.preventDefault();
                                          this.SCFetchPendingBillsFilterWise();
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 13) {
                                            this.SCFetchPendingBillsFilterWise();
                                          }
                                        }}
                                      >
                                        Apply
                                      </Button>
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
                      {/* <Row>
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
                                      className="bill-date"
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
                                      className="bill-date"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={6}>
                                    <Button className="applybtn">Apply</Button>
                                  </Col>
                                  <Col lg={6} className="text-center">
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
                      </Row> */}
                      {/* {JSON.stringify(billLstSD)} */}
                      {/*  Opening balance List  */}
                      {openingListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="ps-3">
                              <p className="tilte-name">Opening Balance :</p>
                            </Col>
                          </Row>
                          <div>
                            {billLstSD.length > 0 && (
                              <div className="billByBilltable">
                                <Table className="mb-0">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        <Form.Group controlId="formBasicCheckbox">
                                          <Form.Check
                                            className="checkboxstyle"
                                            // label="Invoice No."
                                            type="checkbox"
                                            id="sdcmnCHK"
                                            onKeyDown={(e) => {
                                              if (e.keyCode === 13) {
                                                this.focusNextElement(e);
                                              }
                                            }}
                                            checked={
                                              isAllChecked === true
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              this.handleSDBillsSelectionOpeningAll(
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
                                      {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                    {billLstSD.map((vi, ii) => {
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
                                                  id="{`sdopening_chk_${ii}`}"
                                                  name="invoice_no"
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_no}
                                                  checked={selectedBillsdebit.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                  onChange={(e) => {
                                                    // console.log("click");
                                                    if (
                                                      vi.invoice_unique_id != 0
                                                    ) {
                                                      this.handleSDBillselectionOpening(
                                                        vi.invoice_unique_id,
                                                        ii,
                                                        e.target.checked
                                                      );
                                                    } else {
                                                      this.handleSDAdvaceCheck(
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
                                                      values.sdPayableAmt
                                                    ) ==
                                                      this.finalSDBillSelectedAmt() &&
                                                      parseInt(
                                                        values.sdPayableAmt
                                                      ) > 0 &&
                                                      selectedBillsdebit.includes(
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
                                            <td>{vi.total_amt}</td>
                                            {/* <td></td> */}
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
                                                type="text"
                                                id="sdopening_paid_amt_${ii}"
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
                                                onChange={(e) => {
                                                  e.preventDefault();
                                                  // console.log(
                                                  //   "value",
                                                  //   e.target.value
                                                  // );
                                                  this.handleSDBillPayableAmtChange(
                                                    e.target.value,
                                                    ii
                                                  );
                                                }}
                                                value={
                                                  vi.paid_amt ? vi.paid_amt : 0
                                                }
                                                className="bill-text text-end border-0"
                                                readOnly={
                                                  !selectedBillsdebit.includes(
                                                    vi.invoice_unique_id
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
                                    {this.finalSDBalanceOpeningAmt()}
                                  </th>
                                  <th
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalSDBillOpeningAmt()}
                                  </th>
                                  <th
                                    style={{ width: "10%" }}
                                    className="text-end"
                                  >
                                    {this.finalSDRemaningOpeningAmt()}
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
                        ""
                      )}

                      {/* Invoice List */}
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
                            {billLstSD.length > 0 && (
                              <div className="billByBilltable">
                                <Table className="mb-0">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        <Form.Group controlId="formBasicCheckbox">
                                          <Form.Check
                                            // label="Invoice No."
                                            type="checkbox"
                                            className="checkboxstyle"
                                            id="sdcmnCHK"
                                            onKeyDown={(e) => {
                                              if (e.keyCode === 13) {
                                                this.focusNextElement(e);
                                              }
                                            }}
                                            checked={
                                              isAllChecked === true
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              this.handleSDBillsSelectionOpeningAll(
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
                                      {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                    {billLstSD.map((vi, ii) => {
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
                                                  // id="invoice_no"
                                                  id={`sdinvoice_chk_${ii}`}
                                                  name="invoice_no"
                                                  type="checkbox"
                                                  // label={vi.invoice_no}
                                                  value={vi.invoice_unique_id}
                                                  checked={selectedBillsdebit.includes(
                                                    vi.invoice_unique_id
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                  onChange={(e) => {
                                                    // console.log("click");
                                                    if (
                                                      vi.invoice_unique_id != 0
                                                    ) {
                                                      this.handleSDBillselectionOpening(
                                                        vi.invoice_unique_id,
                                                        ii,
                                                        e.target.checked
                                                      );
                                                    } else {
                                                      this.handleSDAdvaceCheck(
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
                                                      this.finalSDBillSelectedAmt() &&
                                                      parseInt(
                                                        values.payableAmt
                                                      ) > 0 &&
                                                      selectedBillsdebit.includes(
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
                                            <td>{vi.total_amt}</td>
                                            {/* <td>{vi.balance_type}</td> */}
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
                                                type="text"
                                                id={`sdinvoice_paid_amt_${ii}`}
                                                onChange={(e) => {
                                                  e.preventDefault();
                                                  // console.log(
                                                  //   "value",
                                                  //   e.target.value
                                                  // );
                                                  this.handleSDBillPayableAmtChange(
                                                    e.target.value,
                                                    ii
                                                  );
                                                }}
                                                value={
                                                  vi.paid_amt ? vi.paid_amt : 0
                                                }
                                                className="bill-text text-end border-0"
                                                readOnly={
                                                  !selectedBillsdebit.includes(
                                                    vi.invoice_id
                                                  )
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
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
                                    style={{ width: "13%" }}
                                    className="text-end"
                                  >
                                    {this.finalSDBalanceInvoiceAmt()}
                                  </th>
                                  <th
                                    className="text-end"
                                    style={{ width: "13%" }}
                                  >
                                    {this.finalSDBillInvoiceAmt()}
                                    {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                                  </th>
                                  <th
                                    style={{ width: "10.8%" }}
                                    className="text-end"
                                  >
                                    {this.finalSDRemaningInvoiceAmt()}
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
                        ""
                      )}

                      {/* Credit List */}
                      {debitListExist == true ? (
                        <>
                          <Row>
                            <Col md="5" className="m-2 mb-0">
                              <h6 className="tilte-name mb-0">
                                <b>Credit Note : </b>
                              </h6>
                            </Col>
                            <Col md="7" className="outstanding_title"></Col>
                          </Row>

                          {billLstSD.length > 0 && (
                            <div className="billByBilltable">
                              <Table className="mb-0">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                          type="checkbox"
                                          // label="Credit Note No."
                                          id="sdcmnCHK"
                                          onKeyDown={(e) => {
                                            if (e.keyCode === 13) {
                                              this.focusNextElement(e);
                                            }
                                          }}
                                          checked={
                                            isAllCheckeddebit === true
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            this.handleSDBillsSelectionOpeningAll(
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
                                    {/* <th style={{ width: "2%" }}>Type</th> */}
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
                                  {billLstSD.map((vi, ii) => {
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
                                                id={`sddebit_chk${ii}`}
                                                type="checkbox"
                                                // label={vi.credit_note_no}
                                                value={vi.invoice_no}
                                                checked={selectedBillsdebit.includes(
                                                  vi.invoice_unique_id
                                                )}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    this.focusNextElement(e);
                                                  }
                                                }}
                                                onChange={(e) => {
                                                  this.handleSDBillselectionOpening(
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
                                                    this.finalSDBillSelectedAmt() &&
                                                    selectedBillsdebit.includes(
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
                                          <td>{vi.total_amt}</td>
                                          {/* <td></td> */}
                                          <td
                                            style={{
                                              borderRight: "1px solid #d9d9d9",
                                            }}
                                          >
                                            {moment(vi.invoice_dt).format(
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                          <td>{vi.amount}</td>
                                          <td>{vi.balance_type}</td>
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
                                              type="text"
                                              id={`sddebit_paid_amt${ii}`}
                                              onChange={(e) => {
                                                e.preventDefault();
                                                // console.log(
                                                //   "value",
                                                //   e.target.value
                                                // );
                                                this.handleSDBillPayableAmtChange(
                                                  e.target.value,
                                                  ii
                                                );
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                  this.focusNextElement(e);
                                                }
                                              }}
                                              value={
                                                vi.paid_amt ? vi.paid_amt : 0
                                              }
                                              className="bill-text text-end border-0"
                                              readOnly={
                                                !selectedBillsdebit.includes(
                                                  vi.invoice_unique_id
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
                                <td style={{ width: "13%" }}></td>
                                <td></td>
                                <th className="text-end">
                                  {this.finalSDBalanceDebitAmt()}
                                </th>

                                <th className="text-end">
                                  {this.finalBillCreditAmt()}
                                </th>
                                <th
                                  style={{ width: "10.8%" }}
                                  className="text-end"
                                >
                                  {this.finalRemaningCreditAmt()}
                                </th>
                              </tr>
                            </tfoot>
                          </Table>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <Table className="mb-0">
                      <tfoot className="footertbl1">
                        <tr style={{ background: "#A0EFD2" }}>
                          <td className="bb-t" colSpan={2}>
                            {" "}
                            <b>Grand Total</b>
                          </td>
                          {/* <td></td>
                        <td></td> */}
                          <th style={{ width: "13%" }} className="text-end">
                            {this.finalSDBillAmt()}
                            {/* {billLst.map((v, i) => {
                                  {
                                    this.finalBillAmt('debit', v, i);
                                  }
                                })} */}
                          </th>
                          <th style={{ width: "10.8%" }} className="text-end">
                            {this.finalSDRemainingBillAmt()}
                          </th>
                        </tr>
                      </tfoot>
                    </Table>
                    <Row className="py-1">
                      <Col className="text-end me-2">
                        <Button className="create-btn " id="sdbillbybillsubbtn" type="submit">
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

        {/* /**Ledger Modal */}
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
                      this.handleJournalEditLedgerTableRow(e);
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
                              onKeyDown={(e) => {
                                if (e.keyCode === 40) {
                                  document
                                    .getElementById("productTr_0")
                                    .focus();
                                }
                              }}
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
                    <>
                      {/* {JSON.stringify(cashAcbankLst)} */}
                      {/* {JSON.stringify(paidAmount)} */}
                      {ledgersLst.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`journaledit-ledger-${i}`}
                            // id={`productTr_` + i}
                            prId={v.id}
                            tabIndex={i}
                            className={`${i == selectedLedgerIndex
                              ? "journaledit-ledger-selected-tr"
                              : ""
                              }`}
                            // className={`${JSON.stringify(v) == JSON.stringify(selectedLedger)
                            //   ? "selected-tr"
                            //   : ""
                            //   }`}
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
                              // console.log("v===>>::", v);
                              this.transaction_ledger_listFun(e.target.value);
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              // console.log("vvv", { v });
                              rows[rowIndex]["perticulars"] = v.ledger_name;

                              if (v.type == "bank_account") {
                                this.setState({
                                  bankaccmodal: true,
                                  rows: rows,
                                });
                              }
                              this.setState({ billadjusmentmodalshow: true });

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
                            <td className="ps-3">{v.current_balance}</td>
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
                                    // console.log({ data });
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
