import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { get_monthwise_creditnote_details } from "@/services/api_functions";
import {
  MyDatePicker,
  eventBus,
  AuthenticationCheck,
  ShowNotification,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
export default class CreditNote1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitstep1: [],
      isEditDataSet: false,
      total_amt: "",
      debit_amt: [],
      credit_amt: [],
      startDate: "",
      endDate: "",
      startDate1: "",
      endDate1: "",
      rules_type: "",
      account_name: "",
      companyName: "",
    };
  }
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
      from: "creditNote1",
      to: "creditNote1",
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
      this.get_profit_and_loss_ac_details_step1();

      // console.log("group_name: prop_data.account_name", prop_data.account_name);
      mousetrap.bindGlobal("shift+p", this.profitbalancepage);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
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

    get_monthwise_creditnote_details(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result :", result);
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
    get_monthwise_creditnote_details()
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result :", result);
          let sdate = response.data.d_start_date;
          this.setState(
            {
              isEditDataSet: true,
              profitstep1: result,
              startDate1: sdate,
              endDate1: response.data.d_end_date,
              rules_type: response.data.rules_type,
              companyName: response.data.company_name,
            },
            () => {
              console.log("startDate---sneha", this.state.startDate1);
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
      profitstep1,
      startDate,
      endDate,
      rules_type,
      account_name,
      startDate1,
      endDate1,
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
              CREDITNOTE REGISTER
            </h4>
          </Col>
        </Row>
        <hr className="my-0" />
        <Row style={{ background: "#E6F2F8" }}>
          <Col>
            <h5 className="mb-0 ps-3 py-3 companyName text-center">
              {companyName}
            </h5>
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
                from: "profitandloss1",
                to: "profitbalance",
                isNewTab: false,
              });
            }}
          >
            Back
          </Button> */}
          {/* </th> */}
        </div>
        <div className="report-list-style-new">
          <Table className="m-0">
            <thead>
              <tr
                style={{ border: "2px solid #0000001F", background: "#C3F0CA" }}
              >
                <th
                  style={{
                    width: "10%",
                    borderBottom: "2px solid #defcd6",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                  className="text-center"
                >
                  Months
                </th>
                <th colSpan={11} className="text-center p-0">
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
                  style={
                    {
                      // borderBottom: "2px solid transparent",
                    }
                  }
                ></th>
                <th
                  style={{
                    width: "20%",
                    // borderBottom: "2px solid transparent",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  No. Of Vouchers
                </th>
                <th
                  style={{
                    width: "20%",
                    // borderBottom: "2px solid transparent",
                    textAlign: "center",
                  }}
                >
                  Cancelled
                </th>
              </tr>
            </thead>
            <tbody
              className="tbody_style"
              style={{ border: "2px solid #0000001F" }}
            >
              {profitstep1.length > 0 ? (
                profitstep1.map((v, i) => {
                  return (
                    <tr
                      style={{ border: "1px solid #DEE4EB" }}
                      onClick={(e) => {
                        eventBus.dispatch("page_change", {
                          from: "creditNote1",
                          to: "creditNote2",
                          prop_data: {
                            startDate: v.start_date,
                            endDate: v.end_date,
                          },
                          isNewTab: false,
                        });
                      }}
                    >
                      <td>{v.month}</td>
                      <td
                        style={{
                          borderRight: "1px solid #C7CFE0",
                          borderLeft: "1px solid #C7CFE0",
                          textAlign: "center",
                        }}
                      >
                        {Math.abs(v.no_vouchers).toFixed(2)}
                      </td>
                      <td className="text-center">
                        {Math.abs(v.total_amt).toFixed(2)}
                      </td>
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
