import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import {
  get_profit_and_loss_ac_details_step2,
  get_debitnote_details,
} from "@/services/api_functions";
import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";

export default class DebitNote2 extends Component {
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
      companyName: "",
    };
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log("prop_data 2snhea is good", prop_data);
      this.setState({
        edit_data: prop_data,
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
      from: "debitNote2",
      to: "debitNote1",
      isNewTab: false,
    });
  };
  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let { isEditDataSet, edit_data } = this.state;
      if (isEditDataSet == false && edit_data != "") {
        this.get_profit_and_loss_ac_details_step2();
      }
    }
  }
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { edit_data, startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    get_debitnote_details(data)
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
  get_profit_and_loss_ac_details_step2 = () => {
    let { edit_data } = this.state;
    let data = new FormData();
    data.append("start_date", edit_data.startDate);
    data.append("end_date", edit_data.endDate);

    get_debitnote_details(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result", result);
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
            companyName: response.data.company_name,
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
      companyName,
    } = this.state;
    return (
      <div className="report-form-style">
        <Row style={{ background: "#E6F2F8" }}>
          {/* <Col md={4}>
            <h4 className="mb-0 ps-3 py-3 companyName">Demo Company</h4>
          </Col> */}
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              List of all Debit Vouchers{" "}
            </h4>
          </Col>
        </Row>
        <hr className="my-0" />
        <Row style={{ background: "#E6F2F8" }}>
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              {companyName}
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
              eventBus.dispatch("page_change", {
                from: "profitandloss2",
                to: "profitandloss1",
                prop_data: edit_data && edit_data.principle_id,
                isNewTab: false,
              });
            }}
          >
            Back
          </Button> */}
          {/* </th> */}
        </div>
        <div className="report-list-style">
          <Table className="m-0">
            <thead style={{ border: " 1px solid #C7CFE0" }}>
              {/* <tr
                style={{ border: "1px solid #0000001F", background: "#C3F0CA" }}
              >
                <th></th>
                <th colSpan={2} className="text-center">
                  Transactions
                </th>
                <th></th>
              </tr> */}

              <tr style={{ background: "#d6fcdc" }}>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "10%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "25%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Particulars
                </th>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "15%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Voucher Type
                </th>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "15%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                  }}
                >
                  Voucher No.
                </th>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  Debit Amt
                </th>
                <th
                  style={{
                    // borderBottom: "2px solid transparent",
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  Credit Amt
                </th>
              </tr>
            </thead>

            <tbody style={{ borderTop: "1px solid #C7CFE; importent" }}>
              {/* <tr>
                <td></td>
                <td
                  style={{
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  Openig Stock
                </td>
                <td></td>
                <td
                  className="text-center"
                  style={{
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  {Math.abs(opening_debit).toFixed(2)}
                </td>
                <td
                  className="text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(opening_credit).toFixed(2)}
                </td>
                <td className="text-center">
                  {Math.abs(opening_bal).toFixed(2)}
                </td>
              </tr> */}
              {profitstep2.length > 0 ? (
                profitstep2.map((v) => {
                  return (
                    <tr
                    // onClick={(e) => {
                    //   eventBus.dispatch("page_change", {
                    //     from: "ledgerReport2",
                    //     to: "ledgerReport3",
                    //     prop_data: {
                    //       ledger_master_id: edit_data.ledger_master_id,
                    //       principle_id: edit_data.principle_id,
                    //       start_date: v.start_date,
                    //       end_date: v.end_date,
                    //       opening_bal: opening_bal,
                    //       ledger_name: edit_data.ledger_name,
                    //       rules_type: rules_type,
                    //       account_name: edit_data.account_name,
                    //     },
                    //     isNewTab: false,
                    //   });
                    // }}
                    >
                      <td>{v.transaction_date}</td>
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
                        className="text-center"
                        style={{ borderRight: "1px solid #C7CFE0" }}
                      >
                        {v.voucher_no}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                        }}
                      >
                        {/* {rules_type == "DR"
                          ? Math.abs(opening_bal + v.debit - v.credit).toFixed(
                            2
                          )
                          : Math.abs(opening_bal - v.debit + v.credit).toFixed(
                            2
                          )} */}
                        {/* {Math.abs(v.debit).toFixed(2)} */}
                        {v.debit}
                      </td>
                      <td>{v.credit}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  {/* <td colSpan={6} className="text-center">
                    No Data Found
                  </td> */}
                </tr>
              )}
              {Array.from(Array(15), (v) => {
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
            </tbody>
            <tfoot>
              <tr
                style={{ border: "1px solid #DEE4EB", background: "#DDE2ED" }}
              >
                <th className="tfoot_title_style">TOTAL</th>
                <th className="tfoot_title_style"></th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                  }}
                >
                  {Math.abs(this.getDebitTotalAmount()).toFixed(2)}
                </th>
                <th className="tfoot_title_style"></th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getCreditTotalAmount()).toFixed(2)}
                </th>
                <th className="tfoot_amount_style text-center">
                  {this.getClosingTotalAmt()}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
