import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import {
  get_profit_and_loss_ac_details_step2,
  getLedgers,
  get_expiry_product_monthwise,
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
export default class ExpiryProduct2 extends Component {
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
      profitstep2: [],
      productName: "",
      unitName: "",
      batchId: "",
      d_start_date: "",
      d_end_date: "",
    };
  }
  profitbalancepage = (status) => {
    // let { lerdgerCreate } = this.setState;
    eventBus.dispatch("page_change", {
      from: "expiryProduct2",
      to: "expiryProduct1",
    });
  };
  PreviuosPageProfit = (status) => {
    // let { lerdgerCreate } = this.setState;
    eventBus.dispatch("page_change", {
      from: "expiryProduct2",
      to: "expiryProduct1",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log(" prop_data 1", prop_data);

      // console.log("group_name: prop_data.account_name", prop_data.account_name);
      mousetrap.bindGlobal("shift+p", this.profitbalancepage);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      // this.getlstLedger();
      this.setState({ edit_data: prop_data }, () => {
        console.log("product_id_data------------------", this.state.edit_data);
        if (prop_data != "") {
          this.setState({
            productId: prop_data.productId,
            productName: prop_data.product_name,
            batchId: prop_data.batchid,
            unitName: prop_data.unit_name,
          });

          //  this.get_profit_and_loss_ac_details_on_date_change_of_user();
        }
      });
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
    let { startDate, endDate, edit_data } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    data.append("product_id", edit_data.productId);
    data.append("batch_id", edit_data.batch_id);
    get_expiry_product_monthwise(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result :", result);
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
    data.append("product_id", edit_data.productId);
    data.append("batch_id", edit_data.batch_id);

    console.log("am in ");
    get_expiry_product_monthwise(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          console.log("result :", result);
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
  getPurchaseTotalvalue = () => {
    let { profitstep2 } = this.state;
    let pvalue = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let purchasepath = v.purchase;
      if (purchasepath.length > 0) {
        purchasepath.filter((k) => {
          if (k.qty > 0) {
            pvalue = parseFloat(pvalue) + parseFloat(k["value"]);
            console.log("This is Debit Amount", pvalue);
          }
        });
      }
    });
    return isNaN(pvalue) ? 0 : parseFloat(pvalue).toFixed(2);
  };
  getPurchaseTotalqty = () => {
    let { profitstep2 } = this.state;
    let pqty = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let purchasepath = v.purchase;
      if (purchasepath.length > 0) {
        purchasepath.filter((k) => {
          if (k.qty > 0) {
            pqty = parseFloat(pqty) + parseFloat(k["qty"]);
            console.log("This is Debit Amount", pqty);
          }
        });
      }
    });
    return isNaN(pqty) ? 0 : parseFloat(pqty).toFixed(2);
  };

  getSaleTotalvalue = () => {
    let { profitstep2 } = this.state;
    let pvalue = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let salepath = v.sale;
      if (salepath.length > 0) {
        salepath.filter((k) => {
          if (k.qty > 0) {
            pvalue = parseFloat(pvalue) + parseFloat(k["value"]);
            console.log("This is Debit Amount", pvalue);
          }
        });
      }
    });
    return isNaN(pvalue) ? 0 : parseFloat(pvalue).toFixed(2);
  };
  getSaleTotalqty = () => {
    let { profitstep2 } = this.state;
    let sqty = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let salepath = v.sale;
      if (salepath.length > 0) {
        salepath.filter((k) => {
          if (k.qty > 0) {
            sqty = parseFloat(sqty) + parseFloat(k["qty"]);
            console.log("This is Debit Amount", sqty);
          }
        });
      }
    });
    return isNaN(sqty) ? 0 : parseFloat(sqty).toFixed(2);
  };

  getClosingTotalvalue = () => {
    let { profitstep2 } = this.state;
    let cvalue = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let closingpath = v.closing;
      if (closingpath.length > 0) {
        closingpath.filter((k) => {
          if (k.qty > 0) {
            cvalue = parseFloat(cvalue) + parseFloat(k["value"]);
            console.log("This is Debit Amount", cvalue);
          }
        });
      }
    });
    return isNaN(cvalue) ? 0 : parseFloat(cvalue).toFixed(2);
  };
  getClosingTotalqty = () => {
    let { profitstep2 } = this.state;
    let cqty = 0;
    profitstep2.map((v) => {
      console.log("in debit function");
      let closingpath = v.closing;
      if (closingpath.length > 0) {
        closingpath.filter((k) => {
          if (k.qty > 0) {
            cqty = parseFloat(cqty) + parseFloat(k["qty"]);
            console.log("This is Debit Amount", cqty);
          }
        });
      }
    });
    return isNaN(cqty) ? 0 : parseFloat(cqty).toFixed(2);
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
      profitstep2,
      productName,
      batchId,
      unitName,
      d_start_date,
      d_end_date,
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
              {productName}
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
                    width: "7%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
                  }}
                >
                  Qty.
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
                  }}
                >
                  Unit
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "center",
                    borderRight: "1px solid #C7CFE0",
                    borderBottom: "2px solid #0000001F",
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
              {/* {JSON.stringify(profitstep2)} */}
              {profitstep2.length > 0 ? (
                profitstep2.map((v, i) => {
                  return (
                    <tr
                      style={{ border: "1px solid #DEE4EB" }}
                      onClick={(e) => {
                        console.log("V----", v);
                        eventBus.dispatch("page_change", {
                          from: "expiryProduct2",
                          to: "expiryProduct3",

                          prop_data: {
                            product_id: edit_data.productId,
                            product_name: edit_data.product_name,
                            batch_id: edit_data.batch_id,
                            d_start_date: v.start_date,
                            d_end_date: v.end_date,
                          },
                          isNewTab: false,
                        });
                      }}
                    >
                      <td>{v.month}</td>
                      {v.purchase.length > 0 ? (
                        v.purchase.map((k) => {
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
                                {k.qty > 0 ? unitName : ""}
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
                      {v.sale.length > 0 ? (
                        v.sale.map((k, j) => {
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
                                {k.qty > 0 ? unitName : ""}
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
                      {v.closing.length > 0 ? (
                        v.closing.map((k, j) => {
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
                                {k.qty > 0 ? unitName : ""}
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
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getPurchaseTotalqty()).toFixed(2)}
                </th>
                <th
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  style={{ borderRight: "1px solid #C7CFE0" }}
                  className="tfoot_amount_style text-center"
                >
                  {Math.abs(this.getPurchaseTotalvalue()).toFixed(2)}
                </th>
                <th
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getSaleTotalqty()).toFixed(2)}
                </th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getSaleTotalvalue()).toFixed(2)}
                </th>
                <th
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getClosingTotalqty()).toFixed(2)}
                </th>
                <th
                  className="tfoot_amount_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                ></th>
                <th
                  className="tfoot_title_style text-center"
                  style={{ borderRight: "1px solid #C7CFE0" }}
                >
                  {Math.abs(this.getClosingTotalvalue()).toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
