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
// import TRowComponent from '../Tranx/Components/TRowComponent';
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import Select from "react-select";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import {
  getcashAcbankaccount,
  get_last_record_contra,
  create_contra,
  get_contra_by_id,
  update_contra,
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
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    fontSize: "13px",
    border: "none",
    padding: "0 6px",
    fontFamily: "inter",
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
export default class ContraEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      bankaccmodal: false,
      isEditDataSet: false,
      cashAcbankLst: [],
      rows: [],
      initVal: {
        voucher_contra_sr_no: 1,
        voucher_contra_no: 1,
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
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
            transaction_dt: moment().format("YYYY-MM-DD"),
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
                label: v.name,
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

  initRows = (len = 10) => {
    let { rows } = this.state;
    for (let index = 0; index < len; index++) {
      let innerrow = {
        type: "",
        paid_amt: "",
      };
      if (index == 0) {
        // innerrow["type"] = "dr";
      }
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
    let debitBal = 0;
    let creditBal = 0;

    let { rows } = this.state;
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["debit"] != "" && !isNaN(v["debit"])) {
          debitBal = debitBal + parseFloat(v["debit"]);
        }
      } else if (v["type"] == "cr") {
        if (v["credit"] != "" && !isNaN(v["credit"])) {
          creditBal = creditBal + parseFloat(v["credit"]);
        }
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
        } else if (element == "credit") {
          v["paid_amt"] = value;
        }

        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    let lastCrBal = debitBal - creditBal;

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      frows = rows.map((vi, ii) => {
        if (ii == index && vi.type == "cr") {
          vi["credit"] = lastCrBal;
        } else if (ii == index && vi.type == "dr") {
          vi["debit"] = lastCrBal;
        }
        return vi;
      });

      if (obj.perticulars.type == "others") {
      } else if (obj.perticulars.type == "bank_account") {
        this.setState({ bankaccmodal: true });
      }
    }

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
      if (v.type == "cr" && v["credit"] != "") {
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
      from: "tranx_contra_edit",
      to: "tranx_contra_List",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.get_last_record_contraFun();
      this.lstgetcashAcbankaccount();
      this.initRows();
      const { prop_data } = this.props.block;
      console.log("prop_data==---->", prop_data);
      this.setState({ contraEditData: prop_data });
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
    }
  }
  componentDidUpdate() {
    const { isEditDataSet, contraEditData, cashAcbankLst } = this.state;
    console.log("contraEdit ", contraEditData);

    if (
      isEditDataSet == false &&
      contraEditData != "" &&
      cashAcbankLst.length > 0
      //   contraEditData.id != ""
    ) {
      this.setContraEditData();
    }
  }

  setContraEditData = () => {
    const { id } = this.state.contraEditData;
    let formData = new FormData();
    formData.append("contra_id", id);
    get_contra_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { contra_details } = res;
          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            lstAdditionalLedger,
            lstDisLedger,
            receiptEditData,
            sundryCreditorLst,
            cashAcbankLst,
          } = this.state;

          console.log("cashAcbankLst", cashAcbankLst);
          this.myRef.current.setFieldValue(
            "voucher_contra_sr_no",
            res.contra_sr_no
          );

          this.myRef.current.setFieldValue("voucher_contra_no", res.contra_no);
          this.myRef.current.setFieldValue("transaction_dt", res.tranx_date);
          this.myRef.current.setFieldValue("total_amt", res.total_amt);

          this.myRef.current.setFieldValue("narration", res.narrations);

          // let initInvoiceData = {
          //   type: perticulars.type,
          //   ledger_type: perticulars.ledger_type,
          //   ledger_name: perticulars.ledger_name,
          //   paid_amt: perticulars.paid_amt,
          //   bank_payment_no: perticulars.bank_payment_no,
          //   bank_payment_type: perticulars.bank_payment_type,
          // };

          console.log("contra_details", contra_details);
          let initRowData = [];

          if (contra_details.length > 0) {
            contra_details.map((v) => {
              console.log("==='''vvvv", v);
              let per = "";
              if (v.type == "cr") {
                per = getSelectValue(cashAcbankLst, v.ledger_id);
              }
              if (v.type == "dr") {
                per = getSelectValue(cashAcbankLst, v.ledger_id);
              }
              console.log("per", per);

              let inner_data = {
                details_id: v.details_id != 0 ? v.details_id : 0,
                type: v.type != null ? v.type : "",
                perticulars: per,
                paid_amt: v.type == "cr" ? v.cr : v.dr,
                bank_payment_no:
                  v.paymentTranxNo != null ? v.paymentTranxNo : "",
                bank_payment_type:
                  v.bank_payment_type != null ? v.bank_payment_type : "",
                debit: v.type == "dr" ? v.paid_amt : "",
                credit: v.type == "cr" ? v.paid_amt : "",
                narration: "",
              };
              // let innerrow = {
              //   type: "",
              //   perticulars: "",
              //   paid_amt: "",
              //   bank_payment_type: "",
              //   bank_payment_no: "",
              //   debit: "",
              //   credit: "",
              //   narration: "",
              // };
              initRowData.push(inner_data);
            });
          }
          console.log("Edit Row ==>", initRowData);

          this.setState(
            {
              rows: initRowData,
              isEditDataSet: true,
            },
            () => {
              const { rows } = this.state;
              console.log("rows in edit data", rows);
              if (this.state.rows.length != 10) {
                this.initRows(10 - this.state.rows.length);
              }
            }
          );
        }
      })
      .catch((error) => { });
  };

  render() {
    const {
      bankaccmodal,
      invoice_data,
      rows,
      cashAcbankLst,
      initVal,
      isEditDataSet,
    } = this.state;
    return (
      <div
        className="accountentrystyles"
        style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
        <div className="cust_table">
          {/* <h6>Purchase Invoice</h6> */}

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            enableReinitialize={true}
            initialValues={initVal}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            details_id: v.details_id != "" ? v.details_id : 0,
                            bank_payment_type: v.bank_payment_type.value,
                            bank_payment_no: v.bank_payment_no,
                            perticulars: perObj,
                          };
                        } else {
                          return {
                            type: v.type,
                            details_id: v.details_id != "" ? v.details_id : 0,
                            paid_amt: v.paid_amt,
                            // paid_amt: v.credit,
                            perticulars: perObj,
                          };
                        }
                      });

                      let formData = new FormData();

                      if (values.narration != null && values.narration != "")
                        formData.append("narration", values.narration);
                      formData.append("rows", JSON.stringify(frow));
                      formData.append("transaction_dt", values.transaction_dt);
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
                      formData.append("contra_id", values.voucher_contra_sr_no);
                      update_contra(formData)
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
                            // if ("ledgerId" in this.state.source != "") {
                            //   eventBus.dispatch("page_change", {
                            //     from: "tranx_contra_list",
                            //     to: "ledgerdetails",
                            //     prop_data: this.state.source["ledgerId"],

                            //     isNewTab: false,
                            //   });
                            //   // this.setState({ source: "" });
                            // } else
                            {
                              eventBus.dispatch(
                                "page_change",
                                "tranx_contra_List"
                              );
                            }

                            // eventBus.dispatch("page_change", {
                            //   from: "tranx_contra",
                            //   to: "tranx_contra_List",
                            //   isNewTab: false,
                            // });
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
                  msg: " Please Select check credit & debit Amount",
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
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <div className="new_trnx_design">
                <Row>
                  <Col md="12">
                    <Form onSubmit={handleSubmit} noValidate className="">
                      <div className="d-bg i-bg" style={{ height: "auto" }}>
                        <div className="institute-head p-2">
                          <Row>
                            {/* <Col md="12">
                              <div className="supplie-det">
                                <ul>
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="6"
                                        className="pt-0 lbl"
                                      >
                                        <b>Contra Sr : </b>
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
                                          name="voucher_contra_sr_no"
                                          id="voucher_contra_sr_no"
                                          disabled
                                          placeholder="PAY1234"
                                          className="mb-0"
                                          value={values.voucher_contra_sr_no}
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
                            {/*<Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="6"
                                        className="pt-0 lbl"
                                      >
                                        <b>Conta : </b>
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
                                          className="mb-0 "
                                          value={values.voucher_contra_no}
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
                                        className="pt-0 lbl"
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
                                name="voucher_contra_sr_no"
                                id="voucher_contra_sr_no"
                                autoFocus={true}
                                disabled
                                placeholder="PAY1234"
                                className="mb-0"
                                value={values.voucher_contra_sr_no}
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
                                className="mb-0 "
                                value={values.voucher_contra_no}
                              />
                            </Col>
                            <Col md="1" className="my-auto">
                              <Form.Label className="pt-0 lbl">
                                Transaction Date
                                {/* <span className="pt-1 req_validation">*</span> */}
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Control
                                innerRef={(input) => {
                                  this.invoiceDateRef.current = input;
                                }}
                                name="transaction_dt"
                                id="transaction_dt"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
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
                                      "warn:: isValid",
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
                        // style={{ maxHeight: "68vh", height: "68vh" }}
                        >
                          <Table
                            size="sm"
                            // className="key table-edit-style tbl-font"
                            className="tbl-font mt-2 mb-2"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{ width: "10%", textAlign: "center" }}
                                >
                                  Type
                                </th>
                                <th
                                  style={{ width: "70%", textAlign: "center" }}
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
                                      <td>
                                        <Form.Control
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
                                        </Form.Control>
                                      </td>
                                      <td
                                        style={{
                                          width: "70%",
                                          background: "#f5f5f5",
                                        }}
                                      >
                                        <Select
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
                                        />
                                      </td>

                                      <td>
                                        <Form.Control
                                          type="text"
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "debit",
                                              e.target.value,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "center" }}
                                          value={this.setElementValue(
                                            "debit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) ==
                                              "dr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </td>
                                      <td>
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
                                          value={this.setElementValue(
                                            "credit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) ==
                                              "cr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                            {/* <tfoot
                              style={{
                                background: "#dde2ed",
                                borderTop: "2px solid transparent",
                              }}
                            >
                              <tr>
                                <td
                                  style={{
                                    textAlign: "left",
                                    paddingRight: "10px",
                                  }}
                                >
                                  Total
                                </td>
                                <td></td>

                                <td
                                  style={{
                                    textAlign: "center",
                                    paddingRight: "10px",
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
                                  />
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    paddingRight: "10px",
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
                                  />
                                </td>
                              </tr>
                            </tfoot> */}
                            <thead
                              style={{ borderTop: "2px solid transparent" }}
                            >
                              <tr style={{ background: "#DDE2ED" }}>
                                <td
                                  className="pr-2 qtotalqty"
                                  style={{ width: "10%" }}
                                >
                                  Total
                                </td>
                                <td style={{ width: "70%" }}></td>
                                <td style={{ width: "10%" }}>
                                  <Form.Control
                                    style={{
                                      background: "transparent",
                                      textAlign: "center",
                                      border: "none",
                                    }}
                                    type="text"
                                    placeholder=""
                                    value={this.getTotalDebitAmt()}
                                    readonly
                                  />
                                </td>
                                <td
                                  style={{ width: "10%", textAlign: "center" }}
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
                                  />
                                </td>
                              </tr>
                            </thead>
                          </Table>
                        </div>

                        <Row className="mb-2 px-2">
                          <Col sm={9}>
                            <Row className="mt-2 mb-1">
                              <Col sm={1}>
                                <Form.Label className="text-label">
                                  Narration:
                                </Form.Label>
                              </Col>
                              <Col sm={10} lg={11}>
                                <Form.Control
                                  as="textarea"
                                  placeholder="Enter Narration"
                                  style={{
                                    height: "72px",
                                    resize: "none",
                                    width: "100%",
                                  }}
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
                                    msg: "Do you want to cancel",
                                    is_button_show: false,
                                    is_timeout: false,
                                    delay: 0,
                                    handleSuccessFn: () => {
                                      // if (
                                      //   "ledgerId" in this.state.source !=
                                      //   ""
                                      // ) {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "tranx_contra_edit",
                                      //     to: "ledgerdetails",
                                      //     prop_data:
                                      //       this.state.source["ledgerId"],

                                      //     isNewTab: false,
                                      //   });
                                      //   // this.setState({ source: "" });
                                      // } else {
                                      //   eventBus.dispatch(
                                      //     "page_change",
                                      //     "tranx_contra_List"
                                      //   );
                                      // }
                                      eventBus.dispatch(
                                        "page_change",
                                        "tranx_contra_List"
                                      );
                                    },
                                    handleFailFn: () => { },
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
                              Duplicate:{" "}
                              <span className="shortkey">Ctrl+D</span>
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
                      </div>
                    </Form>
                  </Col>
                </Row>
              </div>
            )}
          </Formik>
        </div>

        {/*  On Account payment- Bank Acc - Payable amount */}
        <Modal
          show={bankaccmodal}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ bankaccmodal: false })}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
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
                  bank_payment_no: Yup.string().required("No is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            className="selectTo"
                            placeholder=""
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
                          <Form.Label>Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="bank_payment_no"
                            placeholder="bank_payment_no"
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
                      <Col md="6" className="btn_align mt-4">
                        <Button className="createbtn mt-2" type="submit">
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
