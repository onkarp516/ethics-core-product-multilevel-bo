import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import {
  get_profit_and_loss_ac_details_step2,
  getLedgers,
  get_monthwise_whole_stock_details,
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
import { parseInt } from "lodash";
export default class WholeStock2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitstep2: [],
      profitstep1: [],
      isEditDataSet: false,
      total_amt: "",
      totalSale: 0,
      totalPurchase: 0,
      debit_amt: [],
      credit_amt: [],
      lstLedger: [],
      showloader: true,
      orgData: [],
      startDate: "",
      endDate: "",
      rules_type: "",
      account_name: "",
      product_name: "",
      product_id_data: "",
      closing_stock: "",
      d_start_date: "",
      d_end_date: "",
    };
  }
  // getlstLedger = () => {
  //   this.setState({ showloader: true });
  //   getLedgers()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus === 200) {
  //         this.setState(
  //           {
  //             lstLedger: res.responseList,
  //             orgData: res.responseList,
  //             showloader: false,
  //             search: "",
  //           },
  //           () => {
  //             // this.getFilterLstLedger();
  //           }
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //       ShowNotification("Error", "Unable to connect the server");
  //     });
  // };
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
      from: "wholeStock2",
      to: "wholeStock1",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      let { prop_data } = this.props.block;
      console.log("prop_data 1:", prop_data);
      // console.log("group_name: prop_data.account_name", prop_data.account_name);
      mousetrap.bindGlobal("shift+p", this.profitbalancepage);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.setState({ edit_data: prop_data }, () => {
        console.log("product_id_data------------------", this.state.edit_data);
        if (prop_data != "") {
          this.setState({ product_name: prop_data.product_name });
          //  this.get_profit_and_loss_ac_details_on_date_change_of_user();
        }
      });

      // this.getlstLedger();
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
    data.append("productId", edit_data.productId);
    get_monthwise_whole_stock_details(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result", result);
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
    data.append("productId", edit_data.productId);
    get_monthwise_whole_stock_details(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result->", result);
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
      console.log("in debit function");
      console.log("v.responseObject.purchase", v.responseObject.purchase);
      let purchasepath = v.responseObject.purchase;
      if (purchasepath.length > 0) {
        purchasepath.filter((k) => {
          if (k.qty > 0) {
            debitamt = parseFloat(debitamt) + parseFloat(k["value"]);
            console.log("This is Debit Amount", debitamt);
          }
        });
      }
    });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };
  getCreditTotalAmount = () => {
    let { profitstep2 } = this.state;
    let credit = 0;
    profitstep2.map((v) => {
      console.log("in credit function");
      console.log("v.responseObject.purchase", v.responseObject.sale);
      let salespath = v.responseObject.sale;
      if (salespath.length > 0) {
        salespath.filter((k) => {
          if (k.qty > 0) {
            credit = parseFloat(credit) + parseFloat(k["value"]);
            console.log("This is Credit Amount", credit);
          }
        });
      }
    });
    return isNaN(credit) ? 0 : parseFloat(credit).toFixed(2);
  };
  getClosingTotalAmount = () => {
    let { profitstep2 } = this.state;
    let closings = 0;
    profitstep2.map((v) => {
      console.log("in closings function");
      console.log("v.responseObject.purchase", v.responseObject.closing);
      let closingpath = v.responseObject.closing;
      if (closingpath.length > 0) {
        closingpath.filter((k) => {
          if (k.qty > 0) {
            closings = parseFloat(closings) + parseFloat(k["value"]);
            console.log("This is closings Amount", closings);
          }
        });
      }
    });
    return isNaN(closings) ? 0 : parseFloat(closings).toFixed(2);
  };
  getClosingTotalAmt = () => {
    let { profitstep2, rules_type, opening_bal } = this.state;
    let closingamt = 0;
    profitstep2.map((v) => {
      rules_type == "DR"
        ? (closingamt =
            parseFloat(closingamt) +
            parseFloat(opening_bal + v.debit - v.credit))
        : (closingamt =
            parseFloat(closingamt) +
            parseFloat(opening_bal - v.debit + v.credit));
    });
    return isNaN(closingamt) ? 0 : parseFloat(closingamt).toFixed(2);
  };
  render() {
    const {
      profitstep2,
      ledger_master_id,
      edit_data,
      prop_data,
      lstLedger,
      profitstep1,
      startDate,
      endDate,
      product_name,
      rules_type,
      account_name,
      closing_stock,
      product_data,
      product_id_data,
      d_start_date,
    } = this.state;
    return (
      <div className="report-form-style">
        {/* <Row style={{ background: "#E6F2F8" }}>
          <Col md={4}>
            <h4 className="mb-0 ps-3 py-3 companyName">Demo Company</h4>
          </Col>
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">Ledger</h4>
          </Col>
        </Row> */}
        {/* <hr className="my-0" /> */}
        <Row style={{ background: "#E6F2F8" }}>
          <Col>
            <h4 className="mb-0 ps-3 py-3 companyName text-center">
              {product_name}
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
                  colSpan={3}
                  className="text-center"
                  style={{
                    // width: "15%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Purchase{" "}
                </th>
                <th
                  colSpan={3}
                  className="text-center"
                  style={{
                    // width: "15%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Sales{" "}
                </th>
                <th colSpan={3} className="text-center">
                  Closing Balance
                </th>
              </tr>
              <tr className="thead_style">
                <th
                  style={{
                    width: "20%",
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
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Qty.
                </th>
                <th
                  style={{
                    width: "7%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Unit
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
                  Value
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
                  Qty.
                </th>
                <th
                  style={{
                    width: "7%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Unit
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
                  Value
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
                  Qty.
                </th>
                <th
                  style={{
                    width: "7%",
                    borderBottom: "2px solid #0000001F",
                    borderRight: "1px solid #C7CFE0",
                    borderLeft: "1px solid #C7CFE0",
                    textAlign: "center",
                  }}
                >
                  Unit
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
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="tbody_style">
              {profitstep2.length > 0 ? (
                profitstep2.map((v, i) => {
                  return (
                    <tr
                      style={{ border: "1px solid #DEE4EB" }}
                      onClick={(e) => {
                        console.log("V----", v);
                        eventBus.dispatch("page_change", {
                          from: "wholeStock2",
                          to: "wholeStock3",

                          prop_data: {
                            productId: edit_data.productId,
                            batchno: edit_data.batchno,
                            product_name: edit_data.product_name,
                            d_start_date: startDate,
                            d_end_date: endDate,
                          },
                          isNewTab: false,
                        });
                      }}
                    >
                      <td>{v.month_name}</td>
                      {v.responseObject.purchase.length > 0 ? (
                        v.responseObject.purchase.map((k) => {
                          return (
                            <>
                              <td
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty == 0 ? "" : k.qty}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty > 0 ? k.unit : ""}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty > 0 ? k.value : ""}
                              </td>
                            </>
                          );
                        })
                      ) : (
                        <tr></tr>
                      )}
                      {v.responseObject.sale.length > 0 ? (
                        v.responseObject.sale.map((k, j) => {
                          return (
                            <>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty == 0 ? "" : k.qty}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty > 0 ? k.unit : ""}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty > 0 ? k.value : ""}
                              </td>
                            </>
                          );
                        })
                      ) : (
                        <tr></tr>
                      )}
                      {v.responseObject.closing.length > 0 ? (
                        v.responseObject.closing.map((k, j) => {
                          return (
                            <>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty == 0 ? "" : k.qty}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.qty > 0 ? k.unit : ""}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderRight: "1px solid #C7CFE0",
                                  borderLeft: "1px solid #C7CFE0",
                                  textAlign: "center",
                                }}
                              >
                                {k.value == 0 ? "" : k.value}
                              </td>
                            </>
                          );
                        })
                      ) : (
                        <tr></tr>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr></tr>
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
              {profitstep2.length === 0 && (
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
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {" "}
                  {Math.abs(this.getCreditTotalAmount()).toFixed(2)}
                </th>
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_title_style"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getClosingTotalAmount()).toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}