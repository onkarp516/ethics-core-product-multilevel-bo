import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { get_balance_ac_details_step2 } from "@/services/api_functions";

import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";

export default class BalanceSheet2 extends Component {
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
        this.get_balance_ac_details_step2_list();
      }
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log("prop_data 2", prop_data);
      this.setState({
        edit_data: prop_data,
        ledger_name: prop_data.ledger_name,
        rules_type: prop_data.rules_type,
        account_name: prop_data.account_name,
      });

      // mousetrap.bindGlobal("esc", this.previousPageProfit1);
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.previousPageProfit1);
  }
  previousPageProfit1 = () => {
    let { edit_data } = this.state;
    console.log("ESC:2", edit_data);
    eventBus.dispatch("page_change", {
      from: "balancesheet2",
      to: "balancesheet1",
      prop_data: {
        principle_id: edit_data.principle_id,
        account_name: edit_data.account_name,
      },
      isNewTab: false,
    });
  };
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { startDate, endDate, edit_data } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    data.append("principle_groups_id", edit_data.principleGroup_id);
    get_balance_ac_details_step2(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          this.setState({
            isEditDataSet: true,
            profitstep2: result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_balance_ac_details_step2_list = () => {
    let { edit_data } = this.state;
    console.log("edit_data---->", { edit_data });
    let data = new FormData();
    data.append("principle_groups_id", edit_data.principleGroup_id);
    get_balance_ac_details_step2(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          this.setState({
            isEditDataSet: true,
            profitstep2: result,
            startDate: moment(
              response.data.d_start_date,
              "YYYY-MM-DD"
            ).toDate(),
            endDate: moment(response.data.d_end_date, "YYYY-MM-DD").toDate(),
            rules_type: response.data.rules_type,
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
  render() {
    const {
      edit_data,
      prop_data,
      profitstep2,
      startDate,
      endDate,
      rules_type,
      account_name,
      ledger_name,
    } = this.state;
    return (
      <div className="report-form-style">
        <div className="p-3">
          <Table bordered hover responsive>
            <thead>
              <tr className="border-dark">
                <th colSpan={3} className="text-center">
                  <h4>MY COMPANY NAME</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={3} className="text-center">
                  <h4>Balance Sheet</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={3} className="text-center">
                  <h4>{ledger_name}</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={3}>
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
                  <h4>Closing Balance</h4>{" "}
                </th>
              </tr>

              <tr className="border-dark" style={{ background: "#d6fcdc" }}>
                <th className="text-center">Particulars</th>
                <th className="text-center" style={{ width: "15%" }}>
                  Debit A/c
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Credit A/c
                </th>
              </tr>
            </thead>
            <tbody>
              {profitstep2.length > 0 ? (
                profitstep2.map((v, i) => {
                  return (
                    <tr
                      className="border-dark"
                      style={{ border: "1px solid #DEE4EB" }}
                    >
                      <td
                        className="text-center"
                        onClick={(e) => {
                          eventBus.dispatch("page_change", {
                            from: "balancesheet2",
                            to: "balancesheet3",
                            prop_data: {
                              ledger_master_id: v.ledger_master_id,
                              principleGroup_id: edit_data.principleGroup_id,
                              principle_id: edit_data.principle_id,

                              ledger_name: v.particular,
                              rules_type: rules_type,
                              account_name: account_name,
                            },
                            isNewTab: false,
                          });
                        }}
                      >
                        {v.particular}
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
              {/* <tr
                className="border-dark"
                onClick={(e) => {
                  e.preventDefault();
                  eventBus.dispatch("page_change", "balancesheet3");
                }}
              >
                <td>Ledger Name</td>
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
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
