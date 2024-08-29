import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";

import { get_balance_ac_step3 } from "@/services/api_functions";

import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";

export default class BalanceSheet3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previous_page_data: "",
      profitstep2: [],
      isEditDataSet: false,
      total_amt: "",
      debit_amt: [],
      credit_amt: [],
      startDate: "",
      endDate: "",
      ledger_name: "",
      opening_bal: "",
      rules_type: "",
      principle_id: "",
      opening_debit: "",
      opening_credit: "",
      closing_total: "",
    };
  }
  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let { isEditDataSet, edit_data } = this.state;
      if (isEditDataSet == false && edit_data != "") {
        this.get_balance_ac_step3_month();
      }
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log("prop_data 3", prop_data);
      this.setState({
        edit_data: prop_data,
        ledger_name: prop_data.ledger_name,
        rules_type: prop_data.rules_type,
        account_name: prop_data.account_name,
        // principleGroup_id: prop_data.principleGroup_id,
      });

      // mousetrap.bindGlobal("esc", this.previousPageProfit3);
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.previousPageProfit1);
  }
  previousPageProfit3 = () => {
    let { edit_data } = this.state;
    console.log("ESC:2", edit_data);
    eventBus.dispatch("page_change", {
      from: "balancesheet3",
      to: "balancesheet2",
      prop_data: {
        principle_id: edit_data.principle_id,
        account_name: edit_data.account_name,
        ledger_master_id: edit_data.ledger_master_id,
        principleGroup_id: edit_data.principleGroup_id,
        ledger_name: edit_data.ledger_name,
      },
      isNewTab: false,
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
    get_balance_ac_step3(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          this.setState({
            isEditDataSet: true,
            profitstep2: result,
            opening_bal: response.data.opening_bal,
            opening_debit:
              response.data.opening_bal > 0 ? response.data.opening_bal : 0,
            opening_credit:
              response.data.opening_bal < 0 ? response.data.opening_bal : 0,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_balance_ac_step3_month = () => {
    let { edit_data } = this.state;
    let data = new FormData();
    data.append("ledger_master_id", edit_data.ledger_master_id);
    get_balance_ac_step3(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          this.setState({
            isEditDataSet: true,
            profitstep2: result,
            opening_bal: response.data.opening_bal,
            startDate: moment(
              response.data.d_start_date,
              "YYYY-MM-DD"
            ).toDate(),
            endDate: moment(response.data.d_end_date, "YYYY-MM-DD").toDate(),
            opening_debit:
              response.data.opening_bal < 0 ? response.data.opening_bal : 0,
            opening_credit:
              response.data.opening_bal > 0 ? response.data.opening_bal : 0,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  getDebitTotalAmount = () => {
    let { profitstep2 } = this.state;
    let debitamt = 0;
    profitstep2.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };
  getCreditTotalAmount = () => {
    let { profitstep2 } = this.state;
    let credit = 0;
    profitstep2.map((v) => {
      credit = parseFloat(credit) + parseFloat(v["credit"]);
    });
    return isNaN(credit) ? 0 : parseFloat(credit).toFixed(2);
  };
  getClosingTotalAmt = () => {
    let { profitstep2, rules_type, opening_bal } = this.state;
    let closingamt = 0;
    profitstep2.map((v) => {
      {
        rules_type == "DR"
          ? (closingamt =
              parseFloat(closingamt) +
              parseFloat(opening_bal + v.debit - v.credit))
          : (closingamt =
              parseFloat(closingamt) +
              parseFloat(opening_bal - v.debit + v.credit));
      }
    });
    return isNaN(closingamt) ? 0 : parseFloat(closingamt).toFixed(2);
  };
  render() {
    const {
      edit_data,
      ledger_master_id,
      prop_data,
      profitstep2,
      startDate,
      endDate,
      ledger_name,
      opening_bal,
      rules_type,
      opening_debit,
      opening_credit,
    } = this.state;
    return (
      <div className="report-form-style">
        <div className="p-3">
          <Table bordered hover responsive>
            <thead>
              <tr className="border-dark">
                <th colSpan={4} className="text-center">
                  <h4>MY COMPANY NAME</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={4} className="text-center">
                  <h4>Balance Sheet</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={4} className="text-center">
                  <h4>{ledger_name}</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={4}>
                  <div className="justify-content-center d-flex">
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
                      // maxDate={new Date()}
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
                  </div>
                </th>
              </tr>
              <tr className="border-dark">
                <th></th>
                <th colSpan={2} className="text-center">
                  <h4>Transactions</h4>{" "}
                </th>
                <th></th>
              </tr>

              <tr className="border-dark" style={{ background: "#d6fcdc" }}>
                <th className="text-center">Particulars</th>
                <th className="text-center" style={{ width: "15%" }}>
                  Debit
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Credit
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Closing Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="border-dark"
                onClick={(e) => {
                  e.preventDefault();
                  eventBus.dispatch("page_change", "balancesheet4");
                }}
              >
                <td>Opening balance</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(opening_debit).toFixed(2)}
                </td>
                <td className="text-center">
                  {" "}
                  {Math.abs(opening_credit).toFixed(2)}
                </td>
                <td className="text-center">
                  {" "}
                  {Math.abs(opening_bal).toFixed(2)}{" "}
                </td>
              </tr>
              {profitstep2.length > 0 ? (
                profitstep2.map((v, i) => {
                  return (
                    <tr
                      className="border-dark"
                      onClick={(e) => {
                        eventBus.dispatch("page_change", {
                          from: "balancesheet3",
                          to: "balancesheet4",
                          prop_data: {
                            ledger_master_id: edit_data.ledger_master_id,
                            principle_id: edit_data.principle_id,
                            principleGroup_id: edit_data.principleGroup_id,
                            start_date: v.start_date,
                            end_date: v.end_date,
                            opening_bal: opening_bal,
                            ledger_name: edit_data.ledger_name,
                            rules_type: rules_type,
                            account_name: edit_data.account_name,
                          },
                          isNewTab: false,
                        });
                      }}
                    >
                      <td>{v.month_name}</td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        {Math.abs(v.debit).toFixed(2)}
                      </td>
                      <td
                        className="text-center"
                        style={{ borderRight: "1px solid #C7CFE0" }}
                      >
                        {Math.abs(v.credit).toFixed(2)}
                      </td>
                      <td className="text-center">
                        {rules_type == "DR"
                          ? Math.abs(opening_bal + v.debit - v.credit).toFixed(
                              2
                            )
                          : Math.abs(opening_bal - v.debit + v.credit).toFixed(
                              2
                            )}
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
              {Array.from(Array(1), (v) => {
                return (
                  <tr>
                    <td>&nbsp;</td>
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
                    <td>&nbsp;</td>
                  </tr>
                );
              })}
              {/* <tr className="border-dark">
                <td>April</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>May</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>June</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>Jule</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>August</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>September</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>October</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>November</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>December</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr> */}
              {/* <tr className="border-dark">
                <td>January</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>February</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr>
              <tr className="border-dark">
                <td>March</td>
                <td></td>
                <td className="text-center">XXX</td>
                <td className="text-center">XXX</td>
              </tr> */}
            </tbody>
            <tfoot>
              <tr className="border-dark" style={{ background: "#dde2ed" }}>
                <th className="text-center">Total</th>
                <th className="text-center">
                  {" "}
                  {Math.abs(this.getDebitTotalAmount()).toFixed(2)}
                </th>
                <th className="text-center">
                  {" "}
                  {Math.abs(this.getCreditTotalAmount()).toFixed(2)}
                </th>
                <th className="text-center"> {this.getClosingTotalAmt()}</th>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
