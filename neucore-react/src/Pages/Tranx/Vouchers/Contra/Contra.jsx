import React from "react";
import ReactDOM from "react-dom";//@neha On Escape key press and On outside Modal click Modal will Close
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
// import TRowComponent from '../Tranx/Components/TRowComponent';
import moment from "moment";
import Select from "react-select";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import search from "@/assets/images/search_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import delete_icon from "@/assets/images/delete_icon 3.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";
import Frame from "@/assets/images/Frame.png";
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
  getcashAcbankaccount,
  get_last_record_contra,
  create_contra,
  transaction_ledger_details,
  transaction_ledger_list,
  getOutletBankMasterList,
  getPaymentModes,
  checkInvoiceDateIsBetweenFY
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  MyNotifications,
  MyTextDatePicker,
  isActionExist,
  allEqual,
  getValue,
  ledger_select,
  customStyles1,
} from "@/helpers";

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
export default class Contra extends React.Component {
  constructor(props) {
    super(props);
    this.typeRef = React.createRef();
    this.bankListRef = React.createRef();
    this.myRef = React.createRef();
    this.bankNameRef = React.createRef();
    this.NewMyRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputRef1 = React.createRef();
    this.ledgerModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.state = {
      isCreate: false,
      prop_data: "",
      from_source: "tranx_contra",
      opType: "create",
      isPropDataSet: false,
      bankaccmodal: false,
      cashAcbankLst: [],
      orgCashList: [],
      rows: [],
      ledgerModal: false,
      ledgerData: "",
      ledgerList: [],
      objCR: "",
      additionalCharges: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      bankNameOpt: [],
      errorArrayBorder: "",
      errorArrayBorderBank: "",
      BankOpt: [],

      selectedLedgerIndex: 0,
      initVal: {
        voucher_contra_sr_no: 1,
        voucher_contra_no: 1,
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
      },
    };
  }

  get_last_record_contraFun = () => {
    get_last_record_contra()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let lastRow = res.response;
          let initVal = {
            voucher_contra_sr_no: res.count,
            voucher_contra_no: res.contraNo,
            transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
          };
          this.setState({ initVal: initVal });
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
        innerrow["typeobj"] = getValue(selectOpt, "dr");
        innerrow["type"] = "dr";
      }
      lst.push(innerrow);
      console.log("######push", lst);
    }

    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows }, () => {
        console.log("######", lst);
        this.handleChangeArrayElement("type", "dr", 0);
      });
    } else {
      this.setState({ rows: lst }, () => {
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
      type: "",
    };
    frows[index] = data;

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
    // debugger
    let debitBal = 0;
    let creditBal = 0;

    let { rows, rowIndex } = this.state;
    console.log("rowsssssssssss in handlechage====>", rows)

    let debitamt = 0;
    let creditamt = 0;
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
        if (element == "debit" && parseFloat(value) > 0) {
          v["paid_amt"] = value;
          // console.log("dr value", value);
        } else if (element == "credit" && parseFloat(value) > 0) {
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

    let lastCrBal = debitBal - creditBal;
    if (element == "perticulars") {
      // debugger
      let obj = frows.find((v, i) => i == index);
      console.log("objjjjjj====>", obj)
      if (obj.type == "cr") {
        // console.log("obj", obj);
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

      if (obj.perticulars.type == "others") {
      } else if (obj.perticulars.type == "bank_account") {
        this.setState({ bankaccmodal: true, rowIndex: index });
      }
    }

    // this.setState({ rows: frows, index: index });
    this.setState({ rows: frows, index: index }, () => {
      // this.FocusTrRowFieldsID(`contra-debit-${index}`);
      // frows = rows.map((v, ii) => {
      //   if (v["type"] == "cr") {
      //     this.FocusTrRowFieldsID(`contra-credit-${rowIndex}`);
      //   } else {
      //     this.FocusTrRowFieldsID(`contra-debit-${rowIndex}`);
      //   }
      // });
    });
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
      if (v.type == "dr" && v["debit"] != "") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
      }
    });

    return isNaN(debitamt) ? 0 : debitamt;
  };

  getTotalCreditAmt = () => {
    let { rows } = this.state;
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "cr") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });

    return isNaN(creditamt) ? 0 : creditamt;
  };

  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck : "";
  };

  handleBankAccountCashAccSubmit = (v) => {
    // debugger
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
              this.FocusTrRowFieldsID(`contra-credit-${rowIndex}`);
            } else {
              // alert("hekdsfgko")
              console.log("dr v", v)
              this.FocusTrRowFieldsID(`contra-debit-${rowIndex}`);
            }
          });
      }
    );
    if (v["type"] == "cr") {
      setTimeout(() => {
        document.getElementById(`contra-credit-${rowIndex}`).focus();
      }, 1000);
    } else if (v["type"] == "dr") {
      setTimeout(() => {
        document.getElementById(`contra-debit-${rowIndex}`).focus();
      }, 1000);
    }
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_contra",
      to: "tranx_contra_List",
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
              // ...v,
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
              ...v,
            };
          });
          console.warn("hello", res.list)
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            ledgerList: codeopt,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => { });
  };

  handlePropsData = (prop_data) => {
    // debugger;
    let { ledgerList } = this.state;
    if (prop_data.invoice_data && ledgerList.length > 0) {
      this.setState(
        {
          initVal: prop_data.invoice_data,
          rows: prop_data.rows,
          // productId: prop_data.productId,
          ledgerId: prop_data.ledgerId,
          // additionalChargesId: prop_data.additionalChargesId,
        },
        () => {
          let frows = [...this.state.rows];
          console.warn("prop_data", prop_data);
          console.warn("ledgerList", ledgerList);
          console.warn("ledgerID", parseInt(this.state.ledgerId));
          console.warn(
            "ledgerobj",
            getSelectValue(ledgerList, parseInt(this.state.ledgerId))
          );
          frows[prop_data.rowIndex]["typeobj"] = getSelectValue(
            selectOpt,
            frows[prop_data.rowIndex]["type"]
          );
          frows[prop_data.rowIndex]["perticulars"] = getSelectValue(
            ledgerList,
            parseInt(this.state.ledgerId)
          )
            ? getSelectValue(ledgerList, parseInt(this.state.ledgerId))
            : "";
          this.setState(
            { rows: frows, isPropDataSet: false, prop_data: "" },
            () => {

              this.handleChangeArrayElement("perticulars", getSelectValue(
                ledgerList,
                parseInt(this.state.ledgerId)
              )
                ? getSelectValue(ledgerList, parseInt(this.state.ledgerId))
                : "", prop_data.rowIndex)


              setTimeout(() => {
                if (prop_data != "") {
                  this.setState({ bankaccmodal: true, rowIndex: prop_data.rowIndex }, () => {
                    if (frows[prop_data.rowIndex]["type"].toLowerCase() == "cr") {
                      // console.log("cr v", v)
                      this.FocusTrRowFieldsID(`contra-credit-${prop_data.rowIndex}`);
                    } else {
                      // alert("hekdsfgko")
                      // console.log("dr v", v)
                      this.FocusTrRowFieldsID(`contra-debit-${prop_data.rowIndex}`);
                    }
                  })
                } else {
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

  componentDidUpdate() {
    let { ledgerList, isPropDataSet, prop_data } = this.state;
    if (ledgerList.length > 0 && isPropDataSet == true && prop_data != "") {
      this.handlePropsData(prop_data);
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      // @mrunal @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      this.get_last_record_contraFun();
      this.lstgetcashAcbankaccount();
      this.initRows(1);
      this.OutletBankMasterList();
      this.lstModeOfPayment();
      let { prop_data } = this.props.block;
      this.setState({ prop_data: prop_data, isPropDataSet: true }, () => {
        console.warn("prop_data COntraa", prop_data);

        this.handlePropsData(prop_data);
      });

      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.transaction_ledger_listFun();

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

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end
  // @mrunal @ On Escape key press Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };
  // @mrunal @ On outside Modal click Modal will Close
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

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
    }
  };

  handleContraLedgerTableRow(event) {
    // console.log("handleContraLedgerTableRow", event);
    let { rowIndex, ledgerList, selectedLedgerIndex, rows, cashAcbankLst } =
      this.state;
    // let { handleBillByBill, ledgerData } = this.props;
    // console.log("objCR==>", objCR, rowIndex);
    let currentR = rows[rowIndex];
    const k = event.keyCode;

    if (k == 13) {
      // console.log("enter work", selectedLedgerIndex, rowIndex);
      // let obj = cashAcbankLst[selectedLedgerIndex];
      // // console.log("enter work", obj);
      // if (obj) {
      //   this.handleChangeArrayElement(
      //     "perticulars",
      //     obj,
      //     rowIndex
      //   );
      //   this.setState({ ledgerModal: false, selectedLedgerIndex: 0 })
      //   this.transaction_ledger_listFun();
      // }
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
            if (obj.type == "bank_account") {
              this.setState({
                bankaccmodal: true,
                rows: rows,
              }, () => {
                setTimeout(() => {
                  this.bankListRef.current.focus();
                }, 100);
              });
            } else {
              this.setState(
                {
                  bankaccmodal: false,
                  index: -1,
                  // rows: [...this.state.rows, innerrow],
                },
                () => {
                  // console.log("row innerrow====", this.state.rows);
                  if (currentR && currentR["type"] == "cr") {
                    this.FocusTrRowFieldsID(`contra-credit-${rowIndex}`);
                  } else if (currentR && currentR["type"] == "dr") {
                    this.FocusTrRowFieldsID(`contra-debit-${rowIndex}`);
                  }
                }
              );

              this.FocusTrRowFieldsID(`contra-debit-${rowIndex}`);
            }
            // this.filterData("")
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
              `contra-ledger-${this.state.selectedLedgerIndex}`
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
              `contra-ledger-${this.state.selectedLedgerIndex}`
            );
          }
        );
      }
    } else if (k == 8) {
      this.FocusTrRowFieldsID(
        `contra-perticulars-${this.state.selectedLedgerIndex}`
      );
    }
  }
  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName)
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }
  OutletBankMasterList = () => {
    getOutletBankMasterList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let bankList = res.responseObject;
          console.log("bank list==========", bankList);
          let bankNameOpt = [];
          if (bankList.length > 0) {
            bankNameOpt = bankList.map((v) => {
              return {
                label: v.bankName,
                value: v.id,
              };
            });
          }
          console.log("bankNameOpt==========", bankNameOpt);

          this.setState({
            bankNameOpt: bankNameOpt,
          });
        }
      })
      .catch((error) => { });
  };
  // handleCreditdebitBalance = () => {
  //   let debitAmt = this.getTotalDebitAmt();
  //   let creditAmt = this.getTotalCreditAmt();

  //   if (debitAmt != creditAmt) {
  //     let innerrow = {
  //       type: "cr",
  //       typeobj: getSelectValue(selectOpt, "cr"),
  //       paid_amt: "",
  //     };

  //     this.setState({ rows: [...this.state.rows, innerrow] }, () => {
  //       console.log("row innerrow====", this.state.rows.length);
  //       this.FocusTrRowFieldsID(`contra-perticulars-${this.state.rows.length}`);
  //     });
  //   }
  // };


  handleCreditdebitBalance = (index) => {
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
      if (rows.length <= index + 1) {
        this.setState({ rows: [...this.state.rows, innerrow] }, () => {
          // console.log("row innerrow====", this.state.rows);
          if (this.typeRef) {
            this.typeRef.current?.focus();
          }
        });
      }
    }
  };

  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }

  filterData = (value, index) => {
    console.log("value in filter>>>>>>>>>>>>>>>", value);
    console.log("index in filter>>>>>>>>>>>>>>>", index);

    let { cashAcbankLst, orgCashList } = this.state;
    console.log("productLst--", cashAcbankLst);
    console.log("orgProductLst", orgCashList);
    let filterData = orgCashList.filter(
      (v) =>
        v.ledger_name.toLowerCase().includes(value)
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      rowIndex: index,
      code: value,
      cashAcbankLst: filterData.length > 0 ? filterData : [],
      ledgerModal: true,
    });
  }
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
              handleSuccessFn: () => {
                if (enteredDate != "") {
                  setTimeout(() => {
                    this.inputRef1.current?.focus();
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
              handleSuccessFn: () => {
                if (enteredDate != "") {
                  setTimeout(() => {
                    if (this.inputRef1.current) {
                      this.inputRef1.current?.focus();
                    }
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
  render() {
    const {
      bankaccmodal,
      invoice_data,
      rows,
      cashAcbankLst,
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
      bankNameOpt,
      orgCashList,
      selectedLedgerIndex,
      errorArrayBorderBank,
      BankOpt,
      opType,
      from_source,
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
                          let frow = filterRow.filter((v) => v.type != "");
                          console.log("frowwwww", frow);

                          frow = frow.map((v, i) => {
                            let perObj = {
                              id: v.perticulars.id,
                              type: v.perticulars.type,
                              label: v.perticulars.label,
                            };
                            if (v["debit"] != "" && v["type"] == "dr") {
                              v["paid_amt"] = v.debit;
                            }
                            if (v["credit"] != "" && v["type"] == "cr") {
                              v["paid_amt"] = v.credit;
                            }

                            if (
                              v.perticulars &&
                              v.perticulars.type == "bank_account"
                            ) {
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                bank_payment_type: v.bank_payment_type,
                                bank_payment_no: v.bank_payment_no,
                                bank_name: v.bank_name,
                                // check_number:v.check_number,
                                payment_date: v.payment_date,
                                perticulars: perObj,
                              };
                            } else {
                              return {
                                type: v.type,
                                paid_amt: v.paid_amt,
                                // paid_amt: v.credit,
                                perticulars: perObj,
                              };
                            }
                          });

                          let formData = new FormData();

                          if (
                            values.narration != null &&
                            values.narration != ""
                          )
                            formData.append("narration", values.narration);
                          formData.append("rows", JSON.stringify(frow));
                          formData.append(
                            "transaction_dt",
                            moment().format("yyyy-MM-DD")
                          );
                          formData.append(
                            "voucher_contra_sr_no",
                            values.voucher_contra_sr_no
                          );
                          let total_amt = this.getTotalDebitAmt();
                          formData.append("total_amt", total_amt);
                          formData.append(
                            "voucher_contra_no",
                            values.voucher_contra_no
                          );

                          for (const pair of formData.entries()) {
                            console.log(
                              `key => ${pair[0]}, value =>${pair[1]}`
                            );
                          }
                          create_contra(formData)
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
                                this.initRows();

                                eventBus.dispatch("page_change", {
                                  from: "tranx_contra",
                                  to: "tranx_contra_List",
                                  isNewTab: false,
                                  prop_data: {
                                    isCreate: true,
                                  }
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
                                    msg: "Server Error! Please Check Your Connectivity",
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
                      msg: " Please match the Credit and debit Amount",
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
                style={{ overflowY: "hidden", overflowX: "hidden" }}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="div-style">
                  <div className="inner-div-account">
                    <Row>
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
                          type="text"
                          name="receipt_sr_no"
                          id="receipt_sr_no"
                          onChange={handleChange}
                          value={values.voucher_contra_sr_no}
                          isValid={
                            touched.receipt_sr_no && !errors.receipt_sr_no
                          }
                          isInvalid={!!errors.receipt_sr_no}
                          readOnly={true}
                          className="accountentry-text-box"
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
                          type="text"
                          readOnly={true}
                          placeholder="1234"
                          className="accountentry-text-box"
                          value={values.voucher_contra_no}
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

                        >
                          <MyTextDatePicker
                            ref={this.inputRef}
                            innerRef={(input) => {
                              this.invoiceDateRef.current = input;
                            }}
                            autoFocus={true}
                            name="transaction_dt"
                            id="transaction_dt"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            value={values.transaction_dt}
                            onChange={handleChange}
                            className={`${values.transaction_dt == "" &&
                              errorArrayBorder[3] == "Y"
                              ? "border border-danger tnx-pur-inv-date-style"
                              : "tnx-pur-inv-date-style"
                              }`}
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
                                    console.log("finfinfinfin", finle);
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
                                      "transaction_dt"
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
                                      this.invoiceDateRef.current.focus();
                                      // setFieldValue(
                                      //   "transaction_dt",
                                      //   ""
                                      // );
                                    }, 500);
                                  }
                                } else {
                                  // setFieldValue("transaction_dt", "");
                                }
                              } else if (e.keyCode == 13) {
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
                                    console.log("finfinfinfin", finle);
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
                                      "transaction_dt"
                                    );
                                    this.FocusTrRowFieldsID(
                                      "contra-perticulars-0"
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
                                      this.invoiceDateRef.current.focus();
                                      // setFieldValue(
                                      //   "transaction_dt",
                                      //   ""
                                      // );
                                    }, 500);
                                  }
                                } else {
                                  // setFieldValue("transaction_dt", "");
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
                  className="contrTable"
                // style={{ maxHeight: "67vh", height: "67vh" }}
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
                        <th style={{ width: "10%", textAlign: "center" }}>
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
                                        value={this.setElementValue("type", ii)}
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
                                    defaultValue={selectOpt[0]}
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
                                    onFocus={(e) => {
                                      e.preventDefault();
                                      this.setState({ rowIndex: ii })
                                    }}
                                    name={`contra-type-${ii}`}
                                    id={`contra-type-${ii}`}
                                    value={this.setElementValue("typeobj", ii)}
                                    placeholder="Type"
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.key === "Tab") {
                                      } else if (
                                        e.key === "Tab"

                                      ) { }
                                      else if (e.keyCode === 13) {
                                        this.FocusTrRowFieldsID(
                                          `contra-perticulars-${rowIndex}`
                                        );
                                      }

                                    }}
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
                                  // background: "#f5f5f5",
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
                                        options={cashAcbankLst}
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
                                  name={`contra-perticulars-${ii}`}
                                  id={`contra-perticulars-${ii}`}
                                  className="account-prod-style border-0"
                                  placeholder=" "

                                  onChange={(e) => {
                                    e.preventDefault();
                                    this.filterData(e.target.value, ii);

                                    this.handleChangeArrayElement(
                                      "perticulars",
                                      e,
                                      ii
                                    );

                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.ledgerModalFun(true, ii);
                                    this.filterData("", ii)
                                  }}
                                  autoComplete="off"
                                  value={
                                    rows[ii]["perticulars"]
                                      ? rows[ii]["perticulars"]["ledger_name"]
                                      : ""
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalFun(true, ii);
                                      // setTimeout(() => {
                                      //   document
                                      //     .getElementById("addProduct")
                                      //     .focus();
                                      // }, 1000);
                                      this.filterData("", ii)
                                    } else if (e.shiftKey && e.key === "Tab") {
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
                                        this.setState({ ledgerModal: false });
                                      }
                                    }
                                    else if (e.keyCode == 40) {
                                      //! this condition for down button press 1409
                                      if (ledgerModal == true) {
                                        document
                                          .getElementById("contra-ledger-0")
                                          ?.focus();

                                      } else {
                                        this.FocusTrRowFields(
                                          "contra-perticulars",
                                          ii + 1
                                        );
                                      }
                                      // console.warn("Down");
                                    } else if (e.keyCode == 38) {

                                      this.FocusTrRowFields(
                                        "contra-perticulars",
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
                                  type="text"
                                  id={`contra-debit-${ii}`}
                                  name={`contra-debit-${ii}`}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleChangeArrayElement(
                                      "debit",
                                      e.target.value,
                                      ii
                                    );
                                  }}
                                  // onBlur={(e) => {
                                  //   this.handleCreditdebitBalance();
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                    } else if (e.keyCode == 13) {
                                      // console.log("enter", `contraEdt-type-${ii + 1}`);
                                      this.FocusTrRowFieldsID(`contraEdt-perticulars-${ii + 1}`);
                                      if (this.getTotalDebitAmt() === this.getTotalCreditAmt()) { }
                                      else {
                                        this.handleCreditdebitBalance(ii);
                                      }
                                    }

                                  }}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   let v = e.target.value;
                                  //   this.handleCreditdebitBalance();
                                  //   // this.setState({ totalDebitAmt: v });
                                  //   // this.handleBillByBill("debit", v, ii);
                                  // }}
                                  style={{ textAlign: "center" }}
                                  className="table-text-box border-0"
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
                              <td style={{ width: "10%" }}>
                                <Form.Control
                                  type="text"
                                  id={`contra-credit-${ii}`}
                                  name={`contra-credit-${ii}`}
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
                                  autoComplete="off"
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab") {
                                      this.handleCreditdebitBalance(ii);
                                    }
                                    else if (e.keyCode === 13) {
                                      if (this.getTotalDebitAmt() === this.getTotalCreditAmt()) {
                                        this.FocusTrRowFieldsID(
                                          "contra-narration"
                                        );
                                      }
                                      else {
                                        this.handleCreditdebitBalance(ii);
                                      }
                                    }
                                  }}
                                  style={{ textAlign: "center" }}
                                  className="table-text-box border-0"
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
                  <tr style={{ background: "#DDE2ED" }}>
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
                    <td>
                      <Form.Control
                        style={{
                          textAlign: "center",
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
                    <td style={{ width: "10%" }}>
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
                  </tr>
                </thead>

                <div className="btm-data px-2">
                  <Row className="px-2">
                    <Col sm={9}>
                      <Row className="">
                        <Col sm={1}>
                          <Form.Label className="text-label">
                            Narration:
                          </Form.Label>
                        </Col>
                        <Col sm={10}>
                          <Form.Control
                            // as="textarea"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Narration"
                            className="account-prod-style"
                            id="contra-narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                this.FocusTrRowFieldsID(
                                  "contrasubmit"
                                );
                              }
                            }}
                          />
                        </Col>
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
                        id="contrasubmit"
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
                                  from: "tranx_contra",
                                  to: "tranx_contra_List",
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
                                    from: "tranx_contra",
                                    to: "tranx_contra_List",
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
              innerRef={this.NewMyRef}
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
                <Form onSubmit={handleSubmit} noValidate className="pt-0 "
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}>
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                console.log(
                                  "values.bank_payment_type",
                                  values
                                );
                                if (
                                  values.bank_payment_type &&
                                  values.bank_payment_type.label == "Cheque"
                                ) {
                                  if (this.bankNameRef.current) {
                                    this.bankNameRef.current?.focus();
                                  }
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
                                } else if ((values.bank_payment_type.label == "Credit cards") || (values.bank_payment_type.label == "Debit cards")) {
                                  this.handleKeyDown(e, "payment_date");
                                }
                                else {
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    // if (values.bank_name) {
                                    this.handleKeyDown(
                                      e,
                                      "bank_payment_no"
                                    );
                                    // } else {
                                    //   e.preventDefault();
                                    // }
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
                      </>
                    ) : (<></>)}

                    {(values.bank_payment_type &&
                      values.bank_payment_type.label == "NEFT") ||
                      (values.bank_payment_type &&
                        values.bank_payment_type.label == "IMPS") ||
                      (values.bank_payment_type &&
                        values.bank_payment_type.label == "UPI") ||
                      (values.bank_payment_type &&
                        values.bank_payment_type.label == "Cheque") ? (
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
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.handleKeyDown(
                                        e,
                                        "payment_date"
                                      );
                                    }
                                  }}
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
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(
                                    e,
                                    "bank_submit_btn"
                                  );
                                }
                              }}
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
                      <Button className="successbtn-style" type="submit"
                        id="bank_submit_btn"
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            this.NewMyRef.current.handleSubmit();
                          }
                        }}>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

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
                <Table className=""
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleContraLedgerTableRow(e);
                    }
                  }}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>
                        <Row>
                          <Col lg={6}>Ledger Name</Col>
                          <Col lg={6} className="text-end">
                            <Button
                              id="addProduct"
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
                                    opType: opType,
                                    // from_page: "tranx_purchase_invoice_create",

                                  };
                                  eventBus.dispatch("page_change", {
                                    from_page: from_source,
                                    to: "ledgercreate",
                                    // prop_data: data,
                                    isNewTab: false,
                                    prop_data: { prop_data: data },
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
                                  document.getElementById("contra-ledger-0").focus();
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  {/* {JSON.stringify(objCR)} */}
                  <tbody
                    className="prouctTableTr"
                  >
                    {/* {JSON.stringify(cashAcbankLst)} */}
                    {/* {JSON.stringify(ledgerList)} */}
                    {/* {JSON.stringify(paidAmount)} */}
                    {cashAcbankLst.map((v, i) => {
                      return (
                        <tr
                          // value={JSON.stringify(v)}
                          // id={`productTr_` + i}
                          id={`contra-ledger-${i}`}
                          prId={v.id}
                          tabIndex={i}
                          // className={`${i == selectedLedgerIndex
                          //   ? "payment-ledger-selected-tr"
                          //   : ""
                          //   }`}
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
                                }, () => {
                                  setTimeout(() => {
                                    this.bankListRef.current.focus();
                                  }, 100);
                                });
                              }
                            });
                            this.setState({ ledgerModal: false, selectedLedgerIndex: 0 });
                            console.log("v===>>::", v);
                            this.transaction_ledger_listFun(e.target.value);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("vvv", { v });
                            rows[rowIndex]["perticulars"] = v.ledger_name;

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
