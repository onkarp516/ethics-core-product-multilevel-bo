import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { get_profit_and_loss_ac_details } from "@/services/api_functions";

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
    };
  }
  get_profit_and_loss_ac_details = () => {
    get_profit_and_loss_ac_details()
      .then((response) => {
        if (response.data.responseStatus === 200) {
          this.setState({ profitBalanceData: response.data }, () => {
            this.grosstotalbalance();
            // this.nettotalbalance();
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.get_profit_and_loss_ac_details();
    }
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
      Math.abs(profitBalanceData.indirect_income) +
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
    console.log("Gross", grossbalance);
  };
  //This is for Profit And Loss Account Start

  totalcalculationdrsideprofit = () => {
    let { profitBalanceData, grossLoss } = this.state;
    console.log(
      "profitBalanceData.indirect_expenses " +
      profitBalanceData.indirect_expenses
    );
    let drtotal = grossLoss + Math.abs(profitBalanceData.indirect_expenses);
    console.log("Net Debit Side Total:", drtotal);
    return drtotal;
  };
  totalcalculationcrsideprofit = () => {
    let { profitBalanceData, grossProfit } = this.state;
    let crtotal = grossProfit + Math.abs(profitBalanceData.indirect_income);
    console.log("Net Credit Side Total:", crtotal);
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
    // let drtotal = this.totalcalculationdrsideprofit();
    let { profitBalanceData, grossLoss } = this.state;
    console.log(
      "profitBalanceData.indirect_expenses " +
      profitBalanceData.indirect_expenses +
      " <<<grossLoss" +
      grossLoss
    );
    let drtotal = grossLoss + Math.abs(profitBalanceData.indirect_expenses);
    console.log("profit Debit Side Total", drtotal);
    let crtotal = this.totalcalculationcrsideprofit();
    console.log("profit credit Side Total", crtotal);
    let netbalance = crtotal - drtotal;
    console.log("Net Balance", netbalance);
    if (netbalance > 0) {
      this.setState({ netProfit: Math.abs(netbalance) });
    } else {
      this.setState({ netLoss: Math.abs(netbalance) });
    }
  };
  render() {
    let { profitBalanceData, grossProfit, grossLoss, netProfit, netLoss } =
      this.state;
    return (
      <div className="report-form-style">
        {/* {JSON.stringify(profitBalanceData)} */}
        <div style={{ background: '#E6F2F8' }}>
          <h4 className="mb-0 ps-3 py-3 companyName">Demo Company</h4>
        </div>
        <hr className="my-0" />
        <div style={{ background: '#E6F2F8' }} className="py-3">
          {/* <th colSpan={4}> */}
          <div className="ps-3 d-flex fromTo">
            PERIOD :
            <MyDatePicker
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
            />
            TO
            <MyDatePicker
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
            />
          </div>
          {/* </th> */}
        </div>
        <Table responsive className="mt-2">
          <thead>
            <tr style={{ border: '1px solid #0000001F' }} className="drcr">
              <th colSpan={2} style={{
                background: "#F9CFD1"
              }}> Dr.</th>
              {/* <td></td> */}
              < th colSpan={2} style={{
                background: "#C3F0CA"
              }}> Cr.</th>
              {/* <td></td> */}
            </tr>
            <tr className="thead_style">
              <th style={{ borderBottom: '2px solid transparent' }}>Particulars</th>
              <th className="border-end" style={{ width: "25%", borderBottom: '2px solid transparent' }}>
                Amount (INR)
              </th>
              <th style={{ borderBottom: '2px solid transparent' }}>Particulars</th>
              <th style={{ width: "25%", borderBottom: '2px solid transparent' }}>
                Amount(INR)
              </th>
            </tr>
          </thead>
          <tbody className="tbody_style">
            <tr
              style={{ border: '1px solid #DEE4EB' }}
            // onClick={(e) => {
            //   e.preventDefault();
            //   eventBus.dispatch("page_change", "profitandloss1");
            // }}
            >
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.opening_stock_id,
                    isNewTab: false,
                  });
                }}
              >
                Opening Stock
              </td>
              <td className="border-end">
                {profitBalanceData.opening_stock}
              </td>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.sales_accounts_id,
                    isNewTab: false,
                  });
                }}
              >
                Sales Accounts
              </td>
              <td  >
                {profitBalanceData.sales_accounts}
              </td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.purchase_account_id,
                    isNewTab: false,
                  });
                }}
              >
                Purchase Accounts
              </td>
              <td className="border-end">
                {Math.abs(profitBalanceData.purchase_account)}
              </td>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.direct_income_id,
                    isNewTab: false,
                  });
                }}
              >
                Direct Income
              </td>
              <td  >
                {profitBalanceData.direct_income}
              </td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td></td>
              <td className="border-end"></td>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.closing_stock_id,
                    isNewTab: false,
                  });
                }}
              >
                Closing Stock
              </td>
              <td  >
                {profitBalanceData.closing_stock}
              </td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.direct_expenses_id,
                    isNewTab: false,
                  });
                }}
              >
                Direct Expenses
              </td>
              <td className="border-end">
                {profitBalanceData.direct_expenses}
              </td>
              <td></td>
              <td></td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td>Gross Profit c/f</td>
              <td className="border-end">{grossProfit}</td>
              <td>Gross Loss c/f</td>
              <td  >{grossLoss}</td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB', background: '#F1F4F7' }}>
              <th  ></th>
              <th className="border-end tfoot_amount_style">{this.totalbalance()}</th>
              <th  ></th>
              <th className="tfoot_amount_style">{this.totalbalance()}</th>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td>Gross Loss b/f</td>
              <td className="border-end">{grossLoss}</td>
              <td>Gross Profit b/f</td>
              <td  >{grossProfit}</td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.indirect_expenses_id,
                    isNewTab: false,
                  });
                }}
              >
                Indirect Expenses
              </td>
              <td className="border-end">
                {Math.abs(profitBalanceData.indirect_expenses)}
              </td>
              <td
                onClick={(e) => {
                  eventBus.dispatch("page_change", {
                    from: "profitbalance",
                    to: "profitandloss1",
                    prop_data: profitBalanceData.indirect_income_id,
                    isNewTab: false,
                  });
                }}
              >
                Indirect Income
              </td>
              <td  >
                {profitBalanceData.indirect_income}
              </td>
            </tr>

            <tr style={{ border: '1px solid #DEE4EB' }}>
              <td>Net Profit</td>
              <td className="border-end">{netProfit}</td>
              <td>Net Loss</td>
              <td  >{netLoss}</td>
            </tr>

            {Array.from(Array(10), (v) => {
              return (
                <tr>
                  <td colSpan={2} className="border-end">&nbsp;</td>
                  <td colSpan={2}>
                    &nbsp;
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr style={{ border: '1px solid #DEE4EB', background: "#DDE2ED" }}>
              <th className="tfoot_title_style">TOTAL</th>
              <th style={{ borderRight: '1px solid #C7CFE0' }} className="tfoot_amount_style">{this.totalbalanceprofit()}</th>
              <th className="tfoot_title_style">TOTAL</th>
              <th className="tfoot_amount_style">{this.totalbalanceprofit()}</th>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }
}
