import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import {
  get_profit_and_loss_ac_details,
  get_profit_and_loss_ac_details_step1,
} from "@/services/api_functions";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import {
  MyDatePicker,
  eventBus,
  ShowNotification,
  AuthenticationCheck,
} from "@/helpers";

export default class ProfitBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitBalanceData: "",
      grossProfit: 0,
      grossLoss: 0,
      netProfit: 0,
      netLoss: 0,
      self_Page_principle_id: "",
      purchase_flag: "",
      direct_expenses_flag: "",
      indirect_exp_flag: "",
      sales_flag: "",
      direct_income_flag: "",
      indirect_income_flag: "",
      selfPageData: "",
      purchase_account_data: "",
      startDate: "",
      endDate: "",
      account_name: "",
    };
  }
  expandParticularList = (status) => {
    let {
      purchase_flag,
      direct_expenses_flag,
      indirect_exp_flag,
      direct_income_flag,
      indirect_income_flag,
    } = this.state;
    {
      purchase_flag == true
        ? this.setState({ purchase_flag: false })
        : this.setState({ purchase_flag: true });
    }
    {
      direct_expenses_flag == true
        ? this.setState({ direct_expenses_flag: false })
        : this.setState({ direct_expenses_flag: true });
    }
    {
      indirect_exp_flag == true
        ? this.setState({ indirect_exp_flag: false })
        : this.setState({ indirect_exp_flag: true });
    }
    {
      direct_income_flag == true
        ? this.setState({ direct_income_flag: false })
        : this.setState({ direct_income_flag: true });
    }
    {
      indirect_income_flag == true
        ? this.setState({ indirect_income_flag: false })
        : this.setState({ indirect_income_flag: true });
    }
  };
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    get_profit_and_loss_ac_details(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          this.setState({ profitBalanceData: response.data }, () => {
            this.grosstotalbalance();
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_profit_and_loss_ac_details = () => {
    get_profit_and_loss_ac_details()
      .then((response) => {
        if (response.data.responseStatus === 200) {
          this.setState(
            {
              profitBalanceData: response.data,
              startDate: moment(
                response.data.d_start_date,
                "YYYY-MM-DD"
              ).toDate(),
              endDate: moment(response.data.d_end_date, "YYYY-MM-DD").toDate(),
            },
            () => {
              this.grosstotalbalance();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      let { profitBalanceData } = this.state;
      this.get_profit_and_loss_ac_details();
      console.log("Self Page Principle Id", this.state.self_Page_principle_id);
      mousetrap.bindGlobal("shift+e", this.expandParticularList);
    }
  }
  get_principle_id_on_click_and_key_expand = (v, key) => {
    let data = new FormData();
    // console.log("edit_data :", edit_data);
    data.append("principle_id", v);
    get_profit_and_loss_ac_details_step1(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          key == "PA"
            ? this.setState({
                isEditDataSet: true,
                purchase_account_data: result,
              })
            : this.setState({
                isEditDataSet: true,
                selfPageData: result,
              });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  componentWillUnmount() {
    mousetrap.unbindGlobal("shift+e", this.expandParticularList);
  }
  // This is for Trading Account Calculation Start
  totalcalculationdrside = () => {
    let { profitBalanceData } = this.state;
    let drtotal =
      profitBalanceData.opening_stock +
      Math.abs(profitBalanceData.purchase_account) +
      profitBalanceData.direct_expenses;
    return drtotal;
  };
  totalcalculationcrside = () => {
    let { profitBalanceData } = this.state;
    let crtotal =
      profitBalanceData.sales_accounts +
      Math.abs(profitBalanceData.direct_income) +
      profitBalanceData.closing_stock;
    return crtotal;
  };

  totalbalance = () => {
    let drtotal = this.totalcalculationdrside();
    let crtotal = this.totalcalculationcrside();
    let grossbalance = 0;
    if (drtotal > crtotal) {
      return drtotal;
    } else {
      return crtotal;
    }
  };
  grosstotalbalance = () => {
    let drtotal = this.totalcalculationdrside();
    let crtotal = this.totalcalculationcrside();
    let grossbalance = crtotal - drtotal;
    if (grossbalance > 0) {
      this.setState({ grossProfit: Math.abs(grossbalance) }, () => {
        this.nettotalbalance();
      });
    } else {
      this.setState({ grossLoss: Math.abs(grossbalance) }, () => {
        this.nettotalbalance();
      });
    }
  };
  //This is for Profit And Loss Account Start

  totalcalculationdrsideprofit = () => {
    let { profitBalanceData, grossLoss } = this.state;
    let drtotal = grossLoss + Math.abs(profitBalanceData.indirect_expenses);
    return drtotal;
  };
  totalcalculationcrsideprofit = () => {
    let { profitBalanceData, grossProfit } = this.state;
    let crtotal = grossProfit + Math.abs(profitBalanceData.indirect_income);
    return crtotal;
  };
  totalbalanceprofit = () => {
    let drtotal = this.totalcalculationdrsideprofit();
    let crtotal = this.totalcalculationcrsideprofit();
    if (drtotal > crtotal) {
      return drtotal;
    } else {
      return crtotal;
    }
  };
  nettotalbalance = () => {
    let { profitBalanceData, grossLoss } = this.state;
    let drtotal = grossLoss + Math.abs(profitBalanceData.indirect_expenses);
    let crtotal = this.totalcalculationcrsideprofit();
    let netbalance = crtotal - drtotal;
    if (netbalance > 0) {
      this.setState({ netProfit: Math.abs(netbalance) });
    } else {
      this.setState({ netLoss: Math.abs(netbalance) });
    }
  };
  render() {
    let {
      profitBalanceData,
      grossProfit,
      grossLoss,
      netProfit,
      netLoss,
      purchase_flag,
      direct_expenses_flag,
      indirect_exp_flag,
      sales_flag,
      direct_income_flag,
      indirect_income_flag,
      self_Page_principle_id,
      selfPageData,
      purchase_account_data,
      startDate,
      endDate,
    } = this.state;
    return (
      <div className="report-form-style">
        <div style={{ background: "#E6F2F8" }}>
          {/* {JSON.stringify(selfPageData)} */}
          <h4 className="mb-0 ps-3 py-3 companyName text-center">
            Profit and loss A/c
          </h4>
        </div>
        <hr className="my-0" />
        {/* <Row style={{ background: "#E6F2F8" }} className="py-3">
          <Col className="text-end" lg={5} md={6} sm={12} xs={12}> */}
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
        {/* </Col>
        </Row> */}
        <Row>
          <Col lg={6} md={6} sm={6} xs={6} className="pe-0">
            {" "}
            <div className="tbl-list-style">
              <Table className="mt-2">
                <thead>
                  <tr
                    style={{ border: "1px solid #0000001F" }}
                    className="drcr"
                  >
                    <th
                      colSpan={2}
                      style={{
                        background: "#F9CFD1",
                      }}
                    ></th>
                    <th
                      className="text-center"
                      style={{
                        background: "#F9CFD1",
                      }}
                    >
                      {" "}
                      Dr.
                    </th>
                  </tr>
                  <tr className="thead_style">
                    <th
                      style={{ borderBottom: "2px solid transparent" }}
                      colSpan={2}
                    >
                      Particulars
                    </th>
                    <th
                      className="border-end text-center"
                      style={{
                        width: "25%",
                        borderBottom: "2px solid transparent",
                      }}
                    >
                      Amount (INR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        {
                          this.setState({
                            self_Page_principle_id:
                              profitBalanceData.opening_stock_id,
                          });
                        }
                        // eventBus.dispatch("page_change", {
                        //   from: "profitbalance",
                        //   to: "profitandloss1",
                        //   prop_data: profitBalanceData.opening_stock_id,
                        //   isNewTab: false,
                        // });
                      }}
                    >
                      Opening Stock
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.opening_stock).toFixed(2)}
                    </th>
                  </tr>

                  <tr
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      eventBus.dispatch("page_change", {
                        from: "profitbalance",
                        to: "profitandloss1",
                        prop_data: {
                          principle_id: profitBalanceData.purchase_account_id,
                          account_name: "Purchase Account",
                        },
                        isNewTab: false,
                      });
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        purchase_flag == true
                          ? this.setState({ purchase_flag: false })
                          : this.setState({ purchase_flag: true }, () => {
                              this.get_principle_id_on_click_and_key_expand(
                                profitBalanceData.purchase_account_id,
                                "PA"
                              );
                            });
                      }}
                    >
                      Purchase Accounts
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.purchase_account).toFixed(2)}
                    </th>
                  </tr>

                  {purchase_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {purchase_account_data.length > 0
                        ? purchase_account_data.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr
                    onDoubleClick={(e) => {
                      if (
                        Math.abs(profitBalanceData.direct_expenses.length) > 0
                      ) {
                        eventBus.dispatch("page_change", {
                          from: "profitbalance",
                          to: "profitandloss1",
                          prop_data: {
                            principle_id: profitBalanceData.direct_expenses_id,
                            account_name: "Direct Expenses",
                          },
                          isNewTab: false,
                        });
                      }
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        direct_expenses_flag == true
                          ? this.setState({ direct_expenses_flag: false })
                          : this.setState(
                              { direct_expenses_flag: true },
                              () => {
                                this.get_principle_id_on_click_and_key_expand(
                                  profitBalanceData.direct_expenses_id
                                  // "DE"
                                );
                              }
                            );
                      }}
                    >
                      Direct Expenses
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.direct_expenses).toFixed(2)}
                    </th>
                  </tr>
                  {direct_expenses_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {selfPageData.length > 0
                        ? selfPageData.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>CGST ON PURCHASE 9%</td>
                        <td className="text-end">1234</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr>
                    <th colSpan={2}>Gross Profit c/f</th>
                    <th className="border-end text-center">
                      {Math.abs(grossProfit).toFixed(2)}
                    </th>
                  </tr>

                  <tr
                    style={{
                      background: "#F1F4F7",
                    }}
                  >
                    <th colSpan={2}></th>
                    <th className="border-end tfoot_amount_style text-center">
                      {this.totalbalance().toFixed(2)}
                    </th>
                  </tr>

                  <tr>
                    <th colSpan={2}>Gross Loss b/f</th>
                    <th className="border-end text-center">
                      {Math.abs(grossLoss).toFixed(2)}
                    </th>
                  </tr>

                  <tr
                    onDoubleClick={(e) => {
                      eventBus.dispatch("page_change", {
                        from: "profitbalance",
                        to: "profitandloss1",
                        prop_data: {
                          principle_id: profitBalanceData.indirect_expenses_id,
                          account_name: "Indirect Expenses",
                        },
                        isNewTab: false,
                      });
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        indirect_exp_flag == true
                          ? this.setState({ indirect_exp_flag: false })
                          : this.setState({ indirect_exp_flag: true }, () => {
                              this.get_principle_id_on_click_and_key_expand(
                                profitBalanceData.indirect_expenses_id
                                // "IE"
                              );
                            });
                      }}
                    >
                      Indirect Expenses
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.indirect_expenses).toFixed(2)}
                    </th>
                  </tr>
                  {indirect_exp_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {selfPageData.length > 0
                        ? selfPageData.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>CGST ON PURCHASE 9%</td>
                        <td className="text-end">1234</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr>
                    <th colSpan={2}>Net Profit</th>
                    <th className="border-end text-center">
                      {Math.abs(netProfit).toFixed(2)}
                    </th>
                  </tr>

                  {Array.from(Array(9), (v) => {
                    return (
                      <tr>
                        <th colSpan={3} className="border-end">
                          &nbsp;
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      border: "1px solid #DEE4EB",
                      background: "#DDE2ED",
                    }}
                  >
                    <th className="tfoot_title_style" colSpan={2}>
                      TOTAL
                    </th>
                    <th
                      style={{ borderRight: "1px solid #C7CFE0" }}
                      className="tfoot_amount_style text-center"
                    >
                      {Math.abs(this.totalbalanceprofit()).toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Col>

          <Col lg={6} md={6} sm={6} xs={6} className="ps-0">
            {" "}
            <div className="tbl-list-style">
              <Table className="mt-2">
                <thead>
                  <tr
                    style={{ border: "1px solid #0000001F" }}
                    className="drcr"
                  >
                    <th
                      colSpan={2}
                      style={{
                        background: "#C3F0CA",
                      }}
                    ></th>
                    <th
                      className="text-center"
                      style={{
                        background: "#C3F0CA",
                      }}
                    >
                      {" "}
                      Cr.
                    </th>
                    {/* <td></td> */}
                  </tr>
                  <tr className="thead_style">
                    <th
                      style={{ borderBottom: "2px solid transparent" }}
                      colSpan={2}
                    >
                      Particulars
                    </th>
                    <th
                      className="border-end text-center"
                      style={{
                        width: "25%",
                        borderBottom: "2px solid transparent",
                      }}
                    >
                      Amount(INR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    onDoubleClick={(e) => {
                      eventBus.dispatch("page_change", {
                        from: "profitbalance",
                        to: "profitandloss1",
                        prop_data: {
                          principle_id: profitBalanceData.sales_accounts_id,
                          account_name: "Sales Account",
                        },
                        isNewTab: false,
                      });
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        sales_flag == true
                          ? this.setState({ sales_flag: false })
                          : this.setState({ sales_flag: true }, () => {
                              this.get_principle_id_on_click_and_key_expand(
                                profitBalanceData.sales_accounts_id
                                // "SA"
                              );
                            });
                      }}
                    >
                      Sales Accounts
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.sales_accounts).toFixed(2)}
                    </th>
                  </tr>
                  {sales_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {selfPageData.length > 0
                        ? selfPageData.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>CGST ON PURCHASE 9%</td>
                        <td className="text-end">1234</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr
                    onDoubleClick={(e) => {
                      if (
                        Math.abs(profitBalanceData.direct_income).length > 0
                      ) {
                        eventBus.dispatch("page_change", {
                          from: "profitbalance",
                          to: "profitandloss1",
                          prop_data: {
                            principle_id: profitBalanceData.direct_income_id,
                            account_name: "Direct Income",
                          },
                          isNewTab: false,
                        });
                      }
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        direct_income_flag == true
                          ? this.setState({ direct_income_flag: false })
                          : this.setState({ direct_income_flag: true }, () => {
                              this.get_principle_id_on_click_and_key_expand(
                                profitBalanceData.direct_income_id
                                // "DI"
                              );
                            });
                      }}
                    >
                      Direct Income
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.direct_income).toFixed(2)}
                    </th>
                  </tr>
                  {direct_income_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {selfPageData.length > 0
                        ? selfPageData.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>CGST ON PURCHASE 9%</td>
                        <td className="text-end">1234</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr>
                    <th
                      colSpan={2}
                      // onClick={(e) => {
                      //   eventBus.dispatch("page_change", {
                      //     from: "profitbalance",
                      //     to: "profitandloss1",
                      //     prop_data: profitBalanceData.closing_stock_id,
                      //     isNewTab: false,
                      //   });
                      // }}
                    >
                      Closing Stock
                    </th>
                    <th className="border-end text-center">
                      {Math.abs(profitBalanceData.closing_stock).toFixed(2)}
                    </th>
                  </tr>

                  <tr>
                    <th colSpan={2}>Gross Loss c/f</th>
                    <th className="border-end text-center">
                      {Math.abs(grossLoss).toFixed(2)}
                    </th>
                  </tr>

                  <tr
                    style={{
                      background: "#F1F4F7",
                    }}
                  >
                    <th colSpan={2}></th>
                    <th className="tfoot_amount_style text-center">
                      {Math.abs(this.totalbalance()).toFixed(2)}
                    </th>
                  </tr>

                  <tr>
                    <th colSpan={2}>Gross Profit b/f</th>
                    <th className="border-end text-center">
                      {Math.abs(grossProfit).toFixed(2)}
                    </th>
                  </tr>

                  <tr
                    onDoubleClick={(e) => {
                      eventBus.dispatch("page_change", {
                        from: "profitbalance",
                        to: "profitandloss1",
                        prop_data: {
                          principle_id: profitBalanceData.indirect_income_id,
                          account_name: "Indirect Income",
                        },
                        isNewTab: false,
                      });
                    }}
                  >
                    <th
                      colSpan={2}
                      onClick={(e) => {
                        indirect_income_flag == true
                          ? this.setState({ indirect_income_flag: false })
                          : this.setState(
                              { indirect_income_flag: true },
                              () => {
                                this.get_principle_id_on_click_and_key_expand(
                                  profitBalanceData.indirect_income_id
                                  // "II"
                                );
                              }
                            );
                      }}
                    >
                      Indirect Income
                    </th>
                    <th className="border-end text-center">
                      {profitBalanceData.indirect_income}
                    </th>
                  </tr>
                  {indirect_income_flag != "" ? (
                    <div className="tbody_style ms-4">
                      {selfPageData.length > 0
                        ? selfPageData.map((v) => {
                            return (
                              <tr>
                                <td>{v.particular}</td>
                                <td className="text-end">
                                  {Math.abs(v.total_balance).toFixed(2)}
                                </td>
                                <td></td>
                              </tr>
                            );
                          })
                        : "None"}
                      {/* <tr>
                        <td>CGST ON PURCHASE 9%</td>
                        <td className="text-end">1234</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>PURCHASE COUNTER ERP</td>
                        <td className="text-end">9876</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>SGST ON PURCHASE 9%</td>
                        <td className="text-end">4567</td>
                        <td></td>
                      </tr> */}
                    </div>
                  ) : (
                    ""
                  )}

                  <tr>
                    <th colSpan={2}>Net Loss</th>
                    <th className="border-end text-center">
                      {Math.abs(netLoss).toFixed(2)}
                    </th>
                  </tr>

                  {Array.from(Array(9), (v) => {
                    return (
                      <tr>
                        <th colSpan={3} className="border-end">
                          &nbsp;
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      border: "1px solid #DEE4EB",
                      background: "#DDE2ED",
                    }}
                  >
                    <th colSpan={2} className="tfoot_title_style">
                      TOTAL
                    </th>
                    <th className="tfoot_amount_style text-center">
                      {Math.abs(this.totalbalanceprofit()).toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
