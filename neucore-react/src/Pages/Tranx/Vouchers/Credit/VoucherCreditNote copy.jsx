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
  create_credit,
  getLedgers,
  getTranxCreditNoteLastRecord,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  MyNotifications,
  MyTextDatePicker,
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
export default class VoucherCreditNote extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      bankaccmodal: false,
      ledgersLst: [],
      rows: [],
      initVal: {
        voucher_debit_sr_no: 1,
        voucher_debit_no: 1,
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
      },
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
            transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
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
            innerOpt["label"] = v.ledger_name;
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
            innerOpt["label"] = v.ledger_name;
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

  initRows = () => {
    let rows = [];
    for (let index = 0; index < 9; index++) {
      let innerrow = {
        type: "",
        paid_amt: "",
      };
      if (index == 0) {
        innerrow["type"] = "dr";
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
      // type: "",
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
    let frows = rows.map((v, i) => {
      console.log("v-type => ", v["type"]);
      console.log("i => ", { v, i });
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
      frows = rows.map((vi, ii) => {
        if (ii == index && vi.type == "cr") {
          vi["credit"] = lastCrBal;
          console.log("vi", vi);
        } else if (ii == index && vi.type == "dr") {
          vi["debit"] = lastCrBal;
        }
        return vi;
      });

      // if (obj.perticulars.type == 'others') {
      // } else if (obj.perticulars.type == 'bank_account') {
      //   this.setState({ bankaccmodal: true });
      // }
    }
    console.log("frows", { frows });

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
    console.log({ debitamt });
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
      from: "voucher_credit_note",
      to: "voucher_credit_List",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getTranxCreditNoteLastRecordFun();
      this.getlstLedger();
      //   this.getlstLedgerdetails();
      this.initRows();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
    }
  }

  render() {
    const { bankaccmodal, invoice_data, rows, ledgersLst, initVal } =
      this.state;
    return (
      <div className="accountentrystyles">
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
              console.log("values ----", values);
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
                      console.log("rows", JSON.stringify(frow));
                      console.log(rows);

                      frow = frow.map((v, i) => {
                        let perObj = {
                          id: v.perticulars.value,
                          type: v.perticulars.type,
                          label: v.perticulars.label,
                        };
                        if (v["debit"] != "" && v["type"] == "dr") {
                          v["paid_amt"] = v.debit;
                        } else if (v["credit"] != "" && v["type"] == "cr") {
                          v["paid_amt"] = v.credit;
                        }

                        return {
                          type: v.type,
                          paid_amt: v.paid_amt,
                          perticulars: perObj,
                        };
                      });
                      console.log("frow ---------", JSON.stringify(frow));

                      let formData = new FormData();

                      if (values.narration != null && values.narration != "")
                        formData.append("narration", values.narration);
                      formData.append("rows", JSON.stringify(frow));
                      formData.append(
                        "transaction_dt",
                        moment().format("yyyy-MM-DD")
                      );
                      formData.append(
                        "voucher_credit_sr_no",
                        values.voucher_credit_sr_no
                      );
                      let total_amt = this.getTotalDebitAmt();
                      formData.append("total_amt", total_amt);
                      formData.append(
                        "voucher_credit_no",
                        values.voucher_credit_no
                      );

                      create_credit(formData)
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
                            this.componentDidMount();

                            eventBus.dispatch("page_change", {
                              from: "voucher_credit_note",
                              to: "voucher_credit_List",
                              isNewTab: false,
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
                  msg: " Please match the credit & debit Amount",
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
              <Form
                onSubmit={handleSubmit}
                noValidate
                className=""
                style={{ overflow: "hidden" }}
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
                        name="voucher_credit_sr_no"
                        id="voucher_credit_sr_no"
                        onChange={handleChange}
                        value={values.voucher_credit_sr_no}
                        isValid={
                          touched.voucher_credit_sr_no &&
                          !errors.voucher_credit_sr_no
                        }
                        isInvalid={!!errors.voucher_credit_sr_no}
                        readOnly={true}
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
                        value={values.voucher_credit_no}
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
                          this.myRef.current = input;
                        }}
                        className="tnx-pur-inv-date-style "
                        name="transaction_dt"
                        id="transaction_dt"
                        placeholder="DD/MM/YYYY"
                        value={values.transaction_dt}
                        onChange={handleChange}
                        onBlur={(e) => {
                          console.log("e ", e);
                          console.log("e.target.value ", e.target.value);
                          if (e.target.value != null && e.target.value != "") {
                            console.warn(
                              "rahul:: isValid",
                              moment(e.target.value, "DD-MM-YYYY").isValid()
                            );
                            if (
                              moment(e.target.value, "DD-MM-YYYY").isValid() ==
                              true
                            ) {
                              setFieldValue("transaction_dt", e.target.value);
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Invalid invoice date",
                                is_button_show: true,
                              });
                              this.myRef.current.focus();
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
                          Credit
                        </th>
                        <th
                          style={{ width: "10%", textAlign: "center" }}
                          className="pl-4"
                        >
                          Debit
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
                              <td style={{ width: "10%" }}>
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
                                  value={this.setElementValue("type", ii)}
                                  placeholder="select type"
                                >
                                  {/* {ii == 0 ? (
                                    <option selected value="dr">
                                      Dr
                                    </option>
                                  ) : (
                                    <>
                                      <option value=""></option>
                                      <option value="dr">Dr</option>
                                    </>
                                  )} */}
                                  <option value=""></option>
                                  <option value="dr">Dr</option>
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
                                />
                              </td>

                              <td style={{ width: "10%" }}>
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
                                    this.setElementValue("type", ii) == "dr"
                                      ? false
                                      : true
                                  }
                                />
                              </td>
                              <td style={{ width: "10%" }}>
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
                    <thead
                      style={{
                        borderTop: "2px solid transparent",
                      }}
                    >
                      <tr style={{ background: "#DDE2ED" }}>
                        <td className="pr-2 qtotalqty" style={{ width: "10%" }}>
                          {" "}
                          Total
                        </td>
                        <td style={{ width: "70%" }}></td>
                        <td style={{ width: "10%" }}>
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
                      <Col sm={11}>
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
                              eventBus.dispatch("page_change", {
                                from: "voucher_credit_note",
                                to: "voucher_credit_List",
                                isNewTab: false,
                              });
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
