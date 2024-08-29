import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";

import {
  MyDatePicker,
  eventBus,
  ShowNotification,
  AuthenticationCheck,
} from "@/helpers";
import {
  get_balance_sheet_ac_details,
  get_balance_ac_details_step1,
} from "@/services/api_functions";

export default class BalanceSheet extends Component {
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
  componentDidMount() {
    if (AuthenticationCheck()) {
      let { profitBalanceData } = this.state;
      this.get_balance_sheet_ac_details_show();
      console.log("Self Page Principle Id", this.state.self_Page_principle_id);
      // this.totalcalculationPL();
      mousetrap.bindGlobal("shift+e", this.expandParticularList);
    }
  }
  grosstotalbalance = () => {
    let litotal = this.totalcalculationliside();
    let astotal = this.totalcalculationasside();
    return litotal;
    return astotal;
  };

  totalcalculationliside = () => {
    let { profitBalanceData } = this.state;
    let litotal =
      Math.abs(profitBalanceData.capital_account) +
      Math.abs(profitBalanceData.loans) +
      Math.abs(profitBalanceData.current_liabilities);
    return litotal;
  };
  totalcalculationasside = () => {
    let { profitBalanceData } = this.state;
    let astotal =
      Math.abs(profitBalanceData.fixed_assets) +
      Math.abs(profitBalanceData.investments) +
      Math.abs(profitBalanceData.current_assets);
    return astotal;
  };

  totalcalculationLiPL = () => {
    let { profitBalanceData } = this.state;
    let plLa = 0.0;
    if (profitBalanceData.salesAC > profitBalanceData.purchaseAC) {
      let plLaPatotal =
        Math.abs(profitBalanceData.salesAC) -
        Math.abs(profitBalanceData.purchaseAC);
      return plLaPatotal;
    }
    return plLa;
  };
  totalcalculationAsPL = () => {
    let { profitBalanceData } = this.state;
    let plAs = 0.0;
    if (profitBalanceData.salesAC < profitBalanceData.purchaseAC) {
      let plAstotal =
        Math.abs(profitBalanceData.purchaseAC) -
        Math.abs(profitBalanceData.salesAC);
      return plAstotal;
    }
    return plAs;
  };

  get_balance_sheet_ac_details_on_date_change_of_user = () => {
    let { startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    get_balance_sheet_ac_details(data)
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
  get_balance_sheet_ac_details_show = () => {
    get_balance_sheet_ac_details()
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
          console.log("profitBalanceData--->", this.state.profitBalanceData);
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  get_profit_and_loss_ac_details_on_date_change_of_user = () => {
    let { startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    let data = new FormData();
    data.append("start_date", startDatecon);
    data.append("end_date", endDatecon);
    get_balance_sheet_ac_details(data)
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

  get_principle_id_on_click_and_key_expand = (v, key) => {
    let data = new FormData();
    // console.log("edit_data :", edit_data);
    data.append("principle_id", v);
    get_balance_ac_details_step1(data)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          let result = response.data.response;
          // console.log("result :", result);
          key == "CL"
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
        <div className="p-3">
          <Table bordered hover responsive>
            <thead>
              <tr className="border-dark">
                <th colSpan={4} className="text-center">
                  <h4>MY COMPANY NAME</h4>{" "}
                </th>
              </tr>
              <tr className="border-dark">
                <th colSpan={4}>
                  <div className="justify-content-center d-flex">
                    PERIOD : as at
                    {/* <MyDatePicker
                      name="applicable_date"
                      placeholderText="DD/MM/YYYY"
                      id="applicable_date"
                      dateFormat="dd/MM/yyyy"
                      // onChange={(date) => {
                      //     setFieldValue("applicable_date", date);
                      // }}
                      // selected={values.applicable_date}
                      maxDate={new Date()}
                      className="report-date-style"
                    /> */}
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

              <tr className="border-dark" style={{ background: "#d6fcdc" }}>
                <th className="text-center">LIABILITIES</th>
                <th className="text-center" style={{ width: "10%" }}>
                  Amount(INR)
                </th>
                <th className="text-center">ASSETS</th>
                <th className="text-center" style={{ width: "10%" }}>
                  Amount(INR)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="border-dark"
                onClick={(e) => {
                  e.preventDefault();
                  eventBus.dispatch("page_change", "balancesheet1");
                }}
              >
                <td>Capital Account</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.capital_account).toFixed(2)}
                </td>
                <td>Fixed Assets</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.fixed_assets).toFixed(2)}
                </td>
              </tr>
              <tr className="border-dark">
                <td>Loans(Liabilities)</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.loans).toFixed(2)}
                </td>
                <td>Investments</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.investments).toFixed(2)}
                </td>
              </tr>

              <tr
                className="border-dark"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  eventBus.dispatch("page_change", {
                    from: "balancesheet",
                    to: "balancesheet1",
                    prop_data: {
                      principle_id: profitBalanceData.current_liabilities_id,
                      account_name: "Current Liabilities",
                    },
                    isNewTab: false,
                  });
                }}
              >
                <td
                  // colSpan={2}
                  onClick={(e) => {
                    purchase_flag == true
                      ? this.setState({ purchase_flag: false })
                      : this.setState({ purchase_flag: true }, () => {
                          this.get_principle_id_on_click_and_key_expand(
                            profitBalanceData.current_liabilities_id,
                            "CL"
                          );
                        });
                  }}
                >
                  Current Liabilities
                </td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.current_liabilities).toFixed(2)}
                </td>
                <td>Current Assets</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(profitBalanceData.current_assets).toFixed(2)}
                </td>
              </tr>
              {purchase_flag != "" ? (
                <div className="border-dark">
                  {purchase_account_data.length > 0
                    ? purchase_account_data.map((v) => {
                        return (
                          <tr>
                            <td>{v.particular}</td>
                            <td className="border-dark">
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
              <tr className="border-dark">
                <td>Profit & Loss A/c</td>
                <td className="text-center">
                  {" "}
                  {Math.abs(this.totalcalculationLiPL()).toFixed(2)}
                </td>
                <td></td>
                <td className="text-center">
                  {" "}
                  {Math.abs(this.totalcalculationAsPL()).toFixed(2)}
                </td>
              </tr>
              <tr className="border-dark">
                <td>Opening Balance</td>
                <td className="text-center"></td>
                <td></td>
                <td className="text-center"></td>
              </tr>
              <tr className="border-dark">
                <td>Current Period</td>
                <td className="text-center"></td>
                <td></td>
                <td className="text-center"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-dark" style={{ background: "#dde2ed" }}>
                <th className="text-center">TOTAL</th>
                <th className="text-center">
                  {" "}
                  {Math.abs(this.totalcalculationliside()).toFixed(2)}
                </th>
                <th className="text-center">TOTAL</th>
                <th className="text-center">
                  {Math.abs(this.totalcalculationasside()).toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
