import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { get_profit_and_loss_ac_details_step3 } from "@/services/api_functions";
import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
  // numberWithCommasIN,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";

export default class ProfitAndLoss3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previous_page_data: "",
      profitstep3: [],
      isEditDataSet: false,
      total_amt: "",
      debit_amt: [],
      credit_amt: [],
      startDate: "",
      endDate: "",
      ledger_name: "",
      openingBal: "",
      opening_debit: "",
      opening_credit: "",
      closing_debit: "",
      closing_credit: "",
      rules_type: "",
    };
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log("prop_data 3:", prop_data);
      this.setState({
        edit_data: prop_data,
        ledger_name: prop_data.ledger_name,
        openingBal: prop_data.opening_bal,
        rules_type: prop_data.rules_type,
        account_name: prop_data.account_name,
        opening_credit: prop_data.opening_bal > 0 ? prop_data.opening_bal : 0,
        opening_debit:
          prop_data.opening_bal < 0 ? Math.abs(prop_data.opening_bal) : 0,
      });
      console.log("Profit And Loss Third Page");
      // mousetrap.bindGlobal("esc", this.previousPageProfit2);
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.previousPageProfit2);
  }
  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let { isEditDataSet, edit_data } = this.state;
      if (isEditDataSet == false && edit_data != "") {
        this.get_profit_and_loss_ac_details_step3();
      }
    }
  }
  previousPageProfit2 = () => {
    let { edit_data } = this.state;
    console.log({ edit_data });
    eventBus.dispatch("page_change", {
      from: "profitandloss3",
      to: "profitandloss2",
      prop_data: {
        ledger_master_id: edit_data.ledger_master_id,
        principle_id: edit_data.principle_id,
        ledger_name: edit_data.ledger_name,
        account_name: edit_data.account_name,
        isNewTab: false,
      },
    });
  };
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { edit_data, startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    data.append("ledger_master_id", edit_data.ledger_master_id);
    get_profit_and_loss_ac_details_step3(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          this.setState({
            isEditDataSet: true,
            profitstep3: result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_profit_and_loss_ac_details_step3 = () => {
    let { edit_data } = this.state;
    let data = new FormData();
    data.append("start_date", edit_data.start_date);
    data.append("end_date", edit_data.end_date);
    data.append("ledger_master_id", edit_data.ledger_master_id);
    get_profit_and_loss_ac_details_step3(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          this.setState(
            {
              isEditDataSet: true,
              profitstep3: result,
              startDate: moment(
                response.data.d_start_date,
                "YYYY-MM-DD"
              ).toDate(),
              endDate: moment(response.data.d_end_date, "YYYY-MM-DD").toDate(),
            },
            () => {
              this.getClosingTotalAmount();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  getDebitTotalAmount = () => {
    let { profitstep3 } = this.state;
    let debitamt = 0;
    profitstep3.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };
  getCreditTotalAmount = () => {
    let { profitstep3 } = this.state;
    let credit = 0;
    profitstep3.map((v) => {
      credit = parseFloat(credit) + parseFloat(v["credit"]);
    });
    return isNaN(credit) ? 0 : parseFloat(credit).toFixed(2);
  };
  //For Closing Balance Calculation
  getClosingTotalAmount = () => {
    let { openingBal, closing_debit, closing_credit, rules_type } = this.state;
    let drsidetotal = this.getDebitTotalAmount();
    let crsidetotal = this.getCreditTotalAmount();
    console.log("Closing Balance:", rules_type);
    if (rules_type == "DR") {
      let closing_dr =
        openingBal + Math.abs(drsidetotal) - Math.abs(crsidetotal);
      console.log("closing_dr", closing_dr);
      return isNaN(closing_dr)
        ? 0
        : parseFloat(this.setState({ closing_debit: closing_dr })).toFixed(2);
    } else {
      let closing_cr =
        openingBal - Math.abs(drsidetotal) + Math.abs(crsidetotal);
      return isNaN(closing_cr)
        ? 0
        : parseFloat(this.setState({ closing_credit: closing_cr })).toFixed(2);
    }
  };

  getClosingBal = () => {
    let { openingBal, edit_data, profitstep3 } = this.state;
    let debitamt = 0;
    profitstep3.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });
    let creditamt = 0;
    profitstep3.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
    });
    let closeamt = 0;
    if (edit_data.cr > 0)
      closeamt =
        parseFloat(openingBal) + parseFloat(creditamt) - parseFloat(debitamt);

    if (edit_data.dr > 0)
      closeamt =
        parseFloat(openingBal) + parseFloat(debitamt) - parseFloat(creditamt);

    console.log({ closeamt });

    closeamt = Math.abs(closeamt);

    // return numberWithCommasIN(closeamt, true, 2);
  };
  render() {
    const {
      profitstep3,
      edit_data,
      edit_data_id,
      ledger_master_id,
      startDate,
      endDate,
      ledger_name,
      openingBal,
      opening_debit,
      opening_credit,
      closing_debit,
      closing_credit,
      rules_type,
    } = this.state;
    return (
      <div className="report-form-style">
        <Row style={{ background: "#E6F2F8" }}>
          {/* <Col md={4}>
            <h4 className="mb-0 ps-3 py-3 companyName">Demo Company</h4>
          </Col> */}
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              Profit & Loss A/c({openingBal},{rules_type})
            </h4>
          </Col>
        </Row>
        <hr className="my-0" />
        <Row style={{ background: "#E6F2F8" }}>
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              Ledger Name :{ledger_name}
            </h4>
          </Col>
        </Row>
        <hr className="my-0" />
        <div
          className="py-3 d-flex fromTo"
          style={{ background: "#E6F2F8", justifyContent: "end" }}
        >
          PERIOD :
          <MyDatePicker
            name="start_date"
            placeholderText="DD/MM/YYYY"
            id="start_date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            onChange={(newDate) => {
              console.log("Start Date is :", newDate);
              this.setState({ startDate: newDate });
            }}
            selected={startDate}
            value={startDate}
            className="report-date-style"
          />
          TO
          <MyDatePicker
            name="end_date"
            placeholderText="DD/MM/YYYY"
            id="end_date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            onChange={(newDate) => {
              console.log("End Date is :", newDate);
              this.setState({ endDate: newDate }, () => {
                this.get_profit_and_loss_ac_details_on_date_change_of_user();
              });
            }}
            selected={endDate}
            value={endDate}
            className="report-date-style"
          />
          {/* <Button
            className="ms-auto me-3"
            onClick={(e) => {
              e.preventDefault();
              eventBus.dispatch("page_change", {
                from: "profitandloss3",
                to: "profitandloss2",
                prop_data: {
                  ledger_master_id: edit_data.ledger_master_id,
                  principle_id: edit_data.principle_id,
                },
                isNewTab: false,
              });
              // eventBus.dispatch("page_change", "profitandloss2");
            }}
          >
            Back
          </Button> */}
          {/* </th> */}
        </div>
        <div className="report-list-style">
          <Table className="m-0">
            <thead>
              <tr style={{ background: "#d6fcdc" }}>
                <th
                  className="text-center"
                  style={{ borderBottom: "2px solid transparent" }}
                >
                  Date
                </th>
                <th
                  className="text-center"
                  style={{
                    borderBottom: "2px solid transparent",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Invoice No.
                </th>
                <th
                  className="text-center"
                  style={{ borderBottom: "2px solid transparent" }}
                >
                  Particulars
                </th>
                <th
                  className="text-center"
                  style={{
                    borderBottom: "2px solid transparent",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Voucher Type
                </th>
                <th
                  className="text-center"
                  style={{ borderBottom: "2px solid transparent" }}
                >
                  Debit
                </th>
                <th
                  className="text-center"
                  style={{
                    borderBottom: "2px solid transparent",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              {profitstep3.length > 0 ? (
                profitstep3.map((v) => {
                  return (
                    <tr
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        if (v.voucher_type == "purchase invoice") {
                          eventBus.dispatch("page_change", {
                            from: "profitandloss3",
                            to: "tranx_purchase_invoice_edit",
                            prop_data: v,
                          });
                        } else if (v.voucher_type == "purchase return") {
                          eventBus.dispatch("page_change", {
                            from: "profitandloss3",
                            to: "tranx_debit_note_edit",
                            prop_data: v,
                          });
                        } else if (v.voucher_type == "sales invoice") {
                          eventBus.dispatch("page_change", {
                            from: "profitandloss3",
                            to: "tranx_sales_invoice_edit",
                            prop_data: v,
                          });
                        } else if (v.voucher_type == "sales return") {
                          eventBus.dispatch("page_change", {
                            from: "profitandloss3",
                            to: "tranx_debit_note_edit",
                            prop_data: v,
                          });
                        }
                      }}
                    >
                      <td className="text-center">
                        {moment(v.transaction_date).format("DD-MM-YYYY")}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        {v.invoice_no}
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        {v.particulars}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        {v.voucher_type}
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                          textAlign: "center",
                        }}
                      >
                        {Math.abs(v.debit).toFixed(2)}
                      </td>
                      <td className="text-center">
                        {Math.abs(v.credit).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}

              {profitstep3.length > 0 &&
                Array.from(Array(12), (v) => {
                  return (
                    <tr>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        &nbsp;
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        &nbsp;
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        &nbsp;
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        &nbsp;
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        &nbsp;
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              {profitstep3.length > 0 ? (
                <>
                  <tr>
                    <th
                      colSpan={4}
                      style={{
                        borderBottom: "1px solid #C7CFE0",
                        textAlign: "end",
                      }}
                    >
                      Opening Balance
                    </th>
                    <th
                      style={{ border: "1px solid #C7CFE0" }}
                      className="text-center"
                    >
                      {Math.abs(opening_debit).toFixed(2)}
                    </th>
                    <th
                      style={{ border: "1px solid #C7CFE0" }}
                      className="text-center"
                    >
                      {Math.abs(opening_credit).toFixed(2)}
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      style={{
                        borderBottom: "1px solid #C7CFE0",
                        textAlign: "end",
                      }}
                    >
                      Total Amount
                    </th>
                    <th
                      style={{
                        border: "1px solid #C7CFE0",
                        textAlign: "center",
                      }}
                    >
                      {Math.abs(this.getDebitTotalAmount()).toFixed(2)}
                    </th>
                    <th
                      style={{ border: "1px solid #C7CFE0" }}
                      className="text-center"
                    >
                      {Math.abs(this.getCreditTotalAmount()).toFixed(2)}
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      style={{
                        borderBottom: "1px solid #C7CFE0",
                        textAlign: "end",
                      }}
                    >
                      Closing Balance
                    </th>
                    <th
                      style={{ border: "1px solid #C7CFE0" }}
                      className="text-center"
                    >
                      {Math.abs(closing_debit).toFixed(2)}
                    </th>
                    <th
                      style={{ border: "1px solid #C7CFE0" }}
                      className="text-center"
                    >
                      {Math.abs(closing_credit).toFixed(2)}
                    </th>
                  </tr>
                </>
              ) : (
                ""
              )}
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
