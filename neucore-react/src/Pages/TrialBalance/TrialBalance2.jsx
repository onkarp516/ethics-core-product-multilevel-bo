import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import {
  get_profit_and_loss_ac_details_step1,
  getLedgers,
} from "@/services/api_functions";
import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
export default class TrialBalance2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitstep1: [],
      isEditDataSet: false,
      total_amt: "",
      debit_amt: [],
      credit_amt: [],
      lstLedger: [],
      showloader: true,
      orgData: [],
      startDate: "",
      endDate: "",
      rules_type: "",
      account_name: "",
    };
  }
  getlstLedger = () => {
    this.setState({ showloader: true });
    getLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          this.setState(
            {
              lstLedger: res.responseList,
              orgData: res.responseList,
              showloader: false,
              search: "",
            },
            () => {
              // this.getFilterLstLedger();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  profitbalancepage = (status) => {
    // let { lerdgerCreate } = this.setState;
    eventBus.dispatch("page_change", {
      from: "profitandloss1",
      to: "profitbalance",
    });
  };
  PreviuosPageProfit = (status) => {
    // let { lerdgerCreate } = this.setState;
    eventBus.dispatch("page_change", {
      from: "profitandloss1",
      to: "profitbalance",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log("prop_data 1:", prop_data);
      if (prop_data != "") {
        this.setState({
          edit_data: prop_data.principle_id,
          account_name: prop_data.account_name,
          // edit_data_id: prop_data.edit_data,
          // principle_id: prop_data.principle_id,
        });
      }
      // console.log("group_name: prop_data.account_name", prop_data.account_name);
      mousetrap.bindGlobal("shift+p", this.profitbalancepage);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.getlstLedger();
    }
  }
  componentWillUnmount() {
    mousetrap.unbindGlobal("shift+p", this.profitbalancepage);
    // mousetrap.unbindGlobal("esc", this.PreviuosPageProfit);
  }

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let { isEditDataSet, edit_data } = this.state;
      if (isEditDataSet == false && edit_data != "") {
        this.get_profit_and_loss_ac_details_step1();
      }
    }
  }
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { startDate, endDate, edit_data } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    data.append("principle_id", edit_data.p);
    get_profit_and_loss_ac_details_step1(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          this.setState({
            isEditDataSet: true,
            profitstep1: result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_profit_and_loss_ac_details_step1 = () => {
    let { edit_data } = this.state;
    let data = new FormData();
    data.append("principle_id", edit_data);
    get_profit_and_loss_ac_details_step1(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          this.setState({
            isEditDataSet: true,
            profitstep1: result,
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
    let { profitstep1 } = this.state;
    let debitamt = 0;
    profitstep1.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };
  getCreditTotalAmount = () => {
    let { profitstep1 } = this.state;
    let credit = 0;
    profitstep1.map((v) => {
      credit = parseFloat(credit) + parseFloat(v["credit"]);
    });
    return isNaN(credit) ? 0 : parseFloat(credit).toFixed(2);
  };
  render() {
    const {
      edit_data,
      prop_data,
      lstLedger,
      profitstep1,
      startDate,
      endDate,
      rules_type,
      account_name,
    } = this.state;
    return (
      <div className="report-form-style">
        <Row style={{ background: "#E6F2F8" }}>
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              COMPANY NAME
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
        </div>
        <div className="report-list-style">
          <Table className="m-0">
            <thead>
              <tr
                style={{ border: "1px solid #0000001F", background: "#C3F0CA" }}
              >
                <th
                  colSpan={1}
                  className="text-center"
                  style={{
                    // width: "15%",
                    borderBottom: "2px solid #defcd6",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                ></th>
                <th
                  colSpan={2}
                  className="text-center p-0"
                  style={{
                    // width: "15%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  <p className="p-2 mb-0">Opening Balance</p>
                  <p
                    className="p-2 mb-0"
                    style={{ borderTop: "1px solid #0000001f" }}
                  >
                    Amount (IN){" "}
                  </p>
                </th>
                <th
                  colSpan={2}
                  className="text-center p-0"
                  style={{
                    // width: "15%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  <p className="p-2 mb-0">Closing Balance</p>
                  <p
                    className="p-2 mb-0"
                    style={{ borderTop: "1px solid #0000001f" }}
                  >
                    Amount (IN){" "}
                  </p>
                </th>
              </tr>
              <tr className="thead_style">
                <th
                  style={{
                    width: "30%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
                  }}
                >
                  Particulars
                </th>

                <th
                  style={{
                    width: "10%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
                  }}
                >
                  Debit
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
                  }}
                >
                  Credit
                </th>

                <th
                  style={{
                    width: "10%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Debit
                </th>

                <th
                  style={{
                    width: "10%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="tbody_style">
              {lstLedger.length > 0 ? (
                lstLedger.map((v, i) => {
                  console.log("v.debit", v.debit);
                  return (
                    <tr style={{ border: "1px solid #DEE4EB" }}>
                      <td
                        onClick={(e) => {
                          console.log("V----", v);
                          eventBus.dispatch("page_change", {
                            from: "ledgerReport1",
                            to: "ledgerReport2",

                            prop_data: {
                              ledger_master_id: v.id,
                              principle_id: edit_data,
                              ledger_name: v.particular,
                              rules_type: rules_type,
                              account_name: account_name,
                            },
                            isNewTab: false,
                          });
                        }}
                      >
                        {v.ledger_name}
                      </td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                          textAlign: "center",
                        }}
                      >
                        {Math.abs(v.dr).toFixed(2)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                          textAlign: "center",
                        }}
                      >
                        {Math.abs(v.cr).toFixed(2)}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                          textAlign: "center",
                        }}
                      ></td>
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
              {/* {Array.from(Array(15), (v) => {
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
                    <td>&nbsp;</td>
                  </tr>
                );
              })} */}
              {lstLedger.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Data Found
                  </td>
                  {/* {showloader == true && LoadingComponent(showloader)} */}
                </tr>
              )}
            </tbody>
            <tfoot className="mb-0">
              <tr
                style={{ border: "1px solid #DEE4EB", background: "#DDE2ED" }}
              >
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  TOTAL
                </th>
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  style={{ borderRight: "1px solid #C7CFE0" }}
                  className="tfoot_amount_style text-center"
                >
                  {Math.abs(this.getDebitTotalAmount()).toFixed(2)}
                </th>

                <th className="tfoot_amount_style text-center">
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
