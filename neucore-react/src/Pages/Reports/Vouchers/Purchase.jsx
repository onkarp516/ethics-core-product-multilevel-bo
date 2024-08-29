import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { MyDatePicker, eventBus } from "@/helpers";
export default class Purchase extends Component {
  render() {
    return (
      <>
        <div className="report-form-style">
          <div className="p-3">
            <Table bordered hover responsive>
              <thead>
                <tr className="border-dark">
                  <th colSpan={4} className="text-center">
                    <h4>Compony Name</h4>{" "}
                  </th>
                </tr>

                <tr className="border-dark">
                  <th colSpan={4} className="text-center">
                    <h4>Purchase Register</h4>
                  </th>
                </tr>
                <tr className="border-dark">
                  <th colSpan={4}>
                    <div className="justify-content-center d-flex">
                      PERIOD :
                      <MyDatePicker
                        name="start_date"
                        placeholderText="DD/MM/YYYY"
                        // id="start_date"
                        // dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        // onChange={(newDate) => {
                        //   console.log("Start Date is :", newDate);
                        //   this.setState({ startDate: newDate });
                        // }}
                        // selected={startDate}
                        // value={startDate}
                        // className="report-date-style"
                      />
                      TO
                      <MyDatePicker
                        name="end_date"
                        placeholderText="DD/MM/YYYY"
                        // id="end_date"
                        // dateFormat="dd/MM/yyyy"
                        // // maxDate={new Date()}
                        // onChange={(newDate) => {
                        //   console.log("End Date is :", newDate);
                        //   this.setState({ endDate: newDate }, () => {
                        //     this.get_profit_and_loss_ac_details_on_date_change_of_user();
                        //   });
                        // }}
                        // selected={endDate}
                        // value={endDate}
                        // className="report-date-style"
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
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    eventBus.dispatch("page_change", {
                      from: "purchase",
                      to: "purchase1",
                    });
                  }}
                >
                  <td>April</td>
                  <td className="text-center">1000</td>
                  <td className="text-center">0</td>
                  <td className="text-center">1000</td>
                </tr>
                <tr className="border-dark">
                  <td>May</td>
                  <td className="text-center">1000</td>
                  <td className="text-center">0</td>
                  <td className="text-center">2000</td>
                </tr>
                <tr className="border-dark">
                  <td>June</td>
                  <td className="text-center">3000</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>July</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>August</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>September</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>Octomber</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>November</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>December</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>January</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>February</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                <tr className="border-dark">
                  <td>March</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                  <td className="text-center">5000</td>
                </tr>
                {/* {Array.from(Array(8), (v) => {
                  return (
                    <tr className="border-dark">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  );
                })} */}
              </tbody>
              <tfoot>
                <tr className="border-dark" style={{ background: "#dde2ed" }}>
                  <th className="text-center">Total</th>
                  <th className="text-center">5000</th>
                  <th className="text-center">0</th>
                  <th className="text-center">5000</th>
                </tr>
                <tr className="border-dark">
                  <td className="text-center">Average Amount</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </>
    );
  }
}
